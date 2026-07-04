'use client';

import React, { useState } from 'react';
import { StatsCard } from '@/components/common/StatsCard';
import { Button } from '@/components/common/Button';
import { Download, IndianRupee, Users, ArrowUpRight, Activity } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock Data for Revenue
const revenueData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 48000 },
  { month: 'Apr', revenue: 61000 },
  { month: 'May', revenue: 59000 },
  { month: 'Jun', revenue: 72000 },
  { month: 'Jul', revenue: 85000 },
  { month: 'Aug', revenue: 91000 },
  { month: 'Sep', revenue: 88000 },
  { month: 'Oct', revenue: 105000 },
  { month: 'Nov', revenue: 112000 },
  { month: 'Dec', revenue: 125000 },
];

// Mock Data for Signups
const signupsData = [
  { month: 'Jan', newBranches: 12, churned: 2 },
  { month: 'Feb', newBranches: 19, churned: 1 },
  { month: 'Mar', newBranches: 15, churned: 3 },
  { month: 'Apr', newBranches: 22, churned: 2 },
  { month: 'May', newBranches: 28, churned: 4 },
  { month: 'Jun', newBranches: 35, churned: 1 },
  { month: 'Jul', newBranches: 42, churned: 5 },
  { month: 'Aug', newBranches: 38, churned: 2 },
  { month: 'Sep', newBranches: 45, churned: 3 },
  { month: 'Oct', newBranches: 52, churned: 2 },
  { month: 'Nov', newBranches: 60, churned: 4 },
  { month: 'Dec', newBranches: 75, churned: 5 },
];

// Mock Data for Plan Distribution
const planDistributionData = [
  { name: 'Basic', value: 450, color: '#3b82f6' },
  { name: 'Pro', value: 320, color: '#10b981' },
  { name: 'Enterprise', value: 85, color: '#8b5cf6' },
  { name: 'Legacy', value: 40, color: '#f59e0b' },
];

// Mock Data for Top Clients
const topClientsData = [
  { id: 1, name: 'Reliance Retail', plan: 'Enterprise', shops: 42, mrr: 125000 },
  { id: 2, name: 'Tata Westside', plan: 'Enterprise', shops: 38, mrr: 110000 },
  { id: 3, name: 'DMart Local', plan: 'Pro', shops: 15, mrr: 45000 },
  { id: 4, name: 'Spencer Super', plan: 'Pro', shops: 12, mrr: 36000 },
  { id: 5, name: 'V-Mart Retail', plan: 'Basic', shops: 8, mrr: 18000 },
];

export default function AnalyticsView() {
  const [timeRange, setTimeRange] = useState('12M');

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar gap-6 w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">Platform Analytics</h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">Monitor SaaS revenue, growth, and branch metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant/20">
            {['1M', '3M', '6M', '12M'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  timeRange === range ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            <span className="font-bold tracking-wide">Export CSV</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total MRR"
          value={formatCurrency(125000)}
          icon={IndianRupee}
          colorTheme="primary"
          trend="15%"
          trendDirection="up"
          trendLabel="VS LAST MONTH"
        />
        <StatsCard
          title="ARPU (Avg. Revenue)"
          value={formatCurrency(1850)}
          icon={ArrowUpRight}
          colorTheme="secondary"
          trend="4.2%"
          trendDirection="up"
          trendLabel="GROWTH YOY"
        />
        <StatsCard
          title="New Branch Signups"
          value="75"
          icon={Users}
          colorTheme="success"
          trend="24%"
          trendDirection="up"
          trendLabel="NEW THIS MONTH"
        />
        <StatsCard
          title="Platform Churn Rate"
          value="1.8%"
          icon={Activity}
          colorTheme="warning"
          trend="0.2%"
          trendDirection="down"
          trendLabel="IMPROVED"
        />
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-surface-container-lowest rounded-3xl p-5 md:p-6 shadow-sm border border-outline-variant/20 flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-on-surface">Revenue Growth</h3>
            <p className="text-sm text-on-surface-variant font-medium">Monthly recurring revenue (MRR) over time</p>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--outline-variant)" opacity={0.3} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--on-surface-variant)' }} dy={10} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'var(--on-surface-variant)' }}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                  width={60}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface-container-high)', borderRadius: '12px', border: '1px solid var(--outline-variant)' }}
                  itemStyle={{ color: 'var(--on-surface)', fontWeight: 'bold' }}
                  formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Signups Chart */}
        <div className="bg-surface-container-lowest rounded-3xl p-5 md:p-6 shadow-sm border border-outline-variant/20 flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-on-surface">Branch Acquisitions</h3>
            <p className="text-sm text-on-surface-variant font-medium">New signups vs Churned branches</p>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={signupsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--outline-variant)" opacity={0.3} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--on-surface-variant)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--on-surface-variant)' }} width={40} />
                <Tooltip 
                  cursor={{ fill: 'var(--surface-container-high)', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: 'var(--surface-container-high)', borderRadius: '12px', border: '1px solid var(--outline-variant)' }}
                  itemStyle={{ color: 'var(--on-surface)', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey="newBranches" name="New Branches" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="churned" name="Churned" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second Row: Distribution & Top Clients */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Plan Distribution */}
        <div className="bg-surface-container-lowest rounded-3xl p-5 md:p-6 shadow-sm border border-outline-variant/20 flex flex-col">
          <div className="mb-2">
            <h3 className="text-lg font-bold text-on-surface">Plan Distribution</h3>
            <p className="text-sm text-on-surface-variant font-medium">Platform users by subscription tier</p>
          </div>
          <div className="h-[280px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface-container-high)', borderRadius: '12px', border: '1px solid var(--outline-variant)' }}
                  itemStyle={{ color: 'var(--on-surface)', fontWeight: 'bold' }}
                />
                <Pie
                  data={planDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {planDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Inner Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-on-surface">895</span>
              <span className="text-xs font-bold text-on-surface-variant tracking-wider">TOTAL CLIENTS</span>
            </div>
          </div>
          {/* Custom Legend */}
          <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-outline-variant/20">
            {planDistributionData.map((entry, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-xs font-bold text-on-surface">{entry.name}</span>
                </div>
                <span className="text-xs font-medium text-on-surface-variant">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Clients Table */}
        <div className="xl:col-span-2 bg-surface-container-lowest rounded-3xl p-5 md:p-6 shadow-sm border border-outline-variant/20 flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-on-surface">Top Performing Clients</h3>
              <p className="text-sm text-on-surface-variant font-medium">Highest MRR generating branches</p>
            </div>
            <Button variant="outline" className="h-8 px-3 text-xs">View All</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="pb-3 text-xs font-black text-on-surface-variant uppercase tracking-widest px-4">Client Name</th>
                  <th className="pb-3 text-xs font-black text-on-surface-variant uppercase tracking-widest px-4">Plan</th>
                  <th className="pb-3 text-xs font-black text-on-surface-variant uppercase tracking-widest px-4 text-center">Shops</th>
                  <th className="pb-3 text-xs font-black text-on-surface-variant uppercase tracking-widest px-4 text-right">MRR</th>
                </tr>
              </thead>
              <tbody>
                {topClientsData.map((client, idx) => (
                  <tr key={client.id} className={`hover:bg-surface-container-low transition-colors ${idx !== topClientsData.length - 1 ? 'border-b border-outline-variant/10' : ''}`}>
                    <td className="py-3 px-4">
                      <span className="text-sm font-bold text-on-surface">{client.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-bold px-2 py-1 bg-surface-container-high rounded text-on-surface">{client.plan}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm font-medium text-on-surface-variant">{client.shops}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-bold text-primary">{formatCurrency(client.mrr)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
