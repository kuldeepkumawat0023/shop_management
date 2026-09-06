const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expenseName: {
    type: String,
    required: [true, 'Please add expense name'],
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true,
    default: 'Miscellaneous'
  },
  expenseDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'UPI', 'Bank Transfer', 'Card', 'Other'],
    default: 'Cash'
  },
  receiptUrl: {
    type: String,
    trim: true
  },
  notes: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
