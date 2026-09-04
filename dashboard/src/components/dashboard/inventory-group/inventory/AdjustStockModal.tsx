'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { X, ArrowDownLeft, ArrowUpRight, AlertCircle, CheckCircle2, Loader2, Package } from 'lucide-react';
import { productService } from '@/lib/services/product.services';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  currentStock: number;
  onSuccess?: () => void;
}

export function AdjustStockModal({
  isOpen,
  onClose,
  productId,
  productName,
  currentStock,
  onSuccess
}: AdjustStockModalProps) {
  const { t } = useTranslation();
  const [direction, setDirection] = useState<'IN' | 'OUT'>('IN');
  const [quantity, setQuantity] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [reasonCategory, setReasonCategory] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const parsedQty = Number(quantity) || 0;
  const newStock = direction === 'IN' ? currentStock + parsedQty : currentStock - parsedQty;

  const inReasons = [
    'New Stock Inward / Purchase',
    'Customer Return',
    'Inventory Audit / Count Correction',
    'Transfer In',
    'Other Inward'
  ];

  const outReasons = [
    'Damaged / Broken Goods',
    'Expired / Obsolete',
    'Internal / Store Use',
    'Inventory Loss / Discrepancy',
    'Customer Replacement',
    'Other Outward'
  ];

  const handleReasonSelect = (r: string) => {
    setReasonCategory(r);
    if (!remarks || inReasons.includes(remarks) || outReasons.includes(remarks)) {
      setRemarks(r);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (parsedQty <= 0) {
      setError(t('inventory.stockMovement.validQtyRequired', 'Please enter a valid quantity greater than 0'));
      return;
    }

    if (direction === 'OUT' && parsedQty > currentStock) {
      const confirmNegative = window.confirm(
        `Warning: Removing ${parsedQty} units will cause stock to become negative (${newStock} units). Do you wish to continue?`
      );
      if (!confirmNegative) return;
    }

    const finalQuantityChanged = direction === 'IN' ? parsedQty : -parsedQty;
    const finalRemarks = remarks.trim() || (direction === 'IN' ? 'Manual Stock In' : 'Manual Stock Out');

    try {
      setIsSubmitting(true);
      const res = await productService.adjustStock(productId, {
        quantityChanged: finalQuantityChanged,
        remarks: finalRemarks
      });

      if (res.success) {
        toast.success(
          direction === 'IN' 
            ? `+${parsedQty} units added to stock` 
            : `-${parsedQty} units removed from stock`
        );
        onSuccess?.();
        handleClose();
      } else {
        setError(res.message || 'Failed to adjust stock');
        toast.error(res.message || 'Failed to adjust stock');
      }
    } catch (err: any) {
      console.error('Error adjusting stock:', err);
      const msg = err.response?.data?.message || err.message || 'An error occurred while adjusting stock';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setQuantity('');
    setRemarks('');
    setReasonCategory('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={handleClose} 
      />

      {/* Modal Card */}
      <div className="relative bg-surface-container-lowest border border-outline-variant/30 rounded-3xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh] z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-on-surface">
                {t('inventory.stockMovement.adjustStockTitle', 'Stock Adjustment')}
              </h2>
              <p className="text-xs font-medium text-on-surface-variant line-clamp-1 max-w-[280px]">
                {productName}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-on-surface-variant hover:text-on-surface p-2 rounded-xl hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-2xl flex items-center gap-2.5 text-error text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Type Selector (Stock IN vs Stock OUT) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              {t('inventory.stockMovement.movementType', 'Movement Type')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setDirection('IN');
                  setReasonCategory('');
                }}
                className={cn(
                  'flex items-center justify-center gap-2 p-3.5 rounded-2xl border font-bold text-sm transition-all',
                  direction === 'IN'
                    ? 'bg-success/15 border-success text-success shadow-sm shadow-success/10 ring-2 ring-success/20'
                    : 'bg-surface-container/50 border-outline-variant/20 text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                )}
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>{t('inventory.stockMovement.stockIn', 'Stock In (+ आवक)')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDirection('OUT');
                  setReasonCategory('');
                }}
                className={cn(
                  'flex items-center justify-center gap-2 p-3.5 rounded-2xl border font-bold text-sm transition-all',
                  direction === 'OUT'
                    ? 'bg-error/15 border-error text-error shadow-sm shadow-error/10 ring-2 ring-error/20'
                    : 'bg-surface-container/50 border-outline-variant/20 text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                )}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>{t('inventory.stockMovement.stockOut', 'Stock Out (- जावक)')}</span>
              </button>
            </div>
          </div>

          {/* Current Stock vs New Stock Preview */}
          <div className="p-4 bg-surface-container/40 rounded-2xl border border-outline-variant/15 flex items-center justify-between">
            <div>
              <p className="text-xs text-on-surface-variant font-medium">
                {t('inventory.stockMovement.currentStock', 'Current Stock')}
              </p>
              <p className="text-lg font-black text-on-surface">
                {currentStock.toLocaleString()} <span className="text-xs font-medium text-on-surface-variant">units</span>
              </p>
            </div>

            <div className="text-center font-bold text-sm text-on-surface-variant">
              {direction === 'IN' ? '+' : '-'} {parsedQty || 0}
            </div>

            <div className="text-right">
              <p className="text-xs text-on-surface-variant font-medium">
                {t('inventory.stockMovement.newStockAfter', 'New Stock Balance')}
              </p>
              <p className={cn('text-lg font-black', newStock < 0 ? 'text-error' : 'text-primary')}>
                {newStock.toLocaleString()} <span className="text-xs font-medium text-on-surface-variant">units</span>
              </p>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              {t('inventory.stockMovement.quantity', 'Quantity')} *
            </label>
            <input
              type="number"
              min="1"
              step="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter number of units..."
              className="w-full bg-surface-container/30 border border-outline-variant/25 rounded-2xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
            />
          </div>

          {/* Quick Reason Suggestions */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              {t('inventory.stockMovement.reason', 'Reason / Category')}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(direction === 'IN' ? inReasons : outReasons).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => handleReasonSelect(r)}
                  className={cn(
                    'text-xs px-2.5 py-1 rounded-xl border transition-all',
                    reasonCategory === r
                      ? 'bg-primary text-on-primary border-primary font-bold shadow-xs'
                      : 'bg-surface-container/40 border-outline-variant/20 text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Remarks input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              {t('inventory.stockMovement.remarks', 'Remarks / Reference Notes')}
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. PO-8491, Damaged during transit, etc."
              className="w-full bg-surface-container/30 border border-outline-variant/25 rounded-2xl px-4 py-2.5 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm font-medium"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-2xl px-5"
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || parsedQty <= 0}
              className={cn(
                'rounded-2xl px-6 font-bold text-white shadow-md flex items-center gap-2',
                direction === 'IN' ? 'bg-success hover:bg-success/90' : 'bg-error hover:bg-error/90'
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('common.saving', 'Updating...')}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {direction === 'IN' 
                      ? t('inventory.stockMovement.confirmStockIn', 'Confirm Stock In') 
                      : t('inventory.stockMovement.confirmStockOut', 'Confirm Stock Out')}
                  </span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdjustStockModal;
