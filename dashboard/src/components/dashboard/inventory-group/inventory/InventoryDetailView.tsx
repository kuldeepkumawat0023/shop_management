'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Edit, Trash2, Package, TrendingUp, IndianRupee, Clock, ArrowDown, ArrowUp } from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DetailViewSkeleton } from '@/components/common/DetailViewSkeleton';
import { cn } from '@/utils/cn';
import { useRouter, useParams } from 'next/navigation';
import { productService } from '@/lib/services/product.services';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import ActionGuard from '@/components/auth/ActionGuard';
import { DataTable } from '@/components/common/DataTable';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDistanceToNow } from 'date-fns';

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

  useEffect(() => {
    if (!activeProductId || activeProductId === 'undefined') {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeProductId]);

  if (loading) return <DetailViewSkeleton />;

  if (!productData) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full text-center">
        <Package className="w-16 h-16 text-outline-variant mb-4" />
        <h2 className="text-2xl font-bold text-on-surface">Item Not Found</h2>
        <p className="text-on-surface-variant mt-2 mb-6">This item may have been deleted or does not exist.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const currentStock = productData.currentStock || 0;
  const minStock = productData.minStockLevel || 10;
  let stockStatus = 'In Stock';
  if (currentStock === 0) stockStatus = 'Out of Stock';
  else if (currentStock <= minStock) stockStatus = 'Low Stock';

  const columns = [
    {
      header: 'Date & Time',
      accessorKey: 'createdAt',
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-on-surface">{new Date(row.createdAt).toLocaleDateString()}</span>
          <span className="text-xs text-on-surface-variant">{formatDistanceToNow(new Date(row.createdAt), { addSuffix: true })}</span>
        </div>
      )
    },
    {
      header: 'Movement',
      accessorKey: 'movementType',
      cell: (row: any) => {
        const isPositive = row.quantityChanged > 0;
        return (
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
              isPositive ? "bg-success/10 text-success" : "bg-error/10 text-error"
            )}>
              {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            </div>
            <span className="font-bold text-sm text-on-surface">{row.movementType}</span>
          </div>
        );
      }
    },
    {
      header: 'Qty Changed',
      accessorKey: 'quantityChanged',
      cell: (row: any) => (
        <span className={cn(
          "font-black text-lg",
          row.quantityChanged > 0 ? "text-success" : "text-error"
        )}>
          {row.quantityChanged > 0 ? '+' : ''}{row.quantityChanged}
        </span>
      )
    },
    {
      header: 'Stock After',
      accessorKey: 'stockAfter',
      cell: (row: any) => (
        <span className="font-bold text-on-surface">{row.stockAfter}</span>
      )
    },
    {
      header: 'Remarks / Ref',
      accessorKey: 'remarks',
      cell: (row: any) => (
        <span className="text-sm font-medium text-on-surface-variant max-w-[200px] truncate block">
          {row.remarks || '-'}
        </span>
      )
    }
  ];

  return (
    <div className="flex flex-col bg-background p-4 md:p-6 lg:p-8 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-on-surface tracking-tight">Inventory Details</h1>
            <p className="text-sm font-medium text-on-surface-variant">View complete stock history for {productData.name}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Product Quick Profile */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-16 h-16 rounded-2xl shrink-0 border border-primary/20 overflow-hidden">
              {productData.image ? (
                <img src={productData.image} alt={productData.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center font-black text-2xl">
                  {productData.name.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-black text-on-surface">{productData.name}</h2>
              <p className="text-sm text-on-surface-variant font-mono">{productData.sku || 'No SKU'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <div className="text-center px-4 border-r border-outline-variant/20">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Status</p>
              <StatusBadge status={stockStatus} variant="dot" animate={stockStatus === 'Low Stock' || stockStatus === 'Out of Stock'} />
            </div>
            <div className="text-center px-4 border-r border-outline-variant/20">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Current Stock</p>
              <p className={cn("text-2xl font-black", currentStock === 0 ? "text-error" : currentStock <= minStock ? "text-warning" : "text-success")}>
                {currentStock}
              </p>
            </div>
            <div className="text-center px-4">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Value</p>
              <p className="text-2xl font-black text-primary">{formatCurrency(currentStock * (productData.costPrice || productData.purchasePrice || 0))}</p>
            </div>
          </div>
        </div>

        {/* Stock History Table */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl shadow-sm overflow-hidden p-1">
          <div className="p-5 border-b border-outline-variant/20 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-on-surface">Complete Stock Movement History</h3>
          </div>
          <DataTable 
            data={stockHistory} 
            columns={columns} 
            searchPlaceholder="Search history..." 
          />
        </div>

      </div>
    </div>
  );
}
