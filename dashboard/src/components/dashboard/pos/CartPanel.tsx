'use client';

import React from 'react';
import { Minus, Plus, Trash2, PauseCircle, CreditCard, Banknote, ShoppingCart, User, MoreVertical, X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import CustomerSelection from './CustomerSelection';
import { usePOS } from '@/contexts/POSContext';
import { formatCurrency } from '@/utils/formatCurrency';

interface CartPanelProps {
  onClose?: () => void;
  onPay?: () => void;
  onHold?: () => void;
}

export default function CartPanel({ onClose, onPay, onHold }: CartPanelProps) {
  const { cart, removeFromCart, updateQuantity, subtotal, discount, tax, netAmount, selectedCustomer, setSelectedCustomer } = usePOS();

  return (
    <div className="flex flex-col h-full w-full bg-surface">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-on-surface">Current Order</h2>
          <span className="ml-2 text-xs font-bold bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-md">
            Order #0045
          </span>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden w-8 h-8">
            <Trash2 className="w-4 h-4 text-error" /> {/* In mobile close might be just hide, but for UI sake, clear or close */}
          </Button>
        )}
      </div>

      {/* Customer Selection */}
      <div className="p-4 border-b border-outline-variant/20 bg-surface/50">
        <CustomerSelection />
        
        {/* Selected Customer Preview */}
        {selectedCustomer && (
          <div className="mt-3 flex items-center justify-between p-2.5 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
                {selectedCustomer.name.substring(0, 2)}
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">{selectedCustomer.name}</p>
                <p className="text-[10px] text-primary font-medium">{selectedCustomer.phone}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-6 h-6 text-on-surface-variant hover:text-error"
              onClick={() => setSelectedCustomer(null)}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-outline-variant/30">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-on-surface-variant/50 gap-2">
            <ShoppingCart size={48} strokeWidth={1} />
            <p>Cart is empty</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.productId} className="flex gap-3 p-3 bg-surface-container-low border border-outline-variant/20 rounded-xl group hover:border-primary/30 transition-colors">
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-semibold text-on-surface line-clamp-2 leading-tight pr-2">
                    {item.name}
                  </h4>
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="text-outline-variant hover:text-error transition-colors mt-0.5 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-black text-primary">{formatCurrency(item.sellingPrice * item.quantity)}</span>
                  
                  {/* Qty Controls */}
                  <div className="flex items-center gap-3 bg-surface border border-outline-variant/30 rounded-lg p-0.5">
                    <button 
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-surface-container-high text-on-surface-variant transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Totals & Actions */}
      <div className="p-4 bg-surface border-t border-outline-variant/30 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-on-surface-variant text-sm font-medium">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-error text-sm font-medium">
              <span>Discount</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
          {tax > 0 && (
            <div className="flex justify-between text-on-surface-variant text-sm font-medium">
              <span>Tax</span>
              <span>+{formatCurrency(tax)}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-end justify-between border-t border-dashed border-outline-variant/30 pt-3 mb-4">
          <span className="text-sm font-bold text-on-surface-variant">Total Amount</span>
          <span className="text-3xl font-black text-primary leading-none tracking-tight">
            {formatCurrency(netAmount)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="w-full h-12 text-on-surface-variant border-outline-variant/40 hover:bg-warning/10 hover:text-warning hover:border-warning/30"
            onClick={onHold}
          >
            <PauseCircle className="w-4 h-4 mr-2" />
            Hold Bill
          </Button>
          <Button 
            className="w-full h-12 gradient-button text-white shadow-lg shadow-primary/25 border-none"
            onClick={onPay}
          >
            <Banknote className="w-4 h-4 mr-2" />
            Pay Now
          </Button>
        </div>
      </div>
      
    </div>
  );
}
