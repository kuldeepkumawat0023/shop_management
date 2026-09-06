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
import ActionGuard from '@/components/auth/ActionGuard';
import { ViewPageSkeleton } from '@/components/common/ViewPageSkeleton';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

export default function StaffSalaryView() {
  const { t } = useTranslation();
  const [salaries, setSalaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs setup
  const tabs = [t('payroll.salaryView.tabs.all'), t('payroll.salaryView.tabs.paid'), t('payroll.salaryView.tabs.pending')];
  const [activeTab, setActiveTab] = useState('All Salaries');
  React.useEffect(() => {
    setActiveTab(t('payroll.salaryView.tabs.all'));
  }, [t]);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const res = await payrollService.getSalaries();
      if (res.success && res.data) {
        // Flatten data for DataTable search
        const flatData = res.data.map((s: any) => ({
          ...s,
          id: s._id,
          employeeName: s.staffId?.name || t('payroll.salaryView.columns.unknown'),
          employeeRole: s.staffId?.role || '',
          formattedPaymentDate: s.paymentDate ? new Date(s.paymentDate).toLocaleDateString() : '-',
          displayId: s._id?.substring(s._id.length - 6).toUpperCase()
        }));
        setSalaries(flatData);
      }
    } catch (error) {
      toast.error(t('payroll.salaryView.messages.loadFailed'), { id: 'failed-to-load-salaries' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const filteredSalaries = salaries.filter(s => {
    if (activeTab === t('payroll.salaryView.tabs.all')) return true;
    return s.status === (activeTab === t('payroll.salaryView.tabs.paid') ? 'Paid' : 'Pending');
  });

  // KPI aggregation
  const totalDisbursed = salaries.filter(s => s.status === 'Paid').reduce((sum, s) => sum + (Number(s.netSalary) || 0), 0);
  const totalDeductions = salaries.reduce((sum, s) => sum + (Number(s.deductions) || 0), 0);
  const pendingPayments = salaries.filter(s => s.status === 'Pending').length;
  const totalRecords = salaries.length;

  const salaryKPIs = [
    { title: t('payroll.salaryView.kpi.netDisbursed'), value: `₹${totalDisbursed.toLocaleString()}`, trend: t('payroll.salaryView.kpi.lifetimePaid'), isPositive: true, icon: Wallet },
    { title: t('payroll.salaryView.kpi.totalDeductions'), value: `₹${totalDeductions.toLocaleString()}`, trend: t('payroll.salaryView.kpi.leavesAdvances'), isPositive: false, icon: AlertCircle },
    { title: t('payroll.salaryView.kpi.pendingSalaries'), value: pendingPayments.toString(), trend: t('payroll.salaryView.kpi.awaitingPayment'), isPositive: pendingPayments === 0, icon: CalendarClock },
    { title: t('payroll.salaryView.kpi.salaryRecords'), value: totalRecords.toString(), trend: t('payroll.salaryView.kpi.totalProcessed'), isPositive: true, icon: CheckCircle2 },
  ];

  const columns = [
    { header: t('payroll.salaryView.columns.id'), accessorKey: 'displayId', cell: (row: any) => <span className="font-bold text-on-surface">{row.displayId}</span> },
    { header: t('payroll.salaryView.columns.employee'), accessorKey: 'employeeName', cell: (row: any) => (
      <div className="flex flex-col">
        <span className="font-semibold text-primary">{row.employeeName}</span>
        <span className="text-xs text-on-surface-variant">{row.employeeRole}</span>
      </div>
    )},
    { header: t('payroll.salaryView.columns.baseSalary'), accessorKey: 'baseSalary', cell: (row: any) => <span className="font-medium text-on-surface">₹{row.baseSalary?.toLocaleString()}</span> },
    { header: t('payroll.salaryView.columns.deductions'), accessorKey: 'deductions', cell: (row: any) => <span className="font-medium text-error">-₹{row.deductions?.toLocaleString() || 0}</span> },
    { header: t('payroll.salaryView.columns.netSalary'), accessorKey: 'netSalary', cell: (row: any) => <span className="font-black text-on-surface">₹{row.netSalary?.toLocaleString()}</span> },
    { header: t('payroll.salaryView.columns.paymentDate'), accessorKey: 'formattedPaymentDate', cell: (row: any) => <span className="text-sm text-on-surface-variant">{row.formattedPaymentDate}</span> },
    { header: t('payroll.salaryView.columns.status'), accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.status} /> },
    { header: t('payroll.salaryView.columns.actions'), accessorKey: 'actions', cell: (row: any) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
          <Eye className="w-4 h-4" />
        </Button>
        {row.status === 'Pending' && (
          <ActionGuard permission="payroll.update">
            <Link href={`/payroll/staff/pay?employeeId=${row.staffId?._id || row.staffId}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-success hover:text-success hover:bg-success/10 transition-colors" title={t('payroll.salaryView.processSalary')}>
                <CreditCard className="w-4 h-4" />
              </Button>
            </Link>
          </ActionGuard>
        )}
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
    <div className="min-h-full flex-1 flex flex-col bg-background p-4 md:p-6 lg:p-8 w-full min-w-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">{t('payroll.salaryView.title')}</h2>
          <p className="text-sm font-medium text-on-surface-variant">{t('payroll.salaryView.subtitle')}</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            {t('payroll.salaryView.exportPayroll')}
          </Button>
          <ActionGuard permission="payroll.create">
            <Link href="/payroll/staff/pay" className="flex-1 sm:flex-none w-full sm:w-auto">
              <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border-none whitespace-nowrap">
                <Plus className="w-4 h-4 shrink-0" />
                <span className="truncate">{t('payroll.salaryView.processSalary')}</span>
              </Button>
            </Link>
          </ActionGuard>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 shrink-0">
        {salaryKPIs.map((kpi, idx) => (
          <StatsCard key={idx} {...kpi} />
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <DataTable 
          data={filteredSalaries} 
          columns={columns} 
          searchPlaceholder={t('payroll.salaryView.searchPlaceholder')}
          itemsPerPage={10}
          headerContent={
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-on-surface">{t('payroll.salaryView.tableTitle')}</h3>
              </div>
              {TabsComponent}
            </div>
          }
          className="border-none shadow-none"
        />
      </div>
    </div>
  );
}
