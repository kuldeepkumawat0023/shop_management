'use client';

import React, { useState, useEffect } from 'react';
import { X, Edit, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: any;
  onSave: (data: { role: string, status: string }) => void;
}

export default function EditMemberModal({ isOpen, onClose, member, onSave }: EditMemberModalProps) {
  const [role, setRole] = useState('Support Agent');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    if (member) {
      setRole(member.role);
      setStatus(member.status);
    }
  }, [member, isOpen]);

  if (!isOpen || !member) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ role, status });
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-scrim/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-surface-container-lowest shadow-2xl rounded-3xl z-50 overflow-hidden flex flex-col border border-outline-variant/20">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/20 bg-surface-container-low/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
              <Edit className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface">Edit Member</h2>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">{member.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Role</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all"
            >
              <option value="Support Agent">Support Agent</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Status</label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all"
            >
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {role === 'Super Admin' && role !== member.role && (
            <div className="bg-warning/10 border border-warning/20 p-3 rounded-lg flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-warning-foreground leading-relaxed">
                You are granting Super Admin access. This user will have full platform control.
              </p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-outline-variant/20 flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 gradient-button text-white border-none shadow-lg shadow-primary/20">
              <span className="font-bold tracking-wide">Save Changes</span>
            </Button>
          </div>

        </form>
      </div>
    </>
  );
}
