import type { Category, SortOption, Template } from "@/lib/types";

export function getTemplateCategories(template: Template): Category[] {
  return Array.isArray(template.category)
    ? template.category
    : [template.category];
}

export function getPrimaryCategory(template: Template): Category {
  return getTemplateCategories(template)[0];
}

export function sortTemplates(
  templates: Template[],
  sort: SortOption = "featured",
): Template[] {
  const result = [...templates];
  if (sort === "alphabetical") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    result.sort((a, b) => {
      const featuredDiff =
        Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      if (featuredDiff !== 0) return featuredDiff;
      return a.name.localeCompare(b.name);
    });
  }
  return result;
}
