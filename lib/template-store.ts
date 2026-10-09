import { promises as fs } from "fs";
import path from "path";
import {
  isGitHubStoreEnabled,
  readTemplatesFromGitHub,
  writeTemplatesToGitHub,
} from "@/lib/github-templates";
import type { Category, Template } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { isValidHttpUrl } from "@/lib/url";

const DATA_PATH = path.join(process.cwd(), "data", "templates.json");

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function readFromFilesystem(): Promise<Template[]> {
  const raw = await fs.readFile(DATA_PATH, "utf8");
  const parsed = JSON.parse(raw) as Template[];
  if (!Array.isArray(parsed)) {
    throw new Error("templates.json must be an array");
  }
  return parsed;
}

async function writeToFilesystem(templates: Template[]): Promise<void> {
  await fs.writeFile(
    DATA_PATH,
    `${JSON.stringify(templates, null, 2)}\n`,
    "utf8",
  );
}

export async function readTemplates(): Promise<Template[]> {
  if (isGitHubStoreEnabled()) {
    return readTemplatesFromGitHub();
  }
  return readFromFilesystem();
}

export async function writeTemplates(templates: Template[]): Promise<void> {
  if (isGitHubStoreEnabled()) {
    await writeTemplatesToGitHub(templates);
    return;
  }

  try {
    await writeToFilesystem(templates);
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code?: string }).code)
        : "";
    if (code === "EROFS" || code === "EACCES") {
      throw new Error(
        "This host is read-only. Add GITHUB_TOKEN (and optional GITHUB_REPO) in Vercel Environment Variables so admin can save templates to GitHub.",
      );
    }
    throw error;
  }
}

export type TemplateInput = {
  name: string;
  slug?: string;
  category: Category | Category[];
  description?: string;
  vercelUrl: string;
  thumbnail?: string;
  tags?: string[];
  featured?: boolean;
};

function normalizeCategory(
  category: Category | Category[],
): Category | Category[] {
  const list = (Array.isArray(category) ? category : [category]).filter((c) =>
    (CATEGORIES as readonly string[]).includes(c),
  ) as Category[];

  if (list.length === 0) {
    throw new Error("Select at least one valid category");
  }
  return list.length === 1 ? list[0] : list;
}

export function validateTemplateInput(input: TemplateInput): Template {
  const name = input.name?.trim();
  if (!name) throw new Error("Name is required");

  const slug = slugify(input.slug?.trim() || name);
  if (!slug) throw new Error("Slug is required");

  const vercelUrl = input.vercelUrl?.trim();
  if (!vercelUrl || !isValidHttpUrl(vercelUrl)) {
    throw new Error("A valid https:// Vercel URL is required");
  }

  const description = (input.description ?? "").trim();
  const thumbnail = input.thumbnail?.trim() || undefined;
  const tags = (input.tags ?? [])
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 8);

  return {
    name,
    slug,
    category: normalizeCategory(input.category),
    description:
      description || "Live website demo available for client preview.",
    vercelUrl,
    ...(thumbnail ? { thumbnail } : {}),
    ...(tags.length ? { tags } : {}),
    featured: Boolean(input.featured),
  };
}

export async function addTemplate(input: TemplateInput): Promise<Template> {
  const template = validateTemplateInput(input);
  const templates = await readTemplates();

  if (templates.some((t) => t.slug === template.slug)) {
    throw new Error(`A template with slug "${template.slug}" already exists`);
  }

  templates.push(template);
  await writeTemplates(templates);
  return template;
}

export async function deleteTemplate(slug: string): Promise<boolean> {
  const templates = await readTemplates();
  const next = templates.filter((t) => t.slug !== slug);
  if (next.length === templates.length) return false;
  await writeTemplates(next);
  return true;
}
