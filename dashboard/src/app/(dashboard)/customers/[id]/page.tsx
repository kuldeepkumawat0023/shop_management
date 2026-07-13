import React from 'react';
import CustomerDetailView from '@/components/dashboard/parties-group/customers/CustomerDetailView';

export default function Page({ params }: { params: { id: string } }) {
  return <CustomerDetailView id={params.id} />;
}
