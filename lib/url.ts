import type { Template } from "@/lib/types";

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function getSafeVercelUrl(template: Template): string | null {
  return isValidHttpUrl(template.vercelUrl) ? template.vercelUrl : null;
}
