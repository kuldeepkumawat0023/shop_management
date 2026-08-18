'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { X, PackagePlus, PackageMinus } from 'lucide-react';
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

export const AdjustStockModal: React.FC<AdjustStockModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  currentStock,
  onSuccess
}) => {
  const { t } = useTranslation();
  const [movementType, setMovementType] = useState<'IN' | 'OUT'>('IN');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [reason, setReason] = useState('New Purchase');
  const [customRemarks, setCustomRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const inReasons = [
    'New Purchase',
    'Opening Stock',
    'Customer Return',
    'Production Completed',
    'Inventory Inward Adjustment'
  ];

  const outReasons = [
    'Sale / Delivery',
    'Damaged / Expired',
    'Returned to Supplier',
    'Sample / Testing',
    'Inventory Outward Adjustment'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qtyNumber = Number(quantity);
    if (!qtyNumber || qtyNumber <= 0) {
      toast.error(t('inventory.stockMovement.enterValidQty', 'Please enter a valid quantity greater than 0'));
      return;
    }

    if (movementType === 'OUT' && qtyNumber > currentStock) {
      toast.error(t('inventory.stockMovement.insufficientStock', 'Stock Out quantity cannot exceed current available stock'));
      return;
    }

    const calculatedQty = movementType === 'IN' ? qtyNumber : -qtyNumber;
    const finalRemarks = customRemarks.trim() 
      ? `${reason}: ${customRemarks.trim()}`
      : reason;

    try {
      setLoading(true);
      const res = await productService.adjustStock(productId, {
        quantityChanged: calculatedQty,
        remarks: finalRemarks
      });

      if (res.success || (res as any).status === 200) {
        toast.success(
          movementType === 'IN'
            ? t('inventory.stockMovement.stockInSuccess', 'Stock In (+{{qty}}) added successfully', { qty: qtyNumber })
            : t('inventory.stockMovement.stockOutSuccess', 'Stock Out (-{{qty}}) recorded successfully', { qty: qtyNumber })
        );
        if (onSuccess) onSuccess();
        onClose();
        setQuantity('');
        setCustomRemarks('');
      } else {
        toast.error(res.message || t('inventory.stockMovement.adjustFailed', 'Failed to adjust stock'));
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || t('inventory.stockMovement.adjustFailed', 'Failed to adjust stock'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="p-6 border-b border-outline-variant/15 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-on-surface tracking-tight">
              {t('inventory.stockMovement.adjustStockTitle', 'Stock In / Out Movement')}
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5 font-medium truncate max-w-[280px]">
              {productName} (Current: <span className="font-bold text-on-surface">{currentStock}</span>)
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Action Type Toggle: Stock In vs Stock Out */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-on-surface-variant block mb-2">
              {t('inventory.stockMovement.movementType', 'Movement Type')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setMovementType('IN');
                  setReason('New Purchase');
                }}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 font-bold text-sm transition-all",
                  movementType === 'IN'
                    ? "border-success bg-success/10 text-success shadow-sm"
                    : "border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/50"
                )}
              >
                <PackagePlus className="w-4 h-4" />
                <span>{t('inventory.stockMovement.stockIn', 'Stock In (+)')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMovementType('OUT');
                  setReason('Sale / Delivery');
                }}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 font-bold text-sm transition-all",
                  movementType === 'OUT'
                    ? "border-error bg-error/10 text-error shadow-sm"
                    : "border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/50"
                )}
              >
                <PackageMinus className="w-4 h-4" />
                <span>{t('inventory.stockMovement.stockOut', 'Stock Out (-)')}</span>
              </button>
            </div>
          </div>

          {/* Quantity Input */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-on-surface-variant block mb-1.5">
              {movementType === 'IN' 
                ? t('inventory.stockMovement.incomingQty', 'Incoming Quantity (+)')
                : t('inventory.stockMovement.outgoingQty', 'Outgoing Quantity (-)')}
            </label>
            <input
              type="number"
              min="1"
              max={movementType === 'OUT' ? currentStock : undefined}
              required
              placeholder="e.g. 50"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-black text-lg focus:outline-none focus:border-primary transition-colors"
            />
            {movementType === 'OUT' && (
              <p className="text-[11px] text-on-surface-variant mt-1 font-medium">
                Max allowed: <span className="font-bold text-on-surface">{currentStock}</span> units
              </p>
            )}
          </div>

          {/* Reason Preset Selection */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-on-surface-variant block mb-1.5">
              {t('inventory.stockMovement.reason', 'Reason / Category')}
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface font-semibold text-sm focus:outline-none focus:border-primary transition-colors"
            >
              {(movementType === 'IN' ? inReasons : outReasons).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Remarks / Ref */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-on-surface-variant block mb-1.5">
              {t('inventory.stockMovement.remarksRef', 'Reference / Remarks (Optional)')}
            </label>
            <input
              type="text"
              placeholder="e.g. PO-8492 or Invoice #102"
              value={customRemarks}
              onChange={(e) => setCustomRemarks(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-sm font-medium focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-1/2 rounded-xl"
              disabled={loading}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              type="submit"
              disabled={loading || !quantity}
              className={cn(
                "w-1/2 rounded-xl text-white font-bold",
                movementType === 'IN' ? "bg-success hover:bg-success/90" : "bg-error hover:bg-error/90"
              )}
            >
              {loading ? t('common.saving', 'Saving...') : movementType === 'IN' ? t('inventory.stockMovement.addStock', 'Add Stock In') : t('inventory.stockMovement.removeStock', 'Record Stock Out')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
