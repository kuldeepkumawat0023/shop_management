'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { Store, X, Loader2, ArrowRight, LogOut, MailOpen } from 'lucide-react';
import { shopService } from '@/lib/services/shop.services';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { createPortal } from 'react-dom';
import { shopCreationSchema } from '@/utils/validations';

interface ShopCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isForced?: boolean;
  onSuccess?: () => void;
}

export default function ShopCreationModal({ isOpen, onClose, isForced = false, onSuccess }: ShopCreationModalProps) {
  const { user, token, login, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    gstNumber: '',
    address: '',
  });
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const validate = (name: string, value: string) => {
    let err = '';
    const result = shopCreationSchema.safeParse({ ...formData, [name]: value });
    if (!result.success) {
      const fieldError = result.error.issues.find(e => e.path[0] === name);
      if (fieldError) err = fieldError.message;
    }
    setFieldErrors(prev => ({ ...prev, [name]: err }));
    return err === '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validate(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationResult = shopCreationSchema.safeParse(formData);
    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      for (const err of validationResult.error.issues) {
        if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
      }
      setFieldErrors(newErrors);
      toast.error('Please correct the errors in the form', { id: 'please-correct-the-errors-in-t' });
      return;
    }

    if (!user?._id) {
      toast.error('User session expired. Please login again.', { id: 'user-session-expired--please-l' });
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Sending verification code...');

    try {
      const response = await shopService.initCreateShop({
        ...formData,
        ownerId: user._id,
      });

      if (response.success) {
        toast.success('Verification code sent!', { id: toastId });
        setStep(2);
      } else {
        toast.error(response.message || 'Failed to initialize shop', { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'An error occurred', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      const nextInput = document.getElementById(`shop-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`shop-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      setError('');
      
      const focusIndex = Math.min(pastedData.length, 5);
      const nextInput = document.getElementById(`shop-otp-${focusIndex}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    if (!user?._id) return;

    setLoading(true);
    const toastId = toast.loading('Verifying and creating shop...');

    try {
      const response = await shopService.createShop({
        ...formData,
        ownerId: user._id,
        otp: otpCode,
      });

      if (response.success) {
        toast.success('Shop created successfully!', { id: toastId });
        
        // Update user's assignedShops locally to reflect the new shop
        if (user) {
          const updatedUser = {
            ...user,
            assignedShops: [...(user.assignedShops || []), response.data._id!],
            shopId: response.data._id!,
            role: user.role === 'staff' || user.role === 'manager' ? 'shop_owner' : user.role,
          };
          login(updatedUser, token || '');
        }

        if (onSuccess) onSuccess();
        if (!isForced) onClose();
      } else {
        toast.error(response.message || 'Failed to create shop', { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'An error occurred', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity",
          !isForced && "cursor-pointer"
        )}
        onClick={() => !isForced && onClose()}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-surface-container-high rounded-3xl shadow-2xl border border-outline-variant/20 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              {step === 1 ? <Store size={20} /> : <MailOpen size={20} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface">{step === 1 ? 'Create Shop' : 'Verify Email'}</h2>
              <p className="text-xs text-on-surface-variant font-medium">
                {step === 1 ? 'Set up a new shop to manage your business.' : 'Enter the code sent to your email.'}
              </p>
            </div>
          </div>
          
          {!isForced && (
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {step === 1 ? (
            <form id="create-shop-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5 block">Shop Name / दुकान का नाम <span className="text-error">*</span></label>
                <input
                  type="text"
                  name="name"
                  required
                  maxLength={100}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Shop Name / दुकान का नाम"
                  className={`w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all ${fieldErrors.name ? '!border-error !ring-error/10' : ''}`}
                />
                {fieldErrors.name && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{fieldErrors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5 block">Email / ईमेल <span className="text-error">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="shop@example.com / ईमेल"
                    className={`w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all ${fieldErrors.email ? '!border-error !ring-error/10' : ''}`}
                  />
                  {fieldErrors.email && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{fieldErrors.email}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5 block">Contact Number / संपर्क नंबर <span className="text-error">*</span></label>
                  <input
                    type="tel"
                    name="contactNumber"
                    maxLength={10}
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="+91 9876543210 / फोन नंबर"
                    className={`w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all ${fieldErrors.contactNumber ? '!border-error !ring-error/10' : ''}`}
                  />
                  {fieldErrors.contactNumber && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{fieldErrors.contactNumber}</p>}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5 block">GST / Tax Number / जीएसटी नंबर</label>
                <input
                  type="text"
                  name="gstNumber"
                  maxLength={15}
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="GSTIN... (Optional) / जीएसटी (वैकल्पिक)"
                  className={`w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all ${fieldErrors.gstNumber ? '!border-error !ring-error/10' : ''}`}
                />
                {fieldErrors.gstNumber && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{fieldErrors.gstNumber}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5 block">Address / पता <span className="text-error">*</span></label>
                <textarea
                  name="address"
                  rows={3}
                  maxLength={500}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full address of the shop... / दुकान का पूरा पता..."
                  className={`w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all resize-none ${fieldErrors.address ? '!border-error !ring-error/10' : ''}`}
                />
                {fieldErrors.address && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{fieldErrors.address}</p>}
              </div>
            </form>
          ) : (
            <form id="verify-shop-form" onSubmit={handleVerifyOtp} className="space-y-6 py-4">
              <div className="flex justify-center flex-col items-center">
                <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`shop-otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className={`w-12 h-14 sm:w-14 sm:h-16 text-2xl sm:text-3xl font-black text-center bg-surface-container border-2 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none ${error ? 'border-error bg-error/5 focus:border-error' : 'border-outline-variant/30'}`}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleKeyDown(i, e)}
                    />
                  ))}
                </div>
                {error && <p className="text-[12px] text-error mt-4 font-bold tracking-tight">{error}</p>}
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-outline-variant/10 bg-surface-container-low flex justify-end gap-3 shrink-0 items-center">
          {isForced && (
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 rounded-xl font-bold text-sm text-error/80 hover:bg-error/10 hover:text-error transition-colors flex items-center gap-2 mr-auto"
            >
              <LogOut size={16} />
              Logout
            </button>
          )}
          
          {!isForced && step === 1 && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            >
              Cancel
            </button>
          )}
          {step === 2 && (
            <button
              type="button"
              onClick={() => { setStep(1); setOtp(['','','','','','']); setError(''); }}
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            >
              Back
            </button>
          )}
          
          <button
            type="submit"
            form={step === 1 ? "create-shop-form" : "verify-shop-form"}
            disabled={loading || (step === 1 ? !formData.name.trim() : otp.join('').length !== 6)}
            className="px-6 py-2.5 rounded-xl font-bold text-sm text-white gradient-button shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : (step === 1 ? 'Continue' : 'Verify & Create')}
            {!loading && <ArrowRight size={16} />}
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
