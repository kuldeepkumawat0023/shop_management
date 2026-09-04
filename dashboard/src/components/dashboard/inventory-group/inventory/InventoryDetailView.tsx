'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Package, ArrowDownLeft, ArrowUpRight, Plus, IndianRupee } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DetailViewSkeleton } from '@/components/common/DetailViewSkeleton';
import { StatsCard } from '@/components/common/StatsCard';
import { useRouter, useParams } from 'next/navigation';
import { productService } from '@/lib/services/product.services';
import { useTranslation } from 'react-i18next';
import { StockMovementLog } from './StockMovementLog';
import { AdjustStockModal } from './AdjustStockModal';
import ActionGuard from '@/components/auth/ActionGuard';

interface InventoryDetailViewProps {
  productId?: string;
}

export default function InventoryDetailView({ productId }: InventoryDetailViewProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const activeProductId = productId || (params?.id as string);

  const [productData, setProductData] = useState<any>(null);
  const [stockHistory, setStockHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!activeProductId || activeProductId === 'undefined') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Fetch Product Info
      const res = await productService.getProducts();
      if (res.success) {
        const product = res.data.find((p: any) => p._id === activeProductId);
        if (product) {
          setProductData(product);
        }
      }
      
      // Fetch Stock History
      const historyRes = await productService.getProductStockHistory(activeProductId);
      if (historyRes.success) {
        setStockHistory(historyRes.data || []);
      }
    } catch (err) {
      console.error('Error loading inventory detail:', err);
    } finally {
      setLoading(false);
    }
  }, [activeProductId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && !productData) return <DetailViewSkeleton />;

  if (!productData) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Package className="w-16 h-16 text-outline-variant mb-4" />
        <h2 className="text-2xl font-bold text-on-surface">Item Not Found</h2>
        <p className="text-on-surface-variant mt-2 mb-6">This item may have been deleted or does not exist.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const currentStock = productData.currentStock || 0;
  const minStock = productData.minStock || productData.minStockLevel || 5;
  let stockStatus = 'In Stock';
  if (currentStock === 0) stockStatus = 'Out of Stock';
  else if (currentStock <= minStock) stockStatus = 'Low Stock';

  // Stock In / Out Calculations
  const totalStockIn = stockHistory
    .filter((h) => Number(h.quantityChanged) > 0)
    .reduce((acc, curr) => acc + Number(curr.quantityChanged || 0), 0);

  const totalStockOut = stockHistory
    .filter((h) => Number(h.quantityChanged) < 0)
    .reduce((acc, curr) => acc + Math.abs(Number(curr.quantityChanged || 0)), 0);

  const totalValuation = currentStock * (productData.sellingPrice || productData.purchasePrice || 0);

  return (
    <div className="p-4 md:p-6 flex flex-col gap-6 w-full min-w-0 max-w-full overflow-x-hidden">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-4 sm:p-5 md:p-6 shadow-sm min-w-0">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <Button 
            onClick={() => router.back()} 
            variant="ghost" 
            size="icon" 
            className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-2xl h-10 w-10 sm:h-11 sm:w-11 shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          {/* Product Image / Avatar */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shrink-0 border border-outline-variant/20 overflow-hidden bg-surface-container/40 flex items-center justify-center">
            {productData.image ? (
              <img src={productData.image} alt={productData.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center font-black text-lg sm:text-xl">
                {productData.name ? productData.name.substring(0, 2).toUpperCase() : 'PR'}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-xl md:text-2xl font-black text-on-surface tracking-tight truncate max-w-full">
                {productData.name}
              </h1>
              <StatusBadge status={stockStatus} variant="dot" animate={stockStatus === 'Low Stock' || stockStatus === 'Out of Stock'} />
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-xs font-mono font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded border border-outline-variant/15">
                SKU: {productData.sku || productData.barcode || 'N/A'}
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                {productData.categoryId?.name || productData.category?.name || 'Uncategorized'}
              </span>
            </div>
          </div>
        </div>

        <ActionGuard permission="products.update">
          <Button
            onClick={() => setIsAdjustModalOpen(true)}
            className="gradient-button text-white font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl flex items-center gap-2 shadow-md shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t('inventory.stockMovement.adjustStock', 'Stock In / Out')}</span>
          </Button>
        </ActionGuard>
      </div>

      {/* Stock In & Stock Out Quick Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 min-w-0">
        <StatsCard 
          icon={ArrowDownLeft} 
          title={t('inventory.stockMovement.totalStockIn', 'Total Stock In (कुल आया)')}
          value={`+${totalStockIn.toLocaleString()}`}
          colorTheme="success"
        />
        <StatsCard 
          icon={ArrowUpRight} 
          title={t('inventory.stockMovement.totalStockOut', 'Total Stock Out (कुल गया)')}
          value={`-${totalStockOut.toLocaleString()}`}
          colorTheme="error"
        />
        <StatsCard 
          icon={Package} 
          title={t('inventory.stockMovement.currentStock', 'Current In-Stock (उपलब्ध)')}
          value={`${currentStock.toLocaleString()} units`}
          colorTheme="primary"
        />
        <StatsCard 
          icon={IndianRupee} 
          title={t('inventory.stockMovement.totalValuation', 'Stock Valuation (कुल मूल्य)')}
          value={`₹${totalValuation.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          colorTheme="purple"
        />
      </div>

      {/* Complete Stock Movement Log Table matching screenshot */}
      <StockMovementLog
        data={stockHistory}
        productName={productData.name}
        sku={productData.sku || productData.barcode}
        onOpenAdjustModal={() => setIsAdjustModalOpen(true)}
        onRefresh={fetchData}
        isLoading={loading}
      />

      {/* Stock In / Out Adjustment Modal */}
      <AdjustStockModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        productId={activeProductId}
        productName={productData.name}
        currentStock={currentStock}
        onSuccess={fetchData}
      />
    </div>
  );
}
