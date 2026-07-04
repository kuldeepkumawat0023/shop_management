import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartShop Admin — Super Admin Panel",
  description: "Platform management dashboard for SmartShop ERP administrators",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
