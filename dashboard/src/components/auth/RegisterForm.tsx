'use client';

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
  User,
  Mail,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  ChevronDown,
  ShoppingBag,
  Sparkles,
  Phone
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import AuthSplitLayout from './AuthSplitLayout';
import { registerSchema } from '@/utils/validations';

const RegisterForm = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (tokenResponse.access_token) {
        const toastId = toast.loading('Creating your account...');
        try {
          const response = await authService.googleLogin(tokenResponse.access_token, 'accessToken');
          if (response.success) {
            login(response.data.user, response.data.token, response.data.expiresAt);
            toast.success('Account created successfully!', { id: toastId });
            router.push('/');
          }
        } catch (error: any) {
          const status = error.response?.status;
          const errorMessage = status === 409 ? 'Email already registered' : 'Google Sign Up failed';
          toast.error(errorMessage, { id: toastId });
        }
      }
    },
    onError: () => toast.error('Google Sign Up Failed'),
  });

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    countryCode: '+91',
    password: '',
    confirmPassword: '',
  });

  const validateField = (name: string, value: string) => {
    let error = '';
    const result = registerSchema.safeParse({ ...formData, [name]: value });
    if (!result.success) {
      const fieldError = result.error.issues.find(err => err.path[0] === name);
      if (fieldError) error = fieldError.message;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    if (id === 'phoneNumber') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [id]: digitsOnly }));
      validateField(id, digitsOnly);
      return;
    }

    const finalValue = id === 'email' ? value.toLowerCase() : value;
    setFormData(prev => ({ ...prev, [id]: finalValue }));
    validateField(id, finalValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = formData.email.trim().toLowerCase();
    const validationResult = registerSchema.safeParse({ ...formData, email: normalizedEmail });
    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      for (const err of validationResult.error.issues) {
        if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
      }
      setErrors(newErrors);
      return toast.error('Please fix form errors');
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

    const toastId = toast.loading('Creating account...');

    try {
      const normalizedEmail = formData.email.trim().toLowerCase();
      const response = await authService.register({
        ...formData,
        email: normalizedEmail,
        captchaToken: token,
      });

      if (response.success) {
        if (response.data?.isReactivation) {
          toast.success('Verification OTP sent!', { id: toastId });
          router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}&type=reactivate`);
          return;
        }

        if (response.data?.token && response.data?.user) {
          login(response.data.user, response.data.token);
          toast.success('Welcome to SmartShop!', { id: toastId });
          router.push('/');
        }
      } else {
        toast.error(response.message || 'Registration failed', { id: toastId });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout>
      <div className="w-full">
        <header className="mb-6 text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="text-primary w-8 h-8" aria-hidden="true" />
            <span className="block text-2xl font-bold leading-none tracking-tight">SmartShop</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="text-primary w-3 h-3" aria-hidden="true" />
            <span className="text-[10px] text-primary tracking-widest uppercase font-bold">Cloud POS</span>
          </div>
        </header>

        <div className="mb-6">
          <Button type="button" onClick={() => loginWithGoogle()} variant="outline" className="w-full flex items-center justify-center gap-2 bg-transparent border-outline-variant/50 hover:bg-white/5 text-on-surface">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Register with Google
          </Button>
        </div>

        <div className="relative flex items-center mb-4" aria-hidden="true">
          <div className="flex-grow border-t border-outline-variant/30"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            OR REGISTER
          </span>
          <div className="flex-grow border-t border-outline-variant/30"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Register form">
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest" htmlFor="fullname">
              FULL NAME / पूरा नाम <span className="text-error">*</span>
            </label>
            <div className="relative">
              <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors ${errors.fullname ? 'text-error' : 'text-primary/70'}`} aria-hidden="true" />
              <input
                className={`w-full glass-input rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-0 transition-all ${errors.fullname ? '!border-error !ring-error/10' : ''}`}
                id="fullname" name="fullname" type="text" autoComplete="name" placeholder="John Doe / पूरा नाम"
                maxLength={50}
                aria-invalid={!!errors.fullname}
                value={formData.fullname} onChange={handleChange} required
              />
            </div>
            {errors.fullname && <p className="text-[10px] text-error mt-1 font-bold px-1">{errors.fullname}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest" htmlFor="email">
              EMAIL ADDRESS / ईमेल पता <span className="text-error">*</span>
            </label>
            <div className="relative">
              <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors ${errors.email ? 'text-error' : 'text-primary/70'}`} aria-hidden="true" />
              <input
                className={`w-full glass-input rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-0 transition-all ${errors.email ? '!border-error !ring-error/10' : ''}`}
                id="email" name="email" type="email" autoComplete="email" placeholder="admin@smartshop.com / ईमेल"
                maxLength={100}
                aria-invalid={!!errors.email}
                value={formData.email} onChange={handleChange} required
              />
            </div>
            {errors.email && <p className="text-[10px] text-error mt-1 font-bold px-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest" htmlFor="phoneNumber">
              PHONE NUMBER / फोन नंबर <span className="text-error">*</span>
            </label>
            <div className="relative flex gap-2">
              <div className="relative w-24 shrink-0">
                <select
                  className="w-full glass-input rounded-xl py-2.5 pl-3 pr-8 text-sm focus:ring-0 transition-all appearance-none bg-surface/50 text-on-surface"
                  id="countryCode" name="countryCode" value={formData.countryCode} onChange={handleChange}
                >
                  <option value="+91">+91 (IN)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+61">+61 (AU)</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
              </div>
              <div className="relative flex-1">
                <Phone className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors ${errors.phoneNumber ? 'text-error' : 'text-primary/70'}`} aria-hidden="true" />
                <input
                  className={`w-full glass-input rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-0 transition-all ${errors.phoneNumber ? '!border-error !ring-error/10' : ''}`}
                  id="phoneNumber" name="phoneNumber" type="tel" autoComplete="tel" placeholder="9876543210 / फोन नंबर"
                  maxLength={10}
                  aria-invalid={!!errors.phoneNumber}
                  value={formData.phoneNumber} onChange={handleChange} required
                />
              </div>
            </div>
            {errors.phoneNumber && <p className="text-[10px] text-error mt-1 font-bold px-1">{errors.phoneNumber}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest" htmlFor="password">
              PASSWORD / पासवर्ड <span className="text-error">*</span>
            </label>
            <div className="relative">
              <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors ${errors.password ? 'text-error' : 'text-primary/70'}`} aria-hidden="true" />
              <input
                className={`w-full glass-input rounded-xl py-2.5 pl-10 pr-10 text-sm focus:ring-0 transition-all ${errors.password ? '!border-error !ring-error/10' : ''}`}
                id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="•••••••• / पासवर्ड"
                maxLength={50}
                aria-invalid={!!errors.password}
                value={formData.password} onChange={handleChange} required
              />
              <button
                type="button"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors z-10"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password 
              ? <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.password}</p>
              : <p className="text-[10px] text-on-surface-variant/70 mt-1 px-1">Min 8 chars, 1 uppercase, 1 lowercase, 1 number</p>
            }
          </div>

          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest" htmlFor="confirmPassword">
              CONFIRM PASSWORD / पासवर्ड की पुष्टि करें <span className="text-error">*</span>
            </label>
            <div className="relative">
              <ShieldCheck className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors ${errors.confirmPassword ? 'text-error' : 'text-primary/70'}`} aria-hidden="true" />
              <input
                className={`w-full glass-input rounded-xl py-2.5 pl-10 pr-10 text-sm focus:ring-0 transition-all ${errors.confirmPassword ? '!border-error !ring-error/10' : ''}`}
                id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="•••••••• / पासवर्ड की पुष्टि करें"
                maxLength={50}
                aria-invalid={!!errors.confirmPassword}
                value={formData.confirmPassword} onChange={handleChange} required
              />
              <button
                type="button"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors z-10"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-[10px] text-error mt-1 font-bold px-1">{errors.confirmPassword}</p>}
          </div>

          <div className="flex items-start gap-2 pt-2">
            <input type="checkbox" id="terms" name="terms" className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" required />
            <label htmlFor="terms" className="text-xs text-on-surface-variant leading-tight">
              I agree to the Terms of Service and Privacy Policy.
            </label>
          </div>

          {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && mounted && createPortal(
            <div className="fixed bottom-0 left-0 z-[9999]">
              <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} badge="bottomleft" />
            </div>,
            document.body
          )}

          <Button type="submit" variant="gradient" className="w-full mt-6" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Creating Account...
              </span>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          <div className="text-center mt-4">
            <p className="text-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-bold">
                Log In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthSplitLayout>
  );
};

export default RegisterForm;
