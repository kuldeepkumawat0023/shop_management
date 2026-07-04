import apiClient, { ApiResponse } from '../apiClient';

export interface DamageData {
  _id?: string;
  shopId?: string;
  userId?: string;
  productId: string;
  quantity: number;
  reason: string;
  damageDate?: string;
  lossAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 🏚️ Damage Service
 * Manages inventory damages mapped to Damage.js model.
 */
export const damageService = {
  /**
   * Log new inventory damage
   * POST /damages/create
   */
  logDamage: async (data: DamageData): Promise<ApiResponse<DamageData>> => {
    const response = await apiClient.post('/damages/create', data);
    return response.data;
  },

  /**
   * Get all logged damages
   * GET /damages/all
   */
  getDamages: async (): Promise<ApiResponse<DamageData[]>> => {
    const response = await apiClient.get('/damages/all');
    return response.data;
  },
};
