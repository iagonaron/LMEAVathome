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
  function vis(t, a, b, fi, fo) { if (t < a - fi || t > b + fo) return 0; var x = 1; if (fi > 0) x = Math.min(x, rampa(t, a - fi, a)); if (fo > 0) x = Math.min(x, 1 - rampa(t, b, b + fo)); return x; }
  /* ---- escalado del escenario ---- */
  function encaja() { var s = Math.min(innerWidth / 1920, innerHeight / 1080); esc.style.transform = 'translate(-50%,-50%) scale(' + s + ')'; }
  addEventListener('resize', encaja); encaja();
  /* ---- planos (capturas) ---- */
  var PL = G.planos.map(function (p) {
    var w = el('div', 'plano ' + p.modo), im = el('img', '', w); im.src = p.src; im.alt = ''; im.draggable = false;
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
  /* ---- escenas vivas (avatares) ---- */
  var VIV = [];
  function pintaHTML(o, clave, nodo, html) { if (o.cache[clave] === html) return; o.cache[clave] = html; nodo.innerHTML = html; }
  /* ---- fondo ---- */
  var fondo = document.getElementById('fondo');
  function dibuja(t) {
    fondo.style.transform = 'rotate(' + (t * 6) + 'deg)';   /* solo transformación: va por la GPU, sin repintar */
    PL.forEach(function (o) {
      var p = o.p, op = vis(t, p.t0, p.t1, p.fi == null ? 0.3 : p.fi, p.fo == null ? 0.3 : p.fo);
      if (op <= 0) { if (o.w.style.display !== 'none') o.w.style.display = 'none'; return; }
      o.w.style.display = ''; o.w.style.opacity = op; o.w.style.zIndex = p.z || 2;
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
      var r = o.r, p = PLID[r.plano], op = vis(t, r.t0, r.t1, 0.15, 0.2);
      if (op <= 0 || !p) { o.e.style.display = 'none'; return; }
      var a = aEscena(p, t, r.r[0], r.r[1]), b = aEscena(p, t, r.r[0] + r.r[2], r.r[1] + r.r[3]), m = r.m || 10, pul = 1 + 0.06 * Math.sin((t - r.t0) * 7);
      o.e.style.display = ''; o.e.style.opacity = op;
      o.e.style.left = (a[0] - m) + 'px'; o.e.style.top = (a[1] - m) + 'px'; o.e.style.width = (b[0] - a[0] + 2 * m) + 'px'; o.e.style.height = (b[1] - a[1] + 2 * m) + 'px';
      o.e.style.transform = 'scale(' + pul + ')';
    });
    CU.forEach(function (o) {
      var r = o.r, p = PLID[r.plano], P = r.pts, op = vis(t, P[0][0], P[P.length - 1][0] + (r.queda || 0.6), 0.2, 0.25);
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
      o.e.style.display = ''; o.e.style.left = (s[0] + Math.sin(d * 3 + it.x) * 14) + 'px'; o.e.style.top = (s[1] - 60 - 230 * eo(k)) + 'px';
      o.e.style.opacity = k < 0.12 ? k / 0.12 : (k > 0.75 ? (1 - k) / 0.25 : 1); o.e.style.transform = 'translate(-50%,-50%) scale(' + (0.6 + 0.4 * eo(Math.min(1, d / 0.3))) + ')';
    });
    VIV.forEach(function (o) {
      var v = o.v, op = vis(t, v.t0, v.t1, v.fi == null ? 0.3 : v.fi, v.fo == null ? 0.3 : v.fo);
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
  var VIVAS = {
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
      init: function (o) { o.raiz.innerHTML = o.v.lista.map(function (c) { return '<div class="comp"><div class="av"></div><b>' + c.n + '</b></div>'; }).join(''); },
      pinta: function (o, t) { var v = o.v;
        [].forEach.call(o.raiz.children, function (d, i) { var c = v.lista[i], k = eo(rampa(t, c.t, c.t + 0.35)); d.style.opacity = k; d.style.transform = 'translateY(' + ((1 - k) * 80) + 'px) scale(' + (0.5 + 0.5 * k) + ')';
          muevete(o, 'c' + i, d.querySelector('.av'), t, v.t0, function () { return [c.cfg, { ins: c.ins, bot: true }]; },
            [[c.t + 0.15, function (r) { r.gesto('saludar'); }], [v.picaro, function (r) { r.cara('picaro'); r.gesto(i === 1 ? 'sospechar' : (i === 0 ? 'pensar' : 'guino')); }]]); }); }
    },
    barajar: {   /* las partes del carrusel, en orden sorpresa */
      init: function (o) { o.raiz.innerHTML = o.v.partes.map(function (p) { return '<div class="parte" style="--c:' + p.c + '"><i>' + p.n + '</i><b>' + p.t + '</b></div>'; }).join(''); },
      pinta: function (o, t) { var v = o.v, N = v.partes.length;
        [].forEach.call(o.raiz.children, function (d, i) { var k = eo(rampa(t, v.t0 + 0.07 * i, v.t0 + 0.07 * i + 0.35)), mez = v.mezcla ? io(rampa(t, v.mezcla, v.mezcla + 0.7)) : 0, j = v.orden[i];
          var x0 = (i - (N - 1) / 2) * 270, x1 = (j - (N - 1) / 2) * 270, x = x0 + (x1 - x0) * mez, y = -Math.sin(Math.PI * mez) * (i % 2 ? 120 : -120);
          d.style.opacity = k; d.style.transform = 'translate(' + x + 'px,' + (y + (1 - k) * 70) + 'px) rotate(' + (Math.sin(Math.PI * mez) * (i % 2 ? 8 : -8)) + 'deg)'; }); }
    },
    actitud: {
      init: function (o) { o.raiz.innerHTML = '<div class="tarj"><h3>Actitud</h3><div class="fila"><span class="ic"></span><b>Carrusel Online</b><em>+0 min</em></div><div class="barra"><i></i></div><div class="topes"><span>30 min / semana</span><span>2 h / trimestre</span></div></div>'; },
      pinta: function (o, t) { var v = o.v, m = Math.round(11 * eo(rampa(t, v.suma, v.suma + 1.4))); o.raiz.querySelector('em').textContent = '+' + m + ' min';
        o.raiz.querySelector('.barra i').style.width = (eo(rampa(t, v.suma, v.suma + 1.4)) * 37) + '%';
        [].forEach.call(o.raiz.querySelectorAll('.topes span'), function (s, i) { var k = eo(rampa(t, v.topes[i], v.topes[i] + 0.35)); s.style.opacity = k; s.style.transform = 'scale(' + (0.6 + 0.4 * k) + ')'; });
        var k = eo(rampa(t, v.t0, v.t0 + 0.5)); o.raiz.querySelector('.tarj').style.transform = 'translateY(' + ((1 - k) * 60) + 'px)'; }
    }
  };
  VIV = (G.vivas || []).map(function (v) { var raiz = el('div', 'viva ' + v.tipo); raiz.style.display = 'none'; var o = { v: v, raiz: raiz, cache: {} }; (VIVAS[v.tipo].init || function () {})(o); return o; });
  /* ---------------- reproducción ---------------- */
  var bPlay = document.getElementById('botonPlay'), fin = document.getElementById('finalUI'), barra = document.getElementById('barraTiempo');
  function bucle() { var t = audio.currentTime || 0; dibuja(t); barra.style.width = (100 * t / G.tot) + '%'; fin.classList.toggle('on', t > G.tot - 4.5); requestAnimationFrame(bucle); }
  if (FIJO != null) { document.documentElement.classList.add('fijo'); document.getElementById('portada').style.display = 'none'; setTimeout(function () { dibuja(FIJO); document.title = 'listo'; }, 400); return; }
  audio.src = G.audio;
  var faltan = 1, imgs = PL.map(function (o) { return o.im; });
  function listo() { if (--faltan > 0) return; bPlay.disabled = false; bPlay.classList.add('listo'); if (Q.has('auto')) empieza(); }
  imgs.forEach(function (im) { faltan++; if (im.complete) setTimeout(listo); else { im.onload = listo; im.onerror = listo; } });
  audio.addEventListener('canplaythrough', listo, { once: true }); audio.load();
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
