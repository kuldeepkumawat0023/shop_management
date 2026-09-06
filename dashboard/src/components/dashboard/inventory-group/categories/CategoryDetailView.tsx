'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DetailViewSkeleton } from '@/components/common/DetailViewSkeleton';
import { ArrowLeft, Edit, Trash2, Package, Plus, Eye, FolderTree, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { categoryService } from '@/lib/services/category.services';
import { productService } from '@/lib/services/product.services';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import ActionGuard from '@/components/auth/ActionGuard';
import { DeleteModal } from '@/components/common/DeleteModal';

interface CategoryDetailViewProps {
  categoryId: string;
}

export default function CategoryDetailView({ categoryId }: CategoryDetailViewProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Overview');
  React.useEffect(() => {
    setActiveTab(t('inventory.categoryDetail.overview'));
  }, [t]);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          categoryService.getCategories(),
          productService.getProducts()
        ]);
        
        if (catRes.success) {
          const cat = catRes.data.find((c: any) => c._id === categoryId);
          if (cat) {
            setCategoryData(cat);
          }
        }
        
        if (prodRes.success) {
          const prods = prodRes.data.filter((p: any) => p.category?._id === categoryId || p.category === categoryId);
          setCategoryProducts(prods.map((p: any) => ({
            ...p,
            id: p._id,
            brand: p.brand?.name || 'General',
            stock: p.currentStock || 0,
            price: p.sellingPrice || 0,
            status: p.isActive !== false ? 'Published' : 'Draft'
          })));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryId]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const executeDelete = async () => {
    try {
      const res = await categoryService.deleteCategory(categoryId);
      if (res.success || (res as any).status === 200) {
        toast.success(t('inventory.categoryDetail.categoryDeleted'));
        router.push('/categories');
      } else {
        toast.error(res.message || t('inventory.categoryDetail.deleteFailed'));
      }
    } catch (err) {
      toast.error(t('inventory.categoryDetail.deleteError'), { id: 'error-deleting-category' });
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Product Table columns
  const columns = [
    { 
      header: t('inventory.categoryDetail.productInfo'), 
      accessorKey: 'name',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/20 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden text-on-surface-variant">
            {row.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-on-surface truncate max-w-[200px] lg:max-w-[300px]">{row.name}</div>
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium mt-0.5">
              <span>{row.brand}</span>
            </div>
          </div>
        </div>
      )
    },
    { 
      header: t('inventory.categoryDetail.sku'), 
      accessorKey: 'sku',
      cell: (row: any) => (
        <span className="text-xs font-mono font-medium text-on-surface-variant bg-surface-container px-2 py-1 rounded-md border border-outline-variant/10">
          {row.sku || t('inventory.categoryDetail.na')}
        </span>
      )
    },
    { 
      header: t('inventory.categoryDetail.price'), 
      accessorKey: 'price',
      cell: (row: any) => (
        <span className="font-bold text-on-surface">₹{row.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      )
    },
    { 
      header: t('inventory.categoryDetail.stock'), 
      accessorKey: 'stock',
      cell: (row: any) => {
        let stockStatus = t('inventory.categoryDetail.inStock');
        if (row.stock === 0) stockStatus = t('inventory.categoryDetail.outOfStock');
        else if (row.stock < 20) stockStatus = t('inventory.categoryDetail.lowStock');
        
        return (
          <div className="flex flex-col gap-1">
            <span className="font-bold text-on-surface">{row.stock} <span className="text-xs text-on-surface-variant font-medium">{t('inventory.categoryDetail.units')}</span></span>
            <span className={cn(
              "text-[10px] uppercase tracking-widest font-bold",
              stockStatus === t('inventory.categoryDetail.outOfStock') ? 'text-error' : stockStatus === t('inventory.categoryDetail.lowStock') ? 'text-warning' : 'text-success'
            )}>
              {stockStatus}
            </span>
          </div>
        );
      }
    },
    {
      header: t('inventory.categoryDetail.status'),
      accessorKey: 'status',
      cell: (row: any) => (
        <StatusBadge 
          status={row.status} 
          variant="dot" 
          colorTheme={row.status === 'Published' ? 'success' : 'secondary'} 
        />
      )
    },
    {
      header: t('inventory.categoryDetail.actions'),
      accessorKey: 'id',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Link href={`/products/${row.id}`}>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          <ActionGuard permission="products.update">
            <Link href={`/products/${row.id}/edit`}>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
          </ActionGuard>
        </div>
      )
    }
  ];

  if (loading) return <DetailViewSkeleton />;

  if (!categoryData) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full text-center">
        <FolderTree className="w-16 h-16 text-outline-variant mb-4" />
        <h2 className="text-2xl font-bold text-on-surface">{t('inventory.categoryDetail.categoryNotFound')}</h2>
        <p className="text-on-surface-variant mt-2 mb-6">{t('inventory.categoryDetail.categoryNotFoundMsg')}</p>
        <Button onClick={() => router.back()}>{t('inventory.categoryDetail.goBack')}</Button>
      </div>
    );
  }

  return (
    <div className="min-h-full flex-1 flex flex-col bg-background p-4 md:p-6 lg:p-8 w-full min-w-0">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="w-10 h-10 shrink-0 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface hover:text-primary hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl gradient-button flex items-center justify-center font-bold text-white text-lg shadow-sm">
              {categoryData.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">{categoryData.name}</h1>
                <StatusBadge 
                  status={categoryData.isActive !== false ? 'Active' : 'Inactive'} 
                  variant="dot" 
                  colorTheme={categoryData.isActive !== false ? 'success' : 'error'} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0 ml-14 sm:ml-0">
          <ActionGuard permission="categories.update">
            <Link href={`/categories/${categoryId}/edit`} className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full shadow-sm rounded-xl">
                <Edit className="w-4 h-4 mr-2" /> {t('inventory.categoryDetail.edit')}
              </Button>
            </Link>
          </ActionGuard>
          <ActionGuard permission="categories.delete">
            <Button onClick={() => setShowDeleteModal(true)} variant="outline" className="flex-1 sm:flex-none text-error hover:bg-error/10 hover:border-error/30 shadow-sm rounded-xl">
              <Trash2 className="w-4 h-4 mr-2" /> {t('inventory.categoryDetail.delete')}
            </Button>
          </ActionGuard>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-surface-container-low p-1 rounded-xl w-fit mb-6">
        {[t('inventory.categoryDetail.overview'), t('inventory.categoryDetail.products')].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-2 text-sm font-bold rounded-lg transition-all",
              activeTab === tab
                ? "bg-surface shadow-sm text-primary"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface/50"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === t('inventory.categoryDetail.overview') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6">
              <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> {t('inventory.categoryDetail.categoryDescription')}
              </h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {categoryData.description || t('inventory.categoryDetail.noDescription')}
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" /> {t('inventory.categoryDetail.productsInCategory')}
                </h2>
                <Link href={`/products?category=${categoryData._id}`}>
                  <Button variant="ghost" className="text-sm font-bold text-primary">{t('inventory.categoryDetail.viewAll')}</Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {categoryProducts.slice(0, 3).map(product => (
                  <div key={product.id} className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/20 flex items-center justify-center font-bold text-xs text-on-surface-variant shrink-0">
                        {product.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-on-surface">{product.name}</div>
                        <div className="text-xs text-on-surface-variant mt-0.5">{product.sku || t('inventory.categoryDetail.na')}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-on-surface">₹{product.price.toLocaleString('en-IN')}</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">{product.stock} {t('inventory.categoryDetail.units')}</div>
                    </div>
                  </div>
                ))}
                {categoryProducts.length === 0 && (
                  <div className="text-center py-6 text-on-surface-variant text-sm">{t('inventory.categoryDetail.noProductsYet')}</div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6">
              <h2 className="text-lg font-bold text-on-surface mb-4">{t('inventory.categoryDetail.categoryStats')}</h2>
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t('inventory.categoryDetail.totalProducts')}</div>
                  <div className="text-2xl font-black text-on-surface">{categoryProducts.length}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t('inventory.categoryDetail.activeProducts')}</div>
                  <div className="text-2xl font-black text-primary">{categoryProducts.filter(p => p.status === 'Published').length}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t('inventory.categoryDetail.lowOutStock')}</div>
                  <div className="text-2xl font-black text-error">{categoryProducts.filter(p => p.stock < 10).length}</div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6">
              <h2 className="text-lg font-bold text-on-surface mb-4">{t('inventory.categoryDetail.details')}</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-medium text-on-surface-variant mb-1">{t('inventory.categoryDetail.created')}</div>
                  <div className="text-sm font-bold text-on-surface">{new Date(categoryData.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-on-surface-variant mb-1">{t('inventory.categoryDetail.lastUpdated')}</div>
                  <div className="text-sm font-bold text-on-surface">{new Date(categoryData.updatedAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === t('inventory.categoryDetail.products') && (
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          <DataTable 
            data={categoryProducts}
            columns={columns}
            searchPlaceholder={t('inventory.categoryDetail.searchPlaceholder')}
            itemsPerPage={10}
            headerContent={
              <div className="flex items-center justify-between gap-4 mb-2">
                <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" /> {t('inventory.categoryDetail.productsList')}
                </h2>
                <Link href="/products/new">
                  <Button size="sm" className="shadow-sm">
                    <Plus className="w-4 h-4 mr-1.5" /> {t('inventory.categoryDetail.addProduct')}
                  </Button>
                </Link>
              </div>
            }
          />
        </div>
      )}

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={executeDelete}
        itemName={categoryData.name || t('common.item')}
      />
    </div>
  );
}
