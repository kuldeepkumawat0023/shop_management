'use client';

import React, { useState } from 'react';
import { X, PackagePlus } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { usePOS } from '@/contexts/POSContext';

interface CustomItemModalProps {
  onClose: () => void;
}

export default function CustomItemModal({ onClose }: CustomItemModalProps) {
  const { setCart } = usePOS();
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '1'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.quantity) return;

    const price = parseFloat(formData.price);
    const qty = parseInt(formData.quantity);

    if (isNaN(price) || isNaN(qty) || price <= 0 || qty <= 0) return;

    const customProduct = {
      productId: `CUSTOM-${Date.now()}`,
      name: formData.name + ' (Custom)',
      sellingPrice: price,
      quantity: qty,
      stock: 999999 // Unlimited stock for custom items
    };

    setCart(prev => [...prev, customProduct]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/20 bg-surface-container-low/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <PackagePlus className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-on-surface">Add Custom Item</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Item Name / आइटम का नाम
            </label>
            <Input 
              placeholder="e.g. Delivery Charge" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                Price / कीमत
              </label>
              <Input 
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00" 
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                Qty / मात्रा
              </label>
              <Input 
                type="number"
                min="1"
                placeholder="1" 
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 gradient-button text-white shadow-lg shadow-primary/20">
              Add to Cart
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
