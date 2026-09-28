/* =====================================================================
   LM at home · piel · DICTADO (GE y GP) — comportamientos SOLO visuales.
   26-sep-2026: iconos planos que el núcleo no conoce (🎬 cámara · 🗂 carpeta · 💾 disquete).
   27-sep-2026 (segunda vuelta): «by Iago González Alonso» y «Optimizado para ordenador y tablet»
     → al pie (LMPiel.alPie); la fila vacía de arriba se oculta. Iconos planos en Revelar / Pistas /
     Solución / Comprobar… y en ← ✕ ⛶ ↺.
   27-sep-2026 (tarde, TERCERA vuelta · copia de antes: dictado.js.bak-27sep-v2):
     · «Nuevo dictado» (cabecera), el cartel grande del papel vacío y «🎲 Generar nuevo» del editor
       → SOLO el dado (clase .lm-dado; dictado.css lo pinta como un cuadrado 40×40 naranja, el último
       de su fila). El texto y el icono originales se quedan dentro, ocultos, y en title/aria-label.
     · El rótulo de grado ya no se alinea con nada (va en la banda fija del núcleo).
   Nada de datos, eventos ni lógica.
   Para quitarlo: vaciar este fichero (dictado.css sigue funcionando solo).
   ===================================================================== */
(function () {
  'use strict';
  var L = window.LMPiel; if (!L || !L.P || !L.ico) return;
  if (window.__lmPielDictado) return; window.__lmPielDictado = true;
  var H = document.documentElement;

  /* ---------- iconos que faltan en el núcleo (mismo trazo) ---------- */
  var NUEVOS = {
    video: '<rect x="2.5" y="6" width="13" height="12" rx="2"/><path d="M15.5 10.5 21.5 7v10l-6-3.5z"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    save: '<path d="M5 3h11l3 3v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M7 3v5h8V3"/><rect x="7" y="13" width="10" height="6" rx="1"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'
  };
  for (var k in NUEVOS) { if (!L.P[k]) L.P[k] = NUEVOS[k]; }
  function svg(nombre, clase) {
    var t = document.createElement('span'); t.innerHTML = L.ico(nombre);
    var s = t.firstChild; if (s && clase) s.classList.add(clase);
    return s;
  }

  /* =====================================================================
     1. emojis y signos al principio de un texto → icono plano
        (el signo se queda en el texto, oculto en span.pl-emo)
     ===================================================================== */
  var EMO = { '🎬': 'video', '🗂': 'folder', '💾': 'save' };                 /* en cualquier texto */
  var SIG = { '←': 'arrowleft', '✕': 'x', '⛶': 'expand', '↺': 'refresh' };   /* solo en botones y enlaces */
  var RE = new RegExp('^(\\s*)(' + Object.keys(EMO).concat(Object.keys(SIG)).join('|') + ')(\\uFE0F)?(\\s*)');
  var NO = { INPUT: 1, TEXTAREA: 1, SELECT: 1, OPTION: 1, SCRIPT: 1, STYLE: 1, NOSCRIPT: 1 };
  function convierte(n) {
    var t = n.nodeValue; if (!t || t.length > 300) return;
    var m = RE.exec(t); if (!m) return;
    var par = n.parentNode; if (!par || par.nodeType !== 1 || NO[par.nodeName] || !par.closest) return;
    if (par.closest('.pl-emo,svg,[contenteditable="true"],.lm-sin-iconos')) return;
    var nombre = EMO[m[2]];
    if (!nombre) {
      var b = par.closest('button,a,[role="button"]'); if (!b) return;
      /* ✕, ⛶ y ↺ solo en botones que no dicen nada más (cerrar / pantalla completa / otra vez) */
      if ((m[2] === '✕' || m[2] === '⛶' || m[2] === '↺') && /\S/.test(t.slice(m[0].length))) return;
      nombre = SIG[m[2]];
    }
    var ic = svg(nombre); if (!ic) return;
    var sp = document.createElement('span'); sp.className = 'pl-emo'; sp.textContent = m[1] + m[2] + (m[3] || '');
    par.insertBefore(ic, n); par.insertBefore(sp, n);
    n.nodeValue = (m[4] ? ' ' : '') + t.slice(m[0].length);
  }
  function barre(raiz) {
    if (!raiz || H.classList.contains('lm-sin-piel')) return;
    if (raiz.nodeType === 3) { convierte(raiz); return; }
    if (raiz.nodeType !== 1 || NO[raiz.nodeName]) return;
    var w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, null), l = [], x;
    while ((x = w.nextNode())) { if (RE.test(x.nodeValue)) l.push(x); }
    l.forEach(convierte);
  }

  /* =====================================================================
     2. BOTONES
     ===================================================================== */
  /* «Nuevo dictado» / «NUEVO DICTADO» / «🎲 Generar nuevo» → SOLO el dado.
     El icono y el texto originales se quedan dentro del botón, ocultos (dictado.css). */
  var DADO = '.lm-actions .btn-dado[onclick*="newDictado"], .empty-cta-btn, #editBar button[onclick*="rollNew"]';
  function hazDado(btn) {
    if (!btn || btn.hasAttribute('data-lm-dado')) return;
    var orig = (btn.getAttribute('title') || btn.textContent || '').replace(/\s+/g, ' ').trim();
    if (/^nuevo dictado$/i.test(orig) || !orig) orig = 'Nuevo dictado';
    btn.setAttribute('data-lm-dado', '1');
    btn.classList.add('lm-dado');
    if (!btn.hasAttribute('aria-label')) btn.setAttribute('aria-label', orig);
    if (!btn.hasAttribute('title')) btn.setAttribute('title', orig);
    var dado = null;
    Array.prototype.slice.call(btn.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        if (/\S/.test(n.nodeValue)) { var w = document.createElement('span'); w.className = 'lm-txt-orig'; btn.insertBefore(w, n); w.appendChild(n); }
      } else if (n.nodeType === 1) {
        if (n.nodeName.toLowerCase() === 'svg') {
          if (n.classList.contains('pl-i') && !dado) { dado = n; n.classList.add('lm-ico-dice'); }   /* 🎲 que ya pintó el núcleo */
          else n.classList.add('lm-ico-orig');
        } else if (!n.classList.contains('pl-emo')) n.classList.add('lm-txt-orig');
      }
    });
    if (!dado) { dado = svg('dice', 'lm-ico-dice'); if (dado) btn.insertBefore(dado, btn.firstChild); }
  }
  /* icono plano delante del texto (los textos no se tocan) */
  var ICONOS = [
    ['#btnRevKey', 'eye'], ['#btnRevTs', 'eye'], ['#btnPistaRit', 'drum'], ['#btnPistaMel', 'note'],
    ['.action-card.solu', 'check'],
    /* ventanas del alumno: revelar tonalidad / compás, resultado y solución */
    ['#keyModalRow .ghost, #tsModalRow .ghost', 'x'],
    ['#keyModalRow .primary, #tsModalRow .primary, #keyAcceptRow .primary, #tsAcceptRow .primary, #quizResultModal .modal-row .primary', 'check'],
    ['#solModal .modal-row .ghost', 'arrowleft'], ['#solModal .modal-row .primary', 'eye']
  ];
  function iconoDelante(btn, nombre) {
    if (!btn || btn.hasAttribute('data-lm-ico')) return;
    var s = svg(nombre, 'lm-ico-accion'); if (!s) return;
    btn.setAttribute('data-lm-ico', nombre);
    btn.classList.add('lm-con-icono');
    btn.insertBefore(s, btn.firstChild);
  }
  function botones() {
    Array.prototype.forEach.call(document.querySelectorAll(DADO), hazDado);
    ICONOS.forEach(function (p) { Array.prototype.forEach.call(document.querySelectorAll(p[0]), function (b) { iconoDelante(b, p[1]); }); });
  }

  /* =====================================================================
     3. créditos al pie
     ===================================================================== */
  function pie() {
    if (L.alPie && !pie.hecho) { pie.hecho = true; L.alPie(['.topinfo > .topinfo-by', '.topinfo > .topinfo-opt']); }
    var ti = document.querySelector('body > .topinfo');
    if (ti && !ti.classList.contains('lm-vacio') && !ti.querySelector('.topinfo-by, .topinfo-opt')) ti.classList.add('lm-vacio');
  }

  /* ---------- repaso (idempotente) tras cada cambio de la página ---------- */
  var pend = false;
  function repasa() {
    if (pend) return; pend = true;
    (window.requestAnimationFrame || setTimeout)(function () {
      pend = false;
      try { botones(); } catch (e) {}
      try { pie(); } catch (e) {}
    });
  }
  function arranca() {
    try { barre(document.body); } catch (e) {}
    try { botones(); } catch (e) {}
    try { pie(); } catch (e) {}
    try {
      new MutationObserver(function (ms) {
        ms.forEach(function (m) {
          if (m.type === 'characterData') { convierte(m.target); return; }
          Array.prototype.forEach.call(m.addedNodes, function (nd) { try { barre(nd); } catch (e) {} });
        });
        repasa();
      }).observe(document.body, { childList: true, subtree: true, characterData: true });
    } catch (e) {}
  }
  if (document.body) arranca(); else document.addEventListener('DOMContentLoaded', arranca);
})();
