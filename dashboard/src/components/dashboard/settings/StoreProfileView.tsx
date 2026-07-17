'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Globe,
  MapPin,
  Upload,
  CheckCircle2,
  Loader2,
  Building,
  Pencil,
  X,
  Plus,
  Layers,
  Sparkles,
  Trash2,
  Phone,
  Mail,
  FileText,
  Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { shopService, ShopData } from '@/lib/services/shop.services';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { updateUser } from '@/store/slices/authSlice';
import { DeleteModal } from '@/components/common/DeleteModal';
import ShopCreationModal from '../layout/ShopCreationModal';

// Utility for classnames
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

export default function StoreProfileView() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  
  // State variables for workspaces
  const [shops, setShops] = useState<ShopData[]>([]);
  const [selectedShop, setSelectedShop] = useState<ShopData | null>(null);

  // State variables for form inputs
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [gstNumber, setGstNumber] = useState<string>('');
  const [logoUrl, setLogoUrl] = useState<string>('');

  // Backup state to restore on Cancel
  const [originalData, setOriginalData] = useState<ShopData | null>(null);

  // UI states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSwitchingWorkspace, setIsSwitchingWorkspace] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchShops();
  }, []);

  // Fetch all shops and set initial active shop
  const fetchShops = async (selectShopId?: string) => {
    try {
      setIsLoading(true);
      const response = await shopService.getMyShops();
      if (response.success && response.data) {
        setShops(response.data);
        if (response.data.length > 0) {
          // Select: 1. Specified id, 2. Active shop in Redux, 3. First shop
          let target = response.data[0];
          if (selectShopId) {
            target = response.data.find(s => s._id === selectShopId) || response.data[0];
          } else if (user?.shopId) {
            target = response.data.find(s => s._id === user.shopId) || response.data[0];
          }

          setSelectedShop(target);
          populateForm(target);
          setIsEditing(false);
        } else {
          setSelectedShop(null);
          clearForm();
          setIsEditing(false);
        }
      }
    } catch (err: any) {
      console.error('Error loading shop profile:', err);
      toast.error('Failed to load shop details');
    } finally {
      setIsLoading(false);
    }
  };

  const populateForm = (shop: ShopData) => {
    setName(shop.name || '');
    setEmail(shop.email || '');
    setContactNumber(shop.contactNumber || '');
    setAddress(shop.address || '');
    setGstNumber(shop.gstNumber || '');
    setLogoUrl(shop.logo || '');
    setOriginalData(shop);
  };

  const clearForm = () => {
    setName('');
    setEmail('');
    setContactNumber('');
    setAddress('');
    setGstNumber('');
    setLogoUrl('');
    setOriginalData(null);
  };

  const handleSelectShop = (shop: ShopData) => {
    setSelectedShop(shop);
    populateForm(shop);
    setIsEditing(false);
  };

  const handleSwitchWorkspace = async (shopId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (user?.shopId === shopId || isSwitchingWorkspace) return;

    try {
      setIsSwitchingWorkspace(shopId);
      const response = await shopService.switchShop(shopId);
      if (response.success) {
        toast.success(`Switched active workspace successfully`);
        dispatch(updateUser({ shopId }));
        // Re-fetch to highlight active context correctly
        await fetchShops(shopId);
      } else {
        toast.error('Failed to switch workspace');
      }
    } catch (err: any) {
      console.error('Error switching workspace:', err);
      toast.error(err.response?.data?.message || 'Error switching workspace context');
    } finally {
      setIsSwitchingWorkspace(null);
    }
  };

  const handleCancelEdit = () => {
    if (originalData) {
      populateForm(originalData);
    }
    setIsEditing(false);
    toast.success('Changes discarded');
  };

  const handleDeleteShop = async () => {
    if (!selectedShop?._id) return;

    try {
      setIsUpdating(true);
      const response = await shopService.deleteShop(selectedShop._id);
      if (response.success) {
        toast.success('Workspace deactivated successfully');
        await fetchShops(); // Reload the list
        setIsDeleteModalOpen(false);
      } else {
        toast.error(response.message || 'Failed to deactivate workspace');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error deactivating workspace');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShop?._id) return;

    try {
      setIsUpdating(true);
      const payload = { 
        name, 
        email, 
        contactNumber, 
        address, 
        gstNumber 
      };
      
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await shopService.updateShop(selectedShop._id, formData);
      if (response.success && response.data) {
        toast.success('Shop settings updated successfully!');
        await fetchShops(response.data._id);
      } else {
        toast.error(response.message || 'Failed to save changes');
      }
    } catch (err: any) {
      console.error('Error saving shop profile:', err);
      toast.error(err.response?.data?.message || 'Error occurred while saving profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedShop?._id) return;

    try {
      setIsUploadingLogo(true);
      const formData = new FormData();
      formData.append('logo', file);

      const response = await shopService.updateShop(selectedShop._id, formData);
      if (response.success && response.data) {
        const updated = response.data;
        setLogoUrl(updated.logo || '');
        toast.success('Shop logo uploaded successfully!');
        await fetchShops(updated._id);
      } else {
        toast.error('Failed to upload logo');
      }
    } catch (err: any) {
      console.error('Logo upload error:', err);
      toast.error(err.response?.data?.message || 'Failed to update logo');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleAddNewWorkspaceClick = () => {
    setIsCreateModalOpen(true);
  };

  if (isLoading && shops.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest animate-pulse">Loading Workspace Management...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 p-4 md:p-6 lg:p-8 animate-in fade-in duration-700 h-full overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight mb-2">Workspace Settings</h1>
          <p className="text-on-surface-variant font-medium">
            Manage your store workspaces, switch contexts, or add new shops under your account.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Workspaces Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest shadow-sm rounded-3xl p-6 border border-outline-variant/20 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <span className="text-[10px] font-black text-on-surface uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Layers size={14} className="text-primary" /> Owned Workspaces ({shops.length})
              </span>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {shops.map((shop, idx) => {
                  const isActiveWorkspace = user?.shopId === shop._id;
                  const isSelected = selectedShop?._id === shop._id;
                  
                  return (
                    <motion.div
                      key={shop._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleSelectShop(shop)}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group",
                        isSelected
                          ? "bg-primary/5 border-primary shadow-sm"
                          : "border-outline-variant/30 bg-surface hover:bg-surface-container-low hover:shadow-md hover:-translate-y-0.5"
                      )}
                    >
                      <div className="flex items-center gap-3 truncate">
                        {shop.logo ? (
                          <img src={shop.logo} alt={shop.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center font-black text-lg text-white shrink-0">
                            {shop.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="truncate">
                          <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                            {shop.name}
                          </h4>
                          <p className="text-[10px] text-on-surface-variant font-medium truncate">
                            {shop.address || 'Address Not Specified'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isActiveWorkspace ? (
                          <span className="text-[8px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 size={10} /> Active
                          </span>
                        ) : (
                          <button
                            onClick={(e) => handleSwitchWorkspace(shop._id!, e)}
                            disabled={isSwitchingWorkspace !== null}
                            className="text-[8px] font-black uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-md hover:bg-primary hover:text-white transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
                          >
                            {isSwitchingWorkspace === shop._id ? (
                              <Loader2 size={8} className="animate-spin" />
                            ) : (
                              'Switch'
                            )}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: shops.length * 0.05 }}
                onClick={handleAddNewWorkspaceClick}
                className={cn(
                  "w-full flex items-center justify-center gap-2 p-4 border border-dashed rounded-2xl transition-all cursor-pointer text-xs font-black uppercase tracking-widest hover:scale-[1.02]",
                  "border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary hover:bg-primary/5"
                )}
              >
                <Plus size={14} /> Add New Workspace
              </motion.button>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info Form */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {!selectedShop ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface-container-lowest shadow-sm rounded-3xl p-12 border border-outline-variant/20 flex flex-col items-center justify-center text-center h-[500px]"
              >
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.15)]">
                  <Store className="w-10 h-10 animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-on-surface mb-3">No Workspace Selected</h3>
                <p className="text-on-surface-variant max-w-sm mb-8 font-medium">
                  Select a workspace from the list on the left to view its details, or create a new workspace to get started.
                </p>
                <button
                  onClick={handleAddNewWorkspaceClick}
                  className="px-6 py-3 gradient-button text-white rounded-xl text-sm font-black uppercase tracking-widest hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 cursor-pointer flex items-center gap-2 border-none"
                >
                  <Plus size={16} /> Create Workspace
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="space-y-6"
              >
                {/* Editor Header Card */}
                <div className="bg-surface-container-lowest shadow-sm rounded-3xl p-8 border border-outline-variant/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="relative inline-block group">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleLogoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <div
                        onClick={() => isEditing && fileInputRef.current?.click()}
                        className={cn(
                          "w-20 h-20 rounded-2xl bg-surface-container-high flex items-center justify-center border-2 border-dashed transition-all overflow-hidden relative",
                          !isEditing
                            ? 'border-outline-variant/30 cursor-not-allowed opacity-80'
                            : 'border-outline-variant hover:border-primary cursor-pointer'
                        )}
                      >
                        {isUploadingLogo ? (
                          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white gap-2">
                            <Loader2 size={16} className="animate-spin text-primary" />
                          </div>
                        ) : logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={`${name || 'Store'} Logo`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center font-black text-2xl text-white">
                            {name ? name.charAt(0).toUpperCase() : <Building size={24} />}
                          </div>
                        )}

                        {isEditing && !isUploadingLogo && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1">
                            <Upload size={14} />
                            <span className="text-[7px] font-black uppercase tracking-widest">Update Logo</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-on-surface mb-1">
                        {name || 'Store Profile'}
                      </h3>
                      <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest italic">
                        {address || 'Location Not Specified'}
                      </p>
                      {selectedShop?.gstNumber && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 rounded-lg">
                          <FileText className="w-3 h-3 text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                            GSTIN: {selectedShop.gstNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
                    <button
                      type="button"
                      onClick={() => setIsDeleteModalOpen(true)}
                      disabled={isUpdating}
                      className="px-5 py-2.5 bg-error/10 text-error hover:bg-error hover:text-white text-[10px] font-black uppercase tracking-widest border-none rounded-xl transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                      title="Deactivate Workspace"
                      aria-label="Deactivate Workspace"
                    >
                      <Trash2 size={12} /> Deactivate
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSaveShop}>
                  <div className="bg-surface-container-lowest shadow-sm rounded-3xl p-8 border border-outline-variant/20 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {/* Store Name */}
                      <div className="space-y-2">
                        <label className={cn("text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1")}>Store Name *</label>
                        <div className="relative">
                          <Building2 className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant/70" size={18} aria-hidden="true" />
                          <input
                            className={cn(
                              "w-full bg-transparent border-b pl-7 py-3 font-medium transition-all focus:outline-none",
                              isEditing
                                ? 'border-outline-variant focus:border-primary focus:ring-0 text-on-surface'
                                : 'border-transparent text-on-surface-variant cursor-not-allowed'
                            )}
                            placeholder="e.g. My Super Store"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={50} type="text"
                            disabled={!isEditing}
                            required
                          />
                        </div>
                      </div>

                      {/* GST Number */}
                      <div className="space-y-2">
                        <label className={cn("text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1")}>GSTIN / Tax Number</label>
                        <div className="relative">
                          <FileText className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant/70" size={18} aria-hidden="true" />
                          <input
                            className={cn(
                              "w-full bg-transparent border-b pl-7 py-3 font-medium transition-all focus:outline-none uppercase",
                              isEditing
                                ? 'border-outline-variant focus:border-primary focus:ring-0 text-on-surface'
                                : 'border-transparent text-on-surface-variant cursor-not-allowed'
                            )}
                            placeholder="e.g. 07AAAAA0000A1Z5"
                            value={gstNumber}
                            onChange={(e) => setGstNumber(e.target.value)}
                            maxLength={15} type="text"
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label className={cn("text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1")}>Contact Email</label>
                        <div className="relative">
                          <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant/70" size={18} aria-hidden="true" />
                          <input
                            className={cn(
                              "w-full bg-transparent border-b pl-7 py-3 font-medium transition-all focus:outline-none",
                              isEditing
                                ? 'border-outline-variant focus:border-primary focus:ring-0 text-on-surface'
                                : 'border-transparent text-on-surface-variant cursor-not-allowed'
                            )}
                            placeholder="contact@store.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-2">
                        <label className={cn("text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1")}>Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant/70" size={18} aria-hidden="true" />
                          <input
                            className={cn(
                              "w-full bg-transparent border-b pl-7 py-3 font-medium transition-all focus:outline-none",
                              isEditing
                                ? 'border-outline-variant focus:border-primary focus:ring-0 text-on-surface'
                                : 'border-transparent text-on-surface-variant cursor-not-allowed'
                            )}
                            placeholder="+91 99999 00000"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            type="tel"
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                      <label className={cn("text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1")}>Store Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-0 top-3 text-on-surface-variant/70" size={18} aria-hidden="true" />
                        <textarea
                          className={cn(
                            "w-full bg-transparent border rounded-2xl pl-8 p-4 font-medium transition-all resize-none min-h-[100px] focus:outline-none",
                            isEditing
                              ? 'border-outline-variant/30 focus:border-primary focus:ring-0 text-on-surface'
                              : 'border-transparent bg-surface-container/30 text-on-surface-variant cursor-not-allowed'
                          )}
                          placeholder="Complete physical address of the store..."
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    {/* Action Buttons Panel */}
                    <div className="flex justify-end pt-4 gap-4">
                      <AnimatePresence mode="wait">
                        {!isEditing ? (
                          <button
                            key="edit-btn"
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-3.5 bg-primary hover:bg-primary/95 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-md shadow-primary/10 flex items-center gap-2 cursor-pointer"
                          >
                            <Pencil size={12} /> Edit Workspace Profile
                          </button>
                        ) : (
                          <div key="edit-actions" className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              disabled={isUpdating}
                              className="px-6 py-3.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                            >
                              <X size={12} /> Cancel
                            </button>

                            <button
                              type="submit"
                              disabled={isUpdating}
                              className="gradient-button text-white font-black text-[10px] uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                            >
                              {isUpdating ? (
                                <>
                                  <Loader2 size={12} className="animate-spin" /> Saving...
                                </>
                              ) : (
                                'Save Changes'
                              )}
                            </button>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </form>

                {/* Company Tips */}
                {selectedShop && (
                  <div className="bg-surface-container-lowest shadow-sm rounded-3xl p-8 border border-primary/20 mt-6">
                    <div className="flex flex-col gap-4">
                      <h3 className="text-sm font-black text-on-surface uppercase tracking-widest flex items-center gap-2">
                        <Sparkles size={16} className="text-primary" /> Profile Tips
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Store Logo</p>
                          <p className="text-xs text-on-surface-variant leading-relaxed">Upload a high-quality logo for bills and receipts branding.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/10">
                          <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1">Tax & Billing</p>
                          <p className="text-xs text-on-surface-variant leading-relaxed">Ensure your GSTIN is accurate here, it reflects on all customer invoices.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Address Details</p>
                          <p className="text-xs text-on-surface-variant leading-relaxed">Keeping your physical address updated helps local suppliers reach you.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteShop}
        itemName={selectedShop?.name || 'Workspace'}
        warningMessage="Are you sure you want to deactivate this workspace? Staff members will lose access immediately."
      />

      <ShopCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchShops()}
      />
    </div>
  );
}
