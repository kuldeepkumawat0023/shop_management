'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Printer, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { usePermissions } from '@/hooks/usePermissions';
import { cn } from '@/utils/cn';

export interface ActionItemConfig {
  href?: string;
  onClick?: () => void;
  permission?: string;
  title?: string;
  disabled?: boolean;
}

export interface CustomActionConfig {
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  permission?: string;
  title?: string;
  className?: string;
  disabled?: boolean;
}

export interface ActionButtonsProps {
  /**
   * Module name (e.g., 'purchases', 'sales', 'products', 'customers', 'suppliers')
   * Automatically derives permissions:
   * - View/Print: `${module}.view`
   * - Edit: `${module}.update`
   * - Delete: `${module}.delete`
   */
  module?: string;

  /**
   * View Action Configuration
   */
  view?: ActionItemConfig | boolean;

  /**
   * Print / Receipt Action Configuration
   */
  print?: ActionItemConfig | boolean;

  /**
   * Edit Action Configuration
   */
  edit?: ActionItemConfig | boolean;

  /**
   * Delete Action Configuration
   */
  delete?: ActionItemConfig | boolean;

  /**
   * Extra custom action buttons
   */
  customActions?: CustomActionConfig[];

  className?: string;
}

export function ActionButtons({
  module,
  view,
  print,
  edit,
  delete: deleteAction,
  customActions,
  className
}: ActionButtonsProps) {
  const { hasPermission } = usePermissions();

  // Helper to check permission
  const checkPermission = (actionPermission?: string, defaultAction?: string): boolean => {
    // 1. Explicit permission on the button takes highest precedence
    if (actionPermission) {
      return hasPermission(actionPermission);
    }
    // 2. Derive permission from module name if present
    if (module && defaultAction) {
      return hasPermission(`${module}.${defaultAction}`);
    }
    // 3. If no permission or module specified, allow access
    return true;
  };

  // 1. View Button
  const renderViewButton = () => {
    if (!view) return null;
    const config: ActionItemConfig = typeof view === 'boolean' ? {} : view;
    
    if (!checkPermission(config.permission, 'view')) {
      return null;
    }

    const button = (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={config.onClick}
        disabled={config.disabled}
        title={config.title || 'View Details / विवरण देखें'}
        className="h-8 w-8 rounded-xl text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
      >
        <Eye className="w-4 h-4" />
      </Button>
    );

    return config.href ? <Link href={config.href}>{button}</Link> : button;
  };

  // 2. Print Button
  const renderPrintButton = () => {
    if (!print) return null;
    const config: ActionItemConfig = typeof print === 'boolean' ? {} : print;

    if (!checkPermission(config.permission, 'view')) {
      return null;
    }

    const button = (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={config.onClick}
        disabled={config.disabled}
        title={config.title || 'Print / प्रिंट करें'}
        className="h-8 w-8 rounded-xl text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
      >
        <Printer className="w-4 h-4" />
      </Button>
    );

    return config.href ? <Link href={config.href}>{button}</Link> : button;
  };

  // 3. Edit Button
  const renderEditButton = () => {
    if (!edit) return null;
    const config: ActionItemConfig = typeof edit === 'boolean' ? {} : edit;

    if (!checkPermission(config.permission, 'update')) {
      return null;
    }

    const button = (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={config.onClick}
        disabled={config.disabled}
        title={config.title || 'Edit / संपादन करें'}
        className="h-8 w-8 rounded-xl text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
      >
        <Edit className="w-4 h-4" />
      </Button>
    );

    return config.href ? <Link href={config.href}>{button}</Link> : button;
  };

  // 4. Delete Button
  const renderDeleteButton = () => {
    if (!deleteAction) return null;
    const config: ActionItemConfig = typeof deleteAction === 'boolean' ? {} : deleteAction;

    if (!checkPermission(config.permission, 'delete')) {
      return null;
    }

    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={config.onClick}
        disabled={config.disabled}
        title={config.title || 'Delete / हटाएं'}
        className="h-8 w-8 rounded-xl text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    );
  };

  // 5. Custom Actions
  const renderCustomActions = () => {
    if (!customActions || customActions.length === 0) return null;

    return customActions.map((action, idx) => {
      if (action.permission && !hasPermission(action.permission)) {
        return null;
      }

      const button = (
        <Button
          key={idx}
          type="button"
          variant="ghost"
          size="icon"
          onClick={action.onClick}
          disabled={action.disabled}
          title={action.title}
          className={cn("h-8 w-8 rounded-xl text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors", action.className)}
        >
          {action.icon}
        </Button>
      );

      return action.href ? <Link key={idx} href={action.href}>{button}</Link> : button;
    });
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {renderViewButton()}
      {renderPrintButton()}
      {renderEditButton()}
      {renderCustomActions()}
      {renderDeleteButton()}
    </div>
  );
}

export default ActionButtons;
