import apiClient, { ApiResponse } from '../apiClient';

export interface ProductionData {
  _id: string;
  shopId?: string;
  userId: {
    _id: string;
    name: string;
    role: string;
  };
  recipeId: {
    _id: string;
    finalProductId: any;
    ingredients: any[];
  };
  finalProductId: {
    _id: string;
    name: string;
    sku: string;
    currentStock: number;
    unit: string;
  };
  quantityProduced: number;
  productionDate: string;
  totalCost: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 🏭 Production Service
 * Manages production logs mapping to Production.js model.
 */
export const productionService = {
  /**
   * Log a new production run
   * POST /production/create
   */
  logProduction: async (data: any): Promise<ApiResponse<ProductionData>> => {
    const response = await apiClient.post('/production/create', data);
    return response.data;
  },

  /**
   * Get all productions for the active shop
   * GET /production/all
   */
  getProductions: async (): Promise<ApiResponse<ProductionData[]>> => {
    const response = await apiClient.get('/production/all');
    return response.data;
  },

  /**
   * Get single production by ID
   * GET /production/:id
   */
  getProductionById: async (id: string): Promise<ApiResponse<ProductionData>> => {
    const response = await apiClient.get(`/production/${id}`);
    return response.data;
  },

  /**
   * Delete a production log (reverses stock)
   * DELETE /production/:id
   */
  deleteProduction: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/production/${id}`);
    return response.data;
  },
};
