'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Download, Plus, Search, Filter, Tag, Handshake, Trophy, Edit, Trash2, Eye, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/utils/cn';

// Mock Data
const brandsData = [
  { id: '1', name: 'SonicAudio', category: 'Electronics', totalProducts: 124, status: 'Active', lastUpdated: 'Today, 09:41 AM' },
  { id: '2', name: 'FitLife Gear', category: 'Sports & Fitness', totalProducts: 89, status: 'Active', lastUpdated: 'Yesterday, 04:20 PM' },
  { id: '3', name: 'Lumina Home', category: 'Home Decor', totalProducts: 45, status: 'Active', lastUpdated: 'Jul 12, 11:30 AM' },
  { id: '4', name: 'TechNova', category: 'Electronics', totalProducts: 210, status: 'Active', lastUpdated: 'Jul 10, 02:15 PM' },
  { id: '5', name: 'PureEssence', category: 'Beauty & Health', totalProducts: 0, status: 'Inactive', lastUpdated: 'Jun 28, 09:00 AM' },
  { id: '6', name: 'UrbanStep', category: 'Footwear', totalProducts: 56, status: 'Active', lastUpdated: 'Jun 25, 03:45 PM' },
];

export default function BrandsView() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = brandsData.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: 'Brand Name',
      accessorKey: 'name',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center overflow-hidden border border-outline-variant/20 shadow-sm shrink-0 font-bold text-primary">
            {row.name.substring(0, 1)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-on-surface hover:text-primary transition-colors cursor-pointer">{row.name}</span>
            <span className="text-xs text-on-surface-variant">ID: BRD-{row.id.padStart(4, '0')}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Category Focus',
      accessorKey: 'category',
      cell: (row: any) => (
        <span className="text-sm font-medium text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-md border border-outline-variant/10">
          {row.category}
        </span>
      )
    },
    {
      header: 'Total Products',
      accessorKey: 'totalProducts',
      cell: (row: any) => (
        <span className="font-bold text-on-surface">{row.totalProducts} <span className="text-xs font-medium text-on-surface-variant">Items</span></span>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <StatusBadge 
          status={row.status} 
          variant="dot" 
          animate={row.status === 'Active'} 
        />
      )
    },
    {
      header: 'Last Updated',
      accessorKey: 'lastUpdated',
      cell: (row: any) => (
        <span className="text-sm font-medium text-on-surface-variant">{row.lastUpdated}</span>
      )
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (row: any) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Brands Management</h2>
          <p className="text-sm font-medium text-on-surface-variant">Oversee brand partnerships, inventory mapping, and performance.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Link href="/brands/new" className="flex-1 md:flex-none">
            <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border-none whitespace-nowrap">
              <Plus className="w-4 h-4 shrink-0" />
              <span className="truncate">Add New Brand</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <StatsCard 
          title="Total Brands"
          value="48"
          icon={Tag}
          trend="+3"
          trendDirection="up"
          trendLabel="vs last month"
          colorTheme="primary"
        />
        <StatsCard 
          title="Active Partnerships"
          value="42"
          icon={Handshake}
          trendLabel="87.5% Active Rate"
          colorTheme="success"
        />
        <StatsCard 
          title="Top Revenue Brand"
          value="SonicAudio"
          icon={Trophy}
          trendLabel="₹124,500 MTD"
          colorTheme="yellow"
        />
        <StatsCard 
          title="Inactive Brands"
          value="6"
          icon={AlertCircle}
          trendLabel="Needs Action"
          colorTheme="error"
        />
      </div>

      {/* Brands Ledger */}
      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col">
        <DataTable 
          data={filteredData}
          columns={columns}
          headerContent={
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
              <h3 className="text-xl font-black text-on-surface">Brand Directory</h3>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative focus-within:ring-2 focus-within:ring-primary-container rounded-lg w-full sm:w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant w-4 h-4" />
                  <input 
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl pl-9 pr-4 py-2 text-sm font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-colors placeholder:text-on-surface-variant/50" 
                    placeholder="Filter brands..." 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="p-2.5 text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-colors border border-outline-variant/30 bg-surface-container-lowest shrink-0">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
          }
          className="border-none shadow-none bg-transparent"
          itemsPerPage={10}
        />
      </div>
    </div>
  );
}
