'use client';

import React, { useState } from 'react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/common/Button';
import { Store, User, MapPin, Mail, Phone, Calendar, CreditCard, Activity, Box, IndianRupee, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { formatCurrency, formatNumber, formatDate } from '@/utils/formatters';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BranchDetailViewProps {
  branchId: string;
}

// Mock data fetcher
const getBranchData = (id: string) => {
  return { 
    id, 
    name: 'SmartMart Superstore', 
    owner: 'Rajesh Kumar', 
    location: 'Mumbai, MH', 
    plan: 'Premium', 
    planExpiry: '2024-12-15', 
    revenue: 45000, 
    status: 'Live',
    totalOrders: 1250,
    activeUsers: 5,
    storageUsed: '2.4 GB',
    email: 'contact@smartmart.com',
    phone: '+91 98765 43210'
  };
};

export default function BranchDetailView({ branchId }: BranchDetailViewProps) {
  const router = useRouter();
  const branch = getBranchData(branchId);

  if (!branch) return null;

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto custom-scrollbar">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-outline-variant/20 px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-on-surface tracking-tight">Branch Details</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/branches/${branch.id}/edit`}>
            <Button variant="ghost" className="text-on-surface-variant hover:text-primary hover:bg-primary/10">
              <Edit className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            onClick={() => {}}
            className="text-on-surface-variant hover:bg-error/10 hover:text-error"
          >
            <Trash2 className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">{branch.status === 'Live' ? 'Suspend' : 'Activate'}</span>
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Profile Header */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl gradient-button text-white flex items-center justify-center font-black shrink-0 shadow-lg shadow-primary/20">
            <Store className="w-12 h-12 md:w-16 md:h-16" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge status={branch.status} variant="dot" animate={branch.status === 'Live'} />
                <span className="text-xs font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  {branch.id}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">{branch.name}</h1>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-3xl">
              Owned by <span className="font-bold text-on-surface">{branch.owner}</span> • Registered on {formatDate(new Date('2023-05-15'))}
            </p>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Revenue</p>
              <p className="text-xl font-black text-on-surface mt-0.5">{formatCurrency(branch.revenue * 12)}</p>
            </div>
          </div>
          
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Orders</p>
              <p className="text-xl font-black text-on-surface mt-0.5">{formatNumber(branch.totalOrders)}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Active Users</p>
              <p className="text-xl font-black text-on-surface mt-0.5">{branch.activeUsers}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-warning/10 text-warning flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Storage Used</p>
              <p className="text-xl font-black text-on-surface mt-0.5">{branch.storageUsed}</p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm">
            <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-6 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Contact Information
            </h4>
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4">
                <div className="text-sm text-on-surface-variant">Owner Name</div>
                <div className="text-sm font-semibold text-on-surface">{branch.owner}</div>
              </div>
              <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4">
                <div className="text-sm text-on-surface-variant flex items-center gap-1.5"><Mail className="w-4 h-4" /> Email</div>
                <div className="text-sm font-semibold text-on-surface">{branch.email}</div>
              </div>
              <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4">
                <div className="text-sm text-on-surface-variant flex items-center gap-1.5"><Phone className="w-4 h-4" /> Phone</div>
                <div className="text-sm font-semibold text-on-surface">{branch.phone}</div>
              </div>
              <div className="flex items-center justify-between pb-2">
                <div className="text-sm text-on-surface-variant flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Location</div>
                <div className="text-sm font-semibold text-on-surface">{branch.location}</div>
              </div>
            </div>
          </div>

          {/* License Info */}
          <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/20 shadow-sm">
            <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-6 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-secondary" /> License & Billing
            </h4>
            
            <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between">
              <div>
                <span className="text-lg font-black text-primary block">{branch.plan} Plan</span>
                <span className="text-xs font-medium text-on-surface-variant">Billed Annually</span>
              </div>
              <StatusBadge status="Active" variant="soft" />
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4">
                <div className="text-sm text-on-surface-variant flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Plan Expiry</div>
                <div className="text-sm font-semibold text-on-surface">{formatDate(branch.planExpiry)}</div>
              </div>
              <div className="flex items-center justify-between pb-2">
                <div className="text-sm text-on-surface-variant">Current MRR</div>
                <div className="text-sm font-bold text-success">{formatCurrency(branch.revenue)}</div>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="w-full mt-6 rounded-xl border-outline-variant/30">
              View Billing History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
