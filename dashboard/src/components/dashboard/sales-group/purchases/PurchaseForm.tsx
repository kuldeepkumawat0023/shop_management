'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Save, Plus, Trash2, ShoppingCart, Truck, CreditCard, RefreshCcw, UserPlus, X, Check, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { purchaseSchema } from '@/utils/validations';
import toast from 'react-hot-toast';
import { purchaseService } from '@/lib/services/purchase.services';
import { supplierService, SupplierData } from '@/lib/services/supplier.services';
import { productService } from '@/lib/services/product.services';
import { useTranslation } from 'react-i18next';

export default function PurchaseForm() {
  const router = useRouter();
  const { t } = useTranslation();

  const generateDefaultPONumber = () => {
    const today = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `PO-${today}-${rand}`;
  };

  const [formData, setFormData] = useState({
    supplier: '',
    poNumber: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDelivery: '',
    shippingFee: '',
    paymentTerms: 'Net 30',
    discount: '',
    taxAmount: '',
    paidAmount: '',
    paymentMethod: 'Cash',
    notes: ''
  });

  const [items, setItems] = useState<Array<{
    id: number;
    productId: string;
    product: string;
    quantity: string | number;
    unitPrice: string | number;
    tax: string | number;
  }>>([
    { id: 1, productId: '', product: '', quantity: '1', unitPrice: '0', tax: '18' }
  ]);

  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Quick Add Supplier Modal State
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: '', mobile: '', contactPerson: '', gstNumber: '' });
  const [addingSupplier, setAddingSupplier] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Initialize PO Number and fetch Suppliers & Products
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      poNumber: prev.poNumber || generateDefaultPONumber()
    }));

    const loadData = async () => {
      try {
        const [supRes, prodRes] = await Promise.all([
          supplierService.getSuppliers(),
          productService.getProducts()
        ]);
        if (supRes.success && Array.isArray(supRes.data)) {
          setSuppliers(supRes.data);
        }
        if (prodRes.success && Array.isArray(prodRes.data)) {
          setProducts(prodRes.data);
        }
      } catch (err) {
        console.error('Failed to load suppliers/products', err);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  const addItem = () => {
    setItems(prev => [
      ...prev,
      { id: Date.now(), productId: '', product: '', quantity: '1', unitPrice: '0', tax: '18' }
    ]);
  };

  const removeItem = (id: number) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleProductSelect = (id: number, productId: string) => {
    const selectedProd = products.find(p => p._id === productId);
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const purchaseRate = selectedProd?.purchasePrice ?? selectedProd?.costPrice ?? 0;
          const taxRate = selectedProd?.gstRate ?? 18;
          return {
            ...item,
            productId,
            product: selectedProd ? selectedProd.name : '',
            unitPrice: purchaseRate.toString(),
            tax: taxRate.toString()
          };
        }
        return item;
      })
    );

    const index = items.findIndex(item => item.id === id);
    const errorKey = `items.${index}.product`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleItemChange = (id: number, field: string, value: string) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
    const index = items.findIndex(item => item.id === id);
    const errorKey = `items.${index}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleClear = () => {
    setFormData({
      supplier: '',
      poNumber: generateDefaultPONumber(),
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: '',
      shippingFee: '',
      paymentTerms: 'Net 30',
      discount: '',
      taxAmount: '',
      paidAmount: '',
      paymentMethod: 'Cash',
      notes: ''
    });
    setItems([
      { id: Date.now(), productId: '', product: '', quantity: '1', unitPrice: '0', tax: '18' }
    ]);
    setErrors({});
  };

  // Quick create supplier
  const handleQuickAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplier.name.trim() || !newSupplier.mobile.trim()) {
      toast.error('Supplier Name and Mobile are required');
      return;
    }

    setAddingSupplier(true);
    try {
      const res = await supplierService.createSupplier({
        name: newSupplier.name.trim(),
        mobile: newSupplier.mobile.trim(),
        contactPerson: newSupplier.contactPerson?.trim() || undefined,
        gstNumber: newSupplier.gstNumber?.trim() || undefined
      });

      if (res.success && res.data) {
        toast.success(`Supplier ${res.data.name} added successfully!`);
        setSuppliers(prev => [res.data, ...prev]);
        setFormData(prev => ({ ...prev, supplier: res.data._id || '' }));
        setShowAddSupplierModal(false);
        setNewSupplier({ name: '', mobile: '', contactPerson: '', gstNumber: '' });
        if (errors.supplier) {
          setErrors(prev => {
            const next = { ...prev };
            delete next.supplier;
            return next;
          });
        }
      } else {
        toast.error((res as any).message || 'Failed to create supplier');
      }
    } catch (err: any) {
      toast.error('Failed to create supplier. Mobile might already exist.');
    } finally {
      setAddingSupplier(false);
    }
  };

  // Calculations
  const subtotal = items.reduce(
    (acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );
  const totalTax = items.reduce((acc, item) => {
    const itemTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
    const taxRate = Number(item.tax) || 0;
    return acc + (itemTotal * taxRate) / 100;
  }, 0);
  const grandTotal =
    subtotal + totalTax + (Number(formData.shippingFee) || 0) - (Number(formData.discount) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      poNumber: formData.poNumber.trim() || generateDefaultPONumber(),
      shippingFee: Number(formData.shippingFee) || 0,
      discount: Number(formData.discount) || 0,
      paidAmount: Number(formData.paidAmount) || 0,
      taxAmount: totalTax,
      items: items.map(item => ({
        productId: item.productId,
        product: item.product,
        quantity: Number(item.quantity) || 0,
        unitPrice: Number(item.unitPrice) || 0,
        tax: Number(item.tax) || 0
      }))
    };

    const validationResult = purchaseSchema.safeParse(submissionData);
    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      for (const err of validationResult.error.issues) {
        if (err.path.length > 0) {
          const pathStr = err.path.join('.');
          newErrors[pathStr] = err.message;
        }
      }
      setErrors(newErrors);
      return toast.error(t('purchases.purchaseForm.pleaseCorrectErrors'), {
        id: 'purchase-form-validation-error'
      });
    }

    // Ensure all items have a valid productId
    const invalidItem = items.find(i => !i.productId);
    if (invalidItem) {
      setErrors(prev => ({
        ...prev,
        items: 'Please select a valid product for every item row'
      }));
      return toast.error('Please select a valid product for all rows');
    }

    setSubmitting(true);
    const toastId = toast.loading(t('purchases.purchaseForm.savingOrder'));

    try {
      const payload = {
        supplierId: submissionData.supplier,
        invoiceNumber: submissionData.poNumber,
        purchaseDate: submissionData.orderDate || new Date().toISOString(),
        totalAmount: subtotal,
        discountAmount: submissionData.discount,
        taxAmount: submissionData.taxAmount,
        netAmount: grandTotal,
        paidAmount: submissionData.paidAmount,
        paymentMethod: submissionData.paymentMethod || 'Cash',
        notes: submissionData.notes,
        items: items.map(item => ({
          productId: item.productId,
          quantity: Number(item.quantity) || 1,
          purchasePrice: Number(item.unitPrice) || 0,
          gstRate: Number(item.tax) || 0
        }))
      };

      const response = await purchaseService.createPurchase(payload);
      if (response.success) {
        toast.success(t('purchases.purchaseForm.orderSavedSuccess'), { id: toastId });
        router.push('/purchases');
      } else {
        toast.error(response.message || t('purchases.purchaseForm.failedToSaveOrder'), {
          id: toastId
        });
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || t('purchases.purchaseForm.failedToSaveOrder'),
        { id: toastId }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Header Sticky */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-outline-variant/20 p-4 md:p-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
              className="w-10 h-10 p-0 rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-black text-on-surface tracking-tight">
                {t('purchases.purchaseForm.createPurchaseOrder')}
              </h2>
              <p className="text-sm font-medium text-on-surface-variant">
                {t('purchases.purchaseForm.logNewBill')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={handleClear}
              variant="ghost"
              className="text-on-surface-variant hover:text-error text-xs gap-1"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              {t('purchases.purchaseForm.clearForm', 'Clear')}
            </Button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 md:p-6 lg:p-8 w-full">
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-8">

          {/* Top Section: 2 Columns for Order Info and Supplier Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Card 1: Purchase Order Info */}
            <div className="flex flex-col gap-5 p-5 bg-surface-container-low/40 rounded-2xl border border-outline-variant/15">
              <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/10">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-on-surface">
                  {t('purchases.purchaseForm.orderInfo', 'Purchase Order Info')}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">
                    {t('purchases.purchaseForm.poNumber')} <span className="text-error ml-1">*</span>
                  </label>
                  <input
                    name="poNumber"
                    value={formData.poNumber}
                    onChange={handleInputChange}
                    placeholder="PO-YYYYMMDD-XXXX"
                    className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all font-mono"
                  />
                  {errors.poNumber && (
                    <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">
                      {errors.poNumber}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">
                    {t('purchases.purchaseForm.orderDate')}
                  </label>
                  <input
                    type="date"
                    name="orderDate"
                    value={formData.orderDate}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">
                  {t('purchases.purchaseForm.expectedDelivery', 'Expected Delivery Date')}
                </label>
                <input
                  type="date"
                  name="expectedDelivery"
                  value={formData.expectedDelivery}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Card 2: Supplier Info */}
            <div className="flex flex-col gap-5 p-5 bg-surface-container-low/40 rounded-2xl border border-outline-variant/15">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/10">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-on-surface">
                    {t('purchases.purchaseForm.supplierInfo')}
                  </h3>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddSupplierModal(true)}
                  className="text-xs font-bold text-primary border-primary/30 hover:bg-primary/5 gap-1.5 rounded-lg"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  {t('purchases.purchaseForm.newSupplier', '+ Custom Supplier')}
                </Button>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">
                  {t('purchases.purchaseForm.supplierName')} <span className="text-error ml-1">*</span>
                </label>
                <select
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  className={cn(
                    'w-full h-10 px-3 bg-surface border rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 transition-all appearance-none',
                    errors.supplier
                      ? 'border-error focus:border-error focus:ring-error/20'
                      : 'border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20'
                  )}
                >
                  <option value="">
                    {loadingData
                      ? 'Loading suppliers...'
                      : t('purchases.purchaseForm.selectSupplier', '-- Select Registered Supplier --')}
                  </option>
                  {suppliers.map(sup => (
                    <option key={sup._id} value={sup._id}>
                      {sup.name} {sup.mobile ? `(${sup.mobile})` : ''} {sup.balance ? `• Due: ₹${sup.balance}` : ''}
                    </option>
                  ))}
                </select>
                {errors.supplier && (
                  <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">
                    {errors.supplier}
                  </p>
                )}
              </div>

              {/* Selected Supplier Live Preview Box */}
              {(() => {
                const selectedSup = suppliers.find(s => s._id === formData.supplier);
                if (!selectedSup) return null;
                return (
                  <div className="p-3 bg-surface rounded-xl border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-on-surface">{selectedSup.name}</span>
                      <span className="text-on-surface-variant">
                        {selectedSup.contactPerson ? `Contact: ${selectedSup.contactPerson} • ` : ''}
                        {selectedSup.mobile || 'No Phone'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-surface-container px-2.5 py-1.5 rounded-lg">
                      <span className="text-on-surface-variant font-medium">Pending Due:</span>
                      <span className="font-black text-warning">₹{(selectedSup.balance || 0).toLocaleString()}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Card 3: Terms & Payment Settings */}
          <div className="flex flex-col gap-5 p-5 bg-surface-container-low/40 rounded-2xl border border-outline-variant/15">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/10">
              <CreditCard className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-on-surface">
                {t('purchases.purchaseForm.termsShipping')}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">
                  {t('purchases.purchaseForm.paymentMethod', 'Payment Method')}
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI / GPay / PhonePe</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                  <option value="Credit">Credit (Pay Later)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">
                  {t('purchases.purchaseForm.amountPaidNow', 'Paid Amount')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="paidAmount"
                    value={formData.paidAmount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full h-10 px-3 pr-16 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData(prev => ({
                        ...prev,
                        paidAmount: grandTotal > 0 ? grandTotal.toFixed(2) : '0'
                      }))
                    }
                    className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    Full
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">
                  {t('purchases.purchaseForm.shippingCost')}
                </label>
                <input
                  type="number"
                  name="shippingFee"
                  value={formData.shippingFee}
                  onChange={handleInputChange}
                  placeholder="₹0.00"
                  className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">
                  {t('purchases.purchaseForm.discountAmount')}
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  placeholder="₹0.00"
                  className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Items / Products Table */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant/10">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-on-surface">
                  {t('purchases.purchaseForm.orderItems')}
                </h3>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={addItem}
                className="h-8 px-3 text-xs font-bold gap-1.5 border-primary/30 text-primary hover:bg-primary/5 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" />
                {t('purchases.purchaseForm.addItem')}
              </Button>
            </div>

            {errors.items && (
              <p className="text-xs text-error font-bold mb-3 p-2 bg-error/10 rounded-xl border border-error/20">
                {errors.items}
              </p>
            )}

            <div className="flex flex-col gap-4">
              {items.map((item, index) => {
                const itemTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
                const taxVal = (itemTotal * (Number(item.tax) || 0)) / 100;
                const lineTotal = itemTotal + taxVal;

                const productErr = errors[`items.${index}.product`];
                const qtyErr = errors[`items.${index}.quantity`];
                const priceErr = errors[`items.${index}.unitPrice`];

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 bg-surface-container/30 p-4 rounded-2xl border border-outline-variant/10"
                  >
                    <div className="flex flex-col md:flex-row gap-3 items-end">
                      {/* Product Selector */}
                      <div className="w-full md:flex-1 flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-on-surface">
                          {t('purchases.purchaseForm.productRawMaterial')}{' '}
                          <span className="text-error">*</span>
                        </label>
                        <select
                          value={item.productId}
                          onChange={e => handleProductSelect(item.id, e.target.value)}
                          className={cn(
                            'w-full h-10 px-3 bg-surface border rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 transition-all appearance-none',
                            productErr
                              ? 'border-error focus:border-error focus:ring-error/20'
                              : 'border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20'
                          )}
                        >
                          <option value="">-- Select Product / Raw Material --</option>
                          {products.map(p => (
                            <option key={p._id} value={p._id}>
                              {p.name} {p.sku ? `[${p.sku}]` : ''} • Stock: {p.currentStock ?? 0} {p.unit || ''}
                            </option>
                          ))}
                        </select>
                        {productErr && (
                          <p className="text-[10px] text-error font-bold px-1">{productErr}</p>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="w-full md:w-24 flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-on-surface">
                          {t('purchases.purchaseForm.qty')} <span className="text-error">*</span>
                        </label>
                        <input
                          type="number"
                          min="0.01"
                          step="any"
                          value={item.quantity}
                          onChange={e => handleItemChange(item.id, 'quantity', e.target.value)}
                          placeholder="1"
                          className={cn(
                            'w-full h-10 px-3 bg-surface border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all',
                            qtyErr
                              ? 'border-error focus:border-error focus:ring-error/20'
                              : 'border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20'
                          )}
                        />
                        {qtyErr && (
                          <p className="text-[10px] text-error font-bold px-1">{qtyErr}</p>
                        )}
                      </div>

                      {/* Purchase Rate */}
                      <div className="w-full md:w-32 flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-on-surface">
                          {t('purchases.purchaseForm.rate')} (₹) <span className="text-error">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.unitPrice}
                          onChange={e => handleItemChange(item.id, 'unitPrice', e.target.value)}
                          placeholder="0.00"
                          className={cn(
                            'w-full h-10 px-3 bg-surface border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all',
                            priceErr
                              ? 'border-error focus:border-error focus:ring-error/20'
                              : 'border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20'
                          )}
                        />
                        {priceErr && (
                          <p className="text-[10px] text-error font-bold px-1">{priceErr}</p>
                        )}
                      </div>

                      {/* GST % */}
                      <div className="w-full md:w-24 flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-on-surface">GST %</label>
                        <input
                          type="number"
                          value={item.tax}
                          onChange={e => handleItemChange(item.id, 'tax', e.target.value)}
                          placeholder="18"
                          className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      {/* Total */}
                      <div className="w-full md:w-32 flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-on-surface">Total (₹)</label>
                        <input
                          type="text"
                          value={lineTotal.toFixed(2)}
                          disabled
                          className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/10 rounded-xl text-sm font-bold text-on-surface opacity-80 cursor-not-allowed text-right font-mono"
                        />
                      </div>

                      {/* Delete row */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        className="w-full md:w-10 h-10 p-0 border-error/30 text-error hover:bg-error/10 shrink-0 rounded-xl disabled:opacity-40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes & Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-bold text-on-surface">
                {t('purchases.purchaseForm.notes', 'Purchase Notes / Remarks')}
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                placeholder="Add any specific supplier terms or notes..."
                className="w-full rounded-2xl bg-surface border border-outline-variant/30 px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none"
              />
            </div>

            {/* Billing Summary */}
            <div className="w-full bg-surface/50 border border-outline-variant/20 rounded-2xl p-6 flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">
                  {t('purchases.purchaseForm.subtotal')}
                </span>
                <span className="font-bold text-on-surface font-mono">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">
                  {t('purchases.purchaseForm.shipping')}
                </span>
                <span className="font-bold text-on-surface font-mono">
                  ₹{(Number(formData.shippingFee) || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">
                  {t('purchases.purchaseForm.taxAmount')}
                </span>
                <span className="font-bold text-on-surface font-mono">₹{totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-success">
                <span className="font-medium">{t('purchases.purchaseForm.discount')}</span>
                <span className="font-bold font-mono">
                  -₹{(Number(formData.discount) || 0).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-outline-variant/20 pt-3 flex justify-between items-center">
                <span className="font-bold text-on-surface text-lg">
                  {t('purchases.purchaseForm.grandTotal')}
                </span>
                <span className="font-black text-primary text-2xl font-mono">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
              {Number(formData.paidAmount) > 0 && (
                <div className="flex justify-between items-center text-sm pt-2 text-primary border-t border-dashed border-outline-variant/20">
                  <span className="font-semibold">Paid Now:</span>
                  <span className="font-bold font-mono">
                    ₹{(Number(formData.paidAmount) || 0).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-outline-variant/20">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
              className="w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-bold tracking-wide"
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 rounded-xl disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span className="font-bold tracking-wide">
                {submitting
                  ? t('purchases.purchaseForm.saving', 'Saving...')
                  : t('purchases.purchaseForm.saveOrder')}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Add Supplier Modal */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-5">
            <div className="flex justify-between items-center pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-on-surface">{t('purchases.purchaseForm.addCustomSupplier', 'Add Custom Supplier')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSupplierModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">
                  {t('purchases.purchaseForm.supplierName')} <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={newSupplier.name}
                  onChange={e => setNewSupplier(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Kisan Agro Agency"
                  className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:border-primary/50 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">
                  {t('suppliers.supplierForm.phoneNumber', 'Mobile Number')} <span className="text-error">*</span>
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={newSupplier.mobile}
                  onChange={e => setNewSupplier(p => ({ ...p, mobile: e.target.value.replace(/\D/g, '') }))}
                  placeholder="10 digit mobile"
                  className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:border-primary/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface">{t('suppliers.supplierForm.contactPerson', 'Contact Person (Optional)')}</label>
                  <input
                    type="text"
                    value={newSupplier.contactPerson}
                    onChange={e => setNewSupplier(p => ({ ...p, contactPerson: e.target.value }))}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:border-primary/50 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface">{t('suppliers.supplierForm.gstin', 'GSTIN (Optional)')}</label>
                  <input
                    type="text"
                    maxLength={15}
                    value={newSupplier.gstNumber}
                    onChange={e => setNewSupplier(p => ({ ...p, gstNumber: e.target.value.toUpperCase() }))}
                    placeholder="22AAAAA0000A1Z5"
                    className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface uppercase focus:outline-none focus:ring-2 focus:border-primary/50 transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/20">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddSupplierModal(false)}
                className="rounded-xl border-outline-variant/30"
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                type="button"
                disabled={addingSupplier}
                onClick={handleQuickAddSupplier}
                className="gradient-button text-white border-none shadow-md gap-2 rounded-xl"
              >
                <Check className="w-4 h-4" />
                {addingSupplier ? t('common.saving', 'Adding...') : t('purchases.purchaseForm.saveAndSelect', 'Save & Select')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
