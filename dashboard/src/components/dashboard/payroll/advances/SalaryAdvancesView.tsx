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
import { DeleteModal } from '@/components/common/DeleteModal';
import { ViewPageSkeleton } from '@/components/common/ViewPageSkeleton';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

export default function SalaryAdvancesView() {
  const { t } = useTranslation();
  const [advances, setAdvances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs setup
  const tabs = [
    t('payroll.advancesView.tabs.all'),
    t('payroll.advancesView.tabs.approved'),
    t('payroll.advancesView.tabs.pending'),
    t('payroll.advancesView.tabs.settled')
  ];
  const [activeTab, setActiveTab] = useState('All Advances');
  React.useEffect(() => {
    setActiveTab(t('payroll.advancesView.tabs.all'));
  }, [t]);

  const fetchAdvances = async () => {
    setLoading(true);
    try {
      const res = await payrollService.getAdvances();
      if (res.success && res.data) {
        // Flatten data for DataTable search
        const flatData = res.data.map((a: any) => ({
          ...a,
          id: a._id,
          employeeName: a.staffId?.name || t('payroll.advancesView.columns.unknown'),
          formattedDate: a.advanceDate ? new Date(a.advanceDate).toLocaleDateString() : '-',
          displayId: a._id?.substring(a._id.length - 6).toUpperCase(),
          repaymentTermsFormatted: a.repaymentTerm === 'EMI' ? `₹${a.emiAmount}/mo` : a.repaymentTerm
        }));
        setAdvances(flatData);
      }
    } catch (error) {
      toast.error(t('payroll.advancesView.messages.loadFailed'), { id: 'failed-to-load-advances' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvances();
  }, []);

  const filteredAdvances = advances.filter((a) => {
    if (activeTab === t('payroll.advancesView.tabs.all')) return true;
    if (activeTab === t('payroll.advancesView.tabs.approved')) return a.status === 'Approved';
    if (activeTab === t('payroll.advancesView.tabs.pending')) return a.status === 'Pending';
    if (activeTab === t('payroll.advancesView.tabs.settled')) return a.status === 'Settled';
    return true;
  });

  // KPI aggregation
  const totalAdvanceAmount = advances.filter(a => a.status === 'Approved' || a.status === 'Settled').reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
  const pendingRequests = advances.filter(a => a.status === 'Pending').length;
  const approvedAdvances = advances.filter(a => a.status === 'Approved').length;
  const settledAdvances = advances.filter(a => a.status === 'Settled').length;

  const advanceKPIs = [
    { title: t('payroll.advancesView.kpi.totalAdvanced'), value: `₹${totalAdvanceAmount.toLocaleString()}`, trend: t('payroll.advancesView.kpi.lifetimeDisbursed'), isPositive: true, icon: Banknote },
    { title: t('payroll.advancesView.kpi.activeApproved'), value: approvedAdvances.toString(), trend: t('payroll.advancesView.kpi.awaitingSettlement'), isPositive: true, icon: HandCoins },
    { title: t('payroll.advancesView.kpi.pendingRequests'), value: pendingRequests.toString(), trend: t('payroll.advancesView.kpi.needsReview'), isPositive: pendingRequests === 0, icon: UserMinus },
    { title: t('payroll.advancesView.kpi.settled'), value: settledAdvances.toString(), trend: t('payroll.advancesView.kpi.fullyRecovered'), isPositive: true, icon: Plus }, 
  ];

  const [deleteTarget, setDeleteTarget] = useState<{ id: string, name: string } | null>(null);

  const executeDelete = async () => {
    if (!deleteTarget) return;
    
    try {
      const res = await payrollService.deleteAdvance(deleteTarget.id);
      if (res.success) {
        toast.success(t('payroll.advancesView.messages.advanceDeleted'));
        setAdvances(prev => prev.filter(p => p.id !== deleteTarget.id));
      } else {
        toast.error(res.message || t('payroll.advancesView.messages.deleteFailed'));
      }
    } catch (err) {
      toast.error(t('payroll.advancesView.messages.deleteError'), { id: 'error-deleting-advance' });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const columns = [
    { header: t('payroll.advancesView.columns.refId'), accessorKey: 'displayId', cell: (row: any) => <span className="font-bold text-on-surface">{row.displayId}</span> },
    { header: t('payroll.advancesView.columns.employee'), accessorKey: 'employeeName', cell: (row: any) => <span className="font-semibold text-primary">{row.employeeName}</span> },
    { header: t('payroll.advancesView.columns.amount'), accessorKey: 'amount', cell: (row: any) => <span className="font-bold text-on-surface">₹{row.amount?.toLocaleString()}</span> },
    { header: t('payroll.advancesView.columns.dateRequested'), accessorKey: 'formattedDate' },
    { header: t('payroll.advancesView.columns.repaymentTerms'), accessorKey: 'repaymentTermsFormatted', cell: (row: any) => <span className="text-sm font-medium text-on-surface">{row.repaymentTermsFormatted}</span> },
    { header: t('payroll.advancesView.columns.status'), accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.status} /> },
    { header: t('payroll.advancesView.columns.actions'), accessorKey: 'actions', cell: (row: any) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
          <Eye className="w-4 h-4" />
        </Button>
        <ActionGuard permission="payroll.delete">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors" onClick={() => handleDeleteClick(row.id, row.displayId)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </ActionGuard>
      </div>
    )},
  ];

  const TabsComponent = (
    <div className="flex space-x-1 bg-surface-container-low p-1 rounded-lg w-fit overflow-x-auto max-w-[calc(100vw-2rem)] no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={cn(
            "px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-md transition-all whitespace-nowrap",
            activeTab === tab
              ? "gradient-button text-white shadow-md"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  if (loading) return <ViewPageSkeleton />;

  return (
    <div className="flex flex-col bg-background p-4 md:p-6 lg:p-8 w-full ">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">{t('payroll.advancesView.title')}</h2>
          <p className="text-sm font-medium text-on-surface-variant">{t('payroll.advancesView.subtitle')}</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            {t('payroll.advancesView.exportData')}
          </Button>
          <ActionGuard permission="payroll.create">
            <Link href="/payroll/advances/new" className="flex-1 sm:flex-none w-full sm:w-auto">
              <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border-none whitespace-nowrap">
                <Plus className="w-4 h-4 shrink-0" />
                <span className="truncate">{t('payroll.advancesView.grantAdvance')}</span>
              </Button>
            </Link>
          </ActionGuard>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 shrink-0">
        {advanceKPIs.map((kpi, idx) => (
          <StatsCard key={idx} {...kpi} />
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <DataTable 
          data={filteredAdvances} 
          columns={columns} 
          searchPlaceholder={t('payroll.advancesView.searchPlaceholder')}
          itemsPerPage={10}
          headerContent={
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-2">
              <div className="flex items-center gap-2">
                <Banknote className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-on-surface">{t('payroll.advancesView.tableTitle')}</h3>
              </div>
              {TabsComponent}
            </div>
          }
          className="border-none shadow-none"
        />
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
