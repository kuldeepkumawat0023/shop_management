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

// @desc    Get all Productions
// @route   GET /api/v1/production
// @access  Private
exports.getProductions = async (req, res, next) => {
  try {
    const productions = await Production.find({ shopId: req.scopedShopId })
      .populate('recipeId')
      .populate('finalProductId', 'name sku currentStock unit')
      .populate('userId', 'name role')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: productions.length, data: productions });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single Production
// @route   GET /api/v1/production/:id
// @access  Private
exports.getProductionById = async (req, res, next) => {
  try {
    const production = await Production.findOne({ _id: req.params.id, shopId: req.scopedShopId })
      .populate({
        path: 'recipeId',
        populate: {
          path: 'ingredients.productId',
          select: 'name sku unit purchasePrice'
        }
      })
      .populate('finalProductId', 'name sku currentStock unit')
      .populate('userId', 'name role');

    if (!production) {
      return res.status(404).json({ success: false, message: 'Production log not found' });
    }

    res.status(200).json({ success: true, data: production });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Production Log (Reverses stock)
// @route   DELETE /api/v1/production/:id
// @access  Private (Manager/Admin)
exports.deleteProduction = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const production = await Production.findOne({ _id: req.params.id, shopId: req.scopedShopId }).session(session);
    if (!production) throw new Error('Production log not found');

    const recipe = await Recipe.findById(production.recipeId).session(session);
    if (!recipe) throw new Error('Recipe associated with production missing');

    const finalProduct = await Product.findById(production.finalProductId).session(session);
    if (!finalProduct) throw new Error('Final Product missing');

    // Re-add raw materials
    for (const ing of recipe.ingredients) {
      const rawProduct = await Product.findById(ing.productId).session(session);
      if (rawProduct) {
        const totalRestored = ing.quantityRequired * production.quantityProduced;
        const stockBefore = rawProduct.currentStock;
        
        rawProduct.currentStock += totalRestored;
        await rawProduct.save({ session });

        await StockHistory.create([{
          productId: rawProduct._id,
          shopId: req.scopedShopId,
          movementType: 'Adjustment', // Reversed consumption
          quantityChanged: totalRestored,
          stockBefore,
          stockAfter: rawProduct.currentStock,
          userId: req.user.id,
          remarks: `Reversed production log ${production._id} consumption`
        }], { session });
      }
    }

    // Deduct Final Product Stock
    const finalStockBefore = finalProduct.currentStock;
    finalProduct.currentStock -= production.quantityProduced;
    await finalProduct.save({ session });

    await StockHistory.create([{
      productId: finalProduct._id,
      shopId: req.scopedShopId,
      movementType: 'Adjustment', // Reversed production
      quantityChanged: -production.quantityProduced,
      stockBefore: finalStockBefore,
      stockAfter: finalProduct.currentStock,
      userId: req.user.id,
      referenceId: production._id,
      remarks: `Reversed production via deletion`
    }], { session });

    await production.deleteOne({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (error.message.includes('not found') || error.message.includes('missing')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};
