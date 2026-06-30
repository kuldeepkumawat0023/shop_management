const mongoose = require('mongoose');

const purchaseItemSchema = new mongoose.Schema({
  purchaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Purchase',
    required: true
  },
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
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  purchasePrice: {
    type: Number,
    required: true
  },
  gstRate: {
    type: Number,
    default: 0
  },
  totalPrice: { // quantity * purchasePrice
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('PurchaseItem', purchaseItemSchema);
