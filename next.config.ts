import type { NextConfig } from "next";

/**
 * The site is a static export, hosted on GitHub Pages at https://asaddev42.github.io/networkresource-web/.
 * The Pages build (GITHUB_PAGES=true, set in .github/workflows/deploy.yml) serves everything under
 * /networkresource-web; local builds and `next dev` serve from the root.
 *
 * Static hosting has no server, so the legacy *.php → new URL 301 redirects of the old site are not
 * part of this build. On a host with redirects (or once the real domain points here), map:
 *   /index.php → /                        /networkservices.php → /services/network-services
 *   /networkrelocation.php → /services/network-relocation
 *   /advisoryconsulting.php → /services/advisory-consulting
 *   /serviceplans.php → /service-plans    /serviceplans-remote.php → /service-plans/nr-remote
 *   /serviceplans-complete.php → /service-plans/nr-complete
 *   /partners.php → /partners             /aboutus.php → /about
 *   /our-values.php → /about/values       /our-clients.php → /about/clients
 *   /contact.php → /contact               /quote.php → /request-a-quote
 */
const basePath = process.env.GITHUB_PAGES === "true" ? "/networkresource-web" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // GitHub Pages serves /about/ as /about/index.html, so every route gets a trailing slash.
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // drei's <Html> labels mount their own React roots; Strict Mode's double-mount makes
  // React 19 log "synchronously unmount a root" warnings in development only.
  reactStrictMode: false,
  // Cache Components is deliberately off: it keeps hidden routes alive with <Activity>,
  // which would keep WebGL contexts and ScrollTriggers around between pages.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
