import ProductionDetailView from '@/components/dashboard/manufacturing/productions/ProductionDetailView';

export default async function ProductionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ProductionDetailView productionId={resolvedParams.id} />;
}
