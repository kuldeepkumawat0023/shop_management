'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ArrowLeft, User, Mail, Edit, Trash2, ShieldAlert, Key, MonitorPlay, CalendarClock, History, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserDetailView() {
  const router = useRouter();

  const activityLog = [
    { id: 'LOG-304', time: 'Today, 10:45 AM', action: 'Logged in', details: 'IP: 192.168.1.1 (Mumbai, India)', status: 'Success' },
    { id: 'LOG-303', time: 'Yesterday, 04:20 PM', action: 'Updated Inventory', details: 'Added 50 units of "Wireless Mouse"', status: 'Success' },
    { id: 'LOG-302', time: 'Jul 24, 2026, 09:15 AM', action: 'Failed Login Attempt', details: 'IP: 10.0.0.5 (Unknown)', status: 'Failed' },
    { id: 'LOG-301', time: 'Jul 20, 2026, 11:30 AM', action: 'Created Purchase Order', details: 'PO-2026-041 for Global Traders', status: 'Success' },
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
                <h2 className="text-2xl font-black text-on-surface tracking-tight">Dinesh Thori</h2>
                <StatusBadge status="Active" />
              </div>
              <p className="text-sm font-medium text-on-surface-variant">USR-001 • Super Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none border-outline-variant/30 text-on-surface-variant hover:text-primary hover:bg-primary/10 font-semibold gap-2 rounded-xl transition-colors">
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit Account</span>
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none border-outline-variant/30 text-error hover:bg-error/10 font-semibold gap-2 rounded-xl transition-colors">
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Suspend User</span>
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
              <CalendarClock className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Account Age</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">2.5 Yrs</p>
            <p className="text-sm text-primary font-bold">Created Jan 2024</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-success/5 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <MonitorPlay className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Total Logins</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">842</p>
            <p className="text-sm text-on-surface-variant font-medium">Avg 2/day</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-warning/5 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <History className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Last Active</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">Today</p>
            <p className="text-sm text-warning font-bold">10:45 AM</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-2">
                <User className="w-5 h-5 text-primary" />
                Profile Details
              </h3>
              
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Username</span>
                    <span className="font-semibold text-on-surface">dinesh_t</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email</span>
                    <a href="mailto:admin@shop.com" className="font-semibold text-primary hover:underline">admin@shop.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">System Role</span>
                    <span className="font-semibold text-on-surface">Super Admin</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant/20 pb-2 flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" />
                Security Settings
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-on-surface-variant">2FA Auth:</span>
                  <span className="text-sm font-bold text-success flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Enabled</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-on-surface-variant">Last Pwd Change:</span>
                  <span className="text-sm font-bold text-on-surface">3 months ago</span>
                </div>
                <Button variant="outline" className="w-full mt-2 border-outline-variant/30 text-on-surface-variant text-sm h-9">
                  Send Password Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-outline-variant/20">
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  System Activity Log
                </h3>
                <Button variant="ghost" className="text-primary font-bold hover:bg-primary/10 rounded-lg">View All Logs</Button>
              </div>

              {activityLog.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {activityLog.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl bg-surface hover:bg-surface-container transition-colors border border-outline-variant/10">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${log.status === 'Success' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'}`}>
                          {log.status === 'Success' ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{log.action}</p>
                          <p className="text-sm text-on-surface-variant font-medium">{log.details}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 text-right">
                        <p className="text-sm font-bold text-on-surface-variant">{log.time}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${log.status === 'Success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
                    <History className="w-8 h-8 text-on-surface-variant/50" />
                  </div>
                  <p className="text-lg font-bold text-on-surface mb-1">No activity recorded</p>
                  <p className="text-sm text-on-surface-variant">This user hasn't performed any actions yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
