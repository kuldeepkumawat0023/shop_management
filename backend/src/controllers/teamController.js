const Staff = require('../models/Staff');
const SalaryAdvance = require('../models/SalaryAdvance');
const StaffExpense = require('../models/StaffExpense');
const SalaryPayment = require('../models/SalaryPayment');
const Expense = require('../models/Expense');

// ─── STAFF CRUD ───────────────────────────────────────────────

// @desc    Add new staff
// @route   POST /api/v1/team
// @access  Private (Manager/Admin)
exports.addStaff = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    const exists = await Staff.findOne({ mobile, shopId: req.scopedShopId });
    if (exists) return res.status(400).json({ success: false, message: 'Staff with this mobile already exists' });

    const staff = await Staff.create({ ...req.body, shopId: req.scopedShopId });
    res.status(201).json({ success: true, data: staff });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all staff
// @route   GET /api/v1/team/all
// @access  Private
exports.getStaff = async (req, res, next) => {
  try {
    const staff = await Staff.find({ shopId: req.scopedShopId, isActive: true }).populate('userId', 'email');
    res.status(200).json({ success: true, count: staff.length, data: staff });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single staff member by ID
// @route   GET /api/v1/team/:id
// @access  Private
exports.getStaffById = async (req, res, next) => {
  try {
    const staff = await Staff.findOne({ _id: req.params.id, shopId: req.scopedShopId }).populate('userId', 'email');
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }
    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    next(error);
  }
};

// @desc    Update staff member
// @route   PUT /api/v1/team/update/:id
// @access  Private (Manager/Admin)
exports.updateStaff = async (req, res, next) => {
  try {
    let staff = await Staff.findOne({ _id: req.params.id, shopId: req.scopedShopId });
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    next(error);
  }
};

// ─── SALARY ADVANCE ───────────────────────────────────────────

// @desc    Record salary advance
// @route   POST /api/v1/team/advance
// @access  Private
exports.recordAdvance = async (req, res, next) => {
  try {
    const advance = await SalaryAdvance.create({
      ...req.body,
      shopId: req.scopedShopId,
      recordedBy: req.user.id
    });
    res.status(201).json({ success: true, data: advance });
  } catch (error) {
    next(error);
  }
};

// ─── STAFF EXPENSES ───────────────────────────────────────────

// @desc    Record staff expense claim
// @route   POST /api/v1/team/expense
// @access  Private
exports.recordExpense = async (req, res, next) => {
  try {
    const expense = await StaffExpense.create({
      ...req.body,
      shopId: req.scopedShopId
    });
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a staff member
// @route   DELETE /api/v1/team/delete/:id
// @access  Private (Super Admin)
exports.deleteStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findOne({ _id: req.params.id, shopId: req.scopedShopId });
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    // Soft delete
    staff.isActive = false;
    await staff.save();
    
    res.status(200).json({ success: true, message: 'Staff member removed successfully' });
  } catch (error) {
    next(error);
  }
};

// ─── PAYROLL (SALARIES & ADVANCES) ────────────────────────────

// @desc    Get all salary advances
// @route   GET /api/v1/team/advance
// @access  Private
exports.getAdvances = async (req, res, next) => {
  try {
    const advances = await SalaryAdvance.find({ shopId: req.scopedShopId })
      .populate('staffId', 'name mobile role')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: advances.length, data: advances });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all salary payments
// @route   GET /api/v1/team/salary
// @access  Private
exports.getSalaries = async (req, res, next) => {
  try {
    const salaries = await SalaryPayment.find({ shopId: req.scopedShopId })
      .populate('staffId', 'name mobile role')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: salaries.length, data: salaries });
  } catch (error) {
    next(error);
  }
};

// @desc    Record salary payment
// @route   POST /api/v1/team/salary
// @access  Private
exports.recordSalary = async (req, res, next) => {
  try {
    const { staffId, month, year, baseSalary, bonus, deductions, paymentMethod, paymentDate, notes } = req.body;
    
    const netSalary = (Number(baseSalary) || 0) + (Number(bonus) || 0) - (Number(deductions) || 0);

    const salary = await SalaryPayment.create({
      shopId: req.scopedShopId,
      staffId,
      month,
      year,
      baseSalary,
      bonus,
      deductions,
      netSalary,
      paymentMethod,
      paymentDate: paymentDate || Date.now(),
      notes,
      recordedBy: req.user.id
    });

    // Also record it as an Expense for P&L tracking
    const staff = await Staff.findById(staffId);
    await Expense.create({
      shopId: req.scopedShopId,
      userId: req.user.id, // Who recorded it
      expenseName: `Salary - ${staff ? staff.name : 'Staff'} (${month} ${year})`,
      amount: netSalary,
      category: 'Salary',
      paymentMethod: paymentMethod,
      expenseDate: paymentDate || Date.now(),
      notes: notes
    });

    res.status(201).json({ success: true, data: salary });
  } catch (error) {
    // Handle duplicate salary error
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Salary for this month and year is already recorded for this staff member.' });
    }
    next(error);
  }
};
