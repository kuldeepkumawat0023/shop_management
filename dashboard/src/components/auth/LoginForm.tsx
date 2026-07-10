"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/lib/services/auth.services';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  ShoppingBag,
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import AuthSplitLayout from './AuthSplitLayout';

/**
 * 🔒 Premium Login Form
 * SEO + Accessibility Optimized
 */
const LoginForm = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (tokenResponse.access_token) {
        const toastId = toast.loading('Verifying Google account...');
        try {
          const response = await authService.googleLogin(tokenResponse.access_token, 'accessToken');
          if (response.success) {
            login(response.data.user, response.data.token, response.data.expiresAt);
            toast.success('Welcome back!', { id: toastId });
            router.push('/');
          }
        } catch (error: any) {
          const status = error.response?.status;
          const errorMessage = status === 401 ? 'Invalid credentials' : status === 403 ? 'Account deactivated' : 'Verification failed';
          toast.error(errorMessage, { id: toastId });
        }
      }
    },
    onError: () => toast.error('Google Sign In Failed'),
  });

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const validate = (name: string, value: string) => {
    let error = '';

    if (!value) {
      error = 'Required';
    } else if (name === 'email') {
      const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
      if (!emailRegex.test(value)) {
        error = 'Invalid email';
      }
    } else if (name === 'password') {
      if (value.length < 6) {
        error = 'Min 6 characters required';
      }
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const finalValue = id === 'email' ? value.toLowerCase() : value;
    setFormData({ ...formData, [id]: finalValue });
    validate(id, finalValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = formData.email.trim().toLowerCase();
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const isEmailValid = normalizedEmail && emailRegex.test(normalizedEmail);
    const isPasswordValid = formData.password && formData.password.length >= 6;

    if (!isEmailValid || !isPasswordValid) {
      let emailError = '';
      if (!formData.email) {
        emailError = 'Required';
      } else if (!emailRegex.test(formData.email)) {
        emailError = 'Invalid email';
      }

      let passwordError = '';
      if (!formData.password) {
        passwordError = 'Required';
      } else if (formData.password.length < 6) {
        passwordError = 'Min 6 characters required';
      }

      setErrors({ email: emailError, password: passwordError });
      return toast.error('Please correct the errors');
    }

    setLoading(true);
    let token = null;

    if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
      const toastId = toast.loading('Verifying reCAPTCHA...');
      try {
        token = await recaptchaRef.current?.executeAsync();
      } catch (err) {
        toast.error('reCAPTCHA failed', { id: toastId });
        setLoading(false);
        return;
      }
      if (!token) {
        toast.error('Please complete the reCAPTCHA', { id: toastId });
        setLoading(false);
        return;
      }
      toast.dismiss(toastId);
    }

    const toastId = toast.loading('Signing in...');

    try {
      const response = await authService.login({
        email: normalizedEmail,
        password: formData.password,
        captchaToken: token,
      });

      if (response.success) {
        login(response.data.user, response.data.token);
        toast.success('Welcome back!', { id: toastId });
        router.push('/');
      } else {
        toast.error(response.message || 'Login failed', { id: toastId });
      }
    } catch (error: any) {
      const status = error.response?.status;
      const message = status === 401 ? 'Invalid email or password' : status === 403 ? 'Account deactivated' : 'Login failed. Please try again.';
      toast.error(message, { id: toastId });
      recaptchaRef.current?.reset();
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <AuthSplitLayout>
      <section aria-labelledby="login-heading" className="w-full">
        <h1 className="sr-only">Login to SmartShop</h1>

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
              Cloud POS
            </span>
          </div>
          <p id="login-heading" className="sr-only">Sign in to access your shop dashboard.</p>
        </header>

        <div className="relative mb-4" aria-label="Continue with Google">
          <button
            type="button"
            onClick={() => loginWithGoogle()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 glass-input rounded-xl font-medium text-on-surface hover:bg-surface-container-high transition-all border border-white/5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="relative flex items-center mb-4" aria-hidden="true">
          <div className="flex-grow border-t border-outline-variant/30"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            OR EMAIL
          </span>
          <div className="flex-grow border-t border-outline-variant/30"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Login form">
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest" htmlFor="email">
              EMAIL ADDRESS <span className="text-error">*</span>
            </label>
            <div className="relative">
              <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors ${errors.email ? 'text-error' : 'text-primary/70'}`} aria-hidden="true" />
              <input
                className={`w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-0 transition-all ${errors.email ? '!border-error !ring-error/10' : ''}`}
                id="email" name="email" type="email" autoComplete="email" placeholder="admin@smartshop.com"
                aria-invalid={!!errors.email}
                value={formData.email} onChange={handleChange} required
              />
            </div>
            {errors.email && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.email}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest" htmlFor="password">
                PASSWORD <span className="text-error">*</span>
              </label>
              <Link className="text-[10px] font-bold text-primary hover:opacity-80 transition-opacity" href="/forgot-password" aria-label="Forgot password">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors ${errors.password ? 'text-error' : 'text-primary/70'}`} aria-hidden="true" />
              <input
                className={`w-full glass-input rounded-xl pl-10 pr-10 py-2.5 text-sm focus:ring-0 transition-all ${errors.password ? '!border-error !ring-error/10' : ''}`}
                id="password" name="password" placeholder="••••••••" type={showPassword ? 'text' : 'password'} autoComplete="current-password"
                aria-invalid={!!errors.password}
                value={formData.password} onChange={handleChange} required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors z-10"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.password}</p>}
          </div>

          {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && mounted && createPortal(
            <div className="fixed bottom-0 left-0 z-[9999]">
              <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} badge="bottomleft" />
            </div>,
            document.body
          )}

          <div className="flex items-start gap-2 pt-2 pb-1">
            <input type="checkbox" id="terms" name="terms" className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" required />
            <label htmlFor="terms" className="text-xs text-on-surface-variant leading-tight">
              I agree to the Terms of Service and Privacy Policy.
            </label>
          </div>

          <button
            disabled={loading}
            className="w-full gradient-button text-white font-bold py-2.5 px-4 rounded-xl shadow-md hover:opacity-90 active:scale-[0.98] transition-all hover:shadow-lg disabled:opacity-50"
            type="submit"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>


        </form>

        <footer className="mt-6 text-center">
          <p className="text-sm text-on-surface-variant">
            New to the platform?
            <Link className="text-primary font-semibold hover:underline ml-1" href="/register">
              Create account
            </Link>
          </p>
        </footer>
      </section>
    </AuthSplitLayout>
  );
};

export default LoginForm;
