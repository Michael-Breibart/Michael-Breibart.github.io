# Reference analysis — October 27, 2026

Reference: https://shreygups.com/work/olive

REA Evidence: `ev_2ca0248733f80627e1a095c60f2e99453354e033d90ead745ed7cc1febdc6e9b`

REA launched an owned, temporary Chromium session, navigated to the reference, waited 1.5 seconds, and captured its rendered DOM, accessibility tree, and screenshot at 1440 × 1000. The owned browser was terminated successfully afterward. This was a single controlled capture, not an exhaustive interaction audit.

Observed:

- A roughly 300px home column with name, short introduction, project links, and bottom social links.
- A second narrow article column for Olive, with independent vertical scrolling.
- Consistent small sans-serif typography, ordinary links, and modest paragraph spacing.
- A large canvas field with a pixel grid; the captured Olive palette is dark brown, orange, olive, and yellow.
- The shipped DOM contains client-side pane navigation and animation code.

Applied design choices:

- Original white/navy/ocean-blue palette and typography using system Arial.
- Plain project index and one details column, with hash navigation suitable for GitHub Pages.
- Original software-rendered shark meshes displayed as ASCII characters, inspired by the user’s separate shark screenshot.
- Native scrolling on mobile, visible keyboard focus, reduced-motion handling, and explicit pause controls.

No reference fonts, copy, source code, canvas algorithms, or proprietary assets were copied. The shark effect was not observed on the Olive page; it comes from the user’s separate visual request.

## Final animation checks

The user refined the direction to three dark-blue shades and a seamless 15-second swimming loop. The final renderer uses a periodic closed path, tangent-aligned headings, nine tail strokes per loop, and periodic particle movement. A source-level motion test verified repetition at t and t+15, finite geometry, travel distance, and heading alignment across three viewport sizes.

REA runtime check: `ev_12a99418b541823bc3b1c8a4c6a2317775ab42db7209876003c347131485f509`. Two successive animated screenshots differed; the screenshots immediately after pausing and 250ms later had identical SHA-256 values. WedShare opened successfully and no page errors were recorded.

Reduced-motion check: `ev_275bf1321287d656479798842c1a9c023c8794a502797ff95b5f2e0259b6f60f`. The direct `#research` route opened at 375×812 with animation paused and a Play control.
