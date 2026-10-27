# Michael Breibart — Portfolio

A white sketch-paper portfolio built with semantic HTML, CSS, vanilla JavaScript, and local SVG illustrations. No build step, packages, external fonts, or framework.

## Local preview

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000. The populated checkout is `/Users/iphonecool/Downloads/Personal Website`.

## Content

Eight entries: custom flight controller and modular drone; micro ducted inspection drone; RU Autonomous / Everest; Bible Scroll; WedShare; Nine Diagnostics; Blaser Laboratory microbiome research; SeaPerch robotics.

The app entry includes product and audience building. Individual YouTube channels are intentionally omitted. Other projects from the previous portfolio have been removed.

## Files

- `index.html`: content, project entries, category filters, about, contact.
- `style.css`: white paper texture, responsive layout, typography, focus and reduced-motion support.
- `script.js`: accessible mobile navigation, category filtering, clipboard feedback, current year.
- `assets/`: lightweight SVG line illustrations and favicon. Drawings are illustrative studies, not engineering diagrams or product screenshots.

The site has one intentional white-paper appearance, replacing the previous dark/light theme switcher. Content remains readable without JavaScript; interactive filters and the mobile drawer enhance it when available.

## Content sources

Project facts were checked against Michael’s October 12, 2026 resume, the existing public drone repository, and local drone project notes. WedShare links to https://wedshare.online; Nine Diagnostics links to https://ninediagnostics.xyz. The resume itself is not published because it includes private contact details.

Describe independent drones as in development until physical test evidence supports stronger claims. Distinguish Michael’s contribution from RU Autonomous’s team achievements. Do not add channel names, audience metrics, or project outcomes without verified sources.

## Deployment

Repository: https://github.com/Michael-Breibart/Michael-Breibart.github.io

Production: https://michael-breibart.github.io/

GitHub Pages deploys from `main`. A push to `main` publishes the site; no Sites hosting or build pipeline is used. Run `node --check script.js`, check local asset paths and anchors, and review desktop and narrow mobile layouts before pushing. Lighthouse scores require an actual audit; do not infer them from the stack.
