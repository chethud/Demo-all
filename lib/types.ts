export const CATEGORIES = [
  "Business & Corporate",
  "E-commerce",
  "Fashion & Clothing",
  "Restaurants & Cafés",
  "Hotels & Homestays",
  "Healthcare",
  "Real Estate",
  "Education",
  "SaaS & Technology",
  "Portfolio & Agency",
  "Landing Pages",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type SortOption = "featured" | "alphabetical";

export interface Template {
  name: string;
  slug: string;
  /** One or more categories for filtering */
  category: Category | Category[];
  description: string;
  vercelUrl: string;
  /** Path under /public, e.g. "/templates/mysore-silk.jpg". Optional. */
  thumbnail?: string;
  tags?: string[];
  featured?: boolean;
}

export interface SiteConfig {
  agencyName: string;
  organizationName: string;
  galleryTitle: string;
  agencyTagline: string;
  logoSrc: string;
}
