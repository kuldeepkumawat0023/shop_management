import CategoryDetailView from '@/components/dashboard/categories/CategoryDetailView';

export default function CategoryDetailPage({ params }: { params: { id: string } }) {
  return <CategoryDetailView categoryId={params.id} />;
}
