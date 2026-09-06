'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { productService } from '@/lib/services/product.services';
import { saleService } from '@/lib/services/sale.services';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  sellingPrice: number;
  purchasePrice: number;
  mrp?: number;
  currentStock: number;
  category?: string;
  sku?: string;
  image?: string;
}

interface CartItem {
  productId: string;
  name: string;
  sellingPrice: number;
  quantity: number;
  stock: number;
  image?: string;
}

interface Customer {
  _id?: string;
  name: string;
  phone?: string;
}

interface HeldBill {
  id: string;
  cart: CartItem[];
  customer: Customer | null;
  discount: number;
  tax: number;
  note: string;
  heldAt: Date;
}

interface POSContextType {
  products: Product[];
  loadingProducts: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  setDiscount: (discount: number) => void;
  tax: number;
  setTax: (tax: number) => void;
  netAmount: number;
  editSaleId: string | null;
  setEditSaleId: (id: string | null) => void;
  checkout: (paymentMethod: string, paidAmount: number, customerId?: string) => Promise<{ success: boolean; data?: any }>;
  heldBills: HeldBill[];
  holdBill: (note: string) => void;
  resumeBill: (billId: string) => void;
  deleteHeldBill: (billId: string) => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export function POSProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [editSaleId, setEditSaleId] = useState<string | null>(null);
  const [heldBills, setHeldBills] = useState<HeldBill[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await productService.getProducts();
      if (res.success) setProducts(res.data);
    } catch (err) {
      toast.error('Failed to load products / उत्पाद लोड करने में विफल');
    } finally {
      setLoadingProducts(false);
    }
  };

  const addToCart = (product: Product) => {
    if (product.currentStock <= 0) {
      toast.error('Product out of stock! / उत्पाद स्टॉक में नहीं है!');
      return;
    }
    
    setCart(prev => {
      const existing = prev.find(item => item.productId === product._id);
      if (existing) {
        if (existing.quantity >= product.currentStock) {
          toast.error(`Only ${product.currentStock} in stock / स्टॉक में केवल ${product.currentStock} उपलब्ध हैं`);
          return prev;
        }
        return prev.map(item => 
          item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { 
        productId: product._id, 
        name: product.name,
        sellingPrice: product.sellingPrice,
        quantity: 1,
        stock: product.currentStock,
        image: product.image
      }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = item.quantity + delta;
        if (newQty < 1) return item;
        if (newQty > item.stock) {
          toast.error(`Only ${item.stock} in stock / स्टॉक में केवल ${item.stock} उपलब्ध हैं`);
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setTax(0);
    setSelectedCustomer(null);
  };

  const holdBill = (note: string) => {
    if (cart.length === 0) {
      toast.error('Cart is empty! / कार्ट खाली है!');
      return;
    }
    const bill: HeldBill = {
      id: `HB-${Date.now()}`,
      cart: [...cart],
      customer: selectedCustomer,
      discount,
      tax,
      note,
      heldAt: new Date()
    };
    setHeldBills(prev => [...prev, bill]);
    clearCart();
    toast.success('Bill held successfully! / बिल होल्ड किया गया!');
  };

  const resumeBill = (billId: string) => {
    const bill = heldBills.find(b => b.id === billId);
    if (!bill) return;
    setCart(bill.cart);
    setSelectedCustomer(bill.customer);
    setDiscount(bill.discount);
    setTax(bill.tax);
    setHeldBills(prev => prev.filter(b => b.id !== billId));
    toast.success('Bill resumed! / बिल फिर से शुरू!');
  };

  const deleteHeldBill = (billId: string) => {
    setHeldBills(prev => prev.filter(b => b.id !== billId));
    toast.success('Held bill deleted / होल्ड बिल हटाया गया');
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);
  const netAmount = subtotal - discount + tax;

  const checkout = async (paymentMethod: string, paidAmount: number, customerId?: string): Promise<{ success: boolean; data?: any }> => {
    if (cart.length === 0) return { success: false };
    const toastId = toast.loading('Processing sale...');
    try {
      const methodMap: Record<string, string> = { cash: 'Cash', upi: 'UPI', card: 'Card', credit: 'Credit' };
      const normalizedMethod = methodMap[paymentMethod.toLowerCase()] || paymentMethod || 'Cash';

      const saleData = {
        invoiceNumber: `INV-${Date.now()}`,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          sellingPrice: item.sellingPrice
        })),
        discountAmount: discount,
        taxAmount: tax,
        paidAmount,
        paymentMethod: normalizedMethod,
        customerId
      };

      let res;
      if (editSaleId) {
        res = await saleService.updateSale(editSaleId, saleData);
      } else {
        res = await saleService.createSale(saleData);
      }

      if (res.success) {
        toast.success(editSaleId ? 'Sale updated successfully! / बिक्री सफलतापूर्वक अपडेट की गई!' : 'Sale completed successfully! / बिक्री सफलतापूर्वक पूरी हुई!', { id: toastId });
        clearCart();
        setEditSaleId(null);
        fetchProducts(); // Refresh stock
        return { success: true, data: res.data };
      }
      return { success: false };
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Checkout failed / चेकआउट विफल रहा', { id: toastId });
      return { success: false };
    }
  };

  const value = {
    products,
    loadingProducts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedCustomer,
    setSelectedCustomer,
    cart,
    setCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    setDiscount,
    tax,
    setTax,
    netAmount,
    editSaleId,
    setEditSaleId,
    checkout,
    heldBills,
    holdBill,
    resumeBill,
    deleteHeldBill
  };

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>;
}

export function usePOS() {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
}
