'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { DetailViewSkeleton } from '@/components/common/DetailViewSkeleton';
import { ArrowLeft, Trash2, Factory, ClipboardList, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { productionService } from '@/lib/services/production.services';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

interface ProductionDetailViewProps {
  productionId: string;
}

export default function ProductionDetailView({ productionId }: ProductionDetailViewProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [productionData, setProductionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduction = async () => {
      try {
        const res = await productionService.getProductionById(productionId);
        if (res.success) {
          setProductionData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduction();
  }, [productionId]);

  const handleDelete = async () => {
    if (window.confirm(t('manufacturing.productionDetail.confirmDelete'))) {
      try {
        const res = await productionService.deleteProduction(productionId);
        if (res.success) {
          toast.success(t('manufacturing.productionDetail.productionDeleted'));
          router.push('/manufacturing/productions');
        } else {
          toast.error(res.message || t('manufacturing.productionDetail.deleteFailed'));
        }
      } catch (err) {
        toast.error(t('manufacturing.productionDetail.deleteError'), { id: 'error-deleting-production-log' });
      }
    }
  };

  if (loading) return <DetailViewSkeleton />;

  if (!productionData) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full text-center">
        <Factory className="w-16 h-16 text-outline-variant mb-4" />
        <h2 className="text-2xl font-bold text-on-surface">{t('manufacturing.productionDetail.notFound')}</h2>
        <p className="text-on-surface-variant mt-2 mb-6">{t('manufacturing.productionDetail.notFoundMsg')}</p>
        <Button onClick={() => router.back()}>{t('manufacturing.productionDetail.goBack')}</Button>
      </div>
    );
  }

  const recipe = productionData.recipeId || {};
  const finalProduct = productionData.finalProductId || {};
  const ingredients = recipe.ingredients || [];

  return (
    <div className="flex flex-col bg-background p-4 md:p-6 lg:p-8 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-on-surface tracking-tight">{t('manufacturing.productionDetail.productionDetails')}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleDelete} variant="ghost" className="text-on-surface-variant hover:bg-error/10 hover:text-error rounded-xl">
            <Trash2 className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">{t('manufacturing.productionDetail.revertDelete')}</span>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Profile Header */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-3xl md:text-5xl shrink-0 border border-primary/20 shadow-inner">
            <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-success" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono font-medium text-success bg-success/10 px-2 py-0.5 rounded border border-success/20">
                  {t('manufacturing.productionDetail.completed')}
                </span>
                <span className="text-xs font-mono font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded border border-outline-variant/10">
                  {productionData._id.slice(-6).toUpperCase()}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-on-surface tracking-tight leading-tight">
                {finalProduct.name || 'Unknown Product'}
              </h2>
              <p className="text-on-surface-variant font-medium mt-1">{t('manufacturing.productionDetail.loggedBy')} {productionData.userId?.name || 'Unknown'}</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-outline-variant/10">
              <div>
                <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-1">{t('manufacturing.productionDetail.quantityProduced')}</p>
                <p className="font-semibold text-on-surface text-lg">{productionData.quantityProduced} {finalProduct.unit}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-1">{t('manufacturing.productionDetail.totalCost')}</p>
                <p className="font-semibold text-on-surface text-lg">₹{(productionData.totalCost || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-1">{t('manufacturing.productionDetail.date')}</p>
                <p className="font-semibold text-on-surface">{new Date(productionData.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-1">{t('manufacturing.productionDetail.time')}</p>
                <p className="font-semibold text-on-surface">{new Date(productionData.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Consumed Materials */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            <ClipboardList className="w-5 h-5 text-primary" />
            {t('manufacturing.productionDetail.materialsConsumed')}
          </h3>
          
          <div className="space-y-4">
            {ingredients.map((ing: any, index: number) => {
              const consumedQty = ing.quantityRequired * productionData.quantityProduced;
              const cost = (ing.productId?.purchasePrice || 0) * consumedQty;
              return (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 gap-4">
                  <div>
                    <p className="font-bold text-on-surface">{ing.productId?.name || 'Unknown Item'}</p>
                    <p className="text-xs text-on-surface-variant mt-1">SKU: {ing.productId?.sku || 'N/A'}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="font-bold text-error">-{consumedQty} {ing.productId?.unit}</p>
                    <p className="text-xs text-on-surface-variant mt-1">{t('manufacturing.productionDetail.cost')}{cost.toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
