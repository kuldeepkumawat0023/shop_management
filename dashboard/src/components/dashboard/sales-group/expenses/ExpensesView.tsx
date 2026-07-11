'use client';

import React from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Plus, Download, Filter, Search, IndianRupee, Clock, Zap, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

// Mock Data
const expensesKPIs = [
  { title: "Total Expenses", value: "₹45,200", trend: "+12.5%", isPositive: false, icon: IndianRupee },
  { title: "Pending Payments", value: "₹12,400", trend: "3 Bills", isPositive: false, icon: Clock },
  { title: "Top Category", value: "Utilities", trend: "₹18,000", isPositive: false, icon: Zap },
  { title: "Avg. Daily Expense", value: "₹1,450", trend: "-5%", isPositive: true, icon: TrendingUp },
];

const expensesList = [
  { id: 'EXP-101', date: 'Jul 24, 2026', payee: 'Reliance Power', category: 'Utilities', method: 'Bank Transfer', amount: 8500, status: 'Paid' },
  { id: 'EXP-102', date: 'Jul 23, 2026', payee: 'Office Supplies Inc', category: 'Office Supplies', method: 'Credit Card', amount: 3200, status: 'Paid' },
  { id: 'EXP-103', date: 'Jul 21, 2026', payee: 'Digital Marketing Agency', category: 'Marketing', method: 'Bank Transfer', amount: 15000, status: 'Pending' },
  { id: 'EXP-104', date: 'Jul 20, 2026', payee: 'Ramesh (Plumber)', category: 'Maintenance', method: 'Cash', amount: 1500, status: 'Paid' },
  { id: 'EXP-105', date: 'Jul 18, 2026', payee: 'City Properties', category: 'Rent', method: 'Bank Transfer', amount: 25000, status: 'Overdue' },
];

export default function ExpensesView() {
  const columns = [
    { header: 'ID', accessorKey: 'id', cell: (row: any) => <span className="font-bold text-on-surface">{row.id}</span> },
    { header: 'Date', accessorKey: 'date' },
    { header: 'Payee', accessorKey: 'payee', cell: (row: any) => <span className="font-semibold text-primary">{row.payee}</span> },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Method', accessorKey: 'method' },
    { header: 'Amount', accessorKey: 'amount', cell: (row: any) => <span className="font-black text-on-surface">₹{row.amount.toLocaleString()}</span> },
    { header: 'Status', accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessorKey: 'actions', cell: (row: any) => (
      <div className="flex items-center gap-2">
        <Link href={`/expenses/${row.id}`}>
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
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Expenses</h2>
          <p className="text-sm font-medium text-on-surface-variant">Track overheads, bills, and outgoing payments.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Link href="/expenses/new" className="flex-1 md:flex-none">
            <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none">
              <Plus className="w-4 h-4" />
              Log Expense
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {expensesKPIs.map((kpi, idx) => (
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
              placeholder="Search payee or category..."
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
            data={expensesList} 
          />
        </div>
      </div>
    </div>
  );
}
