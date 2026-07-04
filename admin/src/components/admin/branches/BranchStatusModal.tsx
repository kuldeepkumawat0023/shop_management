'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/common/Button';
import { X, AlertTriangle } from 'lucide-react';

interface BranchStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: any;
  action: 'suspend' | 'activate' | 'terminate' | null;
}

export default function BranchStatusModal({ isOpen, onClose, branch, action }: BranchStatusModalProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !branch || !action) return null;

  const isDanger = action === 'suspend' || action === 'terminate';
  
  const getActionConfig = () => {
    switch (action) {
      case 'suspend':
        return { title: 'Suspend Branch', color: 'text-warning', bg: 'bg-warning/10', btn: 'danger' };
      case 'terminate':
        return { title: 'Terminate Branch', color: 'text-error', bg: 'bg-error/10', btn: 'danger' };
      case 'activate':
        return { title: 'Activate Branch', color: 'text-success', bg: 'bg-success/10', btn: 'primary' };
      default:
        return { title: 'Change Status', color: 'text-primary', bg: 'bg-primary/10', btn: 'primary' };
    }
  };

  const config = getActionConfig();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
      
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface-container-lowest rounded-3xl shadow-2xl z-50 overflow-hidden border border-outline-variant/20 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 flex items-center justify-between border-b border-outline-variant/10">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-xl", config.bg, config.color)}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-on-surface">{config.title}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-on-surface-variant hover:text-error rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <p className="text-sm text-on-surface-variant mb-4">
              Are you sure you want to <strong>{action}</strong> the branch <strong className="text-on-surface">{branch.name}</strong>?
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Reason for action
              </label>
              <textarea
                required={isDanger}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="E.g., Non-payment, Violation of terms, Requested by owner..."
                className="w-full h-24 p-3 rounded-xl bg-surface border border-outline-variant/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all text-on-surface placeholder:text-on-surface-variant/50 resize-none"
              />
              {isDanger && (
                <p className="text-[10px] text-error">Providing a reason is mandatory for this action.</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full">
            <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant={config.btn as any} 
              className="flex-1 rounded-xl"
              disabled={isSubmitting || (isDanger && !reason.trim())}
            >
              {isSubmitting ? 'Processing...' : 'Confirm Action'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
