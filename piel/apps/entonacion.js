/* =====================================================================
   LM at home · piel · ENTONACIÓN at home — comportamientos SOLO visuales.
   No toca datos, eventos ni lógica: solo pinta. (26-sep-2026 · 27-sep-2026, Iago)
   1) Iconos planos (como los del Diario) al principio de los botones cuyo texto
      empieza por un signo que el núcleo no conoce: ♪ Tónica/Escala · 🩷 Pistas ·
      ✕ Salir/Cerrar · ⓘ ¿Cómo funciona? · ✎ Edición · ⚙ · ↶ · ↻ · ⟳ · ← · ＋.
      El signo se queda en el texto (oculto en span.pl-emo): el textContent no cambia.
   2) «Nueva lección» / «Nuevo ejercicio» / el dado del editor → SOLO el dado
      (3ª vuelta, Iago: «que simplemente sea un dado, siempre en el mismo sitio»;
      el sitio lo fija entonacion.css con flex order dentro de su misma fila).
      El contenido original se queda dentro del botón, oculto (span.lm-en-orig),
      y el texto original pasa a su aria-label y a su title.
   3) Icono plano en los botones que no traen signo: resultado (Volver a estudiar ·
      Intentar de nuevo · Salir) y «Activar micrófono» del afinador. El «Salir» del
      resultado se marca (lm-en-salir) para pintarlo solo con contorno.
   4) «by Iago González Alonso» y «Optimizado para ordenador y tablet» → pie común
      abajo del todo (LMPiel.alPie). El rótulo de grado va en la banda fija de
      arriba del núcleo (ya no se alinea con nada desde aquí).
   Para quitarlo: vaciar este fichero (entonacion.css sigue funcionando solo).
   ===================================================================== */
(function () {
  'use strict';
  var H = document.documentElement;
  var L = window.LMPiel;
  if (!L || !L.P || !L.ico || !H.classList.contains('lm-fam-entonacion') || window.__lmPielEnton) return;
  window.__lmPielEnton = true;

  /* ---------- iconos que el núcleo no trae (mismo trazo) ---------- */
  var NUEVOS = {
    shuffle: '<path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    corchea: '<ellipse cx="8.5" cy="17.5" rx="3.5" ry="2.8"/><path d="M12 17V4c0 3 5.5 3.6 5.5 8.5"/>',
    gear: '<circle cx="12" cy="12" r="2.6"/><circle cx="12" cy="12" r="6.4"/><path d="M12 2.6v3M12 18.4v3M3.9 7.3l2.6 1.5M17.5 15.2l2.6 1.5M3.9 16.7l2.6-1.5M17.5 8.8l2.6-1.5"/>',
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>'
  };
  for (var k in NUEVOS) { if (!L.P[k]) L.P[k] = NUEVOS[k]; }
  function svgDe(nombre, extra) {
    var t = document.createElement('span'); t.innerHTML = L.ico(nombre, extra);
    return t.firstChild;
  }

  /* =====================================================================
     1. SIGNO AL PRINCIPIO DEL TEXTO DE UN BOTÓN → ICONO PLANO
     ===================================================================== */
  var SIGNO = { '🔀': 'shuffle', '🩷': 'heart', '♪': 'corchea', '✕': 'x', '✖': 'x', '×': 'x', 'ⓘ': 'help', '✎': 'pen',
                '⚙': 'gear', '↶': 'undo', '↺': 'undo', '↻': 'refresh', '⟳': 'refresh', '←': 'arrowleft', '＋': 'plus' };
  var RE = new RegExp('^(\\s*)(' + Object.keys(SIGNO).join('|') + ')(\\uFE0F)?(\\s*)');
  var NO = { INPUT: 1, TEXTAREA: 1, SELECT: 1, OPTION: 1, SCRIPT: 1, STYLE: 1, NOSCRIPT: 1 };
  var FUERA = '.pl-emo,svg,[contenteditable="true"],.lm-sin-iconos,.lm-en-orig,.gg-menu';
  function esPrimerTexto(btn, tn) {
    var w = document.createTreeWalker(btn, NodeFilter.SHOW_TEXT, null), x;
    while ((x = w.nextNode())) {
      if (x.parentNode && x.parentNode.closest && x.parentNode.closest('.pl-emo,svg')) continue;
      if (/\S/.test(x.nodeValue)) return x === tn;
    }
    return false;
  }
  function convierte(n) {
    var t = n.nodeValue; if (!t || t.length > 200) return;
    var m = RE.exec(t); if (!m) return;
    var par = n.parentNode; if (!par || par.nodeType !== 1 || NO[par.nodeName] || !par.closest) return;
    if (par.closest(FUERA)) return;
    var btn = par.closest('button'); if (!btn || !esPrimerTexto(btn, n)) return;
    var svg = svgDe(SIGNO[m[2]]); if (!svg) return;
    var sp = document.createElement('span'); sp.className = 'pl-emo'; sp.textContent = m[1] + m[2] + (m[3] || '');
    par.insertBefore(svg, n); par.insertBefore(sp, n);
    n.nodeValue = (m[4] ? ' ' : '') + t.slice(m[0].length);
  }

  /* =====================================================================
     2. «NUEVO» CON DADO (en vez de «Nueva lección» / «Nuevo ejercicio»)
     ===================================================================== */
  function textoVisible(b) {
    var s = '', w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT, null), x;
    while ((x = w.nextNode())) { if (!(x.parentNode && x.parentNode.closest && x.parentNode.closest('.pl-emo,svg'))) s += x.nodeValue; }
    return s.replace(/[\uD800-\uDFFF]|[←-⯿]|️/g, '').replace(/\s+/g, ' ').trim();
  }
  function esNuevo(b) {
    if (b.id === 'phNewLesson' || b.id === 'genBtn') return true;
    return !!(b.parentNode && b.parentNode.classList && b.parentNode.classList.contains('result-actions') && /^Nuevo ejercicio$/i.test(textoVisible(b)));
  }
  function nuevo(b) {
    if (b.querySelector(':scope > svg.lm-en-dado')) return;
    var orig = textoVisible(b) || b.getAttribute('title') || '';
    var envol = document.createElement('span'); envol.className = 'lm-en-orig';
    while (b.firstChild) envol.appendChild(b.firstChild);
    var dado = svgDe('dice', 'lm-en-dado');
    b.appendChild(dado); b.appendChild(envol);
    if (!b.getAttribute('aria-label') && orig) b.setAttribute('aria-label', orig);
    if (!b.getAttribute('title') && orig) b.setAttribute('title', orig);
    b.classList.add('lm-en-nuevo');
    if (b.id === 'genBtn' && b.parentNode && b.parentNode.classList) b.parentNode.classList.add('lm-en-gen');
  }

  /* =====================================================================
     3. ICONO EN BOTONES SIN SIGNO
     ===================================================================== */
  function iconoPara(b) {
    if (b.id === 'tunerMic') return 'mic';
    if (b.parentNode && b.parentNode.classList && b.parentNode.classList.contains('result-actions')) {
      var t = textoVisible(b);
      if (/^Volver a estudiar/i.test(t)) return 'book';
      if (/^Intentar de nuevo/i.test(t)) return 'refresh';
      if (/^Salir$/i.test(t)) { b.classList.add('lm-en-salir'); return 'x'; }
    }
    return null;
  }
  function conIcono(b) {
    var nombre = iconoPara(b); if (!nombre) return;
    var prim = b.firstElementChild;
    if (prim && prim.classList && prim.classList.contains('lm-en-ico') && b.firstChild === prim) return;
    var svg = svgDe(nombre, 'lm-en-ico'); if (!svg) return;
    b.insertBefore(svg, b.firstChild);
  }

  /* =====================================================================
     4. RECORRIDO + VIGILANCIA (lo que la app pinte después)
     ===================================================================== */
  function boton(b) {
    if (!b || b.nodeType !== 1 || b.nodeName !== 'BUTTON') return;
    try { if (esNuevo(b)) { nuevo(b); return; } } catch (e) {}
    try { conIcono(b); } catch (e) {}
  }
  function barre(raiz) {
    if (!raiz || H.classList.contains('lm-sin-piel')) return;
    if (raiz.nodeType === 3) { convierte(raiz); if (raiz.parentNode && raiz.parentNode.closest) boton(raiz.parentNode.closest('button')); return; }
    if (raiz.nodeType !== 1 || NO[raiz.nodeName]) return;
    var w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, null), l = [], x;
    while ((x = w.nextNode())) { if (RE.test(x.nodeValue)) l.push(x); }
    l.forEach(convierte);
    if (raiz.nodeName === 'BUTTON') boton(raiz);
    else if (raiz.closest && raiz.closest('button')) boton(raiz.closest('button'));
    Array.prototype.forEach.call(raiz.querySelectorAll ? raiz.querySelectorAll('button') : [], boton);
  }
  function arranca() {
    barre(document.body);
    /* pie común (núcleo) */
    try { if (L.alPie) L.alPie(['.topinfo .topinfo-by', '.topinfo .topinfo-opt']); } catch (e) {}
    try {
      new MutationObserver(function (ms) {
        ms.forEach(function (m) {
          if (m.type === 'characterData') { convierte(m.target); return; }
          Array.prototype.forEach.call(m.addedNodes, function (nd) { try { barre(nd); } catch (e) {} });
          /* la app reescribe el texto de un botón (textContent) → vuelve a ponerle su icono */
          if (m.target && m.target.nodeName === 'BUTTON') { try { boton(m.target); } catch (e) {} }
        });
      }).observe(document.body, { childList: true, subtree: true, characterData: true });
    } catch (e) {}
  }
  if (document.body) arranca(); else document.addEventListener('DOMContentLoaded', arranca);
})();
