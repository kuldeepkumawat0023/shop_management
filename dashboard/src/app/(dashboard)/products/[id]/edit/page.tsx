import React from 'react';
import NewProductView from '@/components/dashboard/inventory-group/products/NewProductView';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="flex-1 bg-background h-full w-full overflow-hidden">
      <NewProductView editId={id} />
    </div>
  );
}
