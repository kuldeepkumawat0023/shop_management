const express = require('express');
const router = express.Router();
const { addStaff, getStaff, getStaffById, updateStaff, recordAdvance, recordExpense, deleteStaff } = require('../controllers/teamController');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

// Only Super Admin can manage staff directly
router.post('/create', requirePermission(PERMISSIONS.SUPER_ADMIN), addStaff);
router.get('/all', requirePermission(PERMISSIONS.SUPER_ADMIN), getStaff);
router.get('/:id', requirePermission(PERMISSIONS.SUPER_ADMIN), getStaffById);
router.put('/update/:id', requirePermission(PERMISSIONS.SUPER_ADMIN), updateStaff);
router.delete('/delete/:id', requirePermission(PERMISSIONS.SUPER_ADMIN), deleteStaff);

// Advances and Expenses
router.post('/advance', requirePermission(PERMISSIONS.SUPER_ADMIN), recordAdvance);
router.post('/expense', requirePermission(PERMISSIONS.SUPER_ADMIN), recordExpense);

module.exports = router;
