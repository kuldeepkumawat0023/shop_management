'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowLeft, Save, PlayCircle, ClipboardList, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProductionForm() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto custom-scrollbar w-full mx-auto">
      {/* Header Sticky */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-outline-variant/20 p-4 md:p-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button onClick={() => router.back()} variant="outline" className="w-10 h-10 p-0 rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-black text-on-surface tracking-tight">New Production Run</h2>
              <p className="text-sm font-medium text-on-surface-variant">Log a new manufacturing process</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={() => router.back()} variant="outline" className="flex-1 sm:flex-none font-bold border-outline-variant/30">Cancel</Button>
            <Button className="flex-1 sm:w-auto gradient-button text-white font-bold shadow-md hover:shadow-lg gap-2">
              <PlayCircle className="w-4 h-4" />
              Start Production
            </Button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 md:p-6 lg:p-8 flex-1 max-w-4xl mx-auto w-full">
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-8">
          
          {/* Run Details */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant/10">
              <ClipboardList className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-on-surface">Run Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <Input 
                label="Recipe / Formula" 
                placeholder="Select a recipe to produce..."
                required
              />
              <Input 
                label="Run ID (Auto-generated)" 
                placeholder="PRD-1025"
                disabled
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input 
                label="Start Date" 
                type="date"
                required
              />
              <Input 
                label="Target Quantity (Multiplier)" 
                type="number"
                placeholder="1"
                required
              />
            </div>
          </div>

          {/* Expected Output vs Inventory */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant/10">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-on-surface">Expected Deductions & Yield</h3>
            </div>
            
            <div className="bg-surface-container/30 p-6 rounded-2xl border border-outline-variant/20 flex flex-col gap-4 text-sm">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Selected Recipe:</span>
                <span className="font-bold text-on-surface">None</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Raw Materials Required:</span>
                <span className="font-bold text-on-surface">-</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Expected Yield:</span>
                <span className="font-bold text-on-surface">-</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant border-t border-outline-variant/20 pt-4 mt-2">
                <span className="font-bold">Estimated Cost:</span>
                <span className="font-black text-primary text-lg">₹0.00</span>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant/70 mt-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-warning inline-block"></span>
              Note: Raw materials will be deducted from inventory automatically when the production is marked as Completed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
