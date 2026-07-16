import ProductionDetailView from '@/components/dashboard/manufacturing/productions/ProductionDetailView';

export default function ProductionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <ProductionDetailView productionId={params.id} />;
}
