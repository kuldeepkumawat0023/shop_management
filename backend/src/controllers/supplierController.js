const Supplier = require('../models/Supplier');

exports.createSupplier = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    const exists = await Supplier.findOne({ mobile, shopId: req.scopedShopId });
    if (exists) return res.status(400).json({ success: false, message: 'Supplier with this mobile already exists in this shop' });

    const supplier = await Supplier.create({ ...req.body, shopId: req.scopedShopId });
    res.status(201).json({ success: true, data: supplier });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Duplicate supplier entry' });
    next(error);
  }
};

exports.getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find({ shopId: req.scopedShopId, isActive: true }).sort('-createdAt');
    res.status(200).json({ success: true, count: suppliers.length, data: suppliers });
  } catch (error) {
    next(error);
  }
};

exports.getSupplierById = async (req, res, next) => {
  try {
    const supplier = await Supplier.findOne({ _id: req.params.id, shopId: req.scopedShopId });
    if (!supplier || !supplier.isActive) return res.status(404).json({ success: false, message: 'Supplier not found' });
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
};

exports.updateSupplier = async (req, res, next) => {
  try {
    let supplier = await Supplier.findOne({ _id: req.params.id, shopId: req.scopedShopId });
    if (!supplier || !supplier.isActive) return res.status(404).json({ success: false, message: 'Supplier not found' });

    const updateData = { ...req.body };
    delete updateData.balance;

    supplier = await Supplier.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Duplicate mobile number' });
    next(error);
  }
};

exports.deleteSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findOne({ _id: req.params.id, shopId: req.scopedShopId });
    if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });

    supplier.isActive = false;
    await supplier.save();
    res.status(200).json({ success: true, message: 'Supplier deleted' });
  } catch (error) {
    next(error);
  }
};
