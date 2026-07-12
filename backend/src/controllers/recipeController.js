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

// @desc    Get single Recipe
// @route   GET /api/v1/recipes/:id
// @access  Private
exports.getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, shopId: req.scopedShopId })
      .populate('finalProductId', 'name sku currentStock unit')
      .populate('ingredients.productId', 'name sku unit purchasePrice');

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    res.status(200).json({ success: true, data: recipe });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a Recipe
// @route   PUT /api/v1/recipes/:id
// @access  Private (Manager/Admin)
exports.updateRecipe = async (req, res, next) => {
  try {
    let recipe = await Recipe.findOne({ _id: req.params.id, shopId: req.scopedShopId });

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    const { ingredients, notes } = req.body;
    
    // Usually finalProductId cannot be changed, or if changed needs checking
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.notes = notes !== undefined ? notes : recipe.notes;

    await recipe.save();

    res.status(200).json({ success: true, data: recipe });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a Recipe
// @route   DELETE /api/v1/recipes/:id
// @access  Private (Manager/Admin)
exports.deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, shopId: req.scopedShopId });

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
