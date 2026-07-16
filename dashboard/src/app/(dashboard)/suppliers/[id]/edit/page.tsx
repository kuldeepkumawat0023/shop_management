import React from 'react';
import SupplierForm from '@/components/dashboard/parties-group/suppliers/SupplierForm';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <SupplierForm editId={resolvedParams.id} />;
}
