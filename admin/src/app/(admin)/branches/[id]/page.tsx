import BranchDetailView from "@/components/admin/branches/BranchDetailView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Branch Details | SmartShop Super Admin",
  description: "View branch profile, metrics, and billing details.",
};

export default async function BranchDetailsPage({ params }: { params: { id: string } }) {
  // Await params to fix Next.js 15+ synchronous params warning
  const { id } = await params;
  return <BranchDetailView branchId={id} />;
}
