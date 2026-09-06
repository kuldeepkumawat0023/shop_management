'use client';

import React, { useState } from 'react';
import { X, CreditCard, Banknote, Smartphone, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { cn } from '@/utils/cn';
import { usePOS } from '@/contexts/POSContext';
import { formatCurrency } from '@/utils/formatCurrency';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  onClose: () => void;
  onSuccess: (saleData: any) => void;
}



const QUICK_AMOUNTS = [10, 50, 100, 200, 500, 2000];

export default function PaymentModal({ onClose, onSuccess }: PaymentModalProps) {
  const { netAmount, checkout, selectedCustomer } = usePOS();
  const { t } = useTranslation();

  const PAYMENT_METHODS = [
    { id: 'cash', name: t('pos.paymentModal.cash'), icon: Banknote, color: 'text-emerald-500' },
    { id: 'upi', name: t('pos.paymentModal.upiQr'), icon: Smartphone, color: 'text-blue-500' },
    { id: 'card', name: t('pos.paymentModal.card'), icon: CreditCard, color: 'text-purple-500' },
    { id: 'credit', name: t('pos.paymentModal.credit'), icon: BookOpen, color: 'text-amber-500' },
  ];

  const [method, setMethod] = useState<'cash' | 'upi' | 'card' | 'credit'>('cash');
  const [amountReceived, setAmountReceived] = useState<string>(netAmount.toString());
  const [referenceNote, setReferenceNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const received = parseFloat(amountReceived) || 0;
  const changeDue = received > netAmount ? received - netAmount : 0;

  const handleCheckout = async () => {
    if (method === 'credit' && !selectedCustomer) {
      toast.error(t('pos.paymentModal.selectCustomerForCredit'));
      return;
    }

    if (method === 'cash' && received < netAmount) {
      toast.error(t('pos.paymentModal.receivedLessThanTotal'));
      return;
    }

    setIsSubmitting(true);
    const paid = method === 'credit' ? 0 : (method === 'cash' ? Math.min(received, netAmount) : netAmount);

    const result = await checkout(method, paid, selectedCustomer?._id);
    setIsSubmitting(false);

    if (result.success) {
      onSuccess(result.data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/20 bg-surface-container-low">
          <div>
            <h2 className="text-lg font-bold text-on-surface">{t('pos.paymentModal.title')}</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {t('pos.paymentModal.customer')} <span className="font-bold text-on-surface">{selectedCustomer?.name || t('pos.newSale.walkInCustomer')}</span>
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-5 space-y-5">

          {/* Payable Amount Card */}
          <Card className="bg-primary/5 border border-primary/20 p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{t('pos.paymentModal.totalPayableAmount')}</span>
            </div>
            <span className="text-3xl font-black text-primary">{formatCurrency(netAmount)}</span>
          </Card>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
              {t('pos.paymentModal.selectPaymentMethod')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PAYMENT_METHODS.map((m) => {
                const Icon = m.icon;
                const isActive = method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setMethod(m.id as any);
                      if (m.id === 'cash') {
                        setAmountReceived(netAmount.toString());
                      }
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer text-center",
                      isActive
                        ? "border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary"
                        : "border-outline-variant/30 bg-surface hover:border-primary/40 hover:bg-surface-container-low text-on-surface-variant"
                    )}
                  >
                    <Icon className={cn("w-5 h-5 mb-1.5", m.color)} />
                    <span className="text-xs font-bold">{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cash Details */}
          {method === 'cash' && (
            <div className="space-y-3 bg-surface-container-low/60 p-4 rounded-xl border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  {t('pos.paymentModal.amountReceived')}:
                </label>
                <button
                  type="button"
                  onClick={() => setAmountReceived(netAmount.toString())}
                  className="text-xs text-primary font-bold hover:underline cursor-pointer"
                >
                  {t('pos.paymentModal.exact')} ({formatCurrency(netAmount)})
                </button>
              </div>

              <Input
                type="number"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                leftIcon={<span className="font-bold text-base text-on-surface-variant">₹</span>}
                className="text-lg font-bold"
                placeholder="0.00"
                autoFocus
              />

              {/* Quick Cash Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {QUICK_AMOUNTS.map((amt) => (
                  <Button
                    key={amt}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const cur = parseFloat(amountReceived) || 0;
                      setAmountReceived((cur + amt).toString());
                    }}
                    className="h-8 px-2.5 text-xs font-bold border-outline-variant/30 text-on-surface-variant hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                  >
                    +₹{amt}
                  </Button>
                ))}
              </div>

              {/* Change Due */}
              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                <span className="text-xs font-bold text-on-surface-variant">
                  {t('pos.paymentModal.changeDue')}:
                </span>
                <span className={cn(
                  "text-base font-black",
                  changeDue > 0 ? "text-success" : "text-on-surface-variant"
                )}>
                  {formatCurrency(changeDue)}
                </span>
              </div>
            </div>
          )}

          {/* UPI Details */}
          {method === 'upi' && (
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">{t('pos.paymentModal.upiQr')}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{formatCurrency(netAmount)}</p>
              </div>
              <Input
                type="text"
                value={referenceNote}
                onChange={(e) => setReferenceNote(e.target.value)}
                placeholder={t('pos.paymentModal.referencePlaceholder')}
                className="text-xs text-center"
              />
            </div>
          )}

          {/* Card Details */}
          {method === 'card' && (
            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{t('pos.paymentModal.card')}</p>
                  <p className="text-xs text-on-surface-variant">{formatCurrency(netAmount)}</p>
                </div>
              </div>
              <Input
                type="text"
                value={referenceNote}
                onChange={(e) => setReferenceNote(e.target.value)}
                placeholder={t('pos.paymentModal.referencePlaceholder')}
                className="text-xs"
              />
            </div>
          )}

          {/* Udhar / Credit Details */}
          {method === 'credit' && (
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-3">
              {!selectedCustomer ? (
                <div className="flex items-start gap-2.5 text-amber-600 dark:text-amber-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{t('pos.paymentModal.selectCustomerForCredit')}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 text-xs">
                  <p className="font-bold text-amber-600 dark:text-amber-400">{t('pos.paymentModal.credit')}:</p>
                  <p className="text-on-surface-variant">
                    {formatCurrency(netAmount)} &bull; {selectedCustomer.name}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-low space-y-3">
          <div className="flex items-center justify-between px-0.5 text-xs font-bold text-on-surface-variant">
            <span className="uppercase tracking-wider">{t('pos.paymentModal.totalPayableAmount')}:</span>
            <span className="text-xl font-black text-primary">{formatCurrency(netAmount)}</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-outline-variant/30 h-11 font-semibold"
            >
              {t('pos.paymentModal.cancel')}
            </Button>
            <Button
              onClick={handleCheckout}
              disabled={isSubmitting || (method === 'credit' && !selectedCustomer) || (method === 'cash' && received < netAmount)}
              className="flex-1 font-bold h-11 shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap text-sm"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{isSubmitting ? t('pos.paymentModal.processing') : t('pos.paymentModal.completeSale')}</span>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
