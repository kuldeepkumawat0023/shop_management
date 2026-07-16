'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';

interface ActionGuardProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
}

/**
 * 🛡️ ActionGuard
 * Wraps inline elements like action buttons (Edit, Delete, Create) and hides them
 * if the user lacks the specified permission.
 * Unlike RoleGuard, this does NOT show an error screen. It simply returns null.
 */
const ActionGuard: React.FC<ActionGuardProps> = ({
  children,
  permission,
  permissions,
  requireAll = false,
}) => {
  const { user, isInitialized } = useAuth();
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  if (!isInitialized || !user) return null;

  let isAuthorized = true;

  if (permission) {
    isAuthorized = hasPermission(permission);
  } else if (permissions && permissions.length > 0) {
    isAuthorized = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default ActionGuard;
