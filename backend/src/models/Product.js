const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  sku: {
    type: String,
    trim: true,
    uppercase: true
  },
  barcode: {
    type: String,
    required: [true, 'Barcode is required for POS'],
    trim: true
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand'
  },
  purchasePrice: {
    type: Number,
    required: [true, 'Purchase price is required for profit calculation']
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Selling price is required']
  },
  mrp: {
    type: Number
  },
  gstRate: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: 'Pcs'
  },
  openingStock: {
    type: Number,
    default: 0
  },
  currentStock: {
    type: Number,
    default: 0
  },
  minStock: {
    type: Number,
    default: 5
  },
  batchNumber: {
    type: String,
    trim: true
  },
  manufacturingDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  },
  image: {
    type: String
  },
  description: {
    type: String
  },
  isRawMaterial: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Ensure barcodes are unique per shop
productSchema.index({ barcode: 1, shopId: 1 }, { unique: true });
// Ensure SKUs are unique per shop (if provided)
productSchema.index({ sku: 1, shopId: 1 }, { unique: true, partialFilterExpression: { sku: { $exists: true, $ne: "" } } });

module.exports = mongoose.model('Product', productSchema);
