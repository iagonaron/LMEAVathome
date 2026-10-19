/* (19-oct-2026) MI MAPA DE TEORÍA · piel/mapa.js (LMEAVathome). Lo cargan los portales GE y GP al tocar «Ver mi mapa de teoría».
   Iago (17-oct-2026): «un mapa mental… del centro salen las ramas… a simple vista, lo que ha salido mejor y lo que ha salido peor;
   lo que todavía no se ha preguntado, en gris, atenuado, con el título legible… que alguien que no ha visto la explicación lo entienda
   en unos segundos». El diseño que eligió: CIRCUITO, con «Teoría» en el centro (un rectángulo acostado, sin patillas); las pistas
   salen del centro hacia los lados, arriba y abajo, doblando a 90° y sin bolitas en las esquinas; la corriente sale del centro; luces
   lisas, sin destello; sin «×4» (eso le interesa a él, no al alumno); la luz apagada se llama «Sin ejercicios hechos». Pensado para
   tablet y ordenador en horizontal; en el móvil va en columna.
   Cada luz es un concepto de las fichas: su color, con la media de las 3 últimas veces que salió (70 % o más, verde; del 50 al 69 %,
   amarillo; menos del 50 %, rojo). Los datos, de suite_mi_mapa_teoria (los pide el portal).
   Uso: LMMapa.abrir({ cargar: function () { return Promise<{ ok, nivel, grupo, conceptos: [{ key, veces, media, media3, ultima }] }> } }) */
(function () {
  'use strict';
  if (window.LMMapa) return;
  var D = document, W = window;
  var URL_GE = 'https://iagonaron.github.io/teoriaathome/?practice=', URL_GP = 'https://iagonaron.github.io/teoriapro/?practice=';
  /* las cajas de cada nivel: [título, [[concepto, clave, clave…], …]]. Las claves, las de los ejercicios de las fichas
     (GE: teoriaathome, PP_CAT; GP: teoriapro, el catálogo PRO, el repaso y los tipo test del libro) */
  var MAPA = {
    ge: [
      ['Tonalidades', [['Armadura → tonalidad', 'ton_arm_tono'], ['Tonalidad → armadura', 'ton_tono_arm'], ['Tonos vecinos', 'ton_vecinos']]],
      ['Intervalos', [['Clasificar', 'int_clasif'], ['Construir', 'int_constr'], ['Semitonos', 'semitonos'], ['Invertir (simples)', 'inv_simples'], ['Invertir (compuestos)', 'inv_compuestos']]],
      ['Claves y notas', [['Nombrar la nota', 'cla_a'], ['Colocar la clave', 'cla_b'], ['Enarmonías', 'ena_a'], ['Enarmonía avanzada', 'ena_avanzado']]],
      ['Escalas', [['Escalas mayores', 'esc_mayor'], ['Escalas menores', 'esc_menor'], ['Otras escalas', 'esc_otras'], ['Grados', 'gra_senalar']]],
      ['Acordes', [['Identificar y construir', 'acordes'], ['Inversión · identificar', 'aco_identificar'], ['Inversión · construir', 'aco_construir'], ['Cadencias', 'cadencias_quiz']]],
      ['Compás y signos', [['Analizar el compás', 'com_clasif'], ['Abreviaciones', 'abrev_quiz'], ['Notas de adorno', 'adorno_quiz'], ['Términos', 'terminos']]]
    ],
    gp: [
      ['Modos y escalas', [['Modos', 'modos'], ['Escalas mayores', 'escala_mayor'], ['Escalas menores', 'escala_menor'], ['Otras escalas', 'escala_otras']]],
      ['Tonalidades', [['Indica la tonalidad', 'ton_nombre'], ['Indica la armadura', 'ton_armadura'], ['Tonos vecinos', 'ton_vecinos'], ['Enarmonías', 'enarmoniapro']]],
      ['Intervalos y acordes', [['Identificar intervalos', 'intervalos_id'], ['Construir intervalos', 'intervalos_build'], ['Inversión de intervalos', 'inversion_int_simples', 'inversion_int_compuestos'], ['Acordes', 'acordes_id', 'acordes_build', 'acordespro_id', 'acordespro_build'], ['Inversión de acordes', 'inversion_aco_identifica', 'inversion_aco_construir']]],
      ['Armonía y transporte', [['Cadencias', 'cadencias'], ['Modulación', 'modulacion', 'test_8_1', 'test_8_2', 'test_8_3'], ['Transporte', 'transporte_escrito', 'transporte_mental', 'test_9_1', 'test_9_2'], ['Las diferencias', 'transporte_resumen']]],
      ['Compases y ritmo', [['Compases · elegir', 'comp_elegir'], ['Compases · rellenar', 'comp_rellenar'], ['Compases · replicar', 'comp_replicar'], ['Compases poco habituales', 'test_1_2'], ['GVE en varios pulsos', 'test_5_2']]],
      ['Acústica', [['Índice acústico', 'indice'], ['Serie armónica', 'seriearmonica', 'test_2_3'], ['Duración e intensidad', 'test_2_1'], ['Altura y timbre', 'test_2_2']]],
      ['Siglo XX', [['Atonalidad', 'test_3_1'], ['Dodecafonismo', 'test_3_2', 'dode_construir', 'dode_completa', 'dode_identifica'], ['Música estocástica', 'test_3_3'], ['Música concreta', 'test_4_2'], ['Nuevas grafías', 'test_4_3']]],
      ['Grabación y estilos', [['Fonógrafo', 'test_1_1'], ['Magnetófono', 'test_4_1'], ['El blues', 'test_5_1', 'blues'], ['Géneros afrolatinos', 'ex_afro']]]
    ]
  };
  var VERDE = '#4ade80', AMARILLO = '#facc15', ROJO = '#ff7a8a';
  var F = '"Inter","Helvetica Neue",Helvetica,Arial,system-ui,sans-serif';
  var CW = 1600, CH = 1000;   /* el lienzo del mapa (horizontal); se escala a la pantalla */

  function el(tag, cls, padre, txt) { var e = D.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; if (padre) padre.appendChild(e); return e; }
  function sv(tag, at, padre) { var e = D.createElementNS('http://www.w3.org/2000/svg', tag); for (var k in at) e.setAttribute(k, at[k]); if (padre) padre.appendChild(e); return e; }
  function grupoTxt(g, nivel) {
    var m = /^\s*(\d+)\s*(gp)?\s*([a-z])\s*$/i.exec(String(g || ''));
    if (!m) return nivel === 'gp' ? 'Grado profesional' : 'Grado elemental';
    return m[1] + '.º ' + (m[2] ? 'GP ' : '') + m[3].toUpperCase();
  }

  var CSS = '' +
    '#lmm{position:fixed;inset:0;z-index:2147483000;background:#070b18;color:#e8eef5;font-family:' + F + ';overflow:auto;-webkit-font-smoothing:antialiased}' +
    '#lmm *{box-sizing:border-box;margin:0;padding:0}' +
    '#lmm .lmm-rej{position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(120,140,220,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(120,140,220,.05) 1px,transparent 1px);background-size:40px 40px}' +
    '#lmm .lmm-l{position:absolute;left:0;top:0;width:' + CW + 'px;height:' + CH + 'px;transform-origin:0 0}' +
    '#lmm .lmm-cab{position:absolute;left:40px;top:34px;right:40px;display:flex;align-items:center;gap:22px}' +
    '#lmm .lmm-atras{width:58px;height:58px;flex:none;border-radius:16px;border:1.5px solid #2a3570;background:#0e1430;color:#e8eef5;font:600 30px/1 ' + F + ';cursor:pointer;display:flex;align-items:center;justify-content:center}' +
    '#lmm .lmm-atras:hover{border-color:#ec4899}' +
    '#lmm .lmm-tt{flex:1;min-width:0}' +
    '#lmm .lmm-tt h1{font:800 38px/1.1 ' + F + ';letter-spacing:-.01em;color:#fff}' +
    '#lmm .lmm-tt p{font:500 19px/1.3 ' + F + ';color:#8f9bc4;margin-top:6px}' +
    '#lmm .lmm-ley{display:flex;flex-wrap:wrap;gap:8px 22px;justify-content:flex-end;font:500 17px/1 ' + F + ';color:#c3cbe3}' +
    '#lmm .lmm-ley span{display:inline-flex;align-items:center;gap:9px;white-space:nowrap}' +
    '#lmm .lmm-luz{width:16px;height:16px;border-radius:50%;flex:none;display:inline-block}' +
    '#lmm .lmm-luz.off{background:transparent;border:2px solid #2f3a66}' +
    '#lmm svg.lmm-pistas{position:absolute;left:0;top:0;width:' + CW + 'px;height:' + CH + 'px;overflow:visible}' +
    '#lmm .lmm-pista{fill:none;stroke:#ec4899;stroke-opacity:.55;stroke-width:2.5}' +
    '#lmm .lmm-pista.off{stroke:#3a4677;stroke-opacity:.8;stroke-dasharray:6 7}' +
    '#lmm .lmm-chispa{fill:none;stroke:#ffd6ea;stroke-width:3.5;stroke-linecap:round}' +
    '#lmm:not(.lmm-movil){overflow:hidden}' +
    '#lmm .lmm-centro{position:absolute;display:flex;align-items:center;justify-content:center;border:2.5px solid #ec4899;border-radius:22px;background:#1a0f2c;box-shadow:0 0 46px rgba(236,72,153,.35),inset 0 0 24px rgba(236,72,153,.12);font:800 60px/1 ' + F + ';color:#fff;letter-spacing:-.01em}' +
    '#lmm .lmm-caja{position:absolute;border:1.5px solid #2a3570;border-radius:20px;background:#0f1530;padding:22px 26px}' +
    '#lmm .lmm-caja.vacia{border-style:dashed;background:rgba(15,21,48,.55)}' +
    '#lmm .lmm-caja.fuerte{border-color:rgba(74,222,128,.75)}' +
    '#lmm .lmm-caja.repasar{border-color:rgba(255,122,138,.8)}' +
    '#lmm .lmm-ct{font:800 16px/1 ' + F + ';letter-spacing:.2em;text-transform:uppercase;color:#ff6fae;margin-bottom:12px}' +
    '#lmm .lmm-caja.vacia .lmm-ct{color:#56608c}' +
    '#lmm .lmm-placa{position:absolute;right:22px;top:-15px;font:800 13px/1 ' + F + ';letter-spacing:.16em;text-transform:uppercase;padding:7px 13px;border-radius:999px;background:#0b1026;border:1.5px solid currentColor}' +
    '#lmm .lmm-placa.f{color:' + VERDE + '}#lmm .lmm-placa.r{color:' + ROJO + '}' +
    '#lmm .lmm-fila{display:flex;align-items:center;gap:13px;font:500 21px/1.2 ' + F + ';color:#eef2fb;height:var(--lmm-fh,40px)}' +
    /* GP: ocho cajas, más justas */
    '#lmm.lmm-gp .lmm-caja{padding:16px 22px}#lmm.lmm-gp .lmm-ct{font-size:14px;margin-bottom:8px}#lmm.lmm-gp .lmm-fila{font-size:19px;gap:11px}' +
    '#lmm.lmm-gp .lmm-luz{width:14px;height:14px}#lmm.lmm-gp .lmm-prac{font-size:14px;padding:5px 11px}' +
    '#lmm .lmm-fila.off{color:#5d6894}' +
    '#lmm .lmm-fila span{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '#lmm .lmm-prac{flex:none;display:inline-flex;align-items:center;gap:6px;font:700 16px/1 ' + F + ';color:' + ROJO + ';border:1.5px solid ' + ROJO + ';border-radius:999px;padding:7px 14px;text-decoration:none;background:transparent}' +
    '#lmm .lmm-prac:hover{background:' + ROJO + ';color:#1a0d16}' +
    '#lmm .lmm-pie{position:absolute;left:26px;bottom:18px;font:500 15px/1 ' + F + ';color:#56608c}' +
    '#lmm .lmm-msj{position:absolute;left:0;right:0;top:46%;text-align:center;font:600 22px/1.4 ' + F + ';color:#9aa6c8}' +
    '#lmm .lmm-msj button{margin-top:18px;font:700 17px/1 ' + F + ';color:#fff;background:#ec4899;border:0;border-radius:999px;padding:12px 22px;cursor:pointer}' +
    '#lmm .lmm-nota{position:absolute;left:0;right:0;bottom:22px;text-align:center;font:500 15px/1 ' + F + ';color:#56608c}' +
    /* móvil: en columna, sin pistas */
    '#lmm.lmm-movil .lmm-l{position:relative;width:auto;height:auto;transform:none!important;padding:18px 16px 34px}' +
    '#lmm.lmm-movil .lmm-cab{position:relative;left:auto;top:auto;right:auto;flex-wrap:wrap;gap:12px}' +
    '#lmm.lmm-movil .lmm-atras{width:46px;height:46px;font-size:24px;border-radius:13px}' +
    '#lmm.lmm-movil .lmm-tt h1{font-size:26px}#lmm.lmm-movil .lmm-tt p{font-size:14px}' +
    '#lmm.lmm-movil .lmm-ley{justify-content:flex-start;font-size:13px;gap:8px 14px;width:100%}#lmm.lmm-movil .lmm-luz{width:12px;height:12px}' +
    '#lmm.lmm-movil svg.lmm-pistas{display:none}' +
    '#lmm.lmm-movil .lmm-centro{position:relative;left:auto!important;top:auto!important;width:auto!important;height:64px!important;margin:20px 0 22px;font-size:32px;border-radius:16px}' +
    '#lmm.lmm-movil .lmm-caja{position:relative;left:auto!important;top:auto!important;width:auto!important;height:auto!important;margin-bottom:18px;padding:18px 18px 16px}' +
    '#lmm.lmm-movil .lmm-ct{font-size:13px}#lmm.lmm-movil .lmm-fila{font-size:17px;height:36px}' +
    '#lmm.lmm-movil .lmm-pie{position:static;margin-top:6px;font-size:13px}#lmm.lmm-movil .lmm-prac{font-size:14px;padding:6px 11px}' +
    '#lmm.lmm-movil .lmm-msj{position:static;margin-top:60px}#lmm.lmm-movil .lmm-nota{position:static;margin-top:8px}' +
    '@media (prefers-reduced-motion:reduce){#lmm .lmm-chispa{display:none}}';
  var QUIETO = false; try { QUIETO = W.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  /* la luz de un concepto: la media de las 3 últimas veces de sus claves (si tiene varias, juntas, cada una con sus veces, hasta 3) */
  function luzDe(claves, por) {
    var s = 0, n = 0;
    claves.forEach(function (k) { var c = por[k]; if (!c || c.media3 == null) return; var v = Math.min(3, +c.veces || 1); s += (+c.media3) * v; n += v; });
    if (!n) return null;
    var m = s / n;
    return { m: m, col: m >= 0.7 ? 'v' : (m >= 0.5 ? 'a' : 'r') };
  }
  var COL = { v: VERDE, a: AMARILLO, r: ROJO };

  /* dónde va cada caja en el lienzo y por dónde sale su pista del centro */
  function colocar(nivel, n) {
    var izq = Math.ceil(n / 2), der = n - izq, top0 = 138, alto = CH - top0 - 40, gap = nivel === 'gp' ? 14 : 30;
    var hI = (alto - gap * (izq - 1)) / izq, hD = der ? (alto - gap * (der - 1)) / der : 0, bw = 470;
    var pos = [];
    for (var i = 0; i < izq; i++) pos.push({ x: 40, y: top0 + i * (hI + gap), w: bw, h: hI, lado: 'i' });
    for (var j = 0; j < der; j++) pos.push({ x: CW - 40 - bw, y: top0 + j * (hD + gap), w: bw, h: hD, lado: 'd' });
    return pos;
  }
  function pistas(svg, pos, cajas, centro) {
    var cx = centro.x + centro.w / 2, y0 = centro.y, y1 = centro.y + centro.h;
    ['i', 'd'].forEach(function (lado) {
      var L = pos.map(function (p, i) { return { p: p, i: i }; }).filter(function (o) { return o.p.lado === lado; });
      var arriba = L.filter(function (o) { return o.p.y + o.p.h / 2 < y0 + 8; }).sort(function (a, b) { return (b.p.y) - (a.p.y); });   /* de la más cercana al centro a la más lejana */
      var abajo = L.filter(function (o) { return o.p.y + o.p.h / 2 > y1 - 8; }).sort(function (a, b) { return a.p.y - b.p.y; });
      var medio = L.filter(function (o) { return arriba.indexOf(o) < 0 && abajo.indexOf(o) < 0; });
      var sg = lado === 'i' ? -1 : 1, borde = lado === 'i' ? centro.x : centro.x + centro.w;
      function puerto(k) { return cx + sg * (centro.w / 2 - 34 - k * 44); }   /* la más cercana sale más hacia fuera (no se cruzan) */
      arriba.forEach(function (o, k) { var yb = o.p.y + Math.min(o.p.h / 2, 110), xb = lado === 'i' ? o.p.x + o.p.w : o.p.x, xp = puerto(k); traza(svg, 'M' + xp + ' ' + y0 + ' V' + yb + ' H' + xb, cajas[o.i]); });
      abajo.forEach(function (o, k) { var yb = o.p.y + Math.min(o.p.h / 2, 110), xb = lado === 'i' ? o.p.x + o.p.w : o.p.x, xp = puerto(k); traza(svg, 'M' + xp + ' ' + y1 + ' V' + yb + ' H' + xb, cajas[o.i]); });
      medio.forEach(function (o) { var yb = Math.max(y0 + 18, Math.min(y1 - 18, o.p.y + o.p.h / 2)), xb = lado === 'i' ? o.p.x + o.p.w : o.p.x; traza(svg, 'M' + borde + ' ' + yb + ' H' + xb, cajas[o.i]); });
    });
  }
  function traza(svg, d, caja) {
    var on = caja.hechos > 0, p = sv('path', { d: d, 'class': 'lmm-pista' + (on ? '' : ' off') }, svg);
    if (!on) return;
    var l = 0; try { l = p.getTotalLength(); } catch (e) {}
    if (!l) return;
    if (QUIETO) return;
    /* la corriente: un trazo corto que sale del centro y recorre la pista hasta la caja, una y otra vez */
    var ch = sv('path', { d: d, 'class': 'lmm-chispa' }, svg);
    ch.style.strokeDasharray = '16 ' + Math.round(l + 60);
    try {
      ch.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -Math.round(l + 40) }],
                 { duration: Math.round(1400 + l * 2.4), iterations: Infinity, delay: -Math.round(Math.random() * 2000), easing: 'linear' });
    } catch (e) { ch.parentNode.removeChild(ch); }
  }

  function pinta(raiz, datos) {
    var nivel = datos.nivel === 'gp' ? 'gp' : 'ge', por = {};
    (datos.conceptos || []).forEach(function (c) { if (c && c.key) por[c.key] = c; });
    var L = raiz.querySelector('.lmm-l');
    var sub = raiz.querySelector('.lmm-tt p'); if (sub) sub.textContent = grupoTxt(datos.grupo, nivel) + ' · cada luz es un concepto de las fichas';
    Array.prototype.slice.call(L.querySelectorAll('.lmm-msj,.lmm-caja,.lmm-centro,svg.lmm-pistas,.lmm-nota')).forEach(function (e) { e.parentNode.removeChild(e); });
    var defs = MAPA[nivel], pos = colocar(nivel, defs.length);
    raiz.classList.toggle('lmm-gp', nivel === 'gp');
    var cajas = defs.map(function (d) {
      var filas = d[1].map(function (f) { return { t: f[0], claves: f.slice(1), luz: luzDe(f.slice(1), por) }; });
      var hechas = filas.filter(function (f) { return f.luz; });
      var media = hechas.length ? hechas.reduce(function (s, f) { return s + f.luz.m; }, 0) / hechas.length : null;
      return { t: d[0], filas: filas, hechos: hechas.length, media: media, rojas: hechas.filter(function (f) { return f.luz.col === 'r'; }).length };
    });
    /* «★ Tu fuerte»: la caja con mejor media (al menos dos conceptos hechos, sin rojos, 85 % o más). «A repasar»: la de peor media
       entre las que tienen algo en rojo */
    var fuerte = null, repasar = null;
    cajas.forEach(function (c) {
      if (c.hechos >= 2 && !c.rojas && c.media >= 0.85 && (!fuerte || c.media > fuerte.media)) fuerte = c;
      if (c.rojas && (!repasar || c.media < repasar.media)) repasar = c;
    });
    var svg = sv('svg', { 'class': 'lmm-pistas', viewBox: '0 0 ' + CW + ' ' + CH, 'aria-hidden': 'true' }, L);
    var centro = { w: 320, h: 120 }; centro.x = (CW - centro.w) / 2; centro.y = 138 + (CH - 138 - 40 - centro.h) / 2;
    var ce = el('div', 'lmm-centro', L, 'Teoría');
    ce.style.left = centro.x + 'px'; ce.style.top = centro.y + 'px'; ce.style.width = centro.w + 'px'; ce.style.height = centro.h + 'px';
    var urlBase = nivel === 'gp' ? URL_GP : URL_GE;
    cajas.forEach(function (c, i) {
      var p = pos[i], b = el('div', 'lmm-caja' + (c.hechos ? '' : ' vacia') + (c === fuerte ? ' fuerte' : '') + (c === repasar ? ' repasar' : ''), L);
      b.style.left = p.x + 'px'; b.style.top = p.y + 'px'; b.style.width = p.w + 'px'; b.style.height = p.h + 'px';
      /* el alto de cada fila: lo que cabe en la caja (GE: 22+22 de margen y 28 del título; GP: 16+16 y 22) */
      var hueco = p.h - (nivel === 'gp' ? 54 : 72), fh = Math.max(24, Math.min(40, Math.floor(hueco / Math.max(4, c.filas.length))));
      b.style.setProperty('--lmm-fh', fh + 'px');
      if (c === fuerte) el('span', 'lmm-placa f', b, '★ Tu fuerte');
      else if (c === repasar) el('span', 'lmm-placa r', b, 'A repasar');
      el('div', 'lmm-ct', b, c.t);
      c.filas.forEach(function (f) {
        var r = el('div', 'lmm-fila' + (f.luz ? '' : ' off'), b), lz = el('i', 'lmm-luz' + (f.luz ? '' : ' off'), r);
        if (f.luz) lz.style.background = COL[f.luz.col];
        el('span', '', r, f.t);
        if (f.luz && f.luz.col === 'r') {
          var a = el('a', 'lmm-prac', r, 'Practicar ›'); a.href = urlBase + encodeURIComponent(f.claves[0]); a.target = '_blank'; a.rel = 'noopener';
        }
      });
      if (!c.hechos && hueco - fh * c.filas.length >= 34) el('div', 'lmm-pie', b, 'Sin ejercicios hechos');
    });
    el('div', 'lmm-nota', L, 'Cada ficha que entregas enciende o cambia estas luces');
    pistas(svg, pos, cajas, centro);
  }

  var ABIERTO = null;
  function ajusta() {
    if (!ABIERTO) return;
    var r = ABIERTO, L = r.querySelector('.lmm-l'), vw = W.innerWidth, vh = W.innerHeight;
    var movil = vw < 760 || (vw < vh && vw < 1000);
    r.classList.toggle('lmm-movil', movil);
    if (movil) { L.style.transform = ''; L.style.left = ''; L.style.top = ''; return; }
    var k = Math.min(vw / CW, vh / CH, 1.25);
    L.style.transform = 'scale(' + k.toFixed(4) + ')';
    L.style.left = Math.max(0, (vw - CW * k) / 2) + 'px'; L.style.top = Math.max(0, (vh - CH * k) / 2) + 'px';
  }
  function cerrar() {
    if (!ABIERTO) return;
    try { ABIERTO.parentNode.removeChild(ABIERTO); } catch (e) {}
    ABIERTO = null; D.documentElement.style.overflow = ABIERTO_OV || '';
    W.removeEventListener('resize', ajusta); D.removeEventListener('keydown', tecla, true);
  }
  var ABIERTO_OV = '';
  function tecla(ev) { if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); cerrar(); } }
  function abrir(op) {
    op = op || {};
    if (!D.getElementById('lmm-css')) { var st = el('style', '', D.head || D.documentElement); st.id = 'lmm-css'; st.textContent = CSS; }
    cerrar();
    var r = el('div', '', D.body); r.id = 'lmm'; r.setAttribute('role', 'dialog'); r.setAttribute('aria-label', 'Mi mapa de teoría');
    el('div', 'lmm-rej', r);
    var L = el('div', 'lmm-l', r), cab = el('div', 'lmm-cab', L);
    var at = el('button', 'lmm-atras', cab, '‹'); at.type = 'button'; at.setAttribute('aria-label', 'Volver'); at.addEventListener('click', cerrar);
    var tt = el('div', 'lmm-tt', cab); el('h1', '', tt, 'Mi mapa de teoría'); el('p', '', tt, 'Cada luz es un concepto de las fichas');
    var ley = el('div', 'lmm-ley', cab);
    [['Lo dominas', VERDE], ['En camino', AMARILLO], ['A repasar', ROJO], ['Sin ejercicios hechos', null]].forEach(function (x) {
      var s = el('span', '', ley), i = el('i', 'lmm-luz' + (x[1] ? '' : ' off'), s); if (x[1]) i.style.background = x[1]; s.appendChild(D.createTextNode(x[0]));
    });
    var m = el('div', 'lmm-msj', L, 'Cargando tu mapa…');
    ABIERTO = r; ABIERTO_OV = D.documentElement.style.overflow; D.documentElement.style.overflow = 'hidden';
    W.addEventListener('resize', ajusta); D.addEventListener('keydown', tecla, true); ajusta();
    var carga = function () {
      Promise.resolve().then(function () { return typeof op.cargar === 'function' ? op.cargar() : op.datos; }).then(function (d) {
        if (ABIERTO !== r) return;
        if (!d || d.ok === false || !Array.isArray(d.conceptos)) throw new Error((d && d.error) || 'sin datos');
        pinta(r, d); ajusta();
      }).catch(function () {
        if (ABIERTO !== r) return;
        m.textContent = 'No se ha podido cargar tu mapa. Vuelve a intentarlo en un momento.';
        var b = el('button', '', el('div', '', m), 'Reintentar'); b.type = 'button';
        b.addEventListener('click', function () { m.textContent = 'Cargando tu mapa…'; carga(); });
      });
    };
    carga();
    return { cerrar: cerrar };
  }
  W.LMMapa = { abrir: abrir, cerrar: cerrar, version: '2026-10-19a', _mapa: MAPA };
})();
