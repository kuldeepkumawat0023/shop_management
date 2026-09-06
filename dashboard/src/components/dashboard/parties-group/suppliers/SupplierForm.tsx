'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowLeft, Save, Building2, MapPin, ReceiptText, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supplierSchema } from '@/utils/validations';
import toast from 'react-hot-toast';

import { supplierService } from '@/lib/services/supplier.services';
import { useTranslation } from 'react-i18next';

export default function SupplierForm({ editId }: { editId?: string }) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    gstNumber: '',
    status: 'Active' as 'Active' | 'Inactive',
    paymentTerms: '',
    notes: '',
    address: '' // Handled via addressData merging during submit
  });

  const [addressData, setAddressData] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!editId);
  const { t } = useTranslation();

  React.useEffect(() => {
    if (editId) {
      const fetchSupplier = async () => {
        try {
          setIsFetching(true);
          const res = await supplierService.getSuppliers();
          if (res.success && res.data) {
            const supplier = res.data.find((s: any) => s._id === editId);
            if (supplier) {
              setFormData({
                name: supplier.name || '',
                contactPerson: supplier.contactPerson || '',
                email: supplier.email || '',
                phone: supplier.mobile || '',
                gstNumber: supplier.gstNumber || '',
                status: supplier.isActive !== false ? 'Active' : 'Inactive',
                paymentTerms: supplier.paymentTerms || '',
                notes: supplier.notes || '',
                address: supplier.address || ''
              });
              
              if (supplier.address) {
                const parts = supplier.address.split(',').map((s: string) => s.trim());
                if (parts.length >= 5) {
                  setAddressData({
                    street: parts[0],
                    city: parts[1],
                    state: parts[2],
                    zip: parts[3],
                    country: parts[4],
                  });
                }
              }
            }
          }
        } catch (error) {
          toast.error(t('suppliers.supplierForm.fetchFailed'), { id: 'failed-to-fetch-supplier-detai' });
        } finally {
          setIsFetching(false);
        }
      };
      fetchSupplier();
    }
  }, [editId]);

  const validate = (name: string, value: string) => {
    let error = '';
    const result = supplierSchema.safeParse({ ...formData, [name]: value });
    if (!result.success) {
      const fieldError = result.error.issues.find(err => err.path[0] === name);
      if (fieldError) error = fieldError.message;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressData(prev => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      gstNumber: '',
      status: 'Active',
      paymentTerms: '',
      notes: '',
      address: ''
    });
    setAddressData({
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullAddress = `${addressData.street}, ${addressData.city}, ${addressData.state}, ${addressData.zip}, ${addressData.country}`.replace(/^[,\s]+|[,\s]+$/g, '');
    const dataToValidate = { ...formData, address: fullAddress };

    const validationResult = supplierSchema.safeParse(dataToValidate);
    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      for (const err of validationResult.error.issues) {
        if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
      }
      setErrors(newErrors);
      return toast.error('Please correct the errors / कृपया त्रुटियों को ठीक करें', { id: 'please-correct-the-errors-----' });
    }

    setLoading(true);
    const toastId = toast.loading('Saving supplier...');

    try {
      const apiData = {
        name: formData.name,
        contactPerson: formData.contactPerson,
        email: formData.email,
        mobile: formData.phone,
        gstNumber: formData.gstNumber,
        isActive: formData.status === 'Active',
        paymentTerms: formData.paymentTerms,
        notes: formData.notes,
        address: dataToValidate.address,
      };

      let res;
      if (editId) {
        res = await supplierService.updateSupplier(editId, apiData);
      } else {
        res = await supplierService.createSupplier(apiData);
      }

      if (res.success) {
        toast.success(editId ? 'Supplier updated successfully!' : 'Supplier created successfully!', { id: toastId });
        router.back();
      } else {
        toast.error(res.message || 'Failed to save supplier', { id: toastId });
      }
    } catch (error) {
      toast.error('Failed to save supplier', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Header Sticky */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-outline-variant/20 p-4 md:p-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button type="button" onClick={() => router.back()} variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface hover:text-primary hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">{editId ? t('suppliers.supplierForm.editSupplier') : t('suppliers.supplierForm.addNewSupplier')} / {editId ? 'आपूर्तिकर्ता संपादित करें' : 'नया आपूर्तिकर्ता जोड़ें'}</h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">{editId ? t("suppliers.supplierForm.updateSupplier") : t("suppliers.supplierForm.createProfile")}</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 w-full flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Company Info */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">{t('suppliers.supplierForm.companyContactInfo')}</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Input
                  label={t('suppliers.supplierForm.companyName')}
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Global Traders"
                  error={!!errors.name}
                />
                {errors.name && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.name}</p>}
              </div>
              <div>
                <Input
                  label={t('suppliers.supplierForm.contactPerson')}
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  placeholder="e.g. Sanjay Gupta"
                  error={!!errors.contactPerson}
                />
                {errors.contactPerson && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.contactPerson}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Input
                  label={t('suppliers.supplierForm.emailAddress')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="contact@company.in"
                  error={!!errors.email}
                />
                {errors.email && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.email}</p>}
              </div>
              <div>
                <Input
                  label={t('suppliers.supplierForm.phoneNumber')}
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  error={!!errors.phone}
                />
                {errors.phone && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.phone}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Input
                  label={t('suppliers.supplierForm.gstin')}
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  placeholder="22AAAAA0000A1Z5"
                  error={!!errors.gstNumber}
                />
                {errors.gstNumber && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.gstNumber}</p>}
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">{t('suppliers.supplierForm.status')}</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none"
                >
                  <option value="Active">{t('suppliers.supplierForm.active')}</option>
                  <option value="Inactive">{t('suppliers.supplierForm.inactive')}</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <ReceiptText className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">{t('suppliers.supplierForm.paymentNotes')}</h2>
            </div>
            
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-bold text-on-surface">{t('suppliers.supplierForm.paymentTerms')}</label>
              <select 
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleInputChange}
                className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none"
              >
                <option value="">Select terms...</option>
                <option value="COD">Cash on Delivery (COD)</option>
                <option value="Net 15">Net 15 Days</option>
                <option value="Net 30">Net 30 Days</option>
                <option value="Net 60">Net 60 Days</option>
                <option value="Advance">100% Advance</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-bold text-on-surface">{t('suppliers.supplierForm.internalNotes')}</label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-xl bg-surface border border-outline-variant/30 px-3 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none placeholder:text-on-surface-variant/50"
                placeholder="Any special instructions for this supplier..."
              />
            </div>
          </div>
        </div>

        {/* Right Column - Address */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">{t('suppliers.supplierForm.businessAddress')}</h2>
            </div>
            
            <div className="flex flex-col gap-5">
              <Input
                label={t('suppliers.supplierForm.streetAddress')}
                name="street"
                value={addressData.street}
                onChange={handleAddressChange}
                placeholder="123 Industrial Estate, Block B"
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label={t('suppliers.supplierForm.city')}
                  name="city"
                  value={addressData.city}
                  onChange={handleAddressChange}
                  placeholder="Jaipur / जयपुर"
                />
                <Input
                  label={t('suppliers.supplierForm.stateProvince')}
                  name="state"
                  value={addressData.state}
                  onChange={handleAddressChange}
                  placeholder="Rajasthan / राजस्थान"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label={t('suppliers.supplierForm.zip')}
                  name="zip"
                  value={addressData.zip}
                  onChange={handleAddressChange}
                  placeholder="411001"
                />
                <Input
                  label={t('suppliers.supplierForm.country')}
                  name="country"
                  value={addressData.country}
                  onChange={handleAddressChange}
                  placeholder="India / भारत"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-4 pt-6 border-t border-outline-variant/20">
          <Button type="button" onClick={handleClear} variant="ghost" className="w-full sm:w-auto text-on-surface-variant hover:text-error flex items-center justify-center gap-2">
            <RefreshCcw className="w-4 h-4" />
            {t('suppliers.supplierForm.clearForm')}
          </Button>
          <Button type="button" onClick={() => router.back()} variant="outline" className="w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-bold tracking-wide shadow-sm">
            {t('suppliers.supplierForm.cancel')}
          </Button>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 rounded-xl disabled:opacity-50">
            <Save className="w-4 h-4" />
            <span className="font-bold tracking-wide">{loading ? t('suppliers.supplierForm.saving') : t('suppliers.supplierForm.saveSupplier')}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
