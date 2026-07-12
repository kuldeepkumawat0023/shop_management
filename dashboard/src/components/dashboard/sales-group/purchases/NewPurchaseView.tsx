'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ArrowLeft, Save, Plus, Trash2, ShoppingCart, Truck, CreditCard } from 'lucide-react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';

export default function NewPurchaseView() {
  const router = useRouter();
  const [items, setItems] = useState([
    { id: 1, name: '', quantity: '', rate: '', tax: '' }
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: '', quantity: '', rate: '', tax: '' }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-col w-full ">
      <div className="sticky top-16 md:top-20 z-20 bg-background border-b border-outline-variant/20 p-4 md:p-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button onClick={() => router.back()} variant="outline" className="w-10 h-10 p-0 rounded-xl border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-black text-on-surface tracking-tight">Create Purchase Order</h2>
              <p className="text-sm font-medium text-on-surface-variant">Log a new bill or order from a supplier</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
            <Button onClick={() => router.back()} variant="outline" className="flex-1 sm:flex-none font-bold border-outline-variant/30">Cancel</Button>
            <Button className="flex-1 sm:flex-none gradient-button text-white font-bold shadow-md hover:shadow-lg gap-2">
              <Save className="w-4 h-4 shrink-0" />
              <span className="truncate">Save Order</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 md:p-6 lg:p-8 flex-1 w-full">
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-8">

          {/* General Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-outline-variant/10">
                <Truck className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-on-surface">Supplier Info</h3>
              </div>
              <Input
                label="Supplier Name"
                placeholder="Search or select supplier..."
                required
              />
              <div className="grid grid-cols-2 gap-5">
                <Input
                  label="PO Number"
                  placeholder="PO-2023-006"
                />
                <Input
                  label="Order Date"
                  type="date"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-outline-variant/10">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-on-surface">Terms & Shipping</h3>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <Input
                  label="Expected Delivery"
                  type="date"
                />
                <Input
                  label="Shipping Cost"
                  type="number"
                  placeholder="₹0.00"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <Input
                  label="Payment Terms"
                  placeholder="e.g. Net 30"
                />
                <Input
                  label="Discount Amount"
                  type="number"
                  placeholder="₹0.00"
                />
              </div>
            </div>
          </div>

          {/* Items / Products */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant/10">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-on-surface">Order Items</h3>
              </div>
              <Button variant="outline" onClick={addItem} className="h-8 px-3 text-xs font-bold gap-1.5 border-primary/30 text-primary hover:bg-primary/5">
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              {items.map((item, index) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-3 items-end bg-surface-container/30 p-3 rounded-xl border border-outline-variant/10">
                  <div className="w-full md:flex-1">
                    <Input
                      label={index === 0 ? "Product / Raw Material" : ""}
                      placeholder="Select product..."
                    />
                  </div>
                  <div className="w-full md:w-24">
                    <Input
                      label={index === 0 ? "Qty" : ""}
                      type="number"
                      placeholder="0"
                    />
                  </div>
                  <div className="w-full md:w-32">
                    <Input
                      label={index === 0 ? "Rate (₹)" : ""}
                      type="number"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="w-full md:w-24">
                    <Input
                      label={index === 0 ? "Tax (%)" : ""}
                      type="number"
                      placeholder="18"
                    />
                  </div>
                  <div className="w-full md:w-32">
                    <Input
                      label={index === 0 ? "Total (₹)" : ""}
                      type="number"
                      placeholder="0.00"
                      disabled
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                    className="w-full md:w-12 h-10 border-error/30 text-error hover:bg-error/10 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Summary */}
          <div className="flex flex-col md:flex-row justify-end mt-4">
            <div className="w-full md:w-80 bg-surface/50 border border-outline-variant/20 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-3 text-sm">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="font-bold text-on-surface">₹0.00</span>
              </div>
              <div className="flex justify-between items-center mb-3 text-sm">
                <span className="text-on-surface-variant">Shipping</span>
                <span className="font-bold text-on-surface">₹0.00</span>
              </div>
              <div className="flex justify-between items-center mb-3 text-sm">
                <span className="text-on-surface-variant">Tax Amount</span>
                <span className="font-bold text-on-surface">₹0.00</span>
              </div>
              <div className="flex justify-between items-center mb-4 text-sm text-success">
                <span className="font-medium">Discount</span>
                <span className="font-bold">-₹0.00</span>
              </div>
              <div className="border-t border-outline-variant/20 pt-4 flex justify-between items-center">
                <span className="font-bold text-on-surface text-lg">Grand Total</span>
                <span className="font-black text-primary text-2xl">₹0.00</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
