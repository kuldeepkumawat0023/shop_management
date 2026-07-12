'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowLeft, Save, User, Briefcase, PhoneCall } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TeamMemberForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    role: '',
    department: '',
    joinDate: '',
    salary: '',
    status: 'Active',
    emergencyName: '',
    emergencyRelation: '',
    emergencyPhone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface hover:text-primary hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">Add Team Member</h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">Onboard a new employee to your organization</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button onClick={() => router.back()} variant="outline" className="flex-1 sm:flex-none w-full sm:w-auto rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-bold tracking-wide shadow-sm">
            Cancel
          </Button>
          <Button className="flex-1 sm:flex-none gradient-button text-white border-none shadow-lg shadow-primary/20 gap-2 rounded-xl">
            <Save className="w-4 h-4" />
            <span className="font-bold tracking-wide">Save Member</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Personal Info */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="e.g. Ravi"
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="e.g. Verma"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="ravi.v@example.com"
              />
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 98765 11111"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Date of Birth"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <PhoneCall className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">Emergency Contact</h2>
            </div>
            
            <div className="flex flex-col gap-5">
              <Input
                label="Contact Name"
                name="emergencyName"
                value={formData.emergencyName}
                onChange={handleInputChange}
                placeholder="e.g. Priya Verma"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Relationship"
                  name="emergencyRelation"
                  value={formData.emergencyRelation}
                  onChange={handleInputChange}
                  placeholder="e.g. Spouse"
                />
                <Input
                  label="Contact Phone"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 22222"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Job Info */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <Briefcase className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-on-surface">Job Details</h2>
            </div>
            
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Role / Designation</label>
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="flex w-full h-10 rounded-xl bg-surface border border-outline-variant/30 px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none"
                  >
                    <option value="">Select role...</option>
                    <option value="Store Manager">Store Manager</option>
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Warehouse Staff">Warehouse Staff</option>
                    <option value="Delivery Agent">Delivery Agent</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Department</label>
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
                <Input
                  label="Joining Date"
                  name="joinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={handleInputChange}
                />
                
                <Input
                  label="Base Salary (₹)"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="e.g. 25000"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-bold text-on-surface">Employee Status</label>
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
    </div>
  );
}
