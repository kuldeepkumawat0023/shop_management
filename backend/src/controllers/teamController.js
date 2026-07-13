const Staff = require('../models/Staff');
const SalaryAdvance = require('../models/SalaryAdvance');
const StaffExpense = require('../models/StaffExpense');

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
