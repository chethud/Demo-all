"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Template } from "@/lib/types";
import { getPrimaryCategory } from "@/lib/template-helpers";

interface PreviewToolbarProps {
  template: Template;
  templates: Template[];
  previous: Template | null;
  next: Template | null;
}

export function PreviewToolbar({
  template,
  templates,
  previous,
  next,
}: PreviewToolbarProps) {
  const router = useRouter();
  const primary = getPrimaryCategory(template);

  return (
    <div className="fixed inset-x-0 top-0 z-40 border-b border-charcoal/10 bg-white">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-3 py-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/#templates"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-charcoal/12 px-2.5 py-1.5 text-xs text-charcoal/70 transition hover:border-charcoal/25 hover:text-charcoal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              className="h-3.5 w-3.5"
              aria-hidden
            >
              <path d="M15 18 9 12l6-6" />
            </svg>
            Back
          </Link>
          <div className="min-w-0">
            <h1 className="truncate font-display text-base text-charcoal sm:text-lg">
              {template.name}
            </h1>
            <p className="truncate text-[11px] uppercase tracking-[0.14em] text-charcoal/45">
              {primary}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-end">
          <label htmlFor="template-switcher" className="sr-only">
            Switch template
          </label>
          <select
            id="template-switcher"
            value={template.slug}
            onChange={(e) => router.push(`/preview/${e.target.value}`)}
            className="max-w-[180px] truncate rounded-lg border border-charcoal/12 bg-white px-2.5 py-1.5 text-xs text-charcoal outline-none sm:max-w-[220px]"
          >
            {templates.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1">
            <NavIconButton
              href={previous ? `/preview/${previous.slug}` : undefined}
              label="Previous template"
              disabled={!previous}
            >
              <path d="M15 18 9 12l6-6" />
            </NavIconButton>
            <NavIconButton
              href={next ? `/preview/${next.slug}` : undefined}
              label="Next template"
              disabled={!next}
            >
              <path d="m9 18 6-6-6-6" />
            </NavIconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavIconButton({
  href,
  label,
  disabled,
  children,
}: {
  href?: string;
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const className =
    "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-charcoal/12 text-charcoal/70 transition hover:border-charcoal/25 hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-35";

  if (disabled || !href) {
    return (
      <button type="button" className={className} disabled aria-label={label}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className="h-4 w-4"
          aria-hidden
        >
          {children}
        </svg>
      </button>
    );
  }

  return (
    <Link href={href} className={className} aria-label={label}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        className="h-4 w-4"
        aria-hidden
      >
        {children}
      </svg>
    </Link>
  );
}
