import React from 'react';
import { cn } from '@/utils/cn';
import { LucideIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  
  // Default variant props
  trend?: string;
  trendDirection?: 'up' | 'down';
  trendLabel?: string;
  
  // Splash variant props
  variant?: 'default' | 'splash';
  colorTheme?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'blue' | 'yellow' | 'purple' | 'green' | 'orange';
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
  colorTheme = 'primary',
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
            <StatusBadge variant="soft" status={badgeText} colorTheme={colorTheme as any} className="mt-1" />
          )}
        </div>
        
        <div className="relative z-10 flex flex-col mt-2">
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{title}</p>
          <h3 className="text-3xl font-black text-on-surface tracking-tight mt-1">{value}</h3>
        </div>
      </div>
    );
  }

  // Default variant (Dashboard KPI Card Style)
  const getThemeStyles = () => {
    switch (colorTheme) {
      case 'secondary': return { bgLight: 'bg-secondary/10', text: 'text-secondary' };
      case 'success': return { bgLight: 'bg-success/10', text: 'text-success' };
      case 'warning': return { bgLight: 'bg-warning/10', text: 'text-warning' };
      case 'error': return { bgLight: 'bg-error/10', text: 'text-error' };
      case 'blue': return { bgLight: 'bg-[#4f46e5]/10', text: 'text-[#4f46e5]' };
      case 'yellow': return { bgLight: 'bg-[#f59e0b]/10', text: 'text-[#f59e0b]' };
      case 'purple': return { bgLight: 'bg-[#a855f7]/10', text: 'text-[#a855f7]' };
      case 'green': return { bgLight: 'bg-[#10b981]/10', text: 'text-[#10b981]' };
      case 'orange': return { bgLight: 'bg-[#f97316]/10', text: 'text-[#f97316]' };
      default: return { bgLight: 'bg-primary/10', text: 'text-primary' };
    }
  };
  const theme = getThemeStyles();

  return (
    <div className={cn("group relative bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/50 hover:border-primary/50 p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300", className)}>
      <div className="flex items-start gap-4 mb-3">
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", theme.bgLight, theme.text)}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <span className="text-on-surface-variant font-medium text-xs">{title}</span>
          <h3 className="text-2xl font-bold text-on-surface">{value}</h3>
        </div>
      </div>
      
      {(trend || trendLabel) && (
        <div className="flex items-center gap-1.5 text-[11px]">
          {trend && (
            <span className={cn(
              "flex items-center font-semibold",
              trendDirection === 'up' ? "text-success" : 
              trendDirection === 'down' ? "text-error" : 
              "text-on-surface-variant"
            )}>
              {trendDirection === 'up' && <ArrowUp className="w-3 h-3 mr-0.5" />}
              {trendDirection === 'down' && <ArrowDown className="w-3 h-3 mr-0.5" />}
              {trend}
            </span>
          )}
          {trendLabel && (
            <span className="text-muted-foreground uppercase tracking-widest text-[9px] font-bold">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
