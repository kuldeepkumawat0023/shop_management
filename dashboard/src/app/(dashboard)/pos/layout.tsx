import React from 'react';
import { POSProvider } from '@/contexts/POSContext';

export default function POSLayout({ children }: { children: React.ReactNode }) {
  return (
    <POSProvider>
      {children}
    </POSProvider>
  );
}
