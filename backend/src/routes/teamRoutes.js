const express = require('express');
const router = express.Router();
const { addStaff, getStaff, getStaffById, updateStaff, recordAdvance, getAdvances, recordExpense, deleteStaff, recordSalary, getSalaries } = require('../controllers/teamController');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

// Staff CRUD
router.post('/create', requirePermission(PERMISSIONS.TEAM_CREATE), addStaff);
router.get('/all', requirePermission(PERMISSIONS.TEAM_VIEW), getStaff);

// Advances  ← must be before /:id wildcard
router.post('/advance', requirePermission(PERMISSIONS.PAYROLL_CREATE), recordAdvance);
router.get('/advance', requirePermission(PERMISSIONS.PAYROLL_VIEW), getAdvances);

// Salaries  ← must be before /:id wildcard
router.post('/salary', requirePermission(PERMISSIONS.PAYROLL_CREATE), recordSalary);
router.get('/salary', requirePermission(PERMISSIONS.PAYROLL_VIEW), getSalaries);

// Expenses  ← must be before /:id wildcard
router.post('/expense', requirePermission(PERMISSIONS.EXPENSES_CREATE), recordExpense);

// Wildcard /:id — must come LAST among GET routes
router.get('/:id', requirePermission(PERMISSIONS.TEAM_VIEW), getStaffById);
router.put('/update/:id', requirePermission(PERMISSIONS.TEAM_UPDATE), updateStaff);
router.delete('/delete/:id', requirePermission(PERMISSIONS.TEAM_DELETE), deleteStaff);

module.exports = router;
