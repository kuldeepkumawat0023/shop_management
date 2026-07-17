'use client';

import React, { useState, useRef } from 'react';
import CategoryFilter from '@/components/dashboard/pos/CategoryFilter';
import ProductGrid from '@/components/dashboard/pos/ProductGrid';
import CartPanel from '@/components/dashboard/pos/CartPanel';
import PaymentModal from '@/components/dashboard/pos/PaymentModal';
import HoldBillModal from '@/components/dashboard/pos/HoldBillModal';
import CustomItemModal from '@/components/dashboard/pos/CustomItemModal';
import { ShoppingCart, Search, ScanBarcode, Plus, PackagePlus } from 'lucide-react';
import { usePOS } from '@/contexts/POSContext';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { ViewPageSkeleton } from '@/components/common/ViewPageSkeleton';

export default function NewSaleView() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isHoldBillOpen, setIsHoldBillOpen] = useState(false);
  const [isCustomItemOpen, setIsCustomItemOpen] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const barcodeRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const { searchQuery, setSearchQuery, cart, products, addToCart, loadingProducts } = usePOS();

  const handleBarcodeScan = async () => {
    if (!barcodeInput.trim()) return;
    const query = barcodeInput.trim();
    
    // Try local match first (by SKU or name)
    const matched = products.find(p => 
      p.sku === query || p.name.toLowerCase().includes(query.toLowerCase())
    );
    
    if (matched) {
      addToCart(matched);
      toast.success(`${t('pos.newSale.added')} ${matched.name}`);
    } else {
      // Try backend barcode API
      try {
        const { productService } = await import('@/lib/services/product.services');
        const res = await productService.getProductByBarcode(query);
        if (res.success && res.data) {
          addToCart(res.data);
          toast.success(`${t('pos.newSale.scanned')} ${res.data.name}`);
        } else {
          toast.error(`${t('pos.newSale.notFound')} ${query}`, { id: 'not-found----query------------' });
        }
      } catch {
        toast.error(`${t('pos.newSale.notFound')} ${query}`, { id: 'not-found----query------------' });
      }
    }
    setBarcodeInput('');
    barcodeRef.current?.focus();
  };

  const handleBarcodeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBarcodeScan();
    }
  };

  const cartItemCount = cart.reduce((s, i) => s + i.quantity, 0);

  if (loadingProducts) return <ViewPageSkeleton />;

  return (
    <div className="flex w-full flex-1 overflow-hidden relative">
      
      {/* Left Area: Products & Categories */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
        
        {/* Top Search & Barcode Bar */}
        <div className="w-full bg-surface border-b border-outline-variant/20 px-4 py-3 shrink-0">
          <div className="flex items-center gap-3">
            {/* Product Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-on-surface-variant" />
              </div>
              <input
                type="text"
                placeholder={t('pos.newSale.searchProducts')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-on-surface-variant/50"
              />
            </div>

            {/* Barcode / SKU Input */}
            <div className="relative w-52 shrink-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ScanBarcode className="h-4 w-4 text-primary" />
              </div>
              <input
                ref={barcodeRef}
                type="text"
                placeholder={t('pos.newSale.scanSku')}
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={handleBarcodeKeyDown}
                className="block w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-primary/30 bg-primary/5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-on-surface-variant/50 font-mono"
              />
            </div>
            <Button 
              type="button"
              onClick={handleBarcodeScan}
              className="shrink-0 h-10 px-4 gradient-button text-white border-none shadow-md shadow-primary/20 gap-1.5 rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-bold hidden sm:inline">{t('pos.newSale.add')}</span>
            </Button>
            <div className="w-px h-6 bg-outline-variant/30 shrink-0 mx-1"></div>
            <Button 
              type="button"
              variant="outline"
              onClick={() => setIsCustomItemOpen(true)}
              className="shrink-0 h-10 px-4 border-outline-variant/30 text-on-surface-variant hover:text-primary hover:bg-primary/5 gap-1.5 rounded-xl"
            >
              <PackagePlus className="w-4 h-4" />
              <span className="text-sm font-bold hidden md:inline">{t('pos.newSale.customItem')}</span>
            </Button>
          </div>
        </div>

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

      {/* Mobile Floating Cart Button with Badge */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center z-20 hover:scale-105 active:scale-95 transition-transform"
      >
        <ShoppingCart className="w-6 h-6" />
        {cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-error text-white text-[10px] font-black flex items-center justify-center shadow-md">
            {cartItemCount}
          </span>
        )}
      </button>

      {/* Modals */}
      {isPaymentOpen && (
        <PaymentModal onClose={() => setIsPaymentOpen(false)} />
      )}
      
      {isHoldBillOpen && (
        <HoldBillModal onClose={() => setIsHoldBillOpen(false)} />
      )}
      
      {isCustomItemOpen && (
        <CustomItemModal onClose={() => setIsCustomItemOpen(false)} />
      )}
        
    </div>
  );
}
