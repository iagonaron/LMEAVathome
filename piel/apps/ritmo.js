/* =====================================================================
   LM at home · PIEL · RITMO (GE y GP) — solo aspecto (26-sep-2026, Iago)
   No toca datos, eventos ni lógica de la app: solo observa qué se ve y pinta.

   1) QUIZ (fondo psicodélico): se ve EXACTAMENTE como antes.
      · Mientras hay un quiz en pantalla pone la clase lm-sin-piel en <html>:
        la piel común quita la foto y el rótulo de grado, y ritmo.css deja de
        aplicarse. Al cerrar el quiz, la clase se quita y vuelve la piel.
      · Marca las ventanas del quiz con .no-plano (la piel común no cambia
        emojis por iconos ahí dentro) y deshace el cambio si llegó a hacerse
        en el primer instante, para que el texto quede idéntico al original.
      Pantallas que cuentan como QUIZ:
        · .cardquiz-ov      → quiz por carta (sus fases en iframe: quiz_*.html),
                              también cuando llega desde la campana (?quizCarta=…)
        · .eq-ov2           → quiz 6.3 de equivalencias (fondo con manchas de color)
        · #suiteQuizBanner, #quizRetomarAviso → avisos del propio quiz
      (La INTRO por carta —la explicación, ?introCarta=…— NO es el quiz: lleva piel.)

   2) (27-sep-2026, 3ª vuelta) RÓTULO DE GRADO: lo pone el núcleo en su banda fija de arriba; aquí ya no se alinea
      con nada (ritmo.css hace que el contenido empiece por debajo de esa banda).

   3) (27-sep-2026) BOTONES como los de Teoría:
      · DADO: el de «Generar lección» y los 🎲 de la intro («Otro ejemplo», «Sorpréndeme») → cuadrado verde con
        SOLO el dado (3ª vuelta: sin la palabra «Nuevo»). El contenido original se queda en el botón, oculto con
        .lm-txt-orig / .lm-ico-orig; su texto va a title y aria-label. Ya son lo más a la derecha de su fila.
      · «Estudiar por fases» / «Prueba directa»: los iconos planos del Diario (libro, nota).
      · ← ↺ ✕ al principio de un botón → iconos planos (volver, repetir, salir); «Repetir» y
        «Volver a escuchar» de la tarjeta de precisión llevan su icono.
      Ningún onclick se toca.

   (En Ritmo no hay «by Iago González Alonso» ni «Optimizado para ordenador y tablet»:
    no hay nada que llevar al pie.)
   ===================================================================== */
(function () {
  'use strict';
  var H = document.documentElement;
  if (window.__lmPielRitmo) return;
  window.__lmPielRitmo = true;
  var LP = window.LMPiel || {};
  var QUIZ_VISIBLE = '.cardquiz-ov.show, .eq-ov2.show';
  var MARCAR = '.cardquiz-ov, .eq-ov2, #suiteQuizBanner, #quizRetomarAviso';

  /* =====================================================================
     1. QUIZ
     ===================================================================== */
  /* deshace (solo dentro del quiz) el cambio emoji → icono de la piel común:
     el emoji vuelve a su texto original y el icono desaparece */
  function deshazIconos(raiz) {
    var svgs = raiz.querySelectorAll('svg.pl-i');
    for (var i = 0; i < svgs.length; i++) {
      var sv = svgs[i], sp = sv.nextSibling, par = sv.parentNode;
      if (sp && sp.nodeType === 1 && sp.classList && sp.classList.contains('pl-emo')) {
        var t = sp.nextSibling, emo = sp.textContent;
        if (t && t.nodeType === 3) t.nodeValue = emo + t.nodeValue;
        else par.insertBefore(document.createTextNode(emo), sp);
        par.removeChild(sp);
      }
      if (sv.parentNode) sv.parentNode.removeChild(sv);
    }
  }
  function sincroniza() {
    var rs = document.querySelectorAll(MARCAR);
    for (var i = 0; i < rs.length; i++) {
      var r = rs[i];
      if (!r.classList.contains('no-plano')) r.classList.add('no-plano');
      if (r.querySelector('svg.pl-i')) deshazIconos(r);
    }
    var hay = !!document.querySelector(QUIZ_VISIBLE);
    if (H.classList.contains('lm-sin-piel') !== hay) H.classList.toggle('lm-sin-piel', hay);
  }
  sincroniza();
  try {
    new MutationObserver(sincroniza).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  } catch (e) {}

  /* =====================================================================
     2. RÓTULO DE GRADO: 3ª vuelta → nada que hacer aquí (banda fija del núcleo)
     ===================================================================== */

  /* =====================================================================
     3. BOTONES
     ===================================================================== */
  if (!LP.ico) return;
  var EXCLUIR = '.no-plano, .cardquiz-ov, .eq-ov2, svg, [contenteditable="true"]';
  function fueraDePiel(el) { return !el || !el.closest || !!el.closest(EXCLUIR); }
  function icono(nombre, extra) {
    var t = document.createElement('span'); t.innerHTML = LP.ico(nombre, extra || '');
    return t.firstChild;
  }

  /* --- 3a. signos al principio del texto de un botón → icono plano (el signo queda oculto en .pl-emo) --- */
  var SIGNO = { '←': 'arrowleft', '↺': 'refresh', '↻': 'refresh', '✕': 'x', '✖': 'x', '×': 'x' };
  var RE_SIG = /^(\s*)([←↺↻✕✖×])(️?)(\s*)/;
  var CON_SIGNO = '.course-back, .setup-backworlds, .phase-close, .intro-x, .ibtn, .gvx-btn, .tap-fb button';
  function primerTexto(btn) {
    var w = document.createTreeWalker(btn, NodeFilter.SHOW_TEXT, null), x;
    while ((x = w.nextNode())) {
      if (x.parentNode && x.parentNode.closest && x.parentNode.closest('.pl-emo, svg, .lm-txt-orig')) continue;
      if (/\S/.test(x.nodeValue)) return x;
    }
    return null;
  }
  function signo(btn) {
    if (fueraDePiel(btn)) return;
    var tn = primerTexto(btn); if (!tn) return;
    var t = tn.nodeValue, m = RE_SIG.exec(t); if (!m) return;
    var resto = t.slice(m[0].length);
    if ((m[2] === '✕' || m[2] === '✖' || m[2] === '×') && /\S/.test(resto)) return;   /* ✕ solo si el botón no dice nada más */
    var par = tn.parentNode;
    var sp = document.createElement('span'); sp.className = 'pl-emo'; sp.textContent = m[1] + m[2] + m[3];
    par.insertBefore(icono(SIGNO[m[2]]), tn); par.insertBefore(sp, tn);
    tn.nodeValue = (m[4] && /\S/.test(resto) ? ' ' : '') + resto;
  }

  /* --- 3b. iconos de la app → los del Diario (el original se queda, oculto) --- */
  var PROPIOS = [['#studyBtn', 'book'], ['#accompBtn', 'note']];
  function propio(btn, nombre) {
    if (fueraDePiel(btn) || btn.querySelector(':scope > svg.lm-ico-ritmo')) return;
    var orig = btn.querySelector(':scope > svg:not(.pl-i)');
    var n = icono(nombre, 'lm-ico-ritmo');
    if (orig) { orig.classList.add('lm-ico-orig'); btn.insertBefore(n, orig); }
    else btn.insertBefore(n, btn.firstChild);
  }
  /* botones con texto (sin signo) que llevan icono: tarjeta de precisión del ritmo aislado */
  var POR_TEXTO = { 'Repetir': 'refresh', 'Volver a escuchar': 'headphones' };
  function porTexto(btn) {
    if (fueraDePiel(btn) || btn.querySelector('svg.pl-i')) return;
    var k = (btn.textContent || '').trim(), n = POR_TEXTO[k];
    if (n) btn.insertBefore(icono(n, 'lm-ico-ritmo'), btn.firstChild);
  }

  /* --- 3c. DADO: cuadrado verde con solo el dado (3ª vuelta: sin la palabra «Nuevo») --- */
  function limpio(s) { return String(s || '').replace(/^[\s\u{1F3B2}\uFE0F]+/u, '').replace(/\s+/g, ' ').trim(); }
  function dado(btn) {
    if (fueraDePiel(btn)) return;
    if (btn.classList.contains('lm-dado') && btn.querySelector(':scope > .lm-dado-ico')) return;
    var orig = limpio(btn.getAttribute('title') || btn.textContent);
    if (orig) {
      if (!btn.getAttribute('aria-label')) btn.setAttribute('aria-label', orig);
      if (!btn.getAttribute('title')) btn.setAttribute('title', orig);
    }
    /* todo lo que había dentro se queda, oculto */
    Array.prototype.slice.call(btn.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        if (!/\S/.test(n.nodeValue)) return;
        var sp = document.createElement('span'); sp.className = 'lm-txt-orig';
        btn.insertBefore(sp, n); sp.appendChild(n);
      } else if (n.nodeType === 1 && !n.classList.contains('lm-dado-ico')) {
        n.classList.add(n.namespaceURI === 'http://www.w3.org/2000/svg' ? 'lm-ico-orig' : 'lm-txt-orig');
      }
    });
    btn.insertBefore(icono('dice', 'lm-dado-ico'), btn.firstChild);
    btn.classList.add('lm-dado');
  }
  /* ¿es un botón de «nuevo ejercicio»? el dado de la lección (#genBtn) y, en la intro, los que empiezan por 🎲
     («🎲 Otro ejemplo», «🎲 Sorpréndeme»; el 🎲 puede estar ya apartado en su .pl-emo por la piel común) */
  function esDado(btn) {
    if (btn.id === 'genBtn') return true;
    if (!btn.classList.contains('ibtn')) return false;
    var t = (btn.textContent || '').replace(/\s+/g, '');
    return t.indexOf('\u{1F3B2}') === 0;
  }

  function repasar(raiz) {
    if (!raiz || raiz.nodeType !== 1 || H.classList.contains('lm-sin-piel')) return;
    try {
      var l, i;
      l = raiz.querySelectorAll('#genBtn, .ibtn');
      for (i = 0; i < l.length; i++) { if (esDado(l[i])) dado(l[i]); }
      if (raiz.matches && raiz.matches('#genBtn, .ibtn') && esDado(raiz)) dado(raiz);
      PROPIOS.forEach(function (p) { var b = document.querySelector(p[0]); if (b) propio(b, p[1]); });
      l = raiz.querySelectorAll(CON_SIGNO);
      for (i = 0; i < l.length; i++) signo(l[i]);
      if (raiz.matches && raiz.matches(CON_SIGNO)) signo(raiz);
      l = raiz.querySelectorAll('.tap-fb button');
      for (i = 0; i < l.length; i++) porTexto(l[i]);
    } catch (e) {}
  }
  repasar(document.body);
  try {
    var enCola = [], prog = false;
    new MutationObserver(function (ms) {
      for (var i = 0; i < ms.length; i++) {
        var m = ms[i], t = m.type === 'characterData' ? m.target.parentNode : m.target;
        if (!t || t.nodeType !== 1 || !t.closest) continue;
        if (t.closest('svg')) continue;                 /* partituras (VexFlow): ahí no hay botones */
        /* el botón al que pertenece lo que cambió (p. ej. «▶ Escuchar» ↔ «⏸ Parar», «↺ Vuelve al 3+2») */
        var b = t.closest('button') || t;
        if (enCola.indexOf(b) < 0) enCola.push(b);
      }
      if (prog || !enCola.length) return; prog = true;
      Promise.resolve().then(function () {
        prog = false;
        var l = enCola; enCola = [];
        for (var j = 0; j < l.length; j++) { if (l[j].isConnected) repasar(l[j]); }
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  } catch (e) {}
})();
