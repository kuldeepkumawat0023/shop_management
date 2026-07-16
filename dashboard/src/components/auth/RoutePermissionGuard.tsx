'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import RoleGuard from '@/components/auth/RoleGuard';

const routePrefixes = [
  { prefix: '/pos', permission: 'pos.view' },
  { prefix: '/inventory', permission: 'products.view' },
  { prefix: '/products', permission: 'products.view' },
  { prefix: '/categories', permission: 'categories.view' },
  { prefix: '/brands', permission: 'brands.view' },
  { prefix: '/manufacturing/productions', permission: 'productions.view' },
  { prefix: '/manufacturing/recipes', permission: 'recipes.view' },
  { prefix: '/sales', permission: 'sales.view' },
  { prefix: '/purchases', permission: 'purchases.view' },
  { prefix: '/expenses', permission: 'expenses.view' },
  { prefix: '/customers', permission: 'customers.view' },
  { prefix: '/suppliers', permission: 'suppliers.view' },
  { prefix: '/team', permission: 'team.view' },
  { prefix: '/users', permission: 'users.view' },
  { prefix: '/payroll', permission: 'payroll.view' },
  { prefix: '/payments', permission: 'payments.view' },
  { prefix: '/reports', permission: 'reports.view' },
  { prefix: '/settings/roles', permission: 'roles.view' },
  { prefix: '/settings', permission: 'settings.view' },
].sort((a, b) => b.prefix.length - a.prefix.length); // Sort by length descending to match most specific path first

export default function RoutePermissionGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If we're exactly at root dashboard, check dashboard.view
  if (pathname === '/' || pathname === '/dashboard') {
    return <RoleGuard permission="dashboard.view">{children}</RoleGuard>;
  }

  // Find the longest matching prefix for the current path
  const matchedRoute = routePrefixes.find(route => pathname.startsWith(route.prefix));

  if (matchedRoute) {
    return <RoleGuard permission={matchedRoute.permission}>{children}</RoleGuard>;
  }

  // If no specific permission matched, allow access (or could default to block, but allow is safer for random sub-pages)
  return <>{children}</>;
}
