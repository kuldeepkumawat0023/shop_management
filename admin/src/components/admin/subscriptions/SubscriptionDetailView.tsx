'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Edit, Key, ShieldCheck, CheckCircle2, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/utils/formatters';

interface SubscriptionDetailViewProps {
  planId: string;
}

const dummyPlan = {
  id: 'plan_002',
  name: 'Pro',
  price: 1999,
  billingCycle: 'Monthly',
  activeSubscribers: 86,
  status: 'Active',
  features: ['3 Shops', 'Unlimited Users', 'Advanced Reports', 'Offline POS']
};

export default function SubscriptionDetailView({ planId }: SubscriptionDetailViewProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-outline-variant/20 px-4 md:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-on-surface tracking-tight">
                {dummyPlan.name} Plan
              </h1>
              <span className="bg-success/10 text-success text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {dummyPlan.status}
              </span>
            </div>
            <p className="text-sm text-on-surface-variant mt-0.5 font-medium">
              ID: {dummyPlan.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button onClick={() => router.push(`/subscriptions/${planId}/edit`)} className="flex-1 sm:flex-none gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 rounded-xl">
            <Edit className="w-4 h-4" />
            <span className="font-bold tracking-wide">Edit Plan</span>
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pricing Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/20 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-success/10 text-success flex items-center justify-center mb-4">
              <Key className="w-6 h-6" />
            </div>
            <h3 className="text-on-surface-variant font-bold uppercase tracking-widest text-xs mb-2">Pricing</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-on-surface">{formatCurrency(dummyPlan.price)}</span>
              <span className="text-on-surface-variant font-medium">/{dummyPlan.billingCycle.toLowerCase()}</span>
            </div>
          </div>

          {/* Subscribers Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/20 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-on-surface-variant font-bold uppercase tracking-widest text-xs mb-2">Active Tenants</h3>
            <span className="text-4xl font-black text-on-surface">{dummyPlan.activeSubscribers}</span>
            <span className="text-sm text-on-surface-variant font-medium mt-1">Total shops subscribed</span>
          </div>

          {/* Revenue Card (Calculated) */}
          <div className="bg-gradient-to-br from-primary/90 to-secondary/90 rounded-3xl p-6 md:p-8 shadow-lg shadow-primary/20 text-white flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-white/80 font-bold uppercase tracking-widest text-xs mb-2">Generated MRR</h3>
            <span className="text-4xl font-black">{formatCurrency(dummyPlan.price * dummyPlan.activeSubscribers)}</span>
            <span className="text-sm text-white/80 font-medium mt-1">Monthly recurring revenue</span>
          </div>

        </div>

        {/* Features List */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/20">
          <h2 className="text-lg font-bold text-on-surface mb-6">Plan Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dummyPlan.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                <span className="font-bold text-on-surface">{feature}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
