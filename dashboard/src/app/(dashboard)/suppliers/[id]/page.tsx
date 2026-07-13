import React from 'react';
import SupplierDetailView from '@/components/dashboard/parties-group/suppliers/SupplierDetailView';

export default function Page({ params }: { params: { id: string } }) {
  return <SupplierDetailView id={params.id} />;
}
