import React from 'react';
import { cn } from '@/utils/cn';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  
  // Default variant props
  trend?: string;
  trendDirection?: 'up' | 'down';
  trendLabel?: string;
  
  // Advanced & Splash variant props
  variant?: 'default' | 'advanced' | 'splash';
  progressSubtitle?: string;
  colorTheme?: 'blue' | 'yellow' | 'purple' | 'green' | 'orange';
  badgeText?: string;
  
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendDirection, 
  trendLabel,
  variant = 'default',
  progressSubtitle,
  colorTheme = 'blue',
  badgeText,
  className 
}: StatsCardProps) {
  
  if (variant === 'splash') {
    const getThemeStyles = () => {
      switch (colorTheme) {
        case 'blue':
          return { bgLight: 'bg-[#4f46e5]/10', text: 'text-[#4f46e5]' };
        case 'yellow':
          return { bgLight: 'bg-[#f59e0b]/10', text: 'text-[#f59e0b]' };
        case 'purple':
          return { bgLight: 'bg-[#a855f7]/10', text: 'text-[#a855f7]' };
        case 'green':
          return { bgLight: 'bg-[#10b981]/10', text: 'text-[#10b981]' };
        case 'orange':
          return { bgLight: 'bg-[#f97316]/10', text: 'text-[#f97316]' };
        default:
          return { bgLight: 'bg-primary/10', text: 'text-primary' };
      }
    };
    const theme = getThemeStyles();

    return (
      <div className={cn("relative bg-surface-container-lowest rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-outline-variant/20 p-5 flex flex-col gap-4 overflow-hidden", className)}>
        {/* Splash shape on top right */}
        <div className={cn("absolute top-0 right-0 w-16 h-16 rounded-bl-full z-0 opacity-50", theme.bgLight)} />
        
        <div className="relative z-10 flex items-start justify-between">
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0", theme.bgLight)}>
            <Icon className={cn("w-5 h-5", theme.text)} />
          </div>
          {badgeText && (
            <StatusBadge variant="soft" status={badgeText} colorTheme={colorTheme} className="mt-1" />
          )}
        </div>
        
        <div className="relative z-10 flex flex-col mt-2">
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{title}</p>
          <h3 className="text-3xl font-black text-on-surface tracking-tight mt-1">{value}</h3>
        </div>
      </div>
    );
  }

  if (variant === 'advanced') {
    const getThemeStyles = () => {
      switch (colorTheme) {
        case 'blue':
          return { border: 'border-t-[#4f46e5]', iconBg: 'bg-[#4f46e5]/10', iconColor: 'text-[#4f46e5]', barColor: 'bg-[#4f46e5]' };
        case 'yellow':
          return { border: 'border-t-[#f59e0b]', iconBg: 'bg-[#f59e0b]/10', iconColor: 'text-[#f59e0b]', barColor: 'bg-[#f59e0b]' };
        case 'purple':
          return { border: 'border-t-[#a855f7]', iconBg: 'bg-[#a855f7]/10', iconColor: 'text-[#a855f7]', barColor: 'bg-[#a855f7]' };
        case 'green':
          return { border: 'border-t-[#10b981]', iconBg: 'bg-[#10b981]/10', iconColor: 'text-[#10b981]', barColor: 'bg-[#10b981]' };
        case 'orange':
          return { border: 'border-t-[#f97316]', iconBg: 'bg-[#f97316]/10', iconColor: 'text-[#f97316]', barColor: 'bg-[#f97316]' };
        default:
          return { border: 'border-t-primary', iconBg: 'bg-primary/10', iconColor: 'text-primary', barColor: 'bg-primary' };
      }
    };
    const theme = getThemeStyles();

    return (
      <div className={cn(
        "bg-surface-container-lowest rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-outline-variant/20 p-5 flex flex-col justify-between border-t-4",
        theme.border,
        className
      )}>
        <div className="flex items-start justify-between mb-6">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", theme.iconBg)}>
            <Icon className={cn("w-5 h-5", theme.iconColor)} />
          </div>
          <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest text-right mt-1 ml-2 leading-tight">
            {title}
          </p>
        </div>
        <div>
          <h3 className="text-4xl font-black text-on-surface tracking-tight mb-2">{value}</h3>
          <div className={cn("w-full h-[2px] rounded-full mb-1", theme.barColor)} />
          {progressSubtitle && (
            <p className="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-widest leading-none">
              {progressSubtitle}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-surface-container-lowest rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-outline-variant/20 p-5 flex flex-col gap-4", className)}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-on-surface-variant">{title}</p>
          <h3 className="text-3xl font-black text-on-surface tracking-tight mt-0.5">{value}</h3>
        </div>
      </div>
      
      {(trend || trendLabel) && (
        <div className="flex items-center gap-1.5 mt-1">
          {trend && (
            <div className={cn(
              "flex items-center text-sm font-bold",
              trendDirection === 'up' ? "text-success" : 
              trendDirection === 'down' ? "text-error" : 
              "text-on-surface-variant"
            )}>
              {trendDirection === 'up' && <ArrowUpRight className="w-4 h-4 mr-0.5" />}
              {trendDirection === 'down' && <ArrowDownRight className="w-4 h-4 mr-0.5" />}
              <span>{trend}</span>
            </div>
          )}
          {trendLabel && (
            <span className="text-sm font-medium text-on-surface-variant">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
