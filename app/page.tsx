import { TemplateGallery } from "@/components/TemplateGallery";
import { getAllTemplates } from "@/lib/templates";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const templates = await getAllTemplates();
  return <TemplateGallery templates={templates} />;
}
