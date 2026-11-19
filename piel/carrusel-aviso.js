/* ============================================================================================================
   PREDICT CARRUSEL ONLINE · botón de entrada + cartelito fijo en el portal GE (19-nov-2026, C1 · Carrusel online)
   · Botón con caracol naranja sobre fondo azul psicodélico (la textura del PreDict Carrusel): abre el lobby del
     carrusel online (https://predict.ge.lmathome.es/carrusel-online/). Un puntito avisa: verde parpadeando si hay un
     lobby abierto ahora; naranja si hay partidas anunciadas que aún no has visto.
   · Al pulsar el botón se abre un panel con las partidas activas (abiertas y anunciadas), con «Me apunto» / «Marcar como
     visto» (con aviso: si luego no asistes, −0,1 de actitud; se evita quitándote hasta 5 min antes) y «Anunciar carrusel»
     (con aviso: anfitrión que no asiste, −0,25; se evita cancelando hasta 5 min antes). «Jugar ahora» abre el lobby.
   · Cartelito a la izquierda de «?» (Incidencias): una franja con la partida más próxima a la que te has apuntado; si hay más,
     una flechita despliega las demás hacia abajo. («Tienes un carrusel mañana a las 17:00», «… en 3 h», «… en 25 min»).
     No es una notificación. «Marcar como visto» no lo muestra.
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
  function confirmados(p) { var n = Math.max(0, (p.apuntados || 0) - 1); return n === 0 ? 'sin confirmados' : n + (n === 1 ? ' confirmado' : ' confirmados'); }
  function texto(p) {
    if (p.soy_creador) {
      if (p.lobby_abierto) return '¡Tu carrusel está abierto! · ' + confirmados(p);
      return 'Tu carrusel ' + cuando(p.programada) + ' · ' + confirmados(p);
    }
    if (p.lobby_abierto) return '¡Carrusel abierto! Entra';
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
  function css() {
    if (document.getElementById('lm-carr-css')) return;
    var st = document.createElement('style'); st.id = 'lm-carr-css';
    st.textContent =
      '#lm-carr-btn,#lm-carr-aviso{box-sizing:border-box;flex:0 0 auto;align-self:center;position:relative;margin:0;font-family:inherit}' +
      /* el botón: la misma textura multicolor de las franjas; quieto si no hay nada que mirar, en movimiento si lo hay */
      '#lm-carr-btn{order:-5;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;border:0;padding:0;width:var(--lm-ctl,34px);height:var(--lm-ctl,34px);min-width:var(--lm-ctl,34px);border-radius:10px;color:#fff;background:#0a071e;box-shadow:inset 0 0 0 1px rgba(255,255,255,.28);transition:filter .15s}' +
      '#lm-carr-btn .cl{position:absolute;inset:0;overflow:hidden;border-radius:10px;pointer-events:none}#lm-carr-btn .fx{position:absolute;inset:-40%;background:' + TEX_MULTI + ';pointer-events:none}' +
      '#lm-carr-btn.mov .fx{animation:lmCarrZoom 3.2s ease-in-out infinite}' +
      '@keyframes lmCarrZoom{0%{transform:scale(.7) rotate(0deg)}50%{transform:scale(1.35) rotate(120deg)}100%{transform:scale(.7) rotate(240deg)}}' +
      '#lm-carr-btn:hover,#lm-carr-btn.abierto{filter:brightness(1.14)}#lm-carr-btn:focus-visible{outline:2px solid #fff;outline-offset:2px}' +
      '#lm-carr-btn svg{position:relative;width:22px;height:22px;display:block;pointer-events:none;stroke-width:2.1;filter:drop-shadow(0 0 2px rgba(10,7,30,.95)) drop-shadow(0 0 5px rgba(10,7,30,.7))}' +
      '#lm-carr-btn.mov svg{animation:lmCarrGira 4s linear infinite}@keyframes lmCarrGira{to{transform:rotate(360deg)}}' +
      '#lm-carr-btn .pto{position:absolute;right:-1px;top:-1px;min-width:15px;height:15px;padding:0 3px;box-sizing:border-box;border-radius:8px;border:2px solid #0f172a;background:#34d399;color:#05261a;font:900 9px/11px system-ui,sans-serif;text-align:center;display:none}' +
      '#lm-carr-btn .pto.on{display:block}' +
      '@media (prefers-reduced-motion:reduce){#lm-carr-btn.mov .fx,#lm-carr-btn.mov svg{animation:none}}' +
      /* el cartelito: una franja por partida; la más próxima a la vista y las demás debajo, tras la flechita */
      '#lm-incid-btn{order:-6!important}' +
      '#lm-carr-aviso{order:-7;z-index:2147480400;display:inline-flex;align-items:center;gap:4px}' +
      '.lm-fr{display:inline-flex;align-items:center;gap:7px;box-sizing:border-box;height:var(--lm-ctl,34px);padding:0 12px 0 9px;border-radius:10px;color:#fff;font:800 13px/1 inherit;font-family:inherit;letter-spacing:.01em;white-space:nowrap;max-width:390px;overflow:hidden;text-decoration:none;cursor:pointer;' +
      'background:' + TEX_MULTI + ';box-shadow:inset 0 0 0 1px rgba(255,255,255,.28);text-shadow:0 1px 6px rgba(0,0,0,.55);border:0}' +
      '.lm-fr.mia{box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.92)}.lm-fr.mia svg{color:#fff}' +
      '.lm-fr:hover{filter:brightness(1.12)}.lm-fr svg{width:17px;height:17px;flex:none;color:#fff}' +
      '.lm-fr.vivo{animation:lmCarrA 1.4s ease-in-out infinite}@keyframes lmCarrA{50%{filter:brightness(1.35)}}' +
      '#lm-carr-aviso .mas{display:inline-flex;align-items:center;gap:3px;height:var(--lm-ctl,34px);padding:0 8px;border:0;border-radius:10px;cursor:pointer;color:#fff;font:800 12px/1 inherit;font-family:inherit;background:rgba(10,7,30,.72);box-shadow:inset 0 0 0 1px rgba(255,255,255,.28)}' +
      '#lm-carr-aviso .mas svg{width:12px;height:12px;transition:transform .15s}#lm-carr-aviso .mas.abierto svg{transform:rotate(180deg)}' +
      '#lm-carr-aviso .resto{position:absolute;left:0;top:calc(100% + 5px);display:flex;flex-direction:column;gap:5px;z-index:2147480400}' +
      '#lm-carr-aviso .resto[hidden]{display:none}' +
      '#lm-carr-btn[hidden],#lm-carr-aviso[hidden]{display:none!important}' +
      /* el panel de partidas: la piel del portal (cristal oscuro traslúcido, borde claro, botones como Incidencias) */
      '#lm-carr-pan{position:fixed;z-index:2147480500;width:min(400px,calc(100vw - 24px));max-height:calc(100vh - 90px);overflow:auto;border-radius:16px;color:#f1f5f9;font-family:inherit;font-size:14px;line-height:1.35;box-sizing:border-box;' +
      'background:rgba(12,16,26,.88);border:1.5px solid rgba(255,255,255,.22);box-shadow:0 18px 50px rgba(0,0,0,.5);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}' +
      '#lm-carr-pan[hidden]{display:none}' +
      '#lm-carr-pan .cab{display:flex;align-items:center;gap:10px;padding:12px 14px 10px}' +
      '#lm-carr-pan .cab .ic{position:relative;flex:none;width:30px;height:30px;border-radius:9px;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.28)}' +
      '#lm-carr-pan .cab .ic .fx{position:absolute;inset:0;background:' + TEX_MULTI + '}#lm-carr-pan .cab .ic svg{position:relative;width:72%;height:72%;stroke-width:2.1;filter:drop-shadow(0 0 2px rgba(10,7,30,.95))}' +
      '#lm-carr-pan .cab b{font-size:16px;font-weight:900;color:#fff}' +
      '#lm-carr-pan .cab .x{margin-left:auto;width:30px;height:30px;border-radius:9px;border:1.5px solid rgba(255,255,255,.3);background:transparent;color:#fff;font-size:14px;cursor:pointer}' +
      '#lm-carr-pan .cu{padding:0 14px 14px}#lm-carr-pan h4{margin:8px 0 4px;font:800 11px/1 inherit;font-family:inherit;letter-spacing:.1em;text-transform:uppercase;color:#94a3b8}' +
      '#lm-carr-pan .pt{padding:10px 0;border-top:1px solid rgba(255,255,255,.12)}#lm-carr-pan h4 + .pt{border-top:0}' +
      '#lm-carr-pan .q{font-weight:800;font-size:15px;color:#fff}#lm-carr-pan .c{color:#94a3b8;font-size:12.5px}' +
      '#lm-carr-pan .bs{display:flex;gap:6px;flex-wrap:wrap;margin-top:7px;align-items:center}' +
      '#lm-carr-pan .bt{font:700 13px/1 inherit;font-family:inherit;color:#f1f5f9;background:transparent;border:1.5px solid rgba(255,255,255,.28);border-radius:10px;padding:9px 13px;cursor:pointer;text-decoration:none;display:inline-block}' +
      '#lm-carr-pan .bt.ico{width:34px;padding:9px 0;text-align:center}' +
      '@media (hover:hover){#lm-carr-pan .bt:hover{border-color:#e2e8f0;background:rgba(226,232,240,.1)}}#lm-carr-pan .bt.pri{background:#e2e8f0;border-color:#e2e8f0;color:#111;font-weight:800}' +
      '#lm-carr-pan .bt.sel{border-color:#34d399;background:rgba(52,211,153,.18);color:#fff}#lm-carr-pan .bt.pri.sel{background:#34d399;border-color:#34d399;color:#06281c}' +
      '#lm-carr-pan .bt:disabled{opacity:.5;cursor:default}' +
      '#lm-carr-pan svg.sv{width:16px;height:16px;vertical-align:-3px;margin-right:6px}#lm-carr-pan .bt.ico svg.sv,#lm-carr-pan .cab .x svg.sv{margin:0;width:15px;height:15px;vertical-align:-2px}' +
      '#lm-carr-pan .cab .x{padding:0}' +
      '#lm-carr-pan .sq{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:7px;vertical-align:0}#lm-carr-pan .sq.v{background:#34d399}#lm-carr-pan .sq.a{background:#f59e0b}' +
      '#lm-carr-pan .cor svg{width:16px;height:16px;vertical-align:-2px;margin-right:6px}' +
      '#lm-carr-pan .vacio{color:#94a3b8;padding:6px 0 10px}' +
      '#lm-carr-pan input{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.28);border-radius:10px;color:#fff;padding:8px 10px;font:inherit;color-scheme:dark;max-width:100%}' +
      '#lm-carr-pan .conf{position:sticky;bottom:0;margin:10px 0 0;padding:12px;border-radius:12px;background:rgba(18,24,38,.98);border:1.5px solid #e2e8f0}' +
      '#lm-carr-pan .conf b{display:block;margin-bottom:4px;font-size:15px;color:#fff}' +
      '#lm-carr-pan .msg{margin:8px 0 0;color:#facc15;font-size:13px}' +
      '@media (max-width:900px){#lm-carr-btn,#lm-carr-aviso,#lm-carr-pan{display:none!important}}';
    document.head.appendChild(st);
  }
  var ESP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 11a2 2 0 0 1 4 0a4 4 0 0 1-8 0a6 6 0 0 1 12 0a8 8 0 0 1-16 0"/></svg>';
  function SVI(d) { return '<svg class="sv" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; }
  var I_PLAY = SVI('<path d="M8 5.5v13l10-6.5z"/>'), I_CAL = SVI('<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>'), I_OK = SVI('<path d="M5 12.5l4.5 4.5L19 7.5"/>'), I_X = SVI('<path d="M6 6l12 12M18 6L6 18"/>');
  var CORONA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8l4 4 4-7 4 7 4-4-2 11H6z"/></svg>';
  var FLE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

  /* ---- cartelito ---- */
  function franja(p) {
    var f = document.createElement('button'); f.type = 'button';
    f.className = 'lm-fr' + (p.lobby_abierto ? ' vivo' : '') + (p.soy_creador ? ' mia' : '');
    f.title = p.soy_creador ? 'Eres el anfitrión de este carrusel' : 'PreDict Carrusel online · partida de ' + (p.creador || '');
    f.innerHTML = (p.soy_creador ? CORONA : ESP) + '<span>' + esc(texto(p)) + '</span>';
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
    var clave = mias.map(function (p) { return p.id + '|' + texto(p); }).join(';');
    if (a.getAttribute('data-k') === clave) return; a.setAttribute('data-k', clave);
    var abierto = !!(a.querySelector('.mas.abierto'));
    a.innerHTML = ''; a.appendChild(franja(mias[0]));
    if (mias.length > 1) {
      var m = document.createElement('button'); m.type = 'button'; m.className = 'mas' + (abierto ? ' abierto' : ''); m.title = 'Ver las otras partidas';
      m.innerHTML = '+' + (mias.length - 1) + FLE;
      var r = document.createElement('div'); r.className = 'resto'; r.hidden = !abierto;
      mias.slice(1).forEach(function (p) { r.appendChild(franja(p)); });
      m.onclick = function () { var ab = r.hidden; r.hidden = !ab; m.classList.toggle('abierto', ab); };
      a.appendChild(m); a.appendChild(r);
    }
  }

  /* ---- panel de partidas ---- */
  var PAN = null, FORM = false, CONF = null, MSG = '';
  function filaPartida(p) {
    var quien = p.soy_creador ? '<span class="cor">' + CORONA + '</span>Tu partida' : esc(p.creador) + ' <span class="c">(' + esc(grupoTxt(p.grupo)) + ')</span>';
    var cab = p.lobby_abierto ? '<i class="sq v"></i>Abierta ahora' : '<i class="sq a"></i>Anunciada · ' + esc(cuando(p.programada));
    var bs;
    if (p.lobby_abierto) bs = '<button class="bt pri" data-go="' + p.id + '" data-e="' + (p.soy_creador || p.yo_dentro ? '' : '1') + '">Entrar</button>';
    else if (p.soy_creador) bs = p.anfitrion_cancelo ? '<span class="c">La cancelaste</span>' : '<button class="bt" data-cancel="' + p.id + '">' + I_X + 'Cancelar partida</button>';
    else bs = '<button class="bt pri' + (p.yo === 'si' ? ' sel' : '') + '" data-a="si" data-id="' + p.id + '">' + (p.yo === 'si' ? I_OK + 'Me apunto' : 'Me apunto') + '</button>' +
      (p.yo === 'quiza' ? '' : '<button class="bt ico" data-a="' + (p.yo === 'si' ? 'no' : 'quiza') + '" data-id="' + p.id + '" title="' + (p.yo === 'si' ? 'Quitarme de la partida' : 'Marcar como visto') + '">' + I_X + '</button>');
    return '<div class="pt"><div class="q">' + quien + '</div><div class="c">' + cab + ' · ' + (p.soy_creador ? confirmados(p) : p.apuntados + ' apuntado' + (p.apuntados == 1 ? '' : 's')) + '</div><div class="bs">' + bs + '</div></div>';
  }
  function pintaPanel() {
    if (!PAN || PAN.hidden) return;
    var d = new Date(Date.now() + 864e5); d.setHours(17, 0, 0, 0);
    var prev = PAN.querySelector('#lm-carr-hora'), valor = prev ? prev.value : new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
    PAN.innerHTML = '<div class="cab"><span class="ic"><span class="fx"></span>' + ESP + '</span><b>PreDict Carrusel online</b><button class="x" type="button" title="Cerrar">' + I_X + '</button></div><div class="cu">' +
      '<h4>Partidas activas</h4>' + (LISTA.length ? LISTA.map(filaPartida).join('') : '<div class="vacio">Ahora mismo no hay ninguna partida abierta ni anunciada.</div>') +
      '<h4>Organizar</h4><div class="bs" style="margin-top:0"><button class="bt pri" id="lm-carr-anun" type="button">' + I_CAL + 'Anunciar carrusel</button><button class="bt" id="lm-carr-ya" type="button">' + I_PLAY + 'Jugar ahora</button></div>' +
      (FORM ? '<div class="bs"><input type="datetime-local" id="lm-carr-hora" value="' + valor + '"><button class="bt pri" id="lm-carr-ok" type="button">Anunciar</button></div>' : '') +
      (MSG ? '<div class="msg">' + esc(MSG) + '</div>' : '') +
      (CONF ? '<div class="conf"><b>' + esc(CONF.t) + '</b>' + esc(CONF.x) + '<div class="bs"><button class="bt" id="lm-c-no" type="button">' + esc(CONF.no || 'Mejor no') + '</button><button class="bt pri" id="lm-c-si" type="button">' + esc(CONF.si) + '</button></div></div>' : '') +
      '</div>';
    PAN.querySelector('.x').onclick = cerrarPanel;
    PAN.querySelector('#lm-carr-anun').onclick = function () { FORM = !FORM; MSG = ''; pintaPanel(); };
    var ok = PAN.querySelector('#lm-carr-ok');
    if (ok) ok.onclick = function () {
      var v = PAN.querySelector('#lm-carr-hora').value; if (!v) return; var f = new Date(v);
      pedirConf('¿Anunciar esta partida?', 'Serás el anfitrión. Si alguien se apunta y luego no asistes, perderás 0,25 de actitud. Puedes evitarlo cancelando la partida hasta 5 minutos antes de su inicio.', 'Sí, anunciar').then(function (si) {
        if (!si) return;
        rpcA('suite_cr_crear', { p_cuenta: cuenta().id, p_programada: f.toISOString() }).then(function (r) {
          MSG = r && r.ok ? 'Partida anunciada para ' + cuando(f.toISOString()) + '. Te has apuntado automáticamente.' : (r && r.error === 'hora' ? 'La hora debe estar entre 10 minutos y 14 días desde ahora.' : 'No he podido anunciar la partida.');
          FORM = !(r && r.ok); refrescar();
        });
      });
    };
    PAN.querySelectorAll('button[data-cancel]').forEach(function (bt) {
      bt.onclick = async function () {
        var P = LISTA.filter(function (x) { return x.id === bt.dataset.cancel; })[0]; if (!P) return;
        var pen = tarde(P) && (P.apuntados || 0) > 1;
        if (!await pedirConf(pen ? 'Cancelar ahora cuenta como no asistir' : '¿Cancelar tu partida?', pen ? 'Hay gente apuntada y faltan menos de 5 minutos: perderás 0,25 de actitud. ¿Cancelar igualmente?' : (tarde(P)?'No pierdes actitud porque no hay nadie apuntado.':'No pierdes actitud porque faltan más de 5 minutos.'), 'Sí, cancelar', 'No, la mantengo')) return;
        bt.disabled = true; var r = await rpcA('suite_cr_cancelar', { p_cuenta: cuenta().id, p_partida: P.id });
        MSG = r && r.ok ? 'Has cancelado la partida.' : 'No he podido cancelar la partida.'; refrescar();
      };
    });
    PAN.querySelectorAll('button[data-go]').forEach(function (bt) { bt.onclick = function () { abrirCarrusel(bt.dataset.go, bt.dataset.e === '1'); }; });
    var ya = PAN.querySelector('#lm-carr-ya');
    if (ya) ya.onclick = async function () {
      ya.disabled = true; MSG = ''; var w = window.open('about:blank', '_blank');
      var r = await rpcA('suite_cr_crear', { p_cuenta: cuenta().id });
      if (r && r.ok && r.id) { abrirCarrusel(r.id, false, w); MSG = ''; refrescar(); }
      else { if (w) { try { w.close(); } catch (e) {} } MSG = r && r.error === 'ya_tienes_una' ? 'Ya tienes un lobby abierto: pulsa «Gestionar» en tu partida.' : 'No he podido abrir el lobby.'; ya.disabled = false; pintaPanel(); }
    };
    PAN.querySelectorAll('button[data-a]').forEach(function (bt) {
      bt.onclick = async function () {
        var a = bt.dataset.a, id = bt.dataset.id, P = LISTA.filter(function (x) { return x.id === id; })[0];
        if (a === 'si' && P && P.tipo === 'anunciada' && P.yo !== 'si') { if (!await pedirConf('¿Estás seguro?', 'Si luego no asistes, perderás 0,1 de actitud. Puedes evitarlo quitándote de la partida hasta 5 minutos antes de que empiece.', 'Sí, me apunto')) return; }
        if ((a === 'no' || a === 'quiza') && P && P.yo === 'si' && tarde(P)) { if (!await pedirConf('Ya es tarde para quitarte', 'Quitarte ahora cuenta como no asistir: perderás 0,1 de actitud. ¿Quieres quitarte igualmente?', 'Sí, quitarme', 'No, me quedo')) return; }
        bt.disabled = true; MSG = '';
        await rpcA('suite_cr_apuntar', { p_cuenta: cuenta().id, p_partida: id, p_resp: a }); refrescar();
      };
    });
  }
  function abrirCarrusel(id, entrar, w) {
    var u = URL_CARR + '?p=' + encodeURIComponent(id) + (entrar ? '&e=1' : '');
    try { w = w || window.open('about:blank', '_blank'); if (w) w.location.href = u; else location.href = u; } catch (e) { location.href = u; }
  }
  function pedirConf(t, x, si, no) {
    return new Promise(function (res) {
      CONF = { t: t, x: x, si: si, no: no }; pintaPanel();
      var fin = function (v) { CONF = null; pintaPanel(); res(v); };
      PAN.querySelector('#lm-c-si').onclick = function () { fin(true); };
      PAN.querySelector('#lm-c-no').onclick = function () { fin(false); };
    });
  }
  function colocaPanel() {
    var b = document.getElementById('lm-carr-btn'); if (!b || !PAN) return;
    var r = b.getBoundingClientRect(); PAN.style.top = Math.round(r.bottom + 8) + 'px'; PAN.style.right = Math.max(8, Math.round(innerWidth - r.right)) + 'px';
  }
  function abrirPanel() {
    css();
    if (!PAN) { PAN = document.createElement('div'); PAN.id = 'lm-carr-pan'; document.body.appendChild(PAN); }
    PAN.hidden = false; FORM = false; CONF = null; MSG = ''; colocaPanel(); pintaPanel();
    var b = document.getElementById('lm-carr-btn'); if (b) b.classList.add('abierto');
    refrescar();
  }
  function cerrarPanel() { if (PAN) PAN.hidden = true; var b = document.getElementById('lm-carr-btn'); if (b) b.classList.remove('abierto'); }
  document.addEventListener('click', function (e) {
    if (!PAN || PAN.hidden) return;
    if (!e.target.isConnected) return;   /* el panel se repinta al pulsar dentro: no es un clic fuera */
    if (PAN.contains(e.target) || (e.target.closest && e.target.closest('#lm-carr-btn'))) return; cerrarPanel();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarPanel(); });
  window.addEventListener('resize', colocaPanel);

  /* ---- pintar ---- */
  function pintar() {
    var host = document.querySelector('.topbar .topbar-right');
    var b = document.getElementById('lm-carr-btn'), a = document.getElementById('lm-carr-aviso');
    if (!host || !cuenta() || !OK) { if (b) b.hidden = true; if (a) a.hidden = true; cerrarPanel(); return; }
    css();
    if (!b) {
      b = document.createElement('button'); b.type = 'button'; b.id = 'lm-carr-btn';
      b.title = 'PreDict Carrusel online'; b.setAttribute('aria-label', 'PreDict Carrusel online');
      b.innerHTML = '<span class="cl"><span class="fx"></span></span>' + ESP + '<span class="pto"></span>';
      b.addEventListener('click', function () { if (PAN && !PAN.hidden) cerrarPanel(); else abrirPanel(); });
    }
    if (b.parentNode !== host) host.insertBefore(b, host.firstChild);
    b.hidden = false;
    var abiertas = LISTA.filter(function (p) { return p.lobby_abierto; });
    var nuevas = LISTA.filter(function (p) { return !p.lobby_abierto && !p.yo; });
    var pto = b.querySelector('.pto'), n = abiertas.length + nuevas.length;
    pto.className = 'pto' + (n ? ' on' : ''); pto.textContent = n ? String(n) : '';
    b.classList.toggle('mov', n > 0);
    b.title = abiertas.length ? 'PreDict Carrusel online · hay un lobby abierto ahora' : (nuevas.length ? 'PreDict Carrusel online · ' + (nuevas.length === 1 ? 'una partida anunciada' : nuevas.length + ' partidas anunciadas') : 'PreDict Carrusel online');
    /* el cartelito: las partidas a las que te has apuntado («Me apunto»), la más próxima primero; «visto» no cuenta */
    var mias = LISTA.filter(function (p) { return p.yo === 'si' && !(p.soy_creador && p.anfitrion_cancelo); }).sort(function (x, y) { return new Date(x.programada) - new Date(y.programada); });
    pintaAviso(host, mias);
  }
  async function refrescar() {
    try {
      if (!cuenta()) { OK = false; pintar(); return; }
      var l = await lista(); OK = (l !== null); if (OK) LISTA = l; pintar();
      var f = document.activeElement; if (!(PAN && f && PAN.contains(f) && f.tagName === 'INPUT')) pintaPanel();
    } catch (e) { console.warn('[carrusel-aviso]', e); }
  }
  function arrancar() { refrescar(); setInterval(function () { if (!document.hidden) refrescar(); }, 60000); setInterval(function () { try { pintar(); } catch (e) {} }, 5000); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar); else arrancar();
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') refrescar(); });
  var _ss = window.setSession;
  if (typeof _ss === 'function') { window.setSession = function (s) { var r = _ss(s); setTimeout(refrescar, 600); return r; }; }
})();
