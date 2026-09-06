'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Save, UploadCloud, Tag, FileText, Banknote, Package, Layers, RefreshCcw, X, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { cn } from '@/utils/cn';
import { productSchema } from '@/utils/validations';
import { productService } from '@/lib/services/product.services';
import { categoryService } from '@/lib/services/category.services';
import { brandService } from '@/lib/services/brand.services';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

interface ProductFormProps {
  editId?: string;
}

export default function ProductForm({ editId }: ProductFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string>('');
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    sellingPrice: '',
    costPrice: '',
    taxRate: '18',
    currentStock: '',
    minStockLevel: '10',
    category: '',
    brand: '',
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!editId);

  useEffect(() => {
    // Fetch categories and brands dynamically for dropdowns
    Promise.all([
      categoryService.getCategories(),
      brandService.getBrands(),
      editId ? productService.getProducts() : Promise.resolve(null)
    ]).then(([catRes, brandRes, prodRes]) => {
      if (catRes && catRes.success) {
        setCategories(catRes.data || []);
      }
      if (brandRes && brandRes.success) {
        setBrands(brandRes.data || []);
      }
      
      if (prodRes && prodRes.success) {
        const prod = prodRes.data.find((p: any) => p._id === editId);
        if (prod) {
          setFormData({
            name: prod.name || '',
            description: prod.description || '',
            sku: prod.sku || prod.barcode || '',
            sellingPrice: prod.sellingPrice?.toString() || '',
            costPrice: (prod.purchasePrice || prod.costPrice || '')?.toString() || '',
            taxRate: (prod.gstRate || prod.taxRate || '18')?.toString(),
            currentStock: (prod.currentStock || prod.openingStock || '')?.toString() || '',
            minStockLevel: (prod.minStock || prod.minStockLevel || '10')?.toString() || '10',
            category: prod.categoryId?._id || prod.categoryId || prod.category?._id || prod.category || '',
            brand: prod.brandId?._id || prod.brandId || prod.brand?._id || prod.brand || '',
            isActive: prod.isActive !== false
          });
          if (prod.image) {
            setExistingImage(prod.image);
          }
        }
      }
      setInitialLoading(false);
    }).catch((err) => {
      console.error('Error fetching form data:', err);
      setInitialLoading(false);
    });
  }, [editId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: any = value;
    if (type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
    } else if (['sellingPrice', 'costPrice'].includes(name)) {
      // Allow only numbers and a single decimal point
      if (value !== '' && !/^\d*\.?\d*$/.test(value)) {
        return;
      }
    } else if (['currentStock', 'minStockLevel'].includes(name)) {
      // Allow only integer digits
      if (value !== '' && !/^\d*$/.test(value)) {
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
    
    // Quick validation
    let validationVal = parsedValue;
    if (['sellingPrice', 'costPrice', 'taxRate', 'currentStock', 'minStockLevel'].includes(name)) {
      validationVal = value === '' ? undefined : Number(value);
    }
    
    const result = productSchema.safeParse({ ...formData, [name]: validationVal });
    if (!result.success) {
      const fieldError = result.error.issues.find(err => err.path[0] === name);
      if (fieldError) {
        setErrors(prev => ({ ...prev, [name]: fieldError.message }));
      } else {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    } else {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleClear = () => {
    setFormData({
      name: '',
      description: '',
      sku: '',
      sellingPrice: '',
      costPrice: '',
      taxRate: '18',
      currentStock: '',
      minStockLevel: '10',
      category: '',
      brand: '',
      isActive: true
    });
    setErrors({});
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size <= 5 * 1024 * 1024) { // 5MB limit
        setSelectedFile(file);
      } else {
        toast.error(t('inventory.productForm.fileSizeError'), { id: 'file-size-should-not-exceed-5m' });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size <= 5 * 1024 * 1024) { // 5MB limit
        setSelectedFile(file);
      } else {
        toast.error(t('inventory.productForm.fileSizeError'), { id: 'file-size-should-not-exceed-5m' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      sellingPrice: formData.sellingPrice === '' ? undefined : Number(formData.sellingPrice),
      costPrice: formData.costPrice === '' ? undefined : Number(formData.costPrice),
      taxRate: formData.taxRate === '' ? 18 : Number(formData.taxRate),
      currentStock: formData.currentStock === '' ? undefined : Number(formData.currentStock),
      minStockLevel: formData.minStockLevel === '' ? undefined : Number(formData.minStockLevel),
      images: undefined,
      image: selectedFile || undefined,
      existingImages: undefined
    };

    const validationResult = productSchema.safeParse(submissionData);
    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      for (const err of validationResult.error.issues) {
        if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
      }
      setErrors(newErrors);
      return toast.error(t('inventory.productForm.pleaseCorrectErrors'), { id: 'please-correct-the-errors-----' });
    }

    setLoading(true);
    const toastId = toast.loading(editId ? t('inventory.productForm.updatingProduct') : t('inventory.productForm.savingProduct'));

    try {
      const res = editId
        ? await productService.updateProduct(editId, submissionData)
        : await productService.createProduct(submissionData);
        
      if (res.success || (res as any).status === 200) {
        toast.success(editId ? t('inventory.productForm.productUpdated') : t('inventory.productForm.productSaved'), { id: toastId });
        router.push(editId ? `/products/${editId}` : '/products');
      } else {
        toast.error((res as any).error || (res as any).message || t('inventory.productForm.failedToSave'), { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t('inventory.productForm.unexpectedError'), { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="p-8 flex items-center justify-center">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-outline-variant/20 p-4 md:p-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button type="button" onClick={() => router.back()} variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface hover:text-primary hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">
              {editId ? t('inventory.productForm.editProduct') : t('inventory.productForm.addNewProduct')}
            </h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">
              {editId ? t('inventory.productForm.updateProductDetails') : t('inventory.productForm.createNewItem')}
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 md:p-6 lg:p-8 w-full flex flex-col gap-6">
        
        {/* Basic Information */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-on-surface">{t('inventory.productForm.basicInformation')}</h2>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              <Tag className="w-3.5 h-3.5" /> {t('inventory.productForm.productName')} <span className="text-error">*</span>
            </label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Samsung Galaxy S24 Ultra" 
              className={cn(
                "w-full h-11 px-4 bg-surface-container-low border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all",
                errors.name ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
              )}
            />
            {errors.name && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              <FileText className="w-3.5 h-3.5" /> {t('inventory.productForm.description')}
            </label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a detailed product description..." 
              className={cn(
                "w-full h-32 p-4 bg-surface-container-low border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all resize-none",
                errors.description ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
              )}
            ></textarea>
          </div>
        </div>

        {/* Organization (Dynamic Categories & Brands) */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-on-surface">{t('inventory.productForm.organization')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  <Tag className="w-3.5 h-3.5" /> {t('inventory.productForm.category')} <span className="text-error">*</span>
                </label>
                <Link href="/categories/new" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3" /> {t('inventory.categoriesView.addCategory', 'Add Category')}
                </Link>
              </div>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={cn(
                  "w-full h-11 px-4 bg-surface-container-low border rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer",
                  errors.category ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                )}
              >
                <option value="">{t('inventory.productForm.selectCategory')}</option>
                {categories.map((c: any) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.category}</p>}
              {categories.length === 0 && (
                <p className="text-[11px] text-on-surface-variant/70">No categories found. Please create a category first.</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  <Tag className="w-3.5 h-3.5" /> {t('inventory.productForm.brand')}
                </label>
                <Link href="/brands/new" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3" /> {t('inventory.brandsView.addNewBrand', 'Add Brand')}
                </Link>
              </div>
              <select 
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full h-11 px-4 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
              >
                <option value="">{t('inventory.productForm.selectBrand')}</option>
                {brands.map((b: any) => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
              {brands.length === 0 && (
                <p className="text-[11px] text-on-surface-variant/70">No brands found. You can optionally create brands to organize items.</p>
              )}
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            <Banknote className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-on-surface">{t('inventory.productForm.pricingInventory')}</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                {t('inventory.productForm.sellingPrice')} <span className="text-error">*</span>
              </label>
              <input 
                type="text" 
                inputMode="decimal"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                placeholder="0.00" 
                className={cn(
                  "w-full h-11 px-4 bg-surface-container-low border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all",
                  errors.sellingPrice ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                )}
              />
              {errors.sellingPrice && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.sellingPrice}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                {t('inventory.productForm.costPrice')} <span className="text-error">*</span>
              </label>
              <input 
                type="text" 
                inputMode="decimal"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                placeholder="0.00" 
                className={cn(
                  "w-full h-11 px-4 bg-surface-container-low border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all",
                  errors.costPrice ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                )}
              />
              {errors.costPrice && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.costPrice}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                {t('inventory.productForm.taxRate')} <span className="text-error">*</span>
              </label>
              <select 
                name="taxRate"
                value={formData.taxRate}
                onChange={handleChange}
                className="w-full h-11 px-4 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
              >
                <option value="0">{t('inventory.productForm.gstExempt')}</option>
                <option value="5">{t('inventory.productForm.gst5')}</option>
                <option value="12">{t('inventory.productForm.gst12')}</option>
                <option value="18">{t('inventory.productForm.gst18')}</option>
                <option value="28">{t('inventory.productForm.gst28')}</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 mt-2">
            <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2"><Package className="w-4 h-4 text-primary" /> {t('inventory.productForm.stockManagement')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  {t('inventory.productForm.initialStock')} <span className="text-error">*</span>
                </label>
                <input 
                  type="text" 
                  inputMode="numeric"
                  name="currentStock"
                  value={formData.currentStock}
                  onChange={handleChange}
                  placeholder="0" 
                  className={cn(
                    "w-full h-11 px-4 bg-surface border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all",
                    errors.currentStock ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                  )}
                />
                {errors.currentStock && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.currentStock}</p>}
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  {t('inventory.productForm.lowStockAlert')} <span className="text-error">*</span>
                </label>
                <input 
                  type="text" 
                  inputMode="numeric"
                  name="minStockLevel"
                  value={formData.minStockLevel}
                  onChange={handleChange}
                  placeholder="10" 
                  className={cn(
                    "w-full h-11 px-4 bg-surface border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all",
                    errors.minStockLevel ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                  )}
                />
                {errors.minStockLevel && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.minStockLevel}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6">
          <div className="flex items-center gap-2 mb-6">
            <UploadCloud className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-on-surface">{t('inventory.productForm.productImage')}</h2>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".svg,.png,.jpg,.jpeg,.gif"
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
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
            <p className="text-sm font-bold text-on-surface text-center mb-1">
              {selectedFile ? selectedFile.name : t('inventory.productForm.clickToUpload')}
            </p>
            <p className="text-xs text-on-surface-variant text-center">
              {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : t('inventory.productForm.max5mb')}
            </p>
          </div>

          {/* Image Preview */}
          {(existingImage || selectedFile) && (
            <div className="mt-6 relative group rounded-2xl overflow-hidden border border-outline-variant/20 bg-surface-container" style={{ maxWidth: 200, height: 200 }}>
              <img 
                src={selectedFile ? URL.createObjectURL(selectedFile) : existingImage} 
                alt="Preview" 
                className="w-full h-full object-cover" 
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setExistingImage(''); }}
                className="absolute top-2 right-2 bg-error/90 text-on-error p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-on-surface mb-6">{t('inventory.productForm.status')}</h2>
          
          <div className="space-y-3">
            <label className={cn(
              "flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-colors",
              formData.isActive ? "border-primary/40 bg-primary/5" : "border-outline-variant/20 bg-surface hover:bg-surface-container-low"
            )}>
              <div className="flex h-5 items-center">
                <input 
                  type="radio" 
                  name="isActive" 
                  checked={formData.isActive === true}
                  onChange={() => setFormData(prev => ({ ...prev, isActive: true }))}
                  className="w-4 h-4 text-primary focus:ring-primary border-outline-variant/30" 
                />
              </div>
              <div>
                <span className="block text-sm font-bold text-on-surface">{t('inventory.productForm.published')}</span>
                <span className="block text-xs font-medium text-on-surface-variant mt-0.5">{t('inventory.productForm.productVisible')}</span>
              </div>
            </label>

            <label className={cn(
              "flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-colors",
              !formData.isActive ? "border-primary/40 bg-primary/5" : "border-outline-variant/20 bg-surface hover:bg-surface-container-low"
            )}>
              <div className="flex h-5 items-center">
                <input 
                  type="radio" 
                  name="isActive" 
                  checked={formData.isActive === false}
                  onChange={() => setFormData(prev => ({ ...prev, isActive: false }))}
                  className="w-4 h-4 text-primary focus:ring-primary border-outline-variant/30" 
                />
              </div>
              <div>
                <span className="block text-sm font-bold text-on-surface">{t('inventory.productForm.draft')}</span>
                <span className="block text-xs font-medium text-on-surface-variant mt-0.5">{t('inventory.productForm.saveAsDraft')}</span>
              </div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-4 pt-6 border-t border-outline-variant/20">
          <Button type="button" onClick={handleClear} variant="ghost" className="w-full sm:w-auto text-on-surface-variant hover:text-error flex items-center justify-center gap-2">
            <RefreshCcw className="w-4 h-4" />
            {t('inventory.productForm.clearForm')}
          </Button>
          <Button type="button" onClick={() => router.back()} variant="outline" className="w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-bold tracking-wide shadow-sm">
            {t('inventory.productForm.cancel')}
          </Button>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 rounded-xl disabled:opacity-50">
            <Save className="w-4 h-4 shrink-0" />
            <span className="font-bold tracking-wide truncate">{loading ? t('inventory.productForm.saving') : (editId ? t('inventory.productForm.updateProduct') : t('inventory.productForm.saveProduct'))}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
