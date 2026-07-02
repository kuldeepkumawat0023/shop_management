'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowLeft, UploadCloud, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';

export default function NewProductView() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto custom-scrollbar">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-outline-variant/20 px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-on-surface tracking-tight">Add New Product</h1>
            <p className="text-xs font-medium text-on-surface-variant mt-0.5">Create a new item in your catalog</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden sm:flex text-on-surface-variant hover:bg-error/10 hover:text-error">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button className="shadow-md">
            <Save className="w-4 h-4 mr-2" />
            Save Product
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Main Content Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Information */}
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-on-surface mb-6">Basic Information</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Product Name <span className="text-error">*</span></label>
                  <Input placeholder="e.g. Samsung Galaxy S24 Ultra" className="w-full" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    rows={4}
                    className="w-full rounded-xl bg-surface border border-outline-variant/20 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all text-on-surface placeholder:text-on-surface-variant/50 custom-scrollbar resize-none"
                    placeholder="Enter a detailed product description..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Product Images</label>
                  <div className="border-2 border-dashed border-outline-variant/30 rounded-xl bg-surface-container/30 hover:bg-surface-container/50 transition-colors p-8 flex flex-col items-center justify-center cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-on-surface">Click to upload or drag and drop</p>
                    <p className="text-xs text-on-surface-variant font-medium mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-on-surface mb-6">Pricing & Inventory</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Selling Price (₹) <span className="text-error">*</span></label>
                  <Input type="number" placeholder="0.00" className="w-full" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Cost Price (₹)</label>
                  <Input type="number" placeholder="0.00" className="w-full" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">SKU / Barcode <span className="text-error">*</span></label>
                  <Input placeholder="e.g. SKU-12345" className="w-full font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Tax Rate (%)</label>
                  <select className="w-full h-11 rounded-xl bg-surface border border-outline-variant/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all text-on-surface">
                    <option>0% (GST Exempt)</option>
                    <option>5% (GST)</option>
                    <option>12% (GST)</option>
                    <option defaultValue="18">18% (GST)</option>
                    <option>28% (GST)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
                <h3 className="text-sm font-bold text-on-surface mb-4">Stock Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Initial Stock</label>
                    <Input type="number" placeholder="0" className="w-full" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Low Stock Alert At</label>
                    <Input type="number" placeholder="10" className="w-full" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Forms */}
          <div className="space-y-6">
            
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-on-surface mb-6">Organization</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Category</label>
                  <select className="w-full h-11 rounded-xl bg-surface border border-outline-variant/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all text-on-surface">
                    <option value="">Select Category</option>
                    <option>Electronics</option>
                    <option>Groceries</option>
                    <option>Footwear</option>
                    <option>Personal Care</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Brand</label>
                  <select className="w-full h-11 rounded-xl bg-surface border border-outline-variant/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all text-on-surface">
                    <option value="">Select Brand</option>
                    <option>Samsung</option>
                    <option>Apple</option>
                    <option>Nike</option>
                    <option>Nivea</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-on-surface mb-6">Status</h2>
              
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 border border-primary/20 bg-primary/5 rounded-xl cursor-pointer">
                  <div className="flex h-5 items-center">
                    <input type="radio" name="status" defaultChecked className="w-4 h-4 text-primary focus:ring-primary border-outline-variant/30" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-on-surface">Published</span>
                    <span className="block text-xs font-medium text-on-surface-variant mt-0.5">Product will be visible in POS and available for sale.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-outline-variant/20 bg-surface rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors">
                  <div className="flex h-5 items-center">
                    <input type="radio" name="status" className="w-4 h-4 text-primary focus:ring-primary border-outline-variant/30" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-on-surface">Draft</span>
                    <span className="block text-xs font-medium text-on-surface-variant mt-0.5">Save as draft. Hidden from POS and sales.</span>
                  </div>
                </label>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
