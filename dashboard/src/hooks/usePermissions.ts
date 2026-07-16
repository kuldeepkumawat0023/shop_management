import { useAuth } from './useAuth';
import { PERMISSIONS } from '../lib/constants/permissions';

/**
 * Hook to check Role-Based Access Control (RBAC) permissions.
 */
export const usePermissions = () => {
  const { user, role } = useAuth();

  /**
   * Checks if the current user has the required permission.
   * Super Admins and Shop Owners have ALL permissions by default.
   */
  const hasPermission = (requiredPermission: string): boolean => {
    // Admins and Owners override all permission checks
    if (role === 'super_admin' || role === 'shop_owner') {
      return true;
    }

    // If there is no custom role array, fallback to default role checks
    // Ideally, user object should have a `permissions` array injected by backend
    const userPermissions: string[] = (user as any)?.permissions || [];
    
    if (userPermissions.includes(PERMISSIONS.ALL) || userPermissions.includes('all') || userPermissions.includes('*')) {
      return true;
    }

    if (userPermissions.includes(requiredPermission)) {
      return true;
    }

    const [moduleName] = requiredPermission.split('.');
    if (moduleName && userPermissions.includes(`${moduleName}.*`)) {
      return true;
    }

    return false;
  };

  /**
   * Checks if user has ANY of the provided permissions
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some((permission) => hasPermission(permission));
  };

  /**
   * Checks if user has ALL of the provided permissions
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every((permission) => hasPermission(permission));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
};
