'use client';

import React from 'react';
import { Search, UserPlus, X } from 'lucide-react';
import { Button } from '@/components/common/Button';

export default function CustomerSelection() {
  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-on-surface-variant" />
          </div>
          <input
            type="text"
            placeholder="Search customer by name or phone..."
            className="block w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-on-surface-variant/50"
          />
        </div>
        <Button variant="outline" size="icon" className="shrink-0 h-10 w-10 border-outline-variant/30 text-primary hover:bg-primary/5">
          <UserPlus className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
