const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  userId: { // Who performed the action
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String, // e.g. 'DELETE_SALE', 'UPDATE_SETTINGS', 'MANUAL_STOCK_CHANGE'
    required: true
  },
  entityType: {
    type: String, // e.g. 'Sale', 'Product', 'Settings'
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId
  },
  previousData: {
    type: mongoose.Schema.Types.Mixed // JSON snapshot of what it was
  },
  newData: {
    type: mongoose.Schema.Types.Mixed // JSON snapshot of what it became
  },
  ipAddress: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
