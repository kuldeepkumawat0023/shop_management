'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowLeft, Save, Plus, Trash2, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function RecipeForm() {
  const [ingredients, setIngredients] = useState([
    { id: 1, name: '', quantity: '', unit: '' }
  ]);

  const addIngredient = () => {
    setIngredients([...ingredients, { id: Date.now(), name: '', quantity: '', unit: '' }]);
  };

  const removeIngredient = (id: number) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto custom-scrollbar w-full mx-auto">
      {/* Header Sticky */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-outline-variant/20 p-4 md:p-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Link href="/manufacturing/recipes">
              <Button variant="outline" className="w-10 h-10 p-0 rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h2 className="text-2xl font-black text-on-surface tracking-tight">Create New Recipe</h2>
              <p className="text-sm font-medium text-on-surface-variant">Define formula and raw materials</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link href="/manufacturing/recipes" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full sm:w-auto font-bold border-outline-variant/30">Cancel</Button>
            </Link>
            <Button className="flex-1 sm:w-auto gradient-button text-white font-bold shadow-md hover:shadow-lg gap-2">
              <Save className="w-4 h-4" />
              Save Recipe
            </Button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 md:p-6 lg:p-8 flex-1 max-w-4xl mx-auto w-full">
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-8">
          
          {/* General Information */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant/10">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-on-surface">General Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <Input 
                label="Recipe Name" 
                placeholder="e.g., Premium Acoustic Foam"
                required
              />
              <Input 
                label="Recipe Code/ID" 
                placeholder="e.g., REC-001"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input 
                label="Output Product" 
                placeholder="Search or enter output product..."
                required
              />
              <Input 
                label="Expected Yield (Units)" 
                type="number"
                placeholder="e.g., 100"
                required
              />
            </div>
          </div>

          {/* Ingredients / Bill of Materials */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant/10">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-on-surface">Bill of Materials</h3>
              </div>
              <Button variant="outline" onClick={addIngredient} className="h-8 px-3 text-xs font-bold gap-1.5 border-primary/30 text-primary hover:bg-primary/5">
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </Button>
            </div>
            
            <div className="flex flex-col gap-4">
              {ingredients.map((ing, index) => (
                <div key={ing.id} className="flex flex-col sm:flex-row gap-3 items-end bg-surface-container/30 p-3 rounded-xl border border-outline-variant/10">
                  <div className="w-full sm:flex-1">
                    <Input 
                      label={index === 0 ? "Raw Material / Item" : ""}
                      placeholder="Select material..."
                    />
                  </div>
                  <div className="w-full sm:w-32">
                    <Input 
                      label={index === 0 ? "Quantity" : ""}
                      type="number"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="w-full sm:w-32">
                    <Input 
                      label={index === 0 ? "Unit" : ""}
                      placeholder="e.g., kg, pcs"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => removeIngredient(ing.id)}
                    disabled={ingredients.length === 1}
                    className="w-full sm:w-12 h-10 border-error/30 text-error hover:bg-error/10 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Production Notes */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant/10">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-on-surface">Instructions</h3>
            </div>
            <textarea 
              className="w-full h-32 rounded-xl bg-surface border border-outline-variant/20 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 resize-none"
              placeholder="Add step-by-step production instructions, safety guidelines, or notes here..."
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
