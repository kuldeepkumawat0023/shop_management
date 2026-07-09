import { useAppSelector, useAppDispatch } from '../store/hooks/redux';
import { logout as logoutAction, setCredentials } from '../store/slices/authSlice';
import { authService } from '../lib/services/auth.services';
import { AuthUser } from '../lib/apiClient';

/**
 * Custom hook for accessing authentication state and actions
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isInitialized, globalEnv } = useAppSelector((state) => state.auth);

  const login = (user: AuthUser, token: string, expiresAt?: number) => {
    dispatch(setCredentials({ user, token, expiresAt }));
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout API failed, forcing local logout:', error);
    } finally {
      dispatch(logoutAction());
      window.location.href = '/login'; // Force redirect and clear state
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isInitialized,
    globalEnv,
    login,
    logout,
    role: user?.role || 'staff',
    shopId: user?.shopId || null,
  };
};
