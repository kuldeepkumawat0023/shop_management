const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
    unique: true
  },
  invoicePrefix: {
    type: String,
    default: 'INV-'
  },
  taxType: {
    type: String,
    enum: ['GST', 'VAT', 'None'],
    default: 'GST'
  },
  currencySymbol: {
    type: String,
    default: '₹'
  },
  printFormat: {
    type: String,
    enum: ['A4', 'Thermal-80mm', 'Thermal-58mm'],
    default: 'Thermal-80mm'
  },
  termsAndConditions: {
    type: String,
    default: 'Thank you for your business!'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
