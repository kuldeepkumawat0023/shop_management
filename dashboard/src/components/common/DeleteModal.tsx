import React from 'react';
import { ConfirmModal } from './ConfirmModal';
import { useTranslation } from 'react-i18next';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export function DeleteModal({ isOpen, onClose, onConfirm, itemName }: DeleteModalProps) {
  const { t } = useTranslation();

  // Using optional chaining or default fallbacks for translations in case they aren't defined yet
  const title = t('common.delete', 'Delete') + ' ' + itemName;
  const message = `${t('common.deleteConfirmation', 'Are you sure you want to delete this')} ${itemName}? ${t('common.cannotBeUndone', 'This action cannot be undone.')}`;
  
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      type="danger"
      title={title}
      message={message}
      confirmText={t('common.delete', 'Delete')}
      cancelText={t('common.cancel', 'Cancel')}
    />
  );
}
