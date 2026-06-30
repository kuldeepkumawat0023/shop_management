const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['CUSTOMER_RETURN', 'SUPPLIER_RETURN'],
    required: true
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    // Could refer to a SaleId or PurchaseId
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  reason: {
    type: String,
    required: true
  },
  amountRefunded: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Return', returnSchema);
