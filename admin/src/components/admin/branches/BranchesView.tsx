'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/common/Button';
import { StatsCard } from '@/components/common/StatsCard';
import { DeleteModal } from '@/components/common/DeleteModal';
import { Store, MapPin, CreditCard, Plus, CheckCircle2, AlertCircle, LayoutGrid, Eye, Edit, Trash2, IndianRupee } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import Link from 'next/link';

// Mock Data for Branches
const mockBranches = [
  { id: 'BR-1001', name: 'SmartMart Superstore', owner: 'Rajesh Kumar', location: 'Mumbai, MH', plan: 'Premium', planExpiry: '2024-12-15', revenue: 45000, status: 'Live' },
  { id: 'BR-1002', name: 'Green Grocers', owner: 'Amit Sharma', location: 'Delhi, DL', plan: 'Basic', planExpiry: '2024-09-30', revenue: 12500, status: 'Live' },
  { id: 'BR-1003', name: 'Tech Haven', owner: 'Sneha Patel', location: 'Bangalore, KA', plan: 'Enterprise', planExpiry: '2025-03-20', revenue: 125000, status: 'Live' },
  { id: 'BR-1004', name: 'Daily Needs', owner: 'Vikram Singh', location: 'Pune, MH', plan: 'Basic', planExpiry: '2024-08-10', revenue: 8500, status: 'Suspended' },
  { id: 'BR-1005', name: 'Fresh Fruits Co.', owner: 'Neha Gupta', location: 'Jaipur, RJ', plan: 'Premium', planExpiry: '2024-11-05', revenue: 28000, status: 'Live' },
  { id: 'BR-1006', name: 'City Electronics', owner: 'Karan Mehra', location: 'Chennai, TN', plan: 'Enterprise', planExpiry: '2025-01-10', revenue: 95000, status: 'Live' },
  { id: 'BR-1007', name: 'Fashion Hub', owner: 'Pooja Verma', location: 'Kolkata, WB', plan: 'Premium', planExpiry: '2024-10-25', revenue: 32000, status: 'Live' },
];

export default function BranchesView() {
  const [activeTab, setActiveTab] = useState('All Branches');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; branch: any }>({ isOpen: false, branch: null });
  const tabs = ['All Branches', 'Live', 'Suspended'];

  // Filter Data based on Tab
  const filteredData = mockBranches.filter(item => {
    if (activeTab === 'All Branches') return true;
    if (activeTab === 'Live') return item.status === 'Live';
    if (activeTab === 'Suspended') return item.status === 'Suspended';
    return true;
  });

  const columns = [
    {
      header: 'Branch Info',
      accessorKey: 'name',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center font-bold text-white shrink-0 overflow-hidden shadow-sm">
            {row.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-on-surface truncate max-w-[200px]">{row.name}</div>
            <div className="text-xs text-on-surface-variant font-medium mt-0.5 truncate max-w-[250px]">
              {row.owner} • {row.id}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Location',
      accessorKey: 'location',
      cell: (row: any) => (
        <div className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant bg-surface-container px-2 py-1 rounded-md border border-outline-variant/10 whitespace-nowrap">
          <MapPin className="w-3.5 h-3.5 text-primary/70" />
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
            Expires: {new Date(row.planExpiry).toLocaleDateString()}
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
        <StatusBadge
          status={row.status}
          variant="dot"
          animate={row.status === 'Live'}
        />
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Link href={`/branches/${row.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          <Link href={`/branches/${row.id}/edit`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setDeleteModal({ isOpen: true, branch: row });
            }}
            className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const totalBranches = mockBranches.length;
  const activeBranches = mockBranches.filter(c => c.status === 'Live').length;
  const suspendedBranches = mockBranches.filter(c => c.status === 'Suspended').length;
  const totalRevenue = mockBranches.reduce((acc, curr) => acc + curr.revenue, 0);

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
          <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">Manage Branches</h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">View and manage all connected stores across the platform.</p>
        </div>
        <Link href="/branches/new">
          <Button className="gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 shrink-0">
            <Plus className="w-4 h-4" />
            <span className="font-bold tracking-wide">Add Branch</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Branches"
          value={totalBranches}
          icon={Store}
          colorTheme="primary"
          trend="142"
          trendDirection="up"
          trendLabel="LIFETIME REGISTRATIONS"
        />
        <StatsCard
          title="Live Branches"
          value={activeBranches}
          icon={CheckCircle2}
          colorTheme="success"
          trend="8"
          trendDirection="up"
          trendLabel="NEW THIS WEEK"
        />
        <StatsCard
          title="Suspended Branches"
          value={suspendedBranches}
          icon={AlertCircle}
          colorTheme="warning"
          trend="2"
          trendDirection="down"
          trendLabel="DOWN FROM LAST MONTH"
        />
        <StatsCard
          title="Total MRR"
          value={formatCurrency(totalRevenue)}
          icon={IndianRupee}
          colorTheme="secondary"
          trend="12%"
          trendDirection="up"
          trendLabel="REVENUE GROWTH"
        />
      </div>

      {/* Main Table Area */}
      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col">
        <DataTable
          data={filteredData}
          columns={columns}
          headerContent={
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 w-full">
              <div className="flex items-center gap-2 shrink-0">
                <LayoutGrid className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-on-surface">Branch List</h2>
              </div>
              {TabsComponent}
            </div>
          }
          searchPlaceholder="Search branches by name, owner, or ID..."
          itemsPerPage={10}
          className="border-none shadow-none bg-transparent"
        />
      </div>

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, branch: null })}
        onDelete={() => {
          // Handle delete logic here
          setDeleteModal({ isOpen: false, branch: null });
        }}
        itemName={deleteModal.branch?.name || ''}
        itemType="branch"
        title="Delete Branch?"
      />
    </div>
  );
}
