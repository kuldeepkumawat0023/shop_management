import React from 'react';
import ProductDetailView from '@/components/dashboard/inventory-group/products/ProductDetailView';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailView productId={id} />;
}
