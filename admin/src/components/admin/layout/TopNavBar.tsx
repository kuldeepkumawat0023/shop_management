'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  Menu,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Bell,
  Shield
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { cn } from '@/utils/cn';
import Link from 'next/link';

function getInitials(name?: string): string {
  if (!name) return 'S';
  const parts = name.trim().split(' ');
  const first = parts[0]?.[0] || '';
  const last = parts[parts.length - 1]?.[0] || '';
  return (first + last).toUpperCase();
}

interface TopNavBarProps {
  onMenuClick: () => void;
}

export default function TopNavBar({ onMenuClick }: TopNavBarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Static user data for UI development without backend
  const user = {
    fullname: 'Super Admin',
    email: 'admin@smartshop.com',
    role: 'System Root',
    profilePhoto: null
  };

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    console.log('Logout clicked - static mode');
  };

  const profilePhoto = user?.profilePhoto;

  return (
    <header className="sticky top-0 right-0 w-full h-16 md:h-20 glass-navbar border-b border-outline-variant/30 flex items-center justify-between px-4 md:px-6 lg:px-10 z-40 bg-surface/80">
      {/* Left: Mobile Toggle */}
      <div className="flex items-center gap-3 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden text-on-surface-variant"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-2 md:gap-4 ml-4">
        
        {/* Action Icons */}
        <button className="relative p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface"></span>
        </button>

        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        )}

        {/* Divider */}
        <div className="w-px h-8 bg-outline-variant/30 hidden sm:block mx-1"></div>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button className="flex items-center gap-3 group focus:outline-none" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <div className="w-10 h-10 rounded-full gradient-button flex items-center justify-center text-white text-xs font-bold overflow-hidden border border-white/20 shadow-sm transition-transform group-hover:scale-105">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(user?.fullname)
              )}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-bold text-on-surface leading-tight truncate max-w-[120px]">
                {user?.fullname || 'Super Admin'}
              </div>
              <div className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider mt-0.5">
                {user?.role || 'Root'}
              </div>
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 text-on-surface-variant group-hover:text-primary transition-all duration-300",
              isDropdownOpen ? "rotate-180" : ""
            )} />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-56 bg-card rounded-2xl shadow-xl shadow-black/10 border border-outline-variant/30 overflow-hidden py-2 z-50"
              >
                <div className="px-4 py-3 border-b border-outline-variant/20">
                  <p className="text-sm font-bold text-on-surface">{user?.fullname}</p>
                  <p className="text-xs text-on-surface-variant truncate mt-0.5">{user?.email}</p>
                </div>
                
                <div className="p-2 space-y-1">
                  <Link href="/settings/profile" onClick={() => setIsDropdownOpen(false)}>
                    <div className="flex items-center gap-3 px-3 py-2 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-xl transition-colors cursor-pointer">
                      <User className="w-4 h-4" />
                      My Profile
                    </div>
                  </Link>
                  <Link href="/settings" onClick={() => setIsDropdownOpen(false)}>
                    <div className="flex items-center gap-3 px-3 py-2 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-xl transition-colors cursor-pointer">
                      <Settings className="w-4 h-4" />
                      Platform Settings
                    </div>
                  </Link>
                </div>
                
                <div className="px-2 pt-2 border-t border-outline-variant/20 mt-1">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-error hover:bg-error-container/50 rounded-xl transition-colors font-medium cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
