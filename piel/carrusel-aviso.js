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
  /* (20-nov-2026, C1) también en el portal GP: «Carrusel PRO Online» (se abre el martes 24-nov a las 20:00) */
  var NOMBRE = GP ? 'Carrusel PRO Online' : 'Carrusel Online', SESION = GP ? 'lmpro_session' : 'lmeav_session';
  /* en GP, hasta que Iago diga «Publica el Carrusel PRO», el botón solo lo ve el Protester (para probarlo); para todos: true */
  var GP_PUBLICO = false;
  var SBU = 'https://woiptkyrxkbpnvioypit.supabase.co';
  var SBK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvaXB0a3lyeGticG52aW95cGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NzI2ODYsImV4cCI6MjA5MjA0ODY4Nn0.B2nKgj5rD0rkdLeMIrd9KgD8lUPWsBT4Y7aCtmnvbjA';
  var URL_CARR = GP ? 'https://predict.gp.lmathome.es/carrusel-online/' : 'https://predict.ge.lmathome.es/carrusel-online/';
  var LISTA = [], OK = false, ABIERTO = null;   /* ABIERTO: lo decide el servidor (Tester incluido) */
  /* apertura (19-nov-2026, Iago): elemental desde el viernes 20-nov a las 17:30 (antes 19:00; cambiado el 20-nov 08:40). El servidor también lo
     impide; Tester/Protester siempre pueden. El vídeo de presentación se puede ver antes: poner aquí su enlace (YouTube o .mp4). */
  var ABRE = GP ? Date.parse('2026-11-24T20:00:00+01:00') : Date.parse('2026-11-20T17:30:00+01:00'), ABRE_TXT = GP ? 'el martes 24 de noviembre a las 20:00' : 'hoy viernes a las 17:30';
  var VIDEO_URL = '';   /* vídeo retirado hasta que Iago apruebe las pantallas (19-nov 15:25); estaba en piel/carrusel/carrusel-online-ge.mp4 */

  function ses() { try { return JSON.parse(localStorage.getItem(SESION) || 'null') || window.__LM_SES || null; } catch (e) { return window.__LM_SES || null; } }
  function cuenta() { var s = ses(); return (s && s.id && s.estado === 'validado') ? s : null; }
  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toLowerCase(); }
  function esTester() { var s = ses(); return !!(s && /tester/.test(norm(s.nombre))); }
  function cerrado() { if (ABIERTO === true) return false; return Date.now() < ABRE && !esTester(); }
  function videoHTML(u) {
    if (!u) return '<div class="vacio">El vídeo de presentación estará aquí muy pronto.</div>';
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
  function confirmados(p) { var n = Math.max(0, (p.apuntados || 0) - 1); return n === 0 ? 'sin confirmados' : n + (n === 1 ? ' confirmado' : ' confirmados'); }
  function texto(p) {
    if (p.soy_creador) {
      if (p.lobby_abierto) return '¡Tu carrusel está abierto!';
      return 'Tu carrusel ' + cuando(p.programada);
    }
    if (p.lobby_abierto) return '¡Carrusel abierto! Únete';
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
      '#lm-carr-btn svg{animation:none}@keyframes lmCarrGira{to{transform:rotate(360deg)}}' +
      '#lm-carr-btn .pto{z-index:3;position:absolute;right:-4px;top:-4px;min-width:17px;height:17px;padding:0 4px;box-sizing:border-box;border-radius:9px;border:2px solid #0f172a;background:#f97316;color:#fff;font:900 10px/1 system-ui,sans-serif;display:none;align-items:center;justify-content:center;font-variant-numeric:tabular-nums}' +
      '#lm-carr-btn .pto.on{display:inline-flex}' +
      '@media (prefers-reduced-motion:reduce){#lm-carr-btn.mov svg{animation:none}}' +
      /* el cartelito: una franja por partida; la más próxima a la vista y las demás debajo, tras la flechita */
      '#lm-incid-btn{order:-6!important}' +
      '#lm-carr-aviso{order:-7;z-index:2147480400;display:inline-flex;align-items:center;gap:4px}' +
      '.lm-fr{display:inline-flex;align-items:center;gap:7px;box-sizing:border-box;height:var(--lm-ctl,34px);padding:0 12px 0 9px;border-radius:10px;color:#fff;font:800 13px/1 inherit;font-family:inherit;letter-spacing:.01em;white-space:nowrap;max-width:390px;overflow:hidden;text-decoration:none;cursor:pointer;' +
      'background:#140f33;box-shadow:inset 0 0 0 1px rgba(255,255,255,.28);text-shadow:0 1px 6px rgba(0,0,0,.55);border:0;position:relative;isolation:isolate}' +
      '.lm-fr > svg,.lm-fr > span:not(.cl){position:relative;z-index:1}' +
      '.lm-fr::after,#lm-carr-btn::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 0 1px rgba(255,255,255,.28);pointer-events:none;z-index:2}' +
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
      /* monigotes de confirmados (en la franja del anfitrión) */
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
      '#lm-carr-pan .x.vv + .x{margin-left:8px}#lm-carr-pan .x svg.sv{width:16px;height:16px}#lm-carr-pan .x{margin-left:auto;align-self:flex-start;width:36px;height:36px;border-radius:10px;border:1.5px solid rgba(255,255,255,.42);background:rgba(10,8,30,.45);color:#fff;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0}' +
      '#lm-carr-pan .cols{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}' +
      '#lm-carr-pan .card{background:rgba(14,10,42,.74);border:1.5px solid rgba(255,255,255,.24);border-radius:14px;padding:18px 20px;}' +
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
      '#lm-carr-pan .pt > .row{width:250px;flex:none;flex-wrap:nowrap;justify-content:flex-end}#lm-carr-pan .pt > .row .bt.pri,#lm-carr-pan .pt > .row .bt.ko{flex:1;justify-content:center}' +
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
      '#lm-carr-pan .conf{position:fixed;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;background:rgba(5,3,20,.66)}' +
      '#lm-carr-pan .conf .cm{max-width:470px;background:rgba(18,13,52,.97);border:1.5px solid rgba(255,255,255,.34);border-radius:14px;padding:22px 24px;box-shadow:0 24px 70px rgba(0,0,0,.6)}' +
      '#lm-carr-pan .rojo{color:#ef4444;font-weight:800}#lm-carr-pan .conf h3{margin:0 0 10px;font-size:22px;font-weight:900}#lm-carr-pan .conf p{color:#f1eeff;margin:0 0 16px}#lm-carr-pan .conf .row{justify-content:flex-end}' +
      /* (20-nov) el campo de la fecha es un botón que abre el selector propio */ '#lm-carr-pan button.fh{display:flex;align-items:center;gap:9px;height:42px;padding:0 14px;box-sizing:border-box;border-radius:10px;border:1.5px solid rgba(255,255,255,.42);background:rgba(10,8,30,.5);color:#fff;font:700 15px "Helvetica Neue",Arial,sans-serif;cursor:pointer;white-space:nowrap;text-align:left}#lm-carr-pan button.fh svg{width:19px;height:19px;flex:none}#lm-carr-pan button.fh .ph{position:static;inset:auto;padding:0;display:none;color:inherit;font:inherit}#lm-carr-pan button.fh.vacio{border-style:dashed;border-color:rgba(255,210,63,.85);color:#ffd23f}#lm-carr-pan button.fh.vacio .ph{display:inline}#lm-carr-pan button.fh.vacio .vl{display:none}#lm-carr-pan button.fh:hover{background:rgba(255,210,63,.1)}' +
      '@media (max-width:900px){#lm-carr-btn,#lm-carr-aviso,#lm-carr-pan{display:none!important}}';
    document.head.appendChild(st);
  }
  var ESP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 11a2 2 0 0 1 4 0a4 4 0 0 1-8 0a6 6 0 0 1 12 0a8 8 0 0 1-16 0"/></svg>';
  function SVI(d) { return '<svg class="sv" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; }
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
  function franja(p) {
    var f = document.createElement('button'); f.type = 'button';
    f.className = 'lm-fr' + (p.lobby_abierto ? ' vivo' : '') + (p.soy_creador ? ' mia' : '');
    f.title = p.soy_creador ? 'Has anunciado este carrusel: eres el anfitrión' : NOMBRE + ' · partida de ' + (p.creador || '');
    f.innerHTML = '<span class="cl"><span class="gi"><span class="fx"></span></span></span>' + (p.soy_creador ? CORONA : ESP) + '<span>' + esc(texto(p)) + '</span>' + (p.soy_creador ? monigotes(Math.max(0, (p.apuntados || 0) - 1), p.confirmados, 3) : '');
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
     Solo deja elegir desde dentro de 10 minutos hasta 14 días (lo mismo que exige el servidor).
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
    var ahora = new Date(), min = new Date(ahora.getTime() + 10 * 6e4), max = new Date(ahora.getTime() + 14 * 864e5);
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
    var mia = p.soy_creador, conf = Math.max(0, (p.apuntados || 0) - 1);
    var quien = mia ? '<span class="cor">' + CORONA + '</span>Tu partida' : esc(p.creador) + ' <span class="g">(' + esc(grupoTxt(p.grupo)) + ')</span>';
    var cab = p.lobby_abierto ? '<i class="sq v"></i>Abierta ahora' : '<i class="sq a"></i>Anunciada · ' + esc(cuando(p.programada));
    var otros = Math.max(0, (p.apuntados || 0) - 1);
    var gente = mia ? (conf ? monigotes(conf, p.confirmados, 8) : 'sin confirmados todavía') : (otros ? monigotes(otros, p.confirmados, 8) : 'nadie apuntado todavía');
    var bs;
    if (p.lobby_abierto) bs = '<button class="bt pri" data-go="' + p.id + '" data-e="' + (mia || p.yo_dentro ? '' : '1') + '">Unirme</button>';
    else if (mia) bs = p.anfitrion_cancelo ? '<span class="c">La cancelaste</span>' : '<button class="bt ko" data-cancel="' + p.id + '">' + I_X + 'Cancelar partida</button>';
    else bs = '<button class="bt pri' + (p.yo === 'si' ? ' sel' : '') + '" data-a="si" data-id="' + p.id + '">' + (p.yo === 'si' ? I_OK : '') + 'Me apunto</button>' +
      (p.yo === 'quiza' ? '' : '<button class="bt ico" data-a="' + (p.yo === 'si' ? 'no' : 'quiza') + '" data-id="' + p.id + '" title="' + (p.yo === 'si' ? 'Quitarme de la partida' : 'Marcar como visto') + '">' + I_X + '</button>');
    return '<div class="pt' + (mia ? ' mia' : '') + '"><div class="inf"><div class="q">' + quien + '</div><div class="c">' + cab + '</div><div class="c">' + gente + '</div></div><div class="row">' + bs + '</div></div>';
  }
  function minHora() { var d = new Date(Date.now() + 11 * 6e4); return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 16); }
  function pintaPanel() {
    if (!PAN || PAN.hidden) return;
    var h = PAN.querySelector('#lm-carr-hora'); if (h) HORA = h.value;
    var sc = PAN.querySelector('.caja'), top = sc ? sc.scrollTop : 0;
    PAN.innerHTML = '<div class="marco"><div class="cl"><div class="gi"><div class="fx"></div></div></div><div class="caja">' +
      '<div class="top"><div class="lg">' + LOGO + '</div><div><div class="tt"><span class="car">Carrusel</span>' + (GP ? '<span class="pro">PRO</span>' : '') + '<span class="onl">Online</span></div><div class="kick">' + (GP ? 'Grado Profesional' : 'Grado Elemental') + '</div></div>' +
      (!cerrado() && VIDEO_URL ? '<button class="x vv" type="button" title="Ver el vídeo">' + I_PLAY + '</button>' : '') + '<button class="x" type="button" title="Cerrar">' + I_X + '</button></div>' +
      (VID && !cerrado() ? '<div class="card" style="margin-bottom:14px">' + videoHTML(VIDEO_URL) + '</div>' : '') +
      (MSG ? '<div class="msg">' + esc(MSG) + '</div>' : '') +
(cerrado() ? '<div class="card"><h2>Muy pronto</h2><p>El carrusel online estará disponible <b>' + ABRE_TXT + '</b>. Te lo explico en clase; mientras, puedes ver el vídeo.</p>' + videoHTML(VIDEO_URL) + '</div>' : 
      '<div class="cols"><div class="card"><h2>Anunciar partida</h2><p>Elige día y hora. <b>Serás el anfitrión</b><span class="meg">' + I_CAL + '</span></p>' +
      '<div class="row"><button type="button" class="fh' + (HORA ? '' : ' vacio') + '" id="lm-carr-fh"><input type="hidden" id="lm-carr-hora" value="' + esc(HORA) + '"><svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3.5\" y=\"5\" width=\"17\" height=\"15\" rx=\"2.5\"/><path d=\"M3.5 10h17M8 3v4M16 3v4\"/></svg><span class="ph">Elige día y hora</span><span class="vl">' + esc(lmfTexto(HORA)) + '</span></button><button class="bt pri" id="lm-carr-ok" type="button"' + (HORA ? '' : ' disabled') + '>' + I_CAL + 'Anunciar</button></div></div>' +
      '<div class="card"><h2>Partida individual</h2><p>Empieza una partida tú solo, ahora mismo.</p><button class="bt" id="lm-carr-ya" type="button">' + I_PLAY + 'Jugar ahora</button></div></div>' +
      '<div class="card"><h2>Partidas anunciadas</h2>' + (LISTA.length ? LISTA.map(filaPartida).join('') : '<div class="vacio">Ahora mismo no hay ninguna. ¡Anuncia tú la primera!</div>') + '</div>') +
      (CONF ? '<div class="conf"><div class="cm"><h3>' + esc(CONF.t) + '</h3><p>' + rojo(esc(CONF.x)) + '</p><div class="row"><button class="bt" id="lm-c-no" type="button">' + esc(CONF.no || 'Mejor no') + '</button><button class="bt pri" id="lm-c-si" type="button">' + esc(CONF.si) + '</button></div></div></div>' : '') +
      '</div></div>';
    var sc2 = PAN.querySelector('.caja'); if (sc2) sc2.scrollTop = top;
    PAN.querySelector('.x:not(.vv)').onclick = cerrarPanel;
    var vv = PAN.querySelector('.x.vv'); if (vv) vv.onclick = function () { VID = !VID; pintaPanel(); };
    if (cerrado()) return;
    var hi = PAN.querySelector('#lm-carr-hora'), ok = PAN.querySelector('#lm-carr-ok');
    PAN.querySelector('#lm-carr-fh').onclick = function () { lmSelFecha(HORA, function (v) { var hh = PAN.querySelector('#lm-carr-hora'); if (hh) hh.value = v; HORA = v; pintaPanel(); }); };   /* (20-nov, Iago) selector propio: el mismo en todos los navegadores */
    ok.onclick = async function () {
      if (!hi.value) return; var f = new Date(hi.value);
      if (!await pedirConf('¿Anunciar esta partida?', 'Será ' + cuando(f.toISOString()) + ' y serás el anfitrión. Si alguien se apunta y luego no asistes, perderás 0,5 de actitud. Puedes evitarlo cancelando la partida hasta 5 minutos antes de su inicio.', 'Sí, anunciar')) return;
      var r = await rpcA('suite_cr_crear', { p_cuenta: cuenta().id, p_programada: f.toISOString() });
      if (r && r.ok) { MSG = 'Partida anunciada para ' + cuando(f.toISOString()) + '.'; HORA = ''; }
      else MSG = r && r.error === 'aun_no' ? 'El carrusel online se abre ' + ABRE_TXT + '.' : r && r.error === 'hora' ? 'La hora debe estar entre 10 minutos y 14 días desde ahora.' : 'No he podido anunciar la partida.';
      refrescar();
    };
    PAN.querySelector('#lm-carr-ya').onclick = function () { abrirURL(URL_CARR + '?solo=1'); };
    PAN.querySelectorAll('button[data-go]').forEach(function (bt) { bt.onclick = function () { abrirCarrusel(bt.dataset.go, bt.dataset.e === '1'); }; });
    PAN.querySelectorAll('button[data-cancel]').forEach(function (bt) {
      bt.onclick = async function () {
        var P = LISTA.filter(function (x) { return x.id === bt.dataset.cancel; })[0]; if (!P) return;
        var pen = tarde(P) && (P.apuntados || 0) > 1;
        if (!await pedirConf(pen ? 'Cancelar ahora cuenta como no asistir' : '¿Cancelar tu partida?', pen ? 'Hay gente apuntada y faltan menos de 5 minutos: perderás 0,5 de actitud. ¿Cancelar igualmente?' : (tarde(P) ? 'No pierdes actitud porque no hay nadie apuntado.' : 'No pierdes actitud porque faltan más de 5 minutos.'), 'Sí, cancelar', 'No, la mantengo')) return;
        var r = await rpcA('suite_cr_cancelar', { p_cuenta: cuenta().id, p_partida: P.id });
        MSG = r && r.ok ? 'Has cancelado la partida.' : 'No he podido cancelar la partida.'; refrescar();
      };
    });
    PAN.querySelectorAll('button[data-a]').forEach(function (bt) {
      bt.onclick = async function () {
        var a = bt.dataset.a, id = bt.dataset.id, P = LISTA.filter(function (x) { return x.id === id; })[0];
        if (a === 'si' && P && P.yo === 'si') return;
        if (a === 'si' && P && P.tipo === 'anunciada') { if (!await pedirConf('¿Estás seguro?', 'Si luego no asistes, perderás 0,25 de actitud. Puedes evitarlo quitándote de la partida hasta 5 minutos antes de que empiece.', 'Sí, me apunto')) return; }
        if ((a === 'no' || a === 'quiza') && P && P.yo === 'si' && tarde(P)) { if (!await pedirConf('Ya es tarde para quitarte', 'Quitarte ahora cuenta como no asistir: perderás 0,25 de actitud. ¿Quieres quitarte igualmente?', 'Sí, quitarme', 'No, me quedo')) return; }
        bt.disabled = true; MSG = '';
        await rpcA('suite_cr_apuntar', { p_cuenta: cuenta().id, p_partida: id, p_resp: a }); refrescar();
      };
    });
  }
  function abrirURL(u) { var w = null; try { w = window.open(u, '_blank'); } catch (e) {} if (!w) location.href = u; }
  function abrirCarrusel(id, entrar) { abrirURL(URL_CARR + '?p=' + encodeURIComponent(id) + (entrar ? '&e=1' : '')); }
  function rojo(t) { return t.replace(/(perder[áa]s (?:un )?0,\d+ de actitud)/g, '<b class="rojo">$1</b>'); }
  function pedirConf(t, x, si, no) {
    return new Promise(function (res) {
      CONF = { t: t, x: x, si: si, no: no }; pintaPanel();
      var fin = function (v) { CONF = null; pintaPanel(); res(v); };
      PAN.querySelector('#lm-c-si').onclick = function () { fin(true); };
      PAN.querySelector('#lm-c-no').onclick = function () { fin(false); };
    });
  }
  function abrirPanel() {
    css();
    if (!PAN) {
      PAN = document.createElement('div'); PAN.id = 'lm-carr-pan'; document.body.appendChild(PAN);
      PAN.addEventListener('click', function (e) { if (e.target === PAN && !CONF) cerrarPanel(); });
    }
    PAN.hidden = false; CONF = null; MSG = ''; VID = false; pintaPanel();
    var b = document.getElementById('lm-carr-btn'); if (b) b.classList.add('abierto');
    refrescar();
  }
  function cerrarPanel() { if (PAN) PAN.hidden = true; var b = document.getElementById('lm-carr-btn'); if (b) b.classList.remove('abierto'); }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && PAN && !PAN.hidden && !CONF) cerrarPanel(); });

  /* ---- pintar ---- */
  function pintar() {
    var host = document.querySelector('.topbar .topbar-right');
    var b = document.getElementById('lm-carr-btn'), a = document.getElementById('lm-carr-aviso');
    if (!host || !cuenta() || !OK || (GP && !GP_PUBLICO && !esTester())) { if (b) b.hidden = true; if (a) a.hidden = true; cerrarPanel(); return; }
    css();
    if (!b) {
      b = document.createElement('button'); b.type = 'button'; b.id = 'lm-carr-btn';
      b.title = NOMBRE; b.setAttribute('aria-label', NOMBRE);
      b.innerHTML = '<span class="cl"><span class="gi"><span class="fx"></span></span></span>' + ESP + '<span class="pto"></span>';
      b.addEventListener('click', function () { if (PAN && !PAN.hidden) cerrarPanel(); else abrirPanel(); });
    }
    if (b.parentNode !== host) host.insertBefore(b, host.firstChild);
    b.hidden = false;
    var abiertas = LISTA.filter(function (p) { return p.lobby_abierto; });
    var nuevas = LISTA.filter(function (p) { return !p.lobby_abierto && !p.yo; });
    var pto = b.querySelector('.pto'), n = abiertas.length + nuevas.length;
    pto.className = 'pto' + (n ? ' on' : ''); pto.textContent = n ? String(n) : '';
    b.classList.toggle('mov', n > 0);
    b.title = abiertas.length ? NOMBRE + ' · hay un lobby abierto ahora' : (nuevas.length ? NOMBRE + ' · ' + (nuevas.length === 1 ? 'una partida anunciada' : nuevas.length + ' partidas anunciadas') : NOMBRE);
    /* el cartelito: las partidas a las que te has apuntado («Me apunto»), la más próxima primero; «visto» no cuenta */
    var mias = LISTA.filter(function (p) { return p.yo === 'si' && !(p.soy_creador && p.anfitrion_cancelo); }).sort(function (x, y) { return new Date(x.programada) - new Date(y.programada); });
    pintaAviso(host, mias);
  }
  async function refrescar() {
    try {
      if (!cuenta()) { OK = false; pintar(); return; }
      var l = await lista(); OK = (l !== null); if (OK) LISTA = l; pintar();
      var f = document.activeElement; if (!(PAN && f && PAN.contains(f) && f.tagName === 'INPUT') && !CONF) pintaPanel();
    } catch (e) { console.warn('[carrusel-aviso]', e); }
  }
  function arrancar() { refrescar(); setInterval(function () { if (!document.hidden) refrescar(); }, 60000); setInterval(function () { try { pintar(); } catch (e) {} }, 5000); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar); else arrancar();
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') refrescar(); });
  var _ss = window.setSession;
  if (typeof _ss === 'function') { window.setSession = function (s) { var r = _ss(s); setTimeout(refrescar, 600); return r; }; }
})();
