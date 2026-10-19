# ordexai.com — marketing site

Static GitHub Pages site served at **`www.ordexai.com`** (repo `lishaibs/ordexai-public`; not the order page — that lives in the separate `ordexai-order-page` repo at `order.ordexai.com`). The site is marketing only: it has no backend and no database connection.

## Contents
| File | Purpose |
|------|---------|
| `index.html` | Home / landing page (HE + EN toggle, animated WhatsApp demo, FAQ, contact form) |
| `whatsapp-orders-guide.html` | Hebrew guide "איך מפסיקים להקליד הזמנות מוואטסאפ: 3 דרכים" (catalog link vs. WhatsApp Business catalog vs. AI), written to be cited by search engines and AI answers |
| `en/index.html` | English home page (US spelling), no film for now. **Generated from `index.html`** by `node _tools/build-langs.js` |
| `es/index.html` | Spanish (Rioplatense, voseo) home page, for Spanish speakers anywhere; no country names in the copy. **Generated from `index.html`** by `node _tools/build-langs.js` |
| `es/accesibilidad.html` | Spanish accessibility statement |
| `es/privacidad.html` | Spanish privacy policy (contact form + service; Argentina, Uruguay, EU/Spain, Mexico, Chile, Colombia, Peru). AI-drafted: lawyer review pending |
| `privacy-policy.html` | Privacy policy (Privacy Protection Law 1981 + Amendment 13) |
| `accessibility.html` | Accessibility statement (IS 5568 / WCAG 2.0 AA) |
| `404.html` | Branded "page not found" (GitHub Pages serves it for any missing path, so its URLs are root-absolute) |
| `favicon.svg`, `favicon-32.png`, `favicon.ico`, `apple-touch-icon.png` | Browser / home-screen icons (speech-bubble "Ai" mark) |
| `assets/ordexai-logo.png` | Logo, 400 px wide (the original 762 px / 201 KB master is in `Downloads/assets/`) |
| `assets/og-image.jpg` | 1200×630 link-preview image for WhatsApp, LinkedIn, Facebook and X |
| `assets/ordexai-icon-512.png` | Square logo for search engines (structured data) |
| `robots.txt`, `sitemap.xml` | Crawl hints; the sitemap lists both language versions of the home page |
| `CNAME` | Custom domain → `www.ordexai.com` (do not change without updating DNS) |
| `_tools/faq-jsonld.js` | Regenerates the home page structured data from the visible FAQ. Not published (Jekyll skips `_` folders) |
| `_tools/build-langs.js`, `_tools/lang/en.js`, `_tools/lang/es.js` | Build `en/` and `es/` from `index.html` (same structure, CSS and script; per-language head, Hebrew → target dictionary, UI strings, a11y menu, form, media). Run `node _tools/build-langs.js` after ANY change to `index.html`. The build fails if Hebrew is left anywhere but the language menu, so a new Hebrew string needs an entry in each `lang/*.js` |
| `_tools/scene.js` | The before → after order scene (four orders; Hebrew, English, Spanish data). `node _tools/scene.js` rewrites it in `index.html`; `build-langs.js` uses it for the other pages |
| `assets/home/` | Home media: films (`ordexai-film.mp4` Hebrew, `ordexai-film.es.mp4` Spanish), captions (`.he.vtt`, `.es.vtt`), posters, hero note photos (`note-he`, `note-es`, `note-en` once it exists). `assets/og-image-en.jpg` is the English link preview |

All pages are **self-contained**: inline CSS/JS, no build step, no external runtime. The only third-party requests are Google Fonts (CSS + font files) and FormSubmit.co (contact-form submissions to `info@ordexai.com`), both allow-listed in each page's Content-Security-Policy.

## How the home page works
- **Language:** Hebrew `/`, English `/en/`, Spanish `/es/`, all with the same globe language menu. On a first visit to `/`, a small script in `<head>` picks one from the visitor's **device** (time zone + browser language): Israel → Hebrew, Spanish-speaking South America or a Spanish browser → `/es/`, elsewhere → `/en/`. There's no IP lookup or third-party call. A choice made in the language menu is stored (`localStorage` key `ordex_lang`) and always wins; `?lang=en` / `?lang=es` links (including the old `/?lang=en` address) go to `/en/` or `/es/`; `/en/` and `/es/` never redirect; crawlers are never redirected from `/`, so search engines index every version through hreflang.
- **Phone format:** Hebrew shows `055-665-4664`; English and Spanish show `+972 55-665-4664`.
- **WhatsApp buttons:** every link marked `data-wa` is rebuilt per language with a pre-filled first message (`WA_TEXT` in the script). The number is `WA_NUMBER`.
- **Demos:** the hero phone (text, voice, photo → order received) plays once; the before → after scene processes four orders one by one and loops, with a pause button. OS "reduce motion" keeps them playing as fades only (the thinking ring still turns); the a11y menu's "stop animations" shows the final frames. The scene timeline engine is the `Scene()` function in the page script; pages without JS show the final frame.
- **Colors:** use the design-system tokens. For text on light backgrounds use `--teal-ink` (not `--wa-dark`, which fails AA as small text); for text on the green buttons use `--on-wa` (white on `#25d366` is 2:1).

## Search & AI visibility
- Wording follows what buyers type ("קליטת הזמנות מוואטסאפ", "לקוחות קבועים", "בלי הקלדה ידנית"), not only slogans.
- Home page JSON-LD = Organization + WebSite + Service + FAQPage. **After editing the FAQ text, run `node _tools/faq-jsonld.js`** so the FAQ markup matches the page. Add `sameAs` profile links in that script once LinkedIn/G2/YouTube pages exist.
- The guide page carries Article + BreadcrumbList JSON-LD and is listed in `sitemap.xml`.
- Off-site steps (Search Console, Bing, profiles, reviews) are in the owner's step-by-step guide doc.

## Deploy (GitHub Pages)
1. Push these files to the root of the ordexai.com Pages repo (`main` branch).
2. Repo → **Settings → Pages** → *Deploy from a branch* → `main` / `/ (root)`.
3. Custom domain is handled by the `CNAME` file (`www.ordexai.com`); the `www` DNS CNAME record already points to GitHub Pages. Keep "Enforce HTTPS" on.

## Editing
Edit the `.html` files directly. The `*.dc.html` design-tool exports in `Downloads/` are **source only** — they depend on a runtime (`support.js`, `_ds/_ds_bundle.js`) and Cloudflare email-protection that do **not** work on GitHub Pages. Do not deploy them.
