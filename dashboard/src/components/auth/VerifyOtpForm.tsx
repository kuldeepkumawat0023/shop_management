"use client";

import React, { useState, useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/services/auth.services';
import toast from 'react-hot-toast';
import { MailOpen, ArrowRight } from 'lucide-react';
import AuthSplitLayout from './AuthSplitLayout';

/**
 * 🔒 Premium OTP Verification Form
 * SEO + Accessibility Optimized
 */
const VerifyOtpForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const type = searchParams.get('type');

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    if (!email) {
      toast.error('Email missing. Redirecting...');
      router.push('/login');
    }
  }, [email, router]);

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;
    
    if (value.length > 1) {
      value = value[0];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6);
    
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      setError('');
      
      const nextIndex = Math.min(pastedData.length, 5);
      document.getElementById(`otp-${nextIndex}`)?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join('');
    if (otpString.length < 6) {
      setError('6 digits required');
      return toast.error('Please enter 6-digit code');
    }

    setLoading(true);
    const toastId = toast.loading('Verifying code...');

    try {
      const response = await authService.verifyOtp({
        email: email!,
        otp: otpString
      });

      if (response.success) {
        toast.success('Verified!', { id: toastId });

        if (type === 'reactivate') {
          router.push(`/reactivate-account?email=${email}`);
        } else {
          router.push(`/reset-password?email=${email}`);
        }
      } else {
        toast.error(response.message || 'Verification failed', { id: toastId });
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Invalid code';
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;
    
    if (type === 'reactivate') {
      toast.error('For security, please try logging in again to get a new reactivation code.');
      return;
    }

    let captchaToken = null;
    if (siteKey) {
      try {
        captchaToken = await recaptchaRef.current?.executeAsync();
      } catch (err) {
        toast.error('reCAPTCHA failed');
        return;
      }

      if (!captchaToken) {
        toast.error('Please complete the reCAPTCHA verification to resend OTP.');
        return;
      }
    }

    const toastId = toast.loading('Resending OTP...');
    try {
      const response = await authService.forgotPassword(email);
      if (response.success) {
        toast.success('New OTP sent successfully!', { id: toastId });
        recaptchaRef.current?.reset();
      } else {
        toast.error(response.message || 'Failed to resend OTP', { id: toastId });
        recaptchaRef.current?.reset();
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to resend OTP';
      toast.error(message, { id: toastId });
      recaptchaRef.current?.reset();
    }
  };

  const isFormValid = otp.join('').length === 6 && !loading;

  return (
    <AuthSplitLayout>
      <section aria-labelledby="verify-otp-heading" className="w-full">
        <h1 className="sr-only">Verify OTP Code for SmartShop Account</h1>

        <div className="w-full mx-auto text-center">
          <header className="mb-8">
            <div className="bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
              <MailOpen className="text-primary w-10 h-10" aria-hidden="true" />
            </div>

            <h2 id="verify-otp-heading" className="text-2xl font-bold text-on-surface mb-2">
              Check Your Email
            </h2>

            <p className="text-sm text-on-surface-variant opacity-70">
              We&apos;ve sent a 6-digit verification code to <br />
              <span className="font-bold text-primary">{email}</span>
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8" aria-label="OTP verification form">
            <div className="flex justify-center flex-col items-center">
              <div className="flex justify-center gap-2 sm:gap-4" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className={`w-12 h-14 sm:w-16 sm:h-20 text-2xl sm:text-3xl font-black text-center glass-input border-2 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none ${error ? '!border-red-500 bg-red-500/5 focus:!border-red-500 focus:!ring-red-500/10' : 'border-outline-variant/30'}`}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    aria-label={`Digit ${i + 1}`}
                    aria-invalid={!!error}
                  />
                ))}
              </div>
              {error && <p id="otp-error" className="text-[12px] text-red-500 mt-4 font-bold tracking-tight">{error}</p>}
            </div>

            <button
              disabled={!isFormValid}
              type="submit"
              aria-label="Verify OTP code"
              className="w-full gradient-button text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
              {!loading && <ArrowRight className="w-5 h-5" aria-hidden="true" />}
            </button>
          </form>

          <footer className="mt-8 flex flex-col items-center justify-center space-y-4">
            {siteKey && (
              <div className="flex justify-center transform scale-90">
                <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={siteKey} badge="bottomleft" />
              </div>
            )}
            <p className="text-xs text-on-surface-variant">
              Didn&apos;t receive the code?
              <button
                type="button"
                onClick={handleResendOtp}
                aria-label="Resend OTP code"
                className="text-primary font-bold ml-1 hover:underline"
              >
                Resend OTP
              </button>
            </p>
          </footer>
        </div>
      </section>
    </AuthSplitLayout>
  );
};

export default VerifyOtpForm;
