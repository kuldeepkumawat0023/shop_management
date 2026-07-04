'use client';

import React from 'react';
import { FormDrawer } from '@/components/common/FormDrawer';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/common/Button';
import { Store, User, MapPin, Mail, Phone, Calendar, CreditCard, Activity, Box, IndianRupee } from 'lucide-react';
import { formatCurrency, formatNumber, formatDate } from '@/utils/formatters';

interface BranchDetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  branch: any;
  onStatusChangeAction: (action: 'suspend' | 'activate' | 'terminate') => void;
}

export default function BranchDetailView({ isOpen, onClose, branch, onStatusChangeAction }: BranchDetailViewProps) {
  if (!branch) return null;

  return (
    <FormDrawer isOpen={isOpen} onClose={onClose} title="Branch Details" width="w-full max-w-2xl">
      <div className="space-y-6">
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-2xl bg-surface-container-low border border-outline-variant/20">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
            <Store className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-2xl font-black text-on-surface">{branch.name}</h3>
              <StatusBadge status={branch.status} />
            </div>
            <p className="text-sm text-on-surface-variant font-medium">ID: {branch.id} • Registered on {formatDate(new Date('2023-05-15'))}</p>
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto">
            {branch.status === 'Live' ? (
              <Button variant="danger" size="sm" className="w-full shadow-none" onClick={() => onStatusChangeAction('suspend')}>
                Suspend Branch
              </Button>
            ) : (
              <Button variant="primary" size="sm" className="w-full shadow-none" onClick={() => onStatusChangeAction('activate')}>
                Activate Branch
              </Button>
            )}
            <Button variant="outline" size="sm" className="w-full">
              Force Logout
            </Button>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface border border-outline-variant/20 flex flex-col items-center justify-center text-center">
            <IndianRupee className="w-5 h-5 text-success mb-2" />
            <div className="text-sm text-on-surface-variant mb-1">Total Revenue</div>
            <div className="text-lg font-bold text-on-surface">{formatCurrency(branch.revenue * 12)}</div>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-outline-variant/20 flex flex-col items-center justify-center text-center">
            <Box className="w-5 h-5 text-primary mb-2" />
            <div className="text-sm text-on-surface-variant mb-1">Total Orders</div>
            <div className="text-lg font-bold text-on-surface">{formatNumber(1250)}</div>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-outline-variant/20 flex flex-col items-center justify-center text-center">
            <User className="w-5 h-5 text-secondary mb-2" />
            <div className="text-sm text-on-surface-variant mb-1">Active Users</div>
            <div className="text-lg font-bold text-on-surface">5</div>
          </div>
          <div className="p-4 rounded-xl bg-surface border border-outline-variant/20 flex flex-col items-center justify-center text-center">
            <Activity className="w-5 h-5 text-warning mb-2" />
            <div className="text-sm text-on-surface-variant mb-1">Storage Used</div>
            <div className="text-lg font-bold text-on-surface">2.4 GB</div>
          </div>
        </div>

        {/* Contact & License Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-6 rounded-2xl border border-outline-variant/20">
            <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> Contact Information
            </h4>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-on-surface-variant mb-1">Owner Name</div>
                <div className="text-sm font-semibold text-on-surface">{branch.owner}</div>
              </div>
              <div>
                <div className="text-xs text-on-surface-variant mb-1 flex items-center gap-1"><Mail className="w-3 h-3" /> Email Address</div>
                <div className="text-sm font-semibold text-on-surface">contact@{branch.name.toLowerCase().replace(/\s/g, '')}.com</div>
              </div>
              <div>
                <div className="text-xs text-on-surface-variant mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Phone Number</div>
                <div className="text-sm font-semibold text-on-surface">+91 98765 43210</div>
              </div>
              <div>
                <div className="text-xs text-on-surface-variant mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</div>
                <div className="text-sm font-semibold text-on-surface">{branch.location}</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-outline-variant/20">
            <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> License & Billing
            </h4>
            
            <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-primary">{branch.plan} Plan</span>
                <StatusBadge status="Active" variant="soft" />
              </div>
              <div className="text-xs text-on-surface-variant">Billed Annually</div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs text-on-surface-variant mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Plan Expiry</div>
                <div className="text-sm font-semibold text-on-surface">{formatDate(branch.planExpiry)}</div>
              </div>
              <div>
                <div className="text-xs text-on-surface-variant mb-1">Current MRR</div>
                <div className="text-sm font-semibold text-on-surface">{formatCurrency(branch.revenue)}</div>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="w-full mt-6">
              View Billing History
            </Button>
          </div>

        </div>
      </div>
    </FormDrawer>
  );
}
