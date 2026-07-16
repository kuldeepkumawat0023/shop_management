import RecipeDetailView from '@/components/dashboard/manufacturing/recipes/RecipeDetailView';

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <RecipeDetailView recipeId={resolvedParams.id} />;
}
