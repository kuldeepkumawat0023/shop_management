import React from 'react';
import CustomerForm from '@/components/dashboard/parties-group/customers/CustomerForm';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <CustomerForm editId={resolvedParams.id} />;
}
