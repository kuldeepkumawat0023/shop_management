'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Plus, Download, Filter, Search, Banknote, HandCoins, UserMinus, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { payrollService } from '@/lib/services/payroll.services';
import toast from 'react-hot-toast';
import ActionGuard from '@/components/auth/ActionGuard';

export default function SalaryAdvancesView() {
  const [advances, setAdvances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAdvances = async () => {
    setLoading(true);
    try {
      const res = await payrollService.getAdvances();
      if (res.success && res.data) {
        setAdvances(res.data);
      }
    } catch (error) {
      toast.error('Failed to load advances', { id: 'failed-to-load-advances' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvances();
  }, []);

  const filteredAdvances = advances.filter((a) => 
    (a.staffId?.name && a.staffId.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // ponytail: client-side KPI aggregation to avoid unnecessary backend endpoints.
  const totalAdvanceAmount = advances.filter(a => a.status === 'Approved' || a.status === 'Settled').reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
  const pendingRequests = advances.filter(a => a.status === 'Pending').length;
  const approvedAdvances = advances.filter(a => a.status === 'Approved').length;
  const settledAdvances = advances.filter(a => a.status === 'Settled').length;

  const advanceKPIs = [
    { title: "Total Advanced", value: `₹${totalAdvanceAmount.toLocaleString()}`, trend: "Lifetime disbursed", isPositive: true, icon: Banknote },
    { title: "Active (Approved)", value: approvedAdvances.toString(), trend: "Awaiting settlement", isPositive: true, icon: HandCoins },
    { title: "Pending Requests", value: pendingRequests.toString(), trend: "Needs review", isPositive: pendingRequests === 0, icon: UserMinus },
    { title: "Settled", value: settledAdvances.toString(), trend: "Fully recovered", isPositive: true, icon: Plus }, // Use Plus or another suitable icon for settled
  ];

  const columns = [
    { header: 'Ref ID', accessorKey: '_id', cell: (row: any) => <span className="font-bold text-on-surface">{row._id?.substring(row._id.length - 6).toUpperCase()}</span> },
    { header: 'Employee', accessorKey: 'staffId.name', cell: (row: any) => <span className="font-semibold text-primary">{row.staffId?.name || 'Unknown'}</span> },
    { header: 'Amount', accessorKey: 'amount', cell: (row: any) => <span className="font-bold text-on-surface">₹{row.amount?.toLocaleString()}</span> },
    { header: 'Date Requested', accessorKey: 'advanceDate', cell: (row: any) => <span className="text-sm text-on-surface-variant">{new Date(row.advanceDate).toLocaleDateString()}</span> },
    { header: 'Repayment Terms', accessorKey: 'repaymentTerm', cell: (row: any) => <span className="text-sm font-medium text-on-surface">{row.repaymentTerm === 'EMI' ? `₹${row.emiAmount}/mo` : row.repaymentTerm}</span> },
    { header: 'Status', accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessorKey: 'actions', cell: (row: any) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
          <Eye className="w-4 h-4" />
        </Button>
        <ActionGuard permission="payroll.delete">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors">
            <Trash2 className="w-4 h-4" />
          </Button>
        </ActionGuard>
      </div>
    )},
  ];

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full ">
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
          <ActionGuard permission="payroll.create">
            <Link href="/payroll/advances/new" className="flex-1 md:flex-none">
              <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none">
                <Plus className="w-4 h-4" />
                Grant Advance
              </Button>
            </Link>
          </ActionGuard>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
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
            data={filteredAdvances} 
          />
        </div>
      </div>
    </div>
  );
}
