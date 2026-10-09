import { TemplateCard } from "@/components/TemplateCard";
import { sortTemplates } from "@/lib/template-helpers";
import type { Template } from "@/lib/types";

interface TemplateGalleryProps {
  templates: Template[];
}

export function TemplateGallery({ templates }: TemplateGalleryProps) {
  const display = sortTemplates(templates, "featured");

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
