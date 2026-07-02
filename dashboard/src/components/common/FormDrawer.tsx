import React, { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { X } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface FormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}

export function FormDrawer({ 
  isOpen, 
  onClose, 
  title, 
  children,
  width = "w-full max-w-md"
}: FormDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div 
        className={cn(
          "fixed right-0 top-0 h-screen bg-surface-container-lowest shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out border-l border-outline-variant/20",
          width,
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
          <h2 className="text-xl font-bold text-on-surface">{title}</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-on-surface-variant hover:text-error rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {children}
        </div>
      </div>
    </>
  );
}
