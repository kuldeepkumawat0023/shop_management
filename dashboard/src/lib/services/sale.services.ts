import apiClient, { ApiResponse } from '../apiClient';

export interface SaleData {
  _id: string;
  shopId?: string;
  customerId?: any;
  userId: any;
  invoiceNumber: string;
  saleDate: string;
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  netAmount: number;
  paidAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  totalProfit: number;
  isOfflineSynced: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 🛒 Sale Service
 * Manages sales records mapping to Sale.js model.
 */
export const saleService = {
  /**
   * Create a new sale
   * POST /sales/create
   */
  createSale: async (data: any): Promise<ApiResponse<SaleData>> => {
    const response = await apiClient.post('/sales/create', data);
    return response.data;
  },

  /**
   * Get all sales for the shop
   * GET /sales/all
   */
  getSales: async (): Promise<ApiResponse<SaleData[]>> => {
    const response = await apiClient.get('/sales/all');
    return response.data;
  },

  /**
   * Get sale by ID
   * GET /sales/get/:id
   */
  getSaleById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/sales/get/${id}`);
    return response.data;
  },

  /**
   * Sync offline sales
   * POST /sales/sync
   */
  syncOfflineSales: async (bills: any[]): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/sales/sync', { bills });
    return response.data;
  },

  /**
   * Update a sale
   * PUT /sales/update/:id
   */
  updateSale: async (id: string, data: any): Promise<ApiResponse<SaleData>> => {
    const response = await apiClient.put(`/sales/update/${id}`, data);
    return response.data;
  },

  /**
   * Delete a sale
   * DELETE /sales/delete/:id
   */
  deleteSale: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/sales/delete/${id}`);
    return response.data;
  }
};
