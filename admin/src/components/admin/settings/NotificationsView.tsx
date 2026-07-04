'use client';

import React, { useState } from 'react';
import { BellRing, Mail, ShieldCheck, CreditCard, Activity, Globe, Save, Megaphone, FileText, Lock } from 'lucide-react';
import { Button } from '@/components/common/Button';

export default function NotificationsView() {
  const [notifs, setNotifs] = useState({
    email_newSignup: true,
    email_paymentFail: true,
    email_weeklyReport: false,
    email_security: true,
    email_marketing: false,
    email_invoices: true,
  });

  const handleToggle = (key: keyof typeof notifs) => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const Toggle = ({ checked, onClick }: { checked: boolean, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-all duration-300 shadow-inner focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
        checked ? 'bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] shadow-primary/30' : 'bg-error/20'
      }`}
    >
      <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-md ${checked ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar gap-8 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight flex items-center gap-2">
            <BellRing className="w-7 h-7 text-primary" />
            Email Alert Settings
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">Control exactly which notifications are sent to your inbox.</p>
        </div>
        <Button className="gradient-button text-white shadow-md gap-2 shrink-0">
          <Save className="w-4 h-4" />
          Save Preferences
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        
        {/* Box 1: Core & Financial Alerts */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface">Core & Financial Alerts</h2>
              <p className="text-xs text-on-surface-variant font-medium">Important platform activity and billing</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl overflow-hidden shadow-sm flex flex-col h-full">
            
            <div className="p-5 flex-1 flex items-center justify-between border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-on-surface" />
                </div>
                <div>
                  <h3 className="font-bold text-on-surface">New Branch Signups</h3>
                  <p className="text-sm font-medium text-on-surface-variant mt-0.5">Get notified immediately when a new shop registers on the platform.</p>
                </div>
              </div>
              <Toggle checked={notifs.email_newSignup} onClick={() => handleToggle('email_newSignup')} />
            </div>

            <div className="p-5 flex-1 flex items-center justify-between border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4 text-error" />
                </div>
                <div>
                  <h3 className="font-bold text-on-surface">Payment Failures</h3>
                  <p className="text-sm font-medium text-on-surface-variant mt-0.5">Critical alerts for failed payouts, chargebacks, or subscriptions.</p>
                </div>
              </div>
              <Toggle checked={notifs.email_paymentFail} onClick={() => handleToggle('email_paymentFail')} />
            </div>

            <div className="p-5 flex-1 flex items-center justify-between hover:bg-surface-container-low/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h3 className="font-bold text-on-surface">Monthly Billing Invoices</h3>
                  <p className="text-sm font-medium text-on-surface-variant mt-0.5">Automatic email delivery of platform SaaS billing invoices and receipts.</p>
                </div>
              </div>
              <Toggle checked={notifs.email_invoices} onClick={() => handleToggle('email_invoices')} />
            </div>

          </div>
        </div>

        {/* Box 2: System & Marketing Alerts */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface">System & Updates</h2>
              <p className="text-xs text-on-surface-variant font-medium">Security, analytics, and marketing emails</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl overflow-hidden shadow-sm flex flex-col h-full">
            
            <div className="p-5 flex-1 flex items-center justify-between border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-warning" />
                </div>
                <div>
                  <h3 className="font-bold text-on-surface">Security Alerts</h3>
                  <p className="text-sm font-medium text-on-surface-variant mt-0.5">Alerts for suspicious login attempts, password changes, or downtime.</p>
                </div>
              </div>
              <Toggle checked={notifs.email_security} onClick={() => handleToggle('email_security')} />
            </div>

            <div className="p-5 flex-1 flex items-center justify-between border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-on-surface">Weekly Analytics Report</h3>
                  <p className="text-sm font-medium text-on-surface-variant mt-0.5">Automated performance and revenue summary sent every Monday morning.</p>
                </div>
              </div>
              <Toggle checked={notifs.email_weeklyReport} onClick={() => handleToggle('email_weeklyReport')} />
            </div>

            <div className="p-5 flex-1 flex items-center justify-between hover:bg-surface-container-low/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Megaphone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-on-surface">Marketing Campaigns</h3>
                  <p className="text-sm font-medium text-on-surface-variant mt-0.5">Receive updates about new platform features, offers, and webinars.</p>
                </div>
              </div>
              <Toggle checked={notifs.email_marketing} onClick={() => handleToggle('email_marketing')} />
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
