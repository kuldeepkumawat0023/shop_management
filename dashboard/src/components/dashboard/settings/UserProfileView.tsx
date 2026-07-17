'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { User, Save, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { updateUser } from '@/store/slices/authSlice';
import { userService } from '@/lib/services/user.services';
import toast from 'react-hot-toast';

export default function UserProfileView() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullname: '',
    phoneNumber: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        fullname: user.fullname || '',
        phoneNumber: user.phoneNumber || '',
      });
      setPreviewLogo(user.profilePhoto || null);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('fullname', form.fullname);
      formData.append('phoneNumber', form.phoneNumber);
      
      if (selectedFile) {
        formData.append('profilePhoto', selectedFile);
      }

      const res = await userService.updateProfile(user._id, formData);
      if (res.success) {
        toast.success('Profile updated successfully');
        dispatch(updateUser(res.data));
      } else {
        toast.error(res.message || 'Failed to update profile');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">{t('settings.userProfile.title')}</h2>
          <p className="text-sm font-medium text-on-surface-variant">{t('settings.userProfile.description')}</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={loading}
          className="w-full md:w-auto gradient-button text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-primary/20 hover:shadow-lg flex items-center justify-center gap-2 border-none"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Saving...' : t('settings.userProfile.saveChanges')}
        </Button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 lg:p-8 shadow-sm h-fit">
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-surface rounded-2xl border border-outline-variant/20 mb-8">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary overflow-hidden relative cursor-pointer group"
          >
            {previewLogo ? (
              <img src={previewLogo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10" />
            )}
            <div className="absolute inset-0 bg-black/50 hidden group-hover:flex flex-col items-center justify-center text-white transition-all">
              <Upload className="w-5 h-5" />
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <div className="flex flex-col text-center sm:text-left">
            <h4 className="font-bold text-on-surface text-lg">{user.fullname}</h4>
            <p className="text-sm text-on-surface-variant mt-1 mb-3 capitalize">{user.role.replace('_', ' ')}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
              className="w-fit sm:mx-0 rounded-lg font-bold text-xs"
            >
              {t('settings.userProfile.changePhoto')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input 
            label={t('settings.userProfile.fullName')} 
            name="fullname"
            value={form.fullname} 
            onChange={handleChange}
          />
          <Input 
            label={t('settings.userProfile.emailAddress')} 
            type="email" 
            value={user.email} 
            disabled 
          />
          <Input 
            label={t('settings.userProfile.phoneNumber')} 
            name="phoneNumber"
            value={form.phoneNumber} 
            onChange={handleChange}
          />
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-bold text-on-surface">{t('settings.userProfile.role')}</label>
            <input 
              type="text" 
              value={user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} 
              disabled
              className="flex w-full h-10 rounded-xl bg-surface-container-low border border-outline-variant/20 px-3 text-sm text-on-surface-variant font-medium cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
