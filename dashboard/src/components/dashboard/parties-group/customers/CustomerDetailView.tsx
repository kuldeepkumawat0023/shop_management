'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ArrowLeft, User, Phone, Mail, MapPin, Building, Edit, Trash2, ShoppingBag, IndianRupee, History, Receipt } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CustomerDetailView() {
  const router = useRouter();

  const recentOrders = [
    { id: 'ORD-9821', date: 'Jul 24, 2026', total: 15400, status: 'Completed' },
    { id: 'ORD-9750', date: 'Jul 10, 2026', total: 3200, status: 'Processing' },
    { id: 'ORD-9610', date: 'Jun 28, 2026', total: 8500, status: 'Completed' },
  ];

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto custom-scrollbar w-full ">
      {/* Header Sticky */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-outline-variant/20 p-4 md:p-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button onClick={() => router.back()} variant="outline" className="w-10 h-10 p-0 rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-on-surface tracking-tight">Rajesh Kumar</h2>
                <StatusBadge status="Active" />
              </div>
              <p className="text-sm font-medium text-on-surface-variant">Customer ID: CUST-001 • Joined Jan 2026</p>
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

      <div className="p-4 md:p-6 lg:p-8 w-full flex flex-col gap-6">
        
        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <IndianRupee className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Total Spent</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">₹1,25,000</p>
            <p className="text-sm text-primary font-bold">+15% vs last year</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-error/5 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <ShoppingBag className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Total Orders</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">24</p>
            <p className="text-sm text-on-surface-variant font-medium">Last order on Jul 24, 2026</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-warning/5 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <History className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Outstanding Balance</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">₹0.00</p>
            <p className="text-sm text-success font-bold">All payments cleared</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-2">
                <User className="w-5 h-5 text-primary" />
                Contact Details
              </h3>
              
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email</span>
                    <a href="mailto:rajesh.k@example.com" className="font-semibold text-primary hover:underline">rajesh.k@example.com</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Phone</span>
                    <a href="tel:+919876543210" className="font-semibold text-on-surface">+91 98765 43210</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <Building className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Company</span>
                    <span className="font-semibold text-on-surface">RK Enterprises</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Address</span>
                    <span className="font-semibold text-on-surface">123 Main St, Apartment 4B<br/>Mumbai, Maharashtra<br/>400001, India</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Notes</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                VIP customer. Prefers deliveries on weekends. Usually pays via UPI or Credit Card.
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-outline-variant/20">
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-primary" />
                  Recent Activity
                </h3>
                <Button variant="ghost" className="text-primary font-bold hover:bg-primary/10 rounded-lg">View All</Button>
              </div>

              {recentOrders.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-surface hover:bg-surface-container transition-colors border border-outline-variant/10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <ShoppingBag className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{order.id}</p>
                          <p className="text-sm text-on-surface-variant font-medium">{order.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <p className="font-black text-on-surface">₹{order.total.toLocaleString()}</p>
                          <StatusBadge status={order.status} />
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
                    <Receipt className="w-8 h-8 text-on-surface-variant/50" />
                  </div>
                  <p className="text-lg font-bold text-on-surface mb-1">No recent activity</p>
                  <p className="text-sm text-on-surface-variant">This customer hasn't placed any orders yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
