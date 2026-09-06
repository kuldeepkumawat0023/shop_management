'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Barcode,
  Plus,
  Minus,
  Trash2,
  Clock,
  User,
  UserCheck,
  UserPlus,
  CreditCard,
  Banknote,
  Smartphone,
  BookOpen,
  ShoppingBag,
  X,
  Tag,
  Percent,
  RefreshCw,
  Coffee,
  Package,
  ArrowRight,
  Edit2,
  CheckCircle2,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { usePOS } from '@/contexts/POSContext';
import { formatCurrency } from '@/utils/formatCurrency';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { StatusBadge } from '@/components/common/StatusBadge';
import { cn } from '@/utils/cn';
import { customerService } from '@/lib/services/customer.services';
import { productService } from '@/lib/services/product.services';
import { categoryService } from '@/lib/services/category.services';
import toast from 'react-hot-toast';
import PaymentModal from './PaymentModal';
import POSInvoiceModal from './POSInvoiceModal';

export default function NewSaleView() {
  const {
    products,
    loadingProducts,
    cart,
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
    selectedCustomer,
    setSelectedCustomer,
    holdBill,
    checkout
  } = usePOS();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [barcodeInput, setBarcodeInput] = useState('');

  // Categories & Horizontal Scroll
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Progressive / Infinite Scroll Pagination for 100+ products
  const [visibleCount, setVisibleCount] = useState(24);

  // Quick Payment selection inside cart panel
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'card' | 'upi' | 'credit'>('cash');

  // Modals
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [isHoldModalOpen, setIsHoldModalOpen] = useState(false);
  const [holdNote, setHoldNote] = useState('');
  const [isCustomItemOpen, setIsCustomItemOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [customQty, setCustomQty] = useState('1');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  // Customer dropdown
  const [customerSearch, setCustomerSearch] = useState('');
  const [isCustDropdownOpen, setIsCustDropdownOpen] = useState(false);
  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const custDropdownRef = useRef<HTMLDivElement>(null);

  // Discount / Tax
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [discountType, setDiscountType] = useState<'flat' | 'percent'>('flat');
  const [discountVal, setDiscountVal] = useState('');
  const [taxPercent, setTaxPercent] = useState('5'); // Default 5% GST as shown in reference

  // Calculate default 5% tax if not set
  useEffect(() => {
    if (taxPercent) {
      const pct = parseFloat(taxPercent) || 0;
      const computed = ((subtotal - discount) * pct) / 100;
      setTax(Math.max(0, computed));
    }
  }, [subtotal, discount, taxPercent, setTax]);

  // Fetch customers and real categories from database
  useEffect(() => {
    customerService.getCustomers().then(res => {
      if (res.success) {
        setAllCustomers(res.data || []);
      }
    }).catch(() => {});

    categoryService.getCategories().then(res => {
      if (res.success && Array.isArray(res.data)) {
        const names = res.data.map((c: any) => c.name).filter(Boolean);
        setDbCategories(names);
      }
    }).catch(() => {});
  }, []);

  // Close customer dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (custDropdownRef.current && !custDropdownRef.current.contains(e.target as Node)) {
        setIsCustDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute category item counts and unique list
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      const cat = typeof p.category === 'string' ? p.category : ((p as any).categoryId?.name || p.category || 'General');
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    dbCategories.forEach(c => set.add(c));
    products.forEach(p => {
      const cat = typeof p.category === 'string' ? p.category : ((p as any).categoryId?.name || p.category);
      if (cat) set.add(cat);
    });
    return ['all', 'top-selling', ...Array.from(set)];
  }, [dbCategories, products]);

  // Reset pagination when category or search changes
  useEffect(() => {
    setVisibleCount(24);
  }, [selectedCategory, searchQuery]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ((p as any).barcode && (p as any).barcode.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchCat = true;
      if (selectedCategory === 'top-selling') {
        matchCat = true;
      } else if (selectedCategory !== 'all') {
        const catName = typeof p.category === 'string' ? p.category : ((p as any).categoryId?.name || p.category || 'General');
        matchCat = catName.toLowerCase() === selectedCategory.toLowerCase();
      }

      return matchSearch && matchCat;
    });
  }, [products, searchQuery, selectedCategory]);

  // Progressive batch of products for 60fps rendering
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  // Handle scroll on product grid for infinite scroll
  const handleGridScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 120) {
      if (visibleCount < filteredProducts.length) {
        setVisibleCount(prev => Math.min(prev + 24, filteredProducts.length));
      }
    }
  };

  // Scroll category bar horizontally
  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -260 : 260,
        behavior: 'smooth'
      });
    }
  };

  // Handle barcode scanner enter key
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const matched = products.find(p =>
      p.sku?.toLowerCase() === barcodeInput.trim().toLowerCase() ||
      (p as any).barcode?.toLowerCase() === barcodeInput.trim().toLowerCase()
    );
    if (matched) {
      addToCart(matched);
      toast.success(`+1 ${matched.name}`);
      setBarcodeInput('');
    } else {
      toast.error(`Barcode '${barcodeInput}' not found! / बारकोड नहीं मिला`);
    }
  };

  // Quick Customer Creation
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone) {
      toast.error('नाम और मोबाइल नंबर आवश्यक है / Name & Phone required');
      return;
    }
    try {
      const res = await customerService.createCustomer({ name: newCustName, mobile: newCustPhone });
      if (res.success) {
        const created = res.data;
        setAllCustomers(prev => [...prev, created]);
        const createdAny = created as any;
        setSelectedCustomer({
          _id: created._id || '',
          name: created.name,
          phone: createdAny.mobile || createdAny.phone || ''
        });
        setIsCustomerModalOpen(false);
        setNewCustName('');
        setNewCustPhone('');
        toast.success('ग्राहक सफलतापूर्वक जोड़ा गया! / Customer added');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add customer');
    }
  };

  // Add Custom / Ad-hoc Item
  const handleAddCustomItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(customPrice);
    const qty = parseInt(customQty) || 1;
    if (!customName.trim() || isNaN(price) || price < 0) {
      toast.error('कृपया मान्य नाम और मूल्य दर्ज करें / Enter valid name & price');
      return;
    }

    const toastId = toast.loading('Adding item...');
    try {
      const res = await productService.createProduct({
        name: customName.trim(),
        sellingPrice: price,
        purchasePrice: price * 0.7,
        openingStock: 9999,
        sku: 'CUSTOM-' + Date.now().toString().slice(-6)
      });

      if (res.success) {
        const newProd = res.data;
        for (let i = 0; i < qty; i++) {
          addToCart(newProd);
        }
        setIsCustomItemOpen(false);
        setCustomName('');
        setCustomPrice('');
        setCustomQty('1');
        toast.success(`Added ${customName} to bill!`, { id: toastId });
      } else {
        toast.error('Failed to create item', { id: toastId });
      }
    } catch (err) {
      toast.error('Could not add custom item', { id: toastId });
    }
  };

  // Apply Discount
  const handleApplyDiscount = () => {
    const val = parseFloat(discountVal) || 0;
    if (discountType === 'percent') {
      const computed = (subtotal * val) / 100;
      setDiscount(Math.min(computed, subtotal));
    } else {
      setDiscount(Math.min(val, subtotal));
    }
    setIsDiscountOpen(false);
  };

  // Hold Bill handler
  const handleConfirmHold = () => {
    holdBill(holdNote || 'Hold Order');
    setIsHoldModalOpen(false);
    setHoldNote('');
  };

  // Complete Sale Action
  const handleCompleteSaleClick = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty / कार्ट खाली है');
      return;
    }

    if (selectedPaymentMethod === 'credit' && !selectedCustomer) {
      toast.error('उधार (Udhar) के लिए कृपया पहले ग्राहक चुनें! / Please select a customer for Udhar');
      setIsCustDropdownOpen(true);
      return;
    }

    if (selectedPaymentMethod === 'cash') {
      setIsPaymentOpen(true);
    } else {
      executeFastCheckout(selectedPaymentMethod);
    }
  };

  const executeFastCheckout = async (method: string) => {
    const paid = method === 'credit' ? 0 : netAmount;
    const res = await checkout(method, paid, selectedCustomer?._id);
    if (res.success) {
      setInvoiceData(res.data);
      setIsInvoiceOpen(true);
    }
  };

  // Completed Sale from Modal -> Open Invoice
  const handlePaymentSuccess = (saleData: any) => {
    setIsPaymentOpen(false);
    setInvoiceData(saleData);
    setIsInvoiceOpen(true);
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col lg:flex-row h-full max-h-full min-h-0 bg-background overflow-hidden">
      
      {/* LEFT SECTION: CATALOGUE & SEARCH (60% to 65% width) */}
      <div className="flex-1 flex flex-col h-full min-h-0 border-r border-outline-variant/20 overflow-hidden bg-background">
        
        {/* Top Header & Search Area */}
        <div className="p-4 md:p-6 border-b border-outline-variant/20 space-y-4 shrink-0 bg-surface/40">
          
          {/* Header Title and Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black text-on-surface tracking-tight">Point of Sale</h1>
              <p className="text-xs font-medium text-on-surface-variant mt-0.5">
                Select items or scan barcode to add to cart
              </p>
            </div>

            {/* Pill Search & Barcode Bar */}
            <div className="flex items-center gap-2 max-w-md w-full">
              <div className="relative flex-1">
                <form onSubmit={handleBarcodeSubmit}>
                  <Input
                    type="text"
                    value={searchQuery || barcodeInput}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setBarcodeInput(e.target.value);
                    }}
                    placeholder="Scan Barcode or Search Product..."
                    leftIcon={<Barcode className="w-4 h-4 text-on-surface-variant" />}
                    rightIcon={
                      (searchQuery || barcodeInput) ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setBarcodeInput('');
                          }}
                          className="text-on-surface-variant hover:text-on-surface"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      ) : undefined
                    }
                    className="rounded-full bg-surface-container-low/60 border-outline-variant/30 h-10 text-xs"
                  />
                </form>
              </div>

              {/* Quick Custom Item Button (Single clean plus icon) */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCustomItemOpen(true)}
                className="shrink-0 rounded-full font-bold border-primary/40 text-primary hover:bg-primary/10 h-10 px-4 gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Custom Item</span>
                <span className="sm:hidden">Custom</span>
              </Button>
            </div>
          </div>

          {/* Category Tabs Bar with Left/Right Arrows for 100+ Categories */}
          <div className="relative flex items-center">
            {/* Scroll Left Button */}
            <button
              type="button"
              onClick={() => scrollCategories('left')}
              className="hidden sm:flex w-8 h-8 rounded-full bg-surface border border-outline-variant/30 shadow-xs items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-low shrink-0 mr-1.5 transition-colors cursor-pointer z-10"
              title="Previous Categories"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scrollable Category Pills */}
            <div
              ref={categoryScrollRef}
              className="flex-1 flex items-center gap-2 overflow-x-auto pb-1 scroll-smooth no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                let label = cat;
                let count = 0;
                if (cat === 'all') {
                  label = 'All Categories';
                  count = products.length;
                } else if (cat === 'top-selling') {
                  label = '★ Top Selling';
                  count = Math.min(8, products.length);
                } else {
                  count = categoryCounts[cat] || 0;
                }

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer select-none",
                      isSelected
                        ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                        : "bg-surface border border-outline-variant/30 text-on-surface-variant hover:border-primary/40 hover:text-on-surface"
                    )}
                  >
                    <span>{label}</span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-full",
                      isSelected ? "bg-white/20 text-white" : "bg-surface-container text-on-surface-variant/70"
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Scroll Right Button */}
            <button
              type="button"
              onClick={() => scrollCategories('right')}
              className="hidden sm:flex w-8 h-8 rounded-full bg-surface border border-outline-variant/30 shadow-xs items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-low shrink-0 ml-1.5 transition-colors cursor-pointer z-10"
              title="Next Categories"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Cards Grid with Infinite Scroll */}
        <div
          onScroll={handleGridScroll}
          className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 custom-scrollbar"
        >
          {loadingProducts ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3.5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-60 bg-surface-container rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="h-72 flex flex-col items-center justify-center text-center p-6 text-on-surface-variant">
              <ShoppingBag className="w-14 h-14 stroke-[1.2] text-on-surface-variant/30 mb-2" />
              <p className="font-bold text-base text-on-surface">No products found / कोई उत्पाद नहीं मिला</p>
              <p className="text-xs text-on-surface-variant/70 mt-1 max-w-xs">
                Check the product name or add a new unlisted item directly with &quot;Custom Item&quot;.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCustomItemOpen(true)}
                className="mt-4 rounded-full text-xs font-bold text-primary border-primary/30 gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Quick Item / तुरंत सामान जोड़ें</span>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3.5">
              {displayedProducts.map((p) => {
                const inCart = cart.find(c => c.productId === p._id);
                const isOutOfStock = p.currentStock <= 0;
                const catName = (p as any).categoryId?.name || (typeof p.category === 'string' ? p.category : '') || '';

                return (
                  <Card
                    key={p._id}
                    onClick={() => {
                      if (!isOutOfStock) addToCart(p);
                    }}
                    className={cn(
                      "group relative flex flex-col justify-between p-3 rounded-2xl border transition-all select-none cursor-pointer bg-surface",
                      isOutOfStock
                        ? "opacity-55 cursor-not-allowed bg-surface-container-low border-outline-variant/20"
                        : "hover:shadow-lg hover:border-primary/50 hover:-translate-y-0.5 active:scale-[0.99] border-outline-variant/30"
                    )}
                  >
                    {/* Top Image Container with Stock & Cart Badges */}
                    <div className="relative w-full h-32 sm:h-36 rounded-xl overflow-hidden bg-surface-container-low/60 flex items-center justify-center border border-outline-variant/15">
                      
                      {/* Product Photo or Clean Icon Fallback */}
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-on-surface-variant/35 group-hover:text-primary transition-colors">
                          <Package className="w-10 h-10 stroke-[1.2]" />
                        </div>
                      )}

                      {/* Top-Left Stock Badge with High-Contrast Color Combination */}
                      <span className={cn(
                        "absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide shadow-sm flex items-center gap-1 z-10",
                        isOutOfStock
                          ? "bg-rose-600 text-white"
                          : (p.currentStock <= 5
                              ? "bg-amber-500 text-white"
                              : "bg-emerald-600 text-white")
                      )}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/90 shrink-0" />
                        <span>{isOutOfStock ? 'Out of Stock' : `${p.currentStock} in stock`}</span>
                      </span>

                      {/* Top-Right In-Cart Badge */}
                      {inCart && (
                        <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-black shadow-md flex items-center gap-1 animate-in zoom-in-50">
                          {inCart.quantity} in Cart
                        </span>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="mt-2.5 flex-1 flex flex-col justify-between">
                      <div>
                        {catName && (
                          <p className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/70 mb-0.5 truncate">
                            {catName}
                          </p>
                        )}
                        <h4 className="font-bold text-xs sm:text-sm text-on-surface leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {p.name}
                        </h4>
                      </div>

                      {/* Pricing & Add to Cart (Clean Two-Column Row with Zero Overlap) */}
                      <div className="mt-2.5 pt-2 border-t border-outline-variant/15 flex items-center justify-between gap-2">
                        <div className="min-w-0 flex flex-col">
                          {p.mrp && p.mrp > p.sellingPrice ? (
                            <span className="text-[10px] text-on-surface-variant line-through font-medium leading-none mb-0.5">
                              MRP ₹{p.mrp}
                            </span>
                          ) : null}
                          <span className="text-sm sm:text-base font-black text-on-surface tracking-tight leading-none">
                            {formatCurrency(p.sellingPrice)}
                          </span>
                        </div>

                        {/* Add to Cart Circular Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isOutOfStock) addToCart(p);
                          }}
                          disabled={isOutOfStock}
                          className="w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all shrink-0 disabled:opacity-30 active:scale-90 cursor-pointer shadow-xs"
                          title="Add to Cart"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Infinite Scroll Footer indicator */}
          {filteredProducts.length > visibleCount && (
            <div className="py-6 flex flex-col items-center justify-center gap-2 text-xs text-on-surface-variant font-semibold">
              <span>Showing {displayedProducts.length} of {filteredProducts.length} products</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVisibleCount(prev => Math.min(prev + 24, filteredProducts.length))}
                className="rounded-full text-xs font-bold"
              >
                Load More Products / और उत्पाद देखें
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION: CART & CHECKOUT PANEL */}
      <Card className="w-full lg:w-[440px] xl:w-[480px] flex flex-col h-full max-h-full min-h-0 rounded-none border-l border-y-0 border-r-0 shadow-2xl shrink-0 bg-surface overflow-hidden">
        
        {/* Customer Header Box (Reference Design) */}
        <div className="p-4 border-b border-outline-variant/20 bg-surface-container-low/40 shrink-0">
          <div className="relative" ref={custDropdownRef}>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-surface border border-outline-variant/30 shadow-xs">
              
              {/* Avatar and Customer Name */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-black text-sm shrink-0 uppercase">
                  {selectedCustomer ? (selectedCustomer.name?.slice(0, 2) || 'CU') : <User className="w-5 h-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-on-surface truncate">
                      {selectedCustomer ? selectedCustomer.name : 'Walk-in Customer'}
                    </span>
                  </div>
                  <span className="text-xs text-on-surface-variant block truncate">
                    {selectedCustomer?.phone ? selectedCustomer.phone : '+91 XXXXX XXXXX'}
                  </span>
                </div>
              </div>

              {/* Change / Edit button */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCustDropdownOpen(!isCustDropdownOpen)}
                  className="h-8 px-2.5 text-xs font-bold text-primary hover:bg-primary/10 gap-1 rounded-xl"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Change</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCustomerModalOpen(true)}
                  className="h-8 w-8 text-on-surface-variant hover:text-primary rounded-xl"
                  title="New Customer"
                >
                  <UserPlus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Customer Dropdown search */}
            {isCustDropdownOpen && (
              <div className="absolute left-0 right-0 top-16 z-40 bg-surface border border-outline-variant/30 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-3">
                <Input
                  type="text"
                  placeholder="Search customer name or phone..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="text-xs mb-2 h-9 rounded-xl"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCustomer(null);
                    setIsCustDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  Walk-in Customer (सामान्य ग्राहक)
                </button>
                <div className="divide-y divide-outline-variant/10">
                  {allCustomers
                    .filter(c => c.name?.toLowerCase().includes(customerSearch.toLowerCase()) || c.mobile?.includes(customerSearch))
                    .map(c => (
                      <button
                        key={c._id}
                        type="button"
                        onClick={() => {
                          setSelectedCustomer({ _id: c._id, name: c.name, phone: c.mobile });
                          setIsCustDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2.5 text-xs rounded-xl hover:bg-primary/5 flex items-center justify-between transition-colors"
                      >
                        <span className="font-bold text-on-surface">{c.name}</span>
                        <span className="text-[11px] text-on-surface-variant">{c.mobile}</span>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Current Order Header */}
        <div className="px-5 py-3 border-b border-outline-variant/20 flex items-center justify-between shrink-0 bg-surface-container-lowest">
          <h3 className="text-sm font-black text-on-surface">Current Order</h3>
          <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-xs font-bold text-on-surface-variant border border-outline-variant/30">
            {totalItemsCount} items
          </span>
        </div>

        {/* Cart Items List with min-h-0 constraint */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-on-surface-variant/50">
              <ShoppingBag className="w-14 h-14 stroke-[1] mb-2 text-on-surface-variant/30" />
              <p className="font-bold text-base text-on-surface">Cart is empty / कार्ट खाली है</p>
              <p className="text-xs mt-1">Tap any item from the left catalogue to add to this bill.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between p-3 rounded-2xl border border-outline-variant/20 bg-surface hover:bg-surface-container-lowest transition-all shadow-xs"
              >
                {/* Thumbnail & Item Name */}
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                  <div className="w-12 h-12 rounded-xl bg-surface-container overflow-hidden shrink-0 flex items-center justify-center border border-outline-variant/20">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-6 h-6 text-on-surface-variant/40" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h5 className="font-bold text-xs text-on-surface truncate leading-tight">
                      {item.name}
                    </h5>
                    <span className="text-[11px] text-on-surface-variant font-medium mt-0.5 block">
                      {formatCurrency(item.sellingPrice)} / unit
                    </span>
                  </div>
                </div>

                {/* Quantity Stepper & Line Price */}
                <div className="flex items-center gap-3 shrink-0">
                  
                  {/* Stepper (- 1 +) */}
                  <div className="flex items-center bg-surface-container-low border border-outline-variant/30 rounded-xl p-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (item.quantity === 1) {
                          removeFromCart(item.productId);
                        } else {
                          updateQuantity(item.productId, -1);
                        }
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <span className="w-7 text-center font-black text-xs text-on-surface">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Line Total Price */}
                  <div className="w-20 text-right font-black text-sm text-on-surface">
                    {formatCurrency(item.sellingPrice * item.quantity)}
                  </div>

                  {/* Remove Item */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="text-on-surface-variant/40 hover:text-error transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Checkout & Payment Area (Pinned to bottom) */}
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-low/50 space-y-3 shrink-0">
          
          {/* Summary Breakdown */}
          <div className="space-y-1.5 text-xs font-medium text-on-surface-variant">
            <div className="flex justify-between">
              <span>Items Subtotal ({totalItemsCount} items)</span>
              <span className="font-bold text-on-surface">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax (GST {taxPercent}%)</span>
              <span className="font-bold text-on-surface">+{formatCurrency(tax)}</span>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setIsDiscountOpen(!isDiscountOpen)}
                className="text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Tag className="w-3 h-3" />
                {discount > 0 ? `Discount Applied (${formatCurrency(discount)})` : '+ Add Discount'}
              </button>
              {discount > 0 ? (
                <span className="font-bold text-error">-{formatCurrency(discount)}</span>
              ) : (
                <span className="font-bold text-on-surface-variant">-₹0.00</span>
              )}
            </div>

            {/* Expandable Discount Input */}
            {isDiscountOpen && (
              <div className="flex items-center gap-2 pt-1">
                <Input
                  type="number"
                  value={discountVal}
                  onChange={(e) => setDiscountVal(e.target.value)}
                  placeholder="Discount value"
                  className="h-8 text-xs flex-1 rounded-lg"
                  autoFocus
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDiscountType(discountType === 'flat' ? 'percent' : 'flat')}
                  className="h-8 px-2.5 text-xs font-bold"
                >
                  {discountType === 'flat' ? '₹' : '%'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleApplyDiscount}
                  className="h-8 px-3 text-xs font-bold"
                >
                  Apply
                </Button>
              </div>
            )}
          </div>

          {/* Grand Total Row */}
          <div className="flex justify-between items-baseline pt-2 border-t border-outline-variant/20">
            <div>
              <span className="text-base font-black text-on-surface">Total</span>
              <p className="text-[10px] text-on-surface-variant">Total Payable Amount</p>
            </div>
            <span className="text-3xl font-black text-primary tracking-tight">
              {formatCurrency(netAmount)}
            </span>
          </div>

          {/* Direct Payment Method Tabs (Reference Image 1 & 2) */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setSelectedPaymentMethod('cash')}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                selectedPaymentMethod === 'cash'
                  ? "bg-primary/10 border-primary text-primary shadow-xs ring-1 ring-primary"
                  : "bg-surface border-outline-variant/30 text-on-surface-variant hover:border-primary/40 hover:bg-surface-container-low"
              )}
            >
              <Banknote className="w-4 h-4" />
              <span>CASH</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPaymentMethod('card')}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                selectedPaymentMethod === 'card'
                  ? "bg-primary/10 border-primary text-primary shadow-xs ring-1 ring-primary"
                  : "bg-surface border-outline-variant/30 text-on-surface-variant hover:border-primary/40 hover:bg-surface-container-low"
              )}
            >
              <CreditCard className="w-4 h-4" />
              <span>CARD</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPaymentMethod('upi')}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                selectedPaymentMethod === 'upi'
                  ? "bg-primary/10 border-primary text-primary shadow-xs ring-1 ring-primary"
                  : "bg-surface border-outline-variant/30 text-on-surface-variant hover:border-primary/40 hover:bg-surface-container-low"
              )}
            >
              <Smartphone className="w-4 h-4" />
              <span>UPI / QR</span>
            </button>
          </div>

          {/* Quick Actions Row: Hold Order & Save Draft/Clear */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsHoldModalOpen(true)}
              disabled={cart.length === 0}
              className="h-10 rounded-xl border-outline-variant/30 font-bold text-xs gap-1.5 text-on-surface-variant hover:text-primary"
            >
              <Clock className="w-4 h-4" />
              <span>Hold Order</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (window.confirm('Clear current cart? / क्या आप कार्ट खाली करना चाहते हैं?')) {
                  clearCart();
                }
              }}
              disabled={cart.length === 0}
              className="h-10 rounded-xl border-outline-variant/30 font-bold text-xs gap-1.5 text-on-surface-variant hover:text-error"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Save as Draft</span>
            </Button>
          </div>

          {/* Complete Sale Button */}
          <Button
            onClick={handleCompleteSaleClick}
            disabled={cart.length === 0}
            className="w-full h-12 rounded-xl text-white font-black text-sm shadow-xl shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-[0.99]"
          >
            <Receipt className="w-5 h-5" />
            <span>Complete Sale</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

        </div>

      </Card>

      {/* MODAL 1: Payment Tender Modal (for Cash Change Calculation) */}
      {isPaymentOpen && (
        <PaymentModal
          onClose={() => setIsPaymentOpen(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* MODAL 2: Universal Receipt & Tax Invoice */}
      {isInvoiceOpen && (
        <POSInvoiceModal
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          sale={invoiceData}
          items={invoiceData?.items || []}
          onNewSale={() => {
            setIsInvoiceOpen(false);
            clearCart();
          }}
        />
      )}

      {/* MODAL 3: Custom / Ad-hoc Item */}
      {isCustomItemOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="relative w-full max-w-sm p-5 space-y-4 animate-in zoom-in-95 rounded-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">Custom / Ad-hoc Item</h3>
                  <p className="text-[11px] text-on-surface-variant">खुला सामान तुरंत बिल में जोड़ें</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsCustomItemOpen(false)} className="h-8 w-8 text-on-surface-variant hover:text-error">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleAddCustomItem} className="space-y-3">
              <Input
                label="Item Name / सामान का नाम"
                type="text"
                placeholder="e.g. Masala Tea, Special Samosa..."
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                autoFocus
                required
              />

              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Price (₹) / मूल्य"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  required
                />
                <Input
                  label="Quantity / मात्रा"
                  type="number"
                  min="1"
                  value={customQty}
                  onChange={(e) => setCustomQty(e.target.value)}
                />
              </div>

              <div className="pt-2 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCustomItemOpen(false)}
                  className="flex-1 border-outline-variant/30"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 font-bold"
                >
                  Add to Bill
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* MODAL 4: Hold Bill */}
      {isHoldModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="relative w-full max-w-sm p-5 space-y-4 animate-in zoom-in-95 rounded-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-warning" />
                <h3 className="text-sm font-bold text-on-surface">Hold Current Bill / बिल होल्ड करें</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsHoldModalOpen(false)} className="h-8 w-8 text-on-surface-variant hover:text-error">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-xs text-on-surface-variant">
              इस बिल को अस्थायी रूप से रोकें ताकि आप अगले ग्राहक का बिल बना सकें। इसे कभी भी <strong>Hold Bills</strong> से पुनः खोला जा सकता है।
            </p>

            <Input
              label="Reference Note (Optional)"
              type="text"
              placeholder="e.g. Customer getting cash / गाड़ी में पैसे हैं"
              value={holdNote}
              onChange={(e) => setHoldNote(e.target.value)}
            />

            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                onClick={() => setIsHoldModalOpen(false)}
                className="flex-1 border-outline-variant/30"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmHold}
                className="flex-1 font-bold"
              >
                Confirm Hold
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL 5: Quick Add Customer */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="relative w-full max-w-sm p-5 space-y-4 animate-in zoom-in-95 rounded-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-on-surface">New Customer / नया ग्राहक</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsCustomerModalOpen(false)} className="h-8 w-8 text-on-surface-variant hover:text-error">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <Input
                label="Full Name / पूरा नाम"
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={newCustName}
                onChange={(e) => setNewCustName(e.target.value)}
                autoFocus
                required
              />

              <Input
                label="Mobile Number / मोबाइल नंबर"
                type="tel"
                placeholder="e.g. 9876543210"
                value={newCustPhone}
                onChange={(e) => setNewCustPhone(e.target.value)}
                required
              />

              <div className="pt-2 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="flex-1 border-outline-variant/30"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 font-bold"
                >
                  Save & Select
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
}
