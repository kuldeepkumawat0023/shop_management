const express = require('express');
const router = express.Router();
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

router.post('/create', requirePermission(PERMISSIONS.CATEGORIES_CREATE), createCategory);
router.get('/all', requirePermission(PERMISSIONS.CATEGORIES_VIEW), getCategories);
router.put('/update/:id', requirePermission(PERMISSIONS.CATEGORIES_UPDATE), updateCategory);
router.delete('/delete/:id', requirePermission(PERMISSIONS.CATEGORIES_DELETE), deleteCategory);

module.exports = router;
