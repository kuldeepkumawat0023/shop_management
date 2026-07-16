'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsCard } from '@/components/common/StatsCard';
import { ViewPageSkeleton } from '@/components/common/ViewPageSkeleton';
import { Plus, Download, BookOpen, Activity, Beaker, FileText, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { recipeService } from '@/lib/services/recipe.services';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function RecipesView() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [recipesData, setRecipesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [t('manufacturing.recipesView.allRecipes'), t('manufacturing.recipesView.active'), t('manufacturing.recipesView.archived')];
  const [activeTab, setActiveTab] = useState('All Recipes');
  React.useEffect(() => {
    setActiveTab(t('manufacturing.recipesView.allRecipes'));
  }, [t]);

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
            status: t('manufacturing.recipesView.active'),
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
    if (window.confirm(t('manufacturing.recipesView.confirmDelete'))) {
      try {
        const res = await recipeService.deleteRecipe(id);
        if (res.success) {
          toast.success(t('manufacturing.recipesView.recipeDeleted'));
          setRecipesData(prev => prev.filter(r => r.id !== id));
        } else {
          toast.error(res.message || t('manufacturing.recipesView.deleteFailed'));
        }
      } catch (err) {
        toast.error(t('manufacturing.recipesView.deleteError'), { id: 'error-deleting-recipe' });
      }
    }
  };

  const filteredData = recipesData.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.outputProduct.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === t('manufacturing.recipesView.allRecipes') ? true : r.status === activeTab;
    return matchesSearch && matchesTab;
  });

  // Dynamic stats
  const totalRecipes = recipesData.length;
  const activeRecipes = recipesData.filter(r => r.status === t('manufacturing.recipesView.active')).length;
  const avgBaseCost = totalRecipes > 0
    ? (recipesData.reduce((sum, r) => sum + r.baseCost, 0) / totalRecipes)
    : 0;

  const columns = [
    { header: t('manufacturing.recipesView.recipeId'), accessorKey: 'id', cell: (row: any) => <span className="font-bold text-on-surface font-mono text-xs">{row.id.slice(-6).toUpperCase()}</span> },
    { header: t('manufacturing.recipesView.outputProduct'), accessorKey: 'name', cell: (row: any) => <span className="font-semibold text-primary">{row.name}</span> },
    { header: t('manufacturing.recipesView.sku'), accessorKey: 'outputProduct' },
    { header: t('manufacturing.recipesView.ingredients'), accessorKey: 'ingredientsCount', cell: (row: any) => `${row.ingredientsCount} {t('manufacturing.recipesView.items')}` },
    { header: t('manufacturing.recipesView.baseCost'), accessorKey: 'baseCost', cell: (row: any) => `₹${row.baseCost.toFixed(2)}` },
    { header: t('manufacturing.recipesView.currentStock'), accessorKey: 'expectedYield', cell: (row: any) => <span className="font-medium text-on-surface">{row.expectedYield} {t('manufacturing.recipesView.units')}</span> },
    { header: t('manufacturing.recipesView.status'), accessorKey: 'status', cell: (row: any) => <StatusBadge status={row.status} /> },
    {
      header: t('manufacturing.recipesView.actions'), accessorKey: 'actions', cell: (row: any) => (
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

  if (loading) return <ViewPageSkeleton />;

  return (
    <div className="flex flex-col bg-background p-4 md:p-6 lg:p-8 w-full ">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">{t('manufacturing.recipesView.manufacturingRecipes')}</h2>
          <p className="text-sm font-medium text-on-surface-variant">{t('manufacturing.recipesView.manageFormulas')}</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none bg-surface-container-lowest border-primary text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" />
            {t('manufacturing.recipesView.export')}
          </Button>
          <Link href="/manufacturing/recipes/new" className="flex-1 sm:flex-none w-full sm:w-auto">
            <Button className="w-full gradient-button text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border-none whitespace-nowrap">
              <Plus className="w-4 h-4 shrink-0" />
              <span className="truncate">{t('manufacturing.recipesView.addRecipe')}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 shrink-0">
        <StatsCard
          title={t('manufacturing.recipesView.totalRecipes')}
          value={totalRecipes}
          icon={BookOpen}
          trendLabel={t('manufacturing.recipesView.allFormulas')}
          colorTheme="primary"
        />
        <StatsCard
          title={t('manufacturing.recipesView.activeFormulas')}
          value={activeRecipes}
          icon={Activity}
          trendLabel={`${totalRecipes > 0 ? Math.round((activeRecipes / totalRecipes) * 100) : 0}% ${t('manufacturing.recipesView.activeRate')}`}
          colorTheme="success"
        />
        <StatsCard
          title={t('manufacturing.recipesView.avgBaseCost')}
          value={`₹${avgBaseCost.toFixed(2)}`}
          icon={FileText}
          trendLabel={t('manufacturing.recipesView.perUnitYield')}
          colorTheme="yellow"
        />
        <StatsCard
          title={t('manufacturing.recipesView.totalIngredients')}
          value={recipesData.reduce((sum, r) => sum + r.ingredientsCount, 0)}
          icon={Beaker}
          trendLabel={t('manufacturing.recipesView.rawMaterialsUsed')}
          colorTheme="purple"
        />
      </div>

      {/* Recipes Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <DataTable
          data={filteredData}
          columns={columns}
          searchPlaceholder={t('manufacturing.recipesView.searchPlaceholder')}
          itemsPerPage={10}
          headerContent={
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-on-surface">{t('manufacturing.recipesView.recipeMasterList')}</h3>
              </div>
              {TabsComponent}
            </div>
          }
          className="border-none shadow-none"
        />
      </div>
    </div>
  );
}
