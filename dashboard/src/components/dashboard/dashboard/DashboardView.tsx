'use client';

import React from 'react';
import { GlassCard } from '@/components/common/Card';
import {
    Calendar, ChevronDown, Download, Wallet, Filter,
    ArrowUp, ArrowDown, ShoppingBag, LineChart, Users,
    Package, AlertTriangle, Receipt, CreditCard, Activity,
    Bell, CheckCircle2, Clock, User, Truck, UserPlus
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { StatsCard } from '@/components/common/StatsCard';

export default function DashboardView() {
    return (
        <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full min-w-0">
            <div className="w-full space-y-6 flex-1">

                {/* Main Hero Header */}
                <div className="gradient-button p-6 md:p-8 text-on-primary relative overflow-hidden shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl mb-6">
                    {/* Decorative Background */}
                    <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none">
                        <svg className="w-full h-full transform translate-x-1/4 -translate-y-1/4" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path d="M42.7,-73.4C55.9,-67.8,67.6,-57.4,75.9,-44.6C84.2,-31.8,89.1,-15.9,88.4,-0.4C87.7,15.1,81.4,30.2,71.5,42.5C61.6,54.8,48.1,64.3,33.5,70.6C18.9,76.9,3.1,80,-12.3,78.7C-27.7,77.4,-42.7,71.7,-54.6,61.8C-66.5,51.9,-75.3,37.8,-80.4,22.4C-85.5,7,-86.9,-9.7,-81.8,-24.5C-76.7,-39.3,-65.1,-52.2,-51,-59.8C-36.9,-67.4,-20.3,-69.7,-4.3,-62.4C11.7,-55.1,29.5,-79,42.7,-73.4Z" fill="#FFFFFF" transform="translate(100 100) scale(1.1)"></path>
                        </svg>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                            Dashboard Overview <span className="text-2xl">👋</span>
                        </h2>
                        <p className="text-white/80 text-base">
                            Welcome back, Raj! Here's what's happening with your business today.
                        </p>
                    </div>
                    <div className="relative z-10 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2.5 rounded-xl cursor-pointer hover:bg-white/30 transition-colors">
                            <Calendar className="w-5 h-5" />
                            <span className="font-semibold text-sm">18 Aug, 2024</span>
                            <ChevronDown className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2.5 rounded-xl cursor-pointer hover:bg-white/30 transition-colors">
                            <Filter className="w-5 h-5" />
                            <span className="font-semibold text-sm">Filter</span>
                        </div>
                        <button className="flex items-center gap-2 bg-white text-primary px-4 py-2.5 rounded-xl cursor-pointer hover:bg-surface transition-colors shadow-sm font-semibold text-sm">
                            <Download className="w-5 h-5" />
                            Export
                            <ChevronDown className="w-5 h-5 ml-1" />
                        </button>
                    </div>
                </div>

                {/* KPI Grid (Matching TeamMembersView style) */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    <StatsCard
                        title="Total Revenue"
                        value="₹52,450"
                        icon={ShoppingBag}
                        colorTheme="primary"
                        trend="18.2%"
                        trendDirection="up"
                        trendLabel="vs yesterday"
                    />
                    
                    <StatsCard
                        title="Total Orders"
                        value="324"
                        icon={Receipt}
                        colorTheme="secondary"
                        trend="12.5%"
                        trendDirection="up"
                        trendLabel="vs yesterday"
                    />

                    <StatsCard
                        title="Total Profit"
                        value="₹12,850"
                        icon={LineChart}
                        colorTheme="success"
                        trend="9.3%"
                        trendDirection="up"
                        trendLabel="vs yesterday"
                    />

                    <StatsCard
                        title="Total Customers"
                        value="865"
                        icon={Users}
                        colorTheme="warning"
                        trend="7.6%"
                        trendDirection="up"
                        trendLabel="vs yesterday"
                    />

                    <StatsCard
                        title="Total Products"
                        value="1,240"
                        icon={Package}
                        colorTheme="primary"
                        trend="4.3%"
                        trendDirection="up"
                        trendLabel="vs yesterday"
                    />

                    <StatsCard
                        title="Low Stock Items"
                        value="15"
                        icon={AlertTriangle}
                        colorTheme="error"
                        trend="3"
                        trendDirection="down"
                        trendLabel="vs yesterday"
                    />

                    <StatsCard
                        title="Total Expenses"
                        value="₹21,400"
                        icon={Wallet}
                        colorTheme="warning"
                        trend="11.2%"
                        trendDirection="up"
                        trendLabel="vs yesterday"
                    />
                </div>

                {/* Analytics & Revenue Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sales Analytics Chart */}
                    <GlassCard className="lg:col-span-2 p-6 flex flex-col border-outline-variant/20 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-bold text-on-surface">Sales Analytics</h3>
                            <div className="flex items-center gap-2 border border-outline-variant/30 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-surface-container-low text-xs font-medium text-on-surface-variant">
                                This Year <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-center gap-6 mb-4 text-xs font-medium">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                                <span className="text-on-surface-variant">This Year</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full border-2 border-dashed border-blue-300 bg-transparent"></span>
                                <span className="text-muted-foreground text-blue-300/80">Last Year</span>
                            </div>
                        </div>

                        <div className="h-[220px] w-full relative flex items-end mt-auto">
                            <div className="absolute left-0 h-full flex flex-col justify-between text-[10px] text-muted-foreground pb-6 pr-4 border-r border-outline-variant/20">
                                <span>₹1,00,000</span>
                                <span>₹75,000</span>
                                <span>₹50,000</span>
                                <span>₹25,000</span>
                                <span>₹0</span>
                            </div>
                            <div className="ml-16 w-full h-full relative">
                                {/* Horizontal Grid Lines */}
                                <div className="absolute inset-0 flex flex-col justify-between pb-6">
                                    <div className="w-full h-px bg-outline-variant/10"></div>
                                    <div className="w-full h-px bg-outline-variant/10"></div>
                                    <div className="w-full h-px bg-outline-variant/10"></div>
                                    <div className="w-full h-px bg-outline-variant/10"></div>
                                    <div className="w-full h-px bg-outline-variant/20"></div>
                                </div>
                                {/* Chart Graphic Placeholder */}
                                <div className="absolute inset-0 pb-6">
                                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                    <path d="M0,80 L15,85 L30,75 L45,65 L60,55 L75,70 L90,60 L100,65" fill="none" className="stroke-blue-300" strokeDasharray="4,4" strokeWidth="1.5" vectorEffect="non-scaling-stroke"></path>
                                    <path d="M0,70 L15,60 L30,65 L45,50 L60,30 L75,45 L90,20 L100,30" fill="none" className="stroke-blue-600" strokeWidth="2.5" vectorEffect="non-scaling-stroke"></path>
                                  </svg>
                                  {/* Perfect HTML Circles for data points to prevent distortion */}
                                  <div className="absolute w-3 h-3 rounded-full bg-blue-600 transform -translate-x-1/2 translate-y-1/2" style={{ left: '15%', bottom: 'calc(60% + 24px)' }}></div>
                                  <div className="absolute w-3 h-3 rounded-full bg-blue-600 transform -translate-x-1/2 translate-y-1/2" style={{ left: '30%', bottom: 'calc(65% + 24px)' }}></div>
                                  <div className="absolute w-3 h-3 rounded-full bg-blue-600 transform -translate-x-1/2 translate-y-1/2" style={{ left: '45%', bottom: 'calc(50% + 24px)' }}></div>
                                  <div className="absolute w-3 h-3 rounded-full bg-blue-600 transform -translate-x-1/2 translate-y-1/2" style={{ left: '60%', bottom: 'calc(30% + 24px)' }}></div>
                                  <div className="absolute w-3 h-3 rounded-full bg-blue-600 transform -translate-x-1/2 translate-y-1/2" style={{ left: '75%', bottom: 'calc(45% + 24px)' }}></div>
                                  <div className="absolute w-3 h-3 rounded-full bg-blue-600 transform -translate-x-1/2 translate-y-1/2" style={{ left: '90%', bottom: 'calc(20% + 24px)' }}></div>
                                </div>
                                <div className="absolute bottom-0 w-full flex justify-between text-[10px] font-medium text-muted-foreground px-2">
                                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Revenue Breakdown */}
                    <GlassCard className="p-6 flex flex-col border-outline-variant/20 shadow-sm">
                        <h3 className="text-base font-bold text-on-surface mb-6">Revenue Breakdown</h3>
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div
                                className="w-40 h-40 rounded-full border-[12px] border-surface relative mb-6 shadow-sm"
                                style={{
                                    borderTopColor: 'var(--color-success)',
                                    borderRightColor: 'var(--color-primary)',
                                    borderBottomColor: 'var(--color-secondary)',
                                    borderLeftColor: 'var(--color-warning)',
                                    transform: 'rotate(-45deg)'
                                }}
                            >
                                <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ transform: 'rotate(45deg)' }}>
                                    <span className="font-bold text-lg text-on-surface">₹52,450</span>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Total</span>
                                </div>
                            </div>

                            <div className="w-full space-y-3 mt-4">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
                                        <span className="text-on-surface-variant font-medium">Cash</span>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <span className="font-semibold text-on-surface">₹18,250</span>
                                        <span className="text-muted-foreground text-[10px] w-8 text-right">(34%)</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                                        <span className="text-on-surface-variant font-medium">UPI</span>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <span className="font-semibold text-on-surface">₹17,850</span>
                                        <span className="text-muted-foreground text-[10px] w-8 text-right">(33%)</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                                        <span className="text-on-surface-variant font-medium">Card</span>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <span className="font-semibold text-on-surface">₹12,400</span>
                                        <span className="text-muted-foreground text-[10px] w-8 text-right">(23%)</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-warning"></span>
                                        <span className="text-on-surface-variant font-medium">Bank Transfer</span>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <span className="font-semibold text-on-surface">₹4,950</span>
                                        <span className="text-muted-foreground text-[10px] w-8 text-right">(10%)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Inventory Status & Top Selling Products */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Inventory Status */}
                    <GlassCard className="p-6 border-outline-variant/20 shadow-sm flex flex-col">
                        <h3 className="text-base font-bold text-on-surface mb-6">Inventory Status</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 h-full">

                            <div className="bg-surface-container/50 border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between">
                                <div className="flex items-center gap-2 mb-3">
                                    <Package className="w-4 h-4 text-success" />
                                    <span className="text-xs font-semibold text-on-surface-variant">In Stock</span>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-on-surface mb-2">84%</h4>
                                    <div className="w-full h-1.5 bg-outline-variant/30 rounded-full mb-1">
                                        <div className="h-full bg-success rounded-full" style={{ width: '84%' }}></div>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground">1,041 Items</span>
                                </div>
                            </div>

                            <div className="bg-surface-container/50 border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertTriangle className="w-4 h-4 text-warning" />
                                    <span className="text-xs font-semibold text-on-surface-variant">Low Stock</span>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-on-surface mb-2">12%</h4>
                                    <div className="w-full h-1.5 bg-outline-variant/30 rounded-full mb-1">
                                        <div className="h-full bg-warning rounded-full" style={{ width: '12%' }}></div>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground">142 Items</span>
                                </div>
                            </div>

                            <div className="bg-surface-container/50 border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between">
                                <div className="flex items-center gap-2 mb-3">
                                    <ShoppingBag className="w-4 h-4 text-error" />
                                    <span className="text-xs font-semibold text-on-surface-variant">Out of Stock</span>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-on-surface mb-2">4%</h4>
                                    <div className="w-full h-1.5 bg-outline-variant/30 rounded-full mb-1">
                                        <div className="h-full bg-error rounded-full" style={{ width: '4%' }}></div>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground">57 Items</span>
                                </div>
                            </div>

                            <div className="bg-surface-container/50 border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between">
                                <div className="flex items-center gap-2 mb-3">
                                    <Package className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-semibold text-on-surface-variant">Total Items</span>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-on-surface mb-2">1,240</h4>
                                    <div className="w-full h-1.5 bg-transparent rounded-full mb-1"></div>
                                    <span className="text-[10px] text-muted-foreground">All Products</span>
                                </div>
                            </div>

                        </div>
                    </GlassCard>

                    {/* Top Selling Products */}
                    <GlassCard className="p-6 border-outline-variant/20 shadow-sm flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-bold text-on-surface">Top Selling Products</h3>
                            <div className="flex items-center gap-2 border border-outline-variant/30 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-surface-container-low text-xs font-medium text-on-surface-variant">
                                This Month <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="space-y-4 flex-1 flex flex-col justify-center">
                            {[
                                { name: 'Amul Milk 1L', count: 850, percent: 100 },
                                { name: 'Tata Tea Premium', count: 650, percent: 76 },
                                { name: 'Nescafe Coffee', count: 520, percent: 61 },
                                { name: 'Aashirvaad Atta 5kg', count: 420, percent: 49 },
                                { name: 'Fortune Sunflower Oil', count: 380, percent: 44 },
                            ].map((product, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <span className="text-xs font-medium text-on-surface-variant w-32 truncate">{product.name}</span>
                                    <div className="flex-1 h-2 bg-outline-variant/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full" style={{ width: `${product.percent}%` }}></div>
                                    </div>
                                    <span className="text-xs font-semibold text-on-surface w-8 text-right">{product.count}</span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* Recent Sales & Low Stock Alerts */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Recent Sales */}
                    <GlassCard className="p-6 border-outline-variant/20 shadow-sm overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-bold text-on-surface">Recent Sales</h3>
                            <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="text-muted-foreground border-b border-outline-variant/20">
                                        <th className="pb-3 font-medium text-xs">Invoice</th>
                                        <th className="pb-3 font-medium text-xs">Customer</th>
                                        <th className="pb-3 font-medium text-xs">Amount</th>
                                        <th className="pb-3 font-medium text-xs">Payment</th>
                                        <th className="pb-3 font-medium text-xs">Status</th>
                                        <th className="pb-3 font-medium text-xs">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/10">
                                    {[
                                        { inv: 'INV-10045', cust: 'Rahul Sharma', amt: '₹1,250', pay: 'UPI', time: '10:30 AM' },
                                        { inv: 'INV-10044', cust: 'Priya Patel', amt: '₹850', pay: 'Cash', time: '10:15 AM' },
                                        { inv: 'INV-10043', cust: 'Amit Verma', amt: '₹2,630', pay: 'Card', time: '09:45 AM' },
                                        { inv: 'INV-10042', cust: 'Neha Singh', amt: '₹1,980', pay: 'UPI', time: '09:30 AM' },
                                        { inv: 'INV-10041', cust: 'Suresh Kumar', amt: '₹560', pay: 'Cash', time: '09:10 AM' },
                                    ].map((row, idx) => (
                                        <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                                            <td className="py-3 text-primary font-medium text-xs">{row.inv}</td>
                                            <td className="py-3 text-on-surface text-xs">{row.cust}</td>
                                            <td className="py-3 text-on-surface font-medium text-xs">{row.amt}</td>
                                            <td className="py-3 text-on-surface-variant text-xs">{row.pay}</td>
                                            <td className="py-3">
                                                <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold border border-success/20">
                                                    Completed
                                                </span>
                                            </td>
                                            <td className="py-3 text-muted-foreground text-xs">{row.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>

                    {/* Low Stock Alerts */}
                    <GlassCard className="p-6 border-outline-variant/20 shadow-sm flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-bold text-on-surface">Low Stock Alerts</h3>
                            <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: 'Amul Milk 1L', left: 5, color: 'bg-primary/20' },
                                { name: 'Tata Tea Premium 250g', left: 3, color: 'bg-secondary/20' },
                                { name: 'Nescafe Coffee 100g', left: 2, color: 'bg-error/20' },
                                { name: 'Aashirvaad Atta 5kg', left: 4, color: 'bg-warning/20' },
                                { name: 'Fortune Sunflower Oil 1L', left: 6, color: 'bg-success/20' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between border-b border-outline-variant/10 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
                                            <Package className="w-4 h-4 text-on-surface" />
                                        </div>
                                        <span className="text-sm font-medium text-on-surface">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-error text-xs font-bold">{item.left} Left</span>
                                        <button className="text-xs font-bold text-error border border-error/30 hover:bg-error/10 px-3 py-1.5 rounded-lg transition-colors">
                                            Order Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* 4 Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <GlassCard className="p-5 border-outline-variant/20 shadow-sm flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-bold text-on-surface mb-1">Customer Due</h4>
                            <p className="text-xl font-black text-on-surface mb-1">₹18,500</p>
                            <p className="text-[10px] text-muted-foreground mb-3">Total Outstanding</p>
                            <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center text-error">
                            <User className="w-6 h-6" />
                        </div>
                    </GlassCard>

                    <GlassCard className="p-5 border-outline-variant/20 shadow-sm flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-bold text-on-surface mb-1">Supplier Due</h4>
                            <p className="text-xl font-black text-on-surface mb-1">₹27,800</p>
                            <p className="text-[10px] text-muted-foreground mb-3">Total Outstanding</p>
                            <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Truck className="w-6 h-6" />
                        </div>
                    </GlassCard>

                    <GlassCard className="p-5 border-outline-variant/20 shadow-sm flex items-center justify-between">
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-on-surface mb-2">Payment Status</h4>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-success"></span> Paid</span>
                                    <span className="font-semibold">₹34,650</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-warning"></span> Pending</span>
                                    <span className="font-semibold">₹18,500</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-error"></span> Overdue</span>
                                    <span className="font-semibold text-error">₹7,250</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary ml-4">
                            <CreditCard className="w-6 h-6" />
                        </div>
                    </GlassCard>

                    <GlassCard className="p-5 border-outline-variant/20 shadow-sm flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-bold text-on-surface mb-1">Expense Summary</h4>
                            <p className="text-xl font-black text-on-surface mb-1">₹21,400</p>
                            <p className="text-[10px] text-muted-foreground mb-3">This Month</p>
                            <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View Details</span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
                            <Wallet className="w-6 h-6" />
                        </div>
                    </GlassCard>
                </div>

                {/* Bottom Row: Timeline, Calendar, Notifications */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Activity Timeline */}
                    <GlassCard className="p-6 border-outline-variant/20 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-bold text-on-surface">Activity Timeline</h3>
                            <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
                        </div>
                        <div className="relative pl-3 space-y-6">
                            {/* Vertical line */}
                            <div className="absolute left-4 top-2 bottom-2 w-px bg-outline-variant/30"></div>

                            <div className="relative flex gap-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-success mt-1.5 shrink-0 z-10 ring-4 ring-surface"></div>
                                <div className="flex-1 flex justify-between text-xs">
                                    <span className="text-on-surface-variant font-medium">Purchase <span className="text-primary font-bold">#PUR-1045</span> added by Raj</span>
                                    <span className="text-muted-foreground shrink-0">10:30 AM</span>
                                </div>
                            </div>
                            <div className="relative flex gap-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 shrink-0 z-10 ring-4 ring-surface"></div>
                                <div className="flex-1 flex justify-between text-xs">
                                    <span className="text-on-surface-variant font-medium">New Product <span className="text-on-surface font-bold">Nescafe Coffee</span> added</span>
                                    <span className="text-muted-foreground shrink-0">09:45 AM</span>
                                </div>
                            </div>
                            <div className="relative flex gap-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-warning mt-1.5 shrink-0 z-10 ring-4 ring-surface"></div>
                                <div className="flex-1 flex justify-between text-xs">
                                    <span className="text-on-surface-variant font-medium">Payment of <span className="font-bold text-success">₹2,500</span> received from Rahul Sharma</span>
                                    <span className="text-muted-foreground shrink-0">09:30 AM</span>
                                </div>
                            </div>
                            <div className="relative flex gap-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-error mt-1.5 shrink-0 z-10 ring-4 ring-surface"></div>
                                <div className="flex-1 flex justify-between text-xs">
                                    <span className="text-on-surface-variant font-medium">Expense of <span className="font-bold text-error">₹1,200</span> added for Electricity Bill</span>
                                    <span className="text-muted-foreground shrink-0">09:15 AM</span>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Simple Static Calendar */}
                    <GlassCard className="p-6 border-outline-variant/20 shadow-sm flex flex-col">
                        <h3 className="text-base font-bold text-on-surface mb-4">Calendar</h3>
                        <div className="flex items-center justify-between mb-4 px-2">
                            <ChevronDown className="w-4 h-4 text-on-surface-variant rotate-90 cursor-pointer" />
                            <span className="text-sm font-bold text-on-surface">August 2024</span>
                            <ChevronDown className="w-4 h-4 text-on-surface-variant -rotate-90 cursor-pointer" />
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-muted-foreground font-medium">
                            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-sm">
                            <div className="text-muted-foreground/30 py-1.5">28</div>
                            <div className="text-muted-foreground/30 py-1.5">29</div>
                            <div className="text-muted-foreground/30 py-1.5">30</div>
                            <div className="text-muted-foreground/30 py-1.5">31</div>
                            <div className="py-1.5 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface">1</div>
                            <div className="py-1.5 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface">2</div>
                            <div className="py-1.5 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface">3</div>
                            <div className="py-1.5 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface">4</div>
                            <div className="py-1.5 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface">5</div>
                            <div className="py-1.5 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface">6</div>
                            <div className="py-1.5 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface">7</div>
                            <div className="py-1.5 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface">8</div>
                            <div className="py-1.5 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface">9</div>
                            <div className="py-1.5 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface">10</div>
                            <div className="py-1.5 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface">11</div>
                            <div className="py-1.5 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface">12</div>
                            <div className="py-1.5 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface">13</div>
                            <div className="py-1.5 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface">14</div>
                            <div className="py-1.5 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface">15</div>
                            <div className="py-1.5 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface">16</div>
                            <div className="py-1.5 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface">17</div>
                            <div className="py-1.5 gradient-button text-white font-bold rounded-lg cursor-pointer shadow-sm shadow-primary/30">18</div>
                            <div className="py-1.5 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface">19</div>
                            <div className="py-1.5 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface">20</div>
                            <div className="py-1.5 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface">21</div>
                            <div className="py-1.5 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface">22</div>
                            <div className="py-1.5 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface">23</div>
                            <div className="py-1.5 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface">24</div>
                        </div>
                    </GlassCard>

                    {/* Notifications */}
                    <GlassCard className="p-6 border-outline-variant/20 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-bold text-on-surface">Notifications</h3>
                            <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View All</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-error/10 text-error flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-on-surface-variant">Low stock alert for 5 items</p>
                                </div>
                                <span className="text-[10px] text-muted-foreground shrink-0">5 min ago</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-on-surface-variant">New order <span className="font-bold text-on-surface">#ORD-1048</span> received</p>
                                </div>
                                <span className="text-[10px] text-muted-foreground shrink-0">15 min ago</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <Wallet className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-on-surface-variant">Payment of ₹1,250 received</p>
                                </div>
                                <span className="text-[10px] text-muted-foreground shrink-0">30 min ago</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-warning/10 text-warning flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-on-surface-variant">Expense limit exceeded</p>
                                </div>
                                <span className="text-[10px] text-muted-foreground shrink-0">1 hour ago</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                                    <UserPlus className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-on-surface-variant">New customer registered</p>
                                </div>
                                <span className="text-[10px] text-muted-foreground shrink-0">2 hours ago</span>
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
