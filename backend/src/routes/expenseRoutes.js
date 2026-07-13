const express = require('express');
const router = express.Router();
const { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

// Only managers/owners should manage shop expenses normally
router.post('/create', requirePermission(PERMISSIONS.VIEW_REPORTS), createExpense);
router.get('/all', requirePermission(PERMISSIONS.VIEW_REPORTS), getExpenses);
router.get('/get/:id', requirePermission(PERMISSIONS.VIEW_REPORTS), getExpenseById);
router.put('/update/:id', requirePermission(PERMISSIONS.VIEW_REPORTS), updateExpense);
router.delete('/delete/:id', requirePermission(PERMISSIONS.VIEW_REPORTS), deleteExpense);

module.exports = router;
