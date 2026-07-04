'use client';

import React from 'react';
import { X, UserX } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface DeleteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: any;
  onConfirm: () => void;
}

export default function DeleteMemberModal({ isOpen, onClose, member, onConfirm }: DeleteMemberModalProps) {
  if (!isOpen || !member) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-scrim/40 backdrop-blur-sm z-[100] transition-opacity flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div 
          className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 w-full max-w-sm shadow-2xl transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 bg-error/10">
              <UserX className="w-8 h-8 text-error" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-on-surface">Revoke Access?</h3>
              <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
                Are you sure you want to revoke access for <span className="font-bold text-on-surface">{member.name}</span>? They will immediately lose access to the Super Admin panel.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full mt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-error hover:bg-error/90 text-error-foreground"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                Yes, Revoke
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
