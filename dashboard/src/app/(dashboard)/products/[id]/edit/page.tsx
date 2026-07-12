import React from 'react';
import ProductForm from '@/components/dashboard/inventory-group/products/ProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="flex-1 bg-background h-full w-full overflow-hidden">
      <ProductForm editId={id} />
    </div>
  );
}
