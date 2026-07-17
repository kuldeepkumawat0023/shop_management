'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { ViewPageSkeleton } from '@/components/common/ViewPageSkeleton';
import { Plus, Download, Filter, Search, IndianRupee, Clock, Zap, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { expenseService } from '@/lib/services/expense.services';
import { useTranslation } from 'react-i18next';
import ActionGuard from '@/components/auth/ActionGuard';
import { DeleteModal } from '@/components/common/DeleteModal';
import toast from 'react-hot-toast';

// Dynamic KPIs will be calculated
const getInitialKPIs = (t: any) => [
  { title: t('expenses.expensesView.totalExpenses'), value: "₹0", trend: "-", isPositive: false, icon: IndianRupee },
  { title: t('expenses.expensesView.pendingPayments'), value: "₹0", trend: "0 Bills", isPositive: false, icon: Clock },
  { title: t('expenses.expensesView.topCategory'), value: "-", trend: "₹0", isPositive: false, icon: Zap },
  { title: t('expenses.expensesView.avgDailyExpense'), value: "₹0", trend: "-", isPositive: true, icon: TrendingUp },
];

// Removed mock expenses list

export default function ExpensesView() {
  const { t } = useTranslation();
  
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, name: string } | null>(null);

  const executeDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await expenseService.deleteExpense(deleteTarget.id);
      if (res.success || (res as any).status === 200) {
        toast.success(t('expenses.expensesView.expenseDeleted'));
        setExpensesList(prev => prev.filter(e => e.id !== deleteTarget.id));
      } else {
        toast.error((res as any).message || t('expenses.expensesView.deleteFailed'));
      }
    } catch (err) {
      toast.error(t('expenses.expensesView.deleteError'), { id: 'error-deleting-expense' });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const columns = [
    { header: t('expenses.expensesView.id'), accessorKey: 'id', cell: (row: any) => <span className="font-bold text-on-surface">{row.id.slice(-6).toUpperCase()}</span> },
    { header: t('expenses.expensesView.date'), accessorKey: 'date' },
    { header: t('expenses.expensesView.payee'), accessorKey: 'payee', cell: (row: any) => <span className="font-semibold text-primary">{row.payee}</span> },
    { header: t('expenses.expensesView.category'), accessorKey: 'category' },
    { header: t('expenses.expensesView.method'), accessorKey: 'method' },
    { header: t('expenses.expensesView.amount'), accessorKey: 'amount', cell: (row: any) => <span className="font-black text-on-surface">₹{row.amount.toLocaleString()}</span> },
    { header: t('expenses.expensesView.status'), accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.status} /> },
    { header: t('expenses.expensesView.actions'), accessorKey: 'actions', cell: (row: any) => (
      <div className="flex items-center gap-2">
        <Link href={`/expenses/${row.id}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
            <Eye className="w-4 h-4" />
          </Button>
        </Link>
        <ActionGuard permission="expenses.update">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
            <Edit className="w-4 h-4" />
          </Button>
        </ActionGuard>
        <ActionGuard permission="expenses.delete">
          <Button onClick={() => handleDeleteClick(row.id, row.payee)} variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors">
            <Trash2 className="w-4 h-4" />
          </Button>
        </ActionGuard>
      </div>
    )},
  ];
  const [expensesList, setExpensesList] = useState<any[]>([]);
  const [kpis, setKpis] = useState(() => getInitialKPIs(t));
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

          // Calculate Dynamic KPIs
          const totalExpenses = response.data.reduce((acc: number, exp: any) => acc + (exp.amount || 0), 0);
          const pendingExpenses = response.data.filter((exp: any) => !exp.isActive);
          const pendingAmount = pendingExpenses.reduce((acc: number, exp: any) => acc + (exp.amount || 0), 0);
          
          const categoryCounts: Record<string, number> = {};
          response.data.forEach((exp: any) => {
            if (exp.category) {
              categoryCounts[exp.category] = (categoryCounts[exp.category] || 0) + (exp.amount || 0);
            }
          });
          const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];

          setKpis([
            { title: t('expenses.expensesView.totalExpenses'), value: `₹${totalExpenses.toLocaleString()}`, trend: t('expenses.expensesView.overall'), isPositive: true, icon: IndianRupee },
            { title: t('expenses.expensesView.pendingPayments'), value: `₹${pendingAmount.toLocaleString()}`, trend: `${pendingExpenses.length} ${t('purchases.purchasesView.bills')}`, isPositive: false, icon: Clock },
            { title: t('expenses.expensesView.topCategory'), value: topCategory ? topCategory[0] : "-", trend: topCategory ? `₹${topCategory[1].toLocaleString()}` : "-", isPositive: false, icon: Zap },
            { title: t('expenses.expensesView.avgDailyExpense'), value: response.data.length ? `₹${Math.round(totalExpenses / 30).toLocaleString()}` : "₹0", trend: t('expenses.expensesView.estimated30d'), isPositive: true, icon: TrendingUp },
          ]);
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
    return <ViewPageSkeleton />;
  }
  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full ">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">{t('expenses.expensesView.expenses')}</h2>
          <p className="text-sm font-medium text-on-surface-variant">{t('expenses.expensesView.trackOverheads')}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{t('expenses.expensesView.export')}</span>
          </Button>
          <ActionGuard permission="expenses.create">
            <Link href="/expenses/new" className="flex-1 md:flex-none">
              <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{t('expenses.expensesView.logExpense')}</span>
              </Button>
            </Link>
          </ActionGuard>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {kpis.map((kpi, idx) => (
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
              placeholder={t('expenses.expensesView.searchPlaceholder')}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium transition-all text-on-surface placeholder:text-on-surface-variant/50"
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface bg-surface font-semibold gap-2">
            <Filter className="w-4 h-4" />
            {t('expenses.expensesView.filters')}
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

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={executeDelete}
        itemName={deleteTarget?.name || t('common.item')}
      />
    </div>
  );
}
