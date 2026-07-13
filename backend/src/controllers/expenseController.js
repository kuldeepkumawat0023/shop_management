const Expense = require('../models/Expense');

// @desc    Create a new expense
// @route   POST /api/v1/expenses
// @access  Private
exports.createExpense = async (req, res, next) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      shopId: req.scopedShopId,
      userId: req.user.id
    });
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all expenses
// @route   GET /api/v1/expenses
// @access  Private
exports.getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ shopId: req.scopedShopId, isActive: true })
      .populate('userId', 'fullname')
      .sort('-expenseDate');
    res.status(200).json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    next(error);
  }
};

// @desc    Get expense by ID
// @route   GET /api/v1/expenses/get/:id
// @access  Private
exports.getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, shopId: req.scopedShopId })
      .populate('userId', 'fullname');
    if (!expense || !expense.isActive) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an expense
// @route   PUT /api/v1/expenses/:id
// @access  Private
exports.updateExpense = async (req, res, next) => {
  try {
    let expense = await Expense.findOne({ _id: req.params.id, shopId: req.scopedShopId });
    if (!expense || !expense.isActive) return res.status(404).json({ success: false, message: 'Expense not found' });

    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete (soft) an expense
// @route   DELETE /api/v1/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, shopId: req.scopedShopId });
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });

    expense.isActive = false;
    await expense.save();
    res.status(200).json({ success: true, message: 'Expense deleted' });
  } catch (error) {
    next(error);
  }
};
