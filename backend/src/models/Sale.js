const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer' // Optional, could be a walk-in cash customer
  },
  userId: { // The Cashier/Manager who made the sale
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true,
    trim: true
  },
  saleDate: {
    type: Date,
    default: Date.now
  },
  totalAmount: {
    type: Number,
    required: true
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  netAmount: { // totalAmount - discount + tax
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Credit', 'Multiple'],
    default: 'Cash'
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Partial', 'Unpaid'],
    default: 'Paid'
  },
  totalProfit: { // Calculated at the time of sale
    type: Number,
    default: 0
  },
  isOfflineSynced: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Ensure invoice numbers are unique per shop
saleSchema.index({ invoiceNumber: 1, shopId: 1 }, { unique: true });

module.exports = mongoose.model('Sale', saleSchema);
