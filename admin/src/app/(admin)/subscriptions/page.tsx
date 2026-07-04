import SubscriptionsView from "@/components/admin/subscriptions/SubscriptionsView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscriptions | SmartShop Super Admin",
  description: "Manage SaaS subscription plans.",
};

export default function SubscriptionsPage() {
  return <SubscriptionsView />;
}
