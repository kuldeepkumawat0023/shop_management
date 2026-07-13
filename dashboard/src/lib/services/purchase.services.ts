import apiClient, { ApiResponse } from '../apiClient';

export interface PurchaseData {
  _id: string;
  shopId?: string;
  supplierId: any;
  userId: any;
  invoiceNumber: string;
  purchaseDate: string;
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  netAmount: number;
  paidAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 📦 Purchase Service
 * Manages purchase records mapping to Purchase.js model.
 */
export const purchaseService = {
  /**
   * Create a new purchase
   * POST /purchases/create
   */
  createPurchase: async (data: any): Promise<ApiResponse<PurchaseData>> => {
    const response = await apiClient.post('/purchases/create', data);
    return response.data;
  },

  /**
   * Get all purchases for the shop
   * GET /purchases/all
   */
  getPurchases: async (): Promise<ApiResponse<PurchaseData[]>> => {
    const response = await apiClient.get('/purchases/all');
    return response.data;
  },

  /**
   * Get purchase by ID
   * GET /purchases/get/:id
   */
  getPurchaseById: async (id: string): Promise<ApiResponse<PurchaseData>> => {
    const response = await apiClient.get(`/purchases/get/${id}`);
    return response.data;
  },
};
