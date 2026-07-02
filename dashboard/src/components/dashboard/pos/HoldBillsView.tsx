'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { PlayCircle, Trash2, Clock, Users, Banknote, ListPlus, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { StatsCard } from '@/components/common/StatsCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { cn } from '@/utils/cn';

// Mock Data
const heldBillsData = [
  { id: '1', customer: 'Rahul Sharma', phone: '+91 98765 43210', items: 4, total: 945.00, time: '10:30 AM', date: 'Jul 2, 2026', status: 'Paused' },
  { id: '2', customer: 'Walk-in Customer', phone: '-', items: 2, total: 120.50, time: '11:15 AM', date: 'Jul 2, 2026', status: 'Paused' },
  { id: '3', customer: 'Anita Singh', phone: '+91 87654 32109', items: 12, total: 3450.00, time: '12:45 PM', date: 'Jul 1, 2026', status: 'Older' },
];

export default function HoldBillsView() {
  const [activeTab, setActiveTab] = useState('All Bills');
  const tabs = ['All Bills', 'Paused Today', 'Older'];

  const filteredData = heldBillsData.filter(bill => {
    if (activeTab === 'All Bills') return true;
    if (activeTab === 'Paused Today') return bill.status === 'Paused';
    if (activeTab === 'Older') return bill.status === 'Older';
    return true;
  });

  const columns = [
    { 
      header: 'Customer', 
      accessorKey: 'customer',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            {row.customer.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-on-surface">{row.customer}</div>
            <div className="text-xs text-on-surface-variant">{row.phone}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Total Items', 
      accessorKey: 'items',
      cell: (row: any) => (
        <span className="font-semibold text-on-surface">{row.items} Items</span>
      )
    },
    { 
      header: 'Amount', 
      accessorKey: 'total',
      cell: (row: any) => (
        <span className="font-black text-primary">₹{row.total.toFixed(2)}</span>
      )
    },
    { 
      header: 'Date & Time', 
      accessorKey: 'time',
      cell: (row: any) => (
        <div>
          <div className="text-sm font-bold text-on-surface">{row.date}</div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant">
            <Clock className="w-3.5 h-3.5" />
            {row.time}
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <StatusBadge variant="dot" animate status={row.status} />
      )
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Link href="/pos">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10">
              <PlayCircle className="w-4 h-4" />
            </Button>
          </Link>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  const TabsComponent = (
    <div className="flex space-x-1 bg-surface-container-low p-1 rounded-lg w-fit">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={cn(
            "px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-md transition-all",
            activeTab === tab
              ? "gradient-button text-white shadow-md"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">Hold Bills Management</h1>
          <p className="text-sm font-medium text-on-surface-variant mt-1">
            Review paused orders, resume transactions, and track overall hold progress.
          </p>
        </div>
      </div>


      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 shrink-0">
        <StatsCard 
          title="Total Hold Bills"
          value="3"
          icon={Users}
          trendLabel="100% OF TOTAL"
          colorTheme="primary"
        />
        <StatsCard 
          title="Today's Paused"
          value="2"
          icon={Clock}
          trendLabel="66% OF TOTAL"
          colorTheme="warning"
        />
        <StatsCard 
          title="Total Value Held"
          value="₹4,515"
          icon={Banknote}
          trendLabel="POTENTIAL REVENUE"
          colorTheme="purple"
        />
        <StatsCard 
          title="Total Items"
          value="18"
          icon={ListPlus}
          trendLabel="AWAITING CHECKOUT"
          colorTheme="success"
        />
      </div>

      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col">
        <DataTable 
          data={filteredData}
          columns={columns}
          headerContent={
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 w-full">
              <div className="flex items-center gap-2 shrink-0">
                <h2 className="text-lg font-bold text-on-surface">Active Holds</h2>
                <StatusBadge status="Live Status" variant="dot" colorTheme="success" className="ml-2 bg-success/10 text-success border-success/20" />
              </div>
              {TabsComponent}
            </div>
          }
          searchPlaceholder="Search by customer name or phone..."
          className="border-none shadow-none bg-transparent"
          itemsPerPage={10}
        />
      </div>
    </div>
  );
}
