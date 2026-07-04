import SubscriptionDetailView from "@/components/admin/subscriptions/SubscriptionDetailView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan Details | SmartShop Super Admin",
  description: "View subscription plan details.",
};

export default async function SubscriptionDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <SubscriptionDetailView planId={params.id} />;
}
