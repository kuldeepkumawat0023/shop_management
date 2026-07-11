'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ArrowLeft, User, Phone, Mail, Building, Edit, Trash2, CalendarOff, IndianRupee, Clock, Briefcase, CalendarHeart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TeamMemberDetailView() {
  const router = useRouter();

  const recentActivity = [
    { id: 'ACT-102', date: 'Jul 24, 2026', type: 'Leave Request', status: 'Approved', details: 'Sick Leave (1 day)' },
    { id: 'ACT-101', date: 'Jun 30, 2026', type: 'Payroll', status: 'Completed', details: 'Salary credited for June' },
    { id: 'ACT-100', date: 'May 31, 2026', type: 'Payroll', status: 'Completed', details: 'Salary credited for May' },
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
                <h2 className="text-2xl font-black text-on-surface tracking-tight">Ravi Verma</h2>
                <StatusBadge status="Active" />
              </div>
              <p className="text-sm font-medium text-on-surface-variant">EMP-001 • Store Manager (Management)</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none border-outline-variant/30 text-on-surface-variant hover:text-primary hover:bg-primary/10 font-semibold gap-2 rounded-xl transition-colors">
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit Details</span>
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none border-outline-variant/30 text-error hover:bg-error/10 font-semibold gap-2 rounded-xl transition-colors">
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Terminate</span>
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
              <Clock className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Tenure</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">1.5 Yrs</p>
            <p className="text-sm text-primary font-bold">Joined Jan 10, 2025</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-success/5 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <IndianRupee className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Base Salary</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">₹45,000</p>
            <p className="text-sm text-on-surface-variant font-medium">Per Month</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-warning/5 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <CalendarHeart className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Leave Balance</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">12</p>
            <p className="text-sm text-warning font-bold">Available leaves</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-2">
                <User className="w-5 h-5 text-primary" />
                Contact Info
              </h3>
              
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email</span>
                    <a href="mailto:ravi.v@example.com" className="font-semibold text-primary hover:underline">ravi.v@example.com</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Phone</span>
                    <a href="tel:+919876511111" className="font-semibold text-on-surface">+91 98765 11111</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Department</span>
                    <span className="font-semibold text-on-surface">Management</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant/20 pb-2 flex items-center gap-2">
                <Building className="w-4 h-4 text-primary" />
                Emergency Contact
              </h3>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-on-surface-variant">Name:</span>
                  <span className="text-sm font-bold text-on-surface">Priya Verma</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-on-surface-variant">Relation:</span>
                  <span className="text-sm font-bold text-on-surface">Spouse</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-on-surface-variant">Phone:</span>
                  <span className="text-sm font-bold text-on-surface">+91 98765 22222</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-outline-variant/20">
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <CalendarOff className="w-5 h-5 text-primary" />
                  Recent Activity & Leaves
                </h3>
                <Button variant="ghost" className="text-primary font-bold hover:bg-primary/10 rounded-lg">View All</Button>
              </div>

              {recentActivity.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {recentActivity.map((act) => (
                    <div key={act.id} className="flex items-center justify-between p-4 rounded-2xl bg-surface hover:bg-surface-container transition-colors border border-outline-variant/10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          {act.type === 'Payroll' ? <IndianRupee className="w-5 h-5 text-primary" /> : <CalendarOff className="w-5 h-5 text-primary" />}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{act.type} • {act.date}</p>
                          <p className="text-sm text-on-surface-variant font-medium">{act.details}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <StatusBadge status={act.status} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
                    <CalendarOff className="w-8 h-8 text-on-surface-variant/50" />
                  </div>
                  <p className="text-lg font-bold text-on-surface mb-1">No recent activity</p>
                  <p className="text-sm text-on-surface-variant">There are no leaves or payroll logs for this employee.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
