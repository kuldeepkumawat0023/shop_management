'use client';

import { useEffect } from 'react';
import { ServerCrash, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/common/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry in production
    console.error('App crashed:', error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="bg-surface-container-low border border-outline-variant/20 rounded-3xl p-8 md:p-12 max-w-md w-full shadow-2xl flex flex-col items-center">
        
        {/* Error Icon */}
        <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-6">
          <ServerCrash className="w-12 h-12 text-error" />
        </div>
        
        {/* Error Message */}
        <h2 className="text-2xl font-black text-on-surface mb-3 tracking-tight">
          Oops, something went wrong!
        </h2>
        
        <p className="text-sm text-on-surface-variant font-medium mb-8 leading-relaxed">
          We encountered an unexpected server error or connection issue while trying to load this page. Don't worry, your data is safe.
        </p>
        
        {/* Retry Button (YouTube style) */}
        <Button 
          onClick={() => reset()}
          className="w-full sm:w-auto min-w-[200px] gradient-button text-white border-none gap-2 shadow-lg shadow-primary/20 h-12 rounded-xl text-sm"
        >
          <RefreshCcw className="w-4 h-4" />
          <span className="font-bold tracking-wide uppercase">Try Again</span>
        </Button>
        
        <p className="text-[10px] text-on-surface-variant/50 font-medium mt-6 uppercase tracking-widest">
          Error Code: {error.digest || '500_INTERNAL_SERVER_ERROR'}
        </p>
      </div>
    </div>
  );
}
