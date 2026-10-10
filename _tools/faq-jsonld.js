// Regenerates the home page's JSON-LD @graph (Organization, WebSite, Service, FAQPage) in index.html.
// The FAQPage questions/answers are read from the visible Hebrew FAQ, so markup and page never drift.
// Run after editing the FAQ:  node _tools/faq-jsonld.js
// (_tools/ starts with "_", so GitHub Pages' Jekyll build does not publish it.)
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

const strip = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const start = html.indexOf('id="faq">');
const end = html.indexOf('<!-- ===== FINAL CTA ===== -->');
if (start < 0 || end < 0) throw new Error('FAQ section markers not found');
const items = [...html.slice(start, end).matchAll(/<details class="reveal">\s*<summary><span data-inline="he">([\s\S]*?)<\/span>[\s\S]*?<p data-lang="he">([\s\S]*?)<\/p>/g)]
  .map(m => ({ q: strip(m[1]), a: strip(m[2]) }));
if (!items.length) throw new Error('no FAQ items parsed');

const SITE = 'https://www.ordexai.com/';
const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization', '@id': SITE + '#organization',
      name: 'OrdexAI', url: SITE,
      logo: SITE + 'assets/ordexai-icon-512.png',
      description: 'OrdexAI קולט הזמנות מלקוחות קבועים ישירות מוואטסאפ ומרכז אותן לרשימת הזמנות אחת למפיצי מזון.',
      email: 'info@ordexai.com',
      // Add profile URLs here once they exist (LinkedIn, G2, YouTube...): sameAs: ['https://...'],
      contactPoint: [{ '@type': 'ContactPoint', contactType: 'sales', telephone: '+972-55-665-4664', email: 'info@ordexai.com', areaServed: 'IL', availableLanguage: ['Hebrew', 'English'] }],
    },
    {
      '@type': 'WebSite', '@id': SITE + '#website',
      name: 'OrdexAI', url: SITE, inLanguage: 'he',
      publisher: { '@id': SITE + '#organization' },
    },
    {
      // Service, not SoftwareApplication: Google's software-app markup requires a price (offers.price),
      // and without one Search Console reports the item as invalid.
      '@type': 'Service', '@id': SITE + '#service',
      name: 'OrdexAI — קליטת הזמנות מוואטסאפ למפיצים',
      serviceType: 'קליטת הזמנות מוואטסאפ וניהול הזמנות למפיצי מזון',
      provider: { '@id': SITE + '#organization' },
      areaServed: 'IL',
      availableLanguage: ['Hebrew', 'English'],
      audience: { '@type': 'BusinessAudience', audienceType: 'מפיצי מזון, מחלבות, מאפיות וספקים סיטונאיים' },
      description: 'הלקוחות מזמינים בוואטסאפ בטקסט חופשי, בהקלטה או בתמונה. OrdexAI מבין כל פריט, מתאים אותו למק״ט של המפיץ, שואל כשמשהו לא ברור, ושולח בשעת הקאט-אוף רשימת הזמנות אחת מרוכזת. כולל דף הזמנה בלינק ותזכורת ללקוחות קבועים לפני הקאט-אוף. בלי אפליקציה ובלי הקלדה ידנית.',
      url: SITE,
    },
    {
      '@type': 'FAQPage', '@id': SITE + '#faq', inLanguage: 'he',
      mainEntity: items.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ],
};

const block = '<script type="application/ld+json">\n' + JSON.stringify(graph, null, 2).split('\n').map(l => '  ' + l).join('\n') + '\n  </script>';
const re = /<script type="application\/ld\+json">[\s\S]*?<\/script>/;
if (!re.test(html)) throw new Error('no JSON-LD block in index.html');
fs.writeFileSync(file, html.replace(re, block));
console.log(`Updated JSON-LD in index.html (FAQPage: ${items.length} questions)`);
