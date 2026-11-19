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
  var ICO = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="lp-l" d="M2 12h4l2.5-6 4 13 3-9 1.5 2H22"/></svg>';
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
  var MODO_SELLO = window.__lmPulsoSello || 'A';   /* (19-nov 10:53, Iago) opción A: sello entero, pequeño */
  var D = null, abierto = false, cargando = false, ajustes = false;

  function ses() { try { return JSON.parse(localStorage.getItem(KEY) || 'null') || window.__LM_SES || null; } catch (e) { return window.__LM_SES || null; } }
  function cuenta() { var s = ses(); return (s && s.id && s.estado === 'validado') ? s : null; }
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
      '#lm-pulso-btn .lp-l{animation:lpLat 2.6s ease-in-out infinite}' +
      '#lm-pulso-btn.nuevo .lp-l{stroke:' + AC + '}' +
      '@keyframes lpLat{0%,100%{opacity:.55;filter:none}8%{opacity:1;filter:drop-shadow(0 0 3px ' + AC + ')}16%{opacity:.6;filter:none}24%{opacity:1;filter:drop-shadow(0 0 4px ' + AC + ')}34%{opacity:.55;filter:none}}' +
      '@media (prefers-reduced-motion:reduce){#lm-pulso-btn .lp-l{animation:none;opacity:.9}}' +
      '#lm-pulso-btn .lp-n{position:absolute;top:-6px;right:-6px;min-width:17px;height:17px;padding:0 4px;box-sizing:border-box;border-radius:5px;background:' + AC + ';color:#0b1020;font:800 10.5px/17px system-ui,sans-serif;text-align:center}' +
      '#lm-pulso{position:fixed;z-index:2147480000;width:min(360px,calc(100vw - 24px));max-height:min(72vh,620px);display:flex;flex-direction:column;background:#0a0e1c;border:1.5px solid rgba(255,255,255,.22);border-radius:14px;box-shadow:0 18px 50px rgba(0,0,0,.55);color:#e6ebff;font-family:inherit;font-size:13px;box-sizing:border-box}' +
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
      '#lm-pulso .lp-e{grid-template-columns:32px 1fr auto}' +
      '#lm-pulso .lp-val{display:flex;align-items:center;gap:8px;padding-left:10px;border-left:1px solid rgba(255,255,255,.1)}' +
      '#lm-pulso .lp-num{display:flex;flex-direction:column;align-items:flex-end;line-height:1.15}' +
      '#lm-pulso .lp-num b{font-size:16px;font-weight:800;color:#4ade80;font-variant-numeric:tabular-nums}' +
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
      '#lm-pulso .lp-vacio{padding:18px 6px;text-align:center;color:#94a3b8;font-size:12.5px;line-height:1.45}' +
      '#lm-pulso .lp-pie{padding:8px 14px 12px;font-size:11px;color:#7480a8;line-height:1.4;border-top:1px solid rgba(255,255,255,.07)}';
    document.head.appendChild(st);
  }

  /* ---- el botón ---- */
  function boton() {
    var mr = document.getElementById('btn-mis-resultados');
    var b = document.getElementById('lm-pulso-btn');
    var ver = !!(cuenta() && mr && mr.parentNode);
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
    var n = abierto ? 0 : nuevos(), el = b.querySelector('.lp-n');
    b.classList.toggle('nuevo', n > 0);
    if (n > 0) { if (!el) { el = document.createElement('span'); el.className = 'lp-n'; b.appendChild(el); } el.textContent = n > 9 ? '9+' : String(n); }
    else if (el) el.remove();
    b.title = n > 0 ? 'Pulso · ' + n + (n === 1 ? ' novedad' : ' novedades') : 'Pulso';
  }

  /* ---- datos ---- */
  function cargar() {
    var s = cuenta(); if (!s || cargando) return Promise.resolve();
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
                             min: 0, pts: 0, verificado: true, nuevo: false, likes: 0, megusta: false, sids: [] }; out.push(m[k]); }
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
      document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && abierto) cerrar(); });
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
    var h = '<div class="lp-h"><div><div class="lp-t">Pulso' + (D && D.grupo ? ' · <b>' + esc(D.grupo) + '</b>' : '') + '</div>' +
      '<div class="lp-s">Lo que tu grupo trabaja por libre, al momento</div></div>' +
      '<div class="lp-bts"><button type="button" class="lp-cfg" title="Ajustes del Pulso" aria-label="Ajustes">' + GEAR + '</button>' +
      '<button type="button" class="lp-x" title="Cerrar" aria-label="Cerrar">✕</button></div></div>';
    if (ajustes) {
      var oc = D && D.oculto;
      h += '<div class="lp-aj">' + (oc ? 'Ahora <b>no sales</b> en el Pulso de tu grupo. Tu trabajo por libre cuenta igual en tu actitud.'
                                      : 'Si prefieres, puedes <b>no salir</b> en el Pulso de tu grupo. Tu trabajo por libre cuenta igual en tu actitud.') +
           '<br><button type="button" class="lp-oc">' + (oc ? 'Volver a salir en el Pulso' : 'No salir en el Pulso') + '</button></div>';
    }
    if (!g) h += '<div class="lp-list"><div class="lp-vacio">Cargando…</div></div>';
    else if (!g.length) h += '<div class="lp-list"><div class="lp-vacio">Esta semana todavía no hay actividad por libre en tu grupo.<br>¿Empiezas tú? Lo que hagas por tu cuenta aparecerá aquí.</div></div>';
    else h += '<div class="lp-list">' + g.slice(0, 25).map(fila).join('') + '</div>';
    h += '<div class="lp-pie">Con sello: ya lo ha verificado Iago y ha sumado. Sin sello: pendiente de verificar.</div>';
    m.innerHTML = h;
    m.querySelector('.lp-x').addEventListener('click', cerrar);
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
              '<span>' + e.min + ' min ' + (e.verificado ? 'validados' : '· pendiente') + '</span></div>' +
              (e.verificado && MODO_SELLO === 'A' ? selloGrande(c) : '') + '</div>' + (e.verificado && MODO_SELLO !== 'A' ? selloGrande(c) : '');
    return '<div class="lp-e' + (e.yo ? ' lp-yo' : '') + (e.nuevo && !e.yo ? ' nuevo' : '') + '"><div class="lp-a" style="background:' + c + '">' + esc(e.ini || '·') + '</div>' +
      '<div style="min-width:0"><div class="lp-nm">' + esc(e.nombre) + '</div>' +
      '<div class="lp-d">' + mx + esc(app) + '</div><div class="lp-d" style="color:#7480a8;font-size:11px">' + hace(e.fin) + '</div></div>' + val + '</div>';
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
