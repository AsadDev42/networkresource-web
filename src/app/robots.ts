import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { company } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${company.url}/sitemap.xml`,
  };
}
