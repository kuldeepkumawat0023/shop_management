'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { Package, AlertTriangle, AlertCircle, Banknote, Eye } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ViewPageSkeleton } from '@/components/common/ViewPageSkeleton';
import { cn } from '@/utils/cn';
import { productService } from '@/lib/services/product.services';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function InventoryView() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('All Items');
  React.useEffect(() => {
    setActiveTab(t('inventory.inventoryView.allItems'));
  }, [t]);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const tabs = [t('inventory.inventoryView.allItems'), t('inventory.inventoryView.lowStock'), t('inventory.inventoryView.outOfStock')];

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.getProducts();
        if (res.success) {
          setInventoryData(res.data.map((p: any) => {
            const stock = p.currentStock || 0;
            const minStock = p.minStockLevel || 10;
            let status = t('inventory.inventoryView.inStock');
            if (stock === 0) status = t('inventory.inventoryView.outOfStock');
            else if (stock <= minStock) status = t('inventory.inventoryView.lowStock');

            return {
              ...p,
              id: p._id,
              name: p.name,
              category: p.categoryId?.name || p.category?.name || t('inventory.inventoryView.uncategorized'),
              sku: p.sku || t('inventory.inventoryView.na'),
              stock: stock,
              minStock: minStock,
              price: p.sellingPrice || 0,
              status: status
            };
          }));
        }
      } catch (err) {
        console.error('Error fetching inventory products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredData = inventoryData.filter(item => {
    if (activeTab === t('inventory.inventoryView.allItems')) return true;
    if (activeTab === t('inventory.inventoryView.lowStock')) return item.status === t('inventory.inventoryView.lowStock');
    if (activeTab === t('inventory.inventoryView.outOfStock')) return item.status === t('inventory.inventoryView.outOfStock');
    return true;
  });

  const columns = [
    {
      header: t('inventory.inventoryView.productDetails'),
      accessorKey: 'name',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-primary/20 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
            {row.image ? (
              <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center">
                {row.name.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="font-bold text-on-surface truncate max-w-[200px] lg:max-w-[300px]">{row.name}</div>
            <div className="text-xs text-on-surface-variant font-medium">{row.category}</div>
          </div>
        </div>
      )
    },
    {
      header: t('inventory.inventoryView.sku'),
      accessorKey: 'sku',
      cell: (row: any) => (
        <span className="text-xs font-mono font-medium text-on-surface-variant bg-surface-container px-2 py-1 rounded-md border border-outline-variant/10">
          {row.sku}
        </span>
      )
    },
    {
      header: t('inventory.inventoryView.stock'),
      accessorKey: 'stock',
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className={cn(
            "font-black text-base",
            row.stock === 0 ? "text-error" : row.stock <= row.minStock ? "text-warning" : "text-success"
          )}>
            {row.stock} <span className="text-xs font-medium text-on-surface-variant">{t('inventory.inventoryView.units')}</span>
          </span>
          <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">{t('inventory.inventoryView.min')} {row.minStock}</span>
        </div>
      )
    },
    {
      header: t('inventory.inventoryView.unitPrice'),
      accessorKey: 'price',
      cell: (row: any) => (
        <span className="font-bold text-on-surface">₹{row.price.toFixed(2)}</span>
      )
    },
    {
      header: t('inventory.inventoryView.status'),
      accessorKey: 'status',
      cell: (row: any) => (
        <StatusBadge variant="dot" animate={row.status === t('inventory.inventoryView.outOfStock') || row.status === t('inventory.inventoryView.lowStock')} status={row.status} />
      )
    },
    {
      header: t('inventory.inventoryView.actions'),
      accessorKey: 'id',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Link href={`/inventory/${row.id}`}>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )
    }
  ];

  const TabsComponent = (
    <div className="flex space-x-1 bg-surface-container-low p-1 rounded-lg w-fit">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={cn(
            "px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-md transition-all",
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
    <div className="flex flex-col h-full bg-background p-4 md:p-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">{t('inventory.inventoryView.inventoryStatus')}</h1>
          <p className="text-sm font-medium text-on-surface-variant mt-1">
            {t('inventory.inventoryView.monitorStock')}
          </p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 shrink-0">
        <StatsCard
          title={t('inventory.inventoryView.totalProducts')}
          value={inventoryData.length}
          icon={Package}
          trendLabel={t('inventory.inventoryView.uniqueItems')}
          colorTheme="primary"
        />
        <StatsCard
          title={t('inventory.inventoryView.totalStockValue')}
          value={`₹${inventoryData.reduce((acc, curr) => acc + (curr.price * curr.stock), 0).toLocaleString('en-IN')}`}
          icon={Banknote}
          trendLabel={t('inventory.inventoryView.currentEstimate')}
          colorTheme="purple"
        />
        <StatsCard
          title={t('inventory.inventoryView.lowStock')}
          value={inventoryData.filter(i => i.status === t('inventory.inventoryView.lowStock')).length}
          icon={AlertTriangle}
          trendLabel={t('inventory.inventoryView.needsReorder')}
          colorTheme="warning"
        />
        <StatsCard
          title={t('inventory.inventoryView.outOfStock')}
          value={inventoryData.filter(i => i.status === t('inventory.inventoryView.outOfStock')).length}
          icon={AlertCircle}
          trendLabel={t('inventory.inventoryView.unavailable')}
          colorTheme="error"
        />
      </div>

      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col min-h-[400px]">
        <DataTable
          data={filteredData}
          columns={columns}
          headerContent={
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 w-full">
              <div className="flex items-center gap-2 shrink-0">
                <h2 className="text-lg font-bold text-on-surface">{t('inventory.inventoryView.productList')}</h2>
                <StatusBadge status={t('inventory.inventoryView.liveSync')} variant="dot" colorTheme="success" className="ml-2 bg-success/10 text-success border-success/20" />
              </div>
              {TabsComponent}
            </div>
          }
          searchPlaceholder={t('inventory.inventoryView.searchPlaceholder')}
          className="border-none shadow-none bg-transparent"
          itemsPerPage={10}
        />
      </div>
    </div>
  );
}
