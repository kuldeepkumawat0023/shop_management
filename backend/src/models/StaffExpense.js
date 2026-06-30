const mongoose = require('mongoose');

const staffExpenseSchema = new mongoose.Schema({
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
  expenseCategory: {
    type: String,
    enum: ['Travel', 'Food', 'Fuel', 'Supplies', 'Other'],
    default: 'Other'
  },
  expenseDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Reimbursed'],
    default: 'Pending'
  },
  notes: {
    type: String
  },
  receiptUrl: {
    type: String
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('StaffExpense', staffExpenseSchema);
