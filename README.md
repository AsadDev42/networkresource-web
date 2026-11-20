# Network Resource website

Redesign of [networkresource.com](https://networkresource.com), a San Francisco Bay Area IT provider. The home page leads with the headline "Business IT Support. Simplified.", a photo of an engineer with a client, and the five core services as buttons.

Live preview: https://asaddev42.github.io/networkresource-web/

## Stack

- Next.js (App Router) as a static export, TypeScript, Tailwind CSS v4
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

The homepage photo is by Mikhail Nilov on [Pexels](https://www.pexels.com/photo/a-man-and-woman-talking-in-the-office-7988670/) (Pexels license, free for commercial use). Replace `src/assets/hero-support.jpg` to change it.
