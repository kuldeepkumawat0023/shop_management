const Customer = require('../models/Customer');

exports.createCustomer = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    const exists = await Customer.findOne({ mobile, shopId: req.scopedShopId });
    if (exists) return res.status(400).json({ success: false, message: 'Customer with this mobile already exists in this shop' });

    const customer = await Customer.create({ ...req.body, shopId: req.scopedShopId });
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Duplicate customer entry' });
    next(error);
  }
};

exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find({ shopId: req.scopedShopId, isActive: true }).sort('-createdAt');
    res.status(200).json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    next(error);
  }
};

exports.getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, shopId: req.scopedShopId });
    if (!customer || !customer.isActive) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    let customer = await Customer.findOne({ _id: req.params.id, shopId: req.scopedShopId });
    if (!customer || !customer.isActive) return res.status(404).json({ success: false, message: 'Customer not found' });

    // Prevent direct dueAmount modification via normal update, dueAmount changes via payments/sales
    const updateData = { ...req.body };
    delete updateData.dueAmount;

    customer = await Customer.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Duplicate mobile number' });
    next(error);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, shopId: req.scopedShopId });
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });

    customer.isActive = false;
    await customer.save();
    res.status(200).json({ success: true, message: 'Customer deleted' });
  } catch (error) {
    next(error);
  }
};
