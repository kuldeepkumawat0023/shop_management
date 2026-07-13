const express = require('express');
const router = express.Router();
const { createCustomer, getCustomers, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

// Cashiers need to create/view customers
router.post('/create', requirePermission(PERMISSIONS.CUSTOMERS_CREATE), createCustomer);
router.get('/all', requirePermission(PERMISSIONS.CUSTOMERS_VIEW), getCustomers);
// Updating/Deleting might need higher privileges depending on the business, but we allow POS access for now to update details
router.put('/update/:id', requirePermission(PERMISSIONS.CUSTOMERS_UPDATE), updateCustomer);
router.delete('/delete/:id', requirePermission(PERMISSIONS.CUSTOMERS_DELETE), deleteCustomer); // Only managers delete

module.exports = router;
