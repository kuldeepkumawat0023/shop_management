const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, 'Please add a full name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't return password by default
  },
  countryCode: {
    type: String,
    default: '+91'
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please add a phone number'],
  },
  profilePhoto: {
    type: String,
  },
  personalDetail: {
    dob: { type: String, default: '' },
    gender: { type: String, default: '' },
  },
  // ─── Shop Management Specific Fields ───
  role: {
    type: String,
    enum: ['super_admin', 'shop_owner', 'manager', 'staff'],
    default: 'staff'
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    default: null, // null for super_admin
  },
  adminRole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminRole' // For advanced granular permissions
  },
  // ───────────────────────────────────────
  isActive: {
    type: Boolean,
    default: true
  },
  isOtpVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  notificationPreferences: {
    stockAlerts: { type: Boolean, default: true },
    payrollUpdates: { type: Boolean, default: true },
    accountSecurity: { type: Boolean, default: true },
  }
}, { 
  timestamps: true 
});

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
