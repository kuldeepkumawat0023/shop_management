const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  finalProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true // A product can only have one recipe
  },
  ingredients: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantityRequired: { // Amount needed to make 1 unit of final product
      type: Number,
      required: true
    }
  }],
  notes: {
    type: String
  }
}, { timestamps: true });

// Ensure unique recipe per shop per product
recipeSchema.index({ finalProductId: 1, shopId: 1 }, { unique: true });

module.exports = mongoose.model('Recipe', recipeSchema);
