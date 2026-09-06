'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Save, Plus, Trash2, BookOpen, FileText, Layers, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { recipeService } from '@/lib/services/recipe.services';
import { useTranslation } from 'react-i18next';
import { productService } from '@/lib/services/product.services';
import { recipeSchema } from '@/utils/validations';
import toast from 'react-hot-toast';

export default function RecipeForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [finalProductId, setFinalProductId] = useState('');
  const [notes, setNotes] = useState('');
  const [ingredients, setIngredients] = useState<{ id: number; productId: string; quantityRequired: string }[]>([
    { id: 1, productId: '', quantityRequired: '' }
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.getProducts();
        if (res.success) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error('Error fetching products', err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const addIngredient = () => {
    setIngredients([...ingredients, { id: Date.now(), productId: '', quantityRequired: '' }]);
  };

  const removeIngredient = (id: number) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const updateIngredient = (id: number, field: string, value: string) => {
    setIngredients(ingredients.map(ing =>
      ing.id === id ? { ...ing, [field]: value } : ing
    ));
    
    // Clear specific error on change
    if (errors['ingredients'] || errors[`ingredient_${id}_${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors['ingredients'];
        delete newErrors[`ingredient_${id}_${field}`];
        return newErrors;
      });
    }
  };

  const handleClear = () => {
    setFinalProductId('');
    setNotes('');
    setIngredients([{ id: Date.now(), productId: '', quantityRequired: '' }]);
    setErrors({});
  };

  const handleFinalProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFinalProductId(e.target.value);
    if (errors['finalProductId']) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors['finalProductId'];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData = {
      finalProductId,
      ingredients: ingredients.map(ing => ({
        productId: ing.productId,
        quantityRequired: Number(ing.quantityRequired) || 0
      })),
      notes
    };

    const validationResult = recipeSchema.safeParse(submissionData);
    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      
      validationResult.error.issues.forEach(err => {
        if (err.path[0] === 'ingredients' && err.path[1] !== undefined) {
          // It's an error inside a specific ingredient
          const ingredientIndex = err.path[1] as number;
          const fieldName = err.path[2] as string;
          const ingredientId = ingredients[ingredientIndex]?.id;
          if (ingredientId) {
            newErrors[`ingredient_${ingredientId}_${fieldName}`] = err.message;
          }
        } else if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message;
        }
      });
      
      setErrors(newErrors);
      return toast.error(t('manufacturing.recipeForm.pleaseCorrectErrors'), { id: 'please-correct-the-errors-----' });
    }

    if (ingredients.some(ing => ing.productId === finalProductId)) {
      setErrors(prev => ({ ...prev, ingredients: t('manufacturing.recipeForm.sameIngredientError') }));
      return toast.error(t('manufacturing.recipeForm.sameIngredientError'), { id: 'an-ingredient-cannot-be-the-sa' });
    }

    setSubmitting(true);
    const toastId = toast.loading(t('manufacturing.recipeForm.savingRecipe'));

    try {
      const res = await recipeService.createRecipe(submissionData);
      if (res.success) {
        toast.success(t('manufacturing.recipeForm.recipeCreated'), { id: toastId });
        router.push('/manufacturing/recipes');
      } else {
        toast.error((res as any).message || t('manufacturing.recipeForm.failedToCreate'), { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || t('manufacturing.recipeForm.unexpectedError'), { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate estimated cost
  const estimatedCost = ingredients.reduce((sum, ing) => {
    const product = products.find(p => p._id === ing.productId);
    if (product && ing.quantityRequired) {
      return sum + (product.purchasePrice || 0) * Number(ing.quantityRequired);
    }
    return sum;
  }, 0);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Header Sticky */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-outline-variant/20 p-4 md:p-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button type="button" onClick={() => router.back()} variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface hover:text-primary hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">
              {t('manufacturing.recipeForm.createNewRecipe')}
            </h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">
              {t('manufacturing.recipeForm.defineFormula')}
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 md:p-6 lg:p-8 w-full flex flex-col gap-6">

        {/* General Information */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-on-surface">{t('manufacturing.recipeForm.generalInfo')}</h2>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              <BookOpen className="w-3.5 h-3.5" /> {t('manufacturing.recipeForm.outputProduct')} <span className="text-error">*</span>
            </label>
            <select
              value={finalProductId}
              onChange={handleFinalProductChange}
              className={cn(
                "w-full h-11 px-4 bg-surface-container-low border rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer",
                errors.finalProductId ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
              )}
            >
              <option value="">{t('manufacturing.recipeForm.selectFinalProduct')}</option>
              {products.map((p: any) => (
                <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>
              ))}
            </select>
            {errors.finalProductId && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.finalProductId}</p>}
          </div>

          {finalProductId && (
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
              <h3 className="text-sm font-bold text-on-surface mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" /> {t('manufacturing.recipeForm.selectedProduct')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">{t('manufacturing.recipeForm.name')}</p>
                  <p className="font-bold text-primary">{products.find(p => p._id === finalProductId)?.name}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">{t('manufacturing.recipeForm.sku')}</p>
                  <p className="font-medium text-on-surface">{products.find(p => p._id === finalProductId)?.sku || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">{t('manufacturing.recipeForm.currentStock')}</p>
                  <p className="font-medium text-on-surface">{products.find(p => p._id === finalProductId)?.currentStock || 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bill of Materials */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">{t('manufacturing.recipeForm.billOfMaterials')}</h2>
            </div>
            <Button type="button" variant="outline" onClick={addIngredient} className="h-8 px-3 text-xs font-bold gap-1.5 border-primary/30 text-primary hover:bg-primary/5 rounded-xl">
              <Plus className="w-3.5 h-3.5" />
              Add Item / आइटम जोड़ें
            </Button>
          </div>
          
          {errors.ingredients && <p className="text-sm text-error font-bold mb-2">{errors.ingredients}</p>}

          <div className="flex flex-col gap-4">
            {ingredients.map((ing, index) => {
              const prodError = errors[`ingredient_${ing.id}_productId`];
              const qtyError = errors[`ingredient_${ing.id}_quantityRequired`];
              
              return (
              <div key={ing.id} className="flex flex-col sm:flex-row gap-3 items-end bg-surface p-4 rounded-xl border border-outline-variant/10 shadow-sm">
                <div className="w-full sm:flex-1 space-y-1.5">
                  {index === 0 && (
                    <label className="text-sm font-bold text-on-surface">
                      {t('manufacturing.recipeForm.rawMaterial')} <span className="text-error ml-1">*</span>
                    </label>
                  )}
                  <select
                    value={ing.productId}
                    onChange={(e) => updateIngredient(ing.id, 'productId', e.target.value)}
                    className={cn(
                      "w-full h-10 px-3 bg-surface border rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer",
                      prodError ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                    )}
                  >
                    <option value="">{t('manufacturing.recipeForm.selectMaterial')}</option>
                    {products
                      .filter(p => p._id !== finalProductId)
                      .map((p: any) => (
                        <option key={p._id} value={p._id}>{p.name} ({t('manufacturing.recipeForm.stock')} {p.currentStock || 0})</option>
                      ))
                    }
                  </select>
                  {prodError && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{prodError}</p>}
                </div>
                <div className="w-full sm:w-36">
                  {index === 0 && (
                    <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                      {t('manufacturing.recipeForm.qtyRequired')} <span className="text-error">*</span>
                    </label>
                  )}
                  <input
                    type="number"
                    placeholder="e.g. 5"
                    value={ing.quantityRequired}
                    onChange={(e) => updateIngredient(ing.id, 'quantityRequired', e.target.value)}
                    className={cn(
                      "w-full h-11 px-4 bg-surface-container-low border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all",
                      qtyError ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                    )}
                  />
                  {qtyError && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{qtyError}</p>}
                </div>
                <div className="w-full sm:w-20 text-center">
                  {ing.productId && (
                    <span className="text-xs font-bold text-on-surface-variant uppercase">
                      {products.find(p => p._id === ing.productId)?.unit || 'pcs'}
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeIngredient(ing.id)}
                  disabled={ingredients.length === 1}
                  className="w-full sm:w-12 h-10 border-error/30 text-error hover:bg-error/10 shrink-0 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )})}
          </div>

          {/* Estimated Cost */}
          {estimatedCost > 0 && (
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-on-surface flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" /> {t('manufacturing.recipeForm.estimatedCost')} (per 1 unit)
                </span>
                <span className="font-black text-primary text-lg">₹{estimatedCost.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-on-surface">{t('manufacturing.recipeForm.instructions')}</h2>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              <FileText className="w-3.5 h-3.5" /> {t('manufacturing.recipeForm.productionNotes')}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('manufacturing.recipeForm.addNotesPlaceholder')}
              className="w-full h-32 p-4 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all resize-none"
            ></textarea>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-4 pt-6 border-t border-outline-variant/20">
          <Button type="button" onClick={handleClear} variant="ghost" className="w-full sm:w-auto text-on-surface-variant hover:text-error flex items-center justify-center gap-2">
            <RefreshCcw className="w-4 h-4" />
            Clear Form / फ़ॉर्म साफ़ करें
          </Button>
          <Button type="button" onClick={() => router.back()} variant="outline" className="w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-bold tracking-wide shadow-sm">
            Cancel / रद्द करें
          </Button>
          <Button type="submit" disabled={submitting} className="w-full sm:w-auto gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 rounded-xl disabled:opacity-50">
            <Save className="w-4 h-4 shrink-0" />
            <span className="font-bold tracking-wide truncate">{submitting ? t('manufacturing.recipeForm.saving') : t('manufacturing.recipeForm.saveRecipe')}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
