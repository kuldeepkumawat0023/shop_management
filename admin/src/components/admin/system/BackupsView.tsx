'use client';

import React, { useState } from 'react';
import { Database, DownloadCloud, RotateCw, History, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/common/Button';
import toast from 'react-hot-toast';

const mockBackups = [
  { id: 'bck_001', date: 'Oct 24, 2026, 02:00 AM', size: '4.2 GB', type: 'Automated (Daily)', status: 'Success' },
  { id: 'bck_002', date: 'Oct 23, 2026, 02:00 AM', size: '4.1 GB', type: 'Automated (Daily)', status: 'Success' },
  { id: 'bck_003', date: 'Oct 22, 2026, 03:15 PM', size: '4.1 GB', type: 'Manual Trigger', status: 'Success' },
  { id: 'bck_004', date: 'Oct 22, 2026, 02:00 AM', size: '0 MB', type: 'Automated (Daily)', status: 'Failed' },
  { id: 'bck_005', date: 'Oct 21, 2026, 02:00 AM', size: '4.0 GB', type: 'Automated (Daily)', status: 'Success' },
];

export default function BackupsView() {
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleManualBackup = () => {
    setIsBackingUp(true);
    toast.loading('Starting manual database backup...', { id: 'backup-toast' });
    
    // Simulate backup process
    setTimeout(() => {
      setIsBackingUp(false);
      toast.success('Backup completed successfully! (Mock)', { id: 'backup-toast' });
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar gap-6 w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight flex items-center gap-2">
            <Database className="w-8 h-8 text-primary" />
            Disaster Recovery
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">Manage database snapshots, schedules, and manual backups.</p>
        </div>
        <Button 
          onClick={handleManualBackup} 
          disabled={isBackingUp}
          className="gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 shrink-0"
        >
          <RotateCw className={`w-4 h-4 ${isBackingUp ? 'animate-spin' : ''}`} />
          <span className="font-bold tracking-wide">
            {isBackingUp ? 'Creating Snapshot...' : 'Trigger Manual Backup'}
          </span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Backup Settings & Storage */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-secondary" />
              Auto-Backup Schedule
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
                <span className="text-sm font-bold text-on-surface">Frequency</span>
                <span className="text-sm font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full">Daily</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
                <span className="text-sm font-bold text-on-surface">Time</span>
                <span className="text-sm font-bold text-on-surface-variant">02:00 AM (UTC)</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
                <span className="text-sm font-bold text-on-surface">Retention</span>
                <span className="text-sm font-bold text-on-surface-variant">30 Days</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 border-outline-variant/30 text-on-surface-variant">
              Modify Schedule
            </Button>
          </div>
          
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm">
             <h2 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-4">Storage Used for Backups</h2>
             <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-black text-on-surface tracking-tighter">124</span>
                <span className="text-xl font-bold text-on-surface-variant">GB</span>
             </div>
             <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
               <div className="bg-primary h-full rounded-full" style={{ width: '25%' }}></div>
             </div>
             <p className="text-xs font-medium text-on-surface-variant mt-2 text-right">25% of 500GB Quota</p>
          </div>
        </div>

        {/* Recent Backups List */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2 mb-6">
            <History className="w-5 h-5 text-primary" />
            Recent Snapshots
          </h2>
          
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20 text-xs font-black uppercase tracking-widest text-on-surface-variant">
                  <th className="pb-3 font-medium">Snapshot ID</th>
                  <th className="pb-3 font-medium">Date & Time</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Size</th>
                  <th className="pb-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockBackups.map((backup, i) => (
                  <tr key={backup.id} className="border-b border-outline-variant/10 last:border-0 hover:bg-surface-container-low transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <DownloadCloud className="w-4 h-4 text-on-surface-variant" />
                        <span className="text-sm font-bold text-on-surface">{backup.id}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm font-medium text-on-surface-variant">{backup.date}</td>
                    <td className="py-4 text-sm font-medium text-on-surface-variant">{backup.type}</td>
                    <td className="py-4 text-sm font-bold text-on-surface">{backup.size}</td>
                    <td className="py-4 text-right">
                      {backup.status === 'Success' ? (
                        <span className="inline-flex items-center gap-1.5 bg-success/10 text-success text-xs font-bold px-2.5 py-1 rounded-md border border-success/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-error/10 text-error text-xs font-bold px-2.5 py-1 rounded-md border border-error/20">
                          <XCircle className="w-3.5 h-3.5" />
                          Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
