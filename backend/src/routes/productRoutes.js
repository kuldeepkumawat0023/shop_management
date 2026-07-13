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

router.post('/create', requirePermission(PERMISSIONS.PRODUCTS_CREATE), upload.single('image'), createProduct);
router.get('/all', requirePermission(PERMISSIONS.PRODUCTS_VIEW), getProducts);
router.get('/barcode/:barcode', requirePermission(PERMISSIONS.PRODUCTS_VIEW), getProductByBarcode);
router.put('/update/:id', requirePermission(PERMISSIONS.PRODUCTS_UPDATE), upload.single('image'), updateProduct);
router.put('/adjust-stock/:id', requirePermission(PERMISSIONS.PRODUCTS_UPDATE), adjustStock);
router.delete('/delete/:id', requirePermission(PERMISSIONS.PRODUCTS_DELETE), deleteProduct);

module.exports = router;
