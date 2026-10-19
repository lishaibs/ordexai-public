// Builds es/index.html from the Hebrew home page (index.html), so both pages share one structure, CSS and script.
//   node _tools/build-es.js
// What changes for Spanish: the <head>, LTR overrides, every Hebrew string (DICT below), a few structural swaps
// (paths, media, language menu, form country field, Argentine legal notices, FAQ 3 without the Hebrew guide),
// the order scene (from _tools/scene.js) and the script's UI strings. The build fails if any Hebrew is left
// outside the language-menu link to the Hebrew page, so a new Hebrew string can never ship untranslated.
const fs = require('fs');
const path = require('path');
const scene = require('./scene');
const SITE = path.join(__dirname, '..');
const home = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');

const take = (s, a, b) => { const i = s.indexOf(a), j = s.indexOf(b, i + a.length); if (i < 0 || j < 0) throw new Error('marker not found: ' + a.slice(0, 50)); return s.slice(i, j + b.length); };
function rep(s, a, b, all) { if (!s.includes(a)) throw new Error('not found: ' + a.slice(0, 90)); return all ? s.split(a).join(b) : s.replace(a, b); }
function repRe(s, re, b) { if (!re.test(s)) throw new Error('not found: ' + re); return s.replace(re, b); }

const WA_HE = home.match(/https:\/\/wa\.me\/972556654664\?text=[^"]+/)[0];
const WA_ES = 'https://wa.me/972556654664?text=' + encodeURIComponent('¡Hola! Vi OrdexAI en la web y quiero saber cómo funciona para mi distribuidora 👋');

/* ---------- Spanish copy (Rioplatense, voseo). Hebrew string → Spanish, applied longest first. ---------- */
const DICT = [
  ['דלג לתוכן הראשי', 'Saltar al contenido principal'],
  ['ניווט ראשי', 'Navegación principal'],
  ['ניווט תחתון', 'Navegación inferior'],
  ['OrdexAI, לראש הדף', 'OrdexAI, ir al inicio'],
  ['איך זה עובד', 'Cómo funciona'],
  ['למה זה משתלם', 'Por qué conviene'],
  ['למי זה מתאים', 'Para quién es'],
  ['שאלות נפוצות', 'Preguntas frecuentes'],
  ['לשיחת הדגמה בוואטסאפ', 'Pedí una demo por WhatsApp'],
  ['הדגמה', 'Demo'],
  ['מופעל על תשתית WhatsApp Business API', 'Con la API oficial de WhatsApp Business'],
  ['ההזמנות שלכם.', 'Tus pedidos.'],
  ['בוואטסאפ.', 'Por WhatsApp.'],
  ['בלי אפליקציה.', 'Sin apps.'],
  ['הלקוחות מזמינים כמו תמיד: בהודעה, בהקלטה או בתמונה. OrdexAI מבינה, מסדרת ומכניסה את ההזמנה ישר למערכת שלכם.',
   'Tus clientes piden como siempre: por mensaje, audio o foto. OrdexAI entiende el pedido, lo ordena y lo carga directo en tu sistema.'],
  ['צפו בסרט', 'Mirá el video'],
  ['בלי אפליקציה', 'Sin apps'],
  ['בלי סיסמה', 'Sin contraseñas'],
  ['בלי הקלדה ידנית', 'Sin tipear a mano'],
  ['צ׳אט וואטסאפ: הלקוח שולח הזמנה בהודעה, בהקלטה ובתמונה, וההזמנה נקלטת במערכת',
   'Chat de WhatsApp: el cliente manda el pedido por mensaje, audio y foto, y el pedido se carga en el sistema'],
  ['ביסטרו השדרה', 'Bistró La Alameda'],
  ['לקוח', 'Cliente'],
  ['היום', 'Hoy'],
  ['היי, תשלח לי למחר 3 פחים שמן ו-6 עגבניות מרוסקות גדולות 🙏', 'Hola, para mañana mandame 3 bidones de aceite y 6 latas grandes de tomate 🙏'],
  ['טקסט', 'Texto'],
  ['הקלטה', 'Audio'],
  ['תמונה', 'Foto'],
  ['הודעה', 'Mensaje'],
  ['OrdexAI הבינה את שלוש ההודעות ·', 'OrdexAI entendió los tres mensajes ·'],
  ['ההזמנה נקלטה במערכת ✓', 'Pedido cargado en el sistema ✓'],
  ['מהודעות מכל כיוון', 'De mensajes por todos lados'],
  ['להזמנה מסודרת במערכת', 'a un pedido ordenado en tu sistema'],
  ['היום מישהו בצוות אוסף הודעות, הקלטות ותמונות, ומקליד אותן ידנית. עם OrdexAI הלקוחות ממשיכים להזמין כמו תמיד, וההזמנה נכנסת מסודרת למערכת שלכם.',
   'Hoy alguien de tu equipo junta mensajes, audios y fotos, y los tipea a mano. Con OrdexAI tus clientes siguen pidiendo como siempre, y el pedido entra ordenado a tu sistema.'],
  ['עצירה – הדגמת לפני ואחרי', 'Pausar – demostración antes y después'],
  ['עצירה', 'Pausar'],
  ['פחות הקלדה. פחות טעויות.', 'Menos tipeo. Menos errores.'],
  ['יותר מכירות.', 'Más ventas.'],
  ['פחות הקלדה', 'Menos tipeo'],
  ['כל הודעה, הקלטה או תמונה נכנסת למערכת כהזמנה מסודרת, בלי שמישהו מקליד אותה.',
   'Cada mensaje, audio o foto entra al sistema como un pedido ordenado, sin que nadie lo tipee.'],
  ['פחות טעויות', 'Menos errores'],
  ['כל פריט משויך למק״ט המדויק בקטלוג שלכם, והלקוח מאשר את ההזמנה לפני שהיא נקלטת.',
   'Cada producto se asocia al código exacto de tu catálogo, y el cliente confirma el pedido antes de que se cargue.'],
  ['יותר מכירות', 'Más ventas'],
  ['OrdexAI מזכירה ללקוח לפני הקאט-אוף, מציעה את מה שהוא רגיל להזמין, ומתריעה כשלקוח מאט.',
   'OrdexAI le recuerda al cliente antes del cierre, le sugiere lo que suele pedir y te avisa cuando un cliente deja de comprar.'],
  ['מתאים לעסק שלכם', 'Para tu negocio'],
  ['אותה שיטה, בכל תחום', 'El mismo método, en cualquier rubro'],
  ['OrdexAI לומדת את הקטלוג, היחידות והשפה המקצועית שלכם.', 'OrdexAI aprende tu catálogo, tus unidades y la forma de hablar de tu rubro.'],
  ['תחומים', 'Rubros'],
  ['מזון ומוצרי מדף', 'Alimentos y almacén'],
  ['חד פעמי ואריזות', 'Descartables y envases'],
  ['ניקיון ותחזוקה', 'Limpieza'],
  ['ציוד משרדי', 'Librería y oficina'],
  ['קוסמטיקה', 'Cosmética'],
  ['חלקי חילוף', 'Repuestos'],
  ['פארמה', 'Farmacia'],
  ['ועוד', 'y más'],
  ['יש לכם מערכת?', '¿Tenés sistema de gestión?'],
  ['ההזמנה נקלטת ישר במערכת שלכם.', 'El pedido se carga directo en tu sistema.'],
  ['רווחית', 'Tango'],
  ['פריוריטי', 'Bejerman'],
  ['אין מערכת?', '¿No tenés sistema?'],
  ['רשימת ליקוט ב-PDF, וקובץ Excel/CSV מוכנים להזנה.', 'Lista de preparación en PDF y archivo Excel/CSV, listos para cargar.'],
  ['רוצים לראות את זה על ההזמנות שלכם?', '¿Querés ver cómo funciona en tu negocio?'],
  ['שיחה קצרה בוואטסאפ, ונראה לכם איך הזמנה עוברת מהודעה למערכת שלכם.', 'Una charla corta por WhatsApp y te mostramos cómo un pedido pasa del mensaje a tu sistema.'],
  ['או', 'o'],
  ['בקשה לחזרה מאתר OrdexAI', 'Contacto desde el sitio de OrdexAI (español)'],
  ['לא נוח לדבר עכשיו? השאירו פרטים ונחזור אליכם.', '¿Ahora no podés hablar? Dejanos tus datos y te contactamos.'],
  ['שם מלא', 'Nombre y apellido'],
  ['ישראל ישראלי', 'Laura Fernández'],
  ['שם העסק', 'Empresa'],
  ['מחלבות רם', 'Distribuidora Del Plata'],
  ['טלפון/וואטסאפ', 'WhatsApp o teléfono'],
  ['אישר/ה את מדיניות הפרטיות', 'Aceptó la política de privacidad y la transferencia internacional de sus datos'],
  ['דברו איתי', 'Quiero que me contacten'],
  ['הפרטים ישמשו רק כדי לחזור אליכם, ולא יועברו לצד שלישי לצורכי שיווק. פרטים נוספים ב',
   'Usamos tus datos solo para responderte. No los vendemos ni los cedemos a terceros con fines de marketing. Más información en la '],
  ['מדיניות הפרטיות', 'política de privacidad'],
  ['שאלות שמפיצים שואלים אותנו', 'Lo que nos preguntan las distribuidoras'],
  ['הלקוחות שלי צריכים להוריד אפליקציה או להירשם?', '¿Mis clientes tienen que bajarse una app o registrarse?'],
  ['לא. הם מזמינים בוואטסאפ שכבר יש להם בטלפון, בלי אפליקציה ובלי סיסמה. בפעם הראשונה הם ממלאים טופס קצר אחד עם פרטי העסק, ואתם מאשרים אותם בלחיצה.',
   'No. Piden por el WhatsApp que ya tienen en el celular, sin apps ni contraseñas. La primera vez completan un formulario corto con los datos del negocio, y vos los aprobás con un clic.'],
  ['ומה אם המערכת לא בטוחה למה הלקוח התכוון?', '¿Y si el sistema no está seguro de lo que quiso decir el cliente?'],
  ['היא שואלת. הלקוח מקבל כפתורי בחירה מהירה, למשל איזה גודל או אריזה, ותמיד אפשר לדלג.',
   'Pregunta. El cliente recibe botones de respuesta rápida, por ejemplo qué tamaño o presentación, y siempre puede saltear la pregunta.'],
  ['מה ההבדל בין OrdexAI לקטלוג הזמנות בלינק או לקטלוג של WhatsApp Business?', '¿En qué se diferencia de un catálogo con link o del catálogo de WhatsApp Business?'],
  ['איך מתחילים?', '¿Cómo empiezo?'],
  ['קובעים שיחת הדגמה קצרה בוואטסאפ. אחר כך מחברים את הקטלוג שלכם, והמערכת מוכנה לקלוט הזמנות. הלקוחות ממשיכים להזמין כמו תמיד.',
   'Coordinamos una demo corta por WhatsApp. Después conectamos tu catálogo y el sistema queda listo para recibir pedidos. Tus clientes siguen pidiendo como siempre.'],
  ['המידע שלי ושל הלקוחות שלי מוגן?', '¿Mis datos y los de mis clientes están protegidos?'],
  ['OrdexAI פועלת על WhatsApp Business Platform הרשמי של Meta. אנחנו לא מוכרים מידע ולא משתמשים בו לפרסום, וכל מפיץ רואה רק את הלקוחות וההזמנות שלו. כל הפרטים ב',
   'OrdexAI funciona sobre la plataforma oficial de WhatsApp Business de Meta. No vendemos datos ni los usamos para publicidad, y cada distribuidora ve solo a sus clientes y sus pedidos. Todos los detalles en la '],
  ['מדיניות פרטיות', 'Política de privacidad'],
  ['הצהרת נגישות', 'Declaración de accesibilidad'],
  ['© 2026 OrdexAI. כל הזכויות שמורות.', '© 2026 OrdexAI. Todos los derechos reservados.'],
  ['OrdexAI מופעל על ידי לישי שמעון בן שושן', 'OrdexAI es operado por Lishai Shimon Ben Shoshan'],
  ['הסרט של OrdexAI', 'El video de OrdexAI'],
  ['סגירת הסרט', 'Cerrar el video'],
  ['ב', 'B'],   // the hero chat avatar (last: single letter)
];

const UI_ES = `const UI = {
  needNamePhone: 'Completá tu nombre y tu WhatsApp o teléfono.',
  needConsent: 'Para enviar, aceptá la política de privacidad.',
  sending: 'Enviando…',
  sent: '✓ ¡Gracias! Recibimos tus datos y te contactamos pronto.',
  mailSubject: 'Contacto desde el sitio de OrdexAI (español)',
  mailName: 'Nombre: ', mailBusiness: 'Empresa: ', mailPhone: 'WhatsApp: ', mailCountry: 'País: ',
  sendFailed: 'No se pudo enviar.', mailUs: 'Escribinos por mail',
  pause: 'Pausar', play: 'Reproducir', demoName: 'demostración antes y después'
};`;

const A11Y_ES = `<!-- Accessibility menu -->
<div class="a11y" role="region" aria-label="Accesibilidad">
  <button type="button" class="a11y-toggle" id="a11yToggle" aria-expanded="false" aria-controls="a11yPanel" aria-label="Menú de accesibilidad"><span aria-hidden="true">♿</span></button>
  <div class="a11y-panel" id="a11yPanel" role="dialog" aria-label="Opciones de accesibilidad" hidden>
    <div class="a11y-title">Accesibilidad</div>
    <div class="a11y-row">
      <span>Tamaño del texto</span>
      <div class="a11y-btns">
        <button type="button" data-a11y="font-dec" aria-label="Achicar el texto">A−</button>
        <button type="button" data-a11y="font-reset" aria-label="Tamaño original del texto">A</button>
        <button type="button" data-a11y="font-inc" aria-label="Agrandar el texto">A+</button>
      </div>
    </div>
    <button type="button" class="a11y-opt" data-a11y="contrast" aria-pressed="false">Alto contraste</button>
    <button type="button" class="a11y-opt" data-a11y="motion" aria-pressed="false">Detener animaciones</button>
    <button type="button" class="a11y-opt" data-a11y="links" aria-pressed="false">Resaltar enlaces</button>
    <a class="a11y-opt" href="accesibilidad.html">Declaración de accesibilidad</a>
    <button type="button" class="a11y-opt a11y-reset" data-a11y="reset">Restablecer</button>
  </div>
</div>`;

// Argentina, Ley 25.326 + DNPDP Disposición 10/2008: both notices must be visible where data is collected.
const LEGAL_ES = `      <p class="legal-line">El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto, conforme lo establecido en el artículo 14, inciso 3 de la Ley N° 25.326. La AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, en su carácter de Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.</p>`;

const CSS_ES = `
/* ================= Spanish page: LTR mirror + Latin display face ================= */
h1,h2,h3{font-family:'Plus Jakarta Sans','Heebo',sans-serif}
.hero h1{letter-spacing:-1px}
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
.hero h1 .pt{margin-inline-start:-.09em;color:inherit}
.legal-line{margin-top:.6rem;font-size:.72rem;color:var(--ink3);line-height:1.5}
.ph-who b{font-size:12.5px}
.ph-ic{gap:10px}
@media (max-width:560px){ .ph-head{gap:6px;padding:0 8px 4px} .ph-ic{gap:8px} .ph-ic svg{width:15px;height:15px} .ph-who b{font-size:12px} }   /* full customer name in the narrow phone */
.erp-tbl .c-src{width:80px}
.example-note{text-align:center;margin-top:.8rem;color:var(--ink3);font-size:.82rem}
`;

/* ---------- body: Hebrew page → Spanish ---------- */
let body = home.slice(home.indexOf('<body class="lang-he">'), home.lastIndexOf('</body>'));
body = rep(body, '<body class="lang-he">', '<body class="lang-es">');
body = rep(body, WA_HE, WA_ES, true);
body = scene.inject(body, 'es');

// language menu: Español is current; עברית links to the Hebrew page (and remembers the choice)
let langBlock = take(body, '<div class="lang" id="langMenu">', '</ul>\n    </div>');
const globe = langBlock.match(/<svg class="g"[\s\S]*?<\/svg>/)[0], chev = langBlock.match(/<svg class="c"[\s\S]*?<\/svg>/)[0];
const tick = langBlock.match(/<span>עברית<\/span>(<svg[\s\S]*?<\/svg>)/)[1];
const LANG_ES = `<div class="lang" id="langMenu">
      <button type="button" class="lang-t" id="langBtn" aria-haspopup="true" aria-expanded="false" aria-controls="langList" aria-label="ES – Elegir idioma (Language)">${globe}<span lang="es">ES</span>${chev}</button>
      <ul class="lang-list" id="langList" hidden>
        <li><a href="./" lang="es" hreflang="es" data-pick="es" aria-current="page"><span>Español</span>${tick}</a></li>
        <li><a href="../" lang="he" hreflang="he" data-pick="he"><span>עברית</span><small>HE</small></a></li>
      </ul>
    </div>`;
body = rep(body, langBlock, '__LANG_MENU__');   // kept out of the dictionary pass (its עברית link stays Hebrew)

// media + same-site pages (es/ is one level down)
body = rep(body, 'assets/home/note-he.webp', 'assets/home/note-es.webp');
body = rep(body, 'poster="assets/home/film-poster.jpg"', 'poster="assets/home/film-poster.es.jpg"');
body = rep(body, 'src="assets/home/ordexai-film.mp4"', 'src="assets/home/ordexai-film.es.mp4"');
body = repRe(body, /<track kind="captions" src="assets\/home\/ordexai-film\.he\.vtt"[^>]*>/, '<track kind="captions" src="assets/home/ordexai-film.es.vtt" srclang="es" label="Español" default>');
body = rep(body, 'src="assets/', 'src="../assets/', true);
body = rep(body, 'poster="assets/', 'poster="../assets/', true);
body = rep(body, 'href="privacy-policy.html"', 'href="privacidad.html"', true);
body = rep(body, 'href="accessibility.html"', 'href="accesibilidad.html"', true);
body = repRe(body, /\s*<a href="whatsapp-orders-guide\.html">[^<]*<\/a>(?=\s*<a href="privacidad\.html")/, '');   // the guide is Hebrew-only

// systems: the local ones
body = rep(body, '<span>Comax</span><span>SAP</span>', '<span>Memory</span><span>Odoo</span>');

// form: country field, consent that covers the international transfer, Argentine notices
body = rep(body, 'placeholder="050-000-0000"', 'placeholder="+54 9 11 2345-6789"');
body = repRe(body, /(<input id="cf-phone"[^>]*>\n\s*<\/div>)/, `$1
        <div class="field">
          <label for="cf-country">País</label>
          <input id="cf-country" name="country" type="text" autocomplete="country-name" placeholder="Argentina">
        </div>`);
body = repRe(body, /<span>קראתי ואני מסכים\/ה ל<a href="privacidad\.html"[^>]*>מדיניות הפרטיות<\/a> <span class="req">\*<\/span><\/span>/,
  '<span>Leí y acepto la <a href="privacidad.html" target="_blank" rel="noopener noreferrer">política de privacidad</a>, incluida la transferencia internacional de mis datos que allí se describe <span class="req">*</span></span>');
body = repRe(body, /(<p class="privacy-line">[\s\S]*?<\/p>)/, `$1\n${LEGAL_ES}`);

// FAQ 3: no link to the Hebrew-only guide
body = repRe(body, /<p>בקטלוג, בלינק או בתוך WhatsApp Business[\s\S]*?<\/p>/,
  '<p>En un catálogo, con link o dentro de WhatsApp Business, el cliente tiene que elegir los productos él mismo, y los que siguen mandando mensajes te quedan para tipear. OrdexAI también te da un catálogo con link, pero además toma los pedidos que llegan como siempre, en texto, audio o foto, y los asocia a tus códigos.</p>');

// examples are illustrative (brief, honesty rules)
body = repRe(body, /(    <div class="st-row">[\s\S]*?<\/div>\n)/, '$1    <p class="example-note">Los nombres, códigos y cantidades de esta sección son ejemplos ilustrativos.</p>\n');

// accessibility menu + script strings
body = rep(body, take(body, '<!-- Accessibility widget (IS 5568 / WCAG AA) -->', '\n  </div>\n</div>'), A11Y_ES);
body = rep(body, take(body, 'const UI = {', '\n};'), UI_ES);

for (const [he, es] of [...DICT].sort((a, b) => b[0].length - a[0].length)) body = rep(body, he, es, true);
body = rep(body, '__LANG_MENU__', LANG_ES);
body = rep(body, '<h1>Tus pedidos.<br><span>Por WhatsApp.</span><br>Sin apps.</h1>',
  '<h1>Tus pedidos<span class="pt">.</span><br><span>Por WhatsApp<span class="pt">.</span></span><br>Sin apps<span class="pt">.</span></h1>');   // Plus Jakarta Sans sets a wide gap before "." at display size

/* ---------- head ---------- */
const csp = home.match(/<meta http-equiv="Content-Security-Policy"[^>]*>/)[0];
const strip = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const faq = [...body.slice(body.indexOf('id="faq">')).matchAll(/<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<div class="ans"><p>([\s\S]*?)<\/p>/g)].map(m => ({ q: strip(m[1]), a: strip(m[2]) }));
if (faq.length !== 5) throw new Error('expected 5 FAQ items, got ' + faq.length);
const SITE_URL = 'https://www.ordexai.com/', ES_URL = SITE_URL + 'es/';
const ld = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', '@id': SITE_URL + '#organization', name: 'OrdexAI', url: SITE_URL, logo: SITE_URL + 'assets/ordexai-icon-512.png', email: 'info@ordexai.com',
      contactPoint: [{ '@type': 'ContactPoint', contactType: 'sales', telephone: '+972-55-665-4664', email: 'info@ordexai.com', availableLanguage: ['Spanish', 'Hebrew', 'English'] }] },
    { '@type': 'WebPage', '@id': ES_URL + '#webpage', url: ES_URL, name: 'OrdexAI — Pedidos por WhatsApp sin tipear', inLanguage: 'es', isPartOf: { '@id': SITE_URL + '#website' }, about: { '@id': ES_URL + '#service' } },
    { '@type': 'Service', '@id': ES_URL + '#service', name: 'OrdexAI — Pedidos por WhatsApp para distribuidoras',
      serviceType: 'Toma de pedidos por WhatsApp y carga automática en el sistema de gestión, para distribuidoras',
      provider: { '@id': SITE_URL + '#organization' }, availableLanguage: ['Spanish'],
      audience: { '@type': 'BusinessAudience', audienceType: 'Distribuidoras: alimentos, descartables, limpieza, librería y otros rubros' },
      description: 'Los clientes piden por WhatsApp en texto, audio o foto. OrdexAI entiende cada pedido, lo asocia a los códigos de tu catálogo, pregunta cuando algo no está claro, lo confirma con el cliente y lo carga directo en tu sistema. Sin apps y sin tipear a mano.',
      url: ES_URL },
    { '@type': 'FAQPage', '@id': ES_URL + '#faq', inLanguage: 'es', mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ],
};
const TITLE = 'OrdexAI — Pedidos por WhatsApp sin tipear | Para distribuidoras';
const DESC = 'Tus clientes piden por WhatsApp como siempre, en texto, audio o foto. OrdexAI entiende cada pedido, lo asocia a tus códigos y lo carga directo en tu sistema. Sin apps y sin tipear a mano.';
const OG = 'Tus clientes piden como siempre. OrdexAI hace el resto.';
const head = `<!DOCTYPE html>
<html lang="es" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${csp}
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <!-- GENERATED by _tools/build-es.js from ../index.html. Edit the Hebrew page or the builder, then run: node _tools/build-es.js -->
  <title>${TITLE}</title>
  <meta name="description" content="${DESC}">
  <meta name="theme-color" content="#0c3b2b">
  <link rel="canonical" href="${ES_URL}">
  <link rel="alternate" hreflang="he" href="${SITE_URL}">
  <link rel="alternate" hreflang="es" href="${ES_URL}">
  <link rel="alternate" hreflang="es-AR" href="${ES_URL}">
  <link rel="alternate" hreflang="es-UY" href="${ES_URL}">
  <link rel="alternate" hreflang="x-default" href="${SITE_URL}">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="icon" href="../favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="../apple-touch-icon.png">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="OrdexAI">
  <meta property="og:url" content="${ES_URL}">
  <meta property="og:locale" content="es_LA">
  <meta property="og:locale:alternate" content="he_IL">
  <meta property="og:title" content="OrdexAI — ${OG}">
  <meta property="og:description" content="Pedidos por WhatsApp en texto, audio o foto: entendidos, confirmados con el cliente y cargados en tu sistema. Para distribuidoras.">
  <meta property="og:image" content="${SITE_URL}assets/og-image-es.jpg">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="OrdexAI — ${OG}">
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
const out = head + css + CSS_ES + '  </style>\n</head>\n' + body + '</body>\n</html>\n';

// Hebrew is allowed only in the language menu's link to the Hebrew page
const leftovers = out.replace('<a href="../" lang="he" hreflang="he" data-pick="he"><span>עברית</span>', '').match(/.{0,40}[֐-׿].{0,40}/g);
if (leftovers) throw new Error('Hebrew left in the Spanish page:\n  ' + [...new Set(leftovers)].slice(0, 15).join('\n  '));
for (const k of ['note-he', 'film-poster.jpg"', 'ordexai-film.mp4"', '.he.vtt', 'whatsapp-orders-guide', 'privacy-policy.html', 'accessibility.html', 'class="lang-he"', '%D7%']) if (out.includes(k)) throw new Error('leftover: ' + k);

fs.mkdirSync(path.join(SITE, 'es'), { recursive: true });
fs.writeFileSync(path.join(SITE, 'es', 'index.html'), out);
console.log(`wrote es/index.html (${(out.length / 1024).toFixed(1)} KB), FAQ ${faq.length}, no Hebrew outside the language menu`);
