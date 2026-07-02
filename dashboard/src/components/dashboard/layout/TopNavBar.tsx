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
  Download,
  ShoppingCart,
  Bell,
  Store
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { cn } from '@/utils/cn';
import Link from 'next/link';

function getInitials(name?: string): string {
  if (!name) return 'U';
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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Static user data for UI development without backend
  const user = {
    fullname: 'Raj Store Owner',
    email: 'raj@greenmart.com',
    role: 'Admin',
    profilePhoto: null
  };

  useEffect(() => {
    setMounted(true);

    const checkStandalone = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
        setIsStandalone(true);
      }
    };
    checkStandalone();
    window.addEventListener('appinstalled', () => setIsStandalone(true));

    const checkInstallable = () => {
      if ((window as any).deferredPrompt) {
        setDeferredPrompt(true);
      }
    };
    checkInstallable();

    window.addEventListener('pwa-ready', checkInstallable);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    window.dispatchEvent(new Event('showInstallModal'));
    setIsDropdownOpen(false);
  };

  const handleLogout = async () => {
    // Static placeholder for logout
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
        <button className="relative p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors cursor-pointer hidden sm:block">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface"></span>
        </button>

        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-on-surface-variant hover:text-primary transition-colors hidden sm:flex"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        )}

        <div className="hidden md:flex items-center ml-2">
          <motion.div
            className="relative inline-block group"
            whileHover="hover"
            initial="initial"
          >
            {/* Magnetic Energy Ripples - expanding only on hover for maximum premium interaction */}
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/40 to-secondary/40 pointer-events-none blur-[4px]"
              style={{ zIndex: 0 }}
              variants={{
                initial: { scale: 1, opacity: 0 },
                hover: {
                  scale: [1, 1.35],
                  opacity: [0.8, 0],
                  transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut"
                  }
                }
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-secondary/30 to-primary/30 pointer-events-none blur-[4px]"
              style={{ zIndex: 0 }}
              variants={{
                initial: { scale: 1, opacity: 0 },
                hover: {
                  scale: [1, 1.5],
                  opacity: [0.6, 0],
                  transition: {
                    duration: 1.5,
                    delay: 0.5,
                    repeat: Infinity,
                    ease: "easeOut"
                  }
                }
              }}
            />

            <motion.div
              style={{ position: 'relative', zIndex: 1 }}
              whileHover={{
                scale: 1.06,
                boxShadow: "0 20px 25px -5px rgba(14, 165, 233, 0.4), 0 10px 10px -5px rgba(14, 165, 233, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl"
            >
              <Link href="/pos">
                <Button
                  variant="gradient"
                  size="sm"
                  className="relative overflow-hidden rounded-xl text-white font-extrabold text-xs tracking-wider flex items-center gap-2 shadow-lg shadow-primary/30 cursor-pointer border border-white/10"
                >
                {/* Infinite looping glass highlight sweep from left to right */}
                <motion.div
                  className="absolute inset-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                  style={{ zIndex: 0 }}
                  animate={{
                    x: ["-180%", "280%"]
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 2,
                    ease: "easeInOut",
                    repeatDelay: 1.2
                  }}
                />

                {/* Text and Icon with explicit relative layering to stay on top */}
                <span className="relative z-10 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  New Sale
                </span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="h-8 w-[1px] bg-outline-variant/20 mx-1 hidden sm:block" />

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-surface-container transition-colors group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-[10px] font-bold overflow-hidden border border-primary/20 shadow-sm transition-transform group-hover:scale-105">
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
              <div className="text-xs font-bold text-on-surface leading-tight truncate max-w-[100px]">
                {user?.fullname || 'Admin User'}
              </div>
              <div className="text-[9px] text-on-surface-variant font-medium uppercase tracking-tighter">
                {user?.role || 'Admin'}
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
                className="absolute right-0 mt-2 w-60 bg-card backdrop-blur-xl border border-outline-variant/30 rounded-2xl shadow-2xl py-2 overflow-hidden z-50 shadow-primary/10"
              >
                <div className="px-4 py-3 border-b border-outline-variant/10 mb-1">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Signed in as</p>
                  <p className="text-sm font-bold text-on-surface truncate">{user?.email || 'admin@smartshop.com'}</p>
                </div>

                <div className="px-2 space-y-0.5">
                  <Link
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-on-surface hover:bg-primary/10 hover:text-primary rounded-xl transition-colors group/item"
                  >
                    <div className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant group-hover/item:bg-primary/20 group-hover/item:text-primary transition-colors">
                      <User size={16} />
                    </div>
                    My Profile
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-on-surface hover:bg-primary/10 hover:text-primary rounded-xl transition-colors group/item"
                  >
                    <div className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant group-hover/item:bg-primary/20 group-hover/item:text-primary transition-colors">
                      <Settings size={16} />
                    </div>
                    Settings
                  </Link>

                  {/* Theme Switcher for Mobile inside Dropdown */}
                  <div className="sm:hidden flex items-center justify-between px-3 py-2 text-sm font-semibold text-on-surface hover:bg-primary/10 hover:text-primary rounded-xl transition-colors group/item cursor-pointer" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant group-hover/item:bg-primary/20 group-hover/item:text-primary transition-colors">
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                      </div>
                      Theme
                    </div>
                    <span className="text-xs opacity-60 uppercase">{theme}</span>
                  </div>

                  {!isStandalone && (
                    <button
                      onClick={handleInstallClick}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm font-semibold text-primary hover:bg-primary/10 rounded-xl transition-colors group/item cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover/item:bg-primary/20 transition-colors">
                        <Download size={16} />
                      </div>
                      Install App
                    </button>
                  )}
                </div>

                <div className="mt-2 pt-2 border-t border-outline-variant/10 px-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-error hover:bg-error/10 rounded-xl transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-error/10 text-error">
                      <LogOut size={16} />
                    </div>
                    Sign Out
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
