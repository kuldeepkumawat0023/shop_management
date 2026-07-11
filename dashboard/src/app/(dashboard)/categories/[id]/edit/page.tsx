import React from 'react';
import CategoryForm from '@/components/dashboard/inventory-group/categories/CategoryForm';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="flex-1 bg-background h-full w-full overflow-hidden">
      <CategoryForm editId={id} />
    </div>
  );
}
