'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Edit, Trash2, BookOpen, Layers } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { recipeService } from '@/lib/services/recipe.services';
import toast from 'react-hot-toast';

interface RecipeDetailViewProps {
  recipeId: string;
}

export default function RecipeDetailView({ recipeId }: RecipeDetailViewProps) {
  const router = useRouter();
  const [recipeData, setRecipeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await recipeService.getRecipeById(recipeId);
        if (res.success) {
          setRecipeData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [recipeId]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe? / क्या आप वाकई इस रेसिपी को हटाना चाहते हैं?')) {
      try {
        const res = await recipeService.deleteRecipe(recipeId);
        if (res.success) {
          toast.success('Recipe deleted successfully');
          router.push('/manufacturing/recipes');
        } else {
          toast.error(res.message || 'Failed to delete recipe');
        }
      } catch (err) {
        toast.error('Error deleting recipe');
      }
    }
  };

  if (loading) {
    return <div className="p-8 flex items-center justify-center h-full text-on-surface-variant">Loading Recipe Data...</div>;
  }

  if (!recipeData) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full text-center">
        <BookOpen className="w-16 h-16 text-outline-variant mb-4" />
        <h2 className="text-2xl font-bold text-on-surface">Recipe Not Found</h2>
        <p className="text-on-surface-variant mt-2 mb-6">The recipe you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const finalProduct = recipeData.finalProductId || {};
  const ingredients = recipeData.ingredients || [];

  return (
    <div className="flex flex-col bg-background p-4 md:p-6 lg:p-8 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-on-surface tracking-tight">Recipe Details</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/manufacturing/recipes/${recipeId}/edit`}>
            <Button variant="ghost" className="text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-xl">
              <Edit className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          </Link>
          <Button onClick={handleDelete} variant="ghost" className="text-on-surface-variant hover:bg-error/10 hover:text-error rounded-xl">
            <Trash2 className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Profile Header */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-3xl md:text-5xl shrink-0 border border-primary/20 shadow-inner">
            <BookOpen className="w-12 h-12 md:w-16 md:h-16" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded border border-outline-variant/10">
                  {recipeData._id.slice(-6).toUpperCase()}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-on-surface tracking-tight leading-tight">
                {finalProduct.name || 'Unknown Product'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-outline-variant/10">
              <div>
                <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-1">Final Product SKU</p>
                <p className="font-semibold text-on-surface">{finalProduct.sku || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-1">Current Stock</p>
                <p className="font-semibold text-on-surface">{finalProduct.currentStock || 0} {finalProduct.unit}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients & Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Raw Materials / Ingredients
              </h3>
              
              <div className="space-y-4">
                {ingredients.map((ing: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
                    <div>
                      <p className="font-bold text-on-surface">{ing.productId?.name || 'Unknown Item'}</p>
                      <p className="text-xs text-on-surface-variant mt-1">SKU: {ing.productId?.sku || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{ing.quantityRequired} {ing.productId?.unit}</p>
                      <p className="text-xs text-on-surface-variant mt-1">
                        Est. Cost: ₹{((ing.productId?.purchasePrice || 0) * ing.quantityRequired).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-on-surface mb-4">Production Notes</h3>
              <div className="text-sm text-on-surface-variant whitespace-pre-wrap">
                {recipeData.notes || 'No special instructions provided for this recipe.'}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
