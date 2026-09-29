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
   28-sep-2026 (Iago):
   9) los botones del Tester/Protester pasan a CUADRADOS 1×1 con icono, a la izquierda de Mis resultados y la
      campana: Pentagrama · Libros · Ritmo · Entonación (GE) · Dictado activo (· Sorteo en su temporada). Los botones
      de siempre siguen ahí, ocultos (la hilera #lm-tester), y los cuadrados los pulsan: no cambia lo que hacen.
   10) (retirado la tarde del 28-sep: los Libros ya abren siempre a pantalla completa, al ancho, con «Lista» en columna)
   11) SOLO Tester/Protester (nunca para alumnos): cuadrado «Pantalla completa» (a la izquierda de Libros) y el cartel
       «GRADO ELEMENTAL / PROFESIONAL» de la portada pasa al otro portal al pulsarlo. Con la pantalla completa puesta, el
       otro portal se abre DENTRO de este (sin salir de pantalla completa) y el cartel vuelve.
   (28-sep, tarde) «Pantalla completa» pasa a la derecha de la campana (solo Tester/Protester) y la hilera de arriba baja
       un poco (no pegada al techo), con la cabecera «LM at home» más cerca.
   12) Visor de las lecciones de ritmo: UNA hilera arriba solo con iconos (rueda de tonalidad horizontal, ♯ ♭ M m en
       verde, rotuladores, nota, goma, deshacer, borrar todo), pantalla completa con cada página entera, y el fondo de
       la piel (GP sin marrón). La barra de siempre sigue debajo, oculta, y es la que guarda.
   13) (28-sep-2026) Ventana de BIENVENIDA a la estética nueva, una sola vez por cuenta y aparato («Hemos hecho una
       reforma estética…», de Iago). Para verla otra vez: ?bienvenida=1.
   29-sep-2026 (Iago):
   14) CAMPANA TRANQUILA: las ondas (y el balanceo de la campana) solo 5 segundos al entrar o cuando llega algo
       nuevo; después se queda quieta con su numerito. «Es una desconcentración.»
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
    if (!c.getAttribute('title')) c.setAttribute('title', 'Carrusel PRO');   /* (28-sep) en pantallas medianas solo se ve el icono */
    /* (28-sep-2026, noche) el Carrusel vive en iagonaron.github.io, donde no llega la marca de lmathome.es: se le pasa
       «piel=1» en el enlace para que tu pantalla salga con la estética nueva (y la recuerde en ese navegador). */
    try { if (c.href && !/[?&]piel=1\b/.test(c.href)) c.href = c.href + (c.href.indexOf('?') < 0 ? '?' : '&') + 'piel=1'; } catch (e) {}
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

  /* ---------- 9 (28-sep-2026, Iago): botones del profesor en cuadrados 1×1 con icono ----------
     De izquierda a derecha, antes de [Carrusel PRO] [Mis resultados] [campana]:
     Pentagrama (blanco, líneas grises, como la pizarra) · Libros (elige el libro antes de abrir) · Ritmo (metrónomo: «Ver intro activa»
     y «Resultados») · Entonación (clave de sol, GE) · Dictado activo (diapasón con «Nº x») · Sorteo (si está).
     Cada cuadrado PULSA el botón de siempre (que sigue en la página, oculto): mismo comportamiento que antes. */
  var GP = document.documentElement.classList.contains('lm-gp');
  var LIBROS = GP ? [['intervalia_pro', 'Intervalia PRO'], ['teoria', 'Apuntes de teoría']]
                  : [['intervalia', 'Intervalia'], ['faactos', 'FaActos'], ['teoria', 'Kit salvavidas']];
  function q(sel) { return document.querySelector(sel); }
  function qa(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pulsa(el) { if (el) { try { el.click(); } catch (e) {} } }
  var _menu = null;
  function cerrarMenu() {
    if (!_menu) return;
    var de = _menu._de; _menu.parentNode && _menu.parentNode.removeChild(_menu); _menu = null;
    if (de) de.setAttribute('aria-expanded', 'false');
  }
  function abrirMenu(btn, opciones) {
    if (_menu && _menu._de === btn) { cerrarMenu(); return; }
    cerrarMenu();
    var m = document.createElement('div'); m.className = 'lm-ic-menu'; m.setAttribute('role', 'menu'); m._de = btn;
    opciones.forEach(function (o) {
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'menuitem');
      b.innerHTML = '<span class="lm-ic-t">' + esc(o.t) + '</span>' + (o.s ? '<span class="lm-ic-s">' + esc(o.s) + '</span>' : '');
      if (o.off) b.disabled = true;
      else b.addEventListener('click', function (e) { e.stopPropagation(); cerrarMenu(); o.fn(); });
      m.appendChild(b);
    });
    btn.parentNode.appendChild(m); _menu = m; btn.setAttribute('aria-expanded', 'true');
    try { var f = m.querySelector('button:not(:disabled)'); if (f) f.focus({ preventScroll: true }); } catch (e) {}
  }
  document.addEventListener('click', function (e) {
    if (_menu && !_menu.contains(e.target) && !(_menu._de && _menu._de.contains(e.target))) cerrarMenu();
  }, true);
  document.addEventListener('keydown', function (e) {
    if (_menu && (e.key === 'Escape' || e.key === 'Esc')) { var de = _menu._de; cerrarMenu(); try { de.focus(); } catch (x) {} }
  });
  /* Libros: abre el panel de siempre y pasa a la pestaña del libro elegido */
  function abrirLibro(tipo) {
    pulsa(q('#lb-mini .da-btn'));
    var n = 0, t = setInterval(function () {
      var tab = q('#lb-tabs [data-t="' + tipo + '"]');
      if (tab || ++n > 80) {
        clearInterval(t);
        if (tab && !tab.classList.contains('on')) pulsa(tab);
      }
    }, 100);
  }
  function cuadro(clase, icono, titulo, fn, conMenu, badge) {
    var w = document.createElement('span'); w.className = 'lm-ic-w';
    var b = document.createElement('button'); b.type = 'button'; b.className = 'lm-ic ' + clase;
    b.title = titulo; b.setAttribute('aria-label', titulo);
    if (conMenu) { b.setAttribute('aria-haspopup', 'menu'); b.setAttribute('aria-expanded', 'false'); }
    b.innerHTML = ico(icono) + (badge ? '<span class="lm-ic-badge" aria-hidden="true">' + esc(badge) + '</span>' : '');
    b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); fn(b); });
    w.appendChild(b); return w;
  }
  function hileraIconos() {
    var bell = document.getElementById('alu-campana-btn'); if (!bell || !bell.parentNode) return;
    var host = bell.parentNode;
    var penta = q('#pz-mini .da-btn'), libros = q('#lb-mini .da-btn'), intros = qa('#ri-mini .da-btn'),
        resR = q('#rs-mini .rs-btn.verde') || q('#rs-mini .rs-btn.violeta'), resE = q('#rs-mini .rs-btn.azul'),
        dicts = qa('#da-mini .da-btn');
    var barra = document.getElementById('lm-iconos');
    if (!penta && !libros && !intros.length && !resR && !resE && !dicts.length) { if (barra) { cerrarMenu(); barra.parentNode.removeChild(barra); } return; }
    if (!barra) { barra = document.createElement('div'); barra.id = 'lm-iconos'; barra.setAttribute('role', 'toolbar'); barra.setAttribute('aria-label', 'Herramientas del profesor'); }
    if (barra.parentNode !== host) host.insertBefore(barra, host.firstChild);
    var firma = JSON.stringify([!!penta, !!libros, intros.map(function (b) { return b.getAttribute('data-carta') + '|' + b.title; }), !!resR, !!resE,
      dicts.map(function (b) { return b.getAttribute('data-curso') + '|' + b.textContent; })]);
    if (barra.getAttribute('data-firma') === firma) return;
    cerrarMenu(); barra.setAttribute('data-firma', firma); barra.innerHTML = '';
    if (penta) barra.appendChild(cuadro('lm-ic-penta', 'pentagrama', 'Pentagrama · pizarra para el aula', function () { pulsa(q('#pz-mini .da-btn')); }));
    if (libros) barra.appendChild(cuadro('lm-ic-libros', 'book', 'Libros del aula', function (b) {
      abrirMenu(b, LIBROS.map(function (l) { return { t: l[1], fn: function () { abrirLibro(l[0]); } }; }));
    }, true));
    if (intros.length || resR) barra.appendChild(cuadro('lm-ic-ritmo', 'metronomo', GP ? 'Ritmo entonado · intro activa y resultados' : 'Ritmo · intro activa y resultados', function (b) {
      var ops = [];
      var ins = qa('#ri-mini .da-btn');
      if (ins.length) ins.forEach(function (x) {
        var carta = x.getAttribute('data-carta') || '', tit = x.getAttribute('title') || '';
        var nombre = (tit.split(' — ')[1] || '').replace(/ · solo profesor$/, '');
        var curso = ins.length > 1 ? (tit.split(' · ')[0] || '') : '';
        ops.push({ t: 'Ver intro activa · ' + carta + (curso ? ' · ' + curso : ''), s: nombre, fn: function () { pulsa(x); } });
      });
      else ops.push({ t: 'Sin intro activa esta semana', off: true });
      var rr = q('#rs-mini .rs-btn.verde') || q('#rs-mini .rs-btn.violeta');
      if (rr) ops.push({ t: 'Resultados', s: GP ? 'Ritmo entonado · pantalla de corrección' : 'Pantalla de corrección de ritmo', fn: function () { pulsa(q('#rs-mini .rs-btn.verde') || q('#rs-mini .rs-btn.violeta')); } });
      abrirMenu(b, ops);
    }, true));
    if (resE) barra.appendChild(cuadro('lm-ic-ento', 'clavesol', 'Entonación · resultados', function () { pulsa(q('#rs-mini .rs-btn.azul')); }));
    if (dicts.length) {
      var nums = dicts.map(function (b) { var m = /nº\s*(\d+)/i.exec(b.textContent); return m ? m[1] : ''; });
      var badge = dicts.length === 1 ? (nums[0] ? 'Nº' + nums[0] : '') : (nums.every(function (x) { return x && x === nums[0]; }) ? 'Nº' + nums[0] : String(dicts.length));
      barra.appendChild(cuadro('lm-ic-dict', 'diapason', 'Dictado activo' + (dicts.length === 1 && nums[0] ? ' nº ' + nums[0] : ''), function (b) {
        var ds = qa('#da-mini .da-btn');
        if (ds.length === 1) { pulsa(ds[0]); return; }
        abrirMenu(b, ds.map(function (x) { var m = /nº\s*(\d+)/i.exec(x.textContent); return { t: 'Dictado' + (m ? ' nº ' + m[1] : ''), s: x.getAttribute('data-curso') || '', fn: function () { pulsa(x); } }; }));
      }, dicts.length > 1, badge));
    }
    /* (28-sep, Iago) el Sorteo NO va en la portada: su botón sigue en la hilera oculta */
  }

  /* ---------- 10 (28-sep-2026, noche, Iago): LIBROS · «AMPLIAR» ----------
     «Que hubiese el botón de ampliar a toda pantalla, como ocurre con el visor de las lecciones de ritmo, y que se
     aumente hasta ocupar el ancho» (foto de Iago con Intervalia PRO). Junto a «Lista» sale un cuadrado con el icono
     de ampliar. Al pulsarlo: fuera la barra de arriba y la lista, pantalla completa (si el aparato deja) y el
     CONTENIDO de la página, sin sus márgenes blancos, al ancho de la pantalla; si queda más alto, se baja con el dedo.
     Arriba a la derecha, pequeño: ‹ pág › y reducir. Deslizar de lado sigue pasando página. Esc o reducir vuelven a
     como estaba. Solo aspecto: la página la sigue dibujando el visor de siempre (esto solo la encuadra). */
  var LBX = { on: false, fs: false };
  function lbOv() { return document.getElementById('lb-ov'); }
  function librosMax() {
    var o = lbOv(); if (!o) return;
    var top = o.querySelector('.lb-top'); if (!top) return;
    var b = document.getElementById('lm-lb-max');
    if (!b) {
      b = document.createElement('button'); b.id = 'lm-lb-max'; b.type = 'button'; b.className = 'lb-b lm-lb-ic';
      b.title = 'Ampliar a toda la pantalla'; b.setAttribute('aria-label', b.title); b.innerHTML = ico('expandir');
      b.addEventListener('click', function () { ampliarLibro(true); });
      var lista = document.getElementById('lb-lista'); top.insertBefore(b, lista || null);
      var f = document.createElement('div'); f.id = 'lm-lb-flot'; f.setAttribute('role', 'toolbar'); f.setAttribute('aria-label', 'Página');
      f.innerHTML = '<button type="button" class="lm-lb-f" data-a="prev" title="Página anterior" aria-label="Página anterior">‹</button>' +
                    '<span class="lm-lb-p" id="lm-lb-pag"></span>' +
                    '<button type="button" class="lm-lb-f" data-a="next" title="Página siguiente" aria-label="Página siguiente">›</button>' +
                    '<button type="button" class="lm-lb-f" data-a="min" title="Reducir" aria-label="Reducir">' + ico('contraer') + '</button>';
      f.addEventListener('click', function (e) {
        var x = e.target.closest && e.target.closest('.lm-lb-f'); if (!x) return;
        e.stopPropagation();
        var a = x.getAttribute('data-a');
        if (a === 'prev') pulsa(document.getElementById('lb-prev'));
        else if (a === 'next') pulsa(document.getElementById('lb-next'));
        else ampliarLibro(false);
      });
      o.appendChild(f);
      /* la página se vuelve a dibujar (otra página, otro libro, otro tamaño): se encuadra otra vez */
      new MutationObserver(function (ms) {
        for (var k = 0; k < ms.length; k++) { var ad = ms[k].addedNodes; for (var q = 0; q < ad.length; q++) { if (ad[q].tagName === 'CANVAS') { encuadrarLibro(); return; } } }
      }).observe(o, { childList: true, subtree: true });
      var pg = document.getElementById('lb-pag');
      if (pg) new MutationObserver(numeroLibro).observe(pg, { childList: true, characterData: true, subtree: true });
      /* si el visor se cierra por otro lado, se reduce */
      new MutationObserver(function () { if (!o.classList.contains('open') && LBX.on) ampliarLibro(false); }).observe(o, { attributes: true, attributeFilter: ['class'] });
      document.addEventListener('fullscreenchange', finFSLibro); document.addEventListener('webkitfullscreenchange', finFSLibro);
      /* Esc: primero reduce (el visor, con Esc, se cierra) */
      window.addEventListener('keydown', function (e) {
        if (!LBX.on || (e.key !== 'Escape' && e.key !== 'Esc')) return;
        e.preventDefault(); e.stopImmediatePropagation(); ampliarLibro(false);
      }, true);
    }
    var enVis = !!document.getElementById('lb-vis');
    b.style.display = enVis ? '' : 'none';
    if (!enVis && LBX.on) ampliarLibro(false);
    numeroLibro();
  }
  function numeroLibro() {
    var a = document.getElementById('lb-pag'), b = document.getElementById('lm-lb-pag');
    if (a && b && b.textContent !== a.textContent) b.textContent = a.textContent;
  }
  function finFSLibro() {
    var enFS = !!(document.fullscreenElement || document.webkitFullscreenElement);
    if (enFS) { LBX.fs = true; return; }
    if (LBX.fs && LBX.on) { LBX.fs = false; ampliarLibro(false, true); }
    LBX.fs = false;
  }
  function ampliarLibro(on, yaFuera) {
    var o = lbOv(); if (!o || on === LBX.on) return;
    LBX.on = on;
    o.classList.toggle('lm-lb-max', on);
    if (on) {
      var rq = o.requestFullscreen || o.webkitRequestFullscreen;
      if (rq) { try { var p = rq.call(o); if (p && p.catch) p.catch(function () {}); } catch (e) {} }
    } else if (!yaFuera && (document.fullscreenElement || document.webkitFullscreenElement)) {
      try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) {}
    }
    numeroLibro();
    /* el visor vuelve a dibujar la página al tamaño nuevo (su «resize»); al llegar el lienzo, se encuadra */
    setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 60);
    setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 450);   /* tras la animación de pantalla completa */
  }
  /* dónde hay tinta en la página (sin los márgenes blancos), en píxeles del lienzo */
  function tintaLibro(c) {
    try {
      var sw = Math.min(600, c.width), s = sw / c.width, sh = Math.max(1, Math.round(c.height * s));
      var t = document.createElement('canvas'); t.width = sw; t.height = sh;
      var x = t.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, sw, sh); x.drawImage(c, 0, 0, sw, sh);
      var d = x.getImageData(0, 0, sw, sh).data, x0 = sw, y0 = sh, x1 = -1, y1 = -1;
      for (var y = 0; y < sh; y++) {
        for (var i = 0; i < sw; i++) {
          var p = (y * sw + i) * 4;
          if (d[p] < 200 || d[p + 1] < 200 || d[p + 2] < 200) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y; }
        }
      }
      if (x1 < 0) return null;
      var m = Math.round(sw * 0.015);
      x0 = Math.max(0, x0 - m); y0 = Math.max(0, y0 - m); x1 = Math.min(sw - 1, x1 + m); y1 = Math.min(sh - 1, y1 + m);
      return { x: x0 / s, y: y0 / s, w: (x1 - x0 + 1) / s, h: (y1 - y0 + 1) / s };
    } catch (e) { return null; }
  }
  function encuadrarLibro() {
    if (!LBX.on) return;
    var vis = document.getElementById('lb-vis'); if (!vis) return;
    var c = vis.querySelector('canvas'); if (!c || c._lmRec) return;
    c._lmRec = true;
    var cw = parseFloat(c.style.width) || c.clientWidth, ch = parseFloat(c.style.height) || c.clientHeight;
    var bb = tintaLibro(c); if (!bb || !cw) return;
    var k = cw / c.width, pad = 10;
    var f = Math.min(3, (vis.clientWidth - 2 * pad) / (bb.w * k));
    var alto = bb.h * k * f, H = vis.clientHeight;
    var caja = document.createElement('div'); caja.className = 'lm-lb-rec';
    caja.style.height = Math.ceil(alto + 2 * pad) + 'px';
    if (alto + 2 * pad < H) caja.style.marginTop = Math.floor((H - alto - 2 * pad) / 2) + 'px';   /* si cabe, centrada */
    c.style.width = (cw * f) + 'px'; c.style.height = (ch * f) + 'px';
    c.style.left = (pad - bb.x * k * f) + 'px'; c.style.top = (pad - bb.y * k * f) + 'px';
    vis.insertBefore(caja, c); caja.appendChild(c);
  }

  /* ---------- 11 (28-sep-2026, Iago): SOLO Tester/Protester · pantalla completa y cambio de grado en la portada ----------
     «Esto nunca lo voy a querer desplegar a los alumnos»: se comprueba la cuenta (nombre de la sesión de este portal).
     · Cuadrado «Pantalla completa» (a la izquierda de Libros): pone o quita la pantalla completa, si el aparato deja.
     · El cartel «GRADO ELEMENTAL / GRADO PROFESIONAL» (debajo de LM at home) pasa al otro portal. Sin pantalla
       completa, va al otro portal normalmente. Con pantalla completa, el otro portal se abre DENTRO de este, a toda
       pantalla (así no se sale de la pantalla completa), y su cartel vuelve a este: el cambio es instantáneo y cada
       portal se queda como estaba. */
  var TESTERS = ['iago gonzalez tester', 'iago gonzalez protester', 'iago gonzalez pro tester'];
  function esProfe() {
    try {
      var ss = JSON.parse(localStorage.getItem(GP ? 'lmpro_session' : 'lmeav_session') || 'null');
      var n = String((ss && ss.nombre) || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
      return !!(ss && ss.estado === 'validado' && TESTERS.indexOf(n) >= 0);
    } catch (e) { return false; }
  }
  var EN_MARCO = (window.top !== window) && /[?&]lmmarco=1\b/.test(location.search);
  var OTRO = GP ? 'https://ge.lmathome.es/' : 'https://gp.lmathome.es/';
  var _pantallaMarco = false;   /* dentro del marco: lo que dice el portal de fuera */
  function puedePantalla() { return EN_MARCO || !!(document.fullscreenEnabled || document.webkitFullscreenEnabled); }
  function enPantalla() { return EN_MARCO ? _pantallaMarco : !!(document.fullscreenElement || document.webkitFullscreenElement); }
  function alternarPantalla() {
    if (EN_MARCO) { try { parent.postMessage({ lm: 'pantallaCompleta' }, '*'); } catch (e) {} return; }
    var d = document.documentElement;
    try {
      if (enPantalla()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      else { var p = (d.requestFullscreen || d.webkitRequestFullscreen).call(d); if (p && p.catch) p.catch(function () {}); }
    } catch (e) {}
  }
  /* (28-sep-2026, Iago) «Pantalla completa»: a la DERECHA de todo, después de la campana. SOLO Tester/Protester
     («esto solo para tester, ¿eh? Y protester»): se comprueba la cuenta, no basta con que el aparato lo permita. */
  function cuadroPantalla() {
    var bell = document.getElementById('alu-campana-btn'); if (!bell || !bell.parentNode) return;
    var host = bell.parentNode, w = document.getElementById('lm-pantalla');
    if (!(esProfe() && puedePantalla())) { if (w && w.parentNode) w.parentNode.removeChild(w); return; }
    if (!w) {
      var on = enPantalla();
      w = cuadro('lm-ic-pantalla', on ? 'contraer' : 'expandir', on ? 'Salir de pantalla completa' : 'Pantalla completa', function () { alternarPantalla(); });
      w.id = 'lm-pantalla';
    }
    if (w.parentNode !== host) host.appendChild(w);
  }
  function pintarPantalla() {
    var b = document.querySelector('#lm-pantalla .lm-ic-pantalla'); if (!b) return;
    var on = enPantalla(); b.innerHTML = ico(on ? 'contraer' : 'expandir');
    b.title = on ? 'Salir de pantalla completa' : 'Pantalla completa'; b.setAttribute('aria-label', b.title);
  }
  var marco = null;
  function avisarMarco() { try { if (marco && marco.contentWindow) marco.contentWindow.postMessage({ lm: 'estadoPantalla', on: enPantalla() }, '*'); } catch (e) {} }
  function cambiarGrado() {
    if (EN_MARCO) { try { parent.postMessage({ lm: 'cambiaGrado' }, '*'); } catch (e) {} return; }
    if (marco && marco.classList.contains('lm-on')) { marco.classList.remove('lm-on'); document.documentElement.classList.remove('lm-marco-on'); return; }
    if (!enPantalla()) { location.href = OTRO; return; }
    if (!marco) {
      marco = document.createElement('iframe'); marco.id = 'lm-marco';
      marco.title = GP ? 'Grado Elemental' : 'Grado Profesional';
      marco.setAttribute('allow', 'fullscreen; autoplay; microphone');
      marco.src = OTRO + '?lmmarco=1';
      marco.addEventListener('load', avisarMarco);
      document.body.appendChild(marco);
    }
    marco.classList.add('lm-on'); document.documentElement.classList.add('lm-marco-on'); avisarMarco();
  }
  window.addEventListener('message', function (e) {
    var d = e.data || {};
    if (EN_MARCO && e.source === parent && d.lm === 'estadoPantalla') { _pantallaMarco = !!d.on; pintarPantalla(); return; }
    if (!marco || e.source !== marco.contentWindow) return;
    if (d.lm === 'cambiaGrado') cambiarGrado();
    else if (d.lm === 'pantallaCompleta') alternarPantalla();
  });
  function alCambiarPantalla() { pintarPantalla(); avisarMarco(); }
  document.addEventListener('fullscreenchange', alCambiarPantalla); document.addEventListener('webkitfullscreenchange', alCambiarPantalla);
  function cartelGrado() {
    var g = document.querySelector('.hero-lockup:not(.gate-lockup) .hero-grade'); if (!g) return;
    var profe = esProfe();
    if (!profe) { if (g.classList.contains('lm-grado-cambia')) { g.classList.remove('lm-grado-cambia'); g.removeAttribute('role'); g.removeAttribute('tabindex'); g.removeAttribute('title'); } return; }
    if (g.classList.contains('lm-grado-cambia')) return;
    g.classList.add('lm-grado-cambia'); g.setAttribute('role', 'button'); g.tabIndex = 0;
    g.title = GP ? 'Pasar a Grado Elemental' : 'Pasar a Grado Profesional';
    if (!g._lmGrado) {
      g._lmGrado = true;
      g.addEventListener('click', function () { if (g.classList.contains('lm-grado-cambia')) cambiarGrado(); });
      g.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && g.classList.contains('lm-grado-cambia')) { e.preventDefault(); cambiarGrado(); } });
    }
  }

  /* ---------- 12 (28-sep-2026, Iago): VISOR DE LAS LECCIONES DE RITMO («estudiar las lecciones») ----------
     «Que ocupe solo una hilera arriba… una franja más estrecha, para que puedan caber partituras completas.»
     La barra de anotaciones de siempre sigue ahí, OCULTA, y es la que lo hace todo (guardar los trazos y las notas,
     deshacer, borrar todo, la tonalidad…): esta hilera nueva solo pulsa sus botones y copia su estado. Así no cambia
     nada de lo que se guarda ni cómo se guarda.
     · UNA hilera: rueda de tonalidad HORIZONTAL (se desliza o se toca la nota) · ♯ ♭ M m del mismo tamaño que las
       herramientas y en VERDE al marcarse (es ritmo) · rotuladores · nota · goma · deshacer · borrar todo, solo con
       iconos (la goma ya no es la esponja amarilla) · pantalla completa · ✕.
     · Pantalla completa: cada página entra ENTERA en la pantalla, con la hilera arriba; con varias páginas se pasa de
       una a otra deslizando (o con los puntitos de la derecha). El mismo botón, Esc o la ✕ para salir.
     · El fondo es el de la piel en los dos portales (en GP ya no sale marrón).
     Si la barra de siempre cambiara y no se reconociera, el visor se queda tal cual estaba (nada se rompe). */
  var VL_NOTAS = ['—', 'Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'];   /* izquierda → derecha */
  var VL_ORIG = ['Si', 'La', 'Sol', 'Fa', 'Mi', 'Re', 'Do', '—'];    /* orden de la rueda de siempre (vertical) */
  var VL_HER = ['c0', 'c1', 'c2', 'c3', 'k', 'nota', 'goma', 'undo', 'clear'];
  var ICO_NOTA = '<path d="M5 4h14v10l-6 6H5z"/><path d="M13 20v-6h6"/><path d="M8.5 8.5h7M8.5 12h4"/>';
  function svgI(p) { return '<svg class="pl-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; }
  /* el mismo «clic» suave de la rueda de siempre (y el mismo freno, compartido: nunca suena en ráfaga) */
  function vlTic() {
    var t = performance.now(); if (window.__anotTickT && t - window.__anotTickT < 55) return; window.__anotTickT = t;
    try {
      var A = window.__anotTickA = window.__anotTickA || new (window.AudioContext || window.webkitAudioContext)();
      if (A.state === 'suspended' && A.resume) A.resume();
      var o = A.createOscillator(), g = A.createGain(); o.frequency.value = 520; g.gain.value = 0.026; o.connect(g); g.connect(A.destination);
      o.start(); g.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + 0.05); o.stop(A.currentTime + 0.06);
    } catch (e) {}
  }
  /* rueda HORIZONTAL: arrastre continuo con inercia, toque en una nota = esa nota, rueda del ratón o flechas = un paso */
  function vlRueda(host, labels, alElegir) {
    host.innerHTML = '<div class="lm-vl-tira"></div><div class="lm-vl-marco"></div><div class="lm-vl-vela"></div>';
    var tira = host.firstChild;
    tira.innerHTML = labels.map(function () { return '<span class="lm-vl-it"></span>'; }).join('');
    Array.prototype.forEach.call(tira.children, function (el, i) { el.textContent = labels[i]; });
    var idx = 0, off = 0, arr = false, mov = false, x0 = 0, xl = 0, tl = 0, vel = 0, cerca = 0, raf = null, acc = 0;
    function C() { var c = tira.firstChild ? tira.firstChild.getBoundingClientRect().width : 0; return c || 36; }
    function lim(v) { return Math.max(0, Math.min(labels.length - 1, v)); }
    function pos() { var c = C(); tira.style.transform = 'translateX(' + ((host.clientWidth - c) / 2 - idx * c + off) + 'px)'; }
    function marca(k) { Array.prototype.forEach.call(tira.children, function (el, i) { el.classList.toggle('sel', i === k); }); }
    function fija(i, silencio) {
      i = lim(i); var cambia = (i !== idx); idx = i; off = 0; tira.style.transition = ''; marca(idx); pos();
      host.setAttribute('aria-valuenow', String(idx));
      if (cambia && !silencio) alElegir(idx);
    }
    function sigue() { var k = lim(Math.round(idx - off / C())); if (k !== cerca) { cerca = k; marca(k); vlTic(); } }
    function limita() { var c = C(), izq = idx * c, der = (labels.length - 1 - idx) * c; if (off > izq) { off = izq; return true; } if (off < -der) { off = -der; return true; } return false; }
    host.addEventListener('pointerdown', function (ev) {
      ev.preventDefault(); ev.stopPropagation();
      if (raf) { cancelAnimationFrame(raf); raf = null; fija(Math.round(idx - off / C())); }
      arr = true; mov = false; x0 = xl = ev.clientX; tl = performance.now(); vel = 0; cerca = idx; tira.style.transition = 'none';
      try { host.setPointerCapture(ev.pointerId); } catch (e) {}
      try { host.focus({ preventScroll: true }); } catch (e) {}
    });
    host.addEventListener('pointermove', function (ev) {
      if (!arr) return;
      var t = performance.now(), dt = Math.max(1, t - tl); vel = 0.7 * vel + 0.3 * ((ev.clientX - xl) / dt); xl = ev.clientX; tl = t;
      off = ev.clientX - x0; if (Math.abs(off) > 4) mov = true; limita(); pos(); sigue();
    });
    function suelta(ev) {
      if (!arr) return; arr = false;
      if (!mov) {
        tira.style.transition = ''; off = 0; pos();
        if (ev) { var r = host.getBoundingClientRect(), k = lim(idx + Math.round((ev.clientX - (r.left + r.width / 2)) / C())); if (k !== idx) { vlTic(); fija(k); } }
        return;
      }
      var v = (performance.now() - tl > 80) ? 0 : vel * 16;   /* si el dedo se paró antes de soltar, no hay impulso */
      if (Math.abs(v) < 3) { fija(Math.round(idx - off / C())); return; }
      var paso = function () {
        v *= 0.94; off += v; if (limita()) v = 0; pos(); sigue();
        if (Math.abs(v) > 0.6) raf = requestAnimationFrame(paso); else { raf = null; fija(Math.round(idx - off / C())); }
      };
      raf = requestAnimationFrame(paso);
    }
    host.addEventListener('pointerup', function (ev) { suelta(ev); });
    host.addEventListener('pointercancel', function () { mov = true; vel = 0; suelta(null); });
    host.addEventListener('wheel', function (ev) {
      ev.preventDefault(); ev.stopPropagation();
      acc += (Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) ? ev.deltaX : ev.deltaY;
      while (acc >= 40) { if (idx < labels.length - 1) vlTic(); fija(idx + 1); acc -= 40; }
      while (acc <= -40) { if (idx > 0) vlTic(); fija(idx - 1); acc += 40; }
    }, { passive: false });
    host.tabIndex = 0;
    host.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowUp') { ev.preventDefault(); if (idx < labels.length - 1) vlTic(); fija(idx + 1); }
      else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowDown') { ev.preventDefault(); if (idx > 0) vlTic(); fija(idx - 1); }
      else if (ev.key === 'Home') { ev.preventDefault(); fija(0); }
      else if (ev.key === 'End') { ev.preventDefault(); fija(labels.length - 1); }
    });
    host.setAttribute('aria-valuemin', '0'); host.setAttribute('aria-valuemax', String(labels.length - 1));
    marca(idx); pos();
    return { fija: fija, pos: pos, idx: function () { return idx; }, ocupada: function () { return arr || !!raf; } };
  }
  var vlActual = null;
  function visorLecciones() {
    if (vlActual && !vlActual.ov.isConnected) { vlActual.limpia(); vlActual = null; }
    var ov = document.getElementById('ts-visor'); if (!ov || ov._lmVl) return;
    var host = ov.firstElementChild; if (!host) return;
    var bar0 = ov.querySelector('.anot-bar'); if (!bar0) return;   /* sin capturas no hay herramientas: solo el aspecto */
    var tonBox = bar0.querySelector('.anot-ton'), rueda0 = tonBox && tonBox.querySelector('.anot-rueda');
    function o(t) { return bar0.querySelector('.anot-b[data-t="' + t + '"]'); }
    function oTon(k) { return tonBox.querySelector((k === '#' || k === 'b') ? '.anot-tbtn[data-alt="' + k + '"]' : '.anot-tbtn[data-modo="' + k + '"]'); }
    if (!rueda0 || !rueda0.querySelector('.strip .item') || VL_HER.some(function (t) { return !o(t); }) || ['#', 'b', 'M', 'm'].some(function (k) { return !oTon(k); })) return;
    ov._lmVl = true;

    /* ---- la hilera ---- */
    var nb = document.createElement('div'); nb.className = 'lm-vl-bar lm-sin-iconos';
    nb.setAttribute('role', 'toolbar'); nb.setAttribute('aria-label', 'Herramientas de la lección');
    function boton(clase, html, titulo, fn) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'lm-vl-b' + (clase ? ' ' + clase : '');
      b.innerHTML = html; b.title = titulo; b.setAttribute('aria-label', titulo);
      b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); fn(b); try { b.blur(); } catch (er) {} });
      return b;
    }
    function sep(k) { var s = document.createElement('span'); s.className = 'lm-vl-sep ' + k; s.setAttribute('aria-hidden', 'true'); return s; }
    function pulsaO(el) { if (el) { try { el.click(); } catch (e) {} } pinta(); }
    var g1 = document.createElement('div'); g1.className = 'lm-vl-g1'; g1.setAttribute('role', 'group'); g1.setAttribute('aria-label', 'Tonalidad');
    var rh = document.createElement('div'); rh.className = 'lm-vl-rueda'; rh.setAttribute('role', 'slider'); rh.setAttribute('aria-label', 'Tonalidad');
    g1.appendChild(rh);
    var mT = {};
    [['#', '♯', 'Sostenido', 's'], ['b', '♭', 'Bemol', 'b'], ['M', 'M', 'Mayor', 'may'], ['m', 'm', 'menor', 'men']].forEach(function (d) {
      var b = boton('lm-vl-t lm-vl-t-' + d[3], '<span>' + d[1] + '</span>', d[2], function () { pulsaO(oTon(d[0])); });
      b.setAttribute('aria-pressed', 'false'); mT[d[0]] = b; g1.appendChild(b);
    });
    var her = document.createElement('div'); her.className = 'lm-vl-her';
    var mH = {};
    [['c0', '#ffde3c', 'Subrayar en amarillo'], ['c1', '#50e68c', 'Subrayar en verde'], ['c2', '#ff6eb4', 'Subrayar en rosa'], ['c3', '#5ab4ff', 'Subrayar en azul']].forEach(function (d) {
      mH[d[0]] = boton('lm-vl-col', '<span class="lm-vl-sw" style="background:' + d[1] + '"></span>', d[2], function () { pulsaO(o(d[0])); });
      her.appendChild(mH[d[0]]);
    });
    mH.k = boton('lm-vl-col', '<span class="lm-vl-sw lm-vl-fina"><i></i></span>', 'Punta fina negra', function () { pulsaO(o('k')); }); her.appendChild(mH.k);
    mH.nota = boton('', svgI(ICO_NOTA), 'Nota de texto', function () { pulsaO(o('nota')); }); her.appendChild(mH.nota);
    mH.goma = boton('', ico('goma'), 'Goma', function () { pulsaO(o('goma')); }); her.appendChild(mH.goma);
    her.appendChild(sep('s2'));
    mH.undo = boton('', ico('deshacer'), 'Deshacer', function () { pulsaO(o('undo')); }); her.appendChild(mH.undo);
    mH.clear = boton('lm-vl-borra', ico('trash'), 'Borrar todo', function () { pulsaO(o('clear')); }); her.appendChild(mH.clear);
    ['c0', 'c1', 'c2', 'c3', 'k', 'nota', 'goma'].forEach(function (t) { mH[t].setAttribute('aria-pressed', 'false'); });
    var esp = document.createElement('span'); esp.className = 'lm-vl-esp';
    var fin = document.createElement('div'); fin.className = 'lm-vl-fin';
    var bMax = boton('lm-vl-max', ico('expandir'), 'Pantalla completa', function () { alternarMax(); });
    var bX = boton('lm-vl-x', ico('x'), 'Cerrar', function () {
      var x = document.getElementById('tsVisorCerrar');
      if (x && ov.contains(x)) x.click(); else if (ov.__cerrar) ov.__cerrar(false); else ov.remove();
    });
    fin.appendChild(bMax); fin.appendChild(bX);
    var aviso = document.createElement('div'); aviso.className = 'lm-vl-aviso'; aviso.setAttribute('role', 'status'); aviso.textContent = '¿Borrar todo? Toca otra vez';
    nb.appendChild(g1); nb.appendChild(sep('s1')); nb.appendChild(her); nb.appendChild(esp); nb.appendChild(fin); nb.appendChild(aviso);
    var puntos = document.createElement('div'); puntos.className = 'lm-vl-puntos'; puntos.setAttribute('aria-label', 'Páginas');

    /* ---- lo de siempre, marcado para vestirlo ---- */
    host.classList.add('lm-vl-host');
    var cab = host.firstElementChild; if (cab && cab !== bar0) cab.classList.add('lm-vl-cab');
    Array.prototype.forEach.call(host.children, function (c) { if (c !== cab && c !== bar0 && /^Página \d+$/.test((c.textContent || '').trim())) c.classList.add('lm-vl-pag'); });
    var sal = document.getElementById('tsVisorCerrar2'); if (sal && sal.parentNode && sal.parentNode.parentNode === host) sal.parentNode.classList.add('lm-vl-salir');
    ov.insertBefore(nb, host); ov.appendChild(puntos);
    ov.classList.add('lm-vl');

    /* ---- la rueda nueva manda en la de siempre (oculta) ---- */
    var rueda = vlRueda(rh, VL_NOTAS, function (j) { ponNota(j); });
    function idxOrig() { var its = rueda0.querySelectorAll('.strip .item'); for (var i = 0; i < its.length; i++) if (its[i].classList.contains('sel')) return i; return VL_ORIG.length - 1; }
    function ponNota(j) {
      var h = VL_ORIG.indexOf(VL_NOTAS[j]); if (h < 0) return;
      var d = h - idxOrig(); if (!d) { pinta(); return; }
      window.__anotTickT = performance.now();   /* la rueda oculta no vuelve a sonar: ya ha sonado esta */
      try { rueda0.dispatchEvent(new WheelEvent('wheel', { deltaY: 40 * d, bubbles: true, cancelable: true })); } catch (e) {}
      pinta();
    }
    function on(el) { return !!(el && el.classList.contains('on')); }
    function tonTexto(j) {
      if (!j) return 'sin indicar';
      return VL_NOTAS[j] + (on(oTon('#')) ? '♯' : on(oTon('b')) ? '♭' : '') + (on(oTon('M')) ? ' Mayor' : on(oTon('m')) ? ' menor' : '');
    }
    function colocaAviso() {
      var r = mH.clear.getBoundingClientRect(), rb = nb.getBoundingClientRect(), w = aviso.offsetWidth || 180;
      var x = r.left + r.width / 2 - rb.left; x = Math.max(w / 2 + 6, Math.min(rb.width - w / 2 - 6, x));
      aviso.style.left = x + 'px';
    }
    function pinta() {
      if (!ov.isConnected) return;
      VL_HER.forEach(function (t) {
        var s = on(o(t)); mH[t].classList.toggle('on', s);
        if (t !== 'undo' && t !== 'clear') mH[t].setAttribute('aria-pressed', s ? 'true' : 'false');
      });
      var arm = /seguro/i.test(o('clear').textContent || '');
      mH.clear.classList.toggle('armado', arm); nb.classList.toggle('lm-vl-armado', arm);
      if (arm) colocaAviso();
      ['#', 'b', 'M', 'm'].forEach(function (k) { var s = on(oTon(k)); mT[k].classList.toggle('on', s); mT[k].setAttribute('aria-pressed', s ? 'true' : 'false'); });
      var j = VL_NOTAS.indexOf(VL_ORIG[idxOrig()]); if (j < 0) j = 0;
      if (!rueda.ocupada() && rueda.idx() !== j) rueda.fija(j, true);
      rh.classList.toggle('con-nota', j > 0);
      var tx = tonTexto(j); rh.setAttribute('aria-valuetext', tx); rh.title = 'Tonalidad: ' + tx;
    }
    var rafP = 0;
    var mo = new MutationObserver(function () { if (!ov.isConnected) { limpia(); return; } if (!rafP) rafP = requestAnimationFrame(function () { rafP = 0; pinta(); }); });
    mo.observe(bar0, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class'] });

    /* ---- pantalla completa: cada página entera en la pantalla ---- */
    var maxFS = false, enAjuste = false;
    function wraps() { return Array.prototype.slice.call(host.querySelectorAll('.anot-wrap')); }
    function esMax() { return ov.classList.contains('lm-vl-max'); }
    function ajusta() {
      if (!ov.isConnected) return;
      var bh = nb.offsetHeight; ov.style.setProperty('--vl-bar-h', bh + 'px');
      var cs = getComputedStyle(host);
      var disW = host.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
      var disH = ov.clientHeight - bh - 16, max = esMax();
      wraps().forEach(function (w) {
        var im = w.querySelector('img');
        if (!max || !im || !im.naturalWidth) { if (im) im.style.width = '100%'; w.style.width = ''; return; }
        var a = Math.floor(Math.min(disW, disH * im.naturalWidth / im.naturalHeight, im.naturalWidth * 1.5));
        im.style.width = a + 'px'; w.style.width = a + 'px';
      });
      enAjuste = true; try { window.dispatchEvent(new Event('resize')); } catch (e) {} enAjuste = false;   /* los trazos se vuelven a pintar a su tamaño */
      rueda.pos(); pintaPuntos();
    }
    function paginaVisible() {
      var ws = wraps(); if (!ws.length) return 0;
      var ref = nb.getBoundingClientRect().bottom + 8, best = 0, bd = Infinity;
      ws.forEach(function (w, i) { var r = w.getBoundingClientRect(); var d = (r.top <= ref && r.bottom > ref) ? -1 : Math.abs(r.top - ref); if (d < bd) { bd = d; best = i; } });
      return best;
    }
    function irA(k) {
      var w = wraps()[k]; if (!w) return;
      var dy = w.getBoundingClientRect().top - nb.getBoundingClientRect().bottom - 8;
      ov.scrollTop = Math.max(0, ov.scrollTop + dy);
    }
    function pintaMax() {
      var m = esMax(); bMax.innerHTML = ico(m ? 'contraer' : 'expandir');
      bMax.title = m ? 'Salir de pantalla completa' : 'Pantalla completa'; bMax.setAttribute('aria-label', bMax.title);
    }
    function pintaPuntos() {
      var ws = wraps(), n = ws.length;
      puntos.classList.toggle('varias', n > 1);
      if (puntos.children.length !== n) {
        puntos.innerHTML = '';
        ws.forEach(function (w, i) {
          var p = document.createElement('button'); p.type = 'button'; p.className = 'lm-vl-punto';
          p.title = 'Página ' + (i + 1); p.setAttribute('aria-label', p.title);
          p.addEventListener('click', function (e) { e.preventDefault(); irA(i); });
          puntos.appendChild(p);
        });
      }
      var k = paginaVisible(); Array.prototype.forEach.call(puntos.children, function (p, i) { p.classList.toggle('on', i === k); });
    }
    function entrarMax() {
      var pag = paginaVisible();
      ov.classList.add('lm-vl-max'); pintaMax();
      wraps().forEach(function (w) {
        var im = w.querySelector('img'); if (!im) return;
        try { im.loading = 'eager'; } catch (e) {}
        if (!im.complete || !im.naturalWidth) im.addEventListener('load', function () { if (esMax()) { ajusta(); } }, { once: true });
      });
      var yaFS = !!(document.fullscreenElement || document.webkitFullscreenElement);
      var rq = ov.requestFullscreen || ov.webkitRequestFullscreen;
      if (!yaFS && rq) {
        try { var p = rq.call(ov); maxFS = true; if (p && p.catch) p.catch(function () { maxFS = false; }); } catch (e) { maxFS = false; }
      }
      ajusta(); irA(pag);
      setTimeout(function () { if (esMax()) { ajusta(); irA(pag); } }, 150);   /* al entrar en pantalla completa cambia el tamaño */
    }
    function salirMax(yaFuera) {
      var pag = paginaVisible();
      ov.classList.remove('lm-vl-max'); pintaMax();
      var fs = document.fullscreenElement || document.webkitFullscreenElement;
      if (!yaFuera && maxFS && fs === ov) { try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) {} }
      maxFS = false;
      ajusta(); irA(pag);
      setTimeout(function () { if (!esMax() && ov.isConnected) { ajusta(); irA(pag); } }, 150);
    }
    function alternarMax() { if (esMax()) salirMax(); else entrarMax(); }
    function alRedimensionar() { if (enAjuste) return; if (!ov.isConnected) { limpia(); return; } rueda.pos(); if (esMax()) ajusta(); if (nb.classList.contains('lm-vl-armado')) colocaAviso(); }
    function alCambiarFS() {
      if (!ov.isConnected) { limpia(); return; }
      var fs = document.fullscreenElement || document.webkitFullscreenElement;
      if (!fs && maxFS && esMax()) { maxFS = false; salirMax(true); } else setTimeout(function () { if (esMax()) ajusta(); }, 80);
    }
    function alTecla(e) {
      if (!ov.isConnected) { limpia(); return; }
      if (e.key === 'Escape' && esMax()) { e.preventDefault(); salirMax(); }
    }
    var rafS = 0;
    function alDesplazar() { if (!esMax() || rafS) return; rafS = requestAnimationFrame(function () { rafS = 0; pintaPuntos(); }); }
    window.addEventListener('resize', alRedimensionar);
    document.addEventListener('fullscreenchange', alCambiarFS); document.addEventListener('webkitfullscreenchange', alCambiarFS);
    document.addEventListener('keydown', alTecla);
    ov.addEventListener('scroll', alDesplazar, { passive: true });
    function limpia() {
      try { mo.disconnect(); } catch (e) {}
      window.removeEventListener('resize', alRedimensionar);
      document.removeEventListener('fullscreenchange', alCambiarFS); document.removeEventListener('webkitfullscreenchange', alCambiarFS);
      document.removeEventListener('keydown', alTecla);
    }
    vlActual = { ov: ov, limpia: limpia };
    pinta(); pintaMax();
    requestAnimationFrame(function () { rueda.pos(); ov.style.setProperty('--vl-bar-h', nb.offsetHeight + 'px'); });
  }
  try { new MutationObserver(function () { visorLecciones(); }).observe(document.body, { childList: true }); } catch (e) {}
  try { new MutationObserver(function () { librosMax(); }).observe(document.body, { childList: true }); } catch (e) {}   /* (28-sep) el visor de Libros se crea al abrirlo */

  /* ---------- 13 (28-sep-2026, Iago) BIENVENIDA a la estética nueva: una sola vez por cuenta ----------
     «para cuando haya el cambio estético, aparezca una ventana de bienvenida o algo así que ponga: Hemos hecho una
     reforma estética, espero que te guste! Por lo demás todo funciona igual que hasta ahora. Un abrazo, Iago».
     Sale con la sesión abierta y la portada a la vista (sin la puerta de entrada ni el aviso del móvil, sin la visita
     guiada ni otra ventana encima). Queda apuntado en el aparato: localStorage «lm_piel_bienvenida:<cuenta>».
     Para volver a verla: ?bienvenida=1 en la dirección. */
  var _bvHecha = false;
  function bienvenida() {
    if (_bvHecha || document.getElementById('lm-bv')) return;
    var gp = document.documentElement.classList.contains('lm-gp');
    var s = null; try { s = JSON.parse(localStorage.getItem(gp ? 'lmpro_session' : 'lmeav_session') || 'null'); } catch (e) {}
    var id = s && (s.id || s.cuenta_id); if (!id) return;
    if (/visor=/.test(location.hash || '')) return;                        /* el Ojeador del Diario: nunca */
    var forzar = /[?&]bienvenida=1(&|$)/.test(location.search);
    var K = 'lm_piel_bienvenida:' + id;
    try { if (!forzar && localStorage.getItem(K)) { _bvHecha = true; return; } } catch (e) { return; }
    var gate = document.getElementById('gate');                              /* la puerta (o el aviso del móvil) a la vista */
    if (gate && gate.classList.contains('show') && !gate.classList.contains('hide') && getComputedStyle(gate).display !== 'none') return;
    if (!document.querySelector('.wrap .apps .app-card')) return;
    /* que no haya otra ventana encima: la primera tarjeta (o, si no está a la vista, la barra de arriba) se puede pulsar */
    function tapado(el) {
      if (!el) return null;
      var r = el.getBoundingClientRect(); if (r.bottom < 4 || r.top > innerHeight - 4 || r.width < 4) return null;
      var x = Math.min(innerWidth - 2, Math.max(1, r.left + r.width / 2)), y = Math.min(innerHeight - 2, Math.max(1, r.top + Math.min(r.height / 2, 40)));
      var t = document.elementFromPoint(x, y); return !(t && (t === el || el.contains(t)));
    }
    var tc = tapado(document.querySelector('.wrap .apps .app-card'));
    if (tc === true) return;
    if (tc === null && tapado(document.querySelector('.topbar')) !== false) return;
    _bvHecha = true;
    try { localStorage.setItem(K, new Date().toISOString()); } catch (e) {}
    var d = document.createElement('div');
    d.id = 'lm-bv'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-labelledby', 'lm-bv-t');
    d.innerHTML = '<div class="lm-bv-card">' +
      '<div class="lm-bv-ico">' + ico('palette') + '</div>' +
      '<p class="lm-bv-p1" id="lm-bv-t">Hemos hecho una reforma estética.<br><b>¡Espero que te guste!</b></p>' +
      '<p class="lm-bv-p2">Por lo demás, todo funciona igual que hasta ahora.</p>' +
      '<p class="lm-bv-firma">Un abrazo,<br>Iago</p>' +
      '<button type="button" class="lm-bv-ok">¡Vamos!</button>' +
      '</div>';
    function cerrar() { document.removeEventListener('keydown', tecla, true); d.classList.add('lm-bv-fuera'); setTimeout(function () { d.remove(); }, 180); }
    function tecla(e) { if (e.key === 'Escape' || e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); cerrar(); } }
    d.addEventListener('click', function (e) { if (e.target === d || (e.target.closest && e.target.closest('.lm-bv-ok'))) cerrar(); });
    document.addEventListener('keydown', tecla, true);
    document.body.appendChild(d);
    try { var cj = d.querySelector('.lm-bv-card'); cj.setAttribute('tabindex', '-1'); cj.focus({ preventScroll: true }); } catch (e) {}   /* el foco en la ventana (sin anillo en el botón) */
  }

  /* ---------- 14 (29-sep-2026, Iago): CAMPANA TRANQUILA ----------
     «Que la campana solo haga la animación de ondas expansivas durante cinco segundos; después, que mantenga el
     numerito de las cosas pendientes pero sin estar ahí animando, porque es una desconcentración.»
     Se anima 5 s al entrar al portal y cada vez que SUBE el número (llega algo nuevo); si baja o no cambia, quieta.
     La clase lm-calma para las ondas (::before/::after) y el balanceo; el numerito rojo no se toca.
     Sirve para cualquier icono con avisos que use las mismas clases (hay-avisos / ficha-pendiente). */
  var CALMA_MS = 5000;
  function calmaIcono(el, cuenta) {
    if (!el || el._lmCalma) return;
    var st = el._lmCalma = { n: 0, cl: '', hasta: 0, t: null };
    function activas() { return ['hay-avisos', 'ficha-pendiente'].filter(function (c) { return el.classList.contains(c); }).join(' '); }
    function revisar() {
      var n = cuenta(), cl = activas();
      var nuevo = !!cl && (n > st.n || cl.split(' ').some(function (c) { return c && (' ' + st.cl + ' ').indexOf(' ' + c + ' ') < 0; }));
      st.n = n; st.cl = cl;
      if (nuevo) { st.hasta = Date.now() + CALMA_MS; clearTimeout(st.t); st.t = setTimeout(revisar, CALMA_MS + 60); }
      var calma = Date.now() >= st.hasta;
      if (el.classList.contains('lm-calma') !== calma) el.classList.toggle('lm-calma', calma);
    }
    revisar();
    try { new MutationObserver(revisar).observe(el, { attributes: true, attributeFilter: ['class'], childList: true, characterData: true, subtree: true }); } catch (e) {}
  }
  function campanaCalma() {
    var b = document.getElementById('alu-campana-btn'); if (!b) return;
    calmaIcono(b, function () {
      var bd = document.getElementById('alu-campana-badge');
      if (!bd || bd.classList.contains('hidden')) return 0;
      var n = parseInt(bd.textContent, 10); return isNaN(n) ? 0 : n;
    });
  }
  try { window.LMCalmaIcono = calmaIcono; } catch (e) {}

  /* ---------- 15 (29-sep-2026, Iago): MOROSOS · SOLO Tester/Protester ----------
     «Los morosos, fuera de la escaleta del Diario: un icono con globito en Tester y Protester». Cuadrado rojo con ⚠, a la
     IZQUIERDA de todo (antes del Pentagrama). El globito: cuántos alumnos del GRUPO QUE ESTÁ EN CLASE AHORA (de 30 min
     antes de empezar hasta que acaba, según el horario del Diario) tienen una ficha DIGITAL en la semana de gracia (solo
     fichas; los quizzes no). Al tocarlo, la lista (primero el grupo en clase); al cerrarla, el icono se queda sin globito
     hasta la próxima clase de ese grupo (visto por grupo y día, en este aparato). Las ondas, solo 5 s (como la campana).
     Los datos: suite_morosos_fichas_token con la llave «lm_profe» que deja el Diario en este navegador (derivada del
     secreto, solo sirve para esto). Si este navegador no ha abierto el Diario, no hay llave y el icono no sale. */
  var MOR = { d: null, t: 0, cargando: false, panel: null };
  var MOR_SB = 'https://woiptkyrxkbpnvioypit.supabase.co';
  var MOR_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvaXB0a3lyeGticG52aW95cGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NzI2ODYsImV4cCI6MjA5MjA0ODY4Nn0.B2nKgj5rD0rkdLeMIrd9KgD8lUPWsBT4Y7aCtmnvbjA';
  function llaveProfe() { var m = /(?:^|;\s*)lm_profe=([0-9a-f]{64})(?:;|$)/.exec(document.cookie || ''); return m ? m[1] : null; }
  function delPortal(g) { return GP ? /gp/i.test(String(g || '')) : !/gp/i.test(String(g || '')); }
  function hoyISO() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function minutos(hhmm) { var m = /^(\d{1,2}):(\d{2})/.exec(String(hhmm || '')); return m ? (+m[1]) * 60 + (+m[2]) : NaN; }
  /* grupos de este portal que están en clase ahora: de 30 min antes de empezar hasta que acaba */
  function gruposEnClase() {
    var d = MOR.d; if (!d || !Array.isArray(d.horario)) return [];
    var ahora = new Date(), dia = ((ahora.getDay() + 6) % 7) + 1, min = ahora.getHours() * 60 + ahora.getMinutes();
    var out = [];
    d.horario.forEach(function (h) {
      if (!h || +h.dia !== dia || !delPortal(h.grupo)) return;
      var ini = minutos(h.ini), fin = minutos(h.fin);
      if (isFinite(ini) && isFinite(fin) && min >= ini - 30 && min <= fin && out.indexOf(h.grupo) < 0) out.push(h.grupo);
    });
    return out;
  }
  function morososDe(grupo) {   /* [{nombre, fichas:[{numero,titulo,fin_gracia}]}] */
    var por = {};
    ((MOR.d && MOR.d.fichas) || []).forEach(function (f) {
      if (!f || f.grupo !== grupo) return;
      (por[f.nombre] = por[f.nombre] || { nombre: f.nombre, fichas: [] }).fichas.push(f);
    });
    return Object.keys(por).sort(function (a, b) { return a.localeCompare(b, 'es'); }).map(function (k) { return por[k]; });
  }
  function claveVisto(g) { return 'lm_morosos_visto:' + g + '|' + hoyISO(); }
  function visto(g) { try { return localStorage.getItem(claveVisto(g)) === '1'; } catch (e) { return false; } }
  function marcarVisto(gs) { gs.forEach(function (g) { try { localStorage.setItem(claveVisto(g), '1'); } catch (e) {} }); }
  function cuentaMorosos() {
    return gruposEnClase().filter(function (g) { return !visto(g); }).reduce(function (s, g) { return s + morososDe(g).length; }, 0);
  }
  function cargarMorosos() {
    var k = llaveProfe(); if (!k || MOR.cargando) return;
    if (MOR.d && Date.now() - MOR.t < 120000) return;
    MOR.cargando = true;
    fetch(MOR_SB + '/rest/v1/rpc/suite_morosos_fichas_token', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: MOR_ANON, Authorization: 'Bearer ' + MOR_ANON }, body: JSON.stringify({ p_token: k }) })
      .then(function (r) { return r.json(); })
      .then(function (d) { if (d && d.ok) { MOR.d = d; MOR.t = Date.now(); pintarMorosos(); } else { MOR.t = Date.now(); } })
      .catch(function () { MOR.t = Date.now() - 90000; })
      .then(function () { MOR.cargando = false; });
  }
  function fechaCorta(iso) { var d = new Date(iso); return isNaN(d) ? '' : ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2); }
  function cerrarPanelMorosos() {
    var p = MOR.panel; if (!p) return;
    MOR.panel = null; if (p.parentNode) p.parentNode.removeChild(p);
    var b = document.querySelector('#lm-morosos .lm-ic'); if (b) b.setAttribute('aria-expanded', 'false');
    marcarVisto(gruposEnClase());   /* cerrada la lista, el globito de ese grupo no vuelve hasta su próxima clase */
    pintarMorosos();
  }
  function abrirPanelMorosos(btn) {
    if (MOR.panel) { cerrarPanelMorosos(); return; }
    cerrarMenu();
    var enClase = gruposEnClase();
    var grupos = [];
    ((MOR.d && MOR.d.fichas) || []).forEach(function (f) { if (f && delPortal(f.grupo) && grupos.indexOf(f.grupo) < 0) grupos.push(f.grupo); });
    enClase.forEach(function (g) { if (grupos.indexOf(g) < 0) grupos.push(g); });
    grupos.sort(function (a, b) { return (enClase.indexOf(b) >= 0) - (enClase.indexOf(a) >= 0) || a.localeCompare(b, 'es'); });
    var p = document.createElement('div'); p.className = 'lm-mor-panel'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', 'Morosos · fichas en la semana de gracia');
    var h = '<div class="lm-mor-tit">Fichas en la semana de gracia</div>';
    if (!grupos.length) h += '<div class="lm-mor-vacio">Nadie debe ninguna ficha.</div>';
    grupos.forEach(function (g) {
      var L = morososDe(g);
      h += '<div class="lm-mor-grupo"><div class="lm-mor-g">' + esc(g) + (enClase.indexOf(g) >= 0 ? '<span class="lm-mor-ahora">en clase</span>' : '') + '</div>';
      if (!L.length) h += '<div class="lm-mor-vacio">Nadie debe ninguna ficha.</div>';
      L.forEach(function (a) {
        h += '<div class="lm-mor-alu"><span class="lm-mor-n">' + esc(a.nombre) + '</span>' + a.fichas.map(function (f) {
          return '<span class="lm-mor-f">Ficha ' + esc(f.numero) + (f.fin_gracia ? ' · hasta el ' + fechaCorta(f.fin_gracia) : '') + '</span>';
        }).join('') + '</div>';
      });
      h += '</div>';
    });
    p.innerHTML = h;
    /* en el <body>: la barra de arriba es de cristal (backdrop-filter) y dentro de ella «fixed» no sería la pantalla */
    document.body.appendChild(p); MOR.panel = p; btn.setAttribute('aria-expanded', 'true');
    colocarPanelMorosos();
  }
  /* la lista, debajo del icono y siempre dentro de la pantalla */
  function colocarPanelMorosos() {
    var p = MOR.panel, b = document.querySelector('#lm-morosos .lm-ic'); if (!p || !b) return;
    var r = b.getBoundingClientRect(), w = p.offsetWidth || 320;
    p.style.top = Math.round(r.bottom + 8) + 'px';
    p.style.left = Math.round(Math.max(12, Math.min(r.left, window.innerWidth - w - 12))) + 'px';
  }
  window.addEventListener('resize', colocarPanelMorosos);
  document.addEventListener('click', function (e) {
    if (MOR.panel && !MOR.panel.contains(e.target) && !(e.target.closest && e.target.closest('#lm-morosos'))) cerrarPanelMorosos();
  }, true);
  document.addEventListener('keydown', function (e) { if (MOR.panel && (e.key === 'Escape' || e.key === 'Esc')) cerrarPanelMorosos(); });
  function pintarMorosos() {
    var bell = document.getElementById('alu-campana-btn'); if (!bell || !bell.parentNode) return;
    var host = bell.parentNode, w = document.getElementById('lm-morosos');
    if (!(esProfe() && llaveProfe())) { if (w && w.parentNode) { cerrarPanelMorosos(); w.parentNode.removeChild(w); } return; }
    cargarMorosos();
    if (!MOR.d) return;
    if (!w) {
      w = cuadro('lm-ic-morosos', 'alert', 'Morosos · fichas en la semana de gracia', function (b) { abrirPanelMorosos(b); }, true);
      w.id = 'lm-morosos';
    }
    if (w.parentNode !== host) host.insertBefore(w, host.firstChild);
    var b = w.querySelector('.lm-ic'); if (!b) return;
    var n = cuentaMorosos(), bd = b.querySelector('.lm-ic-badge');
    if (n > 0) {
      if (!bd) { bd = document.createElement('span'); bd.className = 'lm-ic-badge'; bd.setAttribute('aria-hidden', 'true'); b.appendChild(bd); }
      if (bd.textContent !== String(n)) bd.textContent = String(n);
    } else if (bd) bd.parentNode.removeChild(bd);
    if (b.classList.contains('hay-avisos') !== (n > 0)) b.classList.toggle('hay-avisos', n > 0);
    b.title = n > 0 ? (n === 1 ? '1 alumno del grupo en clase debe una ficha' : n + ' alumnos del grupo en clase deben fichas') : 'Morosos · fichas en la semana de gracia';
    b.setAttribute('aria-label', b.title);
    try { calmaIcono(b, function () { var x = b.querySelector('.lm-ic-badge'); return x ? (parseInt(x.textContent, 10) || 0) : 0; }); } catch (e) {}
  }
  setInterval(function () { try { pintarMorosos(); } catch (e) {} }, 60000);   /* la hora de clase cambia sola */

  function todo() {
    try { campanaCalma(); } catch (e) {}
    try { tarjetas(); } catch (e) {} try { misResultados(); } catch (e) {} try { hileraTester(); } catch (e) {}
    try { carrusel(); } catch (e) {} try { pie(); } catch (e) {} try { colorNavegador(); } catch (e) {}
    try { cartelGrado(); } catch (e) {}
    try { hileraIconos(); } catch (e) {}
    try { cuadroPantalla(); } catch (e) {}
    try { pintarMorosos(); } catch (e) {}
    try { visorLecciones(); } catch (e) {}
    try { librosMax(); } catch (e) {}
    try { bienvenida(); } catch (e) {}
  }
  todo();
  var n = 0, t = setInterval(function () { todo(); if (++n > 240) clearInterval(t); }, 500);
  try { new MutationObserver(function () { todo(); }).observe(document.querySelector('.topbar') || document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] }); } catch (e) {}
})();
