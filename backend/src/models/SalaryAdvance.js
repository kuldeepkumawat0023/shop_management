const mongoose = require('mongoose');

const salaryAdvanceSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  advanceDate: {
    type: Date,
    default: Date.now
  },
  deductedFromSalary: {
    type: Boolean,
    default: false
  },
  deductionMonth: {
    type: String // e.g. "2023-10"
  },
  repaymentTerm: {
    type: String,
    enum: ['Next Salary', 'EMI'],
    default: 'Next Salary'
  },
  emiAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Approved', 'Pending', 'Rejected', 'Settled'],
    default: 'Approved'
  },
  reason: {
    type: String
  },
  notes: {
    type: String
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('SalaryAdvance', salaryAdvanceSchema);
