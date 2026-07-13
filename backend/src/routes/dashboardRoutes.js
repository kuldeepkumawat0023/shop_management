const express = require('express');
const router = express.Router();

// Import Dashboard Controller
const { getDashboardStats } = require('../controllers/dashboardController');

// Import all "GET ALL" Controllers
const { getProducts } = require('../controllers/productController');
const { getCategories } = require('../controllers/categoryController');
const { getBrands } = require('../controllers/brandController');
const { getSales } = require('../controllers/saleController');
const { getPurchases } = require('../controllers/purchaseController');
const { getExpenses } = require('../controllers/expenseController');
const { getCustomers } = require('../controllers/customerController');
const { getSuppliers } = require('../controllers/supplierController');
const { getRecipes } = require('../controllers/recipeController');
const { getProductions } = require('../controllers/productionController');
const { getPayments } = require('../controllers/paymentController');
const { getDamages } = require('../controllers/damageController');
const { getUsers } = require('../controllers/userController'); // Staff list

const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

// Dashboard Summary Stats
router.get('/stats', requirePermission(PERMISSIONS.DASHBOARD_VIEW), getDashboardStats);

// ==========================================
// Centralized "GET ALL" APIs for View Pages
// ==========================================

router.get('/products', requirePermission(PERMISSIONS.PRODUCTS_VIEW), getProducts);
router.get('/categories', requirePermission(PERMISSIONS.CATEGORIES_VIEW), getCategories);
router.get('/brands', requirePermission(PERMISSIONS.BRANDS_VIEW), getBrands);
router.get('/sales', requirePermission(PERMISSIONS.SALES_VIEW), getSales);
router.get('/purchases', requirePermission(PERMISSIONS.PURCHASES_VIEW), getPurchases);
router.get('/expenses', requirePermission(PERMISSIONS.EXPENSES_VIEW), getExpenses);
router.get('/customers', requirePermission(PERMISSIONS.CUSTOMERS_VIEW), getCustomers);
router.get('/suppliers', requirePermission(PERMISSIONS.SUPPLIERS_VIEW), getSuppliers);
router.get('/recipes', requirePermission(PERMISSIONS.RECIPES_VIEW), getRecipes);
router.get('/productions', requirePermission(PERMISSIONS.PRODUCTIONS_VIEW), getProductions);
router.get('/payments', requirePermission(PERMISSIONS.PAYMENTS_VIEW), getPayments);
router.get('/damages', requirePermission(PERMISSIONS.DAMAGES_VIEW), getDamages);
router.get('/staff', requirePermission(PERMISSIONS.USERS_VIEW), getUsers);

module.exports = router;
