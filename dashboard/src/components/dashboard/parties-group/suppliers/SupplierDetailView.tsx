'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ArrowLeft, User, Phone, Mail, MapPin, Building, Edit, Trash2, ShoppingCart, IndianRupee, History, ReceiptText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SupplierDetailView() {
  const router = useRouter();

  const recentPOs = [
    { id: 'PO-2026-041', date: 'Jul 24, 2026', total: 45000, status: 'Delivered' },
    { id: 'PO-2026-038', date: 'Jul 15, 2026', total: 12000, status: 'Processing' },
    { id: 'PO-2026-021', date: 'Jun 28, 2026', total: 85000, status: 'Delivered' },
  ];

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto custom-scrollbar w-full mx-auto">
      {/* Header Sticky */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-outline-variant/20 p-4 md:p-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button onClick={() => router.back()} variant="outline" className="w-10 h-10 p-0 rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-on-surface tracking-tight">Global Traders</h2>
                <StatusBadge status="Active" />
              </div>
              <p className="text-sm font-medium text-on-surface-variant">Supplier ID: SUP-101 • Onboarded Jan 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none border-outline-variant/30 text-on-surface-variant hover:text-primary hover:bg-primary/10 font-semibold gap-2 rounded-xl transition-colors">
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit Profile</span>
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none border-outline-variant/30 text-error hover:bg-error/10 font-semibold gap-2 rounded-xl transition-colors">
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
        
        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <IndianRupee className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Total Sourced</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">₹4,50,000</p>
            <p className="text-sm text-primary font-bold">Lifetime Value</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-error/5 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <ShoppingCart className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Total POs</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">18</p>
            <p className="text-sm text-on-surface-variant font-medium">Last PO on Jul 24, 2026</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-warning/5 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <History className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Outstanding Payables</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">₹12,000</p>
            <p className="text-sm text-warning font-bold">1 Invoice Pending</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-2">
                <Building className="w-5 h-5 text-primary" />
                Business Details
              </h3>
              
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Contact Person</span>
                    <span className="font-semibold text-on-surface">Sanjay Gupta</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email</span>
                    <a href="mailto:contact@globaltraders.in" className="font-semibold text-primary hover:underline">contact@globaltraders.in</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Phone</span>
                    <a href="tel:+919811122233" className="font-semibold text-on-surface">+91 98111 22233</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <ReceiptText className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">GSTIN</span>
                    <span className="font-semibold text-on-surface font-mono">22AAAAA0000A1Z5</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Address</span>
                    <span className="font-semibold text-on-surface">123 Industrial Estate, Block B<br/>Pune, Maharashtra<br/>411001, India</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Payment & Notes</h3>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-on-surface-variant">Payment Terms:</span>
                  <span className="text-sm font-bold text-on-surface">Net 30</span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed mt-2 border-t border-outline-variant/10 pt-2">
                  Reliable supplier for raw materials. Deliveries are usually on time. Need to remind them about packing quality.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-outline-variant/20">
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  Recent Purchase Orders
                </h3>
                <Button variant="ghost" className="text-primary font-bold hover:bg-primary/10 rounded-lg">View All</Button>
              </div>

              {recentPOs.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {recentPOs.map((po) => (
                    <div key={po.id} className="flex items-center justify-between p-4 rounded-2xl bg-surface hover:bg-surface-container transition-colors border border-outline-variant/10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <ShoppingCart className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{po.id}</p>
                          <p className="text-sm text-on-surface-variant font-medium">{po.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <p className="font-black text-on-surface">₹{po.total.toLocaleString()}</p>
                          <StatusBadge status={po.status} />
                        </div>
                        <Button variant="ghost" size="icon" className="text-on-surface-variant">
                          <ArrowLeft className="w-5 h-5 rotate-180" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart className="w-8 h-8 text-on-surface-variant/50" />
                  </div>
                  <p className="text-lg font-bold text-on-surface mb-1">No recent POs</p>
                  <p className="text-sm text-on-surface-variant">You haven't ordered anything from this supplier yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
