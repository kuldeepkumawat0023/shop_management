'use client';

import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Lock, AlertOctagon, UserX, ToggleLeft, ToggleRight, Key } from 'lucide-react';
import { Button } from '@/components/common/Button';

export default function SecurityView() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [force2fa, setForce2fa] = useState(true);
  const [ipWhitelist, setIpWhitelist] = useState(false);

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar gap-6 w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-primary" />
            Security Center
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">Manage platform security, threat prevention, and access policies.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-success flex items-center gap-1.5 bg-success/10 px-3 py-1.5 rounded-full border border-success/20">
            <ShieldCheck className="w-4 h-4" />
            Platform Secure
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Threats Overview */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest border border-outline-variant/20 p-6 rounded-3xl shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-error/10 text-error flex items-center justify-center shrink-0">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-1">DDoS Attacks Prevented</h3>
                <p className="text-3xl font-black text-on-surface">1,402</p>
                <p className="text-xs font-medium text-error mt-1">In the last 30 days</p>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest border border-outline-variant/20 p-6 rounded-3xl shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 text-warning flex items-center justify-center shrink-0">
                <UserX className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-1">Failed Login Attempts</h3>
                <p className="text-3xl font-black text-on-surface">348</p>
                <p className="text-xs font-medium text-warning mt-1">From 12 unique IPs</p>
              </div>
            </div>
          </div>

          {/* SSL Status */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-on-surface">SSL Certificate Active</h2>
                <p className="text-sm font-medium text-on-surface-variant mt-1">Wildcard certificate for *.smartshop.com</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs font-bold px-2 py-1 bg-surface-container-high rounded-md text-on-surface border border-outline-variant/20">
                    Provider: Let's Encrypt
                  </span>
                  <span className="text-xs font-bold text-success">
                    Expires in 64 days
                  </span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="shrink-0 border-outline-variant/30 text-on-surface-variant">
              Renew Certificate
            </Button>
          </div>
          
        </div>

        {/* Global Security Toggles */}
        <div className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2 mb-6">
            <Key className="w-5 h-5 text-secondary" />
            Security Policies
          </h2>
          
          <div className="space-y-6">
            
            {/* Toggle 1 */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Force 2FA (Staff)</h3>
                <p className="text-xs font-medium text-on-surface-variant mt-1 leading-relaxed">Require Two-Factor Authentication for all Super Admins and Support Agents.</p>
              </div>
              <button onClick={() => setForce2fa(!force2fa)} className="shrink-0 outline-none">
                {force2fa ? <ToggleRight className="w-10 h-10 text-success" /> : <ToggleLeft className="w-10 h-10 text-on-surface-variant" />}
              </button>
            </div>
            
            <hr className="border-outline-variant/20" />

            {/* Toggle 2 */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-on-surface">IP Whitelisting</h3>
                <p className="text-xs font-medium text-on-surface-variant mt-1 leading-relaxed">Only allow admin access from authorized corporate IP addresses.</p>
              </div>
              <button onClick={() => setIpWhitelist(!ipWhitelist)} className="shrink-0 outline-none">
                {ipWhitelist ? <ToggleRight className="w-10 h-10 text-success" /> : <ToggleLeft className="w-10 h-10 text-on-surface-variant" />}
              </button>
            </div>
            
            <hr className="border-outline-variant/20" />

            {/* Toggle 3 */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-error">Maintenance Mode</h3>
                <p className="text-xs font-medium text-on-surface-variant mt-1 leading-relaxed">Temporarily disable access to all shops. Show a maintenance page.</p>
              </div>
              <button onClick={() => setMaintenanceMode(!maintenanceMode)} className="shrink-0 outline-none">
                {maintenanceMode ? <ToggleRight className="w-10 h-10 text-error animate-pulse" /> : <ToggleLeft className="w-10 h-10 text-on-surface-variant" />}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
