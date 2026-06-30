const express = require('express');
const router = express.Router();
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const upload = require('../middlewares/upload');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

router.post('/create', requirePermission(PERMISSIONS.MANAGE_INVENTORY), upload.single('image'), createCategory);
router.get('/all', getCategories);
router.put('/update/:id', requirePermission(PERMISSIONS.MANAGE_INVENTORY), upload.single('image'), updateCategory);
router.delete('/delete/:id', requirePermission(PERMISSIONS.MANAGE_INVENTORY), deleteCategory);

module.exports = router;
