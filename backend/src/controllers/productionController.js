const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const Production = require('../models/Production');
const Product = require('../models/Product');
const StockHistory = require('../models/StockHistory');

// @desc    Log Production (Make final product from raw materials)
// @route   POST /api/v1/production
// @access  Private (Manager/Admin)
exports.logProduction = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { recipeId, quantityProduced } = req.body;

    const recipe = await Recipe.findOne({ _id: recipeId, shopId: req.scopedShopId }).session(session);
    if (!recipe) throw new Error('Recipe not found');

    const finalProduct = await Product.findById(recipe.finalProductId).session(session);
    if (!finalProduct) throw new Error('Final Product missing');

    let totalManufacturingCost = 0;
    const ingredientUpdates = [];

    // Calculate required raw materials and check stock
    for (const ing of recipe.ingredients) {
      const rawProduct = await Product.findById(ing.productId).session(session);
      if (!rawProduct) throw new Error(`Raw material missing (ID: ${ing.productId})`);

      const totalRequired = ing.quantityRequired * quantityProduced;

      if (rawProduct.currentStock < totalRequired) {
        throw new Error(`Insufficient stock for raw material: ${rawProduct.name}. Required: ${totalRequired}, Available: ${rawProduct.currentStock}`);
      }

      totalManufacturingCost += (totalRequired * rawProduct.purchasePrice);
      
      ingredientUpdates.push({
        product: rawProduct,
        qtyToDeduct: totalRequired
      });
    }

    // Deduct Raw Materials
    for (const update of ingredientUpdates) {
      const stockBefore = update.product.currentStock;
      update.product.currentStock -= update.qtyToDeduct;
      await update.product.save({ session });

      await StockHistory.create([{
        productId: update.product._id,
        shopId: req.scopedShopId,
        movementType: 'Adjustment', // Consumed in manufacturing
        quantityChanged: -update.qtyToDeduct,
        stockBefore,
        stockAfter: update.product.currentStock,
        userId: req.user.id,
        remarks: `Consumed for manufacturing ${quantityProduced}x ${finalProduct.name}`
      }], { session });
    }

    // Increase Final Product Stock
    const finalStockBefore = finalProduct.currentStock;
    finalProduct.currentStock += quantityProduced;
    await finalProduct.save({ session });

    const productionLog = new Production({
      shopId: req.scopedShopId,
      userId: req.user.id,
      recipeId,
      finalProductId: finalProduct._id,
      quantityProduced,
      totalCost: totalManufacturingCost
    });

    await productionLog.save({ session });

    await StockHistory.create([{
      productId: finalProduct._id,
      shopId: req.scopedShopId,
      movementType: 'Adjustment', // Produced
      quantityChanged: quantityProduced,
      stockBefore: finalStockBefore,
      stockAfter: finalProduct.currentStock,
      userId: req.user.id,
      referenceId: productionLog._id,
      remarks: `Manufactured via Recipe`
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, message: 'Production logged successfully', data: productionLog });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (error.message.includes('not found') || error.message.includes('missing') || error.message.includes('Insufficient stock')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};
