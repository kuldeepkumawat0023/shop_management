import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center hero-gradient p-4 relative overflow-hidden">
      {/* Decorative Blur Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Branding */}
      <div className="z-10 mb-8 flex flex-col items-center text-center">
        <Link href="/" className="flex items-center gap-2 mb-2 group">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-lg group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-on-surface">SmartShop</h1>
        </Link>
        <p className="text-on-surface-variant font-medium">Next Generation ERP & POS System</p>
      </div>

      {/* Main Content Area (Auth Cards) */}
      <div className="z-10 w-full max-w-md">
        {children}
      </div>
      
      {/* Footer */}
      <div className="z-10 mt-12 text-sm text-muted-foreground text-center">
        <p>&copy; {new Date().getFullYear()} SmartShop Management System. All rights reserved.</p>
      </div>
    </div>
  );
}
