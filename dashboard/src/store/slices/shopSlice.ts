import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShopData } from '../../lib/services/shop.services';

interface ShopState {
  activeShop: ShopData | null;
  assignedShops: ShopData[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ShopState = {
  activeShop: null,
  assignedShops: [],
  isLoading: false,
  error: null,
};

export const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setActiveShop: (state, action: PayloadAction<ShopData | null>) => {
      state.activeShop = action.payload;
    },
    setAssignedShops: (state, action: PayloadAction<ShopData[]>) => {
      state.assignedShops = action.payload;
    },
    clearShopData: (state) => {
      state.activeShop = null;
      state.assignedShops = [];
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setActiveShop,
  setAssignedShops,
  clearShopData,
} = shopSlice.actions;

export default shopSlice.reducer;
