const express = require('express');
const router = express.Router();

// Import Routes
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
/* // Ponytail: Disabled remaining routes for testing
const shopRoutes = require('./shopRoutes');
const roleRoutes = require('./roleRoutes');
const categoryRoutes = require('./categoryRoutes');
const brandRoutes = require('./brandRoutes');
const productRoutes = require('./productRoutes');
const customerRoutes = require('./customerRoutes');
const supplierRoutes = require('./supplierRoutes');
const purchaseRoutes = require('./purchaseRoutes');
const saleRoutes = require('./saleRoutes');
const paymentRoutes = require('./paymentRoutes');
const expenseRoutes = require('./expenseRoutes');
const adjustmentRoutes = require('./adjustmentRoutes');
const manufacturingRoutes = require('./manufacturingRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const reportRoutes = require('./reportRoutes');

// --- Future Modules (To be created) ---
// const inventoryRoutes = require('./inventoryRoutes');
// const productionRoutes = require('./productionRoutes');
// const payrollRoutes = require('./payrollRoutes');
// const expenseRoutes = require('./expenseRoutes');
// const dashboardRoutes = require('./dashboardRoutes');
// const notificationRoutes = require('./notificationRoutes');
*/

// Mount Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

/*
router.use('/shops', shopRoutes);
router.use('/roles', roleRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/products', productRoutes);
router.use('/customers', customerRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/sales', saleRoutes);
router.use('/payments', paymentRoutes);
router.use('/expenses', expenseRoutes);
router.use('/adjustments', adjustmentRoutes);
router.use('/manufacturing', manufacturingRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);
*/

module.exports = router;
