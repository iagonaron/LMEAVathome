/* =====================================================================
   LM at home · PIEL · PORTALES GE y GP (26-sep-2026, Iago)
   Solo mueve y viste lo que ya existe; no cambia ningún dato ni flujo:
   1) cada tarjeta de app lleva la clase de su apartado (color);
   2) la portada ordena las tarjetas alternando colores: Teoría · Dictado ·
      Entonación · Ritmo · PreDict · y el resto, sin dos del mismo color
      seguidas cuando se puede;
   3) «Mis resultados» pasa a ser un cuadrado amarillo con solo el icono,
      a la izquierda de la campana;
   4) cuentas Tester/Protester: Libros, Resultados, Sorteo, Dictado, Intro…
      en una hilera debajo de «Bienvenido/a», con texto.
   27-sep-2026 (noche, tercera vuelta):
   5) GP: «PreDict PRO Carrusel» pasa a ser un botón liso «Carrusel PRO»
      (naranja de PreDict) a la izquierda de «Mis resultados»;
   6) GP: el botón «Ver resultados» de Protester se lee «Resultados», como en GE
      (solo se ve distinto: su texto real no se toca);
   7) el pie: «by Iago González Alonso» y «Optimizado para ordenador y tablet»,
      uno debajo del otro, abajo del todo y en el centro (como en las apps);
   8) el color que Safari/iPad pone en su barra (theme-color) pasa al azul
      noche de la piel (en GP era marrón).
   Copia de la versión anterior: portal.js.bak-27sep-v2
   ===================================================================== */
(function () {
  'use strict';
  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toUpperCase(); }
  function area(card) {
    var k = card.querySelector('.kick.area'); if (!k) return '';
    var m = /\b(teoria|audicion|entonacion|ritmo)\b/.exec(k.className); return m ? m[1] : '';
  }
  function ico(n) { return (window.LMPiel && window.LMPiel.ico) ? window.LMPiel.ico(n) : ''; }

  /* ---------- 1 + 2: color y orden de las tarjetas ---------- */
  var PRIORIDAD = ['TEORIA', 'DICTA', 'ENTONACION', 'RITMO', 'PREDICT'];
  function rango(card) {
    var t = norm((card.querySelector('h2') || card).textContent);
    for (var i = 0; i < PRIORIDAD.length; i++) { if (t.indexOf(PRIORIDAD[i]) === 0 || t.replace(/\s/g, '').indexOf(PRIORIDAD[i]) === 0) return i; }
    return PRIORIDAD.length;
  }
  var _ordenado = false;
  function tarjetas() {
    var box = document.querySelector('.wrap .apps'); if (!box) return;
    var cards = Array.prototype.filter.call(box.children, function (c) { return c.classList && c.classList.contains('app-card'); });
    if (!cards.length) return;
    cards.forEach(function (c) { var a = area(c); if (a && !c.classList.contains('lm-ap-' + a)) c.classList.add('lm-ap', 'lm-ap-' + a); });
    if (_ordenado) return;
    /* orden deseado + evitar dos del mismo color seguidas */
    var orden = cards.map(function (c, i) { return { c: c, r: rango(c), i: i, a: area(c) }; })
                     .sort(function (x, y) { return (x.r - y.r) || (x.i - y.i); });
    var res = [];
    while (orden.length) {
      var prev = res.length ? res[res.length - 1].a : null, k = 0;
      /* los que tienen prioridad fija (Teoría, Dictado, Entonación, Ritmo, PreDict) van en su orden;
         entre los demás, el primero que no repita color */
      if (orden[0].r >= PRIORIDAD.length || orden[0].a === prev) {
        for (var j = 0; j < orden.length; j++) { if (orden[j].a !== prev) { k = j; break; } }
      }
      res.push(orden.splice(k, 1)[0]);
    }
    var ancla = cards[0];
    /* se colocan en el hueco de la primera tarjeta, respetando lo que va antes (Temazo, medallero…) */
    var marcador = document.createComment('lm-tarjetas');
    box.insertBefore(marcador, ancla);
    res.forEach(function (o) { box.insertBefore(o.c, marcador); });
    box.removeChild(marcador);
    _ordenado = true;
  }

  /* ---------- 3: Mis resultados = cuadrado amarillo junto a la campana ---------- */
  function misResultados() {
    var b = document.getElementById('btn-mis-resultados'), bell = document.getElementById('alu-campana-btn');
    if (!b || !bell || !bell.parentNode) return;
    if (!b.classList.contains('lm-mr-cuadro')) {
      b.classList.add('lm-mr-cuadro');
      b.setAttribute('title', 'Mis resultados'); b.setAttribute('aria-label', 'Mis resultados');
      if (!b.querySelector('.lm-mr-ico')) { var s = document.createElement('span'); s.className = 'lm-mr-ico'; s.innerHTML = ico('chart'); b.insertBefore(s, b.firstChild); }
    }
    if (b.parentNode !== bell.parentNode || b.nextSibling !== bell) bell.parentNode.insertBefore(b, bell);
    /* se ve exactamente cuando se ve la campana (solo con la cuenta validada) */
    var w = document.getElementById('portal-welcome');
    var visible = bell.style.display !== 'none' && (!w || w.style.display !== 'none');
    if (b.classList.contains('lm-oculto') === visible) b.classList.toggle('lm-oculto', !visible);
  }

  /* ---------- 4: hilera de botones del Tester/Protester, debajo de «Bienvenido/a» ---------- */
  var PIEZAS = ['lb-mini', 'rs-mini', 'da-mini', 'ri-mini', 'sorteo-btn'];
  function hileraTester() {
    var w = document.getElementById('portal-welcome'); if (!w) return;
    var piezas = PIEZAS.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    if (!piezas.length) return;
    var fila = document.getElementById('lm-tester');
    if (!fila) { fila = document.createElement('div'); fila.id = 'lm-tester'; w.appendChild(fila); }
    /* siempre en el mismo orden, aunque la página las vuelva a crear */
    piezas.forEach(function (p, i) {
      var sitio = fila.children[i];
      if (p.parentNode !== fila || sitio !== p) fila.insertBefore(p, sitio && sitio !== p ? sitio : null);
    });
    /* GP: «Ver resultados» se lee «Resultados», como en GE (el texto real no se toca: lo usa el botón) */
    Array.prototype.forEach.call(fila.querySelectorAll('.rs-btn'), function (el) {
      var t = (el.textContent || '').trim();
      if (/^ver resultados$/i.test(t)) el.classList.add('lm-txt-resultados');
    });
  }

  /* ---------- 5: GP · «Carrusel PRO», botón liso a la izquierda de Mis resultados ---------- */
  var ESPIRAL = '<svg class="pl-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                '<path d="M12 11a2 2 0 0 1 4 0a4 4 0 0 1-8 0a6 6 0 0 1 12 0a8 8 0 0 1-16 0"/></svg>';
  function carrusel() {
    var c = document.querySelector('.topbar .carrusel-btn'); if (!c || c.classList.contains('lm-carr')) return;
    var i = document.createElement('span'); i.className = 'lm-carr-ico'; i.innerHTML = ESPIRAL;
    var t = document.createElement('span'); t.className = 'lm-carr-txt'; t.textContent = 'Carrusel PRO';
    c.appendChild(i); c.appendChild(t);
    c.classList.add('lm-carr');
  }

  /* ---------- 7: el pie, como en las apps (dos líneas centradas, abajo del todo) ---------- */
  function pie() {
    var f = document.querySelector('.wrap > .foot'); if (!f || f.classList.contains('lm-foot-2l')) return;
    Array.prototype.slice.call(f.childNodes).forEach(function (n) {
      if (n.nodeType === 3 && n.nodeValue.trim()) { var s = document.createElement('span'); s.className = 'lm-foot-orig'; n.parentNode.insertBefore(s, n); s.appendChild(n); }
    });
    var viejo = f.querySelector('.lm-opt'); if (viejo) viejo.parentNode.removeChild(viejo);
    ['by Iago González Alonso', 'Optimizado para ordenador y tablet'].forEach(function (txt) {
      var s = document.createElement('span'); s.className = 'lm-foot-l'; s.textContent = txt; f.appendChild(s);
    });
    f.classList.add('lm-foot-2l');
    /* que sea lo último: después del texto legal */
    var legal = f.parentNode && f.parentNode.querySelector(':scope > .foot-legal');
    if (legal && legal.compareDocumentPosition(f) & Node.DOCUMENT_POSITION_PRECEDING) legal.parentNode.insertBefore(f, legal.nextSibling);
  }

  /* ---------- 8: el color de la barra del navegador (Safari/iPad) también sin marrón en GP ---------- */
  function colorNavegador() {
    var m = document.querySelector('meta[name="theme-color"]');
    if (m && m.getAttribute('content') !== '#0b1320') { m.setAttribute('data-lm-orig', m.getAttribute('content') || ''); m.setAttribute('content', '#0b1320'); }
  }

  function todo() {
    try { tarjetas(); } catch (e) {} try { misResultados(); } catch (e) {} try { hileraTester(); } catch (e) {}
    try { carrusel(); } catch (e) {} try { pie(); } catch (e) {} try { colorNavegador(); } catch (e) {}
  }
  todo();
  var n = 0, t = setInterval(function () { todo(); if (++n > 240) clearInterval(t); }, 500);
  try { new MutationObserver(function () { todo(); }).observe(document.querySelector('.topbar') || document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] }); } catch (e) {}
})();
