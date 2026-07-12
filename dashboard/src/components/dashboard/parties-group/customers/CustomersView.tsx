'use client';

import React from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Plus, Download, Filter, Search, Users, UserCheck, UserPlus, IndianRupee, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

// Mock Data
const customerKPIs = [
  { title: "Total Customers", value: "1,248", trend: "+12% this month", isPositive: true, icon: Users },
  { title: "Active Customers", value: "856", trend: "Ordered in last 30d", isPositive: true, icon: UserCheck },
  { title: "New This Month", value: "64", trend: "+8% vs last month", isPositive: true, icon: UserPlus },
  { title: "Total Receivables", value: "₹45,500", trend: "12 overdue accounts", isPositive: false, icon: IndianRupee },
];

const customerList = [
  { id: 'CUST-001', name: 'Rajesh Kumar', email: 'rajesh.k@example.com', phone: '+91 98765 43210', status: 'Active', totalSpent: 125000, lastOrder: 'Jul 24, 2026' },
  { id: 'CUST-002', name: 'Priya Sharma', email: 'priya.sharma@example.com', phone: '+91 98765 43211', status: 'Active', totalSpent: 45000, lastOrder: 'Jul 20, 2026' },
  { id: 'CUST-003', name: 'Amit Singh', email: 'amit.singh@example.com', phone: '+91 98765 43212', status: 'Inactive', totalSpent: 12000, lastOrder: 'May 15, 2026' },
  { id: 'CUST-004', name: 'Neha Gupta', email: 'neha.gupta@example.com', phone: '+91 98765 43213', status: 'Active', totalSpent: 85000, lastOrder: 'Jul 22, 2026' },
  { id: 'CUST-005', name: 'Vikram Patel', email: 'vikram.patel@example.com', phone: '+91 98765 43214', status: 'Inactive', totalSpent: 5000, lastOrder: 'Mar 10, 2026' },
];

export default function CustomersView() {
  const columns = [
    { header: 'ID', accessorKey: 'id', cell: (row: any) => <span className="font-bold text-on-surface">{row.id}</span> },
    { header: 'Name', accessorKey: 'name', cell: (row: any) => <span className="font-semibold text-primary">{row.name}</span> },
    { header: 'Email & Phone', accessorKey: 'contact', cell: (row: any) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-on-surface">{row.email}</span>
        <span className="text-xs text-on-surface-variant">{row.phone}</span>
      </div>
    )},
    { header: 'Total Spent', accessorKey: 'totalSpent', cell: (row: any) => <span className="font-bold text-on-surface">₹{row.totalSpent.toLocaleString()}</span> },
    { header: 'Last Order', accessorKey: 'lastOrder', cell: (row: any) => <span className="text-sm text-on-surface-variant">{row.lastOrder}</span> },
    { header: 'Status', accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessorKey: 'actions', cell: (row: any) => (
      <div className="flex items-center gap-2">
        <Link href={`/customers/${row.id}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
            <Eye className="w-4 h-4" />
          </Button>
        </Link>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    )},
  ];

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full ">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Customers</h2>
          <p className="text-sm font-medium text-on-surface-variant">Manage your customer relationships and track spending.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Link href="/customers/new" className="flex-1 md:flex-none">
            <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none">
              <Plus className="w-4 h-4" />
              Add Customer
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {customerKPIs.map((kpi, idx) => (
          <StatsCard key={idx} {...kpi} />
        ))}
      </div>

      {/* Table Section */}
      <div className="flex flex-col flex-1 min-h-0 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 md:p-5 border-b border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-container-lowest/50">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input 
              type="text"
              placeholder="Search customers..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium transition-all text-on-surface placeholder:text-on-surface-variant/50"
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface bg-surface font-semibold gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <DataTable 
            columns={columns} 
            data={customerList} 
          />
        </div>
      </div>
    </div>
  );
}
