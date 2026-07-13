'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Save, Plus, Trash2, ShoppingCart, Truck, CreditCard, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { purchaseSchema } from '@/utils/validations';
import toast from 'react-hot-toast';
import { purchaseService } from '@/lib/services/purchase.services';

export default function PurchaseForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    supplier: '',
    poNumber: '',
    orderDate: '',
    expectedDelivery: '',
    shippingFee: '',
    paymentTerms: '',
    discount: '',
    taxAmount: '', // overall tax amount can be derived or input
    notes: ''
  });

  const [items, setItems] = useState([
    { id: 1, product: '', quantity: '', unitPrice: '', tax: '' }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const addItem = () => {
    setItems([...items, { id: Date.now(), product: '', quantity: '', unitPrice: '', tax: '' }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleItemChange = (id: number, field: string, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
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
      poNumber: '',
      orderDate: '',
      expectedDelivery: '',
      shippingFee: '',
      paymentTerms: '',
      discount: '',
      taxAmount: '',
      notes: ''
    });
    setItems([
      { id: Date.now(), product: '', quantity: '', unitPrice: '', tax: '' }
    ]);
    setErrors({});
  };

  const subtotal = items.reduce((acc, item) => acc + ((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)), 0);
  const totalTax = items.reduce((acc, item) => {
    const itemTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
    const taxRate = Number(item.tax) || 0;
    return acc + (itemTotal * taxRate / 100);
  }, 0);
  const grandTotal = subtotal + totalTax + (Number(formData.shippingFee) || 0) - (Number(formData.discount) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      shippingFee: Number(formData.shippingFee) || 0,
      discount: Number(formData.discount) || 0,
      taxAmount: totalTax,
      items: items.map(item => ({
        product: item.product,
        quantity: Number(item.quantity) || 0,
        unitPrice: Number(item.unitPrice) || 0
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
      return toast.error('Please correct the errors / कृपया त्रुटियों को ठीक करें', { id: 'please-correct-the-errors-----' });
    }

    setSubmitting(true);
    const toastId = toast.loading('Saving purchase order... / खरीद आदेश सहेजा जा रहा है...');

    try {
      const payload = {
        supplierId: submissionData.supplier, // Assume supplier ID is selected for now
        invoiceNumber: submissionData.poNumber,
        purchaseDate: submissionData.orderDate || new Date().toISOString(),
        totalAmount: subtotal,
        discountAmount: submissionData.discount,
        taxAmount: submissionData.taxAmount,
        netAmount: grandTotal,
        notes: submissionData.notes,
        items: submissionData.items
      };

      const response = await purchaseService.createPurchase(payload);
      if (response.success) {
        toast.success('Order saved successfully! / आदेश सफलतापूर्वक सहेजा गया!', { id: toastId });
        router.back();
      } else {
        toast.error(response.message || 'Failed to save order / आदेश सहेजने में विफल', { id: toastId });
      }
    } catch (err: any) {
      toast.error('Failed to save order / आदेश सहेजने में विफल', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full ">
      <div className="sticky top-16 md:top-20 z-20 bg-background border-b border-outline-variant/20 p-4 md:p-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button type="button" onClick={() => router.back()} variant="outline" className="w-10 h-10 p-0 rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-black text-on-surface tracking-tight">Create Purchase Order / खरीद आदेश बनाएँ</h2>
              <p className="text-sm font-medium text-on-surface-variant">Log a new bill or order from a supplier / आपूर्तिकर्ता से नया बिल या आदेश दर्ज करें</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 md:p-6 lg:p-8 flex-1 w-full">
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-8">

          {/* General Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-outline-variant/10">
                <Truck className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-on-surface">Supplier Info / आपूर्तिकर्ता जानकारी</h3>
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Supplier Name / आपूर्तिकर्ता का नाम <span className="text-error ml-1">*</span></label>
                <input
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  placeholder="Search or select supplier... / आपूर्तिकर्ता खोजें या चुनें..."
                  className={cn(
                    "w-full h-10 px-3 bg-surface border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all",
                    errors.supplier ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                  )}
                />
                {errors.supplier && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.supplier}</p>}
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">PO Number / पीओ नंबर</label>
                  <input
                    name="poNumber"
                    value={formData.poNumber}
                    onChange={handleInputChange}
                    placeholder="PO-2023-006"
                    className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Order Date / आदेश की तारीख</label>
                  <input
                    type="date"
                    name="orderDate"
                    value={formData.orderDate}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-outline-variant/10">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-on-surface">Terms & Shipping / शर्तें और शिपिंग</h3>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Expected Delivery / संभावित डिलीवरी</label>
                  <input
                    type="date"
                    name="expectedDelivery"
                    value={formData.expectedDelivery}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Shipping Cost / शिपिंग लागत</label>
                  <input
                    type="number"
                    name="shippingFee"
                    value={formData.shippingFee}
                    onChange={handleInputChange}
                    placeholder="₹0.00"
                    className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Payment Terms / भुगतान की शर्तें</label>
                  <input
                    name="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={handleInputChange}
                    placeholder="e.g. Net 30"
                    className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Discount Amount / छूट राशि</label>
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
          </div>

          {/* Items / Products */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant/10">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-on-surface">Order Items / आदेश आइटम</h3>
              </div>
              <Button type="button" variant="outline" onClick={addItem} className="h-8 px-3 text-xs font-bold gap-1.5 border-primary/30 text-primary hover:bg-primary/5">
                <Plus className="w-3.5 h-3.5" />
                Add Item / आइटम जोड़ें
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              {errors.items && <p className="text-[10px] text-error font-bold">{errors.items}</p>}
              {items.map((item, index) => {
                const itemTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
                const productErr = errors[`items.${index}.product`];
                const qtyErr = errors[`items.${index}.quantity`];
                const priceErr = errors[`items.${index}.unitPrice`];

                return (
                  <div key={item.id} className="flex flex-col gap-3 bg-surface-container/30 p-4 rounded-xl border border-outline-variant/10">
                    <div className="flex flex-col md:flex-row gap-3 items-end">
                      <div className="w-full md:flex-1 flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-on-surface">Product / Raw Material / उत्पाद / कच्चा माल <span className="text-error">*</span></label>
                        <input
                          value={item.product}
                          onChange={(e) => handleItemChange(item.id, 'product', e.target.value)}
                          placeholder="Select product... / उत्पाद चुनें..."
                          className={cn(
                            "w-full h-10 px-3 bg-surface border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all",
                            productErr ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                          )}
                        />
                        {productErr && <p className="text-[10px] text-error font-bold px-1">{productErr}</p>}
                      </div>

                      <div className="w-full md:w-24 flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-on-surface">Qty / मात्रा <span className="text-error">*</span></label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                          placeholder="0"
                          className={cn(
                            "w-full h-10 px-3 bg-surface border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all",
                            qtyErr ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                          )}
                        />
                        {qtyErr && <p className="text-[10px] text-error font-bold px-1">{qtyErr}</p>}
                      </div>

                      <div className="w-full md:w-32 flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-on-surface">Rate (₹) / दर (₹) <span className="text-error">*</span></label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                          placeholder="0.00"
                          className={cn(
                            "w-full h-10 px-3 bg-surface border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all",
                            priceErr ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                          )}
                        />
                        {priceErr && <p className="text-[10px] text-error font-bold px-1">{priceErr}</p>}
                      </div>

                      <div className="w-full md:w-24 flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-on-surface">Tax (%) / कर (%)</label>
                        <input
                          type="number"
                          value={item.tax}
                          onChange={(e) => handleItemChange(item.id, 'tax', e.target.value)}
                          placeholder="18"
                          className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      <div className="w-full md:w-32 flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-on-surface">Total (₹) / कुल (₹)</label>
                        <input
                          type="number"
                          value={itemTotal.toFixed(2)}
                          disabled
                          className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant/10 rounded-xl text-sm font-bold text-on-surface opacity-70 cursor-not-allowed"
                        />
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        className="w-full md:w-12 h-10 border-error/30 text-error hover:bg-error/10 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Billing Summary */}
          <div className="flex flex-col md:flex-row justify-end mt-4">
            <div className="w-full md:w-80 bg-surface/50 border border-outline-variant/20 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-3 text-sm">
                <span className="text-on-surface-variant">Subtotal / उप-कुल</span>
                <span className="font-bold text-on-surface">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-3 text-sm">
                <span className="text-on-surface-variant">Shipping / शिपिंग</span>
                <span className="font-bold text-on-surface">₹{(Number(formData.shippingFee) || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-3 text-sm">
                <span className="text-on-surface-variant">Tax Amount / कर राशि</span>
                <span className="font-bold text-on-surface">₹{totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-4 text-sm text-success">
                <span className="font-medium">Discount / छूट</span>
                <span className="font-bold">-₹{(Number(formData.discount) || 0).toFixed(2)}</span>
              </div>
              <div className="border-t border-outline-variant/20 pt-4 flex justify-between items-center">
                <span className="font-bold text-on-surface text-lg">Grand Total / कुल योग</span>
                <span className="font-black text-primary text-2xl">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-4 pt-6 border-t border-outline-variant/20">
        <Button type="button" onClick={handleClear} variant="ghost" className="w-full sm:w-auto text-on-surface-variant hover:text-error flex items-center justify-center gap-2">
          <RefreshCcw className="w-4 h-4" />
          Clear Form / फ़ॉर्म साफ़ करें
        </Button>
        <Button type="button" onClick={() => router.back()} variant="outline" className="w-full sm:w-auto font-bold border-outline-variant/30 text-on-surface-variant">
          Cancel / रद्द करें
        </Button>
        <Button type="submit" disabled={submitting} className="w-full sm:w-auto gradient-button text-white font-bold shadow-md hover:shadow-lg gap-2 disabled:opacity-50">
          <Save className="w-4 h-4 shrink-0" />
          <span className="truncate">{submitting ? 'Saving... / सहेजा जा रहा है...' : 'Save Order / आदेश सहेजें'}</span>
        </Button>
      </div>

    </form>
  );
}
