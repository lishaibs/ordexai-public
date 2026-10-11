// Builds es/index.html from _tools/es-template.html + the home page's own CSS, demo player and a11y widget.
// es/index.html is GENERATED: edit the Spanish copy in _tools/es-template.html, then run  node _tools/build-es.js
// The player keeps the home page's engine; only its language-specific parts are swapped for Spanish.
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const home = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
let tpl = fs.readFileSync(path.join(__dirname, 'es-template.html'), 'utf8');

const between = (s, a, b) => { const i = s.indexOf(a); const j = s.indexOf(b, i + a.length); if (i < 0 || j < 0) throw new Error('marker not found: ' + a + ' / ' + b); return s.slice(i + a.length, j); };
const must = (s, from, to) => { if (!s.includes(from)) throw new Error('player marker not found: ' + from.slice(0, 60)); return s.replace(from, to); };

const css = between(home, '<style>', '</style>');
const playerStart = home.indexOf('/* ===== Hero live WhatsApp chat');
const a11yStart = home.indexOf('/* ===== Accessibility widget');
const scriptEnd = home.indexOf('</script>', a11yStart);
if (playerStart < 0 || a11yStart < 0 || scriptEnd < 0) throw new Error('script markers not found');
let player = home.slice(playerStart, a11yStart);
const a11y = home.slice(a11yStart, scriptEnd).trimEnd();

// --- Spanish-only player ---
player = must(player, "var lang = document.body.classList.contains('lang-en') ? 'en' : 'he';", "var lang = 'es';");
player = player.replace(/var UI = \{[\s\S]*?\n  \};/, "var UI = {\n    es:{ online:'en línea', typing:'escribiendo…', message:'Mensaje', sendChoice:'Enviar selección', voiceAva:'C' }\n  };");
player = player.replace(/function mkSheet\(side,time\)\{[\s\S]*?\n  \}\n/, `function mkSheet(side,time){
    var hd = 'Pedido semanal — Bar El Puerto';
    var cols = ['Código','Producto','Cant.'];
    var rows = [
      ['1042','Aceite girasol 1,5 L','6'],['1108','Harina 000 · 1 kg','10'],['2231','Servilletas · caja','4'],
      ['3390','Lavandina · bidón','3'],['4417','Bandejas descartables','8']
    ];
    var body = rows.map(function(r){ return '<tr><td>'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td class="qty"><span class="hw">'+esc(r[2])+'</span></td></tr>'; }).join('');
    var inner='<div class="sheet"><div class="sheet-hd">'+esc(hd)+'</div>'+
      '<table><tr><th>'+esc(cols[0])+'</th><th>'+esc(cols[1])+'</th><th>'+esc(cols[2])+'</th></tr>'+body+'</table></div>';
    return wrap(inner,side,time,'img');
  }
`);
player = player.replace(/  function deliveryHe\(\)[^\n]*\n  function deliveryEn\(\)[^\n]*\n/, "  function deliveryEs(){ var d=nextThursday(); return ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2); }\n");
player = player.replace(/  \/\* ---- scenes \(ported[\s\S]*?function currentScenes\(\)\{[^\n]*\n/, `  /* ---- scenes: Río de la Plata examples (illustrative names, codes and quantities) ---- */
  function esScenes(){ return [
    { name:'OrdexAI', sub:'en línea', caption:'Pedido por texto · lenguaje natural', steps:[
      {who:'out', html:mkText('¡Buen día! 🙂 Para mañana mandame:\\n4 bidones de lavandina\\n10 rollos de cocina\\ny 3 cajas de servilletas','out','08:12'), hold:1400},
      {who:'in', typing:1200, html:mkText('¡Recibido! 👍 Así entendí tu pedido:','in','08:12'), hold:800},
      {who:'in', typing:1400, html:mkList('','Tu pedido · en el orden en que lo escribiste',[
        ['Lavandina · bidón 5 L','4 u.',true],['Rollo de cocina','10 u.',true],['Servilletas · caja','3 u.',true]],'in','08:13'), hold:1800}
    ]},
    { name:'OrdexAI', sub:'en línea', caption:'Pedido por audio · se transcribe solo', steps:[
      {who:'out', html:mkVoice('0:12','out','09:41'), hold:1300},
      {who:'in', typing:1300, html:mkText('Transcripción del audio 🎧\\n«Che, sumame dos latas de tomate perita, una caja de vasos descartables y un rollo de film»','in','09:41'), hold:1200},
      {who:'in', typing:1300, html:mkList('Te lo armé así:','Tu pedido',[
        ['Tomate perita · lata','2 u.',true],['Vasos descartables · caja','1 u.',true],['Film · rollo','1 u.',true]],'in','09:42'), hold:1800}
    ]},
    { name:'OrdexAI', sub:'en línea', caption:'Pedido con foto · lee la lista', steps:[
      {who:'out', html:mkSheet('out','07:30'), hold:1500},
      {who:'in', typing:1300, html:mkText('Leí la foto 📸 Saqué 5 renglones por código:','in','07:31'), hold:900},
      {who:'in', typing:1400, html:mkList('','Desde la foto',[
        ['1042 · Aceite girasol 1,5 L','6',true],['1108 · Harina 000 · 1 kg','10',true],['2231 · Servilletas · caja','4',true],
        ['3390 · Lavandina · bidón','3',true],['4417 · Bandejas descartables','8',true]],'in','07:31'), hold:1900}
    ]},
    { name:'OrdexAI', sub:'en línea', caption:'Dudas y «de todos los tipos» · con un toque', steps:[
      {who:'out', html:mkText('Agregame aceite\\ny servilletas de todos los tipos','out','10:20'), hold:1200},
      {who:'in', typing:1200, html:mkButtons('¿Qué aceite?',['Girasol 1,5 L','Mezcla 900 ml','Saltear / otro'],'in','10:20'), hold:1400},
      {who:'in', typing:1300, html:mkList('Servilletas: marqué todas, sacá las que no necesites:','Elegí las variantes',[
        ['Servilletas 30×30','',true],['Servilletas 33×33','',true],['Servilletas tissue','',false]],'in','10:20'), hold:1500},
      {who:'sys', text:'Aprende tus preferencias · los próximos pedidos salen más rápido', hold:1000}
    ]},
    { name:'OrdexAI', sub:'en línea', caption:'Confirmación y fecha de entrega', steps:[
      {who:'in', typing:1000, html:mkList('Resumen de tu pedido:','23 unidades · 4 renglones',[
        ['Lavandina · bidón','4',true],['Rollo de cocina','10',true],['Servilletas · caja','3',true],['Tomate perita · lata','6',true]],'in','08:14'), hold:1100},
      {who:'in', typing:1000, html:mkText('📅 Entrega: jueves '+deliveryEs()+'\\n(hoy ya pasó el cierre de pedidos: quedó para tu próximo día de entrega)','in','08:14'), hold:1200},
      {who:'in', typing:900, html:mkButtons('¿Confirmamos el pedido?',['✓ Confirmar','✎ Cambiar','✕ Cancelar'],'in','08:14'), hold:1200},
      {who:'out', html:mkText('✓ Confirmo','out','08:15'), hold:800},
      {who:'in', typing:800, html:mkText('¡Listo, recibido! Nos vemos el jueves 🚚','in','08:15'), hold:2000}
    ]}
  ]; }

  function currentScenes(){ return esScenes(); }
`);
// The language toggle never re-renders this page; keep the API shape for the a11y widget.
player = player.replace("lang = (L === 'en' ? 'en' : 'he');", "lang = 'es';");

const WA = 'https://wa.me/972556654664?text=' + encodeURIComponent('¡Hola! Vi OrdexAI en la web y quiero saber cómo funciona para mi distribuidora 👋');
let out = tpl.replace('/*__CSS__*/', css).replace('/*__PLAYER__*/', player.trimEnd()).replace('/*__A11Y__*/', a11y);
out = out.split('__WA__').join(WA);

const hebrew = out.match(/[\u0590-\u05FF][^<\n]{0,40}/g);
if (hebrew) throw new Error('Hebrew text left in the Spanish page:\n  ' + [...new Set(hebrew)].slice(0, 12).join('\n  '));
for (const k of ['heScenes', 'enScenes', 'deliveryHe', 'deliveryEn', '__WA__', '/*__']) if (out.includes(k)) throw new Error('leftover: ' + k);

fs.mkdirSync(path.join(SITE, 'es'), { recursive: true });
fs.writeFileSync(path.join(SITE, 'es', 'index.html'), out);
console.log(`wrote es/index.html (${(out.length / 1024).toFixed(1)} KB), no Hebrew characters`);
