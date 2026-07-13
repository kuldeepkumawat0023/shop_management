const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a supplier name'],
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
  contactPerson: {
    type: String,
    trim: true
  },
  paymentTerms: {
    type: String,
    trim: true
  },
  notes: {
    type: String
  },
  address: {
    type: String
  },
  gstNumber: {
    type: String,
    trim: true,
    uppercase: true
  },
  balance: { // Amount we owe to the supplier (Due)
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

supplierSchema.index({ mobile: 1, shopId: 1 }, { unique: true });

module.exports = mongoose.model('Supplier', supplierSchema);
