const Settings = require('../models/Settings');
const AuditLog = require('../models/AuditLog');

// @desc    Get Shop Settings
// @route   GET /api/v1/settings
// @access  Private
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ shopId: req.scopedShopId });
    if (!settings) {
      // Create default settings if none exist for this shop
      settings = await Settings.create({ shopId: req.scopedShopId });
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Shop Settings
// @route   PUT /api/v1/settings
// @access  Private (Owner/SuperAdmin)
exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ shopId: req.scopedShopId });
    const previousData = settings ? settings.toObject() : null;

    if (!settings) {
      settings = new Settings({ ...req.body, shopId: req.scopedShopId, updatedBy: req.user.id });
      await settings.save();
    } else {
      settings = await Settings.findOneAndUpdate(
        { shopId: req.scopedShopId },
        { ...req.body, updatedBy: req.user.id },
        { new: true, runValidators: true }
      );
    }

    // Log the update action for auditing
    await AuditLog.create({
      shopId: req.scopedShopId,
      userId: req.user.id,
      action: 'UPDATE_SETTINGS',
      entityType: 'Settings',
      entityId: settings._id,
      previousData,
      newData: settings.toObject(),
      ipAddress: req.ip
    });

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};
