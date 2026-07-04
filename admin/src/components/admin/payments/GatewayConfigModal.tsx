'use client';

import React, { useState } from 'react';
import { X, CreditCard, Key, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import toast from 'react-hot-toast';

interface GatewayConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GatewayConfigModal({ isOpen, onClose }: GatewayConfigModalProps) {
  const [provider, setProvider] = useState('Razorpay');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success(`${provider} gateway configuration saved successfully!`);
      onClose();
    }, 1500);
  };

  return (
    <div 
      className="fixed inset-0 bg-scrim/40 backdrop-blur-sm z-[100] transition-opacity flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface">Gateway Configuration</h2>
              <p className="text-xs font-medium text-on-surface-variant mt-0.5">Setup API keys for payment processing</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar flex-1 pr-2 space-y-6">
          
          {/* Provider Selection */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Select Provider</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setProvider('Razorpay')}
                className={`p-3 rounded-xl border-2 flex items-center justify-center font-bold transition-all ${
                  provider === 'Razorpay' 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'border-outline-variant/20 bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                Razorpay
              </button>
              <button 
                onClick={() => setProvider('Stripe')}
                className={`p-3 rounded-xl border-2 flex items-center justify-center font-bold transition-all ${
                  provider === 'Stripe' 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'border-outline-variant/20 bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                Stripe
              </button>
            </div>
          </div>

          <hr className="border-outline-variant/10" />

          {/* API Keys Form */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-2 mb-2">
              <Key className="w-4 h-4 text-secondary" />
              {provider} API Credentials
            </h3>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant ml-1">Key ID / Publishable Key</label>
              <Input 
                placeholder={`Enter ${provider} Key ID`} 
                className="w-full bg-surface-container-low border-outline-variant/20 focus:border-primary font-mono text-sm"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant ml-1">Key Secret / Secret Key</label>
              <Input 
                type="password"
                placeholder={`Enter ${provider} Key Secret`} 
                className="w-full bg-surface-container-low border-outline-variant/20 focus:border-primary font-mono text-sm"
              />
            </div>
          </div>

          <div className="bg-success/10 border border-success/20 p-4 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-success leading-relaxed">
              These credentials are encrypted at rest. Never share your secret keys with anyone. Subscriptions and payouts will use the active provider.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 pt-6 mt-4 border-t border-outline-variant/10">
          <Button 
            variant="outline" 
            className="flex-1 border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 gradient-button text-white border-none shadow-lg shadow-primary/20"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving Keys...' : 'Save Configuration'}
          </Button>
        </div>

      </div>
    </div>
  );
}
