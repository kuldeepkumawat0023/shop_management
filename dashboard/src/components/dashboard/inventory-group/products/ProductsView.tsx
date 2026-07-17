'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { Package, FolderTree, Trophy, FileEdit, Edit, Eye, Trash2, Plus } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ViewPageSkeleton } from '@/components/common/ViewPageSkeleton';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { productService } from '@/lib/services/product.services';
import { useTranslation } from 'react-i18next';
import ActionGuard from '@/components/auth/ActionGuard';
import { DeleteModal } from '@/components/common/DeleteModal';
import toast from 'react-hot-toast';

export default function ProductsView() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('All Products');
  React.useEffect(() => {
    setActiveTab(t('inventory.productsView.allProducts'));
  }, [t]);
  const [productsData, setProductsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const tabs = [t('inventory.productsView.allProducts'), t('inventory.productsView.published'), t('inventory.productsView.drafts')];

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.getProducts();
        if (res.success) {
          setProductsData(res.data.map((p: any) => ({
            ...p,
            id: p._id,
            brand: p.brand?.name || t('inventory.productsView.general'),
            category: p.category?.name || t('inventory.inventoryView.uncategorized'),
            stock: p.currentStock || 0,
            price: p.sellingPrice || 0,
            status: p.isActive !== false ? t('inventory.productsView.published') : t('inventory.productsView.draft')
          })));
        }
      } catch (err) {
        console.error('Error fetching products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const [deleteTarget, setDeleteTarget] = useState<{ id: string, name: string } | null>(null);

  const executeDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await productService.deleteProduct(deleteTarget.id);
      if (res.success || (res as any).status === 200) {
        toast.success(t('inventory.productsView.productDeleted', 'Product deleted successfully'));
        setProductsData(prev => prev.filter(p => p.id !== deleteTarget.id));
      } else {
        toast.error((res as any).message || t('inventory.productsView.deleteFailed', 'Failed to delete product'));
      }
    } catch (err) {
      toast.error(t('inventory.productsView.deleteError', 'An error occurred while deleting the product'));
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const filteredData = productsData.filter(item => {
    if (activeTab === t('inventory.productsView.allProducts')) return true;
    if (activeTab === t('inventory.productsView.published')) return item.status === t('inventory.productsView.published');
    if (activeTab === t('inventory.productsView.drafts')) return item.status === t('inventory.productsView.draft');
    return true;
  });

  const columns = [
    {
      header: t('inventory.productsView.productInfo'),
      accessorKey: 'name',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/20 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden text-on-surface-variant">
            {/* Fallback avatar/image block */}
            {row.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-on-surface truncate max-w-[200px] lg:max-w-[300px]">{row.name}</div>
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium mt-0.5">
              <span>{row.category}</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant/40" />
              <span>{row.brand}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      header: t('inventory.productsView.sku'),
      accessorKey: 'sku',
      cell: (row: any) => (
        <span className="text-xs font-mono font-medium text-on-surface-variant bg-surface-container px-2 py-1 rounded-md border border-outline-variant/10">
          {row.sku}
        </span>
      )
    },
    {
      header: t('inventory.productsView.price'),
      accessorKey: 'price',
      cell: (row: any) => (
        <span className="font-bold text-on-surface">₹{row.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      )
    },
    {
      header: t('inventory.productsView.stock'),
      accessorKey: 'stock',
      cell: (row: any) => {
        let stockStatus = t('inventory.productsView.inStock');
        if (row.stock === 0) stockStatus = t('inventory.productsView.outOfStock');
        else if (row.stock < 20) stockStatus = t('inventory.productsView.lowStock');

        return (
          <div className="flex flex-col gap-1">
            <span className="font-bold text-on-surface">{row.stock} <span className="text-xs text-on-surface-variant font-medium">{t('inventory.productsView.units')}</span></span>
            <span className={cn(
              "text-[10px] uppercase tracking-widest font-bold",
              stockStatus === t('inventory.productsView.outOfStock') ? 'text-error' : stockStatus === t('inventory.productsView.lowStock') ? 'text-warning' : 'text-success'
            )}>
              {stockStatus}
            </span>
          </div>
        );
      }
    },
    {
      header: t('inventory.productsView.status'),
      accessorKey: 'status',
      cell: (row: any) => (
        <StatusBadge
          status={row.status}
          variant="dot"
          colorTheme={row.status === t('inventory.productsView.published') ? 'success' : 'secondary'}
        />
      )
    },
    {
      header: t('inventory.productsView.actions'),
      accessorKey: 'id',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Link href={`/products/${row.id}`}>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          <ActionGuard permission="products.update">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10">
              <Edit className="w-4 h-4" />
            </Button>
          </ActionGuard>
          <ActionGuard permission="products.delete">
            <Button size="icon" variant="ghost" onClick={() => handleDeleteClick(row.id, row.name)} className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10">
              <Trash2 className="w-4 h-4" />
            </Button>
          </ActionGuard>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">{t('inventory.productsView.productsManagement')}</h1>
          <p className="text-sm font-medium text-on-surface-variant mt-1">
            {t('inventory.productsView.manageCatalog')}
          </p>
        </div>
        <ActionGuard permission="products.create">
          <Link href="/products/new">
            <Button className="w-full sm:w-auto shadow-md">
              <Plus className="w-5 h-5 mr-2" />
              {t('inventory.productsView.addNewProduct')}
            </Button>
          </Link>
        </ActionGuard>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 shrink-0">
        <StatsCard
          title={t('inventory.productsView.totalProducts')}
          value={productsData.length}
          icon={Package}
          trendLabel={t('inventory.productsView.activeItems')}
          colorTheme="primary"
        />
        <StatsCard
          title={t('inventory.productsView.activeCategories')}
          value={new Set(productsData.map(p => p.category)).size}
          icon={FolderTree}
          trendLabel={t('inventory.productsView.mappedCategories')}
          colorTheme="secondary"
        />
        <StatsCard
          title={t('inventory.productsView.topSelling')}
          value="Galaxy S24"
          icon={Trophy}
          trendLabel={t('inventory.productsView.thisWeek')}
          colorTheme="success"
        />
        <StatsCard
          title={t('inventory.productsView.draftsInactive')}
          value={productsData.filter(p => p.status === t('inventory.productsView.draft')).length}
          icon={FileEdit}
          trendLabel={t('inventory.productsView.notPublished')}
          colorTheme="warning"
        />
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <DataTable
          data={filteredData}
          columns={columns}
          searchPlaceholder={t('inventory.productsView.searchPlaceholder')}
          itemsPerPage={10}
          headerContent={
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-2">
              <h2 className="text-xl font-bold text-on-surface">{t('inventory.productsView.productCatalog')}</h2>
              {TabsComponent}
            </div>
          }
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
