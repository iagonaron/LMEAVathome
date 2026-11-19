/* ============================================================================================================
   PREDICT CARRUSEL ONLINE · botón de entrada + cartelito fijo en el portal GE (19-nov-2026, C1 · Carrusel online)
   · Botón con caracol naranja sobre fondo azul psicodélico (la textura del PreDict Carrusel): abre el lobby del
     carrusel online (https://predict.ge.lmathome.es/carrusel-online/). Un puntito avisa: verde parpadeando si hay un
     lobby abierto ahora; naranja si hay partidas anunciadas que aún no has visto.
   · Cartelito a la izquierda de «?» (Incidencias): si has pulsado «Me apunto» en una partida anunciada, se queda a la
     vista hasta que empiece («Tienes un carrusel mañana a las 17:00», «… en 3 h», «… en 25 min»). No es una notificación.
     «Marcar como visto» no lo muestra.
   · Solo GE (el portal de profesional no lo lleva todavía). Lee `suite_cr_lista` (sus datos son del curso de la cuenta).
   · No toca nada de lo demás: si algo falla, no sale y ya.
   Quitarlo: borrar la línea <script … carrusel-aviso.js> de index.html.
   ============================================================================================================ */
(function () {
  'use strict';
  if (window.__lmCarrAviso) return; window.__lmCarrAviso = 1;
  var GP = /(^|\.)gp\.lmathome\.es$/i.test(location.hostname) || /lmpro/i.test(location.pathname);
  if (GP) return;
  var SBU = 'https://woiptkyrxkbpnvioypit.supabase.co';
  var SBK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvaXB0a3lyeGticG52aW95cGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NzI2ODYsImV4cCI6MjA5MjA0ODY4Nn0.B2nKgj5rD0rkdLeMIrd9KgD8lUPWsBT4Y7aCtmnvbjA';
  var URL_CARR = 'https://predict.ge.lmathome.es/carrusel-online/';
  var LISTA = [], OK = false;

  function ses() { try { return JSON.parse(localStorage.getItem('lmeav_session') || 'null') || window.__LM_SES || null; } catch (e) { return window.__LM_SES || null; } }
  function cuenta() { var s = ses(); return (s && s.id && s.estado === 'validado') ? s : null; }
  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toLowerCase(); }
  function esTester() { var s = ses(); return !!(s && /tester/.test(norm(s.nombre))); }
  async function lista() {
    var c = cuenta(); if (!c) return null;
    try {
      var r = await fetch(SBU + '/rest/v1/rpc/suite_cr_lista', { method: 'POST', headers: { 'apikey': SBK, 'Authorization': 'Bearer ' + SBK, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_cuenta: c.id }) });
      if (!r.ok) return null; var j = await r.json(); return (j && j.ok) ? (j.partidas || []) : null;
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
  function texto(p) {
    if (p.lobby_abierto) return '¡Tu carrusel está abierto! Entra';
    var min = Math.round((new Date(p.programada).getTime() - Date.now()) / 6e4);
    if (min <= 1) return 'Tu carrusel empieza ya';
    if (min < 60) return 'Tienes un carrusel en ' + min + ' min';
    if (min < 360) return 'Tienes un carrusel en ' + Math.round(min / 60) + ' h';
    return 'Tienes un carrusel ' + cuando(p.programada);
  }

  /* ---- estilos ---- */
  function css() {
    if (document.getElementById('lm-carr-css')) return;
    var st = document.createElement('style'); st.id = 'lm-carr-css';
    st.textContent =
      '#lm-carr-btn,#lm-carr-aviso{display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;flex:0 0 auto;align-self:center;text-decoration:none;cursor:pointer;position:relative;border:0;margin:0;font-family:inherit}' +
      /* el botón: azules psicodélicos con la textura de anillos del carrusel; el caracol, naranja */
      '#lm-carr-btn{order:-5;width:var(--lm-ctl,34px);height:var(--lm-ctl,34px);min-width:var(--lm-ctl,34px);padding:0;border-radius:10px;color:#ff9a3c;' +
      'background:repeating-radial-gradient(circle at 50% 50%,rgba(255,255,255,0) 0 2px,rgba(255,255,255,.14) 2px 3.5px),conic-gradient(from 200deg at 50% 50%,#1e3a8a,#2563eb,#38bdf8,#6366f1,#0ea5e9,#1e40af,#22d3ee,#1e3a8a);' +
      'box-shadow:inset 0 0 0 1px rgba(255,255,255,.22);transition:filter .15s}' +
      '#lm-carr-btn:hover{filter:brightness(1.12)}#lm-carr-btn:focus-visible{outline:2px solid #fff;outline-offset:2px}' +
      '#lm-carr-btn svg{width:62%;height:62%;display:block;pointer-events:none;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.45))}' +
      '#lm-carr-btn .pto{position:absolute;right:-3px;top:-3px;width:11px;height:11px;border-radius:50%;border:2px solid #0f172a;background:#ff9a3c;display:none}' +
      '#lm-carr-btn .pto.on{display:block}#lm-carr-btn .pto.vivo{background:#34d399;animation:lmCarrP 1.1s infinite}' +
      '@keyframes lmCarrP{0%,100%{box-shadow:0 0 0 0 rgba(52,211,153,.8)}50%{box-shadow:0 0 0 6px rgba(52,211,153,0)}}' +
      /* el cartelito: la textura multicolor del PreDict Carrusel, con el texto legible encima */
      '#lm-carr-aviso{order:-6;height:var(--lm-ctl,34px);padding:0 12px 0 9px;gap:7px;border-radius:10px;color:#fff;font-size:13px;font-weight:800;letter-spacing:.01em;white-space:nowrap;max-width:300px;overflow:hidden;' +
      'background:repeating-radial-gradient(circle at 50% 50%,rgba(10,7,30,0) 0 5px,rgba(10,7,30,.22) 5px 10px),radial-gradient(ellipse at 50% 50%,rgba(10,7,30,.50),rgba(10,7,30,.78)),conic-gradient(from 0deg at 50% 50%,#5bd0ff,#bd92ff,#ff5fa2,#ff9a3c,#ffd23f,#34d399,#5bd0ff);' +
      'box-shadow:inset 0 0 0 1px rgba(255,255,255,.28);text-shadow:0 1px 6px rgba(0,0,0,.55)}' +
      '#lm-carr-aviso:hover{filter:brightness(1.12)}' +
      '#lm-carr-aviso svg{width:17px;height:17px;flex:none;color:#ff9a3c}' +
      '#lm-carr-aviso.vivo{animation:lmCarrA 1.4s ease-in-out infinite}@keyframes lmCarrA{50%{filter:brightness(1.35)}}' +
      '#lm-carr-btn[hidden],#lm-carr-aviso[hidden]{display:none!important}' +
      '@media (max-width:900px){#lm-carr-btn,#lm-carr-aviso{display:none!important}}';
    document.head.appendChild(st);
  }
  var ESP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 11a2 2 0 0 1 4 0a4 4 0 0 1-8 0a6 6 0 0 1 12 0a8 8 0 0 1-16 0"/></svg>';

  /* ---- pintar ---- */
  function pintar() {
    var host = document.querySelector('.topbar .topbar-right');
    var b = document.getElementById('lm-carr-btn'), a = document.getElementById('lm-carr-aviso');
    if (!host || !cuenta() || !OK) { if (b) b.hidden = true; if (a) a.hidden = true; return; }
    css();
    if (!b) {
      b = document.createElement('a'); b.id = 'lm-carr-btn'; b.href = URL_CARR; b.target = 'lm-carrusel-online';
      b.title = 'PreDict Carrusel online'; b.setAttribute('aria-label', 'PreDict Carrusel online');
      b.innerHTML = ESP + '<span class="pto"></span>';
    }
    if (b.parentNode !== host) host.insertBefore(b, host.firstChild);
    b.hidden = false;
    var abiertas = LISTA.filter(function (p) { return p.lobby_abierto; });
    var nuevas = LISTA.filter(function (p) { return !p.lobby_abierto && !p.yo; });
    var pto = b.querySelector('.pto');
    pto.className = 'pto' + (abiertas.length ? ' on vivo' : (nuevas.length ? ' on' : ''));
    b.title = abiertas.length ? 'PreDict Carrusel online · hay un lobby abierto ahora' : (nuevas.length ? 'PreDict Carrusel online · hay ' + (nuevas.length === 1 ? 'una partida anunciada' : nuevas.length + ' partidas anunciadas') : 'PreDict Carrusel online');
    /* el cartelito: la próxima partida a la que te has apuntado («Me apunto»), no la «vista» */
    var mias = LISTA.filter(function (p) { return p.yo === 'si'; }).sort(function (x, y) { return new Date(x.programada) - new Date(y.programada); });
    var p = mias[0];
    if (!p) { if (a) a.hidden = true; return; }
    if (!a) {
      a = document.createElement('a'); a.id = 'lm-carr-aviso'; a.href = URL_CARR; a.target = 'lm-carrusel-online';
    }
    if (a.parentNode !== host) host.insertBefore(a, host.firstChild);
    a.hidden = false;
    var t = texto(p);
    if (a.getAttribute('data-t') !== t) { a.setAttribute('data-t', t); a.innerHTML = ESP + '<span>' + t.replace(/[&<>"]/g, '') + '</span>'; }
    a.title = 'PreDict Carrusel online · ' + (p.creador ? 'partida de ' + p.creador : 'tu partida');
    a.classList.toggle('vivo', !!p.lobby_abierto);
  }
  async function refrescar() {
    try {
      if (!cuenta()) { OK = false; pintar(); return; }
      var l = await lista(); OK = (l !== null); if (OK) LISTA = l; pintar();
    } catch (e) { console.warn('[carrusel-aviso]', e); }
  }
  function arrancar() { refrescar(); setInterval(function () { if (!document.hidden) refrescar(); }, 60000); setInterval(function () { try { pintar(); } catch (e) {} }, 5000); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar); else arrancar();
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') refrescar(); });
  var _ss = window.setSession;
  if (typeof _ss === 'function') { window.setSession = function (s) { var r = _ss(s); setTimeout(refrescar, 600); return r; }; }
})();
