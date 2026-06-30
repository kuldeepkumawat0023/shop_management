const mongoose = require('mongoose');
const Damage = require('../models/Damage');
const Product = require('../models/Product');
const StockHistory = require('../models/StockHistory');

// @desc    Log a Damaged Product
// @route   POST /api/v1/damages
// @access  Private (Manager/Admin)
exports.logDamage = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { productId, quantity, reason } = req.body;

    const product = await Product.findOne({ _id: productId, shopId: req.scopedShopId }).session(session);
    if (!product) throw new Error('Product not found');

    if (product.currentStock < quantity) throw new Error('Damage quantity cannot exceed current stock');

    const stockBefore = product.currentStock;
    product.currentStock -= quantity;
    await product.save({ session });

    const lossAmount = product.purchasePrice * quantity;

    const damage = new Damage({
      shopId: req.scopedShopId,
      userId: req.user.id,
      productId,
      quantity,
      reason,
      lossAmount
    });
    await damage.save({ session });

    await StockHistory.create([{
      productId: product._id,
      shopId: req.scopedShopId,
      movementType: 'Adjustment', // or 'Damage'
      quantityChanged: -quantity,
      stockBefore,
      stockAfter: product.currentStock,
      userId: req.user.id,
      referenceId: damage._id,
      remarks: `Damage: ${reason}`
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, message: 'Damage logged successfully', data: damage });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (error.message.includes('not found') || error.message.includes('cannot exceed')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Get all damage logs
// @route   GET /api/v1/damages
// @access  Private
exports.getDamages = async (req, res, next) => {
  try {
    const damages = await Damage.find({ shopId: req.scopedShopId })
      .populate('productId', 'name sku currentStock')
      .populate('userId', 'fullname')
      .sort('-damageDate');

    res.status(200).json({ success: true, count: damages.length, data: damages });
  } catch (error) {
    next(error);
  }
};
