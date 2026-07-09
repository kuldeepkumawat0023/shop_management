"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { authService } from '@/lib/services/auth.services';
import toast from 'react-hot-toast';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  ShoppingBag,
  Sparkles,
  Mail,
  ArrowRight,
  ArrowLeft,
  BrainCircuit
} from 'lucide-react';
import AuthSplitLayout from './AuthSplitLayout';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }

    setIsLoading(true);
    let token = null;

    if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
      const toastId = toast.loading('Verifying reCAPTCHA...');
      try {
        token = await recaptchaRef.current?.executeAsync();
      } catch (err) {
        toast.error('reCAPTCHA failed', { id: toastId });
        setIsLoading(false);
        return;
      }
      if (!token) {
        toast.error('Please complete the reCAPTCHA', { id: toastId });
        setIsLoading(false);
        return;
      }
      toast.dismiss(toastId);
    }

    const toastId = toast.loading('Sending reset link...');

    try {
      // In authController, forgotPassword doesn't strictly check captcha yet, but we send it if we add it later.
      const response = await authService.forgotPassword(email);
      if (response.success) {
        setSuccess(true);
        toast.success('Reset link sent to your email!', { id: toastId });
      } else {
        toast.error(response.message || 'Failed to send reset link', { id: toastId });
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'An error occurred';
      toast.error(message, { id: toastId });
      recaptchaRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthSplitLayout>
      <section aria-labelledby="forgot-heading" className="w-full">
        <h1 className="sr-only">Forgot Password</h1>

        <header className="mb-6 text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="text-primary w-8 h-8" aria-hidden="true" />
            <span className="block text-2xl font-bold leading-none tracking-tight text-gradient-primary">
              SmartShop
            </span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="text-primary w-3 h-3" aria-hidden="true" />
            <span className="text-[10px] text-primary tracking-widest uppercase font-bold">
              Recovery
            </span>
          </div>
          <h2 className="text-xl font-bold text-on-surface mt-4 mb-2">Reset Password</h2>
          <p id="forgot-heading" className="text-on-surface-variant text-sm">
            Enter your email to receive a password reset link.
          </p>
        </header>

        {success ? (
          <div className="text-center space-y-6">
            <div className="p-4 bg-success/10 border border-success/20 rounded-xl">
              <p className="text-success font-medium text-sm">
                We've sent a password reset link to <span className="font-bold">{email}</span>. Please check your inbox.
              </p>
            </div>
            <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Forgot password form">
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest" htmlFor="email">
                EMAIL ADDRESS <span className="text-error">*</span>
              </label>
              <div className="relative">
                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors ${error ? 'text-error' : 'text-primary/70'}`} aria-hidden="true" />
                <input
                  className={`w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-0 transition-all ${error ? '!border-error !ring-error/10' : ''}`}
                  id="email" name="email" type="email" autoComplete="email" placeholder="admin@smartshop.com"
                  aria-invalid={!!error}
                  value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} required
                />
              </div>
              {error && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{error}</p>}
            </div>

            {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
              <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} badge="bottomleft" />
            )}

            <button
              disabled={isLoading}
              className="w-full gradient-button text-white font-bold py-2.5 px-4 rounded-xl shadow-md hover:opacity-90 active:scale-[0.98] transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              type="submit"
            >
              {isLoading ? 'Sending Link...' : (
                <>
                  Send Reset Link
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="mt-3 flex items-center justify-center gap-2 px-4 py-1.5 bg-primary/5 backdrop-blur-sm rounded-lg border border-primary/10">
              <BrainCircuit className="text-primary w-4 h-4" aria-hidden="true" />
              <p className="text-[11px] leading-tight text-on-surface-variant italic">
                <span className="font-semibold text-primary">Smart Insight:</span> Ensure to check your spam folder.
              </p>
            </div>
            
            <footer className="mt-6 text-center">
              <Link href="/login" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </footer>
          </form>
        )}
      </section>
    </AuthSplitLayout>
  );
};

export default ForgotPasswordForm;
