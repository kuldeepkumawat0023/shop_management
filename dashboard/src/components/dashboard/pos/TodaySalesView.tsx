'use client';

import React from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { Printer, Eye, TrendingUp, CheckCircle2 } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import { StatusBadge } from '@/components/common/StatusBadge';

// Mock Data
const todaySalesData = [
  { id: 'INV-2026-001', customer: 'Rahul Sharma', items: 4, total: 945.00, time: '10:30 AM', paymentMode: 'UPI' },
  { id: 'INV-2026-002', customer: 'Walk-in Customer', items: 2, total: 120.50, time: '11:15 AM', paymentMode: 'Cash' },
  { id: 'INV-2026-003', customer: 'Walk-in Customer', items: 1, total: 45.00, time: '11:45 AM', paymentMode: 'Cash' },
  { id: 'INV-2026-004', customer: 'Anita Singh', items: 12, total: 3450.00, time: '12:45 PM', paymentMode: 'Card' },
  { id: 'INV-2026-005', customer: 'Suresh Kumar', items: 3, total: 450.00, time: '01:30 PM', paymentMode: 'UPI' },
];

export default function TodaySalesView() {
  const columns = [
    { 
      header: 'Invoice ID', 
      accessorKey: 'id',
      cell: (row: any) => (
        <span className="font-bold text-primary">{row.id}</span>
      )
    },
    { 
      header: 'Customer', 
      accessorKey: 'customer',
      cell: (row: any) => (
        <span className="font-semibold text-on-surface">{row.customer}</span>
      )
    },
    { 
      header: 'Time', 
      accessorKey: 'time',
      cell: (row: any) => (
        <span className="text-sm font-medium text-on-surface-variant">{row.time}</span>
      )
    },
    { header: 'Items', accessorKey: 'items' },
    { 
      header: 'Payment Mode', 
      accessorKey: 'paymentMode',
      cell: (row: any) => (
        <StatusBadge status={row.paymentMode} />
      )
    },
    { 
      header: 'Total', 
      accessorKey: 'total',
      cell: (row: any) => (
        <span className="font-black text-on-surface">₹{row.total.toFixed(2)}</span>
      )
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="h-8 w-8 text-primary hover:bg-primary/10">
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10">
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">Today's Sales</h1>
          <p className="text-sm font-medium text-on-surface-variant mt-1">
            Review invoices generated today, track revenue, and monitor average order value.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 shrink-0">
        <StatsCard 
          title="Total Revenue"
          value="₹5,010.50"
          icon={TrendingUp}
          trend="+12.5%"
          trendDirection="up"
          trendLabel="vs yesterday"
          colorTheme="primary"
        />
        <StatsCard 
          title="Total Invoices"
          value="5"
          icon={CheckCircle2}
          trendLabel="COMPLETED TODAY"
          colorTheme="success"
        />
        <StatsCard 
          title="Avg Order Value"
          value="₹1,002.10"
          icon={TrendingUp}
          trendLabel="HIGHER THAN USUAL"
          colorTheme="purple"
        />
      </div>

      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col">
        <DataTable 
          data={todaySalesData}
          columns={columns}
          headerContent={
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-on-surface">Recent Transactions</h2>
              <StatusBadge status="Live Sync" variant="dot" colorTheme="success" className="ml-2 bg-success/10 text-success border-success/20" />
            </div>
          }
          searchPlaceholder="Search by receipt or customer..."
          className="border-none shadow-none bg-transparent"
          itemsPerPage={10}
        />
      </div>
    </div>
  );
}
