'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/services/auth.services';
import { GlassCard } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { KeyRound, Key, Mail, Hash, Loader2, Lock, LockKeyhole, ArrowLeft } from 'lucide-react';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  
  const [email, setEmail] = useState(emailParam || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [step, setStep] = useState<'verify' | 'reset'>('verify');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.verifyOtp({ email, otp });
      if (response.success) {
        setSuccess('OTP verified successfully. Please enter your new password.');
        setStep('reset');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Invalid OTP');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
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
    <GlassCard className="p-8 w-full shadow-lg">
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          {step === 'verify' ? <KeyRound className="w-8 h-8" /> : <Key className="w-8 h-8" />}
        </div>
        <h2 className="text-2xl font-bold text-on-surface mb-2">
          {step === 'verify' ? 'Verify OTP' : 'Set New Password'}
        </h2>
        <p className="text-on-surface-variant text-sm px-4">
          {step === 'verify' 
            ? `We've sent a 6-digit code to ${email || 'your email'}` 
            : 'Create a strong, new password for your account'
          }
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

      {step === 'verify' ? (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          {!emailParam && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-on-surface" htmlFor="email">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/80 w-5 h-5 z-10 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full pl-10 pr-4 py-2.5 text-on-surface"
                  placeholder="admin@smartshop.com"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface" htmlFor="otp">6-Digit OTP</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/80 w-5 h-5 z-10 pointer-events-none" />
              <input
                id="otp"
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                className="glass-input w-full pl-10 pr-4 py-2.5 text-on-surface tracking-[0.5em] font-mono text-center"
                placeholder="000000"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            variant="gradient" 
            className="w-full mt-4"
            disabled={isLoading || !otp || !email}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </span>
            ) : (
              'Verify Code'
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface" htmlFor="newPassword">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/80 w-5 h-5 z-10 pointer-events-none" />
              <input
                id="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="glass-input w-full pl-10 pr-4 py-2.5 text-on-surface"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface" htmlFor="confirmPassword">Confirm Password</label>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/80 w-5 h-5 z-10 pointer-events-none" />
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="glass-input w-full pl-10 pr-4 py-2.5 text-on-surface"
                placeholder="••••••••"
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
      )}

      <div className="mt-6 text-center text-sm">
        <Link href="/login" className="font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
    </GlassCard>
  );
}
