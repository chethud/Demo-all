import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteTemplate, readTemplates } from "@/lib/template-store";

export const dynamic = "force-dynamic";

interface RouteProps {
  params: Promise<{ slug: string }>;
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const deleted = await deleteTemplate(slug);

  if (!deleted) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const templates = await readTemplates();
  return NextResponse.json({ ok: true, templates });
}
