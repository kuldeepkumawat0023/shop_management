'use client';

import React from 'react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/common/Button';
import { User, Shield, ShieldCheck, Mail, Phone, Clock, ArrowLeft, Edit, Trash2, Key, History, Activity, Store, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TeamDetailViewProps {
  memberId: string;
}

// Mock data fetcher
const getMemberData = (id: string) => {
  const members = [
    { 
      id: 'usr_01', name: 'Kuldeep Kumawat', email: 'kuldeep@smartshop.com', phone: '+91 98765 43210', role: 'Super Admin', status: 'Active', lastLogin: 'Oct 24, 2026, 10:30 AM', joinDate: 'Jan 15, 2026',
      assignedShops: [
        { id: 'SHP-001', name: 'SmartMart Superstore', location: 'Mumbai, MH', assignedDate: 'Jan 15, 2026' },
        { id: 'SHP-002', name: 'Tech Hub Electronics', location: 'Delhi, DL', assignedDate: 'Feb 01, 2026' },
        { id: 'SHP-003', name: 'City Grocers', location: 'Pune, MH', assignedDate: 'Mar 10, 2026' },
        { id: 'SHP-004', name: 'Fashion Fiesta', location: 'Bangalore, KA', assignedDate: 'Apr 05, 2026' },
        { id: 'SHP-005', name: 'Daily Needs Mart', location: 'Ahmedabad, GJ', assignedDate: 'May 20, 2026' }
      ]
    },
    { 
      id: 'usr_02', name: 'Amit Singh', email: 'amit@smartshop.com', phone: '+91 91234 56789', role: 'Support Agent', status: 'Active', lastLogin: 'Oct 24, 2026, 09:15 AM', joinDate: 'Feb 10, 2026',
      assignedShops: [
        { id: 'SHP-001', name: 'SmartMart Superstore', location: 'Mumbai, MH', assignedDate: 'Mar 01, 2026' }
      ]
    },
    { 
      id: 'usr_03', name: 'Ravi Tech Support', email: 'support1@smartshop.com', phone: '+91 99887 76655', role: 'Support Agent', status: 'Active', lastLogin: 'Oct 23, 2026, 04:45 PM', joinDate: 'Mar 05, 2026',
      assignedShops: [
        { id: 'SHP-042', name: 'Tech Hub Electronics', location: 'Delhi, DL', assignedDate: 'Apr 12, 2026' },
        { id: 'SHP-018', name: 'City Grocers', location: 'Pune, MH', assignedDate: 'May 05, 2026' }
      ]
    },
    { 
      id: 'usr_04', name: 'Priya CS', email: 'priya@smartshop.com', phone: '+91 98712 34567', role: 'Support Agent', status: 'Suspended', lastLogin: 'Oct 10, 2026, 11:20 AM', joinDate: 'Apr 20, 2026',
      assignedShops: []
    },
  ];
  return members.find(m => m.id === id) || members[0];
};

export default function TeamDetailView({ memberId }: TeamDetailViewProps) {
  const router = useRouter();
  const member = getMemberData(memberId);

  if (!member) return null;

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto custom-scrollbar w-full">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-outline-variant/20 px-4 md:px-6 py-4 flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-on-surface tracking-tight">Member Profile</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            className="text-on-surface-variant hover:text-secondary hover:bg-secondary/10"
          >
            <Edit className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Edit Details</span>
          </Button>
          {member.role !== 'Super Admin' && (
            <Button 
              variant="ghost" 
              className="text-on-surface-variant hover:bg-error/10 hover:text-error"
            >
              <Trash2 className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Revoke Access</span>
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Profile Header */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl gradient-button text-white flex items-center justify-center font-black shrink-0 shadow-lg shadow-primary/20 text-4xl md:text-5xl uppercase">
            {member.name.charAt(0)}
          </div>
          <div className="flex-1 space-y-4 w-full">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <StatusBadge status={member.status} variant={(member.status === 'Active' ? 'success' : 'error') as any} />
                <span className="text-xs font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  {member.id}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant flex items-center gap-1 border border-outline-variant/20">
                  {member.role === 'Super Admin' ? <ShieldCheck className="w-3 h-3 text-secondary" /> : <User className="w-3 h-3" />}
                  {member.role}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">{member.name}</h1>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-3xl">
              Joined the team on <span className="font-bold text-on-surface">{member.joinDate}</span>.
            </p>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Logins</span>
            </div>
            <div>
              <p className="text-2xl font-black text-on-surface">142</p>
              <p className="text-xs font-medium text-success mt-1">+12 this week</p>
            </div>
          </div>
          
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Last Active</span>
            </div>
            <div>
              <p className="text-lg font-bold text-on-surface truncate">{member.lastLogin.split(',')[0]}</p>
              <p className="text-xs font-medium text-on-surface-variant mt-1">{member.lastLogin.split(',')[1]}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
                <History className="w-4 h-4" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Actions</span>
            </div>
            <div>
              <p className="text-2xl font-black text-on-surface">854</p>
              <p className="text-xs font-medium text-on-surface-variant mt-1">Total performed</p>
            </div>
          </div>
          
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-error/10 text-error flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Security</span>
            </div>
            <div>
              <p className="text-lg font-bold text-on-surface">Enabled</p>
              <p className="text-xs font-medium text-success mt-1">2FA Configured</p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Contact Information */}
          <div className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm h-fit">
            <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Contact Information
            </h2>
            <div className="space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-1">Email Address</p>
                <a href={`mailto:${member.email}`} className="text-sm font-bold text-primary hover:underline">{member.email}</a>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-1">Phone Number</p>
                <a href={`tel:${member.phone.replace(/\s+/g, '')}`} className="text-sm font-bold text-on-surface hover:text-primary transition-colors">{member.phone}</a>
              </div>
            </div>
          </div>

          {/* Permissions & Security */}
          <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm h-fit">
            <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
              <Key className="w-5 h-5 text-secondary" />
              Permissions & Access Level
            </h2>
            
            <div className="space-y-4">
              <div className="bg-surface p-4 rounded-xl border border-outline-variant/10">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${member.role === 'Super Admin' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                    {member.role === 'Super Admin' ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-on-surface">{member.role}</h3>
                    <p className="text-sm font-medium text-on-surface-variant mt-1 leading-relaxed">
                      {member.role === 'Super Admin' 
                        ? 'Has full root access to the entire platform, including billing, API keys, and managing other super admins. Exercise extreme caution when assigning this role.' 
                        : 'Can access assigned modules (like Orders, Customers, Inventory) and provide customer support. Cannot manage platform settings or billing.'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="p-4 border border-outline-variant/20 rounded-xl bg-surface-container-lowest">
                  <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Module Access</p>
                  <ul className="space-y-2 text-sm font-medium text-on-surface">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-success"></div> Analytics & Reports</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-success"></div> Marketing & Campaigns</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-success"></div> Contact & Support</li>
                    <li className="flex items-center gap-2 opacity-50"><div className="w-1.5 h-1.5 rounded-full bg-outline"></div> Billing (Restricted)</li>
                  </ul>
                </div>
                
                <div className="p-4 border border-outline-variant/20 rounded-xl bg-surface-container-lowest">
                  <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">System Capabilities</p>
                  <ul className="space-y-2 text-sm font-medium text-on-surface">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-success"></div> Export Data</li>
                    <li className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${member.role === 'Super Admin' ? 'bg-success' : 'bg-outline'}`}></div> Delete Records</li>
                    <li className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${member.role === 'Super Admin' ? 'bg-success' : 'bg-outline'}`}></div> Manage Billing</li>
                    <li className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${member.role === 'Super Admin' ? 'bg-success' : 'bg-outline'}`}></div> Change Global Settings</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>

          {/* Assigned Shops */}
          <div className="lg:col-span-3 bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm h-fit mt-2">
            <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              Assigned Shops & Responsibilities
            </h2>

            {member.role === 'Super Admin' && (
              <div className="bg-surface-container-low border border-outline-variant/20 p-6 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Global Root Access</h3>
                  <p className="text-sm font-medium text-on-surface-variant mt-1 max-w-2xl">
                    As a Super Admin, this user has full management access to every shop on the platform. The shops listed below are directly managed by them.
                  </p>
                </div>
              </div>
            )}

            {member.assignedShops.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {member.assignedShops.map((shop) => (
                  <div key={shop.id} className="bg-surface border border-outline-variant/20 p-5 rounded-2xl hover:border-primary/30 transition-colors group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Store className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-on-surface line-clamp-1">{shop.name}</h3>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant mt-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{shop.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Assigned {shop.assignedDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface-container border border-outline-variant/20 border-dashed p-8 rounded-2xl flex flex-col items-center justify-center text-center">
                <Store className="w-8 h-8 text-on-surface-variant/50 mb-3" />
                <h3 className="text-sm font-bold text-on-surface">No Shops Assigned</h3>
                <p className="text-xs font-medium text-on-surface-variant mt-1 max-w-xs mx-auto">
                  This support agent currently doesn't manage any specific shops. They might be handling general tickets.
                </p>
                <Button variant="outline" className="mt-4 border-outline-variant/30 hover:bg-surface-container-high">
                  Assign a Shop
                </Button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
