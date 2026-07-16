'use client';

import React, { useMemo } from 'react';
import { cn } from '@/utils/cn';
import { LayoutGrid, Coffee, ShoppingBag, Carrot, Package, MonitorSmartphone, Tag } from 'lucide-react';
import { usePOS } from '@/contexts/POSContext';
import { useTranslation } from 'react-i18next';

const ICON_MAP: Record<string, React.ElementType> = {
  grocery: ShoppingBag,
  vegetables: Carrot,
  beverages: Coffee,
  electronics: MonitorSmartphone,
  snacks: Package,
};

export default function CategoryFilter() {
  const { products, selectedCategory, setSelectedCategory } = usePOS();
  const { t } = useTranslation();

  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(products.map(p => p.category?.toLowerCase() || 'other')));
    
    const cats = uniqueCats.map(cat => ({
      id: cat,
      name: cat === 'other' ? t('pos.categoryFilter.other') : cat.charAt(0).toUpperCase() + cat.slice(1),
      icon: ICON_MAP[cat] || Tag
    }));

    return [
      { id: 'all', name: t('pos.categoryFilter.allItems'), icon: LayoutGrid },
      ...cats.sort((a, b) => a.name.localeCompare(b.name))
    ];
  }, [products]);

  return (
    <div className="w-full bg-surface border-b border-outline-variant/20 shadow-sm z-10 px-4 py-3 shrink-0">
      <div className="flex items-center gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 border shrink-0",
                isActive 
                  ? "gradient-button text-white border-transparent shadow-md shadow-primary/20" 
                  : "bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:border-primary/50 hover:text-primary hover:bg-primary/5"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-white" : "")} />
              <span className="text-sm font-semibold">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
