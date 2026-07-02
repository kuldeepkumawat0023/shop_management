'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ArrowLeft, Edit, Trash2, Package, CheckCircle2, AlertCircle, Eye, FolderTree, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/utils/cn';

interface CategoryDetailViewProps {
  categoryId: string;
}

// Mock Data for Category Details
const categoryData = {
  id: '1',
  name: 'Electronics',
  slug: 'electronics',
  description: 'Electronic devices, gadgets and accessories including phones, laptops, and more.',
  status: 'Active',
  totalProducts: 145,
  activeProducts: 130,
  outOfStock: 5,
  parentCategory: 'None (Root)',
  createdAt: 'Jan 05, 2026',
  updatedAt: 'Jul 01, 2026',
};

// Mock Data for Products in this category
const categoryProducts = [
  { id: '1', name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', sku: 'SKU-ELE-001', stock: 45, price: 129999.00, status: 'Published' },
  { id: '3', name: 'Sony WH-1000XM5 Headphones', brand: 'Sony', sku: 'SKU-ELE-005', stock: 0, price: 29990.00, status: 'Draft' },
  { id: '6', name: 'Apple iPhone 15 Pro', brand: 'Apple', sku: 'SKU-ELE-009', stock: 32, price: 134900.00, status: 'Published' },
  { id: '7', name: 'Dell XPS 13 Laptop', brand: 'Dell', sku: 'SKU-ELE-014', stock: 12, price: 145000.00, status: 'Published' },
  { id: '9', name: 'Logitech MX Master 3S', brand: 'Logitech', sku: 'SKU-ELE-042', stock: 25, price: 9999.00, status: 'Published' },
];

export default function CategoryDetailView({ categoryId }: CategoryDetailViewProps) {
  const [activeTab, setActiveTab] = useState('Overview');
  
  // Product Table columns
  const columns = [
    { 
      header: 'Product Info', 
      accessorKey: 'name',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/20 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden text-on-surface-variant">
            {row.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-on-surface truncate max-w-[200px] lg:max-w-[300px]">{row.name}</div>
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium mt-0.5">
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
          animate={row.status === 'Published'} 
        />
      )
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Link href={`/products/${row.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-outline-variant/20 px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/categories">
            <Button variant="ghost" size="icon" className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-on-surface tracking-tight">Category Details</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/categories/edit">
            <Button variant="ghost" className="text-on-surface-variant hover:text-primary hover:bg-primary/10">
              <Edit className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          </Link>
          <Button variant="ghost" className="text-on-surface-variant hover:bg-error/10 hover:text-error">
            <Trash2 className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Category Profile Header */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl gradient-button text-white flex items-center justify-center font-black text-4xl md:text-5xl shrink-0 shadow-lg shadow-primary/20">
            {categoryData.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge status={categoryData.status} variant="dot" animate={categoryData.status === 'Active'} />
                <span className="text-xs font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  /{categoryData.slug}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">{categoryData.name}</h1>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-3xl">
              {categoryData.description}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Products</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-on-surface">{categoryData.totalProducts}</p>
                <p className="text-xs font-medium text-on-surface-variant">Mapped</p>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Active Products</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-on-surface">{categoryData.activeProducts}</p>
                <p className="text-xs font-medium text-success">Live</p>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-error/10 text-error flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Out of Stock</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-on-surface">{categoryData.outOfStock}</p>
                <p className="text-xs font-medium text-error">Action Needed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs & Content */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 border-b border-outline-variant/10 pt-4 flex gap-6">
            {['Overview', 'Products'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-4 text-sm font-bold transition-all relative",
                  activeTab === tab 
                    ? "text-primary" 
                    : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'Overview' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest mb-4">Category Information</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                      <span className="text-sm text-on-surface-variant font-medium">Category Name</span>
                      <span className="text-sm font-bold text-on-surface">{categoryData.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                      <span className="text-sm text-on-surface-variant font-medium">URL Slug</span>
                      <span className="text-sm font-bold text-on-surface">/{categoryData.slug}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                      <span className="text-sm text-on-surface-variant font-medium">Parent Category</span>
                      <span className="text-sm font-bold text-on-surface">{categoryData.parentCategory}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest mb-4">System Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                      <span className="text-sm text-on-surface-variant font-medium">Status</span>
                      <span className="text-sm font-bold text-success">{categoryData.status}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                      <span className="text-sm text-on-surface-variant font-medium">Created At</span>
                      <span className="text-sm font-bold text-on-surface">{categoryData.createdAt}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                      <span className="text-sm text-on-surface-variant font-medium">Last Updated</span>
                      <span className="text-sm font-bold text-on-surface">{categoryData.updatedAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <DataTable 
                  data={categoryProducts}
                  columns={columns}
                  headerContent={
                    <div className="flex items-center gap-2 mb-2">
                      <LayoutGrid className="w-5 h-5 text-primary" />
                      <h2 className="text-lg font-bold text-on-surface">Products in {categoryData.name}</h2>
                    </div>
                  }
                  searchPlaceholder="Search products in this category..."
                  itemsPerPage={5}
                  className="border-none shadow-none bg-transparent p-0"
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
