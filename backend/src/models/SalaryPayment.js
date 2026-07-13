const mongoose = require('mongoose');

const salaryPaymentSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  month: {
    type: String, // e.g. "July 2026"
    required: true
  },
  year: {
    type: String,
    required: true
  },
  baseSalary: {
    type: Number,
    required: true,
    min: 0
  },
  bonus: {
    type: Number,
    default: 0,
    min: 0
  },
  deductions: {
    type: Number,
    default: 0,
    min: 0
  },
  netSalary: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Bank Transfer', 'UPI', 'Cheque', 'Cash'],
    default: 'Bank Transfer'
  },
  paymentDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Paid'
  },
  notes: {
    type: String
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Prevent duplicate salaries for the same month/year for a staff member
salaryPaymentSchema.index({ staffId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('SalaryPayment', salaryPaymentSchema);
