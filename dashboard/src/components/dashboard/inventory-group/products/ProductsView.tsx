'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { Package, FolderTree, Trophy, FileEdit, Edit, Eye, Trash2, Plus } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { productService } from '@/lib/services/product.services';

export default function ProductsView() {
  const [activeTab, setActiveTab] = useState('All Products');
  const [productsData, setProductsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const tabs = ['All Products', 'Published', 'Drafts'];

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.getProducts();
        if (res.success) {
          setProductsData(res.data.map((p: any) => ({
            ...p,
            id: p._id,
            brand: p.brand?.name || 'General',
            category: p.category?.name || 'Uncategorized',
            stock: p.currentStock || 0,
            price: p.sellingPrice || 0,
            status: p.isActive !== false ? 'Published' : 'Draft'
          })));
        }
      } catch (err) {
        console.error('Error fetching products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
          <Link href={`/products/${row.id}`}>
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
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 shrink-0">
        <StatsCard
          title="Total Products"
          value={productsData.length}
          icon={Package}
          trendLabel="ACTIVE ITEMS"
          colorTheme="primary"
        />
        <StatsCard
          title="Active Categories"
          value={new Set(productsData.map(p => p.category)).size}
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
          value={productsData.filter(p => p.status === 'Draft').length}
          icon={FileEdit}
          trendLabel="NOT PUBLISHED"
          colorTheme="warning"
        />
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-on-surface-variant font-medium">Loading Products...</div>
        ) : (
          <DataTable
            data={filteredData}
            columns={columns}
            searchPlaceholder="Search products by name, sku, or brand..."
            itemsPerPage={10}
            headerContent={
              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-2">
                <h2 className="text-xl font-bold text-on-surface">Product Catalog</h2>
                {TabsComponent}
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}
