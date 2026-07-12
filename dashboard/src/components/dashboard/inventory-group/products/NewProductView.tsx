'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Save, UploadCloud, Tag, FileText, Banknote, Package, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { productSchema } from '@/utils/validations';
import { productService } from '@/lib/services/product.services';
import { categoryService } from '@/lib/services/category.services';
import { brandService } from '@/lib/services/brand.services';
import toast from 'react-hot-toast';

interface NewProductViewProps {
  editId?: string;
}

export default function NewProductView({ editId }: NewProductViewProps) {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
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
    // Fetch categories and brands for dropdowns
    Promise.all([
      categoryService.getCategories(),
      brandService.getBrands(),
      editId ? productService.getProducts() : Promise.resolve(null)
    ]).then(([catRes, brandRes, prodRes]) => {
      if (catRes.success) setCategories(catRes.data);
      if (brandRes.success) setBrands(brandRes.data);
      
      if (prodRes && prodRes.success) {
        const prod = prodRes.data.find((p: any) => p._id === editId);
        if (prod) {
          setFormData({
            name: prod.name || '',
            description: prod.description || '',
            sku: prod.sku || prod.barcode || '',
            sellingPrice: prod.sellingPrice || '',
            costPrice: prod.purchasePrice || prod.costPrice || '',
            taxRate: prod.gstRate || prod.taxRate || '18',
            currentStock: prod.currentStock || prod.openingStock || '',
            minStockLevel: prod.minStock || prod.minStockLevel || '10',
            category: prod.categoryId?._id || prod.categoryId || prod.category || '',
            brand: prod.brandId?._id || prod.brandId || prod.brand || '',
            isActive: prod.isActive !== false
          });
        }
      }
      setInitialLoading(false);
    });
  }, [editId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: any = value;
    if (type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
    }
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
    
    // Quick validation
    let validationVal = parsedValue;
    if (['sellingPrice', 'costPrice', 'taxRate', 'currentStock', 'minStockLevel'].includes(name)) {
      validationVal = Number(value);
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      sellingPrice: Number(formData.sellingPrice) || 0,
      costPrice: Number(formData.costPrice) || 0,
      taxRate: Number(formData.taxRate) || 0,
      currentStock: Number(formData.currentStock) || 0,
      minStockLevel: Number(formData.minStockLevel) || 10,
    };

    const validationResult = productSchema.safeParse(submissionData);
    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      for (const err of validationResult.error.issues) {
        if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
      }
      setErrors(newErrors);
      return toast.error('Please correct the errors / कृपया त्रुटियों को ठीक करें');
    }

    setLoading(true);
    const toastId = toast.loading(editId ? 'Updating product...' : 'Saving product...');

    try {
      const res = editId
        ? await productService.updateProduct(editId, submissionData)
        : await productService.createProduct(submissionData);
        
      if (res.success || (res as any).status === 200) {
        toast.success(editId ? 'Product updated successfully!' : 'Product saved successfully! / उत्पाद सफलतापूर्वक सहेजा गया!', { id: toastId });
        router.push(editId ? `/products/${editId}` : '/products');
      } else {
        toast.error((res as any).error || 'Failed to save product', { id: toastId });
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
              {editId ? 'Edit Product / उत्पाद संपादित करें' : 'Add New Product / नया उत्पाद जोड़ें'}
            </h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">
              {editId ? 'Update product details' : 'Create a new item in your catalog'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          <Button type="button" onClick={() => router.back()} variant="outline" className="flex-1 sm:flex-none rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-bold tracking-wide shadow-sm">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1 sm:flex-none gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 rounded-xl disabled:opacity-50">
            <Save className="w-4 h-4 shrink-0" />
            <span className="font-bold tracking-wide truncate">{loading ? 'Saving...' : (editId ? 'Update Product' : 'Save Product')}</span>
          </Button>
        </div>
      </div>
      </div>

      {/* Form Content */}
      <div className="p-4 md:p-6 lg:p-8 flex-1 w-full flex flex-col gap-6">
        
        {/* Basic Information */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-on-surface">Basic Information</h2>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              <Tag className="w-3.5 h-3.5" /> Product Name / उत्पाद का नाम <span className="text-error">*</span>
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
              <FileText className="w-3.5 h-3.5" /> Description / विवरण
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

        {/* Organization */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-on-surface">Organization / संगठन</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                <Tag className="w-3.5 h-3.5" /> Category / श्रेणी
              </label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full h-11 px-4 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                <Tag className="w-3.5 h-3.5" /> Brand / ब्रांड
              </label>
              <select 
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full h-11 px-4 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select Brand</option>
                {brands.map(b => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            <Banknote className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-on-surface">Pricing & Inventory</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                Selling Price (₹) / बिक्री मूल्य <span className="text-error">*</span>
              </label>
              <input 
                type="number" 
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
                Cost Price (₹) / लागत मूल्य
              </label>
              <input 
                type="number" 
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                placeholder="0.00" 
                className="w-full h-11 px-4 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                SKU / Barcode <span className="text-error">*</span>
              </label>
              <input 
                type="text" 
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. SKU-12345" 
                className={cn(
                  "w-full h-11 px-4 bg-surface-container-low border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all font-mono",
                  errors.sku ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                )}
              />
              {errors.sku && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.sku}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                Tax Rate (%) / कर दर
              </label>
              <select 
                name="taxRate"
                value={formData.taxRate}
                onChange={handleChange}
                className="w-full h-11 px-4 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
              >
                <option value="0">0% (GST Exempt)</option>
                <option value="5">5% (GST)</option>
                <option value="12">12% (GST)</option>
                <option value="18">18% (GST)</option>
                <option value="28">28% (GST)</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 mt-2">
            <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2"><Package className="w-4 h-4 text-primary" /> Stock Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Initial Stock / प्रारंभिक स्टॉक
                </label>
                <input 
                  type="number" 
                  name="currentStock"
                  value={formData.currentStock}
                  onChange={handleChange}
                  placeholder="0" 
                  className="w-full h-11 px-4 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Low Stock Alert At / न्यूनतम स्टॉक
                </label>
                <input 
                  type="number" 
                  name="minStockLevel"
                  value={formData.minStockLevel}
                  onChange={handleChange}
                  placeholder="10" 
                  className="w-full h-11 px-4 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6">
          <div className="flex items-center gap-2 mb-6">
            <UploadCloud className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-on-surface">Product Image / छवि</h2>
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
            <p className="text-xs text-on-surface-variant text-center">SVG, PNG, JPG or GIF (max. 5MB)</p>
          </div>
        </div>

        {/* Status */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-on-surface mb-6">Status / स्थिति</h2>
          
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
                <span className="block text-sm font-bold text-on-surface">Published / प्रकाशित</span>
                <span className="block text-xs font-medium text-on-surface-variant mt-0.5">Product will be visible in POS and available for sale.</span>
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
                <span className="block text-sm font-bold text-on-surface">Draft / ड्राफ़्ट</span>
                <span className="block text-xs font-medium text-on-surface-variant mt-0.5">Save as draft. Hidden from POS and sales.</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
