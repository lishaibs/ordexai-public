# ordexai.com — marketing site

Static GitHub Pages site served at **`www.ordexai.com`** (repo `lishaibs/ordexai-public`; not the order page — that lives in the separate `ordexai-order-page` repo at `order.ordexai.com`). The site is marketing only: it has no backend and no database connection.

## Contents
| File | Purpose |
|------|---------|
| `index.html` | Home / landing page (HE + EN toggle, animated WhatsApp demo, FAQ, contact form) |
| `privacy-policy.html` | Privacy policy (Privacy Protection Law 1981 + Amendment 13) |
| `accessibility.html` | Accessibility statement (IS 5568 / WCAG 2.0 AA) |
| `404.html` | Branded "page not found" (GitHub Pages serves it for any missing path, so its URLs are root-absolute) |
| `favicon.svg`, `favicon-32.png`, `favicon.ico`, `apple-touch-icon.png` | Browser / home-screen icons (speech-bubble "Ai" mark) |
| `assets/ordexai-logo.png` | Logo, 400 px wide (the original 762 px / 201 KB master is in `Downloads/assets/`) |
| `assets/og-image.jpg` | 1200×630 link-preview image for WhatsApp, LinkedIn, Facebook and X |
| `assets/ordexai-icon-512.png` | Square logo for search engines (structured data) |
| `robots.txt`, `sitemap.xml` | Crawl hints; the sitemap lists both language versions of the home page |
| `CNAME` | Custom domain → `www.ordexai.com` (do not change without updating DNS) |

All pages are **self-contained**: inline CSS/JS, no build step, no external runtime. The only third-party requests are Google Fonts (CSS + font files) and FormSubmit.co (contact-form submissions to `info@ordexai.com`), both allow-listed in each page's Content-Security-Policy.

## How the home page works
- **Language:** Hebrew by default. `?lang=en` opens English, and the visitor's last choice is remembered (`localStorage` key `ordex_lang`, shared with the privacy page). Switching language rewrites the URL, so an English link can be shared.
- **WhatsApp buttons:** every link marked `data-wa` is rebuilt per language with a pre-filled first message (`WA_TEXT` in the script). The number is `WA_NUMBER`.
- **Demo:** five scenes (text, voice, photo, clarifications, confirmation). Visitors can jump between scenes or pause; the demo stops while off-screen and is static under reduced motion. The delivery date in the last scene is always an upcoming Thursday.
- **Colors:** use the design-system tokens. For text on light backgrounds use `--teal-ink` (not `--wa-dark`, which fails AA as small text); for text on the green buttons use `--on-wa` (white on `#25d366` is 2:1).

## Deploy (GitHub Pages)
1. Push these files to the root of the ordexai.com Pages repo (`main` branch).
2. Repo → **Settings → Pages** → *Deploy from a branch* → `main` / `/ (root)`.
3. Custom domain is handled by the `CNAME` file (`www.ordexai.com`); the `www` DNS CNAME record already points to GitHub Pages. Keep "Enforce HTTPS" on.

## Editing
Edit the `.html` files directly. The `*.dc.html` design-tool exports in `Downloads/` are **source only** — they depend on a runtime (`support.js`, `_ds/_ds_bundle.js`) and Cloudflare email-protection that do **not** work on GitHub Pages. Do not deploy them.
