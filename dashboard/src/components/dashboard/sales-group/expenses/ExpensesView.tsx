'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Plus, Download, Filter, Search, IndianRupee, Clock, Zap, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { expenseService } from '@/lib/services/expense.services';

// Mock KPIs (Can be updated dynamically later if backend supports KPI endpoints)
const expensesKPIs = [
  { title: "Total Expenses", value: "₹45,200", trend: "+12.5%", isPositive: false, icon: IndianRupee },
  { title: "Pending Payments", value: "₹12,400", trend: "3 Bills", isPositive: false, icon: Clock },
  { title: "Top Category", value: "Utilities", trend: "₹18,000", isPositive: false, icon: Zap },
  { title: "Avg. Daily Expense", value: "₹1,450", trend: "-5%", isPositive: true, icon: TrendingUp },
];

// Removed mock expenses list

export default function ExpensesView() {
  const columns = [
    { header: 'ID', accessorKey: 'id', cell: (row: any) => <span className="font-bold text-on-surface">{row.id.slice(-6).toUpperCase()}</span> },
    { header: 'Date / दिनांक', accessorKey: 'date' },
    { header: 'Payee / प्राप्तकर्ता', accessorKey: 'payee', cell: (row: any) => <span className="font-semibold text-primary">{row.payee}</span> },
    { header: 'Category / श्रेणी', accessorKey: 'category' },
    { header: 'Method / विधि', accessorKey: 'method' },
    { header: 'Amount / राशि', accessorKey: 'amount', cell: (row: any) => <span className="font-black text-on-surface">₹{row.amount.toLocaleString()}</span> },
    { header: 'Status / स्थिति', accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.status} /> },
    { header: 'Actions / कार्रवाइयाँ', accessorKey: 'actions', cell: (row: any) => (
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
  const [expensesList, setExpensesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await expenseService.getExpenses();
        if (response.success) {
          // Map MongoDB data to match table format
          const mapped = response.data.map((exp: any) => ({
            id: exp._id,
            date: new Date(exp.expenseDate).toLocaleDateString(),
            payee: exp.expenseName,
            category: exp.category,
            method: exp.paymentMethod,
            amount: exp.amount,
            status: exp.isActive ? 'Paid' : 'Pending', // using isActive for now
          }));
          setExpensesList(mapped);
        }
      } catch (error) {
        console.error('Failed to fetch expenses', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  if (loading) {
    return <div className="p-8 flex items-center justify-center h-full">Loading expenses... / व्यय लोड हो रहा है...</div>;
  }
  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full ">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Expenses / व्यय</h2>
          <p className="text-sm font-medium text-on-surface-variant">Track overheads, bills, and outgoing payments. / ओवरहेड, बिल और आउटगोइंग भुगतान ट्रैक करें।</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export / निर्यात</span>
          </Button>
          <Link href="/expenses/new" className="flex-1 md:flex-none">
            <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Log Expense / व्यय दर्ज करें</span>
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
              placeholder="Search payee or category... / प्राप्तकर्ता या श्रेणी खोजें..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium transition-all text-on-surface placeholder:text-on-surface-variant/50"
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface bg-surface font-semibold gap-2">
            <Filter className="w-4 h-4" />
            Filters / फ़िल्टर
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
