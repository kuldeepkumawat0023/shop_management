'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export type ShopRole = 'super_admin' | 'shop_owner' | 'manager' | 'staff';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ShopRole[];
}

/**
 * 🛡️ RoleGuard
 * SEO + Accessibility Optimized
 * Restricts access based on user role in the POS system.
 */
const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) return null;

  const userRole = (user?.role as ShopRole) || 'staff';

  if (!user || !allowedRoles.includes(userRole)) {
    return (
      <section
        className="h-screen w-full flex flex-col items-center justify-center bg-background p-6 text-center"
        aria-labelledby="access-denied-heading"
      >
        {/* SEO Hidden H1 */}
        <h1 className="sr-only">Access Denied - Unauthorized User Access</h1>

        <div
          className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6"
          aria-hidden="true"
        >
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Visible Heading */}
        <h2
          id="access-denied-heading"
          className="text-2xl font-bold text-foreground mb-2"
        >
          Access Denied
        </h2>

        {/* SEO Description */}
        <p className="sr-only">
          You do not have permission to access this protected POS page. Please
          log in with an authorized account or contact the administrator for access.
        </p>

        <p className="text-muted-foreground max-w-md mb-8">
          You don&apos;t have the necessary permissions to view this sanctuary.
          Please contact your administrator if you believe this is an error, or try
          logging in again to refresh your session.
        </p>

        {/* Action Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          aria-label="Navigation actions"
        >
          <button
            type="button"
            aria-label="Go to login page"
            onClick={() => (window.location.href = '/login')}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Back to Login
          </button>

          <button
            type="button"
            aria-label="Go to dashboard"
            onClick={() => (window.location.href = '/dashboard')}
            className="px-8 py-3 bg-secondary text-secondary-foreground rounded-xl font-bold hover:bg-secondary/80 transition-all border border-border"
          >
            Back to Dashboard
          </button>
        </div>
      </section>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
