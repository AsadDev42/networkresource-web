# Network Resource — Revamp Strategy

## 1. Audit of networkresource.com (Nov 2026)

**What the company is:** a San Francisco Bay Area managed IT services provider (founded 1998) that works as
an outsourced IT department for small and medium-sized businesses (5 to ~200 computers). It offers
flat-fee managed support, network engineering across Microsoft / Apple / Cisco / Linux, office network
relocation, advisory consulting, and hardware/software distribution.

**Claims on the site, kept word-for-word or close to it** (none invented):
- Started 1998; 97% client retention rate (About Us)
- "over 100 small and medium-sized business customers" (About Us) vs "over two hundred clients" (Network Services). *Conflict: confirm with client.*
- "team of over 12 experienced engineers" (NR Complete)
- 24/7 support, flat-fee rates, Network Operations Center (NOC)
- Cisco and SonicWALL certified; Microsoft Certified Partner; Apple Authorized Business Agent
- "never been the cause of a move delay" (Network Relocation)

### Existing sitemap → new URLs (old URLs get 301 redirects in `next.config.ts`)

| Old URL | New URL | Status |
|---|---|---|
| /index.php | / | Rebuilt as the 3D story |
| /networkservices.php | /services/network-services | All five service groups and the Linux tech matrix kept |
| /networkrelocation.php | /services/network-relocation | 5-step process, team roles, benefits kept + 3D relocation scene |
| /advisoryconsulting.php | /services/advisory-consulting | Kept, restructured into a 4-phase method |
| /serviceplans.php | /service-plans | Plan comparison |
| /serviceplans-remote.php | /service-plans/nr-remote | Five components kept |
| /serviceplans-complete.php | /service-plans/nr-complete | Eight components kept |
| (Services dropdown) | /services | New index page for the four services |
| networkresourcedistribution.com | /it-distribution | **External site is compromised** (serves casino spam). Replaced by an internal page; not linked. |
| /partners.php | /partners | All 13 partners kept |
| /aboutus.php | /about | Kept |
| /our-values.php | /about/values | All 12 values kept |
| /our-clients.php | /about/clients | Kept (client list given on request) |
| /contact.php | /contact | All numbers, addresses, emails kept |
| /quote.php | /request-a-quote | Same fields (name, email, phone, message) + company, service of interest |

**Data conflicts to confirm with the client:**
- Toll free: 800-553-7800 (most pages) vs 800-334-6980 (homepage footer). The site uses 800-553-7800.
- South Bay: 989 Mangrove Ave, Sunnyvale (homepage) vs 1562 Mission Springs Circle, San Jose (Contact). The site uses the Contact page.
- Header shows 650 325 3335 on home, 800-553-7800 elsewhere.
- Some partner and platform content is dated (BlackBerry, Goodlink, Xserve, Expertcity, Vonage). Kept for accuracy, flagged as "legacy" in the UI copy. Recommend the client review.

## 2. Creative direction — "The quiet machine"

The old site shouts ("Most Trusted!", red buttons). The new idea is the opposite: **good IT is invisible.**
The company's promise is "technology working seamlessly in the background", so the brand is calm, precise and engineered.
Dark ink surfaces, warm bone paper, one signal colour, technical mono labels, and a 3D office network that is
always running.

### Colour tokens
| Token | Hex | Use |
|---|---|---|
| ink-950 | #07090D | Page background (dark) |
| ink-900 | #0C1017 | Raised surfaces |
| ink-800 | #141A24 | Cards, borders base |
| ink-600 | #2A3342 | Hairlines |
| mist-400 | #8A94A6 | Secondary text on dark |
| bone-50 | #F3F1EC | Primary text on dark / light sections |
| bone-200 | #DCD8CF | Light section borders |
| brand-blue | #123A9C | "network" in the logo wordmark; accents on light surfaces |
| blue-500 | #2F6BFF | Brand blue lifted for dark: data, links, the 3D network |
| signal-500 | #E5161F | Brand red ("resource" in the logo) — CTAs, accent words |
| orbit | #1E8CF0 | The logo's orbit ring — backdrops and the NOC ring |
| pulse-400 | #5BE3A6 | Status "healthy / online" only |
| amber-400 | #FFB547 | Status "alert" only |

### Typography
The site uses the logo's own typefaces:
- Display & headings: **Exo 2** 600 (closest open match to the "networkresource" wordmark).
- Accent: Exo 2 italic in brand red for one emphasis word per headline (echoes "resource").
- Body: **Montserrat** 400, 1rem / 1.7 (matches the "CONNECT • MANAGE • GROW" tagline).
- Labels: Montserrat 600, 11px caps, tracking 0.2em — the tagline style.

### Layout & components
- 12-column grid, 1320px max container, side gutters 20 / 32 / 48 / 64px by breakpoint.
- On wide screens the 3D scene renders off-centre (camera view offset) so it never sits under the text column.
- Spacing scale 4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160.
- Radius: 2px (chips), 14px (cards), 999px (buttons).
- Components: Header, MobileMenu, Footer, Button (primary/ghost/link), Eyebrow, SectionHeading, Card, SpecList,
  ProcessSteps, PlanCard, ContactBlock, QuoteForm, PageHero, CTABand, Reveal (motion wrapper).

### Motion principles
- Ease: `expo.out` for entrances (0.9–1.2s), `power2.inOut` for camera.
- Text reveals: line mask slide-up, 60ms stagger. Never animate body paragraphs letter by letter.
- 3D camera is always scrubbed to scroll (no autoplay jumps) and damped for smoothness.
- `prefers-reduced-motion`: Lenis off, reveals become fades, the 3D camera jumps between chapters without travel, idle motion stops.

## 3. Homepage 3D storyboard — "One office, always on"

A single persistent WebGL scene: a stylised client office floor (desks + workstations), its network closet
(rack with firewall, switch, servers, backup, UPS), the Network Operations Center (NOC) above it, and a
second "new office" floor plate. All geometry is procedural (no heavy downloads); every object maps to a real service.

| # | Chapter | What the visitor sees | Business concept | Camera | Scroll action |
|---|---|---|---|---|---|
| 0 | **Hero** | Dark office diorama at dusk; data pulses travel cables from desks to the rack | Outsourced IT dept running in the background | Wide 3/4 orbit, slow drift with pointer parallax | Scroll begins descent |
| 1 | **The network closet** | Rack units separate into an exploded view; labelled Firewall, Switch, Servers, Storage & Backup, UPS | Network Services: Microsoft, Apple, Cisco, Linux infrastructure | Dolly into the rack | Units slide out one by one with labels |
| 2 | **Watched 24/7** | A NOC ring rises above the office; scan beam sweeps; one workstation turns amber (alert), a beam from the NOC resolves it, it returns green | NR Remote: monitoring, patching, AV, backup checks from the NOC | Rise to a high angle | Alert → fix is scrubbed by scroll |
| 3 | **People on site** | An engineer marker walks a path to the desks; ticket cards rise from the portal | NR Complete: on-site engineers, help desk, client portal, account manager | Low tracking shot along the path | Engineer advances with scroll |
| 4 | **Moving offices** | Equipment lifts, packs into crates, travels to the new floor, re-assembles, lights up | Network Relocation: Analysis → Planning → Moving → Testing → Going Live | Wide lateral pan between floors | 5 steps highlighted in sync |
| 5 | **Bay Area** | The scene zooms out to an abstract Bay map with four office beacons | Local presence: Peninsula, North Bay, South Bay, East Bay | Pull up to top-down | Beacons light in sequence → CTA |

Interactive hotspots exist in chapter 1 (rack units) and on the hero (desk, rack, NOC): hover/focus shows labels; click scrolls to the chapter.

Inner-page 3D: Network Services reuses the exploded rack; Network Relocation reuses the move sequence (scrubbed by its 5-step section).
Other pages use typographic layouts and animated SVG diagrams instead of 3D, where 3D would not add understanding.

## 4. Performance & accessibility
- 3D is dynamically imported (`ssr: false`) after first paint; a static poster gradient is shown first.
- DPR capped at 1.75 (1.25 on low-power), shadows limited to one light, instanced geometry for desks/cables.
- Low-power detection (hardwareConcurrency ≤ 4 or saveData) → reduced scene (no bloom-style extras, fewer packets).
- All 3D content is mirrored in DOM text, so screen readers and search engines read the whole story.
- Skip link, visible focus rings, keyboard-accessible hotspots and menus, AA contrast.
- Metadata per page, JSON-LD (LocalBusiness ×4 locations), sitemap.xml, robots.txt, 301s from all .php URLs.
