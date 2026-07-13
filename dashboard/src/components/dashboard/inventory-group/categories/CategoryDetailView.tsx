'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DetailViewSkeleton } from '@/components/common/DetailViewSkeleton';
import { ArrowLeft, Tag, Layers, Search, Filter, Download, MoreVertical, Edit, Trash2, Globe, Archive, Package, Plus, ImageIcon, Type, Link as LinkIcon, Eye, CheckCircle2, AlertCircle, FolderTree, LayoutGrid, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { categoryService } from '@/lib/services/category.services';
import { productService } from '@/lib/services/product.services';
import toast from 'react-hot-toast';

interface CategoryDetailViewProps {
  categoryId: string;
}

export default function CategoryDetailView({ categoryId }: CategoryDetailViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Overview');
  const [categoryData, setCategoryData] = useState<any>(null);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          categoryService.getCategories(),
          productService.getProducts()
        ]);
        
        if (catRes.success) {
          const cat = catRes.data.find((c: any) => c._id === categoryId);
          if (cat) {
            setCategoryData(cat);
          }
        }
        
        if (prodRes.success) {
          const prods = prodRes.data.filter((p: any) => p.category?._id === categoryId || p.category === categoryId);
          setCategoryProducts(prods.map((p: any) => ({
            ...p,
            id: p._id,
            brand: p.brand?.name || 'General',
            stock: p.currentStock || 0,
            price: p.sellingPrice || 0,
            status: p.isActive !== false ? 'Published' : 'Draft'
          })));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryId]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this category? / क्या आप वाकई इस श्रेणी को हटाना चाहते हैं?')) {
      try {
        const res = await categoryService.deleteCategory(categoryId);
        if (res.success || (res as any).status === 200) {
          toast.success('Category deleted successfully');
          router.push('/categories');
        } else {
          toast.error(res.message || 'Failed to delete category');
        }
      } catch (err) {
        toast.error('Error deleting category');
      }
    }
  };

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
          {row.sku || 'N/A'}
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
        </div>
      )
    }
  ];

  if (loading) return <DetailViewSkeleton />;

  if (!categoryData) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full text-center">
        <FolderTree className="w-16 h-16 text-outline-variant mb-4" />
        <h2 className="text-2xl font-bold text-on-surface">Category Not Found</h2>
        <p className="text-on-surface-variant mt-2 mb-6">The category you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background p-4 md:p-6 lg:p-8 w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="w-10 h-10 shrink-0 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface hover:text-primary hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-center shadow-sm">
              <ImageIcon className="w-8 h-8 text-on-surface-variant/50" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">{categoryData.name}</h1>
                <StatusBadge 
                  status={categoryData.isActive !== false ? 'Active' : 'Inactive'} 
                  variant="dot" 
                  colorTheme={categoryData.isActive !== false ? 'success' : 'error'} 
                />
              </div>
              <p className="text-sm font-medium text-on-surface-variant mt-1 flex items-center gap-2">
                <FolderTree className="w-4 h-4" /> 
                {categoryData.parentCategory?.name || 'Top Level Category'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0 ml-14 sm:ml-0">
          <Link href={`/categories/${categoryId}/edit`} className="flex-1 sm:flex-none">
            <Button variant="outline" className="w-full shadow-sm rounded-xl">
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
          </Link>
          <Button onClick={handleDelete} variant="outline" className="flex-1 sm:flex-none text-error hover:bg-error/10 hover:border-error/30 shadow-sm rounded-xl">
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-surface-container-low p-1 rounded-xl w-fit mb-6">
        {['Overview', 'Products', 'Settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-2 text-sm font-bold rounded-lg transition-all",
              activeTab === tab
                ? "bg-surface shadow-sm text-primary"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface/50"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6">
              <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Category Description
              </h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {categoryData.description || 'No description provided.'}
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" /> Products in Category
                </h2>
                <Link href={`/products?category=${categoryData._id}`}>
                  <Button variant="ghost" className="text-sm font-bold text-primary">View All</Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {categoryProducts.slice(0, 3).map(product => (
                  <div key={product.id} className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/20 flex items-center justify-center font-bold text-xs text-on-surface-variant shrink-0">
                        {product.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-on-surface">{product.name}</div>
                        <div className="text-xs text-on-surface-variant mt-0.5">{product.sku || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-on-surface">₹{product.price.toLocaleString('en-IN')}</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">{product.stock} units</div>
                    </div>
                  </div>
                ))}
                {categoryProducts.length === 0 && (
                  <div className="text-center py-6 text-on-surface-variant text-sm">No products in this category yet.</div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6">
              <h2 className="text-lg font-bold text-on-surface mb-4">Category Stats</h2>
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Products</div>
                  <div className="text-2xl font-black text-on-surface">{categoryProducts.length}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Active Products</div>
                  <div className="text-2xl font-black text-primary">{categoryProducts.filter(p => p.status === 'Published').length}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Low/Out of Stock</div>
                  <div className="text-2xl font-black text-error">{categoryProducts.filter(p => p.stock < 10).length}</div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6">
              <h2 className="text-lg font-bold text-on-surface mb-4">Details</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-medium text-on-surface-variant mb-1">Created</div>
                  <div className="text-sm font-bold text-on-surface">{new Date(categoryData.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-on-surface-variant mb-1">Last Updated</div>
                  <div className="text-sm font-bold text-on-surface">{new Date(categoryData.updatedAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Products' && (
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          <DataTable 
            data={categoryProducts}
            columns={columns}
            searchPlaceholder="Search category products..."
            itemsPerPage={10}
            headerContent={
              <div className="flex items-center justify-between gap-4 mb-2">
                <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" /> Products List
                </h2>
                <Link href="/products/new">
                  <Button size="sm" className="shadow-sm">
                    <Plus className="w-4 h-4 mr-1.5" /> Add Product
                  </Button>
                </Link>
              </div>
            }
          />
        </div>
      )}

      {activeTab === 'Settings' && (
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm p-6 text-center py-20">
          <AlertCircle className="w-12 h-12 text-on-surface-variant/50 mb-4" />
          <h2 className="text-xl font-bold text-on-surface mb-2">Category Settings</h2>
          <p className="text-on-surface-variant max-w-md mb-6">
            Configure SEO settings, default product templates, and visibility rules for this category.
          </p>
          <Button variant="outline">Edit Configuration</Button>
        </div>
      )}

    </div>
  );
}
