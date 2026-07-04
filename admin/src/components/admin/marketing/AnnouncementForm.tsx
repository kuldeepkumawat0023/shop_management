'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Send, Save, Eye, Bell, Megaphone, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AnnouncementForm() {
  const router = useRouter();
  
  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Dashboard Banner');
  const [audience, setAudience] = useState('All Branches');
  const [message, setMessage] = useState('');
  const [actionLink, setActionLink] = useState('');
  const [actionText, setActionText] = useState('');

  const handleSubmit = (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error('Title and message are required.');
      return;
    }
    
    // Save to LocalStorage for mock demonstration
    const newCampaign = {
      id: `camp_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      title: title,
      type: type,
      audience: audience,
      status: isDraft ? 'Draft' : 'Active',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const existingCampaigns = JSON.parse(localStorage.getItem('mockCampaigns') || '[]');
    localStorage.setItem('mockCampaigns', JSON.stringify([newCampaign, ...existingCampaigns]));

    if (isDraft) {
      toast.success('Campaign saved as draft!');
    } else {
      toast.success('Campaign launched successfully!');
    }
    router.push('/marketing');
  };

  return (
    <div className="flex flex-col h-full bg-background p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar w-full mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/marketing">
            <Button variant="outline" className="w-10 h-10 p-0 rounded-full shrink-0">
              <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">New Campaign</h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">Create and launch announcements to your branch network.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={(e) => handleSubmit(e, true)}>
            <Save className="w-4 h-4" />
            <span className="font-bold">Save Draft</span>
          </Button>
          <Button className="gradient-button text-white border-none gap-2 shadow-lg shadow-primary/20" onClick={(e) => handleSubmit(e, false)}>
            <Send className="w-4 h-4" />
            <span className="font-bold tracking-wide">Launch Campaign</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Side: Form */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/20 flex flex-col h-fit">
          <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-primary" />
            Campaign Details
          </h2>
          
          <form className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Campaign Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Holiday Sale - 20% Off" 
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Type</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all"
                >
                  <option>Dashboard Banner</option>
                  <option>Push Notification</option>
                  <option>Dashboard Alert</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Target Audience</label>
                <select 
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all"
                >
                  <option>All Branches</option>
                  <option>Basic Users Only</option>
                  <option>Pro & Enterprise Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Message</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your announcement here..." 
                rows={5}
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/50 resize-none custom-scrollbar"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Action Button Text (Optional)</label>
                <input 
                  type="text" 
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  placeholder="e.g. Upgrade Now" 
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/50"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Action Link (URL)</label>
                <input 
                  type="text" 
                  value={actionLink}
                  onChange={(e) => setActionLink(e.target.value)}
                  placeholder="https://" 
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/50"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Right Side: Live Preview */}
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
            <Eye className="w-5 h-5 text-secondary" />
            Live Preview
          </h2>
          
          <div className="flex-1 bg-surface-container-low/50 rounded-3xl p-6 md:p-10 border border-outline-variant/20 flex items-center justify-center relative overflow-hidden">
            {/* Mockup Container */}
            <div className="w-full max-w-sm bg-background rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden relative z-10 flex flex-col h-[400px]">
              
              {/* Mockup Header */}
              <div className="bg-surface-container-lowest border-b border-outline-variant/20 p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface">SmartShop Dashboard</div>
                  <div className="text-[10px] text-on-surface-variant">Client View</div>
                </div>
              </div>

              {/* Mockup Body with Preview */}
              <div className="flex-1 p-4 bg-surface-container-low/30 relative">
                
                {/* The Actual Preview Render */}
                {type === 'Dashboard Banner' && (
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-4">
                    <h4 className="text-sm font-bold text-primary mb-1">{title || 'Campaign Title'}</h4>
                    <p className="text-xs text-on-surface leading-relaxed mb-3">{message || 'Your announcement message will appear here...'}</p>
                    {actionText && (
                      <button className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-md w-full">{actionText}</button>
                    )}
                  </div>
                )}

                {type === 'Dashboard Alert' && (
                  <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-4 flex gap-3 items-start">
                    <Bell className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-on-surface mb-1">{title || 'Important Alert'}</h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{message || 'Your alert message will appear here...'}</p>
                      {actionText && (
                        <span className="text-xs font-bold text-primary mt-2 inline-block hover:underline cursor-pointer">{actionText}</span>
                      )}
                    </div>
                  </div>
                )}

                {type === 'Push Notification' && (
                  <div className="bg-surface-container-highest rounded-xl p-3 mb-4 shadow-md border border-outline-variant/20 flex gap-3">
                    <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center shrink-0">
                      <Megaphone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">{title || 'Push Title'}</h4>
                      <p className="text-[10px] text-on-surface-variant leading-tight mt-1">{message || 'Push message content...'}</p>
                    </div>
                  </div>
                )}

                {/* Skeleton Content underneath to simulate a real dashboard */}
                <div className="space-y-3 mt-6 opacity-30 pointer-events-none select-none">
                  <div className="h-20 bg-surface-container-highest rounded-xl w-full"></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-16 bg-surface-container-highest rounded-xl"></div>
                    <div className="h-16 bg-surface-container-highest rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative background circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
