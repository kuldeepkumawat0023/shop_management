'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { ViewPageSkeleton } from '@/components/common/ViewPageSkeleton';
import { Plus, Download, Factory, CheckCircle2, Eye, Trash2, Activity, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { productionService } from '@/lib/services/production.services';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import ActionGuard from '@/components/auth/ActionGuard';
import { DeleteModal } from '@/components/common/DeleteModal';

export default function ProductionsView() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [productionsData, setProductionsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [t('manufacturing.productionsView.allRuns'), t('manufacturing.productionsView.completed')];
  const [activeTab, setActiveTab] = useState('All Runs');
  React.useEffect(() => {
    setActiveTab(t('manufacturing.productionsView.allRuns'));
  }, [t]);

  useEffect(() => {
    fetchProductions();
  }, []);

  const fetchProductions = async () => {
    try {
      const res = await productionService.getProductions();
      if (res.success) {
        setProductionsData(res.data.map((prod: any) => ({
          id: prod._id,
          recipe: prod.finalProductId?.name || prod.recipeId?.finalProductId?.name || 'Unknown',
          startDate: new Date(prod.productionDate || prod.createdAt).toLocaleDateString('en-IN'),
          quantityProduced: prod.quantityProduced,
          cost: prod.totalCost || 0,
          status: t('manufacturing.productionsView.completed'),
          loggedBy: prod.userId?.name || 'Unknown',
        })));
      }
    } catch (err) {
      console.error('Error fetching productions', err);
    } finally {
      setLoading(false);
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<{ id: string, name: string } | null>(null);

  const executeDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await productionService.deleteProduction(deleteTarget.id);
      if (res.success) {
        toast.success(t('manufacturing.productionsView.productionDeleted'));
        setProductionsData(prev => prev.filter(p => p.id !== deleteTarget.id));
      } else {
        toast.error(res.message || t('manufacturing.productionsView.deleteFailed'));
      }
    } catch (err) {
      toast.error(t('manufacturing.productionsView.deleteError'), { id: 'error-deleting-production-log' });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const filteredData = productionsData.filter(p => {
    const matchesSearch = p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.recipe.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === t('manufacturing.productionsView.allRuns') ? true : p.status === activeTab;
    return matchesSearch && matchesTab;
  });

  // Dynamic stats
  const totalRuns = productionsData.length;
  const totalCost = productionsData.reduce((sum, p) => sum + p.cost, 0);
  const totalProduced = productionsData.reduce((sum, p) => sum + p.quantityProduced, 0);

  const columns = [
    { header: t('manufacturing.productionsView.runId'), accessorKey: 'id', cell: (row: any) => <span className="font-bold text-on-surface font-mono text-xs">{row.id.slice(-6).toUpperCase()}</span> },
    { header: t('manufacturing.productionsView.product'), accessorKey: 'recipe', cell: (row: any) => <span className="font-semibold text-primary">{row.recipe}</span> },
    { header: t('manufacturing.productionsView.date'), accessorKey: 'startDate' },
    { header: t('manufacturing.productionsView.qtyProduced'), accessorKey: 'quantityProduced', cell: (row: any) => <span className="font-medium text-on-surface">{row.quantityProduced} {t('manufacturing.productionsView.units')}</span> },
    { header: t('manufacturing.productionsView.totalCost'), accessorKey: 'cost', cell: (row: any) => `₹${row.cost.toLocaleString()}` },
    { header: t('manufacturing.productionsView.loggedBy'), accessorKey: 'loggedBy' },
    { header: t('manufacturing.productionsView.status'), accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.status} /> },
    {
      header: t('manufacturing.productionsView.actions'), accessorKey: 'actions', cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Link href={`/manufacturing/productions/${row.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          <ActionGuard permission="productions.delete">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors" onClick={() => handleDeleteClick(row.id, row.recipe)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </ActionGuard>
        </div>
      )
    },
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
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">{t('manufacturing.productionsView.productionRuns')}</h2>
          <p className="text-sm font-medium text-on-surface-variant">{t('manufacturing.productionsView.trackProgress')}</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            {t('manufacturing.productionsView.exportLog')}
          </Button>
          <ActionGuard permission="productions.create">
            <Link href="/manufacturing/productions/new" className="flex-1 sm:flex-none w-full sm:w-auto">
              <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border-none whitespace-nowrap">
                <Plus className="w-4 h-4 shrink-0" />
                <span className="truncate">{t('manufacturing.productionsView.newProduction')}</span>
              </Button>
            </Link>
          </ActionGuard>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 shrink-0">
        <StatsCard
          title={t('manufacturing.productionsView.totalRunsStat')}
          value={totalRuns}
          icon={Factory}
          trendLabel={t('manufacturing.productionsView.allTime')}
          colorTheme="primary"
        />
        <StatsCard
          title={t('manufacturing.productionsView.unitsProducedStat')}
          value={totalProduced.toLocaleString()}
          icon={Activity}
          trendLabel={t('manufacturing.productionsView.totalOutput')}
          colorTheme="blue"
        />
        <StatsCard
          title={t('manufacturing.productionsView.successRate')}
          value={`${totalRuns > 0 ? '100' : '0'}%`}
          icon={CheckCircle2}
          trendLabel={t('manufacturing.productionsView.completedRuns')}
          colorTheme="success"
        />
        <StatsCard
          title={t('manufacturing.productionsView.totalProdCost')}
          value={`₹${totalCost >= 100000 ? (totalCost / 100000).toFixed(1) + 'L' : totalCost.toLocaleString()}`}
          icon={ClipboardList}
          trendLabel={t('manufacturing.productionsView.allTimeExpense')}
          colorTheme="yellow"
        />
      </div>

      {/* Productions Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <DataTable
          data={filteredData}
          columns={columns}
          searchPlaceholder={t('manufacturing.productionsView.searchPlaceholder')}
          itemsPerPage={10}
          headerContent={
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-2">
              <div className="flex items-center gap-2">
                <Factory className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-on-surface">{t('manufacturing.productionsView.productionLog')}</h3>
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
