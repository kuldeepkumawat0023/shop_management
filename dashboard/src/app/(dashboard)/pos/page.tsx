'use client';

import React, { useState } from 'react';
import CategoryFilter from '@/components/dashboard/pos/CategoryFilter';
import ProductGrid from '@/components/dashboard/pos/ProductGrid';
import CartPanel from '@/components/dashboard/pos/CartPanel';
import PaymentModal from '@/components/dashboard/pos/PaymentModal';
import HoldBillModal from '@/components/dashboard/pos/HoldBillModal';
import { ShoppingCart } from 'lucide-react';

export default function POSPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isHoldBillOpen, setIsHoldBillOpen] = useState(false);

  return (
    <div className="flex w-full flex-1 overflow-hidden relative">
      
      {/* Left Area: Products & Categories */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
        <CategoryFilter />
        <div className="flex-1 overflow-hidden p-4">
          <ProductGrid />
        </div>
      </div>

      {/* Right Area: Cart Panel (Fixed on Desktop, Drawer on Mobile) */}
      <div 
        className={`fixed inset-y-0 right-0 z-40 w-full sm:w-[400px] lg:relative lg:w-[420px] shrink-0 bg-surface border-l border-outline-variant/30 transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none lg:translate-x-0 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <CartPanel 
          onClose={() => setIsCartOpen(false)} 
          onPay={() => setIsPaymentOpen(true)}
          onHold={() => setIsHoldBillOpen(true)}
        />
      </div>

      {/* Mobile Cart Toggle Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Mobile Floating Cart Button */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center z-20 hover:scale-105 active:scale-95 transition-transform"
      >
        <ShoppingCart className="w-6 h-6" />
        <span className="absolute top-0 right-0 w-5 h-5 bg-error text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-surface">
          3
        </span>
      </button>

      {/* Modals */}
      {isPaymentOpen && (
        <PaymentModal onClose={() => setIsPaymentOpen(false)} />
      )}
      
      {isHoldBillOpen && (
        <HoldBillModal onClose={() => setIsHoldBillOpen(false)} />
      )}
      
    </div>
  );
}
