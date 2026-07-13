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
router.post('/create', requirePermission(PERMISSIONS.EXPENSES_CREATE), createExpense);
router.get('/all', requirePermission(PERMISSIONS.EXPENSES_VIEW), getExpenses);
router.get('/get/:id', requirePermission(PERMISSIONS.EXPENSES_VIEW), getExpenseById);
router.put('/update/:id', requirePermission(PERMISSIONS.EXPENSES_UPDATE), updateExpense);
router.delete('/delete/:id', requirePermission(PERMISSIONS.EXPENSES_DELETE), deleteExpense);

module.exports = router;
