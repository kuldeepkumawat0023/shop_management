import SubscriptionForm from "@/components/admin/subscriptions/SubscriptionForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Plan | SmartShop Super Admin",
  description: "Create a new subscription plan.",
};

export default function NewSubscriptionPage() {
  return <SubscriptionForm />;
}
