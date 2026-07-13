const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a customer name'],
    trim: true
  },
  mobile: {
    type: String,
    required: [true, 'Please add a mobile number'],
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  notes: {
    type: String
  },
  address: {
    type: String
  },
  creditLimit: {
    type: Number,
    default: 0
  },
  dueAmount: {
    type: Number,
    default: 0
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Ensure mobile is unique per shop so we don't have duplicate customers
customerSchema.index({ mobile: 1, shopId: 1 }, { unique: true });

module.exports = mongoose.model('Customer', customerSchema);
