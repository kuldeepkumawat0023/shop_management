import React from 'react';
import { cn } from '@/utils/cn';

export interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'dot' | 'soft';
  animate?: boolean;
  colorTheme?: 'blue' | 'yellow' | 'purple' | 'green' | 'orange' | 'primary' | 'secondary' | 'error' | 'success' | 'warning';
  className?: string;
}

export function StatusBadge({ status, variant = 'default', animate = false, colorTheme, className }: StatusBadgeProps) {
  // Determine color scheme based on status string matching or explicit colorTheme
  const getColorScheme = (statusName: string, theme?: string) => {
    
    // Explicit theme override
    if (theme) {
      switch (theme) {
        case 'success':
        case 'green':
          return { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20', dot: 'bg-success' };
        case 'secondary':
        case 'blue':
          return { bg: 'bg-secondary/10', text: 'text-secondary', border: 'border-secondary/20', dot: 'bg-secondary' };
        case 'purple':
          return { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-500/20', dot: 'bg-purple-600' };
        case 'error':
          return { bg: 'bg-error/10', text: 'text-error', border: 'border-error/20', dot: 'bg-error' };
        case 'warning':
        case 'orange':
        case 'yellow':
          return { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20', dot: 'bg-warning' };
        case 'primary':
          return { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20', dot: 'bg-primary' };
      }
    }

    const s = statusName.toLowerCase();
    if (s.includes('paid') || s.includes('success') || s.includes('completed') || s.includes('active') || s.includes('live') || s.includes('joined')) {
      return {
        bg: 'bg-success/10',
        text: 'text-success',
        border: 'border-success/20',
        dot: 'bg-success'
      };
    }
    if (s.includes('pending') || s.includes('hold') || s.includes('processing')) {
      return {
        bg: 'bg-secondary/10',
        text: 'text-secondary',
        border: 'border-secondary/20',
        dot: 'bg-secondary'
      };
    }
    if (s.includes('paused') || s.includes('older') || s.includes('secure')) {
      return {
        bg: 'bg-purple-500/10',
        text: 'text-purple-600',
        border: 'border-purple-500/20',
        dot: 'bg-purple-600'
      };
    }
    if (s.includes('failed') || s.includes('cancelled') || s.includes('error') || s.includes('inactive')) {
      return {
        bg: 'bg-error/10',
        text: 'text-error',
        border: 'border-error/20',
        dot: 'bg-error'
      };
    }
    if (s.includes('upi') || s.includes('card')) {
      return {
        bg: 'bg-primary/10',
        text: 'text-primary',
        border: 'border-primary/20',
        dot: 'bg-primary'
      };
    }
    // Default fallback
    return {
      bg: 'bg-surface-container-high',
      text: 'text-on-surface-variant',
      border: 'border-outline-variant/30',
      dot: 'bg-on-surface-variant'
    };
  };

  const scheme = getColorScheme(status, colorTheme);

  if (variant === 'soft') {
    return (
      <span className={cn(
        "px-2.5 py-1 rounded-full text-[10px] font-bold",
        scheme.bg, scheme.text,
        className
      )}>
        {status}
      </span>
    );
  }

  if (variant === 'dot') {
    return (
      <div className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full border w-fit",
        scheme.bg, scheme.text, scheme.border,
        className
      )}>
        <div className={cn(
          "w-1.5 h-1.5 rounded-full",
          scheme.dot,
          animate ? "animate-pulse" : ""
        )} />
        <span className="text-[10px] font-black uppercase tracking-widest">{status}</span>
      </div>
    );
  }

  // Default variant (pill without dot)
  return (
    <span className={cn(
      "inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
      scheme.bg, scheme.text, scheme.border,
      className
    )}>
      {status}
    </span>
  );
}
