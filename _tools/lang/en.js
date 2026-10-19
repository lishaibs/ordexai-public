// English page (en/index.html): US spelling, same voice as the previous live English site. Used by _tools/build-langs.js.
// No film on this page for now (media.film = null): the film button and the film window are left out.
const fs = require('fs');
const path = require('path');

// Hero chat photo: the English handwritten note once it exists, the Spanish one until then.
const NOTE_EN = 'note-en.webp';
const hasNote = fs.existsSync(path.join(__dirname, '..', '..', 'assets', 'home', NOTE_EN));
if (!hasNote) console.warn('en: assets/home/note-en.webp is missing, using the Spanish note as a placeholder');

/* English copy. Hebrew string → English, applied longest first. */
const DICT = [
  ['דלג לתוכן הראשי', 'Skip to main content'],
  ['ניווט ראשי', 'Main navigation'],
  ['ניווט תחתון', 'Footer navigation'],
  ['OrdexAI, לראש הדף', 'OrdexAI, back to top'],
  ['איך זה עובד', 'How it works'],
  ['למה זה משתלם', 'Why it pays'],
  ['למי זה מתאים', 'Who it’s for'],
  ['שאלות נפוצות', 'FAQ'],
  ['לשיחת הדגמה בוואטסאפ', 'Book a WhatsApp demo'],
  ['הדגמה', 'Demo'],
  ['מופעל על תשתית WhatsApp Business API', 'Powered by the WhatsApp Business API'],
  ['ההזמנות שלכם.', 'Your orders.'],
  ['בוואטסאפ.', 'On WhatsApp.'],
  ['בלי אפליקציה.', 'No app.'],
  ['הלקוחות מזמינים כמו תמיד: בהודעה, בהקלטה או בתמונה. OrdexAI מבינה, מסדרת ומכניסה את ההזמנה ישר למערכת שלכם.',
   'Your customers order the way they always do: by message, voice note or photo. OrdexAI understands the order, organizes it and enters it straight into your system.'],
  ['צפו בסרט', 'Watch the film'],
  ['בלי אפליקציה', 'No app'],
  ['בלי סיסמה', 'No password'],
  ['בלי הקלדה ידנית', 'No manual typing'],
  ['צ׳אט וואטסאפ: הלקוח שולח הזמנה בהודעה, בהקלטה ובתמונה, וההזמנה נקלטת במערכת',
   'WhatsApp chat: the customer sends an order by message, voice note and photo, and the order is entered in the system'],
  ['ביסטרו השדרה', 'Avenue Bistro'],
  ['לקוח', 'Customer'],
  ['היום', 'Today'],
  ['היי, תשלח לי למחר 3 פחים שמן ו-6 עגבניות מרוסקות גדולות 🙏', 'Hi, for tomorrow please send 3 jugs of oil and 6 large cans of crushed tomatoes 🙏'],
  ['טקסט', 'Text'],
  ['הקלטה', 'Voice'],
  ['תמונה', 'Photo'],
  ['הודעה', 'Message'],
  ['OrdexAI הבינה את שלוש ההודעות ·', 'OrdexAI understood all three messages ·'],
  ['ההזמנה נקלטה במערכת ✓', 'Order entered in the system ✓'],
  ['מהודעות מכל כיוון', 'From messages everywhere'],
  ['להזמנה מסודרת במערכת', 'to a structured order in your system'],
  ['היום מישהו בצוות אוסף הודעות, הקלטות ותמונות, ומקליד אותן ידנית. עם OrdexAI הלקוחות ממשיכים להזמין כמו תמיד, וההזמנה נכנסת מסודרת למערכת שלכם.',
   'Today someone on your team collects messages, voice notes and photos, and types them in by hand. With OrdexAI your customers keep ordering the way they always do, and the order lands in your system, organized.'],
  ['עצירה – הדגמת לפני ואחרי', 'Pause – before and after demo'],
  ['עצירה', 'Pause'],
  ['פחות הקלדה. פחות טעויות.', 'Less typing. Fewer errors.'],
  ['יותר מכירות.', 'More sales.'],
  ['פחות הקלדה', 'Less typing'],
  ['כל הודעה, הקלטה או תמונה נכנסת למערכת כהזמנה מסודרת, בלי שמישהו מקליד אותה.',
   'Every message, voice note or photo enters your system as a structured order, without anyone typing it.'],
  ['פחות טעויות', 'Fewer errors'],
  ['כל פריט משויך למק״ט המדויק בקטלוג שלכם, והלקוח מאשר את ההזמנה לפני שהיא נקלטת.',
   'Every item is matched to the right SKU in your catalog, and the customer confirms the order before it’s entered.'],
  ['יותר מכירות', 'More sales'],
  ['OrdexAI מזכירה ללקוח לפני הקאט-אוף, מציעה את מה שהוא רגיל להזמין, ומתריעה כשלקוח מאט.',
   'OrdexAI reminds customers before your cutoff, suggests what they usually order, and alerts you when a customer starts ordering less.'],
  ['מתאים לעסק שלכם', 'Fits your business'],
  ['אותה שיטה, בכל תחום', 'One method, any industry'],
  ['OrdexAI לומדת את הקטלוג, היחידות והשפה המקצועית שלכם.', 'OrdexAI learns your catalog, your units and the way your trade talks.'],
  ['תחומים', 'Industries'],
  ['מזון ומוצרי מדף', 'Food & grocery'],
  ['חד פעמי ואריזות', 'Disposables & packaging'],
  ['ניקיון ותחזוקה', 'Cleaning & maintenance'],
  ['ציוד משרדי', 'Office supplies'],
  ['קוסמטיקה', 'Cosmetics'],
  ['חלקי חילוף', 'Spare parts'],
  ['פארמה', 'Pharma'],
  ['ועוד', 'and more'],
  ['יש לכם מערכת?', 'Have a system?'],
  ['ההזמנה נקלטת ישר במערכת שלכם.', 'The order is entered straight into your system.'],
  ['רווחית', 'Rivhit'],
  ['פריוריטי', 'Priority'],
  ['אין מערכת?', 'No system?'],
  ['רשימת ליקוט ב-PDF, וקובץ Excel/CSV מוכנים להזנה.', 'A PDF picking list, plus an Excel/CSV file ready to import.'],
  ['רוצים לראות את זה על ההזמנות שלכם?', 'Want to see it on your own orders?'],
  ['שיחה קצרה בוואטסאפ, ונראה לכם איך הזמנה עוברת מהודעה למערכת שלכם.', 'A short WhatsApp chat, and we’ll show you how an order goes from a message into your system.'],
  ['או', 'or'],
  ['בקשה לחזרה מאתר OrdexAI', 'Callback request from the OrdexAI website (English)'],
  ['לא נוח לדבר עכשיו? השאירו פרטים ונחזור אליכם.', 'Can’t talk right now? Leave your details and we’ll get back to you.'],
  ['שם מלא', 'Full name'],
  ['ישראל ישראלי', 'Jane Smith'],
  ['שם העסק', 'Business name'],
  ['מחלבות רם', 'Sunrise Foods'],
  ['טלפון/וואטסאפ', 'Phone / WhatsApp'],
  ['אישר/ה את מדיניות הפרטיות', 'Agreed to the privacy policy'],
  ['דברו איתי', 'Talk to me'],
  ['הפרטים ישמשו רק כדי לחזור אליכם, ולא יועברו לצד שלישי לצורכי שיווק. פרטים נוספים ב',
   'Your details are used only to get back to you and are never shared with third parties for marketing. More in our '],
  ['מדיניות הפרטיות', 'Privacy Policy'],
  ['שאלות שמפיצים שואלים אותנו', 'Questions distributors ask us'],
  ['הלקוחות שלי צריכים להוריד אפליקציה או להירשם?', 'Do my customers need to download an app or sign up?'],
  ['לא. הם מזמינים בוואטסאפ שכבר יש להם בטלפון, בלי אפליקציה ובלי סיסמה. בפעם הראשונה הם ממלאים טופס קצר אחד עם פרטי העסק, ואתם מאשרים אותם בלחיצה.',
   'No. They order in the WhatsApp they already have on their phone, with no app and no password. The first time, they fill in one short form with their business details, and you approve them with a tap.'],
  ['ומה אם המערכת לא בטוחה למה הלקוח התכוון?', 'What if the system isn’t sure what the customer meant?'],
  ['היא שואלת. הלקוח מקבל כפתורי בחירה מהירה, למשל איזה גודל או אריזה, ותמיד אפשר לדלג.',
   'It asks. The customer gets quick-choice buttons, for example which size or pack, and can always skip.'],
  ['מה ההבדל בין OrdexAI לקטלוג הזמנות בלינק או לקטלוג של WhatsApp Business?', 'How is OrdexAI different from an order catalog link or the WhatsApp Business catalog?'],
  ['איך מתחילים?', 'How do I get started?'],
  ['קובעים שיחת הדגמה קצרה בוואטסאפ. אחר כך מחברים את הקטלוג שלכם, והמערכת מוכנה לקלוט הזמנות. הלקוחות ממשיכים להזמין כמו תמיד.',
   'Book a short demo on WhatsApp. Then we connect your catalog, and the system is ready to take orders. Your customers keep ordering the way they always do.'],
  ['המידע שלי ושל הלקוחות שלי מוגן?', 'Is my data, and my customers’ data, protected?'],
  ['OrdexAI פועלת על WhatsApp Business Platform הרשמי של Meta. אנחנו לא מוכרים מידע ולא משתמשים בו לפרסום, וכל מפיץ רואה רק את הלקוחות וההזמנות שלו. כל הפרטים ב',
   'OrdexAI runs on Meta’s official WhatsApp Business Platform. We never sell data or use it for advertising, and each distributor sees only their own customers and orders. Full details in our '],
  ['מדיניות פרטיות', 'Privacy Policy'],
  ['הצהרת נגישות', 'Accessibility statement'],
  ['© 2026 OrdexAI. כל הזכויות שמורות.', '© 2026 OrdexAI. All rights reserved.'],
  ['OrdexAI מופעל על ידי לישי שמעון בן שושן', 'OrdexAI is operated by Lishai Shimon Ben Shoshan'],
  ['הסרט של OrdexAI', 'The OrdexAI film'],
  ['סגירת הסרט', 'Close the film'],
  ['ב', 'A'],   // the hero chat avatar (last: single letter)
];

const UI_EN = `const UI = {
  needNamePhone: 'Please enter your name and phone or WhatsApp number.',
  needConsent: 'Please agree to the Privacy Policy to send.',
  sending: 'Sending…',
  sent: '✓ Thanks! We got your details and will get back to you soon.',
  mailSubject: 'Callback request from the OrdexAI website (English)',
  mailName: 'Name: ', mailBusiness: 'Business: ', mailPhone: 'Phone: ', mailCountry: 'Country: ',
  sendFailed: 'Sending failed.', mailUs: 'Email us directly',
  pause: 'Pause', play: 'Play', demoName: 'before and after demo'
};`;

const A11Y_EN = `<!-- Accessibility menu -->
<div class="a11y" role="region" aria-label="Accessibility">
  <button type="button" class="a11y-toggle" id="a11yToggle" aria-expanded="false" aria-controls="a11yPanel" aria-label="Accessibility menu"><span aria-hidden="true">♿</span></button>
  <div class="a11y-panel" id="a11yPanel" role="dialog" aria-label="Accessibility settings" hidden>
    <div class="a11y-title">Accessibility</div>
    <div class="a11y-row">
      <span>Text size</span>
      <div class="a11y-btns">
        <button type="button" data-a11y="font-dec" aria-label="Smaller text">A−</button>
        <button type="button" data-a11y="font-reset" aria-label="Reset text size">A</button>
        <button type="button" data-a11y="font-inc" aria-label="Larger text">A+</button>
      </div>
    </div>
    <button type="button" class="a11y-opt" data-a11y="contrast" aria-pressed="false">High contrast</button>
    <button type="button" class="a11y-opt" data-a11y="motion" aria-pressed="false">Stop animations</button>
    <button type="button" class="a11y-opt" data-a11y="links" aria-pressed="false">Highlight links</button>
    <a class="a11y-opt" href="../accessibility.html#en">Accessibility statement</a>
    <button type="button" class="a11y-opt a11y-reset" data-a11y="reset">Reset settings</button>
  </div>
</div>`;

module.exports = {
  code: 'en', htmlLang: 'en', ogLocale: 'en_US',
  waText: 'Hi! I saw OrdexAI on the website and would like to hear how it works for my business 👋',
  dict: DICT, ui: UI_EN, a11y: A11Y_EN,
  privacyHref: '../privacy-policy.html?lang=en', a11yHref: '../accessibility.html#en',
  media: { note: hasNote ? NOTE_EN : 'note-es.webp', film: null },
  menuAria: 'EN – Choose language',
  phonePlaceholder: '+1 555 010 2030',
  country: { label: 'Country', placeholder: 'e.g. United States' },
  consentHtml: '<span>I have read and agree to the <a href="../privacy-policy.html?lang=en" target="_blank" rel="noopener noreferrer">Privacy Policy</a> <span class="req">*</span></span>',
  afterPrivacyLine: null,
  faq3: '<p>With a catalog, whether a link or inside WhatsApp Business, customers pick the products themselves, and anyone who keeps texting is still left for you to type. OrdexAI also gives you an order page link, but it also takes orders written the usual way, as text, voice notes or photos, and matches them to your SKUs.</p>',
  exampleNote: 'The names, codes and quantities in this section are illustrative examples.',
  systems: ['Comax', 'SAP'],
  css: '',
  head: {
    title: 'OrdexAI — Take WhatsApp orders without manual typing | For distributors',
    desc: 'Your customers keep ordering on WhatsApp, by text, voice note or photo. OrdexAI understands each order, matches every item to your SKUs and enters it straight into your system. No app, no manual typing.',
    ogTitle: 'OrdexAI — Your customers order as usual. OrdexAI does the rest.',
    ogDesc: 'WhatsApp orders by text, voice note or photo: understood, confirmed with the customer and entered into your system. For distributors.',
    ogImage: 'assets/og-image-en.jpg',
    pageName: 'OrdexAI — Take WhatsApp orders without manual typing',
    service: {
      name: 'OrdexAI — WhatsApp order intake for distributors',
      serviceType: 'WhatsApp order intake and automatic entry into the distributor’s system',
      availableLanguage: ['English'],
      audienceType: 'Distributors and wholesalers: food, disposables, cleaning, office supplies and more',
      description: 'Customers order on WhatsApp by text, voice note or photo. OrdexAI understands each order, matches every item to the distributor’s SKUs, asks when something is unclear, confirms the order with the customer and enters it straight into the distributor’s system. No app and no manual typing.',
    },
  },
};
