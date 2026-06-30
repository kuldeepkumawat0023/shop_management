const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  saleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale',
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
  sellingPrice: {
    type: Number,
    required: true
  },
  purchasePrice: { // Captured at time of sale to lock profit margin accurately
    type: Number,
    required: true
  },
  gstRate: {
    type: Number,
    default: 0
  },
  totalPrice: { // quantity * sellingPrice
    type: Number,
    required: true
  },
  itemProfit: { // (sellingPrice - purchasePrice) * quantity
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('SaleItem', saleItemSchema);
