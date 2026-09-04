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

const PAYMENT_METHODS = [
  { id: 'cash', name: 'Cash / नकद', icon: Banknote, color: 'text-emerald-500' },
  { id: 'upi', name: 'UPI / QR कोड', icon: Smartphone, color: 'text-blue-500' },
  { id: 'card', name: 'Card / कार्ड', icon: CreditCard, color: 'text-purple-500' },
  { id: 'credit', name: 'Udhar / खाता', icon: BookOpen, color: 'text-amber-500' },
];

const QUICK_AMOUNTS = [10, 50, 100, 200, 500, 2000];

export default function PaymentModal({ onClose, onSuccess }: PaymentModalProps) {
  const { netAmount, checkout, selectedCustomer } = usePOS();
  const { t } = useTranslation();
  
  const [method, setMethod] = useState<'cash' | 'upi' | 'card' | 'credit'>('cash');
  const [amountReceived, setAmountReceived] = useState<string>(netAmount.toString());
  const [referenceNote, setReferenceNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const received = parseFloat(amountReceived) || 0;
  const changeDue = received > netAmount ? received - netAmount : 0;

  const handleCheckout = async () => {
    if (method === 'credit' && !selectedCustomer) {
      toast.error('उधार (Udhar) के लिए कृपया पहले ग्राहक चुनें! / Please select a customer for Udhar');
      return;
    }

    if (method === 'cash' && received < netAmount) {
      toast.error('प्राप्त राशि कुल राशि से कम है / Received amount is less than total');
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
            <h2 className="text-lg font-bold text-on-surface">Payment / भुगतान करें</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Customer: <span className="font-bold text-on-surface">{selectedCustomer?.name || 'Walk-in Customer'}</span>
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
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Total Payable Amount</span>
              <p className="text-xs text-on-surface-variant/70 mt-0.5">कुल देय राशि</p>
            </div>
            <span className="text-3xl font-black text-primary">{formatCurrency(netAmount)}</span>
          </Card>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
              Select Payment Method / भुगतान का माध्यम
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
                  Cash Received / प्राप्त राशि:
                </label>
                <button
                  type="button"
                  onClick={() => setAmountReceived(netAmount.toString())}
                  className="text-xs text-primary font-bold hover:underline cursor-pointer"
                >
                  Exact Amount (₹{netAmount})
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
                  Change to Return / वापस देने योग्य:
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
                <p className="text-sm font-bold text-on-surface">Scan Shop QR / GPay / PhonePe / Paytm</p>
                <p className="text-xs text-on-surface-variant mt-0.5">ग्राहक से ₹{netAmount} का यूपीआई भुगतान प्राप्त करें</p>
              </div>
              <Input
                type="text"
                value={referenceNote}
                onChange={(e) => setReferenceNote(e.target.value)}
                placeholder="UTR / Ref No. (Optional)"
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
                  <p className="text-sm font-bold text-on-surface">POS Card Swipe / Tap</p>
                  <p className="text-xs text-on-surface-variant">स्वाइप मशीन पर ₹{netAmount} का लेनदेन करें</p>
                </div>
              </div>
              <Input
                type="text"
                value={referenceNote}
                onChange={(e) => setReferenceNote(e.target.value)}
                placeholder="Card Approval Code / Last 4 digits (Optional)"
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
                    <span className="font-bold">Customer Required!</span>
                    <p className="text-[11px] mt-0.5">उधार पर बिल बनाने के लिए ग्राहक का नाम होना आवश्यक है। कृपया पहले ग्राहक चुनें।</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 text-xs">
                  <p className="font-bold text-amber-600 dark:text-amber-400">उधार खाता (Credit Sale):</p>
                  <p className="text-on-surface-variant">
                    यह ₹{netAmount} की राशि ग्राहक <span className="font-bold text-on-surface">{selectedCustomer.name}</span> के खाते में जुड़ जाएगी।
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-low flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-outline-variant/30"
          >
            Cancel / रद्द करें
          </Button>
          <Button
            onClick={handleCheckout}
            disabled={isSubmitting || (method === 'credit' && !selectedCustomer) || (method === 'cash' && received < netAmount)}
            className="flex-1 font-bold h-11 shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            {isSubmitting ? 'Recording Sale...' : `Complete Bill (₹${netAmount})`}
          </Button>
        </div>

      </div>
    </div>
  );
}
