const express = require('express');
const router = express.Router();

const { 
  createRole, 
  getRoles, 
  updateRole, 
  deleteRole 
} = require('../controllers/roleController');

const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');

router.use(protect);
router.use(shopScope);

router.post('/create', authorizeRoles('super_admin', 'shop_owner'), createRole);
router.get('/all', getRoles);
router.put('/update/:id', authorizeRoles('super_admin', 'shop_owner'), updateRole);
router.delete('/delete/:id', authorizeRoles('super_admin', 'shop_owner'), deleteRole);

module.exports = router;
