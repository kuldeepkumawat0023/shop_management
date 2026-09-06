'use client';

import React from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Plus, Download, Filter, Search, Users, UserCheck, UserPlus, IndianRupee } from 'lucide-react';
import Link from 'next/link';

import { customerService } from '@/lib/services/customer.services';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import ActionGuard from '@/components/auth/ActionGuard';
import { ViewPageSkeleton } from '@/components/common/ViewPageSkeleton';
import { DeleteModal } from '@/components/common/DeleteModal';
import { ActionButtons } from '@/components/common/ActionButtons';

export default function CustomersView() {
  const { t } = useTranslation();
  const [customers, setCustomers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await customerService.getCustomers();
      if (res.success && res.data) {
        setCustomers(res.data);
      }
    } catch (error) {
      toast.error(t('parties.customersView.loadError'), { id: 'failed-to-load-customers' });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const [deleteTarget, setDeleteTarget] = React.useState<{ id: string, name: string } | null>(null);

  const executeDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await customerService.deleteCustomer(deleteTarget.id);
      if (res.success) {
        toast.success(t('parties.customersView.deletedSuccess'));
        fetchCustomers();
      } else {
        toast.error(res.message || t('parties.customersView.deleteFailed'));
      }
    } catch (error) {
      toast.error(t('parties.customersView.deleteFailed'), { id: 'failed-to-delete-customer' });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };
  const columns = [
    { header: t('parties.customersView.name'), accessorKey: 'name', cell: (row: any) => <span className="font-semibold text-primary">{row.name}</span> },
    { header: t('parties.customersView.emailPhone'), accessorKey: 'contact', cell: (row: any) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-on-surface">{row.email || t('parties.customersView.na')}</span>
        <span className="text-xs text-on-surface-variant">{row.mobile}</span>
      </div>
    )},
    { header: t('parties.customersView.outstandingDue'), accessorKey: 'dueAmount', cell: (row: any) => <span className="font-bold text-on-surface">₹{(row.dueAmount || 0).toLocaleString()}</span> },
    { header: t('parties.customersView.creditLimit'), accessorKey: 'creditLimit', cell: (row: any) => <span className="text-sm text-on-surface-variant">₹{(row.creditLimit || 0).toLocaleString()}</span> },
    { header: t('parties.customersView.status'), accessorKey: 'isActive', cell: (row: any) => <StatusBadge status={row.isActive !== false ? 'Active' : 'Inactive'} /> },
    { header: t('parties.customersView.actions'), accessorKey: 'actions', cell: (row: any) => (
      <ActionButtons
        module="customers"
        view={{ href: `/customers/${row._id}` }}
        edit={{ href: `/customers/${row._id}/edit` }}
        delete={{ onClick: () => handleDeleteClick(row._id, row.name) }}
      />
    )},
  ];

  const filteredCustomers = customers.filter(c => 
    (c.name && c.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (c.mobile && c.mobile.includes(searchQuery)) ||
    (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // KPIs calculation
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.isActive !== false).length;
  // Calculate new this month
  const currentMonth = new Date().getMonth();
  const newThisMonth = customers.filter(c => c.createdAt ? new Date(c.createdAt).getMonth() === currentMonth : false).length;
  // Total Receivables (using dueAmount as a placeholder)
  const totalReceivables = customers.reduce((sum, c) => sum + (Number(c.dueAmount) || 0), 0);

  const customerKPIs = [
    { title: t('parties.customersView.totalCustomers'), value: totalCustomers.toString(), trend: t('parties.customersView.allTime'), isPositive: true, icon: Users },
    { title: t('parties.customersView.activeCustomers'), value: activeCustomers.toString(), trend: t('parties.customersView.currentlyActive'), isPositive: true, icon: UserCheck },
    { title: t('parties.customersView.newThisMonth'), value: newThisMonth.toString(), trend: t('parties.customersView.currentMonth'), isPositive: true, icon: UserPlus },
    { title: t('parties.customersView.totalReceivables'), value: `₹${totalReceivables.toLocaleString()}`, trend: t('parties.customersView.outstandingDue'), isPositive: false, icon: IndianRupee },
  ];

  if (loading) return <ViewPageSkeleton />;

  return (
    <div className="min-h-full flex-1 flex flex-col bg-background p-4 md:p-6 lg:p-8 w-full min-w-0">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">{t('parties.customersView.customers')}</h2>
          <p className="text-sm font-medium text-on-surface-variant">{t('parties.customersView.manageCustomers')}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <ActionGuard permission="customers.create">
            <Link href="/customers/new" className="flex-1 md:flex-none">
              <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none">
                <Plus className="w-4 h-4" />
                {t('parties.customersView.addCustomer')}
              </Button>
            </Link>
          </ActionGuard>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {customerKPIs.map((kpi, idx) => (
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('parties.customersView.searchPlaceholder')}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium transition-all text-on-surface placeholder:text-on-surface-variant/50"
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface bg-surface font-semibold gap-2">
            <Filter className="w-4 h-4" />
            {t('parties.customersView.filters')}
          </Button>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          {loading ? (
            <div className="p-8 text-center text-on-surface-variant">{t('parties.customersView.loadingCustomers')}</div>
          ) : (
            <DataTable 
              columns={columns} 
              data={filteredCustomers} 
            />
          )}
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
