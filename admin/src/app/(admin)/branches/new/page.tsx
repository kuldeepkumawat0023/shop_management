import BranchForm from "@/components/admin/branches/BranchForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Branch | SmartShop Super Admin",
  description: "Register a new store to the platform.",
};

export default function NewBranchPage() {
  return <BranchForm />;
}
