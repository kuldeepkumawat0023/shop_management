'use client';

import React from 'react';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DetailViewSkeleton } from '@/components/common/DetailViewSkeleton';
import { ArrowLeft, Printer, Download, Share2, Receipt, Building2, Calendar, CreditCard, Tag, Edit, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { expenseService } from '@/lib/services/expense.services';
import { useTranslation } from 'react-i18next';
import ActionGuard from '@/components/auth/ActionGuard';
import { DeleteModal } from '@/components/common/DeleteModal';
import toast from 'react-hot-toast';

export default function ExpenseDetailView() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [expense, setExpense] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const { t } = useTranslation();

  React.useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await expenseService.getExpenseById(id);
        if (res.success) setExpense(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchExpense();
  }, [id]);

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const executeDelete = async () => {
    try {
      const res = await expenseService.deleteExpense(id);
      if (res.success || (res as any).status === 200) {
        toast.success(t('expenses.expenseDetail.expenseDeleted'));
        router.push('/expenses');
      } else {
        toast.error((res as any).message || t('expenses.expenseDetail.deleteFailed'));
      }
    } catch (err) {
      toast.error(t('expenses.expenseDetail.deleteError'), { id: 'error-deleting-expense' });
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) return <DetailViewSkeleton />;
  if (!expense) return <div className="p-8">{t('expenses.expenseDetail.notFound')}</div>;

  return (
    <div className="min-h-full flex-1 flex flex-col bg-background w-full min-w-0">
      {/* Header Sticky */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-outline-variant/20 p-4 md:p-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button onClick={() => router.back()} variant="outline" className="w-10 h-10 p-0 rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-on-surface tracking-tight">EXP-{expense._id.slice(-6).toUpperCase()}</h2>
                <StatusBadge status={expense.isActive ? 'Paid' : 'Pending'} />
              </div>
              <p className="text-sm font-medium text-on-surface-variant">{t('expenses.expenseDetail.loggedOn')}: {new Date(expense.expenseDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-semibold gap-2 rounded-xl">
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">{t('expenses.expenseDetail.print')}</span>
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-semibold gap-2 rounded-xl">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{t('expenses.expenseDetail.pdf')}</span>
            </Button>
            <ActionGuard permission="expenses.update">
              <Button variant="outline" className="flex-1 sm:flex-none border-outline-variant/30 text-on-surface-variant hover:text-primary hover:bg-primary/10 font-semibold gap-2 rounded-xl transition-colors">
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">{t('expenses.expenseDetail.edit')}</span>
              </Button>
            </ActionGuard>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 w-full flex flex-col gap-8">
        
        {/* Main Details Card */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/20 p-6 md:p-8 flex flex-col gap-8 relative overflow-hidden">
          {/* Amount Highlights */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-outline-variant/20">
            <div>
              <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">{t('expenses.expenseDetail.totalAmount')}</p>
              <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight">₹{expense.amount.toLocaleString()}</h1>
            </div>
            <div className="flex gap-4">
              <div className="bg-surface rounded-2xl p-4 border border-outline-variant/20 min-w-[120px]">
                <div className="flex items-center gap-2 text-on-surface-variant mb-1">
                  <Building2 className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">{t('expenses.expenseDetail.payee')}</span>
                </div>
                <p className="font-bold text-on-surface line-clamp-1">{expense.expenseName}</p>
              </div>
              <div className="bg-surface rounded-2xl p-4 border border-outline-variant/20 min-w-[120px]">
                <div className="flex items-center gap-2 text-on-surface-variant mb-1">
                  <Tag className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">{t('expenses.expenseDetail.category')}</span>
                </div>
                <p className="font-bold text-on-surface line-clamp-1">{expense.category}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                {t('expenses.expenseDetail.expenseDetails')}
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm text-on-surface-variant font-medium">{t('expenses.expenseDetail.description')}</p>
                  <p className="text-on-surface font-semibold mt-1 leading-relaxed">{expense.notes || t('expenses.expenseDetail.noDescription')}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                {t('expenses.expenseDetail.paymentInfo')}
              </h3>
              <div className="bg-surface rounded-2xl p-5 border border-outline-variant/20 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-on-surface-variant">{t('expenses.expenseDetail.paymentMethod')}</span>
                  <span className="font-bold text-on-surface">{expense.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-on-surface-variant">{t('expenses.expenseDetail.paymentDate')}</span>
                  <span className="font-bold text-on-surface flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-on-surface-variant" />
                    {new Date(expense.expenseDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20">
                  <span className="text-sm font-medium text-on-surface-variant">{t('expenses.expenseDetail.transactionRef')}</span>
                  <span className="font-mono text-sm font-bold text-on-surface">{expense._id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attachment Card */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/20 p-6 md:p-8 flex flex-col gap-6">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            {t('expenses.expenseDetail.receiptsAttachments', 'Receipts & Attachments')}
          </h3>
          {expense.receiptUrl ? (
            <div className="bg-surface border border-outline-variant/20 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px]">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-3 text-primary">
                <Receipt className="w-7 h-7" />
              </div>
              <p className="text-on-surface font-bold text-sm">Receipt Attachment</p>
              <a
                href={expense.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/30 text-primary hover:bg-primary/5 font-bold text-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                {t('expenses.expenseDetail.downloadReceipt', 'View / Download Receipt')}
              </a>
            </div>
          ) : (
            <div className="bg-surface/50 border border-dashed border-outline-variant/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center mb-2 text-on-surface-variant/50">
                <Receipt className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-on-surface-variant">No receipt attached to this expense</p>
              <p className="text-xs text-on-surface-variant/60 mt-0.5">Proof of payment can be kept for accounting records</p>
            </div>
          )}
        </div>

        {/* Delete Zone */}
        <div className="flex justify-end pt-4">
          <ActionGuard permission="expenses.delete">
            <Button onClick={() => setShowDeleteModal(true)} variant="ghost" className="text-error hover:bg-error/10 font-bold gap-2 rounded-xl">
              <Trash2 className="w-4 h-4" />
              {t('expenses.expenseDetail.deleteExpense')}
            </Button>
          </ActionGuard>
        </div>

      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={executeDelete}
        itemName={expense.expenseName || t('common.item')}
      />
    </div>
  );
}
