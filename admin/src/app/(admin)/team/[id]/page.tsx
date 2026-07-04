import TeamDetailView from '@/components/admin/team/TeamDetailView';

export default function TeamMemberPage({ params }: { params: { id: string } }) {
  return <TeamDetailView memberId={params.id} />;
}
