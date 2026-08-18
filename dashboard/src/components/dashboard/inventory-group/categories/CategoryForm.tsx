'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Save, FolderTree, Type, FileText, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { categorySchema } from '@/utils/validations';
import { categoryService } from '@/lib/services/category.services';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

interface CategoryFormProps {
  editId?: string;
}

export default function CategoryForm({ editId }: CategoryFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!editId);

  React.useEffect(() => {
    if (editId) {
      categoryService.getCategories().then(res => {
        if (res.success) {
          const cat = res.data.find(c => c._id === editId);
          if (cat) {
            setFormData({
              name: cat.name || '',
              description: cat.description || '',
              status: cat.isActive !== false ? 'Active' : 'Inactive'
            });
          }
        }
        setInitialLoading(false);
      });
    }
  }, [editId]);

  const validate = (name: string, value: string) => {
    let error = '';
    const result = categorySchema.safeParse({ ...formData, [name]: value });
    if (!result.success) {
      const fieldError = result.error.issues.find(err => err.path[0] === name);
      if (fieldError) error = fieldError.message;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const handleClear = () => {
    setFormData({
      name: '',
      description: '',
      status: 'Active'
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = categorySchema.safeParse(formData);
    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      for (const err of validationResult.error.issues) {
        if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
      }
      setErrors(newErrors);
      return toast.error(t('inventory.categoryForm.pleaseCorrectErrors'), { id: 'please-correct-the-errors-----' });
    }

    setLoading(true);
    const toastId = toast.loading(editId ? t('inventory.categoryForm.updatingCategory') : t('inventory.categoryForm.savingCategory'));

    try {
      const res = editId 
        ? await categoryService.updateCategory(editId, formData)
        : await categoryService.createCategory(formData);
        
      if (res.success || (res as any).status === 200) {
        toast.success(editId ? t('inventory.categoryForm.categoryUpdated') : t('inventory.categoryForm.categorySaved'), { id: toastId });
        router.push(editId ? `/categories/${editId}` : '/categories');
      } else {
        toast.error((res as any).error || t('inventory.categoryForm.failedToSave'), { id: toastId });
      }
    } catch (error) {
      toast.error(t('inventory.categoryForm.unexpectedError'), { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="p-8 flex items-center justify-center">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full ">
      <div className="sticky top-16 md:top-20 z-20 bg-background border-b border-outline-variant/20 p-4 md:p-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button type="button" onClick={() => router.back()} variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface hover:text-primary hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">
              {editId ? t('inventory.categoryForm.editCategory') : t('inventory.categoryForm.addCategory')}
            </h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">
              {editId ? t('inventory.categoryForm.updateDetails') : t('inventory.categoryForm.createCategory')}
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 md:p-6 lg:p-8 flex-1 w-full flex flex-col gap-6">
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            <FolderTree className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-on-surface">{t('inventory.categoryForm.basicDetails')}</h2>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              <Type className="w-3.5 h-3.5" /> {t('inventory.categoryForm.categoryName')} <span className="text-error">*</span>
            </label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              aria-invalid={!!errors.name}
              placeholder="e.g. Electronics, Groceries, Clothing" 
              className={cn(
                "w-full h-11 px-4 bg-surface-container-low border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all",
                errors.name ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
              )}
            />
            {errors.name && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              <FileText className="w-3.5 h-3.5" /> {t('inventory.categoryForm.description')}
            </label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              aria-invalid={!!errors.description}
              placeholder="Enter category description..." 
              className={cn(
                "w-full h-32 p-4 bg-surface-container-low border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all resize-none",
                errors.description ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
              )}
            ></textarea>
            {errors.description && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.description}</p>}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6">
          <h2 className="text-lg font-bold text-on-surface mb-6">{t('inventory.categoryForm.status')}</h2>
          
          <div className="flex gap-4">
            <label className="flex-1 cursor-pointer group">
              <input 
                type="radio" 
                name="status" 
                value="Active" 
                checked={formData.status === 'Active'}
                onChange={handleChange}
                className="peer sr-only" 
              />
              <div className="flex items-center justify-center py-2.5 rounded-xl border-2 border-outline-variant/20 text-sm font-bold text-on-surface-variant peer-checked:border-success peer-checked:text-success peer-checked:bg-success/5 transition-all group-hover:border-outline-variant/40">
                {t('inventory.categoryForm.active')}
              </div>
            </label>
            
            <label className="flex-1 cursor-pointer group">
              <input 
                type="radio" 
                name="status" 
                value="Inactive" 
                checked={formData.status === 'Inactive'}
                onChange={handleChange}
                className="peer sr-only" 
              />
              <div className="flex items-center justify-center py-2.5 rounded-xl border-2 border-outline-variant/20 text-sm font-bold text-on-surface-variant peer-checked:border-error peer-checked:text-error peer-checked:bg-error/5 transition-all group-hover:border-outline-variant/40">
                {t('inventory.categoryForm.inactive')}
              </div>
            </label>
          </div>
          <p className="text-xs text-on-surface-variant mt-3 text-center">
            {t('inventory.categoryForm.inactiveMsg')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-4 pt-6 border-t border-outline-variant/20">
          <Button type="button" onClick={handleClear} variant="ghost" className="w-full sm:w-auto text-on-surface-variant hover:text-error flex items-center justify-center gap-2">
            <RefreshCcw className="w-4 h-4" />
            {t('inventory.categoryForm.clearForm')}
          </Button>
          <Button type="button" onClick={() => router.back()} variant="outline" className="w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-bold tracking-wide shadow-sm">
            {t('inventory.categoryForm.cancel')}
          </Button>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 rounded-xl disabled:opacity-50">
            <Save className="w-4 h-4 shrink-0" />
            <span className="font-bold tracking-wide truncate">{loading ? t('inventory.categoryForm.saving') : (editId ? t('inventory.categoryForm.updateCategory') : t('inventory.categoryForm.saveCategory'))}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
