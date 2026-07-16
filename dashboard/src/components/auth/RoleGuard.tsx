'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export type ShopRole = 'super_admin' | 'shop_owner' | 'manager' | 'staff' | string;

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: ShopRole[];
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
}

/**
 * 🛡️ RoleGuard
 * Restricts access based on user role or granular permissions in the POS system.
 */
const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles, 
  permission, 
  permissions, 
  requireAll = false 
}) => {
  const { user, isInitialized } = useAuth();
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  if (!isInitialized) return null;

  const userRole = (user?.role as ShopRole) || 'staff';

  let isAuthorized = true;

  // 1. Role Check
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(userRole)) {
      isAuthorized = false;
    }
  }

  // 2. Permission Check
  if (isAuthorized && user) {
    if (permission) {
      isAuthorized = hasPermission(permission);
    } else if (permissions && permissions.length > 0) {
      isAuthorized = requireAll 
        ? hasAllPermissions(permissions) 
        : hasAnyPermission(permissions);
    }
  }

  if (!user || !isAuthorized) {
    return (
      <section
        className="h-full min-h-[70vh] w-full flex flex-col items-center justify-center bg-transparent p-6 text-center"
        aria-labelledby="access-denied-heading"
      >
        <h1 className="sr-only">Access Denied - Unauthorized User Access</h1>

        <div
          className="w-24 h-24 rounded-full bg-error/10 flex items-center justify-center text-error mb-6 border border-error/20 shadow-lg shadow-error/5"
          aria-hidden="true"
        >
          <ShieldAlert className="w-12 h-12" />
        </div>

        <h2
          id="access-denied-heading"
          className="text-3xl font-black text-on-surface tracking-tight mb-3"
        >
          Access Denied
        </h2>

        <p className="text-on-surface-variant max-w-md mb-8 leading-relaxed">
          You don&apos;t have the necessary permissions to view this sanctuary.
          Please contact your administrator if you believe this is an error, or try
          logging in again to refresh your session.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          aria-label="Navigation actions"
        >
          <Link href="/dashboard" className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all">
            Back to Dashboard
          </Link>
        </div>
      </section>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
