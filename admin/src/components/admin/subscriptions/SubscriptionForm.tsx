'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Save, CreditCard, ListChecks, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SubscriptionFormProps {
  planId?: string; // If provided, it's edit mode
}

export default function SubscriptionForm({ planId }: SubscriptionFormProps) {
  const router = useRouter();
  const isEdit = !!planId;

  const [formData, setFormData] = useState({
    name: isEdit ? 'Pro' : '',
    price: isEdit ? '1999' : '',
    billingCycle: isEdit ? 'Monthly' : 'Monthly',
    status: isEdit ? 'Active' : 'Active',
    features: isEdit ? '3 Shops, Unlimited Users, Advanced Reports, Offline POS' : ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, make API call here
    router.back();
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-outline-variant/20 px-4 md:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-on-surface tracking-tight">
              {isEdit ? 'Edit Plan' : 'Create New Plan'}
            </h1>
            <p className="text-sm text-on-surface-variant mt-0.5 font-medium">
              {isEdit ? 'Update subscription plan details and features' : 'Setup a new SaaS subscription tier for shop owners'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button onClick={() => router.back()} variant="outline" className="flex-1 sm:flex-none rounded-xl border-outline-variant/30 font-bold">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1 sm:flex-none gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 rounded-xl">
            <Save className="w-4 h-4" />
            <span className="font-bold tracking-wide">Save Plan</span>
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 w-full max-w-5xl mx-auto">
        <form className="space-y-10 bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/20" onSubmit={handleSubmit}>
          
          {/* Section: Basic Info */}
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/10">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-surface">Plan Overview</h2>
                <p className="text-xs text-on-surface-variant mt-1 font-medium">Basic details and status</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                   Plan Name <span className="text-error">*</span>
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Pro Plan"
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Plan Status
                </label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium appearance-none cursor-pointer"
                >
                  <option value="Active">Active (Available for subscription)</option>
                  <option value="Hidden">Hidden (Not public)</option>
                  <option value="Deprecated">Deprecated (Legacy)</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-outline-variant/10" />

          {/* Section: Pricing */}
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/10">
              <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-surface">Pricing Setup</h2>
                <p className="text-xs text-on-surface-variant mt-1 font-medium">Cost and billing cycle</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                   Price (INR) <span className="text-error">*</span>
                </label>
                <input 
                  type="number" 
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g. 1999"
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                   Billing Cycle <span className="text-error">*</span>
                </label>
                <select 
                  name="billingCycle"
                  value={formData.billingCycle}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium appearance-none cursor-pointer"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly (Save 20%)</option>
                  <option value="Lifetime">Lifetime (One-time)</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-outline-variant/10" />

          {/* Section: Features */}
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/10">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                <ListChecks className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-surface">Plan Features</h2>
                <p className="text-xs text-on-surface-variant mt-1 font-medium">What is included in this plan?</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                 Features List (Comma Separated) <span className="text-error">*</span>
              </label>
              <textarea 
                name="features"
                value={formData.features}
                onChange={handleChange}
                required
                rows={4}
                placeholder="e.g. 3 Shops, Unlimited Users, Advanced Reports, Offline POS"
                className="w-full p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium resize-none custom-scrollbar"
              />
              <p className="text-[10px] text-on-surface-variant/70 font-medium mt-1">Separate each feature with a comma. These will be displayed as bullet points.</p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
