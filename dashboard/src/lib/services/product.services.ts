import apiClient, { ApiResponse } from '../apiClient';

export const productService = {
  createProduct: async (data: any): Promise<ApiResponse<any>> => {
    // Map frontend specific fields to backend expected names
    const payload: any = {
      ...data,
      barcode: data.sku || data.barcode || 'B-' + Date.now(), // Fallback if sku is empty
      categoryId: data.category || data.categoryId,
      brandId: data.brand || data.brandId || null,
      purchasePrice: data.costPrice !== undefined ? data.costPrice : data.purchasePrice || 0,
      sellingPrice: (data.sellingPrice !== undefined && data.sellingPrice !== '') ? data.sellingPrice : (data.isRawMaterial ? (data.costPrice || 0) : 0),
      gstRate: data.taxRate !== undefined ? data.taxRate : data.gstRate || 0,
      minStock: data.minStockLevel !== undefined ? data.minStockLevel : data.minStock || 5,
      openingStock: data.currentStock !== undefined ? data.currentStock : data.openingStock || 0,
      isRawMaterial: !!data.isRawMaterial
    };

    const formData = new FormData();
    Object.keys(payload).forEach(key => {
      if (key !== 'image' && payload[key] !== null && payload[key] !== undefined && payload[key] !== '') {
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
    const payload: any = {
      ...data,
      barcode: data.sku || data.barcode,
      categoryId: data.category || data.categoryId,
      brandId: data.brand || data.brandId || null,
      purchasePrice: data.costPrice !== undefined ? data.costPrice : data.purchasePrice,
      sellingPrice: (data.sellingPrice !== undefined && data.sellingPrice !== '') ? data.sellingPrice : (data.isRawMaterial ? (data.costPrice || 0) : data.sellingPrice),
      gstRate: data.taxRate !== undefined ? data.taxRate : data.gstRate,
      minStock: data.minStockLevel !== undefined ? data.minStockLevel : data.minStock,
      isRawMaterial: !!data.isRawMaterial
    };

    const formData = new FormData();
    Object.keys(payload).forEach(key => {
      if (key !== 'image' && payload[key] !== null && payload[key] !== undefined && payload[key] !== '') {
        formData.append(key, payload[key]);
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
    if (!id || id === 'undefined') {
      return { success: true, message: '', statusCode: 200, data: [] };
    }
    try {
      const response = await apiClient.get(`/products/${id}/stock-history`);
      return response.data;
    } catch {
      return { success: true, message: '', statusCode: 200, data: [] };
    }
  },
};
