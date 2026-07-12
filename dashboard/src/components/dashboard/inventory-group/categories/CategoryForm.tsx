'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Save, UploadCloud, FolderTree, Image as ImageIcon, Type, Link as LinkIcon, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { categorySchema } from '@/utils/validations';
import { categoryService } from '@/lib/services/category.services';
import toast from 'react-hot-toast';

interface CategoryFormProps {
  editId?: string;
}

export default function CategoryForm({ editId }: CategoryFormProps) {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parentCategory: '',
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
              slug: cat.slug || '',
              parentCategory: (cat as any).parentCategory?._id || (cat as any).parentCategory || '',
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

    const validationResult = categorySchema.safeParse(formData);
    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      for (const err of validationResult.error.issues) {
        if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
      }
      setErrors(newErrors);
      return toast.error('Please correct the errors / कृपया त्रुटियों को ठीक करें');
    }

    setLoading(true);
    const toastId = toast.loading(editId ? 'Updating category...' : 'Saving category...');

    try {
      const res = editId 
        ? await categoryService.updateCategory(editId, formData)
        : await categoryService.createCategory(formData);
        
      if (res.success || (res as any).status === 200) {
        toast.success(editId ? 'Category updated successfully!' : 'Category saved successfully! / श्रेणी सफलतापूर्वक सहेजी गई!', { id: toastId });
        router.push(editId ? `/categories/${editId}` : '/categories');
      } else {
        toast.error((res as any).error || 'Failed to save category', { id: toastId });
      }
    } catch (error) {
      toast.error('An unexpected error occurred', { id: toastId });
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
          <Button type="button" onClick={() => router.back()} variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface hover:text-primary hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">
              {editId ? 'Edit Category / श्रेणी संपादित करें' : 'Add Category / श्रेणी जोड़ें'}
            </h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">
              {editId ? 'Update product category details' : 'Create a new product category'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          <Button type="button" onClick={() => router.back()} variant="outline" className="flex-1 sm:flex-none rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-bold tracking-wide">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1 sm:flex-none gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 rounded-xl disabled:opacity-50">
            <Save className="w-4 h-4 shrink-0" />
            <span className="font-bold tracking-wide truncate">{loading ? 'Saving...' : (editId ? 'Update Category' : 'Save Category')}</span>
          </Button>
        </div>
      </div>
      </div>

      {/* Form Content */}
      <div className="p-4 md:p-6 lg:p-8 flex-1 w-full flex flex-col gap-6">
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            <FolderTree className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-on-surface">Basic Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                <Type className="w-3.5 h-3.5" /> Category Name / श्रेणी का नाम <span className="text-error">*</span>
              </label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                aria-invalid={!!errors.name}
                placeholder="e.g. Electronics, Men's Clothing" 
                className={cn(
                  "w-full h-11 px-4 bg-surface-container-low border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all",
                  errors.name ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                )}
              />
              {errors.name && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                <LinkIcon className="w-3.5 h-3.5" /> URL Slug / यूआरएल स्लग <span className="text-error">*</span>
              </label>
              <input 
                type="text" 
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="e.g. electronics" 
                className="w-full h-11 px-4 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              <FolderTree className="w-3.5 h-3.5" /> Parent Category / मूल श्रेणी
            </label>
            <select 
              name="parentCategory"
              value={formData.parentCategory}
              onChange={handleChange}
              className="w-full h-11 px-4 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all appearance-none cursor-pointer"
            >
              <option value="">None (Top Level Category)</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="groceries">Groceries</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              <FileText className="w-3.5 h-3.5" /> Description / विवरण
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
          <div className="flex items-center gap-2 mb-6">
            <ImageIcon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-on-surface">Category Image / छवि</h2>
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
            <p className="text-sm font-bold text-on-surface text-center mb-1">Click to upload or drag and drop</p>
            <p className="text-xs text-on-surface-variant text-center">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6">
          <h2 className="text-lg font-bold text-on-surface mb-6">Status / स्थिति</h2>
          
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
                Active / सक्रिय
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
                Inactive / निष्क्रिय
              </div>
            </label>
          </div>
          <p className="text-xs text-on-surface-variant mt-3 text-center">
            Inactive categories will be hidden from the point of sale and storefront.
          </p>
        </div>
      </div>
    </form>
  );
}
