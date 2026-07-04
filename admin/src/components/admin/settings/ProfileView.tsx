'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, Camera, Save, Shield, MapPin, Key, Clock, Server, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function ProfileView() {
  const [formData, setFormData] = useState({
    firstName: 'Kuldeep',
    lastName: 'Kumawat',
    email: 'kuldeep@smartshop.com',
    phone: '+91 98765 43210',
    designation: 'Super Admin',
    location: 'Mumbai, India'
  });

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1 flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            Super Admin Profile
          </h2>
          <p className="text-sm font-medium text-on-surface-variant">Manage your master account credentials and personal details.</p>
        </div>
        <Button className="w-full md:w-auto gradient-button text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-primary/20 hover:shadow-lg flex items-center justify-center gap-2 border-none">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Left Column: ID Card & Stats */}
        <div className="flex flex-col gap-6 xl:col-span-1">
          
          {/* Main ID Card */}
          <div className="bg-gradient-to-r from-[#006591] to-[#0ea5e9] dark:bg-gradient-to-br dark:from-[#0f172a] dark:to-[#1e293b] rounded-3xl p-6 shadow-xl relative overflow-hidden text-white border border-transparent dark:border-white/10 transition-colors duration-300">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 blur-3xl rounded-full"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="relative group cursor-pointer mb-5">
                <div className="w-32 h-32 rounded-full border-4 border-white/30 bg-white flex items-center justify-center text-4xl font-black shadow-2xl overflow-hidden relative">
                  <img 
                    src="https://api.dicebear.com/7.x/notionists/svg?seed=Kuldeep&backgroundColor=transparent" 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border-4 border-transparent backdrop-blur-sm">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-success border-2 border-white rounded-full shadow-lg"></div>
              </div>

              <h3 className="text-2xl font-black tracking-tight drop-shadow-md">{formData.firstName} {formData.lastName}</h3>
              <div className="px-3 py-1 bg-white/20 border border-white/30 rounded-full mt-2 flex items-center gap-2 backdrop-blur-md shadow-sm">
                <Key className="w-3 h-3 text-white" />
                <span className="text-xs font-bold text-white tracking-widest uppercase">{formData.designation}</span>
              </div>
              
              <div className="w-full h-px bg-white/20 my-6"></div>
              
              <div className="w-full flex flex-col gap-3">
                <div className="flex items-center justify-between text-white/90">
                  <span className="text-xs font-medium flex items-center gap-2"><MapPin className="w-4 h-4" /> Location</span>
                  <span className="text-xs font-bold text-white">{formData.location}</span>
                </div>
                <div className="flex items-center justify-between text-white/90">
                  <span className="text-xs font-medium flex items-center gap-2"><Clock className="w-4 h-4" /> Last Login</span>
                  <span className="text-xs font-bold text-white">Just now (Mumbai)</span>
                </div>
                <div className="flex items-center justify-between text-white/90">
                  <span className="text-xs font-medium flex items-center gap-2"><Shield className="w-4 h-4" /> Access Level</span>
                  <span className="text-xs font-black text-white bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/10 shadow-sm">Root / Unlimited</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-on-surface">Account Verified</h4>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">2FA is active and secured</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-on-surface">System Access</h4>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">Managing 52 active branches</p>
            </div>
          </div>

        </div>

        {/* Right Column: Edit Form */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 lg:p-8 shadow-sm h-full">
            <h3 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2 border-b border-outline-variant/20 pb-4">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">First Name</label>
                <Input 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="bg-surface-container-low w-full focus:bg-surface-container-lowest transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">Last Name</label>
                <Input 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="bg-surface-container-low w-full focus:bg-surface-container-lowest transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <Input 
                    value={formData.email}
                    disabled
                    className="pl-9 bg-surface-container opacity-70 cursor-not-allowed w-full"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <Input 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="pl-9 bg-surface-container-low w-full focus:bg-surface-container-lowest transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">Location / City</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <Input 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="pl-9 bg-surface-container-low w-full focus:bg-surface-container-lowest transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">Role / Authority Level</label>
                <div className="relative">
                  <Shield className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <Input 
                    value={formData.designation}
                    disabled
                    className="pl-9 bg-surface-container font-bold text-primary opacity-90 cursor-not-allowed w-full border-primary/20"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-outline-variant/20 bg-surface-container-low/50 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-on-surface">Need to change your password?</h4>
                <p className="text-xs text-on-surface-variant font-medium mt-1">Head over to the Security Settings tab to manage your credentials.</p>
              </div>
              <Button variant="outline" className="border-primary text-primary font-bold bg-background">
                Security Settings
              </Button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
