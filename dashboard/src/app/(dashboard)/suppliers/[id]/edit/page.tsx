import React from 'react';
import SupplierForm from '@/components/dashboard/parties-group/suppliers/SupplierForm';

export default function Page({ params }: { params: { id: string } }) {
  return <SupplierForm editId={params.id} />;
}
