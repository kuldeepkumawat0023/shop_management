const express = require('express');
const router = express.Router();
const { 
  createProduct, 
  getProducts, 
  getProductByBarcode, 
  updateProduct, 
  adjustStock, 
  deleteProduct 
} = require('../controllers/productController');

const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const upload = require('../middlewares/upload');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

router.post('/create', requirePermission(PERMISSIONS.MANAGE_INVENTORY), upload.single('image'), createProduct);
router.get('/all', getProducts);
router.get('/barcode/:barcode', getProductByBarcode);
router.put('/update/:id', requirePermission(PERMISSIONS.MANAGE_INVENTORY), upload.single('image'), updateProduct);
router.put('/adjust-stock/:id', requirePermission(PERMISSIONS.MANAGE_INVENTORY), adjustStock);
router.delete('/delete/:id', requirePermission(PERMISSIONS.MANAGE_INVENTORY), deleteProduct);

module.exports = router;
