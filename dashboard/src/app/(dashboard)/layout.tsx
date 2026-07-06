import React from 'react';
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';
// import AuthGuard from '@/components/auth/AuthGuard';

export default function RootDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <AuthGuard>
    <DashboardLayout>
      {children}
    </DashboardLayout>
    // </AuthGuard>
  );
}
