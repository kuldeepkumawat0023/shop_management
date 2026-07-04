'use client';

import React from 'react';
import { GlassCard } from '@/components/common/Card';
import {
    Store, Key, Server, TrendingUp, Users,
    LifeBuoy, Activity, ShieldCheck, Database,
    ChevronDown, Download, Filter, Calendar
} from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';

import BranchNetworkTable from './BranchNetworkTable';

export default function DashboardView() {
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 w-full bg-surface">
            <div className="w-full mx-auto space-y-6">

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
                            Platform Command Center <span className="text-2xl">🌍</span>
                        </h2>
                        <p className="text-white/80 text-base">
                            Monitor all connected branches, system health, and global analytics.
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
                            System Report
                        </button>
                    </div>
                </div>

                {/* KPI Row (Horizontal Scroll) */}
                <div className="flex overflow-x-auto gap-4 pb-2 snap-x [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-outline-variant/30 [&::-webkit-scrollbar-thumb]:rounded-full">
                    <StatsCard
                        className="min-w-[220px] shrink-0 snap-start"
                        title="Active Branches"
                        value="142"
                        icon={Store}
                        colorTheme="primary"
                        trend="12"
                        trendDirection="up"
                        trendLabel="new this month"
                    />
                    
                    <StatsCard
                        className="min-w-[220px] shrink-0 snap-start"
                        title="MRR (Revenue)"
                        value="$84,500"
                        icon={TrendingUp}
                        colorTheme="success"
                        trend="8.5%"
                        trendDirection="up"
                        trendLabel="vs last month"
                    />

                    <StatsCard
                        className="min-w-[220px] shrink-0 snap-start"
                        title="Active Licenses"
                        value="1,048"
                        icon={Key}
                        colorTheme="secondary"
                        trend="45"
                        trendDirection="up"
                        trendLabel="expiring soon"
                    />

                    <StatsCard
                        className="min-w-[220px] shrink-0 snap-start"
                        title="System Uptime"
                        value="99.99%"
                        icon={Activity}
                        colorTheme="primary"
                        trend="Stable"
                        trendDirection="up"
                        trendLabel="All systems operational"
                    />

                    <StatsCard
                        className="min-w-[220px] shrink-0 snap-start"
                        title="Open Tickets"
                        value="24"
                        icon={LifeBuoy}
                        colorTheme="warning"
                        trend="5"
                        trendDirection="up"
                        trendLabel="critical priority"
                    />

                    <StatsCard
                        className="min-w-[220px] shrink-0 snap-start"
                        title="Security Alerts"
                        value="0"
                        icon={ShieldCheck}
                        colorTheme="success"
                        trend="0"
                        trendDirection="down"
                        trendLabel="threats detected"
                    />
                </div>

                {/* Analytics & System Health */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Platform Growth Chart */}
                    <GlassCard className="lg:col-span-2 p-6 flex flex-col border-outline-variant/20 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-bold text-on-surface">Platform Growth (Branches)</h3>
                            <div className="flex items-center gap-2 border border-outline-variant/30 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-surface-container-low text-xs font-medium text-on-surface-variant">
                                This Year <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-center gap-6 mb-4 text-xs font-medium">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                                <span className="text-on-surface-variant">New Signups</span>
                            </div>
                        </div>

                        <div className="h-[220px] w-full relative flex items-end mt-auto">
                            <div className="absolute left-0 h-full flex flex-col justify-between text-[10px] text-muted-foreground pb-6 pr-4 border-r border-outline-variant/20">
                                <span>200</span>
                                <span>150</span>
                                <span>100</span>
                                <span>50</span>
                                <span>0</span>
                            </div>
                            <div className="ml-10 w-full h-full relative">
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
                                    <path d="M0,70 L15,60 L30,65 L45,40 L60,30 L75,45 L90,20 L100,10" fill="none" className="stroke-blue-600" strokeWidth="2.5" vectorEffect="non-scaling-stroke"></path>
                                  </svg>
                                </div>
                                <div className="absolute bottom-0 w-full flex justify-between text-[10px] font-medium text-muted-foreground px-2">
                                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Infrastructure Status */}
                    <GlassCard className="p-6 flex flex-col border-outline-variant/20 shadow-sm">
                        <h3 className="text-base font-bold text-on-surface mb-6">Infrastructure Status</h3>
                        <div className="flex-1 flex flex-col gap-4 justify-center">
                            
                            <div className="flex items-center justify-between p-3 rounded-xl border border-outline-variant/20 bg-surface-container-low">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-success/10 rounded-lg text-success">
                                        <Database className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-on-surface">Main Database</div>
                                        <div className="text-xs text-on-surface-variant">PostgreSQL Cluster</div>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-success px-2 py-1 rounded-full bg-success/10">Operational</span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl border border-outline-variant/20 bg-surface-container-low">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-success/10 rounded-lg text-success">
                                        <Server className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-on-surface">API Gateway</div>
                                        <div className="text-xs text-on-surface-variant">Load Balancer (Mumbai)</div>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-success px-2 py-1 rounded-full bg-success/10">Operational</span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl border border-warning/30 bg-warning/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-warning/20 rounded-lg text-warning">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-on-surface">Auth Service</div>
                                        <div className="text-xs text-on-surface-variant">High latency detected</div>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-warning px-2 py-1 rounded-full bg-warning/20">Degraded</span>
                            </div>

                        </div>
                    </GlassCard>
                </div>

                {/* Branch Network Table Section */}
                <div className="pt-2">
                    <BranchNetworkTable />
                </div>
            </div>
        </div>
    );
}
