'use client';

import React, { useState } from 'react';
import { Shield, Key, Smartphone, AlertTriangle, Monitor, CheckCircle2, Lock, Mail, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function SecurityView() {
  const [forgotPasswordState, setForgotPasswordState] = useState<'idle' | 'loading' | 'sent'>('idle');

  const handleForgotPassword = () => {
    setForgotPasswordState('loading');
    // Simulate API call
    setTimeout(() => {
      setForgotPasswordState('sent');
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar gap-6 w-full mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1 flex items-center gap-3">
            <Lock className="w-8 h-8 text-primary" />
            Security & Authentication
          </h2>
          <p className="text-sm font-medium text-on-surface-variant">Protect your account with advanced security features and monitor active sessions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

        {/* Left Column: Password & 2FA */}
        <div className="flex flex-col gap-6 lg:col-span-2">

          {/* Password Change Card */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-5 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">Change Password</h3>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5">Update your password to keep your account secure.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-on-surface-variant">Current Password</label>
                  {forgotPasswordState === 'idle' && (
                    <button
                      onClick={handleForgotPassword}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>

                {forgotPasswordState === 'sent' ? (
                  <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-start gap-3 mt-2">
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-success">Reset Link Sent!</p>
                      <p className="text-xs text-success/80 font-medium mt-1">We've sent a password reset link to your registered email address. Please check your inbox.</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="Enter current password"
                      className="bg-surface-container-low w-full focus:bg-surface-container-lowest"
                      disabled={forgotPasswordState === 'loading'}
                    />
                    {forgotPasswordState === 'loading' && (
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-1.5 w-full">
                <label className="text-xs font-bold text-on-surface-variant">New Password</label>
                <Input type="password" placeholder="Create new password" className="bg-surface-container-low w-full focus:bg-surface-container-lowest" />
              </div>
              <div className="space-y-1.5 w-full">
                <label className="text-xs font-bold text-on-surface-variant">Confirm New Password</label>
                <Input type="password" placeholder="Confirm new password" className="bg-surface-container-low w-full focus:bg-surface-container-lowest" />
              </div>

              <div className="md:col-span-2 pt-4 mt-2 border-t border-outline-variant/20 flex justify-end">
                <Button className="gradient-button text-white shadow-md px-8 rounded-xl font-bold">
                  Update Password
                </Button>
              </div>
            </div>
          </div>

          {/* Two-Factor Auth */}
          <div className="bg-gradient-to-r from-surface-container-lowest to-surface-container-low border border-outline-variant/30 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-center justify-between relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex gap-4 items-start relative z-10 w-full">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-on-surface">Two-Factor Authentication (2FA)</h3>
                  <span className="px-2 py-0.5 bg-warning/10 text-warning text-[10px] font-black uppercase rounded-full border border-warning/20">Recommended</span>
                </div>
                <p className="text-sm text-on-surface-variant font-medium">Add an extra layer of security to your account by enabling 2FA via SMS or Authenticator App.</p>
              </div>
            </div>
            <Button className="shrink-0 gradient-button text-white shadow-md rounded-xl font-bold px-6 relative z-10 w-full sm:w-auto">
              Enable 2FA
            </Button>
          </div>

        </div>

        {/* Right Column: Sessions & Alerts */}
        <div className="flex flex-col gap-6 lg:col-span-1">

          {/* Active Sessions */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low/30">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-on-surface">Active Sessions</h3>
              </div>
              <Button variant="ghost" className="text-error hover:bg-error/10 text-xs font-bold h-7 px-2">
                Revoke All
              </Button>
            </div>

            <div className="flex-1 flex flex-col p-2">
              <div className="flex items-start justify-between p-3 rounded-2xl hover:bg-surface-container-low transition-colors group">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-1 text-success">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-on-surface">Windows PC - Chrome</p>
                    <p className="text-xs text-on-surface-variant font-medium mt-0.5">Mumbai, India</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                      <span className="text-[10px] font-bold text-success uppercase tracking-wider">Current Session</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-outline-variant/10 my-1"></div>

              <div className="flex items-start justify-between p-3 rounded-2xl hover:bg-surface-container-low transition-colors group">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 mt-1 text-on-surface-variant group-hover:text-primary transition-colors">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-on-surface">iPhone 14 Pro - Safari</p>
                    <p className="text-xs text-on-surface-variant font-medium mt-0.5">Delhi, India</p>
                    <p className="text-[10px] font-bold text-on-surface-variant mt-1">Last active 2 hours ago</p>
                  </div>
                </div>
                <Button variant="ghost" className="text-error opacity-0 group-hover:opacity-100 transition-opacity h-7 text-xs font-bold px-2 rounded-lg hover:bg-error/10">
                  Logout
                </Button>
              </div>
            </div>

            <div className="p-4 bg-primary/5 border-t border-primary/10 flex items-start gap-3">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-primary/90 leading-relaxed">
                If you notice any suspicious activity, immediately revoke access and change your password.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
