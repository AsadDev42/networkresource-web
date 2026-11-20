import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { company } from "@/content/site";

const routes: Array<[string, number]> = [
  ["/", 1],
  ["/services", 0.9],
  ["/services/network-services", 0.8],
  ["/services/cybersecurity", 0.8],
  ["/services/property-management-it", 0.8],
  ["/services/network-relocation", 0.8],
  ["/services/advisory-consulting", 0.8],
  ["/it-distribution", 0.6],
  ["/service-plans", 0.9],
  ["/service-plans/nr-remote", 0.8],
  ["/service-plans/nr-complete", 0.8],
  ["/partners", 0.5],
  ["/about", 0.6],
  ["/about/values", 0.4],
  ["/about/clients", 0.4],
  ["/contact", 0.7],
  ["/request-a-quote", 0.7],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(([path, priority]) => ({
    url: `${company.url}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
