/* ============================================================================================================
   PREDICT CARRUSEL ONLINE · botón de entrada + cartelito fijo en el portal GE (19-nov-2026, C1 · Carrusel online)
   · Botón con caracol naranja sobre fondo azul psicodélico (la textura del PreDict Carrusel): abre el lobby del
     carrusel online (https://predict.ge.lmathome.es/carrusel-online/). Un puntito avisa: verde parpadeando si hay un
     lobby abierto ahora; naranja si hay partidas anunciadas que aún no has visto.
   · Al pulsar el botón se abre un panel con las partidas activas (abiertas y anunciadas), con «Me apunto» / «Marcar como
     visto» (con aviso: si luego no asistes, −0,25 de actitud; se evita quitándote hasta 5 min antes) y «Anunciar carrusel»
     (con aviso: anfitrión que no asiste, −0,25; se evita cancelando hasta 5 min antes). «Jugar ahora» abre el lobby.
   · Cartelito a la izquierda de «?» (Incidencias): una franja con la partida más próxima a la que te has apuntado; si hay más,
     una flechita despliega las demás hacia abajo. («Tienes un carrusel mañana a las 17:00», «… en 3 h», «… en 25 min»).
     No es una notificación. «Marcar como visto» no lo muestra.
   · GE y, desde el 20-nov-2026, también GP (Carrusel PRO Online, predict.gp.lmathome.es; sesión lmpro_session). Lee `suite_cr_lista` (sus datos son del curso de la cuenta).
   · No toca nada de lo demás: si algo falla, no sale y ya.
   Quitarlo: borrar la línea <script … carrusel-aviso.js> de index.html.
   ============================================================================================================ */
(function () {
  'use strict';
  if (window.__lmCarrAviso) return; window.__lmCarrAviso = 1;
  var GP = /(^|\.)gp\.lmathome\.es$/i.test(location.hostname) || /lmpro/i.test(location.pathname);
  var MI_SRC = (document.currentScript && document.currentScript.src) || '';   /* (20-nov 23:10) para cargar avatar3.js de la misma carpeta */
  /* (20-nov-2026, C1) también en el portal GP: «Carrusel PRO Online» (se abre el martes 24-nov a las 20:00) */
  var NOMBRE = GP ? 'Carrusel PRO Online' : 'Carrusel Online', SESION = GP ? 'lmpro_session' : 'lmeav_session';
  /* (20-nov-2026 20:36, Iago) en GP el botón ya lo ven todos, con «Disponible a partir del martes 24 a las 20:00»; se abre solo
     a esa hora (ABRE). Deshacer: false (entonces solo lo ve el Protester) */
  var GP_PUBLICO = true;
  var SBU = 'https://woiptkyrxkbpnvioypit.supabase.co';
  var SBK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvaXB0a3lyeGticG52aW95cGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NzI2ODYsImV4cCI6MjA5MjA0ODY4Nn0.B2nKgj5rD0rkdLeMIrd9KgD8lUPWsBT4Y7aCtmnvbjA';
  var URL_CARR = GP ? 'https://predict.gp.lmathome.es/carrusel-online/' : 'https://predict.ge.lmathome.es/carrusel-online/';
  var LISTA = [], OK = false, ABIERTO = null;   /* ABIERTO: lo decide el servidor (Tester incluido) */
  /* apertura (19-nov-2026, Iago): elemental desde el viernes 20-nov a las 17:30 (antes 19:00; cambiado el 20-nov 08:40). El servidor también lo
     impide; Tester/Protester siempre pueden. El vídeo de presentación se puede ver antes: poner aquí su enlace (YouTube o .mp4). */
  var ABRE = GP ? Date.parse('2026-11-24T20:00:00+01:00') : Date.parse('2026-11-20T17:30:00+01:00'), ABRE_TXT = GP ? 'el martes 24 de noviembre a las 20:00' : 'hoy viernes a las 17:30';
  /* (24-nov-2026 17:02, Iago, en el aula: «el vídeo va a tirones… tiene que ser un MP4 ya fluido, ya cargado, no una animación»)
     Ahora es el MP4 1080p grabado de cada vídeo (los mismos definitivos, con su voz): se descarga ENTERO con barra y luego se reproduce.
     Deshacer: volver a las páginas vivas video-gp/index.html y video-ge/index.html. */
  var VIDEO_URL = GP ? 'https://ge.lmathome.es/piel/carrusel/carrusel-pro-online-1080.mp4?v=2' : 'https://ge.lmathome.es/piel/carrusel/carrusel-online-ge-1080.mp4?v=1';   /* (21-nov 14:40, Iago: «puedes publicar») el vídeo nuevo de GE, como el de GP; deshacer: volver a carrusel-online-ge.mp4?v=4 */
  /* (21-nov-2026, Iago) el vídeo nuevo de GP es como las intros de Teoría (página viva a pantalla completa). Hasta que lo revise
     y diga «Publica el vídeo del carrusel GP», solo lo ven sus cuentas Tester/Protester. Deshacer: VIDEO_URL de GP = '' */
  var VIDEO_PRUEBA = false;   /* (21-nov 09:38, Iago) el vídeo se activa con todo lo demás, después de su clase del martes */
  function videoVisible() { return !!VIDEO_URL && (!VIDEO_PRUEBA || esTester()); }
  function abreVideo() {   /* a pantalla completa, como abrirVideo de Teoría PRO */
    if (document.getElementById('lm-carr-vid')) return;
    if (/\.mp4(\?|$)/i.test(VIDEO_URL)) return abreMp4();
    var ov = document.createElement('div'); ov.id = 'lm-carr-vid';
    ov.style.cssText = 'position:fixed;inset:0;z-index:2147483646;background:#000;display:flex;align-items:center;justify-content:center';
    ov.innerHTML = '<iframe title="Vídeo del Carrusel Online" allow="autoplay; fullscreen" style="width:100%;height:100%;border:0;display:block"></iframe><button type="button" aria-label="Cerrar el vídeo" title="Cerrar el vídeo" style="position:absolute;top:16px;right:16px;width:52px;height:52px;border-radius:12px;border:1.5px solid rgba(255,255,255,.35);background:rgba(12,10,32,.8);color:#fff;font:700 22px sans-serif;cursor:pointer">✕</button>';
    document.body.appendChild(ov);
    var f = ov.querySelector('iframe'); f.src = VIDEO_URL + (VIDEO_URL.indexOf('?') < 0 ? '?' : '&') + 'auto&embed';
    function cierra() { removeEventListener('message', msg); removeEventListener('keydown', tec, true); if (ov.parentNode) ov.parentNode.removeChild(ov); }
    function msg(e) { if (e.source === f.contentWindow && e.data && e.data.intro === 'salir') cierra(); }
    function tec(e) { if (e.key === 'Escape') { e.stopPropagation(); cierra(); } }
    addEventListener('message', msg); addEventListener('keydown', tec, true);
    ov.querySelector('button').onclick = cierra; try { f.focus(); } catch (e) {}
  }   /* (20-nov-2026 12:58, Iago) el tráiler v4, con un botón discreto «Ver vídeo» */
  /* (24-nov-2026) MP4: primero se descarga entero («Cargando vídeo» + barra que avanza de verdad), después se reproduce desde memoria: sin tirones */
  function abreMp4() {
    var ov = document.createElement('div'); ov.id = 'lm-carr-vid';
    ov.style.cssText = 'position:fixed;inset:0;z-index:2147483646;background:#050403;display:flex;align-items:center;justify-content:center;font-family:inherit';   /* (24-nov 17:59, Iago) ventana centrada más pequeña, como los vídeos didácticos: a pantalla completa se ve cutre */
    ov.innerHTML = '<div class="cg" style="width:min(420px,80vw);text-align:center;color:#fff">' +
      '<div style="font-size:18px;font-weight:700;margin-bottom:14px">Cargando vídeo</div>' +
      '<div style="height:8px;border-radius:6px;background:rgba(255,255,255,.14);overflow:hidden"><div class="br" style="height:100%;width:0;border-radius:6px;background:linear-gradient(90deg,#f97316,#ec4899,#8b5cf6,#38bdf8);transition:width .25s linear"></div></div>' +
      '<div class="pc" style="margin-top:10px;font-size:13px;color:rgba(255,255,255,.6)">0 %</div></div>' +
      '<video playsinline preload="auto" controlslist="nofullscreen" disablepictureinpicture style="display:none;width:min(92vw,calc(86vh*16/9));height:min(51.75vw,86vh);border:1px solid rgba(255,255,255,.22);border-radius:14px;background:#000"></video>' +
      '<button type="button" class="go" style="display:none;position:absolute;padding:16px 28px;border-radius:12px;border:0;background:#f97316;color:#fff;font-weight:700;font-size:20px;font-family:inherit;cursor:pointer">▶ Reproducir</button>' +
      '<button type="button" class="x" aria-label="Cerrar el vídeo" title="Cerrar el vídeo" style="position:absolute;top:16px;right:16px;width:52px;height:52px;border-radius:12px;border:1.5px solid rgba(255,255,255,.35);background:rgba(0,0,0,.45);color:#fff;font-size:26px;line-height:1;cursor:pointer;z-index:2">✕</button>';
    document.body.appendChild(ov);
    var v = ov.querySelector('video'), br = ov.querySelector('.br'), pc = ov.querySelector('.pc'), go = ov.querySelector('.go'), url = null, vivo = true, ctl = null;
    try { ctl = new AbortController(); } catch (e) {}
    function cierra() { vivo = false; try { ctl && ctl.abort(); } catch (e) {} try { v.pause(); } catch (e) {} removeEventListener('keydown', tec, true);
      if (url) { try { URL.revokeObjectURL(url); } catch (e) {} } try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) {} if (ov.parentNode) ov.parentNode.removeChild(ov); }
    function tec(e) { if (e.key === 'Escape') { e.stopPropagation(); cierra(); } }
    addEventListener('keydown', tec, true); ov.querySelector('.x').onclick = cierra;
    function pon(f) { br.style.width = Math.round(f * 100) + '%'; pc.textContent = Math.round(f * 100) + ' %'; }
    function arranca(src) { if (!vivo) return; ov.querySelector('.cg').style.display = 'none'; v.style.display = 'block'; v.controls = true; v.src = src;
      var p = v.play(); if (p && p.catch) p.catch(function () { go.style.display = 'block'; }); }
    go.onclick = function () { go.style.display = 'none'; v.play().catch(function () {}); };
    v.onended = function () { setTimeout(cierra, 600); };
    fetch(VIDEO_URL, ctl ? { signal: ctl.signal } : {}).then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      var tot = +r.headers.get('content-length') || 0;
      if (!r.body || !r.body.getReader || !tot) return r.blob();
      var rd = r.body.getReader(), trozos = [], n = 0;
      return (function lee() { return rd.read().then(function (x) { if (x.done) return new Blob(trozos, { type: 'video/mp4' });
        trozos.push(x.value); n += x.value.length; pon(Math.min(1, n / tot)); return lee(); }); })();
    }).then(function (b) { if (!vivo) return; pon(1); url = URL.createObjectURL(b); arranca(url); })
      .catch(function () {   /* si no se puede descargar antes, que al menos lo cargue el navegador entero antes de empezar */
        if (!vivo) return; pc.textContent = 'Cargando…'; v.preload = 'auto'; v.src = VIDEO_URL;
        v.oncanplaythrough = function () { v.oncanplaythrough = null; arranca(VIDEO_URL); }; try { v.load(); } catch (e) {} });
  }

  function ses() { try { return JSON.parse(localStorage.getItem(SESION) || 'null') || window.__LM_SES || null; } catch (e) { return window.__LM_SES || null; } }
  function cuenta() { var s = ses(); return (s && s.id && s.estado === 'validado') ? s : null; }
  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toLowerCase(); }
  function esTester() { var s = ses(); return !!(s && /tester/.test(norm(s.nombre))); }
  function cerrado() { if (ABIERTO === true) return false; return Date.now() < ABRE && !esTester(); }
  function videoHTML(u) {
    if (!u || !videoVisible()) return '<div class="vacio">El vídeo de presentación estará aquí muy pronto.</div>';
    if (/\.html/.test(u)) return '<button type="button" class="bt vv">' + I_PLAY + 'Ver el vídeo</button>';
    var y = u.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
    if (y) return '<div class="vid"><iframe src="https://www.youtube-nocookie.com/embed/' + y[1] + '?rel=0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe></div>';
    return '<div class="vid"><video src="' + esc(u) + '" controls playsinline preload="metadata" poster="' + esc(u.replace(/\.mp4$/, '.jpg')) + '"></video></div>';
  }
  async function lista() {
    var c = cuenta(); if (!c) return null;
    try {
      var r = await fetch(SBU + '/rest/v1/rpc/suite_cr_lista', { method: 'POST', headers: { 'apikey': SBK, 'Authorization': 'Bearer ' + SBK, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_cuenta: c.id }) });
      if (!r.ok) return null; var j = await r.json(); if (j && j.ok && typeof j.abierto === 'boolean') ABIERTO = j.abierto; return (j && j.ok) ? (j.partidas || []) : null;
    } catch (e) { return null; }
  }

  /* ---- cuándo (como en el lobby) ---- */
  function cuando(iso) {
    var d = new Date(iso), ahora = new Date(); if (isNaN(d)) return '';
    var mid = function (x) { var y = new Date(x); y.setHours(0, 0, 0, 0); return y.getTime(); };
    var dd = Math.round((mid(d) - mid(ahora)) / 864e5), hh = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    var dia = dd === 0 ? 'hoy' : dd === 1 ? 'mañana' : (dd > 6 ? 'el ' + d.getDate() + '/' + (d.getMonth() + 1) : 'el ' + d.toLocaleDateString('es-ES', { weekday: 'long' }));
    return dia + ' a las ' + hh;
  }
  /* (20-nov 23:08, Iago) «son 4 jugadores realmente»: el anfitrión cuenta y su monigote también sale (el primero) */
  function jugadores(p) { return Math.max(1, p.apuntados || 0); }
  function nombresJug(p) { var an = p.anfitrion || p.creador, l = (p.confirmados || []).slice(); if (an && l.indexOf(an) < 0) l.unshift(an); return l; }
  function confirmados(p) { var n = jugadores(p); return n + (n === 1 ? ' jugador' : ' jugadores'); }
  function texto(p) {
    if (p.soy_creador) {
      if (p.lobby_abierto) return '¡Tu carrusel está abierto!';
      return 'Tu carrusel ' + cuando(p.programada);
    }
    if (sinAnf(p)) return '¡El anfitrión ha cancelado!';
    if (p.lobby_abierto) return '¡Carrusel abierto!';   /* (20-nov 18:25) + botón «Entrar al lobby» en la propia franja */
    var min = Math.round((new Date(p.programada).getTime() - Date.now()) / 6e4);
    if (min <= 1) return 'Carrusel: empieza ya';
    return 'Carrusel ' + cuando(p.programada);
  }

  /* ---- red ---- */
  async function rpcA(fn, args) {
    try {
      var r = await fetch(SBU + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { 'apikey': SBK, 'Authorization': 'Bearer ' + SBK, 'Content-Type': 'application/json' }, body: JSON.stringify(args || {}) });
      if (!r.ok) return { ok: false, error: 'http_' + r.status }; return await r.json();
    } catch (e) { return { ok: false, error: 'red' }; }
  }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function grupoTxt(g) { return g ? String(g).replace(/ge$/i, '').toUpperCase().replace(/^(\d)([A-Z])/, '$1.º $2') : ''; }
  /* (20-nov-2026 12:55, Iago) si el anfitrión cancela, aviso con «!» a los apuntados: pueden heredar la partida (sus minutos ×1,5) */
  function sinAnf(p) { return !!(p && p.yo === 'si' && p.anfitrion_cancelo && !p.anfitrion && !p.soy_creador && !p.lobby_abierto); }
  function soyAnf(p) { return p.soy_anfitrion === true || (p.soy_anfitrion === undefined && p.soy_creador && !p.anfitrion_cancelo); }
  function tarde(p) { return p && p.tipo === 'anunciada' && Date.now() > new Date(p.programada).getTime() - 5 * 60e3; }

  /* ---- estilos ---- */
  var TEX_AZUL = 'repeating-radial-gradient(circle at 50% 50%,rgba(255,255,255,0) 0 2px,rgba(255,255,255,.14) 2px 3.5px),conic-gradient(from 200deg at 50% 50%,#1e3a8a,#2563eb,#38bdf8,#6366f1,#0ea5e9,#1e40af,#22d3ee,#1e3a8a)';
  var TEX_MULTI = 'repeating-radial-gradient(circle at 50% 50%,rgba(10,7,30,0) 0 5px,rgba(10,7,30,.22) 5px 10px),radial-gradient(ellipse at 50% 50%,rgba(10,7,30,.50),rgba(10,7,30,.78)),conic-gradient(from 0deg at 50% 50%,#5bd0ff,#bd92ff,#ff5fa2,#fff,#ffd23f,#34d399,#5bd0ff)';
  /* (19-nov, Iago) el botón, con colores más vivos: velo oscuro intermedio (antes ,50→,78) */
  var TEX_BTN = TEX_MULTI.replace('rgba(10,7,30,.22) 5px 10px','rgba(10,7,30,.14) 5px 10px').replace('rgba(10,7,30,.50),rgba(10,7,30,.78)','rgba(10,7,30,.22),rgba(10,7,30,.50)');
  function css() {
    if (document.getElementById('lm-carr-css')) return;
    var st = document.createElement('style'); st.id = 'lm-carr-css';
    st.textContent =
      '#lm-carr-btn,#lm-carr-aviso{box-sizing:border-box;flex:0 0 auto;align-self:center;position:relative;margin:0;font-family:inherit}' +
      /* el botón: la misma textura multicolor de las franjas; quieto si no hay nada que mirar, en movimiento si lo hay */
      '#lm-carr-btn{order:-5;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;border:0;padding:0;width:var(--lm-ctl,34px);height:var(--lm-ctl,34px);min-width:var(--lm-ctl,34px);border-radius:10px;color:#fff;background:#0a071e;box-shadow:inset 0 0 0 1px rgba(255,255,255,.28);transition:filter .15s}' +
      '#lm-carr-btn:hover,#lm-carr-btn.abierto{filter:brightness(1.14)}#lm-carr-btn:focus-visible{outline:2px solid #fff;outline-offset:2px}' +
      '#lm-carr-btn svg{position:relative;width:22px;height:22px;display:block;pointer-events:none;stroke-width:2.1;filter:drop-shadow(0 0 2px rgba(10,7,30,.95)) drop-shadow(0 0 5px rgba(10,7,30,.7))}' +
      /* (21-nov-2026 11:16, Iago) con algo activo se mueve TODO el botón: la textura en espiral gira y respira, la espiral blanca
         gira sobre su propio centro (hacia fuera, como ondas que salen) y el número late suave. Nada de anillos alrededor. */
      '#lm-carr-btn svg{transform-origin:54.17% 45.83%}#lm-carr-btn.mov svg{animation:lmCarrEsp 6s linear infinite;will-change:transform}@keyframes lmCarrEsp{to{transform:rotate(-360deg)}}' +
      '#lm-carr-btn .pto{z-index:3;position:absolute;right:-4px;top:-4px;min-width:17px;height:17px;padding:0 4px;box-sizing:border-box;border-radius:9px;border:2px solid #0f172a;background:#f97316;color:#fff;font:900 10px/1 system-ui,sans-serif;display:none;align-items:center;justify-content:center;font-variant-numeric:tabular-nums}' +
      '#lm-carr-btn .pto.on{display:inline-flex}' +
      /* (20-nov-2026 22:00, Iago) «que haya algún tipo de pulsión para que no se les escape apuntarse»: el botón late (onda naranja)
         SOLO mientras hay algo nuevo que aún no has visto; al abrir el panel deja de latir. El número sigue hasta que respondes
         («Me apunto» o «Marcar como visto»); al marcar como visto desaparece también el número. */
      '#lm-carr-btn::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:4;opacity:0}' +
      '#lm-carr-btn.pulsa .pto{animation:lmCarrLate 1.6s ease-in-out infinite}' +
      '@keyframes lmCarrLate{0%,100%{transform:scale(1)}50%{transform:scale(1.16)}}' +
      '@media (prefers-reduced-motion:reduce){#lm-carr-btn.pulsa .pto{animation:none}}' +
      '@media (prefers-reduced-motion:reduce){#lm-carr-btn.mov svg{animation:none}}' +
      /* el cartelito: una franja por partida; la más próxima a la vista y las demás debajo, tras la flechita */
      '#lm-incid-btn{order:-6!important}' +
      '#lm-carr-aviso{order:-7;z-index:2147480400;display:inline-flex;align-items:center;gap:4px}' +
      /* (21-nov 11:19, Iago) la franja no puede quedar por encima de «Tus notificaciones» */
      'body:has(.alu-modal.open) #lm-carr-aviso,body:has(.alu-resp-modal) #lm-carr-aviso{visibility:hidden}' +
      '.lm-fr{display:inline-flex;align-items:center;gap:7px;box-sizing:border-box;height:var(--lm-ctl,34px);padding:0 12px 0 9px;border-radius:10px;color:#fff;font:800 13px/1 inherit;font-family:inherit;letter-spacing:.01em;white-space:nowrap;max-width:470px;overflow:hidden;text-decoration:none;cursor:pointer;' +
      'background:#140f33;box-shadow:inset 0 0 0 1px rgba(255,255,255,.28);text-shadow:0 1px 6px rgba(0,0,0,.55);border:0;position:relative;isolation:isolate}' +
      '.lm-fr > svg,.lm-fr > span:not(.cl){position:relative;z-index:1}' +
      '.lm-fr::after,#lm-carr-btn::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 0 1px rgba(255,255,255,.28);pointer-events:none;z-index:2}' +
      '.lm-fr.alerta::after{box-shadow:inset 0 0 0 2px #ff9a3c}.lm-fr .ex,#lm-carr-btn .pto.ex{font-weight:900}.lm-fr .ex{position:relative;z-index:1;display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:5px;background:#ff9a3c;color:#1b1406;font-size:13px;line-height:1}' +
      '#lm-carr-pan .pt .alerta{display:flex;gap:9px;align-items:flex-start;margin-top:8px;padding:9px 11px;border-radius:10px;background:rgba(255,154,60,.14);border:1.5px solid #ff9a3c;font-size:13.5px;line-height:1.4}#lm-carr-pan .pt .alerta .ex{flex:none;display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:6px;background:#ff9a3c;color:#1b1406;font-weight:900;font-size:14px}' +
      '.lm-fr.mia::after{box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.95)}.lm-fr.vivo::after{box-shadow:inset 0 0 0 1.5px #22c55e}' +
      '.lm-fr .cl,#lm-carr-btn .cl{position:absolute;inset:0;overflow:hidden;border-radius:inherit;pointer-events:none;z-index:0}' +
      '.lm-fr .gi,#lm-carr-btn .gi{position:absolute;left:50%;top:50%;width:150%;aspect-ratio:1;margin:0;transform:translate(-50%,-50%);will-change:transform}' +
      '#lm-carr-btn .gi{width:200%}' +
      '.lm-fr .fx,#lm-carr-btn .fx{position:absolute;inset:0;background:' + TEX_MULTI.replace('ellipse','circle') + ';will-change:transform;backface-visibility:hidden}' +
      '#lm-carr-btn .fx{background:' + TEX_BTN.replace('ellipse','circle') + '}' +
      '.lm-fr .gi,#lm-carr-btn.mov .gi{animation:lmCarrRot 9.6s linear infinite}' +
      '.lm-fr .fx,#lm-carr-btn.mov .fx{animation:lmCarrRes 3.2s ease-in-out infinite alternate}' +
      '@keyframes lmCarrRot{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}' +
      '@keyframes lmCarrRes{from{transform:scale(.72)}to{transform:scale(1.18)}}' +
      '@media (prefers-reduced-motion:reduce){.lm-fr .gi,.lm-fr .fx,#lm-carr-btn .gi,#lm-carr-btn .fx{animation:none!important}}' +
      
      '.lm-fr:hover{filter:brightness(1.12)}.lm-fr svg{width:17px;height:17px;flex:none;color:#fff}' +
      
      '#lm-carr-aviso .mas{position:relative;display:inline-flex;align-items:center;justify-content:center;width:var(--lm-ctl,34px);height:var(--lm-ctl,34px);min-width:var(--lm-ctl,34px);padding:0;border:0;border-radius:10px;cursor:pointer;color:#fff;background:rgba(10,7,30,.72);box-shadow:inset 0 0 0 1px rgba(255,255,255,.28)}' +
      '#lm-carr-aviso .mas .n{position:absolute;right:-4px;top:-4px;min-width:17px;height:17px;padding:0 4px;box-sizing:border-box;border-radius:9px;border:2px solid #0f172a;background:#e2e8f0;color:#0f172a;font:900 10px/1 system-ui,sans-serif;display:inline-flex;align-items:center;justify-content:center}' +
      '#lm-carr-aviso .mas svg{width:15px;height:15px;transition:transform .15s}#lm-carr-aviso .mas.abierto svg{transform:rotate(180deg)}' +
      '#lm-carr-aviso .resto{position:absolute;left:0;top:calc(100% + 5px);display:flex;flex-direction:column;gap:5px;z-index:2147480400}' +
      '#lm-carr-aviso .resto[hidden]{display:none}' +
      '#lm-carr-btn[hidden],#lm-carr-aviso[hidden]{display:none!important}' +
      '#lm-iconos>#lm-carr-btn{order:0!important}' +
      /* monigotes de confirmados (en la franja del anfitrión) */
      '.lm-fr .nap{font-weight:800;margin-left:2px;white-space:nowrap}' +
      '.lm-fr .num{position:relative;display:inline-flex;align-items:center;margin:0 10px 0 2px;flex:none}.lm-fr .num svg{width:17px;height:17px}' +
      '.lm-fr .num b{position:absolute;top:-7px;right:-11px;min-width:16px;height:16px;padding:0 4px;box-sizing:border-box;border-radius:8px;background:#f97316;color:#fff;font:800 10.5px/16px system-ui,sans-serif;text-align:center;box-shadow:0 0 0 1.5px rgba(14,10,42,.85)}' +
      '.lm-fr .ent{background:#fff;color:#14112b;border-radius:6px;padding:5px 9px;font-weight:900;margin-left:3px;white-space:nowrap}' +
      '.lm-fr .mon{display:inline-flex;align-items:center;gap:6px;margin-left:4px}.lm-fr .mon .m{display:inline-flex;align-items:center;gap:2px;white-space:nowrap}.lm-fr .mon svg{width:13px;height:13px;flex:none}.lm-fr .mon b{font-weight:600;font-size:10px;opacity:.92}.lm-fr .mon i{font-style:normal;font-size:11px;margin-left:2px}' +
      /* la ventana emergente: la portada de PreDict Carrusel (remolino multicolor, cristal oscuro, botones blancos) */
      '#lm-carr-pan{position:fixed;inset:0;z-index:2147480500;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;background:rgba(3,6,12,.62);font-family:"Helvetica Neue",Arial,system-ui,sans-serif;color:#fff}' +
      '#lm-carr-pan[hidden]{display:none}#lm-carr-pan *{box-sizing:border-box}' +
      '#lm-carr-pan .marco{position:relative;width:min(980px,100%);max-height:min(86vh,860px);display:flex;border-radius:16px;border:1.5px solid rgba(255,255,255,.26);box-shadow:0 30px 90px rgba(0,0,0,.6);overflow:hidden;background:#120d34;isolation:isolate}' +
      '#lm-carr-pan .marco > .cl{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0}' +
      '#lm-carr-pan .marco .gi{position:absolute;left:50%;top:62%;width:170%;aspect-ratio:1;transform:translate(-50%,-50%);will-change:transform;animation:lmCarrRot 60s linear infinite}' +
      '#lm-carr-pan .marco .fx{position:absolute;inset:0;will-change:transform;backface-visibility:hidden;animation:lmCarrRes 7s ease-in-out infinite alternate;background:repeating-radial-gradient(circle at 50% 50%,rgba(10,7,30,0) 0 26px,rgba(10,7,30,.38) 26px 52px),radial-gradient(circle at 50% 50%,rgba(10,7,30,.40),rgba(10,7,30,.84) 45%),conic-gradient(from 0deg at 50% 50%,#5bd0ff,#bd92ff,#ff5fa2,#ff9a3c,#ffd23f,#34d399,#5bd0ff)}' +
      '#lm-carr-pan .caja{position:relative;z-index:1;flex:1;width:100%;max-height:min(86vh,860px);overflow:auto;padding:22px 26px 24px;box-sizing:border-box}' +
      '#lm-carr-pan .top{display:flex;align-items:center;gap:16px;margin:0 0 16px}' +
      '#lm-carr-pan .lg{position:relative;width:64px;height:64px;flex:none}#lm-carr-pan .lg svg{width:100%;height:100%;display:block;animation:lmCarrGira 26s linear infinite;filter:drop-shadow(0 4px 14px rgba(0,0,0,.45))}' +
      '#lm-carr-pan .tt{display:flex;align-items:baseline;gap:10px;line-height:1;text-shadow:0 6px 26px rgba(0,0,0,.5)}' +
      '#lm-carr-pan .pre{font-size:38px;font-weight:800;letter-spacing:-.03em}#lm-carr-pan .dict{font-size:38px;font-weight:300;color:#e2ddff;letter-spacing:-.03em;margin-left:-8px}' +
      '#lm-carr-pan .car{font-family:Georgia,"Times New Roman",serif;font-style:italic;font-weight:700;font-size:27px;display:inline-block;transform:rotate(-8deg) translateY(-4px);padding:0 .1em;background:linear-gradient(100deg,#5bd0ff 8%,#ffd23f 40%,#ff9a3c 60%,#bd92ff 92%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent}' +
      '#lm-carr-pan .tt .pro{font-family:"Helvetica Neue",Arial,sans-serif;font-weight:900;letter-spacing:.05em;font-size:26px;margin:0 6px 0 4px;background:linear-gradient(180deg,#fff3c2,#f5d061 45%,#c99a1e);-webkit-background-clip:text;background-clip:text;color:transparent}' +
      '#lm-carr-pan .tt .car{font-size:40px;font-style:normal;font-weight:700;transform:none;padding:0 .02em;letter-spacing:-.01em}#lm-carr-pan .meg{display:inline-flex;vertical-align:-3px;margin-left:7px}#lm-carr-pan .meg svg{width:19px;height:19px}#lm-carr-pan .card .row:has(.fh){flex-wrap:nowrap}#lm-carr-pan .fh{flex:1;min-width:0}#lm-carr-pan .fh input{width:100%;min-width:0;box-sizing:border-box}#lm-carr-pan .card .row:has(.fh) .bt{flex:none}#lm-carr-pan .onl{font-size:38px;font-weight:300;color:#e2ddff;letter-spacing:-.02em}' +   /* (19-nov 21:46, Iago) «Carrusel Online», ya no PreDict */
      '#lm-carr-pan .kick{margin-top:10px;font-size:14px;font-weight:700;letter-spacing:.06em;color:#f1eeff}' +
      '#lm-carr-pan .vv{margin-left:auto;align-self:flex-start;display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 13px;border-radius:10px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.06);color:rgba(255,255,255,.88);font:800 13px/1 inherit;font-family:inherit;cursor:pointer}#lm-carr-pan .vv:hover{background:rgba(255,255,255,.14);color:#fff}#lm-carr-pan .vv svg.sv{width:14px;height:14px}#lm-carr-pan .vv + .x{margin-left:8px}#lm-carr-pan .x svg.sv{width:16px;height:16px}#lm-carr-pan .x{margin-left:auto;align-self:flex-start;width:36px;height:36px;border-radius:10px;border:1.5px solid rgba(255,255,255,.42);background:rgba(10,8,30,.45);color:#fff;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0}' +
      '#lm-carr-pan .cols{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}' +
      '#lm-carr-pan .card{background:rgba(14,10,42,.74);border:1.5px solid rgba(255,255,255,.24);border-radius:14px;padding:18px 20px;}' +
      /* (20-nov 23:10, Iago) «Tu avatar»: 25 % abajo a la derecha, cuadrado */
      '#lm-carr-pan .fila2{display:grid;grid-template-columns:minmax(0,3fr) minmax(0,1fr);gap:14px;align-items:stretch}#lm-carr-pan .fila2>.card{min-width:0;box-sizing:border-box}' +
      '#lm-carr-pan .card.yo{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:8px;width:100%;min-height:290px;padding:18px 14px 16px;text-align:center}#lm-carr-pan .card.yo .yoin{position:sticky;top:10px;display:flex;flex-direction:column;align-items:center;gap:8px;width:100%;margin-top:6px}' +
      '#lm-carr-pan .card.yo h2{align-self:flex-start;margin:0}#lm-carr-pan .card.yo .avw{width:100%;display:grid;place-items:center}#lm-carr-yo .avw .yoav{width:min(100%,220px);aspect-ratio:1/1}' +
      '#lm-carr-pan .pt .gen{flex-basis:100%;width:100%;margin-top:-4px}#lm-carr-pan .pt .gen .lob{max-width:calc(100% - 200px);width:max-content;white-space:nowrap}#lm-carr-pan .avs{display:flex;flex-wrap:wrap;gap:8px 10px;margin-top:0}#lm-carr-pan .ava{display:flex;flex-direction:column;align-items:center;width:76px}#lm-carr-pan .ava .mav,#lm-carr-pan .ava .ph{display:block;width:72px;height:72px}#lm-carr-pan .ava b{display:flex;align-items:center;gap:3px;max-width:84px;margin-top:3px;font-size:11.5px;font-weight:700;color:rgba(255,255,255,.86);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#lm-carr-pan .ava .meg{display:inline-flex;font-style:normal;color:#ffd23f}#lm-carr-pan .ava .meg svg{width:13px;height:13px}#lm-carr-pan .avs .mas{align-self:center;font-weight:800;color:rgba(255,255,255,.7)}' +
      '#lm-carr-pan .fila2>.card:first-child{display:flex;flex-direction:column}#lm-carr-pan .fila2 .vacio{flex:1;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px 10px;font-size:17px;color:rgba(255,255,255,.72)}#lm-carr-pan .card.yo .falta{border:0;background:none;padding:2px 0;color:#fdba74;font:700 12.5px/1.2 inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer}' +
      /* (21-nov 07:13, Iago) megáfono animado junto a «Partidas anunciadas», como anunciando */
      '#lm-carr-pan h2 .megA{display:inline-flex;vertical-align:-6px;margin-left:10px;color:#fff}#lm-carr-pan h2 .megA .cu{transform-box:fill-box;transform-origin:15% 60%;animation:lmMegTil 2.6s ease-in-out infinite}' +
      '#lm-carr-pan h2 .megA .on{stroke:#f97316;opacity:0;animation:lmMegOnda 1.3s ease-out infinite}#lm-carr-pan h2 .megA .o2{animation-delay:.22s}#lm-carr-pan h2 .megA .o3{animation-delay:.44s}' +
      '@keyframes lmMegTil{0%,55%,100%{transform:rotate(0)}64%{transform:rotate(-9deg)}73%{transform:rotate(5deg)}82%{transform:rotate(-4deg)}91%{transform:rotate(2deg)}}' +
      '@keyframes lmMegOnda{0%{opacity:0;transform:translateX(-2px)}35%{opacity:1}100%{opacity:0;transform:translateX(3px)}}' +
      '@media (prefers-reduced-motion:reduce){#lm-carr-pan h2 .megA *{animation:none!important}#lm-carr-pan h2 .megA .on{opacity:1}}' +
      '#lm-carr-pan .card.yo .nm{font-weight:800;font-size:15px}#lm-carr-pan .card.yo .bt{padding:7px 11px;font-size:13.5px}#lm-carr-pan .card.yo .cg{color:rgba(255,255,255,.55);font-size:13px}' +
      '#lm-carr-pan h2{margin:0 0 10px;font-size:14px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}' +
      '#lm-carr-pan h2::after{content:"";display:block;width:36px;height:2px;margin-top:7px;background:linear-gradient(90deg,#5bd0ff,#ffd23f,#ff9a3c,#bd92ff)}' +
      '#lm-carr-pan p{margin:0 0 12px;color:#d9d3ff;font-size:15px;line-height:1.4}#lm-carr-pan p b{color:#fff}' +
      '#lm-carr-pan .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}' +
      '#lm-carr-pan .bt{font:700 15px/1 "Helvetica Neue",Arial,sans-serif;color:#fff;background:rgba(10,8,30,.45);border:1.5px solid rgba(255,255,255,.42);border-radius:10px;padding:11px 16px;cursor:pointer;display:inline-flex;align-items:center;gap:7px}' +
      '#lm-carr-pan .bt:hover{background:rgba(255,255,255,.16)}#lm-carr-pan .bt:disabled{opacity:.45;cursor:default}' +
      '#lm-carr-pan .bt.pri{background:#fff;border-color:#fff;color:#1a1238;font-weight:800}#lm-carr-pan .bt.pri:hover{filter:brightness(.94)}' +
      '#lm-carr-pan .bt.pri.sel{background:#22c55e;border-color:#22c55e;color:#fff}' +
      '#lm-carr-pan .bt.ko{background:#ef4444;border-color:#ef4444;color:#fff;font-weight:800}#lm-carr-pan .bt.ko:hover{filter:brightness(.92)}' +
      /* (19-nov, Iago) «Cancelar partida» ocupa exactamente lo mismo que «Me apunto» + ✕ */
      '#lm-carr-pan .pt > .row .ap{display:inline-flex;align-items:center;gap:6px;color:#4ade80;font-weight:800;white-space:nowrap;padding:0 6px}#lm-carr-pan .pt > .row .ap svg{width:18px;height:18px}' +
      '#lm-carr-pan .pt > .row{width:300px;flex:none;flex-wrap:nowrap;justify-content:flex-end}#lm-carr-pan .pt > .row .bt{white-space:nowrap}#lm-carr-pan .pt > .row .bt:not(.pri):not(.ico){padding:11px 12px}#lm-carr-pan .pt > .row .bt.pri,#lm-carr-pan .pt > .row .bt.ko{flex:1;justify-content:center}' +
      '#lm-carr-pan .bt.ico{width:40px;height:40px;padding:0;justify-content:center}' +
      '#lm-carr-pan svg.sv{width:17px;height:17px;flex:none}' +
      '#lm-carr-pan .fh{position:relative;display:inline-flex}#lm-carr-pan .fh .ph{position:absolute;inset:0;display:flex;align-items:center;gap:9px;padding:0 14px;pointer-events:none;font:700 15px "Helvetica Neue",Arial,sans-serif;color:#ffd23f;white-space:nowrap}' +
      '#lm-carr-pan .fh .ph svg{width:19px;height:19px;flex:none}#lm-carr-pan .fh:not(.vacio) .ph{display:none}#lm-carr-pan .fh.vacio input{color:transparent;border-style:dashed;border-color:rgba(255,210,63,.85);cursor:pointer}#lm-carr-pan .fh.vacio input::-webkit-datetime-edit{opacity:0}#lm-carr-pan .fh.vacio input::-webkit-calendar-picker-indicator{opacity:0}#lm-carr-pan .fh.vacio:hover input{background:rgba(255,210,63,.1)}' +
      '#lm-carr-pan input{background:rgba(10,8,30,.5);border:1.5px solid rgba(255,255,255,.42);border-radius:10px;color:#fff;padding:10px 12px;font:15px "Helvetica Neue",Arial,sans-serif;color-scheme:dark}' +
      '#lm-carr-pan .pt{display:flex;gap:12px;align-items:center;flex-wrap:wrap;padding:13px 0;border-top:1px solid rgba(255,255,255,.18)}#lm-carr-pan h2 + .pt{border-top:0}' +
      '#lm-carr-pan .pt .inf{flex:1;min-width:220px}#lm-carr-pan .q{font-weight:800;font-size:18px}#lm-carr-pan .q .g{color:#d9d3ff;font-weight:700}' +
      '#lm-carr-pan .c{color:#d9d3ff;font-size:14px;margin-top:3px}' +
      /* (20-nov, Iago) «Tu partida» más destacada: tarjeta dorada propia */ '#lm-carr-pan .pt.mia{border:2px solid rgba(255,210,63,.9);border-radius:12px;padding:12px 14px;margin:6px 0;background:linear-gradient(135deg,rgba(255,210,63,.22),rgba(255,122,192,.10));box-shadow:0 0 0 4px rgba(255,210,63,.14),0 8px 24px rgba(0,0,0,.35)}#lm-carr-pan .pt.mia + .pt{border-top:0}#lm-carr-pan .pt.mia .q{color:#ffe28a;font-weight:800}#lm-carr-pan .cor svg{width:17px;height:17px;vertical-align:-3px;margin-right:6px}' +
      '#lm-carr-pan .mon{display:inline-flex;flex-wrap:wrap;gap:4px 12px;align-items:center}#lm-carr-pan .mon .m{display:inline-flex;align-items:center;gap:3px;white-space:nowrap}#lm-carr-pan .mon svg{width:15px;height:15px;flex:none}#lm-carr-pan .mon b{font-weight:600;font-size:12px}#lm-carr-pan .mon i{font-style:normal;font-size:12px}' +
      '#lm-carr-pan .sq{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:7px}#lm-carr-pan .sq.v{background:#22c55e}#lm-carr-pan .sq.a{background:#f97316}' +
      '#lm-carr-pan .vid{position:relative;width:100%;max-width:760px;margin:0 auto;aspect-ratio:16/9;border-radius:12px;overflow:hidden;background:#000;border:1.5px solid rgba(255,255,255,.24)}#lm-carr-pan .vid iframe,#lm-carr-pan .vid video{position:absolute;inset:0;width:100%;height:100%;border:0}' +
      '#lm-carr-pan .vacio{color:#d9d3ff;padding:4px 0}' +
      '#lm-carr-pan .msg{margin:0 0 12px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,.1);font-size:14px}' +
      '#lm-carr-pan .pt > .row .ap.anf{color:#ffd23f}#lm-carr-pan .pt{position:relative}#lm-carr-pan .pt .nop{position:absolute;right:14px;bottom:8px;border:0;background:none;padding:2px 0;color:#bdb6e6;font:600 12.5px/1.2 inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer}#lm-carr-pan .pt .nop:hover{color:#fff}' +
      '#lm-carr-pan .pt .lob{display:inline-flex;align-items:center;gap:7px;margin-top:8px;padding:6px 11px;border-radius:8px;background:#fff;color:#1a1238;font-size:13.5px;font-weight:700}#lm-carr-pan .pt .lob svg{flex:none;color:#f97316}' +   /* (20-nov 21:03, Iago) que destaque: fondo blanco */
      '#lm-carr-pan .conf .disp{display:flex;gap:10px;align-items:center;background:rgba(255,210,63,.14);border:1.5px solid rgba(255,210,63,.55);border-radius:10px;padding:9px 12px;font-weight:700}#lm-carr-pan .conf .disp svg{flex:none;width:34px;height:22px}' +
      '#lm-carr-pan .conf{position:fixed;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;background:rgba(5,3,20,.66)}' +
      '#lm-carr-pan .conf .cm{max-width:470px;background:rgba(18,13,52,.97);border:1.5px solid rgba(255,255,255,.34);border-radius:14px;padding:22px 24px;box-shadow:0 24px 70px rgba(0,0,0,.6)}' +
      '#lm-carr-pan .rojo{color:#ef4444;font-weight:800}#lm-carr-pan .conf h3{margin:0 0 10px;font-size:22px;font-weight:900}#lm-carr-pan .conf p{color:#f1eeff;margin:0 0 16px}#lm-carr-pan .conf .row{justify-content:flex-end}' +
      /* (20-nov) el campo de la fecha es un botón que abre el selector propio */ '#lm-carr-pan button.fh{display:flex;align-items:center;gap:9px;height:42px;padding:0 14px;box-sizing:border-box;border-radius:10px;border:1.5px solid rgba(255,255,255,.42);background:rgba(10,8,30,.5);color:#fff;font:700 15px "Helvetica Neue",Arial,sans-serif;cursor:pointer;white-space:nowrap;text-align:left}#lm-carr-pan button.fh svg{width:19px;height:19px;flex:none}#lm-carr-pan button.fh .ph{position:static;inset:auto;padding:0;display:none;color:inherit;font:inherit}#lm-carr-pan button.fh.vacio{border-style:dashed;border-color:rgba(255,210,63,.85);color:#ffd23f}#lm-carr-pan button.fh.vacio .ph{display:inline}#lm-carr-pan button.fh.vacio .vl{display:none}#lm-carr-pan button.fh:hover{background:rgba(255,210,63,.1)}' +
      /* (21-nov-2026 19:00, incidencia de Margarita, 4.º A: «en la parte de arriba no me sale el apartado del carrusel, pero sí en la campana»; su ventana era de 609 px)
         Antes se escondía por ANCHO de ventana (<900 px): eso también lo quitaba en ordenadores con la ventana estrecha y en tablets en vertical.
         Ahora solo se esconde en el MÓVIL, con el mismo criterio que el juego (esMovilCarr). Deshacer: volver a la regla @media (max-width:900px). */
      'html.lm-carr-movil #lm-carr-btn,html.lm-carr-movil #lm-carr-aviso,html.lm-carr-movil #lm-carr-pan{display:none!important}' +
      /* (22-nov-2026) visor del profe en pantalla pequeña: icono y franja en una segunda línea, bajo los botones, sin pisar el saludo */
      '@media (max-width:700px){html.lm-carr-visor .topbar{margin-bottom:58px!important}html.lm-carr-visor .topbar .topbar-right{position:relative}html.lm-carr-visor #lm-carr-btn{position:absolute;top:calc(100% + 14px);right:0;z-index:30}html.lm-carr-visor #lm-carr-aviso{position:absolute;top:calc(100% + 14px);right:calc(var(--lm-ctl,34px) + 10px);z-index:30}html.lm-carr-visor #lm-carr-aviso .lm-fr{max-width:calc(100vw - 70px)}}' +
      '@media (max-width:700px){#lm-carr-yo #lm-carr-pers{max-width:100%;min-width:0;box-sizing:border-box;padding-left:6px;padding-right:6px;font-size:12px;white-space:nowrap;justify-content:center}#lm-carr-yo #lm-carr-pers svg{display:none}}';
    document.head.appendChild(st);
  }
  var ESP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 11a2 2 0 0 1 4 0a4 4 0 0 1-8 0a6 6 0 0 1 12 0a8 8 0 0 1-16 0"/></svg>';
  function SVI(d) { return '<svg class="sv" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; }
  /* (20-nov-2026 20:51, Iago) al apuntarse/anunciar: «solo ordenador o tablet; con el móvil no te dejará» */
  var I_INFO = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.6v.2"/></svg>';
  var DISP = 'Solo se puede jugar desde un ordenador o una tablet: con el móvil no te dejará entrar.';
  var I_DISP = '<svg viewBox="0 0 64 40" fill="none" stroke="#ffd23f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="34" height="24" rx="2.5"/><path d="M1 33h40"/><rect x="45" y="6" width="17" height="28" rx="3"/></svg>';
  var I_PLAY = SVI('<path d="M8 5.5v13l10-6.5z"/>'), I_CAL = SVI('<path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>'), I_OK = SVI('<path d="M5 12.5l4.5 4.5L19 7.5"/>'), I_X = SVI('<path d="M6 6l12 12M18 6L6 18"/>');
  var CORONA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>';
  var I_PER = SVI('<circle cx="12" cy="7.5" r="3.6"/><path d="M4.8 20.5c0-4 3.2-7.1 7.2-7.1s7.2 3.1 7.2 7.1"/>');
  /* (19-nov, Iago) cada monigote con el nombre e inicial del primer apellido, en pequeñito y siempre a la vista */
  function monigotes(n, nombres, max) {
    if (n <= 0) return ''; max = max || 5; nombres = nombres || []; var t = '';
    for (var i = 0; i < Math.min(n, max); i++) t += '<span class="m">' + I_PER + (nombres[i] ? '<b>' + esc(nombres[i]) + '</b>' : '') + '</span>';
    return '<span class="mon" title="' + esc(nombres.join(', ') || (n + (n === 1 ? ' confirmado' : ' confirmados'))) + '">' + t + (n > max ? '<i>+' + (n - max) + '</i>' : '') + '</span>';
  }
  /* la espiral multicolor de la portada de PreDict Carrusel (la misma que dibuja el carrusel del aula) */
  function logoSVG(id) {
    var d = ''; for (var a = 90; a <= 900; a += 4) { var r = 58 + 27 * (a - 90) / 810, rad = a * Math.PI / 180; d += (d ? ' L ' : 'M ') + (100 + r * Math.cos(rad)).toFixed(2) + ' ' + (100 + r * Math.sin(rad)).toFixed(2); }
    d += ' L 15.00 100.00';
    return '<svg viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#ff5fa2"/><stop offset=".2" stop-color="#ff9a3c"/><stop offset=".4" stop-color="#ffd23f"/><stop offset=".6" stop-color="#34d399"/><stop offset=".8" stop-color="#5bd0ff"/><stop offset="1" stop-color="#bd92ff"/></linearGradient></defs>' +
      '<path d="' + d + '" fill="none" stroke="url(#' + id + ')" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" opacity=".25"/>' +
      '<path d="' + d + '" fill="none" stroke="url(#' + id + ')" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="100" cy="158" r="7.5" fill="#fff"/></svg>';
  }
  var LOGO = logoSVG('lmCarrLg');
  var FLE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

  /* ---- cartelito ---- */
  /* (20-nov-2026 18:14, Iago) en la franja del anfitrión, que se vea claro que ya tiene gente: «· 3 apuntados» + sus monigotes */
  function apuntadosTxt(p) { var n = jugadores(p); return '<span class="nap">· ' + n + (n === 1 ? ' jugador' : ' jugadores') + '</span>'; }
  /* en la franja, un monigote por apuntado (sin nombres, para que quepa; los nombres, al pasar el ratón) */
  function monisFranja(n, nombres) {
    if (n <= 0) return ''; var t = '', max = 6;
    for (var i = 0; i < Math.min(n, max); i++) t += '<span class="m">' + I_PER + '</span>';
    return '<span class="mon" title="' + esc((nombres || []).join(', ')) + '">' + t + (n > max ? '<i>+' + (n - max) + '</i>' : '') + '</span>';
  }
  /* (20-nov-2026 20:55, Iago) franja más compacta: un solo monigote con el número de apuntados en un globito arriba a la
     derecha (dentro de la franja); lo ve el anfitrión y también los que se han apuntado. Nombres al pasar el ratón. */
  function numFranja(p) {
    var n = jugadores(p), l = nombresJug(p);
    return '<span class="num" title="' + esc(n + (n === 1 ? ' jugador' : ' jugadores') + (l.length ? ': ' + l.join(', ') : '')) + '">' + I_PER + '<b>' + n + '</b></span>';
  }
  function franja(p) {
    var f = document.createElement('button'); f.type = 'button';
    f.className = 'lm-fr' + (p.lobby_abierto ? ' vivo' : '') + (p.soy_creador ? ' mia' : '') + (sinAnf(p) ? ' alerta' : '');
    f.title = p.soy_creador ? 'Has anunciado este carrusel: eres el anfitrión' : NOMBRE + ' · partida de ' + (p.creador || '');
    f.innerHTML = '<span class="cl"><span class="gi"><span class="fx"></span></span></span>' + (sinAnf(p) ? '<b class="ex">!</b>' : (p.soy_creador ? CORONA : ESP)) + '<span>' + esc(texto(p)) + '</span>' + (p.lobby_abierto ? '<span class="ent">Entrar al lobby</span>' : ((p.soy_creador || p.yo === 'si') ? numFranja(p) : ''));
    f.onclick = function (e) {
      e.stopPropagation();
      if (p.lobby_abierto) abrirCarrusel(p.id, !(p.soy_creador || p.yo_dentro));
      else { if (PAN && !PAN.hidden) cerrarPanel(); else abrirPanel(); }
    };
    return f;
  }
  function pintaAviso(host, mias) {
    var a = document.getElementById('lm-carr-aviso');
    if (!mias.length) { if (a) a.hidden = true; return; }
    if (!a) { a = document.createElement('div'); a.id = 'lm-carr-aviso'; }
    if (a.parentNode !== host) host.insertBefore(a, host.firstChild);
    a.hidden = false;
    var clave = mias.map(function (p) { return p.id + '|' + texto(p) + '|' + p.apuntados; }).join(';');
    if (a.getAttribute('data-k') === clave) return; a.setAttribute('data-k', clave);
    var abierto = !!(a.querySelector('.mas.abierto'));
    a.innerHTML = ''; a.appendChild(franja(mias[0]));
    if (mias.length > 1) {
      var m = document.createElement('button'); m.type = 'button'; m.className = 'mas' + (abierto ? ' abierto' : ''); m.title = 'Ver las otras partidas';
      m.innerHTML = FLE + '<span class="n">' + (mias.length - 1) + '</span>';
      var r = document.createElement('div'); r.className = 'resto'; r.hidden = !abierto;
      mias.slice(1).forEach(function (p) { r.appendChild(franja(p)); });
      m.onclick = function () { var ab = r.hidden; r.hidden = !ab; m.classList.toggle('abierto', ab); };
      a.appendChild(m); a.appendChild(r);
      /* todas las franjas del mismo ancho (la más larga manda), para que la tuya no ocupe más que las demás */
      var oc = r.hidden; r.style.visibility = 'hidden'; r.hidden = false;
      var fs = a.querySelectorAll('.lm-fr'), w = 0;
      fs.forEach(function (x) { x.style.width = ''; w = Math.max(w, x.getBoundingClientRect().width); });
      fs.forEach(function (x) { x.style.width = Math.ceil(w) + 'px'; });
      r.hidden = oc; r.style.visibility = '';
    }
  }

  /* ---- ventana emergente de partidas ---- */
  /* (20-nov-2026, Iago) Selector propio de DÍA y HORA para anunciar partidas (el mismo en ordenador, iPad y móvil):
     calendario del mes con los días pasados apagados y HOY marcado; la hora con DOS RUEDAS verticales como en el iPhone
     (horas 8–22 y minutos de 5 en 5), que se arrastran con el dedo o el ratón, giran con la rueda del ratón o se tocan.
     Solo deja elegir desde dentro de 10 minutos hasta 7 días (lo mismo que exige el servidor; 20-nov 22:00, Iago: antes 14).
     lmSelFecha(valor 'AAAA-MM-DDTHH:MM' o '', alElegir(valor)) */
  var LMF_MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var LMF_DIA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  function lmfDos(n) { return (n < 10 ? '0' : '') + n; }
  function lmfTexto(v) {
    if (!v) return '';
    var d = new Date(v); if (isNaN(d)) return '';
    return LMF_DIA[d.getDay()].slice(0, 3) + ' ' + d.getDate() + ' ' + LMF_MES[d.getMonth()].slice(0, 3) + ' · ' + lmfDos(d.getHours()) + ':' + lmfDos(d.getMinutes());
  }
  var LMF_IH = 34;   /* alto de cada fila de las ruedas (se ven 5) */
  function lmfCss() {
    if (document.getElementById('lmf-css')) return;
    var s = document.createElement('style'); s.id = 'lmf-css';
    s.textContent =
      '.lmfcapa{position:fixed!important;inset:0!important;z-index:2147483647!important;background:rgba(4,6,14,.55);display:flex;align-items:center;justify-content:center;font-family:"Helvetica Neue",Arial,sans-serif;-webkit-tap-highlight-color:transparent}' +
      '.lmf{width:min(392px,94vw);max-height:96vh;overflow:auto;box-sizing:border-box;padding:18px 18px 16px;border-radius:16px;background:#16122c;border:1px solid rgba(255,255,255,.18);box-shadow:0 24px 70px rgba(0,0,0,.55);color:#fff}' +
      '.lmf h3{margin:0 0 12px;font-size:18px;font-weight:800;letter-spacing:.01em}' +
      '.lmf .mes{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}.lmf .mes b{font-size:16px;font-weight:800;text-transform:capitalize}' +
      '.lmf .mes button{width:34px;height:34px;border-radius:9px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.06);color:#fff;font-size:18px;cursor:pointer}.lmf .mes button:disabled{opacity:.25;cursor:default}' +
      '.lmf .sem,.lmf .dias{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}.lmf .sem span{text-align:center;font-size:12px;font-weight:800;color:rgba(255,255,255,.55);padding:2px 0 4px}' +
      '.lmf .dias button{position:relative;height:38px;border-radius:9px;border:1px solid transparent;background:rgba(255,255,255,.07);color:#fff;font-size:15px;font-weight:700;cursor:pointer;padding:0}' +
      '.lmf .dias button:disabled{background:transparent;color:rgba(255,255,255,.22);cursor:default}.lmf .dias i{visibility:hidden}' +
      '.lmf .dias button.hoy{border-color:#ffd23f}.lmf .dias button.hoy::after{content:"hoy";position:absolute;left:0;right:0;bottom:1px;font-size:9px;font-weight:800;color:#ffd23f;line-height:1}' +
      '.lmf .dias button.sel{background:#ffd23f;color:#1b1406}.lmf .dias button.sel::after{color:#1b1406}' +
      '.lmf .et{margin:14px 0 6px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.6)}' +
      /* ruedas */
      '.lmf .ruedas{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:14px}' +
      '.lmf .rd{position:relative;width:96px;height:' + (5 * LMF_IH) + 'px;overflow:hidden;touch-action:none;cursor:grab;outline:none;border-radius:12px;background:rgba(255,255,255,.04);-webkit-user-select:none;user-select:none;' +
        '-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 34%,#000 66%,transparent 100%);mask-image:linear-gradient(to bottom,transparent 0,#000 34%,#000 66%,transparent 100%)}' +
      '.lmf .rd:active{cursor:grabbing}' +
      '.lmf .rd::before{content:"";position:absolute;left:5px;right:5px;top:' + (2 * LMF_IH) + 'px;height:' + LMF_IH + 'px;box-sizing:border-box;border-radius:9px;background:rgba(255,210,63,.18);border:1px solid rgba(255,210,63,.85);pointer-events:none}' +
      '.lmf .rd .tira{position:absolute;left:0;right:0;top:0;will-change:transform}' +
      '.lmf .rd .it{height:' + LMF_IH + 'px;line-height:' + LMF_IH + 'px;text-align:center;font-size:21px;font-weight:700;color:#fff;font-variant-numeric:tabular-nums;transform-origin:50% 50%}' +
      '.lmf .rd .it.no{color:rgba(255,255,255,.28)}.lmf .rd .it.c{color:#ffe28a;font-weight:800}' +
      '.lmf .dp{font-size:24px;font-weight:800;color:#ffe28a;margin-top:-3px}' +
      '.lmf .rdl{display:flex;justify-content:center;gap:8px;margin-top:4px}.lmf .rdl span{width:96px;text-align:center;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.45)}.lmf .rdl i{width:10px}' +
      '.lmf .pie{display:flex;align-items:center;gap:10px;margin-top:16px}.lmf .pie .res{flex:1;font-size:14px;font-weight:700;color:#ffe28a;min-width:0}' +
      '.lmf .pie button{height:38px;padding:0 16px;border-radius:10px;font-weight:800;font-size:14px;cursor:pointer;border:1px solid rgba(255,255,255,.3);background:transparent;color:#fff}' +
      '.lmf .pie button.ok{background:#fff;color:#16122c;border-color:#fff}.lmf .pie button.ok:disabled{opacity:.35;cursor:default}' +
      '@media (hover:hover){.lmf .dias button:not(:disabled):not(.sel):hover{background:rgba(255,210,63,.22)}}';
    document.head.appendChild(s);
  }
  /* una rueda: vals (números), idx inicial, fmt(v), vale(i) → si se puede elegir, alCambiar(i) al encajar */
  function lmfRueda(el, vals, idx, fmt, vale, alCambiar) {
    var IH = LMF_IH, pos = idx, n = vals.length, tira = el.querySelector('.tira'), anim = null, its = [];
    tira.innerHTML = vals.map(function (v, i) { return '<div class="it" data-i="' + i + '">' + fmt(v) + '</div>'; }).join('');
    its = Array.prototype.slice.call(tira.children);
    function marca() { its.forEach(function (it, i) { it.classList.toggle('no', !vale(i)); }); }
    function pinta() {
      tira.style.transform = 'translateY(' + ((2 - pos) * IH).toFixed(2) + 'px)';
      for (var i = 0; i < n; i++) {
        var d = Math.abs(i - pos); if (d > 3.2) continue;
        its[i].style.transform = 'perspective(260px) rotateX(' + (Math.max(-3, Math.min(3, i - pos)) * -16).toFixed(1) + 'deg) scale(' + (1 - Math.min(d, 2.5) * 0.06).toFixed(3) + ')';
        its[i].style.opacity = String(Math.max(0.3, 1 - d * 0.22).toFixed(2));
        its[i].classList.toggle('c', d < 0.5);
      }
    }
    function cerca(i) {   /* el elegible más cercano */
      i = Math.max(0, Math.min(n - 1, i)); if (vale(i)) return i;
      for (var k = 1; k < n; k++) { if (i + k < n && vale(i + k)) return i + k; if (i - k >= 0 && vale(i - k)) return i - k; }
      return i;
    }
    function para() { if (anim) { cancelAnimationFrame(anim); anim = null; } }
    function ir(dest, ms) {
      para(); dest = cerca(Math.round(dest)); var p0 = pos, t0 = null, dur = ms || Math.min(650, 220 + Math.abs(dest - p0) * 45);
      function paso(t) { if (t0 === null) t0 = t; var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        pos = p0 + (dest - p0) * e; pinta(); if (k < 1) anim = requestAnimationFrame(paso); else { anim = null; pos = dest; pinta(); idx = dest; alCambiar(dest); } }
      anim = requestAnimationFrame(paso);
    }
    var arr = null;
    el.addEventListener('pointerdown', function (e) {
      para(); try { el.setPointerCapture(e.pointerId); } catch (_) {}
      arr = { y0: e.clientY, p0: pos, ys: [[e.timeStamp, e.clientY]], mov: 0, sc: el.getBoundingClientRect().height / el.offsetHeight || 1 }; e.preventDefault();
    });
    el.addEventListener('pointermove', function (e) {
      if (!arr) return; var dy = (e.clientY - arr.y0) / arr.sc; arr.mov = Math.max(arr.mov, Math.abs(dy));
      var p = arr.p0 - dy / IH; if (p < 0) p = p * 0.35; if (p > n - 1) p = n - 1 + (p - n + 1) * 0.35;
      pos = p; pinta(); arr.ys.push([e.timeStamp, e.clientY]); if (arr.ys.length > 6) arr.ys.shift();
    });
    function suelta(e) {
      if (!arr) return; var a = arr; arr = null;
      if (a.mov < 5) {   /* toque: va a la fila tocada */
        var r = el.getBoundingClientRect(), yl = (e.clientY - r.top) / a.sc; ir(pos + (yl - 2.5 * IH) / IH); return;
      }
      var f = a.ys[a.ys.length - 1], g = a.ys[0], v = (f[0] > g[0]) ? -((f[1] - g[1]) / a.sc / IH) / (f[0] - g[0]) : 0;   /* filas por ms */
      ir(pos + v * 180);
    }
    el.addEventListener('pointerup', suelta); el.addEventListener('pointercancel', suelta);
    var acum = 0;
    el.addEventListener('wheel', function (e) { e.preventDefault(); acum += e.deltaY;
      var pasos = 0; while (Math.abs(acum) >= 40) { pasos += acum > 0 ? 1 : -1; acum -= (acum > 0 ? 40 : -40); }
      if (pasos) ir(Math.round(anim ? idx : pos) + pasos, 200); }, { passive: false });
    el.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown') { e.preventDefault(); ir(Math.round(pos) + 1, 180); } if (e.key === 'ArrowUp') { e.preventDefault(); ir(Math.round(pos) - 1, 180); } });
    marca(); pinta();
    return { marca: function () { marca(); }, ir: ir, idx: function () { return idx; } };
  }
  function lmSelFecha(valor, alElegir) {
    lmfCss();
    var ahora = new Date(), min = new Date(ahora.getTime() + 10 * 6e4), max = new Date(ahora.getTime() + 7 * 864e5);
    var hoy0 = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    var HORAS = []; for (var h = 8; h <= 22; h++) HORAS.push(h);
    var MINS = []; for (var m5 = 0; m5 < 60; m5 += 5) MINS.push(m5);
    var dia = null, hora, mins;
    /* de partida, la próxima hora posible (redondeada a 5 minutos) */
    var sig = new Date(Math.ceil(min.getTime() / 3e5) * 3e5); hora = sig.getHours(); mins = sig.getMinutes();
    if (hora < 8) { hora = 8; mins = 0; } if (hora > 22) { hora = 22; mins = 55; }
    if (valor) { var v = new Date(valor); if (!isNaN(v)) { dia = new Date(v.getFullYear(), v.getMonth(), v.getDate()); hora = v.getHours(); mins = v.getMinutes() - v.getMinutes() % 5; } }
    var mes = new Date((dia || hoy0).getFullYear(), (dia || hoy0).getMonth(), 1);
    var velo = document.createElement('div'); velo.className = 'lmfcapa';
    function fecha(d, h, m) { return new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m); }
    function vale(d, h, m) { var f = fecha(d, h, m); return f >= min && f <= max; }
    function horaVale(d, h) { for (var i = 0; i < MINS.length; i++) if (vale(d, h, MINS[i])) return true; return false; }
    function diaVale(d) { for (var i = 0; i < HORAS.length; i++) if (horaVale(d, HORAS[i])) return true; return false; }
    var RH = null, RM = null;
    function pie() {
      var listo = dia && vale(dia, hora, mins);
      var res = velo.querySelector('.res'), ok = velo.querySelector('.ok');
      if (res) res.textContent = listo ? lmfTexto(fecha(dia, hora, mins)) : (dia ? '' : 'Elige un día');
      if (ok) ok.disabled = !listo;
    }
    function ajusta() {   /* si el día elegido no admite la hora o los minutos, la rueda va a lo más cercano posible */
      if (!dia) return;
      if (!horaVale(dia, hora)) { var hi = HORAS.indexOf(hora), best = null; for (var k = 0; k < HORAS.length; k++) if (horaVale(dia, HORAS[k]) && (best === null || Math.abs(k - hi) < Math.abs(best - hi))) best = k; if (best !== null) hora = HORAS[best]; }
      if (!vale(dia, hora, mins)) { var mi = MINS.indexOf(mins), bm = null; for (var j = 0; j < MINS.length; j++) if (vale(dia, hora, MINS[j]) && (bm === null || Math.abs(j - mi) < Math.abs(bm - mi))) bm = j; if (bm !== null) mins = MINS[bm]; }
    }
    function pinta() {
      var p = new Date(mes), cab = (p.getDay() + 6) % 7, nd = new Date(p.getFullYear(), p.getMonth() + 1, 0).getDate(), t = '';
      for (var i = 0; i < cab; i++) t += '<i></i>';
      for (var d = 1; d <= nd; d++) {
        var f = new Date(p.getFullYear(), p.getMonth(), d), c = '';
        if (f.getTime() === hoy0.getTime()) c += ' hoy';
        if (dia && f.getTime() === dia.getTime()) c += ' sel';
        t += '<button type="button" data-d="' + d + '" class="' + c + '"' + (diaVale(f) ? '' : ' disabled') + '>' + d + '</button>';
      }
      var prevOk = new Date(mes.getFullYear(), mes.getMonth(), 0) >= hoy0, nextOk = new Date(mes.getFullYear(), mes.getMonth() + 1, 1) <= max;
      velo.innerHTML = '<div class="lmf" role="dialog" aria-label="Elige día y hora"><h3>Elige día y hora</h3>' +
        '<div class="mes"><button type="button" data-nav="-1"' + (prevOk ? '' : ' disabled') + ' aria-label="Mes anterior">‹</button><b>' + LMF_MES[mes.getMonth()] + ' ' + mes.getFullYear() + '</b><button type="button" data-nav="1"' + (nextOk ? '' : ' disabled') + ' aria-label="Mes siguiente">›</button></div>' +
        '<div class="sem"><span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span></div><div class="dias">' + t + '</div>' +
        '<div class="ruedas"><div class="rd" data-r="h" tabindex="0" aria-label="Hora"><div class="tira"></div></div><b class="dp">:</b><div class="rd" data-r="m" tabindex="0" aria-label="Minutos"><div class="tira"></div></div></div>' +
        '<div class="rdl"><span>hora</span><i></i><span>min</span></div>' +
        '<div class="pie"><span class="res"></span><button type="button" data-x="1">Cancelar</button><button type="button" class="ok" data-ok="1" disabled>Aceptar</button></div></div>';
      RH = lmfRueda(velo.querySelector('.rd[data-r="h"]'), HORAS, Math.max(0, HORAS.indexOf(hora)), String,
        function (i) { return !dia || horaVale(dia, HORAS[i]); },
        function (i) { hora = HORAS[i]; if (dia && !vale(dia, hora, mins)) { ajusta(); RM.ir(MINS.indexOf(mins)); } RM.marca(); pie(); });
      RM = lmfRueda(velo.querySelector('.rd[data-r="m"]'), MINS, Math.max(0, MINS.indexOf(mins)), lmfDos,
        function (i) { return !dia || vale(dia, hora, MINS[i]); },
        function (i) { mins = MINS[i]; pie(); });
      pie();
    }
    velo.addEventListener('click', function (e) {
      if (e.target === velo) { cerrar(); return; }
      var b = e.target.closest ? e.target.closest('button') : null;
      if (!b || b.disabled) return;
      if (b.dataset.nav) { mes = new Date(mes.getFullYear(), mes.getMonth() + Number(b.dataset.nav), 1); pinta(); }
      else if (b.dataset.d) { dia = new Date(mes.getFullYear(), mes.getMonth(), Number(b.dataset.d)); ajusta(); pinta(); }
      else if (b.dataset.x) { cerrar(); }
      else if (b.dataset.ok) { var f = fecha(dia, hora, mins); cerrar(); alElegir(f.getFullYear() + '-' + lmfDos(f.getMonth() + 1) + '-' + lmfDos(f.getDate()) + 'T' + lmfDos(f.getHours()) + ':' + lmfDos(f.getMinutes())); }
    });
    function cerrar() { if (velo.parentNode) velo.parentNode.removeChild(velo); document.removeEventListener('keydown', tecla, true); }
    function tecla(e) { if (e.key === 'Escape') { e.stopPropagation(); cerrar(); } }
    document.addEventListener('keydown', tecla, true);
    pinta(); document.documentElement.appendChild(velo);
    return velo;
  }

  var PAN = null, CONF = null, MSG = '', HORA = '', VID = false;
  function filaPartida(p) {
    var mia = soyAnf(p), cancelada = p.soy_creador && p.anfitrion_cancelo && !mia, conf = Math.max(0, (p.apuntados || 0) - 1);
    var quien = mia ? '<span class="cor">' + CORONA + '</span>Tu partida' : esc(p.creador) + ' <span class="g">(' + esc(grupoTxt(p.grupo)) + ')</span>';
    var cab = p.lobby_abierto ? '<i class="sq v"></i>Abierta ahora · empieza a las ' + esc(new Date(p.programada).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })) : '<i class="sq a"></i>Anunciada · ' + esc(cuando(p.programada));
    var otros = Math.max(0, (p.apuntados || 0) - 1);
    var gente = (p.gente && p.gente.length && window.AV3 && AV3.vivo) ? avatares(p) : monigotes(jugadores(p), nombresJug(p), 8);   /* (23:08) con el anfitrión; (21-nov 10:12) con sus avatares */
    var bs, aviso = '';
    if (p.lobby_abierto) bs = '<button class="bt pri" data-go="' + p.id + '" data-e="' + (mia || p.yo_dentro ? '' : '1') + '">Entrar al lobby</button>';
    else if (cancelada) bs = '<span class="c">La cancelaste</span>';
    /* (20-nov-2026 20:58, Iago) nada de botón rojo «tentador»: un texto discreto abajo a la derecha, «¿No vas a poder jugar?»,
       que abre la ventana para cancelar (anfitrión, −0,5 si no aparece) o desapuntarse (apuntados, −0,25) */
    else if (mia) bs = '<span class="ap anf">' + CORONA + 'Eres el anfitrión</span>';
    else if (sinAnf(p)) {
      bs = '<button class="bt pri" data-heredar="' + p.id + '">' + I_CAL + 'Ser el anfitrión</button><button class="bt ico" data-a="no" data-id="' + p.id + '" title="Quitarme de la partida">' + I_X + '</button>';
      aviso = '<div class="alerta"><span class="ex">!</span><span><b>El anfitrión ha cancelado.</b> Si heredas tú la partida y te haces anfitrión, los minutos que practiques contarán ×1,5: es el premio por mantenerla viva.</span></div>';
    }
    /* (20-nov-2026 20:38, Iago) ya apuntado: «✓ Apuntado» y «Desapuntarme» (rojo, con «¿Seguro? X cuenta con que vas a jugar») */
    else if (p.yo === 'si') bs = '<span class="ap">' + I_OK + 'Apuntado</span>';
    else bs = '<button class="bt pri" data-a="si" data-id="' + p.id + '">Me apunto</button>' +
      (p.yo === 'quiza' ? '' : '<button class="bt" data-a="quiza" data-id="' + p.id + '">Marcar como visto</button>');   /* (21-nov 11:16, Iago) con texto, no una ✕ */
    var nop = (!p.lobby_abierto && !cancelada && !sinAnf(p) && (mia || p.yo === 'si')) ? '<button type="button" class="nop" data-nop="' + p.id + '">¿No vas a poder jugar?</button>' : '';
    var lob = (!p.lobby_abierto && !cancelada && p.tipo !== 'individual' && (mia || p.yo === 'si')) ?   /* (21-nov) solo en tus partidas: con muchas, no se repite */ '<div class="lob">' + I_INFO + 'Se habilitará el lobby 5 minutos antes de la hora.</div>' : '';   /* (20-nov 20:56, Iago) */
    if (gente.indexOf('class="avs"') >= 0)   /* con avatares: van debajo, a todo el ancho, para que quepan en una fila */
      return '<div class="pt' + (mia ? ' mia' : '') + (aviso ? ' sinanf' : '') + '"><div class="inf"><div class="q">' + quien + '</div><div class="c">' + cab + '</div></div><div class="row">' + bs + '</div><div class="gen">' + gente + lob + aviso + '</div>' + nop + '</div>';
    return '<div class="pt' + (mia ? ' mia' : '') + (aviso ? ' sinanf' : '') + '"><div class="inf"><div class="q">' + quien + '</div><div class="c">' + cab + '</div><div class="c">' + gente + '</div>' + lob + aviso + '</div><div class="row">' + bs + '</div>' + nop + '</div>';
  }
  /* (21-nov 10:12, Iago) en «Partidas anunciadas», los apuntados con su avatar: pequeños (un tercio del tuyo) y vivos, sin
     emojis ni frases (eso queda para el lobby). Cada uno se monta una vez y sobrevive a los repintados del panel. */
  var MINIS = {};
  function avatares(p) {
    return '<span class="avs">' + p.gente.slice(0, 14).map(function (g) {
      return '<span class="ava' + (g.anf ? ' anf' : '') + '" title="' + esc(g.nombre) + (g.anf ? ' · anfitrión' : '') + '"><span class="ph" data-av="' + esc(p.id + '|' + g.id) + '"></span><b>' + (g.anf ? '<i class="meg">' + CORONA + '</i>' : '') + esc(g.nombre) + '</b></span>';
    }).join('') + (p.gente.length > 14 ? '<span class="mas">+' + (p.gente.length - 14) + '</span>' : '') + '</span>';
  }
  function montaMinis() {
    if (!PAN || !window.AV3 || !AV3.vivo) return;
    var porK = {}; LISTA.forEach(function (p) { (p.gente || []).forEach(function (g) { porK[p.id + '|' + g.id] = g; }); });
    [].forEach.call(PAN.querySelectorAll('.ph[data-av]'), function (ph) {
      var k = ph.getAttribute('data-av'), g = porK[k]; if (!g) return;
      var cfg = g.profe ? AV3.PROFE : (g.av || AV3.porDefecto(g.id)), ins = g.profe ? null : ((window.AV_INSTR && AV_INSTR[g.ins]) || null), firma = JSON.stringify([cfg, ins ? g.ins : '', !!g.profe]);
      var m = MINIS[k];
      if (!m || !m.rig || m.rig.muerto || m.firma !== firma) { if (m && m.rig) m.rig.destruye(); var el = document.createElement('span'); el.className = 'mav';
        ph.parentNode.replaceChild(el, ph); MINIS[k] = { el: el, firma: firma, rig: AV3.vivo(el, cfg, { lite: true, profe: !!g.profe, anillo: g.profe ? '#ffd23f' : null, ins: ins }) }; }
      else ph.parentNode.replaceChild(m.el, ph);
    });
  }
  setInterval(function () {   /* de vez en cuando, uno de ellos hace un gesto (uno cada vez: no carga) */
    if (!PAN || PAN.hidden || document.hidden || Math.random() > .55) return;
    var L = Object.keys(MINIS).map(function (k) { return MINIS[k]; }).filter(function (m) { return m.rig && !m.rig.muerto && m.el.isConnected && !m.rig.ocupado(); });
    if (!L.length) return; var G = ['saludar', 'guino', 'mirar', 'tararear', 'asentir', 'bostezar', 'reir', 'estirarse', 'bailar', 'mirar'];
    L[Math.floor(Math.random() * L.length)].rig.gesto(G[Math.floor(Math.random() * G.length)]);
  }, 2600);
  function minHora() { var d = new Date(Date.now() + 11 * 6e4); return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 16); }
  function pintaPanel() {
    if (!PAN || PAN.hidden) return;
    var h = PAN.querySelector('#lm-carr-hora'); if (h) HORA = h.value;
    var sc = PAN.querySelector('.caja'), top = sc ? sc.scrollTop : 0;
    PAN.innerHTML = '<div class="marco"><div class="cl"><div class="gi"><div class="fx"></div></div></div><div class="caja">' +
      '<div class="top"><div class="lg">' + LOGO + '</div><div><div class="tt"><span class="car">Carrusel</span>' + (GP ? '<span class="pro">PRO</span>' : '') + '<span class="onl">Online</span></div><div class="kick">' + (GP ? 'Grado Profesional' : 'Grado Elemental') + '</div></div>' +
      (!cerrado() && videoVisible() ? '<button class="vv" type="button" title="Ver el vídeo de presentación">' + I_PLAY + (VID ? 'Ocultar vídeo' : 'Ver vídeo') + '</button>' : '') + '<button class="x" type="button" title="Cerrar">' + I_X + '</button></div>' +
      (VID && !cerrado() ? '<div class="card" style="margin-bottom:14px">' + videoHTML(VIDEO_URL) + '</div>' : '') +
      (MSG ? '<div class="msg">' + esc(MSG) + '</div>' : '') +
(GP && esTester() && Date.now() < ABRE ? '<div class="msg">Los alumnos no ven nada del carrusel hasta el martes 24: 2.º GP C a las 19:00 y 2.º GP F a las 20:00. Tú, como Protester, ya puedes probarlo.</div>' : '') +   /* (21-nov 07:17, Iago) */
(cerrado() ? '<div class="card"><h2>' + (GP ? 'No disponible hasta el martes a las 20:00' : 'Muy pronto') + '</h2>' + (GP ? '<p>Te lo explico en clase.</p>' : '<p>El carrusel online estará disponible <b>' + ABRE_TXT + '</b>. Te lo explico en clase' + (VIDEO_URL ? '; mientras, puedes ver el vídeo.</p>' + videoHTML(VIDEO_URL) : '.</p>')) + '</div>' : 
      '<div class="cols"><div class="card"><h2>Anunciar partida</h2><p>Elige día y hora. <b>Serás el anfitrión</b><span class="meg">' + I_CAL + '</span></p>' +
      '<div class="row"><button type="button" class="fh' + (HORA ? '' : ' vacio') + '" id="lm-carr-fh"><input type="hidden" id="lm-carr-hora" value="' + esc(HORA) + '"><svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3.5\" y=\"5\" width=\"17\" height=\"15\" rx=\"2.5\"/><path d=\"M3.5 10h17M8 3v4M16 3v4\"/></svg><span class="ph">Elige día y hora</span><span class="vl">' + esc(lmfTexto(HORA)) + '</span></button><button class="bt pri" id="lm-carr-ok" type="button"' + (HORA ? '' : ' disabled') + '>' + I_CAL + 'Anunciar</button></div></div>' +
      '<div class="card"><h2>Partida individual</h2><p>Empieza una partida tú solo, ahora mismo.</p><button class="bt" id="lm-carr-ya" type="button">' + I_PLAY + 'Jugar ahora</button></div></div>' +
      '<div class="fila2"><div class="card"><h2>Partidas anunciadas' + MEGA + '</h2>' + (LISTA.length ? LISTA.map(filaPartida).join('') : '<div class="vacio">Ahora mismo no hay ninguna. ¡Anuncia tú la primera!</div>') + '</div>' +
      '<div class="card yo" id="lm-carr-yo">' + yoHTML() + '</div></div>') +
      (CONF ? '<div class="conf"><div class="cm"><h3>' + esc(CONF.t) + '</h3><p>' + rojo(esc(CONF.x)) + (CONF.d ? '</p><p class="disp">' + I_DISP + '<span>' + esc(CONF.d) + '</span>' : '') + '</p><div class="row"><button class="bt" id="lm-c-no" type="button">' + esc(CONF.no || 'Mejor no') + '</button><button class="bt pri" id="lm-c-si" type="button">' + esc(CONF.si) + '</button></div></div></div>' : '') +
      '</div></div>';
    var sc2 = PAN.querySelector('.caja'); if (sc2) sc2.scrollTop = top;
    PAN.querySelector('.x:not(.vv)').onclick = cerrarPanel;
    var pe = PAN.querySelector('#lm-carr-pers'); if (pe) pe.onclick = abreEditor;
    [].forEach.call(PAN.querySelectorAll('.cols > .card, .fila2 > .card:first-child'), function (e) { e.onmouseenter = miraMenu; });
    montaYo(); montaMinis();
    [].forEach.call(PAN.querySelectorAll('.vv'), function (vv) { vv.onclick = function () { if (/\.(html|mp4)/.test(VIDEO_URL)) { abreVideo(); return; } VID = !VID; pintaPanel(); }; });
    if (cerrado()) return;
    var hi = PAN.querySelector('#lm-carr-hora'), ok = PAN.querySelector('#lm-carr-ok');
    PAN.querySelector('#lm-carr-fh').onclick = function () { lmSelFecha(HORA, function (v) { var hh = PAN.querySelector('#lm-carr-hora'); if (hh) hh.value = v; HORA = v; pintaPanel(); }); };   /* (20-nov, Iago) selector propio: el mismo en todos los navegadores */
    ok.onclick = async function () {
      if (!hi.value) return; var f = new Date(hi.value);
      if (!await pedirConf('¿Anunciar esta partida?', 'Será ' + cuando(f.toISOString()) + ' y serás el anfitrión. Si alguien se apunta y luego no asistes, perderás 0,5 de actitud. Puedes evitarlo cancelando la partida hasta 5 minutos antes de su inicio.', 'Sí, anunciar', null, DISP)) return;
      var r = await rpcA('suite_cr_crear', { p_cuenta: cuenta().id, p_programada: f.toISOString() });
      if (r && r.ok) { MSG = 'Partida anunciada para ' + cuando(f.toISOString()) + '. A tus compañeros de curso les llega un aviso.'; HORA = ''; }
      else MSG = r && r.error === 'una_por_semana' ? 'Ya tienes una partida anunciada esa semana. Puedes anunciar una por semana (de lunes a domingo).' : r && r.error === 'aun_no' ? 'El carrusel online se abre ' + ABRE_TXT + '.' : r && r.error === 'hora' ? 'La hora debe estar entre 10 minutos y 7 días desde ahora.' : 'No he podido anunciar la partida.';
      refrescar();
    };
    PAN.querySelector('#lm-carr-ya').onclick = function () { abrirURL(URL_CARR + '?solo=1'); };
    PAN.querySelectorAll('button[data-go]').forEach(function (bt) { bt.onclick = function () { abrirCarrusel(bt.dataset.go, bt.dataset.e === '1'); }; });
    PAN.querySelectorAll('button[data-heredar]').forEach(function (bt) {
      bt.onclick = async function () {
        if (!await pedirConf('¿Quieres ser el anfitrión?', 'La partida será tuya: la empiezas tú. Los minutos que practiques en ella contarán ×1,5. Si luego no asistes, perderás 0,5 de actitud.', 'Sí, seré el anfitrión', null, DISP)) return;
        bt.disabled = true;
        var r = await rpcA('suite_cr_heredar', { p_cuenta: cuenta().id, p_partida: bt.dataset.heredar });
        MSG = r && r.ok ? 'Ahora eres el anfitrión. Tus minutos en esta partida contarán ×1,5.' : 'No he podido hacerte anfitrión (puede que otro se haya adelantado).'; refrescar();
      };
    });
    PAN.querySelectorAll('button[data-cancel]').forEach(function (bt) {
      bt.onclick = async function () {
        var P = LISTA.filter(function (x) { return x.id === bt.dataset.cancel; })[0]; if (!P) return;
        /* (20-nov 13:58, Iago) sin nadie apuntado, la partida desaparece; con gente, los apuntados reciben el aviso «!» para quedarse de anfitrión (×1,5) */
        var otros = Math.max(0, (P.apuntados || 0) - 1), pen = tarde(P) && otros > 0, AV = 'Avisaremos a los apuntados para que uno se quede de anfitrión (sus minutos cuentan ×1,5).';
        if (!await pedirConf(pen ? 'Cancelar ahora cuenta como no asistir' : '¿Cancelar tu partida?', !otros ? 'No hay nadie apuntado: la partida desaparece. No pierdes actitud.' : (pen ? 'Hay gente apuntada y faltan menos de 5 minutos: perderás 0,5 de actitud. ' + AV + ' ¿Cancelar igualmente?' : 'No pierdes actitud porque faltan más de 5 minutos. ' + AV), 'Sí, cancelar', 'No, la mantengo')) return;
        var r = await rpcA('suite_cr_cancelar', { p_cuenta: cuenta().id, p_partida: P.id });
        MSG = r && r.ok ? (r.quitada ? 'Partida cancelada. Como no había nadie apuntado, ya no aparece.' : 'Has cancelado la partida. Los apuntados ya tienen el aviso para quedarse de anfitrión.') : 'No he podido cancelar la partida.'; refrescar();
      };
    });
    PAN.querySelectorAll('button[data-nop]').forEach(function (bt) {
      bt.onclick = async function () {
        var P = LISTA.filter(function (x) { return x.id === bt.dataset.nop; })[0]; if (!P) return; MSG = '';
        if (soyAnf(P)) {
          var otros = Math.max(0, (P.apuntados || 0) - 1), pen = tarde(P) && otros > 0, AV = 'Avisaremos a los apuntados para que uno se quede de anfitrión (sus minutos cuentan ×1,5).';
          var x = !otros ? 'No hay nadie apuntado: si la cancelas, la partida desaparece y no pierdes actitud.'
            : (pen ? 'Faltan menos de 5 minutos: cancelar ahora cuenta como no asistir y perderás 0,5 de actitud. ' + AV
                   : 'Cancélala ahora y no pierdes actitud. ' + AV + ' Si no apareces sin haberla cancelado, perderás 0,5 de actitud.');
          if (!await pedirConf('¿No vas a poder jugar?', x, 'Cancelar la partida', 'Sí que juego')) return;
          var r = await rpcA('suite_cr_cancelar', { p_cuenta: cuenta().id, p_partida: P.id });
          MSG = r && r.ok ? (r.quitada ? 'Partida cancelada. Como no había nadie apuntado, ya no aparece.' : 'Has cancelado la partida. Los apuntados ya tienen el aviso para quedarse de anfitrión.') : 'No he podido cancelar la partida.'; refrescar();
        } else {
          var an = String(P.anfitrion || P.creador || 'El anfitrión').split(' ')[0];
          var y = tarde(P) ? 'Faltan menos de 5 minutos: desapuntarte ahora cuenta como no asistir y perderás 0,25 de actitud.'
            : 'Desapúntate ahora y no pierdes actitud. ' + an + ' cuenta contigo: si no apareces sin haberte desapuntado, perderás 0,25 de actitud.';
          if (!await pedirConf('¿No vas a poder jugar?', y, 'Desapuntarme', 'Sí que juego')) return;
          await rpcA('suite_cr_apuntar', { p_cuenta: cuenta().id, p_partida: P.id, p_resp: 'no' }); refrescar();
        }
      };
    });
    PAN.querySelectorAll('button[data-a]').forEach(function (bt) {
      bt.onclick = async function () {
        var a = bt.dataset.a, id = bt.dataset.id, P = LISTA.filter(function (x) { return x.id === id; })[0];
        if (a === 'si' && P && P.yo === 'si') return;
        if (a === 'si' && P && P.tipo === 'anunciada') { if (!await pedirConf('¿Estás seguro?', 'Si luego no asistes, perderás 0,25 de actitud. Puedes evitarlo quitándote de la partida hasta 5 minutos antes de que empiece.', 'Sí, me apunto', null, DISP)) return; }
        if ((a === 'no' || a === 'quiza') && P && P.yo === 'si' && tarde(P)) { if (!await pedirConf('Ya es tarde para quitarte', 'Quitarte ahora cuenta como no asistir: perderás 0,25 de actitud. ¿Quieres quitarte igualmente?', 'Sí, quitarme', 'No, me quedo')) return; }
        else if (a === 'no' && P && P.yo === 'si') { var an = String(P.anfitrion || P.creador || 'El anfitrión').split(' ')[0];
          if (!await pedirConf('¿Seguro que te desapuntas?', an + ' cuenta con que vas a jugar. Hasta 5 minutos antes de empezar puedes desapuntarte sin perder actitud.', 'Sí, desapuntarme', 'No, me quedo')) return; }
        bt.disabled = true; MSG = '';
        await rpcA('suite_cr_apuntar', { p_cuenta: cuenta().id, p_partida: id, p_resp: a }); refrescar();
      };
    });
  }
  function abrirURL(u) { var w = null; try { w = window.open(u, '_blank'); } catch (e) {} if (!w) location.href = u; }
  function abrirCarrusel(id, entrar) { abrirURL(URL_CARR + '?p=' + encodeURIComponent(id) + (entrar ? '&e=1' : '')); }
  function rojo(t) { return t.replace(/(perder[áa]s (?:un )?0,\d+ de actitud)/g, '<b class="rojo">$1</b>'); }
  function pedirConf(t, x, si, no, d) {
    return new Promise(function (res) {
      CONF = { t: t, x: x, si: si, no: no, d: d, res: res }; pintaPanel();
    });
  }
  /* (21-nov 13:47) los botones de la ventanita se vuelven a enganchar en cada repintado (antes, si el panel se repintaba con la
     ventanita abierta —p. ej. al llegar tu avatar—, «Sí, me apunto» dejaba de responder) */
  function ataConf() { if (!CONF || !PAN) return;
    var fin = function (v) { var r = CONF && CONF.res; CONF = null; pintaPanel(); if (r) r(v); };
    var a = PAN.querySelector('#lm-c-si'), b = PAN.querySelector('#lm-c-no'); if (a) a.onclick = function () { fin(true); }; if (b) b.onclick = function () { fin(false); }; }
  var _pintaPanel0 = pintaPanel; pintaPanel = function () { _pintaPanel0(); ataConf(); };
  /* ---- (20-nov 23:10, Iago) tu avatar en la ventana del carrusel: vivo, con tu instrumento y «Personalizar» ---- */
  var MIAV = null, AVCARGA = null;
  function cargaAv() {
    if (AVCARGA) return AVCARGA;
    AVCARGA = new Promise(function (res) {
      if (window.AV3) return res();
      var sc = document.createElement('script'); sc.src = (MI_SRC ? MI_SRC.replace(/carrusel-aviso\.js.*$/, '') : '/piel/') + 'avatar3.js?v=20261121x';
      sc.onload = function () { res(); }; sc.onerror = function () { res(); }; document.head.appendChild(sc);
    }).then(async function () { var c = cuenta(); if (!c) return; var r = await rpcA('suite_cr_mi_avatar', { p_cuenta: c.id }); if (r && r.ok) MIAV = r; });
    return AVCARGA;
  }
  /* (21-nov 08:41, Iago) «movimientos fluidos, con físicas»: ya no hay fundidos entre dibujos. El avatar es un títere (AV3.vivo)
     que saluda agitando el brazo, se rasca, bosteza, guiña, piensa, tararea, baila, gira la cabeza para mirar… (nunca llora ni se
     sorprende). Se monta una vez y sobrevive a los repintados del panel, así no vuelve a empezar cada vez. */
  var YO = { el: null, rig: null, k: '' };
  function yoHTML() {
    if (!window.AV3 || !MIAV) return '<h2>Tu avatar</h2><div class="cg">Cargando…</div>';
    return '<h2>Tu avatar</h2><div class="yoin"><div class="avw"><div id="lm-carr-av"></div></div><div class="nm">' + esc(String(MIAV.nombre || '').split(' ')[0]) + '</div>' +
      (MIAV.profe ? '' : '<button type="button" class="bt" id="lm-carr-pers">✏️ Personalizar</button>') + '</div>';   /* (21-nov 07:22, Iago) el instrumento no se elige: sale solo de la ficha */
  }
  function montaYo() {
    var ph = PAN && PAN.querySelector('#lm-carr-av'); if (!ph || !window.AV3 || !AV3.vivo || !MIAV) return;
    var c = cuenta() || {}, cfg = MIAV.profe ? AV3.PROFE : (MIAV.cfg || AV3.porDefecto(c.id)), ins = MIAV.profe ? null : ((window.AV_INSTR && AV_INSTR[MIAV.ins]) || null);
    var k = JSON.stringify([!!MIAV.profe, cfg, MIAV.ins || '']);
    if (!YO.el) { YO.el = document.createElement('div'); YO.el.className = 'yoav'; }
    ph.parentNode.replaceChild(YO.el, ph);
    if (!YO.rig || YO.rig.muerto || YO.k !== k) { if (YO.rig) YO.rig.destruye(); YO.k = k;
      YO.rig = AV3.vivo(YO.el, cfg, { profe: !!MIAV.profe, anillo: MIAV.profe ? '#ffd23f' : null, ins: ins, auto: true, fondoVivo: !MIAV.profe }); }
  }
  function miraMenu() {   /* al pasar por el menú, tu avatar gira la cabeza y lo mira (está a su izquierda) */
    var r = YO.rig; if (!r || r.muerto || Date.now() - (YO.ultMira || 0) < 2500) return;
    YO.ultMira = Date.now(); if (r.ocupado()) r.miraA(-1, .15, 1600); else r.gesto('mirarMenu');
  }
  function abreEditor() {
    var c = cuenta(); if (!c || !window.AV3 || !MIAV) return;
    AV3.editor({ cfg: MIAV.cfg || AV3.porDefecto(c.id), nombre: MIAV.nombre || '', ins: (window.AV_INSTR && AV_INSTR[MIAV.ins]) || null,
      onGuardar: async function (cfg, insNom) { var r = await rpcA('suite_cr_avatar_guardar', { p_cuenta: c.id, p_cfg: cfg });
        if (!(r && r.ok)) return false;
        MIAV.cfg = r.cfg; try { localStorage.setItem('co_avatar', JSON.stringify(r.cfg)); } catch (e) {}
        pintaPanel(); return true; } });
  }
  var MEGA = '<span class="megA" aria-hidden="true"><svg viewBox="0 0 34 24" width="34" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g class="cu"><path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></g><path class="on o1" d="M24.5 9.6q1.8 2.4 0 4.8"/><path class="on o2" d="M27.6 7.6q3.2 4.4 0 8.8"/><path class="on o3" d="M30.7 5.6q4.6 6.4 0 12.8"/></svg></span>';
  function abrirPanel() {
    css();
    if (!PAN) {
      PAN = document.createElement('div'); PAN.id = 'lm-carr-pan'; document.body.appendChild(PAN);
      PAN.addEventListener('click', function (e) { if (e.target === PAN && !CONF) cerrarPanel(); });
    }
    PAN.hidden = false; CONF = null; MSG = ''; VID = false; pintaPanel(); marcaVistas();
    cargaAv().then(function () { if (PAN && !PAN.hidden) pintaPanel(); });
    var b = document.getElementById('lm-carr-btn'); if (b) b.classList.add('abierto');
    refrescar();
  }
  function cerrarPanel() { if (PAN) PAN.hidden = true; var b = document.getElementById('lm-carr-btn'); if (b) b.classList.remove('abierto'); }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && PAN && !PAN.hidden && !CONF) cerrarPanel(); });


  /* ---- (20-nov-2026 12:38, Iago) CUENTAS DE PROFE (Tester/Protester) ----
     1) UN SOLO ICONO de carrusel en la barra: se oculta el de clase («aula» en GE, «Carrusel PRO» en GP) y este, al
        pulsarlo, ofrece «Partidas anunciadas» y «Trabajo en clase» (lo que abría el otro).
     2) EN LA PANTALLA DE CLASE: cuando se abre la ventana de morosos, a su izquierda y del mismo tamaño, otra con las
        partidas anunciadas de ese curso (fondo psicodélico quieto, megáfono con el anfitrión y cabecitas con nombre).
     Para quitarlo: borrar este bloque y las dos líneas marcadas «(menú profe)» en pintar(). */
  var URL_CLASE_GE = 'https://iagonaron.github.io/PredictCarrusel/?pantalla=1';
  var I_AULA = SVI('<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20l4-4 4 4M7 8h6M7 11h9"/>');
  function cssProfe() {
    if (document.getElementById('lm-carr-css-profe')) return;
    var st = document.createElement('style'); st.id = 'lm-carr-css-profe';
    st.textContent =
      'html.lm-carr-profe #ge-espiral,html.lm-carr-profe .topbar .topbar-right>a.carrusel-btn{display:none!important}' +
      '#lm-carr-menu{position:fixed;z-index:100030;width:290px;box-sizing:border-box;padding:6px;border-radius:12px;background:rgba(16,14,34,.97);border:1px solid rgba(255,255,255,.18);box-shadow:0 18px 50px rgba(0,0,0,.5);font-family:inherit}' +
      '#lm-carr-menu button{display:flex;align-items:center;gap:11px;width:100%;box-sizing:border-box;padding:8px 9px;border:0;border-radius:9px;background:transparent;color:#fff;text-align:left;cursor:pointer;font:inherit}' +
      '#lm-carr-menu button:hover,#lm-carr-menu button:focus-visible{background:rgba(255,255,255,.09);outline:none}' +
      '#lm-carr-menu .mi{position:relative;flex:none;width:34px;height:34px;border-radius:9px;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 1px rgba(255,255,255,.28)}' +
      '#lm-carr-menu .mi.mp{background:' + TEX_BTN.replace('ellipse', 'circle') + '}' +
      '#lm-carr-menu .mi.mc{overflow:visible;color:#fff;background:' + (GP ? 'var(--lm-naranja-f,#f97316)' : 'repeating-radial-gradient(circle at 50% 50%,rgba(10,7,30,0) 0 5px,rgba(10,7,30,.22) 5px 10px),radial-gradient(ellipse at 50% 50%,rgba(10,7,30,.50),rgba(10,7,30,.78)),conic-gradient(from 0deg at 50% 50%,#5bd0ff,#bd92ff,#ff5fa2,#ff9a3c,#ffd23f,#34d399,#5bd0ff)') + ';box-shadow:inset 0 0 0 1px rgba(255,255,255,.22)}' +
      (GP ? '' : '#lm-carr-menu .mi.mc::after{content:"aula";position:absolute;right:-3px;bottom:-4px;font:800 7px/1 system-ui,sans-serif;letter-spacing:.03em;color:#fff;background:#0f172a;border-radius:3px;padding:2px 3px;pointer-events:none}') +
      '#lm-carr-menu .mi svg{width:20px;height:20px;position:relative;filter:drop-shadow(0 0 2px rgba(10,7,30,.9))}' +
      '#lm-carr-menu .tx{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}#lm-carr-menu .tx b{font-size:14px;font-weight:800}#lm-carr-menu .tx i{font-style:normal;font-size:11.5px;color:rgba(255,255,255,.6)}' +
      '#lm-carr-menu em{flex:none;display:inline-flex;align-items:center;justify-content:center;min-width:17px;height:17px;padding:0 4px;box-sizing:border-box;border-radius:9px;background:#ff9a3c;color:#1b1406;font-size:10px;font-weight:800;line-height:1;font-style:normal}#lm-carr-menu em.ex{font-size:11px;font-weight:900}' +
      /* la ventana de clase */
      '#lm-carr-clase{position:fixed;z-index:4999;box-sizing:border-box;border-radius:12px;overflow:hidden;color:#fff;border:1px solid rgba(255,255,255,.22);font:500 13px/1.35 var(--lm-fuente,inherit);text-align:left}' +
      '#lm-carr-clase .fd{position:absolute;inset:0;background:' + TEX_MULTI.replace('ellipse', 'circle') + ';background-size:200% 200%;background-position:50% 50%}' +
      '#lm-carr-clase .fd::after{content:"";position:absolute;inset:0;background:rgba(14,11,30,.5)}' +
      '#lm-carr-clase .in{position:relative;height:100%;overflow:auto;box-sizing:border-box;padding:10px 12px 12px}' +
      '#lm-carr-clase .ti{display:flex;align-items:center;gap:7px;margin:2px 2px 9px;font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.78)}' +
      '#lm-carr-clase .ti svg{width:15px;height:15px}#lm-carr-clase .ti span{margin-left:auto;letter-spacing:.04em;color:rgba(255,255,255,.55)}' +
      '#lm-carr-clase .pc{padding:8px 10px;border-radius:10px;background:rgba(10,8,24,.55);border:1px solid rgba(255,255,255,.16)}#lm-carr-clase .pc+.pc{margin-top:6px}' +
      '#lm-carr-clase .cu{font-size:12.5px;font-weight:800;color:#ffd23f}' +
      '#lm-carr-clase .an{display:flex;align-items:center;gap:6px;margin-top:3px;font-size:14px;font-weight:800}#lm-carr-clase .an svg{width:16px;height:16px;flex:none;color:#ffb86b}#lm-carr-clase .an small{font-size:11px;font-weight:700;color:rgba(255,255,255,.6)}' +
      '#lm-carr-clase .mon{display:flex;flex-wrap:wrap;gap:4px 10px;margin-top:6px}#lm-carr-clase .mon .m{display:inline-flex;align-items:center;gap:3px;white-space:nowrap}#lm-carr-clase .mon svg{width:14px;height:14px;flex:none}#lm-carr-clase .mon b{font-size:11.5px;font-weight:700}#lm-carr-clase .mon i{font-style:normal;font-size:11.5px}' +
      '#lm-carr-clase .na{margin-top:5px;font-size:12px;color:rgba(255,255,255,.62)}' +
      '#lm-carr-clase .vacio{padding:4px 2px;font-size:12.5px;color:rgba(255,255,255,.75)}';
    document.head.appendChild(st);
  }
  function abrirClase() {
    if (GP) { var a = document.querySelector('.topbar a.carrusel-btn'); location.href = (a && a.href) || 'https://iagonaron.github.io/PreDictPROCarrusel/?piel=1'; return; }
    var w = null; try { w = window.open(URL_CLASE_GE + '&t=' + Date.now(), 'lm-carrusel-pantalla'); } catch (e) {}
    if (!w) location.href = URL_CLASE_GE;
  }
  function cerrarMenuProfe() { var m = document.getElementById('lm-carr-menu'); if (m) m.remove(); var b = document.getElementById('lm-carr-btn'); if (b && (!PAN || PAN.hidden)) b.classList.remove('abierto'); }
  function menuProfe(b) {
    if (document.getElementById('lm-carr-menu')) { cerrarMenuProfe(); return; }
    cssProfe();
    var n = LISTA.filter(function (p) { return p.lobby_abierto || !p.yo; }).length, al = LISTA.some(sinAnf);
    var m = document.createElement('div'); m.id = 'lm-carr-menu'; m.setAttribute('role', 'menu');
    m.innerHTML = '<button type="button" role="menuitem" data-m="p"><span class="mi mp">' + ESP + '</span><span class="tx"><b>Partidas anunciadas</b><i>Anunciar, apuntarte o jugar</i></span>' + (al ? '<em class="ex">!</em>' : (n ? '<em>' + n + '</em>' : '')) + '</button>' +
      '<button type="button" role="menuitem" data-m="c"><span class="mi mc">' + ESP + '</span><span class="tx"><b>Trabajo en clase</b><i>El carrusel del aula, en esta pantalla</i></span></button>';
    document.body.appendChild(m);
    var r = b.getBoundingClientRect();
    m.style.top = Math.round(r.bottom + 8) + 'px';
    m.style.left = Math.round(Math.max(10, Math.min(r.left, window.innerWidth - m.offsetWidth - 10))) + 'px';
    b.classList.add('abierto');
    m.addEventListener('click', function (e) {
      var x = e.target.closest ? e.target.closest('button[data-m]') : null; if (!x) return;
      cerrarMenuProfe(); if (x.dataset.m === 'p') abrirPanel(); else abrirClase();
    });
  }
  document.addEventListener('click', function (e) {
    var m = document.getElementById('lm-carr-menu'); if (!m) return;
    if (m.contains(e.target) || (e.target.closest && e.target.closest('#lm-carr-btn'))) return;
    cerrarMenuProfe();
  }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarMenuProfe(); });
  /* la ventana de clase, a la izquierda de la de morosos */
  var CLASE = { curso: null, t: 0, lista: [], pidiendo: false };
  function grupoMorosos(mp) {
    var g = mp.querySelector('.lm-mor-ahora'); g = g ? g.parentNode : mp.querySelector('.lm-mor-g'); if (!g) return '';
    for (var i = 0; i < g.childNodes.length; i++) if (g.childNodes[i].nodeType === 3 && g.childNodes[i].nodeValue.trim()) return g.childNodes[i].nodeValue.trim();
    return (g.textContent || '').replace(/en clase/i, '').trim();
  }
  function filaClase(p) {
    var otros = Math.max(0, (p.apuntados || 0) - 1);
    return '<div class="pc"><div class="cu">' + esc(cuando(p.programada).replace(/^./, function (c) { return c.toUpperCase(); })) + '</div>' +
      '<div class="an">' + CORONA + esc(p.anfitrion || p.creador || '') + ' <small>' + esc(grupoTxt(p.grupo)) + '</small></div>' +
      monigotes(jugadores(p), nombresJug(p), 12) + '</div>';
  }
  function pintaClase(el, curso) {
    var L = CLASE.lista.filter(function (p) { return !p.anfitrion_cancelo; });
    var cab = curso ? curso + '.º ' + (GP ? 'GP' : 'GE') : '';
    el.querySelector('.in').innerHTML = '<div class="ti">' + CORONA + 'Partidas anunciadas<span>' + esc(cab) + '</span></div>' +
      (L.length ? L.map(filaClase).join('') : '<div class="vacio">Ninguna anunciada todavía.<br>Desde el icono del carrusel, en el portal, puedes anunciar la primera.</div>');
  }
  async function pideClase(curso) {
    if (CLASE.pidiendo || !cuenta()) return; CLASE.pidiendo = true;
    try {
      var j = await rpcA('suite_cr_lista', { p_cuenta: cuenta().id, p_curso: curso });
      if (!j || !j.ok) j = await rpcA('suite_cr_lista', { p_cuenta: cuenta().id });   /* servidor sin p_curso: las de su curso */
      if (j && j.ok) { CLASE.lista = (j.partidas || []).filter(function (p) { return !curso || !p.curso || String(p.curso) === String(curso); }); CLASE.curso = curso; CLASE.t = Date.now(); }
    } finally { CLASE.pidiendo = false; }
  }
  function quitaClase() { var c = document.getElementById('lm-carr-clase'); if (c) c.remove(); }
  async function vigilaClase() {
    if (!esTester()) { quitaClase(); return; }
    var mp = document.querySelector('.lm-mor-panel');
    if (!mp || !mp.offsetWidth) { quitaClase(); return; }
    cssProfe();
    var curso = grupoMorosos(mp).replace(/\D/g, '');
    /* (20-nov-2026 20:37, Iago) la ventana solo aparece si hay partidas anunciadas de ese curso; si no, ni se ve */
    var nueva = false;
    if (CLASE.curso !== curso || Date.now() - CLASE.t > 60000) { await pideClase(curso); nueva = true; }
    if (!CLASE.lista.filter(function (p) { return !p.anfitrion_cancelo; }).length || CLASE.curso !== curso) { quitaClase(); return; }
    mp = document.querySelector('.lm-mor-panel'); if (!mp || !mp.offsetWidth) { quitaClase(); return; }
    var c = document.getElementById('lm-carr-clase');
    if (!c) { c = document.createElement('div'); c.id = 'lm-carr-clase'; c.setAttribute('role', 'region'); c.setAttribute('aria-label', 'Partidas anunciadas'); c.innerHTML = '<div class="fd"></div><div class="in"></div>'; document.body.appendChild(c); nueva = true; }
    if (nueva) pintaClase(c, curso);
    var r = mp.getBoundingClientRect();
    c.style.width = Math.round(r.width) + 'px'; c.style.height = Math.round(r.height) + 'px'; c.style.top = Math.round(r.top) + 'px';
    var der = r.left - 10, fr = document.querySelector('#lm-carr-aviso .lm-fr');   /* (20-nov, Iago) alineada con la franja «Carrusel …» si la hay */
    if (fr && fr.offsetWidth) { var fb = fr.getBoundingClientRect(); if (fb.right <= r.left - 4 && fb.right > r.left - 140) der = fb.right; }
    c.style.left = Math.round(Math.max(10, der - r.width)) + 'px';
  }
  setInterval(function () { try { vigilaClase(); } catch (e) {} }, 700);

  /* ---- sitio del icono ----
     (20-nov-2026 13:27, Iago) «el icono, ponlo entre clave de sol y dictado. No a la izquierda de todo». En las cuentas
     de profe el icono va DENTRO de la hilera de herramientas (#lm-iconos de piel/apps/portal.js): después de la clave
     de sol (.lm-ic-ento) y antes del dictado (.lm-ic-dict). Esa hilera se rehace entera cuando cambia lo que hay activo
     (innerHTML = ''), así que un vigilante lo vuelve a poner en su sitio. Sin hilera (o para los alumnos), donde estaba:
     el primero de la barra. Deshacer: quitar sitioBtn/vigilaSitio y volver a host.insertBefore(b, host.firstChild). */
  var BTN = null, VIGIA = null;
  function sitioBtn(b, host) {
    var bar = esTester() ? document.getElementById('lm-iconos') : null;
    if (bar && bar.parentNode === host) {
      var w = function (sel) { var e = bar.querySelector(sel); return e ? (e.closest('.lm-ic-w') || e) : null; };
      var dict = w('.lm-ic-dict'), ento = w('.lm-ic-ento');
      var ref = dict || (ento ? ento.nextSibling : null);
      if (ref === b || (b.parentNode === bar && b.nextSibling === ref)) return;
      bar.insertBefore(b, ref); return;
    }
    if (b.parentNode !== host) host.insertBefore(b, host.firstChild);
  }
  function vigilaSitio(host) {
    if (VIGIA || !window.MutationObserver || !esTester()) return;
    var pend = false;
    VIGIA = new MutationObserver(function () {
      if (pend) return; pend = true;
      requestAnimationFrame(function () {
        pend = false;
        var h = document.querySelector('.topbar .topbar-right');
        if (BTN && h && !BTN.hidden) sitioBtn(BTN, h);
      });
    });
    VIGIA.observe(host, { childList: true, subtree: true });
  }

  /* ---- (20-nov 22:00, Iago) lo ya visto (abrir el panel): deja de latir; se guarda en este aparato, por cuenta, y se limpia solo a los 7 días ---- */
  function claveVista(p) { return (sinAnf(p) ? 'x:' : p.lobby_abierto ? 'a:' : 'n:') + p.id; }
  function vistasK() { var c = cuenta(); return 'lm_carr_vistas_' + (c ? c.id : ''); }
  function vistas() { try { var o = JSON.parse(localStorage.getItem(vistasK()) || '{}'); return new Set(Object.keys(o)); } catch (e) { return new Set(); } }
  function marcaVistas() {
    try { var o = JSON.parse(localStorage.getItem(vistasK()) || '{}'), t = Date.now();
      Object.keys(o).forEach(function (k) { if (t - o[k] > 7 * 864e5) delete o[k]; });
      LISTA.forEach(function (p) { if (p.lobby_abierto || !p.yo || sinAnf(p)) { var k = claveVista(p); if (!o[k]) o[k] = t; } });
      localStorage.setItem(vistasK(), JSON.stringify(o)); } catch (e) {}
    var b = document.getElementById('lm-carr-btn'); if (b) b.classList.remove('pulsa');
  }

  /* ---- pintar ---- */
  function pintar() {
    var host = document.querySelector('.topbar .topbar-right');
    var b = BTN || document.getElementById('lm-carr-btn'), a = document.getElementById('lm-carr-aviso');
    /* (21-nov 09:38, Iago) en GP, a los alumnos no les sale NADA del carrusel (ni botón, ni vídeo, ni avisos) hasta que el servidor lo
       abre después de su clase del martes 24: 2.º GP C a las 19:00 y 2.º GP F a las 20:00. El Protester lo ve ya. */
    if (!host || !cuenta() || !OK || (GP && !esTester() && (!GP_PUBLICO || ABIERTO !== true))) { if (b) b.hidden = true; if (a) a.hidden = true; cerrarPanel(); return; }
    css();
    document.documentElement.classList.toggle('lm-carr-profe', esTester()); if (esTester()) cssProfe();   /* (menú profe) */
    if (!b) {
      b = document.createElement('button'); b.type = 'button'; b.id = 'lm-carr-btn';
      b.title = NOMBRE; b.setAttribute('aria-label', NOMBRE);
      b.innerHTML = '<span class="cl"><span class="gi"><span class="fx"></span></span></span>' + ESP + '<span class="pto"></span>';
      b.addEventListener('click', function () { if (PAN && !PAN.hidden) { cerrarPanel(); return; } if (esTester()) { menuProfe(b); return; } abrirPanel(); });   /* (menú profe) */
    }
    BTN = b; sitioBtn(b, host); vigilaSitio(host);
    b.hidden = false;
    var abiertas = LISTA.filter(function (p) { return p.lobby_abierto; });
    var nuevas = LISTA.filter(function (p) { return !p.lobby_abierto && !p.yo; });
    var pto = b.querySelector('.pto'), n = abiertas.length + nuevas.length, alerta = LISTA.some(sinAnf);
    pto.className = 'pto' + (n || alerta ? ' on' : '') + (alerta ? ' ex' : ''); pto.textContent = alerta ? '!' : (n ? String(n) : '');
    b.classList.toggle('mov', n > 0 || alerta);
    if (PAN && !PAN.hidden) marcaVistas();   /* con el panel abierto, lo que llega ya se está viendo */
    var vv = vistas();
    b.classList.toggle('pulsa', abiertas.concat(nuevas, LISTA.filter(sinAnf)).some(function (p) { return !vv.has(claveVista(p)); }));   /* (20-nov 22:00) late solo si hay algo sin ver */
    if (alerta) b.title = NOMBRE + ' · el anfitrión de una partida a la que te apuntaste ha cancelado'; else b.title = abiertas.length ? NOMBRE + ' · hay un lobby abierto ahora' : (nuevas.length ? NOMBRE + ' · ' + (nuevas.length === 1 ? 'una partida anunciada' : nuevas.length + ' partidas anunciadas') : NOMBRE);
    /* el cartelito: las partidas a las que te has apuntado («Me apunto»), la más próxima primero; «visto» no cuenta */
    var mias = LISTA.filter(function (p) { return p.yo === 'si' && !(p.soy_creador && p.anfitrion_cancelo); }).sort(function (x, y) { return new Date(x.programada) - new Date(y.programada); });
    pintaAviso(host, mias);
  }
  async function refrescar() {
    try {
      if (!cuenta()) { OK = false; pintar(); return; }
      var l = await lista(); OK = (l !== null); if (OK) LISTA = l; pintar(); try { sincNotis(); } catch (e) {}
      var f = document.activeElement; if (!(PAN && f && PAN.contains(f) && f.tagName === 'INPUT') && !CONF) pintaPanel();
    } catch (e) { console.warn('[carrusel-aviso]', e); }
  }
  /* (21-nov-2026 13:47, Iago) AVISO DE PARTIDA ANUNCIADA en «Tus notificaciones» (tarjeta con la textura del carrusel, la pintan
     los portales con data-carr-id). Aquí van sus acciones, para GE y GP a la vez:
     · «Me apunto»: cierra las notificaciones, abre la ventana del Carrusel y pide el compromiso de siempre (ahí se ven los
       monigotes y se puede personalizar el avatar). · «Marcar como visto»: es el mismo «visto» del panel (no hay que repetirlo
       arriba) y deja la notificación leída. · La tarjeta se pone al día sola: «✓ Apuntado», «Visto» o «Ya no está disponible»,
       y la cuenta atrás (días, horas y minutos) avanza. */
  function faltaTxt(iso) { var ms = new Date(iso).getTime() - Date.now(); if (!(ms > 0)) return 'Empieza ya';
    var m = Math.floor(ms / 60000), d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mi = m % 60;
    return 'Faltan ' + (d ? d + ' d ' : '') + ((d || h) ? h + ' h ' : '') + mi + ' min'; }
  function sincNotis() {
    /* (21-nov 14:45, Iago) además del texto, una barra de colores debajo: todo su ancho son 7 días y queda llena la parte que falta */
    /* (22-nov 22:00, Iago) como una MECHA: lo gastado (vacío) queda a la IZQUIERDA y lo que falta, a la derecha */
    document.querySelectorAll('[data-carr-cuenta]').forEach(function (e) { var iso = e.getAttribute('data-carr-cuenta'), t = faltaTxt(iso);
      if (e.textContent !== t) e.textContent = t;
      var q = Math.max(0, Math.min(1, (Date.parse(iso) - Date.now()) / (7 * 864e5))); e.style.setProperty('--q', q.toFixed(4)); });
    if (!OK) return;
    document.querySelectorAll('.alu-item[data-carr-id]').forEach(function (c) { var id = c.getAttribute('data-carr-id'), P = LISTA.filter(function (x) { return x.id === id; })[0];
      c.classList.toggle('carr-si', !!(P && P.yo === 'si')); c.classList.toggle('carr-visto', !!(P && P.yo === 'quiza')); c.classList.toggle('carr-fuera', !P); });
  }
  /* (21-nov-2026 13:52, Iago) Tarjetas del Carrusel online en «Tus notificaciones» (anuncio de partida, lanzamiento y «le ha
     gustado»): fondo vivo de círculos concéntricos que gira y respira, como el botón en movimiento, e icono del botón tal cual.
     Coste: una capa por tarjeta que mueve la GPU (rotate/scale, sin repintar); solo se mueven las no leídas o la partida
     pendiente; las leídas, la apuntada (en gris) y la que ya no está disponible se quedan quietas. */
  function cssNotis() { if (document.getElementById('lm-carr-notis-css')) return; var st = document.createElement('style'); st.id = 'lm-carr-notis-css';
    var L = 'html #alu-body .alu-item.cv2.carr-lanz', H = 'html #alu-body .alu-item.cv2.carr-anim', V = ':not(.carr-si):not(.carr-fuera):not(.carr-visto)', MUEVE = H + '.no-leido' + V + ',' + H + '[data-carr-id]' + V;
    var mv = function (sel) { return MUEVE.split(',').map(function (x) { return x + sel; }).join(','); };
    st.textContent = H + '{position:relative;isolation:isolate;background:#0e0904!important}' +
      H + '>.cv2-izq,' + H + '>.cv2-mid{position:relative;z-index:1}' +
      H + ' .alu-item-tit,' + H + ' .alu-item-cuerpo{text-shadow:0 1px 8px rgba(0,0,0,.95)}' +
      H + '>.carr-fx{position:absolute;inset:0;z-index:0;overflow:hidden;border-radius:inherit;pointer-events:none}' +
      H + '>.carr-fx::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(14,9,4,.94) 0%,rgba(14,9,4,.8) 38%,rgba(14,9,4,.54) 72%,rgba(14,9,4,.42) 100%)}' +
      H + '>.carr-fx .gi{position:absolute;left:50%;top:50%;width:calc(100% + 240px);aspect-ratio:1;transform:translate(-50%,-50%)}' +
      H + '>.carr-fx .fx{position:absolute;inset:0;backface-visibility:hidden;background:repeating-radial-gradient(circle at 50% 50%,rgba(8,5,20,0) 0,rgba(8,5,20,.55) 13px,rgba(8,5,20,0) 26px),conic-gradient(from 0deg at 50% 50%,#b23ad6,#e8862a 22%,#4cb04a 42%,#1aa6c9 56%,#2f5fe0 71%,#6b3fe0 86%,#b23ad6)}' +
      mv('>.carr-fx .gi') + '{will-change:transform;animation:lmCarrNRot 24s linear infinite}' +
      mv('>.carr-fx .fx') + '{will-change:transform;animation:lmCarrNRes 6s ease-in-out infinite alternate}' +
      /* icono: el botón del carrusel en movimiento */
      'html #alu-body .alu-item.cv2.carr-lanz .cv2-tile{background:#0a071e!important;border-color:rgba(255,255,255,.35)!important;opacity:1!important}' +
      'html #alu-body .carr-ic{position:absolute;inset:0;border-radius:inherit;overflow:hidden;display:flex;align-items:center;justify-content:center;color:#fff}' +
      'html #alu-body .carr-ic .gi{position:absolute;left:50%;top:50%;width:200%;aspect-ratio:1;transform:translate(-50%,-50%)}' +
      'html #alu-body .carr-ic .fx{position:absolute;inset:0;backface-visibility:hidden;background:' + TEX_BTN.replace('ellipse', 'circle') + '}' +
      'html #alu-body .carr-ic svg{position:relative;width:60%;height:60%;display:block;transform-origin:54.17% 45.83%;filter:drop-shadow(0 0 2px rgba(10,7,30,.95)) drop-shadow(0 0 5px rgba(10,7,30,.7))}' +
      'html #alu-body .alu-item.cv2.carr-anim' + V + ' .carr-ic .gi{will-change:transform;animation:lmCarrNRot 9.6s linear infinite}' +
      'html #alu-body .alu-item.cv2.carr-anim' + V + ' .carr-ic .fx{will-change:transform;animation:lmCarrNResI 3.2s ease-in-out infinite alternate}' +
      'html #alu-body .alu-item.cv2.carr-anim' + V + ' .carr-ic svg{will-change:transform;animation:lmCarrNEsp 6s linear infinite}' +
      '@keyframes lmCarrNRot{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}' +
      '@keyframes lmCarrNRes{from{transform:scale(1)}to{transform:scale(1.14)}}' +
      '@keyframes lmCarrNResI{from{transform:scale(.72)}to{transform:scale(1.18)}}' +
      '@keyframes lmCarrNEsp{to{transform:rotate(-360deg)}}' +
      '@media (prefers-reduced-motion:reduce){html #alu-body .carr-anim .gi,html #alu-body .carr-anim .fx,html #alu-body .carr-anim .carr-ic svg{animation:none!important}}' +
      /* botones: «Me apunto» naranja; «Marcar como visto» con texto blanco */
      H + ' .carr-b-si{background:#f97316!important;color:#fff!important;border:0!important;box-shadow:none!important}' +
      H + ' .carr-b-si:hover{background:#fb8a3c!important}' +
      '.alu-item[data-carr-id] .cv2-mas{display:none!important}' +
      'html #alu-body [data-carr-cuenta]{position:relative;display:inline-block;white-space:nowrap;padding-bottom:9px;vertical-align:top}' +
      'html #alu-body [data-carr-cuenta]::after,html #alu-body [data-carr-cuenta]::before{content:"";position:absolute;left:0;right:0;bottom:1px;height:4px;border-radius:3px}' +
      'html #alu-body [data-carr-cuenta]::after{background:rgba(255,255,255,.16)}' +
      'html #alu-body [data-carr-cuenta]::before{z-index:1;background:linear-gradient(90deg,#5bd0ff,#bd92ff,#ff5fa2,#ff9a3c,#ffd23f,#34d399);clip-path:inset(0 0 0 calc((1 - var(--q,1)) * 100%) round 3px)}' +
      'html #alu-body .alu-item.carr-si [data-carr-cuenta]::before{filter:grayscale(1);opacity:.7}' +
      '.alu-item[data-carr-id] .carr-b-visto{color:#fff!important;background:rgba(10,8,30,.5)!important;border:1.5px solid rgba(255,255,255,.55)!important;font-weight:700!important}' +
      '.alu-item[data-carr-id] .carr-b-visto:hover{background:rgba(255,255,255,.14)!important}' +
      /* «✓ Apuntado» (no se pulsa) y «Ya no está disponible» */
      '.alu-item[data-carr-id] .carr-chip{display:none;align-items:center;justify-content:center;gap:6px;box-sizing:border-box;width:100%;height:34px;padding:0 12px;border-radius:9px;font-weight:800;font-size:14px;white-space:nowrap;cursor:default;user-select:none}' +
      '.alu-item[data-carr-id] .carr-ok{background:rgba(22,101,52,.55);color:#4ade80;border:1.5px solid #4ade80}' +
      '.alu-item[data-carr-id] .carr-off{background:rgba(255,255,255,.08);color:rgba(255,255,255,.7);border:1.5px solid rgba(255,255,255,.25)}' +
      '#alu-body .alu-item.carr-si .carr-b,#alu-body .alu-item.carr-fuera .carr-b,#alu-body .alu-item.carr-visto .carr-b-visto{display:none!important}' +
      '.alu-item.carr-si .carr-ok,.alu-item.carr-fuera .carr-off{display:inline-flex}' +
      /* apuntado: la tarjeta en gris y quieta; el recuadro «✓ Apuntado», en color */
      H + '.carr-si>.carr-fx,' + H + '.carr-fuera>.carr-fx{filter:grayscale(1) brightness(.8)}' +
      H + '.carr-si .cv2-tile,' + H + '.carr-fuera .cv2-tile{filter:grayscale(1);opacity:.7!important}' +
      H + '.carr-si .alu-item-tit,' + H + '.carr-si .alu-item-cuerpo,' + H + '.carr-si .cv2-sub,' + H + '.carr-si .cv2-fecha{color:rgba(255,255,255,.55)!important}' +
      H + '.carr-si{border-color:rgba(255,255,255,.16)!important}' +
      /* (21-nov 16:03) leída: el portal pone en gris TODA la tarjeta; aquí no: en gris y quieta, pero lo que se pulsa y «✓ Apuntado», en color */
      L + ':not(.no-leido){filter:none!important;opacity:1!important}' +
      L + ':not(.no-leido)>.carr-fx{filter:grayscale(1) brightness(.8)}' +
      L + ':not(.no-leido) .cv2-tile{filter:grayscale(1);opacity:.7!important}' +
      L + ':not(.no-leido) .alu-item-tit,' + L + ':not(.no-leido) .alu-item-cuerpo,' + L + ':not(.no-leido) .cv2-sub,' + L + ':not(.no-leido) .cv2-fecha{color:rgba(255,255,255,.55)!important}' +
      L + ':not(.no-leido) [data-carr-cuenta]::before{filter:grayscale(1);opacity:.7}' +
      /* (21-nov 16:28, Iago) si ya la marcó como vista, «Me apunto» también en gris (se puede seguir pulsando) */
      H + '.carr-visto .carr-b-si{background:#4b5063!important;color:rgba(255,255,255,.88)!important}' +
      H + '.carr-visto .carr-b-si:hover{background:#5b6175!important}' +
      /* penalización: lo que pierdes, en rojo; tras «Entendido», sin el botón */
      'html #alu-body .carr-pen-pts{color:#f87171;font-weight:800}' +
      'html #alu-body .alu-item.carr-penal:not(.no-leido) .reco-ok{display:none!important}' +
      '.alu-item.carr-fuera{opacity:.6}.alu-item.carr-fuera [data-carr-cuenta]{display:none}';
    document.head.appendChild(st); }
  try { cssNotis(); } catch (e) {}
  document.addEventListener('click', async function (ev) {
    var t = ev.target && ev.target.closest ? ev.target : null; if (!t) return;
    /* (21-nov 14:41, Iago) «Ver partidas» del aviso de lanzamiento: directo a la ventana del Carrusel multijugador (en las
       cuentas de prueba el botón de arriba abre antes el menú de profe; aquí no) */
    var abre = t.closest('[data-carr-abrir]');
    if (abre) { ev.preventDefault(); ev.stopPropagation(); var xc = document.getElementById('alu-close'); if (xc) xc.click(); if (!OK) await refrescar(); abrirPanel(); return; }
    var ap = t.closest('[data-carr-apunta]'), vi = t.closest('[data-carr-visto]'); if (!ap && !vi) return;
    ev.preventDefault(); ev.stopPropagation(); if (!cuenta()) return;
    var id = (ap || vi).getAttribute(ap ? 'data-carr-apunta' : 'data-carr-visto'), card = (ap || vi).closest('.alu-item'), nid = card && card.getAttribute('data-id');
    if (nid && card.classList.contains('no-leido')) { card.classList.remove('no-leido'); rpcA('suite_alumno_marcar_leido', { p_cuenta_id: cuenta().id, p_notif_id: nid }); }
    if (vi) { vi.disabled = true; await rpcA('suite_cr_apuntar', { p_cuenta: cuenta().id, p_partida: id, p_resp: 'quiza' }); await refrescar(); return; }
    var x = document.getElementById('alu-close'); if (x) x.click();
    if (!LISTA.some(function (q) { return q.id === id; })) await refrescar();
    abrirPanel();
    var n = 0; (function pide() { var bt = PAN && PAN.querySelector('button[data-a="si"][data-id="' + id + '"]');
      if (bt) { bt.scrollIntoView({ block: 'center' }); bt.click(); } else if (++n < 25) setTimeout(pide, 120); })();
  }, true);
  setInterval(function () { if (document.querySelector('.alu-item[data-carr-id]')) { cssNotis(); sincNotis(); } }, 1000);
  window.LMCarr = { abrir: function () { abrirPanel(); }, faltaTxt: faltaTxt, sinc: function () { cssNotis(); sincNotis(); } };
  /* (21-nov-2026) móvil = lo mismo que decide el juego (lobby.js esMovil): teléfono por el navegador, o pantalla táctil con el lado corto < 600 px. Las tablets y los ordenadores, siempre. */
  function esMovilCarr() { try { var ua = navigator.userAgent || ''; if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return false;
    if (/iPhone|iPod|Windows Phone|IEMobile|Android.+Mobile|Mobile.+Firefox|Opera Mini/i.test(ua)) return true;
    return matchMedia('(pointer:coarse)').matches && Math.min(screen.width, screen.height) < 600; } catch (e) { return false; } }
  /* (22-nov-2026, Iago) en el VISOR del profesor (Ojeador / «Ver su portal» desde el Diario móvil, #visor=) el carrusel se ve también en el móvil,
     como en el ordenador; a los alumnos en el móvil se les sigue escondiendo. En pantalla pequeña, la franja baja a una segunda línea. */
  try { if (window.__VISOR) document.documentElement.classList.add('lm-carr-visor'); else if (esMovilCarr()) document.documentElement.classList.add('lm-carr-movil'); } catch (e) {}
  function arrancar() { refrescar(); setInterval(function () { if (!document.hidden) refrescar(); }, 60000); setInterval(function () { try { pintar(); } catch (e) {} }, 5000); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar); else arrancar();
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') refrescar(); });
  var _ss = window.setSession;
  if (typeof _ss === 'function') { window.setSession = function (s) { var r = _ss(s); setTimeout(refrescar, 600); return r; }; }
})();
