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
   10) Libros: botón «Pantalla completa» con un libro abierto (la página ocupa toda la pantalla; ✕ o Esc para salir).
   11) SOLO Tester/Protester (nunca para alumnos): cuadrado «Pantalla completa» (a la izquierda de Libros) y el cartel
       «GRADO ELEMENTAL / PROFESIONAL» de la portada pasa al otro portal al pulsarlo. Con la pantalla completa puesta, el
       otro portal se abre DENTRO de este (sin salir de pantalla completa) y el cartel vuelve.
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
      dicts.map(function (b) { return b.getAttribute('data-curso') + '|' + b.textContent; }), puedePantalla()]);
    if (barra.getAttribute('data-firma') === firma) return;
    cerrarMenu(); barra.setAttribute('data-firma', firma); barra.innerHTML = '';
    if (penta) barra.appendChild(cuadro('lm-ic-penta', 'pentagrama', 'Pentagrama · pizarra para el aula', function () { pulsa(q('#pz-mini .da-btn')); }));
    if (puedePantalla()) barra.appendChild(cuadro('lm-ic-pantalla', enPantalla() ? 'contraer' : 'expandir', 'Pantalla completa', function () { alternarPantalla(); }));
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

  /* ---------- 10 (28-sep-2026, Iago): LIBROS · botón «Pantalla completa» ----------
     Con un libro abierto, junto a «Lista» sale un botón de pantalla completa: la página ocupa toda la pantalla (se
     vuelve a dibujar a ese tamaño) y arriba a la derecha solo quedan ‹ pág › y una ✕ para salir. Esc también sale. */
  function librosMax() {
    var o = document.getElementById('lb-ov'); if (!o) return;
    var top = o.querySelector('.lb-top'); if (!top) return;
    var b = document.getElementById('lm-lb-max');
    if (!b) {
      b = document.createElement('button'); b.id = 'lm-lb-max'; b.type = 'button'; b.className = 'lb-b';
      b.title = 'Pantalla completa'; b.setAttribute('aria-label', 'Pantalla completa'); b.innerHTML = ico('expandir');
      b.addEventListener('click', function () { entrarMax(o); });
      var lista = document.getElementById('lb-lista'); top.insertBefore(b, lista || null);
      var x = document.createElement('button'); x.id = 'lm-lb-salir'; x.type = 'button'; x.className = 'lb-b';
      x.title = 'Salir de pantalla completa'; x.setAttribute('aria-label', 'Salir de pantalla completa'); x.innerHTML = ico('x');
      x.addEventListener('click', function () { salirMax(o); });
      top.appendChild(x);
      var fuera = function () { if (!(document.fullscreenElement || document.webkitFullscreenElement) && o.classList.contains('lm-lb-max')) salirMax(o, true); };
      document.addEventListener('fullscreenchange', fuera); document.addEventListener('webkitfullscreenchange', fuera);
      /* si el visor se cierra (✕ de siempre, Esc), también se sale de pantalla completa */
      new MutationObserver(function () { if (!o.classList.contains('open') && o.classList.contains('lm-lb-max')) salirMax(o); }).observe(o, { attributes: true, attributeFilter: ['class'] });
      var body = document.getElementById('lb-body');
      if (body) new MutationObserver(function () { librosMax(); }).observe(body, { childList: true });
    }
    var enVis = !!document.getElementById('lb-vis');
    b.style.display = enVis ? '' : 'none';
    if (!enVis && o.classList.contains('lm-lb-max')) salirMax(o);
  }
  function entrarMax(o) {
    o.classList.add('lm-lb-max');
    var rq = o.requestFullscreen || o.webkitRequestFullscreen;
    if (rq) { try { var p = rq.call(o); if (p && p.catch) p.catch(function () {}); } catch (e) {} }
    setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 80);
    try { document.getElementById('lm-lb-salir').focus({ preventScroll: true }); } catch (e) {}
  }
  function salirMax(o, yaFuera) {
    o.classList.remove('lm-lb-max');
    if (!yaFuera && (document.fullscreenElement || document.webkitFullscreenElement)) {
      try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) {}
    }
    setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 80);
  }
  try { new MutationObserver(function () { if (document.getElementById('lb-ov') && !document.getElementById('lm-lb-max')) librosMax(); }).observe(document.body, { childList: true }); } catch (e) {}

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
  function pintarPantalla() {
    var b = document.querySelector('#lm-iconos .lm-ic-pantalla'); if (!b) return;
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

  function todo() {
    try { tarjetas(); } catch (e) {} try { misResultados(); } catch (e) {} try { hileraTester(); } catch (e) {}
    try { carrusel(); } catch (e) {} try { pie(); } catch (e) {} try { colorNavegador(); } catch (e) {}
    try { cartelGrado(); } catch (e) {}
    try { hileraIconos(); } catch (e) {}
    try { librosMax(); } catch (e) {}
  }
  todo();
  var n = 0, t = setInterval(function () { todo(); if (++n > 240) clearInterval(t); }, 500);
  try { new MutationObserver(function () { todo(); }).observe(document.querySelector('.topbar') || document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] }); } catch (e) {}
})();
