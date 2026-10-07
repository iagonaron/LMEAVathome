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
   15) (29-sep-2026) MOROSOS solo durante la clase del grupo que debe algo (ver la sección 15, al final).
       (29-sep-2026, tarde) también los de PAPEL sin nota («en papel» y botón «Ya entregó») y los CEROS (calavera).
   16) (29-sep-2026, Iago) ATAJOS EN LA MISMA VENTANA (solo Tester/Protester): las pantallas de Resultados de las apps
       de corrección se abren DENTRO del portal, con una ✕ arriba a la derecha (o Esc) para volver. Y el «Ampliar» de
       Libros es ya del propio visor: la sección 10 se queda quieta si lo encuentra.
   17) (29-sep-2026, tarde) LIBRO DE ENTONACIÓN (solo Tester, GE): el cuadro de la clave de sol da «Lección activa · N»
       (el libro abierto por la lección de la semana, con dos vistas y la barra de anotar) y «Resultados». Y la punta
       fina de las lecciones de ritmo pasa a VERDE («que el puntero opaco de ritmo sea verde»).
   18) (30-sep-2026) MÚSICA (solo Tester/Protester, GE y GP): una tira debajo de «Bienvenido/a…» con ▶, barras que se
       mueven con lo que suena y el título y el autor; 30 temas de Kevin MacLeod (CC BY 4.0) en ge.lmathome.es/musica/.
       El ▶ invita a pulsarlo (ondas y una corchea) desde 5 minutos antes de cada clase hasta el minuto 5.
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
     y «Resultados») · Entonación (clave de sol, GE: «Lección activa · N» y «Resultados», sección 17) · Dictado activo (diapasón con
     «Nº x») · Sorteo (si está).
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
    /* (2-oct-2026, Iago) «marco FaActos y me abre Intervalia de primeras»: si el visor del portal sabe abrir un libro
       concreto (LibrosAula.abrir(botón, tipo)), se le pide ese y no se baja antes el primero de la lista. Si el portal
       aún no lo trae, lo de siempre: abrir y pasar a su pestaña. */
    try {
      if (window.LibrosAula && typeof window.LibrosAula.abrir === 'function' && window.LibrosAula.abrir.length >= 2) {
        window.LibrosAula.abrir(q('#lb-mini .da-btn'), tipo);
        return;
      }
    } catch (e) {}
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
    /* (29-sep-2026, tarde) GE: «Lección activa · N» (el libro de entonación, sección 17) y «Resultados» */
    if (resE) {
      barra.appendChild(cuadro('lm-ic-ento', 'clavesol', GP ? 'Entonación · resultados' : 'Entonación · lección activa y resultados', function (b) {
        if (GP) { pulsa(q('#rs-mini .rs-btn.azul')); return; }
        menuEntonacion(b);
      }, !GP));
      if (!GP) { try { enCargar(); } catch (e) {} }   /* así el número ya está al abrir el menú */
    }
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
    if (document.getElementById('lb-amp')) return;   /* (29-sep-2026) el visor de Libros ya trae su botón «Ampliar» */
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
  /* (1-oct-2026, Iago) imprescindibles para vestir la barra: punta fina, goma, deshacer y borrar todo. Los rotuladores (en ritmo,
     verde y gris), △/U, las alertas y la nota se ponen si la barra del portal los trae: sirve igual con un portal sin actualizar. */
  var VL_HER = ['k', 'goma', 'undo', 'clear'];
  var VL_COL = [['c0', 'Subrayar en amarillo'], ['c1', 'Subrayar en verde'], ['c2', 'Subrayar en rosa'], ['c3', 'Subrayar en azul'], ['c4', 'Subrayar en gris']];
  /* (1-oct-2026, Iago) △/U: el triángulo (subdivisión ternaria) y la U (binaria), como en las intros */
  var ICO_PT = '<svg class="lm-vl-pt-i" viewBox="0 0 26 20" aria-hidden="true"><path d="M2.6 15.6h8.6L6.9 8Z"/><path d="M15 8v7.6h8.6V8"/></svg>';
  /* (1-oct-2026, Iago) ALERTAS amarilla y roja: discretas (blancas, con un toque de su color) y, al activarse, rellenas de su
     color. Opcionales: si la barra de siempre aún no las trae (un portal sin actualizar), la hilera sale como antes. */
  var VL_AL = [['aa', 'a', 'Alerta amarilla · toca: aviso · arrastra: zona'], ['ar', 'r', 'Alerta roja · toca: aviso · arrastra: zona difícil']];
  function icoAlerta() { return '<svg class="lm-al-i" viewBox="0 0 24 24" aria-hidden="true"><path class="lm-al-tri" d="M12 3.4L21.4 19.6H2.6Z"/><path class="lm-al-exc" d="M12 9.3v4.9"/><circle class="lm-al-pto" cx="12" cy="16.9" r="1.2"/></svg>'; }
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
    /* (6-oct-2026, noche, 3) CON EL DEDO O EL ROTULADOR, EL BOTÓN ACTÚA AL LEVANTAR, sin esperar al «clic».
       El «clic» de un toque lo fabrica el navegador después, y a veces no lo fabrica: en el banco de pruebas, un toque en
       una herramienta justo después de pasar la goma (menos de un segundo) llegaba a la página (bajar y levantar) pero
       sin «clic», y la herramienta no cambiaba. Tampoco lo fabrica si la pantalla cree que hay otro dedo apoyado (la
       mano al escribir, o un toque «fantasma» del marco táctil): entonces ningún botón responde. Ahora el botón no
       depende de eso: actúa cuando el dedo se levanta encima de él (aunque haya otro dedo apoyado en otra parte) y, si
       luego llega el «clic» del navegador, se ignora para no actuar dos veces. Con ratón o teclado, como siempre.
       DE MOMENTO SOLO EN Tester/Protester (conDedo): a los alumnos no se les cambia nada hasta verlo funcionar en el
       aula. Para dárselo a todos: conDedo = true. */
    var conDedo = esProfe();
    function boton(clase, html, titulo, fn) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'lm-vl-b' + (clase ? ' ' + clase : '');
      b.innerHTML = html; b.title = titulo; b.setAttribute('aria-label', titulo);
      var baja = null, hecho = 0;
      function hacer() { fn(b); try { b.blur(); } catch (er) {} }
      b.addEventListener('pointerdown', function (e) {
        if (!conDedo || (e.pointerType !== 'touch' && e.pointerType !== 'pen')) { baja = null; return; }
        baja = { id: e.pointerId, x: e.clientX, y: e.clientY, t: Date.now() };
      });
      b.addEventListener('pointerup', function (e) {
        var p = baja; baja = null;
        if (!p || e.pointerId !== p.id) return;
        if (Math.abs(e.clientX - p.x) > 24 || Math.abs(e.clientY - p.y) > 24 || Date.now() - p.t > 1500) return;   /* se arrastró o se quedó apoyado: no es un toque */
        var r = b.getBoundingClientRect(); if (e.clientX < r.left - 6 || e.clientX > r.right + 6 || e.clientY < r.top - 6 || e.clientY > r.bottom + 6) return;
        hecho = Date.now(); hacer();
        try { tragaArma(b); } catch (er) {}   /* el «clic» de este mismo toque no debe caer en lo que quede debajo */
      });
      b.addEventListener('pointercancel', function () { baja = null; });
      b.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        if (Date.now() - hecho < 800) return;   /* ya actuó al levantar el dedo */
        hacer();
      });
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
    function titO(el, def) { return (el && (el.getAttribute('title') || el.getAttribute('aria-label'))) || def; }
    /* la punta fina: (29-sep) verde; (1-oct-2026, Iago) «una punta fina y opaca que será de color negro» (con un portal sin
       actualizar, sigue saliendo verde). «La punta fina la primera, después verde, gris y luego las exclamaciones», como en entonación */
    var kNegra = /negra/i.test(titO(o('k'), ''));
    mH.k = boton('lm-vl-col', '<span class="lm-vl-sw lm-vl-fina' + (kNegra ? ' lm-vl-fina-n' : '') + '"><i></i></span>', titO(o('k'), 'Punta fina'), function () { pulsaO(o('k')); }); her.appendChild(mH.k);
    VL_COL.forEach(function (d) {   /* (1-oct-2026) los rotuladores que traiga la barra, con su muestra de color */
      var ob = o(d[0]); if (!ob) return;
      var sw = ob.querySelector('.anot-sw'), col = (sw && sw.style.backgroundColor) || '#888';
      mH[d[0]] = boton('lm-vl-col', '<span class="lm-vl-sw" style="background:' + col + '"></span>', titO(ob, d[1]), function () { pulsaO(o(d[0])); });
      her.appendChild(mH[d[0]]);
    });
    if (o('pt')) { mH.pt = boton('lm-vl-col lm-vl-pt', ICO_PT, titO(o('pt'), 'Triángulo y U'), function () { pulsaO(o('pt')); }); her.appendChild(mH.pt); }   /* (1-oct-2026) △/U, a la izquierda de la alerta amarilla */
    VL_AL.forEach(function (d) {   /* (1-oct-2026) las dos alertas, a la derecha de la punta fina */
      if (!o(d[0])) return;
      mH[d[0]] = boton('lm-vl-al lm-vl-al-' + d[1], icoAlerta(), d[2], function () { pulsaO(o(d[0])); });
      mH[d[0]].setAttribute('aria-pressed', 'false'); her.appendChild(mH[d[0]]);
    });
    if (mH.aa || mH.ar) { var br = document.createElement('span'); br.className = 'lm-vl-br'; br.setAttribute('aria-hidden', 'true'); her.appendChild(br); }   /* en el móvil, aquí empieza otra fila */
    if (o('nota')) { mH.nota = boton('', svgI(ICO_NOTA), 'Nota de texto', function () { pulsaO(o('nota')); }); her.appendChild(mH.nota); }   /* (1-oct-2026) en ritmo ya no hay nota */
    mH.goma = boton('', ico('goma'), 'Goma', function () { pulsaO(o('goma')); }); her.appendChild(mH.goma);
    her.appendChild(sep('s2'));
    mH.undo = boton('', ico('deshacer'), 'Deshacer', function () { pulsaO(o('undo')); }); her.appendChild(mH.undo);
    mH.clear = boton('lm-vl-borra', ico('trash'), 'Borrar todo', function () { pulsaO(o('clear')); }); her.appendChild(mH.clear);
    Object.keys(mH).forEach(function (t) { if (t !== 'undo' && t !== 'clear') mH[t].setAttribute('aria-pressed', 'false'); });
    /* (1-oct-2026) en ritmo ya son 9 botones: en el móvil caben en una fila (sin el salto de las 11 de antes) */
    if (br && Object.keys(mH).length <= 9 && br.parentNode) br.parentNode.removeChild(br);
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
      Object.keys(mH).forEach(function (t) {   /* (1-oct-2026) los botones que haya */
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
    /* (6-oct-2026, noche, 3) Con una herramienta puesta, lo que el dedo hace sobre la página es un trazo y nada más: se
       le dice al navegador en el propio toque (además del touch-action que ya llevaba el lienzo), para que no lo
       convierta en gestos suyos (desplazar, lanzar, toque) que luego estorban al toque siguiente. No cambia cómo se
       pinta ni cómo se guarda: de eso se sigue encargando el portal. */
    function consumeToque(e) {
      var t = e.target;
      if (t && t.classList && t.classList.contains('anot-canvas') && t.parentNode && t.parentNode.classList.contains('dibujo') && e.cancelable) e.preventDefault();
    }
    if (conDedo) { try { ov.addEventListener('touchstart', consumeToque, { passive: false }); ov.addEventListener('touchmove', consumeToque, { passive: false }); } catch (e) {} }
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
     Para volver a verla: ?bienvenida=1 en la dirección. (29-sep-2026) Desde el lunes 6-oct-2026 ya no sale a nadie. */
  var _bvHecha = false;
  function bienvenida() {
    if (_bvHecha || document.getElementById('lm-bv')) return;
    var gp = document.documentElement.classList.contains('lm-gp');
    var s = null; try { s = JSON.parse(localStorage.getItem(gp ? 'lmpro_session' : 'lmeav_session') || 'null'); } catch (e) {}
    var id = s && (s.id || s.cuenta_id); if (!id) return;
    if (/visor=/.test(location.hash || '')) return;                        /* el Ojeador del Diario: nunca */
    var forzar = /[?&]bienvenida=1(&|$)/.test(location.search);
    /* (29-sep-2026, Iago) «a partir del 6 de octubre, por si acaso»: desde el lunes 6-oct-2026 (00:00, hora del aparato)
       ya no sale a nadie, lo haya visto o no. Con ?bienvenida=1 se puede seguir viendo. */
    if (!forzar && Date.now() >= new Date(2026, 9, 6).getTime()) { _bvHecha = true; return; }
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
     antes de empezar hasta que acaba, según el horario del Diario) deben una ficha (solo fichas; los quizzes no). Al
     tocarlo, la lista (primero el grupo en clase); al cerrarla, el icono se queda sin globito hasta la próxima clase de
     ese grupo (visto por grupo y día, en este aparato). Las ondas, solo 5 s (como la campana).
     Los datos: con la llave «lm_profe» que deja el Diario en este navegador (derivada del secreto, solo sirve para
     esto). Si este navegador no ha abierto el Diario, no hay llave y el icono no sale.
     (6-oct-2026, Iago: «acabo de hacerlo en clase y no aparece») ESO YA NO ES ASÍ. En clase el Diario va en el iPad y
     el portal se enseña en el ordenador del aula, que nunca ha abierto el Diario: sin llave, el icono no salía nunca
     allí. Ahora, si la cuenta es Tester o Protester y no hay llave (o la que hay ya no vale porque se cambió la clave
     de la suite), el portal se la pide a la base CON LA PROPIA CUENTA (suite_morosos_llave_cuenta: solo responde a
     las cuentas del profe apuntadas en suite_config.cuentas_profe) y la guarda igual que el Diario. El icono sale en
     cualquier aparato donde se haya entrado como Tester o Protester. Para volver atrás: quitar pedirLlave() y sus
     llamadas (y, en la base, la función y la columna).
     (29-sep-2026, más tarde) El icono SOLO está durante la clase de un grupo que debe algo (de 30 min antes a que
     acaba); si nadie de los grupos en clase debe nada, no aparece. Tras ver la lista, sigue ahí sin globito.
     (6-oct-2026, 17:10, Iago) Sin la media hora de antes: de la hora de inicio de la clase a la de fin.
     (6-oct-2026, 17:50, Iago) Desde 5 minutos antes de cada clase, a la vez que el ▶ de la música (ver gruposEnClase).
     (6-oct-2026, 18:05, Iago) La lista enseña SOLO el grupo que está en clase, no los demás (ver pintarPanelMorosos).
     (29-sep-2026, tarde, Iago) PAPEL, «YA ENTREGÓ» Y CEROS: «Incluye también los que están en formato papel que no
     tienen nota puesta en la ficha que ahora se encuentra en periodo de gracia, con una etiqueta que ponga "en papel"
     y un botón a la derecha que ponga "ya entregó" por si me entregó y todavía no le puse nota. Y si alguien terminó
     su periodo de gracia y ya tiene un cero, que también salga, con otro aspecto más trágico: alerta para moroso,
     calavera para 0.»
     · Datos: suite_morosos_v2_token (si la base aún no la tiene, la de siempre: solo digitales en la gracia). Cada
       fila es alumno + ficha, con su formato (digital / papel) y su estado: gracia · entrego · cero.
     · «Ya entregó» (SOLO papel, en el periodo extra; (29-sep, Iago) «los digitales, si entregan, ya no están en morosos»; «más
       discreto; si lo pulso, que su tarjeta se ponga verde; y si salgo de la lista y vuelvo a entrar, que ya no aparezca»):
       suite_morosos_ya_entrego_token. La fila pasa a gris («entregó, falta la
       nota») con «Deshacer», y a ese alumno no se le pone el 0 al acabar la gracia. Con la nota puesta, desaparece.
     · Ceros: los de la ficha cuya gracia acabó en los últimos 7 días, con calavera.
     (29-sep-2026, tarde, Iago, 2) «Que no diga periodo de gracia sino PERIODO EXTRA: quizá los niños no entienden la
     expresión «de gracia». Los que ya pasaron el periodo extra, abajo de todo: simplemente la calavera, el nombre de
     la ficha y el 0. Fondo negro, contorno blanco.» (En el código, «gracia» sigue siendo el nombre interno del estado.)
     · El globito cuenta alumnos con ficha en el periodo extra o con un 0 (los «entregó», no). Si en la clase solo quedan
       «entregó», el icono sigue, sin globito, para poder deshacer. */
  var MOR = { d: null, t: 0, cargando: false, panel: null, v2: true, error: '', verdes: {},   /* verdes: marcados con la lista abierta */
              llave: null, tLlave: 0, pidiendoLlave: false, renovada: false, tMal: 0,   /* (6-oct-2026) la llave pedida con la cuenta */
              desfase: 0, reloj: 0 };   /* (6-oct-2026) reloj del servidor − reloj del aparato (ms) */
  var MOR_SB = 'https://woiptkyrxkbpnvioypit.supabase.co';
  var MOR_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvaXB0a3lyeGticG52aW95cGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NzI2ODYsImV4cCI6MjA5MjA0ODY4Nn0.B2nKgj5rD0rkdLeMIrd9KgD8lUPWsBT4Y7aCtmnvbjA';
  /* la calavera (icono sencillo, el mismo que ve el alumno en «ya sí que la liaste») */
  var CALAVERA = '<svg class="pl-i lm-calavera" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 2.8c-4.6 0-8.3 3.4-8.3 8 0 2.6 1.2 4.6 3.2 5.9v2.4c0 1 .8 1.8 1.8 1.8h6.6c1 0 1.8-.8 1.8-1.8v-2.4c2-1.3 3.2-3.3 3.2-5.9 0-4.6-3.7-8-8.3-8z"/>' +
    '<circle cx="8.9" cy="11.2" r="1.9" fill="currentColor" stroke="none"/><circle cx="15.1" cy="11.2" r="1.9" fill="currentColor" stroke="none"/>' +
    '<path d="M12 13.9l-1 1.9h2z" fill="currentColor" stroke-width="1.2"/><path d="M10.3 18.4v2.4M13.7 18.4v2.4"/></svg>';
  function llaveProfe() { var m = /(?:^|;\s*)lm_profe=([0-9a-f]{64})(?:;|$)/.exec(document.cookie || ''); return m ? m[1] : (MOR.llave || null); }
  /* (6-oct-2026) la llave, pedida con la cuenta de Tester/Protester cuando este navegador no la tiene */
  function cuentaProfe() {
    try { var ss = JSON.parse(localStorage.getItem(GP ? 'lmpro_session' : 'lmeav_session') || 'null'); return (ss && ss.id) ? String(ss.id) : null; } catch (e) { return null; }
  }
  function guardarLlave(hex) {   /* como la deja el Diario; si el navegador no admite la cookie, vale mientras dure la página */
    MOR.llave = hex;
    try { document.cookie = 'lm_profe=' + hex + '; Domain=.lmathome.es; Path=/; Max-Age=31536000; SameSite=Lax; Secure'; } catch (e) {}
  }
  function olvidarLlave() {
    MOR.llave = null;
    try { document.cookie = 'lm_profe=; Domain=.lmathome.es; Path=/; Max-Age=0; SameSite=Lax; Secure'; } catch (e) {}
  }
  function pedirLlave() {
    var id = cuentaProfe(); if (!id || MOR.pidiendoLlave) return;
    if (MOR.tLlave && Date.now() - MOR.tLlave < 300000) return;   /* como mucho, un intento cada 5 min */
    MOR.pidiendoLlave = true; MOR.tLlave = Date.now();
    pedirMor('suite_morosos_llave_cuenta', { p_cuenta_id: id })
      .then(function (x) {
        var d = x && x.d;
        if (d && d.ok && /^[0-9a-f]{64}$/.test(String(d.llave || ''))) { guardarLlave(String(d.llave)); MOR.t = 0; MOR.tMal = 0; }
      })
      .catch(function () {})
      .then(function () { MOR.pidiendoLlave = false; if (llaveProfe()) { try { pintarMorosos(); } catch (e) {} } });
  }
  function delPortal(g) { return GP ? /gp/i.test(String(g || '')) : !/gp/i.test(String(g || '')); }
  function hoyISO() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function minutos(hhmm) { var m = /^(\d{1,2}):(\d{2})/.exec(String(hhmm || '')); return m ? (+m[1]) * 60 + (+m[2]) : NaN; }
  /* (6-oct-2026) La hora de clase se mira en HORA DE GALICIA y con el reloj del servidor del portal, no con los del
     aparato: un ordenador de aula con la zona horaria (o la hora) mal puesta no enseñaría el icono a su hora. El reloj
     del servidor sale de la cabecera Date de una petición mínima a este mismo sitio (solo Tester/Protester, una vez
     por carga); si no llega, vale el del aparato. Diferencias de menos de 2 minutos no se tocan. */
  function mirarReloj() {
    if (MOR.reloj) return; MOR.reloj = 1;
    try {
      var t0 = Date.now();
      fetch(location.origin + '/manifest.webmanifest', { method: 'HEAD', cache: 'no-store' }).then(function (r) {
        var f = r && r.headers && r.headers.get('Date'), ts = f ? Date.parse(f) : NaN;
        if (!isFinite(ts)) return;
        var df = ts - Math.round((t0 + Date.now()) / 2);
        MOR.desfase = Math.abs(df) > 120000 ? df : 0;
        if (MOR.desfase) { try { pintarMorosos(); } catch (e) {} }
      }).catch(function () {});
    } catch (e) {}
  }
  var DIAS_GAL = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
  /* (6-oct-2026, noche) El formateador se construye UNA vez (antes, uno nuevo en cada consulta: hasta 6 por segundo
     en los dos primeros minutos de cada carga) y la respuesta vale un segundo. En un ordenador viejo construirlo
     cuesta; no hace falta. */
  var FMT_GAL = null, GAL_ULT = { t: 0, v: null };
  function ahoraGalicia() {
    var ms = Date.now() + (MOR.desfase || 0);
    if (GAL_ULT.v && Math.abs(ms - GAL_ULT.t) < 1000) return GAL_ULT.v;
    var t = new Date(ms), v = null;
    try {
      if (!FMT_GAL) FMT_GAL = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
      var p = {};
      FMT_GAL.formatToParts(t).forEach(function (x) { p[x.type] = x.value; });
      var h = (+p.hour) % 24, m = +p.minute;
      if (DIAS_GAL[p.weekday] && isFinite(h) && isFinite(m)) v = { dia: DIAS_GAL[p.weekday], min: h * 60 + m };
    } catch (e) {}
    if (!v) v = { dia: ((t.getDay() + 6) % 7) + 1, min: t.getHours() * 60 + t.getMinutes() };
    GAL_ULT.t = ms; GAL_ULT.v = v;
    return v;
  }
  /* grupos de este portal que están en clase ahora: desde MOR_ANTES minutos antes de la hora de inicio hasta la de fin.
     (6-oct-2026, Iago) «lo que me interesa es que se active en el momento exacto de la clase»: antes salía desde 30 min
     antes de empezar. La hora de fin ya no cuenta (a las 19:00 solo está el grupo de las 19:00).
     (6-oct-2026, 17:50, Iago) «Que no se active justo en punto, sino cinco minutos antes de cada clase, coincidiendo con
     la activación de la reproducción musical»: MOR_ANTES = 5, los mismos 5 minutos que la música (musVentana), y con el
     mismo reloj. En el cambio de clase manda el grupo que ENTRA: desde 5 minutos antes de la clase siguiente ya solo
     cuenta ese (martes, portal GP: 17:55–18:55 el de las 18:00; desde las 18:55, el de las 19:00). Para volver a «en
     punto»: MOR_ANTES = 0. */
  var MOR_ANTES = 5;
  function gruposEnClase() {
    var d = MOR.d; if (!d || !Array.isArray(d.horario)) return [];
    var ga = ahoraGalicia(), dia = ga.dia, min = ga.min;   /* (6-oct-2026) hora de Galicia y reloj del servidor, no los del aparato */
    var out = [], ult = -1;
    d.horario.forEach(function (h) {
      if (!h || +h.dia !== dia || !delPortal(h.grupo)) return;
      var ini = minutos(h.ini), fin = minutos(h.fin);
      if (!(isFinite(ini) && isFinite(fin) && min >= ini - MOR_ANTES && min < fin)) return;
      if (ini > ult) { ult = ini; out = []; }             /* la clase que empezó (o va a empezar) más tarde es la que manda */
      if (ini === ult && out.indexOf(h.grupo) < 0) out.push(h.grupo);
    });
    return out;
  }
  /* la v1 no trae estado ni formato: son todos digitales en el periodo extra */
  function normalizarMorosos(d) {
    (d.fichas || []).forEach(function (f) { if (!f) return; f.estado = f.estado || 'gracia'; f.formato = f.formato || 'digital'; });
    return d;
  }
  var ORDEN_MOR = { gracia: 0, entrego: 0, cero: 2 };   /* la que se pone verde no cambia de sitio */
  function claveFila(f) { return String(f.alumno) + '|' + String(f.ficha); }
  function filasDe(grupo) {   /* alumno + ficha, en orden: en el periodo extra, «entregó» (solo los verdes de ahora) y ceros */
    return ((MOR.d && MOR.d.fichas) || []).filter(function (f) { return f && f.grupo === grupo && (f.estado !== 'entrego' || MOR.verdes[claveFila(f)]); })
      .sort(function (a, b) {
        return ((ORDEN_MOR[a.estado] || 0) - (ORDEN_MOR[b.estado] || 0)) || String(a.nombre).localeCompare(String(b.nombre), 'es') || ((+a.numero || 0) - (+b.numero || 0));
      });
  }
  function cuentanDe(grupo) {   /* alumnos distintos con una ficha en el periodo extra o con un 0 */
    var v = {};
    filasDe(grupo).forEach(function (f) { if (f.estado !== 'entrego') v[f.alumno || f.nombre] = 1; });
    return Object.keys(v).length;
  }
  function claveVisto(g) { return 'lm_morosos_visto:' + g + '|' + hoyISO(); }
  function visto(g) { try { return localStorage.getItem(claveVisto(g)) === '1'; } catch (e) { return false; } }
  function marcarVisto(gs) { gs.forEach(function (g) { try { localStorage.setItem(claveVisto(g), '1'); } catch (e) {} }); }
  function cuentaMorosos() {
    return gruposEnClase().filter(function (g) { return !visto(g); }).reduce(function (s, g) { return s + cuentanDe(g); }, 0);
  }
  /* ¿hay algo que enseñar en los grupos que están en clase ahora? (los verdes de la lista abierta cuentan: no se cierra sola) */
  function morososEnClase() {
    return gruposEnClase().reduce(function (s, g) { return s + filasDe(g).length; }, 0);
  }
  function pedirMor(fn, cuerpo) {
    return fetch(MOR_SB + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: MOR_ANON, Authorization: 'Bearer ' + MOR_ANON }, body: JSON.stringify(cuerpo) })
      .then(function (r) { return r.json().catch(function () { return null; }).then(function (d) { return { st: r.status, d: d }; }); });
  }
  function cargarMorosos(forzar) {
    var k = llaveProfe(); if (!k || MOR.cargando) return;
    if (!forzar && MOR.d && Date.now() - MOR.t < 120000) return;
    if (!forzar && MOR.tMal && Date.now() - MOR.tMal < 30000) return;   /* (6-oct-2026) si falló, no antes de 30 s (antes, sin lista, repetía sin freno) */
    MOR.cargando = true;
    pedirMor(MOR.v2 ? 'suite_morosos_v2_token' : 'suite_morosos_fichas_token', { p_token: k })
      .then(function (x) {
        if (MOR.v2 && x && x.st === 404) { MOR.v2 = false; return pedirMor('suite_morosos_fichas_token', { p_token: k }); }   /* la base aún sin la v2 */
        return x;
      })
      .then(function (x) {
        var d = x && x.d;
        if (d && d.ok) { MOR.d = normalizarMorosos(d); MOR.t = Date.now(); MOR.tMal = 0; pintarMorosos(); if (MOR.panel) pintarPanelMorosos(); }
        else {
          MOR.t = Date.now(); MOR.tMal = Date.now();
          /* (6-oct-2026) la llave guardada ya no vale (se cambió la clave de la suite): se tira y se pide otra con la cuenta, una vez */
          if (d && d.error === 'no_autorizado' && !MOR.renovada) {
            MOR.renovada = true; olvidarLlave(); MOR.tLlave = 0; MOR.t = 0; MOR.tMal = 0;
            setTimeout(function () { try { pintarMorosos(); } catch (e) {} }, 0);
          }
        }
      })
      .catch(function () { MOR.t = Date.now() - 90000; MOR.tMal = Date.now(); })
      .then(function () { MOR.cargando = false; });
  }
  function fechaCorta(iso) { var d = new Date(iso); return isNaN(d) ? '' : ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2); }
  function cerrarPanelMorosos() {
    var p = MOR.panel; if (!p) return;
    MOR.panel = null; if (p.parentNode) p.parentNode.removeChild(p);
    MOR.verdes = {};   /* (29-sep-2026, Iago) al volver a abrir la lista, los que ya entregaron no aparecen */
    var b = document.querySelector('#lm-morosos .lm-ic'); if (b) b.setAttribute('aria-expanded', 'false');
    marcarVisto(gruposEnClase());   /* cerrada la lista, el globito de ese grupo no vuelve hasta su próxima clase */
    pintarMorosos();
  }
  function filaCeroHTML(f, conGrupo) {   /* abajo de todo: la calavera, el alumno, la ficha y el 0 */
    return '<div class="lm-mor-alu lm-mor-cero" title="Un 0: se acabó el periodo extra sin entregarla">' +
      '<span class="lm-mor-i">' + CALAVERA + '</span>' +
      '<span class="lm-mor-n">' + (conGrupo ? '<span class="lm-mor-gc">' + esc(f.grupo) + '</span>' : '') + esc(f.nombre) + '</span>' +
      '<span class="lm-mor-fn">Ficha ' + esc(f.numero) + '</span><span class="lm-mor-0">0</span></div>';
  }
  function filaMorosoHTML(f) {
    var papel = f.formato === 'papel', est = f.estado, n = esc(f.numero);
    var icono = est === 'cero' ? CALAVERA : est === 'entrego' ? ico('check') : ico('alert');
    var chip = est === 'cero' ? '0 · Ficha ' + n
      : est === 'entrego' ? 'Ficha ' + n + ' · ya entregó'
      : 'Ficha ' + n + (f.fin_gracia ? ' · periodo extra hasta el ' + fechaCorta(f.fin_gracia) : ' · periodo extra');
    var datos = ' data-alu="' + esc(f.alumno || '') + '" data-ficha="' + esc(f.ficha || '') + '"';
    var boton = '';
    if (papel && f.alumno && f.ficha && est === 'gracia') boton = '<button type="button" class="lm-mor-ya"' + datos + ' title="Me la entregó en papel y aún no tiene nota: no se le pone el 0">' + ico('check') + 'Ya entregó</button>';
    else if (papel && f.alumno && f.ficha && est === 'entrego' && !(f.fin_gracia && Date.now() > Date.parse(f.fin_gracia))) boton = '<button type="button" class="lm-mor-des"' + datos + ' title="Quitar «Ya entregó»">Deshacer</button>';
    var titulo = est === 'cero' ? 'Un 0: se acabó el periodo extra sin entregarla' : est === 'entrego' ? 'Marcada «Ya entregó»: no se le pondrá el 0' : 'En el periodo extra, sin entregar';
    return '<div class="lm-mor-alu lm-mor-' + esc(est) + (est === 'entrego' ? ' lm-mor-verde' : '') + '">' +
      '<span class="lm-mor-i" title="' + titulo + '">' + icono + '</span>' +
      '<span class="lm-mor-n">' + esc(f.nombre) + '</span>' +
      '<span class="lm-mor-fs">' + (papel ? '<span class="lm-mor-papel">en papel</span>' : '') + '<span class="lm-mor-f">' + chip + '</span></span>' +
      boton + '</div>';
  }
  function pintarPanelMorosos() {
    var p = MOR.panel; if (!p) return;
    var enClase = gruposEnClase();
    /* (6-oct-2026, 18:05, Iago, en clase) «Quiero que solo aparezcan los de ese grupo: pulso y me aparecen los de ese
       grupo, pero también, más abajo, los de otro grupo, y eso no me interesa. Que solo esté visible, en la hora de la
       clase, el grupo en cuestión»: la lista enseña SOLO el grupo que está en clase (también en los ceros de abajo).
       Antes: todos los grupos del portal con alguien en el periodo extra, con el de clase arriba. */
    var grupos = enClase.slice();
    MOR.panelDe = enClase.join('|');
    grupos.sort(function (a, b) { return a.localeCompare(b, 'es'); });
    var h = '<div class="lm-mor-tit">Morosos · fichas</div>';
    var ceros = [], gruposCero = [];
    var conDeuda = grupos.filter(function (g) { return enClase.indexOf(g) >= 0 || filasDe(g).some(function (f) { return f.estado !== 'cero'; }); });
    if (!conDeuda.length) h += '<div class="lm-mor-vacio">Nadie en el periodo extra.</div>';
    conDeuda.forEach(function (g) {
      var L = filasDe(g).filter(function (f) { return f.estado !== 'cero'; });
      h += '<div class="lm-mor-grupo"><div class="lm-mor-g">' + esc(g) + (enClase.indexOf(g) >= 0 ? '<span class="lm-mor-ahora">en clase</span>' : '') + '</div>';
      if (!L.length) h += '<div class="lm-mor-vacio">Nadie en el periodo extra.</div>';
      L.forEach(function (f) { h += filaMorosoHTML(f); });
      h += '</div>';
    });
    /* (29-sep-2026, Iago) los que ya pasaron el periodo extra: abajo de todo, en negro con contorno blanco */
    grupos.forEach(function (g) { filasDe(g).forEach(function (f) { if (f.estado === 'cero') { ceros.push(f); if (gruposCero.indexOf(g) < 0) gruposCero.push(g); } }); });
    if (ceros.length) {
      h += '<div class="lm-mor-ceros">';
      ceros.forEach(function (f) { h += filaCeroHTML(f, gruposCero.length > 1); });
      h += '</div>';
    }
    if (MOR.error) h += '<div class="lm-mor-error" role="alert">' + esc(MOR.error) + '</div>';
    p.innerHTML = h;
    colocarPanelMorosos();
  }
  function abrirPanelMorosos(btn) {
    if (MOR.panel) { cerrarPanelMorosos(); return; }
    cerrarMenu();
    var p = document.createElement('div'); p.className = 'lm-mor-panel'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', 'Morosos · fichas');
    p.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('.lm-mor-ya, .lm-mor-des') : null; if (!b) return;
      e.preventDefault(); e.stopPropagation();
      marcarEntrego(b.getAttribute('data-alu'), b.getAttribute('data-ficha'), b.classList.contains('lm-mor-ya'));
    });
    /* en el <body>: la barra de arriba es de cristal (backdrop-filter) y dentro de ella «fixed» no sería la pantalla */
    document.body.appendChild(p); MOR.panel = p; btn.setAttribute('aria-expanded', 'true');
    MOR.error = '';
    pintarPanelMorosos();
  }
  /* «Ya entregó» / «Deshacer»: se ve al momento; si la base no lo guarda, vuelve como estaba y lo dice */
  function marcarEntrego(alu, ficha, si) {
    var k = llaveProfe(); if (!k || !alu || !ficha) return;
    var fila = ((MOR.d && MOR.d.fichas) || []).filter(function (f) { return f && String(f.alumno) === String(alu) && String(f.ficha) === String(ficha); })[0];
    if (!fila) return;
    var antes = fila.estado, kf = claveFila(fila);
    fila.estado = si ? 'entrego' : 'gracia'; MOR.error = '';
    if (si) MOR.verdes[kf] = 1; else delete MOR.verdes[kf];
    pintarPanelMorosos(); pintarMorosos();
    pedirMor('suite_morosos_ya_entrego_token', { p_token: k, p_alumno_canon_id: alu, p_ficha_id: ficha, p_entrego: !!si })
      .then(function (x) { if (!(x && x.d && x.d.ok)) throw new Error('no'); cargarMorosos(true); })
      .catch(function () { fila.estado = antes; if (si) delete MOR.verdes[kf]; else MOR.verdes[kf] = 1; MOR.error = 'No se ha podido guardar. Prueba otra vez.'; pintarPanelMorosos(); pintarMorosos(); });
  }
  /* la lista, debajo del icono y siempre dentro de la pantalla */
  function colocarPanelMorosos() {
    var p = MOR.panel, b = document.querySelector('#lm-morosos .lm-ic'); if (!p || !b) return;
    var r = b.getBoundingClientRect(), w = p.offsetWidth || 420;
    p.style.top = Math.round(r.bottom + 8) + 'px';
    p.style.left = Math.round(Math.max(12, Math.min(r.left, window.innerWidth - w - 12))) + 'px';
  }
  window.addEventListener('resize', colocarPanelMorosos);
  document.addEventListener('click', function (e) {
    if (MOR.panel && !MOR.panel.contains(e.target) && !(e.target.closest && e.target.closest('#lm-morosos'))) cerrarPanelMorosos();
  }, true);
  document.addEventListener('keydown', function (e) { if (MOR.panel && (e.key === 'Escape' || e.key === 'Esc')) cerrarPanelMorosos(); });
  function pintarMorosos() {
    if (editorAbierto()) return;   /* (6-oct-2026, noche) con la lección, la pizarra o un libro abiertos, nada de esto se ve: se espera a que se cierre */
    var bell = document.getElementById('alu-campana-btn'); if (!bell || !bell.parentNode) return;
    var host = bell.parentNode, w = document.getElementById('lm-morosos');
    if (!esProfe()) { if (w && w.parentNode) { cerrarPanelMorosos(); w.parentNode.removeChild(w); } return; }
    mirarReloj();   /* (6-oct-2026) la hora de clase, con el reloj del servidor */
    /* (6-oct-2026) sin llave en este navegador (no ha abierto el Diario): se pide con la cuenta de Tester/Protester */
    if (!llaveProfe()) { if (w && w.parentNode) { cerrarPanelMorosos(); w.parentNode.removeChild(w); } pedirLlave(); return; }
    cargarMorosos();
    if (!MOR.d) return;
    /* (29-sep-2026, Iago) «Si no hay morosos activos, que ese símbolo no aparezca: que solo esté visible durante las
       horas de los grupos en cuestión que me deben algo». Fuera de esas clases (o si nadie debe nada), no está. */
    if (!morososEnClase()) {
      if (w && w.parentNode) { if (MOR.panel) cerrarPanelMorosos(); if (w.parentNode) w.parentNode.removeChild(w); }
      return;
    }
    if (!w) {
      w = cuadro('lm-ic-morosos', 'alert', 'Morosos · fichas', function (b) { abrirPanelMorosos(b); }, true);
      w.id = 'lm-morosos';
    }
    if (w.parentNode !== host) host.insertBefore(w, host.firstChild);
    var b = w.querySelector('.lm-ic'); if (!b) return;
    if (MOR.panel && MOR.panelDe !== gruposEnClase().join('|')) { try { pintarPanelMorosos(); } catch (e) {} }   /* (6-oct-2026) cambió el grupo en clase con la lista abierta */
    var n = cuentaMorosos(), bd = b.querySelector('.lm-ic-badge');
    if (n > 0) {
      if (!bd) { bd = document.createElement('span'); bd.className = 'lm-ic-badge'; bd.setAttribute('aria-hidden', 'true'); b.appendChild(bd); }
      if (bd.textContent !== String(n)) bd.textContent = String(n);
    } else if (bd) bd.parentNode.removeChild(bd);
    if (b.classList.contains('hay-avisos') !== (n > 0)) b.classList.toggle('hay-avisos', n > 0);
    b.title = n > 0 ? (n === 1 ? '1 alumno del grupo en clase debe una ficha o tiene un 0' : n + ' alumnos del grupo en clase deben fichas o tienen un 0') : 'Morosos · fichas';
    b.setAttribute('aria-label', b.title);
    try { calmaIcono(b, function () { var x = b.querySelector('.lm-ic-badge'); return x ? (parseInt(x.textContent, 10) || 0) : 0; }); } catch (e) {}
  }
  setInterval(function () { try { pintarMorosos(); } catch (e) {} }, 15000);   /* la hora de clase cambia sola (6-oct-2026: cada 15 s, para que salga a su minuto) */

  /* ---------- 16 (29-sep-2026, Iago): ATAJOS DEL PROFESOR EN LA MISMA VENTANA ----------
     «Preferiría que en lugar de una pestaña nueva sea como la misma ventana y que sea así con todos los atajos que
      hago desde pantalla. Con una x arriba a la derecha, por ejemplo.» SOLO Tester/Protester: lo que el portal abría
     en otra pestaña (las pantallas de Resultados de Ritmo, Entonación, Ritmo entonado y Dictado) se abre DENTRO del
     portal, a toda pantalla, con una barra fina arriba y la ✕ a la derecha (también Esc). Si el portal está en
     pantalla completa, sigue en pantalla completa. Al cerrar, la pantalla se descarga (deja de escuchar notas).
     Los enlaces de los alumnos no cambian. Para quitarlo: borrar esta sección (y su CSS en portal.css). */
  var MARCO_RE = /^https:\/\/correccion[a-z]*\.lmathome\.es\//i;
  function nombreMarco(url) {
    var h = ''; try { h = new URL(url).hostname; } catch (e) {}
    if (/ritmoentonado/.test(h)) return 'Resultados · Ritmo entonado';
    if (/ritmo/.test(h)) return 'Resultados · Ritmo';
    if (/entonacion/.test(h)) return 'Resultados · Entonación';
    if (/dictado/.test(h)) return 'Resultados · Dictado';
    return 'Resultados';
  }
  function abrirMarco(url) {
    var ov = document.getElementById('lm-marco-app');
    if (!ov) {
      ov = document.createElement('div'); ov.id = 'lm-marco-app';
      ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
      ov.innerHTML = '<div class="lm-ma-bar"><span class="lm-ma-tit"></span>' +
        '<button type="button" class="lm-ma-x" title="Cerrar (Esc)" aria-label="Cerrar y volver al portal">' + (ico('x') || '✕') + '</button></div>' +
        '<iframe class="lm-ma-if" title="Resultados" allow="fullscreen; autoplay; clipboard-write"></iframe>';
      document.body.appendChild(ov);
      ov.querySelector('.lm-ma-x').addEventListener('click', cerrarMarco);
      document.addEventListener('keydown', function (e) {
        if ((e.key === 'Escape' || e.key === 'Esc') && ov.classList.contains('abierto')) { e.preventDefault(); e.stopPropagation(); cerrarMarco(); }
      }, true);
    }
    var tit = nombreMarco(url);
    ov.querySelector('.lm-ma-tit').textContent = tit;
    ov.setAttribute('aria-label', tit);
    ov.querySelector('.lm-ma-if').src = url;
    ov.classList.add('abierto'); document.documentElement.classList.add('lm-ma-on');
    try { ov.querySelector('.lm-ma-x').focus({ preventScroll: true }); } catch (e) {}
  }
  function cerrarMarco() {
    var ov = document.getElementById('lm-marco-app'); if (!ov) return;
    ov.classList.remove('abierto'); document.documentElement.classList.remove('lm-ma-on');
    var f = ov.querySelector('.lm-ma-if'); if (f) f.src = 'about:blank';
  }
  (function () {
    var abrirOriginal = window.open;
    if (typeof abrirOriginal !== 'function' || abrirOriginal.__lmMarco) return;
    var nuevo = function (url) {
      try { if (esProfe() && MARCO_RE.test(String(url || ''))) { abrirMarco(String(url)); return null; } } catch (e) {}
      return abrirOriginal.apply(window, arguments);
    };
    nuevo.__lmMarco = true;
    window.open = nuevo;
  })();

  /* ---------- 17 (29-sep-2026, Iago): LIBRO DE ENTONACIÓN · LECCIÓN ACTIVA (solo Tester, GE) ----------
     «Añade al portal elemental (solo a tester) el libro de entonación con las lecciones… en el botón de entonación
      (clave de sol azul), y al pulsar que me dé la opción de lección activa (con el número) y de resultados. Al entrar
      en lección activa, dos opciones de vista: una aprovechando todo el ancho y otra en la que se vean las dos hojas,
      tal y como las ven los alumnos. Y que si marqué algo en la versión ampliada, se mantenga donde lo apunté en la
      versión alejada de dos páginas: que sea coherente. Necesito aquí también la interfaz de anotar de ritmo […]:
      anotado fino opaco en azul (por defecto) y, más grueso y traslúcido, un color para cada intervalo de Intervalia,
      desde el rojo de la 2m hasta la 8J, ordenados de menor a mayor.»
     · La lección: la de entonación de la semana docente del Diario (semanas.entonacion_leccion; cambia el viernes a
       las 19:00). El libro: el PDF del Diario (tabla «libros», tipo entonacion), pintado con pdf.js, como en Libros.
     · Dónde empieza cada lección y dónde está la música en cada página: medido sobre ese PDF (29-sep-2026, EN_GEO).
     · Dos vistas: «a todo el ancho» (la música de cada página, sin márgenes blancos, al 80 % del ancho, con un carril a
       cada lado para desplazar sin pintar; se abre en el rótulo de la lección) y «dos páginas» (el libro abierto: la par
       a la izquierda y la impar a la derecha).
     · Las marcas van en coordenadas de la PÁGINA del libro, no de la vista: lo marcado en una sale en el mismo sitio
       en la otra. Se guardan en este aparato: localStorage «lm_ento_anot:<curso>:p<página>».
     · Para quitarlo: borrar esta sección (y su CSS en portal.css) y dejar en la sección 9 el cuadro de Entonación
       como estaba (abría Resultados directamente). */
  var EN_GEO = {
    /* lección: [página del libro, altura del rótulo «Lección N» en ‰ de la página (su borde de arriba)] */
    L: {1:[8,570],2:[10,567],3:[12,68],4:[14,570],5:[16,571],6:[18,305],7:[20,341],8:[22,72],9:[24,68],10:[26,566],11:[28,311],12:[30,315],13:[32,568],14:[34,68],15:[36,568],16:[38,566],17:[40,291],18:[42,68],19:[44,566],20:[46,314],21:[48,68],22:[50,567],23:[52,566],24:[54,308],25:[56,338],26:[58,292],27:[60,68],28:[62,565],29:[64,314],30:[66,311],31:[68,358],32:[70,570],33:[72,70],34:[74,568],35:[76,299],36:[78,305],37:[80,358],38:[82,568],39:[84,71],40:[86,568],41:[88,292],42:[90,70],43:[92,591],44:[94,72],45:[96,571],46:[98,71],47:[100,584],48:[102,68],49:[104,570],50:[106,289],51:[109,128],52:[110,69],53:[111,69],54:[112,68],55:[113,69]},
    /* página: [izquierda, derecha] de la música en ‰ del ancho, con un pelín de margen (vista «a todo el ancho») */
    X: {8:[84,918],9:[106,945],10:[80,916],11:[104,945],12:[78,912],13:[106,945],14:[80,916],15:[106,945],16:[86,922],17:[108,945],18:[86,922],19:[106,947],20:[84,918],21:[108,947],22:[86,926],23:[108,945],24:[80,918],25:[110,949],26:[78,914],27:[110,949],28:[84,920],29:[108,949],30:[76,912],31:[110,947],32:[86,922],33:[106,941],34:[86,924],35:[102,938],36:[82,916],37:[110,947],38:[86,922],39:[106,943],40:[92,926],41:[110,947],42:[84,920],43:[110,947],44:[86,922],45:[116,951],46:[78,922],47:[114,951],48:[84,920],49:[106,941],50:[80,916],51:[120,957],52:[84,920],53:[120,959],54:[74,914],55:[116,953],56:[82,920],57:[120,959],58:[84,920],59:[116,955],60:[86,924],61:[118,955],62:[90,928],63:[112,949],64:[84,928],65:[112,949],66:[94,930],67:[110,945],68:[88,928],69:[116,951],70:[98,938],71:[110,945],72:[94,932],73:[108,943],74:[96,934],75:[110,945],76:[92,932],77:[100,936],78:[98,934],79:[106,941],80:[96,934],81:[102,938],82:[96,934],83:[104,938],84:[94,938],85:[100,934],86:[102,938],87:[104,938],88:[94,938],89:[102,941],90:[100,936],91:[100,936],92:[106,949],93:[98,934],94:[92,936],95:[92,928],96:[98,938],97:[98,934],98:[96,934],99:[94,932],100:[96,936],101:[96,934],102:[96,932],103:[94,932],104:[94,934],105:[96,932],106:[98,934],107:[94,930],108:[102,928],109:[96,934],110:[88,928],111:[98,934],112:[88,926],113:[94,930]}
  };
  /* los colores de Intervalia (su paleta «extraída del libro»), de menor a mayor */
  var EN_INT = [['2m', '#a62c17', '2ª menor'], ['2M', '#ed732e', '2ª mayor'], ['3m', '#2f6b1e', '3ª menor'], ['3M', '#9ed649', '3ª mayor'],
    ['4J', '#2355ce', '4ª justa'], ['4A/5D', '#f3ec4e', '4ª aumentada · 5ª disminuida'], ['5J', '#5ac4f7', '5ª justa'], ['6m', '#8c33b6', '6ª menor'],
    ['6M', '#d796f8', '6ª mayor'], ['7m', '#5a2d05', '7ª menor'], ['7M', '#c98a1e', '7ª mayor'], ['8J', '#000000', '8ª justa']];
  /* (30-sep-2026, Iago) «Si escribo normal, negro. Fino»: la punta fina de siempre, ahora NEGRA (el azul se parecía
     demasiado a la 4J). Y los intervalos, «más finos y más opacos», con el trazo del propio libro de Intervalia: opacos,
     de extremos rectos y de un grosor de casi la mitad de la altura de una cabeza de nota. Medido en el PDF de Intervalia
     (a 300 ppp): trazo 10,2 px, cabeza 22 px, entre líneas 20,5 px. En este libro de entonación la cabeza mide ~0,008 del
     ancho de la página y la separación entre líneas ~0,0069: el trazo, 0,0036 (antes 0,010 y traslúcido al 42 %). */
  var EN_TINTA = '#000000';                               /* punta fina opaca: negra */
  var EN_FINA = 0.0022, EN_INTW = 0.0036;                 /* grosor en fracción del ancho de la página */
  /* (29-sep-2026, tarde, Iago) «a todo el ancho» con menos zoom («la grande se ve demasiado grande para la calidad que tiene
     el libro») y, a los lados, dos carriles para desplazar sin pintar: la música ocupa EN_ANCHO_K del ancho y cada carril lo
     que queda (como poco EN_CARRIL px). */
  var EN_ANCHO_K = 0.8, EN_CARRIL = 56;
  var EN_PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  var EN_PDFW = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  var EN_IOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var EN_ICO_ANCHO = '<path d="M3 4v16M21 4v16"/><path d="M7 12h10"/><path d="M10 9l-3 3 3 3M14 9l3 3-3 3"/>';
  var EN = { datos: null, t: 0, cargando: null, pj: null, doc: null, docPath: '', st: null };

  /* ---- datos: el curso de GE activo, la lección de la semana docente y el PDF del libro ---- */
  function enRest(q) {
    return fetch(MOR_SB + '/rest/v1/' + q, { cache: 'no-store', headers: { apikey: MOR_ANON, Authorization: 'Bearer ' + MOR_ANON } })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
  }
  function enSemana() {   /* la semana docente, como Libros y el Diario: el viernes a las 19:00 ya cuenta la siguiente */
    var now = new Date(), lun = new Date(now); lun.setHours(0, 0, 0, 0); lun.setDate(lun.getDate() - ((lun.getDay() + 6) % 7));
    var vie = new Date(lun); vie.setDate(lun.getDate() + 4); vie.setHours(19, 0, 0, 0);
    var d = (now > vie) ? new Date(lun.getTime() + 7 * 864e5) : now;
    var u = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())), dia = u.getUTCDay() || 7; u.setUTCDate(u.getUTCDate() + 4 - dia);
    var y0 = new Date(Date.UTC(u.getUTCFullYear(), 0, 1));
    return { anio: u.getUTCFullYear(), semana: Math.ceil((((u - y0) / 864e5) + 1) / 7) };
  }
  function enCargar(forzar) {
    if (!forzar && EN.datos && Date.now() - EN.t < 5 * 60e3) return Promise.resolve(EN.datos);
    if (EN.cargando) return EN.cargando;
    var w = enSemana(), d = { curso: '', leccion: null, pdf: '', error: '' };
    EN.cargando = enRest('cursos?select=codigo,activo').then(function (cs) {
      var act = (cs || []).filter(function (c) { return c && c.activo && /Ge$/.test(c.codigo || ''); }).map(function (c) { return c.codigo; }).sort().reverse();
      d.curso = act[0] || '4Ge';
      return Promise.all([
        enRest('semanas?select=entonacion_leccion&curso=eq.' + encodeURIComponent(d.curso) + '&anio=eq.' + w.anio + '&semana_iso=eq.' + w.semana),
        enRest('libros?select=storage_path&tipo=eq.entonacion&curso=eq.' + encodeURIComponent(d.curso))
      ]);
    }).then(function (r) {
      var s = r[0] && r[0][0], l = r[1] && r[1][0];
      d.leccion = (s && s.entonacion_leccion) ? +s.entonacion_leccion : null;
      d.pdf = (l && l.storage_path) || '';
      EN.datos = d; EN.t = Date.now(); return d;
    }).catch(function () { d.error = 'red'; EN.datos = null; return d; })
      .then(function (x) { EN.cargando = null; return x; });
    return EN.cargando;
  }
  function enPaginas(N) {   /* el libro abierto por esa lección: la par a la izquierda, la impar a la derecha */
    var g = EN_GEO.L[N]; if (!g) return null;
    var izq = (g[0] % 2 === 0) ? g[0] : g[0] - 1; return [izq, izq + 1];
  }

  /* ---- el menú del cuadro de Entonación (sección 9): «Lección activa · N» y «Resultados» ---- */
  function menuEntonacion(b) {
    var res = { t: 'Resultados', s: 'Pantalla de corrección de entonación', fn: function () { pulsa(q('#rs-mini .rs-btn.azul')); } };
    if (EN.datos && !EN.cargando) {
      abrirMenu(b, [opLeccion(EN.datos), res]);
      if (Date.now() - EN.t > 5 * 60e3) enCargar(true);
      return;
    }
    abrirMenu(b, [{ t: 'Lección activa', s: 'Buscando la de esta semana…', fn: function () { enCargar().then(function (x) { if (x && x.leccion && enPaginas(x.leccion) && x.pdf) abrirEnto(x); }); } }, res]);
    enCargar().then(function (x) { if (_menu && _menu._de === b) { cerrarMenu(); abrirMenu(b, [opLeccion(x), res]); } });
  }
  function opLeccion(d) {
    if (!d || d.error) return { t: 'Lección activa', s: 'No se ha podido leer la semana · tocar para reintentar', fn: function () {
      enCargar(true).then(function (x) { if (x && x.leccion && enPaginas(x.leccion) && x.pdf) abrirEnto(x); });
    } };
    if (!d.leccion) return { t: 'Sin lección de entonación esta semana', off: true };
    var pp = enPaginas(d.leccion);
    if (d.curso !== '4Ge' || !pp || !d.pdf) return { t: 'Lección activa · ' + d.leccion, s: 'Este libro aún no está en el portal', off: true };
    return { t: 'Lección activa · ' + d.leccion, s: 'Entonación 4 · páginas ' + pp[0] + ' y ' + pp[1], fn: function () { abrirEnto(d); } };
  }

  /* ---- pdf.js (el mismo que usa Libros) y el libro ---- */
  function enPdfLib() { return window.pdfjsLib || window['pdfjs-dist/build/pdf'] || null; }
  function enPdfjs() {
    var L0 = enPdfLib(); if (L0) return Promise.resolve(L0);
    if (EN.pj) return EN.pj;
    EN.pj = new Promise(function (ok, ko) {
      var s = document.createElement('script'); s.src = EN_PDFJS;
      s.onload = function () {
        var L = enPdfLib(); if (!L) { EN.pj = null; ko(new Error('pdf.js')); return; }
        try { L.GlobalWorkerOptions.workerSrc = EN_PDFW; } catch (e) {}
        ok(L);
      };
      s.onerror = function () { EN.pj = null; ko(new Error('pdf.js')); };
      document.head.appendChild(s);
    });
    return EN.pj;
  }
  function enDoc(path) {
    if (EN.doc && EN.docPath === path) return Promise.resolve(EN.doc);
    return enPdfjs().then(function (L) {
      try { if (!L.GlobalWorkerOptions.workerSrc) L.GlobalWorkerOptions.workerSrc = EN_PDFW; } catch (e) {}
      var url = MOR_SB + '/storage/v1/object/public/diario/' + path.split('/').map(encodeURIComponent).join('/');
      return L.getDocument({ url: url, disableAutoFetch: true }).promise;
    }).then(function (doc) { EN.doc = doc; EN.docPath = path; return doc; });
  }

  /* ---- marcas: por página del libro, en este aparato ---- */
  function enClave(curso, P) { return 'lm_ento_anot:' + curso + ':p' + P; }
  function enLee(curso, P) {
    try { var s = JSON.parse(localStorage.getItem(enClave(curso, P)) || 'null'); if (s && Array.isArray(s.s) && Array.isArray(s.n)) { if (!Array.isArray(s.a)) s.a = []; return s; } } catch (e) {}   /* (1-oct-2026) + alertas (a) */
    return { s: [], n: [], a: [] };
  }
  function enGuarda(pg) {
    var st = EN.st; if (!st) return;
    try {
      if (!pg.data.s.length && !pg.data.n.length && !(pg.data.a && pg.data.a.length)) localStorage.removeItem(enClave(st.curso, pg.P));
      else localStorage.setItem(enClave(st.curso, pg.P), JSON.stringify(pg.data));
    } catch (e) {}
  }
  function enClaro(hex) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 150;
  }

  /* ---- el visor ---- */
  function enBoton(clase, html, titulo, fn) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'lm-vl-b' + (clase ? ' ' + clase : '');
    b.innerHTML = html; b.title = titulo; b.setAttribute('aria-label', titulo);
    b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); fn(b); });
    return b;
  }
  function enSep() { var s = document.createElement('span'); s.className = 'lm-vl-sep'; s.setAttribute('aria-hidden', 'true'); return s; }
  function enVistaGuardada() { try { return localStorage.getItem('lm_ento_vista') === 'dos' ? 'dos' : 'ancho'; } catch (e) { return 'ancho'; } }

  function abrirEnto(d) {
    cerrarEnto();
    var pp = enPaginas(d.leccion), g = EN_GEO.L[d.leccion]; if (!pp || !d.pdf) return;
    var st = EN.st = { curso: d.curso, leccion: d.leccion, pdf: d.pdf, P0: g[0], y0: g[1] / 1000, pags: [], vista: enVistaGuardada(),
      herr: 'fina', dibujo: 'fina', hist: [], cur: null, borrando: null, dedos: {}, pan: null, armado: 0, A: 841.89 / 595.28,
      scrollAncho: null, listo: false, rafV: 0 };
    if (esProfe()) enVacia(d.curso, d.leccion, pp);   /* (1-oct-2026) Tester/Protester: la lección, despejada */
    var ov = st.ov = document.createElement('div'); ov.id = 'lm-ento';
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Entonación · Lección ' + d.leccion);

    /* la hilera, UNA sola («que lo de la tonalidad esté a la izquierda y lo de anotar a continuación, más en el centro; y que
       todo ocupe un renglón»): tonalidad (rueda, ♯ ♭, M m) · [punta fina negra · los 12 intervalos · nota · goma · deshacer ·
       borrar todo], centrado en el hueco · vistas · pantalla · ✕. Solo en la tableta en vertical no cabe: ahí, dos hileras. */
    var bar = st.bar = document.createElement('div'); bar.className = 'lm-vl-bar lm-en-bar'; bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Lección ' + d.leccion + ' · herramientas');
    /* (29-sep-2026, Iago) «al igual que en el visor de ritmo, el apartado de poner la tonalidad: aquí también nos interesa.
       Misma idea.» La rueda es la misma de ritmo (sección 12); ♯ ♭ M m en azul. Se guarda con la lección, en este aparato. */
    var g1 = document.createElement('div'); g1.className = 'lm-vl-g1 lm-en-ton'; g1.setAttribute('role', 'group'); g1.setAttribute('aria-label', 'Tonalidad');
    var rh = st.rh = document.createElement('div'); rh.className = 'lm-vl-rueda'; rh.setAttribute('role', 'slider'); rh.setAttribute('aria-label', 'Tonalidad');
    g1.appendChild(rh);
    st.ton = enTonLee(d.curso, d.leccion); st.bT = {};
    [['#', '♯', 'Sostenido', 's'], ['b', '♭', 'Bemol', 'b'], ['M', 'M', 'Mayor', 'may'], ['m', 'm', 'menor', 'men']].forEach(function (x) {
      st.bT[x[0]] = enBoton('lm-vl-t lm-vl-t-' + x[3], '<span>' + x[1] + '</span>', x[2], function () { enTonBoton(x[0]); });
      g1.appendChild(st.bT[x[0]]);
    });
    bar.appendChild(g1);
    var esp1 = document.createElement('span'); esp1.className = 'lm-vl-esp lm-en-esp1'; bar.appendChild(esp1);
    var her = document.createElement('div'); her.className = 'lm-vl-her lm-en-her';
    st.bH = {};
    st.bH.fina = enBoton('lm-en-col', '<span class="lm-en-fina"><i></i></span>', 'Punta fina negra', function () { enHerr('fina'); });
    her.appendChild(st.bH.fina);
    EN_INT.forEach(function (it, k) {
      var dos = it[0].indexOf('/') > 0;
      var html = '<span class="lm-en-sw' + (dos ? ' dos' : '') + (it[1] === '#000000' ? ' negro' : '') + '" style="background:' + it[1] + ';color:' + (enClaro(it[1]) ? '#000' : '#fff') + '">' +
        (dos ? it[0].replace('/', '<br>') : it[0]) + '</span>';
      st.bH['i' + k] = enBoton('lm-en-int', html, 'Subrayar · ' + it[2], function () { enHerr('i' + k); });
      her.appendChild(st.bH['i' + k]);
    });
    /* (1-oct-2026, Iago) «En visor entonación añade la amarilla; ponla a la derecha de la octava justa»: la alerta amarilla, como en
       ritmo (toque = el icono; pulsar y arrastrar = una zona amarilla traslúcida con el icono en la esquina de arriba a la izquierda) */
    st.bH.alerta = enBoton('lm-vl-al lm-vl-al-a', icoAlerta(), 'Alerta amarilla · toca: aviso · arrastra: zona', function () { enHerr('alerta'); });
    her.appendChild(st.bH.alerta);
    her.appendChild(enSep());
    st.bH.nota = enBoton('', svgI(ICO_NOTA), 'Nota de texto', function () { enHerr('nota'); }); her.appendChild(st.bH.nota);
    st.bH.goma = enBoton('', ico('goma'), 'Goma', function () { enHerr('goma'); }); her.appendChild(st.bH.goma);
    her.appendChild(enSep());
    st.bU = enBoton('', ico('deshacer'), 'Deshacer', function () { enDeshacer(); }); her.appendChild(st.bU);
    st.bC = enBoton('lm-vl-borra', ico('trash'), 'Borrar todo', function () { enBorrarTodo(); }); her.appendChild(st.bC);
    bar.appendChild(her);
    var esp = document.createElement('span'); esp.className = 'lm-vl-esp'; bar.appendChild(esp);
    var fin = document.createElement('div'); fin.className = 'lm-vl-fin';
    st.bV = { ancho: enBoton('', svgI(EN_ICO_ANCHO), 'A todo el ancho', function () { enVista('ancho'); }),
              dos: enBoton('', ico('book'), 'Dos páginas, como en el libro', function () { enVista('dos'); }) };
    fin.appendChild(st.bV.ancho); fin.appendChild(st.bV.dos); fin.appendChild(enSep());
    st.bF = enBoton('', ico('expandir'), 'Pantalla completa', function () { enAlternaPantalla(); }); fin.appendChild(st.bF);
    fin.appendChild(enBoton('lm-vl-x', ico('x'), 'Cerrar (Esc)', function () { cerrarEnto(); }));
    bar.appendChild(fin);
    st.aviso = document.createElement('div'); st.aviso.className = 'lm-vl-aviso'; st.aviso.setAttribute('role', 'status'); st.aviso.textContent = '¿Borrar todo? Toca otra vez';
    bar.appendChild(st.aviso);
    ov.appendChild(bar);

    /* las dos páginas del libro abierto */
    var zona = st.zona = document.createElement('div'); zona.className = 'lm-en-zona'; zona.tabIndex = -1;
    pp.forEach(function (P) { var pg = enPagina(P); st.pags.push(pg); zona.appendChild(pg.el); });
    ov.appendChild(zona);
    enCarriles(zona);
    st.carga = document.createElement('div'); st.carga.className = 'lm-en-carga'; st.carga.setAttribute('role', 'status');
    st.carga.textContent = 'Abriendo la lección ' + d.leccion + '…';
    ov.appendChild(st.carga);
    st.vivo = document.createElement('canvas'); st.vivo.className = 'lm-en-vivo';   /* el trazo que se está haciendo (uno a la vez) */
    document.body.appendChild(ov);
    document.documentElement.classList.add('lm-en-on');
    st.rueda = vlRueda(rh, VL_NOTAS, function (j) { if (EN.st !== st) return; st.ton.n = j; enTonGuarda(); enTonPinta(); enEstados(); });
    st.rueda.fija(st.ton.n, true); enTonPinta();

    st.onKey = function (e) {
      if (EN.st !== st) return;
      var enNota = !!(e.target && e.target.closest && e.target.closest('.lm-en-nota'));
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault(); e.stopPropagation();
        if (enNota) { try { e.target.blur(); } catch (x) {} return; }
        cerrarEnto(); return;
      }
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'z' || e.key === 'Z') && !enNota) { e.preventDefault(); e.stopPropagation(); enDeshacer(); }
    };
    document.addEventListener('keydown', st.onKey, true);
    st.onResize = function () { clearTimeout(st.tRes); st.tRes = setTimeout(function () { if (EN.st === st) enColoca(); }, 120); };
    window.addEventListener('resize', st.onResize);
    st.onFS = function () { if (EN.st !== st) return; enPintaFS(); setTimeout(function () { if (EN.st === st) enColoca(); }, 90); };
    document.addEventListener('fullscreenchange', st.onFS); document.addEventListener('webkitfullscreenchange', st.onFS);

    enPintaHerr(); enPintaVista(); enPintaFS(); enEstados(); enColoca();
    enDoc(d.pdf).then(function (doc) {
      return doc.getPage(pp[0]).then(function (p1) { var v = p1.getViewport({ scale: 1 }); if (v.width) st.A = v.height / v.width; });
    }).then(function () {
      if (EN.st !== st) return;
      st.listo = true; enColoca();
      if (st.vista === 'ancho') enIrALeccion();
    }).catch(function () {
      if (EN.st !== st) return;
      st.carga.textContent = 'No se ha podido abrir el libro. ';
      var r = document.createElement('button'); r.type = 'button'; r.className = 'lm-en-reint'; r.textContent = 'Reintentar';
      r.addEventListener('click', function () { EN.doc = null; EN.docPath = ''; abrirEnto(d); });
      st.carga.appendChild(r);
    });
    try { zona.focus({ preventScroll: true }); } catch (e) {}
  }

  /* ---- la tonalidad de la lección (rueda + ♯ ♭ + M m), guardada con la lección ---- */
  function enTonClave(curso, N) { return 'lm_ento_ton:' + curso + ':L' + N; }
  function enTonLee(curso, N) {
    try {
      var s = JSON.parse(localStorage.getItem(enTonClave(curso, N)) || 'null');
      if (s && typeof s.n === 'number') return { n: Math.max(0, Math.min(VL_NOTAS.length - 1, s.n | 0)), alt: (s.alt === '#' || s.alt === 'b') ? s.alt : '', modo: (s.modo === 'M' || s.modo === 'm') ? s.modo : '' };
    } catch (e) {}
    return { n: 0, alt: '', modo: '' };
  }
  function enTonGuarda() {
    var st = EN.st; if (!st) return;
    try {
      var t = st.ton, k = enTonClave(st.curso, st.leccion);
      if (!t.n && !t.alt && !t.modo) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(t));
    } catch (e) {}
  }
  function enTonBoton(k) {
    var st = EN.st; if (!st) return;
    var t = st.ton;
    if (k === '#' || k === 'b') t.alt = (t.alt === k) ? '' : k; else t.modo = (t.modo === k) ? '' : k;
    enTonGuarda(); enTonPinta(); enEstados();
  }
  function enTonPinta() {
    var st = EN.st; if (!st) return;
    var t = st.ton;
    ['#', 'b', 'M', 'm'].forEach(function (k) { var on = (k === t.alt || k === t.modo); st.bT[k].classList.toggle('on', on); st.bT[k].setAttribute('aria-pressed', on ? 'true' : 'false'); });
    st.rh.classList.toggle('con-nota', t.n > 0);
    var tx = t.n ? VL_NOTAS[t.n] + (t.alt === '#' ? '♯' : t.alt === 'b' ? '♭' : '') + (t.modo === 'M' ? ' Mayor' : t.modo === 'm' ? ' menor' : '') : 'sin indicar';
    st.rh.setAttribute('aria-valuetext', tx); st.rh.title = 'Tonalidad: ' + tx;
  }

  function enPagina(P) {
    var st = EN.st;
    var el = document.createElement('div'); el.className = 'lm-en-pag'; el.setAttribute('data-p', String(P));
    var hoja = document.createElement('div'); hoja.className = 'lm-en-hoja';
    var img = document.createElement('canvas'); img.className = 'lm-en-img';
    var anot = document.createElement('canvas'); anot.className = 'lm-en-anot';
    var toque = document.createElement('div'); toque.className = 'lm-en-toque';
    var notas = document.createElement('div'); notas.className = 'lm-en-notas';
    var alts = document.createElement('div'); alts.className = 'lm-en-alertas';   /* (1-oct-2026) los iconos de alerta, opacos, encima de la tinta */
    hoja.appendChild(img); hoja.appendChild(anot); hoja.appendChild(toque); hoja.appendChild(alts); hoja.appendChild(notas); el.appendChild(hoja);
    var pg = { P: P, data: enLee(st.curso, P), el: el, hoja: hoja, img: img, anot: anot, toque: toque, notas: notas, alts: alts, Wp: 0, Hp: 0, tok: 0, rw: 0, tarea: null };
    enEventos(pg);
    return pg;
  }

  /* ---- colocar las páginas en la vista que toca (y pintarlas a su tamaño) ---- */
  function enColoca() {
    var st = EN.st; if (!st) return;
    if (st.rueda) { try { st.rueda.pos(); } catch (e) {} }
    var z = st.zona, ancho = st.vista === 'ancho';
    z.classList.toggle('ancho', ancho); z.classList.toggle('dos', !ancho);
    var cs = getComputedStyle(z);
    var W = z.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
    var H = z.clientHeight - (parseFloat(cs.paddingTop) || 0) - (parseFloat(cs.paddingBottom) || 0);
    var A = st.A;
    if (ancho) {
      var Wv = Math.round(Math.max(200, Math.min(W * EN_ANCHO_K, W - 2 * EN_CARRIL)));   /* la música, centrada; a los lados, los carriles */
      st.pags.forEach(function (pg) {
        var x = EN_GEO.X[pg.P] || [0, 1000], f0 = x[0] / 1000, f1 = x[1] / 1000;
        pg.Wp = Wv / (f1 - f0); pg.Hp = pg.Wp * A;
        pg.el.style.width = Wv + 'px'; pg.el.style.height = pg.Hp + 'px';
        pg.hoja.style.left = (-f0 * pg.Wp) + 'px';
      });
    } else {
      var wp = Math.max(60, Math.min((W - 2) / 2, H / A));
      st.pags.forEach(function (pg) {
        pg.Wp = wp; pg.Hp = wp * A;
        pg.el.style.width = wp + 'px'; pg.el.style.height = pg.Hp + 'px'; pg.hoja.style.left = '0px';
      });
    }
    st.pags.forEach(function (pg) {
      pg.hoja.style.width = pg.Wp + 'px'; pg.hoja.style.height = pg.Hp + 'px';
      pg.notas.style.fontSize = Math.max(9, pg.Wp * 0.017) + 'px';   /* las notas crecen con la página (sin rehacerlas: se puede estar escribiendo) */
      enAjustaAnot(pg);
      if (!pg.notasHechas) { pg.notasHechas = true; enNotas(pg); }
      if (st.listo) enPinta(pg);
    });
  }
  function enIrALeccion() {
    var st = EN.st; if (!st) return;
    var pg = st.pags.filter(function (p) { return p.P === st.P0; })[0]; if (!pg) return;
    st.zona.scrollTop = Math.max(0, pg.el.offsetTop + st.y0 * pg.Hp - 18);
  }
  /* ---- (29-sep-2026, tarde, Iago) los carriles de los lados, en «a todo el ancho»: ahí se desplaza y nunca se pinta ----
     «Que a los lados, a la derecha y a la izquierda, haya una barra en la que pueda hacer scroll sin miedo a pintar la
      partitura… o que simplemente, si quiero deslizar ahí, que ya lo haga: lo que sea más cómodo.»
     Con el dedo desplaza el propio navegador (con su inercia), como siempre fuera de la página. Con ratón o lápiz (y con
     la pizarra que manda ratón) se arrastra el papel y, al soltar con impulso, sigue un poco. Sin herramienta (la mano),
     también sobre la página. */
  function enCarriles(zona) {
    var a = null;   /* el arrastre en curso */
    zona.addEventListener('pointerdown', function (e) {
      var st = EN.st; if (!st) return;
      enParaInercia();
      if (st.vista !== 'ancho' || e.pointerType === 'touch' || (e.pointerType === 'pen' && EN_IOS)) return;   /* el dedo (y el lápiz del iPad) ya desplazan solos */
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      var t = e.target;
      if (t && t.closest && (t.closest('.lm-en-nota') || (st.herr !== 'mano' && t.closest('.lm-en-pag')))) return;   /* sobre la página con herramienta: se pinta */
      e.preventDefault();
      a = { id: e.pointerId, y: e.clientY, s: zona.scrollTop, v: 0, t: e.timeStamp, ly: e.clientY };
      try { zona.setPointerCapture(e.pointerId); } catch (x) {}
      zona.classList.add('arrastra');
    });
    zona.addEventListener('pointermove', function (e) {
      if (!a || e.pointerId !== a.id) return;
      zona.scrollTop = a.s - (e.clientY - a.y);
      var dt = e.timeStamp - a.t;
      if (dt > 0) { a.v = 0.8 * ((e.clientY - a.ly) / dt) + 0.2 * a.v; a.t = e.timeStamp; a.ly = e.clientY; }
    });
    function suelta(e, anula) {
      if (!a || e.pointerId !== a.id) return;
      var v = a.v, quieto = e.timeStamp - a.t; a = null; zona.classList.remove('arrastra');
      if (!anula && quieto < 90 && Math.abs(v) > 0.25) enInercia(v);
    }
    zona.addEventListener('pointerup', function (e) { suelta(e, false); });
    zona.addEventListener('pointercancel', function (e) { suelta(e, true); });
    zona.addEventListener('wheel', enParaInercia, { passive: true });
  }
  function enInercia(v) {   /* v en px/ms: sigue un poco y se para, como con el dedo */
    var st = EN.st; if (!st) return;
    enParaInercia();
    var t0 = 0;
    function paso(t) {
      if (EN.st !== st) return;
      if (t0) { var dt = Math.min(40, t - t0); v *= Math.pow(0.94, dt / 16.7); st.zona.scrollTop -= v * dt; }
      t0 = t;
      if (Math.abs(v) < 0.02) { st.rafI = 0; return; }
      st.rafI = requestAnimationFrame(paso);
    }
    st.rafI = requestAnimationFrame(paso);
  }
  function enParaInercia() { var st = EN.st; if (st && st.rafI) { cancelAnimationFrame(st.rafI); st.rafI = 0; } }
  function enVista(v) {
    var st = EN.st; if (!st || st.vista === v) return;
    enParaInercia();
    if (st.vista === 'ancho') st.scrollAncho = st.zona.scrollHeight ? st.zona.scrollTop / st.zona.scrollHeight : null;
    st.vista = v; try { localStorage.setItem('lm_ento_vista', v); } catch (e) {}
    enAnula(); enPintaVista(); enColoca();
    if (v === 'ancho') { if (st.scrollAncho == null) enIrALeccion(); else st.zona.scrollTop = st.scrollAncho * st.zona.scrollHeight; }
    else st.zona.scrollTop = 0;
  }
  function enPintaVista() {
    var st = EN.st; if (!st) return;
    ['ancho', 'dos'].forEach(function (k) { var on = st.vista === k; st.bV[k].classList.toggle('on', on); st.bV[k].setAttribute('aria-pressed', on ? 'true' : 'false'); });
  }
  function enPinta(pg) {   /* la página del libro, pintada a la resolución de la pantalla */
    var st = EN.st; if (!st || !EN.doc) return;
    var dpr = window.devicePixelRatio || 1, cap = EN_IOS ? 8e6 : 24e6;
    var w = pg.Wp * dpr; if (w * w * st.A > cap) w = Math.sqrt(cap / st.A);
    w = Math.max(1, Math.round(w));
    if (pg.rw && Math.abs(pg.rw - w) / w < 0.15) return;   /* ya está pintada a un tamaño parecido */
    var tok = ++pg.tok;
    if (pg.tarea) { try { pg.tarea.cancel(); } catch (e) {} pg.tarea = null; }
    EN.doc.getPage(pg.P).then(function (page) {
      if (tok !== pg.tok || EN.st !== st) return;
      var v1 = page.getViewport({ scale: 1 }), vp = page.getViewport({ scale: w / v1.width });
      var cv = document.createElement('canvas'); cv.width = Math.round(vp.width); cv.height = Math.round(vp.height);
      var ctx = cv.getContext('2d', { alpha: false }); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height);
      pg.tarea = page.render({ canvasContext: ctx, viewport: vp });
      return pg.tarea.promise.then(function () {
        pg.tarea = null;
        if (tok !== pg.tok || EN.st !== st) { cv.width = cv.height = 0; return; }
        cv.className = 'lm-en-img';
        var viejo = pg.img; pg.hoja.replaceChild(cv, viejo); viejo.width = viejo.height = 0;
        pg.img = cv; pg.rw = w;
        if (st.carga && st.carga.parentNode) st.carga.parentNode.removeChild(st.carga);
      });
    }).catch(function () {});
  }

  /* ---- dibujar ---- */
  function enAjustaAnot(pg) {
    var dpr = Math.min(2, window.devicePixelRatio || 1), cap = EN_IOS ? 5e6 : 14e6;
    var w = pg.Wp * dpr, h = pg.Hp * dpr; if (w * h > cap) { var k = Math.sqrt(cap / (w * h)); w *= k; h *= k; }
    w = Math.max(1, Math.round(w)); h = Math.max(1, Math.round(h));
    if (pg.anot.width !== w || pg.anot.height !== h) { pg.anot.width = w; pg.anot.height = h; }
    enRedibuja(pg);
  }
  function enTrazo(x, sk, W, H, vivo) {
    var p = sk.p; if (!p || !p.length) return;
    var iv = !!sk.i;   /* (30-sep-2026) un intervalo: como en el libro (opaco, fino y recto en los extremos); también los ya pintados */
    x.save();
    x.globalAlpha = iv ? 1 : (vivo ? 1 : (sk.o || 1));
    x.strokeStyle = sk.c; x.lineCap = (iv && p.length > 1) ? 'butt' : 'round'; x.lineJoin = 'round';
    x.lineWidth = iv ? Math.max(2, EN_INTW * W) : Math.max(sk.o ? 3 : 1.4, sk.w * W);
    x.beginPath(); x.moveTo(p[0][0] * W, p[0][1] * H);
    if (p.length === 1) x.lineTo(p[0][0] * W + 0.01, p[0][1] * H);
    for (var i = 1; i < p.length; i++) x.lineTo(p[i][0] * W, p[i][1] * H);
    x.stroke(); x.restore();
  }
  /* (1-oct-2026, Iago) «Una vez que trazo la línea del intervalo, que aparezca en texto negro, pequeño y discreto, como recordatorio,
     qué intervalo es: paralelo a la línea y justo debajo» (una línea rojo oscuro en diagonal → «2m» debajo, en esa misma diagonal).
     Sale al soltar. No se guarda nada aparte: sale del propio trazo (sk.i), así que también lo llevan los ya pintados. */
  function enEtiqueta(x, sk, W, H) {
    var p = sk.p; if (!sk.i || !p || p.length < 2) return;
    var q = p.map(function (v) { return [v[0] * W, v[1] * H]; }), a = q[0], b = q[q.length - 1];
    var dx = b[0] - a[0], dy = b[1] - a[1]; if (Math.sqrt(dx * dx + dy * dy) < 8) return;
    if (dx < 0) { dx = -dx; dy = -dy; }                                   /* que se lea de izquierda a derecha */
    var ang = Math.atan2(dy, dx), tot = 0, seg = [], i;
    for (i = 1; i < q.length; i++) { var s = Math.sqrt(Math.pow(q[i][0] - q[i - 1][0], 2) + Math.pow(q[i][1] - q[i - 1][1], 2)); seg.push(s); tot += s; }
    var mid = q[0], acc = 0;                                                /* el punto medio del trazo (por su longitud) */
    for (i = 0; i < seg.length; i++) { if (acc + seg[i] >= tot / 2) { var t = seg[i] ? (tot / 2 - acc) / seg[i] : 0; mid = [q[i][0] + (q[i + 1][0] - q[i][0]) * t, q[i][1] + (q[i + 1][1] - q[i][1]) * t]; break; } acc += seg[i]; }
    var r = W / ((x.canvas && x.canvas.clientWidth) || W) || 1;           /* px de pantalla → px del lienzo */
    var fs = Math.max(9 * r, Math.min(15 * r, W * 0.0095));                /* pequeño: como una cabeza de nota, nunca menos de 9 px */
    var off = Math.max(2, EN_INTW * W) / 2 + fs * 0.75;                     /* justo debajo de la línea, sin tocarla */
    var cx = Math.max(fs * 1.5, Math.min(W - fs * 1.5, mid[0] - Math.sin(ang) * off)), cy = Math.max(fs, Math.min(H - fs, mid[1] + Math.cos(ang) * off));
    x.save(); x.translate(cx, cy); x.rotate(ang);
    x.font = '700 ' + fs.toFixed(1) + 'px "Helvetica Neue", Helvetica, Arial, sans-serif';
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.globalAlpha = 0.9; x.fillStyle = '#000';
    x.fillText(sk.i, 0, 0); x.restore();
  }
  function enRedibuja(pg) {
    var c = pg.anot, x = c.getContext('2d'); x.clearRect(0, 0, c.width, c.height);
    enAlPinta(x, pg, c.width, c.height, 'zonas', null);    /* (1-oct-2026) las zonas de alerta, debajo de los trazos */
    pg.data.s.forEach(function (sk) { enTrazo(x, sk, c.width, c.height, false); });
    pg.data.s.forEach(function (sk) { enEtiqueta(x, sk, c.width, c.height); });   /* (1-oct-2026) el nombre del intervalo, encima de todo */
    enAlDom(pg);                                            /* y sus iconos, en su capa (opacos, encima de la tinta) */
  }
  /* ---- (1-oct-2026, Iago) ALERTA AMARILLA: {c:'a', p:[x,y]} (icono) o {c:'a', z:[x0,y0,x1,y1]} (zona), en fracciones de la página ---- */
  var EN_AL = { a: { f: '#facc15', z: 'rgba(250,204,21,.30)', b: 'rgba(202,138,4,.9)' } };   /* el amarillo de «Mis resultados» */
  function enAlTam(W, r) { return Math.max(16 * r, Math.min(60 * r, W * 0.032)); }   /* el icono: un 3,2 % del ancho de la página */
  function enAlCentro(al, W, H, S) {   /* el punto tocado, o la esquina de arriba a la izquierda de la zona (sin salirse) */
    var x = al.p ? al.p[0] * W : al.z[0] * W, y = al.p ? al.p[1] * H : al.z[1] * H;
    return [Math.max(S * 0.58, Math.min(W - S * 0.58, x)), Math.max(S * 0.55, Math.min(H - S * 0.5, y))];
  }
  function enAlIcono(x, cx, cy, S, c) {
    x.save(); x.lineJoin = 'round'; x.lineCap = 'round';
    x.beginPath(); x.moveTo(cx, cy - S * 0.5); x.lineTo(cx + S * 0.56, cy + S * 0.44); x.lineTo(cx - S * 0.56, cy + S * 0.44); x.closePath();
    x.fillStyle = (EN_AL[c] || EN_AL.a).f; x.fill(); x.lineWidth = Math.max(1.2, S * 0.075); x.strokeStyle = '#111'; x.stroke();
    x.lineWidth = Math.max(1.4, S * 0.1); x.beginPath(); x.moveTo(cx, cy - S * 0.15); x.lineTo(cx, cy + S * 0.13); x.stroke();
    x.beginPath(); x.arc(cx, cy + S * 0.29, Math.max(0.9, S * 0.062), 0, Math.PI * 2); x.fillStyle = '#111'; x.fill();
    x.restore();
  }
  function enAlZona(x, z, W, H, c, r) {
    var k = EN_AL[c] || EN_AL.a, x0 = z[0] * W, y0 = z[1] * H, w = (z[2] - z[0]) * W, h = (z[3] - z[1]) * H, rad = Math.max(0, Math.min(6 * r, w / 2, h / 2));
    x.save(); x.beginPath();
    if (x.roundRect) x.roundRect(x0, y0, w, h, rad); else x.rect(x0, y0, w, h);
    x.fillStyle = k.z; x.fill(); x.lineWidth = Math.max(1, 1.5 * r); x.strokeStyle = k.b; x.stroke(); x.restore();
  }
  function enAlPinta(x, pg, W, H, capa, extra) {   /* capa 'zonas' (debajo de los trazos) o 'iconos' (encima de todo) */
    var r = W / (pg.Wp || W) || 1, S = enAlTam(W, r), L = (pg.data.a || []).slice();
    if (extra) L.push(extra);
    L.forEach(function (al) {
      if (capa === 'zonas') { if (al.z) enAlZona(x, al.z, W, H, al.c, r); }
      else { var c0 = enAlCentro(al, W, H, S); enAlIcono(x, c0[0], c0[1], S, al.c); }
    });
  }
  /* los iconos, como elementos encima de la página: el lienzo de las marcas se mezcla con la tinta (multiplica) y un icono
     encima de una nota se vería «transparente»; así se ven enteros, como en ritmo */
  var EN_AL_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.4L21.4 19.6H2.6Z" fill="#facc15" stroke="#000" stroke-width="1.3" stroke-linejoin="round"/><path d="M12 9.3v4.9" stroke="#000" stroke-width="2.1" stroke-linecap="round"/><circle cx="12" cy="16.9" r="1.25" fill="#000"/></svg>';
  function enAlDom(pg) {
    var box = pg.alts; if (!box) return;
    var L = pg.data.a || [], W = pg.Wp || 1, H = pg.Hp || 1, S = enAlTam(W, 1), B = (S * 1.44).toFixed(1), h = '';
    L.forEach(function (al) {
      var c0 = enAlCentro(al, W, H, S);
      h += '<span class="lm-en-al" style="left:' + (c0[0] / W * 100).toFixed(3) + '%;top:' + (c0[1] / H * 100).toFixed(3) + '%;width:' + B + 'px;height:' + B + 'px">' + EN_AL_SVG + '</span>';
    });
    box.innerHTML = h;
  }
  function enAlVivo(a) {   /* la zona que se está arrastrando, en el lienzo del trazo en curso */
    var st = EN.st, v = st.vivo, pg = a.pg;
    if (v.width !== pg.anot.width || v.height !== pg.anot.height) { v.width = pg.anot.width; v.height = pg.anot.height; }
    v.style.opacity = '1';
    if (v.parentNode !== pg.hoja) pg.hoja.insertBefore(v, pg.toque);
    var x = v.getContext('2d'); x.clearRect(0, 0, v.width, v.height);
    if (a.z) { var al = { c: 'a', z: a.z }; enAlZona(x, a.z, v.width, v.height, 'a', v.width / (pg.Wp || v.width)); var S = enAlTam(v.width, v.width / (pg.Wp || v.width)), c0 = enAlCentro(al, v.width, v.height, S); enAlIcono(x, c0[0], c0[1], S, 'a'); }
  }
  function enPunto(pg, e) {
    var r = pg.hoja.getBoundingClientRect();
    return [Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), Math.max(0, Math.min(1, (e.clientY - r.top) / r.height))];
  }
  function enEmpieza(pg, p, id) {
    var st = EN.st, k = st.herr, sk;
    if (k === 'fina') sk = { c: EN_TINTA, w: EN_FINA, p: [p] };
    else { var it = EN_INT[+k.slice(1)] || EN_INT[0]; sk = { c: it[1], w: EN_INTW, i: it[0], p: [p] }; }   /* (30-sep-2026) opaco */
    st.cur = { pg: pg, id: id, sk: sk };
    var v = st.vivo;
    if (v.width !== pg.anot.width || v.height !== pg.anot.height) { v.width = pg.anot.width; v.height = pg.anot.height; }
    v.style.opacity = sk.o ? String(sk.o) : '1';
    if (v.parentNode !== pg.hoja) pg.hoja.insertBefore(v, pg.toque);
    enVivo();
  }
  function enVivo() {
    var st = EN.st; if (!st) return;
    var c = st.cur, v = st.vivo, x = v.getContext('2d');
    x.clearRect(0, 0, v.width, v.height);
    if (c) enTrazo(x, c.sk, v.width, v.height, true);
  }
  function enSigue(p) {
    var c = EN.st.cur, q = c.sk.p[c.sk.p.length - 1];
    var dx = (p[0] - q[0]) * c.pg.Wp, dy = (p[1] - q[1]) * c.pg.Hp;
    if (dx * dx + dy * dy < (c.sk.i ? 2.25 : 0.6)) return false;
    c.sk.p.push(p); return true;
  }
  function enTermina() {
    var st = EN.st, c = st && st.cur; if (!c) return;
    st.cur = null;
    var sk = c.sk; sk.p = sk.p.map(function (q) { return [Math.round(q[0] * 1e4) / 1e4, Math.round(q[1] * 1e4) / 1e4]; });
    c.pg.data.s.push(sk);
    enRedibuja(c.pg);   /* (1-oct-2026) todo otra vez: así el nombre del intervalo sale debajo y queda encima de los trazos */
    var v = st.vivo; v.getContext('2d').clearRect(0, 0, v.width, v.height);
    st.hist.push({ t: 'trazo', pg: c.pg, sk: sk }); enGuarda(c.pg); enEstados();
  }
  function enAnula() {   /* un trazo a medias que no vale (dos dedos para desplazar, cambio de vista…) */
    var st = EN.st; if (!st) return;
    if (st.al) { st.al = null; var v0 = st.vivo; v0.getContext('2d').clearRect(0, 0, v0.width, v0.height); }   /* (1-oct-2026) la alerta a medias, tampoco */
    if (!st.cur) return;
    st.cur = null; var v = st.vivo; v.getContext('2d').clearRect(0, 0, v.width, v.height);
  }
  function enDistSeg(p, a, b, A) {
    var px = p[0], py = p[1] * A, ax = a[0], ay = a[1] * A, bx = b[0], by = b[1] * A;
    var dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy, t = L ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L)) : 0;
    var cx = ax + t * dx - px, cy = ay + t * dy - py; return Math.sqrt(cx * cx + cy * cy);
  }
  function enBorraEn(pg, p) {   /* la goma se lleva el trazo que toca (como en ritmo) */
    var s = pg.data.s, r = 14 / pg.Wp, A = pg.Hp / pg.Wp;
    for (var i = s.length - 1; i >= 0; i--) {
      var sk = s[i], q = sk.p, rr = r + (sk.w || 0) / 2;
      for (var j = 0; j < q.length; j++) {
        if (enDistSeg(p, q[j], q[j + 1] || q[j], A) < rr) {
          s.splice(i, 1); EN.st.hist.push({ t: 'goma', pg: pg, sk: sk, i: i }); enRedibuja(pg); enEstados(); return true;
        }
      }
    }
    /* (1-oct-2026) si no tocó ningún trazo: la alerta cuyo icono toca, o el borde de su zona */
    var L = pg.data.a || [], S = enAlTam(pg.Wp, 1), px = p[0] * pg.Wp, py = p[1] * pg.Hp;
    for (var k = L.length - 1; k >= 0; k--) {
      var al = L[k], c0 = enAlCentro(al, pg.Wp, pg.Hp, S), dx = px - c0[0], dy = py - c0[1], hit = dx * dx + dy * dy < (S * 0.7) * (S * 0.7);
      if (!hit && al.z) {
        var x0 = al.z[0] * pg.Wp, y0 = al.z[1] * pg.Hp, x1 = al.z[2] * pg.Wp, y1 = al.z[3] * pg.Hp, m = 12;
        hit = px > x0 - m && px < x1 + m && py > y0 - m && py < y1 + m && (Math.min(Math.abs(px - x0), Math.abs(px - x1)) < m || Math.min(Math.abs(py - y0), Math.abs(py - y1)) < m);
      }
      if (hit) { L.splice(k, 1); EN.st.hist.push({ t: 'goma-al', pg: pg, al: al, i: k }); enRedibuja(pg); enEstados(); return true; }
    }
    return false;
  }
  function enMedioY() { var st = EN.st, ks = Object.keys(st.dedos), y = 0; ks.forEach(function (k) { y += st.dedos[k].y; }); return ks.length ? y / ks.length : 0; }
  function enEventos(pg) {
    var capa = pg.toque, raf = 0;
    capa.addEventListener('pointerdown', function (e) {
      var st = EN.st; if (!st || st.herr === 'mano') return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      var ae = document.activeElement;   /* tocar la página termina la nota que se estaba escribiendo */
      if (ae && ae.closest && ae.closest('.lm-en-nota')) { try { ae.blur(); } catch (x) {} }
      if (e.pointerType === 'touch') {
        st.dedos[e.pointerId] = { y: e.clientY };
        if (Object.keys(st.dedos).length >= 2) { enAnula(); st.borrando = null; st.pan = { y: enMedioY() }; return; }   /* dos dedos: desplazar */
      }
      if (st.pan) return;
      try { capa.setPointerCapture(e.pointerId); } catch (x) {}
      var p = enPunto(pg, e);
      if (st.herr === 'nota') { enPonNota(pg, p); return; }
      if (st.herr === 'goma') { st.borrando = { pg: pg, id: e.pointerId, hubo: enBorraEn(pg, p) }; return; }
      if (st.herr === 'alerta') { st.al = { pg: pg, id: e.pointerId, p0: p, sx: e.clientX, sy: e.clientY, zona: false, z: null }; return; }   /* (1-oct-2026) se decide al soltar */
      enEmpieza(pg, p, e.pointerId);
    });
    capa.addEventListener('pointermove', function (e) {
      var st = EN.st; if (!st) return;
      if (e.pointerType === 'touch' && st.dedos[e.pointerId]) st.dedos[e.pointerId].y = e.clientY;
      if (st.pan) { var y = enMedioY(); st.zona.scrollTop -= (y - st.pan.y); st.pan.y = y; return; }
      if (st.borrando && st.borrando.id === e.pointerId) { if (enBorraEn(st.borrando.pg, enPunto(st.borrando.pg, e))) st.borrando.hubo = true; return; }
      if (st.al && st.al.id === e.pointerId) {   /* (1-oct-2026) arrastrando la alerta: la zona sigue al dedo */
        var a = st.al, ddx = e.clientX - a.sx, ddy = e.clientY - a.sy;
        if (!a.zona && ddx * ddx + ddy * ddy > 64) a.zona = true;
        if (a.zona) { var q2 = enPunto(a.pg, e); a.z = [Math.min(a.p0[0], q2[0]), Math.min(a.p0[1], q2[1]), Math.max(a.p0[0], q2[0]), Math.max(a.p0[1], q2[1])]; enAlVivo(a); }
        return;
      }
      if (!st.cur || st.cur.id !== e.pointerId) return;
      var lista = (e.getCoalescedEvents && e.getCoalescedEvents()) || [], hay = false;
      if (!lista.length) lista = [e];
      lista.forEach(function (ev) { if (enSigue(enPunto(st.cur.pg, ev))) hay = true; });
      if (hay && !raf) raf = requestAnimationFrame(function () { raf = 0; enVivo(); });
    });
    function suelta(e, anula) {
      var st = EN.st; if (!st) return;
      if (e.pointerType === 'touch') { delete st.dedos[e.pointerId]; if (st.pan && !Object.keys(st.dedos).length) st.pan = null; }
      if (st.borrando && st.borrando.id === e.pointerId) { var b = st.borrando; st.borrando = null; if (b.hubo) enGuarda(b.pg); }
      if (st.al && st.al.id === e.pointerId) {   /* (1-oct-2026) al soltar: el icono (toque) o la zona (arrastre) */
        var a = st.al; st.al = null;
        var v = st.vivo; v.getContext('2d').clearRect(0, 0, v.width, v.height);
        if (!anula) {
          var r4 = function (n) { return Math.round(n * 1e4) / 1e4; };
          var al = (a.zona && a.z && (a.z[2] - a.z[0]) * a.pg.Wp >= 12 && (a.z[3] - a.z[1]) * a.pg.Hp >= 10) ? { c: 'a', z: a.z.map(r4) } : { c: 'a', p: [r4(a.p0[0]), r4(a.p0[1])] };
          if (!a.pg.data.a) a.pg.data.a = [];
          a.pg.data.a.push(al); st.hist.push({ t: 'alerta', pg: a.pg, al: al });
          enRedibuja(a.pg); enGuarda(a.pg); enEstados();
        }
      }
      if (st.cur && st.cur.id === e.pointerId) { if (anula) enAnula(); else { if (raf) { cancelAnimationFrame(raf); raf = 0; } enTermina(); } }
    }
    capa.addEventListener('pointerup', function (e) { suelta(e, false); });
    capa.addEventListener('pointercancel', function (e) { suelta(e, true); });
  }
  function enHerr(h) {
    var st = EN.st; if (!st) return;
    if (st.herr === h) h = 'mano';   /* tocar la herramienta puesta la suelta: el dedo vuelve a desplazar */
    st.herr = h; if (h === 'fina' || h.charAt(0) === 'i') st.dibujo = h;
    enAnula(); enPintaHerr();
  }
  function enPintaHerr() {
    var st = EN.st; if (!st) return;
    Object.keys(st.bH).forEach(function (k) { var on = k === st.herr; st.bH[k].classList.toggle('on', on); st.bH[k].setAttribute('aria-pressed', on ? 'true' : 'false'); });
    st.ov.classList.toggle('lm-en-dibuja', st.herr !== 'mano');
    /* escribiendo, SIN puntero (como en el Pentagrama); la goma enseña su círculo; la nota, el de texto */
    var c = 'none';
    if (st.herr === 'goma') c = 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"><circle cx="15" cy="15" r="14" fill="#ffffff" fill-opacity="0.35" stroke="#374151" stroke-width="1.5"/></svg>') + '") 15 15, crosshair';
    else if (st.herr === 'nota') c = 'text';
    else if (st.herr === 'alerta') c = 'crosshair';   /* (1-oct-2026) */
    else if (st.herr === 'mano') c = '';
    st.pags.forEach(function (pg) { pg.toque.style.cursor = c; });
  }

  /* ---- notas de texto (van con la página: mismo sitio y mismo tamaño relativo en las dos vistas) ---- */
  function enPonNota(pg, p) {
    var st = EN.st, nt = { x: Math.min(0.9, p[0]), y: Math.min(0.97, p[1]), t: '' };
    pg.data.n.push(nt); st.hist.push({ t: 'nota', pg: pg, nt: nt });
    enNotas(pg); enEstados();
    var el = pg.notas.lastChild, tx = el && el.querySelector('.lm-en-nota-t');
    if (tx) { try { tx.focus(); } catch (e) {} }   /* en el mismo toque: así el iPad saca el teclado */
    st.herr = st.dibujo; enPintaHerr();   /* una nota por toque; se vuelve a la punta o al subrayador de antes */
  }
  function enNotas(pg) {
    pg.notas.innerHTML = '';
    pg.data.n.forEach(function (nt) { pg.notas.appendChild(enNotaEl(pg, nt)); });
  }
  function enNotaEl(pg, nt) {
    var d = document.createElement('div'); d.className = 'lm-en-nota';
    d.style.left = (nt.x * 100) + '%'; d.style.top = (nt.y * 100) + '%';
    d.innerHTML = '<span class="lm-en-nota-asa" title="Mover"></span><button type="button" class="lm-en-nota-x" aria-label="Borrar nota" title="Borrar nota">×</button>' +
      '<div class="lm-en-nota-t" contenteditable="true" spellcheck="false"></div>';
    var tx = d.querySelector('.lm-en-nota-t'); tx.textContent = nt.t || '';
    tx.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    tx.addEventListener('input', function () { nt.t = tx.textContent || ''; enGuarda(pg); });
    tx.addEventListener('blur', function () {
      nt.t = tx.textContent || '';
      if (!nt.t.trim()) { var k = pg.data.n.indexOf(nt); if (k >= 0) { pg.data.n.splice(k, 1); enNotas(pg); enEstados(); } }
      enGuarda(pg);
    });
    var x = d.querySelector('.lm-en-nota-x');
    x.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    x.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      var k = pg.data.n.indexOf(nt); if (k >= 0) pg.data.n.splice(k, 1);
      enNotas(pg); enGuarda(pg); enEstados();
    });
    d.querySelector('.lm-en-nota-asa').addEventListener('pointerdown', function (e) {
      e.preventDefault(); e.stopPropagation();
      var r = pg.hoja.getBoundingClientRect();
      var mueve = function (ev) {
        nt.x = Math.max(0, Math.min(0.96, (ev.clientX - r.left) / r.width)); nt.y = Math.max(0, Math.min(0.98, (ev.clientY - r.top) / r.height));
        d.style.left = (nt.x * 100) + '%'; d.style.top = (nt.y * 100) + '%';
      };
      var fin = function () { document.removeEventListener('pointermove', mueve); document.removeEventListener('pointerup', fin); document.removeEventListener('pointercancel', fin); enGuarda(pg); };
      document.addEventListener('pointermove', mueve); document.addEventListener('pointerup', fin); document.addEventListener('pointercancel', fin);
    });
    return d;
  }

  /* ---- deshacer · borrar todo ---- */
  function enDeshacer() {
    var st = EN.st, h = st && st.hist.pop(); if (!h) return;
    if (h.t === 'trazo') { var k = h.pg.data.s.indexOf(h.sk); if (k >= 0) h.pg.data.s.splice(k, 1); enRedibuja(h.pg); enGuarda(h.pg); }
    else if (h.t === 'goma') { h.pg.data.s.splice(Math.min(h.i, h.pg.data.s.length), 0, h.sk); enRedibuja(h.pg); enGuarda(h.pg); }
    else if (h.t === 'nota') { var j = h.pg.data.n.indexOf(h.nt); if (j >= 0) h.pg.data.n.splice(j, 1); enNotas(h.pg); enGuarda(h.pg); }
    else if (h.t === 'alerta') { var ka = h.pg.data.a.indexOf(h.al); if (ka >= 0) h.pg.data.a.splice(ka, 1); enRedibuja(h.pg); enGuarda(h.pg); }   /* (1-oct-2026) */
    else if (h.t === 'goma-al') { h.pg.data.a.splice(Math.min(h.i, h.pg.data.a.length), 0, h.al); enRedibuja(h.pg); enGuarda(h.pg); }
    else if (h.t === 'borrar') {   /* (1-oct-2026) y la tonalidad que había */
      h.antes.forEach(function (a) { a.pg.data = a.data; enRedibuja(a.pg); enNotas(a.pg); enGuarda(a.pg); });
      if (h.ton) { st.ton = { n: h.ton.n, alt: h.ton.alt, modo: h.ton.modo }; enTonGuarda(); try { st.rueda.fija(st.ton.n, true); } catch (e) {} enTonPinta(); }
    }
    enEstados();
  }
  function enHayMarcas() { return EN.st.pags.some(function (pg) { return pg.data.s.length || pg.data.n.length || (pg.data.a && pg.data.a.length); }); }
  function enHayTon() { var t = EN.st && EN.st.ton; return !!(t && (t.n || t.alt || t.modo)); }
  /* (1-oct-2026, Iago) «que el botón borrar sea de un toque, sin darle dos veces, y que también borre la tonalidad»: de un toque
     se va todo (trazos, alertas, notas y la tonalidad); si fue sin querer, «Deshacer» lo devuelve. */
  function enBorrarTodo() {
    var st = EN.st; if (!st || !(enHayMarcas() || enHayTon())) return;
    if (st.armado) { clearTimeout(st.armado); st.armado = 0; }
    st.hist.push({ t: 'borrar', antes: st.pags.map(function (pg) { return { pg: pg, data: pg.data }; }), ton: { n: st.ton.n, alt: st.ton.alt, modo: st.ton.modo } });
    st.pags.forEach(function (pg) { pg.data = { s: [], n: [], a: [] }; enRedibuja(pg); enNotas(pg); enGuarda(pg); });
    st.ton = { n: 0, alt: '', modo: '' }; enTonGuarda(); try { st.rueda.fija(0, true); } catch (e) {} enTonPinta();
    enEstados();
  }
  /* (1-oct-2026, Iago) TESTER y PROTESTER: «como lo uso en clase con varios grupos del mismo curso, cada vez que entre, la pantalla
     despejada»: lo de la lección (marcas de sus páginas y la tonalidad) se borra al entrar y al salir del libro. */
  function enVacia(curso, N, Ps) {
    try { (Ps || []).forEach(function (P) { localStorage.removeItem(enClave(curso, P)); }); localStorage.removeItem(enTonClave(curso, N)); } catch (e) {}
  }
  function enEstados() {
    var st = EN.st; if (!st) return;
    st.bU.disabled = !st.hist.length;
    st.bC.disabled = !(enHayMarcas() || enHayTon());   /* (1-oct-2026) con solo la tonalidad puesta, también se puede borrar */
    st.bC.classList.toggle('armado', !!st.armado); st.bar.classList.toggle('lm-vl-armado', !!st.armado);
    if (st.armado) {
      var r = st.bC.getBoundingClientRect(), rb = st.bar.getBoundingClientRect(), w = st.aviso.offsetWidth || 180;
      var x = r.left + r.width / 2 - rb.left; st.aviso.style.left = Math.max(w / 2 + 6, Math.min(rb.width - w / 2 - 6, x)) + 'px';
    }
  }

  /* ---- pantalla completa · cerrar ---- */
  function enAlternaPantalla() {   /* (29-sep-2026) OJO: «enPantalla» ya es de la sección 11 (¿está en pantalla completa?) */
    var fs = document.fullscreenElement || document.webkitFullscreenElement;
    if (fs) { try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) {} return; }
    var ov = EN.st && EN.st.ov, rq = ov && (ov.requestFullscreen || ov.webkitRequestFullscreen);
    if (rq) { try { var p = rq.call(ov); if (p && p.catch) p.catch(function () {}); } catch (e) {} }
  }
  function enPintaFS() {
    var st = EN.st; if (!st) return;
    var fs = !!(document.fullscreenElement || document.webkitFullscreenElement);
    st.bF.innerHTML = ico(fs ? 'contraer' : 'expandir');
    st.bF.title = fs ? 'Salir de pantalla completa' : 'Pantalla completa'; st.bF.setAttribute('aria-label', st.bF.title);
    st.bF.style.display = (document.fullscreenEnabled || document.webkitFullscreenEnabled) ? '' : 'none';
  }
  function cerrarEnto() {
    var st = EN.st; if (!st) return;
    var ae = document.activeElement; if (ae && st.ov.contains(ae)) { try { ae.blur(); } catch (e) {} }   /* la nota que se estaba escribiendo se guarda */
    enParaInercia();
    EN.st = null;
    document.removeEventListener('keydown', st.onKey, true); window.removeEventListener('resize', st.onResize);
    document.removeEventListener('fullscreenchange', st.onFS); document.removeEventListener('webkitfullscreenchange', st.onFS);
    clearTimeout(st.tRes); if (st.armado) clearTimeout(st.armado);
    var fs = document.fullscreenElement || document.webkitFullscreenElement;
    if (fs === st.ov) { try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) {} }
    st.pags.forEach(function (pg) {
      pg.tok++; if (pg.tarea) { try { pg.tarea.cancel(); } catch (e) {} }
      pg.img.width = pg.img.height = 0; pg.anot.width = pg.anot.height = 0;
    });
    st.vivo.width = st.vivo.height = 0;
    if (st.ov.parentNode) st.ov.parentNode.removeChild(st.ov);
    document.documentElement.classList.remove('lm-en-on');
    if (esProfe()) enVacia(st.curso, st.leccion, st.pags.map(function (pg) { return pg.P; }));   /* (1-oct-2026) Tester/Protester: al salir, despejada */
    try { var b = q('#lm-iconos .lm-ic-ento'); if (b) b.focus({ preventScroll: true }); } catch (e) {}
  }

  /* ---------- 18 (30-sep-2026, Iago): MÚSICA EN EL PORTAL · SOLO Tester/Protester (GE y GP) ----------
     «Música instrumental en los portales, solo en Tester y Protester: un play debajo de "Bienvenido/a…", en una tira desde
      "Bienvenido" hasta debajo de "Salir", con una animación que reaccione al audio y el título y el autor en pequeño.
      Pulsar = suena; pulsar sonando = para; pulsar otra vez = otra canción (sin repetir hasta que hayan sonado todas).»
     · 30 temas instrumentales de Kevin MacLeod (incompetech.com, licencia CC BY 4.0: se citan autor, fuente y licencia), a
       128 kbps y con el volumen igualado, en ge.lmathome.es/musica/ (lista.json: título, autor, estilo y duración).
     · Al acabar un tema, sigue el siguiente sin silencio (ver musVigila). El orden (barajado) se guarda en este aparato: no
       se repite ninguno hasta que han sonado los 30; entonces se vuelve a barajar. Al parar, baja el volumen en medio segundo.
     · La animación: barras con los colores de los apartados (teoría, dictado, entonación, ritmo, PreDict) que se mueven con
       lo que suena (Web Audio). «Que la línea animada ocupe todo el ancho, que las ondas de frecuencias suban pero no
       bajen, y debajo el título»: las barras nacen de una línea fina (el nivel de silencio) y solo suben; el título va
       debajo de esa línea. Parada, solo queda la línea.
     · «Que el play parpadee desde 5 minutos antes de que empiece cada clase de mis grupos hasta el minuto 5 de clase, o
       hasta que lo pulse. Un parpadeo smooth, que invite a pulsar pero que no sea on/off; como la campana, pero en lugar del
       circulito con un número, un simbolito de corchea.» Las horas de clase salen del horario que se pone en el wizard
       «Nuevo curso» del Diario (horario_clases); si no se puede leer, de MUS_HORAS (más abajo). La pantalla del aula no
       necesita tener el Diario abierto.
     Para quitarlo: borrar esta sección, su línea en todo() y su CSS (sección 18 de portal.css). */
  var MUS = { lista: null, cargando: false, error: false, els: null, act: 0, prep: null, precargado: false, ctx: null, gan: null,
              an: null, datos: null, actual: null, sonando: false, raf: 0, cv: null, el: null, parando: 0, fallos: 0, cols: null };
  var MUS_BASE = 'https://ge.lmathome.es/musica/';
  var MUS_ORDEN = 'lm_musica_orden_v1', MUS_PULSADO = 'lm_musica_pulsado:';
  var MUS_LIC = 'https://creativecommons.org/licenses/by/4.0/';
  /* barras: una cada ~5 px de ancho; frecuencias de 45 Hz a 12 kHz en escala logarítmica. Para que se mueva todo el ancho
     (también la parte de los agudos y en los temas suaves, como las bossas): +3 dB por octava por debajo de 1 kHz y +6 por
     encima, y cada barra se mide contra su propio pico reciente (que baja 3 dB por segundo), sin darle más de 15 dB de
     ventaja sobre la barra que suena más fuerte; 32 dB por debajo de ese pico = en la línea. Ajustado con los 30 temas. */
  var MUS_F0 = 45, MUS_F1 = 12000, MUS_T1 = 3, MUS_T2 = 6, MUS_RANGO = 32, MUS_TOPE = 15, MUS_SUELO = -50;
  /* (30-sep-2026, Iago) «que suene como música de fondo, un poco más bajo que el volumen que tendría normalmente (no a la
     mitad: es cuando van entrando y hablando)»: −6 dB respecto a antes (0,85 → 0,43). Y tras oírla: «le bajaría un pelín
     más»: 3 dB menos (0,43 → 0,3). Las barras miran el sonido ANTES de este volumen, así que se mueven igual. Para subirla
     o bajarla, este número (0,43 ≈ 3 dB más; 0,21 ≈ 3 dB menos). */
  var MUS_VOL = 0.3;
  var MUS_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 5.6v12.8L19 12z" fill="currentColor"/></svg>';
  var MUS_STOP = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="6.5" width="11" height="11" rx="2" fill="currentColor"/></svg>';
  /* la corchea del globito (en lugar del numerito de la campana) */
  var MUS_NOTA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 3.5v11.3a3.6 3.6 0 1 0 2 3.2V7.6c2.2.4 3.8 1.5 4.7 3.3.2-3.4-1.9-6.2-6.7-7.4z" fill="currentColor"/></svg>';
  function musCargar() {
    if (MUS.lista || MUS.cargando || MUS.error) return;
    MUS.cargando = true;
    fetch(MUS_BASE + 'lista.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) {
        var t = (d && Array.isArray(d.temas)) ? d.temas.filter(function (x) { return x && x.f && x.t; }) : [];
        if (!t.length) throw new Error('lista vacía');
        d.temas = t; MUS.lista = d; musica();
      })
      .catch(function () { MUS.error = true; setTimeout(function () { MUS.error = false; }, 10 * 60e3); })   /* sin lista, sin tira */
      .then(function () { MUS.cargando = false; });
  }
  /* el siguiente tema: orden barajado guardado en este aparato, sin repetir hasta que suenen todos.
     mirar=true: solo dice cuál toca (para enseñar su título antes de pulsar), sin gastarlo */
  function musSiguiente(mirar) {
    var temas = MUS.lista.temas, fs = temas.map(function (x) { return x.f; }), st = null;
    try { st = JSON.parse(localStorage.getItem(MUS_ORDEN) || 'null'); } catch (e) {}
    var vale = st && Array.isArray(st.orden) && st.orden.length === fs.length && st.orden.every(function (f) { return fs.indexOf(f) >= 0; }) && (+st.pos >= 0);
    if (!vale || st.pos >= st.orden.length) {
      var o = fs.slice(), ult = vale ? st.orden[st.orden.length - 1] : null;
      for (var i = o.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = o[i]; o[i] = o[j]; o[j] = x; }
      if (ult && o.length > 1 && o[0] === ult) o.push(o.shift());   /* al empezar otra vuelta, que no repita el último */
      st = { orden: o, pos: 0 };
    }
    var f = st.orden[st.pos]; if (!mirar) st.pos++;
    try { localStorage.setItem(MUS_ORDEN, JSON.stringify(st)); } catch (e) {}
    for (var k = 0; k < temas.length; k++) if (temas[k].f === f) return temas[k];
    return temas[0];
  }
  /* (30-sep-2026, Iago) «que cuando termine una canción no haya silencio antes de que empiece la clase»: dos reproductores
     que se turnan. 30 s antes de que acabe el tema, el otro ya va cargando el siguiente; al llegar a su «fin» (donde acaba
     el sonido, según lista.json: los temas terminan con 2–9 s de silencio) entra el siguiente al instante, sin fundido y
     desde su «ini» (sin el silencio del principio). Si un tema no trae «fin», se pasa al acabar. */
  function musUrl(t) { return MUS_BASE + encodeURIComponent(t.f) + (t.ini > 0 ? '#t=' + t.ini : ''); }
  function musActivo() { return MUS.els ? MUS.els[MUS.act] : null; }
  function musCrea() {
    var a = new Audio(); a.crossOrigin = 'anonymous'; a.preload = 'auto';
    a.addEventListener('ended', function () { if (MUS.sonando && a === musActivo()) musTocar(musSiguiente(), true); });
    a.addEventListener('playing', function () { if (a === musActivo()) MUS.fallos = 0; });
    a.addEventListener('timeupdate', function () { if (a === musActivo()) musVigila(a); });
    a.addEventListener('error', function () {   /* si un tema no carga, el siguiente (como mucho tres seguidos) */
      var i = MUS.els ? MUS.els.indexOf(a) : -1; if (i >= 0) MUS.prep[i] = null;   /* lo preparado en ese reproductor ya no vale */
      if (!MUS.sonando || a !== musActivo()) return;
      if (++MUS.fallos <= 3) musTocar(musSiguiente(), true); else musParar();
    });
    return a;
  }
  function musAudio() {
    if (MUS.els) return musActivo();
    MUS.els = [musCrea(), musCrea()]; MUS.act = 0; MUS.prep = [null, null];
    try {
      var AC = window.AudioContext || window.webkitAudioContext; MUS.ctx = new AC();
      MUS.gan = MUS.ctx.createGain(); MUS.an = MUS.ctx.createAnalyser();
      MUS.an.fftSize = 2048; MUS.an.smoothingTimeConstant = 0.6; MUS.an.minDecibels = -95; MUS.an.maxDecibels = -20;
      MUS.datos = new Uint8Array(MUS.an.frequencyBinCount);
      MUS.els.forEach(function (a) { MUS.ctx.createMediaElementSource(a).connect(MUS.an); });
      MUS.an.connect(MUS.gan); MUS.gan.connect(MUS.ctx.destination);   /* tema → barras → volumen → altavoz */
    } catch (e) { MUS.ctx = MUS.gan = MUS.an = null; MUS.els.forEach(function (a) { a.volume = MUS_VOL; }); }   /* sin Web Audio: suena igual, sin animación */
    return musActivo();
  }
  function musVigila(a) {
    var t = MUS.actual; if (!MUS.sonando || !t) return;
    var fin = t.fin || a.duration; if (!(fin > 0)) return;
    var queda = fin - a.currentTime;
    if (queda < 30 && !MUS.precargado) {   /* el siguiente, cargando ya en el otro reproductor */
      MUS.precargado = true;
      try { var sig = musSiguiente(true), o = 1 - MUS.act, b = MUS.els[o];
        if (MUS.prep[o] !== sig.f) { b.src = musUrl(sig); b.load(); MUS.prep[o] = sig.f; } } catch (e) {}
    }
    if (queda <= 0.08) musTocar(musSiguiente(), true);
  }
  function musTocar(tema, seguido) {   /* seguido: viene de otra canción (sin fundido de entrada) */
    musAudio(); clearTimeout(MUS.parando);
    var i = MUS.act, o = 1 - i, viejo = MUS.els[i], a;
    if (MUS.prep[o] === tema.f) {   /* ya estaba preparado en el otro reproductor */
      MUS.act = o; a = MUS.els[o]; MUS.prep[i] = null; try { viejo.pause(); } catch (e) {}   /* el que acaba ya no está «al principio» */
      try { if (a.currentTime > (tema.ini || 0) + 1) a.currentTime = tema.ini || 0; } catch (e) {}
    } else { a = viejo; a.src = musUrl(tema); MUS.prep[i] = tema.f; }
    MUS.actual = tema; MUS.sonando = true; MUS.precargado = false;
    if (MUS.ctx) {
      try { if (MUS.ctx.state === 'suspended') MUS.ctx.resume(); var g = MUS.gan.gain, t = MUS.ctx.currentTime; g.cancelScheduledValues(t);
        if (seguido) g.setValueAtTime(MUS_VOL, t); else { g.setValueAtTime(0.0001, t); g.exponentialRampToValueAtTime(MUS_VOL, t + 0.8); } } catch (e) {}
    }
    /* si el navegador no deja sonar (sin pulsar antes), queda parada; si solo se interrumpió al cambiar de tema, nada */
    var p = a.play(); if (p && p.catch) p.catch(function (e) { if (a === musActivo() && a.paused && !(e && e.name === 'AbortError')) { MUS.sonando = false; musPintar(); musInvitar(); } });
    musPintar(); musInvitar(); musAnimar();
  }
  function musParar() {
    MUS.sonando = false; musPintar();
    var a = musActivo(); if (!a) return;
    if (MUS.ctx && MUS.gan) {
      try { var g = MUS.gan.gain, t = MUS.ctx.currentTime; g.cancelScheduledValues(t); g.setValueAtTime(Math.max(0.0001, g.value), t); g.exponentialRampToValueAtTime(0.0001, t + 0.5); } catch (e) {}
      /* (6-oct-2026, noche) Al parar, además de pausar el tema se SUSPENDE la salida de sonido. Antes se quedaba abierta
         (sonando silencio) hasta cerrar la página: toda la tarde, desde el primer ▶. Al volver a pulsar ▶ se reanuda
         (musTocar ya lo hacía). Si el aparato no deja suspenderla, se queda como antes. */
      clearTimeout(MUS.parando); MUS.parando = setTimeout(function () {
        if (MUS.sonando) return;
        try { a.pause(); } catch (e) {}
        try { if (MUS.ctx && MUS.ctx.state === 'running' && MUS.ctx.suspend) { var p = MUS.ctx.suspend(); if (p && p.catch) p.catch(function () {}); } } catch (e) {}
      }, 520);
    } else a.pause();
  }
  /* (6-oct-2026, noche) el «clic» de la rueda de tonalidad abría otra salida de sonido y tampoco la cerraba nunca.
     Si lleva 4 s sin sonar, se cierra; el siguiente clic abre una nueva (el portal y la piel ya lo hacen: «la que haya
     o una nueva»). */
  setInterval(function () {
    try {
      var A = window.__anotTickA; if (!A || !esProfe()) return;   /* solo en el aparato del profe (en el iPad de un alumno, abrir otra salida a mitad de un gesto podría dejarla muda) */
      if (performance.now() - (window.__anotTickT || 0) < 4000) return;
      window.__anotTickA = null;
      if (A.close && A.state !== 'closed') { var p = A.close(); if (p && p.catch) p.catch(function () {}); }
    } catch (e) {}
  }, 2000);
  function musPulsar() {
    var v = musVentana(); if (v) { try { localStorage.setItem(MUS_PULSADO + v.clave, '1'); } catch (e) {} }   /* ya lo pulsó: esta clase no parpadea más */
    if (MUS.sonando) musParar(); else musTocar(musSiguiente());
    musInvitar();
  }
  /* (30-sep-2026, Iago) «En la pantalla del aula no tengo ni tendré el Diario. Mis clases son: martes a las 16:00, 18 y
     19; miércoles a las 17:30; jueves a las 18 y a las 19; viernes a las 16:00 y a las 17:30. Que esa animación sea por
     hora: 5 minutos antes y 5 minutos después.» ([día, hora], 1 = lunes … 7 = domingo.)
     (30-sep-2026, noche) «Que el año que viene, cuando haga el wizard nuevo curso, al poner los grupos, todo lo que va con
     horarios se configure en ese paso»: las horas se leen ahora del horario de clases que guarda el Diario (el paso
     «Horario» del wizard; la función pública horario_clases_publico devuelve solo día, hora de inicio y grupo del curso
     escolar más reciente, sin nombres). Se piden al aparecer la música y cada 6 horas (si falla, a la media hora) y se
     guardan en este aparato por si un día no hay red. MUS_HORAS queda solo de respaldo, por si nunca se pudo leer. */
  var MUS_HORAS = [[2, '16:00'], [2, '18:00'], [2, '19:00'], [3, '17:30'], [4, '18:00'], [4, '19:00'], [5, '16:00'], [5, '17:30']];
  var MUS_HOR = { lista: null, prox: 0, pidiendo: false }, MUS_HOR_LS = 'lm_musica_horas_v1';
  function musHorasCargar() {
    if (MUS_HOR.pidiendo || Date.now() < MUS_HOR.prox) return;
    MUS_HOR.pidiendo = true; MUS_HOR.prox = Date.now() + 30 * 60000;
    pedirMor('horario_clases_publico', {}).then(function (r) {
      var l = (r && r.st === 200 && Array.isArray(r.d)) ? r.d.map(function (h) { return [+(h && h.dia), String((h && h.ini) || '').slice(0, 5)]; })
        .filter(function (h) { return h[0] >= 1 && h[0] <= 7 && isFinite(minutos(h[1])); }) : [];
      if (l.length) {
        MUS_HOR.lista = l; MUS_HOR.prox = Date.now() + 6 * 3600000;
        try { localStorage.setItem(MUS_HOR_LS, JSON.stringify(l)); } catch (e) {}
      }
    }).catch(function () {}).then(function () { MUS_HOR.pidiendo = false; try { musInvitar(); } catch (e) {} });
  }
  function musHoras() {   /* el horario del Diario → el último que se leyó en este aparato → MUS_HORAS */
    musHorasCargar();
    if (MUS_HOR.lista) return MUS_HOR.lista;
    try { var g = JSON.parse(localStorage.getItem(MUS_HOR_LS) || 'null'); if (Array.isArray(g) && g.length) return g; } catch (e) {}
    return MUS_HORAS;
  }
  /* ¿estamos entre 5 minutos antes y 5 minutos después de la hora de una clase? */
  function musVentana() {
    /* (6-oct-2026, 17:50) el mismo reloj que el aviso de morosos (hora de Galicia y reloj del servidor): el ▶ y el ⚠ se
       encienden a la vez, 5 minutos antes de la clase, aunque el aparato tenga la hora o la zona mal puestas */
    var ga = ahoraGalicia(), dia = ga.dia, min = ga.min;
    var horas = musHoras();
    for (var i = 0; i < horas.length; i++) {
      var h = horas[i]; if (!h || +h[0] !== dia) continue;
      var ini = minutos(h[1]); if (!isFinite(ini)) continue;
      if (min >= ini - 5 && min < ini + 5) return { clave: hoyISO() + '|' + h[1] };
    }
    return null;
  }
  function musInvitar() {
    var b = MUS.el && MUS.el.querySelector('.lm-mus-b'); if (!b) return;
    var v = musVentana(), pulsado = false;
    if (v) { try { pulsado = localStorage.getItem(MUS_PULSADO + v.clave) === '1'; } catch (e) {} }
    var on = !!v && !pulsado && !MUS.sonando;
    if (b.classList.contains('lm-mus-invita') !== on) b.classList.toggle('lm-mus-invita', on);
    var lab = MUS.sonando ? 'Parar la música' : (on ? 'Poner música: empieza la clase' : (MUS.actual ? 'Otra canción' : 'Poner música'));
    if (b.getAttribute('aria-label') !== lab) { b.setAttribute('aria-label', lab); b.title = lab; }
  }
  /* los colores de los apartados, de izquierda a derecha, en cinco tramos (rosa, naranja, azul, verde, amarillo) */
  function musColores() {
    var cs = getComputedStyle(document.documentElement), def = ['#ec4899', '#f97316', '#4a9eff', '#22c55e', '#facc15'];
    return ['--lm-rosa', '--lm-naranja', '--lm-azul', '--lm-verde', '--lm-amarillo'].map(function (v, i) {
      var c = (cs.getPropertyValue(v) || '').trim(), m = /^#([0-9a-f]{6})$/i.exec(c) || /^#([0-9a-f]{6})$/i.exec(def[i]);
      var x = parseInt(m[1], 16); return [(x >> 16) & 255, (x >> 8) & 255, x & 255];
    });
  }
  function musColor(i, n) {   /* la barra i de n: el color de su tramo (mezclados, el naranja y el azul daban un gris) */
    var cs = MUS.cols || (MUS.cols = musColores()), c = cs[Math.min(cs.length - 1, Math.floor(i * cs.length / n))];
    return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
  }
  function musBarras(W) { return Math.max(24, Math.min(96, Math.round(W / 5))); }   /* una barra cada ~5 px */
  function musDibujar(niv) {   /* niv: nivel de cada barra (0…1), o null = en silencio (solo la línea) */
    var cv = MUS.cv; if (!cv) return;
    var W = cv.clientWidth, H = cv.clientHeight; if (!W || !H) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1), w = Math.round(W * dpr), h = Math.round(H * dpr);
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    var x = cv.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, w, h);
    /* la línea de silencio, abajo del todo y de lado a lado; las barras nacen de ella y solo suben */
    var gl = Math.max(1, Math.round(dpr)), base = h - gl;
    x.fillStyle = 'rgba(255,255,255,.3)'; x.fillRect(0, base, w, gl);
    if (!niv) return;
    var n = niv.length, paso = w / n, bw = Math.max(1, Math.round(paso * 0.6)), alto = base - Math.round(dpr);
    if (MUS.colN !== n) { MUS.colN = n; MUS.colB = []; for (var c = 0; c < n; c++) MUS.colB.push(musColor(c, n)); }
    for (var i = 0; i < n; i++) {
      var bh = Math.round((niv[i] || 0) * alto); if (bh < 1) continue;
      var bx = Math.round(i * paso + (paso - bw) / 2), r = Math.min(bw / 2, bh, 1.5 * dpr);
      x.fillStyle = MUS.colB[i]; x.beginPath();
      if (x.roundRect) x.roundRect(bx, base - bh, bw, bh, [r, r, 0, 0]); else x.rect(bx, base - bh, bw, bh);
      x.fill();
    }
  }
  function musAnimar() {
    if (MUS.raf) return;
    function paso() {
      MUS.raf = 0;
      /* (6-oct-2026, noche) con un editor abierto las barras no se ven: no se dibujan (la música sigue sonando); se
         vuelve a mirar cada segundo por si se ha cerrado */
      if (editorAbierto()) { clearTimeout(MUS.tEd); MUS.tEd = setTimeout(function () { if (!MUS.raf) musAnimar(); }, 1000); return; }
      var n = musBarras((MUS.cv && MUS.cv.clientWidth) || 260), suave = MUS.suave;
      if (!suave || suave.length !== n) { suave = MUS.suave = []; for (var s = 0; s < n; s++) suave.push(0); }
      var ac = musActivo(), vivo = !!(MUS.sonando && ac && !ac.paused), algo = false, obj = null;
      var tn = performance.now(), dt = MUS.tAnt ? Math.min(0.1, (tn - MUS.tAnt) / 1000) : 0.016; MUS.tAnt = tn;
      if (MUS.an && vivo) {
        var an = MUS.an, d = MUS.datos; an.getByteFrequencyData(d);
        var hz = ((MUS.ctx && MUS.ctx.sampleRate) || 44100) / an.fftSize, nb = d.length, rango = an.maxDecibels - an.minDecibels;
        var pk = MUS.pk; if (!pk || pk.length !== n) { pk = MUS.pk = []; for (var z = 0; z < n; z++) pk.push(-100); }
        var dbs = [], mm = [], G = MUS_SUELO;
        for (var i = 0; i < n; i++) {   /* bandas en escala logarítmica: cada barra, el máximo de su tramo de frecuencias */
          var f0 = MUS_F0 * Math.pow(MUS_F1 / MUS_F0, i / n), f1 = MUS_F0 * Math.pow(MUS_F1 / MUS_F0, (i + 1) / n), fc = Math.sqrt(f0 * f1);
          var p0 = f0 / hz, p1 = f1 / hz, m = 0;
          if (p1 - p0 < 1) { var pc = fc / hz, a = Math.floor(pc), fr = pc - a; m = d[a] * (1 - fr) + d[Math.min(nb - 1, a + 1)] * fr; }
          else for (var b = Math.floor(p0), bf = Math.min(nb - 1, Math.ceil(p1)); b <= bf; b++) if (d[b] > m) m = d[b];
          var db = an.minDecibels + rango * m / 255 + (fc < 1000 ? MUS_T1 : MUS_T2) * Math.log(fc / 1000) / Math.LN2;
          pk[i] = Math.max(db, pk[i] - 3 * dt); if (pk[i] > G) G = pk[i];
          dbs.push(db); mm.push(m);
        }
        obj = [];
        for (var j = 0; j < n; j++) {
          var tope = Math.max(pk[j], G - MUS_TOPE) + 2, v = mm[j] > 0 ? (dbs[j] - (tope - MUS_RANGO)) / MUS_RANGO : 0;
          obj.push(v <= 0 ? 0 : v >= 1 ? 1 : Math.pow(v, 1.8));
        }
      }
      for (var k = 0; k < n; k++) {   /* suben deprisa y bajan despacio */
        var o = obj ? obj[k] : 0;
        suave[k] = o > suave[k] ? suave[k] * 0.4 + o * 0.6 : suave[k] * 0.86 + o * 0.14;
        if (suave[k] > 0.012) algo = true;
      }
      musDibujar(algo ? suave : null);
      if (vivo || algo) MUS.raf = requestAnimationFrame(paso);
    }
    MUS.raf = requestAnimationFrame(paso);
  }
  function musPintar() {
    var el = MUS.el; if (!el) return;
    var b = el.querySelector('.lm-mus-b'), ic = el.querySelector('.lm-mus-ic'), t = el.querySelector('.lm-mus-t'), a = el.querySelector('.lm-mus-a');
    var son = MUS.sonando, tema = MUS.actual, k = son ? 'stop' : 'play';
    if (ic.getAttribute('data-k') !== k) { ic.innerHTML = son ? MUS_STOP : MUS_PLAY; ic.setAttribute('data-k', k); b.setAttribute('aria-pressed', son ? 'true' : 'false'); }
    if (el.classList.contains('sonando') !== son) el.classList.toggle('sonando', son);
    /* (30-sep-2026, Iago) «Simplemente el título y ya»: sonando, el del tema; parada, el del que sonará al pulsar */
    if (!son) { try { tema = musSiguiente(true); } catch (e) {} }
    var tt = tema ? tema.t : '';
    var at = (tema && tema.a ? tema.a : 'Kevin MacLeod') + ' · CC BY 4.0';   /* autor y licencia, en pequeño a la derecha del título */
    var tit = (tema ? '«' + tema.t + '»' + (tema.g ? ' (' + tema.g.toLowerCase() + ')' : '') + ', ' + (tema.a || 'Kevin MacLeod') : 'Música de Kevin MacLeod') +
      ' (incompetech.com). Licencia Creative Commons Reconocimiento 4.0 (CC BY 4.0).';
    if (t.textContent !== tt) t.textContent = tt;
    if (a.textContent !== at) a.textContent = at;
    if (a.title !== tit) a.title = tit;
    if (a.getAttribute('href') !== MUS_LIC) a.setAttribute('href', MUS_LIC);
    if (!MUS.raf) musDibujar(null);
  }
  function musica() {
    var w = document.getElementById('portal-welcome'), linea = w && w.querySelector('.pw-linea'), el = document.getElementById('lm-musica');
    if (!(w && linea && w.style.display !== 'none' && esProfe())) {
      if (el) { if (MUS.sonando) musParar(); if (el.parentNode) el.parentNode.removeChild(el); MUS.el = MUS.cv = null; }
      return;
    }
    musCargar(); if (!MUS.lista) return;
    if (!el) {
      el = document.createElement('div'); el.id = 'lm-musica'; el.className = 'lm-mus';
      el.innerHTML = '<button type="button" class="lm-mus-b" aria-pressed="false"><span class="lm-mus-ic"></span>' +
        '<span class="lm-mus-nota" aria-hidden="true">' + MUS_NOTA + '</span></button>' +
        '<span class="lm-mus-der"><canvas class="lm-mus-cv" aria-hidden="true"></canvas>' +
        '<span class="lm-mus-txt"><span class="lm-mus-t"></span><a class="lm-mus-a" target="_blank" rel="noopener"></a></span></span>';
      el.querySelector('.lm-mus-b').addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); musPulsar(); });
      MUS.el = el; MUS.cv = el.querySelector('.lm-mus-cv');
    }
    if (el.parentNode !== w || el.previousElementSibling !== linea) linea.parentNode.insertBefore(el, linea.nextSibling);
    musPintar(); musInvitar();
  }
  setInterval(function () { try { if (!editorAbierto()) musInvitar(); } catch (e) {} }, 15000);   /* el aviso de la clase se enciende y se apaga solo */

  /* ---------- 19 (6-oct-2026, noche, Iago): EDITOR ABIERTO = PORTAL QUIETO · y «CAJA NEGRA» (solo Tester/Protester) ----------
     «En el editor de ritmo de los portales, al menos en la pantalla del aula, cuando quiero escribir no pinta y se queda
      como la pantalla bloqueada. No me deja cambiar de herramienta y tengo que reiniciar todo para luego volver a
      fallar. Me pasó tanto en el de elemental como en el de profesional. Hasta ahora no daba ese problema, pero hoy sí.»
     En el banco de pruebas no se reproduce (ratón y dedo, normal y a pantalla completa, GE y GP). Dos medidas:
     A · EDITOR ABIERTO = PORTAL QUIETO. Mientras hay un editor a toda pantalla (la lección con sus herramientas, la
         pizarra o un libro), el portal de debajo no se ve: la piel deja de repasarlo (tarjetas, hilera, aviso de
         morosos, música…) y solo sigue vistiendo el propio editor. Al cerrarlo, todo vuelve solo.
     B · CAJA NEGRA. Solo en Tester/Protester y solo con un editor abierto, el portal apunta lo que pasa y lo manda a
         Sentry cuando algo va mal: un trazo que no deja nada guardado · un botón de herramienta que no cambia nada ·
         un toque que no llega al editor (algo lo tapa) · la pantalla que deja de refrescarse · el programa atascado
         más de 4 s · y, al volver a entrar, si la vez anterior el portal murió con un editor abierto. Apunta números
         y nombres de elementos de la página (nada de alumnos ni de lo que se escribe). Como mucho 6 partes por carga.
     (6-oct-2026, noche, 2) Iago: «cuando se bloquea, se queda bloqueado todo Chrome; la solución es cerrar la ventana y
     volver a cargar. Escribo con el dedo o el rotulador. La música sonaba: le di al principio de la clase.» Si se
     congela el navegador entero no es la página: es el sonido, la gráfica o la pantalla táctil del aparato. Por eso:
     C · la música cierra su salida de sonido al parar (sección 18) y el «clic» de la rueda, a los 4 s;
     D · EDITOR LIGERO en Tester/Protester (sin desenfoques; lo de debajo no se pinta);
     E · los partes llevan el estado del sonido, la gráfica y los toques, se guardan también en el aparato (?caja=1 los
         enseña) y, al abrir un editor por primera vez, va un parte informativo con el perfil del aparato.
     Para quitarlo todo: borrar esta sección, la primera línea de todo() y las llamadas a editorAbierto(). */
  /* (6-oct-2026, noche, 2) EDITOR LIGERO, solo Tester/Protester (en el aula el portal va en un ordenador viejo).
     Con la lección abierta: el fondo es un color liso (sin la foto desenfocada) y la hilera de herramientas no desenfoca
     lo de detrás. A los alumnos no les cambia nada. (Se probó además «lo de debajo no se pinta», como en la pizarra:
     en el banco de pruebas hacía que más toques con el dedo se quedaran sin efecto, y se quitó.)
     Para quitarlo: borrar editorLigero() y su llamada en todo(). */
  var LIGERO_CSS = 'html.lm-fam-portal #ts-visor.lm-vl-ligero{background:#0b1320 !important}' +
    'html.lm-fam-portal #ts-visor.lm-vl-ligero::before{display:none !important}' +
    'html.lm-fam-portal #ts-visor.lm-vl-ligero .lm-vl-bar{-webkit-backdrop-filter:none !important;backdrop-filter:none !important;background:#0f1a2c !important}' +
    'html.lm-fam-portal #ts-visor.lm-vl-ligero img{box-shadow:none !important}';
  function editorLigero() {
    var v = document.getElementById('ts-visor');
    if (!v || !esProfe()) return;
    if (!document.getElementById('lm-vl-ligero-css')) { var st = document.createElement('style'); st.id = 'lm-vl-ligero-css'; st.textContent = LIGERO_CSS; document.head.appendChild(st); }
    if (!v.classList.contains('lm-vl-ligero')) v.classList.add('lm-vl-ligero');
  }
  try { new MutationObserver(function () { try { editorLigero(); } catch (e) {} }).observe(document.body, { childList: true }); } catch (e) {}
  function editorAbierto() {
    try {
      if (document.getElementById('ts-visor')) return 'leccion';
      if (document.documentElement.classList.contains('pz-abierto')) return 'pizarra';
      var lb = document.getElementById('lb-ov'); if (lb && lb.classList.contains('open')) return 'libro';
    } catch (e) {}
    return '';
  }
  var CN = { on: false, ev: [], t0: Date.now(), env: 0, ult: {}, ed: '', desde: 0, gesto: null, canc: 0, fr: 0, fps: -1, sinFr: 0, raf: 0,
             lat: Date.now(), atascos: 0, largas: 0, rz: 0, banco: null, nLat: 0 };
  var CN_K = 'lm_caja_negra_viva', CN_MAX = 6;
  var CN_P = 'lm_caja_negra_partes', CN_GRAF = 'lm_caja_negra_grafica', CN_V = '7-oct-n14';
  CN.pd = 0; CN.pm = 0; CN.pu = 0; CN.pc = 0; CN.pt = ''; CN.perfil = false;
  /* (6-oct-2026, noche, 2) Los partes se guardan TAMBIÉN en el aparato (los 12 últimos): si Sentry no llega desde la red
     del centro, se pueden leer allí mismo abriendo el portal con ?caja=1 (solo Tester/Protester) y hacerles una foto. */
  function cnGuarda(tipo, ex) {
    try {
      var L = []; try { L = JSON.parse(localStorage.getItem(CN_P) || '[]') || []; } catch (e) { L = []; }
      L.push({ h: new Date().toISOString(), tipo: tipo, estado: ex && ex.estado, apuntes: ((ex && ex.apuntes) || []).slice(-14), mas: (function () { var m = {}; for (var k in ex) if (k !== 'estado' && k !== 'apuntes') m[k] = ex[k]; return m; })() });
      if (L.length > 12) L = L.slice(L.length - 12);
      var txt = JSON.stringify(L); while (txt.length > 60000 && L.length > 1) { L.shift(); txt = JSON.stringify(L); }
      localStorage.setItem(CN_P, txt);
    } catch (e) {}
  }
  /* la gráfica del aparato: solo se mira al abrir ?caja=1, y una sola vez por aparato (si mirarla lo colgara, no se
     vuelve a intentar) */
  function cnGrafica() {
    try {
      if (localStorage.getItem(CN_GRAF)) return;
      localStorage.setItem(CN_GRAF, 'no se pudo mirar');
      var c = document.createElement('canvas'), gl = c.getContext('webgl') || c.getContext('experimental-webgl'), r = 'sin webgl';
      if (gl) { var e = gl.getExtension('WEBGL_debug_renderer_info'); r = String(e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)); var lc = gl.getExtension('WEBGL_lose_context'); if (lc) lc.loseContext(); }
      localStorage.setItem(CN_GRAF, r.slice(0, 110));
    } catch (e) {}
  }
  function cajaVer() {   /* ?caja=1 → los partes guardados en este aparato, para leerlos o fotografiarlos */
    if (CN.vista || !/[?&]caja=1(&|$)/.test(location.search) || !esProfe()) return;
    CN.vista = true;
    cnGrafica();   /* solo aquí, a propósito y una vez por aparato (nunca en mitad de una clase) */
    var L = []; try { L = JSON.parse(localStorage.getItem(CN_P) || '[]') || []; } catch (e) {}
    var viva = null; try { viva = JSON.parse(localStorage.getItem(CN_K) || 'null'); } catch (e) {}
    var d = document.createElement('div'); d.id = 'lm-caja';
    d.style.cssText = 'position:fixed;top:0;right:0;bottom:0;left:0;z-index:2147483640;background:#0b1320;color:#e8eef5;overflow:auto;padding:18px 22px;font:14px/1.45 Menlo,Consolas,monospace;visibility:visible';
    function hora(iso) { try { var x = new Date(iso); return ('0' + x.getDate()).slice(-2) + '/' + ('0' + (x.getMonth() + 1)).slice(-2) + ' ' + ('0' + x.getHours()).slice(-2) + ':' + ('0' + x.getMinutes()).slice(-2) + ':' + ('0' + x.getSeconds()).slice(-2); } catch (e) { return String(iso); } }
    var h = '<div style="display:flex;gap:12px;align-items:center;margin:0 0 12px"><b style="font:800 18px Arial">Caja negra del editor · ' + (GP ? 'profesional' : 'elemental') + ' · ' + esc(CN_V) + '</b><span style="flex:1"></span>' +
      '<button type="button" id="lm-caja-cop" style="font:700 14px Arial;padding:9px 14px;border-radius:9px;border:1px solid #5b9dff;background:#12305f;color:#fff;cursor:pointer">Copiar todo</button>' +
      '<button type="button" id="lm-caja-x" style="font:700 14px Arial;padding:9px 14px;border-radius:9px;border:1px solid #777;background:#222b3d;color:#fff;cursor:pointer">Cerrar</button></div>';
    var est0 = cnEstado();
    h += '<div style="margin:0 0 10px;color:#9fb4d8">Este aparato: Chrome ' + esc(est0.nav) + ' · pantalla ' + esc(est0.pantalla) + ' · ventana ' + esc(est0.vista) + ' · ' + esc(est0.nucleos) + ' núcleos · ' + esc(est0.ram_gb) + ' GB · táctil ' + esc(est0.tactil) +
      '<br>Gráfica: ' + esc(est0.grafica || 'sin mirar todavía') + '<br>Partes guardados: ' + L.length + (viva ? ' · había un editor abierto la última vez (' + esc(hora(new Date(viva.t).toISOString())) + ')' : '') + '</div>';
    if (!L.length) h += '<div style="font:700 16px Arial;color:#9ad9bd">No hay ningún parte guardado: desde que se puso la caja negra, el editor no ha notado nada raro en este aparato.</div>';
    var txtTodo = 'CAJA NEGRA ' + CN_V + ' ' + (GP ? 'gp' : 'ge') + ' ' + new Date().toISOString() + '\n' + JSON.stringify({ aparato: est0, viva: viva, partes: L });
    L.slice().reverse().forEach(function (p, i) {
      var e = p.estado || {};
      h += '<div style="border:1px solid #2a3a58;border-radius:10px;padding:10px 12px;margin:0 0 10px;background:#0f1a2c">' +
        '<div style="font:800 16px Arial;color:#ffd678">' + esc(hora(p.h)) + ' · ' + esc(p.tipo) + '</div>' +
        '<div>editor ' + esc(e.ed) + ' · abierto ' + esc(e.abierto_s) + ' s · herramienta [' + esc(e.herr) + '] · fotogramas/s ' + esc(e.fps) + ' · atascos ' + esc(e.atascos) + ' · tareas largas ' + esc(e.largas) + '</div>' +
        '<div>dedos apoyados: ' + esc(e.dedos) + ' · ratón: ' + esc(e.raton || '—') + '</div>' +
        '<div>toques (baja/mueve/sube) ' + esc(e.toques) + ' ' + esc(e.tipo_toque) + ' · pantalla completa: ' + esc(e.completa) + ' · sonido: ' + esc(e.sonido) + ' · música ' + (e.musica ? 'sonando' : 'parada') + ' · morosos ' + (e.morosos ? 'sí' : 'no') + '</div>' +
        '<div>lienzo ' + esc(e.lienzo) + ' · repintar 150 trazos: ' + esc(e.banco_ms) + ' ms · memoria ' + esc(e.mem_mb) + ' MB · ligero ' + (e.ligero ? 'sí' : 'no') + '</div>' +
        (p.mas && Object.keys(p.mas).length ? '<div style="color:#f9b4b4">' + esc(JSON.stringify(p.mas)).slice(0, 400) + '</div>' : '') +
        '<div style="color:#8fa3c4;font-size:12px;word-break:break-all">' + esc((p.apuntes || []).map(function (a) { var x = []; for (var k in a) if (k !== 't' && k !== 'k') x.push(k + '=' + a[k]); return a.t + 's ' + a.k + (x.length ? '(' + x.join(',') + ')' : ''); }).join(' · ')) + '</div></div>';
    });
    d.innerHTML = h; document.body.appendChild(d);
    d.querySelector('#lm-caja-x').addEventListener('click', function () { if (d.parentNode) d.parentNode.removeChild(d); });
    d.querySelector('#lm-caja-cop').addEventListener('click', function () {
      var b = this;
      try { navigator.clipboard.writeText(txtTodo).then(function () { b.textContent = 'Copiado'; }, function () { b.textContent = 'No se pudo copiar'; }); } catch (e) { b.textContent = 'No se pudo copiar'; }
    });
  }
  function cnDesc(el) {
    try {
      if (!el || el.nodeType !== 1) return String(el && el.nodeName || el);
      var c = (typeof el.className === 'string' ? el.className : (el.getAttribute('class') || '')).trim().split(/\s+/).filter(Boolean).slice(0, 3).join('.');
      return (el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (c ? '.' + c : '')).slice(0, 70);
    } catch (e) { return '?'; }
  }
  function cnApunta(k, d) {
    var o = { t: Math.round((Date.now() - CN.t0) / 100) / 10, k: k }; if (d) { for (var x in d) o[x] = d[x]; }
    CN.ev.push(o); if (CN.ev.length > 60) CN.ev.splice(0, CN.ev.length - 60);
  }
  function cnRaiz() {
    return CN.ed === 'leccion' ? document.getElementById('ts-visor') : CN.ed === 'pizarra' ? document.getElementById('pz-ov') : CN.ed === 'libro' ? document.getElementById('lb-ov') : null;
  }
  function cnHerr() {   /* la herramienta marcada en la barra de la lección (la de siempre, oculta) */
    try { return Array.prototype.map.call(document.querySelectorAll('#ts-visor .anot-bar .anot-b.on'), function (b) { return b.getAttribute('data-t'); }).join(','); } catch (e) { return '?'; }
  }
  function cnFirma() {   /* cuánto ocupa lo anotado en este aparato: si un trazo se guarda, cambia */
    var n = 0;
    try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf('ts_anot_') === 0) n += (localStorage.getItem(k) || '').length + 1; } } catch (e) { n = -1; }
    return n;
  }
  function cnDedosFuera() { var n = 0, viejo = 0, ah = Date.now(), D = CN.dedos || {}; for (var k in D) { n++; if (ah - D[k].t > viejo) viejo = ah - D[k].t; } return { n: n, viejo_s: Math.round(viejo / 100) / 10 }; }
  function cnEstado() {
    var o = { ed: CN.ed, abierto_s: CN.desde ? Math.round((Date.now() - CN.desde) / 1000) : 0, herr: cnHerr(), fps: CN.fps, atascos: CN.atascos, largas: CN.largas, redim: CN.rz,
              banco_ms: CN.banco, portal: GP ? 'gp' : 'ge', vista: window.innerWidth + 'x' + window.innerHeight, dpr: window.devicePixelRatio || 1, visible: !document.hidden };
    try { o.completa = cnDesc(document.fullscreenElement || document.webkitFullscreenElement || null); } catch (e) {}
    try { var v = document.getElementById('ts-visor'); if (v) { o.dibujo = !!v.querySelector('.anot-wrap.dibujo'); o.max = v.classList.contains('lm-vl-max'); o.hilera = !!v.querySelector('.lm-vl-bar');
            var cs = v.querySelectorAll('.anot-canvas'); o.lienzos = cs.length; if (cs[0]) { var r = cs[0].getBoundingClientRect(); o.lienzo = cs[0].width + 'x' + cs[0].height + ' en ' + Math.round(r.width) + 'x' + Math.round(r.height); } } } catch (e) {}
    try { o.musica = !!MUS.sonando; o.morosos = !!document.getElementById('lm-morosos'); o.firma = cnFirma(); } catch (e) {}
    /* (6-oct-2026, noche, 2) Iago: «se queda bloqueado todo Chrome». Lo que Chrome comparte con el ordenador: sonido,
       gráfica y pantalla táctil. De cada cosa, su estado. */
    try { o.sonido = (MUS.ctx ? MUS.ctx.state : 'sin abrir') + (window.__anotTickA ? ' · clic ' + window.__anotTickA.state : ''); } catch (e) {}
    try { o.toques = CN.pd + '/' + CN.pm + '/' + CN.pu + (CN.pc ? ' canc ' + CN.pc : ''); o.tipo_toque = CN.pt || ''; } catch (e) {}
    try { var dd = cnDedosFuera(); o.dedos = dd.n + (dd.n ? ' (el más viejo, ' + dd.viejo_s + ' s)' : '') + ' · máx ' + (CN.maxDedos || 0) + ' · no principales ' + (CN.noPrim || 0) + ' · toques sin clic ' + (CN.sinClic || 0) + ' · clics dados por el portal ' + (TQ.n || 0) + ' (seguidos ' + (TQ.racha || 0) + ', tardíos ' + (TQ.tardios || 0) + ') · menús ' + (TQ.menus || 0); } catch (e) {}
    try { o.raton = CN.raton ? ('apretado ' + Math.round((Date.now() - CN.raton.t) / 1000) + ' s en ' + CN.raton.en + ' (' + CN.raton.x + ',' + CN.raton.y + ')') : 'suelto'; if (CN.arrastres) o.raton += ' · arrastres ' + CN.arrastres; } catch (e) {}
    try { o.lista_dedos = Object.keys(TQ.loc).length + ' · heredados ' + Object.keys(TQ.here).length + ' · toques con puntero de reserva ' + (TQ.nPr || 0) + (TQ.sinPunteros ? ' · PUNTEROS CORTADOS' : '') + (TQ.fijo ? ' · dos dedos no amplían' : ''); } catch (e) {}
    try { if (window.visualViewport) o.ampliacion = Math.round(window.visualViewport.scale * 100) / 100; } catch (e) {}
    try { o.grafica = localStorage.getItem(CN_GRAF) || ''; } catch (e) {}
    try { o.ligero = !!document.querySelector('#ts-visor.lm-vl-ligero'); o.piel = CN_V; o.nav = (/Chrome\/(\d+)/.exec(navigator.userAgent) || [])[1] || ''; o.pantalla = screen.width + 'x' + screen.height; } catch (e) {}
    try { if (performance.memory) o.mem_mb = Math.round(performance.memory.usedJSHeapSize / 1048576); } catch (e) {}
    try { o.nucleos = navigator.hardwareConcurrency || 0; o.ram_gb = navigator.deviceMemory || 0; o.tactil = navigator.maxTouchPoints || 0; } catch (e) {}
    return o;
  }
  function cnEnviar(tipo, extra, nivel) {
    try {
      cnApunta('PARTE ' + tipo);
      var ah = Date.now();
      if (CN.ult[tipo] && ah - CN.ult[tipo] < 20000) return;
      CN.ult[tipo] = ah;
      var ex = { estado: extra && extra.estado ? extra.estado : cnEstado(), apuntes: (extra && extra.apuntes) || CN.ev.slice(-32) };
      if (extra) { for (var k in extra) if (k !== 'estado' && k !== 'apuntes') ex[k] = extra[k]; }
      if (tipo !== 'perfil') cnGuarda(tipo, ex);   /* (6-oct-2026, noche, 2) también en el aparato: ?caja=1 */
      if (CN.env >= CN_MAX && tipo !== 'perfil') return;
      if (tipo !== 'perfil') CN.env++;
      var S = window.Sentry; if (!S || !S.captureMessage) return;
      S.captureMessage('[caja negra] ' + tipo, { level: nivel || 'warning', tags: { caja_negra: tipo, portal: GP ? 'gp' : 'ge', editor: (ex.estado && ex.estado.ed) || '' }, extra: ex });
    } catch (e) {}
  }
  function cnBanco() {   /* cuánto tarda ESTE aparato en repintar una página con 150 trazos (lo que hace el editor en cada movimiento) */
    try {
      var cv0 = document.querySelector('#ts-visor .anot-canvas'), W = Math.max(600, Math.min(2600, (cv0 && cv0.width) || 1600)), H = Math.max(400, Math.min(2600, (cv0 && cv0.height) || 900));
      var cv = document.createElement('canvas'); cv.width = W; cv.height = H; var x = cv.getContext('2d'), t = performance.now();
      for (var rep = 0; rep < 3; rep++) {
        x.clearRect(0, 0, W, H); x.globalCompositeOperation = 'multiply'; x.lineCap = 'round'; x.lineJoin = 'round';
        for (var i = 0; i < 150; i++) {
          x.strokeStyle = i % 3 ? 'rgba(80,230,140,.45)' : '#000'; x.lineWidth = i % 3 ? 13 : 3.5; x.beginPath();
          for (var j = 0; j < 40; j++) { var px = ((i * 53 + j * 9) % W), py = ((i * 31) % H) + 14 * Math.sin(j / 3 + i); if (j) x.lineTo(px, py); else x.moveTo(px, py); }
          x.stroke();
        }
      }
      CN.banco = Math.round((performance.now() - t) / 3);
      cnApunta('banco', { ms: CN.banco, lienzo: W + 'x' + H });
      if (CN.banco > 120) cnEnviar('lienzo-lento', null, 'info');
    } catch (e) { CN.banco = -1; }
  }
  function cnMarco() {   /* cuenta los fotogramas solo mientras hay un editor abierto */
    CN.raf = 0; if (!CN.ed) return;
    CN.fr++; CN.raf = requestAnimationFrame(cnMarco);
  }
  function cnLatido() {
    var ah = Date.now(), salto = ah - CN.lat; CN.lat = ah;
    var ed = editorAbierto();
    if (ed !== CN.ed) {
      if (ed) { CN.ed = ed; CN.desde = ah; CN.canc = 0; CN.sinFr = 0; CN.fr = 0; CN.fps = -1; CN.pd = CN.pm = CN.pu = CN.pc = 0; cnApunta('abre', { ed: ed }); if (!CN.raf) CN.raf = requestAnimationFrame(cnMarco);
                if (!CN.perfil) { CN.perfil = true; setTimeout(function () { try { if (CN.ed) cnEnviar('perfil', null, 'info'); } catch (e) {} }, 6000); }
                if (ed === 'leccion') setTimeout(function () { if (CN.ed === 'leccion' && CN.banco == null) cnBanco(); }, 2500); }
      else { cnApunta('cierra', { ed: CN.ed }); CN.ed = ''; CN.desde = 0; CN.gesto = null; try { localStorage.removeItem(CN_K); } catch (e) {} }
    }
    if (salto > 4000) { CN.atascos++; cnApunta('atasco', { s: Math.round(salto / 100) / 10 }); if (CN.ed && !document.hidden) cnEnviar('atasco', { segundos: Math.round(salto / 100) / 10 }); }
    if (!CN.ed) return;
    CN.fps = CN.fr; CN.fr = 0;
    if (!document.hidden && CN.fps === 0 && salto < 2500) { if (++CN.sinFr === 3) cnEnviar('sin-refresco'); } else CN.sinFr = 0;
    if (++CN.nLat % 3 === 0) {   /* cada 3 s, una nota en el aparato: si el portal muere con el editor abierto, la próxima carga lo cuenta */
      try { localStorage.setItem(CN_K, JSON.stringify({ t: ah, estado: cnEstado(), apuntes: CN.ev.slice(-18) })); } catch (e) {}
    }
  }
  function cajaNegra() {
    if (CN.on) return; if (!esProfe()) return;
    CN.on = true;
    /* ¿la vez anterior el portal murió con un editor abierto? */
    try {
      var g = localStorage.getItem(CN_K);
      var o = g ? JSON.parse(g) : null;
      /* una nota de hace menos de 8 s puede ser de OTRA pestaña que sigue viva con su editor abierto: esa no se toca */
      if (o && o.t && Date.now() - o.t > 8000) {
        localStorage.removeItem(CN_K);
        cnEnviar('murio-con-el-editor-abierto', { estado: o.estado, apuntes: o.apuntes, hace_s: Math.round((Date.now() - o.t) / 1000), despedida: o.fin || 'ninguna', ultimo_latido_antes_de_irse_s: o.finT ? Math.round((o.finT - o.t) / 1000) : null });
      }
    } catch (e) {}
    var cap = { capture: true, passive: true };
    /* (6-oct-2026, noche, 3) cuántos dedos cree la pantalla que hay apoyados (un toque «fantasma» o la mano al
       escribir dejan a los demás toques sin «clic») y los toques en botones que el navegador no convierte en «clic» */
    CN.dedos = {}; CN.maxDedos = 0; CN.sinClic = 0; CN.noPrim = 0;
    /* (7-oct-2026) ¿hay un botón del ratón —o del panel táctil del teclado— apretado y sin soltar? */
    CN.raton = null; CN.arrastres = 0;
    function cnDedos() { var n = 0, viejo = 0, ah = Date.now(); for (var k in CN.dedos) { n++; if (ah - CN.dedos[k].t > viejo) viejo = ah - CN.dedos[k].t; } return { n: n, viejo_s: Math.round(viejo / 100) / 10 }; }
    document.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') { if (e.buttons & 1) CN.raton = { t: Date.now(), x: Math.round(e.clientX), y: Math.round(e.clientY), en: cnDesc(e.target) }; }
      else if (CN.ed && CN.raton && Date.now() - CN.raton.t > 3000) cnEnviar('raton-apretado', { segundos: Math.round((Date.now() - CN.raton.t) / 1000), donde: CN.raton.x + ',' + CN.raton.y, en: CN.raton.en });
      if (e.pointerType === 'touch' || e.pointerType === 'pen') {
        CN.dedos[e.pointerId] = { t: Date.now(), x: Math.round(e.clientX), y: Math.round(e.clientY) };
        var d = cnDedos(); if (d.n > CN.maxDedos) CN.maxDedos = d.n;
        if (!e.isPrimary) CN.noPrim++;
        if (CN.ed && d.n > 1 && d.viejo_s > 3) cnEnviar('dedo-apoyado', { dedos: d.n, el_mas_viejo_s: d.viejo_s, donde: (function () { var o = []; for (var k in CN.dedos) o.push(CN.dedos[k].x + ',' + CN.dedos[k].y); return o.join(' · '); })() });
        var bt = CN.ed && e.target && e.target.closest ? e.target.closest('button') : null;
        if (bt) { CN.espClic = { t: Date.now(), b: cnDesc(bt), id: e.pointerId, x: e.clientX, y: e.clientY, dedos: d.n }; }
      }
      if (!CN.ed) return;
      try { if (CN.ed === 'leccion' && e.target && e.target.closest && e.target.closest('#ts-visor .lm-vl-her .lm-vl-b')) CN.herrBaja = { t: Date.now(), h: cnHerr() }; } catch (x) {}
      CN.pd++; CN.pt = e.pointerType || '';
      var raiz = cnRaiz(), dentro = !!(raiz && raiz.contains(e.target)), arriba = null;
      try { arriba = document.elementFromPoint(e.clientX, e.clientY); } catch (x) {}
      var lienzo = !!(e.target && e.target.classList && e.target.classList.contains('anot-canvas'));
      CN.gesto = { t: Date.now(), x: e.clientX, y: e.clientY, d: 0, n: 0, lienzo: lienzo, herr: cnHerr(), f0: lienzo ? cnFirma() : 0, id: e.pointerId };
      cnApunta('baja', { p: e.pointerType, x: Math.round(e.clientX), y: Math.round(e.clientY), en: cnDesc(e.target), top: (arriba && arriba !== e.target) ? cnDesc(arriba) : undefined, fuera: dentro ? undefined : 1 });
      if (!dentro && raiz && !(e.target && e.target.closest && e.target.closest('.atour-card'))) cnEnviar('toque-fuera-del-editor', { en: cnDesc(e.target), encima: cnDesc(arriba) });
    }, cap);
    document.addEventListener('pointermove', function (e) {
      if (CN.ed) CN.pm++;
      if (CN.raton && e.pointerType === 'mouse') { if (!(e.buttons & 1)) CN.raton = null; else { CN.raton.x = Math.round(e.clientX); CN.raton.y = Math.round(e.clientY); } }
      var g = CN.gesto; if (!g || e.pointerId !== g.id) return;
      g.n++; var d = Math.abs(e.clientX - g.x) + Math.abs(e.clientY - g.y); if (d > g.d) g.d = d;
    }, cap);
    function cnSube(e) {
      try { delete CN.dedos[e.pointerId]; } catch (x) {}
      if (CN.raton && e.pointerType === 'mouse' && (e.type === 'pointercancel' || !(e.buttons & 1))) CN.raton = null;
      var q = CN.espClic;
      if (q && e.pointerId === q.id) {
        if (e.type === 'pointercancel' || Math.abs(e.clientX - q.x) > 24 || Math.abs(e.clientY - q.y) > 24 || Date.now() - q.t > 1500) CN.espClic = null;
        else { q.sube = Date.now(); setTimeout(function () { if (CN.espClic === q) { CN.espClic = null; CN.sinClic++; cnApunta('sin-clic', { b: q.b, dedos: q.dedos }); if (CN.ed && CN.sinClic === 1) cnEnviar('toque-sin-clic', { boton: q.b, dedos_apoyados: q.dedos }, 'info'); } }, 700); }
      }
      if (CN.ed) { if (e.type === 'pointercancel') CN.pc++; else CN.pu++; }
      var g = CN.gesto; if (!g || e.pointerId !== g.id) return; CN.gesto = null;
      var cancel = (e.type === 'pointercancel');
      cnApunta(cancel ? 'cancela' : 'sube', { d: Math.round(g.d), n: g.n, ms: Date.now() - g.t });
      if (!CN.ed || !g.lienzo) return;
      var dibuja = /^(k|c\d|pt)$/.test(g.herr);
      if (cancel && dibuja) { if (++CN.canc === 3) cnEnviar('trazos-cancelados', { herr: g.herr }); return; }
      if (!dibuja || g.d < 14) return;
      CN.canc = 0;
      setTimeout(function () { try { if (CN.ed === 'leccion' && cnFirma() === g.f0) cnEnviar('trazo-sin-guardar', { herr: g.herr, recorrido_px: Math.round(g.d), movimientos: g.n }); } catch (x) {} }, 800);
    }
    document.addEventListener('pointerup', cnSube, cap); document.addEventListener('pointercancel', cnSube, cap);
    document.addEventListener('click', function () { CN.espClic = null; }, true);
    document.addEventListener('click', function (e) {
      if (CN.ed !== 'leccion') return;
      var b = e.target && e.target.closest ? e.target.closest('#ts-visor .lm-vl-her .lm-vl-b') : null; if (!b) return;
      var tit = b.title || ''; if (/^(Deshacer|Borrar todo)/.test(tit)) return;
      var hb = CN.herrBaja; CN.herrBaja = null;
      var antes = (hb && Date.now() - hb.t < 2500) ? hb.h : cnHerr();   /* la herramienta que había al bajar el dedo (el botón ya pudo actuar al levantarlo) */
      cnApunta('boton', { b: tit.slice(0, 28), antes: antes });
      setTimeout(function () { try { if (CN.ed === 'leccion' && document.querySelector('#ts-visor .anot-bar .anot-b') && cnHerr() === antes) cnEnviar('boton-sin-efecto', { boton: tit.slice(0, 40), herr: antes }); } catch (x) {} }, 500);
    }, cap);
    function cnCambio(k) { return function () { if (CN.ed) cnApunta(k, k === 'completa' ? { el: cnDesc(document.fullscreenElement || document.webkitFullscreenElement || null) } : k === 'visible' ? { si: !document.hidden } : null); }; }
    document.addEventListener('fullscreenchange', cnCambio('completa')); document.addEventListener('webkitfullscreenchange', cnCambio('completa'));
    document.addEventListener('visibilitychange', cnCambio('visible'));
    window.addEventListener('blur', cnCambio('sin-foco')); window.addEventListener('focus', cnCambio('con-foco'));
    /* (7-oct-2026) la página ampliada o reducida con dos dedos (o por un «pellizco» que nadie hizo) */
    try { if (window.visualViewport) { CN.escala = window.visualViewport.scale; window.visualViewport.addEventListener('resize', function () {
      var e = window.visualViewport.scale; if (Math.abs(e - (CN.escala || 1)) < 0.03) return; CN.escala = e; cnApunta('ampliacion', { x: Math.round(e * 100) / 100 }); }); } } catch (e) {}
    /* (7-oct-2026) arrastrar-y-soltar del navegador: mientras dura, el puntero es suyo. Dentro de un editor no hay
       nada que arrastrar (lo que se «agarra» sin querer es la imagen de la página): ahí no empieza. Se apunta siempre. */
    document.addEventListener('dragstart', function (e) {
      try {
        CN.arrastres++;
        var t = e.target; if (t && t.nodeType === 3) t = t.parentElement;
        var dentro = !!(t && t.closest && t.closest('#ts-visor, #pz-ov, #lb-ov'));
        cnApunta('arrastre', { en: cnDesc(t), ed: dentro ? 1 : undefined });
        if (dentro) e.preventDefault();
      } catch (x) {}
    }, true);
    window.addEventListener('resize', function () { if (CN.ed) { CN.rz++; if (CN.rz % 25 === 0) cnApunta('redim', { n: CN.rz }); } }, { passive: true });
    window.addEventListener('error', function (e) { if (CN.ed) cnApunta('error', { m: String((e && e.message) || '').slice(0, 120) }); });
    window.addEventListener('pagehide', function () {   /* se va «despidiéndose»: si había un editor abierto, se apunta cómo */
      if (!CN.ed) return;
      try { var g = localStorage.getItem(CN_K); if (g) { var o = JSON.parse(g); o.fin = 'descarga'; o.finT = Date.now(); localStorage.setItem(CN_K, JSON.stringify(o)); } } catch (e) {}
    });
    try { if (window.PerformanceObserver) new PerformanceObserver(function (l) { l.getEntries().forEach(function (x) { if (x.duration > 400) { CN.largas++; if (CN.ed) cnApunta('larga', { ms: Math.round(x.duration) }); } }); }).observe({ entryTypes: ['longtask'] }); } catch (e) {}
    setInterval(function () { try { cnLatido(); } catch (e) {} }, 1000);
  }

  /* ---------- 20 (6-oct-2026, noche, Iago): TOQUES A PRUEBA DE «DEDO FANTASMA» · SOLO Tester/Protester ----------
     Lo del aula, reproducido en el banco de pruebas: si la pantalla táctil cree que hay un dedo apoyado en algún sitio
     (un toque «fantasma» del marco, la mano al escribir, o un toque que nunca se dio por levantado), el navegador deja
     de convertir los demás toques en «clic». La página recibe «baja el dedo» y «sube el dedo», pero el «clic» no llega
     nunca: ningún botón responde, no se puede elegir herramienta (y por eso «no pinta») y parece todo bloqueado,
     aunque por dentro siga funcionando.
     A · Si un toque limpio (corto y sin arrastrar) no trae su «clic» en un tercio de segundo, el portal lo da él. Si el
         «clic» del navegador llega tarde, se descarta, para no hacer la cosa dos veces. No se mete donde la página ya
         lleva el dedo por su cuenta (lienzos, ruedas, lo que anule el gesto) ni en los desplegables.
     B · Lo que lleve más de 5 s apoyado sin moverse se señala en la pantalla con un aro rojo y «algo apoyado aquí»:
         así se ve DÓNDE cree la pantalla que hay un dedo (y si es el marco, se ve en qué borde).
     C · (7-oct-2026) Lo mismo con el botón del ratón —o del panel táctil del teclado inalámbrico—: si lleva más de 8 s
         apretado y quieto, se señala con el mismo aro y «tiene el botón apretado». Solo se señala; con ratón el
         portal responde igual que siempre.
     Con ratón y teclado no cambia nada. A los alumnos no les llega. Para quitarlo: borrar esta sección y su llamada en
     todo(). */
  var TQ = { on: false, baja: {}, esp: null, sint: null, n: 0, marcas: {}, tFin: null, raton: null,
             racha: 0, tardios: 0, tScroll: 0, scrollEl: null, tUlt: 0, aviso: null, avisoNo: false, menus: 0,
             /* (7-oct-2026, 13) la lista de dedos del navegador y los punteros de reserva (ver toquesSeguros) */
             loc: {}, here: {}, pr: {}, pds: [], g: null, fijo: false, movil: false, cromo: false, sinPunteros: false, nPr: 0, prNo: false };
  /* (6-oct-2026, noche, 6) EL «CLIC» DE UN TOQUE QUE YA SE ATENDIÓ NO SE CUELA A LO DE DEBAJO.
     Cuando un botón actúa al levantar el dedo (los de la hilera del editor) o cuando el «clic» lo da el portal porque
     el del navegador no llegaba, el «clic» del navegador de ESE MISMO toque puede llegar después. Si para entonces el
     botón ya no está (la ✕ cerró el editor), ese «clic» caía en lo que hubiera debajo: en el banco de pruebas cerraba
     también la campana. Aquí se descarta: solo el de ese toque (otro toque lo desarma), solo durante 0,9 s y solo si
     cae FUERA del botón que actuó (si cae en él, el propio botón ya lo ignora). Solo se arma con dedo o rotulador y
     solo en Tester/Protester, que es donde los botones actúan al levantar. */
  var TRAGA = null, tragaOn = false;
  function tragaArma(el) {
    TRAGA = { t: Date.now(), el: el };
    if (tragaOn) return; tragaOn = true;
    document.addEventListener('pointerdown', function () { TRAGA = null; }, true);   /* otro toque: lo que venga ya es suyo */
    ['mousedown', 'mouseup', 'click'].forEach(function (tipo) {
      document.addEventListener(tipo, function (e) {
        var g = TRAGA; if (!g || !e.isTrusted) return;
        if (Date.now() - g.t > 900) { TRAGA = null; return; }
        if (g.el && g.el.isConnected && e.target && (g.el === e.target || g.el.contains(e.target))) { if (tipo === 'click') TRAGA = null; return; }
        e.preventDefault(); e.stopImmediatePropagation();
        if (tipo === 'click') {
          TRAGA = null; TQ.esp = null;
          try { cnApunta('clic-colado-evitado', { en: cnDesc(e.target) }); } catch (x) {}
        }
      }, true);
    });
  }
  /* (7-oct-2026) EL AVISO DE «TÁCTIL ENGANCHADO». Tres toques limpios seguidos sin «clic» del navegador: la ventana
     tiene un toque colgado. El portal sigue respondiendo (da él los «clic»), y lo dice abajo, sin tapar la hilera. Solo
     se puede tocar su ✕; el resto deja pasar el dedo. Se quita solo en cuanto el navegador vuelve a dar un «clic». */
  /* (7-oct-2026) mientras dura el enganche, en el portal los dedos solo desplazan: sin «pellizco» que amplíe la página */
  function tqSinPellizco(on) {
    try {
      var r = document.documentElement;
      /* (7-oct-2026, 13) TQ.sinPellizco es ahora «hay sospecha de táctil enganchado»: mientras dura, el portal mueve él
         la página con el dedo. La orden al navegador de no ampliar con dos dedos, en un ordenador con pantalla táctil,
         está puesta desde el principio (TQ.fijo, en toquesSeguros) y no se quita. */
      if (on) { if (TQ.sinPellizco) return; TQ.sinPellizco = true; if (!TQ.fijo) { TQ.taAntes = r.style.touchAction || ''; r.style.touchAction = 'pan-x pan-y'; } }
      else { if (!TQ.sinPellizco) return; TQ.sinPellizco = false; if (!TQ.fijo) r.style.touchAction = TQ.taAntes || ''; }
    } catch (e) {}
  }
  function tqDesliza(p, e) {
    try {
      if (!TQ.sinPellizco || p.noDesliza) return;
      var sc = p.desl;
      if (!sc) {
        if (Math.abs(e.clientX - p.x0) + Math.abs(e.clientY - p.y0) < 24) return;      /* aún puede ser un toque; y si el navegador va a deslizar él, que empiece antes (su margen es menor) */
        var el = p.el;
        if (!el || el.nodeType !== 1 || el.closest('canvas, input, textarea, select, [contenteditable=""], [contenteditable="true"], .lm-vl-rueda, .anot-rueda, .lm-fantasma, .lm-enganche')) { p.noDesliza = true; return; }
        sc = el;
        while (sc && sc !== document.body && sc !== document.documentElement) {
          var cs = getComputedStyle(sc);
          if ((/auto|scroll/.test(cs.overflowY) && sc.scrollHeight > sc.clientHeight + 4) || (/auto|scroll/.test(cs.overflowX) && sc.scrollWidth > sc.clientWidth + 4)) break;
          sc = sc.parentElement;
        }
        if (!sc || sc === document.body || sc === document.documentElement) sc = document.scrollingElement || document.documentElement;
        p.desl = sc; p.dTop = sc.scrollTop; p.dLeft = sc.scrollLeft; p.ux = p.x0; p.uy = p.y0;
        try { cnApunta('arrastre-de-reserva', { en: cnDesc(sc) }); } catch (x) {}
      }
      /* ¿la está moviendo ya el navegador (u otra cosa)? Entonces no es cosa nuestra en este gesto */
      if (Math.abs(sc.scrollTop - p.dTop) > 2 || Math.abs(sc.scrollLeft - p.dLeft) > 2) { p.noDesliza = true; return; }
      var dy = e.clientY - p.uy, dx = e.clientX - p.ux;
      if (dy) sc.scrollTop = p.dTop - dy;
      if (dx) sc.scrollLeft = p.dLeft - dx;
      p.dTop = sc.scrollTop; p.dLeft = sc.scrollLeft; p.ux = e.clientX; p.uy = e.clientY;
    } catch (x) {}
  }
  function tqHayAro() {   /* (13) ¿la página sabe DÓNDE está lo que sobra? Lo ve como puntero, o está en la lista de dedos */
    try {
      if (Object.keys(TQ.baja).length) return true;
      var k; for (k in TQ.loc) { if (TQ.loc[k].tVisto - TQ.loc[k].tQuieto > 3000) return true; }
      for (k in TQ.here) { if (TQ.here[k].tVisto - TQ.here[k].tQuieto > 3000) return true; }
    } catch (e) {}
    return false;
  }
  function tqAviso(on) {
    try {
      if (!on) { if (TQ.aviso) { if (TQ.aviso.parentNode) TQ.aviso.parentNode.removeChild(TQ.aviso); TQ.aviso = null; } return; }
      if (TQ.aviso || TQ.avisoNo) return;
      var d = document.createElement('div'); d.className = 'lm-enganche'; d.setAttribute('role', 'status');
      d.style.cssText = 'position:fixed;z-index:2147483645;left:50%;bottom:14px;transform:translateX(-50%);width:max-content;max-width:92vw;box-sizing:border-box;display:flex;gap:12px;align-items:center;padding:10px 10px 10px 16px;border-radius:12px;background:#7f1d1d;color:#fff;border:2px solid #fca5a5;box-shadow:0 10px 30px rgba(0,0,0,.5);font:700 15px/1.4 Arial,sans-serif;pointer-events:none';
      var t = document.createElement('span');
      /* si la página ve el dedo de más, hay aro rojo: que lo mire; si no lo ve, es un toque colgado de la ventana */
      t.textContent = tqHayAro()
        ? 'La pantalla táctil se ha quedado «enganchada»: nota algo apoyado (mira el aro rojo). Puedes seguir: el portal lo compensa. Si ahí no hay nada, cierra esta ventana del navegador y vuelve a abrirla.'
        : 'La pantalla táctil se ha quedado «enganchada»: el navegador cree que hay un dedo apoyado. Puedes seguir: el portal lo compensa. Para arreglarlo del todo, cierra esta ventana del navegador y vuelve a abrirla.';
      var x = document.createElement('button'); x.type = 'button'; x.textContent = '✕'; x.setAttribute('aria-label', 'Cerrar el aviso');
      x.style.cssText = 'flex:none;width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.6);background:rgba(255,255,255,.12);color:#fff;font:800 15px/1 Arial,sans-serif;cursor:pointer;pointer-events:auto';
      x.addEventListener('click', function () { TQ.avisoNo = true; tqAviso(false); });
      d.appendChild(t); d.appendChild(x);
      (document.fullscreenElement || document.webkitFullscreenElement || document.body).appendChild(d);
      TQ.aviso = d;
      try { cnEnviar('tactil-enganchado', { clics_dados_por_el_portal: TQ.n, dedos_que_ve_la_pagina: Object.keys(TQ.baja).length,
        dedos_en_la_lista: Object.keys(TQ.loc).length, heredados: Object.keys(TQ.here).length, punteros_cortados: !!TQ.sinPunteros }); } catch (x2) {}
    } catch (e) {}
  }
  function tqMarcas() {
    var ah = Date.now(), vivos = {}, k;
    for (k in TQ.baja) { var p = TQ.baja[k]; if (ah - p.tQuieto > 5000) vivos[k] = p;
      /* (7-oct-2026) un dedo que lleva más de 3 s quieto: el siguiente que baje no puede acabar en «pellizco». Hay que
         decirlo ANTES de que baje (el navegador decide qué deja hacer a un dedo antes de avisar a la página) */
      if (ah - p.tQuieto > 3000) tqSinPellizco(true); }
    /* (7-oct-2026, 13) y los que se conocen por la LISTA de dedos del navegador: siguen en ella aunque el navegador ya no
       mande sus «punteros» (el dedo que nació deslizando la página y no se levantó), y los «heredados» (en la lista sin
       que esta página los viera bajar: un toque colgado de antes de cargarla). Cuentan cuando OTRO aviso táctil, al
       menos 3 s después de su último movimiento, los sigue trayendo en la lista (tVisto): así un dedo cuyo «levantar»
       no llegó a la página no deja un aro de mentira. Entonces: sospecha; y a los 5 s, aro rojo donde está. */
    var cerca = function (q) { for (var j in vivos) { if (Math.abs(vivos[j].x - q.x) < 30 && Math.abs(vivos[j].y - q.y) < 30) return true; } return false; };
    for (k in TQ.loc) { var ql = TQ.loc[k]; if (ql.tVisto - ql.tQuieto > 3000) { tqSinPellizco(true); if (ah - ql.tQuieto > 5000 && !cerca(ql)) vivos['l' + k] = ql; } }
    for (k in TQ.here) { var qh = TQ.here[k]; if (qh.tVisto - qh.tQuieto > 3000) { tqSinPellizco(true);
      if (ah - qh.tQuieto > 5000) { if (!cerca(qh)) vivos['h' + k] = qh;
        if (!qh.dicho) { qh.dicho = true; try { cnEnviar('toque-heredado', { x: Math.round(qh.x), y: Math.round(qh.y), heredados: Object.keys(TQ.here).length }); } catch (x) {} } } } }
    if (TQ.raton && ah - TQ.raton.tQuieto > 8000) vivos.raton = TQ.raton;   /* (7-oct-2026) el botón del ratón, apretado y quieto */
    for (k in TQ.marcas) { if (!vivos[k]) { var m0 = TQ.marcas[k]; if (m0 && m0.parentNode) m0.parentNode.removeChild(m0); delete TQ.marcas[k]; } }
    var sitio = document.fullscreenElement || document.webkitFullscreenElement || document.body;
    if (TQ.aviso && TQ.aviso.parentNode !== sitio) sitio.appendChild(TQ.aviso);   /* al entrar o salir de pantalla completa, sigue a la vista */
    for (k in vivos) {
      var q = vivos[k], m = TQ.marcas[k];
      if (!m) {
        m = TQ.marcas[k] = document.createElement('div'); m.className = 'lm-fantasma'; m.setAttribute('aria-hidden', 'true');
        m.style.cssText = 'position:fixed;z-index:2147483646;pointer-events:none;width:54px;height:54px;margin:-27px 0 0 -27px;border-radius:50%;border:4px solid #ef4444;box-shadow:0 0 0 3px rgba(255,255,255,.85),0 0 18px rgba(239,68,68,.8);box-sizing:border-box';
        var t = document.createElement('span');
        t.style.cssText = 'position:absolute;white-space:nowrap;padding:5px 9px;border-radius:8px;background:#b91c1c;color:#fff;font:700 13px/1.2 Arial,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.4)';
        m.appendChild(t);
      }
      var mx = Math.round(q.x) + 'px', my = Math.round(q.y) + 'px', tt = m.firstChild;
      if (m.style.left !== mx) m.style.left = mx; if (m.style.top !== my) m.style.top = my;
      /* la etiqueta, hacia dentro de la pantalla */
      var der = q.x > window.innerWidth / 2, aba = q.y > window.innerHeight - 60;
      tt.style.right = der ? '60px' : ''; tt.style.left = der ? '' : '60px'; tt.style.bottom = aba ? '10px' : ''; tt.style.top = aba ? '' : '12px';
      if (m.parentNode !== sitio) sitio.appendChild(m);
      var seg = Math.round((ah - q.t0) / 1000), txt = (q.raton ? 'El ratón (o el panel táctil del teclado) tiene el botón apretado · ' : 'La pantalla nota algo apoyado aquí · ') + seg + ' s';
      if (m.firstChild.textContent !== txt) m.firstChild.textContent = txt;
    }
  }
  function toquesSeguros() {
    if (TQ.on || !esProfe()) return;
    TQ.on = true;
    /* (7-oct-2026, 13) EN UN ORDENADOR CON PANTALLA TÁCTIL (el del aula), DOS DEDOS NO AMPLÍAN LA PÁGINA. Con un toque
       colgado, cualquier dedo es «el segundo» y el navegador se quedaba el gesto: ampliaba la página y dejaba de mandar
       los punteros de todos los toques siguientes. Con esta orden el navegador no se queda ningún gesto de dos dedos.
       Solo Tester/Protester; en tabletas y móviles no se toca (allí sí se amplía con dos dedos). Para volver a lo de
       antes (ampliar con dos dedos salvo durante el enganche): quitar este bloque. */
    try {
      TQ.movil = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      TQ.cromo = /Chrom(e|ium)\/\d+/.test(navigator.userAgent);
      if (!TQ.movil && ((navigator.maxTouchPoints || 0) > 0 || ('ontouchstart' in window))) {
        var r0 = document.documentElement; TQ.fijo = true; TQ.taAntes = r0.style.touchAction || ''; r0.style.touchAction = 'pan-x pan-y';
      }
    } catch (e) {}
    document.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') {   /* (7-oct-2026) solo se anota; con ratón no cambia nada de cómo responde el portal */
        if (e.buttons & 1) { var am = Date.now(); TQ.raton = { t0: am, tQuieto: am, ax: e.clientX, ay: e.clientY, x: e.clientX, y: e.clientY, raton: true }; }
        return;
      }
      if (e.pointerType !== 'touch' && e.pointerType !== 'pen') return;
      var ah = Date.now();
      var frena = false;   /* (7-oct-2026) tocar para FRENAR lo que se desliza no es «pulsar»: ahí el navegador no da «clic» a propósito */
      try { frena = (ah - TQ.tScroll < 250) && !!TQ.scrollEl && (TQ.scrollEl === document || (TQ.scrollEl.contains && TQ.scrollEl.contains(e.target))); } catch (x) {}
      TQ.tUlt = ah;
      TQ.baja[e.pointerId] = { t0: ah, tQuieto: ah, ax: e.clientX, ay: e.clientY, x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, el: e.target, movido: false, ev: e, frena: frena };
      if (Object.keys(TQ.baja).length >= 2) TQ.tDos = ah;   /* la página ve dos dedos: un pellizco ahora sería de verdad */
    }, true);
    document.addEventListener('scroll', function (e) { TQ.tScroll = Date.now(); TQ.scrollEl = e.target; }, { capture: true, passive: true });
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'mouse') {
        var r = TQ.raton; if (!r) return;
        if (!(e.buttons & 1)) { TQ.raton = null; tqMarcas(); return; }   /* ya está suelto (el «soltar» no llegó a la página) */
        r.x = e.clientX; r.y = e.clientY;
        if (Math.abs(r.x - r.ax) + Math.abs(r.y - r.ay) > 14) { r.ax = r.x; r.ay = r.y; r.tQuieto = Date.now(); }   /* se mueve: se está usando */
        return;
      }
      var p = TQ.baja[e.pointerId]; if (!p) return;
      p.x = e.clientX; p.y = e.clientY;
      if (Math.abs(p.x - p.ax) + Math.abs(p.y - p.ay) > 14) { p.movido = true; p.ax = p.x; p.ay = p.y; p.tQuieto = Date.now(); }   /* se mueve: de momento no es un dedo «olvidado» */
      if (TQ.sinPellizco) tqDesliza(p, e);   /* (7-oct-2026) con el táctil enganchado, el portal mueve la página con el dedo */
    }, { capture: true, passive: true });
    document.addEventListener('touchend', function (e) { TQ.tFin = e; }, { capture: true, passive: true });
    /* (7-oct-2026, 13) LA LISTA DE DEDOS Y LOS «PUNTEROS DE RESERVA».
       El navegador avisa de cada dedo por dos vías: los «punteros» (de ellos cuelga todo: el clic de reserva, deslizar,
       escribir en el lienzo) y los avisos táctiles de siempre (touchstart/touchmove/touchend), que además traen la lista
       de TODOS los dedos que cree apoyados. Cuando el navegador se queda un gesto (deslizar, ampliar) da por cancelados
       los punteros y no vuelve a mandar ninguno hasta que se levanten TODOS los dedos. Con un toque colgado eso no
       pasa nunca: los toques siguientes llegan solo por la vía táctil, y la página se queda sorda.
       · TQ.loc: los dedos que esta página vio bajar y siguen en la lista (con cuánto llevan quietos).
       · TQ.here: los «heredados»: están en la lista y esta página no los vio bajar.
       · TQ.pr: los dedos que llegaron SIN puntero y a los que el portal se lo fabrica (punteros de reserva): mismos
         sitios, mismo elemento. Solo si el navegador cuenta algún dedo más y todos los demás llevan más de 3 s quietos
         (si alguno se mueve, es lo normal: el navegador desliza con él), y solo en Chrome de ordenador. */
    window.addEventListener('pointerdown', function (e) {   /* cada puntero táctil DE VERDAD se apunta, lo primero */
      try {
        if (!e.isTrusted || e.pointerType !== 'touch') return;
        var ah = Date.now();
        /* (14) el navegador decía que no había pantalla táctil y aquí hay un toque: la orden de no ampliar con dos dedos
           se pone ahora (para los gestos que vengan) */
        if (!TQ.fijo && !TQ.movil) { TQ.fijo = true; if (!TQ.sinPellizco) { try { var r1 = document.documentElement; TQ.taAntes = r1.style.touchAction || ''; r1.style.touchAction = 'pan-x pan-y'; } catch (x) {} } }
        TQ.pds.push({ x: e.clientX, y: e.clientY, t: ah, usado: false }); if (TQ.pds.length > 8) TQ.pds.shift();
        /* red de seguridad: si el puntero de verdad llega DESPUÉS de haber fabricado uno de reserva para ese mismo dedo,
           este navegador avisa en otro orden: el de reserva se retira y no se vuelven a fabricar */
        for (var kp in TQ.pr) { var z = TQ.pr[kp];
          if (ah - z.t < 300 && Math.abs(z.x0 - e.clientX) < 4 && Math.abs(z.y0 - e.clientY) < 4) {
            TQ.prNo = true; delete TQ.pr[kp]; tqPr('pointercancel', z, { clientX: z.x0, clientY: z.y0 });
            try { cnEnviar('punteros-de-reserva-retirados', {}); } catch (x) {} } }
      } catch (x) {}
    }, true);
    function tqPr(tipo, pr, t) {
      try {
        var fin = (tipo === 'pointerup' || tipo === 'pointercancel');
        var ev = new PointerEvent(tipo, { pointerId: pr.id, pointerType: 'touch', isPrimary: true, bubbles: true, cancelable: tipo !== 'pointercancel', composed: true, view: window,
          clientX: t.clientX, clientY: t.clientY, screenX: t.screenX || 0, screenY: t.screenY || 0, button: tipo === 'pointermove' ? -1 : 0, buttons: fin ? 0 : 1, pressure: fin ? 0 : 0.5, width: 1, height: 1 });
        ((pr.el && pr.el.isConnected) ? pr.el : document).dispatchEvent(ev);
      } catch (x) {}
    }
    function tqToque(e) {
      try {
        if (e.__lmTq) return; e.__lmTq = 1;       /* el mismo aviso puede llegar por el documento y por el elemento tocado */
        var ah = Date.now(), tipo = e.type, i, k, t, q, lista = {}, nl = 0;
        for (i = 0; i < e.touches.length; i++) { lista[e.touches[i].identifier] = e.touches[i]; nl++; }
        if (tipo === 'touchstart') {
          if (!Object.keys(TQ.loc).length) TQ.g = { t0: ah, esc0: (window.visualViewport ? window.visualViewport.scale : 1), max: 0, fin: 0 };
          for (i = 0; i < e.changedTouches.length; i++) { t = e.changedTouches[i];
            TQ.loc[t.identifier] = { t0: ah, tQuieto: ah, tVisto: ah, ax: t.clientX, ay: t.clientY, x: t.clientX, y: t.clientY };
            delete TQ.here[t.identifier];
            /* el «levantar» de un dedo se le dice al elemento que tocó: si para entonces ese elemento ya no está en la
               página (un botón que cierra su ventana), al documento no le llega. Se escucha también en el elemento. */
            var tg = t.target;
            if (tg && tg.addEventListener && !tg.__lmTqE) { try { tg.__lmTqE = 1; tg.addEventListener('touchmove', tqToque, { passive: true }); tg.addEventListener('touchend', tqToque, { passive: true }); tg.addEventListener('touchcancel', tqToque, { passive: true }); } catch (x) {} }
          }
          if (TQ.g) TQ.g.max = Math.max(TQ.g.max, Object.keys(TQ.loc).length);
        }
        /* la lista manda: lo que ya no está en ella, se levantó */
        for (k in TQ.loc) { if (!lista[k]) delete TQ.loc[k]; }
        for (k in TQ.here) { if (!lista[k]) delete TQ.here[k]; }
        if (!Object.keys(TQ.loc).length && TQ.g && !TQ.g.fin) TQ.g.fin = ah;
        for (k in lista) { t = lista[k]; q = TQ.loc[k];
          if (!q) { q = TQ.here[k];
            if (!q) { q = TQ.here[k] = { t0: ah, tQuieto: ah, ax: t.clientX, ay: t.clientY, heredado: true }; try { cnApunta('dedo-heredado', { n: Object.keys(TQ.here).length }); } catch (x) {} } }
          q.x = t.clientX; q.y = t.clientY; q.tVisto = ah;
          if (Math.abs(q.x - q.ax) + Math.abs(q.y - q.ay) > 14) { q.ax = q.x; q.ay = q.y; q.tQuieto = ah; } }
        /* los punteros de reserva */
        if (TQ.prNo || TQ.movil || !TQ.cromo) return;
        if (tipo === 'touchstart') {
          for (i = 0; i < e.changedTouches.length; i++) { t = e.changedTouches[i];
            var con = false, j, d;
            for (j = TQ.pds.length - 1; j >= 0; j--) { d = TQ.pds[j];
              if (!d.usado && ah - d.t < 1500 && Math.abs(d.x - t.clientX) < 4 && Math.abs(d.y - t.clientY) < 4) { d.usado = true; con = true; break; } }
            if (con) continue;                                                     /* trae su puntero: lo de siempre */
            if (nl < 2) continue;                                                  /* el navegador no cuenta ningún dedo más: no hay a quién achacárselo */
            var frescos = 0;
            for (k in lista) { if (String(k) === String(t.identifier)) continue; q = TQ.loc[k] || TQ.here[k]; if (!q || ah - q.tQuieto <= 3000) frescos++; }
            if (frescos) continue;                                                 /* otro dedo se está moviendo (o acaba de aparecer): es lo normal */
            var el = t.target; if (el && el.nodeType !== 1) el = el.parentElement;
            var pr = TQ.pr[t.identifier] = { id: 6400 + (Math.abs(t.identifier) % 500), el: el || document.body, t: ah, x0: t.clientX, y0: t.clientY };
            TQ.nPr++; TQ.sinPunteros = true; tqSinPellizco(true);
            try { cnApunta('puntero-de-reserva', { en: cnDesc(pr.el), lista: nl }); cnEnviar('punteros-cortados', { dedos_en_la_lista: nl, heredados: Object.keys(TQ.here).length }); } catch (x) {}
            tqPr('pointerdown', pr, t);
          }
        } else {
          for (i = 0; i < e.changedTouches.length; i++) { t = e.changedTouches[i]; var p2 = TQ.pr[t.identifier]; if (!p2) continue;
            if (tipo === 'touchmove') tqPr('pointermove', p2, t);
            else { delete TQ.pr[t.identifier]; tqPr(tipo === 'touchend' ? 'pointerup' : 'pointercancel', p2, t); } }
        }
      } catch (x) {}
    }
    ['touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(function (tp) { document.addEventListener(tp, tqToque, { capture: true, passive: true }); });
    function suelta(e) {
      if (e.pointerType === 'mouse') { if (TQ.raton && (e.type === 'pointercancel' || !(e.buttons & 1))) { TQ.raton = null; tqMarcas(); } return; }
      var p = TQ.baja[e.pointerId]; if (!p) return;
      if (Object.keys(TQ.baja).length >= 2) TQ.tDos = Date.now();
      TQ.tUlt = Date.now();
      delete TQ.baja[e.pointerId]; tqMarcas();
      if (e.type === 'pointercancel') return;
      var ah = Date.now();
      TQ.tUlt = ah;
      if (p.movido || ah - p.t0 > 700) return;                                    /* se arrastró o se quedó apoyado: no es un toque */
      if (p.frena) return;                                                         /* frenaba una lista: no es pulsar */
      var el = p.el; if (!el || el.nodeType !== 1) return;
      try { var inh = el.closest('button, input, select, textarea'); if (inh && inh.matches(':disabled')) return; } catch (x) {}   /* desactivado: no hay «clic» que dar */
      if (el.closest('canvas, select, option, .lm-vl-rueda, .anot-rueda, .lm-fantasma')) return;   /* ahí el dedo lo lleva la página, o no hay «clic» que dar */
      var marca = { el: el, t: ah, baja: p.ev, sube: e };
      TQ.esp = marca;
      setTimeout(function () {
        if (TQ.esp !== marca) return;                                               /* llegó el «clic» del navegador: nada que hacer */
        TQ.esp = null;
        try {
          if ((marca.baja && marca.baja.defaultPrevented) || marca.sube.defaultPrevented) return;      /* la página anuló el gesto a propósito */
          if (TQ.tFin && TQ.tFin.defaultPrevented && Math.abs(TQ.tFin.timeStamp - marca.sube.timeStamp) < 60) return;
          if (!el.isConnected) return;
          /* el dedo puede caer sobre el DIBUJO de un botón (un <svg>, que no sabe hacer «clic»): se da en el primer
             elemento de la página que sí sabe —el botón que lo lleva dentro—, que es adonde habría llegado igual */
          var dest = el; while (dest && typeof dest.click !== 'function') dest = dest.parentElement;
          if (!dest) return;
          TQ.sint = { el: dest, t: Date.now() }; TQ.n++; TQ.racha++;
          tqSinPellizco(true);                 /* (13) con UN «clic» dado por el portal ya hay sospecha: desde aquí el portal también mueve la página con el dedo */
          if (TQ.racha >= 3) tqAviso(true);
          try { cnApunta('clic-dado', { en: cnDesc(el), dedos: Object.keys(TQ.baja).length }); if (TQ.n === 1) cnEnviar('clic-dado-por-el-portal', { en: cnDesc(el), dedos_apoyados: Object.keys(TQ.baja).length }, 'info'); } catch (x) {}
          var ed = el.closest('input, textarea, [contenteditable=""], [contenteditable="true"]');
          if (ed && ed.focus) { try { ed.focus(); } catch (x) {} }
          dest.click();
          try { tragaArma(dest); } catch (x) {}   /* si el del navegador llega aún más tarde y lo de debajo ha cambiado, no se cuela */
        } catch (x) {}
      }, TQ.racha >= 2 ? 140 : 330);   /* (7-oct-2026) con el táctil enganchado no se hace esperar 1/3 de segundo a cada toque */
    }
    document.addEventListener('pointerup', suelta, true);
    document.addEventListener('pointercancel', suelta, true);
    document.addEventListener('click', function (e) {
      if (!e.isTrusted) return;                         /* los «clic» que da el propio portal no cuentan */
      TQ.esp = null;
      /* (7-oct-2026) un «clic» del navegador que viene de un dedo: el táctil ya no está enganchado */
      var deDedo = e.pointerType ? (e.pointerType === 'touch' || e.pointerType === 'pen') : (Date.now() - TQ.tUlt < 700);
      if (deDedo) { TQ.racha = 0; TQ.avisoNo = false; TQ.sinPunteros = false; tqSinPellizco(false); if (TQ.aviso) tqAviso(false); }
      var s = TQ.sint;
      if (s && Date.now() - s.t < 900 && e.target && (s.el === e.target || s.el.contains(e.target) || (e.target.contains && e.target.contains(s.el)))) {
        TQ.sint = null; TQ.tardios++; e.preventDefault(); e.stopImmediatePropagation();          /* llegó tarde y ya se había dado: se descarta */
      }
    }, true);
    setInterval(function () { try { tqMarcas(); } catch (e) {} }, 1000);
    /* (7-oct-2026) PELLIZCO FANTASMA: la página cambia de ampliación con un solo dedo a la vista */
    try {
      var esMovil = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      if (window.visualViewport && !esMovil) {
        TQ.escala = window.visualViewport.scale;
        window.visualViewport.addEventListener('resize', function () {
          /* (13) se compara con la ampliación que había al EMPEZAR el gesto (antes, con el aviso anterior: una ampliación
             suave, de poquito en poquito, no saltaba nunca) y el gesto se sigue por los avisos táctiles, que no se cortan.
             Es fantasma si en todo el gesto esta página solo vio bajar UN dedo. */
          var esc = window.visualViewport.scale; TQ.escala = esc;
          var g = TQ.g, ah = Date.now(); if (!g || g.dicho) return;
          var enGesto = Object.keys(TQ.loc).length > 0 || ah - g.fin < 700;
          if (enGesto && g.max < 2 && Math.abs(esc - g.esc0) >= 0.03) {
            g.dicho = true; TQ.racha = Math.max(TQ.racha, 3); tqSinPellizco(true); tqAviso(true);
            try { cnEnviar('pellizco-fantasma', { ampliacion: Math.round(esc * 100) / 100, antes: Math.round(g.esc0 * 100) / 100, dedos_que_ve_la_pagina: Object.keys(TQ.baja).length, heredados: Object.keys(TQ.here).length }); } catch (x) {}
          }
        });
      }
    } catch (e) {}
    /* (7-oct-2026) G · GESTOS DEL NAVEGADOR QUE EN CLASE SOLO ESTORBAN. Dejar el dedo quieto abre el menú del navegador
       («Guardar imagen como…», «Copiar imagen»…) y ese menú se queda con el toque; sobre texto, lo selecciona; con el
       ratón, «agarra» la imagen. Dentro de un editor no hay nada de eso que hacer. El menú por dedo quieto tampoco sale
       en el resto del portal; con el botón derecho del ratón fuera de los editores, sale como siempre. En las notas de
       texto se puede seguir escribiendo y seleccionando. */
    document.addEventListener('contextmenu', function (e) {
      try {
        var t = e.target; if (t && t.nodeType === 3) t = t.parentElement;
        var dedo = (e.pointerType === 'touch' || e.pointerType === 'pen') || (e.pointerType !== 'mouse' && (Object.keys(TQ.baja).length > 0 || Date.now() - TQ.tUlt < 1200));
        var dentro = !!(t && t.closest && t.closest('#ts-visor, #pz-ov, #lb-ov'));
        var campo = !!(t && t.closest && t.closest('input, textarea, [contenteditable=""], [contenteditable="true"]'));
        var evita = (dedo || dentro) && !campo;
        TQ.menus++;
        try { cnApunta('menu', { p: e.pointerType || '?', en: cnDesc(t), ev: evita ? 1 : undefined }); } catch (x) {}
        if (evita) e.preventDefault();
      } catch (x) {}
    }, true);
    try {
      if (!document.getElementById('lm-toques-css')) {
        var st = document.createElement('style'); st.id = 'lm-toques-css';
        st.textContent = '#ts-visor,#ts-visor *{-webkit-touch-callout:none}' +
          '#ts-visor{-webkit-user-select:none;user-select:none}' +
          '#ts-visor input,#ts-visor textarea,#ts-visor [contenteditable=""],#ts-visor [contenteditable="true"]{-webkit-user-select:text;user-select:text}' +
          '#ts-visor img{-webkit-user-drag:none}';
        document.head.appendChild(st);
      }
    } catch (e) {}
  }

  function todo() {
    try { cajaNegra(); } catch (e) {}
    try { toquesSeguros(); } catch (e) {}
    try { editorLigero(); } catch (e) {}
    try { cajaVer(); } catch (e) {}
    if (editorAbierto()) {   /* (6-oct-2026, noche) con un editor a toda pantalla el portal de debajo no se ve: solo se viste el editor */
      try { visorLecciones(); } catch (e) {}
      try { librosMax(); } catch (e) {}
      return;
    }
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
    try { musica(); } catch (e) {}
  }
  todo();
  var n = 0, t = setInterval(function () { todo(); if (++n > 240) clearInterval(t); }, 500);
  try { new MutationObserver(function () { todo(); }).observe(document.querySelector('.topbar') || document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] }); } catch (e) {}
})();
