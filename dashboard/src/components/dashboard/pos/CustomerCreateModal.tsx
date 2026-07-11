'use client';

import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { customerService } from '@/lib/services/customer.services';
import toast from 'react-hot-toast';

interface CustomerCreateModalProps {
  onClose: () => void;
  onSuccess: (newCustomer: any) => void;
}

export default function CustomerCreateModal({ onClose, onSuccess }: CustomerCreateModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) {
      toast.error('Name and Mobile are required / नाम और मोबाइल आवश्यक हैं');
      return;
    }

    setLoading(true);
    try {
      const res = await customerService.createCustomer(formData);
      if (res.success) {
        toast.success('Customer added successfully! / ग्राहक सफलतापूर्वक जोड़ा गया!');
        onSuccess(res.data);
      } else {
        toast.error(res.message || 'Failed to add customer');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add customer / ग्राहक जोड़ने में विफल');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/20 bg-surface-container-low/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <UserPlus className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-on-surface">Add New Customer</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Full Name * / पूरा नाम
            </label>
            <Input 
              placeholder="e.g. Rahul Sharma" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Mobile Number * / मोबाइल नंबर
            </label>
            <Input 
              placeholder="e.g. 9876543210" 
              type="tel"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 gradient-button text-white shadow-lg shadow-primary/20"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Save Customer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
