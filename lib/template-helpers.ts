import type { Category, SortOption, Template } from "@/lib/types";

export function getTemplateCategories(template: Template): Category[] {
  return Array.isArray(template.category)
    ? template.category
    : [template.category];
}

export function getPrimaryCategory(template: Template): Category {
  return getTemplateCategories(template)[0];
}

/** Keeps Demo 2 before Demo 10 (numeric-aware). */
function compareDemoNames(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

export function sortTemplates(
  templates: Template[],
  sort: SortOption = "featured",
): Template[] {
  const result = [...templates];
  if (sort === "alphabetical") {
    result.sort((a, b) => compareDemoNames(a.name, b.name));
  } else {
    // Keep curated JSON order; only float featured items to the top.
    result.sort((a, b) => {
      const featuredDiff =
        Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      if (featuredDiff !== 0) return featuredDiff;
      return 0;
    });
  }
  return result;
}
