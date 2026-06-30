import { useAppSelector, useAppDispatch } from '../store/hooks/redux';
import { logout as logoutAction } from '../store/slices/authSlice';
import { authService } from '../lib/services/auth.services';

/**
 * Custom hook for accessing authentication state and actions
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);

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
    logout,
    role: user?.role || 'staff',
    shopId: user?.shopId || null,
  };
};
