import axios from 'axios';
import Cookies from 'js-cookie';

/**
 * 🚀 Advanced Shop Management POS API Client
 * Synced exactly with Node.js backend User.js and auth requirements.
 */

// ─── Storage Keys ────────────────────────────────────────────────────────────
export const TOKEN_KEY = 'shop_token';
export const USER_KEY = 'shop_user_data';

// ─── Synchronized Types (Shop Management Backend Model: User.js) ─────────────
export interface PersonalDetail {
  dob?: string;
  gender?: string;
}

export interface NotificationPreferences {
  stockAlerts?: boolean;
  payrollUpdates?: boolean;
  accountSecurity?: boolean;
}

export interface AuthUser {
  _id: string;
  fullname: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  profilePhoto?: string;
  personalDetail?: PersonalDetail;
  role: 'super_admin' | 'shop_owner' | 'manager' | 'staff';
  shopId?: string; // The default active shop
  assignedShops?: string[]; // Array of shop IDs they have access to
  customRoleId?: string;
  isActive: boolean;
  isOtpVerified: boolean;
  twoFactorEnabled: boolean;
  notificationPreferences?: NotificationPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

// ─── Base URL Configuration ──────────────────────────────────────────────────
export const getBackendBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
  return url.replace(/([^:]\/)\/+/g, "$1").replace(/\/$/, "");
};

export const getBackendHostUrl = () => {
  const baseUrl = getBackendBaseUrl();
  try {
    const url = new URL(baseUrl);
    return `${url.protocol}//${url.host}`;
  } catch (error) {
    return baseUrl.replace('/api/v1', '');
  }
};

const apiClient = axios.create({
  baseURL: getBackendBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Required for CSRF cookies to be sent and received
});

let csrfToken: string | null = null;
let isFetchingCsrf = false;
let csrfPromise: Promise<string> | null = null;

// Function to fetch CSRF token from backend
const fetchCsrfToken = async (): Promise<string> => {
  if (csrfToken) return csrfToken;
  if (isFetchingCsrf && csrfPromise) return csrfPromise;

  isFetchingCsrf = true;
  csrfPromise = axios.get(`${getBackendBaseUrl()}/csrf-token`, { withCredentials: true })
    .then(res => {
      csrfToken = res.data.csrfToken;
      isFetchingCsrf = false;
      return csrfToken as string;
    })
    .catch(err => {
      console.error('Failed to fetch CSRF token', err);
      isFetchingCsrf = false;
      return '';
    });

  return csrfPromise;
};

// ─── Request Interceptor (Security & Files) ──────────────────────────────────
apiClient.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      // 0. Inject CSRF Token for state-changing requests
      if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
        const token = await fetchCsrfToken();
        if (token) {
          config.headers['x-csrf-token'] = token;
        }
      }

      // 1. Dual-Storage Token Recovery
      const token = Cookies.get(TOKEN_KEY);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 2. Attach ShopID to queries for multi-tenancy support automatically
      const userRaw = localStorage.getItem(USER_KEY);
      if (userRaw) {
        const user = JSON.parse(userRaw);
        if (user.shopId) {
          if (config.method === 'get') {
            config.params = { ...config.params, shopId: user.shopId };
          } else if (config.data && !(config.data instanceof FormData)) {
             config.data = { ...config.data, shopId: user.shopId };
          }
        }
      }

      // 3. Automatic Multipart/Form-Data Handling (for Profile Photos/Documents)
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor (Anti-Crash & Auto-Logout) ─────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const resData = error.response?.data;
    
    // 1. Smart logout: Only logout when the token itself is expired/invalid
    const isDeactivated = error.response?.status === 403 && resData?.message?.toLowerCase().includes('deactivated');

    const isGenuineAuthFailure = error.response?.status === 401 && (
      resData?.message?.toLowerCase().includes('no longer exists') ||
      resData?.message?.toLowerCase().includes('jwt expired') ||
      resData?.message?.toLowerCase().includes('invalid signature') ||
      resData?.message?.toLowerCase().includes('invalid token') ||
      resData?.message?.toLowerCase().includes('not authorized')
    );

    if ((isGenuineAuthFailure || isDeactivated)) {
      if (typeof window !== 'undefined') {
        const cookieOptions: Cookies.CookieAttributes = {
          path: '/',
          sameSite: 'strict',
          secure: process.env.NEXT_PUBLIC_SECURE_COOKIES === 'true'
        };
        Cookies.remove(TOKEN_KEY, cookieOptions);
        Cookies.remove('user_role', cookieOptions);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('portal_token_expiry');

        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    // 2. Extract Backend Error Message (Prevents Generic "Axios Error")
    if (resData && resData.message) {
      error.message = resData.message;
    }

    return Promise.reject(error);
  }
);

export default apiClient;
