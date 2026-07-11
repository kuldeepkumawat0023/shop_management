'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowLeft, Save, Building2, MapPin, ReceiptText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supplierSchema } from '@/utils/validations';
import toast from 'react-hot-toast';

export default function SupplierForm() {
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
      return toast.error('Please correct the errors / कृपया त्रुटियों को ठीक करें');
    }

    setLoading(true);
    const toastId = toast.loading('Saving supplier...');

    try {
      // API call simulation
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Supplier saved successfully! / आपूर्तिकर्ता सफलतापूर्वक सहेजा गया!', { id: toastId });
      router.back();
    } catch (error) {
      toast.error('Failed to save supplier', { id: toastId });
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
            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">Add New Supplier</h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">Onboard a new vendor or B2B partner</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button type="button" onClick={() => router.back()} variant="outline" className="flex-1 sm:flex-none w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-bold tracking-wide shadow-sm">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1 sm:flex-none gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 rounded-xl disabled:opacity-50">
            <Save className="w-4 h-4" />
            <span className="font-bold tracking-wide">{loading ? 'Saving...' : 'Save Supplier'}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Company Info */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">Company & Contact Info</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Input
                  label="Company Name / कंपनी का नाम"
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
                  label="Contact Person / संपर्क व्यक्ति"
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
                  label="Email Address / ईमेल पता"
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
                  label="Phone Number / फ़ोन नंबर"
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
                  label="GSTIN / Tax ID"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  placeholder="22AAAAA0000A1Z5"
                  error={!!errors.gstNumber}
                />
                {errors.gstNumber && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.gstNumber}</p>}
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <ReceiptText className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">Payment & Notes</h2>
            </div>
            
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-bold text-on-surface">Payment Terms</label>
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
              <label className="text-sm font-bold text-on-surface">Internal Notes</label>
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
              <h2 className="text-lg font-bold text-on-surface">Business Address</h2>
            </div>
            
            <div className="flex flex-col gap-5">
              <Input
                label="Street Address"
                name="street"
                value={addressData.street}
                onChange={handleAddressChange}
                placeholder="123 Industrial Estate, Block B"
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="City"
                  name="city"
                  value={addressData.city}
                  onChange={handleAddressChange}
                  placeholder="Pune"
                />
                <Input
                  label="State/Province"
                  name="state"
                  value={addressData.state}
                  onChange={handleAddressChange}
                  placeholder="Maharashtra"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="ZIP / Postal Code"
                  name="zip"
                  value={addressData.zip}
                  onChange={handleAddressChange}
                  placeholder="411001"
                />
                <Input
                  label="Country"
                  name="country"
                  value={addressData.country}
                  onChange={handleAddressChange}
                  placeholder="India"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
