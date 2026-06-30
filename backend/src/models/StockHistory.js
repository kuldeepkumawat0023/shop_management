const mongoose = require('mongoose');

const stockHistorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  movementType: {
    type: String,
    enum: ['Purchase', 'Sale', 'Return', 'Damage', 'Adjustment', 'Production'],
    required: true
  },
  quantityChanged: {
    type: Number,
    required: true // Positive for inward (purchase, return), Negative for outward (sale, damage)
  },
  stockBefore: {
    type: Number,
    required: true
  },
  stockAfter: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId // Can refer to a SaleId, PurchaseId, or ReturnId
  },
  remarks: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('StockHistory', stockHistorySchema);
