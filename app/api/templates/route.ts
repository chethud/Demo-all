import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { addTemplate, readTemplates } from "@/lib/template-store";
import type { Category } from "@/lib/types";

export async function GET() {
  const templates = await readTemplates();
  return NextResponse.json({ templates });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const tags =
      typeof body.tags === "string"
        ? body.tags.split(",").map((t) => t.trim())
        : Array.isArray(body.tags)
          ? (body.tags as string[])
          : [];

    const category = body.category as Category | Category[];

    const template = await addTemplate({
      name: String(body.name ?? ""),
      slug: body.slug ? String(body.slug) : undefined,
      category,
      description: body.description ? String(body.description) : undefined,
      vercelUrl: String(body.vercelUrl ?? ""),
      thumbnail: body.thumbnail ? String(body.thumbnail) : undefined,
      tags,
      featured: Boolean(body.featured),
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to add template";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
