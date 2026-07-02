'use client';

import React from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Plus, Download, Filter, Search, Truck, CheckCircle2, UserPlus, IndianRupee, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

// Mock Data
const supplierKPIs = [
  { title: "Total Suppliers", value: "128", trend: "+3 this month", isPositive: true, icon: Truck },
  { title: "Active Partners", value: "95", trend: "Delivered in last 60d", isPositive: true, icon: CheckCircle2 },
  { title: "New This Month", value: "8", trend: "+2 vs last month", isPositive: true, icon: UserPlus },
  { title: "Total Payables", value: "₹2,15,500", trend: "7 overdue invoices", isPositive: false, icon: IndianRupee },
];

const supplierList = [
  { id: 'SUP-101', company: 'Global Traders', name: 'Sanjay Gupta', email: 'contact@globaltraders.in', phone: '+91 98111 22233', status: 'Active', totalSourced: 450000, lastDelivery: 'Jul 24, 2026' },
  { id: 'SUP-102', company: 'Prime Electronics', name: 'Alok Mehta', email: 'sales@primeelectronics.com', phone: '+91 98111 22234', status: 'Active', totalSourced: 850000, lastDelivery: 'Jul 20, 2026' },
  { id: 'SUP-103', company: 'Shree Logistics', name: 'Manoj Tiwari', email: 'manoj@shreelogistics.in', phone: '+91 98111 22235', status: 'Inactive', totalSourced: 120000, lastDelivery: 'Mar 15, 2026' },
  { id: 'SUP-104', company: 'National Plastics', name: 'Ravi Kumar', email: 'info@nationalplastics.co.in', phone: '+91 98111 22236', status: 'Active', totalSourced: 210000, lastDelivery: 'Jul 22, 2026' },
  { id: 'SUP-105', company: 'ABC Distributors', name: 'Pooja Singh', email: 'pooja@abcdist.com', phone: '+91 98111 22237', status: 'Inactive', totalSourced: 50000, lastDelivery: 'Jan 10, 2026' },
];

export default function SuppliersView() {
  const columns = [
    { header: 'ID', accessorKey: 'id', cell: (row: any) => <span className="font-bold text-on-surface">{row.id}</span> },
    { header: 'Company', accessorKey: 'company', cell: (row: any) => (
      <div className="flex flex-col">
        <span className="font-semibold text-primary">{row.company}</span>
        <span className="text-xs text-on-surface-variant">Contact: {row.name}</span>
      </div>
    )},
    { header: 'Email & Phone', accessorKey: 'contact', cell: (row: any) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-on-surface">{row.email}</span>
        <span className="text-xs text-on-surface-variant">{row.phone}</span>
      </div>
    )},
    { header: 'Total Sourced', accessorKey: 'totalSourced', cell: (row: any) => <span className="font-bold text-on-surface">₹{row.totalSourced.toLocaleString()}</span> },
    { header: 'Last Delivery', accessorKey: 'lastDelivery', cell: (row: any) => <span className="text-sm text-on-surface-variant">{row.lastDelivery}</span> },
    { header: 'Status', accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessorKey: 'actions', cell: (row: any) => (
      <div className="flex items-center gap-2">
        <Link href={`/suppliers/${row.id}`}>
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
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Suppliers</h2>
          <p className="text-sm font-medium text-on-surface-variant">Manage vendors, B2B partners, and track payables.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Link href="/suppliers/new" className="flex-1 md:flex-none">
            <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none">
              <Plus className="w-4 h-4" />
              Add Supplier
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {supplierKPIs.map((kpi, idx) => (
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
              placeholder="Search company or contact..."
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
            data={supplierList} 
          />
        </div>
      </div>
    </div>
  );
}
