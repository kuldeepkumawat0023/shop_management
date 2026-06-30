const mongoose = require('mongoose');

const damageSchema = new mongoose.Schema({
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
  damageDate: {
    type: Date,
    default: Date.now
  },
  lossAmount: { // purchasePrice * quantity (Calculated automatically)
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Damage', damageSchema);
