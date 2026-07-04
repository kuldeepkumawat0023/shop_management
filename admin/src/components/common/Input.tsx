import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, leftIcon, rightIcon, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-bold text-on-surface">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative w-full text-on-surface">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant flex items-center justify-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 py-2 text-sm text-on-surface",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-on-surface-variant/50",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all",
              "disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon ? "pl-10" : "",
              rightIcon ? "pr-10" : "",
              error ? "border-error focus:ring-error/20 focus:border-error" : "",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
