import { readTemplates } from "@/lib/template-store";
import {
  getPrimaryCategory,
  getTemplateCategories,
  sortTemplates,
} from "@/lib/template-helpers";
import { getSafeVercelUrl, isValidHttpUrl } from "@/lib/url";
import type { Category, SortOption, Template } from "@/lib/types";

export {
  getPrimaryCategory,
  getSafeVercelUrl,
  getTemplateCategories,
  isValidHttpUrl,
  sortTemplates,
};

export async function getAllTemplates(): Promise<Template[]> {
  return readTemplates();
}

export async function getTemplateBySlug(
  slug: string,
): Promise<Template | undefined> {
  const templates = await readTemplates();
  return templates.find((t) => t.slug === slug);
}

export async function getNeighborTemplates(slug: string): Promise<{
  previous: Template | null;
  next: Template | null;
  currentIndex: number;
  total: number;
}> {
  const list = await readTemplates();
  const index = list.findIndex((t) => t.slug === slug);
  if (index === -1) {
    return { previous: null, next: null, currentIndex: -1, total: list.length };
  }
  return {
    previous: index > 0 ? list[index - 1] : null,
    next: index < list.length - 1 ? list[index + 1] : null,
    currentIndex: index,
    total: list.length,
  };
}

export async function filterAndSortTemplates(options: {
  query?: string;
  category?: Category | "All";
  sort?: SortOption;
}): Promise<Template[]> {
  const query = (options.query ?? "").trim().toLowerCase();
  const category = options.category ?? "All";
  const sort = options.sort ?? "featured";

  let result = await readTemplates();

  if (category !== "All") {
    result = result.filter((t) => getTemplateCategories(t).includes(category));
  }

  if (query) {
    result = result.filter((t) => {
      const haystack = [
        t.name,
        t.description,
        ...getTemplateCategories(t),
        ...(t.tags ?? []),
        t.slug,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  return sortTemplates(result, sort);
}
