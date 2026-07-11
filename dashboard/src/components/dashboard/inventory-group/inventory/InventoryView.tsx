'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { Package, AlertTriangle, AlertCircle, Banknote, Edit, Eye, Trash2 } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { cn } from '@/utils/cn';

// Mock Data
const inventoryData = [
  { id: '1', name: 'Fortune Sunflower Oil (1L)', category: 'Groceries', sku: 'SKU-GRO-001', stock: 145, minStock: 20, price: 155.00, status: 'In Stock' },
  { id: '2', name: 'Aashirvaad Atta (5kg)', category: 'Groceries', sku: 'SKU-GRO-002', stock: 12, minStock: 15, price: 210.00, status: 'Low Stock' },
  { id: '3', name: 'Maggi Noodles (Pack of 4)', category: 'Snacks', sku: 'SKU-SNA-001', stock: 0, minStock: 30, price: 56.00, status: 'Out of Stock' },
  { id: '4', name: 'Amul Butter (500g)', category: 'Dairy', sku: 'SKU-DAI-001', stock: 85, minStock: 10, price: 260.00, status: 'In Stock' },
  { id: '5', name: 'Lays Classic Salted', category: 'Snacks', sku: 'SKU-SNA-002', stock: 5, minStock: 20, price: 20.00, status: 'Low Stock' },
];

export default function InventoryView() {
  const [activeTab, setActiveTab] = useState('All Items');
  const tabs = ['All Items', 'Low Stock', 'Out of Stock'];

  const filteredData = inventoryData.filter(item => {
    if (activeTab === 'All Items') return true;
    if (activeTab === 'Low Stock') return item.status === 'Low Stock';
    if (activeTab === 'Out of Stock') return item.status === 'Out of Stock';
    return true;
  });

  const columns = [
    { 
      header: 'Product Details', 
      accessorKey: 'name',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            {row.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-on-surface truncate max-w-[200px] lg:max-w-[300px]">{row.name}</div>
            <div className="text-xs text-on-surface-variant font-medium">{row.category}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'SKU', 
      accessorKey: 'sku',
      cell: (row: any) => (
        <span className="text-xs font-mono font-medium text-on-surface-variant bg-surface-container px-2 py-1 rounded-md border border-outline-variant/10">
          {row.sku}
        </span>
      )
    },
    { 
      header: 'Stock', 
      accessorKey: 'stock',
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className={cn(
            "font-black text-base",
            row.stock === 0 ? "text-error" : row.stock <= row.minStock ? "text-warning" : "text-success"
          )}>
            {row.stock} <span className="text-xs font-medium text-on-surface-variant">units</span>
          </span>
          <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">Min: {row.minStock}</span>
        </div>
      )
    },
    { 
      header: 'Unit Price', 
      accessorKey: 'price',
      cell: (row: any) => (
        <span className="font-bold text-on-surface">₹{row.price.toFixed(2)}</span>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <StatusBadge variant="dot" animate={row.status === 'Out of Stock' || row.status === 'Low Stock'} status={row.status} />
      )
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10">
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10">
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  const TabsComponent = (
    <div className="flex space-x-1 bg-surface-container-low p-1 rounded-lg w-fit">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={cn(
            "px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-md transition-all",
            activeTab === tab
              ? "gradient-button text-white shadow-md"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">Inventory Status</h1>
          <p className="text-sm font-medium text-on-surface-variant mt-1">
            Monitor stock levels, track product availability, and manage low stock alerts.
          </p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 shrink-0">
        <StatsCard 
          title="Total Products"
          value="1,240"
          icon={Package}
          trendLabel="UNIQUE ITEMS"
          colorTheme="primary"
        />
        <StatsCard 
          title="Total Stock Value"
          value="₹45,200"
          icon={Banknote}
          trendLabel="CURRENT ESTIMATE"
          colorTheme="purple"
        />
        <StatsCard 
          title="Low Stock"
          value="15"
          icon={AlertTriangle}
          trendLabel="NEEDS REORDER"
          colorTheme="warning"
        />
        <StatsCard 
          title="Out of Stock"
          value="3"
          icon={AlertCircle}
          trendLabel="UNAVAILABLE"
          colorTheme="error"
        />
      </div>

      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col">
        <DataTable 
          data={filteredData}
          columns={columns}
          headerContent={
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 w-full">
              <div className="flex items-center gap-2 shrink-0">
                <h2 className="text-lg font-bold text-on-surface">Product List</h2>
                <StatusBadge status="Live Sync" variant="dot" colorTheme="success" className="ml-2 bg-success/10 text-success border-success/20" />
              </div>
              {TabsComponent}
            </div>
          }
          searchPlaceholder="Search by product name or SKU..."
          className="border-none shadow-none bg-transparent"
          itemsPerPage={10}
        />
      </div>
    </div>
  );
}
