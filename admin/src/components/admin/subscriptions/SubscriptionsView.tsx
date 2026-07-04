'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Plus, Edit, Eye, ShieldAlert, List, CheckCircle, Users, IndianRupee, LayoutGrid } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { StatsCard } from '@/components/common/StatsCard';
import { formatCurrency } from '@/utils/formatters';

const initialPlans = [
  { id: 'plan_001', name: 'Basic', price: 999, billingCycle: 'Monthly', activeSubscribers: 142, status: 'Active', features: ['1 Shop', '2 Users', 'Basic Reports'] },
  { id: 'plan_002', name: 'Pro', price: 1999, billingCycle: 'Monthly', activeSubscribers: 86, status: 'Active', features: ['3 Shops', 'Unlimited Users', 'Advanced Reports', 'Offline POS'] },
  { id: 'plan_003', name: 'Enterprise', price: 4999, billingCycle: 'Monthly', activeSubscribers: 15, status: 'Active', features: ['Unlimited Shops', 'Priority Support', 'Custom Branding'] },
  { id: 'plan_004', name: 'Legacy Free', price: 0, billingCycle: 'Lifetime', activeSubscribers: 25, status: 'Deprecated', features: ['1 Shop', '1 User'] },
  { id: 'plan_005', name: 'Starter Yearly', price: 9990, billingCycle: 'Yearly', activeSubscribers: 45, status: 'Active', features: ['1 Shop', '2 Users', 'Basic Reports', 'Save 16%'] },
  { id: 'plan_006', name: 'Pro Yearly', price: 19990, billingCycle: 'Yearly', activeSubscribers: 112, status: 'Active', features: ['3 Shops', 'Unlimited Users', 'Advanced Reports', 'Offline POS', 'Save 16%'] },
  { id: 'plan_007', name: 'Enterprise Yearly', price: 49990, billingCycle: 'Yearly', activeSubscribers: 8, status: 'Active', features: ['Unlimited Shops', 'Priority Support', 'Custom Branding', 'Dedicated Account Manager'] },
  { id: 'plan_008', name: 'Growth', price: 2999, billingCycle: 'Monthly', activeSubscribers: 34, status: 'Active', features: ['5 Shops', '10 Users', 'Advanced Reports', 'API Access'] },
  { id: 'plan_009', name: 'Beta Trial', price: 0, billingCycle: 'Monthly', activeSubscribers: 50, status: 'Deprecated', features: ['All Premium Features (Trial)'] },
  { id: 'plan_010', name: 'Franchise Plus', price: 7999, billingCycle: 'Monthly', activeSubscribers: 5, status: 'Active', features: ['10 Shops', 'White-labeling', 'Priority Support', 'API Access'] },
  { id: 'plan_011', name: 'Basic V1', price: 499, billingCycle: 'Monthly', activeSubscribers: 12, status: 'Deprecated', features: ['1 Shop', '1 User'] },
  { id: 'plan_012', name: 'Pro V1', price: 1499, billingCycle: 'Monthly', activeSubscribers: 18, status: 'Deprecated', features: ['2 Shops', '5 Users', 'Standard Reports'] },
];

export default function SubscriptionsView() {
  const router = useRouter();
  const [plans, setPlans] = useState(initialPlans);
  const [activeTab, setActiveTab] = useState('All Plans');
  const tabs = ['All Plans', 'Active', 'Deprecated'];
  
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; plan: any }>({
    isOpen: false,
    plan: null,
  });

  const handleDelete = () => {
    if (deleteModal.plan) {
      setPlans(plans.filter((p) => p.id !== deleteModal.plan.id));
      setDeleteModal({ isOpen: false, plan: null });
    }
  };

  const columns = [
    {
      header: 'Plan Name',
      accessorKey: 'name',
      cell: (row: any) => (
        <div>
          <p className="font-bold text-on-surface">{row.name}</p>
          <p className="text-xs text-on-surface-variant font-medium">ID: {row.id}</p>
        </div>
      ),
    },
    {
      header: 'Pricing',
      accessorKey: 'price',
      cell: (row: any) => (
        <div>
          <p className="font-bold text-on-surface">{formatCurrency(row.price)}</p>
          <p className="text-xs text-on-surface-variant font-medium">/{row.billingCycle.toLowerCase()}</p>
        </div>
      ),
    },
    {
      header: 'Active Subscribers',
      accessorKey: 'activeSubscribers',
      cell: (row: any) => (
        <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full text-xs">
          {row.activeSubscribers} Shops
        </span>
      ),
    },
    {
      header: 'Features',
      accessorKey: 'features',
      cell: (row: any) => (
        <p className="text-sm text-on-surface-variant font-medium max-w-[200px] truncate">
          {row.features.join(', ')}
        </p>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => {
        let variant: any = 'success';
        if (row.status === 'Deprecated') variant = 'warning';
        return <StatusBadge status={row.status} variant={variant} />;
      },
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Link href={`/subscriptions/${row.id}`}>
            <Button variant="ghost" size="icon" className="text-on-surface-variant hover:text-primary hover:bg-primary/10">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          <Link href={`/subscriptions/${row.id}/edit`}>
            <Button variant="ghost" size="icon" className="text-on-surface-variant hover:text-secondary hover:bg-secondary/10">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          {row.status !== 'Deprecated' && (
            <Button
              variant="ghost"
              size="icon"
              className="text-on-surface-variant hover:text-error hover:bg-error/10"
              onClick={() => setDeleteModal({ isOpen: true, plan: row })}
            >
              <ShieldAlert className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const activePlans = plans.filter(p => p.status === 'Active').length;
  const totalSubscribers = plans.reduce((acc, p) => acc + p.activeSubscribers, 0);
  const totalMRR = plans.reduce((acc, p) => acc + (p.price * p.activeSubscribers), 0);

  const filteredData = plans.filter(plan => {
    if (activeTab === 'All Plans') return true;
    if (activeTab === 'Active') return plan.status === 'Active';
    if (activeTab === 'Deprecated') return plan.status === 'Deprecated';
    return true;
  });

  const TabsComponent = (
    <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-outline-variant/20 self-start lg:self-auto overflow-x-auto max-w-[calc(100vw-2rem)] lg:max-w-none no-scrollbar">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={cn(
            "px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-md transition-all whitespace-nowrap",
            activeTab === tab
              ? "gradient-button text-white shadow-md"
              : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar gap-6 w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-on-surface tracking-tight">SaaS Subscriptions</h1>
          <p className="text-sm text-on-surface-variant mt-0.5 font-medium">Manage pricing plans and subscription tiers.</p>
        </div>
        <Link href="/subscriptions/new">
          <Button className="gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 shrink-0">
            <Plus className="w-4 h-4" />
            <span className="font-bold tracking-wide">Create Plan</span>
          </Button>
        </Link>
      </div>
      {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
          <StatsCard
            title="Total Plans"
            value={plans.length.toString()}
            trend="0"
            icon={List}
            trendDirection="up"
            trendLabel="AVAILABLE PLANS"
          />
          <StatsCard
            title="Active Plans"
            value={activePlans.toString()}
            trend="0"
            colorTheme="success"
            icon={CheckCircle}
            trendDirection="up"
            trendLabel="LIVE PLANS"
          />
          <StatsCard
            title="Total Subscribers"
            value={totalSubscribers.toString()}
            trend="12"
            colorTheme="primary"
            icon={Users}
            trendDirection="up"
            trendLabel="NEW THIS MONTH"
          />
          <StatsCard
            title="Total MRR"
            value={formatCurrency(totalMRR)}
            trend="15%"
            colorTheme="secondary"
            icon={IndianRupee}
            trendDirection="up"
            trendLabel="VS LAST MONTH"
          />
        </div>

        {/* Plans Table */}
        <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col">
          <DataTable
            data={filteredData}
            columns={columns}
            headerContent={
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 w-full">
                <div className="flex items-center gap-2 shrink-0">
                  <LayoutGrid className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-on-surface">Plan List</h2>
                </div>
                {TabsComponent}
              </div>
            }
            searchPlaceholder="Search plans by name..."
            itemsPerPage={10}
            className="border-none shadow-none bg-transparent"
          />
        </div>
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, plan: null })}
        onConfirm={handleDelete}
        title="Deprecate Plan?"
        message={`Are you sure you want to deprecate ${deleteModal.plan?.name}? Existing users will remain on this plan, but no new users can subscribe.`}
        confirmText="Yes, Deprecate"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
}
