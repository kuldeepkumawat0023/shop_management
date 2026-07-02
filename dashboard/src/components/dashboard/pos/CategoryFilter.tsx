'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { LayoutGrid, Coffee, ShoppingBag, Carrot, Package, MonitorSmartphone } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All Items', icon: LayoutGrid },
  { id: 'grocery', name: 'Grocery', icon: ShoppingBag },
  { id: 'vegetables', name: 'Vegetables', icon: Carrot },
  { id: 'beverages', name: 'Beverages', icon: Coffee },
  { id: 'electronics', name: 'Electronics', icon: MonitorSmartphone },
  { id: 'snacks', name: 'Snacks', icon: Package },
];

export default function CategoryFilter() {
  const [activeId, setActiveId] = useState('all');

  return (
    <div className="w-full bg-surface border-b border-outline-variant/20 shadow-sm z-10 px-4 py-3 shrink-0">
      <div className="flex items-center gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeId === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => setActiveId(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 border shrink-0",
                isActive 
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/20" 
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
