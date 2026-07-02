'use client';

import React from 'react';
import { Minus, Plus, Trash2, PauseCircle, CreditCard, Banknote, ShoppingCart, User, MoreVertical } from 'lucide-react';
import { Button } from '@/components/common/Button';
import CustomerSelection from './CustomerSelection';

const CART_ITEMS = [
  { id: 1, name: 'Amul Taaza Milk 1L', price: 68, qty: 2 },
  { id: 2, name: 'Tata Tea Premium 1kg', price: 420, qty: 1 },
  { id: 4, name: 'Maggi 2-Minute Noodles', price: 14, qty: 5 },
  { id: 8, name: 'Fortune Sunflower Oil 1L', price: 145, qty: 2 },
];

interface CartPanelProps {
  onClose?: () => void;
  onPay?: () => void;
  onHold?: () => void;
}

export default function CartPanel({ onClose, onPay, onHold }: CartPanelProps) {
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
        <div className="mt-3 flex items-center justify-between p-2.5 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
              RS
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface">Rahul Sharma</p>
              <p className="text-[10px] text-primary font-medium">+91 98765 43210</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="w-6 h-6 text-on-surface-variant hover:text-error">
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-outline-variant/30">
        {CART_ITEMS.map((item) => (
          <div key={item.id} className="flex gap-3 p-3 bg-surface-container-low border border-outline-variant/20 rounded-xl group hover:border-primary/30 transition-colors">
            
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-semibold text-on-surface line-clamp-2 leading-tight pr-2">
                  {item.name}
                </h4>
                <button className="text-outline-variant hover:text-error transition-colors mt-0.5 shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-sm font-black text-primary">₹{item.price}</span>
                
                {/* Qty Controls */}
                <div className="flex items-center gap-3 bg-surface border border-outline-variant/30 rounded-lg p-0.5">
                  <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-surface-container-high text-on-surface-variant transition-colors">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                  <button className="w-7 h-7 flex items-center justify-center rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Totals & Actions */}
      <div className="p-4 bg-surface border-t border-outline-variant/30 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Subtotal</span>
            <span className="font-semibold text-on-surface">₹916.00</span>
          </div>
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Tax (GST 5%)</span>
            <span className="font-semibold text-on-surface">₹45.80</span>
          </div>
          <div className="flex justify-between text-xs text-success">
            <span>Discount</span>
            <span className="font-semibold">-₹16.80</span>
          </div>
          
          <div className="pt-2 mt-2 border-t border-outline-variant/30 flex justify-between items-center">
            <span className="text-sm font-bold text-on-surface">Total Payable</span>
            <span className="text-2xl font-black text-primary">₹945.00</span>
          </div>
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
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"
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

// Quick placeholder for missing X icon if not imported properly
function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
