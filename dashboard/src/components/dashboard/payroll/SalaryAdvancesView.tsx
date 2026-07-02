'use client';

import React from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Plus, Download, Filter, Search, Banknote, HandCoins, UserMinus, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';

// Mock Data
const advanceKPIs = [
  { title: "Total Granted", value: "₹45,000", trend: "This month", isPositive: true, icon: Banknote },
  { title: "Recovered", value: "₹15,000", trend: "Via deductions", isPositive: true, icon: HandCoins },
  { title: "Outstanding", value: "₹30,000", trend: "Active balances", isPositive: false, icon: UserMinus },
];

const advanceList = [
  { id: 'ADV-010', employeeName: 'Suresh Kumar', amount: 10000, dateRequested: 'Jul 15, 2026', repaymentTerm: '₹2,000/mo', status: 'Approved' },
  { id: 'ADV-011', employeeName: 'Megha Gupta', amount: 5000, dateRequested: 'Jul 20, 2026', repaymentTerm: 'Next Salary', status: 'Pending' },
  { id: 'ADV-012', employeeName: 'Ravi Verma', amount: 15000, dateRequested: 'May 10, 2026', repaymentTerm: '₹3,000/mo', status: 'Settled' },
];

export default function SalaryAdvancesView() {
  const columns = [
    { header: 'Ref ID', accessorKey: 'id', cell: (row: any) => <span className="font-bold text-on-surface">{row.id}</span> },
    { header: 'Employee', accessorKey: 'employeeName', cell: (row: any) => <span className="font-semibold text-primary">{row.employeeName}</span> },
    { header: 'Amount', accessorKey: 'amount', cell: (row: any) => <span className="font-bold text-on-surface">₹{row.amount.toLocaleString()}</span> },
    { header: 'Date Requested', accessorKey: 'dateRequested', cell: (row: any) => <span className="text-sm text-on-surface-variant">{row.dateRequested}</span> },
    { header: 'Repayment Terms', accessorKey: 'repaymentTerm', cell: (row: any) => <span className="text-sm font-medium text-on-surface">{row.repaymentTerm}</span> },
    { header: 'Status', accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessorKey: 'actions', cell: (row: any) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
          <Eye className="w-4 h-4" />
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
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Salary Advances</h2>
          <p className="text-sm font-medium text-on-surface-variant">Manage employee advance requests and EMI deductions.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          <Link href="/payroll/advances/new" className="flex-1 md:flex-none">
            <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none">
              <Plus className="w-4 h-4" />
              Grant Advance
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        {advanceKPIs.map((kpi, idx) => (
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
              placeholder="Search employee name..."
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
            data={advanceList} 
          />
        </div>
      </div>
    </div>
  );
}
