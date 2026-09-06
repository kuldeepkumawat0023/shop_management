"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AutoScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
    const mainContent = document.getElementById('dashboard-main-content');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname]);

  return null;
}
