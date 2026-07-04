import React from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/common/Button';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getIconAndColors = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <AlertCircle className="w-6 h-6 text-error" />,
          bgClass: 'bg-error/10',
          confirmBtnVariant: 'danger' as const
        };
      case 'info':
        return {
          icon: <Info className="w-6 h-6 text-primary" />,
          bgClass: 'bg-primary/10',
          confirmBtnVariant: 'primary' as const
        };
      case 'warning':
      default:
        return {
          icon: <AlertTriangle className="w-6 h-6 text-secondary" />,
          bgClass: 'bg-secondary/10',
          confirmBtnVariant: 'primary' as const
        };
    }
  };

  const { icon, bgClass, confirmBtnVariant } = getIconAndColors();

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div 
          className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className={cn("w-16 h-16 rounded-full flex items-center justify-center shrink-0", bgClass)}>
              {icon}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-on-surface">{title}</h3>
              <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
                {message}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full mt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={onClose}
              >
                {cancelText}
              </Button>
              <Button 
                variant={confirmBtnVariant}
                className="flex-1"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
