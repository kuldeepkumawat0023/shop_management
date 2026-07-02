'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth.services';
import { GlassCard } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { KeyRound, CheckCircle2, Mail, Loader2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordForm() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.forgotPassword({ email });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        setError(response.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard className="p-8 w-full shadow-lg">
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-on-surface mb-2">Forgot Password</h2>
        <p className="text-on-surface-variant text-sm">
          Enter your email address and we'll send you an OTP to reset your password.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm text-center">
          {error}
        </div>
      )}

      {success ? (
        <div className="mb-4 p-4 bg-success/10 border border-success/20 rounded-lg text-success text-center space-y-2 flex flex-col items-center">
          <CheckCircle2 className="w-10 h-10 mb-2" />
          <p className="font-semibold">OTP Sent Successfully!</p>
          <p className="text-sm">Redirecting you to the verification page...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button 
            type="submit" 
            variant="gradient" 
            className="w-full mt-4"
            disabled={isLoading || !email}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </span>
            ) : (
              'Send OTP'
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
