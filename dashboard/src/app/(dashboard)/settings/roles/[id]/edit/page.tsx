import React from 'react';
import RoleFormView from '@/components/dashboard/settings/RoleFormView';

export default async function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <RoleFormView roleId={resolvedParams.id} />;
}
