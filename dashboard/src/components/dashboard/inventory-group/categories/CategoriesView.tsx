'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { FolderTree, Edit, Trash2, Plus, LayoutGrid, Package, AlertCircle, CheckCircle2, Eye } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ViewPageSkeleton } from '@/components/common/ViewPageSkeleton';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { categoryService, CategoryData } from '@/lib/services/category.services';

export default function CategoriesView() {
  const [activeTab, setActiveTab] = useState('All Categories');
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const tabs = ['All Categories', 'Active', 'Inactive'];

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        if (res.success) {
          setCategoriesData(res.data.map(c => ({
            ...c,
            id: c._id,
            status: c.isActive !== false ? 'Active' : 'Inactive',
            totalProducts: 0 // Fallback
          })));
        }
      } catch (err) {
        console.error('Error fetching categories', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredData = categoriesData.filter(item => {
    if (activeTab === 'All Categories') return true;
    if (activeTab === 'Active') return item.status === 'Active';
    if (activeTab === 'Inactive') return item.status === 'Inactive';
    return true;
  });

  const columns = [
    {
      header: 'Category Info',
      accessorKey: 'name',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center font-bold text-white shrink-0 overflow-hidden shadow-sm">
            {row.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-on-surface truncate max-w-[200px]">{row.name}</div>
            <div className="text-xs text-on-surface-variant font-medium mt-0.5 truncate max-w-[250px]">
              {row.description}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Slug',
      accessorKey: 'slug',
      cell: (row: any) => (
        <span className="text-xs font-mono font-medium text-on-surface-variant bg-surface-container px-2 py-1 rounded-md border border-outline-variant/10">
          /{row.slug}
        </span>
      )
    },
    {
      header: 'Total Products',
      accessorKey: 'totalProducts',
      cell: (row: any) => (
        <div className="flex items-center gap-1.5 font-bold text-on-surface">
          <Package className="w-4 h-4 text-on-surface-variant" />
          {row.totalProducts}
        </div>
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
      header: 'Actions',
      accessorKey: 'actions',
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Link href={`/categories/${row.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
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

  const totalCategories = categoriesData.length;
  const activeCategories = categoriesData.filter(c => c.status === 'Active').length;
  const inactiveCategories = categoriesData.filter(c => c.status === 'Inactive').length;

  const TabsComponent = (
    <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-outline-variant/20 self-start lg:self-auto overflow-x-auto max-w-[calc(100vw-2rem)] lg:max-w-none no-scrollbar">
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

  if (loading) return <ViewPageSkeleton />;

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar gap-6 w-full ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">Product Categories</h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">Manage your product classification and hierarchy</p>
        </div>
        <Link href="/categories/new">
          <Button className="gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 shrink-0">
            <Plus className="w-4 h-4" />
            <span className="font-bold tracking-wide">Add Category</span>
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Categories"
          value={totalCategories}
          icon={FolderTree}
          colorTheme="primary"
        />
        <StatsCard
          title="Active Categories"
          value={activeCategories}
          icon={CheckCircle2}
          colorTheme="success"
        />
        <StatsCard
          title="Inactive Categories"
          value={inactiveCategories}
          icon={AlertCircle}
          colorTheme="warning"
        />
      </div>

      {/* Data Table Area */}
      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col min-h-[400px]">
        <DataTable
          data={filteredData}
          columns={columns}
          headerContent={
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 w-full">
              <div className="flex items-center gap-2 shrink-0">
                <LayoutGrid className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-on-surface">Category List</h2>
              </div>
              {TabsComponent}
            </div>
          }
          searchPlaceholder="Search by category name or slug..."
          itemsPerPage={10}
          className="border-none shadow-none bg-transparent"
        />
      </div>
    </div>
  );
}
