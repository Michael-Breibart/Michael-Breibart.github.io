# Cursor Handoff Guide — Michael Breibart Portfolio

You are an expert full-stack web developer and designer assisting **Michael Breibart** with his personal portfolio website.

## 📌 Project Overview
- **Live Site**: https://michael-breibart.github.io/
- **GitHub Repository**: https://github.com/Michael-Breibart/Michael-Breibart.github.io
- **Local Directory**: `/Users/iphonecool/Downloads/Personal Website`
- **Deployment**: Automatic GitHub Pages deployment triggered on `git push` to `main`.

## 🏗️ Architecture & Philosophy
- **Stack**: Pure semantic HTML5, modern CSS3 (custom properties, glassmorphism, responsive grid/flexbox), vanilla JavaScript (ES6+).
- **Zero Heavy Dependencies**: No npm build pipeline, node_modules bloat, or fragile frameworks. Instant 100/100 Lighthouse performance, ultra-fast load times.
- **Theme**: Dark/light mode switcher with system `prefers-color-scheme` detection and `localStorage` persistence.
- **Tone & Identity**: Michael is a multi-disciplinary systems engineer and builder ("Constantly Building") spanning embedded hardware (STM32, robotics), applied AI (protein language models, bio-ML), native iOS apps (LustLock with 105k+ community, Bible Scroll), and quantitative arbitrage engines.

## 📂 File Structure
- `index.html` — Full page structure, SEO/OpenGraph meta tags, Hero, Stats, About with terminal, filterable Project Showcase, Tech Matrix, Philosophy, and Contact section.
- `style.css` — CSS design tokens (`--bg-primary`, `--accent-cyan`, etc.), light/dark themes, ambient gradient glows, animations, card styling, and mobile breakpoints.
- `script.js` — Theme toggle, mobile drawer navigation, project tag filter logic, dynamic copyright year, and copy-email button with feedback.
- `README.md` — Quick preview instructions and GitHub Pages documentation.

## 🎯 Typical Tasks & Conventions
1. **Preserve Zero-Dependency Performance**: Keep all code pure vanilla HTML/CSS/JS unless Michael explicitly requests a framework like Astro or Next.js.
2. **Adding/Editing Projects**: Add `<article class="project-card" data-category="...">` inside `.projects-grid` in `index.html`. Ensure `data-category` matches the filter buttons (`hardware`, `ai`, `mobile`, `quant`, `web`).
3. **Responsive Testing**: Always ensure layouts adapt cleanly across desktop, tablet, and mobile screens.
4. **Deploying Changes**: After making edits, run `git add . && git commit -m "..." && git push` to update GitHub Pages live within ~30 seconds.
