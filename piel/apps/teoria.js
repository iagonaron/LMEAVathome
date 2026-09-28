/* =====================================================================
   LM at home · piel · TEORÍA (26-sep-2026, Iago): comportamientos SOLO visuales.
   No toca datos, eventos ni lógica: solo pinta.
   1) Iconos planos (como los del Diario) en los botones cuyo texto empieza por
      un signo que el núcleo no convierte: ✓ Corregir · ↶ Deshacer · ↻ · ‹ / ← / ↩
      (volver) · ✕ (cerrar). El signo original se queda en el texto, oculto
      (span.pl-emo), así que el textContent de cada botón no cambia.
   2) Colores escritos a mano que teoria.css no alcanza:
      · TEORÍA PRO (GP): «del dorado al rosa». Dorados, marrones y cremas de las
        hojas de estilo de la app, de los style="" que pinta su JavaScript y de los
        fill/stroke de sus SVG pasan a la paleta del Diario (rosa #ec4899/#db2777,
        cristal oscuro, blanco). Los ámbar/amarillo/naranja con significado
        (avisos, puntos de estado) se respetan; «GRADO PROFESIONAL» sigue dorado.
      · TEORÍA at home (GE): solo textos gris-azulados/lavanda → blanco y adornos
        violeta/cian → rosa, en hojas de estilo y style="". En GE nunca se tocan
        los SVG ni el generador del profesor (sus SVG se guardan en la ficha).
      Nunca entra en el visor de apuntes (#apx-css / .apx-ov) ni en la piel.
      Los PDF no cambian: el generador serializa cada SVG en el mismo instante en
      que lo dibuja, antes de que llegue este repintado (que es asíncrono).
   3) (27-sep-2026, segunda y tercera vuelta) pie con «by Iago…» y «Optimizado…»,
      y botones iguales: el de «nuevo / otro…» pasa a ser SOLO un dado: sección 4.
      (El rótulo de grado ya no se alinea con nada: va fijo arriba, lo pone el núcleo.)
   Para quitarlo: vaciar este fichero (teoria.css sigue funcionando solo).
   Copias: teoria.js.bak-27sep (antes de la 2.ª vuelta) · teoria.js.bak-27sep-v2 (antes de la 3.ª).
   ===================================================================== */
(function () {
  'use strict';
  var H = document.documentElement;
  if (!H.classList.contains('lm-fam-teoria') || window.__lmPielTeoria) return;
  window.__lmPielTeoria = true;
  var GP = H.classList.contains('lm-gp');
  var LP = window.LMPiel || {};

  /* =====================================================================
     1. ICONOS PLANOS EN BOTONES
     ===================================================================== */
  var EXTRA = {
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>'
  };
  function svgIco(n) {
    if (LP.P && LP.P[n] && LP.ico) return LP.ico(n);
    var p = EXTRA[n] || (LP.P && LP.P[n]); if (!p) return '';
    return '<svg class="pl-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }
  var SIGNO = { '✓': 'check', '✔': 'check', '↶': 'undo', '↺': 'undo', '↻': 'refresh', '⟳': 'refresh',
                '←': 'arrowleft', '↩': 'arrowleft', '‹': 'arrowleft', '✕': 'x', '✖': 'x', '×': 'x' };
  var RE_SIG = /^(\s*)([✓✔↶↺↻⟳←↩‹✕✖×])(\uFE0F?)(\s*)/;
  var BOTON = 'button,[role="button"],.iconbtn,.gn-undo,.lmeav-link,.to-portal,.btn';
  function esPrimerTexto(btn, tn) {
    var w = document.createTreeWalker(btn, NodeFilter.SHOW_TEXT, null), x;
    while ((x = w.nextNode())) {
      if (x.parentNode && x.parentNode.closest && x.parentNode.closest('.pl-emo,svg')) continue;
      if (/\S/.test(x.nodeValue)) return x === tn;
    }
    return false;
  }
  function convertir(tn) {
    var t = tn.nodeValue; if (!t || t.length > 120) return;
    var m = RE_SIG.exec(t); if (!m) return;
    var par = tn.parentNode; if (!par || par.nodeType !== 1 || !par.closest) return;
    if (par.closest('svg,.pl-emo,.no-plano,.apx-ov,[contenteditable="true"]')) return;
    var btn = par.closest(BOTON); if (!btn || !esPrimerTexto(btn, tn)) return;
    /* ✕ / × solo si el botón no dice nada más (botones de cerrar) */
    if ((m[2] === '×' || m[2] === '✕' || m[2] === '✖') && /\S/.test(t.slice(m[0].length))) return;
    var svg = svgIco(SIGNO[m[2]]); if (!svg) return;
    var sp = document.createElement('span'); sp.className = 'pl-emo'; sp.textContent = m[1] + m[2] + m[3];
    var tmp = document.createElement('span'); tmp.innerHTML = svg;
    par.insertBefore(tmp.firstChild, tn); par.insertBefore(sp, tn);
    tn.nodeValue = (m[4] ? ' ' : '') + t.slice(m[0].length);
    btn.classList.add('lm-con-icono');
  }
  /* los iconos dibujados por la app en los botones principales → los del Diario
     (bombilla). El SVG original se queda, oculto (.lm-ico-orig).
     (27-sep-2026) el dado de los botones «Nuevo» lo pone revisarBoton() (sección 4). */
  var PROPIOS = [['.btn-ejemplo > svg', 'bulb'], ['.serie-listen > svg', 'play']];
  function iconosPropios(raiz) {
    if (!LP.ico || !raiz || !raiz.querySelectorAll) return;
    PROPIOS.forEach(function (par) {
      var l = [].slice.call(raiz.querySelectorAll(par[0]));
      if (raiz.matches && raiz.matches(par[0])) l.push(raiz);
      l.forEach(function (s) {
        if (!s.classList || s.classList.contains('pl-i') || s.classList.contains('lm-ico-orig')) return;
        if (par[1] === 'dice' && !s.querySelector('rect')) return;          /* solo si de verdad es un dado */
        var t = document.createElement('span'); t.innerHTML = LP.ico(par[1]);
        var n = t.firstChild; if (!n) return;
        n.classList.add('lm-ico-nuevo'); s.classList.add('lm-ico-orig');
        s.parentNode.insertBefore(n, s);
      });
    });
  }
  function barrerIconos(raiz) {
    if (!raiz) return;
    if (raiz.nodeType === 3) { convertir(raiz); try { revisarBoton(raiz.parentNode); } catch (e) {} return; }
    if (raiz.nodeType !== 1 || /^(SCRIPT|STYLE|svg|SVG|TEXTAREA|INPUT)$/.test(raiz.nodeName)) return;
    try { iconosPropios(raiz); } catch (e) {}
    var w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, null), l = [], x;
    while ((x = w.nextNode())) { if (RE_SIG.test(x.nodeValue)) l.push(x); }
    l.forEach(convertir);
    try { botones(raiz); } catch (e) {}
  }

  /* =====================================================================
     2. COLORES ESCRITOS A MANO
     ===================================================================== */
  var RE_COL = /#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3,4}\b|rgba?\([^()]*\)/g;
  function leer(tok) {
    var s = tok.trim().toLowerCase(), m;
    if (s.charAt(0) === '#') {
      var h = s.slice(1);
      if (h.length === 3 || h.length === 4) h = h.replace(/./g, function (c) { return c + c; });
      if (h.length !== 6 && h.length !== 8) return null;
      return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1 };
    }
    m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,\/]\s*([\d.]+)(%?))?\s*\)$/.exec(s);
    if (!m) return null;
    var a = m[4] == null ? 1 : (m[5] ? parseFloat(m[4]) / 100 : parseFloat(m[4]));
    return { r: +m[1], g: +m[2], b: +m[3], a: a };
  }
  function hsl(c) {
    var r = c.r / 255, g = c.g / 255, b = c.b / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn, h = 0, s = 0;
    if (d > 0) {
      s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      h = mx === r ? ((g - b) / d + (g < b ? 6 : 0)) : mx === g ? ((b - r) / d + 2) : ((r - g) / d + 4); h *= 60;
    }
    return { h: h, s: s, l: l };
  }
  /* GP: cálidos CON significado (avisos ámbar, puntos amarillo/naranja): se quedan */
  var SEM = { '250,204,21': 1, '251,146,60': 1, '255,184,107': 1, '255,184,77': 1, '255,217,160': 1, '224,161,58': 1,
              '224,160,48': 1, '255,233,192': 1, '255,214,120': 1, '224,176,96': 1, '255,222,122': 1, '230,164,23': 1,
              '176,125,9': 1, '253,243,223': 1 };
  function claseGP(c) {
    if (!c || SEM[c.r + ',' + c.g + ',' + c.b]) return null;
    var x = hsl(c);
    if (x.h < 30 || x.h > 57 || x.s < 0.12) return null;
    var k = x.l < 0.09 ? 'negro' : x.l < 0.24 ? 'oscuro' : x.l < 0.45 ? 'hondo' : x.l < 0.72 ? (x.s >= 0.45 ? 'oro' : 'caqui') : 'crema';
    return { k: k, l: x.l, s: x.s, a: c.a, c: c };
  }
  function claseGE(c) {
    if (!c) return null;
    var x = hsl(c), k = null;
    if (x.h >= 200 && x.h <= 275 && x.l >= 0.55 && x.l < 0.97 && (x.s <= 0.6 || x.l >= 0.8)) k = 'grisazul';
    else if ((x.h >= 250 && x.h <= 292 && x.s >= 0.6 && x.l >= 0.45 && x.l <= 0.8) ||
             (x.h >= 185 && x.h <= 200 && x.s >= 0.8 && x.l >= 0.5 && x.l <= 0.8) ||
             (x.h >= 300 && x.h <= 336 && x.s >= 0.7 && x.l >= 0.45 && x.l <= 0.72)) k = 'deco';
    else if (x.l < 0.14 && x.h >= 245 && x.h <= 292 && x.s > 0.4) k = 'tintavioleta';
    return k ? { k: k, l: x.l, s: x.s, a: c.a, c: c } : null;
  }
  var clase = GP ? claseGP : claseGE;
  function a2(x) { return Math.round(x * 1000) / 1000; }
  function rgba(r, g, b, a) { return a >= 0.999 ? 'rgb(' + r + ', ' + g + ', ' + b + ')' : 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a2(a) + ')'; }
  var ROSA = [236, 72, 153], ROSAF = [219, 39, 119], VID = [11, 19, 32], OPACO = [19, 29, 47], TINTA = [22, 32, 58], BL = [255, 255, 255];
  function col(arr, a) { return rgba(arr[0], arr[1], arr[2], a); }
  /* equivalencias por papel: texto · fondo · borde · svg. ctx: 'oscuro' | 'claro' | '' (fondo alrededor) */
  function mapear(K, papel, ctxIn) {
    var a = K.a, k = K.k, blanco = K.c.r === 233 && K.c.g === 201 && K.c.b === 106;
    var ctx = (typeof ctxIn === 'function' && (k === 'caqui' || k === 'crema')) ? ctxIn() : (typeof ctxIn === 'function' ? '' : ctxIn);
    /* ---- GE ---- */
    if (k === 'grisazul') return papel === 'texto' ? col(BL, a * (K.l >= 0.8 ? 0.9 : 0.68)) : null;
    if (k === 'tintavioleta') return papel === 'texto' ? col(BL, a) : null;
    if (k === 'deco') {
      if (papel === 'texto') return col(ROSA, a);
      if (papel === 'fondo') return a >= 0.5 ? col(ROSAF, a) : col(ROSA, a);
      if (papel === 'borde') return col(ROSA, a);
      return null;
    }
    /* ---- GP ---- */
    switch (papel) {
      case 'texto':
        if (k === 'negro') return col(BL, a);                         /* tinta sobre dorado → blanco sobre rosa */
        if (k === 'oscuro') return col(TINTA, a);                      /* tinta sobre papel */
        if (k === 'hondo') return K.s >= 0.45 ? col(ROSAF, a) : col([107, 115, 144], a);
        if (k === 'oro') return col(ROSA, a);
        if (k === 'caqui') return ctx === 'oscuro' ? col(BL, a * 0.6) : col([154, 163, 184], a);
        return K.l >= 0.86 ? col(BL, a) : col(BL, a * 0.82);
      case 'fondo':
        if (k === 'negro' || k === 'oscuro') return a >= 0.999 ? col(OPACO, 1) : col(VID, a);
        if (k === 'hondo' || k === 'oro') {
          if (k === 'hondo' && K.s < 0.45) return col(BL, Math.min(a, 0.1));
          if (a >= 0.5) return col(ROSAF, a);
          if (a <= 0.06 || (blanco && a <= 0.1)) return col(BL, a);
          return col(ROSA, a);
        }
        if (k === 'caqui') return a >= 0.999 ? (ctx === 'oscuro' ? col(BL, 0.1) : '#e3e7f1') : col(BL, Math.min(a, 0.1));
        return a >= 0.999 ? (ctx === 'oscuro' ? col(BL, 0.1) : '#ffffff') : col(BL, a);
      case 'borde':
        if (k === 'negro' || k === 'oscuro') return col(BL, a >= 0.999 ? 0.14 : Math.min(a, 0.2));
        if (k === 'hondo' && K.l < 0.3) return col(BL, 0.16);
        if (k === 'hondo' || k === 'oro') return a >= 0.45 ? col(ROSA, a) : col(BL, Math.min(a, 0.2));
        if (a < 0.999) return col(BL, Math.min(a, 0.22));
        if (ctx === 'oscuro') return col(BL, 0.2);                     /* borde claro pensado para un panel claro */
        return k === 'caqui' ? '#d0d5e2' : '#d6dbe8';
      case 'svg':
        if (k === 'negro' || k === 'oscuro') return col(TINTA, a);
        if (k === 'hondo') return K.s >= 0.45 ? col(ROSAF, a) : col([107, 115, 144], a);
        if (k === 'oro') return K.l < 0.6 ? col(ROSAF, a) : col(ROSA, a);
        if (k === 'caqui') return col([154, 163, 184], a);
        return col(BL, a);
    }
    return null;
  }
  function sustituir(v, papel, ctx) {
    var cambio = false;
    var out = v.replace(RE_COL, function (tok) {
      var K = clase(leer(tok)); if (!K) return tok;
      var n = mapear(K, papel, ctx); if (!n) return tok;
      cambio = true; return n;
    });
    return cambio ? out : null;
  }
  /* sombras: resplandores → sombra neutra; aros (sin desenfoque) → rosa */
  function capas(v) { var r = [], p = 0, cur = ''; for (var i = 0; i < v.length; i++) { var ch = v.charAt(i); if (ch === '(') p++; if (ch === ')') p--; if (ch === ',' && !p) { r.push(cur); cur = ''; } else cur += ch; } if (cur) r.push(cur); return r; }
  function sombra(v, esTexto) {
    var cambio = false;
    var out = capas(v).map(function (cap) {
      return cap.replace(RE_COL, function (tok) {
        var K = clase(leer(tok)); if (!K || K.k === 'grisazul' || K.k === 'tintavioleta') return tok;
        cambio = true;
        if (esTexto) return 'rgba(0, 0, 0, ' + a2(Math.min(K.a, 0.35)) + ')';
        var nums = cap.replace(RE_COL, ' ').replace(/inset/g, ' ').trim().split(/\s+/).map(parseFloat).filter(function (x) { return !isNaN(x); });
        var blur = nums.length >= 3 ? nums[2] : 0;
        if (blur > 2) return 'rgba(0, 0, 0, ' + a2(Math.min(K.a, 0.3)) + ')';
        if (K.k === 'negro' || K.k === 'oscuro') return 'rgba(0, 0, 0, ' + a2(K.a) + ')';
        if (K.k === 'crema' || K.k === 'caqui') return col(BL, Math.min(K.a, 0.12));
        return col(ROSA, K.a);
      });
    }).join(',');
    return cambio ? out : null;
  }
  /* degradados lineales opacos del tema → color liso (nada de degradados) */
  function aplanar(v, ctxIn) {
    if (!/linear-gradient/.test(v) || /radial|conic|url\(|transparent/.test(v)) return null;
    var ctx = typeof ctxIn === 'function' ? '' : ctxIn;
    var toks = v.match(RE_COL) || [], hay = false, fill = false, oscuro = 0, tinte = 0, crema = 0, varOro = GP && /var\(--gold/.test(v);
    toks.forEach(function (t) {
      var c = leer(t), K = clase(c); if (!c || c.a < 0.02 || !K) return;
      if (K.k === 'grisazul' || K.k === 'tintavioleta') return;
      hay = true;
      var claro = c.r === 233 && c.g === 201 && c.b === 106 && c.a <= 0.1;   /* velo dorado muy suave → velo blanco */
      if ((K.k === 'oro' || K.k === 'deco' || (K.k === 'hondo' && K.s >= 0.45)) && K.a >= 0.5) fill = true;
      else if (K.k === 'negro' || K.k === 'oscuro') oscuro = Math.max(oscuro, K.a);
      else if (K.k === 'crema' || claro) crema = Math.max(crema, claro ? Math.min(K.a, 0.08) : K.a);
      else tinte = Math.max(tinte, K.a);
    });
    if (varOro && !toks.length) { hay = true; fill = true; }
    if (!hay) return null;
    if (fill) return '#db2777';
    if (oscuro) return oscuro >= 0.999 ? col(OPACO, 1) : col(VID, oscuro);
    if (crema && typeof ctxIn === 'function') ctx = ctxIn();
    if (crema) return crema >= 0.999 ? (ctx === 'oscuro' ? col(BL, 0.1) : '#ffffff') : col(BL, crema);
    if (tinte) return tinte <= 0.06 ? col(BL, tinte) : col(ROSA, tinte);
    return null;
  }
  var PAPEL = {
    'color': 'texto', '-webkit-text-fill-color': 'texto', 'caret-color': 'texto', 'text-decoration-color': 'texto', '-webkit-text-stroke-color': 'texto',
    'background-color': 'fondo', 'background-image': 'fondo',
    'border-top-color': 'borde', 'border-right-color': 'borde', 'border-bottom-color': 'borde', 'border-left-color': 'borde',
    'outline-color': 'borde', 'column-rule-color': 'borde',
    'fill': 'svg', 'stroke': 'svg', 'stop-color': 'svg', 'flood-color': 'svg', 'lighting-color': 'svg'
  };
  /* recolorea una declaración (regla de una hoja o style="" de un elemento) */
  function recolorear(st, ctx) {
    if (!st || !st.length) return;
    var props = [], i;
    for (i = 0; i < st.length; i++) props.push(st[i]);
    var fondoLiso = null;
    /* GP: background con var(--gold…) en un degradado — el navegador no lo separa en partes → se aplana entero */
    if (GP) {
      var bg = st.getPropertyValue('background');
      if (bg && /gradient/.test(bg) && /var\(--gold/.test(bg) && !/radial|transparent/.test(bg)) {
        st.setProperty('background', '#db2777', st.getPropertyPriority('background'));
      }
    }
    props.forEach(function (p) {
      if (p.indexOf('--') === 0) return;
      var v = st.getPropertyValue(p); if (!v) return;
      var pr = st.getPropertyPriority(p), n = null;
      if (p === 'background-image') {
        var liso = aplanar(v, ctx);
        if (liso) { fondoLiso = liso; st.setProperty('background-image', 'none', pr); return; }
        n = sustituir(v, 'fondo', ctx);
      } else if (p === 'box-shadow') n = sombra(v, false);
      else if (p === 'text-shadow') n = sombra(v, true);
      else if (p === 'filter' || p === '-webkit-filter') { if (/drop-shadow/.test(v)) { n = v.replace(RE_COL, function (t) { var K = clase(leer(t)); return K && K.k !== 'grisazul' ? 'rgba(0, 0, 0, 0)' : t; }); if (n === v) n = null; } }
      else if (PAPEL[p]) { if (!GP && PAPEL[p] === 'svg') return; n = sustituir(v, PAPEL[p], ctx); }
      if (n != null && n !== v) st.setProperty(p, n, pr);
    });
    if (fondoLiso) st.setProperty('background-color', fondoLiso, st.getPropertyPriority('background-image'));
  }
  /* --- hojas de estilo de la app --- */
  var hechas = typeof WeakSet === 'function' ? new WeakSet() : null;
  /* GE: las reglas del generador de fichas del profesor (.pp-…, #view-profesor) no se tocan (tiene tarjetas blancas) */
  var RE_PROFE_GE = /\.pp-|#pp(?!AlumnoSim)|#view-profesor|#profRoot|\.prof-/;
  function reglas(lista) {
    for (var i = 0; i < lista.length; i++) {
      var r = lista[i];
      try {
        if (!GP && r.selectorText && RE_PROFE_GE.test(r.selectorText) && !/#ppAlumnoSim/.test(r.selectorText)) continue;
        if (r.style) recolorear(r.style, '');
        if (r.cssRules) reglas(r.cssRules);   /* @media, @supports, @keyframes */
      } catch (e) {}
    }
  }
  function hojas() {
    var ss = document.styleSheets;
    for (var i = 0; i < ss.length; i++) {
      var s = ss[i], nodo = s.ownerNode;
      if (!nodo || nodo.nodeName !== 'STYLE' || nodo.id === 'apx-css' || nodo.hasAttribute('data-lm-piel')) continue;
      if (hechas) { if (hechas.has(nodo)) continue; hechas.add(nodo); }
      try { reglas(s.cssRules); } catch (e) {}
    }
  }
  /* --- style="" y atributos de SVG que pinta la app --- */
  var RE_HAY = /#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b|rgba?\(/i;
  var NO_GE = '.apx-ov,#lm-grado,#view-profesor,#profRoot,.pp-grid,#ppCesta,#ppExList';
  var NO_GP = '.apx-ov,#lm-grado';
  function fuera(el) {
    if (!el.closest) return true;
    if (el.closest(GP ? NO_GP : NO_GE)) return true;
    if (el.closest('.brand') && /GRADO/.test((el.textContent || '').replace(/\s/g, ''))) return true;
    return false;
  }
  /* ¿el fondo que rodea al elemento es oscuro o claro? (el primero bastante opaco hacia arriba) */
  function contexto(el) {
    var e = el, n = 0;
    while (e && e.nodeType === 1 && n++ < 12) {
      var bg = null; try { bg = getComputedStyle(e).backgroundColor; } catch (x) {}
      var c = bg && leer(bg);
      if (c && c.a >= 0.5) { var L = (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b) / 255; return L < 0.5 ? 'oscuro' : 'claro'; }
      e = e.parentElement;
    }
    return 'oscuro';   /* sin fondo propio: la foto con velo (oscura) */
  }
  var SVGNS = 'http://www.w3.org/2000/svg';
  /* ¿hay algún color del tema en este texto? (para no repasar lo que ya está bien) */
  function tieneTema(str) {
    var m = str.match(RE_COL); if (!m) return false;
    for (var i = 0; i < m.length; i++) { if (clase(leer(m[i]))) return true; }
    return false;
  }
  function elemento(el) {
    if (!el || el.nodeType !== 1) return;
    var esSvg = el.namespaceURI === SVGNS;
    if (esSvg && !GP) return;                      /* GE: los SVG no se tocan nunca */
    var st = el.getAttribute('style');
    if (st && RE_HAY.test(st) && tieneTema(st) && !fuera(el)) {
      var memo = null;
      recolorear(el.style, esSvg ? 'claro' : function () { return memo || (memo = contexto(el.parentElement || el)); });
    }
    if (esSvg) {
      ['fill', 'stroke', 'stop-color'].forEach(function (at) {
        var v = el.getAttribute(at); if (!v || v === 'none' || !RE_HAY.test(v)) return;
        if (fuera(el)) return;
        var n = sustituir(v, 'svg', 'claro'); if (n) el.setAttribute(at, n);
      });
    }
  }
  function subarbol(raiz) {
    if (!raiz || raiz.nodeType !== 1) return;
    if (raiz.nodeName === 'STYLE') { hojas(); return; }
    elemento(raiz);
    var l = raiz.querySelectorAll(GP ? '[style],[fill],[stroke],[stop-color],style' : '[style],style');
    for (var i = 0; i < l.length; i++) { if (l[i].nodeName === 'STYLE') { hojas(); continue; } elemento(l[i]); }
  }

  /* =====================================================================
     4. SEGUNDA Y TERCERA VUELTA (27-sep-2026, Iago)
     a) «by Iago González Alonso» y «Optimizado para ordenador y tablet» abajo
        del todo, en el centro (LMPiel.alPie los mueve, tal cual, a #lm-pie).
     b) (3.ª vuelta) El rótulo de grado ya no se alinea con nada: va fijo en la
        banda de arriba (núcleo); teoria.css deja libre esa banda.
     c) Botones iguales en todo Teoría: los de «nuevo / nuevos ejercicios /
        nueva… / otro… / reiniciar / empezar de nuevo» → SOLO un dado en un
        cuadrado rosa (3.ª vuelta), siempre el último de su fila (teoria.css);
        «Ejemplo resuelto / Ejercicio resuelto» → bombilla + «Ejemplo».
        Solo aspecto: el texto original sigue dentro del botón (oculto,
        span.lm-txt-orig) y en title/aria-label, así que su textContent no
        cambia; la palabra «Ejemplo» la pinta el CSS (span.lm-txt-nuevo::before).
     ===================================================================== */
  /* --- a) pie --- */
  function prepararPie() {
    if (!LP.alPie) return;
    if (!GP) {
      /* la portada ya decía abajo «TEORÍA at home · by Iago González Alonso»: con el pie nuevo
         se repetiría → se oculta ese texto (se queda el enlace «Generador de fichas») */
      var f = document.querySelector('#view-home > .foot');
      if (f && !f.querySelector('.lm-foot-orig')) {
        for (var n = f.firstChild; n; n = n.nextSibling) {
          if (n.nodeType === 3 && /Iago/.test(n.nodeValue)) {
            var sp = document.createElement('span'); sp.className = 'lm-foot-orig';
            f.insertBefore(sp, n); sp.appendChild(n); break;
          }
        }
      }
      LP.alPie(['.topinfo .topinfo-by', '.topinfo .topinfo-opt']);
    } else {
      /* index (portada) y modulacion.html: «by Iago…» · «Versión optimizada…» */
      LP.alPie(['header.top > .tagline', '.opt-banner.opt-top']);
    }
    H.classList.add('lm-teo-pie');
    var p = document.getElementById('lm-pie');
    if (p && p.children.length) H.classList.add('lm-teo-con-pie');
  }

  /* --- b) rótulo de grado: nada que hacer aquí (3.ª vuelta: banda fija del núcleo) --- */
  /* el pie, abajo del todo también cuando la vista es corta (p. ej. modulación): se empuja con
     margin-top hasta el borde de la pantalla; si la página es más larga, va justo después del contenido */
  function pieAbajo() {
    var p = document.getElementById('lm-pie'); if (!p || !p.offsetHeight) return;
    var m = parseFloat(p.style.marginTop) || 0;
    var fin = p.getBoundingClientRect().bottom + (window.pageYOffset || 0) - m;   /* dónde acabaría sin empujarlo */
    var falta = Math.max(0, Math.floor((window.innerHeight || 0) - fin));
    if (Math.abs(falta - m) > 1) p.style.marginTop = falta ? falta + 'px' : '';
  }
  var pend = false;
  function repasar() {
    if (pend) return; pend = true;
    (window.requestAnimationFrame || setTimeout)(function () {
      pend = false;
      try { pieAbajo(); } catch (e) {}
    });
  }

  /* --- c) botones --- */
  var SEL_NUEVO = '.btn-nuevo, .btn-nuevos, .iconbtn[onclick^="nuevo"], .iconbtn[title^="Nuev"], .ex-modal-otro,' +
                  ' #aOtro, #bOtro, #btnOtro, #afAgain, #bfAgain';
  var RE_NUEVO = /^(nuev[oa]s?|otr[oa]s?|ver otro|reiniciar|empezar de nuevo)\b/i;
  var SEL_EJEMPLO = '.btn-ejemplo';
  var RE_EJEMPLO = /^(ejemplo|ejercicio) resuelto$/i;
  var SEL_CORREGIR = '.btn-correct';           /* «Corregir» sin ✓ en el texto (cadencias GP) → icono ✓ */
  var RE_CORREGIR = /^(corregir|comprobar)$/i;
  var SEL_BOTONES = SEL_NUEVO + ',' + SEL_EJEMPLO + ',' + SEL_CORREGIR;
  /* el texto que se ve en el botón (sin los signos ya cambiados por iconos) */
  function textoPropio(btn) {
    var t = '', w = document.createTreeWalker(btn, NodeFilter.SHOW_TEXT, null), x;
    while ((x = w.nextNode())) {
      var p = x.parentNode;
      if (p && p.closest && p.closest('.pl-emo,svg')) continue;
      t += x.nodeValue;
    }
    return t.replace(/\s+/g, ' ').trim();
  }
  function ponerIcono(btn, nombre) {
    if (!LP.ico || btn.querySelector(':scope > svg.lm-ico-' + nombre)) return;
    [].forEach.call(btn.querySelectorAll(':scope > svg'), function (s) { s.classList.add('lm-ico-orig'); });
    var t = document.createElement('span'); t.innerHTML = LP.ico(nombre);
    var n = t.firstChild; if (!n) return;
    n.classList.add('lm-ico-nuevo', 'lm-ico-' + nombre);
    btn.insertBefore(n, btn.firstChild);
  }
  /* 3.ª vuelta: el botón de «nuevo» es SOLO el dado. El texto original se envuelve en span.lm-txt-orig
     (oculto por el CSS) y queda en title/aria-label. */
  function soloDado(btn) {
    var orig = textoPropio(btn);
    if (orig) {
      if (!btn.getAttribute('aria-label')) btn.setAttribute('aria-label', orig);
      if (!btn.getAttribute('title')) btn.setAttribute('title', orig);
    }
    var env = btn.querySelector(':scope > .lm-txt-orig');
    [].slice.call(btn.childNodes).forEach(function (n) {
      if (n.nodeType === 3 && /\S/.test(n.nodeValue)) {
        if (!env) { env = document.createElement('span'); env.className = 'lm-txt-orig'; btn.insertBefore(env, n); }
        env.appendChild(n);
      }
    });
    if (!btn.classList.contains('lm-dado')) btn.classList.add('lm-dado');
  }
  function rotular(btn, etiqueta) {
    var orig = textoPropio(btn);
    if (!orig) return;
    if (!btn.getAttribute('aria-label')) btn.setAttribute('aria-label', orig);
    if (!btn.getAttribute('title')) btn.setAttribute('title', orig);
    var lab = btn.querySelector(':scope > .lm-txt-nuevo');
    var env = btn.querySelector(':scope > .lm-txt-orig');
    if (orig === etiqueta && !env) return;          /* ya dice «Nuevo» / «Ejemplo»: se deja tal cual */
    [].slice.call(btn.childNodes).forEach(function (n) {
      if (n.nodeType === 3 && /\S/.test(n.nodeValue)) {
        if (!env) { env = document.createElement('span'); env.className = 'lm-txt-orig'; btn.insertBefore(env, n); }
        env.appendChild(n);
      }
    });
    if (!lab) { lab = document.createElement('span'); lab.className = 'lm-txt-nuevo'; lab.setAttribute('aria-hidden', 'true'); btn.appendChild(lab); }
    if (lab.getAttribute('data-t') !== etiqueta) lab.setAttribute('data-t', etiqueta);
    if (!btn.classList.contains('lm-rotulado')) btn.classList.add('lm-rotulado');
  }
  function revisarBoton(el) {
    if (!el || el.nodeType !== 1 || !el.closest || el.closest('.apx-ov,#view-profesor,#profRoot')) return;
    var b = el.closest(SEL_BOTONES); if (!b) return;
    var t = textoPropio(b);
    if (b.matches(SEL_NUEVO) && (RE_NUEVO.test(t) || b.classList.contains('lm-dado'))) {
      if (!b.classList.contains('lm-nuevo')) b.classList.add('lm-nuevo');
      ponerIcono(b, 'dice'); soloDado(b);
    } else if (b.matches(SEL_EJEMPLO) && RE_EJEMPLO.test(t)) {
      rotular(b, 'Ejemplo');
    } else if (b.matches(SEL_CORREGIR) && RE_CORREGIR.test(t) && !b.querySelector('svg')) {
      ponerIcono(b, 'check');
    }
  }
  function botones(raiz) {
    if (!raiz || raiz.nodeType !== 1) return;
    var l = [].slice.call(raiz.querySelectorAll(SEL_BOTONES));
    if (raiz.closest) { var c = raiz.closest(SEL_BOTONES); if (c) l.push(c); }
    l.forEach(revisarBoton);
  }

  /* =====================================================================
     3. ARRANQUE + vigilancia (lo que la app pinte después)
     ===================================================================== */
  try { barrerIconos(document.body); } catch (e) {}
  try { hojas(); } catch (e) {}
  try { subarbol(document.body); } catch (e) {}
  try { prepararPie(); } catch (e) {}
  repasar();
  window.addEventListener('resize', repasar);
  window.addEventListener('load', repasar);
  document.addEventListener('click', function () { setTimeout(repasar, 80); setTimeout(repasar, 450); }, true);
  try {
    new MutationObserver(function (ms) {
      var cambio = false;
      for (var i = 0; i < ms.length; i++) {
        var m = ms[i];
        try {
          if (m.type === 'characterData') { convertir(m.target); revisarBoton(m.target.parentNode); continue; }
          if (m.type === 'attributes') {
            elemento(m.target);
            /* una vista que se enseña o se oculta (hijos de body o de .wrap) → recolocar el pie */
            var pa = m.target.parentNode;
            if (pa === document.body || (pa && pa.classList && pa.classList.contains('wrap'))) cambio = true;
            continue;
          }
          cambio = true;   /* contenido nuevo → recolocar el pie */
          for (var j = 0; j < m.addedNodes.length; j++) {
            var nd = m.addedNodes[j];
            barrerIconos(nd);
            subarbol(nd);
          }
        } catch (e) {}
      }
      if (cambio) repasar();
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: GP ? ['style', 'fill', 'stroke'] : ['style'] });
  } catch (e) {}
  /* hojas añadidas en <head> más tarde (algunas vistas inyectan su <style>) */
  try { new MutationObserver(function () { hojas(); }).observe(document.head, { childList: true }); } catch (e) {}
})();
