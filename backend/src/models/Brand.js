const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a brand name'],
    trim: true
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  contactPerson: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Compound index for uniqueness per shop
brandSchema.index({ name: 1, shopId: 1 }, { unique: true });

module.exports = mongoose.model('Brand', brandSchema);
