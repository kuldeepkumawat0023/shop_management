import React from 'react';
import CustomerDetailView from '@/components/dashboard/parties-group/customers/CustomerDetailView';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <CustomerDetailView id={resolvedParams.id} />;
}
