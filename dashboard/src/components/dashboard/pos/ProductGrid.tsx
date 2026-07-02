'use client';

import React from 'react';
import { GlassCard } from '@/components/common/Card';
import { Package, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

const PRODUCTS = [
  { id: 1, name: 'Amul Taaza Milk 1L', price: 68, mrp: 72, stock: 45, category: 'grocery' },
  { id: 2, name: 'Aashirvaad Atta 5kg', price: 215, mrp: 240, stock: 12, category: 'grocery' },
  { id: 3, name: 'Tata Tea Premium 1kg', price: 420, mrp: 450, stock: 8, category: 'grocery' },
  { id: 4, name: 'Maggi 2-Minute Noodles', price: 14, mrp: 15, stock: 120, category: 'snacks' },
  { id: 5, name: 'Lays Classic Salted', price: 20, mrp: 20, stock: 50, category: 'snacks' },
  { id: 6, name: 'Nescafe Classic 100g', price: 280, mrp: 300, stock: 0, category: 'beverages' }, // out of stock
  { id: 7, name: 'Coca Cola 1.5L', price: 90, mrp: 95, stock: 5, category: 'beverages' }, // low stock
  { id: 8, name: 'Fortune Sunflower Oil 1L', price: 145, mrp: 160, stock: 24, category: 'grocery' },
  { id: 9, name: 'Britannia Good Day', price: 30, mrp: 35, stock: 85, category: 'snacks' },
  { id: 10, name: 'Surf Excel Matic 1kg', price: 220, mrp: 245, stock: 18, category: 'grocery' },
  { id: 11, name: 'Dove Shampoo 340ml', price: 310, mrp: 350, stock: 15, category: 'grocery' },
  { id: 12, name: 'Dettol Soap 4-pack', price: 160, mrp: 180, stock: 32, category: 'grocery' },
];

export default function ProductGrid() {
  return (
    <div className="h-full overflow-y-auto pb-24 lg:pb-6 pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-outline-variant/30 [&::-webkit-scrollbar-thumb]:rounded-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {PRODUCTS.map((product) => {
          const isOutOfStock = product.stock === 0;
          const isLowStock = product.stock > 0 && product.stock <= 5;
          const hasDiscount = product.mrp && product.mrp > product.price;
          
          return (
            <GlassCard 
              key={product.id} 
              className={cn(
                "relative p-3 flex flex-col group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-outline-variant/20 hover:border-primary/40",
                isOutOfStock ? "opacity-60 grayscale cursor-not-allowed" : ""
              )}
            >
              {/* Image Placeholder */}
              <div className="w-full aspect-square rounded-lg bg-surface-container-low border border-outline-variant/10 mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-primary/5 transition-colors">
                <Package className="w-10 h-10 text-outline-variant/50 group-hover:text-primary/40 transition-colors" />
                
                {/* Quick Add Overlay */}
                {!isOutOfStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full gradient-button text-white flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform">
                      <Plus className="w-6 h-6" />
                    </div>
                  </div>
                )}
                
                {/* Discount Badge on Image (Optional visual flair) */}
                {hasDiscount && !isOutOfStock && (
                  <div className="absolute top-2 right-2 bg-error text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm shadow-sm">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-on-surface line-clamp-2 leading-tight mb-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                
                <div className="mt-auto pt-2 flex flex-wrap items-end justify-between gap-2">
                  <div className="flex flex-col">
                    {hasDiscount && (
                      <span className="text-[10px] font-medium text-on-surface-variant line-through leading-none mb-0.5">
                        ₹{product.mrp}
                      </span>
                    )}
                    <span className="text-lg font-black text-primary leading-none">
                      ₹{product.price}
                    </span>
                  </div>
                  
                  <span className={cn(
                    "whitespace-nowrap text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider mb-0.5",
                    isOutOfStock 
                      ? "bg-error/10 text-error" 
                      : isLowStock 
                        ? "bg-warning/10 text-warning-dark"
                        : "bg-surface-container-high text-on-surface-variant"
                  )}>
                    {isOutOfStock ? 'Empty' : `${product.stock} In Stock`}
                  </span>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
