'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/services/auth.services';
import AuthSplitLayout from './AuthSplitLayout';
import { Button } from '@/components/common/Button';
import { KeyRound, Key, Mail, Hash, Loader2, Lock, LockKeyhole, ArrowLeft } from 'lucide-react';
import { resetPasswordSchema } from '@/utils/validations';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  
  const [email, setEmail] = useState(emailParam || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);


  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = resetPasswordSchema.safeParse({ newPassword, confirmPassword });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authService.resetPassword({ 
        email, 
        newPassword, 
        confirmPassword 
      });

      if (response.success) {
        setSuccess('Password reset successfully!');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthSplitLayout>
      <div className="w-full">
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Key className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-on-surface mb-2">
          Set New Password
        </h2>
        <p className="text-on-surface-variant text-sm px-4">
          Create a strong, new password for your account
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-success/10 border border-success/20 rounded-lg text-success text-sm text-center">
          {success}
        </div>
      )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest" htmlFor="newPassword">NEW PASSWORD / नया पासवर्ड <span className="text-error">*</span></label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/80 w-5 h-5 z-10 pointer-events-none" />
              <input
                id="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="glass-input w-full pl-10 pr-4 py-2.5 text-on-surface"
                placeholder="•••••••• / नया पासवर्ड"
                maxLength={50}
              />
            </div>
            <p className="text-[10px] text-on-surface-variant/70 mt-1 px-1">Min 8 chars, 1 uppercase, 1 lowercase, 1 number</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest" htmlFor="confirmPassword">CONFIRM PASSWORD / पासवर्ड की पुष्टि करें <span className="text-error">*</span></label>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/80 w-5 h-5 z-10 pointer-events-none" />
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="glass-input w-full pl-10 pr-4 py-2.5 text-on-surface"
                placeholder="•••••••• / पासवर्ड की पुष्टि करें"
                maxLength={50}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            variant="gradient" 
            className="w-full mt-4"
            disabled={isLoading || !newPassword || !confirmPassword}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Resetting...
              </span>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>

      <div className="mt-6 text-center text-sm">
        <Link href="/login" className="font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
      </div>
    </AuthSplitLayout>
  );
}
