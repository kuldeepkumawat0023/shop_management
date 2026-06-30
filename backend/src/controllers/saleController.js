const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const SaleItem = require('../models/SaleItem');
const Product = require('../models/Product');
const StockHistory = require('../models/StockHistory');
const Customer = require('../models/Customer');
const { generateInvoicePDF } = require('../services/pdfService');

// Helper function to process a single sale (used for both online and offline sync)
const processSingleSale = async (saleData, shopId, userId, session) => {
  const { customerId, invoiceNumber, saleDate, items, discountAmount, taxAmount, paidAmount, paymentMethod } = saleData;

  // Validate items
  if (!items || items.length === 0) {
    throw new Error('Items array is required for a sale');
  }

  let totalAmount = 0;
  let totalProfit = 0;
  const saleItemsData = [];

  // Pre-fetch all products
  const productIds = items.map(item => item.productId);
  const products = await Product.find({ _id: { $in: productIds }, shopId }).session(session);
  const productMap = {};
  products.forEach(p => (productMap[p._id.toString()] = p));

  for (const item of items) {
    const product = productMap[item.productId.toString()];
    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }

    if (product.currentStock < item.quantity) {
      throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.currentStock}`);
    }

    const itemTotal = item.quantity * item.sellingPrice;
    const itemProfit = (item.sellingPrice - product.purchasePrice) * item.quantity;
    
    totalAmount += itemTotal;
    totalProfit += itemProfit;

    saleItemsData.push({
      productId: product._id,
      shopId,
      quantity: item.quantity,
      sellingPrice: item.sellingPrice,
      purchasePrice: product.purchasePrice, // Lock the purchase price at time of sale
      gstRate: item.gstRate || 0,
      totalPrice: itemTotal,
      itemProfit
    });
  }

  const netAmount = totalAmount - (discountAmount || 0) + (taxAmount || 0);
  const actualPaid = paidAmount || 0;
  
  let paymentStatus = 'Unpaid';
  if (actualPaid >= netAmount) paymentStatus = 'Paid';
  else if (actualPaid > 0) paymentStatus = 'Partial';

  // 1. Create Sale Record
  const sale = new Sale({
    shopId,
    customerId: customerId || null,
    userId,
    invoiceNumber,
    saleDate: saleDate || Date.now(),
    totalAmount,
    discountAmount,
    taxAmount,
    netAmount,
    paidAmount: actualPaid,
    paymentMethod,
    paymentStatus,
    totalProfit,
    isOfflineSynced: saleData.isOfflineSynced || false
  });

  await sale.save({ session });

  // 2. Save Items, Update Stock, and Log History
  for (const sItem of saleItemsData) {
    sItem.saleId = sale._id;
    await SaleItem.create([sItem], { session });

    const product = productMap[sItem.productId.toString()];
    const stockBefore = product.currentStock;
    product.currentStock -= sItem.quantity;
    await product.save({ session });

    await StockHistory.create([{
      productId: product._id,
      shopId,
      movementType: 'Sale',
      quantityChanged: -sItem.quantity, // Negative for outward
      stockBefore,
      stockAfter: product.currentStock,
      userId,
      referenceId: sale._id,
      remarks: `Sale Invoice: ${invoiceNumber}`
    }], { session });
  }

  // 3. Update Customer Due Amount (Balance) if credit sale
  if (customerId && actualPaid < netAmount) {
    const customer = await Customer.findOne({ _id: customerId, shopId }).session(session);
    if (customer) {
      const dueAmount = netAmount - actualPaid;
      customer.dueAmount += dueAmount;
      await customer.save({ session });
    }
  }

  return sale;
};

// @desc    Create a new Sale (Online POS)
// @route   POST /api/v1/sales
// @access  Private (POS_ACCESS)
exports.createSale = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sale = await processSingleSale(req.body, req.scopedShopId, req.user.id, session);
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, message: 'Sale recorded successfully', data: sale });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Invoice number already exists' });
    }
    // Differentiate between our thrown errors and system errors
    if (error.message.includes('Insufficient stock') || error.message.includes('not found') || error.message.includes('Items array')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Get all Sales
// @route   GET /api/v1/sales
// @access  Private
exports.getSales = async (req, res, next) => {
  try {
    const sales = await Sale.find({ shopId: req.scopedShopId })
      .populate('customerId', 'name mobile')
      .populate('userId', 'fullname')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: sales.length, data: sales });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single Sale details with items
// @route   GET /api/v1/sales/:id
// @access  Private
exports.getSaleById = async (req, res, next) => {
  try {
    const sale = await Sale.findOne({ _id: req.params.id, shopId: req.scopedShopId })
      .populate('customerId', 'name mobile address')
      .populate('userId', 'fullname');

    if (!sale) return res.status(404).json({ success: false, message: 'Sale not found' });

    const items = await SaleItem.find({ saleId: sale._id }).populate('productId', 'name sku unit');

    res.status(200).json({ success: true, data: { sale, items } });
  } catch (error) {
    next(error);
  }
};

// Exporting processSingleSale so syncService can use it
exports.processSingleSale = processSingleSale;
