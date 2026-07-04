'use client';

import React, { useState } from 'react';
import { X, Mail, Phone, Calendar, Reply, Send, User } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import toast from 'react-hot-toast';

interface ContactDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: any | null;
}

export default function ContactDetailDrawer({ isOpen, onClose, inquiry }: ContactDetailDrawerProps) {
  const [replyMessage, setReplyMessage] = useState('');

  if (!isOpen) return null;

  const handleSendReply = () => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply message.');
      return;
    }
    toast.success('Reply sent successfully via Email!');
    setReplyMessage('');
    onClose();
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-scrim/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] md:w-[500px] bg-surface-container-lowest shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-outline-variant/20 bg-surface-container-low/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface">Inquiry Details</h2>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">ID: {inquiry?.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6">
          
          {/* Status & Date */}
          <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">{inquiry?.date}</span>
            </div>
            <StatusBadge 
              status={inquiry?.status} 
              variant={inquiry?.status === 'New' ? 'primary' : inquiry?.status === 'Replied' ? 'success' : 'secondary' as any}
            />
          </div>

          {/* Sender Details */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4">Sender Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-on-surface-variant" />
                <span className="text-sm font-bold text-on-surface">{inquiry?.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-on-surface-variant" />
                <a href={`mailto:${inquiry?.email}`} className="text-sm font-bold text-primary hover:underline">{inquiry?.email}</a>
              </div>
            </div>
          </div>

          <div className="border-t border-outline-variant/20 my-2"></div>

          {/* Message Content */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-3">Message Subject</h3>
            <p className="text-base font-bold text-on-surface mb-6">{inquiry?.subject}</p>
            
            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-3">Message Body</h3>
            <div className="bg-surface-container-low/50 border border-outline-variant/20 rounded-xl p-5 text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
              {inquiry?.message}
            </div>
          </div>

        </div>

        {/* Reply Box (Fixed at bottom) */}
        <div className="p-4 sm:p-6 border-t border-outline-variant/20 bg-surface-container-lowest">
          <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-3 flex items-center gap-2">
            <Reply className="w-4 h-4" />
            Reply via Email
          </h3>
          <textarea 
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Type your reply here..." 
            rows={4}
            className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-on-surface-variant/50 resize-none custom-scrollbar mb-4"
          />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button className="flex-1 gradient-button text-white border-none gap-2 shadow-lg shadow-primary/20" onClick={handleSendReply}>
              <Send className="w-4 h-4" />
              <span className="font-bold tracking-wide">Send Reply</span>
            </Button>
          </div>
        </div>

      </div>
    </>
  );
}
