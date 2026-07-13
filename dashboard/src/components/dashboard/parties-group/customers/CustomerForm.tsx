'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowLeft, Save, User, MapPin, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { customerSchema } from '@/utils/validations';
import toast from 'react-hot-toast';

export default function CustomerForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'Active' as 'Active' | 'Inactive',
    address: '' // We map the individual fields to the schema's 'address' if we want, but schema just has one address string.
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
    const result = customerSchema.safeParse({ ...formData, [name]: value });
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
      email: '',
      phone: '',
      company: '',
      status: 'Active',
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

    // Compile address before validation if necessary, or just validate main fields
    const fullAddress = `${addressData.street}, ${addressData.city}, ${addressData.state}, ${addressData.zip}, ${addressData.country}`.replace(/^[,\s]+|[,\s]+$/g, '');
    const dataToValidate = { ...formData, address: fullAddress };

    const validationResult = customerSchema.safeParse(dataToValidate);
    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      for (const err of validationResult.error.issues) {
        if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
      }
      setErrors(newErrors);
      return toast.error('Please correct the errors / कृपया त्रुटियों को ठीक करें');
    }

    setLoading(true);
    const toastId = toast.loading('Saving customer...');

    try {
      // API call simulation
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Customer saved successfully! / ग्राहक सफलतापूर्वक सहेजा गया!', { id: toastId });
      router.back();
    } catch (error) {
      toast.error('Failed to save customer', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full ">
      {/* Header Sticky */}
      <div className="sticky top-16 md:top-20 z-20 bg-background border-b border-outline-variant/20 p-4 md:p-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button type="button" onClick={() => router.back()} variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface hover:text-primary hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">Add New Customer / नया ग्राहक जोड़ें</h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">Create a profile for a new client or customer / नए क्लाइंट या ग्राहक के लिए प्रोफ़ाइल बनाएं</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 flex-1 w-full flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Personal Info */}
          <div className="flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
              <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
                <User className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-on-surface">Personal Information / व्यक्तिगत जानकारी</h2>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div>
                  <Input
                    label="Full Name / पूरा नाम"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rajesh Kumar"
                    error={!!errors.name}
                  />
                  {errors.name && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.name}</p>}
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
                    placeholder="rajesh@example.com"
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
                <Input
                  label="Company (Optional) / कंपनी (वैकल्पिक)"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company Name / कंपनी का नाम"
                />
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Status / स्थिति</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none"
                  >
                    <option value="Active">Active / सक्रिय</option>
                    <option value="Inactive">Inactive / निष्क्रिय</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Address */}
          <div className="flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
              <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-on-surface">Address Details / पता विवरण</h2>
              </div>

              <div className="flex flex-col gap-5">
                <Input
                  label="Street Address / गली का पता"
                  name="street"
                  value={addressData.street}
                  onChange={handleAddressChange}
                  placeholder="123 Main St, Apartment 4B"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="City / शहर"
                    name="city"
                    value={addressData.city}
                    onChange={handleAddressChange}
                    placeholder="Jaipur / जयपुर"
                  />
                  <Input
                    label="State/Province / राज्य/प्रांत"
                    name="state"
                    value={addressData.state}
                    onChange={handleAddressChange}
                    placeholder="Rajasthan / राजस्थान"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="ZIP / Postal Code / पिन कोड"
                    name="zip"
                    value={addressData.zip}
                    onChange={handleAddressChange}
                    placeholder="400001"
                  />
                  <Input
                    label="Country / देश"
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
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-4 pt-6 border-t border-outline-variant/20">
        <Button type="button" onClick={handleClear} variant="ghost" className="w-full sm:w-auto text-on-surface-variant hover:text-error flex items-center justify-center gap-2">
          <RefreshCcw className="w-4 h-4" />
          Clear Form / फ़ॉर्म साफ़ करें
        </Button>
        <Button type="button" onClick={() => router.back()} variant="outline" className="w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-bold tracking-wide shadow-sm">
          Cancel / रद्द करें
        </Button>
        <Button type="submit" disabled={loading} className="w-full sm:w-auto gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 rounded-xl disabled:opacity-50">
          <Save className="w-4 h-4" />
          <span className="font-bold tracking-wide">{loading ? 'Saving... / सहेजा जा रहा है...' : 'Save Customer / ग्राहक सहेजें'}</span>
        </Button>
      </div>
    </form>
  );
}
