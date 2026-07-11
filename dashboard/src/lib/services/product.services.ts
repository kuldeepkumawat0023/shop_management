import apiClient, { ApiResponse } from '../apiClient';

export const productService = {
  createProduct: async (data: any): Promise<ApiResponse<any>> => {
    // Map frontend specific fields to backend expected names
    const payload = {
      ...data,
      barcode: data.sku || 'B-' + Date.now(), // Fallback if sku is empty
      categoryId: data.category,
      brandId: data.brand || null,
      purchasePrice: data.costPrice || 0,
      gstRate: data.taxRate || 0,
      minStock: data.minStockLevel || 5,
      openingStock: data.currentStock || 0
    };
    const response = await apiClient.post('/products/create', payload);
    return response.data;
  },
  getProducts: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/products/all');
    return response.data;
  },
  getProductByBarcode: async (barcode: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/products/barcode/${barcode}`);
    return response.data;
  },
  updateProduct: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/products/update/${id}`, data);
    return response.data;
  },
  adjustStock: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/products/adjust-stock/${id}`, data);
    return response.data;
  },
  deleteProduct: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/products/delete/${id}`);
    return response.data;
  },
};
