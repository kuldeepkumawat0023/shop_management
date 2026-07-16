import React from 'react';
import SupplierDetailView from '@/components/dashboard/parties-group/suppliers/SupplierDetailView';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <SupplierDetailView id={resolvedParams.id} />;
}
