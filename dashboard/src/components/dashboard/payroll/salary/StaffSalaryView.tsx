'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Plus, Download, Filter, Search, Wallet, CheckCircle2, AlertCircle, CalendarClock, Eye, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { payrollService } from '@/lib/services/payroll.services';
import toast from 'react-hot-toast';

export default function StaffSalaryView() {
  const [salaries, setSalaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const res = await payrollService.getSalaries();
      if (res.success && res.data) {
        setSalaries(res.data);
      }
    } catch (error) {
      toast.error('Failed to load salaries', { id: 'failed-to-load-salaries' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const filteredSalaries = salaries.filter((s) => 
    (s.staffId?.name && s.staffId.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // ponytail: client-side KPI aggregation to avoid unnecessary backend endpoints.
  const totalDisbursed = salaries.filter(s => s.status === 'Paid').reduce((sum, s) => sum + (Number(s.netSalary) || 0), 0);
  const totalDeductions = salaries.reduce((sum, s) => sum + (Number(s.deductions) || 0), 0);
  const pendingPayments = salaries.filter(s => s.status === 'Pending').length;
  const totalRecords = salaries.length;

  const salaryKPIs = [
    { title: "Net Disbursed", value: `₹${totalDisbursed.toLocaleString()}`, trend: "Lifetime paid", isPositive: true, icon: Wallet },
    { title: "Total Deductions", value: `₹${totalDeductions.toLocaleString()}`, trend: "Leaves, advances, etc", isPositive: false, icon: AlertCircle },
    { title: "Pending Salaries", value: pendingPayments.toString(), trend: "Awaiting payment", isPositive: pendingPayments === 0, icon: CalendarClock },
    { title: "Salary Records", value: totalRecords.toString(), trend: "Total processed", isPositive: true, icon: CheckCircle2 },
  ];

  const columns = [
    { header: 'ID', accessorKey: '_id', cell: (row: any) => <span className="font-bold text-on-surface">{row._id?.substring(row._id.length - 6).toUpperCase()}</span> },
    { header: 'Employee', accessorKey: 'staffId.name', cell: (row: any) => (
      <div className="flex flex-col">
        <span className="font-semibold text-primary">{row.staffId?.name || 'Unknown'}</span>
        <span className="text-xs text-on-surface-variant">{row.staffId?.role || ''}</span>
      </div>
    )},
    { header: 'Base Salary', accessorKey: 'baseSalary', cell: (row: any) => <span className="font-medium text-on-surface">₹{row.baseSalary?.toLocaleString()}</span> },
    { header: 'Deductions', accessorKey: 'deductions', cell: (row: any) => <span className="font-medium text-error">-₹{row.deductions?.toLocaleString() || 0}</span> },
    { header: 'Net Salary', accessorKey: 'netSalary', cell: (row: any) => <span className="font-black text-on-surface">₹{row.netSalary?.toLocaleString()}</span> },
    { header: 'Payment Date', accessorKey: 'paymentDate', cell: (row: any) => <span className="text-sm text-on-surface-variant">{row.paymentDate ? new Date(row.paymentDate).toLocaleDateString() : '-'}</span> },
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            data={filteredSalaries} 
          />
        </div>
      </div>
    </div>
  );
}
