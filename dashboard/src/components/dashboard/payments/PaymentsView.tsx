'use client';

import React from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Plus, Download, Filter, Search, ArrowDownLeft, ArrowUpRight, Clock, AlertCircle, Eye, Printer, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import ActionGuard from '@/components/auth/ActionGuard';
import { DeleteModal } from '@/components/common/DeleteModal';
import { useState } from 'react';
import toast from 'react-hot-toast';

// Mock Data
const paymentList = [
  { id: 'PAY-2026-081', date: 'Jul 24, 2026', party: 'Ramesh Singh', type: 'Money In', amount: 15000, method: 'UPI', status: 'Completed' },
  { id: 'PAY-2026-080', date: 'Jul 24, 2026', party: 'Global Traders', type: 'Money Out', amount: 45000, method: 'Bank Transfer', status: 'Completed' },
  { id: 'PAY-2026-079', date: 'Jul 23, 2026', party: 'TechCorp Solutions', type: 'Money In', amount: 85000, method: 'Cheque', status: 'Pending' },
  { id: 'PAY-2026-078', date: 'Jul 22, 2026', party: 'Local Suppliers', type: 'Money Out', amount: 12000, method: 'Cash', status: 'Completed' },
  { id: 'PAY-2026-077', date: 'Jul 20, 2026', party: 'Walk-in Customer', type: 'Money In', amount: 5000, method: 'Cash', status: 'Completed' },
];

export default function PaymentsView() {
  const { t } = useTranslation();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, name: string } | null>(null);

  const executeDelete = async () => {
    if (!deleteTarget) return;
    try {
      // Mock delete
      toast.success(t('common.deleted', 'Deleted successfully'));
    } catch (error) {
      toast.error(t('common.deleteFailed', 'Failed to delete'));
    } finally {
      setDeleteTarget(null);
    }
  };

  const paymentKPIs = [
    { title: t('finance.paymentsView.totalReceived'), value: "₹3,25,000", trend: t('finance.paymentsView.moneyInMonth'), isPositive: true, icon: ArrowDownLeft },
    { title: t('finance.paymentsView.totalPaid'), value: "₹1,45,000", trend: t('finance.paymentsView.moneyOutMonth'), isPositive: false, icon: ArrowUpRight },
    { title: t('finance.paymentsView.pendingReceivables'), value: "₹45,000", trend: t('finance.paymentsView.toCollect'), isPositive: true, icon: Clock },
    { title: t('finance.paymentsView.pendingPayables'), value: "₹12,000", trend: t('finance.paymentsView.toPay'), isPositive: false, icon: AlertCircle },
  ];
  const columns = [
    { header: t('finance.paymentsView.date'), accessorKey: 'date', cell: (row: any) => <span className="text-sm font-medium text-on-surface-variant">{row.date}</span> },
    { header: t('finance.paymentsView.refId'), accessorKey: 'id', cell: (row: any) => <span className="font-bold text-on-surface">{row.id}</span> },
    { header: t('finance.paymentsView.type'), accessorKey: 'type', cell: (row: any) => (
      <div className="flex items-center gap-1.5">
        {row.type === 'Money In' ? (
          <ArrowDownLeft className="w-4 h-4 text-success" />
        ) : (
          <ArrowUpRight className="w-4 h-4 text-error" />
        )}
        <span className={`text-xs font-bold ${row.type === 'Money In' ? 'text-success' : 'text-error'}`}>
          {row.type}
        </span>
      </div>
    )},
    { header: t('finance.paymentsView.partyName'), accessorKey: 'party', cell: (row: any) => <span className="font-semibold text-on-surface">{row.party}</span> },
    { header: t('finance.paymentsView.amount'), accessorKey: 'amount', cell: (row: any) => (
      <span className={`font-black ${row.type === 'Money In' ? 'text-success' : 'text-on-surface'}`}>
        {row.type === 'Money In' ? '+' : '-'}₹{row.amount.toLocaleString()}
      </span>
    )},
    { header: t('finance.paymentsView.method'), accessorKey: 'method', cell: (row: any) => <span className="text-sm font-medium text-on-surface-variant">{row.method}</span> },
    { header: t('finance.paymentsView.status'), accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.status} /> },
    { header: t('finance.paymentsView.actions'), accessorKey: 'actions', cell: (row: any) => (
      <div className="flex items-center gap-2">
        <Link href={`/payments/${row.id}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
            <Eye className="w-4 h-4" />
          </Button>
        </Link>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
          <Printer className="w-4 h-4" />
        </Button>
        <ActionGuard permission="payments.delete">
          <Button variant="ghost" size="icon" onClick={() => setDeleteTarget({ id: row.id, name: row.id })} className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors">
            <Trash2 className="w-4 h-4" />
          </Button>
        </ActionGuard>
      </div>
    )},
  ];

  return (
    <div className="min-h-full flex-1 flex flex-col bg-background p-4 md:p-6 lg:p-8 w-full min-w-0">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">{t('finance.paymentsView.payments')}</h2>
          <p className="text-sm font-medium text-on-surface-variant">{t('finance.paymentsView.trackPayments')}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            {t('finance.paymentsView.exportStatement')}
          </Button>
          <ActionGuard permission="payments.create">
            <Link href="/payments/new" className="flex-1 md:flex-none">
              <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none">
                <Plus className="w-4 h-4" />
                {t('finance.paymentsView.recordPayment')}
              </Button>
            </Link>
          </ActionGuard>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {paymentKPIs.map((kpi, idx) => (
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
              placeholder={t('finance.paymentsView.searchPlaceholder')}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium transition-all text-on-surface placeholder:text-on-surface-variant/50"
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface bg-surface font-semibold gap-2">
            <Filter className="w-4 h-4" />
            {t('finance.paymentsView.filters')}
          </Button>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <DataTable 
            columns={columns} 
            data={paymentList} 
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
