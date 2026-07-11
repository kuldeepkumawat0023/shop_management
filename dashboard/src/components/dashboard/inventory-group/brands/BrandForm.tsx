'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Save, UploadCloud, Tag, FileText, Globe, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { brandSchema } from '@/utils/validations';
import toast from 'react-hot-toast';

export default function BrandForm() {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    contactPerson: '',
    category: '',
    description: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Add file handling logic here
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
      return toast.error('Please correct the errors / कृपया त्रुटियों को ठीक करें');
    }

    setLoading(true);
    const toastId = toast.loading('Saving brand...');

    try {
      // API call simulation
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Brand saved successfully! / ब्रांड सफलतापूर्वक सहेजा गया!', { id: toastId });
      router.back();
    } catch (error) {
      toast.error('Failed to save brand', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button type="button" onClick={() => router.back()} variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface hover:text-primary hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">Add New Brand</h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">Onboard a new brand partner to the catalog</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button type="button" onClick={() => router.back()} variant="outline" className="w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-bold tracking-wide shadow-sm">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1 sm:flex-none gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 rounded-xl disabled:opacity-50">
            <Save className="w-4 h-4" />
            <span className="font-bold tracking-wide">{loading ? 'Saving...' : 'Save Brand'}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">Brand Details</h2>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                <Tag className="w-3.5 h-3.5" /> Brand Name / ब्रांड का नाम <span className="text-error">*</span>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  <Globe className="w-3.5 h-3.5" /> Website URL / वेबसाइट
                </label>
                <input 
                  type="text" 
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  aria-invalid={!!errors.website}
                  placeholder="https://example.com" 
                  className={cn(
                    "w-full h-11 px-4 bg-surface-container-low border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all",
                    errors.website ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                  )}
                />
                {errors.website && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.website}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  <User className="w-3.5 h-3.5" /> Primary Contact / संपर्क व्यक्ति
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
                <Tag className="w-3.5 h-3.5" /> Category Focus / श्रेणी
              </label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={cn(
                  "w-full h-11 px-4 bg-surface-container-low border rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer",
                  errors.category ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                )}
              >
                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Groceries">Groceries</option>
                <option value="Home Decor">Home Decor</option>
              </select>
              {errors.category && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.category}</p>}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                <FileText className="w-3.5 h-3.5" /> Brand Notes / विवरण
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
        </div>

        {/* Right Column - Media & Settings */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6">
            <div className="flex items-center gap-2 mb-6">
              <UploadCloud className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">Brand Logo</h2>
            </div>
            
            <div 
              className={cn(
                "relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all cursor-pointer bg-surface-container-low",
                dragActive ? "border-primary bg-primary/5 scale-[0.98]" : "border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-4 shadow-sm border border-outline-variant/20 text-on-surface-variant">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-on-surface text-center mb-1">Upload Brand Logo</p>
              <p className="text-xs text-on-surface-variant text-center">PNG or JPG (MAX. 800x400px)</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6">
            <h2 className="text-lg font-bold text-on-surface mb-6">Partnership Status</h2>
            
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
                  Active
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
                  Inactive
                </div>
              </label>
            </div>
            <p className="text-xs text-on-surface-variant mt-3 text-center">
              Inactive brands will be hidden from product catalogs and PO generation.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
