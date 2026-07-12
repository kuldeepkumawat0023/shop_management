import apiClient, { ApiResponse } from '../apiClient';

export interface RecipeIngredient {
  productId: {
    _id: string;
    name: string;
    sku: string;
    unit: string;
    purchasePrice: number;
  };
  quantityRequired: number;
}

export interface RecipeData {
  _id: string;
  shopId?: string;
  finalProductId: {
    _id: string;
    name: string;
    sku: string;
    currentStock: number;
    unit: string;
  };
  ingredients: RecipeIngredient[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 🧪 Recipe Service
 * Manages manufacturing recipes mapping to Recipe.js model.
 */
export const recipeService = {
  /**
   * Create a new recipe
   * POST /recipes/create
   */
  createRecipe: async (data: any): Promise<ApiResponse<RecipeData>> => {
    const response = await apiClient.post('/recipes/create', data);
    return response.data;
  },

  /**
   * Get all recipes for the active shop
   * GET /recipes/all
   */
  getRecipes: async (): Promise<ApiResponse<RecipeData[]>> => {
    const response = await apiClient.get('/recipes/all');
    return response.data;
  },

  /**
   * Get single recipe by ID
   * GET /recipes/:id
   */
  getRecipeById: async (id: string): Promise<ApiResponse<RecipeData>> => {
    const response = await apiClient.get(`/recipes/${id}`);
    return response.data;
  },

  /**
   * Update an existing recipe
   * PUT /recipes/:id
   */
  updateRecipe: async (id: string, data: any): Promise<ApiResponse<RecipeData>> => {
    const response = await apiClient.put(`/recipes/${id}`, data);
    return response.data;
  },

  /**
   * Delete a recipe
   * DELETE /recipes/:id
   */
  deleteRecipe: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/recipes/${id}`);
    return response.data;
  },
};
