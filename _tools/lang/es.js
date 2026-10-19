// Spanish page (es/index.html): Rioplatense voseo, for Spanish speakers anywhere. Used by _tools/build-langs.js.
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

module.exports = {
  code: 'es', htmlLang: 'es', ogLocale: 'es_LA',
  waText: '¡Hola! Vi OrdexAI en la web y quiero saber cómo funciona para mi distribuidora 👋',
  dict: DICT, ui: UI_ES, a11y: A11Y_ES,
  privacyHref: 'privacidad.html', a11yHref: 'accesibilidad.html',
  media: { note: 'note-es.webp', film: { src: 'ordexai-film.es.mp4', poster: 'film-poster.es.jpg', vtt: 'ordexai-film.es.vtt', srclang: 'es', label: 'Español' } },
  menuAria: 'ES – Elegir idioma (Language)',
  phonePlaceholder: '+54 9 11 2345-6789',
  country: { label: 'País', placeholder: 'Argentina' },
  consentHtml: '<span>Leí y acepto la <a href="privacidad.html" target="_blank" rel="noopener noreferrer">política de privacidad</a>, incluida la transferencia internacional de mis datos que allí se describe <span class="req">*</span></span>',
  afterPrivacyLine: LEGAL_ES,
  faq3: '<p>En un catálogo, con link o dentro de WhatsApp Business, el cliente tiene que elegir los productos él mismo, y los que siguen mandando mensajes te quedan para tipear. OrdexAI también te da un catálogo con link, pero además toma los pedidos que llegan como siempre, en texto, audio o foto, y los asocia a tus códigos.</p>',
  exampleNote: 'Los nombres, códigos y cantidades de esta sección son ejemplos ilustrativos.',
  systems: ['Memory', 'Odoo'],   // replace Comax, SAP (the dictionary turns Rivhit/Priority into Tango/Bejerman)
  css: '.legal-line{margin-top:.6rem;font-size:.72rem;color:var(--ink3);line-height:1.5}',
  head: {
    title: 'OrdexAI — Pedidos por WhatsApp sin tipear | Para distribuidoras',
    desc: 'Tus clientes piden por WhatsApp como siempre, en texto, audio o foto. OrdexAI entiende cada pedido, lo asocia a tus códigos y lo carga directo en tu sistema. Sin apps y sin tipear a mano.',
    ogTitle: 'OrdexAI — Tus clientes piden como siempre. OrdexAI hace el resto.',
    ogDesc: 'Pedidos por WhatsApp en texto, audio o foto: entendidos, confirmados con el cliente y cargados en tu sistema. Para distribuidoras.',
    ogImage: 'assets/og-image-es.jpg',
    pageName: 'OrdexAI — Pedidos por WhatsApp sin tipear',
    service: {
      name: 'OrdexAI — Pedidos por WhatsApp para distribuidoras',
      serviceType: 'Toma de pedidos por WhatsApp y carga automática en el sistema de gestión, para distribuidoras',
      availableLanguage: ['Spanish'],
      audienceType: 'Distribuidoras: alimentos, descartables, limpieza, librería y otros rubros',
      description: 'Los clientes piden por WhatsApp en texto, audio o foto. OrdexAI entiende cada pedido, lo asocia a los códigos de tu catálogo, pregunta cuando algo no está claro, lo confirma con el cliente y lo carga directo en tu sistema. Sin apps y sin tipear a mano.',
    },
  },
};
