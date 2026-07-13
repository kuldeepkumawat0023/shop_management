'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Save, User, Briefcase, PhoneCall, RefreshCcw } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { cn } from '@/utils/cn';
import { teamMemberSchema } from '@/utils/validations';
import toast from 'react-hot-toast';
import { teamService } from '@/lib/services/team.services';
import { ViewPageSkeleton } from '@/components/common/ViewPageSkeleton';

export default function TeamMemberForm() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    position: '',
    department: '',
    joinDate: '',
    salary: '',
    status: 'Active',
    emergencyName: '',
    emergencyRelation: '',
    emergencyPhone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleClear = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      dob: '',
      position: '',
      department: '',
      joinDate: '',
      salary: '',
      status: 'Active',
      emergencyName: '',
      emergencyRelation: '',
      emergencyPhone: ''
    });
    setErrors({});
  };

  const fetchStaffData = async () => {
    if (!id) return;
    try {
      const res = await teamService.getStaffById(id);
      if (res.success && res.data) {
        const staff = res.data;
        setFormData({
          name: staff.name || '',
          email: staff.email || staff.userId?.email || '',
          phone: staff.mobile || '',
          dob: staff.dob || '',
          position: staff.role || '',
          department: staff.department || '',
          joinDate: staff.joiningDate ? new Date(staff.joiningDate).toISOString().split('T')[0] : '',
          salary: staff.baseSalary?.toString() || '',
          status: staff.isActive === false ? 'Inactive' : 'Active',
          emergencyName: staff.emergencyContact?.name || '',
          emergencyRelation: staff.emergencyContact?.relation || '',
          emergencyPhone: staff.emergencyContact?.phone || ''
        });
      }
    } catch (error) {
      toast.error('Failed to load team member data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submissionData = {
      ...formData,
      salary: Number(formData.salary) || 0
    };

    const validationResult = teamMemberSchema.safeParse(submissionData);
    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      for (const err of validationResult.error.issues) {
        if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
      }
      setErrors(newErrors);
      return toast.error('Please correct the errors / कृपया त्रुटियों को ठीक करें');
    }

    setSubmitting(true);
    const toastId = toast.loading(isEditMode ? 'Updating team member...' : 'Saving team member...');
    
    try {
      const apiPayload = {
        name: submissionData.name,
        email: submissionData.email,
        mobile: submissionData.phone,
        dob: submissionData.dob,
        role: submissionData.position,
        department: submissionData.department,
        joiningDate: submissionData.joinDate,
        baseSalary: submissionData.salary,
        isActive: submissionData.status !== 'Inactive',
        emergencyContact: {
          name: submissionData.emergencyName,
          relation: submissionData.emergencyRelation,
          phone: submissionData.emergencyPhone,
        }
      };

      if (isEditMode) {
        await teamService.updateStaff(id, apiPayload);
        toast.success('Team member updated successfully!', { id: toastId });
      } else {
        await teamService.addStaff(apiPayload);
        toast.success('Team member added successfully!', { id: toastId });
      }
      router.back();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save team member', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <ViewPageSkeleton />;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full ">
      {/* Header Sticky */}
      <div className="sticky top-16 md:top-20 z-20 bg-background border-b border-outline-variant/20 p-4 md:p-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button type="button" onClick={() => router.back()} variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface hover:text-primary hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">
              {isEditMode ? 'Edit Team Member / टीम सदस्य संपादित करें' : 'Add Team Member / टीम सदस्य जोड़ें'}
            </h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">
              {isEditMode ? 'Update employee details and job information' : 'Onboard a new employee to your organization'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 flex-1 w-full flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Personal Info */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">Personal Information / व्यक्तिगत जानकारी</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5 w-full col-span-1 sm:col-span-2">
                <label className="text-sm font-bold text-on-surface">Full Name / पूरा नाम <span className="text-error ml-1">*</span></label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Ravi Verma"
                  className={cn(
                    "w-full h-10 px-3 bg-surface border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all",
                    errors.name ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                  )}
                />
                {errors.name && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.name}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Email Address / ईमेल पता</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="ravi.v@example.com"
                  className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Phone Number / फ़ोन नंबर</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 11111"
                  className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Date of Birth / जन्म तिथि</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <PhoneCall className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">Emergency Contact / आपातकालीन संपर्क</h2>
            </div>
            
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-bold text-on-surface">Contact Name / संपर्क नाम</label>
                <input
                  name="emergencyName"
                  value={formData.emergencyName}
                  onChange={handleInputChange}
                  placeholder="e.g. Priya Verma"
                  className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Relationship / संबंध</label>
                  <input
                    name="emergencyRelation"
                    value={formData.emergencyRelation}
                    onChange={handleInputChange}
                    placeholder="e.g. Spouse"
                    className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Contact Phone / संपर्क फ़ोन</label>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 22222"
                    className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:border-primary/50 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Job Info */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <Briefcase className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">Job Details / नौकरी का विवरण</h2>
            </div>
            
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Role / Designation / पद <span className="text-error ml-1">*</span></label>
                  <select 
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className={cn(
                      "flex w-full h-10 rounded-xl bg-surface border px-3 text-sm text-on-surface focus:outline-none focus:ring-2 transition-all appearance-none",
                      errors.position ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                    )}
                  >
                    <option value="">Select role...</option>
                    <option value="Store Manager">Store Manager</option>
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Warehouse Staff">Warehouse Staff</option>
                    <option value="Delivery Agent">Delivery Agent</option>
                  </select>
                  {errors.position && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.position}</p>}
                </div>
                
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Department / विभाग</label>
                  <select 
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none"
                  >
                    <option value="">Select department...</option>
                    <option value="Management">Management</option>
                    <option value="Sales">Sales</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="Logistics">Logistics</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Joining Date / कार्यभार ग्रहण तिथि <span className="text-error ml-1">*</span></label>
                  <input
                    type="date"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full h-10 px-3 bg-surface border rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 transition-all",
                      errors.joinDate ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                    )}
                  />
                  {errors.joinDate && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.joinDate}</p>}
                </div>
                
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Base Salary (₹) / मूल वेतन <span className="text-error ml-1">*</span></label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g. 25000"
                    className={cn(
                      "w-full h-10 px-3 bg-surface border rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 transition-all",
                      errors.salary ? "border-error focus:border-error focus:ring-error/20" : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20"
                    )}
                  />
                  {errors.salary && <p className="text-[10px] text-error mt-1 font-bold tracking-tight px-1">{errors.salary}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Employee Status / कर्मचारी की स्थिति</label>
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-4 pt-6 border-t border-outline-variant/20">
          <Button type="button" onClick={handleClear} variant="ghost" className="w-full sm:w-auto text-on-surface-variant hover:text-error flex items-center justify-center gap-2">
            <RefreshCcw className="w-4 h-4" />
            Clear Form
          </Button>
          <Button type="button" onClick={() => router.back()} variant="outline" className="w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-bold tracking-wide shadow-sm">
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} className="w-full sm:w-auto gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 rounded-xl disabled:opacity-50">
            <Save className="w-4 h-4" />
            <span className="font-bold tracking-wide">{submitting ? 'Saving...' : 'Save Member'}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
