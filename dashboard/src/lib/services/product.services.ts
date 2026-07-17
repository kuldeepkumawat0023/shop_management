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
    const formData = new FormData();
    Object.keys(payload).forEach(key => {
      if (payload[key] !== null && payload[key] !== undefined) {
        formData.append(key, payload[key]);
      }
    });

    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await apiClient.post('/products/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
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
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key !== 'image' && data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await apiClient.put(`/products/update/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
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
  getProductStockHistory: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/products/${id}/stock-history`);
    return response.data;
  },
};
