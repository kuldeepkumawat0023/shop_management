'use client';

import React, { useState } from 'react';
import { X, PauseCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { usePOS } from '@/contexts/POSContext';
import { useTranslation } from 'react-i18next';

interface HoldBillModalProps {
  onClose: () => void;
}

export default function HoldBillModal({ onClose }: HoldBillModalProps) {
  const { holdBill, cart } = usePOS();
  const [note, setNote] = useState('');
  const { t } = useTranslation();

  const handleHold = () => {
    holdBill(note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/20 bg-surface-container-low/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center text-warning">
              <PauseCircle className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-on-surface">{t('pos.holdBillModal.holdCurrentBill')}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
            {t('pos.holdBillModal.areYouSurePause')}
            <br/>
            <span className="text-xs text-on-surface-variant/70">
              {t('pos.holdBillModal.cartItems')} {cart.length}
            </span>
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              {t('pos.holdBillModal.referenceNote')}
            </label>
            <Input 
              placeholder={t('pos.holdBillModal.egCustomerWallet')} 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant/20 flex items-center gap-3 bg-surface-container-low/30">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            {t('pos.holdBillModal.cancel')}
          </Button>
          <Button 
            className="flex-1 bg-warning hover:bg-warning/90 text-on-primary shadow-lg shadow-warning/20"
            onClick={handleHold}
            disabled={cart.length === 0}
          >
            {t('pos.holdBillModal.confirmHold')}
          </Button>
        </div>
      </div>
    </div>
  );
}
