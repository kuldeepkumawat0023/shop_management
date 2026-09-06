'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Edit, Trash2, Package, TrendingUp, IndianRupee, Clock } from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DetailViewSkeleton } from '@/components/common/DetailViewSkeleton';
import { cn } from '@/utils/cn';
import { useRouter, useParams } from 'next/navigation';
import { productService } from '@/lib/services/product.services';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import ActionGuard from '@/components/auth/ActionGuard';
import { DeleteModal } from '@/components/common/DeleteModal';

interface ProductDetailViewProps {
  productId?: string;
}

export default function ProductDetailView({ productId }: ProductDetailViewProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const activeProductId = productId || (params?.id as string);

  const [activeTab, setActiveTab] = useState('Overview');
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeProductId || activeProductId === 'undefined') {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await productService.getProducts();
        if (res.success) {
          const product = res.data.find((p: any) => p._id === activeProductId);
          if (product) {
            setProductData(product);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [activeProductId]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const executeDelete = async () => {
    try {
      const res = await productService.deleteProduct(activeProductId);
      if (res.success) {
        toast.success(t('inventory.productDetail.productDeleted'));
        router.push('/products');
      } else {
        toast.error(res.message || t('inventory.productDetail.deleteFailed'));
      }
    } catch (err) {
      toast.error(t('inventory.productDetail.deleteError'), { id: 'error-deleting-product' });
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) return <DetailViewSkeleton />;

  if (!productData) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full text-center">
        <Package className="w-16 h-16 text-outline-variant mb-4" />
        <h2 className="text-2xl font-bold text-on-surface">{t('inventory.productDetail.productNotFound')}</h2>
        <p className="text-on-surface-variant mt-2 mb-6">{t('inventory.productDetail.productNotFoundMsg')}</p>
        <Button onClick={() => router.back()}>{t('inventory.productDetail.goBack')}</Button>
      </div>
    );
  }

  const sellingPrice = productData.sellingPrice || 0;
  const costPrice = productData.purchasePrice || productData.costPrice || 0;
  const currentStock = productData.currentStock || 0;

  return (
    <div className="min-h-full flex-1 flex flex-col bg-background p-4 md:p-6 lg:p-8 w-full min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-on-surface tracking-tight">{t('inventory.productDetail.productDetails')}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ActionGuard permission="products.update">
            <Link href={`/products/${activeProductId}/edit`}>
              <Button variant="ghost" className="text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-xl">
                <Edit className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">{t('inventory.productDetail.edit')}</span>
              </Button>
            </Link>
          </ActionGuard>
          <ActionGuard permission="products.delete">
            <Button onClick={() => setShowDeleteModal(true)} variant="ghost" className="text-on-surface-variant hover:bg-error/10 hover:text-error rounded-xl">
              <Trash2 className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">{t('inventory.productDetail.delete')}</span>
            </Button>
          </ActionGuard>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Product Profile Header */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl shrink-0 border border-primary/20 shadow-inner overflow-hidden">
            {productData.image ? (
              <img src={productData.image} alt={productData.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center font-black text-3xl md:text-5xl">
                {productData.name.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge 
                  status={productData.isActive !== false ? 'Published' : 'Draft'} 
                  variant="dot" 
                  colorTheme={productData.isActive !== false ? 'success' : 'secondary'} 
                />
                <span className="text-xs font-mono font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded border border-outline-variant/10">
                  {productData.sku || 'N/A'}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">{productData.name}</h1>
              <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium mt-1">
                <span className="bg-surface-container-low px-2.5 py-1 rounded-md border border-outline-variant/10">{productData.categoryId?.name || productData.category?.name || 'Uncategorized'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/40" />
                <span className="bg-surface-container-low px-2.5 py-1 rounded-md border border-outline-variant/10">{productData.brandId?.name || productData.brand?.name || 'No Brand'}</span>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed ">
              {productData.description || t('inventory.productDetail.noDescription')}
            </p>
          </div>
          <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/20 w-full md:w-auto shrink-0 md:text-right">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t('inventory.productDetail.sellingPrice')}</p>
            <p className="text-3xl font-black text-primary">₹{sellingPrice.toLocaleString('en-IN')}</p>
            <p className="text-xs font-medium text-on-surface-variant mt-2">{t('inventory.productDetail.cost')}{costPrice.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t('inventory.productDetail.currentStock')}</p>
              <p className={cn(
                "text-2xl font-black",
                currentStock === 0 ? "text-error" : currentStock <= (productData.minStockLevel || 10) ? "text-warning" : "text-success"
              )}>{currentStock}</p>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t('inventory.productDetail.totalSold')}</p>
              <p className="text-2xl font-black text-on-surface">0</p>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t('inventory.productDetail.totalRevenue')}</p>
              <p className="text-2xl font-black text-on-surface">₹0</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm overflow-hidden p-6">
              <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> {t('inventory.productDetail.stockHistoryTitle')}
              </h2>
              <div className="text-center py-6 text-on-surface-variant">
                {t('inventory.productDetail.stockHistoryMsg')}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-on-surface mb-4">{t('inventory.productDetail.inventorySettings')}</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                  <span className="text-sm font-medium text-on-surface-variant">{t('inventory.productDetail.minStockAlert')}</span>
                  <span className="text-sm font-bold text-on-surface">{productData.minStockLevel || 10} {t('inventory.productDetail.units')}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                  <span className="text-sm font-medium text-on-surface-variant">{t('inventory.productDetail.taxRate')}</span>
                  <span className="text-sm font-bold text-on-surface">{productData.gstRate || productData.taxRate || 18}%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                  <span className="text-sm font-medium text-on-surface-variant">{t('inventory.productDetail.createdOn')}</span>
                  <span className="text-sm font-bold text-on-surface">{new Date(productData.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <ActionGuard permission="products.update">
                <Button variant="outline" className="w-full mt-6">
                  {t('inventory.productDetail.adjustStock')}
                </Button>
              </ActionGuard>
            </div>
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={executeDelete}
        itemName={productData.name || t('common.item')}
      />
    </div>
  );
}
