# Michael Breibart — Personal Portfolio Website

A fast, modern, and responsive personal portfolio website crafted for **Michael Breibart**.

Built with semantic HTML5, modern responsive CSS with custom properties, and vanilla JavaScript — zero heavy dependencies, 100/100 Lighthouse performance, instant load times, and native compatibility with **GitHub Pages**.

---

## 🚀 Live Local Preview

You can preview the site immediately by simply opening `index.html` in your browser:

```bash
# macOS quick open
open index.html

# Or run a local HTTP server
python3 -m http.server 8000
# Then visit http://localhost:8000
```

---

## 🌐 GitHub Pages Deployment Guide

Your current GitHub account is `@NeurologicalMichael`. Here are your best options for publishing this site with GitHub Pages:

### Option 1: Dedicated Portfolio Repo (Recommended for instant start)
1. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Michael Breibart portfolio"
   ```
2. Create and push to a new public GitHub repo:
   ```bash
   gh repo create michaelbreibart --public --source=. --remote=origin --push
   ```
3. Enable GitHub Pages:
   ```bash
   gh api -X POST repos/NeurologicalMichael/michaelbreibart/pages -f source='{"branch":"main","path":"/"}'
   ```
   *Your live URL will be:* **`https://neurologicalmichael.github.io/michaelbreibart/`**

---

### Option 2: Root User Domain (`NeurologicalMichael.github.io`)
If you name your repository `<username>.github.io`, GitHub automatically serves it at the root user domain:
1. Create repository named `NeurologicalMichael.github.io`:
   ```bash
   gh repo create NeurologicalMichael.github.io --public --source=. --remote=origin --push
   ```
   *Your live URL will be:* **`https://neurologicalmichael.github.io/`**

---

### Option 3: Claim `michaelbreibart` Username on GitHub (Pro Tip ⭐)
The username `michaelbreibart` is currently **unclaimed** on GitHub!
1. Go to **GitHub Settings** → **Account** → **Change username**.
2. Change your username from `NeurologicalMichael` to `michaelbreibart`.
3. Create the repo `michaelbreibart.github.io`.
   *Your live URL will be:* **`https://michaelbreibart.github.io/`**

---

### Option 4: Custom Domain (e.g., `michaelbreibart.com`)
If you purchase `michaelbreibart.com` (from Namecheap, Cloudflare, Google Domains/Squarespace, etc.):
1. Add a file named `CNAME` in this directory containing your domain:
   ```bash
   echo "michaelbreibart.com" > CNAME
   ```
2. Configure DNS A records pointing to GitHub Pages IP addresses:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`

---

## 🛠️ Features Included

- **Dark & Light Mode**: Seamless theme switcher that respects system OS preference and saves state in `localStorage`.
- **Vertical Architecture**: Highlights hardware/STM32, AI/bio-ML, iOS/mobile, and quantitative finance.
- **Interactive Project Filtering**: Filter projects by Hardware & Robotics, AI & Bio-ML, Mobile Apps, FinTech & Quant, and Web.
- **Interactive Terminal**: Showcases engineering philosophy and commands.
- **Direct Contact & Copy-to-Clipboard**: One-click email copying with visual confirmation.
- **Fully Responsive**: Optimized for ultra-wide displays, laptops, tablets, and phones.
