const Product = require('../models/Product');
const StockHistory = require('../models/StockHistory');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

exports.createProduct = async (req, res, next) => {
  try {
    const productData = { ...req.body, shopId: req.scopedShopId };
    
    // Default current stock to opening stock
    if (productData.openingStock) {
      productData.currentStock = productData.openingStock;
    }

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'shop_management/products', 'image');
      productData.image = result.secure_url;
    }

    const product = await Product.create(productData);

    // If opening stock is greater than 0, create an initial stock history log
    if (product.currentStock > 0) {
      await StockHistory.create({
        productId: product._id,
        shopId: req.scopedShopId,
        movementType: 'Adjustment',
        quantityChanged: product.currentStock,
        stockBefore: 0,
        stockAfter: product.currentStock,
        userId: req.user.id,
        remarks: 'Initial Opening Stock'
      });
    }

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Barcode or SKU already exists in this shop' });
    }
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ shopId: req.scopedShopId, isActive: true })
      .populate('categoryId', 'name')
      .populate('brandId', 'name')
      .sort('-createdAt');
      
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

exports.getProductByBarcode = async (req, res, next) => {
  try {
    const product = await Product.findOne({ barcode: req.params.barcode, shopId: req.scopedShopId, isActive: true })
      .populate('categoryId', 'name')
      .populate('brandId', 'name');

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findOne({ _id: req.params.id, shopId: req.scopedShopId });
    if (!product || !product.isActive) return res.status(404).json({ success: false, message: 'Product not found' });

    const updateData = { ...req.body };
    delete updateData.currentStock; // Prevent manual stock manipulation via normal update route

    if (req.file) {
      if (product.image) await deleteFromCloudinary(product.image);
      const result = await uploadToCloudinary(req.file.buffer, 'shop_management/products', 'image');
      updateData.image = result.secure_url;
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Barcode or SKU already exists' });
    next(error);
  }
};

exports.adjustStock = async (req, res, next) => {
  try {
    const { quantityChanged, remarks } = req.body;
    
    if (!quantityChanged) return res.status(400).json({ success: false, message: 'Quantity changed is required' });

    const product = await Product.findOne({ _id: req.params.id, shopId: req.scopedShopId });
    if (!product || !product.isActive) return res.status(404).json({ success: false, message: 'Product not found' });

    const stockBefore = product.currentStock;
    product.currentStock = stockBefore + Number(quantityChanged);
    await product.save();

    await StockHistory.create({
      productId: product._id,
      shopId: req.scopedShopId,
      movementType: 'Adjustment',
      quantityChanged: Number(quantityChanged),
      stockBefore,
      stockAfter: product.currentStock,
      userId: req.user.id,
      remarks: remarks || 'Manual Adjustment'
    });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, shopId: req.scopedShopId });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    product.isActive = false;
    await product.save();
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getProductStockHistory = async (req, res, next) => {
  try {
    const history = await StockHistory.find({ 
      productId: req.params.id, 
      shopId: req.scopedShopId 
    })
    .populate('userId', 'firstName lastName email')
    .sort('-createdAt');

    res.status(200).json({ success: true, count: history.length, data: history });
  } catch (error) {
    next(error);
  }
};
