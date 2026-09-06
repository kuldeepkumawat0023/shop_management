'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ArrowLeft, User, Phone, Mail, Building, Edit, Trash2, CalendarOff, IndianRupee, Clock, Briefcase, CalendarHeart } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { teamService, StaffData } from '@/lib/services/team.services';
import { useTranslation } from 'react-i18next';
import { ViewPageSkeleton } from '@/components/common/ViewPageSkeleton';
import toast from 'react-hot-toast';
import Link from 'next/link';
import ActionGuard from '@/components/auth/ActionGuard';
import { DeleteModal } from '@/components/common/DeleteModal';

export default function TeamMemberDetailView() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [staff, setStaff] = useState<StaffData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStaffData = async () => {
    if (!id) return;
    try {
      const res = await teamService.getStaffById(id);
      if (res.success && res.data) {
        setStaff(res.data);
      }
    } catch (error) {
      toast.error(t('hr.teamMemberDetail.loadError'), { id: 'failed-to-load-team-member-det' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, [id]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const executeDelete = async () => {
    try {
      const res = await teamService.deleteStaff(id);
      if (res.success) {
        toast.success(t('hr.teamMemberDetail.memberDeleted'));
        router.push('/team');
      } else {
        toast.error(res.message || t('hr.teamMemberDetail.deleteFailed'));
      }
    } catch (error) {
      toast.error(t('hr.teamMemberDetail.deleteFailed'), { id: 'failed-to-remove-staff-member' });
    } finally {
      setShowDeleteModal(false);
    }
  };

  const recentActivity: any[] = [];

  if (loading) return <ViewPageSkeleton />;
  if (!staff) return <div className="p-8 text-center text-on-surface-variant">{t('hr.teamMemberDetail.notFound')}</div>;

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
                <h2 className="text-2xl font-black text-on-surface tracking-tight">{staff.name}</h2>
                <StatusBadge status={staff.isActive !== false ? t('hr.teamMemberDetail.active') : t('hr.teamMemberDetail.inactive')} />
              </div>
              <p className="text-sm font-medium text-on-surface-variant">
                {staff.role} {staff.department ? `(${staff.department})` : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <ActionGuard permission="team.update">
              <Link href={`/team/${id}/edit`} className="flex-1 sm:flex-none">
                <Button variant="outline" className="w-full border-outline-variant/30 text-on-surface-variant hover:text-primary hover:bg-primary/10 font-semibold gap-2 rounded-xl transition-colors">
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('hr.teamMemberDetail.editDetails')}</span>
                </Button>
              </Link>
            </ActionGuard>
            <ActionGuard permission="team.delete">
              <Button variant="outline" onClick={() => setShowDeleteModal(true)} className="flex-1 sm:flex-none border-outline-variant/30 text-error hover:bg-error/10 font-semibold gap-2 rounded-xl transition-colors">
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">{t('hr.teamMemberDetail.terminate')}</span>
              </Button>
            </ActionGuard>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 w-full flex flex-col gap-6">
        
        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Clock className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">{t('hr.teamMemberDetail.tenure')}</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">
              {staff.joiningDate ? (() => {
                const diff = (new Date().getTime() - new Date(staff.joiningDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
                return `${diff.toFixed(1)} ${t('hr.teamMemberDetail.yrs')}`;
              })() : 'N/A'}
            </p>
            <p className="text-sm text-primary font-bold">{t('hr.teamMemberDetail.joined')} {staff.joiningDate ? new Date(staff.joiningDate).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-success/5 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <IndianRupee className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">{t('hr.teamMemberDetail.baseSalary')}</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">₹{staff.baseSalary || 0}</p>
            <p className="text-sm text-on-surface-variant font-medium">{t('hr.teamMemberDetail.perMonth')}</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-warning/5 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <CalendarHeart className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">{t('hr.teamMemberDetail.leaveBalance')}</h3>
            </div>
            <p className="text-3xl font-black text-on-surface tracking-tight">12</p>
            <p className="text-sm text-warning font-bold">{t('hr.teamMemberDetail.availableLeaves')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-2">
                <User className="w-5 h-5 text-primary" />
                Contact Info
              </h3>
              
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('hr.teamMemberDetail.email')}</span>
                    {staff.email ? (
                      <a href={`mailto:${staff.email}`} className="font-semibold text-primary hover:underline">{staff.email}</a>
                    ) : (
                      <span className="font-semibold text-on-surface-variant">{t('hr.teamMemberDetail.notProvided')}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('hr.teamMemberDetail.phone')}</span>
                    <a href={`tel:${staff.mobile}`} className="font-semibold text-on-surface">{staff.mobile}</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('hr.teamMemberDetail.department')}</span>
                    <span className="font-semibold text-on-surface">{staff.department || 'Not assigned'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant/20 pb-2 flex items-center gap-2">
                <Building className="w-4 h-4 text-primary" />
                Emergency Contact
              </h3>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-on-surface-variant">{t('hr.teamMemberDetail.name')}</span>
                  <span className="text-sm font-bold text-on-surface">{staff.emergencyContact?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-on-surface-variant">{t('hr.teamMemberDetail.relation')}</span>
                  <span className="text-sm font-bold text-on-surface">{staff.emergencyContact?.relation || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-on-surface-variant">{t('hr.teamMemberDetail.contactPhone')}</span>
                  <span className="text-sm font-bold text-on-surface">{staff.emergencyContact?.phone || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-outline-variant/20">
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <CalendarOff className="w-5 h-5 text-primary" />
                  Recent Activity & Leaves
                </h3>
                <Button variant="ghost" className="text-primary font-bold hover:bg-primary/10 rounded-lg">{t('hr.teamMemberDetail.viewAll')}</Button>
              </div>

              {recentActivity.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {recentActivity.map((act) => (
                    <div key={act.id} className="flex items-center justify-between p-4 rounded-2xl bg-surface hover:bg-surface-container transition-colors border border-outline-variant/10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          {act.type === 'Payroll' ? <IndianRupee className="w-5 h-5 text-primary" /> : <CalendarOff className="w-5 h-5 text-primary" />}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{act.type} • {act.date}</p>
                          <p className="text-sm text-on-surface-variant font-medium">{act.details}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <StatusBadge status={act.status} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
                    <CalendarOff className="w-8 h-8 text-on-surface-variant/50" />
                  </div>
                  <p className="text-lg font-bold text-on-surface mb-1">{t('hr.teamMemberDetail.noActivity')}</p>
                  <p className="text-sm text-on-surface-variant">{t('hr.teamMemberDetail.noActivityMsg')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={executeDelete}
        itemName={staff.name || t('common.item')}
      />
    </div>
  );
}
