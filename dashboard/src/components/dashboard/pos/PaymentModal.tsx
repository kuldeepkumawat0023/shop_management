'use client';

import React, { useState } from 'react';
import { X, CreditCard, Banknote, Smartphone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { cn } from '@/utils/cn';
import { usePOS } from '@/contexts/POSContext';
import { formatCurrency } from '@/utils/formatCurrency';
import { useTranslation } from 'react-i18next';

interface PaymentModalProps {
  onClose: () => void;
}

// @ts-ignore
const getPaymentMethods = (t) => [
  { id: 'cash', name: t('pos.paymentModal.cash'), icon: Banknote },
  { id: 'upi', name: t('pos.paymentModal.upiQr'), icon: Smartphone },
  { id: 'card', name: t('pos.paymentModal.card'), icon: CreditCard },
];


const QUICK_CASH = [500, 1000, 2000];

export default function PaymentModal({ onClose }: PaymentModalProps) {
  const { netAmount, checkout, selectedCustomer } = usePOS();
  const [method, setMethod] = useState('cash');
  const [amountReceived, setAmountReceived] = useState<string>(netAmount.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  
  const received = parseFloat(amountReceived) || 0;
  const changeDue = received > netAmount ? received - netAmount : 0;

  const handleCheckout = async () => {
    setIsSubmitting(true);
    const success = await checkout(method, received, selectedCustomer?._id);
    setIsSubmitting(false);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/20 bg-surface-container-low/50">
          <h2 className="text-lg font-bold text-on-surface">{t('pos.paymentModal.completePayment')}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-5 space-y-6">
          
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-semibold text-on-surface-variant mb-1">{t('pos.paymentModal.totalPayable')}</span>
            <span className="text-3xl font-black text-primary">{formatCurrency(netAmount)}</span>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{t('pos.paymentModal.paymentMethod')}</label>
            <div className="grid grid-cols-3 gap-3">
              {getPaymentMethods(t).map((m) => {
                const Icon = m.icon;
                const isActive = method === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200 cursor-pointer",
                      isActive
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-outline-variant/30 bg-surface text-on-surface-variant hover:border-primary/50 hover:bg-primary/5"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-semibold">{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cash Input (Only if Cash is selected) */}
          {method === 'cash' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{t('pos.paymentModal.amountReceived')}</label>
              
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-on-surface-variant">₹</span>
                <input
                  type="number"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 text-lg font-bold bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              
              {/* Quick Cash Buttons */}
              <div className="flex gap-2">
                {QUICK_CASH.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAmountReceived(amt.toString())}
                    className="flex-1 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-low text-sm font-semibold text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>

              {/* Change Due */}
              <div className="flex items-center justify-between p-3 bg-surface border border-outline-variant/20 rounded-xl">
                <span className="text-sm font-semibold text-on-surface-variant">{t('pos.paymentModal.changeDue')}</span>
                <span className="text-lg font-black text-error">{formatCurrency(changeDue)}</span>
              </div>
            </div>
          )}

        </div>

        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-low/50">
          <Button 
            className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 disabled:opacity-50"
            onClick={handleCheckout}
            disabled={isSubmitting || (method === 'cash' && received < netAmount)}
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            {isSubmitting ? t('pos.paymentModal.processing') : t('pos.paymentModal.completeSale')}
          </Button>
        </div>
        
      </div>
    </div>
  );
}
