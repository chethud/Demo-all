"use client";

import { useEffect, useState } from "react";
import { TemplateCard } from "@/components/TemplateCard";
import { sortTemplates } from "@/lib/template-helpers";
import type { Template } from "@/lib/types";

interface TemplateGalleryProps {
  templates: Template[];
}

const STORAGE_KEY = "ksic-templates";

export function TemplateGallery({ templates }: TemplateGalleryProps) {
  const [items, setItems] = useState(templates);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as Template[];
          if (Array.isArray(parsed) && parsed.length >= templates.length) {
            if (!cancelled) setItems(parsed);
          }
        }
      } catch {
        /* ignore */
      }

      try {
        const res = await fetch("/api/templates", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { templates?: Template[] };
        if (!cancelled && Array.isArray(data.templates)) {
          setItems(data.templates);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.templates));
          } catch {
            /* ignore */
          }
        }
      } catch {
        /* ignore */
      }
    }

    void refresh();
    return () => {
      cancelled = true;
    };
  }, [templates]);

  const display = sortTemplates(items, "featured");

  return (
    <section
      id="templates"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
    >
      {display.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-maroon/20 bg-white/70 px-6 py-16 text-center">
          <p className="text-lg font-medium text-charcoal">No designs yet</p>
          <p className="mt-2 text-sm text-charcoal/55">
            Add websites from the admin page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {display.map((template, index) => (
            <TemplateCard
              key={template.slug}
              template={template}
              number={index + 1}
            />
          ))}
        </div>
      )}
    </section>
  );
}
