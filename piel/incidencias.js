/* ============================================================================================================
   INCIDENCIAS (12-nov-2026, Iago) · botón «?» en la barra de iconos del portal (GE y GP), a la izquierda de
   «Mis resultados». El alumno elige en 2-3 pasos de qué va (una app que no funciona, no entiende una app, una
   nota de Mis resultados, Mi actitud u otra cosa) y lo cuenta en pocas palabras. Le llega a Iago a la campana
   del Diario; él contesta una vez y la respuesta le llega al alumno a su campana. No es un chat: faltas,
   justificantes, tutorías y cosas de clase van por CentrosNET.
   · No sale en las cuentas Tester / Protester (Iago no lo usa).
   · Como mucho una incidencia abierta por alumno.
   · SQL: suite_incidencia_alumno_enviar / _estado (alumno) · suite_incidencias_alumno_listar / _responder (Diario).
   Tamaño: copia el de la campana. Quitarlo: borrar la línea <script … incidencias.js> de index.html (GE y GP).
   ============================================================================================================ */
(function () {
  'use strict';
  if (window.__lmIncid) return; window.__lmIncid = 1;
  var SBU = 'https://woiptkyrxkbpnvioypit.supabase.co';
  var SBK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvaXB0a3lyeGticG52aW95cGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NzI2ODYsImV4cCI6MjA5MjA0ODY4Nn0.B2nKgj5rD0rkdLeMIrd9KgD8lUPWsBT4Y7aCtmnvbjA';
  var GP = /(^|\.)gp\.lmathome\.es$/i.test(location.hostname) || /lmpro/i.test(location.pathname);
  var KEY = GP ? 'lmpro_session' : 'lmeav_session';

  function ses() { try { return JSON.parse(localStorage.getItem(KEY) || 'null') || window.__LM_SES || null; } catch (e) { return window.__LM_SES || null; } }
  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function cuenta() { var s = ses(); return (s && s.id && s.estado === 'validado') ? s : null; }
  function esTester() { var s = ses(); return !!(s && /tester/.test(norm(s.nombre))); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  async function rpc(fn, args) {
    try {
      var r = await fetch(SBU + '/rest/v1/rpc/' + fn, { method: 'POST', headers: { 'apikey': SBK, 'Authorization': 'Bearer ' + SBK, 'Content-Type': 'application/json' }, body: JSON.stringify(args || {}) });
      if (!r.ok) return { ok: false, error: 'http_' + r.status };
      return await r.json();
    } catch (e) { return { ok: false, error: 'red' }; }
  }

  /* ---- qué se puede elegir ---- */
  var TEMAS = [
    ['falla', 'Una app o un portal no me funciona bien', 'no carga, no guarda, se queda parado…'],
    ['no_entiendo', 'No entiendo cómo funciona una app o un portal', ''],
    ['resultados', 'Una nota de «Mis resultados»', 'no sé de dónde sale o creo que está mal'],
    ['actitud', 'Algo de «Mi actitud»', ''],
    ['otra', 'Otra cosa', 'escribir directamente']
  ];
  /* (12-nov-2026, Iago) «Todos con at home: RITMO ENTONADO en mayúsculas y en su color, el contorno en su color y el at home en gris» */
  var VERDE = '#22c55e', AZUL = '#3b82f6', NARANJA = '#f97316', ROSA = '#ec4899', GRIS = '#cbd5e1';
  var APPS = GP
    ? [['RITMO ENTONADO', VERDE, 1], ['ENTONACIÓN', AZUL, 1], ['INTERVALIA', AZUL, 1], ['DICTADO', NARANJA, 1], ['PREDICT', NARANJA, 1], ['TEORÍA', ROSA, 1], ['FICHA DE TEORÍA', ROSA, 0], ['PORTALES TEMÁTICOS', GRIS, 0, 'Fonógrafo, Acústica, Atonalidad, Magnetófono…']]
    : [['RITMO', VERDE, 1], ['ENTONACIÓN', AZUL, 1], ['INTERVALIA', AZUL, 1], ['DICTADO', NARANJA, 1], ['PREDICT', NARANJA, 1], ['TEORÍA', ROSA, 1], ['FICHA DE TEORÍA', ROSA, 0], ['QUIZ DE RITMO', VERDE, 0]];
  function nomOp(o) { return Array.isArray(o) ? o[0].charAt(0) + o[0].slice(1).toLowerCase() + (o[2] ? ' at home' : '') : o; }
  var PASO2 = {
    falla: { t: '¿Cuál?', ops: APPS },
    no_entiendo: { t: '¿Cuál?', ops: APPS },
    resultados: { t: '¿De qué apartado?', ops: [['RITMO', VERDE, 0], ['ENTONACIÓN', AZUL, 0], ['DICTADO', NARANJA, 0], ['TEORÍA', ROSA, 0], 'Nota del trimestre'] },
    actitud: { t: '¿Qué pasa?', ops: ['No estoy de acuerdo con algo', 'No entiendo cómo se calcula'] }
  };
  var DETALLE_RES = ['No sé de dónde sale', 'Creo que está mal'];
  var ICO = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.1-2.4 3.6"/><path d="M12 17h.01"/></svg>';

  function css() {
    if (document.getElementById('lm-incid-css')) return;
    var st = document.createElement('style'); st.id = 'lm-incid-css';
    st.textContent =
      '#lm-incid-btn{order:-2;position:relative;width:var(--lm-ctl,34px);height:var(--lm-ctl,34px);min-width:var(--lm-ctl,34px);padding:0;margin:0;border:0;border-radius:10px;background:var(--lm-neutro,#243044);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;align-self:center;flex:0 0 auto}' +
      '@media (hover:hover){#lm-incid-btn:hover{background:var(--lm-neutro-h,#2d3b52)}}#lm-incid-btn[hidden]{display:none!important}' +
      '#lm-incid{position:fixed;inset:0;z-index:2147481000;background:rgba(3,6,12,.62);display:flex;align-items:center;justify-content:center;padding:16px;font-family:inherit}' +
      '#lm-incid[hidden]{display:none}' +
      '#lm-incid .li-c{position:relative;width:min(470px,100%);max-height:92vh;overflow:auto;background:rgba(12,16,26,.97);border:2px solid #cbd5e1;border-radius:16px;padding:18px 18px 16px;color:#f1f5f9;box-sizing:border-box}' +
      '#lm-incid .li-x{position:absolute;top:10px;right:10px;width:32px;height:32px;border-radius:9px;border:1.5px solid rgba(255,255,255,.3);background:transparent;color:#fff;font-size:15px;cursor:pointer}' +
      '#lm-incid .li-paso{font:800 11px/1 system-ui,sans-serif;letter-spacing:.1em;color:#94a3b8;margin:0 0 8px}' +
      '#lm-incid h3{margin:0 40px 12px 0;font-size:19px;line-height:1.25;font-weight:900;color:#fff}' +
      '#lm-incid .li-op{display:block;width:100%;text-align:left;border:1.5px solid rgba(255,255,255,.22);border-radius:10px;padding:10px 12px;margin:0 0 7px;background:transparent;color:#f1f5f9;font-family:inherit;font-size:14px;font-weight:500;line-height:1.3;cursor:pointer}' +
      '#lm-incid .li-op small{display:block;color:#94a3b8;font-size:12px;margin-top:2px}' +
      '@media (hover:hover){#lm-incid .li-op:hover{border-color:#e2e8f0;background:rgba(226,232,240,.1)}}' +   /* (12-nov-2026, Iago) en pantallas táctiles el «hover» se quedaba pegado en la tarjeta del paso siguiente */
      '#lm-incid .li-op:focus{outline:none}' +
      '#lm-incid .li-op.li-otra{border-style:dashed;color:#cbd5e1}' +
      '#lm-incid .li-op.li-app{border-color:var(--oc)}#lm-incid .li-app b{color:var(--oc);font-weight:900;letter-spacing:.03em}#lm-incid .li-app span{color:#94a3b8;font-style:italic}' +
      '@media (hover:hover){#lm-incid .li-op.li-app:hover{border-color:var(--oc);background:rgba(255,255,255,.07)}}' +
      '#lm-incid .li-nota{font-size:12.5px;line-height:1.45;color:#cbd5e1;background:rgba(255,255,255,.05);border-radius:9px;padding:8px 10px;margin-top:10px}#lm-incid .li-nota b{color:#fff}' +
      '#lm-incid .li-ficha{border:1px solid rgba(236,72,153,.6);background:rgba(236,72,153,.1);margin:0 0 10px}' +
      '#lm-incid .li-mig{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 10px}#lm-incid .li-mig i{font-style:normal;font-size:12px;padding:4px 8px;border-radius:7px;background:rgba(226,232,240,.15);border:1px solid rgba(226,232,240,.5)}' +
      '#lm-incid .li-chips{display:flex;gap:7px;flex-wrap:wrap;margin:0 0 10px}#lm-incid .li-chip{border:1.5px solid rgba(255,255,255,.25);border-radius:8px;padding:6px 10px;background:transparent;color:#f1f5f9;font-family:inherit;font-size:13px;font-weight:600;line-height:1;cursor:pointer}#lm-incid .li-chip.on{border-color:#e2e8f0;background:rgba(226,232,240,.18)}' +
      '#lm-incid textarea{width:100%;box-sizing:border-box;min-height:104px;resize:vertical;border:1px solid rgba(255,255,255,.28);border-radius:10px;padding:10px;background:rgba(255,255,255,.04);color:#fff;font-family:inherit;font-size:14px;line-height:1.45}' +
      '#lm-incid .li-pie{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px}' +
      '#lm-incid .li-atras{background:transparent;border:0;color:#94a3b8;font-family:inherit;font-size:13px;font-weight:600;line-height:1;cursor:pointer;padding:6px 0}' +
      '#lm-incid .li-env{background:#e2e8f0;color:#111;border:0;border-radius:10px;padding:11px 16px;font-family:inherit;font-size:14px;font-weight:800;line-height:1;cursor:pointer}#lm-incid .li-env:disabled{opacity:.5;cursor:default}' +
      '#lm-incid .li-err{color:#fca5a5;font-size:12.5px;margin-top:8px}' +
      '#lm-incid .li-ok{text-align:center;padding:14px 4px 4px}#lm-incid .li-ok .c{width:52px;height:52px;border-radius:50%;border:2px solid #22c55e;margin:0 auto 12px;display:grid;place-items:center;color:#22c55e;font-size:26px}' +
      '#lm-incid .li-ok p{color:#cbd5e1;font-size:14px;line-height:1.45;margin:0 0 14px}';
    document.head.appendChild(st);
  }

  /* ---- el botón ---- */
  function boton() {
    var mr = document.getElementById('btn-mis-resultados');
    var b = document.getElementById('lm-incid-btn');
    var ver = !!(cuenta() && !esTester() && mr && mr.parentNode);
    if (!ver) { if (b) b.hidden = true; return; }
    css();
    if (!b) {
      b = document.createElement('button'); b.type = 'button'; b.id = 'lm-incid-btn';
      b.title = 'Incidencias'; b.setAttribute('aria-label', 'Incidencias'); b.innerHTML = ICO;
      b.addEventListener('click', abrir);
    }
    if (b.parentNode !== mr.parentNode || b.nextSibling !== mr) mr.parentNode.insertBefore(b, mr);
    b.hidden = mr.classList.contains('lm-oculto') || mr.style.display === 'none';
    /* (12-nov-2026, Iago: «del mismo tamaño que Mis resultados y la campana») copia el tamaño real de la campana (o de Mis resultados) */
    var ref = document.getElementById('alu-campana-btn'); if (!ref || !ref.offsetHeight) ref = mr;
    if (ref && ref.offsetHeight) { var h = ref.offsetHeight, w = ref.offsetWidth, cs = getComputedStyle(ref);
      var lado = (mr.classList.contains('lm-mr-cuadro') || Math.abs(w - h) < 6) ? Math.max(w, h) : h;
      if (b.style.width !== lado + 'px') { b.style.width = b.style.minWidth = b.style.height = lado + 'px'; }
      if (cs.borderRadius && b.style.borderRadius !== cs.borderRadius) b.style.borderRadius = cs.borderRadius; }
  }

  /* ---- la ventana ---- */
  var E = {};
  function caja() {
    var m = document.getElementById('lm-incid');
    if (!m) {
      m = document.createElement('div'); m.id = 'lm-incid'; m.hidden = true;
      m.innerHTML = '<div class="li-c" role="dialog" aria-modal="true" aria-label="Incidencias"><button class="li-x" aria-label="Cerrar">✕</button><div class="li-in"></div></div>';
      document.body.appendChild(m);
      m.addEventListener('click', function (e) { if (e.target === m) cerrar(); });
      m.querySelector('.li-x').addEventListener('click', cerrar);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !m.hidden) cerrar(); });
    }
    return m;
  }
  function cerrar() { var m = document.getElementById('lm-incid'); if (m) m.hidden = true; }
  function pinta(html) { var m = caja(); try { if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); } catch (e) {}
    m.querySelector('.li-in').innerHTML = html; m.hidden = false; return m.querySelector('.li-in'); }
  var NOTA_CNET = '<div class="li-nota">✉️ <b>Faltas, justificantes, tutorías y cosas de clase</b> → por <b>CentrosNET</b>. Esto es solo para el portal.</div>';

  async function abrir() {
    var s = cuenta(); if (!s) return;
    E = {};
    pinta('<div class="li-paso">INCIDENCIAS</div><h3>Un momento…</h3>');
    var st = await rpc('suite_incidencia_alumno_estado', { p_cuenta_id: s.id });
    if (st && st.ok && st.abierta) { yaAbierta(st.abierta); return; }
    paso1();
  }
  function fecha(iso) { try { var d = new Date(iso); return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }); } catch (e) { return ''; } }
  function nomTema(t) { for (var i = 0; i < TEMAS.length; i++) if (TEMAS[i][0] === t) return TEMAS[i][1]; return ''; }
  function yaAbierta(a) {
    var el = pinta('<div class="li-paso">INCIDENCIAS</div><h3>Ya tienes una incidencia enviada</h3>' +
      '<div class="li-nota">La enviaste el <b>' + esc(fecha(a.creada_en)) + '</b>' + (a.objeto ? ' · ' + esc(a.objeto) : '') + '. Iago te contestará en la campana 🔔; cuando lo haga, podrás enviar otra.</div>' +
      '<div class="li-pie"><span></span><button class="li-env">Cerrar</button></div>');
    el.querySelector('.li-env').addEventListener('click', cerrar);
  }
  function paso1() {
    var el = pinta('<div class="li-paso">PASO 1 DE 3</div><h3>Incidencias · ¿Sobre qué es?</h3>' +
      TEMAS.map(function (t) { return '<button class="li-op' + (t[0] === 'otra' ? ' li-otra' : '') + '" data-t="' + t[0] + '">' + esc(t[1]) + (t[2] ? '<small>' + esc(t[2]) + '</small>' : '') + '</button>'; }).join('') + NOTA_CNET);
    el.querySelectorAll('[data-t]').forEach(function (b) { b.addEventListener('click', function () {
      E = { tema: b.getAttribute('data-t') };
      if (E.tema === 'otra') paso3(); else paso2();
    }); });
  }
  function paso2() {
    var p = PASO2[E.tema];
    var el = pinta('<div class="li-paso">PASO 2 DE 3</div><h3>' + esc(p.t) + '</h3>' +
      p.ops.map(function (o) { return Array.isArray(o)
        ? '<button class="li-op li-app" style="--oc:' + o[1] + '" data-o="' + esc(nomOp(o)) + '"><b>' + esc(o[0]) + '</b>' + (o[2] ? ' <span>at home</span>' : '') + (o[3] ? '<small>' + esc(o[3]) + '</small>' : '') + '</button>'
        : '<button class="li-op" data-o="' + esc(o) + '">' + esc(o) + '</button>'; }).join('') +
      '<button class="li-op li-otra" data-o="">Otra → escribir directamente</button>' +
      '<div class="li-pie"><button class="li-atras">← Atrás</button><span></span></div>');
    el.querySelectorAll('[data-o]').forEach(function (b) { b.addEventListener('click', function () { E.objeto = b.getAttribute('data-o') || 'Otra'; paso3(); }); });
    el.querySelector('.li-atras').addEventListener('click', paso1);
  }
  function paso3() {
    var esFicha = /^Ficha de teoría$/i.test(E.objeto || '');
    var mig = [nomTema(E.tema).replace(/^Una app o un portal no me funciona bien$/, 'No funciona bien').replace(/^No entiendo cómo funciona una app o un portal$/, 'No entiendo cómo funciona')];
    if (E.objeto) mig.push(E.objeto);
    var chips = E.tema === 'resultados' ? '<div class="li-chips">' + DETALLE_RES.map(function (d) { return '<button class="li-chip" data-d="' + esc(d) + '">' + esc(d) + '</button>'; }).join('') + '</div>' : '';
    var ej = esFicha ? 'Ej.: «Ficha 6, el ejercicio de los acordes: puse lo mismo que la solución»'
      : E.tema === 'resultados' ? 'Ej.: «En dictado me sale un 4 en la semana 45 y yo creía que tenía un 6»'
      : E.tema === 'actitud' ? 'Ej.: «Me sale un portal sin ver y sí lo vi»'
      : E.tema === 'otra' ? 'Cuéntalo aquí'
      : 'Ej.: «En la lección 4 le doy a grabar y no me detecta la voz»';
    var el = pinta('<div class="li-paso">' + (E.tema === 'otra' ? 'PASO 2 DE 2' : 'PASO 3 DE 3') + '</div><h3>¿Qué ha pasado?</h3>' +
      (esFicha ? '<div class="li-nota li-ficha">👀 <b>Ojo:</b> al final de cada ficha corregida tienes el botón <b>«¿Crees que algún ejercicio está mal corregido?»</b>. Es la mejor forma: Iago ve exactamente ese ejercicio.<br><br>De todas formas, si prefieres, escribe aquí <b>lo que recuerdes</b> (qué ficha, qué ejercicio) e Iago lo investiga.</div>' : '') +
      '<div class="li-mig">' + mig.map(function (m) { return '<i>' + esc(m) + '</i>'; }).join('') + '</div>' + chips +
      '<textarea maxlength="1500" placeholder="' + esc(ej) + '"></textarea>' +
      '<div class="li-err" hidden></div>' +
      '<div class="li-pie"><button class="li-atras">← Atrás</button><button class="li-env">Enviar a Iago</button></div>' + (E.tema === 'otra' ? NOTA_CNET : ''));
    el.querySelectorAll('[data-d]').forEach(function (b) { b.addEventListener('click', function () {
      el.querySelectorAll('[data-d]').forEach(function (x) { x.classList.toggle('on', x === b); }); E.detalle = b.getAttribute('data-d'); }); });
    el.querySelector('.li-atras').addEventListener('click', function () { E.detalle = null; if (E.tema === 'otra') paso1(); else paso2(); });
    var ta = el.querySelector('textarea'); setTimeout(function () { try { ta.focus(); } catch (e) {} }, 50);
    el.querySelector('.li-env').addEventListener('click', function () { enviar(el, ta); });
  }
  async function enviar(el, ta) {
    var s = cuenta(), err = el.querySelector('.li-err'), b = el.querySelector('.li-env');
    var txt = (ta.value || '').trim();
    if (txt.length < 3) { err.hidden = false; err.textContent = 'Escribe un poco qué pasa.'; return; }
    b.disabled = true; b.textContent = 'Enviando…'; err.hidden = true;
    var ctx = { url: location.href.split('#')[0], ua: navigator.userAgent, pantalla: screen.width + '×' + screen.height, ventana: innerWidth + '×' + innerHeight, hora: new Date().toISOString(), portal: GP ? 'gp' : 'ge' };
    var r = await rpc('suite_incidencia_alumno_enviar', { p_cuenta_id: s.id, p_tema: E.tema, p_objeto: E.objeto || null, p_detalle: E.detalle || null, p_texto: txt, p_contexto: ctx });
    if (r && r.ok) {
      var ok = pinta('<div class="li-ok"><div class="c">✓</div><h3 style="margin:0 0 8px">Enviado a Iago</h3><p>Lo atenderá lo antes posible. Te llegará la respuesta a la campana 🔔.</p><button class="li-env">Cerrar</button></div>');
      ok.querySelector('.li-env').addEventListener('click', cerrar);
      return;
    }
    if (r && r.error === 'ya_abierta') { var st = await rpc('suite_incidencia_alumno_estado', { p_cuenta_id: s.id }); if (st && st.abierta) { yaAbierta(st.abierta); return; } }
    b.disabled = false; b.textContent = 'Enviar a Iago'; err.hidden = false;
    err.textContent = 'No se ha podido enviar. Revisa la conexión y vuelve a intentarlo.';
  }

  /* ---- arranque: el botón aparece cuando aparece «Mis resultados» (cuenta validada) ---- */
  function tick() { try { boton(); } catch (e) {} }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tick); else tick();
  setInterval(tick, 1500);
  window.LMIncidencias = { abrir: abrir };
})();
