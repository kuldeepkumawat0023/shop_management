import BranchesView from "@/components/admin/branches/BranchesView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Branches | SmartShop Super Admin",
  description: "View and manage all connected stores across the platform.",
};

export default function BranchesPage() {
  return <BranchesView />;
}
