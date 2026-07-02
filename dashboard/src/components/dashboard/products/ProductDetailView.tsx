'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Edit, Trash2, Package, TrendingUp, IndianRupee, Clock } from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from '@/components/common/StatusBadge';
import { cn } from '@/utils/cn';

// Mock Data
const productData = {
  id: '1',
  name: 'Samsung Galaxy S24 Ultra',
  category: 'Electronics',
  brand: 'Samsung',
  sku: 'SKU-ELE-001',
  description: 'The Samsung Galaxy S24 Ultra features a titanium exterior and a 6.8-inch flat display. It comes with Galaxy AI built-in, a 200MP main camera, and the new Snapdragon 8 Gen 3 processor for unparalleled performance.',
  price: 129999.00,
  costPrice: 110000.00,
  stock: 45,
  minStock: 10,
  status: 'Published',
  totalSold: 128,
  revenue: 16639872.00
};

const stockHistory = [
  { id: 1, date: 'Jul 2, 2026', type: 'Sale', qty: -2, remarks: 'POS Order #4920' },
  { id: 2, date: 'Jul 1, 2026', type: 'Addition', qty: 50, remarks: 'Purchase Order #PO-991' },
  { id: 3, date: 'Jun 28, 2026', type: 'Sale', qty: -1, remarks: 'POS Order #4811' },
  { id: 4, date: 'Jun 25, 2026', type: 'Return', qty: 1, remarks: 'Customer Return' },
];

import { useRouter } from 'next/navigation';

export default function ProductDetailView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-outline-variant/20 px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-on-surface tracking-tight">Product Details</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-on-surface-variant hover:text-primary hover:bg-primary/10">
            <Edit className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button variant="ghost" className="text-on-surface-variant hover:bg-error/10 hover:text-error">
            <Trash2 className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Product Profile Header */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-3xl md:text-5xl shrink-0 border border-primary/20 shadow-inner">
            {productData.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge status={productData.status} variant="dot" colorTheme="success" />
                <span className="text-xs font-mono font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded border border-outline-variant/10">
                  {productData.sku}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">{productData.name}</h1>
              <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium mt-1">
                <span className="bg-surface-container-low px-2.5 py-1 rounded-md border border-outline-variant/10">{productData.category}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/40" />
                <span className="bg-surface-container-low px-2.5 py-1 rounded-md border border-outline-variant/10">{productData.brand}</span>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-3xl">
              {productData.description}
            </p>
          </div>
          <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/20 w-full md:w-auto shrink-0 md:text-right">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Selling Price</p>
            <p className="text-3xl font-black text-primary">₹{productData.price.toLocaleString('en-IN')}</p>
            <p className="text-xs font-medium text-on-surface-variant mt-2">Cost: ₹{productData.costPrice.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Current Stock</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-on-surface">{productData.stock}</p>
                <p className="text-xs font-medium text-success">In Stock</p>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Sold</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-on-surface">{productData.totalSold}</p>
                <p className="text-xs font-medium text-on-surface-variant">Units</p>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Revenue Generated</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-on-surface">₹{(productData.revenue / 1000000).toFixed(2)}M</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs & Content */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 border-b border-outline-variant/10 pt-4 flex gap-6">
            {['Overview', 'Stock History'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-4 text-sm font-bold transition-all relative",
                  activeTab === tab 
                    ? "text-primary" 
                    : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'Overview' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest mb-4">Inventory Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                      <span className="text-sm text-on-surface-variant font-medium">Initial Stock</span>
                      <span className="text-sm font-bold text-on-surface">50 Units</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                      <span className="text-sm text-on-surface-variant font-medium">Minimum Stock Alert</span>
                      <span className="text-sm font-bold text-on-surface">{productData.minStock} Units</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                      <span className="text-sm text-on-surface-variant font-medium">Tax Rate</span>
                      <span className="text-sm font-bold text-on-surface">18% (GST)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest mb-4">Organization</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                      <span className="text-sm text-on-surface-variant font-medium">Category</span>
                      <span className="text-sm font-bold text-on-surface">{productData.category}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                      <span className="text-sm text-on-surface-variant font-medium">Brand</span>
                      <span className="text-sm font-bold text-on-surface">{productData.brand}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                      <span className="text-sm text-on-surface-variant font-medium">Date Added</span>
                      <span className="text-sm font-bold text-on-surface">Jan 12, 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-container-low/50">
                    <tr>
                      <th className="px-4 py-3 font-bold text-on-surface-variant uppercase tracking-widest text-xs rounded-l-lg">Date</th>
                      <th className="px-4 py-3 font-bold text-on-surface-variant uppercase tracking-widest text-xs">Type</th>
                      <th className="px-4 py-3 font-bold text-on-surface-variant uppercase tracking-widest text-xs">Quantity</th>
                      <th className="px-4 py-3 font-bold text-on-surface-variant uppercase tracking-widest text-xs rounded-r-lg">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {stockHistory.map((row) => (
                      <tr key={row.id} className="hover:bg-surface-container-low/30">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-on-surface-variant" />
                            <span className="font-medium text-on-surface">{row.date}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "px-2 py-1 rounded text-xs font-bold",
                            row.type === 'Addition' ? 'bg-success/10 text-success' :
                            row.type === 'Sale' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'
                          )}>
                            {row.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "font-bold",
                            row.qty > 0 ? "text-success" : "text-error"
                          )}>
                            {row.qty > 0 ? `+${row.qty}` : row.qty}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-on-surface-variant">{row.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
