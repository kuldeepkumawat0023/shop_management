import { Metadata } from "next";

export function buildMetadata(): Metadata {
  return {
    title: {
      default: "SmartShop POS",
      template: "%s | SmartShop POS",
    },
    description: "Advanced Point of Sale and Shop Management System",
    icons: {
      icon: "/favicon.ico",
    },
  };
}
