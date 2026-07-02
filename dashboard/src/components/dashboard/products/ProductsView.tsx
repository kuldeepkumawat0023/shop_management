'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { Package, FolderTree, Trophy, FileEdit, Edit, Eye, Trash2, Plus } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { cn } from '@/utils/cn';
import Link from 'next/link';

// Mock Data
const productsData = [
  { id: '1', name: 'Samsung Galaxy S24 Ultra', category: 'Electronics', brand: 'Samsung', sku: 'SKU-ELE-001', stock: 45, price: 129999.00, status: 'Published' },
  { id: '2', name: 'Basmati Rice (5kg)', category: 'Groceries', brand: 'India Gate', sku: 'SKU-GRO-012', stock: 120, price: 450.00, status: 'Published' },
  { id: '3', name: 'Sony WH-1000XM5 Headphones', category: 'Electronics', brand: 'Sony', sku: 'SKU-ELE-005', stock: 0, price: 29990.00, status: 'Draft' },
  { id: '4', name: 'Nike Air Max 270', category: 'Footwear', brand: 'Nike', sku: 'SKU-FOT-022', stock: 15, price: 12995.00, status: 'Published' },
  { id: '5', name: 'Nivea Soft Moisturizer', category: 'Personal Care', brand: 'Nivea', sku: 'SKU-PER-008', stock: 8, price: 299.00, status: 'Draft' },
  { id: '6', name: 'Apple iPhone 15 Pro', category: 'Electronics', brand: 'Apple', sku: 'SKU-ELE-009', stock: 32, price: 134900.00, status: 'Published' },
  { id: '7', name: 'Dell XPS 13 Laptop', category: 'Electronics', brand: 'Dell', sku: 'SKU-ELE-014', stock: 12, price: 145000.00, status: 'Published' },
  { id: '8', name: 'Puma Running Shoes', category: 'Footwear', brand: 'Puma', sku: 'SKU-FOT-033', stock: 40, price: 4500.00, status: 'Published' },
  { id: '9', name: 'Logitech MX Master 3S', category: 'Electronics', brand: 'Logitech', sku: 'SKU-ELE-042', stock: 25, price: 9999.00, status: 'Published' },
  { id: '10', name: 'Lays Classic Salted (100g)', category: 'Groceries', brand: 'Lays', sku: 'SKU-GRO-099', stock: 200, price: 50.00, status: 'Published' },
  { id: '11', name: 'Dettol Handwash (Refill)', category: 'Personal Care', brand: 'Dettol', sku: 'SKU-PER-112', stock: 65, price: 99.00, status: 'Published' },
];

export default function ProductsView() {
  const [activeTab, setActiveTab] = useState('All Products');
  const tabs = ['All Products', 'Published', 'Drafts'];

  const filteredData = productsData.filter(item => {
    if (activeTab === 'All Products') return true;
    if (activeTab === 'Published') return item.status === 'Published';
    if (activeTab === 'Drafts') return item.status === 'Draft';
    return true;
  });

  const columns = [
    { 
      header: 'Product Info', 
      accessorKey: 'name',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/20 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden text-on-surface-variant">
            {/* Fallback avatar/image block */}
            {row.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-on-surface truncate max-w-[200px] lg:max-w-[300px]">{row.name}</div>
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium mt-0.5">
              <span>{row.category}</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant/40" />
              <span>{row.brand}</span>
            </div>
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
      header: 'Price', 
      accessorKey: 'price',
      cell: (row: any) => (
        <span className="font-bold text-on-surface">₹{row.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      )
    },
    { 
      header: 'Stock', 
      accessorKey: 'stock',
      cell: (row: any) => {
        let stockStatus = 'In Stock';
        if (row.stock === 0) stockStatus = 'Out of Stock';
        else if (row.stock < 20) stockStatus = 'Low Stock';
        
        return (
          <div className="flex flex-col gap-1">
            <span className="font-bold text-on-surface">{row.stock} <span className="text-xs text-on-surface-variant font-medium">units</span></span>
            <span className={cn(
              "text-[10px] uppercase tracking-widest font-bold",
              stockStatus === 'Out of Stock' ? 'text-error' : stockStatus === 'Low Stock' ? 'text-warning' : 'text-success'
            )}>
              {stockStatus}
            </span>
          </div>
        );
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <StatusBadge 
          status={row.status} 
          variant="dot" 
          colorTheme={row.status === 'Published' ? 'success' : 'secondary'} 
        />
      )
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Link href="/products/detail">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">Products Management</h1>
          <p className="text-sm font-medium text-on-surface-variant mt-1">
            Manage your product catalog, pricing, variants, and availability.
          </p>
        </div>
        <Link href="/products/new">
          <Button className="w-full sm:w-auto shadow-md">
            <Plus className="w-5 h-5 mr-2" />
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 shrink-0">
        <StatsCard 
          title="Total Products"
          value="2,450"
          icon={Package}
          trendLabel="ACTIVE ITEMS"
          colorTheme="primary"
        />
        <StatsCard 
          title="Active Categories"
          value="24"
          icon={FolderTree}
          trendLabel="MAPPED CATEGORIES"
          colorTheme="secondary"
        />
        <StatsCard 
          title="Top Selling"
          value="Galaxy S24"
          icon={Trophy}
          trendLabel="THIS WEEK"
          colorTheme="success"
        />
        <StatsCard 
          title="Drafts / Inactive"
          value="12"
          icon={FileEdit}
          trendLabel="NOT PUBLISHED"
          colorTheme="warning"
        />
      </div>

      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col">
        <DataTable 
          data={filteredData}
          columns={columns}
          headerContent={
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 w-full">
              <div className="flex items-center gap-2 shrink-0">
                <h2 className="text-lg font-bold text-on-surface">Catalog</h2>
              </div>
              {TabsComponent}
            </div>
          }
          searchPlaceholder="Search by product name, brand or SKU..."
          className="border-none shadow-none bg-transparent"
          itemsPerPage={10}
        />
      </div>
    </div>
  );
}
