'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { ArrowLeft, PlayCircle, ClipboardList, CheckCircle2, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { recipeService } from '@/lib/services/recipe.services';
import { productionService } from '@/lib/services/production.services';
import { productionSchema } from '@/utils/validations';
import toast from 'react-hot-toast';

export default function ProductionForm() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [quantityProduced, setQuantityProduced] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await recipeService.getRecipes();
        if (res.success) {
          setRecipes(res.data);
        }
      } catch (err) {
        console.error('Error fetching recipes', err);
      } finally {
        setLoadingRecipes(false);
      }
    };
    fetchRecipes();
  }, []);

  const handleRecipeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRecipeId(e.target.value);
    if (errors['recipeId']) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors['recipeId'];
        return newErrors;
      });
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantityProduced(e.target.value);
    if (errors['quantityProduced']) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors['quantityProduced'];
        return newErrors;
      });
    }
  };

  const handleClear = () => {
    setSelectedRecipeId('');
    setQuantityProduced('');
    setErrors({});
  };

  const selectedRecipe = recipes.find((r: any) => r._id === selectedRecipeId);
  const qty = Number(quantityProduced) || 0;

  // Calculate expected deductions
  const expectedDeductions = selectedRecipe?.ingredients?.map((ing: any) => ({
    name: ing.productId?.name || 'Unknown',
    sku: ing.productId?.sku || 'N/A',
    unit: ing.productId?.unit || 'pcs',
    qtyPerUnit: ing.quantityRequired,
    totalRequired: ing.quantityRequired * qty,
    currentStock: ing.productId?.currentStock || 0,
    costPerUnit: ing.productId?.purchasePrice || 0,
    totalCost: (ing.productId?.purchasePrice || 0) * ing.quantityRequired * qty,
    hasEnoughStock: (ing.productId?.currentStock || 0) >= (ing.quantityRequired * qty),
  })) || [];

  const estimatedTotalCost = expectedDeductions.reduce((sum: number, d: any) => sum + d.totalCost, 0);
  const allStockAvailable = expectedDeductions.every((d: any) => d.hasEnoughStock);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData = {
      recipeId: selectedRecipeId,
      quantityProduced: qty
    };

    const validationResult = productionSchema.safeParse(submissionData);
    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      for (const err of validationResult.error.issues) {
        if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
      }
      setErrors(newErrors);
      return toast.error('Please correct the errors / कृपया त्रुटियों को ठीक करें');
    }

    if (!allStockAvailable) {
      return toast.error('Insufficient stock for one or more raw materials / एक या अधिक कच्चे माल के लिए अपर्याप्त स्टॉक');
    }

    setSubmitting(true);
    const toastId = toast.loading('Logging production... / उत्पादन लॉग कर रहे हैं...');

    try {
      const res = await productionService.logProduction(submissionData);
      if (res.success) {
        toast.success('Production logged successfully! Stock updated. / उत्पादन सफलतापूर्वक लॉग किया गया! स्टॉक अपडेट हो गया।', { id: toastId });
        router.push('/manufacturing/productions');
      } else {
        toast.error((res as any).message || 'Failed to log production', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full ">
      {/* Header Sticky */}
      <div className="sticky top-16 md:top-20 z-20 bg-background border-b border-outline-variant/20 p-4 md:p-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button type="button" onClick={() => router.back()} variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface hover:text-primary hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">
              New Production Run / नया उत्पादन शुरू करें
            </h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">
              Log a new manufacturing process / एक नई निर्माण प्रक्रिया दर्ज करें
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 md:p-6 lg:p-8 flex-1 w-full flex flex-col gap-6">

        {/* Run Details */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-on-surface">Run Details / रन विवरण</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                <ClipboardList className="w-3.5 h-3.5" /> Recipe / Formula / रेसिपी / फॉर्मूला <span className="text-error">*</span>
              </label>
              <select
                value={selectedRecipeId}
                onChange={handleRecipeChange}
                className={cn(
                  "w-full h-11 px-4 bg-surface-container-low border rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer",
                  errors.recipeId ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                )}
              >
                <option value="">Select a recipe to produce... / उत्पादित करने के लिए एक रेसिपी चुनें...</option>
                {recipes.map((r: any) => (
                  <option key={r._id} value={r._id}>
                    {r.finalProductId?.name || 'Unknown'} ({r.ingredients?.length || 0} ingredients)
                  </option>
                ))}
              </select>
              {errors.recipeId && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.recipeId}</p>}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                Quantity to Produce / उत्पादन की मात्रा <span className="text-error">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 10"
                value={quantityProduced}
                onChange={handleQuantityChange}
                className={cn(
                  "w-full h-11 px-4 bg-surface-container-low border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all",
                  errors.quantityProduced ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                )}
              />
              {errors.quantityProduced && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.quantityProduced}</p>}
            </div>
          </div>
        </div>

        {/* Expected Output vs Inventory */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-on-surface">Expected Deductions & Yield / अपेक्षित कटौती और उपज</h2>
          </div>

          <div className="bg-surface-container-low/50 p-6 rounded-2xl border border-outline-variant/20 flex flex-col gap-4 text-sm">
            <div className="flex justify-between items-center text-on-surface-variant">
              <span>Selected Recipe / चयनित रेसिपी:</span>
              <span className="font-bold text-on-surface">{selectedRecipe?.finalProductId?.name || 'None'}</span>
            </div>

            {expectedDeductions.length > 0 && (
              <div className="border-t border-outline-variant/20 pt-4 space-y-3">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Raw Materials Required / कच्चा माल आवश्यक:</p>
                {expectedDeductions.map((d: any, i: number) => (
                  <div key={i} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border ${d.hasEnoughStock ? 'border-outline-variant/10 bg-surface' : 'border-error/30 bg-error/5'}`}>
                    <div>
                      <p className="font-bold text-on-surface">{d.name}</p>
                      <p className="text-xs text-on-surface-variant">SKU: {d.sku} | Stock: {d.currentStock} {d.unit}</p>
                    </div>
                    <div className="sm:text-right mt-2 sm:mt-0">
                      <p className={`font-bold ${d.hasEnoughStock ? 'text-on-surface' : 'text-error'}`}>-{d.totalRequired} {d.unit}</p>
                      <p className="text-xs text-on-surface-variant">Cost: ₹{d.totalCost.toFixed(2)}</p>
                      {!d.hasEnoughStock && <p className="text-xs font-bold text-error">⚠ Insufficient stock! / अपर्याप्त स्टॉक!</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center text-on-surface-variant">
              <span>Expected Yield / अपेक्षित उपज:</span>
              <span className="font-bold text-on-surface">{qty > 0 ? `${qty} Units` : '-'}</span>
            </div>

            <div className="flex justify-between items-center text-on-surface-variant border-t border-outline-variant/20 pt-4 mt-2">
              <span className="font-bold">Estimated Cost / अनुमानित लागत:</span>
              <span className="font-black text-primary text-lg">₹{estimatedTotalCost.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant/70 mt-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-warning inline-block"></span>
            Note: Raw materials will be deducted from inventory automatically when the production is logged. / नोट: उत्पादन दर्ज होने पर कच्चा माल इन्वेंट्री से स्वचालित रूप से काट लिया जाएगा।
          </p>
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
          <Button
            type="submit"
            disabled={submitting || (qty > 0 && !allStockAvailable)}
            className="w-full sm:w-auto gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 rounded-xl disabled:opacity-50"
          >
            <PlayCircle className="w-4 h-4 shrink-0" />
            <span className="font-bold tracking-wide truncate">{submitting ? 'Processing...' : 'Start Production / उत्पादन शुरू करें'}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
