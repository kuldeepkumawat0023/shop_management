'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Barcode,
  Plus,
  Minus,
  Trash2,
  Clock,
  UserCheck,
  UserPlus,
  CreditCard,
  ShoppingBag,
  X,
  Tag,
  Percent,
  RefreshCw,
  Coffee
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
    holdBill
  } = usePOS();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [barcodeInput, setBarcodeInput] = useState('');

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
  const [discountType, setDiscountType] = useState<'flat' | 'percent'>('flat');
  const [discountVal, setDiscountVal] = useState('');
  const [taxPercent, setTaxPercent] = useState('');

  // Fetch customers
  useEffect(() => {
    customerService.getCustomers().then(res => {
      if (res.success) {
        setAllCustomers(res.data || []);
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

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return ['all', 'top-selling', ...Array.from(set)];
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchCat = true;
      if (selectedCategory === 'top-selling') {
        matchCat = true;
      } else if (selectedCategory !== 'all') {
        matchCat = p.category?.toLowerCase() === selectedCategory.toLowerCase();
      }

      return matchSearch && matchCat;
    });
  }, [products, searchQuery, selectedCategory]);

  // Handle barcode scanner enter key
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const matched = products.find(p => p.sku?.toLowerCase() === barcodeInput.trim().toLowerCase());
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
        setSelectedCustomer({
          _id: created._id || '',
          name: created.name,
          phone: created.mobile || (created as any).phone || ''
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
  };

  // Apply Tax
  const handleApplyTax = () => {
    const pct = parseFloat(taxPercent) || 0;
    const computed = ((subtotal - discount) * pct) / 100;
    setTax(Math.max(0, computed));
  };

  // Hold Bill handler
  const handleConfirmHold = () => {
    holdBill(holdNote || 'Hold Order');
    setIsHoldModalOpen(false);
    setHoldNote('');
  };

  // Completed Sale -> Open Invoice
  const handlePaymentSuccess = (saleData: any) => {
    setIsPaymentOpen(false);
    setInvoiceData(saleData);
    setIsInvoiceOpen(true);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4.5rem)] bg-background overflow-hidden">
      
      {/* LEFT SECTION: CATALOGUE & TOUCH TILES (65% width on desktop) */}
      <div className="flex-1 flex flex-col h-full border-r border-outline-variant/20 overflow-hidden">
        
        {/* Top Search & Actions Bar */}
        <div className="p-3 md:p-4 border-b border-outline-variant/20 bg-surface-container-low/40 space-y-3 shrink-0">
          <div className="flex items-center gap-2">
            
            {/* Live Product Search using common Input */}
            <div className="relative flex-1">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products / उत्पाद खोजें (e.g. Chai, Samosa)..."
                leftIcon={<Search className="w-4 h-4 text-on-surface-variant" />}
                rightIcon={
                  searchQuery ? (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-on-surface-variant hover:text-on-surface"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : undefined
                }
              />
            </div>

            {/* Barcode Quick Scanner using common Input */}
            <form onSubmit={handleBarcodeSubmit} className="hidden sm:flex items-center relative w-48 shrink-0">
              <Input
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Scan Barcode..."
                leftIcon={<Barcode className="w-4 h-4 text-on-surface-variant" />}
                className="text-xs"
              />
            </form>

            {/* Quick Custom Item Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCustomItemOpen(true)}
              className="shrink-0 font-bold border-primary/40 text-primary hover:bg-primary/10 h-10 px-3 gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">+ Custom Item</span>
              <span className="md:hidden">+ खुला सामान</span>
            </Button>
          </div>

          {/* Category Tabs (Horizontal Scroll) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar shrink-0">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              let label = cat;
              if (cat === 'all') label = 'All Items / सभी';
              if (cat === 'top-selling') label = '★ Top Selling / लोकप्रिय';

              return (
                <Button
                  key={cat}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "h-8 px-3 text-xs font-bold whitespace-nowrap",
                    !isSelected && "border-outline-variant/30 text-on-surface-variant bg-surface hover:text-on-surface"
                  )}
                >
                  {label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Product Grid / Visual Cards */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 custom-scrollbar">
          {loadingProducts ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-28 bg-surface-container rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-on-surface-variant">
              <ShoppingBag className="w-12 h-12 stroke-[1.2] text-on-surface-variant/40 mb-2" />
              <p className="font-bold text-sm">No products found / कोई उत्पाद नहीं मिला</p>
              <p className="text-xs text-on-surface-variant/70 mt-1">
                Try searching another name or click &quot;+ Custom Item&quot; to add on the fly.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCustomItemOpen(true)}
                className="mt-4 text-xs font-bold text-primary border-primary/30"
              >
                + Add Quick Item / तुरंत सामान जोड़ें
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredProducts.map((p) => {
                const inCart = cart.find(c => c.productId === p._id);
                const isOutOfStock = p.currentStock <= 0;

                return (
                  <Card
                    key={p._id}
                    onClick={() => {
                      if (!isOutOfStock) addToCart(p);
                    }}
                    className={cn(
                      "group relative flex flex-col justify-between p-3.5 transition-all select-none cursor-pointer",
                      isOutOfStock
                        ? "opacity-50 cursor-not-allowed bg-surface-container-low"
                        : "hover:shadow-md hover:border-primary/50 hover:bg-surface-container-lowest active:scale-95"
                    )}
                  >
                    {/* Badge if in Cart */}
                    {inCart && (
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-[11px] font-black flex items-center justify-center shadow-md animate-in zoom-in-50 z-10">
                        {inCart.quantity}
                      </span>
                    )}

                    <div>
                      {/* Category tag */}
                      <span className="text-[10px] font-bold text-primary/80 uppercase tracking-wider block truncate">
                        {p.category || 'General'}
                      </span>

                      {/* Product Name */}
                      <h4 className="font-bold text-sm text-on-surface leading-tight mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {p.name}
                      </h4>
                    </div>

                    {/* Price and Stock StatusBadge */}
                    <div className="mt-3 pt-2 border-t border-outline-variant/10 flex items-end justify-between">
                      <div>
                        <span className="text-base font-black text-on-surface">
                          {formatCurrency(p.sellingPrice)}
                        </span>
                        {p.mrp && p.mrp > p.sellingPrice && (
                          <span className="text-[10px] text-on-surface-variant line-through ml-1.5">
                            ₹{p.mrp}
                          </span>
                        )}
                      </div>

                      <StatusBadge
                        status={isOutOfStock ? 'Out' : `${p.currentStock}`}
                        variant="soft"
                        colorTheme={isOutOfStock ? 'error' : (p.currentStock <= 5 ? 'warning' : 'success')}
                        className="text-[10px] px-1.5 py-0.5"
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION: CART, CUSTOMER & CHECKOUT (35% width on desktop) */}
      <Card className="w-full lg:w-[420px] xl:w-[460px] flex flex-col h-full rounded-none border-l border-y-0 border-r-0 shadow-lg shrink-0">
        
        {/* Customer Header Bar */}
        <div className="p-3 border-b border-outline-variant/20 bg-surface-container-low/60 shrink-0">
          <div className="relative" ref={custDropdownRef}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-on-surface truncate">
                      {selectedCustomer ? selectedCustomer.name : 'Walk-in Customer / सामान्य ग्राहक'}
                    </span>
                    {selectedCustomer && (
                      <button
                        onClick={() => setSelectedCustomer(null)}
                        className="text-on-surface-variant hover:text-error"
                        title="Remove customer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-on-surface-variant block truncate">
                    {selectedCustomer?.phone ? selectedCustomer.phone : 'Click to select or register'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCustDropdownOpen(!isCustDropdownOpen)}
                  className="h-8 text-xs font-bold border-outline-variant/30"
                >
                  Change
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCustomerModalOpen(true)}
                  className="h-8 w-8 text-primary hover:bg-primary/10"
                  title="Add New Customer"
                >
                  <UserPlus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Customer Search Dropdown */}
            {isCustDropdownOpen && (
              <div className="absolute left-0 right-0 top-12 z-40 bg-surface border border-outline-variant/30 rounded-xl shadow-xl max-h-56 overflow-y-auto p-2">
                <Input
                  type="text"
                  placeholder="Search customer name or phone..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="text-xs mb-2 h-8"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCustomer(null);
                    setIsCustDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-on-surface hover:bg-surface-container-low"
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
                        className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-primary/5 flex items-center justify-between"
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

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-on-surface-variant/60">
              <ShoppingBag className="w-12 h-12 stroke-1 mb-2 text-on-surface-variant/30" />
              <p className="font-bold text-sm">Cart is empty / कार्ट खाली है</p>
              <p className="text-xs mt-1">Tap items on the left to add them to this bill.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between p-2.5 rounded-xl border border-outline-variant/20 bg-surface hover:bg-surface-container-low transition-colors"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <h5 className="font-bold text-xs text-on-surface truncate leading-tight">
                    {item.name}
                  </h5>
                  <span className="text-[11px] text-on-surface-variant">
                    {formatCurrency(item.sellingPrice)} × {item.quantity} = <strong className="text-on-surface font-bold">{formatCurrency(item.sellingPrice * item.quantity)}</strong>
                  </span>
                </div>

                {/* Stepper (+ / -) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (item.quantity === 1) {
                        removeFromCart(item.productId);
                      } else {
                        updateQuantity(item.productId, -1);
                      }
                    }}
                    className="w-7 h-7 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>

                  <span className="w-6 text-center font-black text-xs text-on-surface">
                    {item.quantity}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateQuantity(item.productId, 1)}
                    className="w-7 h-7 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.productId)}
                    className="w-7 h-7 rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-error ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bill Breakdown & Quick Adjustments */}
        <div className="p-3 border-t border-outline-variant/20 bg-surface-container-low/40 space-y-2 shrink-0">
          
          {/* Subtotal */}
          <div className="flex justify-between text-xs text-on-surface-variant font-medium">
            <span>Subtotal / कुल योग ({cart.reduce((s, i) => s + i.quantity, 0)} items):</span>
            <span className="font-bold text-on-surface">{formatCurrency(subtotal)}</span>
          </div>

          {/* Quick Discount Toggle */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-on-surface-variant flex items-center gap-1">
              <Tag className="w-3 h-3 text-primary" />
              Discount / छूट:
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={discountVal}
                onChange={(e) => setDiscountVal(e.target.value)}
                onBlur={handleApplyDiscount}
                placeholder="₹ 0"
                className="w-16 px-1.5 py-0.5 text-xs text-right bg-surface border border-outline-variant/30 rounded text-on-surface"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setDiscountType(discountType === 'flat' ? 'percent' : 'flat');
                  handleApplyDiscount();
                }}
                className="h-6 px-1.5 text-[10px] font-bold text-primary"
              >
                {discountType === 'flat' ? '₹' : '%'}
              </Button>
              {discount > 0 && (
                <span className="font-bold text-error text-xs">-{formatCurrency(discount)}</span>
              )}
            </div>
          </div>

          {/* Quick Tax/GST Toggle */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-on-surface-variant flex items-center gap-1">
              <Percent className="w-3 h-3 text-primary" />
              GST / Tax:
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
                onBlur={handleApplyTax}
                placeholder="0%"
                className="w-16 px-1.5 py-0.5 text-xs text-right bg-surface border border-outline-variant/30 rounded text-on-surface"
              />
              <span className="text-[10px] font-bold text-on-surface-variant">%</span>
              {tax > 0 && (
                <span className="font-bold text-on-surface text-xs">+{formatCurrency(tax)}</span>
              )}
            </div>
          </div>

          {/* Grand Net Total */}
          <div className="flex justify-between items-center pt-2 border-t border-outline-variant/20">
            <div>
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Net Total</span>
              <span className="text-[10px] text-on-surface-variant">कुल देय राशि</span>
            </div>
            <span className="text-2xl font-black text-primary">
              {formatCurrency(netAmount)}
            </span>
          </div>

          {/* Action Buttons: Hold, Clear & Pay */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsHoldModalOpen(true)}
              disabled={cart.length === 0}
              className="border-outline-variant/30 text-on-surface-variant hover:text-primary h-11 flex flex-col items-center justify-center p-1"
            >
              <Clock className="w-4 h-4" />
              <span className="text-[10px] font-bold">Hold</span>
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
              className="border-outline-variant/30 text-on-surface-variant hover:text-error h-11 flex flex-col items-center justify-center p-1"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-[10px] font-bold">Clear</span>
            </Button>

            <Button
              onClick={() => setIsPaymentOpen(true)}
              disabled={cart.length === 0}
              className="col-span-2 text-white font-black text-sm h-11 shadow-lg shadow-primary/20 flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay ₹{netAmount}</span>
            </Button>
          </div>

        </div>

      </Card>

      {/* MODAL 1: Payment Processor */}
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
          <Card className="relative w-full max-w-sm p-5 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">+ Custom / Ad-hoc Item</h3>
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
          <Card className="relative w-full max-w-sm p-5 space-y-4 animate-in zoom-in-95">
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
          <Card className="relative w-full max-w-sm p-5 space-y-4 animate-in zoom-in-95">
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
