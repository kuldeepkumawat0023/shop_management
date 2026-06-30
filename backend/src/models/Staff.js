const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Link to login account if they have one
  },
  name: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  role: {
    type: String, // e.g. Cashier, Helper, Manager
    required: true
  },
  baseSalary: {
    type: Number,
    required: true,
    default: 0
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  documents: [{
    docType: String, // e.g. Aadhar, PAN
    docUrl: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Prevent duplicate mobile numbers for staff within a shop
staffSchema.index({ shopId: 1, mobile: 1 }, { unique: true });

module.exports = mongoose.model('Staff', staffSchema);
