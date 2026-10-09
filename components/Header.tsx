"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site";

export function Header() {
  const pathname = usePathname();

  if (pathname.startsWith("/preview")) {
    return null;
  }

  const isAdmin = pathname.startsWith("/admin");
  const title = isAdmin ? "KSIC • Admin" : siteConfig.galleryTitle;

  return (
    <header className="bg-maroon" style={{ color: "#ffffff" }}>
      <div className="mx-auto max-w-5xl px-4 py-10 text-center sm:px-6 sm:py-12 lg:py-14">
        <Link
          href="/"
          className="mx-auto inline-flex rounded bg-white px-3 py-2 shadow-[0_6px_20px_rgba(0,0,0,0.22)] transition hover:opacity-95"
        >
          <Image
            src={siteConfig.logoSrc}
            alt="Mysore Silk Heritage Weaves"
            width={160}
            height={96}
            className="h-14 w-auto object-contain sm:h-16"
            priority
          />
        </Link>

        <p
          className="mt-6 text-[10px] font-medium uppercase tracking-[0.28em] sm:text-[11px]"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          {siteConfig.organizationName}
        </p>

        <div className="mx-auto mt-4 flex max-w-md items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c4a35a]" />
          <span className="h-1.5 w-1.5 rotate-45 bg-[#c4a35a]" aria-hidden />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c4a35a]" />
        </div>

        <h1
          className="mt-4 font-display text-3xl leading-none tracking-tight sm:text-4xl lg:text-[2.75rem]"
          style={{ color: "#ffffff" }}
        >
          {title}
        </h1>

        {!isAdmin && (
          <p
            className="mx-auto mt-4 max-w-lg text-sm leading-relaxed sm:text-[15px]"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            {siteConfig.agencyTagline}
          </p>
        )}
      </div>
    </header>
  );
}
