import RecipeDetailView from '@/components/dashboard/manufacturing/recipes/RecipeDetailView';

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  return <RecipeDetailView recipeId={params.id} />;
}
