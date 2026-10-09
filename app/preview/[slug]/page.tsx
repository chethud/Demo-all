import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PreviewFrame } from "@/components/PreviewFrame";
import {
  getAllTemplates,
  getNeighborTemplates,
  getTemplateBySlug,
} from "@/lib/templates";

export const dynamic = "force-dynamic";

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PreviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);
  if (!template) {
    return { title: "Template not found" };
  }
  return {
    title: `Preview · ${template.name}`,
    description: template.description,
  };
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);

  if (!template) {
    notFound();
  }

  const neighbors = await getNeighborTemplates(slug);
  const templates = await getAllTemplates();

  return (
    <PreviewFrame
      template={template}
      templates={templates}
      previous={neighbors.previous}
      next={neighbors.next}
    />
  );
}
