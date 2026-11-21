/* Carrusel Online · vídeo de presentación (21-nov-2026, Iago: «como las intros de Teoría»).
   Escenario de 1920×1080 que se escala a la pantalla; todo se dibuja en vivo con el tiempo del audio
   (capturas nítidas con movimientos de cámara, avatares de verdad, emojis que suben y rótulos).
   ?t=SEG congela el fotograma en ese segundo (para revisar) · ?auto&embed lo abre directo desde el portal. */
(function () {
  'use strict';
  var G = window.GUION, Q = new URLSearchParams(location.search), FIJO = Q.has('t') ? parseFloat(Q.get('t')) : null;
  var esc = document.getElementById('escenario'), capa = document.getElementById('capa'), audio = document.getElementById('audio');
  function el(tag, cls, padre, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; (padre || capa).appendChild(e); return e; }
  function cl(x, a, b) { return x < a ? a : x > b ? b : x; }
  function io(x) { x = cl(x, 0, 1); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function eo(x) { x = cl(x, 0, 1); return 1 - Math.pow(1 - x, 3); }
  function rampa(t, a, b) { return cl((t - a) / (b - a), 0, 1); }
  function vis2(t, a, b, fi, fo) { if (t < a || t > b + fo) return 0; var x = 1; if (fi > 0) x = Math.min(x, rampa(t, a, a + fi)); if (fo > 0) x = Math.min(x, 1 - rampa(t, b, b + fo)); return x; }
  function vis(t, a, b, fi, fo) { if (t < a - fi || t > b + fo) return 0; var x = 1; if (fi > 0) x = Math.min(x, rampa(t, a - fi, a)); if (fo > 0) x = Math.min(x, 1 - rampa(t, b, b + fo)); return x; }
  /* ---- escalado del escenario ---- */
  function encaja() { var s = Math.min(innerWidth / 1920, innerHeight / 1080); esc.style.transform = 'translate(-50%,-50%) scale(' + s + ')'; }
  addEventListener('resize', encaja); encaja();
  /* ---- planos (capturas) ---- */
  var PL = G.planos.map(function (p) {
    var w = el('div', 'plano ' + p.modo), im = el('img', '', w); if (FIJO != null) im.src = p.src; im.alt = ''; im.draggable = false;
    im.style.width = p.w + 'px'; im.style.height = p.h + 'px'; w.style.display = 'none';
    return { p: p, w: w, im: im };
  });
  function camara(p, t) {
    var k = p.c1 ? io(rampa(t, p.t0 + (p.ca || 0), p.t1 - (p.cb || 0))) : 0, a = p.c0, b = p.c1 || p.c0, c = [];
    for (var i = 0; i < a.length; i++) c.push(a[i] + (b[i] - a[i]) * k);
    var pu = 1; (p.punch || []).forEach(function (tp) { var d = t - tp; if (d > -0.02 && d < 0.45) pu *= 1 + 0.05 * Math.sin(Math.PI * cl(d / 0.45, 0, 1)); });
    if (p.modo === 'full') { var s = 1920 / c[2]; var h = c[2] * 9 / 16; return { s: s * pu, x: -(c[0] + c[2] / 2) * s * pu + 960, y: -(c[1] + h / 2) * s * pu + 540, caja: null }; }
    var mw = p.mw || 1640, mh = p.mh || 880, s2 = Math.min(mw / c[2], mh / c[3]) * pu, cw = c[2] * s2, ch = c[3] * s2, cx = 960 + (p.dx || 0), cy = 540 + (p.dy || 0);
    return { s: s2, x: -c[0] * s2, y: -c[1] * s2, caja: [cx - cw / 2, cy - ch / 2, cw, ch] };
  }
  function aEscena(p, t, ix, iy) { var c = camara(p, t); return c.caja ? [c.caja[0] + c.x + ix * c.s, c.caja[1] + c.y + iy * c.s] : [c.x + ix * c.s, c.y + iy * c.s]; }
  var PLID = {}; G.planos.forEach(function (p, i) { PLID[p.id] = p; });
  /* ---- rótulos, aros, cursor, flotantes ---- */
  var RO = (G.rotulos || []).map(function (r) { var e = el('div', 'rotulo ' + (r.cls || ''), null, r.html); e.style.display = 'none'; return { r: r, e: e }; });
  var AR = (G.aros || []).map(function (r) { var e = el('div', 'aro ' + (r.cls || '')); e.style.display = 'none'; return { r: r, e: e }; });
  var CU = (G.cursores || []).map(function (r) { var e = el('div', 'cursor', null, '<svg viewBox="0 0 32 32"><path d="M6 3l20 13-9 2 5 10-4 2-5-10-7 6z" fill="#fff" stroke="#111" stroke-width="2" stroke-linejoin="round"/></svg><i></i>'); e.style.display = 'none'; return { r: r, e: e }; });
  var FL = []; (G.flotan || []).forEach(function (f) {
    f.items.forEach(function (it) { var e = el('div', 'flota' + (it.txt.length > 3 ? ' frase' : ''), null, it.txt.length > 3 ? '<b>' + it.txt + '</b><i>' + (it.quien || '') + '</i>' : it.txt); e.style.display = 'none'; if (it.color) e.style.setProperty('--c', it.color); FL.push({ f: f, it: it, e: e }); });
  });
  /* ---- foco (21-nov 10:10, Iago): la pantalla tal cual la verán, oscureciendo todo menos lo que se enseña ---- */
  var FOCO = el('div', 'foco'); FOCO.style.display = 'none';
  var FC = (G.focos || []).slice().sort(function (a, b) { return a.t0 - b.t0; });
  function pintaFoco(t) {
    var i = -1; for (var k = 0; k < FC.length; k++) if (t >= FC[k].t0 - (FC[k].fi == null ? 0.3 : FC[k].fi) && t <= FC[k].t1 + (FC[k].fo == null ? 0.3 : FC[k].fo)) i = k;
    if (i < 0) { FOCO.style.display = 'none'; return; }
    var f = FC[i], prev = (i > 0 && Math.abs(FC[i - 1].t1 - f.t0) < 0.2) ? FC[i - 1] : null, next = (i + 1 < FC.length && Math.abs(FC[i + 1].t0 - f.t1) < 0.2) ? FC[i + 1] : null, r = f.r;
    if (prev) { var q = io(rampa(t, f.t0 - 0.05, f.t0 + 0.45)); r = prev.r.map(function (v, j) { return v + (f.r[j] - v) * q; }); }
    var a = 1; if (!prev) a = Math.min(a, rampa(t, f.t0 - (f.fi == null ? 0.3 : f.fi), f.t0)); if (!next) a = Math.min(a, 1 - rampa(t, f.t1, f.t1 + (f.fo == null ? 0.3 : f.fo)));
    var m = f.m == null ? 12 : f.m;
    FOCO.style.display = ''; FOCO.style.left = (r[0] - m) + 'px'; FOCO.style.top = (r[1] - m) + 'px'; FOCO.style.width = (r[2] + 2 * m) + 'px'; FOCO.style.height = (r[3] + 2 * m) + 'px';
    if (f.pl) a *= (PLOP[f.pl] || 0);
    FOCO.style.borderRadius = (f.rad == null ? 18 : f.rad) + 'px'; FOCO.style.setProperty('--a', (a * (f.alfa || 0.56)).toFixed(3));
  }
  /* ---- escenas vivas (avatares) ---- */
  var VIV = [];
  function pintaHTML(o, clave, nodo, html) { if (o.cache[clave] === html) return; o.cache[clave] = html; nodo.innerHTML = html; }
  /* ---- fondo ---- */
  /* (21-nov 11:07, Iago) el fondo de círculos concéntricos se mueve, suave, siempre que se ve: el remolino de colores del
     juego gira (lienzo pequeño que agranda y gira la tarjeta gráfica) y los anillos se van abriendo hacia fuera despacio.
     Las capturas del lobby, la cuenta atrás y el podio vienen sin fondo, así que debajo se ve este mismo fondo en marcha. */
  var fondo = document.getElementById('fondo'), ani = document.getElementById('anillos'), actx = ani.getContext('2d'), tAnt = null;
  var COLS = ['#ff5fa2', '#ff9a3c', '#ffd23f', '#34d399', '#5bd0ff', '#7c6cff', '#bd92ff', '#ff5fa2'];
  function pintaFondo(t, tapado) {
    if (tapado || (tAnt !== null && Math.abs(t - tAnt) < 0.004)) return; tAnt = t;
    if (actx.createConicGradient) { var g = actx.createConicGradient(-Math.PI / 2 + t * 4.8 * Math.PI / 180, 960, 540); COLS.forEach(function (k, i) { g.addColorStop(i / (COLS.length - 1), k); }); actx.fillStyle = g; }
    else actx.fillStyle = '#5b3fa0';
    actx.fillRect(0, 0, 1920, 1080);
    var P = 68, f = (t * 12) % P; actx.strokeStyle = 'rgba(10,7,30,.30)';
    for (var a0 = f + 34 - P; a0 < 1180; a0 += P) { var a = Math.max(0, a0), b = a0 + 34; if (b <= 0) continue;
      actx.lineWidth = b - a; actx.beginPath(); actx.arc(960, 453.6, (a + b) / 2, 0, 2 * Math.PI); actx.stroke(); }
  }
  var PLOP = {};
  function dibuja(t) {
    var tapado = false, ops = PL.map(function (o) { var p = o.p; return vis2(t, p.t0, p.t1, p.fi == null ? 0.3 : p.fi, p.fo == null ? 0.3 : p.fo); });
    PL.forEach(function (o, i) { var p = o.p;
      if (ops[i] > 0 && ops[i] < 1 && t > p.t1 && !p.alfa) for (var j = 0; j < PL.length; j++) if (j !== i && ops[j] > 0 && !PL[j].p.alfa && PL[j].p.t0 >= p.t1 - 0.05 && PL[j].p.t0 <= t) { ops[i] = 1; break; }
      PLOP[p.id] = ops[i]; if (!p.alfa && p.modo === 'full' && ops[i] >= 0.999) tapado = true; });
    pintaFondo(t, tapado);
    PL.forEach(function (o, i) {
      var p = o.p, op = ops[i];
      if (op <= 0) {
        var pre = t < p.t0 && t > p.t0 - 1.2;   /* (21-nov 11:16) precarga: así no hay fotogramas negros al cambiar de imagen */
        if (!pre) { if (o.w.style.display !== 'none') o.w.style.display = 'none'; return; }
        op = 0.002; }
      o.w.style.display = ''; o.w.style.opacity = op; o.w.style.zIndex = op <= 0.002 ? 1 : (p.z || 2);
      var c = camara(p, t);
      if (c.caja) { o.w.style.left = c.caja[0] + 'px'; o.w.style.top = c.caja[1] + 'px'; o.w.style.width = c.caja[2] + 'px'; o.w.style.height = c.caja[3] + 'px';
        var ent = p.entra ? eo(rampa(t, p.t0 - 0.3, p.t0 + 0.35)) : 1; o.w.style.transform = 'translateY(' + ((1 - ent) * 60) + 'px) scale(' + (0.94 + 0.06 * ent) + ')'; }
      o.im.style.transform = 'translate(' + c.x + 'px,' + c.y + 'px) scale(' + c.s + ')';
    });
    RO.forEach(function (o) {
      var r = o.r, op = vis(t, r.t0, r.t1, r.fi == null ? 0.18 : r.fi, r.fo == null ? 0.25 : r.fo);
      if (op <= 0) { o.e.style.display = 'none'; return; }
      o.e.style.display = ''; o.e.style.left = r.x + 'px'; o.e.style.top = r.y + 'px';
      var k = eo(rampa(t, r.t0 - (r.fi == null ? 0.18 : r.fi), r.t0 + 0.12)), tr = 'translate(-50%,-50%) ';
      if (r.anim === 'slam') tr += 'scale(' + (1.6 - 0.6 * k) + ')'; else if (r.anim === 'sube') tr += 'translateY(' + ((1 - k) * 40) + 'px)'; else tr += 'scale(' + (0.7 + 0.3 * k + 0.04 * Math.sin(Math.PI * k)) + ')';
      if (r.rot) tr += ' rotate(' + r.rot + 'deg)';
      o.e.style.transform = tr; o.e.style.opacity = op;
    });
    AR.forEach(function (o) {
      var r = o.r, p = PLID[r.plano], op = vis(t, r.t0, r.t1, 0.15, 0.2) * (PLOP[r.plano] || 0);
      if (op <= 0 || !p) { o.e.style.display = 'none'; return; }
      var a = aEscena(p, t, r.r[0], r.r[1]), b = aEscena(p, t, r.r[0] + r.r[2], r.r[1] + r.r[3]), m = r.m || 10, pul = 1 + 0.06 * Math.sin((t - r.t0) * 7);
      o.e.style.display = ''; o.e.style.opacity = op;
      o.e.style.left = (a[0] - m) + 'px'; o.e.style.top = (a[1] - m) + 'px'; o.e.style.width = (b[0] - a[0] + 2 * m) + 'px'; o.e.style.height = (b[1] - a[1] + 2 * m) + 'px';
      o.e.style.transform = 'scale(' + pul + ')';
    });
    CU.forEach(function (o) {
      var r = o.r, p = PLID[r.plano], P = r.pts, op = vis(t, P[0][0], P[P.length - 1][0] + (r.queda || 0.6), 0.2, 0.25) * Math.max.apply(null, (r.pls || [r.plano]).map(function (id) { return PLOP[id] || 0; }));
      if (op <= 0 || !p) { o.e.style.display = 'none'; return; }
      var i = 0; while (i < P.length - 2 && t > P[i + 1][0]) i++;
      var k = io(rampa(t, P[i][0], P[i + 1][0])), ix = P[i][1] + (P[i + 1][1] - P[i][1]) * k, iy = P[i][2] + (P[i + 1][2] - P[i][2]) * k, s = aEscena(p, t, ix, iy);
      o.e.style.display = ''; o.e.style.opacity = op; o.e.style.left = s[0] + 'px'; o.e.style.top = s[1] + 'px';
      var cl0 = (r.clics || []).filter(function (c) { return t >= c && t < c + 0.5; })[0], rip = o.e.querySelector('i');
      if (cl0 != null) { var d = (t - cl0) / 0.5; rip.style.display = ''; rip.style.transform = 'translate(-50%,-50%) scale(' + (0.3 + 1.4 * d) + ')'; rip.style.opacity = 1 - d; o.e.firstChild.style.transform = 'scale(' + (d < 0.25 ? 0.85 : 1) + ')'; }
      else { rip.style.display = 'none'; o.e.firstChild.style.transform = ''; }
    });
    FL.forEach(function (o) {
      var f = o.f, it = o.it, p = PLID[f.plano], d = t - it.t, D = it.d || 2.4;
      if (d < 0 || d > D || !p) { o.e.style.display = 'none'; return; }
      var s = aEscena(p, t, it.x, it.y), k = d / D;
      o.e.style.display = ''; o.e.style.left = (s[0] + Math.sin(d * 3 + it.x) * 14) + 'px'; o.e.style.top = (s[1] - (it.sube ? 20 : 60) - (it.sube || 230) * eo(k)) + 'px';
      o.e.style.opacity = k < 0.12 ? k / 0.12 : (k > 0.75 ? (1 - k) / 0.25 : 1); o.e.style.transform = 'translate(-50%,-50%) scale(' + (0.6 + 0.4 * eo(Math.min(1, d / 0.3))) + ')';
    });
    pintaFoco(t);
    VIV.forEach(function (o) {
      var v = o.v, op = v.pl ? (t >= v.t0 && t <= v.t1 + 1 ? (PLOP[v.pl] || 0) : 0) : vis2(t, v.t0, v.t1, v.fi == null ? 0.3 : v.fi, v.fo == null ? 0.3 : v.fo);
      if (op <= 0) { o.raiz.style.display = 'none'; return; }
      o.raiz.style.display = ''; o.raiz.style.opacity = op; VIVAS[v.tipo].pinta(o, t);
    });
  }
  /* ---------------- escenas vivas ---------------- */
  var AV = window.AV3;
  function avSVG(cfg, op) { return AV.render(cfg, op || {}); }
  /* (21-nov 08:41, Iago) los avatares del vídeo son títeres vivos (AV3.vivo), con física. Su reloj es el del vídeo: al saltar
     hacia atrás (o al revisar con ?t=) se recalcula desde el principio de la escena y sale siempre igual. */
  function muevete(o, k, nodo, t, desde, estado, ev) {
    var s = o.cache['v' + k];
    if (!s || t < s.tv - 1e-3 || t - s.tv > 1.5) {
      var e0 = estado(desde); nodo.innerHTML = '';
      var rig = AV.vivo(nodo, e0[0], Object.assign({ manual: true, semilla: 17 + k.length * 7 + k.charCodeAt(k.length - 1) }, e0[1]));
      s = o.cache['v' + k] = { rig: rig, tv: desde, ck: JSON.stringify(e0), ev: 0 };
    }
    var r = s.rig;
    while (s.tv < t - 1e-6) { var h = Math.min(1 / 60, t - s.tv), tn = s.tv + h;
      while (s.ev < ev.length && ev[s.ev][0] <= tn) { ev[s.ev][1](r); s.ev++; }
      var e = estado(tn), ck = JSON.stringify(e); if (ck !== s.ck) { s.ck = ck; r.viste(e[0], e[1]); }
      r.avanza(h, tn < t - 1e-6); s.tv = tn; }
    r.pinta();
  }
  function accion(e) { var x = e[1]; return function (r) { if (typeof x === 'string') r.gesto(x); else if (x.mira) r.miraA(x.mira[0], x.mira[1] || 0, x.mira[2] || 1500); else if (x.cara) r.cara(x.cara); }; }
  function fmtReloj(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  var VIVAS = {
    avs: {   /* avatares vivos encima de una captura (coordenadas del escenario): llegan, gesticulan, miran a quien habla */
      init: function (o) { o.hs = o.v.lista.map(function (a) { var h = el('div', 'avh', o.raiz); h.style.left = a.r[0] + 'px'; h.style.top = a.r[1] + 'px'; h.style.width = a.r[2] + 'px'; h.style.height = a.r[3] + 'px'; return h; }); },
      pinta: function (o, t) { o.v.lista.forEach(function (a, i) { var h = o.hs[i], t0 = a.t0 == null ? o.v.t0 : a.t0, t1 = a.t1 == null ? o.v.t1 : a.t1;
        if (t < t0 - 0.01 || t > t1) { h.style.display = 'none'; return; } h.style.display = '';
        if (a.entra) { var k = rampa(t, t0, t0 + 0.34); h.style.opacity = Math.min(1, (t - t0) / 0.04); h.style.transform = 'scale(' + (1 + 0.32 * Math.sin(Math.PI * k) * (1 - 0.35 * k)) + ')'; }
        if (!a.evf) a.evf = (a.ev || []).map(function (e) { return [e[0], accion(e)]; });
        muevete(o, 'a' + i, h, t, a.desde == null ? o.v.t0 : a.desde, function () { return [a.cfg, a.op || {}]; }, a.evf); }); }
    },
    reloj: {
      init: function (o) { var v = o.v; o.e = el('div', 'relojv', o.raiz); o.e.style.left = v.r[0] + 'px'; o.e.style.top = v.r[1] + 'px'; o.e.style.width = v.r[2] + 'px'; o.e.style.height = v.r[3] + 'px'; if (v.css) o.e.setAttribute('style', o.e.getAttribute('style') + ';' + v.css); },
      pinta: function (o, t) { var v = o.v, s = v.desde + (v.hasta - v.desde) * rampa(t, v.ta, v.tb); o.e.textContent = fmtReloj(s); }
    },
    intro: {   /* lo que dice, en letras, sin desvelar nada más (el título llega con «esto es el Carrusel Online») */
      init: function (o) { o.ws = []; o.v.lineas.forEach(function (L) { var d = el('div', 'linea', o.raiz); L.forEach(function (w) { var s = el('span', w.c || '', d, w.x); o.ws.push({ e: s, t: w.t }); }); }); },
      pinta: function (o, t) { o.ws.forEach(function (w) { var k = eo(rampa(t, w.t - 0.06, w.t + 0.28)); w.e.style.opacity = k; w.e.style.transform = 'translateY(' + ((1 - k) * 26) + 'px) scale(' + (0.85 + 0.15 * k) + ')'; });
        o.raiz.style.transform = 'translate(-50%,-50%) scale(' + (1 + 0.012 * (t - o.v.t0)) + ')'; }
    },
    ranking: {   /* la clasificación de verdad (mismas medidas y colores que en el juego): suman, se reordenan y reaccionan */
      init: function (o) { var v = o.v; o.raiz.style.setProperty('--c', v.color); o.raiz.style.setProperty('--rgb', v.rgb);
        o.filas = v.filas.map(function (f, i) { var d = el('div', 'fila' + (f.yo ? ' yo' : ''), o.raiz, '<span class="pos"></span><span class="co-avr"><div class="avh"></div></span><span class="nom">' + f.n + (f.bot ? '<i>BOT</i>' : (f.g ? '<i>' + f.g + '</i>' : '')) + '</span><span class="del">–</span><span class="pts"></span>');
          d.style.left = v.x + 'px'; d.style.width = v.w + 'px'; d.style.height = v.h + 'px'; return { d: d, f: f, av: d.querySelector('.avh'), pos: d.querySelector('.pos'), del: d.querySelector('.del'), pts: d.querySelector('.pts') }; }); },
      pinta: function (o, t) { var v = o.v, kc = 1 - Math.pow(1 - rampa(t, v.tc, v.tc + 1.9), 3), kr = io(rampa(t, v.tr, v.tr + 1.1)), dos = t >= v.tr;
        o.filas.forEach(function (F, i) { var f = F.f, y = v.y + (f.i0 + (f.i1 - f.i0) * kr) * (v.h + v.gap);
          F.d.style.top = y + 'px'; F.d.style.zIndex = f.i1 < f.i0 ? 3 : (f.i1 > f.i0 ? 1 : 2); F.pos.textContent = dos ? (f.i1 + 1) : (f.i0 + 1);
          var dl = Math.round(f.d * kc); F.del.textContent = dl ? '+' + dl : '–'; F.pts.textContent = Math.round(f.p0 + f.d * kc);
          F.d.classList.toggle('sub2', t >= v.tr + 0.2 && f.i1 < f.i0); F.d.classList.toggle('baja', t >= v.tr + 0.2 && f.i1 > f.i0); F.d.classList.toggle('lider', t >= v.tr + 0.2 && f.i1 === 0);
          if (!f.evf) f.evf = (f.ev || []).map(function (e) { return [e[0], accion(e)]; });
          muevete(o, 'r' + i, F.av, t, v.t0, function () { return [f.cfg, f.op || {}]; }, f.evf); }); }
    },
    titulo: {
      init: function (o) { o.raiz.innerHTML = '<div class="logo"><span class="car">Carrusel</span>' + (G.pro ? '<span class="pro">PRO</span>' : '') + '<span class="onl">Online</span></div><div class="sub">' + (G.pro ? 'Grado Profesional' : 'Grado Elemental') + '</div>'; },
      pinta: function (o, t) { var v = o.v, k = eo(rampa(t, v.t0, v.t0 + (v.ent || 0.5))), g = v.golpe ? Math.max(0, 1 - Math.abs(t - v.golpe) / 0.25) : 0;
        o.raiz.style.transform = 'translate(-50%,-50%) scale(' + ((v.desde || 0.6) + (1 - (v.desde || 0.6)) * k + 0.08 * g + 0.02 * (t - v.t0)) + ')'; }
    },
    montaje: {   /* «créate tu avatar»: color, fondo, peinado, gorro, ropa, instrumento… y todos los avatares */
      init: function (o) { o.raiz.innerHTML = '<div class="grande"></div><div class="lista"></div><div class="rejilla"></div>'; },
      pinta: function (o, t) {
        var v = o.v, W = v.w, base = v.base, cfg = Object.assign({}, base), et = '', ins = null, R = o.raiz;
        var pasos = [['color', W.color, AV.COLS, 'Color'], ['fondo', W.fondo, AV.FONDOS.map(function (f) { return f[0]; }), 'Fondo'], ['pelo', W.peinado, AV.PEINADOS.map(function (f) { return f[0]; }), 'Peinado'], ['gorro', W.gorro, AV.GORROS.map(function (f) { return f[0]; }), 'Gorro'], ['prenda', W.ropa, ['camiseta', 'sudadera', 'camisa', 'chaqueta', 'jersey'], 'Ropa']];
        var fin = v.final;
        pasos.forEach(function (p, i) {
          var t0 = p[1]; if (t < t0) return; var n = Math.floor((t - t0) / 0.11), lst = p[2], sig = (i + 1 < pasos.length) ? pasos[i + 1][1] : W.instrumento;
          cfg[p[0]] = (t < sig - 0.05) ? lst[(n + 3) % lst.length] : fin[p[0]];
          if (p[0] === 'prenda' && t >= t0) cfg.ropa = (t < sig - 0.05) ? AV.COLS[(n + 5) % AV.COLS.length] : fin.ropa;
          if (t < sig) et = p[3];
        });
        if (t >= W.instrumento) { ins = v.ins; et = '🎻 De tu ficha'; }
        var gr = R.querySelector('.grande');
        if (!o.cache.evG) o.cache.evG = [[v.t0 + 0.35, function (r) { r.gesto('saludar'); }], [W.fondo + 0.1, function (r) { r.miraA(-0.8, -0.35, 800); }], [W.peinado + 0.05, function (r) { r.gesto('rascar'); }],
          [W.gorro + 0.05, function (r) { r.gesto('guino'); }], [W.ropa + 0.05, function (r) { r.gesto('bailar'); }], [W.instrumento + 0.02, function (r) { r.gesto('celebrar'); }]];
        if (!o.cache.estG) o.cache.estG = function (tt) { var c2 = Object.assign({}, base), i2 = null;
          pasos.forEach(function (p, i) { var t0 = p[1]; if (tt < t0) return; var n = Math.floor((tt - t0) / 0.11), lst = p[2], sig = (i + 1 < pasos.length) ? pasos[i + 1][1] : W.instrumento;
            c2[p[0]] = (tt < sig - 0.05) ? lst[(n + 3) % lst.length] : fin[p[0]]; if (p[0] === 'prenda') c2.ropa = (tt < sig - 0.05) ? AV.COLS[(n + 5) % AV.COLS.length] : fin.ropa; });
          if (tt >= W.instrumento) i2 = v.ins; return [c2, { ins: i2 }]; };
        if (t < W.todos + 0.4) muevete(o, 'g', gr, t, v.t0, o.cache.estG, o.cache.evG);
        var ka = eo(rampa(t, W.todos - 0.1, W.todos + 0.35)); gr.style.transform = 'scale(' + (1 - 0.5 * ka) + ')'; gr.style.opacity = 1 - ka;
        pintaHTML(o, 'l', R.querySelector('.lista'), et ? '<span>' + et + '</span>' : '');
        R.querySelector('.lista').style.opacity = t < W.todos ? 1 : 0;
        var rj = R.querySelector('.rejilla');
        if (t >= W.todos) { if (!o.cache.rj) { o.cache.rj = 1; rj.innerHTML = v.todos.map(function (a, i) { return '<div class="mini" style="--i:' + i + '"><div class="avm"></div><b>' + a.n + '</b></div>'; }).join(''); }
          var OTROS = ['guino', 'bailar', 'reir', 'aplaudir', 'asentir', 'tararear'];
          [].forEach.call(rj.children, function (m, i) { var k = eo(rampa(t, W.todos + 0.08 * i, W.todos + 0.08 * i + 0.4)), a = v.todos[i], g = (a.g && AV.GESTOS.indexOf(a.g) >= 0) ? a.g : OTROS[i % OTROS.length];
            m.style.opacity = k; m.style.transform = 'translateY(' + ((1 - k) * 50) + 'px) scale(' + (0.6 + 0.4 * k) + ')';
            muevete(o, 'm' + i, m.querySelector('.avm'), t, W.todos, function () { return [a.cfg, { ins: a.ins }]; }, [[W.todos + 0.08 * i + 0.3, function (r) { r.gesto(g); }]]); }); }
        rj.style.display = t >= W.todos ? '' : 'none';
      }
    },
    compositores: {
      init: function (o) { o.raiz.innerHTML = (o.v.titulo ? '<h2>' + o.v.titulo + '</h2>' : '') + '<div class="fila">' + o.v.lista.map(function (c, i) { return '<div class="hueco"><i></i><div class="comp"><div class="av"></div><b>' + c.n + '</b></div>' + (o.v.gag && o.v.gag.i === i ? '<div class="bocadillo">' + o.v.gag.txt + '</div>' : '') + '</div>'; }).join('') + '</div>'; },
      pinta: function (o, t) { var v = o.v, h2 = o.raiz.querySelector('h2');
        if (h2) { var kh = eo(rampa(t, v.t0, v.t0 + 0.5)); h2.style.opacity = kh; h2.style.transform = 'translateY(' + ((1 - kh) * 30) + 'px)'; }
        [].forEach.call(o.raiz.querySelectorAll('.hueco'), function (hu, i) { var kh = eo(rampa(t, v.t0 + 0.2 + 0.18 * i, v.t0 + 0.55 + 0.18 * i)); hu.querySelector('i').style.opacity = kh * (t < v.lista[i].t ? 1 : 0.0); hu.querySelector('i').style.transform = 'scale(' + (0.6 + 0.4 * kh) + ')'; });
        [].forEach.call(o.raiz.querySelectorAll('.comp'), function (d, i) { var c = v.lista[i], k = rampa(t, c.t, c.t + 0.36); d.style.opacity = t < c.t ? 0 : Math.min(1, (t - c.t) / 0.05); d.style.transform = 'scale(' + (t < c.t ? 0.3 : Math.min(1, 0.3 + 0.7 * k / 0.45) + 0.18 * Math.sin(Math.PI * k)) + ')';
          if (!o.cache['ev' + i]) { var ev = [], gg = v.gag;
            /* (21-nov 12:29, Iago) el guiño de Beethoven: los demás lo miran sorprendidos y él se rasca la cabeza: «¡Pero si yo no oigo nada!» */
            if (gg && i === gg.i) { ev.push([c.t + 0.3, function (r) { r.gesto('rascar'); }]); ev.push([gg.t1 - 1.0, function (r) { r.gesto('noSe'); }]); }
            else { ev.push([c.t + 0.15, function (r) { r.gesto('saludar'); }]);
              if (gg && c.t < gg.t0) { ev.push([gg.t0 - 0.35, function (r) { r.miraA(1, 0.05, 2300); r.cara('sorpresa'); }]); ev.push([gg.t0 - 0.3, function (r) { r.gesto('sorpresa'); }]); } }
            if (!gg) ev.push([v.picaro, function (r) { r.cara('picaro'); r.gesto(i === 1 ? 'sospechar' : (i === 0 ? 'pensar' : 'guino')); }]);
            else if (i !== gg.i) ev.push([v.picaro + 0.1 * i, function (r) { r.cara('dientes'); r.gesto('reir'); }]);   /* y se ríen */
            o.cache['ev' + i] = ev.sort(function (x, y) { return x[0] - y[0]; }); }
          muevete(o, 'c' + i, d.querySelector('.av'), t, v.t0, function () { return [c.cfg, { ins: c.ins, bot: true }]; }, o.cache['ev' + i]); });
        if (v.gag) { var bo = o.raiz.querySelector('.bocadillo'), kb = rampa(t, v.gag.t0, v.gag.t0 + 0.3), kf = rampa(t, v.gag.t1 - 0.25, v.gag.t1);
          bo.style.opacity = t < v.gag.t0 ? 0 : Math.min(1, kb * 3) * (1 - kf); bo.style.transform = 'translateX(-50%) scale(' + (0.4 + 0.6 * Math.min(1, kb / 0.6) + 0.12 * Math.sin(Math.PI * kb)) + ')'; } }
    },
    barajar: {   /* las partes del carrusel, en orden sorpresa */
      init: function (o) { o.raiz.innerHTML = o.v.partes.map(function (p) { return '<div class="parte" style="--c:' + p.c + '"><i>' + p.n + '</i><b>' + p.t + '</b></div>'; }).join(''); },
      pinta: function (o, t) { var v = o.v, N = v.partes.length;
        [].forEach.call(o.raiz.children, function (d, i) { var k = eo(rampa(t, v.t0 + 0.07 * i, v.t0 + 0.07 * i + 0.35)), mez = v.mezcla ? io(rampa(t, v.mezcla, v.mezcla + 0.7)) : 0, j = v.orden[i];
          var x0 = (i - (N - 1) / 2) * 270, x1 = (j - (N - 1) / 2) * 270, x = x0 + (x1 - x0) * mez, y = -Math.sin(Math.PI * mez) * (i % 2 ? 120 : -120);
          d.style.opacity = k; d.style.transform = 'translate(' + x + 'px,' + (y + (1 - k) * 70) + 'px) rotate(' + (Math.sin(Math.PI * mez) * (i % 2 ? 8 : -8)) + 'deg)';
          var ni = d.querySelector('i'), nn = String(mez > 0.5 ? j + 1 : i + 1); if (ni.textContent !== nn) ni.textContent = nn; }); }   /* (21-nov) al desordenarse, cada una toma el número de su sitio nuevo */
    },
    actitud: {
      init: function (o) { o.raiz.innerHTML = '<div class="tarj"><h3>Actitud</h3><div class="fila"><span class="ic"></span><b>Carrusel Online</b><em>+0 min</em></div><div class="barra"><i></i></div><div class="topes"><span>30 min / semana</span><span>2 h / trimestre</span></div></div>'; },
      pinta: function (o, t) { var v = o.v, m = Math.round(11 * eo(rampa(t, v.suma, v.suma + 1.4))); o.raiz.querySelector('em').textContent = '+' + m + ' min';
        o.raiz.querySelector('.barra i').style.width = (eo(rampa(t, v.suma, v.suma + 1.4)) * 37) + '%';
        [].forEach.call(o.raiz.querySelectorAll('.topes span'), function (s, i) { var k = eo(rampa(t, v.topes[i], v.topes[i] + 0.35)); s.style.opacity = k; s.style.transform = 'scale(' + (0.6 + 0.4 * k) + ')'; });
        var k = eo(rampa(t, v.t0, v.t0 + 0.5)); o.raiz.querySelector('.tarj').style.transform = 'translateY(' + ((1 - k) * 60) + 'px)'; }
    }
  };
  /* (21-nov 11:07, Iago) «cuando hace referencia al icono, quiero que aparezca el icono grande en pantalla… que se vea la
     pulsión y la animación»: el botón del portal, ampliado y en vectorial, sale de su sitio, se queda en el centro y vuelve.
     Mismo dibujo y mismas animaciones que carrusel-aviso.js (textura que gira 9,6 s y respira 3,2 s; la espiral gira 6 s hacia fuera; el número late suave 1,6 s; sin anillos). */
  /* (21-nov 11:19, Iago) un momento solo con texto que se teclea (con sonido de tecleo en el audio) */
  VIVAS.teclea = {
    init: function (o) { var v = o.v; o.raiz.style.left = v.x + 'px'; o.raiz.style.top = v.y + 'px'; o.raiz.innerHTML = '<div class="caja"><span class="tx"></span><i class="caret"></i></div>' + (v.flecha ? '<b class="fl"></b>' : ''); o.tx = o.raiz.querySelector('.tx'); o.ca = o.raiz.querySelector('.caret'); },
    pinta: function (o, t) { var v = o.v, nv = t < v.ta ? 0 : Math.floor((t - v.ta) / v.dt) + 1, s = '', c = 0, q, ch, tot = v.txt.replace(/\*/g, '').length;
      for (q = 0; q < v.txt.length; q++) { ch = v.txt[q]; if (ch !== '*') { if (c >= nv) break; c++; } s += ch; }
      if (o.cache.s !== s) { o.cache.s = s; o.tx.innerHTML = s.replace(/\*([^*]*)\*?/g, '<b>$1</b>'); }
      o.ca.style.opacity = (c < tot || Math.floor(t * 2.2) % 2 === 0) ? 1 : 0;
      var k = eo(rampa(t, v.t0, v.t0 + 0.35)); o.raiz.firstChild.style.transform = 'translate(-50%,0) translateY(' + ((1 - k) * 24) + 'px)'; }
  };
  /* (21-nov 11:18, Iago) la nota fantasma del melódico, dibujada en vivo sobre unas pocas capturas (nada de pasar fotos: parpadeaba) */
  VIVAS.fantasma = {
    init: function (o) { o.n = el('div', 'nota', o.raiz); },
    pinta: function (o, t) { var v = o.v, P = v.pts, i = 0; while (i < P.length - 2 && t > P[i + 1][0]) i++;
      var k = io(rampa(t, P[i][0], P[i + 1][0])), x = P[i][1] + (P[i + 1][1] - P[i][1]) * k, y = P[i][2] + (P[i + 1][2] - P[i][2]) * k;
      var tr = v.tramos.filter(function (r) { return t >= r[0] && t < r[1]; })[0];
      if (!tr) { o.n.style.display = 'none'; return; }
      var paso = v.paso / 2, yy = v.l0 + Math.round((y - v.l0) / paso) * paso; yy = Math.max(v.l0 - 2 * paso, Math.min(v.l0 + 10 * paso, yy));
      o.n.style.display = ''; o.n.style.left = tr[2] + 'px'; o.n.style.top = yy + 'px'; }
  };
  VIVAS.boton = {
    init: function (o) { o.raiz.innerHTML = '<div class="velo"></div><div class="bb"><span class="cl"><span class="gi"><span class="fx"></span></span></span>' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 11a2 2 0 0 1 4 0a4 4 0 0 1-8 0a6 6 0 0 1 12 0a8 8 0 0 1-16 0"/></svg>' +
      '<span class="pto">1</span></div>';
      o.ve = o.raiz.querySelector('.velo'); o.bb = o.raiz.querySelector('.bb'); o.gi = o.raiz.querySelector('.gi'); o.fx = o.raiz.querySelector('.fx'); o.on = o.raiz.querySelector('.onda'); o.pt = o.raiz.querySelector('.pto'); o.raiz.querySelector('svg').style.transformOrigin = '54.17% 45.83%'; },
    pinta: function (o, t) { var v = o.v, S = v.S, d = v.desde, a = v.a;
      var u = rampa(t, v.t0, v.t0 + 0.5), ki = 1 + 2.2 * Math.pow(u - 1, 3) + 1.2 * Math.pow(u - 1, 2), ko = io(rampa(t, v.vuelve, v.t1)), s0 = d[2] / S;
      var x = a[0] + (d[0] - a[0]) * ko, y = a[1] + (d[1] - a[1]) * ko, s = (0.55 + 0.45 * ki) * (1 - ko) + s0 * ko;
      o.ve.style.opacity = (0.62 * Math.min(1, u * 2) * (1 - ko)).toFixed(3); o.bb.style.opacity = Math.min(1, u * 3);
      var k = 1 - ko;
      o.bb.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + s + ')';
      o.bb.style.boxShadow = '0 30px 90px rgba(0,0,0,' + (0.6 * k).toFixed(2) + ')';
      var m = t - v.mov, gi = 0, fx = 1;
      if (m > 0) { gi = 360 * m / 9.6; var u = ((m + 1.824) / 3.2) % 2; if (u > 1) u = 2 - u; fx = 0.72 + 0.46 * (0.5 - 0.5 * Math.cos(Math.PI * u)); }
      o.gi.style.transform = 'translate(-50%,-50%) rotate(' + gi + 'deg)'; o.fx.style.transform = 'scale(' + fx + ')';
      var sv = o.raiz.querySelector('svg'); sv.style.transform = m > 0 ? 'rotate(' + (-360 * m / 6) + 'deg)' : '';
      var n = t - v.nueva;
      if (n < 0) { o.pt.style.opacity = 0; return; }
      var kp = eo(Math.min(1, n / 0.35)), sp = kp * (1 + 0.3 * Math.sin(Math.PI * Math.min(1, n / 0.35))), late = n > 0.35 ? 1 + 0.08 * (1 - Math.cos(2 * Math.PI * (n - 0.35) / 1.6)) : 1;
      o.pt.style.opacity = kp; o.pt.style.transform = 'scale(' + (sp * late) + ')';
    }
  };
  VIV = (G.vivas || []).map(function (v) { var raiz = el('div', 'viva ' + v.tipo); raiz.style.display = 'none'; var o = { v: v, raiz: raiz, cache: {} }; (VIVAS[v.tipo].init || function () {})(o); return o; });
  /* ---------------- reproducción ---------------- */
  var bPlay = document.getElementById('botonPlay'), fin = document.getElementById('finalUI'), barra = document.getElementById('barraTiempo');
  function bucle() { var t = audio.currentTime || 0; dibuja(t); barra.style.width = (100 * t / G.tot) + '%'; fin.classList.toggle('on', t > G.tot - 4.5); requestAnimationFrame(bucle); }
  if (FIJO != null) { document.documentElement.classList.add('fijo'); document.getElementById('portada').style.display = 'none'; window.__dibuja = dibuja; setTimeout(function () { dibuja(FIJO); document.title = 'listo'; }, 400); return; }
  /* (21-nov 11:50, Iago) primero se descarga TODO (audio e imágenes) con «Cargando vídeo» y una barra fluida; luego se ve
     con la calidad con la que está hecho y sin parones. Las imágenes pasan a ser blobs ya descargados: no hay nada a medias. */
  var PESOS = G.pesos || {}, URLS = Object.keys(PESOS), TOT = URLS.reduce(function (s, u) { return s + PESOS[u]; }, 0) || 1, LLEVA = {}, HECHOS = 0, shown = 0, listoYa = false;
  var cargaEl = document.getElementById('carga'), cargaBar = cargaEl.querySelector('.bar i'), cargaPc = cargaEl.querySelector('.pc');
  function tipo(u) { return /\.webp/.test(u) ? 'image/webp' : /\.jpe?g/.test(u) ? 'image/jpeg' : /\.mp3/.test(u) ? 'audio/mpeg' : ''; }
  function baja(u, cb) {
    fetch(u).then(function (r) {
      if (!r.ok) throw 0;
      var rd = r.body && r.body.getReader ? r.body.getReader() : null, partes = [], n = 0;
      if (!rd) return r.blob().then(function (b) { LLEVA[u] = PESOS[u]; cb(b); });
      function paso() { return rd.read().then(function (x) { if (x.done) { LLEVA[u] = PESOS[u]; cb(new Blob(partes, { type: tipo(u) })); return; } partes.push(x.value); n += x.value.length; LLEVA[u] = Math.min(n, PESOS[u]); return paso(); }); }
      return paso();
    }).catch(function () { LLEVA[u] = PESOS[u]; cb(null); });
  }
  if (!PESOS[G.audio]) { PESOS[G.audio] = 1; URLS.push(G.audio); }
  function hecho() { if (++HECHOS < URLS.length + 1) return; listoYa = true; }
  URLS.forEach(function (u) {
    if (u === G.audio) { baja(u, function (b) { audio.src = b ? URL.createObjectURL(b) : u; audio.load(); hecho(); }); return; }   /* en el iPhone «canplaythrough» no llega sin tocar: basta con tenerlo descargado */
    baja(u, function (b) { var s = b ? URL.createObjectURL(b) : u; PL.forEach(function (o) { if (o.p.src === u) o.im.src = s; }); hecho(); });
  });
  hecho();   /* el «+1» del contador */
  (function anima() {
    var real = URLS.reduce(function (s, u) { return s + (LLEVA[u] || 0); }, 0) / TOT;
    shown += (Math.min(listoYa ? 1 : 0.995, real) - shown) * 0.09; if (listoYa && shown > 0.995) shown = 1;
    cargaBar.style.transform = 'scaleX(' + shown.toFixed(4) + ')'; cargaPc.textContent = Math.round(shown * 100) + ' %';
    if (shown >= 1) { cargaEl.classList.add('fuera'); bPlay.disabled = false; bPlay.classList.add('listo'); if (Q.has('auto')) empieza(); return; }
    requestAnimationFrame(anima);
  })();
  function empieza() { document.getElementById('portada').classList.add('fuera'); document.body.classList.add('sonando'); audio.play().catch(function () { document.getElementById('portada').classList.remove('fuera'); }); }
  bPlay.onclick = empieza;
  document.getElementById('botonPausa').onclick = function () { if (audio.paused) { audio.play(); document.body.classList.add('sonando'); } else { audio.pause(); document.body.classList.remove('sonando'); } };
  document.getElementById('botonReinicio').onclick = function () { audio.currentTime = 0; audio.play(); document.body.classList.add('sonando'); };
  document.getElementById('barra').onclick = function (e) { var r = this.getBoundingClientRect(); audio.currentTime = G.tot * (e.clientX - r.left) / r.width; };
  audio.addEventListener('ended', function () { document.body.classList.remove('sonando'); });
  document.getElementById('salir').onclick = function (e) { e.preventDefault(); try { parent.postMessage({ intro: 'salir' }, '*'); } catch (x) {} if (parent === window) history.back(); };
  document.getElementById('otraVez').onclick = function (e) { e.preventDefault(); audio.currentTime = 0; audio.play(); document.body.classList.add('sonando'); };
  var tm; addEventListener('mousemove', function () { document.body.classList.add('raton'); clearTimeout(tm); tm = setTimeout(function () { document.body.classList.remove('raton'); }, 1800); });
  addEventListener('keydown', function (e) { if (e.key === ' ') { e.preventDefault(); document.getElementById('botonPausa').click(); } if (e.key === 'Escape') document.getElementById('salir').click(); });
  requestAnimationFrame(bucle);
})();
