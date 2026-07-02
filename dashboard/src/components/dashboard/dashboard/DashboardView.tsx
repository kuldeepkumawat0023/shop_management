'use client';

import React from 'react';
import { GlassCard } from '@/components/common/Card';
import { 
  Calendar, ChevronDown, Download, Wallet, 
  ArrowUp, ShoppingBag, LineChart, Users 
} from 'lucide-react';

export default function DashboardView() {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 w-full">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Main Hero Header */}
        <div className="gradient-button p-6 md:p-8 text-on-primary relative overflow-hidden shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Decorative Background */}
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none">
            <svg className="w-full h-full transform translate-x-1/4 -translate-y-1/4" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path d="M42.7,-73.4C55.9,-67.8,67.6,-57.4,75.9,-44.6C84.2,-31.8,89.1,-15.9,88.4,-0.4C87.7,15.1,81.4,30.2,71.5,42.5C61.6,54.8,48.1,64.3,33.5,70.6C18.9,76.9,3.1,80,-12.3,78.7C-27.7,77.4,-42.7,71.7,-54.6,61.8C-66.5,51.9,-75.3,37.8,-80.4,22.4C-85.5,7,-86.9,-9.7,-81.8,-24.5C-76.7,-39.3,-65.1,-52.2,-51,-59.8C-36.9,-67.4,-20.3,-69.7,-4.3,-62.4C11.7,-55.1,29.5,-79,42.7,-73.4Z" fill="#FFFFFF" transform="translate(100 100) scale(1.1)"></path>
            </svg>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-on-primary mb-2 flex items-center gap-2">
              Dashboard Overview <span className="text-2xl">👋</span>
            </h2>
            <p className="text-primary-container/80 text-base">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2.5 rounded-xl cursor-pointer hover:bg-white/30 transition-colors">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold text-sm">Today</span>
              <ChevronDown className="w-5 h-5" />
            </div>
            <button className="flex items-center gap-2 bg-white text-primary px-4 py-2.5 rounded-xl cursor-pointer hover:bg-surface transition-colors shadow-sm font-semibold text-sm">
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Card 1 */}
          <GlassCard className="p-6 group cursor-pointer hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-on-surface-variant font-semibold text-sm">Total Revenue</span>
            </div>
            <h3 className="text-3xl font-bold text-on-surface mb-2">₹52,450</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center text-success font-semibold bg-success/10 px-1.5 py-0.5 rounded">
                <ArrowUp className="w-3.5 h-3.5 mr-0.5" /> 18.2%
              </span>
              <span className="text-muted-foreground">vs yesterday</span>
            </div>
          </GlassCard>

          {/* Card 2 */}
          <GlassCard className="p-6 group cursor-pointer hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="text-on-surface-variant font-semibold text-sm">Total Orders</span>
            </div>
            <h3 className="text-3xl font-bold text-on-surface mb-2">324</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center text-success font-semibold bg-success/10 px-1.5 py-0.5 rounded">
                <ArrowUp className="w-3.5 h-3.5 mr-0.5" /> 12.5%
              </span>
              <span className="text-muted-foreground">vs yesterday</span>
            </div>
          </GlassCard>

          {/* Card 3 */}
          <GlassCard className="p-6 group cursor-pointer hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success group-hover:scale-110 transition-transform">
                <LineChart className="w-6 h-6" />
              </div>
              <span className="text-on-surface-variant font-semibold text-sm">Total Profit</span>
            </div>
            <h3 className="text-3xl font-bold text-on-surface mb-2">₹12,850</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center text-success font-semibold bg-success/10 px-1.5 py-0.5 rounded">
                <ArrowUp className="w-3.5 h-3.5 mr-0.5" /> 9.3%
              </span>
              <span className="text-muted-foreground">vs yesterday</span>
            </div>
          </GlassCard>

          {/* Card 4 */}
          <GlassCard className="p-6 group cursor-pointer hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center text-warning group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-on-surface-variant font-semibold text-sm">Total Customers</span>
            </div>
            <h3 className="text-3xl font-bold text-on-surface mb-2">865</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center text-success font-semibold bg-success/10 px-1.5 py-0.5 rounded">
                <ArrowUp className="w-3.5 h-3.5 mr-0.5" /> 7.6%
              </span>
              <span className="text-muted-foreground">vs yesterday</span>
            </div>
          </GlassCard>
        </div>

        {/* Row 2: Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line Chart Area */}
          <GlassCard className="lg:col-span-2 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-on-surface">Sales Analytics</h3>
              <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-1.5 cursor-pointer hover:bg-surface-container-low text-sm font-medium">
                This Year <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <span className="text-muted-foreground">This Year</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-secondary border-dashed"></span>
                <span className="text-muted-foreground">Last Year</span>
              </div>
            </div>
            
            {/* Static Chart Placeholder */}
            <div className="h-64 w-full relative flex items-end mt-auto">
              <div className="absolute left-0 h-full flex flex-col justify-between text-[11px] text-muted-foreground pb-6 pr-4 border-r border-border">
                <span>₹1,00,000</span>
                <span>₹75,000</span>
                <span>₹50,000</span>
                <span>₹25,000</span>
                <span>₹0</span>
              </div>
              <div className="ml-16 w-full h-full relative">
                {/* Horizontal Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pb-6">
                  <div className="w-full h-px bg-border/40"></div>
                  <div className="w-full h-px bg-border/40"></div>
                  <div className="w-full h-px bg-border/40"></div>
                  <div className="w-full h-px bg-border/40"></div>
                  <div className="w-full h-px bg-border"></div>
                </div>
                {/* Abstract Chart Graphic Placeholder */}
                <div className="absolute inset-0 pb-6 flex items-end">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,80 L15,85 L30,75 L45,65 L60,55 L75,70 L90,60 L100,65" fill="none" stroke="var(--color-secondary)" strokeDasharray="4,4" strokeWidth="1.5" vectorEffect="non-scaling-stroke"></path>
                    <path d="M0,70 L15,60 L30,65 L45,50 L60,30 L75,45 L90,20 L100,30" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" vectorEffect="non-scaling-stroke"></path>
                    
                    <circle cx="15" cy="60" fill="var(--color-primary)" r="2" vectorEffect="non-scaling-stroke"></circle>
                    <circle cx="30" cy="65" fill="var(--color-primary)" r="2" vectorEffect="non-scaling-stroke"></circle>
                    <circle cx="45" cy="50" fill="var(--color-primary)" r="2" vectorEffect="non-scaling-stroke"></circle>
                    <circle cx="60" cy="30" fill="var(--color-primary)" r="2" vectorEffect="non-scaling-stroke"></circle>
                    <circle cx="75" cy="45" fill="var(--color-primary)" r="2" vectorEffect="non-scaling-stroke"></circle>
                    <circle cx="90" cy="20" fill="var(--color-primary)" r="2" vectorEffect="non-scaling-stroke"></circle>
                  </svg>
                </div>
                {/* X Axis Labels */}
                <div className="absolute bottom-0 w-full flex justify-between text-[11px] text-muted-foreground px-2">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Revenue Breakdown */}
          <GlassCard className="p-6 flex flex-col">
            <h3 className="text-xl font-bold text-on-surface mb-6">Revenue Breakdown</h3>
            <div className="flex-1 flex flex-col items-center justify-center relative">
              {/* Static Donut Chart Placeholder */}
              <div 
                className="w-48 h-48 rounded-full border-[16px] border-surface relative mb-6" 
                style={{
                  borderTopColor: 'var(--color-success)', 
                  borderRightColor: 'var(--color-primary)', 
                  borderBottomColor: 'var(--color-secondary)', 
                  borderLeftColor: 'var(--color-warning)', 
                  transform: 'rotate(-45deg)'
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center" style={{transform: 'rotate(45deg)'}}>
                  <span className="font-bold text-lg text-on-surface">₹52,450</span>
                  <span className="text-xs text-muted-foreground">Total</span>
                </div>
              </div>
              
              {/* Legend */}
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
                    <span className="text-muted-foreground">Cash</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-on-surface">₹18,250</span>
                    <span className="text-muted-foreground text-xs w-10 text-right">(34%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <span className="text-muted-foreground">UPI</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-on-surface">₹17,850</span>
                    <span className="text-muted-foreground text-xs w-10 text-right">(33%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    <span className="text-muted-foreground">Card</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-on-surface">₹12,400</span>
                    <span className="text-muted-foreground text-xs w-10 text-right">(23%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-warning"></span>
                    <span className="text-muted-foreground">Bank Transfer</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-on-surface">₹4,950</span>
                    <span className="text-muted-foreground text-xs w-10 text-right">(10%)</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
        
        {/* Spacer */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
