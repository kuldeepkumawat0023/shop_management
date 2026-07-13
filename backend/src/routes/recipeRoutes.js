const express = require('express');
const router = express.Router();
const { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe } = require('../controllers/recipeController');
const { protect } = require('../middlewares/authMiddleware');
const shopScope = require('../middlewares/shopScope');
const requirePermission = require('../middlewares/requirePermission');
const { PERMISSIONS } = require('../config/permissions');

router.use(protect);
router.use(shopScope);

router.post('/create', requirePermission(PERMISSIONS.RECIPES_CREATE), createRecipe);
router.get('/all', requirePermission(PERMISSIONS.RECIPES_VIEW), getRecipes);
router.get('/:id', requirePermission(PERMISSIONS.RECIPES_VIEW), getRecipeById);
router.put('/:id', requirePermission(PERMISSIONS.RECIPES_UPDATE), updateRecipe);
router.delete('/:id', requirePermission(PERMISSIONS.RECIPES_DELETE), deleteRecipe);

module.exports = router;
