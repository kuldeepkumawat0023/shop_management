const express = require('express');
const router = express.Router();

const { 
  createRole, 
  getRoles, 
  getAllPermissions,
  updateRole, 
  deleteRole 
} = require('../controllers/roleController');

const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

router.post('/create', requirePermission(PERMISSIONS.ROLES_CREATE), createRole);
router.get('/all', requirePermission(PERMISSIONS.ROLES_VIEW), getRoles);
router.get('/permissions', requirePermission(PERMISSIONS.ROLES_VIEW), getAllPermissions);
router.put('/update/:id', requirePermission(PERMISSIONS.ROLES_UPDATE), updateRole);
router.delete('/delete/:id', requirePermission(PERMISSIONS.ROLES_DELETE), deleteRole);

module.exports = router;
