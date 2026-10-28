# Michael Breibart

A small portfolio built with HTML, CSS, and vanilla JavaScript. No framework, packages, external fonts, or build step.

## Run locally

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000. Active checkout: `/Users/iphonecool/Downloads/Personal Website`.

## Structure

- `index.html`: short bio, project index, eight project articles, contact links.
- `style.css`: white/ocean-blue palette, narrow text columns, responsive layout.
- `script.js`: project selection, URL hashes, browser history, close/Escape behavior.
- `sharks.js`: original procedural 3D shark mesh, rasterized to ASCII with Canvas 2D.
- `assets/sharks.svg`: static fallback art.
- `assets/favicon.svg`: pixel-shark favicon.

On desktop, project selection opens a second column beside the index. On mobile, the details appear below the index and receive focus. Links such as `/#wedshare` work directly on GitHub Pages. Without JavaScript, all project articles remain readable.

The sharks follow tangent-aligned swimming paths in a seamless 15-second loop. Positions, turns, nine tail strokes, and water particles share the same period. Pixel tiles use three dark-blue shades.

The shark renderer runs at a maximum of 30 frames per second, caps pixel density at 2, pauses when the page is hidden or the artwork is offscreen, and honors `prefers-reduced-motion`. The Play/Pause control allows explicit animation control. It uses no video, external models, WebGL, tracking, or network requests. Lighthouse scores require a measured audit; they are not inferred from the stack.

## Content

Only the independent drones, RU Autonomous, Bible Scroll and app audience building, WedShare, Nine Diagnostics, Blaser Laboratory research, and SeaPerch are featured. YouTube channels and unrelated projects remain excluded.

Facts were checked against Michael’s October 12, 2026 resume and project notes during the previous pass. Preserve the distinction between designs in development and demonstrated outcomes. Do not publish the private resume, street address, or phone number.

## Design reference

Formatting is inspired by [Shrey Gupta’s Olive page](https://shreygups.com/work/olive): a plain project index, narrow text columns, consistent small typography, and a large interactive art area. The implementation, copy, marine palette, and procedural shark art are original. See `DESIGN_NOTES.md` for the REA findings and scope.

## Publish

Repository: https://github.com/Michael-Breibart/Michael-Breibart.github.io

Live: https://michael-breibart.github.io/

GitHub Pages deploys from `main`; no special backend or Sites hosting is required. Check syntax (`node --check script.js` and `node --check sharks.js`), internal links, assets, project navigation/history, and desktop/mobile layouts before pushing.
