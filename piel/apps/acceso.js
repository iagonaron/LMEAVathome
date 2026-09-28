/* =====================================================================
   LM at home · PIEL · ACCESO RÍTMICO (GE) — SOLO aspecto
   26-sep-2026 · 2.ª vuelta 27-sep-2026 · 3.ª vuelta 27-sep-2026 (tarde/noche, Iago)
   Copia de antes: acceso.js.bak-27sep-v2.
   No toca datos, eventos ni lógica: solo mueve textos al pie y pinta iconos.
   1) «by Iago González Alonso» y «Optimizado para ordenador y tablet» bajan
      al pie común, abajo del todo y en el centro (LMPiel.alPie). La fila de
      arriba, vacía, se cierra (clase .lm-vacio).
   2) (3.ª vuelta) El rótulo GRADO ELEMENTAL lo pone el núcleo en su banda fija
      de arriba; aquí ya no se alinea con nada (acceso.css baja la cabecera).
   3) Botones:
      · DADO (3.ª vuelta): SOLO el dado, sin palabra. El dado que dibuja la app
        se queda dentro, oculto (.lm-ico-orig); el botón lleva title y
        aria-label «Nuevo ejercicio». La etiqueta suelta «Nuevo ejercicio» se
        queda, oculta por CSS. Pasa a ser el último de su fila y «Ayuda
        rítmica» se pone antes de «Tocar» (ordenarFila: se mueven los mismos
        nodos dentro de la fila, sin tocar sus eventos).
      · Tocar/Parar: «[▶] Tocar» / «[❚❚] Parar» (el SVG de la app se queda
        oculto; el texto nuevo lleva aria-hidden, así que el nombre accesible
        sigue siendo el title de la app).
      · Los signos ← ✎ ✗ ✕ al principio de un botón pasan a icono plano (el
        signo se queda en el texto, oculto en span.pl-emo, como hace el núcleo
        con los emojis) y algunos botones sin icono reciben el suyo delante del
        texto (Exportar, Copiar, Cerrar, Cancelar, Sí, reproducir el ritmo).
   4) 🛟 del título «Ayuda rítmica» → icono plano (blanco, por CSS).
   Para quitarlo: vaciar este fichero (acceso.css sigue funcionando solo).
   ===================================================================== */
(function () {
  'use strict';
  var H = document.documentElement;
  if (!H.classList.contains('lm-fam-acceso') || window.__lmPielAcceso) return;
  window.__lmPielAcceso = true;
  var LP = window.LMPiel || {};
  function icoNodo(n, extra) { if (!LP.ico) return null; var t = document.createElement('span'); t.innerHTML = LP.ico(n, extra || ''); return t.firstChild; }

  /* ---------- 🛟 del título de la ventana «Ayuda rítmica» ---------- */
  function iconoAyuda() {
    var t = document.querySelector('#rhythmModal .modal-t');
    if (!t || t.querySelector('svg.pl-i')) return;
    var n = t.firstChild;
    if (!n || n.nodeType !== 3) return;
    var m = /^(\s*)(\u{1F6DF}️?)(\s*)/u.exec(n.nodeValue);
    if (!m) return;
    var sp = document.createElement('span'); sp.className = 'pl-emo'; sp.textContent = m[1] + m[2];
    var svg = icoNodo('help'); if (!svg) return;
    t.insertBefore(svg, n); t.insertBefore(sp, n);
    n.nodeValue = (m[3] ? ' ' : '') + n.nodeValue.slice(m[0].length);
  }

  /* ---------- Tocar/Parar: icono plano + palabra (idempotente) ---------- */
  function vestir(btn, ico, palabra) {
    if (!btn || !LP.ico) return;
    var yaIco = btn.querySelector(':scope > svg.lm-ico-nuevo'), yaTxt = btn.querySelector(':scope > .lm-txt');
    if (yaIco && yaTxt && yaIco.getAttribute('data-ico') === ico && yaTxt.textContent === palabra &&
        !btn.querySelector(':scope > svg:not(.lm-ico-nuevo):not(.lm-ico-orig)')) return;
    if (yaIco) yaIco.remove();
    if (yaTxt) yaTxt.remove();
    Array.prototype.forEach.call(btn.querySelectorAll(':scope > svg:not(.lm-ico-nuevo)'), function (s) { s.classList.add('lm-ico-orig'); });
    var svg = icoNodo(ico); if (!svg) return;
    svg.classList.add('lm-ico-nuevo'); svg.setAttribute('data-ico', ico);
    var txt = document.createElement('span'); txt.className = 'lm-txt'; txt.setAttribute('aria-hidden', 'true'); txt.textContent = palabra;
    btn.insertBefore(txt, btn.firstChild);
    btn.insertBefore(svg, txt);
    btn.classList.add('lm-btn-vestido');
  }
  function vestirTocar() {
    var b = document.getElementById('startBtn'); if (!b) return;
    var orig = b.querySelector(':scope > svg:not(.lm-ico-nuevo)');
    var parar = !!(orig && orig.querySelector('rect'));  /* la app pone el icono de pausa mientras suena */
    vestir(b, parar ? 'pause' : 'play', parar ? 'Parar' : 'Tocar');
  }

  /* ---------- DADO: solo el dado (idempotente) ---------- */
  function vestirDado() {
    var z = document.getElementById('genzone'); if (!z) return;
    var b = z.querySelector('.dice-btn'); if (!b || !LP.ico) return;
    if (b.classList.contains('lm-dado') && b.querySelector(':scope > svg.lm-dado-ico')) return;
    var lab = z.querySelector('.dice-label');
    var nombre = String(b.getAttribute('title') || (lab && lab.textContent) || 'Nuevo ejercicio').replace(/\s+/g, ' ').trim();
    if (!b.getAttribute('aria-label')) b.setAttribute('aria-label', nombre);
    if (!b.getAttribute('title')) b.setAttribute('title', nombre);
    Array.prototype.forEach.call(b.querySelectorAll(':scope > svg:not(.lm-dado-ico)'), function (s) { s.classList.add('lm-ico-orig'); });
    var svg = icoNodo('dice', 'lm-dado-ico'); if (!svg) return;
    b.insertBefore(svg, b.firstChild);
    b.classList.add('lm-dado');
  }

  /* ---------- fila de la cabecera (3.ª vuelta): − tempo + · Ayuda rítmica · Tocar · DADO ----------
     El dado, siempre el último (arriba a la derecha de la partitura) y los dos botones de color juntos, como en
     Desafío. Se mueven los MISMOS nodos dentro de su fila (sus onclick/onchange siguen dentro), así el orden del
     tabulador coincide con lo que se ve. (acceso.css pone el mismo orden con «order», por si esto no corriera.) */
  function ordenarFila() {
    var t = document.getElementById('transport'); if (!t) return;
    var ay = t.querySelector(':scope > .rhythm-toggle'), sb = document.getElementById('startBtn'), gz = document.getElementById('genzone');
    if (ay && sb && sb.parentNode === t && ay.nextElementSibling !== sb) t.insertBefore(ay, sb);
    if (gz && gz.parentNode === t && t.lastElementChild !== gz) t.appendChild(gz);
  }

  /* icono plano delante del texto de un botón que no traía ninguno */
  function conIcono(sel, ico) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (b) {
      if (b.querySelector(':scope > svg.pl-i')) return;
      var svg = icoNodo(ico); if (!svg) return;
      svg.classList.add('lm-ico-nuevo'); b.insertBefore(svg, b.firstChild); b.classList.add('lm-con-icono');
    });
  }

  /* ---------- signos al principio de un botón → icono plano (el signo se queda, oculto) ---------- */
  var SIGNO = { '←': 'arrowleft', '✎': 'pen', '✗': 'x', '✕': 'x' };
  var RE_SIG = /^(\s*)([←✎✗✕])(️?)(\s*)/;
  function convertir(tn) {
    var t = tn.nodeValue; if (!t || t.length > 120) return;
    var m = RE_SIG.exec(t); if (!m) return;
    var par = tn.parentNode; if (!par || par.nodeType !== 1 || !par.closest) return;
    if (par.closest('svg,.pl-emo,.no-plano,[contenteditable="true"]')) return;
    var btn = par.closest('button'); if (!btn || btn.firstChild !== tn) return;   /* solo si es lo primero del botón */
    var svg = icoNodo(SIGNO[m[2]]); if (!svg) return;
    var sp = document.createElement('span'); sp.className = 'pl-emo'; sp.textContent = m[1] + m[2] + m[3];
    par.insertBefore(svg, tn); par.insertBefore(sp, tn);
    tn.nodeValue = (m[4] ? ' ' : '') + t.slice(m[0].length);
    btn.classList.add('lm-con-icono');
  }
  function barrerSignos(raiz) {
    if (!raiz) return;
    if (raiz.nodeType === 3) { convertir(raiz); return; }
    if (raiz.nodeType !== 1 || /^(SCRIPT|STYLE|svg|SVG|TEXTAREA|INPUT)$/.test(raiz.nodeName)) return;
    var w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, null), l = [], x;
    while ((x = w.nextNode())) { if (RE_SIG.test(x.nodeValue)) l.push(x); }
    l.forEach(convertir);
  }

  /* ---------- pie: autoría y «optimizado…» abajo del todo ---------- */
  function pie() {
    if (!LP.alPie) return;
    LP.alPie(['.topinfo-by', '.topinfo-opt']);
    var ti = document.querySelector('.topinfo'); if (ti && !ti.querySelector('.topinfo-by, .topinfo-opt')) ti.classList.add('lm-vacio');
  }

  try { iconoAyuda(); } catch (e) {}
  try { pie(); } catch (e) {}
  try { ordenarFila(); } catch (e) {}
  try { vestirDado(); vestirTocar(); } catch (e) {}
  try {
    var sb = document.getElementById('startBtn');
    if (sb) new MutationObserver(function () { try { vestirTocar(); } catch (e) {} }).observe(sb, { childList: true });
    var gz = document.getElementById('genzone');
    if (gz) new MutationObserver(function () { try { vestirDado(); } catch (e) {} }).observe(gz, { childList: true });
  } catch (e) {}
  try {
    conIcono('.bar > button:not(.ghost)', 'download');           /* Exportar selección */
    conIcono('#out .row > button:not(.ghost)', 'clipboard');     /* Copiar */
    conIcono('#out .row > button.ghost', 'x');                   /* Cerrar */
    conIcono('#rhythmModal .modal-row > button.ghost', 'x');     /* Cancelar */
    conIcono('#rhythmModal .modal-row > button.primary', 'play'); /* Sí, reproducir el ritmo */
  } catch (e) {}
  try { barrerSignos(document.body); } catch (e) {}
  try {
    /* el catálogo se rehace entero a cada cambio: se vuelven a pintar sus signos */
    new MutationObserver(function (ms) {
      ms.forEach(function (m) { Array.prototype.forEach.call(m.addedNodes, function (nd) { try { barrerSignos(nd); } catch (e) {} }); });
    }).observe(document.body, { childList: true, subtree: true });
  } catch (e) {}
})();
