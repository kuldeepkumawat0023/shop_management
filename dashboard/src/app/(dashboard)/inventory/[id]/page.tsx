import InventoryDetailView from '@/components/dashboard/inventory-group/inventory/InventoryDetailView';

export default function InventoryDetailPage({ params }: { params: { id: string } }) {
  return <InventoryDetailView productId={params.id} />;
}
