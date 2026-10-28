/* =====================================================================
   LM at home · PIEL · COMPAT94 (28-oct-2026, Iago)
   «Arregla todo para que funcione en esta pantalla… sin afectar a los alumnos, cuando ellos tengan su experiencia en sus casas»
   La pantalla del aula es un Linux con Google Chrome 94 que no se actualiza. Ese Chrome no entiende varias cosas de CSS y JS
   que usan los portales (:has, color-mix, 100dvh, «mask» sin -webkit-, @container y las unidades cqw/cqh, roundRect…) y
   en el aula se veían mal algunas cosas (el teclado de Blues, las tarjetas del portal, la isla de la escaleta…) o se
   paraban (Wagner en Atonalidad).
   · Este fichero SOLO se carga en un Chrome/Chromium antiguo al que le falte algo: lo decide la línea «COMPAT94» del
     principio de piel/lm-piel.js y de piel/latido.js. En un navegador al día no se descarga ni se ejecuta (los alumnos con
     el móvil, la tablet o el ordenador actualizados no notan nada) y en Safari o Firefox tampoco.
   · No toca el código de las apps. Lee sus hojas de estilo y, DENTRO DE LA MISMA HOJA Y EN SU MISMO SITIO, añade la versión
     que Chrome 94 entiende de lo que había descartado:
       :has(…)          → una clase .lmH<n> que este fichero pone y quita solo en los elementos que «tienen» lo de dentro.
       color-mix(…)     → el color ya mezclado, calculado con las variables de cada elemento (atributo data-lm-m<n>).
       100dvh/svh/lvh   → 100vh.      mask-… → también -webkit-mask-….
       @container, cqw  → medidos con ResizeObserver (atributos data-lmcq / data-lmcqc y variables --lmcqw…).
     y en JS añade lo que falte (roundRect, structuredClone, findLast, toSorted…), solo si no existe.
   · Pruebas: «?compat94=forzar» lo activa en un navegador moderno (para comparar) y «?compat94=0» lo apaga en esa pestaña.
     window.LMCompat94 dice qué ha hecho (has, mix, cq, reglas, errores).
   · Para quitarlo del todo: borrar la línea «COMPAT94» de lm-piel.js y de latido.js (este fichero puede quedarse).
   ===================================================================== */
(function () {
  'use strict';
  if (window.LMCompat94) return;
  var Q = location.search || '';
  if (/[?&]compat94=0(&|$)/.test(Q)) return;
  var FORZAR = /[?&]compat94=forzar(&|$)/.test(Q);
  var D = document, H = D.documentElement;
  function sup(p, v) { try { return !!(window.CSS && CSS.supports(p, v)); } catch (e) { return false; } }
  function supSel(s) { try { return !!(window.CSS && CSS.supports('selector(' + s + ')')); } catch (e) { return false; } }
  var F = {
    has: FORZAR || !supSel(':has(a)'),
    mix: FORZAR || !sup('color', 'color-mix(in srgb, red 50%, blue)'),
    dvh: FORZAR || !sup('height', '1dvh'),
    mask: FORZAR || (!sup('mask-image', 'none') && sup('-webkit-mask-image', 'none')),
    cq: FORZAR || !sup('container-type', 'inline-size')
  };
  var C94 = window.LMCompat94 = { version: '2026-10-28', forzar: FORZAR, F: F, has: [], mix: [], cq: [], hojas: 0, reglas: 0, errores: [], _PARES: [] };
  function fallo(donde, e) { if (C94.errores.length < 40) C94.errores.push(donde + ': ' + ((e && e.message) || e)); }

  /* =========================== 1 · JS que falta =========================== */
  function def(o, k, v) { try { if (o && !(k in o)) Object.defineProperty(o, k, { value: v, writable: true, configurable: true }); } catch (e) {} }
  function redondeado(x, y, w, h, r) {
    x = +x; y = +y; w = +w; h = +h;
    if (!isFinite(x + y + w + h)) return;
    if (r == null) r = 0;
    var L = (typeof r === 'object' && r.length != null) ? Array.prototype.slice.call(r) : [r];
    if (!L.length || L.length > 4) throw new RangeError('roundRect: de 1 a 4 radios');
    function v(t) { return typeof t === 'number' ? { x: t, y: t } : { x: +((t && t.x) || 0), y: +((t && t.y) || 0) }; }
    var a, b, c, d;
    if (L.length === 1) { a = b = c = d = v(L[0]); }
    else if (L.length === 2) { a = c = v(L[0]); b = d = v(L[1]); }
    else if (L.length === 3) { a = v(L[0]); b = d = v(L[1]); c = v(L[2]); }
    else { a = v(L[0]); b = v(L[1]); c = v(L[2]); d = v(L[3]); }
    var t;
    if (w < 0) { x += w; w = -w; t = a; a = b; b = t; t = d; d = c; c = t; }
    if (h < 0) { y += h; h = -h; t = a; a = d; d = t; t = b; b = c; c = t; }
    var f = Math.min(1, w / (a.x + b.x || 1), w / (d.x + c.x || 1), h / (a.y + d.y || 1), h / (b.y + c.y || 1));
    if (f < 1) [a, b, c, d].forEach(function (k) { k.x *= f; k.y *= f; });
    var P = Math.PI;
    this.moveTo(x + a.x, y);
    this.lineTo(x + w - b.x, y);
    if (b.x || b.y) this.ellipse(x + w - b.x, y + b.y, b.x, b.y, 0, -P / 2, 0);
    this.lineTo(x + w, y + h - c.y);
    if (c.x || c.y) this.ellipse(x + w - c.x, y + h - c.y, c.x, c.y, 0, 0, P / 2);
    this.lineTo(x + d.x, y + h);
    if (d.x || d.y) this.ellipse(x + d.x, y + h - d.y, d.x, d.y, 0, P / 2, P);
    this.lineTo(x, y + a.y);
    if (a.x || a.y) this.ellipse(x + a.x, y + a.y, a.x, a.y, 0, P, P * 1.5);
    this.closePath();
    this.moveTo(x, y);
  }
  try {
    [window.CanvasRenderingContext2D, window.Path2D, window.OffscreenCanvasRenderingContext2D].forEach(function (K) { if (K) def(K.prototype, 'roundRect', redondeado); });
    if (window.CanvasRenderingContext2D) def(CanvasRenderingContext2D.prototype, 'reset', function () { var c = this.canvas; if (c) c.width = c.width; });
    var AP = Array.prototype, sl = AP.slice;
    var ultimo = function (f, t) { for (var i = this.length - 1; i >= 0; i--) if (f.call(t, this[i], i, this)) return this[i]; };
    var ultimoI = function (f, t) { for (var i = this.length - 1; i >= 0; i--) if (f.call(t, this[i], i, this)) return i; return -1; };
    var conIndice = function (i, v) { var a = sl.call(this), n = a.length; i = Math.trunc(+i) || 0; if (i < 0) i += n; if (i < 0 || i >= n) throw new RangeError('Invalid index'); a[i] = v; return a; };
    def(AP, 'findLast', ultimo); def(AP, 'findLastIndex', ultimoI);
    def(AP, 'toSorted', function (c) { return sl.call(this).sort(c); });
    def(AP, 'toReversed', function () { return sl.call(this).reverse(); });
    def(AP, 'toSpliced', function () { var a = sl.call(this); AP.splice.apply(a, arguments); return a; });
    def(AP, 'with', conIndice);
    if (window.Int8Array) {
      var TA = Object.getPrototypeOf(Int8Array.prototype);
      def(TA, 'findLast', ultimo); def(TA, 'findLastIndex', ultimoI);
      def(TA, 'toSorted', function (c) { return this.slice().sort(c); });
      def(TA, 'toReversed', function () { return this.slice().reverse(); });
      def(TA, 'with', function (i, v) { var a = this.slice(), n = a.length; i = Math.trunc(+i) || 0; if (i < 0) i += n; if (i < 0 || i >= n) throw new RangeError('Invalid index'); a[i] = v; return a; });
    }
    var agrupa = function (it, f, mapa) { var o = mapa ? new Map() : Object.create(null), i = 0; for (var x of it) { var k = f(x, i++); if (mapa) { if (!o.has(k)) o.set(k, []); o.get(k).push(x); } else (o[k] || (o[k] = [])).push(x); } return o; };
    def(Object, 'groupBy', function (it, f) { return agrupa(it, f, false); });
    def(Map, 'groupBy', function (it, f) { return agrupa(it, f, true); });
    def(Promise, 'withResolvers', function () { var r, j, p = new this(function (a, b) { r = a; j = b; }); return { promise: p, resolve: r, reject: j }; });
    def(String.prototype, 'isWellFormed', function () { return !/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(String(this)); });
    def(String.prototype, 'toWellFormed', function () { return String(this).replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|([^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g, function (m, p) { return p != null ? p + '\uFFFD' : '\uFFFD'; }); });
    var SP = Set.prototype;
    def(SP, 'union', function (o) { var s = new Set(this); for (var v of o.keys()) s.add(v); return s; });
    def(SP, 'intersection', function (o) { var s = new Set(); this.forEach(function (v) { if (o.has(v)) s.add(v); }); return s; });
    def(SP, 'difference', function (o) { var s = new Set(); this.forEach(function (v) { if (!o.has(v)) s.add(v); }); return s; });
    def(SP, 'symmetricDifference', function (o) { var s = new Set(this); for (var v of o.keys()) { if (this.has(v)) s.delete(v); else s.add(v); } return s; });
    def(SP, 'isSubsetOf', function (o) { var ok = true; this.forEach(function (v) { if (!o.has(v)) ok = false; }); return ok; });
    def(SP, 'isSupersetOf', function (o) { for (var v of o.keys()) if (!this.has(v)) return false; return true; });
    def(SP, 'isDisjointFrom', function (o) { var ok = true; this.forEach(function (v) { if (o.has(v)) ok = false; }); return ok; });
    if (window.AbortSignal && window.AbortController) {
      def(AbortSignal, 'timeout', function (ms) { var c = new AbortController(); setTimeout(function () { var e; try { e = new DOMException('signal timed out', 'TimeoutError'); } catch (x) { e = new Error('TimeoutError'); } c.abort(e); }, ms); return c.signal; });
      def(AbortSignal, 'any', function (lista) { var c = new AbortController(); lista = Array.from(lista); for (var i = 0; i < lista.length; i++) { if (lista[i].aborted) { c.abort(lista[i].reason); return c.signal; } } lista.forEach(function (s) { s.addEventListener('abort', function () { if (!c.signal.aborted) c.abort(s.reason); }); }); return c.signal; });
    }
    if (window.Element) def(Element.prototype, 'checkVisibility', function (o) {
      if (!this.isConnected) return false;
      var cs = getComputedStyle(this);
      if (cs.display === 'none' || !this.getClientRects().length) return false;
      if (o && (o.checkVisibilityCSS || o.visibilityProperty) && cs.visibility !== 'visible') return false;
      if (o && (o.checkOpacity || o.opacityProperty)) { for (var e = this; e && e.nodeType === 1; e = e.parentElement) if (getComputedStyle(e).opacity === '0') return false; }
      return true;
    });
    if (typeof window.structuredClone !== 'function') {
      window.structuredClone = function (valor) {
        var vistos = new Map();
        function c(v) {
          if (v === null || typeof v !== 'object') { if (typeof v === 'function' || typeof v === 'symbol') throw new DOMException('could not be cloned', 'DataCloneError'); return v; }
          if (vistos.has(v)) return vistos.get(v);
          var r, k;
          if (v instanceof Date) r = new Date(v.getTime());
          else if (v instanceof RegExp) r = new RegExp(v.source, v.flags);
          else if (v instanceof Map) { r = new Map(); vistos.set(v, r); v.forEach(function (x, y) { r.set(c(y), c(x)); }); return r; }
          else if (v instanceof Set) { r = new Set(); vistos.set(v, r); v.forEach(function (x) { r.add(c(x)); }); return r; }
          else if (v instanceof ArrayBuffer) r = v.slice(0);
          else if (ArrayBuffer.isView(v)) r = v instanceof DataView ? new DataView(v.buffer.slice(0), v.byteOffset, v.byteLength) : new v.constructor(v);
          else if ((window.Blob && v instanceof Blob) || (window.ImageData && v instanceof ImageData)) r = v;
          else if (v instanceof Error) { r = new v.constructor(v.message); if (v.stack) r.stack = v.stack; }
          else if (Array.isArray(v)) { r = new Array(v.length); vistos.set(v, r); for (k = 0; k < v.length; k++) if (k in v) r[k] = c(v[k]); return r; }
          else if (v instanceof Node || v instanceof Window || (typeof v.then === 'function' && v instanceof Promise)) throw new DOMException('could not be cloned', 'DataCloneError');
          else { r = {}; vistos.set(v, r); Object.keys(v).forEach(function (q) { r[q] = c(v[q]); }); return r; }
          vistos.set(v, r); return r;
        }
        return c(valor);
      };
    }
  } catch (e) { fallo('js', e); }

  /* Si al navegador no le falta nada de CSS (p. ej. solo faltaba roundRect), aquí se acaba. */
  if (!F.has && !F.mix && !F.dvh && !F.mask && !F.cq) return;

  /* =========================== 2 · lector de CSS (lo justo) =========================== */
  function finCadena(s, i) { var q = s.charAt(i), n = s.length; i++; while (i < n) { var c = s.charAt(i); if (c === '\\') i += 2; else if (c === q) return i + 1; else if (c === '\n') return i + 1; else i++; } return n; }
  function sinComentarios(s) {
    if (s.indexOf('/*') < 0) return s;
    var o = '', i = 0, n = s.length;
    while (i < n) { var c = s.charAt(i); if (c === '"' || c === "'") { var j = finCadena(s, i); o += s.slice(i, j); i = j; } else if (c === '/' && s.charAt(i + 1) === '*') { var e = s.indexOf('*/', i + 2); i = e < 0 ? n : e + 2; o += ' '; } else { o += c; i++; } }
    return o;
  }
  /* parte s por el carácter sep (a nivel 0: fuera de paréntesis, corchetes y comillas) */
  function parte(s, sep) {
    var out = [], ini = 0, dep = 0, i = 0, n = s.length;
    while (i < n) { var c = s.charAt(i); if (c === '"' || c === "'") { i = finCadena(s, i); continue; } if (c === '\\') { i += 2; continue; } if (c === '(' || c === '[') dep++; else if (c === ')' || c === ']') dep--; else if (c === sep && dep === 0) { out.push(s.slice(ini, i)); ini = i + 1; } i++; }
    out.push(s.slice(ini)); return out;
  }
  function cierra(s, i) { /* s.charAt(i) === '(' → índice del ')' que lo cierra */ var dep = 0, n = s.length; while (i < n) { var c = s.charAt(i); if (c === '"' || c === "'") { i = finCadena(s, i); continue; } if (c === '\\') { i += 2; continue; } if (c === '(') dep++; else if (c === ')') { dep--; if (!dep) return i; } i++; } return -1; }
  /* lista de piezas: {r:1, pre, body} reglas · {at:'media', pre, body|null} arrobas */
  function lee(s) {
    var out = [], i = 0, n = s.length;
    while (i < n) {
      var ini = i, dep = 0, c = '';
      while (i < n) {
        c = s.charAt(i);
        if (c === '/' && s.charAt(i + 1) === '*') { var e = s.indexOf('*/', i + 2); i = e < 0 ? n : e + 2; continue; }
        if (c === '"' || c === "'") { i = finCadena(s, i); continue; }
        if (c === '\\') { i += 2; continue; }
        if (c === '(' || c === '[') dep++; else if (c === ')' || c === ']') dep--;
        else if (dep <= 0 && (c === '{' || c === ';' || c === '}')) break;
        i++;
      }
      var pre = sinComentarios(s.slice(ini, i)).trim();
      if (i >= n) break;
      if (c === ';' || c === '}') { if (c === ';' && pre.charAt(0) === '@') out.push({ at: nombreAt(pre), pre: pre, body: null }); i++; continue; }
      var a = i + 1, d = 1; i++;
      while (i < n && d > 0) {
        c = s.charAt(i);
        if (c === '/' && s.charAt(i + 1) === '*') { var e2 = s.indexOf('*/', i + 2); i = e2 < 0 ? n : e2 + 2; continue; }
        if (c === '"' || c === "'") { i = finCadena(s, i); continue; }
        if (c === '\\') { i += 2; continue; }
        if (c === '{') d++; else if (c === '}') d--;
        i++;
      }
      var body = s.slice(a, d ? i : i - 1);
      if (!pre) continue;
      if (pre.charAt(0) === '@') out.push({ at: nombreAt(pre), pre: pre, body: body });
      else out.push({ r: 1, pre: pre, body: body });
    }
    return out;
  }
  function nombreAt(pre) { var m = /^@([-\w]+)/.exec(pre); return m ? m[1].toLowerCase() : ''; }
  function declaraciones(body) {
    var out = [];
    parte(sinComentarios(body), ';').forEach(function (t) {
      var k = t.indexOf(':'); if (k < 1) return;
      var p = t.slice(0, k).trim(), v = t.slice(k + 1).trim(), imp = false;
      if (!p || /[{}]/.test(p)) return;
      var m = /!\s*important\s*$/i.exec(v); if (m) { imp = true; v = v.slice(0, m.index).trim(); }
      out.push({ p: p.charAt(0) === '-' && p.charAt(1) === '-' ? p : p.toLowerCase(), v: v, imp: imp });
    });
    return out;
  }

  /* =========================== 3 · :has() → clase .lmH<n> =========================== */
  var HAS = {}, LH = [];            /* clave → comprobación; lista */
  var DIN = /^(hover|active|focus|focus-visible|focus-within|visited|target|target-within|before|after|first-line|first-letter|placeholder|selection|marker|backdrop|file-selector-button|placeholder-shown|-webkit-[\w-]+|-moz-[\w-]+)$/i;
  /* parte un selector complejo en compuestos y combinadores */
  function trozos(sel) {
    var out = [], buf = '', i = 0, n = sel.length, dep = 0;
    while (i < n) {
      var c = sel.charAt(i);
      if (c === '"' || c === "'") { var j = finCadena(sel, i); buf += sel.slice(i, j); i = j; continue; }
      if (c === '\\') { buf += sel.substr(i, 2); i += 2; continue; }
      if (c === '(' || c === '[') dep++; else if (c === ')' || c === ']') dep--;
      if (dep === 0 && (/\s/.test(c) || c === '>' || c === '+' || c === '~')) {
        var comb = ' ';
        while (i < n && (/\s/.test(sel.charAt(i)) || '>+~'.indexOf(sel.charAt(i)) >= 0)) { if (sel.charAt(i) !== ' ' && !/\s/.test(sel.charAt(i))) comb = sel.charAt(i); i++; }
        if (buf) { out.push({ c: buf }); buf = ''; }
        if (out.length || comb !== ' ') out.push({ k: comb });
        continue;
      }
      buf += c; i++;
    }
    if (buf) out.push({ c: buf });
    return out;
  }
  function junta(t) { return t.map(function (x) { return x.c != null ? x.c : (x.k === ' ' ? ' ' : ' ' + x.k + ' '); }).join('').trim(); }
  /* pseudo-clases a nivel 0 de un compuesto: [{a, b, nombre, arg|null}] */
  function pseudos(c) {
    var out = [], i = 0, n = c.length, dep = 0;
    while (i < n) {
      var ch = c.charAt(i);
      if (ch === '"' || ch === "'") { i = finCadena(c, i); continue; }
      if (ch === '\\') { i += 2; continue; }
      if (ch === '[') { dep++; i++; continue; } if (ch === ']') { dep--; i++; continue; }
      if (ch === ':' && dep === 0) {
        var a = i, dos = c.charAt(i + 1) === ':'; i += dos ? 2 : 1;
        var m = /^-?[_a-zA-Z][-\w]*/.exec(c.slice(i)); if (!m) continue;
        i += m[0].length; var arg = null;
        if (c.charAt(i) === '(') { var j = cierra(c, i); if (j < 0) return null; arg = c.slice(i + 1, j); i = j + 1; }
        out.push({ a: a, b: i, nombre: m[0].toLowerCase(), arg: arg, elem: dos });
        continue;
      }
      i++;
    }
    return out;
  }
  /* compuesto sin lo dinámico (hover, ::before…) ni los :has → para querySelectorAll (abarca de más, nunca de menos) */
  function ancla(c) {
    var ps = pseudos(c); if (!ps) return null;
    var o = '', k = 0;
    ps.forEach(function (p) {
      var quita = p.elem || DIN.test(p.nombre) || p.nombre === 'has' || ((p.nombre === 'not' || p.nombre === 'is' || p.nombre === 'where') && p.arg != null && (/:has\(/i.test(p.arg) || /:(hover|active|focus|visited|target)/i.test(p.arg)));
      if (quita) { o += c.slice(k, p.a); k = p.b; }
    });
    o = (o + c.slice(k)).trim();
    return o || '*';
  }
  function especificidad(sel) {   /* aproximada: [ids, clases/atributos/pseudoclases, tipos] del más fuerte de la lista */
    var mejor = [0, 0, 0];
    parte(sel, ',').forEach(function (s) {
      var r = [0, 0, 0];
      trozos(s.trim().replace(/^[>+~]\s*/, '')).forEach(function (t) {
        if (t.c == null) return;
        var c = t.c, ps = pseudos(c) || [], resto = '', k = 0;
        ps.forEach(function (p) {
          resto += c.slice(k, p.a); k = p.b;
          if (p.nombre === 'where') return;
          if ((p.nombre === 'not' || p.nombre === 'is' || p.nombre === 'has' || p.nombre === 'matches') && p.arg != null) { var e = especificidad(p.arg); r[0] += e[0]; r[1] += e[1]; r[2] += e[2]; return; }
          if (p.elem || /^(before|after|first-line|first-letter)$/.test(p.nombre)) r[2]++; else r[1]++;
        });
        resto += c.slice(k);
        resto = resto.replace(/\[[^\]]*\]/g, function () { r[1]++; return ''; });
        resto.replace(/#[-\w\\]+/g, function () { r[0]++; return ''; }).replace(/\.[-\w\\]+/g, function () { r[1]++; return ''; }).replace(/^[a-zA-Z][-\w]*/, function () { r[2]++; return ''; });
      });
      if (r[0] > mejor[0] || (r[0] === mejor[0] && (r[1] > mejor[1] || (r[1] === mejor[1] && r[2] > mejor[2])))) mejor = r;
    });
    return mejor;
  }
  function relleno(cls, e) { var o = ''; for (var i = 0; i < e[0]; i++) o += ':not(#lm-c94-nadie)'; for (var j = 1; j < e[1]; j++) o += '.' + cls; for (var k = 0; k < e[2]; k++) o += ':not(lmc94nadie)'; return o; }
  function registraHas(anc, arg) {
    var args = parte(arg, ',').map(function (x) { return x.trim(); }).filter(Boolean);
    if (!args.length || args.some(function (x) { return /:has\(/i.test(x); })) return null;
    var clave = anc + '|' + args.join(',');
    if (HAS[clave]) return HAS[clave];
    try { D.querySelector(anc); var fr = D.createDocumentFragment(); args.forEach(function (x) { if (/^[+~]/.test(x)) fr.querySelector('[data-lm-c94-ancla] ' + x); else fr.querySelector(':scope ' + x); }); }
    catch (e) { fallo(':has ' + clave, e); return null; }
    var o = { n: LH.length + 1, cls: 'lmH' + (LH.length + 1), ancla: anc, args: args, esp: especificidad(arg) };
    o.attrs = []; args.join(' ').replace(/\[\s*([-\w]+)/g, function (m, a) { a = a.toLowerCase(); if (o.attrs.indexOf(a) < 0) o.attrs.push(a); return m; });
    var t = args.join(' ');
    o.hover = /:hover/i.test(t); o.texto = /:empty|:blank/i.test(t);
    HAS[clave] = o; LH.push(o); C94.has.push(anc + ':has(' + args.join(', ') + ')');
    necesitaObservar();
    return o;
  }
  /* c = compuesto; anc = selector para encontrar los elementos donde va la clase (lo de antes + este compuesto, sin lo dinámico) */
  function convCompuesto(c, anc) {
    var ps = pseudos(c); if (!ps) return null;
    if (!ps.some(function (p) { return (p.arg != null && /:has\(/i.test(p.arg)) || p.nombre === 'has'; })) return c;
    var o = '', k = 0, ok = true;
    ps.forEach(function (p) {
      if (!ok) return;
      if (p.nombre === 'has' && !p.elem) {
        var h = registraHas(anc, p.arg); if (!h) { ok = false; return; }
        o += c.slice(k, p.a) + '.' + h.cls + relleno(h.cls, h.esp); k = p.b; return;
      }
      if (p.nombre === 'not' && p.arg != null && /:has\(/i.test(p.arg)) {
        var inn = p.arg.trim(), m = /^:has\(/i.exec(inn);
        if (!m || cierra(inn, 4) !== inn.length - 1) { ok = false; return; }
        var h2 = registraHas(anc, inn.slice(5, -1)); if (!h2) { ok = false; return; }
        var e = h2.esp, extra = '';
        for (var i = 1; i < e[1]; i++) extra += '.' + h2.cls;
        o += c.slice(k, p.a) + ':not(.' + h2.cls + extra + ')' + (e[0] ? relleno(h2.cls, [e[0], 0, 0]).replace(/\.lmH\d+/g, '') : '') + (e[2] ? relleno(h2.cls, [0, 0, e[2]]) : ''); k = p.b; return;
      }
      if (p.arg != null && /:has\(/i.test(p.arg)) ok = false;   /* :is(:has()), :where(:has())… → se deja como está */
    });
    if (!ok) return null;
    return o + c.slice(k);
  }
  function convSel(sel) {
    if (!/:has\(/i.test(sel)) return sel;
    var lista = parte(sel, ','), out = [];
    for (var i = 0; i < lista.length; i++) {
      var t = trozos(lista[i].trim()), pref = [];
      for (var j = 0; j < t.length; j++) {
        if (t[j].c == null) { pref.push(t[j]); continue; }
        var a = ancla(t[j].c); if (a == null) return null;
        var r = convCompuesto(t[j].c, junta(pref.concat([{ c: a }])));
        if (r == null) return null;
        t[j].c = r;
        var a2 = ancla(r); pref.push({ c: a2 == null ? a : a2 });
      }
      out.push(junta(t));
    }
    var res = out.join(', ');
    if (C94._PARES.length < 400) C94._PARES.push([sel, res]);
    return res;
  }
  /* selector para querySelectorAll (color-mix, contenedores): sin lo dinámico */
  function consulta(sel) {
    var lista = parte(sel, ','), out = [];
    for (var i = 0; i < lista.length; i++) {
      var t = trozos(lista[i].trim());
      for (var j = 0; j < t.length; j++) if (t[j].c != null) { var a = ancla(t[j].c); if (a == null) return null; t[j].c = a; }
      var s = junta(t); if (s && out.indexOf(s) < 0) out.push(s);
    }
    var q = out.join(', ');
    try { D.querySelector(q); return q; } catch (e) { return null; }
  }

  /* =========================== 4 · color-mix() =========================== */
  var lienzo = null;
  function rgba(str) {
    str = String(str == null ? '' : str).trim(); if (!str) return null;
    if (/^transparent$/i.test(str)) return [0, 0, 0, 0];
    if (!lienzo) { try { lienzo = D.createElement('canvas').getContext('2d'); } catch (e) { return null; } }
    lienzo.fillStyle = '#010203'; lienzo.fillStyle = str; var v1 = lienzo.fillStyle;
    lienzo.fillStyle = '#030201'; lienzo.fillStyle = str; var v2 = lienzo.fillStyle;
    if (v1 !== v2) return null;
    var m = /^#([0-9a-f]{6})$/i.exec(v1);
    if (m) { var n = parseInt(m[1], 16); return [n >> 16 & 255, n >> 8 & 255, n & 255, 1]; }
    m = /^rgba?\(([^)]+)\)$/i.exec(v1);
    if (m) { var p = m[1].split(','); return [+p[0], +p[1], +p[2], p[3] == null ? 1 : +p[3]]; }
    return null;
  }
  function cadenaRGBA(c) { var r = function (x) { return Math.round(Math.max(0, Math.min(255, x))); }; return 'rgba(' + r(c[0]) + ', ' + r(c[1]) + ', ' + r(c[2]) + ', ' + (+Math.max(0, Math.min(1, c[3])).toFixed(4)) + ')'; }
  /* sustituye var(--x, …) y currentColor; local = variables de la misma regla; cs = estilo calculado del elemento */
  function sustituye(s, cs, local, prof) {
    if ((prof || 0) > 8) return null;
    var o = '', i = 0, m;
    while ((m = /var\(|currentcolor/ig.exec(s.slice(i)))) {
      var a = i + m.index;
      o += s.slice(i, a);
      if (/^currentcolor$/i.test(m[0])) { var cc = cs ? cs.color : ''; if (!cc) return null; o += cc; i = a + m[0].length; continue; }
      var j = cierra(s, a + 3); if (j < 0) return null;
      var dentro = s.slice(a + 4, j), coma = parte(dentro, ','), nom = coma[0].trim(), fb = coma.length > 1 ? coma.slice(1).join(',').trim() : null;
      var val = local && local[nom] != null ? local[nom] : (cs ? cs.getPropertyValue(nom).trim() : '');
      if (val && /var\(|currentcolor/i.test(val)) val = sustituye(val, cs, local, (prof || 0) + 1);
      if (!val && fb != null) val = sustituye(fb, cs, local, (prof || 0) + 1);
      if (!val) return null;
      o += val; i = j + 1;
    }
    return o + s.slice(i);
  }
  /* «color-mix(in srgb, A p%, B q%)» (sin variables) → [r,g,b,a]; otros espacios se mezclan en sRGB (casi igual) */
  function mezcla(txt) {
    var dentro = txt.slice(txt.indexOf('(') + 1, txt.lastIndexOf(')')), ps = parte(dentro, ',');
    if (ps.length !== 3 || !/^\s*in\s/i.test(ps[0])) return null;
    function parada(t) {
      t = t.trim(); var p = null, m = /^(-?[\d.]+)%\s+/.exec(t);
      if (m) { p = +m[1] / 100; t = t.slice(m[0].length); } else { m = /\s+(-?[\d.]+)%$/.exec(t); if (m) { p = +m[1] / 100; t = t.slice(0, m.index); } }
      t = t.trim();
      var c = /^color-mix\(/i.test(t) ? mezcla(t) : rgba(t);
      return c ? { c: c, p: p } : null;
    }
    var A = parada(ps[1]), B = parada(ps[2]); if (!A || !B) return null;
    var p1 = A.p, p2 = B.p;
    if (p1 == null && p2 == null) { p1 = p2 = 0.5; } else if (p1 == null) p1 = 1 - p2; else if (p2 == null) p2 = 1 - p1;
    if (p1 < 0 || p2 < 0) return null;
    var suma = p1 + p2; if (suma <= 0) return null;
    var mult = suma < 1 ? suma : 1; p1 /= suma; p2 /= suma;
    var a1 = A.c[3], a2 = B.c[3], al = a1 * p1 + a2 * p2, r = [0, 0, 0];
    for (var k = 0; k < 3; k++) r[k] = al > 0 ? (A.c[k] * a1 * p1 + B.c[k] * a2 * p2) / al : 0;
    return [r[0], r[1], r[2], al * mult];
  }
  function trozosMix(v) {   /* posiciones de los color-mix( de primer nivel */
    var out = [], i = 0, m;
    while ((m = /color-mix\(/ig.exec(v.slice(i)))) { var a = i + m.index, j = cierra(v, a + 9); if (j < 0) break; out.push([a, j + 1]); i = j + 1; }
    return out;
  }
  function calcula(expr, cs, local) { var s = sustituye(expr, cs, local, 0); if (s == null) return null; var c = mezcla(s); return c ? cadenaRGBA(c) : null; }
  var MIX = {}, LM = [];
  C94._LH = LH; C94._LM = LM;
  var raizCS = null;
  function csRaiz() { if (!raizCS) raizCS = getComputedStyle(H); return raizCS; }
  function arreglaMix(v, ctx) {
    var ts = trozosMix(v); if (!ts.length) return null;
    var o = '', k = 0, ok = true;
    ts.forEach(function (t) {
      if (!ok) return;
      var expr = v.slice(t[0], t[1]), fijo = calcula(expr, csRaiz(), ctx.local);
      if (/var\(|currentcolor/i.test(expr) && ctx.q) {
        var e = MIX[expr];
        if (!e) { e = MIX[expr] = { n: LM.length + 1, expr: expr, sels: [], tok: {}, nt: 0 }; LM.push(e); C94.mix.push(expr); }
        if (e.sels.indexOf(ctx.q) < 0) { e.sels.push(ctx.q); e.q = null; }
        o += v.slice(k, t[0]) + 'var(--lmM' + e.n + (fijo ? ', ' + fijo : '') + ')';
      } else if (fijo) o += v.slice(k, t[0]) + fijo;
      else ok = false;
      k = t[1];
    });
    return ok ? o + v.slice(k) : null;
  }

  /* =========================== 5 · @container y unidades cq =========================== */
  var CONT = [], CQ = [], hayCQ = false;
  C94._CONT = CONT; C94._CQ = CQ;
  function unidadesCQ(v) {
    return v.replace(/(^|[^\w.-])(-?(?:\d+\.?\d*|\.\d+))(cqw|cqh|cqi|cqb|cqmin|cqmax)\b/gi, function (m, a, n, u) {
      u = u.toLowerCase(); var vr = { cqw: '--lmcqw, 1vw', cqi: '--lmcqw, 1vw', cqh: '--lmcqh, 1vh', cqb: '--lmcqh, 1vh', cqmin: '--lmcqmin, 1vmin', cqmax: '--lmcqmax, 1vmax' }[u];
      hayCQ = true; return a + 'calc(' + n + ' * var(' + vr + '))';
    });
  }
  function registraContenedor(q, tipo, nombre) {
    if (!q) return;
    for (var i = 0; i < CONT.length; i++) if (CONT[i].q === q) { if (tipo) CONT[i].tipo = tipo; if (nombre) CONT[i].nombres = nombre.split(/\s+/); return; }
    CONT.push({ q: q, tipo: tipo || 'inline-size', nombres: nombre ? nombre.split(/\s+/) : [] }); hayCQ = true;
  }
  function registraConsulta(pre) {
    var r = pre.replace(/^@container\s*/i, '').trim(), m = /^([-\w]+)\s+(?=\(|not\b)/.exec(r), nombre = '';
    if (m && !/^(not|and|or)$/i.test(m[1])) { nombre = m[1]; r = r.slice(m[0].length); }
    if (/style\(|scroll-state\(/i.test(r)) return null;
    for (var i = 0; i < CQ.length; i++) if (CQ[i].cond === r && CQ[i].nombre === nombre) return CQ[i];
    var o = { k: 'q' + (CQ.length + 1), nombre: nombre, cond: r }; CQ.push(o); C94.cq.push(pre); hayCQ = true;
    return o;
  }
  function longitud(v, fs) {
    var m = /^(-?[\d.]+)(px|em|rem|vw|vh|ch)?$/i.exec(v.trim()); if (!m) return NaN;
    var n = +m[1], u = (m[2] || 'px').toLowerCase();
    if (u === 'em' || u === 'ch') return n * fs * (u === 'ch' ? 0.5 : 1);
    if (u === 'rem') return n * (parseFloat(csRaiz().fontSize) || 16);
    if (u === 'vw') return n * innerWidth / 100; if (u === 'vh') return n * innerHeight / 100;
    return n;
  }
  function condicion(cond, w, h, fs) {
    var s = cond, ant;
    do { ant = s; s = s.replace(/\(([^()]*)\)/g, function (m, f) { return ' ' + (rasgo(f, w, h, fs) ? 'T' : 'F') + ' '; }); } while (s !== ant && /\(/.test(s));
    return logica(s);
  }
  function logica(s) {
    var t = s.trim().split(/\s+/).filter(Boolean), r = null, op = null, neg = false;
    for (var i = 0; i < t.length; i++) {
      var x = t[i].toLowerCase();
      if (x === 'not') { neg = !neg; continue; }
      if (x === 'and' || x === 'or') { op = x; continue; }
      if (x !== 't' && x !== 'f') return false;
      var b = (x === 't') !== neg; neg = false;
      r = r === null ? b : (op === 'or' ? (r || b) : (r && b));
    }
    return !!r;
  }
  function rasgo(f, w, h, fs) {
    f = f.trim();
    if (/^[TF](\s|$)|^not\s/i.test(f) || /\s(and|or)\s/i.test(f)) return logica(f);
    var val = function (n) { n = n.toLowerCase().replace(/^(min-|max-)/, ''); return n === 'width' || n === 'inline-size' ? w : (n === 'height' || n === 'block-size' ? h : (n === 'aspect-ratio' ? w / (h || 1) : NaN)); };
    var m = /^(min-|max-)?([-a-z]+)\s*:\s*(.+)$/i.exec(f);
    if (m) {
      var nom = m[2].toLowerCase();
      if (nom === 'orientation') return (/portrait/i.test(m[3])) === (h >= w);
      var x = val(nom), y = nom === 'aspect-ratio' ? razon(m[3]) : longitud(m[3], fs);
      if (isNaN(x) || isNaN(y)) return false;
      return m[1] ? (m[1].toLowerCase() === 'min-' ? x >= y : x <= y) : Math.abs(x - y) < 0.5;
    }
    var p = f.split(/\s*(<=|>=|<|>|=)\s*/);
    if (p.length >= 3) {
      var ok = true;
      for (var i = 0; i + 2 < p.length; i += 2) {
        var A = p[i], op = p[i + 1], B = p[i + 2];
        var a = isNaN(val(A)) ? longitud(A, fs) : val(A), b = isNaN(val(B)) ? longitud(B, fs) : val(B);
        if (isNaN(a) || isNaN(b)) return false;
        ok = ok && (op === '<' ? a < b : op === '>' ? a > b : op === '<=' ? a <= b : op === '>=' ? a >= b : Math.abs(a - b) < 0.5);
      }
      return ok;
    }
    return false;
  }
  function razon(v) { var m = /^([\d.]+)\s*(?:\/\s*([\d.]+))?$/.exec(v.trim()); return m ? +m[1] / (+(m[2] || 1)) : NaN; }

  /* =========================== 6 · arreglar declaraciones =========================== */
  var MASK = /^mask(-image|-size|-position|-repeat|-origin|-clip|-composite|-mode|-type)?$/;
  var COMPOSITE = { add: 'source-over', subtract: 'source-out', intersect: 'source-in', exclude: 'xor' };
  /* devuelve [{p, v, imp}] con lo que hay que poner en lugar de d, o null si no hace falta nada */
  function arregla(d, ctx) {
    var v = d.v, p = d.p, cambia = false, out = [];
    if (F.mix && /color-mix\(/i.test(v)) { var m = arreglaMix(v, ctx); if (m != null) { v = m; cambia = true; } }
    if (F.dvh && /\d(dvh|svh|lvh|dvw|svw|lvw|dvi|svi|lvi|dvb|svb|lvb|dvmin|svmin|lvmin|dvmax|svmax|lvmax|vi|vb)\b/i.test(v)) {
      var v2 = v.replace(/(\d|\.)(?:d|s|l)?(vh|vw|vmin|vmax|vi|vb)\b/gi, function (m0, n, u) { u = u.toLowerCase(); return n + (u === 'vi' ? 'vw' : u === 'vb' ? 'vh' : u); });
      if (v2 !== v) { v = v2; cambia = true; }
    }
    if (F.cq && /\dcq(w|h|i|b|min|max)\b/i.test(v)) { var v3 = unidadesCQ(v); if (v3 !== v) { v = v3; cambia = true; } }
    if (F.cq && (p === 'container-type' || p === 'container' || p === 'container-name') && ctx.q) {
      if (p === 'container-type' && !/^normal$/i.test(v)) registraContenedor(ctx.q, v, '');
      else if (p === 'container-name') registraContenedor(ctx.q, '', v);
      else if (p === 'container') { var sp = v.split('/'); registraContenedor(ctx.q, (sp[1] || 'inline-size').trim(), sp[0].trim()); }
    }
    if (F.mask && MASK.test(p) && p !== 'mask-type' && p !== 'mask-mode' && !ctx.webkit['-webkit-' + p]) {
      var wv = p === 'mask-composite' ? v.split(',').map(function (x) { return COMPOSITE[x.trim().toLowerCase()] || x.trim(); }).join(', ') : v;
      out.push({ p: '-webkit-' + p, v: wv, imp: d.imp });
      cambia = true;
    }
    if (!cambia) return null;
    out.push({ p: p, v: v, imp: d.imp });
    return out;
  }
  function contexto(sel, ds, enKeyframes) {
    var local = {}, webkit = {};
    ds.forEach(function (d) { if (d.p.slice(0, 2) === '--') local[d.p] = d.v; if (d.p.slice(0, 8) === '-webkit-') webkit[d.p] = 1; });
    return { q: enKeyframes || !sel ? null : consulta(sel), local: local, webkit: webkit };
  }
  function textoDecl(ds, ctx) {
    var o = [];
    ds.forEach(function (d) { (arregla(d, ctx) || [d]).forEach(function (x) { o.push(x.p + ': ' + x.v + (x.imp ? ' !important' : '')); }); });
    return o.join('; ');
  }
  /* dentro de un @container: el elemento final del selector tiene que estar DENTRO de un contenedor que cumple la
     consulta → se le añade «:where([data-lmcq~="q1"] *)» (no cambia la especificidad), antes de ::before/::after */
  function conCondicion(sel, cond) {
    var t = trozos(sel), u = t.length - 1;
    if (u < 0 || t[u].c == null) return sel + cond;
    var c = t[u].c, ps = pseudos(c) || [], pe = null;
    ps.forEach(function (p) { if (pe == null && (p.elem || /^(before|after|first-line|first-letter|marker|placeholder|selection)$/.test(p.nombre))) pe = p.a; });
    t[u].c = pe == null ? c + cond : c.slice(0, pe) + cond + c.slice(pe);
    return junta(t);
  }
  /* texto de una pieza ya arreglada (para insertarla); prefijo = condición de @container (ver conCondicion) */
  function textoPieza(it, prefijo) {
    if (it.r) {
      var sel = F.has ? convSel(it.pre) : it.pre; if (sel == null) return [];
      if (prefijo) sel = parte(sel, ',').map(function (s) { return conCondicion(s.trim(), prefijo); }).join(', ');
      if (/[{}]/.test(it.body)) return [];   /* CSS anidado: no se toca */
      var ds = declaraciones(it.body);
      return [sel + ' { ' + textoDecl(ds, contexto(sel, ds)) + ' }'];
    }
    if (it.body == null) return [];
    if (it.at === 'media' || it.at === 'supports') {
      var dentro = []; lee(it.body).forEach(function (x) { dentro = dentro.concat(textoPieza(x, prefijo)); });
      return dentro.length ? [it.pre + ' { ' + dentro.join('\n') + ' }'] : [];
    }
    if (it.at === 'container' && F.cq) {
      var c = registraConsulta(it.pre); if (!c) return [];
      var pre = (prefijo || '') + ':where([data-lmcq~="' + c.k + '"] *)', out = [];
      lee(it.body).forEach(function (x) { out = out.concat(textoPieza(x, pre)); });
      return out;
    }
    return [];
  }

  /* =========================== 7 · hojas: se arreglan EN SU SITIO (CSSOM) =========================== */
  var CLASE_AT = { media: 'CSSMediaRule', supports: 'CSSSupportsRule', 'font-face': 'CSSFontFaceRule', import: 'CSSImportRule', keyframes: 'CSSKeyframesRule', '-webkit-keyframes': 'CSSKeyframesRule', page: 'CSSPageRule', namespace: 'CSSNamespaceRule', property: 'CSSPropertyRule', 'counter-style': 'CSSCounterStyleRule', container: 'CSSContainerRule', layer: 'CSSLayerBlockRule', 'font-feature-values': 'CSSFontFeatureValuesRule', 'font-palette-values': 'CSSFontPaletteValuesRule', scope: 'CSSScopeRule', 'starting-style': 'CSSStartingStyleRule', 'position-try': 'CSSPositionTryRule', 'view-transition': 'CSSViewTransitionRule' };
  var HAY = /:has\(|color-mix\(|\d(?:d|s|l)v(?:h|w|i|b|min|max)\b|\dv[ib]\b|(?:^|[^-\w])mask(?:-[a-z]+)?\s*:|@container|container(?:-type|-name)?\s*:|\dcq(?:w|h|i|b|min|max)\b/i;
  function tipoDe(r) { try { return r.constructor && r.constructor.name; } catch (e) { return ''; } }
  function selNorm(s) { return String(s || '').toLowerCase().replace(/::/g, ':').replace(/["'\s]/g, '').replace(/\(odd\)/g, '(2n+1)').replace(/\(even\)/g, '(2n)'); }
  var CON_SELECTOR = supSel('a') && supSel('a > b');
  function selValido(pre) {   /* Chrome 94 tira la regla entera si UNA parte de la lista no la entiende */
    if (!CON_SELECTOR) return !/:has\(|:is\(|:where\(/i.test(pre);
    return parte(pre, ',').every(function (s) { return supSel(s.trim()); });
  }
  function seQueda(it) {   /* ¿este navegador guarda la pieza en su CSSOM? */
    if (it.r) { if (/[{}]/.test(it.body)) return null; return selValido(it.pre) ? 'CSSStyleRule' : ''; }
    if (it.at === 'charset') return '';
    var k = CLASE_AT[it.at]; if (!k) return '';
    if (it.at === 'layer' && it.body == null) k = 'CSSLayerStatementRule';
    return window[k] ? k : '';
  }
  function casa(it, r, k) {
    if (tipoDe(r) !== k) return false;
    if (it.r) return selNorm(r.selectorText) === selNorm(it.pre);
    if (k === 'CSSKeyframesRule') return (r.name || '') === (it.pre.replace(/^@[-\w]+\s*/, '').trim().replace(/^["']|["']$/g, ''));
    return true;
  }
  function necesita(it) {
    if (it.r) return HAY.test(it.pre) || HAY.test(it.body);
    return it.body != null && (HAY.test(it.pre) || HAY.test(it.body));
  }
  function inserta(lista, textos, j) {
    var n = 0;
    textos.forEach(function (t) { try { lista.insertRule(t, j + n); n++; C94.reglas++; } catch (e) { fallo('insertRule ' + t.slice(0, 80), e); } });
    return n;
  }
  /* recorre las piezas del texto y las reglas del CSSOM a la vez; arregla lo que el navegador tiró o dejó a medias */
  function arreglaLista(items, lista, prefijo) {
    var reglas = lista.cssRules, j = 0;
    for (var i = 0; i < items.length; i++) {
      var it = items[i], k = seQueda(it), r = reglas[j];
      if (k === null) { if (r && it.r && tipoDe(r) === 'CSSStyleRule' && selNorm(r.selectorText) === selNorm(it.pre)) j++; continue; }
      var hay = false;
      if (it.r && !k && r && casa(it, r, 'CSSStyleRule')) { k = 'CSSStyleRule'; hay = true; }   /* por si CSS.supports se equivoca */
      if (k && !hay) {
        if (r && casa(it, r, k)) hay = true;
        else for (var la = 1; la <= 8 && j + la < reglas.length; la++) if (casa(it, reglas[j + la], k)) { j += la; r = reglas[j]; hay = true; break; }
      }
      if (!hay) {   /* el navegador la tiró: se inserta la versión arreglada aquí mismo */
        if (necesita(it)) j += inserta(lista, textoPieza(it, prefijo), j);
        continue;
      }
      /* el navegador la guardó (en un Chrome moderno con ?compat94=forzar también) */
      if (it.r) {
        if (!necesita(it)) { j++; continue; }
        if (F.has && /:has\(/i.test(it.pre)) {   /* solo pasa con ?compat94=forzar: se cambia por la versión con clase */
          var tx = textoPieza(it, prefijo);
          if (tx.length) { try { lista.deleteRule(j); } catch (e) { j++; continue; } j += inserta(lista, tx, j); } else j++;
          continue;
        }
        arreglaRegla(r, it.pre, declaraciones(it.body));
        j++; continue;
      }
      if ((it.at === 'media' || it.at === 'supports') && necesita(it)) { arreglaLista(lee(it.body), r, prefijo); j++; continue; }
      if ((it.at === 'keyframes' || it.at === '-webkit-keyframes') && necesita(it)) { arreglaKeyframes(r, it.body); j++; continue; }
      if (it.at === 'container' && F.cq) {   /* solo con ?compat94=forzar */
        var tc = textoPieza(it, prefijo);
        if (tc.length) { try { lista.deleteRule(j); } catch (e) { j++; continue; } j += inserta(lista, tc, j); } else j++;
        continue;
      }
      j++;
    }
  }
  function familia(p) { return p.replace(/^-webkit-/, '').split('-')[0]; }
  function arreglaRegla(r, sel, ds) {
    var ctx = contexto(sel, ds), st = r.style, toca = {};
    for (var i = 0; i < ds.length; i++) {
      var d = ds[i], a = arregla(d, ctx);
      if (a) { a.forEach(function (x) { try { st.setProperty(x.p, x.v, x.imp ? 'important' : ''); } catch (e) {} }); toca[familia(d.p)] = 1; C94.reglas++; }
      else if (toca[familia(d.p)] && d.p.slice(0, 2) !== '--') { try { st.setProperty(d.p, d.v, d.imp ? 'important' : ''); } catch (e) {} }   /* mantiene el orden con los longhands que venían después */
    }
  }
  function arreglaKeyframes(r, body) {
    lee(body).forEach(function (it) {
      if (!it.r || !HAY.test(it.body)) return;
      var ds = declaraciones(it.body), ctx = contexto(null, ds, true), kf = null;
      try { kf = r.findRule(it.pre); } catch (e) {}
      if (!kf) { try { r.appendRule(it.pre + ' { ' + textoDecl(ds, ctx) + ' }'); C94.reglas++; } catch (e) { fallo('keyframes', e); } return; }
      ds.forEach(function (d) { var a = arregla(d, ctx); if (a) a.forEach(function (x) { try { kf.style.setProperty(x.p, x.v, x.imp ? 'important' : ''); } catch (e) {} }); });
    });
  }
  function absolutas(txt, base) {
    return txt.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, function (m, q, u) {
      if (/^(data:|blob:|#|[a-z][\w+.-]*:)/i.test(u.trim())) return m;
      try { return 'url("' + new URL(u.trim(), base).href + '")'; } catch (e) { return m; }
    }).replace(/@import\s+(['"])([^'"]+)\1/gi, function (m, q, u) { try { return '@import "' + new URL(u, base).href + '"'; } catch (e) { return m; } });
  }
  var HECHAS = new WeakSet(), TEXTO = new WeakMap(), COPIA = new WeakMap(), PIDIENDO = new WeakSet();
  function arreglaHoja(s, txt) {
    if (HECHAS.has(s)) return; HECHAS.add(s);
    if (!HAY.test(txt)) return;
    raizCS = null;
    try { arreglaLista(lee(txt), s, ''); C94.hojas++; } catch (e) { fallo('hoja ' + ((s.ownerNode && (s.ownerNode.href || s.ownerNode.id)) || ''), e); }
    programaRT();
  }
  function origenPermitido(href) { try { var u = new URL(href, location.href); return u.origin === location.origin || /(^|\.)lmathome\.es$|\.github\.io$|\.netlify\.app$|\.local$/.test(u.hostname); } catch (e) { return false; } }
  function hojas() {
    var ss = D.styleSheets;
    for (var i = 0; i < ss.length; i++) {
      var s = ss[i], nodo = s.ownerNode;
      if (!nodo || HECHAS.has(s)) continue;
      if (nodo.nodeName === 'STYLE') { if (nodo.id === 'lm-c94-rt') { HECHAS.add(s); continue; } arreglaHoja(s, nodo.textContent || ''); continue; }
      if (nodo.nodeName !== 'LINK') { HECHAS.add(s); continue; }
      if (TEXTO.has(nodo)) { arreglaHoja(s, TEXTO.get(nodo)); continue; }   /* la copia de una hoja de otro dominio */
      var legible = true; try { void s.cssRules; } catch (e) { legible = false; }
      if (!nodo.href || !origenPermitido(nodo.href) || /fonts\.googleapis/.test(nodo.href)) { HECHAS.add(s); continue; }
      if (PIDIENDO.has(s)) continue; PIDIENDO.add(s);
      pide(s, nodo, legible);
    }
  }
  function pide(s, nodo, legible) {
    var href = nodo.href;
    fetch(href, { mode: 'cors', credentials: 'omit', cache: 'force-cache' }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); }).then(function (txt) {
      if (nodo.sheet !== s) return;
      if (legible) { arreglaHoja(s, txt); return; }
      HECHAS.add(s);
      if (!HAY.test(txt) || COPIA.has(nodo)) return;
      /* hoja de otro dominio: su CSSOM no se puede tocar → copia idéntica (blob) justo detrás, y se arregla la copia */
      var t2 = absolutas(txt, href), l = D.createElement('link');
      for (var i = 0; i < nodo.attributes.length; i++) { var a = nodo.attributes[i]; if (!/^(href|id|onload|onerror|integrity|crossorigin)$/i.test(a.name)) l.setAttribute(a.name, a.value); }
      l.setAttribute('data-lm-c94-copia', href);
      l.href = URL.createObjectURL(new Blob([t2], { type: 'text/css' }));
      if (nodo.disabled) l.disabled = true;
      TEXTO.set(l, t2); COPIA.set(nodo, l);
      if (nodo.parentNode) nodo.parentNode.insertBefore(l, nodo.nextSibling);
    }).catch(function (e) { HECHAS.add(s); fallo('fetch ' + href, e); });
  }
  function quitaCopia(nodo) { var l = COPIA.get(nodo); if (l) { COPIA.delete(nodo); if (l.parentNode) l.parentNode.removeChild(l); } }

  /* =========================== 8 · lo que se mira en marcha =========================== */
  var RT = null, CUENTA = 0;
  function rtHoja() {
    if (RT && RT.isConnected) return RT;
    LM.forEach(function (m) { m.tok = {}; m.nt = 0; });   /* hoja nueva: los colores se vuelven a apuntar */
    RT = D.createElement('style'); RT.id = 'lm-c94-rt'; RT.setAttribute('data-lm-piel', 'c94');
    RT.textContent = '[data-lmcqc]>*{--lmcqw:var(--lmcqw0);--lmcqh:var(--lmcqh0);--lmcqmin:var(--lmcqmin0);--lmcqmax:var(--lmcqmax0)}';
    (D.head || H).appendChild(RT);
    return RT;
  }
  function anclaEn(el, arg) {
    if (/^[+~]/.test(arg)) {
      var p = el.parentNode; if (!p || !p.querySelector) return false;
      el.setAttribute('data-lm-c94-ancla', ''); var r = false;
      try { r = !!p.querySelector('[data-lm-c94-ancla] ' + arg); } catch (e) {}
      el.removeAttribute('data-lm-c94-ancla'); return r;
    }
    try { return !!el.querySelector(':scope ' + arg); } catch (e) { return false; }
  }
  function pasaHas() {
    for (var i = 0; i < LH.length; i++) {
      var h = LH[i], nodos;
      try { nodos = D.querySelectorAll(h.ancla); } catch (e) { continue; }
      var si = new Set();
      for (var j = 0; j < nodos.length; j++) { var el = nodos[j]; for (var k = 0; k < h.args.length; k++) if (anclaEn(el, h.args[k])) { si.add(el); break; } }
      var ya = D.getElementsByClassName(h.cls), quita = [];
      for (var q = 0; q < ya.length; q++) if (!si.has(ya[q])) quita.push(ya[q]);
      quita.forEach(function (e) { e.classList.remove(h.cls); });
      si.forEach(function (e) { if (!e.classList.contains(h.cls)) e.classList.add(h.cls); });
    }
  }
  function pasaMix() {
    if (!LM.length) return;
    var hoja = null, nuevas = [];
    for (var i = 0; i < LM.length; i++) {
      var m = LM[i];
      if (m.q == null) { m.q = m.sels.join(', '); try { D.querySelector(m.q); } catch (e) { m.q = ''; } }
      if (!m.q) continue;
      var els; try { els = D.querySelectorAll(m.q); } catch (e) { continue; }
      for (var j = 0; j < els.length; j++) {
        var el = els[j], v = calcula(m.expr, getComputedStyle(el), null), at = 'data-lm-m' + m.n;
        if (v == null) { if (el.hasAttribute(at)) el.removeAttribute(at); continue; }
        var t = m.tok[v];
        if (!t) { t = m.tok[v] = 't' + (++m.nt); nuevas.push('[' + at + '="' + t + '"]{--lmM' + m.n + ':' + v + '}'); }
        if (el.getAttribute(at) !== t) el.setAttribute(at, t);
      }
    }
    if (nuevas.length) { hoja = rtHoja().sheet; nuevas.forEach(function (r) { try { hoja.insertRule(r, hoja.cssRules.length); } catch (e) { fallo('mix rt', e); } }); }
  }
  var RO = null, VISTOS = new WeakSet(), PEND = new Map(), rafCQ = 0;
  function pasaCQ() {
    if (!CONT.length || !window.ResizeObserver) return;
    rtHoja();
    if (!RO) RO = new ResizeObserver(function (es) { es.forEach(function (e) { PEND.set(e.target, e.contentRect); }); if (!rafCQ) rafCQ = requestAnimationFrame(aplicaCQ); });
    CONT.forEach(function (c) {
      var els; try { els = D.querySelectorAll(c.q); } catch (e) { return; }
      for (var i = 0; i < els.length; i++) { var el = els[i]; if (!VISTOS.has(el)) { VISTOS.add(el); el.setAttribute('data-lmcqc', ''); RO.observe(el); } }
    });
  }
  function aplicaCQ() {
    rafCQ = 0;
    PEND.forEach(function (rc, el) {
      if (!el.isConnected) return;
      var w = rc.width, h = rc.height, nombres = [], tipo = 'inline-size';
      CONT.forEach(function (c) { try { if (el.matches(c.q)) { nombres = nombres.concat(c.nombres); if (c.tipo) tipo = c.tipo; } } catch (e) {} });
      var st = el.style;
      st.setProperty('--lmcqw0', (w / 100) + 'px');
      st.setProperty('--lmcqh0', /size/.test(tipo) && !/inline/.test(tipo) ? (h / 100) + 'px' : '1vh');
      st.setProperty('--lmcqmin0', (Math.min(w, h) / 100) + 'px'); st.setProperty('--lmcqmax0', (Math.max(w, h) / 100) + 'px');
      var fs = parseFloat(getComputedStyle(el).fontSize) || 16, toks = [];
      CQ.forEach(function (q) { if (q.nombre && nombres.indexOf(q.nombre) < 0) return; if (condicion(q.cond, w, h, fs)) toks.push(q.k); });
      var t = toks.join(' ');
      if ((el.getAttribute('data-lmcq') || '') !== t) { if (t) el.setAttribute('data-lmcq', t); else el.removeAttribute('data-lmcq'); }
    });
    PEND.clear();
  }
  var tRT = 0, ultimoRT = 0;
  function programaRT() {
    if (tRT) return;
    var espera = Math.max(16, 90 - (Date.now() - ultimoRT));
    tRT = setTimeout(function () { tRT = 0; ultimoRT = Date.now(); enMarcha(); }, espera);
  }
  function enMarcha() {
    try { pasaHas(); } catch (e) { fallo('has', e); }
    try { pasaMix(); } catch (e) { fallo('mix', e); }
    try { pasaCQ(); } catch (e) { fallo('cq', e); }
    if (OBS) OBS.takeRecords();   /* lo que acabamos de cambiar nosotros no cuenta */
    CUENTA++;
  }
  var tH = 0;
  function programaHojas() { if (tH) return; tH = setTimeout(function () { tH = 0; try { hojas(); } catch (e) { fallo('hojas', e); } }, 0); }

  var OBS = null, FILTRO = '';
  function necesitaObservar() {
    if (!OBS) return;
    var at = ['class', 'id', 'hidden', 'open', 'checked', 'selected', 'disabled', 'href', 'media', 'rel', 'value', 'type', 'data-lmcq'], texto = false;
    LH.forEach(function (h) { h.attrs.forEach(function (a) { if (at.indexOf(a) < 0) at.push(a); }); if (h.texto) texto = true; });
    var f = at.join(',') + (texto ? '+t' : '');
    if (f === FILTRO) return; FILTRO = f;
    OBS.observe(H, { childList: true, subtree: true, attributes: true, attributeFilter: at, characterData: true });
  }
  function alCambio(recs) {
    var hj = false, rt = false;
    for (var i = 0; i < recs.length; i++) {
      var r = recs[i], t = r.target;
      if (r.type === 'childList') {
        if (t.nodeName === 'STYLE') { hj = true; continue; }
        rt = true;
        for (var a = 0; a < r.addedNodes.length; a++) { var n = r.addedNodes[a]; if (n.nodeName === 'STYLE' || n.nodeName === 'LINK' || (n.querySelector && n.querySelector('style,link'))) hj = true; }
        for (var b = 0; b < r.removedNodes.length; b++) { var x = r.removedNodes[b]; if (x.nodeName === 'LINK') quitaCopia(x); }
      } else if (r.type === 'characterData') {
        var pa = t.parentNode; if (pa && pa.nodeName === 'STYLE') hj = true; else if (FILTRO.slice(-2) === '+t') rt = true;
      } else {
        if (t.nodeName === 'LINK') { if (r.attributeName === 'href') { quitaCopia(t); hj = true; } else if (r.attributeName === 'disabled') { var c = COPIA.get(t); if (c) c.disabled = t.disabled; } else hj = true; }
        rt = true;
      }
    }
    if (hj) programaHojas();
    if (rt) programaRT();
  }
  try {
    OBS = new MutationObserver(alCambio);
    necesitaObservar();
    D.addEventListener('load', function (e) { var t = e.target; if (t && t.nodeName === 'LINK') programaHojas(); }, true);
    ['change', 'input', 'click', 'keyup', 'focusin', 'focusout', 'pointerup', 'transitionend', 'animationend'].forEach(function (ev) { D.addEventListener(ev, programaRT, { capture: true, passive: true }); });
    var hov = function () { if (LH.some(function (h) { return h.hover; })) programaRT(); };
    D.addEventListener('pointerover', hov, { capture: true, passive: true });
    window.addEventListener('resize', programaRT, { passive: true });
    if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', function () { hojas(); enMarcha(); });
    window.addEventListener('load', function () { hojas(); enMarcha(); });
    /* red de seguridad: por si algo cambia sin que se note (estilos puestos a mano…) */
    var vueltas = 0, iv = setInterval(function () { vueltas++; hojas(); if (LH.length || LM.length || CONT.length) enMarcha(); if (vueltas === 12) { clearInterval(iv); setInterval(function () { hojas(); if (LH.length || LM.length || CONT.length) enMarcha(); }, 2500); } }, 500);
    hojas();
    programaRT();
  } catch (e) { fallo('arranque', e); }
})();
