import React from 'react';
import RoleDetailView from '@/components/dashboard/settings/RoleDetailView';

export default async function RoleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <RoleDetailView roleId={resolvedParams.id} />;
}
