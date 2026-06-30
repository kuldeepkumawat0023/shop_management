const Recipe = require('../models/Recipe');

// @desc    Create a Recipe
// @route   POST /api/v1/recipes
// @access  Private (Manager/Admin)
exports.createRecipe = async (req, res, next) => {
  try {
    const { finalProductId, ingredients, notes } = req.body;

    const recipe = await Recipe.create({
      shopId: req.scopedShopId,
      finalProductId,
      ingredients,
      notes
    });

    res.status(201).json({ success: true, data: recipe });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Recipe for this product already exists' });
    next(error);
  }
};

// @desc    Get all Recipes
// @route   GET /api/v1/recipes
// @access  Private
exports.getRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ shopId: req.scopedShopId })
      .populate('finalProductId', 'name sku currentStock unit')
      .populate('ingredients.productId', 'name sku unit purchasePrice');

    res.status(200).json({ success: true, count: recipes.length, data: recipes });
  } catch (error) {
    next(error);
  }
};
