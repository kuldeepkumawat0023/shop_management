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
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  mobile: {
    type: String,
    required: true
  },
  dob: {
    type: String
  },
  role: {
    type: String, // e.g. Cashier, Helper, Manager
    required: true
  },
  department: {
    type: String
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
  emergencyContact: {
    name: { type: String, default: '' },
    relation: { type: String, default: '' },
    phone: { type: String, default: '' }
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
