const express = require('express');
const router = express.Router();

// Import Routes
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
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
const dashboardRoutes = require('./dashboardRoutes');
const reportRoutes = require('./reportRoutes');
const recipeRoutes = require('./recipeRoutes');
const productionRoutes = require('./productionRoutes');
const teamRoutes = require('./teamRoutes');
const settingsRoutes = require('./settingsRoutes');
const damageRoutes = require('./damageRoutes');

// Mount Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
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
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);
router.use('/recipes', recipeRoutes);
router.use('/production', productionRoutes);
router.use('/team', teamRoutes);
router.use('/settings', settingsRoutes);
router.use('/damages', damageRoutes);

module.exports = router;
