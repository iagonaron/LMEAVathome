/* =====================================================================
   LM at home · piel · PREDICT (GE y GP) — comportamientos SOLO visuales.
   26-sep-2026 · 1ª vuelta: la nota final del resumen («Nota 6,4 / 10») en VERDE
   si aprueba y en ROJO si no llega a 5 (clase lm-susp; el texto no se toca).
   27-sep-2026 · 2ª vuelta: «by Iago González Alonso» y «Versión optimizada para
   ordenador y tablet» abajo del todo (LMPiel.alPie); iconos planos en los botones.
   27-sep-2026 · 3ª vuelta (Iago):
   · el rótulo de grado va fijo en la banda de arriba del núcleo (ya no se alinea
     con nada; el enlace «Elemental →» tampoco se coloca desde aquí);
   · el dado de «nuevo ejercicio / nuevos ejercicios / nueva serie / otra serie
     de 5» y el de Modos: SOLO el dado (cuadrado naranja en predict.css). El
     dibujo y el rótulo originales quedan ocultos, no se borran; title y
     aria-label conservan el texto original;
   · iconos planos y blancos: ✓ en ¿Qué tal fue? / Corregir y seguir / Mantener,
     ojo en Solución, flecha en Deshacer y en «← volver/Modos», aspa en Cerrar,
     nota en ♪.
   Solo se añaden iconos y clases. Nunca toca datos, eventos ni lógica: el
   textContent de ¿Qué tal fue?, Solución, etc. no cambia.
   Para quitarlo: vaciar este fichero (predict.css sigue funcionando solo).
   ===================================================================== */
(function () {
  'use strict';
  var H = document.documentElement;
  if (!H.classList.contains('lm-fam-predict') || window.__lmPielPredict) return;
  window.__lmPielPredict = true;
  var LP = window.LMPiel || {};
  var SVGNS = 'http://www.w3.org/2000/svg';

  /* ---------- 1. pie (núcleo) ---------- */
  try { if (LP.alPie) LP.alPie(['.wrap > header.top > .tagline', '#evaHome > .opt-banner']); } catch (e) {}

  /* ---------- 2. nota final en rojo si suspende ---------- */
  function pinta(el) {
    try {
      var t = (el.firstChild && el.firstChild.nodeType === 3) ? el.firstChild.nodeValue : el.textContent;
      var m = /(-?\d+(?:[.,]\d+)?)/.exec(t || '');
      if (!m) return;
      var n = parseFloat(m[1].replace(',', '.'));
      var susp = isFinite(n) && n < 5;
      if (el.classList.contains('lm-susp') !== susp) el.classList.toggle('lm-susp', susp);
    } catch (e) {}
  }

  /* ---------- 3. botones ---------- */
  var EXTRA = { undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>' };
  function ico(n) {
    if (LP.ico && LP.P && LP.P[n]) return LP.ico(n, 'lm-pd-i');
    var p = EXTRA[n] || (LP.P && LP.P[n]); if (!p) return '';
    return '<svg class="pl-i lm-pd-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }
  function nodo(html) { var t = document.createElement('span'); t.innerHTML = html; return t.firstChild; }
  function tieneIco(el) {
    for (var c = el.firstElementChild; c; c = c.nextElementSibling) { if (c.classList && c.classList.contains('lm-pd-i')) return true; }
    return false;
  }
  function ponIco(el, n) { if (!el || tieneIco(el)) return; var s = nodo(ico(n)); if (s) el.insertBefore(s, el.firstChild); }
  /* signo al principio del texto (← ↶ ♪ …) → icono plano; el signo se queda en el texto, oculto (span.pl-emo) */
  var SIGNO = { '←': 'arrowleft', '‹': 'arrowleft', '↶': 'undo', '↺': 'undo', '♪': 'note', '♫': 'note' };
  var RE_SIG = /^(\s*)([←‹↶↺♪♫])(️?)(\s*)/;
  function signo(el) {
    if (!el || tieneIco(el)) return false;
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), x = null, y;
    while ((y = w.nextNode())) {
      if (y.parentNode && y.parentNode.closest && y.parentNode.closest('.pl-emo,svg,.lm-pd-orig')) continue;
      if (/\S/.test(y.nodeValue)) { x = y; break; }
    }
    if (!x) return false;
    var m = RE_SIG.exec(x.nodeValue); if (!m) return false;
    var s = nodo(ico(SIGNO[m[2]])); if (!s) return false;
    var sp = document.createElement('span'); sp.className = 'pl-emo'; sp.textContent = m[1] + m[2] + m[3];
    x.parentNode.insertBefore(s, x); x.parentNode.insertBefore(sp, x);
    x.nodeValue = (m[4] ? ' ' : '') + x.nodeValue.slice(m[0].length);
    return true;
  }
  /* el dado: solo el dado; lo original (dibujo, rótulo o texto) se queda oculto */
  function nombreDe(b, extra) {
    return String(b.getAttribute('aria-label') || b.getAttribute('title') || (extra || '') || b.textContent || 'Nuevo').replace(/\s+/g, ' ').trim();
  }
  function dado(b) {
    if (b.classList.contains('lm-pd-dado')) return;
    var gen = b.parentNode, lab = (gen && gen.classList && gen.classList.contains('gen')) ? gen.querySelector('.dice-label') : null;
    var nombre = nombreDe(b, lab ? lab.textContent : '');
    b.setAttribute('aria-label', nombre);
    if (!b.getAttribute('title')) b.setAttribute('title', nombre);
    /* lo que ya tenía el botón: si es texto suelto se envuelve (mismo texto), y se oculta */
    Array.prototype.slice.call(b.childNodes).forEach(function (h) {
      if (h.nodeType === 1) { h.classList.add('lm-pd-orig'); return; }
      if (h.nodeType === 3 && /\S/.test(h.nodeValue)) { var env = document.createElement('span'); env.className = 'lm-pd-orig'; b.insertBefore(env, h); env.appendChild(h); }
    });
    var s = nodo(ico('dice')); if (s) b.insertBefore(s, b.firstChild);
    b.classList.add('lm-pd-dado');
    if (lab) lab.classList.add('lm-pd-orig');
  }
  var SEL = '.gen .dice-btn, #modosView .dado, .drill-restart, .check-link, .drill-fwd, .cadx-msg .btn-correct, .btn-sol, ' +
            '.gn-undo, .btn-undo, .btn-back, .lvl-back, .arm-subback, .road-close, #modosView .btn-play, .to-elemental';
  function vestir(el) {
    if (el.matches('.gen .dice-btn, #modosView .dado, .drill-restart')) dado(el);
    else if (el.matches('.check-link, .drill-fwd, .cadx-msg .btn-correct')) ponIco(el, 'check');
    else if (el.matches('.btn-sol')) ponIco(el, 'eye');
    else if (el.matches('.gn-undo, .btn-undo')) { if (!signo(el)) ponIco(el, 'undo'); }
    else if (el.matches('.road-close')) ponIco(el, 'x');
    else signo(el);                                   /* ← volver · ← Modos · ♪ Sonando… · ♪ Elemental */
  }
  function repaso() {
    var l = document.querySelectorAll(SEL);
    for (var i = 0; i < l.length; i++) { try { vestir(l[i]); } catch (e) {} }
    var n = document.querySelectorAll('.gs-nota');
    for (var j = 0; j < n.length; j++) pinta(n[j]);
  }

  /* ---------- 4. arranque + lo que la app pinte después ---------- */
  function arranca() {
    repaso();
    try {
      new MutationObserver(function (ms) {
        for (var i = 0; i < ms.length; i++) {
          var m = ms[i];
          if (m.target.namespaceURI === SVGNS) continue;          /* dentro de una partitura */
          for (var j = 0; j < m.addedNodes.length; j++) {
            var nd = m.addedNodes[j];
            if (nd.nodeType === 3 || (nd.nodeType === 1 && nd.namespaceURI !== SVGNS)) { repaso(); return; }
          }
        }
      }).observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  }
  if (document.body) arranca(); else document.addEventListener('DOMContentLoaded', arranca);
})();
