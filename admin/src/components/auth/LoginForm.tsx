'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth.services';
import { useAuth } from '@/hooks/useAuth';
import { GlassCard } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login({
        email,
        password,
      });

      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        
        setTimeout(() => {
          router.push('/');
        }, 100);
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard className="p-8 w-full shadow-lg">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-on-surface mb-2">Welcome Back</h2>
        <p className="text-on-surface-variant text-sm">Please sign in to your account</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm text-center">
          {error}
        </div>
      )}

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

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-on-surface" htmlFor="password">Password</label>
            <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/80 w-5 h-5 z-10 pointer-events-none" />
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input w-full pl-10 pr-4 py-2.5 text-on-surface"
              placeholder="••••••••"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          variant="gradient" 
          className="w-full mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-outline-variant/30"></div>
        <span className="text-xs font-medium text-muted-foreground uppercase">Or continue with</span>
        <div className="h-px flex-1 bg-outline-variant/30"></div>
      </div>

      <div className="mt-6">
        <Button variant="outline" className="w-full flex items-center gap-2 bg-transparent border-outline-variant/50 hover:bg-white/5 text-on-surface">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Sign in with Google
        </Button>
      </div>
      
      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Contact Admin
        </Link>
      </div>
    </GlassCard>
  );
}
