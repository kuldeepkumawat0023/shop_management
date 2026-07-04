'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Save, Store, User, MapPin, Mail, Phone, CreditCard, Clock, Landmark, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BranchFormProps {
  branchId?: string; // If provided, it's edit mode
}

export default function BranchForm({ branchId }: BranchFormProps) {
  const router = useRouter();
  const isEdit = !!branchId;

  const [formData, setFormData] = useState({
    name: isEdit ? 'SmartMart Superstore' : '',
    owner: isEdit ? 'Rajesh Kumar' : '',
    email: isEdit ? 'contact@smartmart.com' : '',
    phone: isEdit ? '+91 98765 43210' : '',
    
    // Detailed Address
    street: isEdit ? '123 MG Road, Phase 1' : '',
    city: isEdit ? 'Mumbai' : '',
    state: isEdit ? 'Maharashtra' : '',
    pincode: isEdit ? '400001' : '',
    
    // Legal & Tax
    gstin: isEdit ? '27ABCDE1234F1Z5' : '',
    pan: isEdit ? 'ABCDE1234F' : '',
    
    // Banking
    accountName: isEdit ? 'SmartMart Solutions Pvt Ltd' : '',
    bankName: isEdit ? 'HDFC Bank' : '',
    accountNumber: isEdit ? '50100123456789' : '',
    ifsc: isEdit ? 'HDFC0001234' : '',

    // Operation
    openTime: isEdit ? '09:00' : '09:00',
    closeTime: isEdit ? '21:00' : '21:00',
    workingDays: isEdit ? 'Mon-Sat' : 'Mon-Sun',

    // License
    plan: isEdit ? 'Premium' : 'Basic',
    status: isEdit ? 'Live' : 'Pending Verification'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
              {isEdit ? 'Edit Branch' : 'Add New Branch'}
            </h1>
            <p className="text-sm text-on-surface-variant mt-0.5 font-medium">
              {isEdit ? 'Update existing store details' : 'Register a new store with full compliance'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button onClick={() => router.back()} variant="outline" className="flex-1 sm:flex-none rounded-xl border-outline-variant/30 font-bold">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1 sm:flex-none gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 rounded-xl">
            <Save className="w-4 h-4" />
            <span className="font-bold tracking-wide">Save Branch</span>
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 w-full">
        <form className="space-y-10 bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/20" onSubmit={handleSubmit}>
          
          {/* Section: Basic Info & Owner */}
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/10">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-surface">Store & Contact Info</h2>
                <p className="text-xs text-on-surface-variant mt-1 font-medium">Basic details and owner contact</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2 lg:col-span-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                   Store Name <span className="text-error">*</span>
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. SmartMart Superstore"
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                />
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Owner Full Name <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    <User className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Phone Number <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Email Address <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="contact@store.com"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-outline-variant/10" />

          {/* Section: Address Details */}
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/10">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-surface">Store Address</h2>
                <p className="text-xs text-on-surface-variant mt-1 font-medium">Physical location of the store</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 md:col-span-3">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                   Street Address / Landmark <span className="text-error">*</span>
                </label>
                <input 
                  type="text" 
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 123 MG Road, Near City Mall"
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                   City <span className="text-error">*</span>
                </label>
                <input 
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Mumbai"
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                   State <span className="text-error">*</span>
                </label>
                <input 
                  type="text" 
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Maharashtra"
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                   Pincode / ZIP <span className="text-error">*</span>
                </label>
                <input 
                  type="text" 
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 400001"
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <hr className="border-outline-variant/10" />

          {/* Section: Legal & Tax Info */}
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/10">
              <div className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-surface">Legal & Tax Compliance</h2>
                <p className="text-xs text-on-surface-variant mt-1 font-medium">GST, PAN and official documents</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                   GSTIN Number 
                </label>
                <input 
                  type="text" 
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  placeholder="e.g. 27ABCDE1234F1Z5"
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium uppercase"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                   PAN Number <span className="text-error">*</span>
                </label>
                <input 
                  type="text" 
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  required
                  placeholder="e.g. ABCDE1234F"
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium uppercase"
                />
              </div>
            </div>
          </div>

          <hr className="border-outline-variant/10" />

          {/* Section: Banking Info */}
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/10">
              <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-surface">Banking Details</h2>
                <p className="text-xs text-on-surface-variant mt-1 font-medium">Bank account for automated payouts</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                   Account Holder Name <span className="text-error">*</span>
                </label>
                <input 
                  type="text" 
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. SmartMart Solutions Pvt Ltd"
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                   Bank Name <span className="text-error">*</span>
                </label>
                <input 
                  type="text" 
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. HDFC Bank"
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                   Account Number <span className="text-error">*</span>
                </label>
                <input 
                  type="password" 
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter Account Number"
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                   IFSC Code <span className="text-error">*</span>
                </label>
                <input 
                  type="text" 
                  name="ifsc"
                  value={formData.ifsc}
                  onChange={handleChange}
                  required
                  placeholder="e.g. HDFC0001234"
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium uppercase"
                />
              </div>
            </div>
          </div>

          <hr className="border-outline-variant/10" />

          {/* Section: License & Setup Info */}
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/10">
              <div className="w-10 h-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-surface">Platform Setup & License</h2>
                <p className="text-xs text-on-surface-variant mt-1 font-medium">Subscription plan, timing, and status</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                   <Clock className="w-3.5 h-3.5" /> Operations
                </label>
                <div className="flex items-center gap-2">
                  <input 
                    type="time" 
                    name="openTime"
                    value={formData.openTime}
                    onChange={handleChange}
                    className="w-full h-12 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                  />
                  <span className="text-on-surface-variant font-bold text-xs">TO</span>
                  <input 
                    type="time" 
                    name="closeTime"
                    value={formData.closeTime}
                    onChange={handleChange}
                    className="w-full h-12 px-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Subscription Plan <span className="text-error">*</span>
                </label>
                <select 
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium appearance-none cursor-pointer"
                >
                  <option value="Basic">Basic Plan</option>
                  <option value="Premium">Premium Plan</option>
                  <option value="Enterprise">Enterprise Plan</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Branch Status
                </label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium appearance-none cursor-pointer"
                >
                  <option value="Live">Live (Active)</option>
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
