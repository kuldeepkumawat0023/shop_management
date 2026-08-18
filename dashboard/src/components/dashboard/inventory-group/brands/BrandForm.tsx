'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Save, Tag, FileText, User, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { brandSchema } from '@/utils/validations';
import { brandService } from '@/lib/services/brand.services';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

interface BrandFormProps {
  editId?: string;
}

export default function BrandForm({ editId }: BrandFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    description: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!editId);

  React.useEffect(() => {
    if (editId) {
      brandService.getBrands().then(res => {
        if (res.success) {
          const brand = res.data.find(b => b._id === editId);
          if (brand) {
            setFormData({
              name: brand.name || '',
              contactPerson: (brand as any).contactPerson || '',
              description: (brand as any).description || '',
              status: brand.isActive !== false ? 'Active' : 'Inactive'
            });
          }
        }
        setInitialLoading(false);
      });
    }
  }, [editId]);

  const validate = (name: string, value: string) => {
    let error = '';
    const result = brandSchema.safeParse({ ...formData, [name]: value });
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
      contactPerson: '',
      description: '',
      status: 'Active'
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = brandSchema.safeParse(formData);
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
        ? await brandService.updateBrand(editId, formData)
        : await brandService.createBrand(formData);
        
      if (res.success || (res as any).status === 200) {
        toast.success(editId ? t('inventory.brandForm.brandUpdated') : t('inventory.brandForm.brandSaved'), { id: toastId });
        router.push(editId ? `/brands/${editId}` : '/brands');
      } else {
        toast.error((res as any).error || t('inventory.brandForm.failedToSave'), { id: toastId });
      }
    } catch (error) {
      toast.error(t('inventory.brandForm.unexpectedError'), { id: toastId });
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
              {editId ? t('inventory.brandForm.editBrand') : t('inventory.brandForm.addNewBrand')}
            </h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">
              {editId ? t('inventory.brandForm.updateBrandDetails') : t('inventory.brandForm.onboardNewBrand')}
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 md:p-6 lg:p-8 flex-1 w-full flex flex-col gap-6">
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-on-surface">{t('inventory.brandForm.brandDetails')}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                <Tag className="w-3.5 h-3.5" /> {t('inventory.brandForm.brandName')} <span className="text-error">*</span>
              </label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                aria-invalid={!!errors.name}
                placeholder="e.g. SonicAudio, FitLife Gear" 
                className={cn(
                  "w-full h-11 px-4 bg-surface-container-low border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all",
                  errors.name ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                )}
              />
              {errors.name && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                <User className="w-3.5 h-3.5" /> {t('inventory.brandForm.primaryContact')}
              </label>
              <input 
                type="text" 
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                aria-invalid={!!errors.contactPerson}
                placeholder="John Doe" 
                className={cn(
                  "w-full h-11 px-4 bg-surface-container-low border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all",
                  errors.contactPerson ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                )}
              />
              {errors.contactPerson && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.contactPerson}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              <FileText className="w-3.5 h-3.5" /> {t('inventory.brandForm.brandNotes')}
            </label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter brand description, partnership notes, etc..." 
              className={cn(
                "w-full h-32 p-4 bg-surface-container-low border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all resize-none",
                errors.description ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
              )}
            ></textarea>
            {errors.description && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.description}</p>}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6">
          <h2 className="text-lg font-bold text-on-surface mb-6">{t('inventory.brandForm.partnershipStatus')}</h2>
          
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
                {t('inventory.brandForm.active')}
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
                {t('inventory.brandForm.inactive')}
              </div>
            </label>
          </div>
          <p className="text-xs text-on-surface-variant mt-3 text-center">
            {t('inventory.brandForm.inactiveMsg')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-4 pt-6 border-t border-outline-variant/20">
          <Button type="button" onClick={handleClear} variant="ghost" className="w-full sm:w-auto text-on-surface-variant hover:text-error flex items-center justify-center gap-2">
            <RefreshCcw className="w-4 h-4" />
            {t('inventory.brandForm.clearForm')}
          </Button>
          <Button type="button" onClick={() => router.back()} variant="outline" className="w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-bold tracking-wide shadow-sm">
            {t('inventory.brandForm.cancel')}
          </Button>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 rounded-xl disabled:opacity-50">
            <Save className="w-4 h-4 shrink-0" />
            <span className="font-bold tracking-wide truncate">{loading ? t('inventory.brandForm.saving') : (editId ? t('inventory.brandForm.updateBrand') : t('inventory.brandForm.saveBrand'))}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
