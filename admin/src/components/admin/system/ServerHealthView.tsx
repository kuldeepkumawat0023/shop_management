'use client';

import React from 'react';
import { Activity, Server, Cpu, HardDrive, Database, Globe, ArrowUpRight, ArrowDownRight, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/common/Button';

export default function ServerHealthView() {
  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar gap-6 w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight flex items-center gap-2">
            <Activity className="w-8 h-8 text-primary" />
            Server Health
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">Real-time monitoring of system resources and performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-success flex items-center gap-1.5 bg-success/10 px-3 py-1.5 rounded-full border border-success/20">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            All Systems Operational
          </span>
          <Button variant="outline" className="gap-2 text-on-surface-variant hover:text-on-surface">
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CPU Usage */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Cpu className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-2">CPU Usage</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-on-surface tracking-tighter">42</span>
            <span className="text-xl font-bold text-on-surface-variant">%</span>
          </div>
          <p className="text-xs font-medium text-success mt-2 flex items-center gap-1">
            <ArrowDownRight className="w-3 h-3" />
            5% lower than average
          </p>
          {/* Mock Progress Bar */}
          <div className="w-full bg-surface-container-high rounded-full h-2 mt-4 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: '42%' }}></div>
          </div>
        </div>

        {/* RAM Usage */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-warning to-transparent opacity-50"></div>
          <div className="w-16 h-16 rounded-2xl bg-warning/10 text-warning flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Server className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-2">Memory (RAM)</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-on-surface tracking-tighter">18.4</span>
            <span className="text-xl font-bold text-on-surface-variant">GB</span>
          </div>
          <p className="text-xs font-medium text-warning mt-2">76% of 24 GB used</p>
          {/* Mock Progress Bar */}
          <div className="w-full bg-surface-container-high rounded-full h-2 mt-4 overflow-hidden">
            <div className="bg-warning h-full rounded-full" style={{ width: '76%' }}></div>
          </div>
        </div>

        {/* Disk Space */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-success to-transparent opacity-50"></div>
          <div className="w-16 h-16 rounded-2xl bg-success/10 text-success flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <HardDrive className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-2">Disk Space</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-on-surface tracking-tighter">450</span>
            <span className="text-xl font-bold text-on-surface-variant">GB</span>
          </div>
          <p className="text-xs font-medium text-success mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            Safe (1TB Total)
          </p>
          {/* Mock Progress Bar */}
          <div className="w-full bg-surface-container-high rounded-full h-2 mt-4 overflow-hidden">
            <div className="bg-success h-full rounded-full" style={{ width: '45%' }}></div>
          </div>
        </div>

      </div>

      {/* Network & DB Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Network Latency */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Globe className="w-5 h-5 text-secondary" />
              Network Latency
            </h2>
            <span className="text-sm font-bold text-secondary">32ms AVG</span>
          </div>
          <div className="h-40 w-full bg-surface-container-low rounded-xl border border-outline-variant/10 flex items-end p-2 gap-1 overflow-hidden relative">
            {/* Mock Graph Bars */}
            {[40, 35, 45, 30, 25, 50, 42, 38, 30, 32, 28, 35, 40, 45, 38, 32, 30].map((height, i) => (
              <div 
                key={i} 
                className="flex-1 bg-secondary/20 hover:bg-secondary/40 transition-colors rounded-t-sm"
                style={{ height: `${height}%` }}
              ></div>
            ))}
            {/* Overlay line */}
            <div className="absolute top-1/2 left-0 w-full border-t border-secondary/30 border-dashed pointer-events-none"></div>
          </div>
          <p className="text-xs font-medium text-on-surface-variant mt-4 text-center">Global CDN responding optimally. No regional outages detected.</p>
        </div>

        {/* Database Status */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2 mb-6">
            <Database className="w-5 h-5 text-primary" />
            Database Connections
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
              <div>
                <p className="text-sm font-bold text-on-surface">Primary DB Cluster</p>
                <p className="text-xs font-medium text-on-surface-variant mt-0.5">db-main.smartshop.internal</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-on-surface">1,245</p>
                <p className="text-xs font-medium text-success">Active Conns</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
              <div>
                <p className="text-sm font-bold text-on-surface">Read Replica (Asia)</p>
                <p className="text-xs font-medium text-on-surface-variant mt-0.5">db-replica-ap.smartshop.internal</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-on-surface">842</p>
                <p className="text-xs font-medium text-success">Active Conns</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
              <div>
                <p className="text-sm font-bold text-on-surface">Redis Cache</p>
                <p className="text-xs font-medium text-on-surface-variant mt-0.5">cache.smartshop.internal</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-on-surface">98%</p>
                <p className="text-xs font-medium text-success">Hit Rate</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
