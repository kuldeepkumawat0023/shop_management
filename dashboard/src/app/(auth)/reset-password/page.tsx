import React, { Suspense } from 'react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-on-surface">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
