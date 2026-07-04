import React from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/common/Button';
import { Trash2 } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  title?: string;
  itemName: string;
  itemType?: string;
}

export function DeleteModal({
  isOpen,
  onClose,
  onDelete,
  title = 'Confirm Deletion',
  itemName,
  itemType = 'item'
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div 
          className="bg-surface-container-lowest rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 md:p-8 flex flex-col items-center text-center">
            {/* Warning Icon */}
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-6">
              <Trash2 className="w-8 h-8 text-error" />
            </div>

            {/* Text Content */}
            <div className="space-y-2 mb-8">
              <h3 className="text-xl font-bold text-on-surface">{title}</h3>
              <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
                Are you sure you want to delete the {itemType} <span className="font-bold text-on-surface">"{itemName}"</span>? This action is permanent and cannot be undone.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <Button 
                variant="outline" 
                className="w-full sm:flex-1 h-12 rounded-xl border-outline-variant/30 font-bold"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                className="w-full sm:flex-1 h-12 rounded-xl bg-error hover:bg-error/90 text-white border-none font-bold"
                onClick={() => {
                  onDelete();
                  onClose();
                }}
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
