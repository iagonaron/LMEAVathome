/* LM at home · EXAMEN DE RITMO (GE) Y RITMO ENTONADO (GP) · esquema + sorteo A/B + cuenta atrás
   (7-nov-2026, Iago) «La pantalla con el esquema, con el sorteo, que haya una cuenta atrás de 5 minutos que yo active…
   en ritmo entonado también la previa de la escala y el arpegio… cuando queden 5 segundos: ya puedes dar la vuelta a la
   hoja, empieza el estudio.» El sorteo se guarda en suite_sorteo_examen y lo leen las apps de corrección.
   Lo abre piel/apps/portal.js (sección 21, icono del metrónomo, solo Tester/Protester) con el material ya descifrado:
     window.LMExamenRitmo.abrir({ datos, grupos:['4A','4B'], trim, sb, anon, cuenta })   (el primero, el de la clase de ahora)
   datos = { grado:'GE'|'GP', materia:'ritmo'|'ritmo_entonado', titulo, propuestas:[{id,nombre,svg}], previa:{svg,titulo,notas:[{id,midi}]}|null }
   (7-nov, 11:10) El sorteo, con movimiento fluido (barajeo de cartas) a petición de Iago, aunque el aula vaya justa de fotogramas. */
(function () {
  'use strict';
  var ESTUDIO = 300, VUELTA = 5;
  var S = null;   /* estado de la pantalla abierta */

  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function css() {
    if (document.getElementById('lm-exr-css')) return;
    var st = el('style'); st.id = 'lm-exr-css';
    st.textContent =
      '#lm-exr{--acc:#22c98a;position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147482995;background:#fff;color:#0b1320;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;display:flex;flex-direction:column}' +
      '#lm-exr .cab{display:flex;align-items:center;justify-content:space-between;padding:12px 22px 8px;border-bottom:1.5px solid var(--acc)}' +
      '#lm-exr .lm{font-weight:900;font-size:22px;line-height:1;min-width:180px}#lm-exr .lm i{font-family:Georgia,serif;font-weight:400;color:#8a93b3;font-size:16px;margin-left:5px}' +
      '#lm-exr .lm small{display:block;font-size:8.5px;letter-spacing:.22em;color:var(--acc);font-weight:800;margin-top:4px}' +
      '#lm-exr .tit{text-align:center}#lm-exr .tit b{font-weight:900;font-size:30px}#lm-exr .tit b span{font-weight:300}' +
      '#lm-exr .tit div{font-size:11px;letter-spacing:.28em;color:var(--acc);font-weight:800;margin-top:4px}' +
      '#lm-exr .der{min-width:180px;display:flex;justify-content:flex-end;gap:6px}' +
      '#lm-exr button{font:700 13px "Helvetica Neue",Arial,sans-serif;border:1px solid #d1d5db;background:#fff;color:#0b1320;border-radius:9px;padding:8px 12px;cursor:pointer}' +
      '#lm-exr button.on{background:var(--acc);border-color:var(--acc);color:#fff}#lm-exr button:disabled{opacity:.45;cursor:default}' +
      '#lm-exr .x{width:40px;height:38px;padding:0;font-size:18px}' +
      '#lm-exr .cuerpo{flex:1;min-height:0;display:flex;gap:22px;padding:14px 22px 16px}' +
      '#lm-exr .esq{flex:1;min-width:0;display:flex;flex-direction:column;position:relative}' +
      '#lm-exr .esq .props{display:flex;gap:6px;margin-bottom:6px}' +
      '#lm-exr .lienzo{flex:1;min-height:0;display:flex;justify-content:center;align-items:flex-start}' +
      '#lm-exr .lienzo svg{max-width:100%;max-height:100%;width:auto;height:100%}' +
      '#lm-exr .pan{width:360px;display:flex;flex-direction:column;background:#f4f7f5;border-radius:16px;padding:14px}' +
      '#lm-exr .pan h3{margin:0 0 8px;font-size:11px;letter-spacing:.2em;color:#6b7280;font-weight:800}' +
      '#lm-exr ol{position:relative;list-style:none;margin:0;padding:0;flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column}' +
      '#lm-exr li{display:flex;align-items:center;justify-content:space-between;flex:1 1 0;min-height:22px;max-height:38px;margin-bottom:4px;padding:0 10px;background:#fff;border-radius:9px;border:1px solid #e5e7eb;font-size:16px;font-weight:500}' +
      '#lm-exr li .n{display:inline-block;width:24px;color:#6b7280;font-size:12px}' +
      '#lm-exr li .ab{width:34px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:15px;visibility:hidden}' +
      '#lm-exr li .ab.A{visibility:visible;background:var(--acc);color:#fff}#lm-exr li .ab.B{visibility:visible;background:#fff;color:var(--acc);box-shadow:inset 0 0 0 2px var(--acc)}' +
      '#lm-exr li{will-change:transform;box-shadow:0 1px 2px rgba(11,19,32,.08)}#lm-exr li.flash{background:#dcfce7}#lm-exr li.ya{border-color:var(--acc);box-shadow:0 0 0 2px var(--acc);font-weight:800}#lm-exr li.hecho{opacity:.45}' +
      '#lm-exr .bts{display:flex;gap:8px;margin-top:10px}#lm-exr .bts button{flex:1;padding:12px 8px;font-size:14px}' +
      '#lm-exr .go{background:var(--acc);border-color:var(--acc);color:#fff;font-weight:800;letter-spacing:.06em}' +
      '#lm-exr .res{font-size:12px;color:#6b7280;margin-top:8px;text-align:center;min-height:16px}' +
      '#lm-exr .reloj{display:none;flex:1;flex-direction:column;align-items:center;justify-content:center;gap:10px}' +
      '#lm-exr .reloj b{font-size:96px;font-weight:900;font-variant-numeric:tabular-nums;letter-spacing:.02em}' +
      '#lm-exr .reloj.ambar b{color:#d97706}#lm-exr .reloj.rojo b{color:#dc2626}#lm-exr .reloj span{font-size:13px;color:#6b7280;letter-spacing:.18em;font-weight:800}' +
      '#lm-exr .lista{display:flex;flex-direction:column;flex:1;min-height:0}#lm-exr.estudiando .lista{display:none}#lm-exr.estudiando .reloj{display:flex}' +
      '#lm-exr .velo{display:none;position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(11,19,32,.93);color:#fff;border-radius:14px;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:20px;text-align:center}' +
      '#lm-exr .velo.on{display:flex}#lm-exr .velo h2{margin:0;font-size:30px;font-weight:900}#lm-exr .velo p{margin:0;font-size:18px;opacity:.85}' +
      '#lm-exr .velo .pv{width:100%;background:#fff;border-radius:12px;padding:8px}#lm-exr .velo .pv svg{width:100%;height:auto;display:block}' +
      '#lm-exr .velo .grande{font-size:120px;font-weight:900;line-height:1}' +
      /* (7-nov, 14:57) previa interactiva: ▶ y «Siguiente» en cada etapa, ▶ por salto, 3-2-1 en azul */
      '#lm-exr .velo .pv{position:relative}#lm-exr .velo .gbts{position:relative;height:40px;margin-top:-34px}' +
      /* (16:15, Iago) «botón de play circular, discreto, azul, con el play en blanco, debajo de cada compás. Minimalista» */
      '#lm-exr .velo .gbts button{position:absolute;top:8px;left:0;transform:translateX(-50%);width:32px!important;height:32px!important;min-width:0!important;min-height:0!important;max-width:32px;padding:0!important;margin:0!important;border:0!important;border-radius:50%!important;background:var(--acc)!important;font-size:0!important;line-height:0!important;cursor:pointer;box-shadow:none!important;opacity:.9}' +
      '#lm-exr .velo .gbts button::after{content:"";position:absolute;left:12px;top:9px;width:0;height:0;border-style:solid;border-width:7px 0 7px 11px;border-color:transparent transparent transparent #fff}' +
      '#lm-exr .velo .gbts button.son{opacity:1;box-shadow:0 0 0 4px rgba(29,78,216,.25)!important}' +
      '#lm-exr .velo{overflow-y:auto}#lm-exr .velo .pv svg{max-height:34vh}' +
      '#lm-exr .velo .cinta{width:100%;overflow:hidden;background:#fff;border-radius:12px;padding:8px 0;position:relative}#lm-exr .velo .cinta-in{will-change:transform}#lm-exr .velo .cinta-clave{position:absolute;left:0;top:8px;background:#fff;pointer-events:none;z-index:1}#lm-exr .velo .cinta svg{display:block;max-height:none}' +
      /* (16:24, Iago) «el botón escuchar tiene que ser play pause… minimalista»: un solo botón redondo ▶ / ❚❚ */
      '#lm-exr .velo .pbts .p-play{position:relative;width:54px!important;height:54px!important;min-width:0!important;padding:0!important;border-radius:50%!important;background:var(--acc)!important;font-size:0!important}' +
      '#lm-exr .velo .pbts .p-play::after{content:"";position:absolute;left:21px;top:16px;border-style:solid;border-width:11px 0 11px 17px;border-color:transparent transparent transparent #fff}' +
      '#lm-exr .velo .pbts .p-play.son::after{left:19px;top:17px;width:5px;height:20px;border:0;background:#fff;box-shadow:11px 0 0 #fff}' +
      '#lm-exr .velo .pbts .p-play.carga{opacity:.55}' +
      '#lm-exr .velo .mtz{display:flex;align-items:center;justify-content:center;gap:34px;padding:22px 10px;color:#0b1320}#lm-exr .velo .mtz i{font:italic 700 46px/1 Georgia,"Times New Roman",serif}' +
      '#lm-exr .velo .mtz span{display:inline-block;width:110px;height:34px;position:relative}#lm-exr .velo .mtz span::before,#lm-exr .velo .mtz span::after{content:"";position:absolute;left:0;right:0;top:50%;height:2px;background:#0b1320}' +
      '#lm-exr .velo .mtz .cre::before{transform-origin:left center;transform:rotate(-8deg)}#lm-exr .velo .mtz .cre::after{transform-origin:left center;transform:rotate(8deg)}' +
      '#lm-exr .velo .mtz .dim::before{transform-origin:right center;transform:rotate(8deg)}#lm-exr .velo .mtz .dim::after{transform-origin:right center;transform:rotate(-8deg)}' +
      '#lm-exr .velo .pbts .p-sig{font-size:18px!important;padding:12px 22px!important}' +
      '#lm-exr .velo .cinta-vid{display:block;width:100%;border-radius:12px;background:#fff}#lm-exr .velo .cinta .barra{position:absolute;width:3px;background:var(--acc);border-radius:2px;z-index:2;pointer-events:none}' +
      '#lm-exr .velo .pbts{display:flex;gap:16px;align-items:center}#lm-exr .velo .pbts button{font:800 22px/1 "Helvetica Neue",Arial,sans-serif;padding:14px 28px;border-radius:12px;border:0;cursor:pointer;background:#fff;color:#0b1320}' +
      '#lm-exr .velo .pbts .p-sig.fin{background:#16a34a;color:#fff}' +
      '#lm-exr .velo .pasos{display:flex;gap:8px}#lm-exr .velo .pasos i{width:11px;height:11px;border-radius:50%;background:rgba(255,255,255,.28)}#lm-exr .velo .pasos i.on{background:#fff}' +
      /* (7-nov-2026, 16:33, Iago) «estética minimalista y estilo el portal… el tono azul del apartado de entonación… full coherente»:
         la piel del portal at home (azul noche, tarjetas con filo fino, Helvetica) y el color de cada apartado
         (entonación #5b9dff, ritmo #22c98a, como en el portal). Las partituras, sobre papel blanco. */
      '#lm-exr{background:linear-gradient(180deg,#0b1f4d 0%,#0a1430 32%,#060a18 70%,#02030a 100%);color:#e9edff}' +
      '#lm-exr .cab{border-bottom:1px solid #1e2a52}#lm-exr .lm{color:#fff}#lm-exr .lm i{color:#aeb6d6}#lm-exr .tit b{color:#fff}' +
      '#lm-exr button{background:transparent;border:1px solid #1e2a52;color:#e9edff;border-radius:10px}#lm-exr button:hover:not(:disabled){border-color:var(--acc)}' +
      '#lm-exr button.on,#lm-exr .go{background:var(--acc);border-color:var(--acc);color:#0a1028}' +
      '#lm-exr .pan{background:#0d142e;border:1px solid #1e2a52}#lm-exr .pan h3,#lm-exr .res,#lm-exr .reloj span{color:#8b97c4}' +
      '#lm-exr li{background:#111b3d;border:1px solid #1e2a52;color:#e9edff;box-shadow:none}#lm-exr li .n{color:#8b97c4}' +
      '#lm-exr li.ya{border-color:var(--acc);box-shadow:0 0 0 1px var(--acc)}#lm-exr li.flash{background:#16234a}' +
      '#lm-exr li .ab.A{color:#0a1028}#lm-exr li .ab.B{background:transparent}' +
      '#lm-exr .reloj b{color:#fff}' +
      '#lm-exr .lienzo{background:#fff;border-radius:12px;padding:10px}' +
      '#lm-exr .velo{background:rgba(10,16,40,.97);border:1px solid #1e2a52}#lm-exr .velo{border-radius:10px}#lm-exr .velo p{color:#8b97c4;opacity:1}' +
      '#lm-exr .velo .pbts .p-sig{background:transparent!important;border:1px solid #1e2a52!important;color:#e9edff!important;border-radius:10px!important}' +
      '#lm-exr .velo .pbts .p-sig:hover{border-color:var(--acc)!important}' +
      '#lm-exr .velo .pbts .p-sig.fin{background:var(--acc)!important;border-color:var(--acc)!important;color:#fff!important;font-weight:800!important;letter-spacing:.06em}' +
      '#lm-exr .b-est{text-transform:uppercase;letter-spacing:.06em;font-weight:800}#lm-exr .b-est:not(:disabled){background:var(--acc)!important;border-color:var(--acc)!important;color:#fff!important}' +
      '#lm-exr .velo .gbts button.son{box-shadow:0 0 0 3px rgba(255,255,255,.55)!important}' +
      '#lm-exr .velo .pasos i{background:#1e2a52}#lm-exr .velo .pasos i.on{background:var(--acc)}' +

      '#lm-exr .c321{position:absolute;top:14px;right:14px;width:190px;height:190px;z-index:6;border-radius:24px;background:var(--acc);opacity:.9;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;box-shadow:0 10px 40px rgba(0,0,0,.35)}' +
      '#lm-exr .c321 b{font:900 130px/1 "Helvetica Neue",Arial,sans-serif;animation:lmx321 .7s ease-out both}#lm-exr .c321 span{font:800 15px/1 "Helvetica Neue",Arial,sans-serif;opacity:.9}' +
      '@keyframes lmx321{from{transform:scale(1.35);opacity:0}25%{opacity:1}to{transform:scale(1);opacity:1}}' +
      '#lm-exr .grp{display:flex;gap:6px;margin-bottom:10px}#lm-exr .grp button{flex:1}' +
      '#lm-exr .pila{position:relative;width:100%;height:100%}#lm-exr .pila img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;transition:opacity 1.6s ease}' +
      '#lm-exr .rmini{display:none;position:absolute;top:6px;right:6px;padding:8px 14px;border-radius:12px;background:rgba(11,19,32,.88);color:#fff;font:800 28px/1 "Helvetica Neue",Arial,sans-serif;font-variant-numeric:tabular-nums;z-index:3}' +
      '#lm-exr .rmini.ambar{background:#d97706}#lm-exr .rmini.rojo{background:#dc2626}#lm-exr.conpartitura .pan{display:none}#lm-exr.conpartitura .rmini{display:block}#lm-exr.conpartitura .props{visibility:hidden}' +
      '#lm-exr .reloj.pausa b,#lm-exr .rmini.pausa{opacity:.45}#lm-exr .reloj b,#lm-exr .rmini{cursor:pointer}#lm-exr.clase .velo{position:absolute;inset:0}#lm-exr.clase .esq{flex:1}#lm-exr-reloj{position:fixed;bottom:calc(14px + env(safe-area-inset-bottom,0px));right:calc(14px + env(safe-area-inset-right,0px));z-index:2147483600;padding:10px 18px;border-radius:12px;background:rgba(13,20,46,.92);border:1px solid #1e2a52;color:#fff;font:800 40px/1 "Helvetica Neue",Arial,sans-serif;font-variant-numeric:tabular-nums;cursor:pointer;box-shadow:0 6px 24px rgba(0,0,0,.35)}#lm-exr-reloj.ambar{background:#d97706}#lm-exr-reloj.rojo{background:#dc2626}#lm-exr-reloj.pausa{opacity:.45}#lm-exr .sig{display:none}#lm-exr.llamando .sig{display:flex}';
    document.head.appendChild(st);
  }

  /* ---------- sonido (la previa) ---------- */
  var AC = null;
  function tono(midi, dur, vol) {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.resume) AC.resume();
      var t = AC.currentTime, o = AC.createOscillator(), o2 = AC.createOscillator(), g = AC.createGain();
      o.type = 'triangle'; o2.type = 'sine'; o.frequency.value = o2.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.3, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.95);
      o.connect(g); o2.connect(g); g.connect(AC.destination); o.start(t); o2.start(t); o.stop(t + dur); o2.stop(t + dur);
    } catch (e) {}
  }
  /* (7-nov 17:00, Iago) el 3-2-1 «más sonido digital neutro, sin más», ni percutido ni fuerte: un bip de onda pura, suave. */
  function bip(alto) {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.resume) AC.resume();
      var t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
      o.type = 'sine'; o.frequency.value = alto ? 1046.5 : 880;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.09, t + 0.012); g.gain.setValueAtTime(0.09, t + 0.07); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + 0.18);
    } catch (e) {}
  }
  /* (7-nov-2026, 16:07, Iago) «Quiero que la previa sea con sonido de piano, de calidad»: el mismo piano de los dictados
     (soundfont-player · acoustic_grand_piano). Se carga al entrar en la previa (sin sonar); si no llega, el tono de siempre. */
  var PIANO = null, PIANO_P = null, COMP = null;
  /* (17:26, Iago) «el piano igual para todas las fases… muy bajo»: más ganancia y un compresor suave delante para que no sature */
  function salidaPiano() {
    if (COMP) return COMP;
    try { COMP = AC.createDynamicsCompressor(); COMP.threshold.value = -14; COMP.knee.value = 10; COMP.ratio.value = 4; COMP.attack.value = 0.004; COMP.release.value = 0.25;
      var g = AC.createGain(); g.gain.value = 1.5; COMP.connect(g); g.connect(AC.destination); } catch (e) { COMP = AC.destination; }
    return COMP;
  }
  function piano() {
    if (PIANO_P) return PIANO_P;
    PIANO_P = new Promise(function (ok) {
      try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return ok(null); }
      var va = function () { try { window.Soundfont.instrument(AC, 'acoustic_grand_piano', { gain: 10, destination: salidaPiano() }).then(function (i) { PIANO = i; ok(i); }, function () { ok(null); }); } catch (e) { ok(null); } };
      if (window.Soundfont) return va();
      var sc = document.createElement('script'); sc.src = 'https://cdn.jsdelivr.net/npm/soundfont-player@0.12.0/dist/soundfont-player.min.js';
      sc.onload = va; sc.onerror = function () { ok(null); }; document.head.appendChild(sc);
      setTimeout(function () { ok(PIANO); }, 12000);
    });
    return PIANO_P;
  }
  function nota(midi, dur, vol) {
    if (PIANO && AC) { try { if (AC.resume) AC.resume(); PIANO.play(midi, AC.currentTime, { duration: Math.max(0.2, dur), release: 0.08, gain: (vol || 0.3) / 0.3 }); return; } catch (e) {} }
    tono(midi, dur, vol);
  }
  /* (7-nov, 11:11, Iago) «incluso con soniditos»: ruido filtrado para las cartas (mezcla y reparto) */
  var RUIDO = null;
  function ruido(cuando, dur, frec, vol, q) {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.resume) AC.resume();
      if (!RUIDO) { RUIDO = AC.createBuffer(1, AC.sampleRate, AC.sampleRate); var d = RUIDO.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
      var t = AC.currentTime + (cuando || 0), src = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
      src.buffer = RUIDO; f.type = 'bandpass'; f.frequency.value = frec; f.Q.value = q || 1.2;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(f); f.connect(g); g.connect(AC.destination); src.start(t, Math.random() * 0.5); src.stop(t + dur + 0.02);
    } catch (e) {}
  }
  /* (7-nov-2026, 16:33, Iago) «los soniditos… cógelos de Splice»: sonidos de su librería de Splice (piel/examenes/sonidos/);
     si alguno no carga, el sonido sintetizado de antes. */
  var BASE_SFX = (function () { try { var c = document.currentScript && document.currentScript.src; if (c) return c.replace(/[^\/]*(\?.*)?$/, '') + 'sonidos/'; } catch (e) {} return 'https://ge.lmathome.es/piel/examenes/sonidos/'; })();
  var SFX = {}, SFX_P = null;
  function cargaSfx() {
    if (SFX_P) return SFX_P;
    try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return Promise.resolve(); }
    SFX_P = Promise.all(['mezcla', 'corte', 'reparto', 'tic', 'inicio', 'fin'].map(function (n) {
      return fetch(BASE_SFX + n + '.mp3').then(function (r) { if (!r.ok) throw 0; return r.arrayBuffer(); })
        .then(function (b) { return new Promise(function (ok) { AC.decodeAudioData(b, function (buf) { SFX[n] = buf; ok(); }, function () { ok(); }); }); })
        .catch(function () {});
    }));
    return SFX_P;
  }
  function sfx(n, vol, rate) {
    var b = SFX[n]; if (!b || !AC) return false;
    try { if (AC.resume) AC.resume(); var src = AC.createBufferSource(), g = AC.createGain(); src.buffer = b; if (rate) src.playbackRate.value = rate;
      g.gain.value = vol == null ? 0.8 : vol; src.connect(g); g.connect(AC.destination); src.start(); return true; } catch (e) { return false; }
  }
  function sonMezcla() { if (sfx('mezcla', 0.05, 0.94 + Math.random() * 0.12)) return; for (var i = 0; i < 26; i++) ruido(i * 0.013 + Math.random() * 0.004, 0.025, 2500 + Math.random() * 2500, 0.22, 2); }   /* trrrr de las cartas */
  function sonCorte() { if (sfx('corte', 0.05)) return; ruido(0, 0.12, 1200, 0.18, 0.8); }
  function sonReparto() { if (sfx('reparto', 0.045, 0.95 + Math.random() * 0.15)) return; ruido(0, 0.09, 3500, 0.16, 0.7); }   /* fsst de una carta al caer */
  function espera(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  /* ---------- Supabase ---------- */
  function rpc(fn, args) {
    return fetch(S.sb + '/rest/v1/rpc/' + fn, { method: 'POST', cache: 'no-store',
      headers: { apikey: S.anon, Authorization: 'Bearer ' + S.anon, 'Content-Type': 'application/json' }, body: JSON.stringify(args) })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
  }
  function nombres(lista) {   /* nombre; con la inicial del apellido si dos se llaman igual */
    var c = {}; lista.forEach(function (a) { c[a.nombre] = (c[a.nombre] || 0) + 1; });
    lista.forEach(function (a) { a.ver = a.nombre + (c[a.nombre] > 1 && a.apellidos ? ' ' + String(a.apellidos).trim().charAt(0) + '.' : ''); });
    var c2 = {}; lista.forEach(function (a) { c2[a.ver] = (c2[a.ver] || 0) + 1; });
    lista.forEach(function (a) { if (c2[a.ver] > 1 && a.apellidos) a.ver = a.nombre + ' ' + String(a.apellidos).trim().split(/\s+/)[0]; });
  }

  /* ---------- pantalla ---------- */
  function abrir(o) {
    cerrar(); css(); cargaSfx();
    S = { ensayo: !!o.ensayo, d: o.datos, grupos: o.grupos || [o.grupo], grupo: (o.grupos || [o.grupo])[0], trim: o.trim || '1T', sb: o.sb, anon: o.anon, cuenta: o.cuenta, prop: 0, alumnos: [], orden: null, fase: 'sorteo', id: 0, llamando: -1 };
    var d = S.d, gp = d.grado === 'GP';
    var sinAB = d.materia === 'entonacion'; S.sinAB = sinAB;   /* la entonación de GE es una sola lección: solo orden */
    var raiz = el('div'); raiz.id = 'lm-exr'; if (sinAB) raiz.style.setProperty('--acc', '#5b9dff'); raiz.setAttribute('role', 'dialog'); raiz.setAttribute('aria-modal', 'true');
    raiz.innerHTML =
      '<div class="cab"><div class="lm">LM<i>at home</i><small>' + (gp ? 'GRADO PROFESIONAL' : 'GRADO ELEMENTAL') + '</small></div>' +
      '<div class="tit"><b>' + (d.materia === 'entonacion' ? 'ENTON<span>ACIÓN</span>' : gp ? 'RITMO <span>ENTONADO</span>' : 'RITMO') + '</b><div>EXAMEN · ' + ({ '1T': '1.ER', '2T': '2.º', '3T': '3.ER' }[S.trim] || S.trim) + ' TRIMESTRE · <span class="g"></span></div></div>' +
      '<div class="der"><button class="x" title="Cerrar (Esc)">✕</button></div></div>' +
      '<div class="cuerpo"><div class="esq"><div class="props"></div><div class="lienzo"></div>' +
      '<div class="velo"></div><div class="rmini"></div></div>' +
      '<div class="pan"><div class="lista"><div class="grp"></div><h3>' + (sinAB ? 'ORDEN · SORTEO' : 'SORTEO A / B') + '</h3><ol></ol>' +
      '<div class="bts"><button class="go b-sor">SORTEAR</button><button class="b-est">Iniciar estudio</button></div>' +
      '<div class="bts sig"><button class="b-sig">Siguiente alumno →</button></div><div class="res"></div></div>' +
      '<div class="reloj"><span>ESTUDIO</span><b>5:00</b><button class="b-fin">Terminar ya</button></div></div></div>';
    document.body.appendChild(raiz); S.raiz = raiz;
    raiz.querySelector('.x').onclick = cerrar;
    raiz.querySelector('.b-sor').onclick = sortear;
    raiz.querySelector('.b-est').onclick = estudio;
    raiz.querySelector('.b-sig').onclick = siguiente;
    raiz.querySelector('.b-fin').onclick = function () { S.finYa = true; };
    document.addEventListener('keydown', teclas, true);
    pintaProps(); pintaEsquema(); cargar();
  }
  /* (7-nov-2026, Iago) solo la columna del grupo activo (el de la clase de ahora); selector para el otro */
  function pintaGrupos() {
    var c = S.raiz.querySelector('.grp'); c.innerHTML = '';
    S.raiz.querySelector('.tit .g').textContent = S.grupo;
    if (S.grupos.length < 2) return;
    S.grupos.forEach(function (g) { var b = el('button', g === S.grupo ? 'on' : '', esc(g)); b.onclick = function () { if (g === S.grupo) return; S.id++; S.grupo = g; S.llamando = -1; S.raiz.classList.remove('llamando', 'estudiando'); cargar(); }; c.appendChild(b); });
  }
  function cargar() {
    var raiz = S.raiz, d = S.d, id = S.id; pintaGrupos(); S.alumnos = []; S.orden = []; pintaLista();
    raiz.querySelector('.b-sor').textContent = 'SORTEAR'; raiz.querySelector('.b-sor').disabled = false; raiz.querySelector('.b-est').disabled = false;
    res('Cargando el grupo…');
    rpc('suite_sorteo_examen_lista', { p_cuenta_id: S.cuenta, p_grupo: S.grupo, p_materia: d.materia }).then(function (r) {
      if (!S || id !== S.id) return;
      if (!r || !r.ok) { res('No se ha podido cargar el grupo (' + ((r && r.error) || 'error') + ').'); return; }
      S.alumnos = r.alumnos || []; nombres(S.alumnos);
      if (r.sorteo && r.sorteo.filas && r.sorteo.filas.length) {
        var por = {}; S.alumnos.forEach(function (a) { por[a.id] = a; });
        S.orden = r.sorteo.filas.map(function (f) { var a = por[f.id] || { id: f.id, nombre: f.nombre, ver: f.nombre }; return { a: a, ab: f.modelo }; });
        S.alumnos.forEach(function (a) { if (!S.orden.some(function (x) { return x.a.id === a.id; })) S.orden.push({ a: a, ab: null }); });
        pintaLista(); res('Sorteo ya hecho · ' + new Date(r.sorteo.creado_en).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'numeric' }));
        raiz.querySelector('.b-sor').textContent = 'REPETIR SORTEO';
      } else { S.orden = S.alumnos.map(function (a) { return { a: a, ab: null }; }); pintaLista(); res(S.alumnos.length + ' alumnos · sin sortear'); }
    }).catch(function () { res('Sin conexión con la base de datos.'); });
  }
  function cerrar() {
    if (!S) return; S.id++; document.removeEventListener('keydown', teclas, true);
    if (S.raiz && S.raiz.parentNode) S.raiz.parentNode.removeChild(S.raiz); S = null;
  }
  function teclas(e) {
    if (e.key === 'Escape' && S) { e.preventDefault(); e.stopPropagation(); cerrar(); return; }
    if (S && S.pv) {   /* previa interactiva: espacio = ▶ · → / AvPág = siguiente · ← / RePág = anterior (el mando del aula) */
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); S.pv.play(); }
      else if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); e.stopPropagation(); S.pv.sig(); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); e.stopPropagation(); S.pv.ant(); }
    }
  }
  function res(t) { if (S) S.raiz.querySelector('.res').textContent = t; }
  function pintaProps() {
    var c = S.raiz.querySelector('.props'), ps = S.d.propuestas;
    if (ps.length < 2) { c.style.display = 'none'; return; }
    c.innerHTML = ''; ps.forEach(function (p, i) { var b = el('button', i === S.prop ? 'on' : '', esc(p.nombre)); b.onclick = function () { S.prop = i; pintaProps(); pintaEsquema(); }; c.appendChild(b); });
  }
  function pintaEsquema() {
    var p = S.d.propuestas[S.prop], c = S.raiz.querySelector('.lienzo');
    if (p.img) c.innerHTML = '<div class="pila"><img class="i-esq" alt="" draggable="false" src="' + p.img + '">' + (p.partitura ? '<img class="i-par" alt="" draggable="false" style="opacity:0" src="' + p.partitura + '">' : '') + '</div>';
    else c.innerHTML = p.svg;
  }
  function pintaLista(flash) {
    var ol = S.raiz.querySelector('ol'); ol.innerHTML = '';
    S.orden.forEach(function (x, i) {
      var li = el('li', (flash && flash[i] ? 'flash' : '') + (i === S.llamando ? ' ya' : '') + (S.llamando > i ? ' hecho' : ''),
        '<span><span class="n">' + (i + 1) + '</span>' + esc(x.a.ver || x.a.nombre) + '</span><span class="ab ' + (x.ab || '') + '">' + (x.ab || '') + '</span>');
      ol.appendChild(li);
    });
  }
  function baraja(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  var armado = 0;
  function sortear() {
    var b = S.raiz.querySelector('.b-sor');
    if (!S.alumnos.length) return;
    if (S.orden.some(function (x) { return x.ab; }) && Date.now() - armado > 3000) {
      armado = Date.now(); b.textContent = '¿SEGURO? PULSA OTRA VEZ';
      setTimeout(function () { if (S && Date.now() - armado >= 3000) b.textContent = 'REPETIR SORTEO'; }, 3100); return;
    }
    armado = 0; var id = ++S.id; b.disabled = true; S.raiz.querySelector('.b-est').disabled = true; S.llamando = -1; S.raiz.classList.remove('llamando');
    res('Barajando…');
    var lista = S.alumnos.map(function (a) { return { a: a, ab: null }; });
    (async function () {
      /* (7-nov-2026, 11:10, Iago) «Prefiero que sea movimiento fluido… como un barajeo de nombres, como cuando las cartas se
         juntan… que se barajen y entremezclen.» 1) los nombres se juntan en un mazo, 2) se cortan y se entremezclan varias
         veces, 3) se reparten uno a uno a su sitio en el orden nuevo y les cae su letra. */
      var ol = S.raiz.querySelector('ol'), lis = [].slice.call(ol.children);
      var mazo = Math.max(0, ol.clientHeight / 2 - (lis[0] ? lis[0].offsetHeight / 2 : 0));
      var pon = function (li, x, y, r, t) { li.style.transition = t ? 'transform ' + t + 's cubic-bezier(.45,.05,.25,1)' : 'none'; li.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + r + 'deg)'; };
      var rnd = function (a) { return (Math.random() * 2 - 1) * a; };
      lis.forEach(function (li, k) { li.style.position = 'relative'; li.style.zIndex = String(k + 1); pon(li, 0, mazo - li.offsetTop, rnd(3), 0.55 + k * 0.02); });
      for (var z = 0; z < lis.length; z++) ruido(0.25 + z * 0.03, 0.06, 1800, 0.03, 1);   /* se juntan */
      await espera(750); if (id !== S.id) return;
      res('Barajando…');
      for (var v = 0; v < 4; v++) {                       /* corte y mezcla, como unas cartas */
        lis.forEach(function (li, k) { var izq = Math.random() < 0.5; pon(li, (izq ? -1 : 1) * (70 + Math.random() * 40), mazo - li.offsetTop + rnd(10), (izq ? -1 : 1) * (4 + Math.random() * 5), 0.32); });
        sonCorte(); await espera(360); if (id !== S.id) return;
        baraja(lis).forEach(function (li, k) { li.style.zIndex = String(k + 1); pon(li, rnd(6), mazo - li.offsetTop + rnd(3), rnd(3), 0.3); });
        sonMezcla();
        await espera(380); if (id !== S.id) return;
      }
      lista = baraja(lista); S.orden = lista;
      pintaLista();                                        /* el orden nuevo, pero aún todos en el mazo */
      lis = [].slice.call(ol.children);
      lis.forEach(function (li, k) { li.style.position = 'relative'; li.style.zIndex = String(100 - k); pon(li, rnd(6), mazo - li.offsetTop, rnd(3), 0); });
      void ol.offsetHeight; await espera(120);
      res(S.sinAB ? 'Repartiendo el orden…' : 'Repartiendo A / B…');
      for (var i = 0; i < lista.length; i++) {           /* se reparten uno a uno a su sitio y les cae la letra */
        if (id !== S.id) return;
        pon(lis[i], 0, 0, 0, 0.42); sonReparto();
        (function (li, x, k) { setTimeout(function () {
          x.ab = S.sinAB ? null : (k % 2 ? 'B' : 'A'); tono(S.sinAB ? 72 + (k % 5) : (k % 2 ? 76 : 72), 0.16, 0.1); var ab = li.querySelector('.ab'); if (ab) { ab.className = 'ab ' + x.ab; ab.textContent = x.ab; }
        }, 380); })(lis[i], lista[i], i);
        await espera(300);
      }
      await espera(500); if (id !== S.id) return;
      pintaLista();
      if (S.ensayo) { res('ENSAYO · este sorteo no se guarda (quita ?lmensayo de la dirección para el de verdad)'); b.disabled = false; b.textContent = 'REPETIR SORTEO'; S.raiz.querySelector('.b-est').disabled = false; return; }
      res('Guardando…');
      try {
        var r = await rpc('suite_sorteo_examen_guardar', { p_cuenta_id: S.cuenta, p_trimestre: S.trim, p_materia: S.d.materia, p_grupo: S.grupo, p_orden: lista.map(function (x) { return x.a.id; }) });
        if (!S || id !== S.id) return;
        if (!r || !r.ok) throw new Error((r && r.error) || 'error');
        var nA = Math.ceil(lista.length / 2);
        res(S.sinAB ? lista.length + ' alumnos · orden guardado: así saldrán en la app de corrección ✓' : 'A: ' + nA + ' · B: ' + (lista.length - nA) + ' · guardado: así saldrán en la app de corrección ✓');
      } catch (e) { if (S && id === S.id) res('⚠ No se ha guardado (' + e.message + '). Vuelve a sortear.'); }
      if (!S || id !== S.id) return;
      b.disabled = false; b.textContent = 'REPETIR SORTEO'; S.raiz.querySelector('.b-est').disabled = false;
    })();
  }

  /* ---------- previa / calentamiento → («da la vuelta a la hoja») → 5 minutos → vuelve el orden ----------
     (7-nov-2026, Iago) Entonación GE: «cuando le dé a iniciar estudio… se toquen los grados tonales… la escala, el arpegio,
     incluso por intervalos… la nota más aguda y la más grave… intervalos marcados (cuartas y quintas)… recuerda los matices,
     y después ya se revela la partitura y aparece la cuenta atrás… después de esos 5 minutos se desvanece la melodía, vuelve a
     quedar la estructura vacía y de nuevo aparece el orden del sorteo». */
  function etapas() { var d = S.d; return d.previas || (d.previa ? [{ titulo: d.previa.titulo, sub: 'Escala y arpegio · canta con el piano', svg: d.previa.svg, notas: d.previa.notas }] : []); }
  /* (7-nov-2026, 14:57, Iago) «Que esta secuencia no sea un vídeo, sino interactiva: yo en pantalla le voy a dar a play a cada una
     de las cosas… y un botón siguiente.» Al entrar suenan los acordes; antes de la escala, el arpegio y los intervalos, un 3-2-1
     en azul «para que los alumnos canten»; cada salto, en su compás con doble barra y con su ▶. La última etapa lleva
     «Iniciar estudio» (5:05: los 5 primeros segundos son para que se revele todo). */
  /* (7-nov-2026, 16:13, Iago) «súbele como 10 bpm a la velocidad del 3-2-1, pero que esa sea la velocidad de la negra»:
     3-2-1 a 70 por minuto y la negra de la previa a ese mismo pulso (blancas = 2 pulsos; final de grupo = nota + silencio de negra). */
  var PULSO = 60 / 80;   /* (18:33, Iago) «un poquito más rápido… que el 3-2-1 ya sea un poquito más rápido»: de 70 a 80 */
  function aPulso(et, notas) {
    var base = Math.min.apply(null, notas.map(function (n) { return n.dur; }).concat([9]));
    var uni = (notas.some(function (n) { return n.midis; }) || /extremos/i.test(et.titulo || '')) ? 2 : 1;
    return notas.map(function (n) { var k = Math.max(1, Math.round(n.dur / base)); return { id: n.id, g: n.g, midi: n.midi, midis: n.midis, dur: k * uni * PULSO }; });
  }
  function previaInteractiva(vivo) {
    var velo = S.raiz.querySelector('.velo'), ET = etapas(), i = 0, tok = 0;
    return new Promise(function (fin) {
      function marca(n, on) {
        var g = velo.querySelector('#vf-' + n.id); if (!g) return;
        var c = on ? getComputedStyle(S.raiz).getPropertyValue('--acc') : '#0b1320';
        g.querySelectorAll('path,rect').forEach(function (x) { x.style.fill = on ? c : ''; x.style.stroke = on ? c : ''; });
      }
      async function suena(notas, t, boton) {
        if (boton) boton.classList.add('son');
        for (var r = 0; r < notas.length; r++) {
          if (t !== tok || !vivo()) break;
          var n = notas[r]; marca(n, true);
          /* (16:12, Iago) «los acordes se solapan… no suenan blancas como tal»: cada figura dura lo suyo y se apaga antes de la siguiente */
          if (n.midis) n.midis.forEach(function (m) { nota(m, n.dur * 0.92, 0.3); }); else nota(n.midi, n.dur * 0.95, 0.3);
          await espera(n.dur * 1000); marca(n, false);
        }
        if (boton && t === tok) boton.classList.remove('son');
      }
      async function cuenta(t) {
        var c = el('div', 'c321'); velo.appendChild(c);
        for (var k = 3; k > 0; k--) { if (t !== tok || !vivo()) { c.remove(); return false; } c.innerHTML = '<b>' + k + '</b><span>preparados para cantar</span>'; bip(k === 1); await espera(PULSO * 1000); }
        c.remove(); return t === tok && vivo();
      }
      /* ▶ / ❚❚: si está sonando, para; si no, empieza */
      function alterna() { var b = velo.querySelector('.p-play'); if (b && b.classList.contains('son')) { tok++; velo.querySelectorAll('.son').forEach(function (x) { x.classList.remove('son'); }); var c = velo.querySelector('.c321'); if (c) c.remove(); } else play(null); }
      async function play(grupo) {
        var et = ET[i]; if (/extremos|matices/i.test(et.titulo || '')) return;
        var t = ++tok, notas = et.notas || []; if (!notas.length) return;
        if (!PIANO) { var bpl = velo.querySelector('.p-play'); if (bpl) bpl.classList.add('carga'); await piano(); if (bpl) bpl.classList.remove('carga'); if (t !== tok || !vivo()) return; }
        var btn = grupo == null ? velo.querySelector('.p-play') : velo.querySelector('.gbts [data-g="' + grupo + '"]');
        if (grupo != null) notas = notas.filter(function (n) { return n.g === grupo; }).map(function (n, k, a) { return { id: n.id, midi: n.midi, midis: n.midis, g: n.g, dur: k === a.length - 1 ? Math.max(n.dur, et.durG || 0.7) : (et.durG || n.dur) }; });
        if (btn) btn.classList.add('son');
        if (esTonica(et) && et._vid) { var vd = et._vid; try { vd.pause(); vd.currentTime = 0; } catch (e) {}
          if (et.cuenta && !(await cuenta(t))) { if (btn && t === tok) btn.classList.remove('son'); return; }
          vd.muted = true; try { await vd.play(); } catch (e) {}
          var tn = tonicaNotas(et), t0 = performance.now() - (vd.currentTime || 0) * 1000, acu = 0;
          (async function () { for (var r = 0; r < tn.length; r++) { var falta = t0 + acu * 1000 - performance.now(); if (falta > 0) await espera(falta);
            if (t !== tok || !vivo() || !vd.isConnected) return; nota(tn[r].midi, tn[r].dur * 0.95, 0.3); acu += tn[r].dur; } })();
          await new Promise(function (ok) { var iv = setInterval(function () { if (t !== tok || !vivo() || vd.ended || !vd.isConnected) { clearInterval(iv); ok(); } }, 80); });
          if (t !== tok) { try { vd.pause(); vd.currentTime = 0; } catch (e) {} }
          if (btn && t === tok) btn.classList.remove('son'); return; }
        if (esTonica(et) && et._cinta && et._cinta.dentro) { mueve(et, 0); if (et.cuenta && !(await cuenta(t))) { if (btn && t === tok) btn.classList.remove('son'); return; } await suenaCinta(et, t, btn); return; }
        notas = aPulso(et, notas);
        if (et.cuenta && !(await cuenta(t))) { if (btn && t === tok) btn.classList.remove('son'); return; }
        await suena(notas, t, btn);
      }
      function pinta() {
        tok++; var et = ET[i], ult = i === ET.length - 1, gb = '';
        /* (16:26, Iago) extremos: «no hace falta reproductor… como aviso… minimalista: ámbito de la lección»;
           matices: «sigue la misma estética»; botón final «5 minutos» (los 5 s de cortesía no se anuncian) y no verde */
        var ambito = /extremos/i.test(et.titulo || ''), matices = /matices/i.test(et.titulo || '');
        if (ambito) et = { titulo: 'Ámbito de la lección', sub: '', svg: et.svg, notas: [], _ambito: true };
        if (matices) et = { titulo: 'Recuerda los matices', sub: '', notas: [], svg: '<div class="mtz">' + ((et.matices && et.matices.length) ? ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff'].filter(function (m) { return et.matices.indexOf(m) >= 0; }) : ['p', 'mp', 'mf', 'f']).map(function (m) { return '<i>' + m + '</i>'; }).join('') + '<span class="cre"></span><span class="dim"></span></div>' };
        if (et.porGrupo && et.cajas) gb = '<div class="gbts">' + et.cajas.map(function (c, g) { return '<button data-g="' + g + '" title="Escuchar" aria-label="Escuchar" style="left:' + ((c.x0 + c.x1) / 2 * 100).toFixed(2) + '%"></button>'; }).join('') + '</div>';
        velo.innerHTML = '<h2>' + esc(et.titulo) + '</h2>' + (et.sub ? '<p>' + et.sub + '</p>' : '') +
          (et.svg ? '<div class="pv">' + et.svg + (et._ambito ? '' : gb) + '</div>' : '') +
          '<div class="pbts">' + ((et.notas || []).length ? '<button class="p-play" title="' + (et.porGrupo ? 'Todos' : 'Escuchar') + ' (espacio)" aria-label="Escuchar"></button>' : '') +
          '<button class="p-sig' + (ult ? ' fin' : '') + '">' + (ult ? (S.d.etiqueta || 'INICIAR ESTUDIO · ' + Math.round((S.d.estudio || ESTUDIO) / 60) + ' MIN') : 'Siguiente →') + '</button></div>' +
          '<div class="pasos">' + ET.map(function (x, k) { return '<i class="' + (k <= i ? 'on' : '') + '"></i>'; }).join('') + '</div>';
        velo.classList.add('on');
        var bp = velo.querySelector('.p-play'); if (bp) bp.onclick = alterna;
        velo.querySelector('.p-sig').onclick = sig;
        velo.querySelectorAll('.gbts button').forEach(function (b) { b.onclick = function () { play(+b.getAttribute('data-g')); }; });
        /* (16:07, Iago) «no quiero que se reproduzca nada hasta que yo le dé al botón escuchar»: sin arranque automático */
        if (/saltos/i.test(et.titulo || '')) lineasSaltos(velo);
        if (et._ambito) { var sva = velo.querySelector('.pv svg'); if (sva) sva.querySelectorAll('text').forEach(function (t) { t.parentNode.removeChild(t); }); }
        if (esTonica(et)) cinta(et);
      }
      /* (16:15, Iago) «lo de quinta justa y cuarta justa… simplemente con una línea, como interválica: una línea que une el re con el la» */
      /* (16:25, Iago) «que cada intervalo tenga el numerito… y respeta los colores de Intervalia: azul oscuro las cuartas, azul clarito
         las quintas»; todos los saltos de la lección son ascendentes. Rótulo paralelo a la línea, como en el libro de Intervalia. */
      var COL_INT = { 5: ['#2355ce', '4J'], 6: ['#e0c93a', '4A'], 7: ['#5ac4f7', '5J'], 8: ['#8c33b6', '6m'], 9: ['#d796f8', '6M'], 10: ['#5a2d05', '7m'], 11: ['#c98a1e', '7M'], 12: ['#000000', '8J'] };   /* (7-nov tarde) la paleta entera de Intervalia, para las previas de clase */
      function lineasSaltos(v) {
        var svg = v.querySelector('.pv svg'); if (!svg) return; var et = ET[i];
        svg.querySelectorAll('text').forEach(function (t) { t.parentNode.removeChild(t); });
        var NS = 'http://www.w3.org/2000/svg';
        for (var g = 0; g < 12; g++) {
          var a = svg.querySelector('[id="vf-sal' + g + '_0"] .vf-notehead') || svg.querySelector('[id="vf-sal' + g + '_0"]');
          var b = svg.querySelector('[id="vf-sal' + g + '_1"] .vf-notehead') || svg.querySelector('[id="vf-sal' + g + '_1"]');
          if (!a || !b) continue;
          var ns = (et.notas || []).filter(function (n) { return n.g === g; }); var semi = ns.length > 1 ? Math.abs(ns[1].midi - ns[0].midi) : 0;
          var ci = COL_INT[semi] || ['#1d4ed8', ''];
          try { var A = a.getBBox(), B = b.getBBox(); var x1 = A.x + A.width + 3, y1 = A.y + A.height / 2, x2 = B.x - 3, y2 = B.y + B.height / 2;
            var l = document.createElementNS(NS, 'line'); l.setAttribute('x1', x1); l.setAttribute('y1', y1); l.setAttribute('x2', x2); l.setAttribute('y2', y2);
            l.setAttribute('stroke', ci[0]); l.setAttribute('stroke-width', '4.4'); l.setAttribute('stroke-opacity', '0.75'); l.setAttribute('stroke-linecap', 'butt'); svg.appendChild(l);
            if (ci[1]) { var ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI, mx = (x1 + x2) / 2, my = (y1 + y2) / 2, d = 9;
              var tx = mx + Math.sin(ang * Math.PI / 180) * d, ty = my - Math.cos(ang * Math.PI / 180) * d;
              var tt = document.createElementNS(NS, 'text'); tt.setAttribute('x', tx); tt.setAttribute('y', ty); tt.setAttribute('text-anchor', 'middle');
              tt.setAttribute('font-family', 'Times New Roman, Times, serif'); tt.setAttribute('font-size', '15'); tt.setAttribute('fill', '#000');
              tt.setAttribute('transform', 'rotate(' + ang.toFixed(1) + ' ' + tx.toFixed(1) + ' ' + ty.toFixed(1) + ')'); tt.textContent = ci[1]; svg.appendChild(tt); } } catch (e) {}
        }
      }
      /* (16:14, Iago) DESDE LA TÓNICA: «re negra, nota objetivo negra y re blanca… en pantalla solo un compás… que vaya deslizándose,
         para que puedas ir viendo el siguiente compás antes de que acabe el primero». Se dibuja aquí (no viene en el material cifrado). */
      function esTonica(et) { return /t[oó]nica/i.test(et.titulo || ''); }
      var KEYN = { 0: 'C', 7: 'G', 2: 'D', 9: 'A', 4: 'E', 11: 'B', 5: 'F', 10: 'Bb', 3: 'Eb', 8: 'Ab', 1: 'Db', 6: 'F#' };
      function nombre(midi, ton) {   /* grado de la escala mayor de la tónica → letra y alteración */
        var L = 'cdefgab', NAT = [0, 2, 4, 5, 7, 9, 11], k = KEYN[((ton % 12) + 12) % 12] || 'C';
        var li = L.indexOf(k[0].toLowerCase()), off = (((midi - ton) % 12) + 12) % 12, deg = [0, 2, 4, 5, 7, 9, 11].indexOf(off); if (deg < 0) deg = 0;
        var le = L[(li + deg) % 7], nat = NAT[L.indexOf(le)], pc = ((midi % 12) + 12) % 12, d = ((pc - nat + 18) % 12) - 6;
        var oct = Math.floor((midi - d) / 12) - 1; return le + (d > 0 ? '#'.repeat(d) : d < 0 ? 'b'.repeat(-d) : '') + '/' + oct;
      }
      function cargaVex() { return new Promise(function (ok) { if (window.Vex && window.Vex.Flow) return ok(true); var sc = document.createElement('script');
        sc.src = 'https://cdn.jsdelivr.net/npm/vexflow@4.2.3/build/cjs/vexflow.js'; sc.onload = function () { ok(!!(window.Vex && window.Vex.Flow)); }; sc.onerror = function () { ok(false); }; document.head.appendChild(sc); }); }
      function tonicaNotas(et) {
        var gr = {}; (et.notas || []).forEach(function (n) { (gr[n.g] = gr[n.g] || []).push(n); });
        var out = []; Object.keys(gr).map(Number).sort(function (a, b) { return a - b; }).forEach(function (g) { var a = gr[g];
          out.push({ id: 'tn' + g + '_0', g: g, midi: a[0].midi, k: a[0].k, dur: PULSO, f: 'q' }, { id: 'tn' + g + '_1', g: g, midi: a[a.length - 1].midi, k: a[a.length - 1].k, dur: PULSO, f: 'q' }, { id: 'tn' + g + '_2', g: g, midi: a[0].midi, k: a[0].k, dur: 2 * PULSO, f: 'h' }); });
        return out;
      }
      /* (16:24, Iago) «la música sea sin compás y que se vayan acercando, como en la fase 4 del quiz: una barra azul que esté quieta y
         las notas van sucediéndose… y que el tamaño sea el mismo del resto de apartados» */
      /* (7-nov 17:01, Iago) «lo de los intervalos… un vídeo que se carga… en la pantalla del aula no va a ir fluido»: la cinta
         se graba como vídeo (con el piano dentro) en piel/examenes/videos/tonica-<midi>.webm|mp4, se descarga ENTERO al entrar en la
         previa y se reproduce con el mismo ▶ tras el 3-2-1. Si no hay vídeo para esa tónica, la cinta animada de siempre. */
      function videoTonica(ton, nom) {
        if (S.vidT && S.vidT.ton === (nom || ton)) return S.vidT.p;
        var v = document.createElement('video'), ext = v.canPlayType && v.canPlayType('video/webm; codecs="vp9, opus"') ? 'webm' : 'mp4';
        var url = BASE_SFX.replace(/sonidos\/$/, 'videos/') + (nom || 'tonica-' + ton) + '.' + ext;
        var pr = fetch(url).then(function (r) { if (!r.ok) throw 0; return r.blob(); }).then(function (b) { return URL.createObjectURL(b); }).catch(function () { return null; });
        S.vidT = { ton: nom || ton, p: pr }; return pr;
      }
      function cinta(et) {
        var pv = velo.querySelector('.pv'); if (!pv) return; var notas = tonicaNotas(et); if (!notas.length) return;
        videoTonica(notas[0].midi, et.video).then(function (src) {
          if (ET[i] !== et) return;
          if (!src) return cintaViva(et);
          var v = document.createElement('video'); v.className = 'cinta-vid'; v.src = src; v.preload = 'auto'; v.muted = true; v.playsInline = true; v.setAttribute('playsinline', '');
          pv.innerHTML = ''; pv.appendChild(v); et._vid = v;
        });
      }
      function cintaViva(et) {
        var pv = velo.querySelector('.pv'); if (!pv) return; var notas = tonicaNotas(et); if (!notas.length) return;
        var ton = notas[0].midi, U = 95, INI = 420, BARRA = 150;   /* (16:27, Iago) la barra azul justo tras la armadura, sin hueco blanco */ et._cinta = { notas: notas };
        cargaVex().then(function (ok) {
          if (!ok || ET[i] !== et) return; var VF = Vex.Flow;
          var beats = notas.reduce(function (a, q) { return a + (q.f === 'h' ? 2 : 1); }, 0), W = INI + beats * U + 600;
          var caja = el('div', 'cinta'), dentro = el('div', 'cinta-in'); caja.appendChild(dentro);
          var r = new VF.Renderer(dentro, VF.Renderer.Backends.SVG); r.resize(W, 150); var ctx = r.getContext();
          var st = new VF.Stave(0, 20, W); st.setBegBarType(VF.Barline.type.NONE); st.setEndBarType(VF.Barline.type.NONE); st.setContext(ctx).draw();
          var KS = et.ks || KEYN[((ton % 12) + 12) % 12] || 'C', KM = new VF.KeyManager(KS); var tcs = [], xs = [], tt = 0, x = INI;
          var sns = notas.map(function (q) { var kq = q.k || nombre(q.midi, ton), sn = new VF.StaveNote({ keys: [kq], clef: et.clef || 'treble', duration: q.f, auto_stem: true }); if (q.k) { try { var nm = kq.split('/')[0], rk = KM.selectNote(nm); if (rk.change) sn.addModifier(new VF.Accidental(nm.slice(1) || 'n'), 0); } catch (e) {} } sn.setAttribute('id', q.id); sn.setStave(st); sn.setContext(ctx);
            var tc = new VF.TickContext(); tc.addTickable(sn).preFormat().setX(x - st.getNoteStartX()); xs.push({ t: tt, x: x }); var b = (q.f === 'h' ? 2 : 1); tt += b; x += b * U + (q.f === 'h' ? 40 : 0); return sn; });
          xs.push({ t: tt, x: x });
          sns.forEach(function (sn) { try { sn.draw(); } catch (e) {} });
          var svg = dentro.querySelector('svg'); pv.innerHTML = ''; pv.appendChild(caja);
          var esc = (caja.clientWidth || 900) / 1000; svg.setAttribute('viewBox', '0 0 ' + W + ' 150'); svg.setAttribute('width', (W * esc).toFixed(1)); svg.setAttribute('height', (150 * esc).toFixed(1)); svg.style.width = (W * esc) + 'px'; svg.style.height = (150 * esc) + 'px';
          /* clave y armadura fijas a la izquierda */
          var fija = el('div', 'cinta-clave'); caja.appendChild(fija);
          var r2 = new VF.Renderer(fija, VF.Renderer.Backends.SVG); r2.resize(128, 150); var c2 = r2.getContext();
          var s2 = new VF.Stave(10, 20, 118); s2.addClef(et.clef || 'treble').addKeySignature(et.ks || KEYN[((ton % 12) + 12) % 12] || 'C'); s2.setEndBarType(VF.Barline.type.NONE); s2.setContext(c2).draw();
          fija.style.width = (128 * esc).toFixed(1) + 'px'; fija.style.overflow = 'hidden'; var sv2 = fija.querySelector('svg'); sv2.setAttribute('viewBox', '0 0 128 150'); sv2.setAttribute('width', (128 * esc).toFixed(1)); sv2.setAttribute('height', (150 * esc).toFixed(1)); sv2.style.width = (128 * esc) + 'px'; sv2.style.height = (150 * esc) + 'px';
          var barra = el('div', 'barra'); barra.style.left = (BARRA * esc) + 'px'; barra.style.top = (8 + (st.getYForLine(0) - 14) * esc) + 'px'; barra.style.height = ((st.getYForLine(4) - st.getYForLine(0) + 28) * esc) + 'px'; caja.appendChild(barra);
          et._cinta.esc = esc; et._cinta.dentro = dentro; et._cinta.xs = xs; et._cinta.barra = BARRA; mueve(et, 0);
        });
      }
      function mueve(et, beats) { var c = et._cinta; if (!c || !c.dentro || !c.xs) return; var xs = c.xs, k = 0;
        while (k < xs.length - 2 && xs[k + 1].t <= beats) k++;
        var a = xs[k], b = xs[k + 1] || a, f = b.t > a.t ? Math.min(1, Math.max(0, (beats - a.t) / (b.t - a.t))) : 0, xu = a.x + (b.x - a.x) * f;
        c.dentro.style.transform = 'translateX(' + ((c.barra - xu - 16) * c.esc).toFixed(1) + 'px)'; }
      async function suenaCinta(et, t, boton) {
        var c = et._cinta; if (!c) return; var t0 = performance.now(), sigue = true;
        (function anima() { if (!sigue || t !== tok) return; mueve(et, (performance.now() - t0) / 1000 / PULSO); requestAnimationFrame(anima); })();
        var acum = 0;
        for (var r = 0; r < c.notas.length; r++) { if (t !== tok || !vivo()) { sigue = false; return; } var q = c.notas[r];
          var falta = t0 + acum * 1000 - performance.now(); if (falta > 0) await espera(falta); if (t !== tok || !vivo()) { sigue = false; return; }
          marca(q, true); nota(q.midi, q.dur * 0.95, 0.3); (function (qq) { setTimeout(function () { marca(qq, false); }, qq.dur * 1000); })(q); acum += q.dur; }
        await espera(Math.max(0, t0 + acum * 1000 - performance.now())); sigue = false; if (boton && t === tok) boton.classList.remove('son');
      }
      function sig() { if (!vivo()) return; if (i < ET.length - 1) { i++; pinta(); } else { tok++; S.pv = null; velo.classList.remove('on'); velo.innerHTML = ''; fin(true); } }
      function ant() { if (i > 0) { i--; pinta(); } }
      S.pv = { play: alterna, sig: sig, ant: ant };
      piano();   /* se carga ya, en silencio */
      ET.forEach(function (e) { if (esTonica(e)) { var tn = tonicaNotas(e); if (tn.length) videoTonica(tn[0].midi, e.video); } });
      pinta();
    });
  }
  function estudio() {
    /* (7-nov-2026, 19:00, Iago) «en grado profesional simplemente estructura, sorteo y temporizador… puedes darle la vuelta a la
       hoja… Y ritmo elemental también»: el ritmo y el ritmo entonado, sin previa (la escala y el arpegio se quedan en el material,
       pero no se tocan). La previa es solo de entonación. */
    var id = ++S.id, velo = S.raiz.querySelector('.velo'), d = S.d, ET = d.materia === 'entonacion' ? etapas() : [];
    var vivo = function () { return S && id === S.id; };
    S.raiz.querySelector('.b-sor').disabled = true; S.raiz.querySelector('.b-est').disabled = true; S.raiz.classList.remove('llamando'); S.llamando = -1; pintaLista();
    (async function () {
      if (d.interactiva) { var okPv = await previaInteractiva(vivo); if (!okPv || !vivo()) return; ET = []; }
      if (ET.length) { await piano(); if (!vivo()) return; }   /* (16:07) la previa automática (ritmo entonado GP), con el piano */
      for (var e = 0; e < ET.length; e++) {
        var et = ET[e];
        velo.innerHTML = '<h2>' + esc(et.titulo) + '</h2>' + (et.sub ? '<p>' + et.sub + '</p>' : '') + (et.svg ? '<div class="pv">' + et.svg + '</div>' : '');
        velo.classList.add('on'); await espera(e === 0 ? 1500 : 900); if (!vivo()) return;
        var notas = et.notas || [];
        for (var r = 0; r < notas.length; r++) {
          if (!vivo()) return;
          var g = velo.querySelector('#vf-' + notas[r].id); if (g) { g.setAttribute('fill', 'var(--acc)'); g.setAttribute('stroke', 'var(--acc)'); g.style.fill = getComputedStyle(S.raiz).getPropertyValue('--acc'); }
          nota(notas[r].midi, Math.min(1.4, (notas[r].dur || 0.55) + 0.15)); await espera((notas[r].dur || 0.55) * 1000);
          if (g) { g.style.fill = ''; g.setAttribute('fill', '#0b1320'); g.setAttribute('stroke', '#0b1320'); }
        }
        await espera((et.espera || 0.5) * 1000); if (!vivo()) return;
      }
      if (d.vuelta !== false && !d.materia.match(/^entonacion$/)) {
        velo.classList.add('on');
        for (var s = VUELTA; s > 0; s--) {
          if (!vivo()) return;
          velo.innerHTML = '<h2>Ya puedes dar la vuelta a la hoja</h2><div class="grande">' + s + '</div><p>Empieza el estudio</p>';
          bip(s === 1); await espera(1000);
        }
      }
      velo.classList.remove('on'); velo.innerHTML = '';
      var par = S.raiz.querySelector('.i-par'), mini = S.raiz.querySelector('.rmini');
      if (par) { S.raiz.classList.add('conpartitura'); par.style.opacity = '1'; } else S.raiz.classList.add('estudiando');
      S.finYa = false;
      var reloj = S.raiz.querySelector('.reloj'), b = reloj.querySelector('b'), fin = Date.now() + (d.estudio || ESTUDIO) * 1000;
      var cortesia = Math.max(0, (d.estudio || ESTUDIO) - 300), avisado = false, pausaDesde = 0; S.pausa = false;
      while (vivo()) {
        /* (17:02, Iago) pulsar el reloj lo PAUSA (y otra vez, sigue); ya no lo pone a cero */
        if (S.pausa) { if (!pausaDesde) { pausaDesde = Date.now(); reloj.classList.add('pausa'); mini.classList.add('pausa'); } await espera(200); continue; }
        if (pausaDesde) { fin += Date.now() - pausaDesde; pausaDesde = 0; }
        var q = Math.max(0, Math.ceil((fin - Date.now()) / 1000)); if (S.finYa) q = 0;
        /* (17:02, Iago) el reloj empieza en 5:05 y se ven correr los 5 s de cortesía; al llegar a 5:00, «titi» */
        if (cortesia > 0) { if (q > 300) {} else if (!avisado) { avisado = true; if (!sfx('inicio', 0.9)) { tono(88, 0.12, 0.28); setTimeout(function () { tono(88, 0.14, 0.28); }, 170); } } }
        var txt = Math.floor(q / 60) + ':' + ('0' + (q % 60)).slice(-2), cl = q === 0 ? ' rojo' : q <= 60 ? ' ambar' : '';
        b.textContent = txt; reloj.className = 'reloj' + cl; mini.textContent = txt; mini.className = 'rmini' + cl;
        if (q === 0) break; await espera(250);
      }
      if (!vivo()) return;
      if (!sfx('fin', 0.8)) { tono(72, 0.3); setTimeout(function () { tono(67, 0.5); }, 250); }
      if (par) { par.style.opacity = '0'; await espera(1800); if (!vivo()) return; S.raiz.classList.remove('conpartitura'); }
      else await espera(1500);
      if (!vivo()) return;
      S.raiz.classList.remove('estudiando'); S.raiz.classList.add('llamando');
      S.llamando = 0; pintaLista(); res('Fin del estudio · llama a ' + (S.orden[0] ? (S.orden[0].a.ver || S.orden[0].a.nombre) : '—'));
      S.raiz.querySelector('.b-sor').disabled = false; S.raiz.querySelector('.b-est').disabled = false;
    })();
  }
  /* «Terminar ya» también con la partitura delante (pulsando el reloj pequeño) */
  document.addEventListener('click', function (e) {
    var t = e.target; if (!S || !t || !t.closest) return;
    if (t.closest('#lm-exr .rmini') || t.closest('#lm-exr .reloj b')) S.pausa = !S.pausa;
  }, true);
  function siguiente() {
    if (!S || S.llamando < 0) return;
    S.llamando = Math.min(S.orden.length, S.llamando + 1); pintaLista();
    var x = S.orden[S.llamando]; res(x ? 'Ahora: ' + (x.a.ver || x.a.nombre) + (x.ab ? ' · modelo ' + x.ab : '') : 'Ya han pasado todos ✓');
  }

  /* ---------- (7-nov-2026, 17:15, Iago) PREVIA DE CLASE ----------
     «Me mola esto de la previa para incluirlo también en mis clases regulares… sin hacer spoiler de qué lección del libro es…
      no hay que hacer sorteo… cuando le doy a iniciar estudio, sean 5 minutos y 30 segundos: los 30 primeros, “busca la lección
      número no sé qué”, y luego, durante 5 minutos, la cuenta atrás… y que aparezca ya en pantalla el editor viéndose la lección
      correspondiente como teníamos hasta ahora.» El portal llama a LMExamenRitmo.clase({ datos, leccion, abrirLeccion }). */
  function clase(o) {
    cerrar(); css(); cargaSfx();
    S = { d: o.datos, id: 0, clase: true, llamando: -1, alumnos: [], orden: [] };
    var raiz = el('div'); raiz.id = 'lm-exr'; raiz.className = 'clase'; raiz.style.setProperty('--acc', '#5b9dff'); raiz.setAttribute('role', 'dialog'); raiz.setAttribute('aria-modal', 'true');
    raiz.innerHTML = '<div class="cab"><div class="lm">LM<i>at home</i><small>GRADO ELEMENTAL</small></div>' +
      '<div class="tit"><b>ENTON<span>ACIÓN</span></b><div>LECCIÓN DE ENTONACIÓN ACTIVA</div></div>' +
      '<div class="der"><button class="x" title="Cerrar (Esc)">✕</button></div></div><div class="cuerpo"><div class="esq"><div class="velo"></div></div></div>';
    document.body.appendChild(raiz); S.raiz = raiz; raiz.querySelector('.x').onclick = cerrar;
    document.addEventListener('keydown', teclas, true);
    var id = ++S.id, vivo = function () { return S && id === S.id; };
    previaInteractiva(vivo).then(async function (ok) {
      if (!ok || !vivo()) return;
      var velo = raiz.querySelector('.velo'); velo.classList.add('on');
      for (var s = 30; s > 0; s--) {
        if (!vivo()) return;
        velo.innerHTML = '<h2>Busca la lección ' + o.leccion + '</h2><div class="grande">' + s + '</div><p>' + esc(o.libro || 'Entonación 4') + '</p>';
        await espera(1000);
      }
      if (!vivo()) return;
      cerrar();
      try { if (o.abrirLeccion) o.abrirLeccion(); } catch (e) {}
      relojFlotante(o.estudio || 300);
    });
  }
  /* el reloj del estudio, flotando encima del editor de la lección: pulsar = pausa / sigue; al acabar, pulsar = quitar */
  async function relojFlotante(seg) {
    var r = document.getElementById('lm-exr-reloj'); if (r) r.remove();
    r = el('div'); r.id = 'lm-exr-reloj'; document.body.appendChild(r);
    var fin = Date.now() + seg * 1000, pausa = false, pd = 0, acabado = false;
    r.onclick = function () { if (acabado) { r.remove(); return; } pausa = !pausa; r.classList.toggle('pausa', pausa); };
    if (!sfx('inicio', 0.9)) { tono(88, 0.12, 0.28); setTimeout(function () { tono(88, 0.14, 0.28); }, 170); }
    while (r.isConnected) {
      if (!document.getElementById('lm-ento') && Date.now() > fin - seg * 1000 + 3000) { r.remove(); return; }   /* se cerró la lección */
      if (pausa) { if (!pd) pd = Date.now(); await espera(200); continue; }
      if (pd) { fin += Date.now() - pd; pd = 0; }
      var q = Math.max(0, Math.ceil((fin - Date.now()) / 1000));
      r.textContent = Math.floor(q / 60) + ':' + ('0' + (q % 60)).slice(-2); r.className = q === 0 ? 'rojo' : q <= 60 ? 'ambar' : '';
      if (q === 0) { acabado = true; if (!sfx('fin', 0.8)) { tono(72, 0.3); setTimeout(function () { tono(67, 0.5); }, 250); } return; }
      await espera(250);
    }
  }

  window.LMExamenRitmo = { abrir: abrir, cerrar: cerrar, clase: clase, version: 16 };
})();
