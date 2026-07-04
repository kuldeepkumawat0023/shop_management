import SubscriptionForm from "@/components/admin/subscriptions/SubscriptionForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Plan | SmartShop Super Admin",
  description: "Edit subscription plan details.",
};

export default async function EditSubscriptionPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <SubscriptionForm planId={params.id} />;
}
