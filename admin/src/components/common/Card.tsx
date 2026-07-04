import * as React from 'react';
import { cn } from '@/utils/cn';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 relative overflow-hidden',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const GlassCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'glass-card rounded-[20px]',
      className
    )}
    {...props}
  />
));
GlassCard.displayName = 'GlassCard';

export { Card, GlassCard };
