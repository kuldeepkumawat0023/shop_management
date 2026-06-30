const mongoose = require('mongoose');

const customRoleSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    default: null // null if created globally by super_admin
  },
  roleName: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  description: {
    type: String
  },
  permissions: [{
    type: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('CustomRole', customRoleSchema);
