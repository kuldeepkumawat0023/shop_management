const express = require('express');
const router = express.Router();
const { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe } = require('../controllers/recipeController');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

router.post('/create', requirePermission(PERMISSIONS.MANAGE_INVENTORY), createRecipe);
router.get('/all', requirePermission(PERMISSIONS.MANAGE_INVENTORY), getRecipes);
router.get('/:id', requirePermission(PERMISSIONS.MANAGE_INVENTORY), getRecipeById);
router.put('/:id', requirePermission(PERMISSIONS.MANAGE_INVENTORY), updateRecipe);
router.delete('/:id', requirePermission(PERMISSIONS.MANAGE_INVENTORY), deleteRecipe);

module.exports = router;
