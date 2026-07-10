'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { Store, ChevronDown, CheckCircle2, Plus } from 'lucide-react';
import { shopService, ShopData } from '@/lib/services/shop.services';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import ShopCreationModal from './ShopCreationModal';

export default function ShopSwitcher() {
  const { user, token, login } = useAuth();
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [shops, setShops] = useState<ShopData[]>([]);
  const [activeShop, setActiveShop] = useState<ShopData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const isForced = !user?.assignedShops || user.assignedShops.length === 0;

  const fetchShops = async () => {
    try {
      const res = await shopService.getMyShops();
      if (res.success && res.data) {
        setShops(res.data);
        if (user?.shopId) {
          const active = res.data.find(s => s._id === user.shopId);
          if (active) setActiveShop(active);
        } else if (res.data.length > 0) {
          setActiveShop(res.data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch shops:', error);
    }
  };

  useEffect(() => {
    if (isForced) {
      setIsModalOpen(true);
    } else {
      fetchShops();
    }
  }, [user?.assignedShops?.length, isForced]);

  const handleSwitchShop = async (shop: ShopData) => {
    if (shop._id === activeShop?._id) {
      setIsShopDropdownOpen(false);
      return;
    }
    
    if (!shop._id) return;
    
    try {
      const toastId = toast.loading('Switching shop...');
      const res = await shopService.switchShop(shop._id);
      if (res.success) {
        toast.success('Switched successfully', { id: toastId });
        setActiveShop(shop);
        
        if (user && token) {
          login({ ...user, shopId: shop._id }, token);
        }
      } else {
        toast.error(res.message || 'Failed to switch shop', { id: toastId });
      }
    } catch (err) {
      toast.error('Failed to switch shop');
    } finally {
      setIsShopDropdownOpen(false);
    }
  };

  const shopNameDisplay = activeShop?.name || 'SmartShop Admin';

  return (
    <>
      <ShopCreationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        isForced={isForced}
        onSuccess={() => {
          fetchShops();
          setIsModalOpen(false);
        }}
      />
      
      {(!isForced && shops.length > 0) && (
        <div className="mb-6 relative">
          <button
            onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)}
            className={cn(
              "w-full flex items-center justify-between gap-3 px-4 py-3 bg-surface-container-low border border-outline-variant/10 rounded-xl hover:bg-surface-container-high transition-all cursor-pointer",
              isShopDropdownOpen ? "ring-2 ring-primary/20 border-primary/30" : ""
            )}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                {activeShop?.logo ? (
                  <img src={activeShop.logo} alt={shopNameDisplay} className="w-full h-full object-cover rounded-md" />
                ) : (
                  <Store size={14} />
                )}
              </div>
              <span className="text-sm font-bold truncate text-on-surface">{shopNameDisplay}</span>
            </div>
            <ChevronDown
              size={16}
              className={cn(
                "text-on-surface-variant transition-transform duration-300 shrink-0",
                isShopDropdownOpen ? "rotate-180" : ""
              )}
            />
          </button>

          {/* Dropdown Panel */}
          <div className={cn(
            "absolute top-full left-0 right-0 z-50 overflow-hidden transition-all duration-300 ease-in-out",
            isShopDropdownOpen ? "max-h-72 opacity-100 mt-2" : "max-h-0 opacity-0 pointer-events-none"
          )}>
            <div className="py-2 bg-surface-container-high/90 backdrop-blur-md border border-outline-variant/20 shadow-xl rounded-xl space-y-0.5 overflow-y-auto max-h-64">
              <div className="px-4 py-2 border-b border-outline-variant/10">
                <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Switch Shop</p>
              </div>

              {shops.map((shop) => (
                <button
                  key={shop._id}
                  onClick={() => handleSwitchShop(shop)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer",
                    shop._id === activeShop?._id
                      ? "text-primary bg-primary/5"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                  )}
                >
                  <div className="flex items-center gap-3 w-full">
                  <div className="w-6 h-6 rounded-md gradient-button flex items-center justify-center shrink-0 overflow-hidden">
                    {shop.logo ? (
                      <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-black text-white">{shop.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium truncate flex-1">{shop.name}</span>
                  {shop._id === activeShop?._id && (
                    <CheckCircle2 size={14} className="text-primary shrink-0" />
                  )}
                  </div>
                </button>
              ))}

              {/* Add New Shop */}
              <div className="px-2 pt-1.5 mt-1 border-t border-outline-variant/10">
                <button
                  onClick={() => {
                    setIsShopDropdownOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-primary hover:bg-primary/5 transition-colors rounded-lg group cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                    <Plus size={14} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest truncate">Add Shop</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
