// The before → after scene on the home pages: four orders, each processed in turn by OrdexAI,
// then a summary of today's orders. One template, two languages, so the pages never drift apart.
//   node _tools/scene.js        → rewrites the scene in index.html (Hebrew)
//   require('./scene').render('es')  → used by _tools/build-es.js
// All timings come from the ORDER data and T0/STEP below. The page script plays [data-at]/[data-off].
const fs = require('fs');
const path = require('path');

const T0 = 3.4;      // first order starts (after the four cards are in and the amber strip has typed itself out)
const TYPE = [1.45, 2.75];   // the strip types out between these seconds, while the rows are highlighted (until T0)
const STEP = 7.2;    // seconds per order
const f = n => +n.toFixed(2);
const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';
const wave = '<span class="wave" aria-hidden="true"><i style="height:5px"></i><i style="height:9px"></i><i style="height:13px"></i><i style="height:7px"></i><i style="height:11px"></i><i style="height:6px"></i><i style="height:14px"></i><i style="height:8px"></i><i style="height:10px"></i><i style="height:5px"></i><i style="height:12px"></i><i style="height:7px"></i></span>';
// the strip's sentence, one span per character, typed out between a and b. It is retyped for every order:
// one copy per round, stacked in one place; a copy shows from its start until the next round starts.
const TYPE_LEN = TYPE[1] - TYPE[0];
const typedCopy = (text, a, b, on, off) => { const ch = [...text], dt = (b - a) / ch.length;
  return `<span class="typed" data-at="${f(on)}"${off != null ? ` data-off="${f(off)}"` : ''}>` + ch.map((c, i) => `<span class="k" data-at="${f(a + i * dt)}">${c}</span>`).join('') + '</span>'; };
const tok = (cls, at, text) => `<span class="tok ${cls}" data-at="${at}">${text}</span>`;

const LANG = {
  he: {
    group: 'לפני ואחרי: ארבע הזמנות מגיעות בהודעה, בהקלטה, בתמונה ומסוכן שטח. OrdexAI מעבדת כל אחת בתורה ויוצרת אותה במערכת',
    before: 'לפני · ככה ההזמנות מגיעות', beforeSmall: 'כל היום, מכל לקוח',
    after: 'אחרי · ככה הן נקלטות', afterSmall: 'אוטומטית, עם המק״טים שלכם',
    pain: 'ומישהו מקליד הכול ידנית',
    procTitle: 'OrdexAI מעבדת את ההזמנה', step2: 'מתאימה למק״טים שלכם', step3: 'יוצרת הזמנה במערכת', orderWord: 'הזמנה',
    win: { title: 'הזמנת לקוח', cust: 'לקוח', date: 'תאריך אספקה', cols: ['מק״ט', 'תיאור', 'כמות', 'יח׳'], source: 'מקור: WhatsApp · OrdexAI', zero: '0 הקלדות ידניות', stamp: 'נקלטה במערכת' },
    sum: { title: 'הזמנות שנקלטו היום', date: 'תאריך אספקה', total: 'סה״כ', totalVal: (n, l) => `${n} הזמנות · ${l} שורות`, cols: ['הזמנה', 'לקוח', 'מקור', 'שורות'], stamp: n => `${n} הזמנות נקלטו במערכת` },
    orders: [
      { av: 'פ', c: 'c-wa', name: 'פיצה רומא', ch: 'הודעה', time: '07:40', cust: 'פיצה רומא', no: '10482',
        body: `בוקר טוב, למחר ${tok('q', 1.7, '2 פחים')} ${tok('p', 1.78, 'שמן')}, ${tok('q', 1.86, '4 קרטונים')} ${tok('p', 1.94, 'קופסאות 750')} ו-${tok('q', 2.02, '6')} ${tok('p', 2.1, 'עגבניות')}`,
        s1: 'מזהה מוצרים וכמויות', d1: '2 פחים שמן · 4 קרטונים קופסאות · 6 עגבניות',
        rows: [['30110', 'שמן קנולה לטיגון · 18 ליטר', '2', 'פח'], ['52750', 'קופסאות מזון 750 מ״ל', '4', 'קרטון'], ['30245', 'עגבניות מרוסקות · 2.5 ק״ג', '6', 'יח׳']] },
      { av: 'מ', c: 'c-voice', name: 'מאפיית אורן', ch: 'הקלטה', time: '09:20', cust: 'מאפיית אורן', no: '10483',
        body: wave + 'הודעה קולית · 0:32',
        s1: 'מתמללת את ההקלטה', d1: '״3 שקי קמח, 5 שמרים ופח שמן״',
        rows: [['41020', 'קמח לבן · 25 ק״ג', '3', 'שק'], ['41310', 'שמרים טריים · 1 ק״ג', '5', 'יח׳'], ['30110', 'שמן קנולה לטיגון · 18 ליטר', '1', 'פח']] },
      { av: 'ב', c: 'c-photo', name: 'בורגר סטיישן', ch: 'תמונה', time: '13:05', cust: 'בורגר סטיישן', no: '10484',
        body: '📷 רשימה בכתב יד',
        s1: 'קוראת את הרשימה בכתב יד', d1: '8 מארזי לחמניות · 6 שקי צ׳יפס · 2 קטשופ',
        rows: [['61204', 'לחמניות המבורגר · 12 יח׳', '8', 'מארז'], ['72010', 'צ׳יפס קפוא · 2.5 ק״ג', '6', 'שק'], ['38150', 'קטשופ · 3 ק״ג', '2', 'יח׳']] },
      { av: 'ר', c: 'c-agent', name: 'רונן, סוכן שטח', ch: 'סוכן', time: '16:50', cust: 'גריל העיר', no: '10485',
        body: 'גריל העיר ביקשו עוד 2 קרטונים קופסאות',
        s1: 'מזהה את הלקוח מהודעת הסוכן', d1: 'גריל העיר · 2 קרטונים קופסאות',
        rows: [['52750', 'קופסאות מזון 750 מ״ל', '2', 'קרטון']] },
    ],
  },
  en: {
    group: 'Before and after: four orders arrive by message, voice note, photo and field rep. OrdexAI processes each one in turn and creates it in the system',
    before: 'Before · How orders arrive', beforeSmall: 'All day, from every customer',
    after: 'After · How they’re entered', afterSmall: 'Automatically, with your SKUs',
    pain: 'And someone types it all in by hand',
    procTitle: 'OrdexAI is processing the order', step2: 'Matches them to your SKUs', step3: 'Creates the order in your system', orderWord: 'Order',
    win: { title: 'Customer order', cust: 'Customer', date: 'Delivery date', cols: ['SKU', 'Description', 'Qty', 'Unit'], source: 'Source: WhatsApp · OrdexAI', zero: '0 manual entries', stamp: 'Order entered' },
    sum: { title: 'Orders entered today', date: 'Delivery date', total: 'Total', totalVal: (n, l) => `${n} orders · ${l} lines`, cols: ['Order', 'Customer', 'Source', 'Lines'], stamp: n => `${n} orders entered in your system` },
    orders: [
      { av: 'R', c: 'c-wa', name: 'Roma Pizzeria', ch: 'Message', time: '07:40', cust: 'Roma Pizzeria', no: '10482',
        body: `Morning! For tomorrow ${tok('q', 1.7, '2 jugs')} of ${tok('p', 1.78, 'oil')}, ${tok('q', 1.86, '4 cases')} of ${tok('p', 1.94, '750 containers')} and ${tok('q', 2.02, '6 cans')} of ${tok('p', 2.1, 'tomatoes')}`,
        s1: 'Spots products and quantities', d1: '2 jugs of oil · 4 cases of containers · 6 cans of tomatoes',
        rows: [['30110', 'Canola frying oil · 18 L jug', '2', 'jug'], ['52750', 'Food containers · 750 ml', '4', 'case'], ['30245', 'Crushed tomatoes · 2.5 kg can', '6', 'can']] },
      { av: 'G', c: 'c-voice', name: 'Golden Crust Bakery', ch: 'Voice', time: '09:20', cust: 'Golden Crust Bakery', no: '10483',
        body: wave + 'Voice message · 0:32',
        s1: 'Transcribes the voice note', d1: '“3 bags of flour, 5 yeast and a jug of oil”',
        rows: [['41020', 'White flour · 25 kg bag', '3', 'bag'], ['41310', 'Fresh yeast · 1 kg', '5', 'ea'], ['30110', 'Canola frying oil · 18 L jug', '1', 'jug']] },
      { av: 'B', c: 'c-photo', name: 'Burger Station', ch: 'Photo', time: '13:05', cust: 'Burger Station', no: '10484',
        body: '📷 Handwritten list',
        s1: 'Reads the handwritten list', d1: '8 packs of buns · 6 bags of fries · 2 ketchup',
        rows: [['61204', 'Burger buns · 12-pack', '8', 'pack'], ['72010', 'Frozen fries · 2.5 kg', '6', 'bag'], ['38150', 'Ketchup · 3 kg', '2', 'ea']] },
      { av: 'D', c: 'c-agent', name: 'Dan, field rep', ch: 'Rep', time: '16:50', cust: 'City Grill', no: '10485',
        body: 'City Grill asked for 2 more cases of containers',
        s1: 'Finds the customer in the rep’s message', d1: 'City Grill · 2 cases of containers',
        rows: [['52750', 'Food containers · 750 ml', '2', 'case']] },
    ],
  },
  es: {
    group: 'Antes y después: cuatro pedidos llegan por mensaje, audio, foto y preventista. OrdexAI procesa cada uno y lo crea en el sistema',
    before: 'Antes · Así llegan los pedidos', beforeSmall: 'Todo el día, de cada cliente',
    after: 'Después · Así se cargan', afterSmall: 'Automático, con tus códigos',
    pain: 'Y alguien tipea todo a mano',
    procTitle: 'OrdexAI está procesando el pedido', step2: 'Los asocia a tus códigos', step3: 'Crea el pedido en el sistema', orderWord: 'Pedido',
    win: { title: 'Pedido de cliente', cust: 'Cliente', date: 'Fecha de entrega', cols: ['Código', 'Descripción', 'Cant.', 'Unidad'], source: 'Origen: WhatsApp · OrdexAI', zero: '0 tipeos a mano', stamp: 'Pedido cargado' },
    sum: { title: 'Pedidos cargados hoy', date: 'Fecha de entrega', total: 'Total', totalVal: (n, l) => `${n} pedidos · ${l} líneas`, cols: ['Pedido', 'Cliente', 'Origen', 'Líneas'], stamp: n => `${n} pedidos cargados en el sistema` },
    orders: [
      { av: 'P', c: 'c-wa', name: 'Pizzería Roma', ch: 'Mensaje', time: '07:40', cust: 'Pizzería Roma', no: '10482',
        body: `Buen día, para mañana ${tok('q', 1.7, '2 bidones')} de ${tok('p', 1.78, 'aceite')}, ${tok('q', 1.86, '4 cajas')} de ${tok('p', 1.94, 'envases 750')} y ${tok('q', 2.02, '6 latas')} de ${tok('p', 2.1, 'tomate')}`,
        s1: 'Identifica productos y cantidades', d1: '2 bidones de aceite · 4 cajas de envases · 6 latas de tomate',
        rows: [['30110', 'Aceite de girasol · bidón 20 L', '2', 'bidón'], ['52750', 'Envases 750 cc con tapa', '4', 'caja'], ['30245', 'Tomate triturado · lata 2,5 kg', '6', 'lata']] },
      { av: 'E', c: 'c-voice', name: 'Panadería La Espiga', ch: 'Audio', time: '09:20', cust: 'Panadería La Espiga', no: '10483',
        body: wave + 'Mensaje de voz · 0:32',
        s1: 'Transcribe el audio', d1: '«3 bolsas de harina, 5 de levadura y un bidón de aceite»',
        rows: [['41020', 'Harina 000 · bolsa 25 kg', '3', 'bolsa'], ['41310', 'Levadura fresca · 1 kg', '5', 'u.'], ['30110', 'Aceite de girasol · bidón 20 L', '1', 'bidón']] },
      { av: 'B', c: 'c-photo', name: 'Burger Station', ch: 'Foto', time: '13:05', cust: 'Burger Station', no: '10484',
        body: '📷 Lista escrita a mano',
        s1: 'Lee la lista escrita a mano', d1: '8 paquetes de pan · 6 bolsas de papas · 2 kétchup',
        rows: [['61204', 'Pan de hamburguesa · x12', '8', 'paq.'], ['72010', 'Papas fritas congeladas · 2,5 kg', '6', 'bolsa'], ['38150', 'Kétchup · 3 kg', '2', 'u.']] },
      { av: 'M', c: 'c-agent', name: 'Martín, preventista', ch: 'Preventista', time: '16:50', cust: 'Parrilla del Centro', no: '10485',
        body: 'Parrilla del Centro pidió 2 cajas más de envases',
        s1: 'Identifica al cliente en el mensaje del preventista', d1: 'Parrilla del Centro · 2 cajas de envases',
        rows: [['52750', 'Envases 750 cc con tapa', '2', 'caja']] },
    ],
  },
};

function render(lang, { assets = 'assets/' } = {}) {
  const L = LANG[lang];
  const ORDERS = L.orders.map((o, k) => {
    const S = T0 + k * STEP;
    return Object.assign({}, o, {
      focus: [S, S + 6.9], think: [S + 0.2, S + 3.7], proc: [S + 0.3, S + 3.9], steps: [S + 0.9, S + 1.9, S + 2.9],
      win: [S + 3.9, k === L.orders.length - 1 ? S + 6.8 : S + 6.9], fill: S + 4.05, rowAt: [S + 4.25, S + 4.45, S + 4.65], foot: S + 4.9, done: S + 5.2,
    });
  });
  const SUM = T0 + ORDERS.length * STEP - 0.6;
  const rounds = [TYPE[0], ...ORDERS.map(o => o.focus[0] + 0.3)];   // the strip retypes with every order
  const END = f(SUM + 2.9);
  const logo = assets + 'ordexai-logo.png';
  const dates = '<span class="fill erp-date" data-at="%">19/10/2026</span>';

  const card = (o, k) => `          <div class="ic${k === 0 ? ' src' : ''}" data-at="${f(0.2 + k * 0.3)}"><span class="focus" data-at="${f(o.focus[0])}" data-off="${f(o.focus[1])}" aria-hidden="true"></span><span class="ic-av" style="--c:var(--${o.c})" aria-hidden="true">${o.av}<span class="ok" data-at="${f(o.done)}">${check}</span></span><div class="ic-b"><div class="ic-t"><b>${o.name}</b><span class="ch" style="--c:var(--${o.c})">${o.ch}</span><time>${o.time}</time></div><p>${o.body}</p></div></div>`;
  const proc = o => `            <div class="proc" data-at="${f(o.proc[0])}" data-off="${f(o.proc[1])}">
              <div class="proc-h"><span class="proc-logo"><img src="${logo}" alt="" width="30" height="19"></span><span><b>${L.procTitle}</b><small>${o.name} · ${o.ch}</small></span></div>
              <ol class="proc-steps">
                <li data-at="${f(o.steps[0])}"><i></i><span>${o.s1}<small><bdi>${o.d1}</bdi></small></span></li>
                <li data-at="${f(o.steps[1])}"><i></i><span>${L.step2}<small><bdi>${o.rows.map(r => r[0]).join(' · ')}</bdi></small></span></li>
                <li data-at="${f(o.steps[2])}"><i></i><span>${L.step3}<small>${L.orderWord} <bdi>${o.no}</bdi> · ${o.cust}</small></span></li>
              </ol>
            </div>`;
  const row = (r, at) => r
    ? `<tr class="r" data-at="${f(at)}"><td class="c-k">${r[0]}</td><td>${r[1]}</td><td class="c-q">${r[2]}</td><td class="c-u">${r[3]}</td></tr>`
    : `<tr class="r blank"><td class="c-k"></td><td></td><td class="c-q"></td><td class="c-u"></td></tr>`;
  const W = L.win, C = W.cols;
  const win = o => `          <div class="erp ord" data-at="${f(o.win[0])}" data-off="${f(o.win[1])}" aria-hidden="true">
            <div class="erp-bar"><span>${W.title} <span class="fill" data-at="${f(o.fill)}">${o.no}</span></span><span class="dots"><i></i><i></i><i></i></span></div>
            <div class="erp-fields">
              <div class="erp-f"><span class="lb">${W.cust}</span><div><span class="fill" data-at="${f(o.fill)}">${o.cust}</span></div></div>
              <div class="erp-f"><span class="lb">${W.date}</span><div>${dates.replace('%', f(o.fill))}</div></div>
            </div>
            <div class="erp-tw"><table class="erp-tbl">
              <thead><tr><th class="c-k">${C[0]}</th><th>${C[1]}</th><th class="c-q">${C[2]}</th><th class="c-u">${C[3]}</th></tr></thead>
              <tbody>${[0, 1, 2].map(i => row(o.rows[i], o.rowAt[i])).join('')}</tbody>
            </table></div>
            <div class="erp-foot"><span class="fill" data-at="${f(o.foot)}">${W.source}</span><span class="zero fill" data-at="${f(o.foot)}">${W.zero}</span></div>
            <div class="stamp" data-at="${f(o.done)}">${check}${W.stamp}</div>
          </div>`;
  const U = L.sum, lines = ORDERS.reduce((n, o) => n + o.rows.length, 0);
  const sumRows = ORDERS.map((o, k) => `<tr class="r" data-at="${f(SUM + 0.4 + k * 0.2)}"><td class="c-k">${o.no}</td><td>${o.cust}</td><td class="c-src">${o.ch}</td><td class="c-q">${o.rows.length}</td></tr>`).join('');
  const summary = `          <div class="erp lv2 sum" data-at="${f(SUM)}">
            <div class="erp-bar"><span>${U.title}</span><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span></div>
            <div class="erp-fields">
              <div class="erp-f"><span class="lb">${U.date}</span><div>${dates.replace('%', f(SUM + 0.2))}</div></div>
              <div class="erp-f"><span class="lb">${U.total}</span><div><span class="fill" data-at="${f(SUM + 0.2)}">${U.totalVal(ORDERS.length, lines)}</span></div></div>
            </div>
            <div class="erp-tw"><table class="erp-tbl">
              <thead><tr><th class="c-k">${U.cols[0]}</th><th>${U.cols[1]}</th><th class="c-src">${U.cols[2]}</th><th class="c-q">${U.cols[3]}</th></tr></thead>
              <tbody>${sumRows}</tbody>
            </table></div>
            <div class="erp-foot"><span class="fill" data-at="${f(SUM + 1.3)}">${W.source}</span><span class="zero fill" data-at="${f(SUM + 1.3)}">${W.zero}</span></div>
            <div class="stamp" data-at="${f(SUM + 1.7)}">${check}${U.stamp(ORDERS.length)}</div>
          </div>`;

  const html = `    <div class="ba2" id="baScene" role="group" aria-label="${L.group}">
      <figure class="ba-p b4">
        <figcaption class="ba-label"><span><i class="ba-dot amber" aria-hidden="true"></i>${L.before}</span><small>${L.beforeSmall}</small></figcaption>
        <div class="inbox">
${ORDERS.map(card).join('\n')}
        </div>
        <i class="hl" data-at="1.3" data-off="${f(T0 - 0.1)}" aria-hidden="true"></i><p class="ba-pain" data-at="1.3"><span class="kb"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/></svg></span><span class="sr-only">${L.pain}</span><span class="typed-wrap" aria-hidden="true">${rounds.map((r, i) => typedCopy(L.pain, r, r + TYPE_LEN, i ? r - 0.05 : 1.3, rounds[i + 1] != null ? rounds[i + 1] - 0.05 : null)).join('')}</span></p>
      </figure>

      <div class="seam" aria-hidden="true"><span class="seam-b">${ORDERS.map(o => `<i class="think" data-at="${f(o.think[0])}" data-off="${f(o.think[1])}"></i>`).join('')}<img src="${logo}" alt="" width="34" height="21"></span></div>

      <figure class="ba-p af">
${ORDERS.map(o => `        <span class="sweep" data-at="${f(o.win[0])}" data-off="${f(o.win[0] + 1.3)}" aria-hidden="true"></span>`).join('\n')}
        <figcaption class="ba-label"><span><i class="ba-dot green" aria-hidden="true"></i>${L.after}</span><small>${L.afterSmall}</small></figcaption>
        <div class="erp-stage">
${summary}
${ORDERS.map(win).join('\n')}
          <div class="proc-wrap" aria-hidden="true">
${ORDERS.map(proc).join('\n')}
          </div>
        </div>
      </figure>
    </div>
`;
  return { html, end: END, t0: T0 };
}

// Replaces the scene block and its Scene(...) call in a page's HTML.
function inject(page, lang, opts) {
  const { html, end, t0 } = render(lang, opts);
  const a = page.indexOf('    <div class="ba2" id="baScene"'), b = page.indexOf('    <div class="st-row">');
  if (a < 0 || b < 0 || b < a) throw new Error('scene markers not found');
  page = page.slice(0, a) + html + page.slice(b);
  const callRe = /scenes\.push\(Scene\(ba,\{B:\[0,[\d.]+\],PH:\[\['ph-[a-z]+',[\d.]+\]\],thr:0\.5,loop:[\d.]+,btn:'baPlay'\}\)\);/;
  if (!callRe.test(page)) throw new Error('scene call not found');
  return page.replace(callRe, `scenes.push(Scene(ba,{B:[0,${end}],PH:[['ph-proc',${t0}]],thr:0.5,loop:4,btn:'baPlay'}));`);
}

module.exports = { render, inject };

if (require.main === module) {
  const file = path.join(__dirname, '..', 'index.html');
  fs.writeFileSync(file, inject(fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n'), 'he'));   // git may check files out with CRLF
  console.log('index.html: scene regenerated (he)');
}
