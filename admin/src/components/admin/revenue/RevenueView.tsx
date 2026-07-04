'use client';

import React, { useState } from 'react';
import { TrendingUp, DollarSign, Activity, Store, Search, PieChart as PieChartIcon } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { StatsCard } from '@/components/common/StatsCard';
import { DataTable } from '@/components/common/DataTable';
import { Input } from '@/components/common/Input';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatters';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock Data for Shops Table
const mockShops = [
  { id: 'BR-1001', name: 'SmartMart Superstore', location: 'Mumbai, MH', plan: 'Premium', totalRevenue: 1245000, date: 'This Month' },
  { id: 'BR-1002', name: 'Tech Hub Electronics', location: 'Delhi, DL', plan: 'Enterprise', totalRevenue: 830000, date: 'Last Month' },
  { id: 'BR-1003', name: 'Fashion Fiesta', location: 'Bangalore, KA', plan: 'Basic', totalRevenue: 515000, date: 'This Month' },
  { id: 'BR-1004', name: 'City Grocers', location: 'Pune, MH', plan: 'Premium', totalRevenue: 490000, date: 'Last Month' },
  { id: 'BR-1005', name: 'Daily Needs Mart', location: 'Ahmedabad, GJ', plan: 'Enterprise', totalRevenue: 320000, date: 'This Month' },
];

// Mock Data for Revenue Graph
const revenueGrowthData = [
  { month: 'May', revenue: 45000 },
  { month: 'Jun', revenue: 52000 },
  { month: 'Jul', revenue: 48000 },
  { month: 'Aug', revenue: 61000 },
  { month: 'Sep', revenue: 75000 },
  { month: 'Oct', revenue: 95000 },
];

// Mock Data for Revenue Breakdown Pie
const revenueBreakdownData = [
  { name: 'Subscriptions', value: 65, color: '#3b82f6' },
  { name: 'Platform Fees', value: 35, color: '#10b981' },
];

export default function RevenueView() {
  const [activeTab, setActiveTab] = useState('All Time');
  const [search, setSearch] = useState('');
  const tabs = ['All Time', 'This Month', 'Last Month'];

  // Filter Data
  const filteredData = mockShops.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'All Time') return matchesSearch;
    return matchesSearch && item.date === activeTab;
  });

  const columns = [
    {
      header: 'Shop Info',
      accessorKey: 'name',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center font-bold text-white shrink-0 overflow-hidden shadow-sm">
            {row.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-on-surface truncate max-w-[200px]">{row.name}</div>
            <div className="text-xs text-on-surface-variant font-medium mt-0.5">{row.id} • {row.location}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Active Plan',
      accessorKey: 'plan',
      cell: (row: any) => (
        <span className="text-sm font-medium text-on-surface-variant px-2 py-1 bg-surface-container-high rounded-md">{row.plan}</span>
      )
    },
    {
      header: 'Total Revenue',
      accessorKey: 'totalRevenue',
      cell: (row: any) => (
        <div className="font-bold text-on-surface text-lg">
          {formatCurrency(row.totalRevenue)}
        </div>
      ),
    }
  ];

  const TabsComponent = (
    <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-outline-variant/20 self-start overflow-x-auto no-scrollbar">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={cn(
            "px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-md transition-all whitespace-nowrap",
            activeTab === tab
              ? "gradient-button text-white shadow-md"
              : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar gap-6 w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            Revenue Dashboard
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">Monitor your platform's financial growth and earnings.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-on-surface-variant border-outline-variant/30">
            Export Report
          </Button>
          <Button className="gradient-button text-white border-none shadow-lg shadow-primary/20">
            View Analytics
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Net Revenue"
          value="₹ 45,28,500"
          icon={DollarSign}
          colorTheme="success"
          trend="12.5%"
          trendDirection="up"
          trendLabel="VS LAST MONTH"
        />
        <StatsCard
          title="Active MRR"
          value="₹ 8,45,000"
          icon={TrendingUp}
          colorTheme="primary"
          trend="4.2%"
          trendDirection="up"
          trendLabel="NEW SUBSCRIPTIONS"
        />
        <StatsCard
          title="Platform Fees Earned"
          value="₹ 2,15,400"
          icon={Activity}
          colorTheme="secondary"
          trend="1.5%"
          trendDirection="down"
          trendLabel="FROM TRANSACTIONS"
        />
        <StatsCard
          title="Active Shops"
          value="1,248"
          icon={Store}
          colorTheme="warning"
          trend="45"
          trendDirection="up"
          trendLabel="NEW THIS MONTH"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Revenue Growth
            </h2>
            <p className="text-sm font-medium text-on-surface-variant mt-1">Last 6 Months Trajectory</p>
          </div>
          
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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

        {/* Pie Chart: Revenue Breakdown */}
        <div className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col">
          <div className="mb-2">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-secondary" />
              Revenue Breakdown
            </h2>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-[200px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--surface-container-high)', borderRadius: '12px', border: '1px solid var(--outline-variant)' }}
                    itemStyle={{ color: 'var(--on-surface)', fontWeight: 'bold' }}
                    formatter={(value: any) => [`${value}%`, 'Share']}
                  />
                  <Pie
                    data={revenueBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {revenueBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Inner Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-on-surface">100%</span>
                <span className="text-xs font-bold text-on-surface-variant tracking-wider">TOTAL</span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="w-full space-y-4 mt-6">
              {revenueBreakdownData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm font-bold text-on-surface">{entry.name}</span>
                  </div>
                  <span className="text-sm font-black text-on-surface">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Data Table Section */}
      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col mt-2">
        <DataTable
          data={filteredData}
          columns={columns}
          headerContent={
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between w-full gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <Store className="w-5 h-5 text-primary" />
                  Shop Revenue List
                </h2>
                {TabsComponent}
              </div>
              <div className="flex items-center w-full xl:max-w-sm relative">
                <Search className="w-4 h-4 absolute left-3 text-on-surface-variant" />
                <Input 
                  placeholder="Search shops..." 
                  className="pl-9 w-full bg-surface-container-low border-outline-variant/20 focus:border-primary"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          }
          itemsPerPage={5}
          className="border-none shadow-none bg-transparent"
        />
      </div>

    </div>
  );
}
