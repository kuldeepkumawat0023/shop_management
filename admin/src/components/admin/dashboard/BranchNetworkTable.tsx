'use client';

import React from 'react';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/common/Button';
import { Store, MapPin, CreditCard, ChevronRight, MoreHorizontal } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

// Mock Data for Branches
const mockBranches = [
  {
    id: 'BR-1001',
    name: 'SmartMart Superstore',
    owner: 'Rajesh Kumar',
    location: 'Mumbai, MH',
    plan: 'Premium',
    planExpiry: '2024-12-15',
    revenue: 45000,
    status: 'Live',
  },
  {
    id: 'BR-1002',
    name: 'Green Grocers',
    owner: 'Amit Sharma',
    location: 'Delhi, DL',
    plan: 'Basic',
    planExpiry: '2024-09-30',
    revenue: 12500,
    status: 'Live',
  },
  {
    id: 'BR-1003',
    name: 'Tech Haven',
    owner: 'Sneha Patel',
    location: 'Bangalore, KA',
    plan: 'Enterprise',
    planExpiry: '2025-03-20',
    revenue: 125000,
    status: 'Live',
  },
  {
    id: 'BR-1004',
    name: 'Daily Needs',
    owner: 'Vikram Singh',
    location: 'Pune, MH',
    plan: 'Basic',
    planExpiry: '2024-08-10',
    revenue: 8500,
    status: 'Suspended',
  },
  {
    id: 'BR-1005',
    name: 'Fresh Fruits Co.',
    owner: 'Neha Gupta',
    location: 'Jaipur, RJ',
    plan: 'Premium',
    planExpiry: '2024-11-05',
    revenue: 28000,
    status: 'Pending Verification',
  },
];

export default function BranchNetworkTable() {
  const columns = [
    {
      header: 'Branch Info',
      accessorKey: 'name',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-on-surface">{row.name}</div>
            <div className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
              <span className="font-medium">{row.owner}</span> • {row.id}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Location',
      accessorKey: 'location',
      cell: (row: any) => (
        <div className="flex items-center gap-1.5 text-on-surface-variant text-sm font-medium">
          <MapPin className="w-4 h-4 text-primary/70" />
          {row.location}
        </div>
      ),
    },
    {
      header: 'License & Plan',
      accessorKey: 'plan',
      cell: (row: any) => (
        <div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-on-surface">
            <CreditCard className="w-4 h-4 text-secondary/80" />
            {row.plan}
          </div>
          <div className="text-[11px] font-medium text-on-surface-variant mt-0.5">
            Valid till: {new Date(row.planExpiry).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      header: 'Monthly Revenue',
      accessorKey: 'revenue',
      cell: (row: any) => (
        <div className="font-bold text-on-surface">
          {formatCurrency(row.revenue)}
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <StatusBadge status={row.status} />
      ),
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: () => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs font-semibold px-3 bg-surface border-outline-variant/50 hover:bg-surface-container-high hover:text-primary">
            Manage
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary rounded-lg">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-on-surface">Branch Network</h3>
          <p className="text-sm text-on-surface-variant mt-0.5">Monitor and manage all connected stores across the platform.</p>
        </div>
        <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 border-outline-variant/50">
          View All Branches <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      
      <DataTable 
        data={mockBranches} 
        columns={columns} 
        searchPlaceholder="Search branches by name, owner, or location..."
        itemsPerPage={5}
      />
    </div>
  );
}
