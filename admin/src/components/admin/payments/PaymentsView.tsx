'use client';

import React, { useState } from 'react';
import { CreditCard, Search, Settings, ArrowDownToLine, ArrowUpFromLine, CheckCircle2, Clock, XCircle, ListOrdered, TrendingUp } from 'lucide-react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { StatusBadge } from '@/components/common/StatusBadge';
import GatewayConfigModal from './GatewayConfigModal';
import { cn } from '@/utils/cn';
import {
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '@/utils/formatters';

const mockTransactions = [
  { id: 'TXN-8421', date: 'Oct 24, 2026', shop: 'SmartMart Superstore', type: 'Platform Fee', amount: '₹ 2,500', status: 'Success', direction: 'in' },
  { id: 'TXN-8422', date: 'Oct 24, 2026', shop: 'Tech Hub Electronics', type: 'Payout', amount: '₹ 45,000', status: 'Pending', direction: 'out' },
  { id: 'TXN-8423', date: 'Oct 23, 2026', shop: 'Fashion Fiesta', type: 'Subscription', amount: '₹ 15,000', status: 'Success', direction: 'in' },
  { id: 'TXN-8424', date: 'Oct 23, 2026', shop: 'City Grocers', type: 'Platform Fee', amount: '₹ 1,200', status: 'Failed', direction: 'in' },
  { id: 'TXN-8425', date: 'Oct 22, 2026', shop: 'Daily Needs Mart', type: 'Payout', amount: '₹ 12,500', status: 'Success', direction: 'out' },
];

// Generate 30 days of trading-style granular data
const generateTradingData = () => {
  const data = [];
  let baseValue = 45000;
  for (let i = 1; i <= 30; i++) {
    // Random walk for price/value
    const change = (Math.random() - 0.45) * 15000; 
    baseValue = Math.max(15000, baseValue + change);
    
    // Volume usually spikes on big changes
    const volume = Math.floor(Math.abs(change) * 0.1) + Math.floor(Math.random() * 2000);
    
    data.push({
      date: `Oct ${i.toString().padStart(2, '0')}`,
      value: Math.floor(baseValue),
      volume: volume,
    });
  }
  return data;
};

const tradingData = generateTradingData();

export default function PaymentsView() {
  const [activeTab, setActiveTab] = useState('All Transactions');
  const [search, setSearch] = useState('');
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState(false);

  const tabs = ['All Transactions', 'Success', 'Pending', 'Failed'];

  const filteredTxns = mockTransactions.filter(t => {
    const matchesSearch = t.shop.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'All Transactions') return matchesSearch;
    return matchesSearch && t.status === activeTab;
  });

  const columns = [
    {
      header: 'Transaction ID',
      accessorKey: 'id',
      cell: (row: any) => (
        <span className="text-sm font-bold text-on-surface">{row.id}</span>
      )
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (row: any) => (
        <span className="text-sm font-medium text-on-surface-variant">{row.date}</span>
      )
    },
    {
      header: 'Shop / Entity',
      accessorKey: 'shop',
      cell: (row: any) => (
        <span className="text-sm font-bold text-on-surface">{row.shop}</span>
      )
    },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: (row: any) => (
        <span className="text-sm font-medium text-on-surface-variant px-2 py-1 bg-surface-container-high rounded-md">{row.type}</span>
      )
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          {row.direction === 'in' ? (
            <ArrowDownToLine className="w-4 h-4 text-success" />
          ) : (
            <ArrowUpFromLine className="w-4 h-4 text-warning" />
          )}
          <span className={`text-sm font-black ${row.direction === 'in' ? 'text-success' : 'text-on-surface'}`}>
            {row.amount}
          </span>
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => {
        let variant = 'success';
        if (row.status === 'Pending') variant = 'warning';
        if (row.status === 'Failed') variant = 'error';
        return <StatusBadge status={row.status} variant={variant as any} />;
      }
    },
  ];

  const TabsComponent = (
    <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-outline-variant/20 self-start lg:self-auto overflow-x-auto no-scrollbar">
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
            <CreditCard className="w-8 h-8 text-primary" />
            Payments & Transactions
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">Manage payouts, platform fees, and payment gateway configurations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsGatewayModalOpen(true)}
            variant="outline" 
            className="text-on-surface-variant gap-2 border-outline-variant/30 hover:text-primary hover:border-primary/50"
          >
            <Settings className="w-4 h-4" />
            Gateway Config
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest border border-outline-variant/20 p-6 rounded-3xl shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-1">Cleared Payouts</h3>
            <p className="text-3xl font-black text-on-surface">₹ 14.5L</p>
            <p className="text-xs font-medium text-success mt-1">This Month</p>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest border border-outline-variant/20 p-6 rounded-3xl shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-warning/10 text-warning flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-1">Pending Settlements</h3>
            <p className="text-3xl font-black text-on-surface">₹ 2.8L</p>
            <p className="text-xs font-medium text-warning mt-1">Needs attention</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/20 p-6 rounded-3xl shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-error/10 text-error flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-1">Failed Txns</h3>
            <p className="text-3xl font-black text-on-surface">12</p>
            <p className="text-xs font-medium text-error mt-1">Requires retry</p>
          </div>
        </div>
      </div>

      {/* Trading-Style Volume Chart */}
      <div className="bg-surface-container-lowest rounded-3xl p-5 md:p-6 shadow-sm border border-outline-variant/20 flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Daily Payment Flow
            </h3>
            <p className="text-sm text-on-surface-variant font-medium mt-1">30-day view of transaction value vs volume</p>
          </div>
          <div className="flex gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant">
              <div className="w-3 h-3 bg-success/20 border border-success rounded-sm"></div>
              Transaction Amount
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant ml-4">
              <div className="w-3 h-3 bg-primary/40 rounded-sm"></div>
              Daily Volume
            </span>
          </div>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={tradingData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="var(--outline-variant)" opacity={0.15} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: 'var(--on-surface-variant)' }} 
                dy={10} 
                minTickGap={20}
              />
              <YAxis 
                yAxisId="left"
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: 'var(--on-surface-variant)' }} 
                width={65}
                tickFormatter={(val) => `₹${val / 1000}k`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                axisLine={false} 
                tickLine={false} 
                tick={false} // Hide volume ticks for cleaner look
                width={20}
              />
              <Tooltip 
                cursor={{ stroke: 'var(--on-surface-variant)', strokeWidth: 1, strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: 'var(--surface-container-high)', borderRadius: '12px', border: '1px solid var(--outline-variant)' }}
                itemStyle={{ color: 'var(--on-surface)', fontWeight: 'bold' }}
                labelStyle={{ color: 'var(--on-surface-variant)', marginBottom: '8px', fontSize: '12px', fontWeight: 'bold' }}
                formatter={(value: any, name: any) => [
                  name === 'Amount' ? formatCurrency(Number(value)) : value, 
                  name
                ]}
              />
              {/* Volume Bars at bottom (mapped to right y-axis which is scaled) */}
              <Bar yAxisId="right" dataKey="volume" name="Volume" fill="var(--tw-colors-primary)" opacity={0.4} barSize={6} radius={[2, 2, 0, 0]} />
              
              {/* Value Trend Area on top */}
              <Area yAxisId="left" type="monotone" dataKey="value" name="Amount" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col mt-2 mb-6">
        <DataTable
          data={filteredTxns}
          columns={columns}
          headerContent={
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between w-full gap-4">
              {/* Title & Tabs side by side */}
              <div className="flex items-center gap-4 flex-wrap">
                <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <ListOrdered className="w-5 h-5 text-primary" />
                  Transaction Ledger
                </h2>
                {TabsComponent}
              </div>
              <div className="flex items-center w-full xl:max-w-sm relative">
                <Search className="w-4 h-4 absolute left-3 text-on-surface-variant" />
                <Input 
                  placeholder="Search by ID or Shop..." 
                  className="pl-9 w-full bg-surface-container-low border-outline-variant/20 focus:border-primary"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          }
          itemsPerPage={10}
          className="border-none shadow-none bg-transparent"
        />
      </div>

      <GatewayConfigModal 
        isOpen={isGatewayModalOpen} 
        onClose={() => setIsGatewayModalOpen(false)} 
      />

    </div>
  );
}
