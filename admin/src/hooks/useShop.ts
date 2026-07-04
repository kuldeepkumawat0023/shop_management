import { useAppSelector } from '../store/hooks/redux';

/**
 * Custom hook to manage and access the currently active shop context.
 * Useful in multi-tenant environments where a user can own/manage multiple shops.
 */
export const useShop = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  // In a full implementation, you might have a dedicated shopSlice.
  // For now, we derive the primary shop from the auth user profile.
  const activeShopId = user?.shopId || null;
  const assignedShops = user?.assignedShops || [];

  const hasMultipleShops = assignedShops.length > 1;

  const isShopOwner = user?.role === 'shop_owner';
  const isSuperAdmin = user?.role === 'super_admin';

  return {
    activeShopId,
    assignedShops,
    hasMultipleShops,
    isShopOwner,
    isSuperAdmin,
  };
};
