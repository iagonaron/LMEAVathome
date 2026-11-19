/* ============================================================================================================
   PULSO (19-nov-2026, Iago) · botón de la barra de arriba del portal (GE y GP), entre Incidencias y Mis resultados.
   «Que se sienta vivo»: lo que tu grupo está trabajando por libre, al momento, para animar (no para competir).
   · Mismos criterios que lo que le llega a Iago a la campana para el 👍 (mínimo 3 min reales, dictado terminado…).
     Sale al momento como «pendiente»; cuando Iago le da su 👍, lleva el sello azul y los puntos son los oficiales.
   · Se ve el ×1,5 / ×2 y lo que suma. Nombre + inicial. Solo tu grupo. Orden cronológico.
   · (19-nov 10:31, Iago) SIN «me gusta» de compañeros: «se va a llenar de notificaciones». Solo el pulso de la clase.
   · No se despliega solo: el icono late suave y lleva el número de novedades desde la última vez que lo abriste.
   · ⚙ en el panel: «No salir en el Pulso» (tu trabajo cuenta igual).
   · SQL: suite_pulso_listar / suite_pulso_like / suite_pulso_ajuste (tablas suite_pulso_likes, _ocultos, _visto).
   Quitarlo: borrar la línea <script … pulso.js> de index.html (GE y GP).
   ============================================================================================================ */
(function () {
  'use strict';
  if (window.__lmPulso) return; window.__lmPulso = 1;
  var SBU = 'https://woiptkyrxkbpnvioypit.supabase.co';
  var SBK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvaXB0a3lyeGticG52aW95cGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NzI2ODYsImV4cCI6MjA5MjA0ODY4Nn0.B2nKgj5rD0rkdLeMIrd9KgD8lUPWsBT4Y7aCtmnvbjA';
  var GP = /(^|\.)gp\.lmathome\.es$/i.test(location.hostname) || /lmpro/i.test(location.pathname) || /__lmGP/.test(document.documentElement.className);
  var KEY = GP ? 'lmpro_session' : 'lmeav_session';
  var AC = GP ? '#e9c96a' : '#8fb3ff';
  var COL = { ritmo: '#22c55e', entonacion: '#3b82f6', audicion: '#f97316', teoria: '#ec4899' };
  var APP = { teoria: 'Teoría', ritmo: 'Ritmo', desafio: 'Desafío rítmico', acceso: 'Acceso rítmico', entonacion: 'Entonación', intervalia: 'Intervalia',
    dictado: 'Dictado', predict: 'PreDict', acustica: 'Acústica', atonalidad: 'Atonalidad', blues: 'Blues', afrolatin: '4 Sabores',
    modulacion: 'Modulación', transporte: 'Transporte', magnetofono: 'Magnetófono', fonografo: 'Fonógrafo' };
  var ICO = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="lp-l" d="M2 12h4l2.5-6 4 13 3-9 1.5 2H22"/><path class="lp-h" pathLength="100" d="M2 12h4l2.5-6 4 13 3-9 1.5 2H22"/></svg>';
  var SELLO = '<svg class="lp-sello" viewBox="0 0 24 24" aria-label="Verificado por Iago"><path fill="#3b82f6" d="M12 1l2.6 2.2 3.4-.4.9 3.3 3 1.7-1.3 3.2 1.3 3.2-3 1.7-.9 3.3-3.4-.4L12 23l-2.6-2.2-3.4.4-.9-3.3-3-1.7L3.4 13 2.1 9.8l3-1.7.9-3.3 3.4.4z"/><path d="M7.5 12.3l3 3 6-6.3" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var HEART = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.6-9C.9 8.3 2.8 4.8 6.3 4.8c2.2 0 3.8 1.3 4.6 2.6.8-1.3 2.4-2.6 4.6-2.6 3.5 0 5.4 3.5 3.9 6.7-2.1 4.4-7.4 9-7.4 9z"/></svg>';
  var GEAR = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 13a7.6 7.6 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7.4 7.4 0 0 0-1.7-1L15 3.4h-4L10.6 6a7.4 7.4 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7.6 7.6 0 0 0 0 2l-2 1.6 2 3.4 2.4-1c.5.4 1.1.7 1.7 1l.4 2.6h4l.4-2.6c.6-.3 1.2-.6 1.7-1l2.4 1 2-3.4z"/></svg>';

  /* el MISMO sello circular del aviso «A Iago le ha gustado» de la campana (VERIFICADO · VERIFICADO · con el check) */
  var SELLO_N = 0;
  function selloGrande(col) { var id = 'lps' + (++SELLO_N);
    return '<svg class="lp-sellog" viewBox="0 0 100 100" aria-hidden="true" style="color:' + col + '"><defs><path id="' + id + '" d="M50,50 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1 -70,0"/></defs>' +
      '<circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="50" cy="50" r="43" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2.4"/>' +
      '<text font-size="9.4" font-weight="800" fill="currentColor"><textPath href="#' + id + '" textLength="219.9" lengthAdjust="spacing">VERIFICADO · VERIFICADO · </textPath></text>' +
      '<path d="M30 52 44 66 71 36" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
  var MODO_SELLO = window.__lmPulsoSello || 'A';
  /* (19-nov 11:07, Iago) minutos verificados del trimestre por área, discreto, para fomentar que lo equilibren:
     verde ritmo · azul entonación · naranja audición · rosa teoría */
  var AREAS = [['ritmo', '#22c55e', 'Ritmo'], ['entonacion', '#3b82f6', 'Entonación'], ['audicion', '#f97316', 'Audición'], ['teoria', '#ec4899', 'Teoría']];
  var MODO_AREAS = window.__lmPulsoAreas || 'A';
  var COMBO = window.__lmPulsoCombo || '4';   /* (19-nov 11:19, Iago) la 3 con cambios: dentro del círculo, los minutos de ESTA actividad */
  /* anillo del trimestre por áreas alrededor del avatar (círculo con la inicial en el color del área de ESTA actividad) */
  function anillo(a, size, rr, sw) {
    var vals = AREAS.map(function (x) { return Number((a || {})[x[0]]) || 0; }), sum = vals.reduce(function (p, v) { return p + v; }, 0), C = 2 * Math.PI * rr, off = 0, h = size / 2;
    var o = '<circle cx="' + h + '" cy="' + h + '" r="' + rr + '" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="' + sw + '"/>';
    if (sum > 0) AREAS.forEach(function (x, i) { var L = C * vals[i] / sum; if (L > 0) o += '<circle cx="' + h + '" cy="' + h + '" r="' + rr + '" fill="none" stroke="' + x[1] + '" stroke-width="' + sw + '" stroke-dasharray="' + Math.max(0, L - (vals.filter(Boolean).length > 1 ? 1.2 : 0)).toFixed(2) + ' ' + (C - L + (vals.filter(Boolean).length > 1 ? 1.2 : 0)).toFixed(2) + '" stroke-dashoffset="' + (-off).toFixed(2) + '" transform="rotate(-90 ' + h + ' ' + h + ')"/>'; off += L; });
    return o;
  }
  /* (19-nov 11:27, Iago) «para respetar la estética del cuadrado»: cuadrado de esquinas suaves cuyo BORDE es el reparto del trimestre por áreas */
  function marco(a, fill) {
    var vals = AREAS.map(function (x) { return Number((a || {})[x[0]]) || 0; }), sum = vals.reduce(function (p, v) { return p + v; }, 0), off = 0, gap = vals.filter(Boolean).length > 1 ? 0.8 : 0;
    var o = '<rect x="1.75" y="1.75" width="42.5" height="42.5" rx="12" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="3.5"/>';
    if (sum > 0) AREAS.forEach(function (x, i) { var L = 100 * vals[i] / sum; if (L > 0) o += '<rect x="1.75" y="1.75" width="42.5" height="42.5" rx="12" pathLength="100" fill="none" stroke="' + x[1] + '" stroke-width="3.5" stroke-dasharray="' + Math.max(0, L - gap).toFixed(2) + ' ' + (100 - L + gap).toFixed(2) + '" stroke-dashoffset="' + (-off).toFixed(2) + '"/>'; off += L; });
    return o + '<rect x="6.5" y="6.5" width="33" height="33" rx="8" fill="' + fill + '"/>';
  }
  function avatar(e, c) {
    var t = 'Minutos verificados este trimestre: ' + AREAS.map(function (x) { return x[2] + ' ' + ((e.areas || {})[x[0]] || 0); }).join(' · ');
    if (COMBO === '2') {   // anillo con el TOTAL dentro
      return '<div class="lp-av" title="' + esc(t) + '"><svg viewBox="0 0 46 46">' + anillo(e.areas, 46, 20, 4) + '</svg><span class="lp-av-tot"><b>' + (e.tot || 0) + '</b><i>min</i></span></div>';
    }
    var dentro = COMBO === '4' ? '<span class="lp-av-tot lp-av-act"><b>' + (e.min || 0) + '</b><i>min</i></span>' : '<span class="lp-av-ini">' + esc(e.ini || '·') + '</span>';
    var av = '<div class="lp-av" title="' + esc(t) + '"><svg viewBox="0 0 46 46">' + (COMBO === '4' ? marco(e.areas, c) : anillo(e.areas, 46, 21, 3.5) + '<circle cx="23" cy="23" r="16.5" fill="' + c + '"/>') + '</svg>' + dentro +
             (COMBO === '3' && e.tot > 0 ? '<span class="lp-av-badge">' + e.tot + '′</span>' : '') + '</div>';
    return av;
  }
  function areasHTML(a, tot) {
    if (!a || !(tot > 0)) return '';
    var t = AREAS.map(function (x) { return x[2] + ' ' + (a[x[0]] || 0) + ' min'; }).join(' · ');
    var vals = AREAS.map(function (x) { return Number(a[x[0]]) || 0; }), sum = vals.reduce(function (p, v) { return p + v; }, 0) || 1, mx = Math.max.apply(null, vals) || 1, g = '';
    if (MODO_AREAS === 'A') {   // anillo
      var r = 8, C = 2 * Math.PI * r, off = 0;
      g = '<svg class="lp-ar-anillo" viewBox="0 0 22 22"><circle cx="11" cy="11" r="8" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="4"/>' +
        AREAS.map(function (x, i) { var L = C * vals[i] / sum; var c = L > 0 ? '<circle cx="11" cy="11" r="8" fill="none" stroke="' + x[1] + '" stroke-width="4" stroke-dasharray="' + L.toFixed(2) + ' ' + (C - L).toFixed(2) + '" stroke-dashoffset="' + (-off).toFixed(2) + '" transform="rotate(-90 11 11)"/>' : ''; off += L; return c; }).join('') + '</svg>';
    } else if (MODO_AREAS === 'B') {   // una barra partida en 4
      g = '<span class="lp-ar-barra">' + AREAS.map(function (x, i) { return vals[i] > 0 ? '<i style="flex:' + vals[i] + ';background:' + x[1] + '"></i>' : ''; }).join('') + '</span>';
    } else {   // 4 barritas verticales
      g = '<span class="lp-ar-ecu">' + AREAS.map(function (x, i) { return '<i style="height:' + Math.max(2, Math.round(14 * vals[i] / mx)) + 'px;background:' + (vals[i] > 0 ? x[1] : 'rgba(255,255,255,.14)') + '"></i>'; }).join('') + '</span>';
    }
    return '<span class="lp-ar" title="Minutos verificados este trimestre: ' + t + '">' + g + '<span class="lp-ar-n">' + tot + ' min</span></span>';
  }   /* (19-nov 10:53, Iago) opción A: sello entero, pequeño */
  var D = null, abierto = false, cargando = false, ajustes = false;
  /* (19-nov 13:02, Iago) vídeo breve (1 min, con su voz) que explica el Pulso: botón discreto «Ver vídeo» en el panel,
     solo cuando el vídeo esté subido a piel/pulso/pulso-video.mp4 (hasta entonces no sale nada) */
  /* (19-nov 13:52, Iago) un vídeo para GE y otro para GP, HORIZONTAL, 4K a 60 fps, que se descargue entero antes de verse (sin tirones).
     Va en trozos que dice piel/pulso/pulso-ge.json o pulso-gp.json (como el vídeo de «Mi actitud»): 1080p60 por defecto, 4K si el equipo
     lo decodifica fluido por hardware, 1080p30 en la pantalla del aula (Chrome 94). Se abre en una ventana grande encima del portal. */
  var VBASE = 'https://ge.lmathome.es/piel/pulso/', VNOM = 'pulso-' + (GP ? 'gp' : 'ge'), VMAN = null, VBLOB = null, VIDEO_OK = false, viendoVideo = false;
  try { fetch(VBASE + VNOM + '.json?nc=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; })
    .then(function (m) { if (m && m.trozos && m.trozos.length) { VMAN = m; VIDEO_OK = true; if (abierto) pintar(); } }).catch(function () {}); } catch (e) {}
  function cerrarVideo() { var o = document.getElementById('lm-pulso-vid'); if (!o) return; var v = o.querySelector('video'); try { v.pause(); } catch (e) {} o.remove(); }
  function verVideo() {
    if (!VMAN || document.getElementById('lm-pulso-vid')) return;
    var o = document.createElement('div'); o.id = 'lm-pulso-vid';
    o.innerHTML = '<div class="lpv-caja"><button type="button" class="lpv-x" aria-label="Cerrar">✕</button><div class="lpv-marco"><video playsinline controls preload="auto"></video>' +
      '<div class="lpv-carga"><div class="lpv-ic">' + ICO + '</div><div class="lpv-t">Cargando el vídeo…</div><div class="lpv-barra"><i></i></div><div class="lpv-pc">0 %</div></div></div></div>';
    o.addEventListener('click', function (ev) { ev.stopPropagation(); if (ev.target === o) cerrarVideo(); });
    o.querySelector('.lpv-x').addEventListener('click', cerrarVideo);
    document.body.appendChild(o);
    var V = o.querySelector('video'), barra = o.querySelector('.lpv-barra i'), pc = o.querySelector('.lpv-pc'), carga = o.querySelector('.lpv-carga');
    function listo(url) { V.src = url; carga.style.display = 'none'; var pr = V.play(); if (pr && pr.catch) pr.catch(function () {}); }
    if (VBLOB) { listo(VBLOB); return; }
    (async function () {
      try {
        var man = VMAN, puede = async function (w, h, fps, br, hw) { try { var r = await navigator.mediaCapabilities.decodingInfo({ type: 'file', video: { contentType: 'video/mp4; codecs="avc1.640033"', width: w, height: h, framerate: fps, bitrate: br } });
          return !!(r.supported && r.smooth && (!hw || r.powerEfficient)); } catch (e) { return false; } };
        var cv = +((/Chrome\/(\d+)/.exec(navigator.userAgent) || [])[1] || 0), aula = /Linux/.test(navigator.userAgent) && !/Android|CrOS/.test(navigator.userAgent) && cv && cv < 110;
        var v4 = man.k4 && man.k4.trozos && man.k4.trozos.length, v30 = man.t30 && man.t30.trozos && man.t30.trozos.length, Q = man;
        if (aula && v30) Q = man.t30; else if (v4 && await puede(3840, 2160, 60, 3e6, true)) Q = man.k4; else if (v30 && !(await puede(1920, 1080, 60, 1e6, false))) Q = man.t30;
        var tot = Q.bytes || 0, rec = 0, partes = [], CA = null;
        try { if (window.caches) CA = await caches.open('lm-pulso-video'); } catch (e) { CA = null; }
        if (CA) try { (await CA.keys()).forEach(function (rq) { var u = new URL(rq.url); if (u.pathname.indexOf(VNOM) >= 0 && u.searchParams.get('v') !== String(man.v)) CA.delete(rq); }); } catch (e) {}
        for (var k = 0; k < Q.trozos.length; k++) {
          var url = VBASE + Q.trozos[k] + '?v=' + man.v, r = null, deCa = false, mios = [];
          if (CA) try { r = await CA.match(url); deCa = !!(r && r.body); } catch (e) { r = null; }
          if (!deCa) { r = await fetch(url); if (!r.ok || !r.body) throw new Error('http ' + r.status); }
          var rd = r.body.getReader();
          for (;;) { var x = await rd.read(); if (x.done) break; partes.push(x.value); mios.push(x.value); rec += x.value.length;
            if (tot) { var q = Math.min(100, 100 * rec / tot); barra.style.width = q.toFixed(1) + '%'; pc.textContent = Math.floor(q) + ' %'; } }
          if (CA && !deCa) try { await CA.put(url, new Response(new Blob(mios, { type: 'application/octet-stream' }))); } catch (e) {}
          if (!document.getElementById('lm-pulso-vid')) return;   // lo cerró mientras cargaba (lo ya bajado queda en la caché)
        }
        VBLOB = URL.createObjectURL(new Blob(partes, { type: 'video/mp4' }));
        if (document.getElementById('lm-pulso-vid')) listo(VBLOB);
      } catch (e) { o.querySelector('.lpv-t').textContent = 'No se ha podido cargar el vídeo. Prueba otra vez en un rato.'; pc.textContent = ''; }
    })();
  }

  function ses() { try { return JSON.parse(localStorage.getItem(KEY) || 'null') || window.__LM_SES || null; } catch (e) { return window.__LM_SES || null; } }
  function cuenta() { var s = ses(); return (s && s.id && s.estado === 'validado') ? s : null; }
  /* (19-nov 13:31, Iago) en Tester/Protester no quiere el Pulso: «a mí ya me llega como notificación» */
  function esTester(s) { try { var n = String((s && s.nombre) || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
    return ['iago gonzalez tester', 'iago gonzalez protester', 'iago gonzalez pro tester'].indexOf(n) >= 0; } catch (e) { return false; } }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function rpc(fn, args) {
    return fetch(SBU + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { 'apikey': SBK, 'Authorization': 'Bearer ' + SBK, 'Content-Type': 'application/json' }, body: JSON.stringify(args || {}) })
      .then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
  }
  function num(x, d) { return (Math.round(x * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', ','); }
  function mult(m) { m = Number(m) || 1; var t = (Math.round(m * 100) / 100).toString().replace('.', ','); return '×' + t; }
  function hace(iso) {
    var s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 3600) return 'hace ' + Math.max(1, Math.round(s / 60)) + ' min';
    if (s < 86400) return 'hace ' + Math.round(s / 3600) + ' h';
    var d = Math.round(s / 86400); return d <= 1 ? 'ayer' : 'hace ' + d + ' días';
  }
  function diaDe(iso) { try { return new Date(iso).toLocaleDateString('es-ES', { timeZone: 'Europe/Madrid' }); } catch (e) { return String(iso).slice(0, 10); } }

  function css() {
    if (document.getElementById('lm-pulso-css')) return;
    var st = document.createElement('style'); st.id = 'lm-pulso-css';
    st.textContent =
      '#lm-pulso-btn{position:relative;width:var(--lm-ctl,34px);height:var(--lm-ctl,34px);min-width:var(--lm-ctl,34px);padding:0;margin:0;border:0;border-radius:10px;background:var(--lm-neutro,#243044);color:#e2e8f0;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;align-self:center;flex:0 0 auto}' +
      '@media (hover:hover){#lm-pulso-btn:hover{background:var(--lm-neutro-h,#2d3b52)}}#lm-pulso-btn[hidden]{display:none!important}' +
      /* (19-nov 10:59, Iago) como un monitor de pulso: un trazo de luz recorre la línea de izquierda a derecha y deja un rastro que se apaga */
      '#lm-pulso-btn .lp-l{opacity:.38}' +
      '#lm-pulso-btn .lp-h{stroke:#fff;stroke-dasharray:26 100;stroke-dashoffset:26;opacity:0;filter:drop-shadow(0 0 2px ' + AC + ');animation:lpTrazo 2.8s linear infinite}' +
      '#lm-pulso-btn.nuevo .lp-l{stroke:' + AC + ';opacity:.55}#lm-pulso-btn.nuevo .lp-h{stroke:#fff;filter:drop-shadow(0 0 3px ' + AC + ')}' +
      '@keyframes lpTrazo{0%{stroke-dashoffset:26;opacity:1}55%{stroke-dashoffset:-100;opacity:1}62%{stroke-dashoffset:-100;opacity:0}100%{stroke-dashoffset:-100;opacity:0}}' +
      '@media (prefers-reduced-motion:reduce){#lm-pulso-btn .lp-h{animation:none;opacity:0}#lm-pulso-btn .lp-l{opacity:.9}}' +
      /* (19-nov 14:00, Iago) sin circulito de notificaciones: «más misterioso», el número de novedades se revela grande, por detrás,
         justo cuando el trazo iluminado pasa por el centro de la línea */
      '#lm-pulso-btn svg{position:relative;z-index:1}' +
      /* (19-nov 14:13, Iago) más sutil: como una habitación a oscuras; el número casi no se nota y la luz del trazo, al pasar por el centro, lo deja entrever */
      '#lm-pulso-btn .lp-nb{position:absolute;inset:0;z-index:0;display:flex;align-items:center;justify-content:center;pointer-events:none;color:#c7d2fe;font:800 31px/1 system-ui,sans-serif;letter-spacing:-.04em;opacity:.07;filter:blur(.7px);animation:lpNum 2.8s linear infinite}' +
      '#lm-pulso-btn .lp-nb.n2{font-size:25px}#lm-pulso-btn .lp-nb.n3{font-size:19px}' +
      '@keyframes lpNum{0%,14%{opacity:.07;filter:blur(.7px)}27%{opacity:.36;filter:blur(0)}44%,100%{opacity:.07;filter:blur(.7px)}}' +
      '@media (prefers-reduced-motion:reduce){#lm-pulso-btn .lp-nb{animation:none;opacity:.2;filter:none}}' +
      '#lm-pulso{position:fixed;z-index:2147480000;width:min(396px,calc(100vw - 24px));max-height:min(72vh,620px);display:flex;flex-direction:column;background:#0a0e1c;border:1.5px solid rgba(255,255,255,.22);border-radius:14px;box-shadow:0 18px 50px rgba(0,0,0,.55);color:#e6ebff;font-family:inherit;font-size:13px;box-sizing:border-box}' +
      '#lm-pulso[hidden]{display:none}' +
      '#lm-pulso .lp-h{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;padding:13px 14px 9px}' +
      '#lm-pulso .lp-t{font:800 11px/1.2 system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#fff}#lm-pulso .lp-t b{color:' + AC + ';text-transform:none;letter-spacing:.06em}' +
      '#lm-pulso .lp-s{font-size:11.5px;color:#8b95b8;margin-top:3px}' +
      '#lm-pulso .lp-cfg,#lm-pulso .lp-x{width:28px;height:28px;border-radius:8px;border:1px solid rgba(255,255,255,.2);background:transparent;color:#aab4d6;display:grid;place-items:center;cursor:pointer;padding:0;font-size:14px;line-height:1}' +
      '#lm-pulso .lp-bts{display:flex;gap:6px}' +
      '#lm-pulso .lp-aj{margin:0 14px 8px;padding:9px 10px;border-radius:10px;background:rgba(255,255,255,.05);font-size:12.5px;line-height:1.4;color:#cbd5e1}' +
      '#lm-pulso .lp-aj button{margin-top:7px;border:1.5px solid rgba(255,255,255,.3);background:transparent;color:#fff;border-radius:8px;padding:6px 10px;font:700 12.5px/1 inherit;cursor:pointer;font-family:inherit}' +
      '#lm-pulso .lp-list{overflow-y:auto;padding:0 14px 6px;display:flex;flex-direction:column;gap:7px}' +
      '#lm-pulso .lp-e{display:grid;grid-template-columns:32px 1fr auto;gap:10px;align-items:center;padding:8px 10px;border-radius:10px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.1)}' +
      '#lm-pulso .lp-e.nuevo{border-color:' + AC + '66}' +
      '#lm-pulso .lp-a{width:32px;height:32px;border-radius:8px;display:grid;place-items:center;font-weight:800;font-size:14px;color:#fff}' +
      '#lm-pulso .lp-nm{font-weight:700;color:#fff;display:flex;align-items:center;gap:5px;white-space:nowrap}#lm-pulso .lp-yo .lp-nm{color:' + AC + '}' +
      '#lm-pulso .lp-sello{width:14px;height:14px;flex:none}' +
      '#lm-pulso .lp-pend{font-size:9.5px;font-weight:700;letter-spacing:.03em;color:#94a3b8;border:1px dashed rgba(148,163,184,.55);border-radius:4px;padding:0 4px;line-height:14px}' +
      '#lm-pulso .lp-d{font-size:12px;color:#aab4d6;white-space:nowrap}' +
      '#lm-pulso .lp-x2{display:inline-block;padding:0 5px;border-radius:4px;font-weight:800;font-size:11px;margin-right:4px;color:#fff;line-height:16px}' +
      '#lm-pulso .lp-pt{color:#4ade80;font-weight:700}#lm-pulso .lp-pt.gris{color:#94a3b8}' +
      '#lm-pulso .lp-r{display:flex;flex-direction:column;align-items:flex-end;gap:5px}' +
      '#lm-pulso .lp-w{font-size:10.5px;color:#7480a8;white-space:nowrap}' +
      '#lm-pulso .lp-like{display:inline-flex;align-items:center;gap:4px;padding:3px 7px;border-radius:6px;border:1px solid rgba(255,255,255,.22);background:transparent;color:#c9d3f5;font:700 11.5px/1 system-ui,sans-serif;cursor:pointer}' +
      '#lm-pulso .lp-like.on{border-color:#f472b6;color:#f9a8d4}#lm-pulso .lp-like.on svg{fill:#f472b6;stroke:#f472b6}' +
      '#lm-pulso .lp-like.mio{cursor:default;border-style:dashed}' +
      '#lm-pulso .lp-e{grid-template-columns:46px 1fr auto}' +
      '#lm-pulso .lp-av{position:relative;width:46px;height:46px}#lm-pulso .lp-av svg{position:absolute;inset:0;width:46px;height:46px}' +
      '#lm-pulso .lp-av-ini{position:absolute;inset:0;display:grid;place-items:center;font:800 15px/1 system-ui,sans-serif;color:#fff}' +
      '#lm-pulso .lp-av-tot{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1}#lm-pulso .lp-av-tot b{font:800 14px/1 system-ui,sans-serif;color:#fff}#lm-pulso .lp-av-tot i{font-style:normal;font-size:8.5px;color:#94a3b8;margin-top:1px}#lm-pulso .lp-av-act i{color:rgba(255,255,255,.85)}#lm-pulso .lp-av-act b{font-size:13px}' +
      '#lm-pulso .lp-av-badge{position:absolute;right:-6px;bottom:-4px;font:800 9.5px/1 system-ui,sans-serif;color:#e2e8f0;background:#0a0e1c;border:1px solid rgba(255,255,255,.3);border-radius:5px;padding:2px 3px}' +
      '#lm-pulso .lp-app{font-weight:700}' +
      '#lm-pulso .lp-val{display:flex;align-items:center;gap:8px;padding-left:10px;border-left:1px solid rgba(255,255,255,.1)}' +
      '#lm-pulso .lp-num{display:flex;flex-direction:column;align-items:flex-end;line-height:1.15}' +
      '#lm-pulso .lp-num b{font-size:16px;font-weight:800;color:#4ade80;font-variant-numeric:tabular-nums;white-space:nowrap}' +
      '#lm-pulso .lp-num span{font-size:11.5px;color:#cbd5e1;font-variant-numeric:tabular-nums}' +
      '#lm-pulso .lp-num b small{font-size:10.5px;font-weight:600;color:#94a3b8}' +
      '#lm-pulso .lp-val.pend .lp-num b{color:#94a3b8}#lm-pulso .lp-val.pend .lp-num span{color:#94a3b8}' +
      '#lm-pulso .lp-sg{width:24px;height:24px;flex:none;display:grid;place-items:center}#lm-pulso .lp-sg svg{width:24px;height:24px}' +
      '#lm-pulso .lp-sg.vacio{border:1.5px dashed rgba(148,163,184,.5);border-radius:50%;width:20px;height:20px;margin:2px}' +
      '#lm-pulso .lp-e{position:relative;overflow:hidden;flex:none}' +
      '#lm-pulso .lp-sellog{position:absolute;pointer-events:none;transform:rotate(-12deg)}' +
      '#lm-pulso.sA .lp-sellog{position:static;width:40px;height:40px;opacity:.7;flex:none}' +
      '#lm-pulso.sB .lp-sellog{width:84px;height:84px;right:-42px;bottom:-42px;opacity:.5}' +
      '#lm-pulso.sB .lp-val,#lm-pulso.sC .lp-val{padding-right:34px}' +
      '#lm-pulso.sC .lp-sellog{width:84px;height:84px;right:-42px;top:50%;margin-top:-42px;opacity:.45}' +
      '#lm-pulso .lp-pv{width:50px;flex:none;text-align:center;font:700 9.5px/1.15 system-ui,sans-serif;color:#94a3b8;border:1px dashed rgba(148,163,184,.45);border-radius:6px;padding:4px 2px}' +
      '#lm-pulso .lp-eq{margin:0 14px 10px;padding:10px 12px;border-radius:12px;border:1.5px solid ' + AC + '66;background:' + AC + '14;display:grid;grid-template-columns:1fr auto;align-items:center;gap:2px 12px}' +
      '#lm-pulso .lp-eq-b{position:relative;z-index:1;margin-top:4px;font:800 12.5px/1.2 system-ui,sans-serif;color:' + AC + ';white-space:nowrap}' +
      '#lm-pulso .lp-eq-r{position:relative;display:flex;flex-direction:column;align-items:center;padding:2px 2px 0}' +
      '#lm-pulso .lp-eq-p{position:absolute;left:-4px;top:-8px;width:calc(100% + 8px);height:42px;z-index:0;pointer-events:none;overflow:visible}' +
      '#lm-pulso .lp-eq-p path{fill:none;stroke:' + AC + ';stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}' +
      '#lm-pulso .lp-eq-p .b{opacity:.3}#lm-pulso .lp-eq-p .t{stroke:#fff;stroke-dasharray:26 100;stroke-dashoffset:26;opacity:0;filter:drop-shadow(0 0 3px ' + AC + ');animation:lpTrazo 2.8s linear infinite}' +
      '@media (prefers-reduced-motion:reduce){#lm-pulso .lp-eq-p .t{animation:none;opacity:0}}' +
      '#lm-pulso .lp-eq-n{position:relative;z-index:1;text-shadow:0 0 3px #11162b,0 0 6px #11162b,0 0 10px #11162b,0 0 14px #11162b;font:800 26px/1 system-ui,sans-serif;color:#fff;white-space:nowrap;font-variant-numeric:tabular-nums}#lm-pulso .lp-eq-n small{font-size:13px;font-weight:700;color:#cbd5e1}' +
      '#lm-pulso .lp-eq-t{font-size:12px;line-height:1.35;color:#cbd5e1}#lm-pulso .lp-eq-t b{color:' + AC + ';font-size:13px}' +
      '#lm-pulso .lp-ar{display:inline-flex;align-items:center;gap:5px;margin-left:6px;vertical-align:middle}' +
      '#lm-pulso .lp-ar-n{font-size:10.5px;font-weight:600;color:#7480a8}' +
      '#lm-pulso .lp-ar-anillo{width:16px;height:16px}' +
      '#lm-pulso .lp-ar-barra{display:inline-flex;width:44px;height:5px;border-radius:3px;overflow:hidden;gap:1px;background:rgba(255,255,255,.08)}#lm-pulso .lp-ar-barra i{display:block;height:100%}' +
      '#lm-pulso .lp-ar-ecu{display:inline-flex;align-items:flex-end;gap:2px;height:14px}#lm-pulso .lp-ar-ecu i{display:block;width:4px;border-radius:1px}' +
      '#lm-pulso .lp-pv2{font-size:11px;font-weight:600;color:#94a3b8;font-style:italic}' +
      '#lm-pulso .lp-vid{height:28px;padding:0 9px;border-radius:8px;border:1px solid rgba(255,255,255,.2);background:transparent;color:#aab4d6;font:700 11.5px/1 system-ui,sans-serif;cursor:pointer;white-space:nowrap}' +
      '@media (hover:hover){#lm-pulso .lp-vid:hover{color:#fff;border-color:rgba(255,255,255,.4)}}' +
      '#lm-pulso-vid{position:fixed;inset:0;z-index:2147483000;background:rgba(3,5,12,.84);display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box}' +
      '#lm-pulso-vid .lpv-caja{position:relative;width:min(94vw,calc((100vh - 70px) * 16 / 9))}' +
      '#lm-pulso-vid .lpv-marco{position:relative;width:100%;padding-top:56.25%;background:#05070f;border:1.5px solid rgba(255,255,255,.22);border-radius:14px;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,.6)}' +
      '#lm-pulso-vid video{position:absolute;inset:0;width:100%;height:100%;background:#000}' +
      '#lm-pulso-vid .lpv-carga{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:#05070f;color:#e6ebff;font:700 15px/1.3 system-ui,sans-serif;text-align:center;padding:20px}' +
      '#lm-pulso-vid .lpv-ic{width:64px;height:64px;color:' + AC + '}#lm-pulso-vid .lpv-ic svg{width:100%;height:100%}' +
      '#lm-pulso-vid .lpv-ic .lp-h{stroke:#fff;stroke-dasharray:26 100;stroke-dashoffset:26;opacity:0;filter:drop-shadow(0 0 3px ' + AC + ');animation:lpTrazo 2.8s linear infinite}#lm-pulso-vid .lpv-ic .lp-l{opacity:.3}' +
      '#lm-pulso-vid .lpv-barra{width:min(320px,70%);height:6px;border-radius:4px;background:rgba(255,255,255,.12);overflow:hidden}#lm-pulso-vid .lpv-barra i{display:block;height:100%;width:0;background:' + AC + ';border-radius:4px}' +
      '#lm-pulso-vid .lpv-pc{font-size:12.5px;color:#aab4d6;font-variant-numeric:tabular-nums}' +
      '#lm-pulso-vid .lpv-x{position:absolute;right:0;top:-40px;width:32px;height:32px;border-radius:8px;border:1px solid rgba(255,255,255,.3);background:rgba(10,14,28,.9);color:#fff;font:700 15px/1 system-ui,sans-serif;cursor:pointer}' +
      '#lm-pulso .lp-vacio{padding:18px 6px;text-align:center;color:#94a3b8;font-size:12.5px;line-height:1.45}' +
      '#lm-pulso .lp-pie{padding:8px 14px 12px;font-size:11px;color:#7480a8;line-height:1.4;border-top:1px solid rgba(255,255,255,.07)}';
    document.head.appendChild(st);
  }

  /* ---- el botón ---- */
  function boton() {
    var mr = document.getElementById('btn-mis-resultados');
    var b = document.getElementById('lm-pulso-btn');
    var ver = !!(cuenta() && !esTester(cuenta()) && mr && mr.parentNode);
    if (!ver) { if (b) b.hidden = true; return; }
    css();
    if (!b) {
      b = document.createElement('button'); b.type = 'button'; b.id = 'lm-pulso-btn';
      b.title = 'Pulso'; b.setAttribute('aria-label', 'Pulso'); b.innerHTML = ICO;
      b.addEventListener('click', function (ev) { ev.stopPropagation(); abierto ? cerrar() : abrir(); });
    }
    // orden de la barra (de izquierda a derecha): Incidencias · Pulso · Mis resultados · campana
    if (b.parentNode !== mr.parentNode || b.nextSibling !== mr) mr.parentNode.insertBefore(b, mr);
    var om = getComputedStyle(mr).order; if (b.style.order !== om) b.style.order = om;
    b.hidden = mr.classList.contains('lm-oculto') || mr.style.display === 'none';
    var ref = document.getElementById('alu-campana-btn'); if (!ref || !ref.offsetHeight) ref = mr;
    if (ref && ref.offsetHeight) { var h = ref.offsetHeight, w = ref.offsetWidth, cs = getComputedStyle(ref);
      var lado = (mr.classList.contains('lm-mr-cuadro') || Math.abs(w - h) < 6) ? Math.max(w, h) : h;
      if (b.style.width !== lado + 'px') { b.style.width = b.style.minWidth = b.style.height = lado + 'px'; }
      if (cs.borderRadius && b.style.borderRadius !== cs.borderRadius) b.style.borderRadius = cs.borderRadius; }
    contador();
  }
  function nuevos() { return D && D.entradas ? grupos(D.entradas).filter(function (g) { return g.nuevo && !g.yo; }).length : 0; }
  function contador() {
    var b = document.getElementById('lm-pulso-btn'); if (!b) return;
    var n = abierto ? 0 : nuevos(), el = b.querySelector('.lp-nb');
    b.classList.toggle('nuevo', n > 0);
    if (n > 0) { if (!el) { el = document.createElement('span'); el.className = 'lp-nb'; el.setAttribute('aria-hidden', 'true'); b.insertBefore(el, b.firstChild);
        try { var ah = b.querySelector('.lp-h').getAnimations()[0], an = el.getAnimations()[0]; if (ah && an) an.currentTime = ah.currentTime; } catch (e) {} }
      el.textContent = String(n); el.className = 'lp-nb' + (n > 99 ? ' n3' : n > 9 ? ' n2' : ''); }
    else if (el) el.remove();
    b.title = n > 0 ? 'Pulso · ' + n + (n === 1 ? ' novedad' : ' novedades') : 'Pulso';
  }

  /* ---- datos ---- */
  function cargar() {
    var s = cuenta(); if (!s || esTester(s) || cargando) return Promise.resolve();
    cargando = true;
    return rpc('suite_pulso_listar', { p_cuenta_id: s.id }).then(function (r) {
      cargando = false; if (r && r.ok) { D = r; contador(); if (abierto) pintar(); }
    });
  }
  /* varias actividades iguales de una persona el mismo día = una entrada */
  function grupos(es) {
    var m = {}, out = [];
    es.forEach(function (e) {
      var k = e.nombre + '|' + e.app + '|' + diaDe(e.fin);
      if (!m[k]) { m[k] = { k: k, sid: e.sid, yo: e.yo, nombre: e.nombre, ini: e.ini, app: e.app, area: e.area, mult: e.mult, fin: e.fin,
                             min: 0, pts: 0, verificado: true, nuevo: false, likes: 0, megusta: false, sids: [], tot: e.tot_min || 0, areas: e.areas || null }; out.push(m[k]); }
      var g = m[k]; g.min += e.min || 0; g.pts += Number(e.pts) || 0; g.verificado = g.verificado && !!e.verificado;
      g.nuevo = g.nuevo || !!e.nuevo; g.likes += e.likes || 0; g.megusta = g.megusta || !!e.megusta; g.sids.push(e.sid);
    });
    return out;
  }

  /* ---- el panel ---- */
  function caja() {
    var m = document.getElementById('lm-pulso');
    if (!m) {
      m = document.createElement('div'); m.id = 'lm-pulso'; m.className = 's' + MODO_SELLO; m.hidden = true; m.setAttribute('role', 'dialog'); m.setAttribute('aria-label', 'Pulso');
      m.addEventListener('click', function (ev) { ev.stopPropagation(); });
      document.body.appendChild(m);
      document.addEventListener('click', function () { if (abierto) cerrar(); });
      document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') { if (document.getElementById('lm-pulso-vid')) cerrarVideo(); else if (abierto) cerrar(); } });
      window.addEventListener('resize', colocar);
    }
    return m;
  }
  function colocar() {
    var m = document.getElementById('lm-pulso'), b = document.getElementById('lm-pulso-btn'); if (!m || !b || m.hidden) return;
    var r = b.getBoundingClientRect(), w = m.offsetWidth;
    var left = Math.min(Math.max(12, r.left + r.width / 2 - w / 2), window.innerWidth - w - 12);
    m.style.left = left + 'px'; m.style.top = (r.bottom + 8) + 'px';
  }
  function abrir() {
    var m = caja(); abierto = true; ajustes = false; pintar(); m.hidden = false; colocar(); contador();
    var s = cuenta(); if (s) rpc('suite_pulso_ajuste', { p_cuenta_id: s.id, p_visto: true });
    cargar();
  }
  function cerrar() {
    var m = document.getElementById('lm-pulso'); if (m) m.hidden = true; abierto = false;
    if (D && D.entradas) D.entradas.forEach(function (e) { e.nuevo = false; });
    contador();
  }
  function pintar() {
    var m = caja();
    var g = D && D.entradas ? grupos(D.entradas) : null;
    var h = '<div class="lp-h"><div><div class="lp-t">Pulso de este grupo' + (D && D.grupo ? ' · <b>' + esc(D.grupo) + '</b>' : '') + '</div>' +
      '<div class="lp-s">Lo que tu grupo trabaja por libre, al momento</div></div>' +
      '<div class="lp-bts">' + (VIDEO_OK ? '<button type="button" class="lp-vid" title="Cómo funciona el Pulso">▶ Ver vídeo</button>' : '') +
      '<button type="button" class="lp-cfg" title="Ajustes del Pulso" aria-label="Ajustes">' + GEAR + '</button>' +
      '<button type="button" class="lp-x" title="Cerrar" aria-label="Cerrar">✕</button></div></div>';
    if (ajustes) {
      var oc = D && D.oculto;
      h += '<div class="lp-aj">' + (oc ? 'Ahora <b>no sales</b> en el Pulso de tu grupo. Tu trabajo por libre cuenta igual en tu actitud.'
                                      : 'Si prefieres, puedes <b>no salir</b> en el Pulso de tu grupo. Tu trabajo por libre cuenta igual en tu actitud.') +
           '<br><button type="button" class="lp-oc">' + (oc ? 'Volver a salir en el Pulso' : 'No salir en el Pulso') + '</button></div>';
    }
    {
    /* (19-nov 11:03, Iago) sensación de equipo, no de competición: el tiempo extra de TODO el grupo este trimestre */
    if (D && D.grupo_min != null) {
      var tm = Number(D.grupo_min) || 0, hh = Math.floor(tm / 60), mm = tm % 60;
      h += '<div class="lp-eq"><div class="lp-eq-t">El pulso de trabajo de este grupo<br>este trimestre' + (D.trimestre ? ' (' + esc(D.trimestre) + ')' : '') + ' es de</div>' +
           '<div class="lp-eq-r"><svg class="lp-eq-p" viewBox="0 0 60 24" preserveAspectRatio="none" aria-hidden="true"><path class="b" d="M0 12h23l2.5-8 4.5 16 3.5-12 2 4h24.5"/><path class="t" pathLength="100" d="M0 12h23l2.5-8 4.5 16 3.5-12 2 4h24.5"/></svg>' +
           '<div class="lp-eq-n">' + (hh ? hh + '<small> h </small>' : '') + (hh && !mm ? '' : mm + '<small> min</small>') + '</div>' +
           '<div class="lp-eq-b">¡Menudo equipazo!</div></div></div>';
    }
    if (!g) h += '<div class="lp-list"><div class="lp-vacio">Cargando…</div></div>';
    else if (!g.length) h += '<div class="lp-list"><div class="lp-vacio">Esta semana todavía no hay actividad por libre en tu grupo.<br>¿Empiezas tú? Lo que hagas por tu cuenta aparecerá aquí.</div></div>';
    else h += '<div class="lp-list">' + g.slice(0, 25).map(fila).join('') + '</div>';
    }
    h += '<div class="lp-pie">Con sello: ya lo ha validado Iago y ha sumado. Sin sello: pendiente de validar.</div>';
    m.innerHTML = h;
    m.querySelector('.lp-x').addEventListener('click', cerrar);
    var bv = m.querySelector('.lp-vid'); if (bv) bv.addEventListener('click', verVideo);
    m.querySelector('.lp-cfg').addEventListener('click', function () { ajustes = !ajustes; pintar(); });
    var oc = m.querySelector('.lp-oc'); if (oc) oc.addEventListener('click', function () {
      var s = cuenta(); if (!s) return; oc.disabled = true;
      rpc('suite_pulso_ajuste', { p_cuenta_id: s.id, p_ocultar: !(D && D.oculto) }).then(function (r) { if (r && r.ok && D) D.oculto = r.oculto; pintar(); });
    });
    colocar();
  }
  function fila(e) {
    var c = COL[e.area] || '#64748b', k = String(e.app || '').replace(/-(ge|gp)$/, ''), app = APP[k] || k;
    var pts = Number(e.pts) || 0, mx = Number(e.mult) > 1.001 ? '<span class="lp-x2" style="background:' + c + '">' + mult(e.mult) + '</span>' : '';
    /* (19-nov 10:43, Iago) a la derecha, lo mismo que ven en el aviso de la campana: minutos, lo que sube de actitud y el sello (si lo tiene) */
    var val = '<div class="lp-val' + (e.verificado ? '' : ' pend') + '"><div class="lp-num"><b>+' + num(pts, 2) + '<small> actitud</small></b>' +
              (COMBO === '4' ? (e.verificado ? '' : '<span class="lp-pv2">pendiente de validar</span>') : '<span>' + e.min + ' min' + (e.verificado ? ' validados' : '') + '</span>') + '</div>' +
              (e.verificado && MODO_SELLO === 'A' ? selloGrande(c) : (e.verificado || COMBO === '4' ? '' : '<span class="lp-pv">Pendiente<br>de validar</span>')) + '</div>' + (e.verificado && MODO_SELLO !== 'A' ? selloGrande(c) : '');
    var totTxt = (COMBO === '1' && e.tot > 0) ? '<span class="lp-ar-n" style="margin-left:6px">' + e.tot + ' min este trimestre</span>' : '';
    return '<div class="lp-e' + (e.yo ? ' lp-yo' : '') + (e.nuevo && !e.yo ? ' nuevo' : '') + '">' + avatar(e, c) +
      '<div><div class="lp-nm">' + esc(e.nombre) + totTxt + '</div>' +
      '<div class="lp-d">' + mx + '<span class="lp-app" style="color:' + c + '">' + esc(app) + '</span></div><div class="lp-d" style="color:#7480a8;font-size:11px">' + hace(e.fin) + (COMBO === '4' && e.tot > 0 ? ' · <b style="color:#aab4d6;font-weight:700">' + e.tot + ' min</b> ' + (D && D.trimestre ? 'en el ' + esc(D.trimestre) : 'este trimestre') : '') + '</div></div>' + val + '</div>';
  }
  function like(k) {
    var s = cuenta(); if (!s || !D) return;
    var g = grupos(D.entradas).filter(function (x) { return x.k === k; })[0]; if (!g) return;
    var on = !g.megusta, sid = g.sids[0];
    D.entradas.forEach(function (e) { if (e.sid === sid) { e.megusta = on; e.likes = Math.max(0, (e.likes || 0) + (on ? 1 : -1)); } });
    if (!on) D.entradas.forEach(function (e) { if (g.sids.indexOf(e.sid) >= 0 && e.sid !== sid && e.megusta) { e.megusta = false; e.likes = Math.max(0, e.likes - 1);
      rpc('suite_pulso_like', { p_cuenta_id: s.id, p_sid: e.sid, p_on: false }); } });
    pintar();
    rpc('suite_pulso_like', { p_cuenta_id: s.id, p_sid: sid, p_on: on });
  }

  function arrancar() {
    boton(); cargar();
    setInterval(boton, 1500);
    setInterval(function () { if (!document.hidden) cargar(); }, 180000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) cargar(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar); else arrancar();
})();
