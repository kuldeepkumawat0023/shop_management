'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Printer, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import ActionGuard from '@/components/auth/ActionGuard';
import { cn } from '@/utils/cn';

export interface TableRowActionsProps {
  viewHref?: string;
  onView?: () => void;
  viewTitle?: string;

  printHref?: string;
  onPrint?: () => void;
  printTitle?: string;

  editHref?: string;
  onEdit?: () => void;
  editPermission?: string;
  editTitle?: string;

  onDelete?: () => void;
  deletePermission?: string;
  deleteTitle?: string;

  customActions?: React.ReactNode;
  className?: string;
}

export function TableRowActions({
  viewHref,
  onView,
  viewTitle = 'View Details',

  printHref,
  onPrint,
  printTitle = 'Print / Receipt',

  editHref,
  onEdit,
  editPermission,
  editTitle = 'Edit',

  onDelete,
  deletePermission,
  deleteTitle = 'Delete',

  customActions,
  className
}: TableRowActionsProps) {
  // Render View Button
  const renderViewButton = () => {
    if (!viewHref && !onView) return null;
    const content = (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onView}
        title={viewTitle}
        className="h-8 w-8 rounded-xl text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
      >
        <Eye className="w-4 h-4" />
      </Button>
    );

    if (viewHref) {
      return <Link href={viewHref}>{content}</Link>;
    }
    return content;
  };

  // Render Print Button
  const renderPrintButton = () => {
    if (!printHref && !onPrint) return null;
    const content = (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onPrint}
        title={printTitle}
        className="h-8 w-8 rounded-xl text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
      >
        <Printer className="w-4 h-4" />
      </Button>
    );

    if (printHref) {
      return <Link href={printHref}>{content}</Link>;
    }
    return content;
  };

  // Render Edit Button
  const renderEditButton = () => {
    if (!editHref && !onEdit) return null;
    const content = (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onEdit}
        title={editTitle}
        className="h-8 w-8 rounded-xl text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
      >
        <Edit className="w-4 h-4" />
      </Button>
    );

    const buttonElement = editHref ? <Link href={editHref}>{content}</Link> : content;

    if (editPermission) {
      return <ActionGuard permission={editPermission}>{buttonElement}</ActionGuard>;
    }
    return buttonElement;
  };

  // Render Delete Button
  const renderDeleteButton = () => {
    if (!onDelete) return null;
    const content = (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onDelete}
        title={deleteTitle}
        className="h-8 w-8 rounded-xl text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    );

    if (deletePermission) {
      return <ActionGuard permission={deletePermission}>{content}</ActionGuard>;
    }
    return content;
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {renderViewButton()}
      {renderPrintButton()}
      {renderEditButton()}
      {customActions}
      {renderDeleteButton()}
    </div>
  );
}
