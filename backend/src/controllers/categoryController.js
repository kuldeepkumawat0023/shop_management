const Category = require('../models/Category');

// @desc    Create a Category
// @route   POST /api/v1/categories/create
// @access  Private
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, status, isActive } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    // Check if category already exists in this shop
    const exists = await Category.findOne({ name: name.trim(), shopId: req.scopedShopId });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Category already exists in this shop' });
    }

    const categoryData = {
      name: name.trim(),
      description: description ? description.trim() : undefined,
      isActive: status === 'Inactive' || isActive === false ? false : true,
      shopId: req.scopedShopId
    };

    const category = await Category.create(categoryData);

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }
    next(error);
  }
};

// @desc    Get all Categories
// @route   GET /api/v1/categories/all
// @access  Private
exports.getCategories = async (req, res, next) => {
  try {
    // Filter active categories for the scoped shop
    const categories = await Category.find({ shopId: req.scopedShopId, isActive: true }).sort('-createdAt');
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a Category
// @route   PUT /api/v1/categories/update/:id
// @access  Private
exports.updateCategory = async (req, res, next) => {
  try {
    let category = await Category.findOne({ _id: req.params.id, shopId: req.scopedShopId });

    if (!category || !category.isActive) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const { name, description, status, isActive } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (status !== undefined) updateData.isActive = status === 'Active';
    if (isActive !== undefined) updateData.isActive = isActive;

    category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Category name already exists' });
    }
    next(error);
  }
};

// @desc    Delete (Soft) a Category
// @route   DELETE /api/v1/categories/delete/:id
// @access  Private
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, shopId: req.scopedShopId });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    category.isActive = false;
    await category.save();

    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};
