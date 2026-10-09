"use client";

import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/preview")) return null;

  return (
    <footer className="mt-auto border-t border-maroon/10 bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm text-charcoal/55">
          © {new Date().getFullYear()} {siteConfig.organizationName}
        </p>
      </div>
    </footer>
  );
}
