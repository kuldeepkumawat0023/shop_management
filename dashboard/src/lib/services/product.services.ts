import apiClient, { ApiResponse } from '../apiClient';

export const productService = {
  createProduct: async (data: any): Promise<ApiResponse<any>> => {
    // Handling FormData automatically via apiClient interceptor if image is present
    const response = await apiClient.post('/products/create', data);
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
