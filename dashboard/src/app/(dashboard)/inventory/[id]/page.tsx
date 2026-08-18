import InventoryDetailView from '@/components/dashboard/inventory-group/inventory/InventoryDetailView';

export default async function InventoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <InventoryDetailView productId={id} />;
}
