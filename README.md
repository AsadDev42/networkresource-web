# Network Resource website

Redesign of [networkresource.com](https://networkresource.com), a Bay Area managed IT provider. The home page tells the company's story with a scroll-driven 3D office built in React Three Fiber.

Live preview: https://asaddev42.github.io/networkresource-web/

## Stack

- Next.js (App Router) as a static export, TypeScript, Tailwind CSS v4
- three.js, React Three Fiber, drei and postprocessing for the 3D scenes
- GSAP ScrollTrigger and Lenis for scroll and motion
- Light and dark themes (light is the default)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
```

The static site is written to `out/`. Set `GITHUB_PAGES=true` to build for the `/networkresource-web` sub-path used by GitHub Pages.

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages through `.github/workflows/deploy.yml`.

## Quote form

The site is static, so the quote form has no server of its own. By default it opens the visitor's email app with the request addressed to sales@networkresource.com. To receive requests directly, create a form endpoint that accepts JSON (Formspree, Basin or a CRM webhook) and add its URL as the repository variable `QUOTE_ENDPOINT` (Settings, Secrets and variables, Actions, Variables). The next deploy uses it.

## Credits

3D furniture models are CC0 from [Poly Haven](https://polyhaven.com). See `public/models/CREDITS.md`.
