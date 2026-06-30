const express = require('express');
const router = express.Router();
const { createRecipe, getRecipes } = require('../controllers/recipeController');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

router.post('/create', requirePermission(PERMISSIONS.MANAGE_INVENTORY), createRecipe);
router.get('/all', requirePermission(PERMISSIONS.MANAGE_INVENTORY), getRecipes);

module.exports = router;
