'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { Plus, Download, BookOpen, Activity, Beaker, FileText, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { recipeService } from '@/lib/services/recipe.services';
import toast from 'react-hot-toast';

export default function RecipesView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipesData, setRecipesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = ['All Recipes', 'Active', 'Archived'];
  const [activeTab, setActiveTab] = useState('All Recipes');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await recipeService.getRecipes();
      if (res.success) {
        setRecipesData(res.data.map((recipe: any) => {
          const baseCost = (recipe.ingredients || []).reduce((sum: number, ing: any) => {
            return sum + ((ing.productId?.purchasePrice || 0) * (ing.quantityRequired || 0));
          }, 0);
          return {
            id: recipe._id,
            name: recipe.finalProductId?.name || 'Unknown Product',
            outputProduct: recipe.finalProductId?.sku || 'N/A',
            ingredientsCount: recipe.ingredients?.length || 0,
            baseCost,
            currentStock: recipe.finalProductId?.currentStock || 0,
            status: 'Active',
            notes: recipe.notes || '',
          };
        }));
      }
    } catch (err) {
      console.error('Error fetching recipes', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        const res = await recipeService.deleteRecipe(id);
        if (res.success) {
          toast.success('Recipe deleted successfully');
          setRecipesData(prev => prev.filter(r => r.id !== id));
        } else {
          toast.error(res.message || 'Failed to delete recipe');
        }
      } catch (err) {
        toast.error('Error deleting recipe');
      }
    }
  };

  const filteredData = recipesData.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.outputProduct.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All Recipes' ? true : r.status === activeTab;
    return matchesSearch && matchesTab;
  });

  // Dynamic stats
  const totalRecipes = recipesData.length;
  const activeRecipes = recipesData.filter(r => r.status === 'Active').length;
  const avgBaseCost = totalRecipes > 0
    ? (recipesData.reduce((sum, r) => sum + r.baseCost, 0) / totalRecipes)
    : 0;

  const columns = [
    { header: 'Recipe ID', accessorKey: 'id', cell: (row: any) => <span className="font-bold text-on-surface font-mono text-xs">{row.id.slice(-6).toUpperCase()}</span> },
    { header: 'Output Product', accessorKey: 'name', cell: (row: any) => <span className="font-semibold text-primary">{row.name}</span> },
    { header: 'SKU', accessorKey: 'outputProduct' },
    { header: 'Ingredients', accessorKey: 'ingredientsCount', cell: (row: any) => `${row.ingredientsCount} Items` },
    { header: 'Base Cost', accessorKey: 'baseCost', cell: (row: any) => `₹${row.baseCost.toFixed(2)}` },
    { header: 'Current Stock', accessorKey: 'expectedYield', cell: (row: any) => <span className="font-medium text-on-surface">{row.expectedYield} Units</span> },
    { header: 'Status', accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.status} /> },
    {
      header: 'Actions', accessorKey: 'actions', cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Link href={`/manufacturing/recipes/${row.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors" onClick={() => handleDelete(row.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  ];

  const TabsComponent = (
    <div className="flex space-x-1 bg-surface-container-low p-1 rounded-lg w-fit overflow-x-auto max-w-[calc(100vw-2rem)] no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={cn(
            "px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-md transition-all whitespace-nowrap",
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
    <div className="flex flex-col bg-background p-4 md:p-6 lg:p-8 w-full ">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Manufacturing Recipes</h2>
          <p className="text-sm font-medium text-on-surface-variant">Manage formulas, bills of materials (BOM), and expected yields.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Link href="/manufacturing/recipes/new" className="flex-1 sm:flex-none w-full sm:w-auto">
            <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border-none whitespace-nowrap">
              <Plus className="w-4 h-4 shrink-0" />
              <span className="truncate">Add Recipe</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 shrink-0">
        <StatsCard
          title="Total Recipes"
          value={totalRecipes}
          icon={BookOpen}
          trendLabel="ALL FORMULAS"
          colorTheme="primary"
        />
        <StatsCard
          title="Active Formulas"
          value={activeRecipes}
          icon={Activity}
          trendLabel={`${totalRecipes > 0 ? Math.round((activeRecipes / totalRecipes) * 100) : 0}% Active Rate`}
          colorTheme="success"
        />
        <StatsCard
          title="Avg Base Cost"
          value={`₹${avgBaseCost.toFixed(2)}`}
          icon={FileText}
          trendLabel="Per Unit Yield"
          colorTheme="yellow"
        />
        <StatsCard
          title="Total Ingredients"
          value={recipesData.reduce((sum, r) => sum + r.ingredientsCount, 0)}
          icon={Beaker}
          trendLabel="RAW MATERIALS USED"
          colorTheme="purple"
        />
      </div>

      {/* Recipes Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-on-surface-variant font-medium">Loading Recipes...</div>
        ) : (
          <DataTable
            data={filteredData}
            columns={columns}
            searchPlaceholder="Search recipes by name or ID..."
            itemsPerPage={10}
            headerContent={
              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-on-surface">Recipe Master List</h3>
                </div>
                {TabsComponent}
              </div>
            }
            className="border-none shadow-none"
          />
        )}
      </div>
    </div>
  );
}
