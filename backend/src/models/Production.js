const mongoose = require('mongoose');

const productionSchema = new mongoose.Schema({
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
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  finalProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantityProduced: {
    type: Number,
    required: true,
    min: 1
  },
  productionDate: {
    type: Date,
    default: Date.now
  },
  totalCost: { // Sum of (ingredient purchasePrice * qty used)
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Production', productionSchema);
