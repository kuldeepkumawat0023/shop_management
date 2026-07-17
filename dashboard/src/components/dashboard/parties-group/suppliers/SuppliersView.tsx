'use client';

import React from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Plus, Download, Filter, Search, Truck, CheckCircle2, UserPlus, IndianRupee, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

// We will use React state for these instead of static arrays

import { supplierService } from '@/lib/services/supplier.services';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import ActionGuard from '@/components/auth/ActionGuard';
import { ViewPageSkeleton } from '@/components/common/ViewPageSkeleton';

export default function SuppliersView() {
  const [suppliers, setSuppliers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { t } = useTranslation();

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await supplierService.getSuppliers();
      if (res.success && res.data) {
        setSuppliers(res.data);
      }
    } catch (error) {
      toast.error('Failed to load suppliers', { id: 'failed-to-load-suppliers' });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm(t('suppliers.suppliersView.confirmDelete'))) {
      try {
        const res = await supplierService.deleteSupplier(id);
        if (res.success) {
          toast.success(t('suppliers.suppliersView.deleteSuccess'));
          fetchSuppliers();
        } else {
          toast.error(res.message || t('suppliers.suppliersView.deleteFailed'));
        }
      } catch (error) {
        toast.error(t('suppliers.suppliersView.deleteFailed'), { id: 'failed-to-delete-supplier' });
      }
    }
  };
  const columns = [
    { header: t('suppliers.suppliersView.company'), accessorKey: 'name', cell: (row: any) => (
      <div className="flex flex-col">
        <span className="font-semibold text-primary">{row.name}</span>
        <span className="text-xs text-on-surface-variant">{t('suppliers.suppliersView.contact')} {row.contactPerson}</span>
      </div>
    )},
    { header: t('suppliers.suppliersView.emailPhone'), accessorKey: 'contact', cell: (row: any) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-on-surface">{row.email || t('suppliers.suppliersView.na')}</span>
        <span className="text-xs text-on-surface-variant">{row.mobile}</span>
      </div>
    )},
    { header: t('suppliers.suppliersView.gstin'), accessorKey: 'gstin', cell: (row: any) => <span className="font-mono text-sm text-on-surface-variant">{row.gstin || t('suppliers.suppliersView.na')}</span> },
    { header: t('suppliers.suppliersView.balance'), accessorKey: 'balance', cell: (row: any) => <span className="font-bold text-on-surface">₹{(row.balance || 0).toLocaleString()}</span> },
    { header: t('suppliers.suppliersView.status'), accessorKey: 'isActive', cell: (row: any) => <StatusBadge status={row.isActive !== false ? 'Active' : 'Inactive'} /> },
    { header: t('suppliers.suppliersView.actions'), accessorKey: 'actions', cell: (row: any) => (
      <div className="flex items-center gap-2">
        <Link href={`/suppliers/${row._id}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
            <Eye className="w-4 h-4" />
          </Button>
        </Link>
        <ActionGuard permission="suppliers.update">
          <Link href={`/suppliers/${row._id}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
        </ActionGuard>
        <ActionGuard permission="suppliers.delete">
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row._id)} className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors">
            <Trash2 className="w-4 h-4" />
          </Button>
        </ActionGuard>
      </div>
    )},
  ];

  const filteredSuppliers = suppliers.filter(s => 
    (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (s.contactPerson && s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.mobile && s.mobile.includes(searchQuery))
  );

  // KPIs calculation
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.isActive !== false).length;
  const currentMonth = new Date().getMonth();
  const newThisMonth = suppliers.filter(s => s.createdAt ? new Date(s.createdAt).getMonth() === currentMonth : false).length;
  const totalPayables = suppliers.reduce((sum, s) => sum + (Number(s.balance) || 0), 0);

  const getSupplierKPIs = (t: any) => [
    { title: t('suppliers.suppliersView.totalSuppliers'), value: totalSuppliers.toString(), trend: t('suppliers.suppliersView.allTime'), isPositive: true, icon: Truck },
    { title: t('suppliers.suppliersView.activePartners'), value: activeSuppliers.toString(), trend: t('suppliers.suppliersView.currentlyActive'), isPositive: true, icon: CheckCircle2 },
    { title: t('suppliers.suppliersView.newThisMonth'), value: newThisMonth.toString(), trend: t('suppliers.suppliersView.currentMonth'), isPositive: true, icon: UserPlus },
    { title: t('suppliers.suppliersView.totalPayables'), value: `₹${totalPayables.toLocaleString()}`, trend: t('suppliers.suppliersView.outstandingBalance'), isPositive: false, icon: IndianRupee },
  ];

  if (loading) return <ViewPageSkeleton />;

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full ">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">{t('suppliers.suppliersView.suppliers')}</h2>
          <p className="text-sm font-medium text-on-surface-variant">{t('suppliers.suppliersView.manageSuppliers')}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            {t('suppliers.suppliersView.export')}
          </Button>
          <ActionGuard permission="suppliers.create">
            <Link href="/suppliers/new" className="flex-1 md:flex-none">
              <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none">
                <Plus className="w-4 h-4" />
                {t('suppliers.suppliersView.addSupplier')}
              </Button>
            </Link>
          </ActionGuard>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {getSupplierKPIs(t).map((kpi, idx) => (
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
              placeholder={t('suppliers.suppliersView.searchPlaceholder')}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium transition-all text-on-surface placeholder:text-on-surface-variant/50"
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface bg-surface font-semibold gap-2">
            <Filter className="w-4 h-4" />
            {t('suppliers.suppliersView.filters')}
          </Button>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          {loading ? (
            <div className="p-8 text-center text-on-surface-variant">{t('suppliers.suppliersView.loadingSuppliers')}</div>
          ) : (
            <DataTable 
              columns={columns} 
              data={filteredSuppliers} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
