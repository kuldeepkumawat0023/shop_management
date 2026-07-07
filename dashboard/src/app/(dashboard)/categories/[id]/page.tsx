import React from 'react';
import CategoryDetailView from '@/components/dashboard/categories/CategoryDetailView';

export default async function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CategoryDetailView categoryId={id} />;
}
