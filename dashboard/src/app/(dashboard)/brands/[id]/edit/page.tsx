import React from 'react';
import BrandForm from '@/components/dashboard/inventory-group/brands/BrandForm';

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="flex-1 bg-background h-full w-full overflow-hidden">
      <BrandForm editId={id} />
    </div>
  );
}
