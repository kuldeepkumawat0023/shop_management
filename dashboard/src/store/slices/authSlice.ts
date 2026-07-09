import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { AuthUser, TOKEN_KEY, USER_KEY } from '@/lib/apiClient';

/**
 * 🔒 Advanced Auth Slice
 * Features: Hydration Guard, Persistence, Cross-Tab Sync
 * Token expiry is now synced with backend JWT_EXPIRES_IN (30d)
 */

const TOKEN_EXPIRY_KEY = 'shop_token_expiry';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean; // Prevents Next.js Hydration Mismatch
  globalEnv: Record<string, string>;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialized: false,
  globalEnv: {},
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Client-side initialization: Reads storage only on the browser.
     * Also checks token expiry before restoring session.
     */
    initializeAuth: (state) => {
      if (typeof window === 'undefined') return;

      const token = Cookies.get(TOKEN_KEY);
      const userRaw = localStorage.getItem(USER_KEY);
      const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

      try {
        // ✅ Check if token is expired BEFORE restoring session
        if (expiry && Date.now() > parseInt(expiry)) {
          // Token expired — silently clear everything
          localStorage.removeItem(USER_KEY);
          localStorage.removeItem(TOKEN_EXPIRY_KEY);
          Cookies.remove(TOKEN_KEY, { path: '/' });
          Cookies.remove('shop_user_role', { path: '/' });
          state.isInitialized = true;
          return;
        }

        if (token && userRaw) {
          const user = JSON.parse(userRaw);
          state.token = token;
          state.user = user;
          state.isAuthenticated = true;

          // Re-sync cookie with remaining validity (30d from backend)
          Cookies.set(TOKEN_KEY, token, {
            expires: 30, path: '/', sameSite: 'strict', secure: process.env.NEXT_PUBLIC_SECURE_COOKIES === 'true'
          });
          Cookies.set('shop_user_role', user.role, {
            expires: 30, path: '/', sameSite: 'strict', secure: process.env.NEXT_PUBLIC_SECURE_COOKIES === 'true'
          });
        }
      } catch (error) {
        console.error('Auth sync failed:', error);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
        Cookies.remove(TOKEN_KEY);
        Cookies.remove('shop_user_role');
      } finally {
        state.isInitialized = true;
      }
    },

    /**
     * Store credentials after Login/Register
     * Now accepts expiresAt from backend to sync expiry exactly
     */
    setCredentials: (state, action: PayloadAction<{ user: AuthUser; token: string; expiresAt?: number }>) => {
      const { user, token, expiresAt } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      if (typeof window !== 'undefined') {
        // Strip sensitive PII before saving to localStorage
        const normalizedCompanyId = typeof user.shopId === 'object' && user.shopId !== null
          ? (user.shopId as any)._id
          : user.shopId; // ponytail: adapted companyId to shopId for SmartShop

        const minifiedUser = {
          _id: user._id,
          role: user.role,
          email: user.email,
          fullname: user.fullname,
          profilePhoto: user.profilePhoto,
          shopId: normalizedCompanyId
        };
        localStorage.setItem(USER_KEY, JSON.stringify(minifiedUser));


        // ✅ Store exact expiry from backend (or default 30 days)
        const expiry = expiresAt || (Date.now() + 30 * 24 * 60 * 60 * 1000);
        localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiry));

        // ✅ Cookie expiry synced with backend JWT (30 days, not 365)
        const cookieExpireDays = Math.max(1, Math.round((expiry - Date.now()) / (1000 * 60 * 60 * 24)));
        Cookies.set(TOKEN_KEY, token, {
          expires: cookieExpireDays, path: '/', sameSite: 'strict', secure: process.env.NEXT_PUBLIC_SECURE_COOKIES === 'true'
        });
        Cookies.set('shop_user_role', user.role, {
          expires: cookieExpireDays, path: '/', sameSite: 'strict', secure: process.env.NEXT_PUBLIC_SECURE_COOKIES === 'true'
        });
      }
    },

    /**
     * Partial update (e.g. Profile Photo, Skills)
     */
    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        let payloadShopId = action.payload.shopId; // ponytail: adapted companyId to shopId
        if (typeof payloadShopId === 'object' && payloadShopId !== null) {
          payloadShopId = (payloadShopId as any)._id;
        }

        state.user = {
          ...state.user,
          ...action.payload,
          ...(payloadShopId !== undefined ? { shopId: payloadShopId } : {})
        };

        if (typeof window !== 'undefined') {
          const normalizedShopId = typeof state.user.shopId === 'object' && state.user.shopId !== null
            ? (state.user.shopId as any)._id
            : state.user.shopId;

          const minifiedUser = {
            _id: state.user._id,
            role: state.user.role,
            email: state.user.email,
            fullname: state.user.fullname,
            profilePhoto: state.user.profilePhoto,
            shopId: normalizedShopId
          };
          localStorage.setItem(USER_KEY, JSON.stringify(minifiedUser));

          // Sync role to cookie if updated
          if (action.payload.role) {
            Cookies.set('shop_user_role', action.payload.role, {
              expires: 30, path: '/', sameSite: 'strict', secure: process.env.NEXT_PUBLIC_SECURE_COOKIES === 'true'
            });
          }
        }
      }
    },

    /**
     * Deep clean storage on Logout
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      if (typeof window !== 'undefined') {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY); // ✅ Also clear expiry
        Cookies.remove(TOKEN_KEY, {
          path: '/',
          sameSite: 'strict',
          secure: process.env.NEXT_PUBLIC_SECURE_COOKIES === 'true'
        });
        Cookies.remove('shop_user_role', {
          path: '/',
          sameSite: 'strict',
          secure: process.env.NEXT_PUBLIC_SECURE_COOKIES === 'true'
        });
      }
    },

    setGlobalEnv: (state, action: PayloadAction<Record<string, string>>) => {
      state.globalEnv = action.payload;
      if (typeof window !== 'undefined' && action.payload.NEXT_PUBLIC_SECURE_COOKIES) {
        localStorage.setItem('shop_globalEnv_secure_cookies', action.payload.NEXT_PUBLIC_SECURE_COOKIES);
      }
    }
  },
});

export const { initializeAuth, setCredentials, updateUser, logout, setGlobalEnv } = authSlice.actions;
export default authSlice.reducer;
