// Builds the other-language home pages from the Hebrew home page (index.html):
//   node _tools/build-langs.js          → en/index.html + es/index.html
//   node _tools/build-langs.js es       → only es/index.html
// Every page shares index.html's structure, CSS and script. Per language (_tools/lang/<code>.js): the <head>, a
// Hebrew → target dictionary, the script's UI strings, the a11y menu, the form tweaks, media, and the order scene
// (from _tools/scene.js). The build fails if any Hebrew is left outside the language menu's link to the Hebrew page,
// so a new Hebrew string can never ship untranslated. Run it after ANY change to index.html.
const fs = require('fs');
const path = require('path');
const scene = require('./scene');
const SITE = path.join(__dirname, '..');
const SITE_URL = 'https://www.ordexai.com/';
const home = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8').replace(/\r\n/g, '\n');   // git may check files out with CRLF

const take = (s, a, b) => { const i = s.indexOf(a), j = s.indexOf(b, i + a.length); if (i < 0 || j < 0) throw new Error('marker not found: ' + a.slice(0, 50)); return s.slice(i, j + b.length); };
function rep(s, a, b, all) { if (!s.includes(a)) throw new Error('not found: ' + a.slice(0, 90)); return all ? s.split(a).join(b) : s.replace(a, b); }
function repRe(s, re, b) { if (!re.test(s)) throw new Error('not found: ' + re); return s.replace(re, b); }

// The language menu, in this order on every page.
const MENU = [
  { code: 'he', label: 'עברית', short: 'HE', path: '' },
  { code: 'en', label: 'English', short: 'EN', path: 'en/' },
  { code: 'es', label: 'Español', short: 'ES', path: 'es/' },
];
const HE_LINK = '<a href="../" lang="he" hreflang="he" data-pick="he"><span>עברית</span>';   // the only Hebrew allowed

// LTR mirror of the Hebrew layout + the Latin display face (shared by every LTR page)
const CSS_LTR = `
/* ================= LTR page: mirror + Latin display face (from _tools/build-langs.js) ================= */
h1,h2,h3{font-family:'Plus Jakarta Sans','Heebo',sans-serif}
.hero h1{letter-spacing:-1px}
.hero h1 .pt,h2 .pt{margin-inline-start:-.09em;color:inherit}   /* Plus Jakarta Sans sets a wide gap before "." at display size */
.msg .t{float:right;margin:6px 0 0 8px}
.ph-head > svg:first-child{transform:scaleX(-1)}          /* WhatsApp back arrow points left in LTR */
.voice .va::after{left:auto;right:-1px}
.modal-x{left:auto;right:10px}
@media (min-width:901px){
  .sweep{right:auto;left:0;background:linear-gradient(to right,rgba(37,211,102,0),rgba(37,211,102,.22) 45%,rgba(255,255,255,.55) 55%,rgba(37,211,102,0))}
  .sweep.on{animation-name:sweepx-ltr}
}
@keyframes sweepx-ltr{0%{opacity:0;transform:translateX(0)}12%{opacity:1}88%{opacity:1}100%{opacity:0;transform:translateX(190%)}}
.mform-row{grid-template-columns:repeat(2,minmax(0,1fr))}   /* four fields: two by two */
@media (max-width:560px){ .mform-row{grid-template-columns:1fr} }
.ph-who b{font-size:12.5px}
.ph-ic{gap:10px}
@media (max-width:560px){ .ph-head{gap:6px;padding:0 8px 4px} .ph-ic{gap:8px} .ph-ic svg{width:15px;height:15px} .ph-who b{font-size:12px} }   /* full customer name in the narrow phone */
.erp-tbl .c-src{width:80px}
.example-note{text-align:center;margin-top:.8rem;color:var(--ink3);font-size:.82rem}
`;

function build(L) {
  const URL = SITE_URL + L.code + '/';
  let body = home.slice(home.indexOf('<body class="lang-he">'), home.lastIndexOf('</body>'));
  body = rep(body, '<body class="lang-he">', `<body class="lang-${L.code}">`);
  const WA_HE = home.match(/https:\/\/wa\.me\/972556654664\?text=[^"]+/)[0];
  body = rep(body, WA_HE, 'https://wa.me/972556654664?text=' + encodeURIComponent(L.waText), true);
  body = scene.inject(body, L.code);

  // language menu: this page is current; the Hebrew link stays Hebrew (kept out of the dictionary pass)
  const langBlock = take(body, '<div class="lang" id="langMenu">', '</ul>\n    </div>');
  const globe = langBlock.match(/<svg class="g"[\s\S]*?<\/svg>/)[0], chev = langBlock.match(/<svg class="c"[\s\S]*?<\/svg>/)[0];
  const tick = langBlock.match(/<span>עברית<\/span>(<svg[\s\S]*?<\/svg>)/)[1];
  const items = MENU.map(m => m.code === L.code
    ? `        <li><a href="./" lang="${m.code}" hreflang="${m.code}" data-pick="${m.code}" aria-current="page"><span>${m.label}</span>${tick}</a></li>`
    : `        <li><a href="../${m.path}" lang="${m.code}" hreflang="${m.code}" data-pick="${m.code}"><span>${m.label}</span><small>${m.short}</small></a></li>`);
  const cur = MENU.find(m => m.code === L.code);
  const menu = `<div class="lang" id="langMenu">
      <button type="button" class="lang-t" id="langBtn" aria-haspopup="true" aria-expanded="false" aria-controls="langList" aria-label="${L.menuAria}">${globe}<span lang="${L.code}">${cur.short}</span>${chev}</button>
      <ul class="lang-list" id="langList" hidden>
${items.join('\n')}
      </ul>
    </div>`;
  body = rep(body, langBlock, '__LANG_MENU__');

  // media
  body = rep(body, 'assets/home/note-he.webp', 'assets/home/' + L.media.note);
  const modal = take(body, '<div class="modal" id="filmModal"', '\n  </div>\n</div>');
  if (L.media.film) {
    const F = L.media.film;
    body = rep(body, 'poster="assets/home/film-poster.jpg"', `poster="assets/home/${F.poster}"`);
    body = rep(body, 'src="assets/home/ordexai-film.mp4"', `src="assets/home/${F.src}"`);
    body = repRe(body, /<track kind="captions" src="assets\/home\/ordexai-film\.he\.vtt"[^>]*>/, `<track kind="captions" src="assets/home/${F.vtt}" srclang="${F.srclang}" label="${F.label}" default>`);
  } else {
    body = rep(body, modal, '');                                                       // no film on this page
    body = repRe(body, /\n\s*<button type="button" class="btn-ghost btn-lg" data-film>[\s\S]*?<\/button>/, '');
  }
  // same-site pages (the page is one level down)
  body = rep(body, 'src="assets/', 'src="../assets/', true);
  body = body.split('poster="assets/').join('poster="../assets/');
  body = rep(body, 'href="privacy-policy.html"', `href="${L.privacyHref}"`, true);
  body = rep(body, 'href="accessibility.html"', `href="${L.a11yHref}"`, true);
  body = repRe(body, /\s*<a href="whatsapp-orders-guide\.html">[^<]*<\/a>(?=\s*<a href=)/, '');   // the guide is Hebrew-only

  // systems shown for this audience
  body = rep(body, '<span>Comax</span><span>SAP</span>', L.systems.map(s => `<span>${s}</span>`).join(''));

  // form: country field, consent, extra notices
  body = rep(body, 'placeholder="050-000-0000"', `placeholder="${L.phonePlaceholder}"`);
  body = repRe(body, /(<input id="cf-phone"[^>]*>\n\s*<\/div>)/, `$1
        <div class="field">
          <label for="cf-country">${L.country.label}</label>
          <input id="cf-country" name="country" type="text" autocomplete="country-name" placeholder="${L.country.placeholder}">
        </div>`);
  const privacyRe = new RegExp(`<span>קראתי ואני מסכים\\/ה ל<a href="${L.privacyHref.replace(/[.?]/g, '\\$&')}"[^>]*>מדיניות הפרטיות<\\/a> <span class="req">\\*<\\/span><\\/span>`);
  body = repRe(body, privacyRe, L.consentHtml);
  if (L.afterPrivacyLine) body = repRe(body, /(<p class="privacy-line">[\s\S]*?<\/p>)/, `$1\n${L.afterPrivacyLine}`);

  // FAQ 3 without the link to the Hebrew-only guide
  body = repRe(body, /<p>בקטלוג, בלינק או בתוך WhatsApp Business[\s\S]*?<\/p>/, L.faq3);
  // the scene's names, codes and quantities are examples
  body = repRe(body, /(    <div class="st-row">[\s\S]*?<\/div>\n)/, `$1    <p class="example-note">${L.exampleNote}</p>\n`);

  // accessibility menu + script strings
  body = rep(body, take(body, '<!-- Accessibility widget (IS 5568 / WCAG AA) -->', '\n  </div>\n</div>'), L.a11y);
  body = rep(body, take(body, 'const UI = {', '\n};'), L.ui);

  for (const [he, tr] of [...L.dict].sort((a, b) => b[0].length - a[0].length)) body = body.split(he).join(tr);
  body = rep(body, '__LANG_MENU__', menu);
  // tighten the periods in h1/h2 headings (text only, never inside a tag)
  body = body.replace(/<(h[12])>([\s\S]*?)<\/\1>/g, (m, tag, inner) => `<${tag}>` +
    inner.split(/(<[^>]+>)/).map(p => p.startsWith('<') ? p : p.replace(/(\p{L})\./gu, '$1<span class="pt">.</span>')).join('') + `</${tag}>`);

  /* ---------- head ---------- */
  const H = L.head;
  const csp = home.match(/<meta http-equiv="Content-Security-Policy"[^>]*>/)[0];
  const strip = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const faq = [...body.slice(body.indexOf('id="faq">')).matchAll(/<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<div class="ans"><p>([\s\S]*?)<\/p>/g)].map(m => ({ q: strip(m[1]), a: strip(m[2]) }));
  if (faq.length !== 5) throw new Error(L.code + ': expected 5 FAQ items, got ' + faq.length);
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': SITE_URL + '#organization', name: 'OrdexAI', url: SITE_URL, logo: SITE_URL + 'assets/ordexai-icon-512.png', email: 'info@ordexai.com',
        contactPoint: [{ '@type': 'ContactPoint', contactType: 'sales', telephone: '+972-55-665-4664', email: 'info@ordexai.com', availableLanguage: ['Spanish', 'Hebrew', 'English'] }] },
      { '@type': 'WebPage', '@id': URL + '#webpage', url: URL, name: H.pageName, inLanguage: L.htmlLang, isPartOf: { '@id': SITE_URL + '#website' }, about: { '@id': URL + '#service' } },
      { '@type': 'Service', '@id': URL + '#service', name: H.service.name, serviceType: H.service.serviceType,
        provider: { '@id': SITE_URL + '#organization' }, availableLanguage: H.service.availableLanguage,
        audience: { '@type': 'BusinessAudience', audienceType: H.service.audienceType },
        description: H.service.description, url: URL },
      { '@type': 'FAQPage', '@id': URL + '#faq', inLanguage: L.htmlLang, mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ],
  };
  const head = `<!DOCTYPE html>
<html lang="${L.htmlLang}" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${csp}
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <!-- GENERATED by _tools/build-langs.js from ../index.html. Edit the Hebrew page or _tools/lang/${L.code}.js, then run: node _tools/build-langs.js -->
  <title>${H.title}</title>
  <meta name="description" content="${H.desc}">
  <meta name="theme-color" content="#0c3b2b">
  <link rel="canonical" href="${URL}">
  <link rel="alternate" hreflang="he" href="${SITE_URL}">
  <link rel="alternate" hreflang="en" href="${SITE_URL}en/">
  <link rel="alternate" hreflang="es" href="${SITE_URL}es/">
  <link rel="alternate" hreflang="es-AR" href="${SITE_URL}es/">
  <link rel="alternate" hreflang="es-UY" href="${SITE_URL}es/">
  <link rel="alternate" hreflang="x-default" href="${SITE_URL}">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="icon" href="../favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="../apple-touch-icon.png">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="OrdexAI">
  <meta property="og:url" content="${URL}">
  <meta property="og:locale" content="${L.ogLocale}">
  <meta property="og:locale:alternate" content="he_IL">
  <meta property="og:title" content="${H.ogTitle}">
  <meta property="og:description" content="${H.ogDesc}">
  <meta property="og:image" content="${SITE_URL}${H.ogImage}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${H.ogTitle}">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">
${JSON.stringify(ld, null, 2).split('\n').map(l => '  ' + l).join('\n')}
  </script>
  <script>document.documentElement.classList.add('js')</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Heebo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>`;
  const css = home.slice(home.indexOf('<style>') + 7, home.indexOf('</style>'));
  const out = head + css + CSS_LTR + (L.css ? L.css + '\n' : '') + '  </style>\n</head>\n' + body + '</body>\n</html>\n';

  const leftovers = out.replace(HE_LINK, '').match(/.{0,40}[֐-׿].{0,40}/g);
  if (leftovers) throw new Error(`Hebrew left in the ${L.code} page:\n  ` + [...new Set(leftovers)].slice(0, 15).join('\n  '));
  const forbidden = ['note-he', 'film-poster.jpg"', 'ordexai-film.mp4"', '.he.vtt', 'whatsapp-orders-guide', 'class="lang-he"', '%D7%'];
  if (L.privacyHref !== 'privacy-policy.html' && !L.privacyHref.startsWith('../')) forbidden.push('"privacy-policy.html"');
  for (const k of forbidden) if (out.includes(k)) throw new Error(`${L.code}: leftover ${k}`);
  if (!L.media.film && /data-film|filmModal/.test(body.replace(/<script>[\s\S]*<\/script>/, ''))) throw new Error(`${L.code}: film markup left`);

  fs.mkdirSync(path.join(SITE, L.code), { recursive: true });
  fs.writeFileSync(path.join(SITE, L.code, 'index.html'), out);
  console.log(`wrote ${L.code}/index.html (${(out.length / 1024).toFixed(1)} KB), FAQ ${faq.length}, no Hebrew outside the language menu`);
}

const codes = process.argv.slice(2).length ? process.argv.slice(2) : ['en', 'es'];
for (const c of codes) build(require('./lang/' + c));
