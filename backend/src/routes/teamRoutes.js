const express = require('express');
const router = express.Router();
const { addStaff, getStaff, getStaffById, updateStaff, recordAdvance, recordExpense, deleteStaff } = require('../controllers/teamController');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

// Only Super Admin or those with team manage permissions can manage staff directly
router.post('/create', requirePermission(PERMISSIONS.TEAM_CREATE), addStaff);
router.get('/all', requirePermission(PERMISSIONS.TEAM_VIEW), getStaff);
router.get('/:id', requirePermission(PERMISSIONS.TEAM_VIEW), getStaffById);
router.put('/update/:id', requirePermission(PERMISSIONS.TEAM_UPDATE), updateStaff);
router.delete('/delete/:id', requirePermission(PERMISSIONS.TEAM_DELETE), deleteStaff);

// Advances and Expenses
router.post('/advance', requirePermission(PERMISSIONS.PAYROLL_CREATE), recordAdvance);
router.post('/expense', requirePermission(PERMISSIONS.EXPENSES_CREATE), recordExpense);

module.exports = router;
