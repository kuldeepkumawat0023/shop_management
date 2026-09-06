const mongoose = require('mongoose');
const Purchase = require('../models/Purchase');
const PurchaseItem = require('../models/PurchaseItem');
const Product = require('../models/Product');
const StockHistory = require('../models/StockHistory');
const Supplier = require('../models/Supplier');
const { generateInvoicePDF } = require('../services/pdfService');

// @desc    Create a new Purchase Invoice
// @route   POST /api/v1/purchases
// @access  Private (Manager/Admin)
exports.createPurchase = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { supplierId, invoiceNumber, purchaseDate, items, discountAmount, taxAmount, paidAmount, paymentMethod, notes } = req.body;

    if (!supplierId || !invoiceNumber || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Supplier, invoice number, and items are required' });
    }

    // Verify Supplier
    const supplier = await Supplier.findOne({ _id: supplierId, shopId: req.scopedShopId }).session(session);
    if (!supplier) {
      throw new Error('Supplier not found');
    }

    let totalAmount = 0;
    const purchaseItemsData = [];

    // Process Items and calculate total
    for (const item of items) {
      const product = await Product.findOne({ _id: item.productId, shopId: req.scopedShopId }).session(session);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      const itemTotal = item.quantity * item.purchasePrice;
      totalAmount += itemTotal;

      purchaseItemsData.push({
        productId: product._id,
        shopId: req.scopedShopId,
        quantity: item.quantity,
        purchasePrice: item.purchasePrice,
        gstRate: item.gstRate || 0,
        totalPrice: itemTotal,
        // Will set purchaseId after creating purchase
      });
    }

    const netAmount = totalAmount - (discountAmount || 0) + (taxAmount || 0);
    const actualPaid = paidAmount || 0;
    
    let paymentStatus = 'Unpaid';
    if (actualPaid >= netAmount) paymentStatus = 'Paid';
    else if (actualPaid > 0) paymentStatus = 'Partial';

    // 1. Create Purchase Record
    const purchase = new Purchase({
      shopId: req.scopedShopId,
      supplierId,
      userId: req.user.id,
      invoiceNumber,
      purchaseDate,
      totalAmount,
      discountAmount,
      taxAmount,
      netAmount,
      paidAmount: actualPaid,
      paymentMethod,
      paymentStatus,
      notes
    });

    await purchase.save({ session });

    // 2. Save Items, Update Stock, and Log History
    for (const pItem of purchaseItemsData) {
      pItem.purchaseId = purchase._id;
      await PurchaseItem.create([pItem], { session });

      const product = await Product.findById(pItem.productId).session(session);
      const stockBefore = product.currentStock;
      product.currentStock += pItem.quantity;
      
      // Update the product's purchase price to the latest one
      product.purchasePrice = pItem.purchasePrice;
      await product.save({ session });

      await StockHistory.create([{
        productId: product._id,
        shopId: req.scopedShopId,
        movementType: 'Purchase',
        quantityChanged: pItem.quantity,
        stockBefore,
        stockAfter: product.currentStock,
        userId: req.user.id,
        referenceId: purchase._id,
        remarks: `Purchase Invoice: ${invoiceNumber}`
      }], { session });
    }

    // 3. Update Supplier Due Amount (Balance)
    if (actualPaid < netAmount) {
      const dueAmount = netAmount - actualPaid;
      supplier.balance += dueAmount;
      await supplier.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, message: 'Purchase recorded successfully', data: purchase });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Invoice number for this supplier already exists' });
    }
    next(error);
  }
};

// @desc    Get all Purchases
// @route   GET /api/v1/purchases
// @access  Private
exports.getPurchases = async (req, res, next) => {
  try {
    const purchases = await Purchase.find({ shopId: req.scopedShopId })
      .populate('supplierId', 'name mobile')
      .populate('userId', 'fullname')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: purchases.length, data: purchases });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single Purchase details with items
// @route   GET /api/v1/purchases/:id
// @access  Private
exports.getPurchaseById = async (req, res, next) => {
  try {
    const purchase = await Purchase.findOne({ _id: req.params.id, shopId: req.scopedShopId })
      .populate('supplierId', 'name mobile address gstNumber')
      .populate('userId', 'fullname');

    if (!purchase) return res.status(404).json({ success: false, message: 'Purchase not found' });

    const items = await PurchaseItem.find({ purchaseId: purchase._id }).populate('productId', 'name sku unit');

    res.status(200).json({ success: true, data: { purchase, items } });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a Purchase (Revert Stock and Supplier Balance)
// @route   DELETE /api/v1/purchases/delete/:id
// @access  Private (Manager/Admin)
exports.deletePurchase = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const purchase = await Purchase.findOne({ _id: req.params.id, shopId: req.scopedShopId }).session(session);
    if (!purchase) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Purchase not found' });
    }

    const items = await PurchaseItem.find({ purchaseId: purchase._id }).session(session);

    // 1. Revert Product Stock and write StockHistory
    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      if (product) {
        const stockBefore = product.currentStock;
        product.currentStock = Math.max(0, product.currentStock - item.quantity);
        await product.save({ session });

        await StockHistory.create([{
          productId: product._id,
          shopId: req.scopedShopId,
          movementType: 'Purchase Reverted',
          quantityChanged: -item.quantity,
          stockBefore,
          stockAfter: product.currentStock,
          userId: req.user.id,
          referenceId: purchase._id,
          remarks: `Deleted Purchase Invoice: ${purchase.invoiceNumber}`
        }], { session });
      }
    }

    // 2. Revert Supplier Balance (Due Amount)
    const dueAmount = purchase.netAmount - (purchase.paidAmount || 0);
    if (dueAmount > 0) {
      const supplier = await Supplier.findById(purchase.supplierId).session(session);
      if (supplier) {
        supplier.balance = Math.max(0, (supplier.balance || 0) - dueAmount);
        await supplier.save({ session });
      }
    }

    // 3. Delete PurchaseItems and Purchase
    await PurchaseItem.deleteMany({ purchaseId: purchase._id }).session(session);
    await Purchase.deleteOne({ _id: purchase._id }).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, message: 'Purchase deleted and stock reverted successfully' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// @desc    Download Purchase Bill / PO as PDF
// @route   GET /api/v1/purchases/:id/pdf
// @access  Private (PURCHASES_VIEW)
exports.downloadPurchasePDF = async (req, res, next) => {
  try {
    const purchase = await Purchase.findOne({ _id: req.params.id, shopId: req.scopedShopId })
      .populate('shopId', 'name address contactNumber gstNumber email logo')
      .populate('supplierId', 'name mobile address gstNumber contactPerson')
      .populate('userId', 'fullname');

    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Purchase order not found' });
    }

    const items = await PurchaseItem.find({ purchaseId: purchase._id }).populate('productId', 'name sku unit');

    const formattedItems = items.map(item => ({
      name: item.productId?.name || 'Item',
      quantity: item.quantity,
      price: item.purchasePrice,
      gstRate: item.gstRate || 0,
      total: item.totalPrice || (item.quantity * item.purchasePrice)
    }));

    const invoiceData = {
      shop: purchase.shopId || {},
      entity: purchase.supplierId || { name: 'Supplier', mobile: '' },
      cashier: purchase.userId?.fullname || 'Manager',
      invoiceNumber: purchase.invoiceNumber,
      date: purchase.purchaseDate || purchase.createdAt,
      items: formattedItems,
      discountAmount: purchase.discountAmount || 0,
      taxAmount: purchase.taxAmount || 0,
      netAmount: purchase.netAmount,
      paidAmount: purchase.paidAmount || 0,
      paymentMethod: purchase.paymentMethod || 'Cash',
      paymentStatus: purchase.paymentStatus || 'Paid',
      type: 'PURCHASE'
    };

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Purchase-${purchase.invoiceNumber}.pdf`);

    await generateInvoicePDF(invoiceData, res);
  } catch (error) {
    next(error);
  }
};

