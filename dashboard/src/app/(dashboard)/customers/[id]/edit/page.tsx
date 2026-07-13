import React from 'react';
import CustomerForm from '@/components/dashboard/parties-group/customers/CustomerForm';

export default function Page({ params }: { params: { id: string } }) {
  return <CustomerForm editId={params.id} />;
}
