const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const Customer = require('../models/Customer');
const Supplier = require('../models/Supplier');

// @desc    Record a new payment and update balances
// @route   POST /api/v1/payments
// @access  Private (POS_ACCESS / MANAGE_PURCHASES)
exports.recordPayment = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { type, customerId, supplierId, amount, paymentMethod, paymentDate, referenceNumber, notes } = req.body;

    if (!type || !amount) {
      return res.status(400).json({ success: false, message: 'Type and amount are required' });
    }

    if (type === 'CUSTOMER_PAYMENT' && !customerId) {
      return res.status(400).json({ success: false, message: 'Customer ID is required for CUSTOMER_PAYMENT' });
    }

    if (type === 'SUPPLIER_PAYMENT' && !supplierId) {
      return res.status(400).json({ success: false, message: 'Supplier ID is required for SUPPLIER_PAYMENT' });
    }

    const payment = new Payment({
      shopId: req.scopedShopId,
      userId: req.user.id,
      type,
      customerId,
      supplierId,
      amount,
      paymentMethod,
      paymentDate,
      referenceNumber,
      notes
    });

    await payment.save({ session });

    // Deduct due amount / balance
    if (type === 'CUSTOMER_PAYMENT') {
      const customer = await Customer.findOne({ _id: customerId, shopId: req.scopedShopId }).session(session);
      if (!customer) throw new Error('Customer not found');
      
      customer.dueAmount -= amount;
      await customer.save({ session });
    } else if (type === 'SUPPLIER_PAYMENT') {
      const supplier = await Supplier.findOne({ _id: supplierId, shopId: req.scopedShopId }).session(session);
      if (!supplier) throw new Error('Supplier not found');

      supplier.balance -= amount;
      await supplier.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, message: 'Payment recorded successfully', data: payment });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Get all payments (Filters via query params)
// @route   GET /api/v1/payments
// @access  Private
exports.getPayments = async (req, res, next) => {
  try {
    const filter = { shopId: req.scopedShopId };
    
    if (req.query.type) filter.type = req.query.type;
    if (req.query.customerId) filter.customerId = req.query.customerId;
    if (req.query.supplierId) filter.supplierId = req.query.supplierId;

    const payments = await Payment.find(filter)
      .populate('customerId', 'name mobile')
      .populate('supplierId', 'name mobile')
      .populate('userId', 'fullname')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    next(error);
  }
};
