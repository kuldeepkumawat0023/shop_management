const express = require('express');
const router = express.Router();
const { createBrand, getBrands, updateBrand, deleteBrand } = require('../controllers/brandController');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const upload = require('../middlewares/upload');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

router.post('/create', requirePermission(PERMISSIONS.MANAGE_INVENTORY), upload.single('logo'), createBrand);
router.get('/all', getBrands);
router.put('/update/:id', requirePermission(PERMISSIONS.MANAGE_INVENTORY), upload.single('logo'), updateBrand);
router.delete('/delete/:id', requirePermission(PERMISSIONS.MANAGE_INVENTORY), deleteBrand);

module.exports = router;
