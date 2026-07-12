'use client';

import React from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Plus, Download, Filter, Search, Wallet, CheckCircle2, AlertCircle, CalendarClock, Eye, CreditCard } from 'lucide-react';
import Link from 'next/link';

// Mock Data
const salaryKPIs = [
  { title: "Total Payroll (July)", value: "₹2,45,000", trend: "+5% vs last month", isPositive: true, icon: Wallet },
  { title: "Amount Paid", value: "₹1,80,000", trend: "75% completed", isPositive: true, icon: CheckCircle2 },
  { title: "Pending Amount", value: "₹65,000", trend: "5 employees pending", isPositive: false, icon: AlertCircle },
  { title: "Next Payday", value: "Aug 1st", trend: "In 7 days", isPositive: true, icon: CalendarClock },
];

const salaryList = [
  { id: 'SAL-001', employeeName: 'Ravi Verma', role: 'Store Manager', baseSalary: 45000, deductions: 2000, netSalary: 43000, status: 'Paid', date: 'Jul 24, 2026' },
  { id: 'SAL-002', employeeName: 'Anjali Sharma', role: 'Sales Executive', baseSalary: 30000, deductions: 500, netSalary: 29500, status: 'Paid', date: 'Jul 24, 2026' },
  { id: 'SAL-003', employeeName: 'Suresh Kumar', role: 'Warehouse Staff', baseSalary: 25000, deductions: 0, netSalary: 25000, status: 'Pending', date: '-' },
  { id: 'SAL-004', employeeName: 'Megha Gupta', role: 'Cashier', baseSalary: 28000, deductions: 1000, netSalary: 27000, status: 'Pending', date: '-' },
  { id: 'SAL-005', employeeName: 'Rahul Desai', role: 'Delivery Agent', baseSalary: 22000, deductions: 0, netSalary: 22000, status: 'Paid', date: 'Jul 20, 2026' },
];

export default function StaffSalaryView() {
  const columns = [
    { header: 'ID', accessorKey: 'id', cell: (row: any) => <span className="font-bold text-on-surface">{row.id}</span> },
    { header: 'Employee', accessorKey: 'employeeName', cell: (row: any) => (
      <div className="flex flex-col">
        <span className="font-semibold text-primary">{row.employeeName}</span>
        <span className="text-xs text-on-surface-variant">{row.role}</span>
      </div>
    )},
    { header: 'Base Salary', accessorKey: 'baseSalary', cell: (row: any) => <span className="font-medium text-on-surface">₹{row.baseSalary.toLocaleString()}</span> },
    { header: 'Deductions', accessorKey: 'deductions', cell: (row: any) => <span className="font-medium text-error">-₹{row.deductions.toLocaleString()}</span> },
    { header: 'Net Salary', accessorKey: 'netSalary', cell: (row: any) => <span className="font-black text-on-surface">₹{row.netSalary.toLocaleString()}</span> },
    { header: 'Payment Date', accessorKey: 'date', cell: (row: any) => <span className="text-sm text-on-surface-variant">{row.date}</span> },
    { header: 'Status', accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessorKey: 'actions', cell: (row: any) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
          <Eye className="w-4 h-4" />
        </Button>
        {row.status === 'Pending' && (
          <Link href={`/payroll/staff/pay?employeeId=${row.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-success hover:text-success hover:bg-success/10 transition-colors" title="Process Payment">
              <CreditCard className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>
    )},
  ];

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full ">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Staff Salary</h2>
          <p className="text-sm font-medium text-on-surface-variant">Manage employee payroll and track monthly disbursements.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            Export Payroll
          </Button>
          <Link href="/payroll/staff/pay" className="flex-1 md:flex-none">
            <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none">
              <Plus className="w-4 h-4" />
              Process Salary
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {salaryKPIs.map((kpi, idx) => (
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
            data={salaryList} 
          />
        </div>
      </div>
    </div>
  );
}
