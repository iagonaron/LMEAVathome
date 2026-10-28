/* =====================================================================
   LM at home · PIEL · ESCALETA EN LA PANTALLA DEL AULA (15-oct-2026, Iago)
   SOLO con la cuenta Iago González Tester / Protester (la carga lm-piel.js; la base vuelve a comprobarlo).
   La escaleta que se prepara en el Diario (la de la vista iPad), en la pantalla del aula:
   · Tarjeta de tres líneas ARRIBA EN EL CENTRO, siempre en el mismo sitio y flotando por encima de todo (portal, apps,
     editores): la actividad de antes tachada en gris, la de ahora en amarillo con su subtítulo en blanco, los minutos que
     le quedan y la barra; debajo, la siguiente en gris y los botones ◀ ⏸ ■ ▶. En el portal, arriba a la altura de los
     botones de la derecha y abajo a la de la tira de la música, con el mismo hueco a los lados (Iago, 15-oct).
     (16-oct-2026, 18:50) Siempre del MISMO ANCHO (300 px), arriba en el centro y sin animaciones: en el portal, la fila de
     botones de la derecha se aparta de golpe. Con un libro, la pizarra o el dictado animado abiertos, en UNA LÍNEA dentro de
     su barra. Las dos llevan un + amarillo en la esquina de arriba a la derecha: abre la escaleta ENTERA en una ventana grande
     en el centro (lo hecho tachado, lo de ahora destacado con su información, lo que falta); su − amarillo la cierra.
   · Del minuto 0:00 a la PREPARACIÓN (hacia el 4:14–4:18; depende de lo largo que sea el índice), la «entrada» (el portal
     abre la lista de morosos). Luego, la PREPARACIÓN: cuenta atrás de 32 s a pantalla completa, «Preparamos libro de ritmo y
     lápiz», con su batería (la pista escaleta-previa.mp3, hecha con los sonidos de Splice de Iago: el loop «alligator»
     con un complemento distinto en cada frase, 16 compases a 120) y unas barras amarillas que se mueven con ella; la
     música de los 30 temas se para.
   · Hasta el 5:00, «HOY EN CLASE» a pantalla completa (lo ven los alumnos): la preparación acaba subiendo de tensión y
     de golpe, silencio; al segundo y medio empieza la carga de datos (tecleo y «computing» suaves; abajo «Cargando
     actividades» y un circulito amarillo que gira) y las líneas salen cada segundo y medio, cada una con un «clic» (el
     Button Press de Iago); con la última se para la carga y suena alto el Scifi Touch Activation 3, cuyo último golpe
     cae en el 5:00, cuando se cierra la pantalla y empieza la primera actividad (Iago, 15-oct: «Ritmo:
     preparación lección 13 · Ritmo: evaluación lecciones 14 y 15 · FaActos 3 · Teoría: … · Dictado 5 · Lección de
     entonación», sin decir qué lección; el descanso, una raya discontinua). El ▶ amarillo junto a «Salir» empieza la
     clase antes (y la vuelve a poner tras ■).
   · En esa cuenta atrás, arriba y en violeta, los recordatorios de esa clase que manda el iPad (los 📌 de la preparación
     y las fichas en papel), solo los de ese grupo y cuatro como mucho (Iago, 15-oct).
   · Cada cambio de actividad: cartel a pantalla completa 5 s y un «ding» suave; tocar la pantalla lo quita AL MOMENTO
     (ese toque no llega a lo de debajo) y el tiempo de la nueva ya corre. Sin carteles ni ding con
     un vídeo sonando o en pantalla completa de algo que no sea la página entera; con algo así en pantalla completa, la
     tarjeta tampoco se ve. El tiempo sigue corriendo siempre.
     (16-oct-2026, tarde) En el dictado animado y en los carruseles de dictado (GE y GP), SÍ: cartel, aviso y «Fin de
     la clase», también a pantalla completa. El aviso suena unos 10 dB más bajo que antes.
   · Margen, como en el iPad: si paso antes de tiempo, lo que sobra se guarda («+1:24» en gris). Si una actividad llega a
     cero con margen, no salta: la barra se recoloca con un tramo gris «extra» que se va gastando; al acabarse, salta.
   · Al acabar, «Fin de la clase» (en C2, con las tareas para casa). Se quita tocando.
   · Todo se calcula con la hora: el estado (saltos, pausas, margen) se guarda por grupo y día en la base, así que el
     portal y las apps de esa pantalla van a la vez y sigue en su sitio aunque se cierre Chrome. Ligero: un repaso cada
     cuarto de segundo con la página a la vista (nada si está escondida); la animación solo durante la cuenta atrás.
   · (17-oct-2026) LA PREVIA: en lugar de los 32 s de la preparación, la previa del aula (piel/previa/previa.html, en un marco):
     el aviso con la cuenta atrás y los recordatorios, «¡Ojo! Cuidado con esto» (el error más repetido de la última ficha del
     grupo, que calcula esta pantalla; si no hay, uno de repaso), un respiro y, en GE, un consejo. Dura lo que mida; si no está lista a
     tiempo, la de siempre. «Saltar» vuelve a la de siempre. Y EL MANDO: arriba (Tab) play / pausa; → y ← (↓ ↑, Av Pág, Re Pág).
   Para quitarla en una pestaña: ?escaleta=0 (y ?escaleta=1 para volver). Para quitarla del todo: su línea en lm-piel.js.
   ===================================================================== */
(function () {
  'use strict';
  if (window.LMEscaleta) return;
  var D = document, H = D.documentElement, W = window;
  var YO = D.currentScript;
  var PIEL = W.LMPiel || {};
  var APP = (YO && YO.getAttribute('data-app')) || PIEL.app || 'otra-ge';
  var GRADO = (YO && YO.getAttribute('data-grado')) || PIEL.grado || (/-gp$/.test(APP) ? 'gp' : 'ge');
  var BASE = (YO && YO.src) ? YO.src.replace(/[?#].*$/, '').replace(/[^\/]*$/, '') : 'https://ge.lmathome.es/piel/';
  var PORTAL = /^portal-/.test(APP);
  var SB = 'https://woiptkyrxkbpnvioypit.supabase.co', ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvaXB0a3lyeGticG52aW95cGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NzI2ODYsImV4cCI6MjA5MjA0ODY4Nn0.B2nKgj5rD0rkdLeMIrd9KgD8lUPWsBT4Y7aCtmnvbjA';
  var Q = {}; try { Q = Object.fromEntries(new URLSearchParams(location.search)); } catch (e) {}
  try { if (Q.escaleta === '0') sessionStorage.setItem('lm_esc_no', '1'); else if (Q.escaleta === '1') sessionStorage.removeItem('lm_esc_no'); } catch (e) {}
  var APAGADA = false; try { APAGADA = sessionStorage.getItem('lm_esc_no') === '1'; } catch (e) {}
  if (APAGADA) { W.LMEscaleta = { apagada: true }; return; }

  /* ---------- utilidades ---------- */
  function $(id) { return D.getElementById(id); }
  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toLowerCase(); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function txt(el, v) { if (el && el.textContent !== v) el.textContent = v; }
  function ver(el, si) { if (el && el.hidden === !!si) el.hidden = !si; }
  function lsLee(k) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
  function lsPon(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function mmss(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function minutos(s) { return Math.max(1, Math.ceil(s / 60)) + ' min'; }
  function quitarEmojis(s) {
    return String(s == null ? '' : s).replace(/[←-➿⬀-⯿️⃣]/g, ' ').replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
      .replace(/[ \t ]{2,}/g, ' ').replace(/^[\s·•–—-]+/gm, '').trim();
  }

  /* ---------- la cuenta (solo Tester / Protester) ---------- */
  var TESTER = { 'iago gonzalez tester': 1, 'iago gonzalez protester': 1, 'iago gonzalez pro tester': 1 };
  var CTA = { t: 0, v: null };
  function cuenta() {
    if (Date.now() - CTA.t < 5000) return CTA.v;
    CTA.t = Date.now(); CTA.v = cuenta0(); return CTA.v;
  }
  function cuenta0() {
    try {
      var s = JSON.parse(localStorage.getItem(GRADO === 'gp' ? 'lmpro_session' : 'lmeav_session') || 'null');
      if (s && s.id && s.estado === 'validado' && TESTER[norm(s.nombre)]) return String(s.id);
      var L = W.LMPiel; return (L && L.cuentaTester) ? String(L.cuentaTester) : null;   /* (20-oct-2026) Teoría at home / PRO: la de lm-piel.js */
    } catch (e) { return null; }
  }

  /* ---------- el reloj: el del servidor (si el del aparato va mal por más de 20 s) y la hora de Galicia ---------- */
  var DESFASE = 0;
  function ahora() { return (typeof W.LM_ESC_AHORA === 'function' ? W.LM_ESC_AHORA() : Date.now()) + DESFASE; }
  (function mirarReloj() {
    if (typeof W.LM_ESC_AHORA === 'function') return;
    try {
      var t0 = Date.now();
      fetch(location.origin + location.pathname, { method: 'HEAD', cache: 'no-store' }).then(function (r) {
        var f = r && r.headers && r.headers.get('Date'), ts = f ? Date.parse(f) : NaN; if (!isFinite(ts)) return;
        var df = ts - Math.round((t0 + Date.now()) / 2); DESFASE = Math.abs(df) > 20000 ? df : 0;
      }).catch(function () {});
    } catch (e) {}
  })();
  var DIAS = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }, FMT = null;
  function galicia(ms) {
    try {
      if (!FMT) FMT = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      var p = {}; FMT.formatToParts(new Date(ms)).forEach(function (x) { p[x.type] = x.value; });
      if (DIAS[p.weekday]) return { y: +p.year, mo: +p.month, d: +p.day, dia: DIAS[p.weekday], seg: (+p.hour % 24) * 3600 + (+p.minute) * 60 + (+p.second) };
    } catch (e) {}
    var t = new Date(ms);
    return { y: t.getFullYear(), mo: t.getMonth() + 1, d: t.getDate(), dia: ((t.getDay() + 6) % 7) + 1, seg: t.getHours() * 3600 + t.getMinutes() * 60 + t.getSeconds() };
  }
  function fechaISO(g) { return g.y + '-' + ('0' + g.mo).slice(-2) + '-' + ('0' + g.d).slice(-2); }
  function semanaISO(g) {   /* año y semana ISO de esa fecha */
    var d = new Date(Date.UTC(g.y, g.mo - 1, g.d)), dn = (d.getUTCDay() + 6) % 7;
    d.setUTCDate(d.getUTCDate() - dn + 3);
    var a = d.getUTCFullYear(), j = new Date(Date.UTC(a, 0, 4)), jn = (j.getUTCDay() + 6) % 7;
    j.setUTCDate(j.getUTCDate() - jn + 3);
    return { anio: a, semana: 1 + Math.round((d - j) / 604800000) };
  }

  /* ---------- la base: llamadas pequeñas ---------- */
  function rpc(fn, args) {
    return fetch(SB + '/rest/v1/rpc/' + fn, { method: 'POST', cache: 'no-store', headers: { 'Content-Type': 'application/json', apikey: ANON, Authorization: 'Bearer ' + ANON }, body: JSON.stringify(args || {}) })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
  }

  /* ---------- el horario de clases (el del Diario: día, hora y grupo; sin nombres) ---------- */
  var HOR_LS = 'lm_esc_horario_v1', HOR = { l: null, t: 0, pidiendo: false };
  function horario() {
    if (!HOR.l) { var g = lsLee(HOR_LS); if (g && Array.isArray(g.l)) { HOR.l = g.l; HOR.t = g.t || 0; } }
    if (!HOR.pidiendo && Date.now() - HOR.t > 6 * 3600000) {
      HOR.pidiendo = true;
      rpc('horario_clases_publico', {}).then(function (d) {
        var l = Array.isArray(d) ? d.filter(function (h) { return h && h.grupo && +h.dia >= 1 && +h.dia <= 7 && /^\d{1,2}:\d{2}/.test(String(h.ini || '')); })
          .map(function (h) { return { dia: +h.dia, ini: String(h.ini).slice(0, 5), grupo: String(h.grupo) }; }) : [];
        if (l.length) { HOR.l = l; HOR.t = Date.now(); lsPon(HOR_LS, { l: l, t: HOR.t }); }
        else HOR.t = Date.now() - 6 * 3600000 + 30 * 60000;   /* si falla, otra vez en media hora */
      }).catch(function () { HOR.t = Date.now() - 6 * 3600000 + 30 * 60000; }).then(function () { HOR.pidiendo = false; });
    }
    return HOR.l || [];
  }
  function minDe(hhmm) { var m = /^(\d{1,2}):(\d{2})/.exec(String(hhmm || '')); return m ? (+m[1]) * 60 + (+m[2]) : NaN; }
  function delGrado(g) { return GRADO === 'gp' ? /gp/i.test(g) : !/gp/i.test(g); }
  function cursoDe(g) { var m = /^(\d+)\s*gp/i.exec(g); if (m) return m[1] + 'Gp'; m = /^(\d+)/.exec(g); return m ? m[1] + 'Ge' : ''; }
  function grupoBonito(g) { var m = /^(\d+)(?:\s*gp)?\s*([a-z])$/i.exec(String(g || '')); return m ? m[1] + '.º ' + m[2].toUpperCase() : String(g || ''); }
  var DURA = GRADO === 'gp' ? 60 : 90, ANTES = 10;   /* minutos de clase · el ▶ amarillo sale 10 min antes */
  var DIA_NOMBRE = ['', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  var COLOR_TEMA = { ritmo: '#22c55e', teoria: '#ec4899', entonacion: '#3b82f6', dictado: '#f97316', intervalia: '#a78bfa', descanso: '#d9b98c', otra: '#9aa6bb' };
  /* la clase de ahora: la que empezó más tarde (la siguiente manda desde su minuto 0; antes, solo si no hay otra en curso) */
  function claseAhora(t) {
    var g = galicia(t), hs = horario().filter(function (h) { return delGrado(h.grupo); });
    var en = null, previa = null;
    hs.forEach(function (h) {
      if (+h.dia !== g.dia) return;
      var ini = minDe(h.ini); if (!isFinite(ini)) return;
      var s0 = ini * 60, desde = g.seg - s0;   /* segundos desde el minuto 0 */
      if (desde >= 0 && desde < (DURA + 15) * 60) { if (!en || s0 > en.s0) en = { h: h, s0: s0 }; }
      else if (desde < 0 && desde >= -ANTES * 60) { if (!previa || s0 < previa.s0) previa = { h: h, s0: s0 }; }
    });
    var x = en || previa; if (!x) return null;
    var mias = hs.filter(function (h) { return h.grupo === x.h.grupo; }).sort(function (a, b) { return (a.dia - b.dia) || (minDe(a.ini) - minDe(b.ini)); });
    var k = -1; for (var i = 0; i < mias.length; i++) if (mias[i].dia === x.h.dia && mias[i].ini === x.h.ini) { k = i; break; }
    var sem = semanaISO(g);
    return { grupo: x.h.grupo, curso: cursoDe(x.h.grupo), clase: k <= 0 ? 'c1' : 'c2', dia: g.dia, fecha: fechaISO(g), anio: sem.anio, semana: sem.semana,
             t0: Math.floor(t / 1000) * 1000 - (g.seg - x.s0) * 1000, clave: x.h.grupo + '|' + fechaISO(g) };   /* al segundo exacto (el cartel y la batería no deben bailar) */
  }

  /* ---------- la escaleta publicada por el Diario (vista iPad) ---------- */
  var ESC = { k: '', d: null, t: 0, pidiendo: false };
  function claveEsc(c) { return c.curso + '|' + c.anio + '|' + c.semana + '|' + c.clase; }
  function escaleta(c) {
    var k = claveEsc(c);
    if (ESC.k !== k) { ESC.k = k; ESC.d = lsLee('lm_esc_pub:' + k); ESC.t = 0; }
    var cada = (ESC.d && ESC.d.hay) ? 5 * 60000 : 60000;
    var id = cuenta();
    if (id && !ESC.pidiendo && Date.now() - ESC.t > cada) {
      ESC.pidiendo = true; ESC.t = Date.now();
      rpc('escaleta_leer', { p_cuenta_id: id, p_curso: c.curso, p_anio: c.anio, p_semana: c.semana, p_clase: c.clase }).then(function (d) {
        if (d && d.ok && ESC.k === k) { ESC.d = { hay: !!d.hay, bloques: d.bloques || [], tareas: d.tareas || [], act: d.actualizado_en || '' }; lsPon('lm_esc_pub:' + k, ESC.d); pintar(true); }
      }).catch(function () {}).then(function () { ESC.pidiendo = false; });
    }
    return ESC.d;
  }

  /* ---------- el estado (saltos, pausa, margen), por grupo y día, compartido ----------
     { v:1, ts, arr (empezó), i (actividad), ini (cuándo empezó la de ahora), pac (ms en pausa de la de ahora),
       pausa (desde cuándo, o 0), mg (margen en s al empezar la de ahora), parada (■, desde cuándo), finVisto } */
  var EST = { k: '', e: null, t: 0, pidiendo: false, guardando: 0 };
  function estado(c) {
    if (EST.k !== c.clave) { EST.k = c.clave; EST.e = lsLee('lm_esc_est:' + c.clave); EST.t = 0; }
    var id = cuenta();
    if (id && !EST.pidiendo && !D.hidden && Date.now() - EST.t > 60000) leerEstado(c, id);
    return EST.e;
  }
  function leerEstado(c, id) {
    var k = c.clave; EST.pidiendo = true; EST.t = Date.now();
    rpc('escaleta_estado_leer', { p_cuenta_id: id, p_clave: k }).then(function (d) {
      if (!(d && d.ok) || EST.k !== k) return;
      var e = d.hay ? d.estado : null;
      if (e && (!EST.e || (+e.ts || 0) > (+EST.e.ts || 0))) { EST.e = e; lsPon('lm_esc_est:' + k, e); pintar(true); }
    }).catch(function () {}).then(function () { EST.pidiendo = false; });
  }
  function guardarEstado(c, e) {
    e.v = 1; e.ts = ahora(); EST.k = c.clave; EST.e = e; lsPon('lm_esc_est:' + c.clave, e);
    var id = cuenta(); if (!id) return;
    var n = ++EST.guardando;
    (function intenta(veces) {
      rpc('escaleta_estado_guardar', { p_cuenta_id: id, p_clave: c.clave, p_estado: e }).catch(function () {
        if (veces > 0 && n === EST.guardando) setTimeout(function () { intenta(veces - 1); }, 4000);
      });
    })(3);
  }

  /* ---------- lo que se ve de cada actividad: título corto y subtítulo (de lo que manda el iPad) ---------- */
  function capital(s) { s = String(s || '').trim(); return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function tituloLimpio(t) {
    t = quitarEmojis(t).replace(/\s*[·•]\s*clase\s*\d+\s*$/i, '').replace(/\s*\(opcional\)\s*$/i, '').trim();
    if (t === t.toUpperCase() && /[A-ZÁÉÍÓÚÑ]{3}/.test(t)) t = capital(t.toLowerCase());   /* «RITMO» → «Ritmo» */
    return t.replace(/\s*[·•]\s*/g, ' ').replace(/\s{2,}/g, ' ').replace(/\bintervalia\b/i, 'Intervalia').replace(/\bfaactos\b/i, 'FaActos')
      .replace(/\bpredict\b/i, 'PreDict').replace(/\bpro\b/, 'PRO');
  }
  function listaY(ns) { ns = ns.map(String); return ns.length < 2 ? ns.join('') : ns.slice(0, -1).join(', ') + ' y ' + ns[ns.length - 1]; }
  function lecciones(ns, pal) { ns = (ns || []).filter(function (x) { return x !== '' && x != null; }); if (!ns.length) return ''; return (pal || (ns.length === 1 ? 'Lección ' : 'Lecciones ')) + listaY(ns); }
  function nombreCorto(n) {   /* «Martina García López» → «Martina G.» */
    var p = quitarEmojis(n).replace(/^(empieza|empiezan|comienza)\s*:?\s*/i, '').split(/\s+/).filter(Boolean);
    if (!p.length) return '';
    if (p.length === 1) return p[0];
    var part = /^(de|del|la|las|los|y|da|do|dos|das)$/i, k = 1;
    while (k < p.length - 1 && part.test(p[k])) k++;
    if (p.length >= 3 && !part.test(p[1]) && /^(maria|mari|jose|juan|ana|luis|miguel|angel|carmen|pilar|rosa|isabel|antonio|francisco|manuel)$/i.test(norm(p[0])) && p.length >= 4) k = 2;   /* nombres compuestos habituales */
    return p.slice(0, k).join(' ') + ' ' + p[k].charAt(0).toUpperCase() + '.';
  }
  function primeraLinea(s) { var l = String(s || '').split(/\n+/).map(function (x) { return quitarEmojis(x); }).filter(Boolean)[0] || ''; return l.length > 60 ? l.slice(0, 58) + '…' : l; }
  function formatea(b, grupo) {
    b = b || {};
    if (b.t2) return { t: b.t2, s: b.s2 || '' };   /* ya viene escrito así desde el iPad */
    var slot = String(b.slot || ''), tit = tituloLimpio(b.tit || slot), sub = String(b.sub || ''), ast = quitarEmojis(b.ast || ''), lec = b.lecs || [];
    var nsub = (sub.match(/\b\d{1,3}\b/g) || []);
    if (/intro-ritmo/.test(slot) || /^ritmo intro/i.test(tit) || /^intro\b/i.test(tit)) {
      var m = /(\d+(?:\.\d+)?)/.exec(b.tit || ''); return { t: 'Ritmo', s: m ? 'Carta ' + m[1] : '' };
    }
    if (slot === 'ritmo' || (/^ritmo/.test(slot) && !/entonado/.test(slot)) || /^ritmo$/i.test(tit)) return { t: 'Ritmo', s: lecciones(lec.length ? lec : []) || primeraLinea(sub.replace(/trabajar en clase/i, '')) };
    /* (15-oct-2026) GP: la carta de ritmo de C1 («Carta 2.3» + su nombre) → «Ritmo · Carta 2.3» */
    if (slot === 'carta-ritmo' || /^carta\s+\d/i.test(tit)) { var mc = /(\d+(?:\.\d+)?)/.exec(b.tit || ''); return { t: 'Ritmo', s: mc ? 'Carta ' + mc[1] : primeraLinea(sub) }; }
    /* (15-oct-2026) GP: «Pregunta autoalimentada · semana anterior» → «Pregunta de la semana pasada · Lecciones 14 y 16» */
    if (/pregunta/.test(slot) || /^pregunta/i.test(tit)) return { t: 'Evaluación', s: lecciones(lec.length ? lec : nsub) || primeraLinea(sub) };
    if (/^fa-intervalia|intervalia|faactos/.test(slot)) {
      var modo = /b\/n|blanco/i.test(b.ses || '') ? 'blanco y negro' : (/color/i.test(b.ses || '') ? 'color' : '');
      var e0 = (b.emp && typeof b.emp === 'object') ? (b.emp[grupo] || '') : (b.emp || ''), emp = e0 ? 'empieza ' + (/\.$/.test(e0) ? e0 : nombreCorto(e0)) : '';
      var partes = [ast, modo, emp].filter(Boolean);
      return { t: /^fa-intervalia/.test(slot) ? 'FaActos + Intervalia' : (/pro/.test(slot) ? 'Intervalia PRO' : (/faactos/.test(slot) ? 'FaActos' : 'Intervalia')), s: partes.join(' · ') };
    }
    /* (20-oct-2026, Iago, en GP: «en el índice… sale el dictado número 6… pero también sale dictado en plan redundante y sin datos.
       Solo tiene que salir uno») «Corregir dictado» (slot corregir-dictado del iPad) es la corrección del dictado, no otro dictado:
       se lee «Corrección del dictado» y, en el índice, no sale aparte si la clase ya tiene su dictado (agendaHoy). */
    if (/corre(c|g)/i.test(slot + ' ' + tit) && /dictado/i.test(slot + ' ' + tit)) return { t: 'Corrección del dictado', s: b.num ? 'Dictado nº ' + b.num : primeraLinea(sub) };
    if (/dictado|dictclase/.test(slot)) return { t: 'Dictado', s: b.num ? 'Dictado nº ' + b.num : primeraLinea(sub) };
    if (/descanso/.test(slot) || /^descanso/i.test(tit)) return { t: 'Descanso', s: primeraLinea(sub) };
    if (/prepar/i.test(tit) && /entonaci/i.test(tit)) return { t: 'Preparación entonación', s: b.lecE ? 'Lección ' + b.lecE : '' };
    if (/^entonaci/i.test(tit) || slot === 'entonacion') return { t: 'Entonación', s: b.lecE ? 'Lección ' + b.lecE : (/lecci[oó]n\s+\d+/i.exec(sub) || [''])[0] };
    if (/evaluaci/i.test(tit) && /ritmo/i.test(tit)) return { t: 'Evaluación de ritmo', s: lecciones(lec.length ? lec : nsub) };
    if (/ritmo entonado|ritmo-entonado/i.test(tit + ' ' + slot)) return { t: 'Ritmo entonado', s: lecciones(lec.length ? lec : []) || primeraLinea(sub) };
    if (/bloque de teor/i.test(tit) || slot === 'bloque-de-teoria') return { t: 'Teoría', s: primeraLinea(sub) };
    if (/corre(c|g)/i.test(tit) && /ficha/i.test(tit)) {   /* «Corrección de ficha» y el «Corregir ficha teoría (opcional)» del iPad */ var f = /ficha\s*(?:nº\s*)?(\d+)/i.exec(sub); return { t: 'Corrección de la ficha', s: f ? 'Ficha ' + f[1] : '' }; }
    if (/predict/i.test(slot + ' ' + tit)) return { t: /carrusel/i.test(slot + ' ' + tit) ? 'PreDict Carrusel' : 'PreDict', s: primeraLinea(sub) };
    return { t: tit || 'Actividad', s: primeraLinea(sub) };
  }
  function temaDe(b) {
    var x = norm((b.slot || '') + ' ' + (b.tit || ''));
    if (/pregunta/.test(x)) return 'ritmo';
    if (/entonacion/.test(x) && !/ritmo entonado|ritmo-entonado/.test(x)) return 'entonacion';
    if (/intervalia|faactos/.test(x)) return 'intervalia';
    if (/dictado|dictclase|predict/.test(x)) return 'dictado';
    if (/ritmo|intro|desafio/.test(x)) return 'ritmo';
    if (/teoria|ficha/.test(x)) return 'teoria';
    if (/descanso/.test(x)) return 'descanso';
    var tm = norm(b.tema || ''); if (/^(ritmo|teoria|dictado|entonacion|intervalia)$/.test(tm)) return tm;
    return 'otra';
  }

  /* ---------- (16-oct-2026, Iago) EL VÍDEO DEL BLOQUE DE TEORÍA, A UN TOQUE ----------
     «Que no solo haya la opción de escribir en bloque de teoría, sino que haya la opción de elegir un vídeo… todo más
     vinculado». Si la actividad que toca lleva un vídeo, la tarjeta enseña «▶ Inversión de acordes» y, al tocarlo, el vídeo
     se abre aquí mismo, a pantalla completa (✕ arriba, o Esc, para volver; la escaleta sigue contando y su tarjeta se
     esconde mientras tanto). El vídeo sale del que se elija en la preparación (b.video = {t, u}) o, mientras no lo haya, de
     lo que esté escrito en el bloque de teoría: una línea «Vídeo …» con el título de uno de los vídeos didácticos de Teoría
     at home (los de VIDEOS en teoriaathome y teoriapro: si se añade uno allí, añadirlo aquí) o, en GP, «Día N Cabaña»
     (y Atonalidad / Fonógrafo), que abre ese portal interactivo con la cuenta en «#c=», como el medallero.
     Para quitarlo: borrar este bloque y lo marcado «(16-oct-2026) vídeo». */
  var VID_BASE = { ge: 'https://teoria.ge.lmathome.es/', gp: 'https://teoria.gp.lmathome.es/' };
  var VID_LISTA = {
    ge: [['La tonalidad', 'la-tonalidad'], ['Indica la tonalidad', 'indica-la-tonalidad'], ['Indica la armadura', 'indica-la-armadura'],
      ['Tonalidades vecinas', 'tonalidades-vecinas'], ['Intervalos', 'intervalos'], ['Intervalos compuestos', 'intervalos-compuestos'],
      ['Inversión de intervalos', 'inversion-intervalos'], ['Inversión de compuestos', 'inversion-compuestos'], ['Compases', 'compases'],
      ['Escalas menores', 'escalas-menores'], ['Escalas mayores', 'escalas-mayores'], ['Otras escalas', 'otras-escalas'], ['Grados', 'grados'],
      ['Semitono cromático y diatónico', 'semitonos'], ['Acordes', 'acordes'], ['Inversión de acordes', 'inversion-acordes'],
      ['Enarmonías', 'enarmonias'], ['Claves', 'claves'], ['Cadencias', 'cadencias'], ['Términos', 'terminos'],
      ['Términos de movimiento', 'terminos-movimiento']],
    gp: [['Compases extraños', 'compases-extranos'], ['Intervalos', 'intervalos'], ['Intervalos compuestos', 'intervalos-compuestos'],
      ['Inversión de intervalos', 'inversion-intervalos'], ['Inversión de compuestos', 'inversion-compuestos'], ['Escalas menores', 'escalas-menores'],
      ['Escalas mayores', 'escalas-mayores'], ['Otras escalas', 'otras-escalas'], ['La tonalidad', 'la-tonalidad'],
      ['Indica la tonalidad', 'indica-la-tonalidad'], ['Indica la armadura', 'indica-la-armadura'], ['Tonalidades vecinas', 'tonalidades-vecinas'],
      ['Índice acústico', 'indice-acustico'], ['Modos', 'modos'], ['Serie armónica', 'serie-armonica'], ['Dodecafonismo', 'dodecafonismo'],
      ['Acordes avanzados', 'acordes-avanzados'], ['Cadencias', 'cadencias-pro'], ['Modulación diatónica', 'modulacion'], ['Transporte', 'transporte'],
      ['Acordes', 'acordes'], ['Inversión de acordes', 'inversion-acordes'], ['Enarmonías', 'enarmonias']]
  };
  /* los vídeos temáticos de GP: los portales interactivos (por días o capítulos) */
  var VID_TEMA = [
    { re: /\b(caba[nñ]a|acustica)\b/, t: 'La cabaña', d: 'Día', u: 'https://acustica.gp.lmathome.es/prueba.html' },
    { re: /\b(atonalidad|museo)\b/, t: 'Atonalidad', d: 'Capítulo', u: 'https://atonalidad.gp.lmathome.es/prueba.html' },
    { re: /\bfonografo\b/, t: 'Fonógrafo', d: 'Día', u: 'https://iagonaron.github.io/fon-grafo/' }
  ];
  function conCuenta(u) { var id = cuenta(); return id ? String(u).split('#')[0] + '#c=' + id : u; }
  function videoDe(b) {
    try {
      var v = b && b.video;
      if (v && typeof v === 'object' && /^https:\/\//.test(String(v.u || ''))) {
        var esTema = !!v.tema || /^tema:/.test(String(v.id || ''));
        return { t: String(v.t || 'Vídeo'), u: esTema ? conCuenta(String(v.u)) : String(v.u), tema: esTema ? 1 : 0 };
      }
      if (!b || !/teor/.test(norm((b.tit || '') + ' ' + (b.slot || '')))) return null;
      var gr = GRADO === 'gp' ? 'gp' : 'ge', lineas = String(b.sub || '').split(/\n+/);
      for (var i = 0; i < lineas.length; i++) {
        var l = norm(quitarEmojis(lineas[i])), m;
        if (gr === 'gp') {
          for (var k = 0; k < VID_TEMA.length; k++) {
            var x = VID_TEMA[k];
            if (x.re.test(l)) { m = /\b(?:dia|capitulo|cap\.?)\s*(\d)\b/.exec(l) || /\b(\d)\b/.exec(l); return { t: x.t + (m ? ' · ' + x.d + ' ' + m[1] : ''), u: conCuenta(x.u), tema: 1 }; }
          }
        }
        m = /^videos?\b[\s:.\-]*(.+)$/.exec(l); if (!m) continue;
        var c = ' ' + m[1].replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim() + ' ', mejor = null;
        VID_LISTA[gr].forEach(function (y) { var n = ' ' + norm(y[0]) + ' '; if (c.indexOf(n) >= 0 && (!mejor || y[0].length > mejor.t.length)) mejor = { t: y[0], u: VID_BASE[gr] + 'intros/' + y[1] + '/index.html' }; });
        if (mejor) return mejor;
      }
    } catch (e) {}
    return null;
  }

  /* ---------- el modelo: qué toca ahora (todo sale de la hora y del estado) ---------- */
  /* (15-oct-2026, Iago) «pon solo 30 segundos de preparatorio… y 15 de índice… cuidado porque la batería a veces se
     descuadra… que sea fluida»: 32 s y 16 s, compases enteros a 120 (16 + 8), así el índice entra en el 1 de un compás */
  /* (15-oct-2026, 16:35) a 120, el tempo del loop «alligator» que eligió Iago: 16 compases de preparación… */
  /* (15-oct-2026, 18:05) …y el índice, lo que haga falta: 1,5 s de silencio, las líneas cada 1,5 s y la última 3,75 s
     antes del 5:00, donde empieza el cierre (Touch Activation 3), cuyo último golpe cae en el 5:00 */
  var BPM = 120, COMPAS = 240 / BPM, PASO = COMPAS / 16;
  var CUENTA = 16 * COMPAS;   /* s de la preparación (la cuenta atrás) */
  var K_SIL = 12, K_FIN = 30, GOLPE_CIERRE = 3.74;   /* en semicorcheas (1/8 s): el silencio y la última línea; el golpe, en s */
  var MEMO = { pub: null, g: '', B: [] };
  /* (15-oct-2026, Iago) «cuando estemos en preparación lección… de ritmo, lo que tienes que resaltar es la campana, porque
     trabajo la lección con el visor que tienen ellos en las tareas… y, si eres capaz, la lección de ese día dentro de las
     notificaciones de tareas»: las lecciones de esa preparación (las que manda el iPad o, si no, las del subtítulo) */
  function lecsCampana(b, f) {
    if (!((f.t === 'Ritmo' || f.t === 'Ritmo entonado') && /^Lecci/.test(f.s || ''))) return null;
    var l = (Array.isArray(b.lecs) && b.lecs.length) ? b.lecs : (String(f.s).match(/\d+/g) || []);
    l = l.map(Number).filter(function (n) { return isFinite(n) && n > 0; });
    return l.length ? l : null;
  }
  /* (16-oct-2026) +: lo que trae cada actividad del iPad, para la ventana de la escaleta entera (sin repetir el subtítulo) */
  function detalles(b, f) {
    try {
      if (b.t2) return [];
      var ya = norm(f.s || '');
      return String(b.sub || '').split(/\n+/).map(function (x) { return quitarEmojis(x); }).filter(function (x) {
        var n = norm(x); if (!n || n === ya || (ya && ya.indexOf(n) >= 0)) return false;
        if (ya && n.indexOf(ya) >= 0 && n.length <= ya.length + 12) return false;   /* «Ficha · Ficha 3» con «Ficha 3» */
        if (/^trabajar en clase$/.test(n)) return false;
        if (/^editar en\b/.test(n)) return false;   /* (20-oct-2026) «Editar en DICTADO PRO»: un enlace del iPad, no una nota */
        if (/^[\d\s,.;·y]+$/.test(n)) return false;                                            /* «14», «16»: ya en el subtítulo */
        if (/^((leccion|lecciones)\s*\d+[\s,.;·y]*)+$/.test(n) && /^lecci/i.test(f.s || '')) return false;
        return true;
      }).slice(0, 4).map(function (x) { return x.length > 140 ? x.slice(0, 138) + '…' : x; });
    } catch (e) { return []; }
  }
  /* (19-oct-2026, Iago) «cuento con que haya un texto que me recuerde lo que tengo que repasar… cuando sea entonación, recordar
     lo de los matices» y «las notas que escriba yo a mano también»: la nota 🗒 de ese apartado (la del Radar o la de Iago; b.nota,
     la manda el iPad con la escaleta) sale en el cartel de esa actividad, con la letra del subtítulo, y en la escaleta entera */
  function notaTxt(b) { var x = String((b && b.nota) || '').replace(/\s+/g, ' ').trim(); return x.length > 120 ? x.slice(0, 118) + '…' : x; }
  function bloquesDe(pub, grupo) {
    if (MEMO.pub === pub && MEMO.g === grupo) return MEMO.B;
    var l = (pub && Array.isArray(pub.bloques)) ? pub.bloques.filter(function (b) { return b && +b.m > 0 && b.slot !== '__no_clase'; }) : [];
    MEMO.pub = pub; MEMO.g = grupo; MEMO.B = l.map(function (b) { var f = formatea(b, grupo); return { t: f.t, s: f.s, m: +b.m, tema: temaDe(b), lecs: lecsCampana(b, f), vid: videoDe(b), det: (notaTxt(b) ? ['🗒 ' + notaTxt(b)] : []).concat(detalles(b, f)), nota: notaTxt(b) }; });   /* (16-oct-2026) vídeo */
    /* (20-oct-2026, Iago: «el consejo de entonación y la lección de entonación me la digas en preparación de entonación… ese es el
       momento… y no después») la lección y la nota 🗒 de Entonación pasan a su Preparación (la de antes); en Entonación, ya no. */
    try {
      for (var iP = 0; iP < MEMO.B.length; iP++) {
        var bP = MEMO.B[iP]; if (bP.t !== 'Preparación entonación') continue;
        for (var jE = iP + 1; jE < MEMO.B.length; jE++) {
          var bE = MEMO.B[jE]; if (bE.t !== 'Entonación') continue;
          if (/^Lecci/.test(bE.s || '')) { if (!bP.s || !/^Lecci/.test(bP.s)) bP.s = bE.s; bE.s = ''; }
          if (bE.nota) { var nE = bE.nota; bE.nota = ''; bE.det = (bE.det || []).filter(function (x) { return x !== '🗒 ' + nE; });
            if (!bP.nota) { bP.nota = nE; bP.det = ['🗒 ' + nE].concat(bP.det || []); } }
          break;
        }
      }
    } catch (e) {}
    return MEMO.B;
  }
  /* (15-oct-2026, Iago) «HOY EN CLASE»: el índice que ven los alumnos. Lo que eligió (por la tarde): «Ritmo: carta 1.3»,
     «Ritmo: preparación lección 13» (lo que trabajamos), «Ritmo: evaluación lecciones 14 y 15» (lo que pregunta; en GP,
     «Ritmo entonado: …», también la pregunta de la semana pasada), «FaActos 3», «Intervalia 4», «Dictado 5», «Lección de
     entonación» (sin decir cuál, y con la preparación en la misma línea), «Teoría: lo que puso en la preparación de la
     clase» (si son varias líneas, «Teoría:» y debajo una por línea) y el descanso en su sitio (una raya discontinua). */
  function minus(s) { s = String(s || ''); return s.charAt(0).toLowerCase() + s.slice(1); }
  function agendaHoy(pub, grupo) {
    var l = (pub && Array.isArray(pub.bloques)) ? pub.bloques : [], out = [], vistos = {};
    var conDictado = l.some(function (b) { return b && +b.m > 0 && !/^__/.test(String(b.slot || '')) && formatea(b, grupo).t === 'Dictado'; });   /* (20-oct-2026) */
    l.forEach(function (b) {
      if (!b || !(+b.m > 0) || /^__/.test(String(b.slot || ''))) return;
      var f = formatea(b, grupo), tm = temaDe(b), t = '', ls = null, lec = /^Lecci/.test(f.s || '') ? ' ' + minus(f.s) : '';
      if (f.t === 'Ritmo') t = /^Carta /.test(f.s) ? 'Ritmo: ' + minus(f.s) : 'Ritmo: preparación' + lec;
      else if (f.t === 'Ritmo entonado') t = 'Ritmo entonado: preparación' + lec;
      else if (f.t === 'Evaluación de ritmo') t = 'Ritmo: evaluación' + lec;
      else if (f.t === 'Evaluación') t = 'Ritmo entonado: evaluación' + lec;
      else if (f.t === 'Entonación' || f.t === 'Preparación entonación') { t = 'Lección de entonación'; tm = 'entonacion'; }
      else if (f.t === 'Corrección del dictado') { if (conDictado) return; t = 'Corrección del dictado'; }   /* (20-oct-2026) con su dictado, una sola línea */
      else if (f.t === 'Dictado') t = b.num ? 'Dictado ' + b.num : 'Dictado';
      else if (f.t === 'Teoría') {   /* (Iago) «en vez de bloque de teoría, simplemente TEORÍA: y lo que viene a continuación» */
        ls = String(b.sub || '').split(/\n+/).map(function (x) { x = quitarEmojis(x); return x.length > 80 ? x.slice(0, 78) + '…' : x; }).filter(Boolean).slice(0, 4);
        /* (19-oct-2026, Iago) «el vídeo que se selecciona en preparación de clases tiene que tener presencia en la escaleta…
           en el índice de lo que se va a hacer en clase»: el vídeo elegido (o el escrito «Vídeo …»), como una línea más,
           «▶ Serie armónica», si no está ya en lo escrito */
        var vx = videoDe(b), vt = vx ? norm(String(vx.t).split(' · ')[0]) : '';
        if (vx && vt && !ls.some(function (x) { return norm(x).indexOf(vt) >= 0; })) ls = ls.slice(0, 3).concat(['▶ ' + vx.t]);
        t = ls.length === 1 ? 'Teoría: ' + ls[0] : 'Teoría'; if (ls.length < 2) ls = null; tm = 'teoria';
      }
      else if (f.t === 'Corrección de la ficha') t = f.s ? 'Corrección de la ' + f.s.charAt(0).toLowerCase() + f.s.slice(1) : 'Corrección de la ficha';
      else if (f.t === 'Descanso') {   /* (Iago) «en lugar de poner descanso, una línea discontinua (quizá amarilla)… más sutil» */
        if (out.length && !out[out.length - 1].sep) out.push({ sep: true });
        return;
      }
      else if (/^(FaActos|Intervalia)/.test(f.t)) {   /* (Iago) «FaActos 3 · Intervalia 3»: el acto y la lección, sin más */
        var x = String(b.ast || '') + ' ' + String(b.sub || ''), ac = /Acto\s+(\d+)/i.exec(x), lc = /Lecci[oó]n\s+(\d+)/i.exec(x);
        /* el color, el de su app (código de Iago): FaActos verde, Intervalia azul, las dos juntas violeta */
        if (f.t === 'FaActos + Intervalia') t = 'FaActos' + (ac ? ' ' + ac[1] : '') + ' · Intervalia' + (lc ? ' ' + lc[1] : '');
        else if (f.t === 'FaActos') { t = 'FaActos' + (ac ? ' ' + ac[1] : ''); tm = 'ritmo'; }
        else { t = f.t + (lc ? ' ' + lc[1] : ''); tm = 'entonacion'; }
      }
      else t = f.t;
      if (t.length > 84) t = t.slice(0, 82) + '…';
      var clave = t + (ls ? '|' + ls.join('|') : '');
      if (!t || vistos[clave]) return; vistos[clave] = 1;
      out.push(ls ? { t: t, tema: tm, lineas: ls } : { t: t, tema: tm });
    });
    while (out.length && out[out.length - 1].sep) out.pop();   /* sin línea al final */
    return out.slice(0, 10);
  }
  /* (15-oct-2026, 17:20) Iago: «la sensación tiene que ser como de cargar datos y que vayan apareciendo… sonido de data
     todo el tiempo… el total, 10 segundos». Todo se cuenta en semicorcheas que faltan para el 5:00 (k; una semicorchea =
     1/8 s): «Hoy en clase» entra en k=80 (4:50) y, mientras «carga», las líneas salen a ritmo fijo, S semicorcheas entre
     una y otra (1,5 s, 1 s, medio o un cuarto: el primero con el que todo quepa en 8 s); las de la teoría, al doble de
     rápido. La primera, no antes del 4:51 (k=72), y la última hacia el 4:58 (k=16), para que el 100 % y el cierre del
     5:00 lleguen con todo ya a la vista. */
  /* (15-oct-2026, 17:45) Iago: «la duración exacta entre los ítems debería ser de un segundo y medio»: S = 12 (1,5 s),
     la primera línea en k=84 (4:49,5, tras 1,5 s de silencio) y la última no más tarde del 4:58,5 (k=12); solo si no
     caben, más juntas. */
  var SALTOS = [12, 8, 6, 4, 2];   /* (18:05) la primera que deje todo en 10,5 s */
  var NOTAS = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51, 1567.98, 1760];
  function planIndice(agenda) {
    var S = 2, sub = 2, span = 0, i, j, x;
    for (var nv = 0; nv < SALTOS.length; nv++) {
      S = SALTOS[nv]; sub = Math.max(2, S / 2); span = 0;
      for (i = 0; i < agenda.length; i++) span += (agenda[i].lineas ? agenda[i].lineas.length * sub : 0) + (i < agenda.length - 1 ? S : 0);
      if (span <= 84) break;
    }
    var filas = [], k = K_FIN + span, k0 = k;
    for (i = 0; i < agenda.length; i++) {
      x = agenda[i];
      var fi = { x: x, k: Math.max(1, k), subs: [] }, kk = k;
      if (x.lineas) for (j = 0; j < x.lineas.length; j++) { kk -= sub; fi.subs.push(Math.max(1, kk)); }
      filas.push(fi); k = kk - S;
    }
    var P = { filas: filas, toques: {}, kb: 8, n: 0, S: S, k0: k0, kFin: K_FIN, kIni: agenda.length ? k0 + K_SIL : 0 }, nota = 0;
    filas.forEach(function (fi) {   /* cada «pop», un poco más agudo que el anterior: la lista se va llenando */
      P.n += 1 + fi.subs.length;
      if (fi.x.sep) { fi.d2 = Math.max(1, fi.k - Math.max(2, S / 2)); P.toques[fi.k] = { sep: 1, n: nota }; P.toques[fi.d2] = { swish: 1 }; return; }
      P.toques[fi.k] = { f: NOTAS[Math.min(nota, NOTAS.length - 1)], n: nota++ };
      fi.subs.forEach(function (kk) { P.toques[kk] = { sub: 1, f: NOTAS[Math.min(nota, NOTAS.length - 1)], n: nota++ }; });
    });
    if (agenda.length) {   /* la carga de datos empieza con la primera línea y se para con la última, que trae el cierre */
      P.toques[k0] = P.toques[k0] || {}; P.toques[k0].primero = 1; P.toques[k0].hasta = (k0 - K_FIN) * PASO;
      P.toques[K_FIN] = P.toques[K_FIN] || {}; P.toques[K_FIN].ultimo = 1;
    }
    return P;
  }
  /* (15-oct-2026, Iago) «En la cuenta atrás… quiero que me aparezcan los recordatorios… en un texto más pequeño…
     en violeta». El iPad los manda en un bloque aparte ('__recordatorios', sin minutos): { t, d, gr:[grupos] }.
     Aquí, solo los de este grupo (o los que valen para todos), cuatro como mucho. */
  function codigoG(s) { return norm(s).replace(/[^a-z0-9]/g, ''); }
  function recordatorios(pub, grupo) {
    var r = (pub && Array.isArray(pub.bloques)) ? pub.bloques.filter(function (b) { return b && b.slot === '__recordatorios'; })[0] : null;
    var l = (r && Array.isArray(r.rec)) ? r.rec : [], g = codigoG(grupo);
    return l.filter(function (x) {
      if (!x || !(x.t || x.d)) return false;
      var gr = Array.isArray(x.gr) ? x.gr.map(codigoG).filter(Boolean) : [];
      return !gr.length || !g || gr.indexOf(g) >= 0;
    }).slice(0, 4).map(function (x) {
      return { t: quitarEmojis(x.t || ''), d: String(x.d || '').split(/\n+/).map(function (y) { return quitarEmojis(y); }).filter(Boolean).join(' · ') };
    });
  }
  function noHayClase(pub) { return !!(pub && Array.isArray(pub.bloques) && pub.bloques.some(function (b) { return b && b.slot === '__no_clase'; })); }
  /* (28-oct-2026, Iago: «en la clase 1 el descanso era como de 5 minutos o 6, no 8, que es lo que me he encontrado hoy») EL
     DESCANSO DURA LO SUYO: la cuenta atrás del descanso ya no le suma el margen guardado (lo que se ganó pasando antes de
     tiempo); al acabar sus minutos salta, y el margen pasa entero a la actividad siguiente (sigue viéndose el «+m:ss» gris).
     Para volver a lo de antes (el margen se gastaba en el descanso): DESCANSO_SIN_MARGEN = false. */
  var DESCANSO_SIN_MARGEN = true;
  /* con el estado y la hora: la actividad de ahora (encadenando las que se acabaron, como el iPad) */
  function avanza(e, B, t) {
    if (!e || !B.length) return null;
    var i = Math.min(Math.max(0, e.i | 0), B.length - 1), ini = +e.ini, pac = +e.pac || 0, mg = Math.max(0, +e.mg || 0);
    var quieto = e.parada ? +e.parada : (e.pausa ? +e.pausa : 0);   /* parada o pausa: el reloj de la actividad no corre */
    for (var vueltas = 0; vueltas < 60; vueltas++) {
      var dur = B[i].m * 60, hasta = quieto || t, usado = (hasta - ini - pac) / 1000, resto = dur - usado;
      var dsc = DESCANSO_SIN_MARGEN && esDescanso(B[i]), mgE = dsc ? 0 : mg;   /* (28-oct-2026) el descanso no gasta el margen */
      if (resto > -mgE || quieto) return { i: i, resto: resto, dur: dur, mg: mg, ini: ini, pausa: !!e.pausa && !e.parada, parada: !!e.parada, desc: dsc };
      var finEf = ini + pac + (dur + mgE) * 1000;   /* se acabó (con su margen): la siguiente empezó justo ahí */
      if (i >= B.length - 1) return { fin: true, finEn: finEf, i: i };
      i++; ini = finEf; pac = 0; mg = dsc ? mg : 0;   /* tras el descanso, el margen pasa entero a la siguiente */
    }
    return null;
  }
  var IND = { pub: null, g: '', k: 0 };
  function kIndice(pub, grupo) {   /* en qué semicorchea (antes del 5:00) entra «Hoy en clase» en esta clase; 0 si no hay índice */
    if (IND.pub === pub && IND.g === grupo) return IND.k;
    var a = agendaHoy(pub, grupo), k = (a && a.length) ? planIndice(a).kIni : 0;
    IND.pub = pub; IND.g = grupo; IND.k = k; return k;
  }
  /* (20-oct-2026, Iago, en clase con 4B: «le di al botón de play unos minutos antes… probando el mando… y no ha empezado la
     previa»; tampoco se abrió la lista de morosos) Un ▶ ANTES de la hora que luego se para (■) o se pausa (⏸) también antes de
     la hora NO CUENTA: llegado el minuto 0, la clase va como si no se hubiera tocado (entrada con la lista de morosos, previa,
     «Hoy en clase» y, al 5:00, la primera actividad). Antes se quedaba «parada» y no salía nada de eso. Empezada antes y sin
     parar, igual que siempre (la clase ya va); antes de la hora, igual (parada, con su ▶ para seguir). Para volver a lo de
     antes: ANTES_NO_CUENTA = false. */
  var ANTES_NO_CUENTA = true;
  /* (20-oct-2026, 16:30, Iago: «cada vez que, independientemente de lo que se haga, si pulso el botón… de play, se reproduce
     desde la previa, incluye la previa al pulsar») EL ▶ EMPIEZA POR LA PREVIA: el ▶ amarillo y el botón de arriba del mando
     (antes de la hora, en la entrada o tras un ■ antes de la hora) arrancan la previa en ese momento (o la cuenta atrás de
     siempre si la previa no está lista en unos segundos), luego «Hoy en clase» y la primera actividad. (16:50, Iago: «cuando le
     di… al botón cuadrado… de stop, yo lo que espero es que cuando le dé al play me reinicie la clase… si no sería lo mismo que
     dar la pausa») Tras un ■, también en plena clase, el ▶ empieza la clase DE NUEVO; para seguir donde estaba, ⏸. Para volver
     al ▶ de antes (directo a la primera actividad, y tras ■ seguir donde estaba): false. */
  var PLAY_CON_PREVIA = true;
  /* (22-oct-2026, Iago: «al final de las clases de grado elemental… la escaleta ahí no hace su aparición al final… se me olvida
     repasar las tareas y poner las faltas… que el fin de la clase aparezca invadiendo esa pantalla») «FIN DE LA CLASE» A SU HORA:
     a la hora en que acaba la clase (el minuto 0 + DURA), si aún no se ha visto, sale aunque la escaleta vaya con retraso, esté
     en pausa o parada (■; el 20-oct, en 4B, se paró a las 17:26 y ya no salió). Encima de todo, también de los Resultados del
     portal. Cerrado (con las faltas marcadas), no vuelve. Antes: solo al acabar el plan. Para quitarlo: FIN_A_SU_HORA = false. */
  var FIN_A_SU_HORA = true;
  function vista(t) {
    var c = claseAhora(t); if (!c) return { fase: 'nada' };
    var pub = escaleta(c), e = estado(c), B = bloquesDe(pub, c.grupo), desde = (t - c.t0) / 1000;
    if (ANTES_NO_CUENTA && e && +e.arr && +e.arr < c.t0 && desde >= 0) {
      var quieto0 = +e.parada || +e.pausa || 0;
      if (quieto0 && quieto0 < c.t0) e = null;   /* empezada y parada (o en pausa) antes de la hora: no cuenta */
    }
    var t5 = c.t0 + 300000;   /* (20-oct-2026) cuándo empieza la primera actividad: al 5:00 de la hora de la clase… */
    if (PLAY_CON_PREVIA && e && +e.pre && !+e.arr) {   /* …o, con el ▶, al acabar la previa que empezó al pulsarlo */
      t5 = +e.pre + (cuentaPrevista(c) + kIndice(pub, c.grupo) * PASO) * 1000;
      desde = (t - (t5 - 300000)) / 1000;
    }
    var v = { c: c, B: B, pub: pub, e: e, desde: desde, fase: 'nada' }, INDICE = kIndice(pub, c.grupo) * PASO;
    v.ind = INDICE; v.t5 = t5;
    if (noHayClase(pub)) return v;
    if (desde < 0) { v.fase = (e && e.arr) ? 'clase' : 'antes'; }
    else if (!e || !e.arr) {
      if (e && e.parada && !e.arr) { v.fase = 'parada'; return v; }
      var CU = cuentaDe(c, desde, INDICE); v.cu = CU;   /* (17-oct-2026) con la previa, lo que dure ella; si no, 32 s */
      if (desde < 300 - CU - INDICE) v.fase = 'entrada';
      else if (desde < 300 - INDICE) { v.fase = 'cuenta'; v.queda = 300 - INDICE - desde; }
      else if (desde < 300) { v.fase = 'indice'; v.queda = 300 - desde; }
      else if (B.length) { v.fase = 'clase'; v.e = e = { arr: t5, i: 0, ini: t5, pac: 0, mg: 0, auto: true }; }
      else v.fase = desde < (DURA + 15) * 60 ? 'sin' : 'nada';
    } else v.fase = 'clase';
    if (v.fase === 'clase') {
      if (!B.length) { v.fase = 'sin'; return v; }
      var a = avanza(e, B, t);
      if (!a) { v.fase = 'nada'; return v; }
      if (a.fin) {
        v.fin = a.finEn; v.i = a.i;
        v.fase = (e.finVisto || t - a.finEn > 15 * 60000) ? 'acabada' : 'fin';
      } else { v.a = a; v.i = a.i; if (a.parada) v.fase = 'parada'; }
      /* (22-oct-2026) ya es la hora de acabar y la escaleta aún no ha llegado a su fin (retraso, pausa o ■): el fin, ya */
      var tFinHora = c.t0 + DURA * 60000;
      if (FIN_A_SU_HORA && (v.fase === 'clase' || v.fase === 'parada') && t >= tFinHora) {
        v.a = undefined; v.fin = tFinHora; v.finHora = true;
        v.fase = e.finVisto ? 'acabada' : 'fin';
      }
    }
    return v;
  }

  /* ---------- las acciones (◀ ⏸ ■ ▶ y el ▶ amarillo) ---------- */
  function accion(q) {
    var t = ahora(), v = vista(t), c = v.c; if (!c) return;
    var B = v.B, e = v.e ? JSON.parse(JSON.stringify(v.e)) : null, a = v.a;
    if (q === 'empezar') {
      if (e && e.arr && e.parada && !PLAY_CON_PREVIA) {   /* (sin PLAY_CON_PREVIA) después de ■: sigue donde estaba */
        var a2 = avanza(e, B, t);
        e.pac = (+e.pac || 0) + (t - (+e.parada)); e.parada = 0; e.pausa = 0;
        if (a2 && !a2.fin) { e.i = a2.i; }
        guardarEstado(c, e); pintar(true); return;
      }
      if (!B.length) return;
      if (PLAY_CON_PREVIA) { empezarConPrevia(c); return; }   /* (20-oct-2026) por la previa */
      e = { arr: t, i: 0, ini: t, pac: 0, mg: 0, pausa: 0, parada: 0 };
      guardarEstado(c, e); cartelPara(0, true); pintar(true); return;
    }
    if (!a || !e) return;
    if (e.auto) { delete e.auto; }
    var base = { arr: e.arr || t, i: a.i, ini: a.ini, pac: +e.pac || 0, mg: a.mg, pausa: +e.pausa || 0, parada: +e.parada || 0 };
    if (q === 'sig') {
      var mg = Math.max(0, a.mg + Math.max(-a.mg, a.resto));   /* lo que sobra (o lo que queda del margen si ya iba en el extra) */
      if (a.i >= B.length - 1) { base.ini = t - B[a.i].m * 60000 - mg * 1000 - 1; base.pac = 0; base.pausa = 0; base.mg = mg; guardarEstado(c, base); pintar(true); return; }
      base.i = a.i + 1; base.ini = t; base.pac = 0; base.mg = mg; base.pausa = 0; guardarEstado(c, base); cartelPara(base.i, true); pintar(true); return;
    }
    if (q === 'ant') {
      if (a.i <= 0) { base.ini = t; base.pac = 0; base.pausa = 0; } else { base.i = a.i - 1; base.ini = t; base.pac = 0; base.pausa = 0; }
      guardarEstado(c, base); cartelPara(base.i, true); pintar(true); return;
    }
    if (q === 'pausa') {
      if (base.pausa) { base.pac += t - base.pausa; base.pausa = 0; } else base.pausa = t;
      guardarEstado(c, base); pintar(true); return;
    }
    if (q === 'parar') {
      if (base.pausa) { base.pac += t - base.pausa; base.pausa = 0; }
      base.parada = t; guardarEstado(c, base); pintar(true); return;
    }
  }
  /* (20-oct-2026) el ▶ por la previa: si la previa aún no está lista, se prepara y se espera como mucho 6 s (el ▶, a media
     luz); luego se apunta { pre: ahora } y la cuenta empieza en ese momento. La previa de esta clase se vuelve a decidir. */
  var EMPIEZA = { k: '', hasta: 0 };
  function empezarConPrevia(c) {
    var k = c.clave;
    if (EMPIEZA.k === k && EMPIEZA.hasta > Date.now()) return;   /* ya se está preparando (otro toque) */
    try { delete PV.modo[k]; delete PV.uso[k]; sessionStorage.removeItem('lm_esc_pv:' + k); } catch (er) {}
    EMPIEZA.k = k; EMPIEZA.hasta = Date.now() + 6500;
    var luz = function (x) { try { if (UI && UI.play) UI.play.style.opacity = x ? '' : '.45'; } catch (er) {} };
    var ya = function () {
      if (EMPIEZA.k !== k || !EMPIEZA.hasta) return;
      EMPIEZA.hasta = 0; luz(true);
      var v = vista(ahora()); if (!v.c || v.c.clave !== k) return;
      guardarEstado(v.c, { pre: ahora(), arr: 0, i: 0, ini: 0, pac: 0, mg: 0, pausa: 0, parada: 0 });
      pintar(true);
    };
    if (!PREVIA_ON || pvLista(c)) { ya(); return; }
    luz(false);
    var n = 0;
    (function mira() {
      if (EMPIEZA.k !== k || !EMPIEZA.hasta) return;
      try { var v = vista(ahora()); if (v.c && v.c.clave === k) pvPrepara(v); } catch (er) {}
      if (pvLista(c) || ++n >= 20) { ya(); return; }
      setTimeout(mira, 300);
    })();
  }
  /* (16-oct-2026, Iago) «PONER FALTAS»: «una especie de nota para mí que sea poner faltas y que yo tenga que darle a check…
     para yo poder salir de esa pantalla tengo que marcar check de que he puesto las faltas». En la pantalla final de C1 y
     de C2 (debajo de las tareas): hasta marcarlo, tocar la pantalla o Escape no la cierran (el check se sacude); marcado,
     «toca para cerrar», como siempre. Si la pantalla se va sola (empieza otra clase), se va igual. No se guarda nada.
     Para quitarlo: FALTAS_PIDE = false. */
  var FALTAS_PIDE = true, FALTAS = false;
  function pintaFaltas() {
    if (!UI || !UI.fF) return;
    if (!FALTAS_PIDE) FALTAS = true;
    ver(UI.fF, FALTAS_PIDE); UI.fF.classList.toggle('on', FALTAS); UI.fF.setAttribute('aria-pressed', FALTAS ? 'true' : 'false');
    txt(UI.fC, FALTAS ? 'toca para cerrar' : 'marca «Poner faltas» para cerrar');
  }
  /* (16-oct-2026, 19:20, Iago: «como en las clases suelo evaluar siempre algún apartado, siempre voy a marcar quién no vino en
     esas apps de corrección… que me aparezcan en la ventana final… y puntos suspensivos por si hay alguno que no he marcado…
     excepción especial para los dictados de grado profesional… que no he corregido de forma manual… o que me hayan enviado
     el dictado con el código QR… tiene que ser algo que se escriba durante la clase») «NO VINIERON: …» en «Fin de la clase»,
     pequeño, encima de «Poner faltas»: lo marcado como «No vino» desde 15 min antes de empezar la clase (dictado GE,
     ritmo GE, entonación GE, ritmo entonado GP) y, en GP, si ese día hubo dictado, los del grupo que ni lo enviaron por el
     QR ni están corregidos a mano. Un alumno, una vez (con su nombre corto). Se vuelve a mirar cada 20 s mientras está la
     pantalla. Lo da la función escaleta_ausentes de la base (SQL que pegó Iago); sin ella, aquí no sale nada.
     Para quitarlo: que ausentes() no haga nada. */
  var AUS = { k: '', t: 0, pidiendo: false, ls: null };
  function ausentes(c) {
    var id = cuenta(); if (!id || !c) return;
    var k = c.clave;
    if (AUS.k !== k) { AUS.k = k; AUS.ls = null; AUS.t = 0; }
    if (AUS.pidiendo || Date.now() - AUS.t < 20000) return;
    AUS.pidiendo = true; AUS.t = Date.now();
    rpc('escaleta_ausentes', { p_cuenta_id: id, p_grupo: c.grupo, p_fecha: c.fecha, p_desde: new Date(c.t0 - 15 * 60000).toISOString() }).then(function (d) {
      if (!(d && d.ok) || AUS.k !== k) return;
      var vistos = {};
      AUS.ls = (Array.isArray(d.alumnos) ? d.alumnos : []).map(function (x) { return nombreCorto(String((x && x.n) || '')); })
        .filter(function (n) { if (!n || vistos[n]) return false; vistos[n] = 1; return true; });
      pintaAusentes();
    }).catch(function () {}).then(function () { AUS.pidiendo = false; });
  }
  function pintaAusentes() {
    if (!UI || !UI.fA) return;
    var ls = AUS.ls; if (!ls) { ver(UI.fA, false); return; }
    /* (22-oct-2026, Iago: «Esos puntos suspensivos… me generan dudas… Pon los alumnos que no haya evaluado y ya está») sin «…»
       al final: la lista ya es la de todos los que marcó como «No vino» (y, en GP, los del dictado sin enviar ni corregir).
       Cada nombre, entero en su línea («Xoán R.», no «Xoán» / «R.») si hay tantos que no caben en una. */
    var h = ls.length ? '<b>' + (ls.length === 1 ? 'No vino' : 'No vinieron') + ':</b> ' +
      ls.map(function (n) { return '<span style="white-space:nowrap">' + esc(n) + '</span>'; }).join(', ') : 'Nadie marcado como «no vino»';
    if (UI.fA.innerHTML !== h) UI.fA.innerHTML = h;
    ver(UI.fA, true);
  }
  function avisaFaltas() { if (!UI || !UI.fF) return; UI.fF.classList.remove('lme-pide'); void UI.fF.offsetWidth; UI.fF.classList.add('lme-pide'); }
  function finVisto() {
    var t = ahora(), v = vista(t); if (!v.c || v.fase !== 'fin') return;
    var e = JSON.parse(JSON.stringify(v.e || {})); delete e.auto; e.finVisto = t; guardarEstado(v.c, e); pintar(true);
  }

  /* ---------- sonido: una salida, despierta durante la clase (la tarjeta de sonido del aula «se dormía») ---------- */
  var AC = null, COMP = null, MASTER = null, ANA = null, RUIDO = null, VIVO = null;
  function audio() {
    try {
      if (AC) { if (AC.state === 'suspended' && AC.resume) AC.resume(); return AC; }
      var C = W.AudioContext || W.webkitAudioContext; if (!C) return null;
      AC = new C();
      COMP = AC.createDynamicsCompressor(); COMP.threshold.value = -16; COMP.knee.value = 8; COMP.ratio.value = 4; COMP.attack.value = 0.003; COMP.release.value = 0.15;
      var lim = AC.createDynamicsCompressor(); lim.threshold.value = -4; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0.001; lim.release.value = 0.08;   /* que nunca sature */
      MASTER = AC.createGain(); MASTER.gain.value = 1;   /* 0 dB: la batería más fuerte que la música de los 30 temas (−10,5 dB) */
      ANA = AC.createAnalyser(); ANA.fftSize = 1024; ANA.smoothingTimeConstant = 0.5;
      COMP.connect(lim); lim.connect(MASTER); MASTER.connect(ANA); ANA.connect(AC.destination);
      var n = AC.createBuffer(1, AC.sampleRate, AC.sampleRate), d = n.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; RUIDO = n;
      return AC;
    } catch (e) { return null; }
  }
  /* un hilo inaudible (20 Hz a −70 dB) mientras dura la clase: la salida no se duerme y el primer golpe no se pierde */
  function despierto(si) {
    try {
      if (si) {
        if (VIVO || !audio() || AC.state !== 'running') return;
        var o = AC.createOscillator(), g = AC.createGain(); o.frequency.value = 20; g.gain.value = 0.0003; o.connect(g); g.connect(AC.destination); o.start(); VIVO = o;
      } else if (VIVO) { try { VIVO.stop(); } catch (e) {} VIVO = null; }
    } catch (e) {}
  }
  function env(g, t, v, dur) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); }
  /* (15-oct-2026, Iago: «la batería la siento muy fuerte… que empiece con un poco de fade in… el sonido lo veo un poco
     cutre»): todo por un bus más bajo (−7,5 dB) que entra en fade-in, con una sala pequeña muy discreta para que no suene
     seca; bombo con cuerpo y golpe, caja de dos tonos con su bordón, charles y platillo «metálicos» (seis cuadradas
     desafinadas, como las cajas de ritmos de siempre) y toms con algo de parche */
  var BUS = null, BUS_V = 0.42;
  function bus() {
    if (BUS) return BUS;
    BUS = AC.createGain(); BUS.gain.value = BUS_V; BUS.connect(COMP);
    try {
      var L = Math.floor(AC.sampleRate * 0.8), ir = AC.createBuffer(2, L, AC.sampleRate);
      for (var ch = 0; ch < 2; ch++) { var d = ir.getChannelData(ch); for (var i = 0; i < L; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / L, 3.5); }
      var cv = AC.createConvolver(), hp = AC.createBiquadFilter(), wet = AC.createGain();
      cv.buffer = ir; hp.type = 'highpass'; hp.frequency.value = 300; wet.gain.value = 0.13;
      BUS.connect(hp); hp.connect(cv); cv.connect(wet); wet.connect(COMP);
    } catch (e) {}
    return BUS;
  }
  function bombo(t, v) {
    var o = AC.createOscillator(), g = AC.createGain(); o.type = 'sine';
    o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(50, t + 0.1);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.003); g.gain.exponentialRampToValueAtTime(v * 0.45, t + 0.09); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
    o.connect(g); g.connect(bus()); o.start(t); o.stop(t + 0.45);
    var c = AC.createOscillator(), gc = AC.createGain(); c.type = 'triangle'; c.frequency.setValueAtTime(1500, t); c.frequency.exponentialRampToValueAtTime(180, t + 0.014);
    gc.gain.setValueAtTime(v * 0.3, t); gc.gain.exponentialRampToValueAtTime(0.0001, t + 0.02); c.connect(gc); gc.connect(bus()); c.start(t); c.stop(t + 0.03);
  }
  function ruidoA(t, v, dur, f0, tipo) {
    var s = AC.createBufferSource(); s.buffer = RUIDO; var f = AC.createBiquadFilter(); f.type = tipo || 'highpass'; f.frequency.value = f0; if (tipo === 'bandpass') f.Q.value = 0.8;
    var g = AC.createGain(); env(g, t, v, dur); s.connect(f); f.connect(g); g.connect(bus()); s.start(t, Math.random() * 0.4); s.stop(t + dur + 0.03);
  }
  function caja(t, v) {
    [[185, 0.42], [330, 0.24]].forEach(function (p) {
      var o = AC.createOscillator(), g = AC.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(p[0], t); o.frequency.exponentialRampToValueAtTime(p[0] * 0.86, t + 0.06);
      env(g, t, v * p[1], 0.11); o.connect(g); g.connect(bus()); o.start(t); o.stop(t + 0.13);
    });
    ruidoA(t, v * 0.7, 0.18, 3000, 'bandpass'); ruidoA(t, v * 0.22, 0.12, 7000);
  }
  function metal(t, v, dur, f0) {
    var g = AC.createGain(), bp = AC.createBiquadFilter(), hp = AC.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = f0; bp.Q.value = 0.7; hp.type = 'highpass'; hp.frequency.value = 6500;
    env(g, t, v, dur); bp.connect(hp); hp.connect(g); g.connect(bus());
    [2, 3, 4.16, 5.43, 6.79, 8.21].forEach(function (r) { var o = AC.createOscillator(); o.type = 'square'; o.frequency.value = 40 * r; o.connect(bp); o.start(t); o.stop(t + dur + 0.03); });
  }
  function charles(t, v, abierto) { metal(t, v * 0.5, abierto ? 0.28 : 0.05, 10000); ruidoA(t, v * 0.18, abierto ? 0.2 : 0.03, 9000); }
  function tom(t, v, f0) {
    var o = AC.createOscillator(), g = AC.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(f0 * 1.15, t); o.frequency.exponentialRampToValueAtTime(f0 * 0.7, t + 0.22);
    env(g, t, v * 0.85, 0.3); o.connect(g); g.connect(bus()); o.start(t); o.stop(t + 0.33); ruidoA(t, v * 0.12, 0.05, 1800, 'bandpass');
  }
  function platillo(t, v) { metal(t, v * 0.45, 1.8, 8000); ruidoA(t, v * 0.3, 1.5, 5500); }
  /* (15-oct-2026, Iago) 21 compases de 4/4 a 120 por minuto (2 s cada uno), del 4:18 al 5:00: la preparación (k de 336 a
     81), un redoblito en el último tiempo que lleva a «Hoy en clase» (4:50, en el 1) y, en el índice, ya sin base (Iago:
     «que sean simplemente efectos»), un tictac suave, cada línea con su «pop» y un cierre sutil, sin platillo. Es la
     reserva: lo normal es la pista de Splice. */
  var PLAN0 = { toques: {}, kb: 8, kIni: 0 };
  function golpe(t, k) {   /* k: semicorcheas que faltan para el 5:00 */
    var pos = (16 - (k % 16)) % 16, cf = Math.floor(k / 16), P = BAT.plan || PLAN0, x = P.toques[k], K_INDICE = BAT.kIni, denso = k <= K_INDICE;
    if (BAT.pista) { if (x) toque(t, x); if (k === 0) BAT.cierre = BAT.fin; return; }   /* con la pista de Splice */
    if (k === 0) { bombo(t, 0.6); tom(t, 0.3, 98); BAT.cierre = BAT.fin; return; }   /* el cierre, sutil: empieza la primera actividad */
    if (x) toque(t, x);
    if (k === BAT.pasos) { bombo(t, 0.9); platillo(t, 0.3); charles(t, 0.2, false); return; }   /* empieza la preparación */
    if (k > K_INDICE && k <= K_INDICE + 4) { caja(t, 0.2 + 0.07 * (K_INDICE + 4 - k)); if (pos === 12) bombo(t, 0.7); return; }   /* un redoblito… */
    if (k <= K_INDICE) { if (k <= K_INDICE - K_SIL && k > K_FIN && k % 2 === 0) charles(t, k % 4 === 0 ? 0.06 : 0.04, false); return; }   /* el índice: silencio y un tictac suave */
    if (pos === 0 || pos === 8) bombo(t, 0.9);
    if (pos === 10 && cf % 2 === 1) bombo(t, 0.62);
    if (pos === 7 && cf % 4 === 0) bombo(t, 0.5);
    if (pos === 4 || pos === 12) caja(t, 0.55);
    if (pos === 15 && cf % 2 === 0) caja(t, 0.12);
    if (denso ? true : pos % 2 === 0) charles(t, (pos % 4 === 0) ? 0.2 : 0.11, false);
    if (pos === 14 && cf % 2 === 1 && !denso) charles(t, 0.13, true);
  }
  /* (15-oct-2026, Iago) «ese índice puede tener soniditos… como en el comienzo de las fichas de teoría»: al salir cada
     línea, dos senos (cada uno un poco más agudo) y un charles abierto; las líneas de la teoría, más flojitas; el descanso,
     más grave, y un «chss» cuando la palabra se deshace en raya */
  function toque(t, x) {
    if (SON.item) {   /* el bubble pop: las líneas tal cual, las de la teoría más agudas y flojas, el descanso más grave */
      if (x.swish) return;
      if (x.sep || x.sub || x.f) suena(SON.item, t, x.sep ? 0.3 : x.sub ? 0.32 : 0.5, x.sep ? 0.85 : x.sub ? 1.12 : 1);   /* el Button Press de Iago */
      if (x.primero) datosSuenan(t, 0, x.hasta);
      if (x.ultimo) cierreSuena(t, 0);
      return;
    }
    if (x.swish) { charles(t, 0.15, true); return; }
    var f = x.f || 392, v = x.sep ? 0.55 : x.sub ? 0.8 : 1.5;
    if (!x.sep && !x.sub) charles(t, 0.13, true);
    [[f, 0, 0.12, 0.1 * v], [f * 1.5, 0.022, 0.14, 0.06 * v]].forEach(function (p) {
      var o = AC.createOscillator(), g = AC.createGain(); o.type = 'sine'; o.frequency.value = p[0];
      g.gain.setValueAtTime(0.0001, t + p[1]); g.gain.exponentialRampToValueAtTime(p[3], t + p[1] + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + p[1] + p[2]);
      o.connect(g); g.connect(COMP); o.start(t + p[1]); o.stop(t + p[1] + p[2] + 0.03);
    });
  }
  var BAT = { vivo: false, id: 0, fin: 0, k: -1, plan: null, cierre: 0, src: null, pista: false, kIni: 0, pasos: Math.round(CUENTA / PASO), datos: null };
  /* (15-oct-2026, Iago) los sonidos de su Splice (en piel/, escaleta-*.mp3): escaleta-previa.mp3 (el loop «alligator», «neutro, eso me
     gusta», + transición de platillo en el índice + break con riser e impacto en el 5:00), escaleta-item.mp3 (un bubble pop seco) y
     escaleta-cambio-1/2.mp3 (los dos «task completed», alternos, en cada cambio de actividad). Se cargan una vez por página. */
  var SON = { pidiendo: false, previa: null, item: null, cambio: [], n: 0, datos: null, cierre: null };
  function cargarSonidos() {
    if (SON.pidiendo || !audio() || !W.fetch) return; SON.pidiendo = true;
    var pide = function (n, ok) {
      fetch(BASE + 'escaleta-' + n + '?v=2026-10-15g').then(function (r) { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
        .then(function (ab) { AC.decodeAudioData(ab, ok, function () {}); }).catch(function () {});
    };
    pide('previa-v7.mp3', function (b) { SON.previa = b; });   /* (15-oct, 18:05) la preparación sola, 32 s: acaba en tensión y corte */
    pide('datos-v7.mp3', function (b) { SON.datos = b; });     /* la carga de datos (se para con la última línea) */
    pide('cierre-v7.mp3', function (b) { SON.cierre = b; });   /* el Touch Activation 3: su último golpe, en el 5:00 */
    pide('item-v6.mp3', function (b) { SON.item = b; });
    pide('cambio-1.mp3', function (b) { SON.cambio[0] = b; });
    pide('cambio-2.mp3', function (b) { SON.cambio[1] = b; });
  }
  function suena(buf, t, v, rate) {   /* un sonido de los de Splice, a su hora */
    var s = AC.createBufferSource(), g = AC.createGain(); s.buffer = buf; if (rate) s.playbackRate.value = rate;
    g.gain.value = v; s.connect(g); g.connect(MASTER); s.start(Math.max(t, AC.currentTime)); return s;
  }
  function datosSuenan(t, off, dur) {   /* la carga de datos, de la primera línea a la última */
    if (!SON.datos || !(dur > 0.05)) return;
    try {
      var s = AC.createBufferSource(), g = AC.createGain(), V = 1; s.buffer = SON.datos; s.connect(g); g.connect(MASTER);
      var t0 = Math.max(t, AC.currentTime), fin = t + dur;
      g.gain.setValueAtTime(V, t0); g.gain.setValueAtTime(V, Math.max(t0, fin - 0.08)); g.gain.linearRampToValueAtTime(0.0001, fin);
      s.start(t0, off + (t0 - t)); s.stop(fin + 0.05); BAT.datos = s;
    } catch (e) {}
  }
  function cierreSuena(t, off) {   /* Iago: «su último golpe, casi hacia el final: ahí se cierra la pantalla… alto» */
    if (!SON.cierre) return;
    try { var s = AC.createBufferSource(), g = AC.createGain(); s.buffer = SON.cierre; g.gain.value = 1; s.connect(g); g.connect(MASTER);
      var d = K_FIN * PASO - GOLPE_CIERRE;   /* que el golpe caiga justo en el 5:00 */
      s.start(Math.max(t + d, AC.currentTime), off); } catch (e) {}
  }
  function empiezaPista(finMs) {   /* la pista de la preparación: acaba (tensión y corte) justo cuando entra «Hoy en clase» */
    if (!SON.previa || BAT.src) return;
    try {
      var ya = AC.currentTime, ini = ya + (finMs - (Math.round(CUENTA / PASO) + BAT.kIni) * PASO * 1000 - ahora()) / 1000, off = Math.max(0, ya - ini);   /* (17-oct-2026) 32 s antes del índice, aunque la cuenta sea más larga */
      if (off > SON.previa.duration - 0.3) return;
      var s = AC.createBufferSource(), g = AC.createGain(); s.buffer = SON.previa; g.gain.value = 1; s.connect(g); g.connect(MASTER);
      s.start(Math.max(ini, ya), off); BAT.src = s; BAT.pista = true;
    } catch (e) {}
  }
  function bateria(finMs, pv) {   /* finMs: la hora (reloj de la escaleta) del último golpe · pv (17-oct-2026): la previa en su marco, { dur, t } */
    if (BAT.vivo && BAT.fin === finMs) { if (!BAT.pista) { if (pv) pvSuena(pv.t); else if (SON.previa) empiezaPista(finMs); } return; }   /* si la pista llega tarde, entra donde vaya */
    if (!audio() || AC.state !== 'running') return;
    callarBateria(true);
    BAT.kIni = (BAT.plan && BAT.plan.kIni) || 0; BAT.pasos = Math.round((pv ? pv.dur : CUENTA) / PASO) + BAT.kIni;
    BAT.vivo = true; BAT.fin = finMs; BAT.k = BAT.pasos; BAT.pista = false; BAT.src = null; BAT.datos = null;
    if (pv) pvSuena(pv.t); else empiezaPista(finMs);
    try {   /* si la página se abre a media carga, la carga (o el cierre) entra por donde vaya */
      var kAhora = (finMs - ahora()) / 1000 / PASO, Pl = BAT.plan;
      if (Pl && Pl.kIni && kAhora < Pl.k0 - 0.5 && kAhora > Pl.kFin + 0.5) datosSuenan(AC.currentTime, (Pl.k0 - kAhora) * PASO, (kAhora - Pl.kFin) * PASO);
      if (Pl && Pl.kIni && kAhora < Pl.kFin - 0.5 && kAhora > 1) cierreSuena(AC.currentTime - (Pl.kFin - kAhora) * PASO, (Pl.kFin - kAhora) * PASO);
    } catch (e) {}
    MASTER.gain.cancelScheduledValues(AC.currentTime); MASTER.gain.setValueAtTime(1, AC.currentTime);
    try {   /* fade-in en los dos primeros compases (si se abre a medias, sigue desde donde vaya) */
      var ya = AC.currentTime, ini = ya + (finMs - BAT.pasos * PASO * 1000 - ahora()) / 1000, b = bus();
      b.gain.cancelScheduledValues(ya);
      if (ya < ini + 4) { b.gain.setValueAtTime(BUS_V * Math.max(0.12, Math.min(1, (ya - ini) / 4)), ya); b.gain.linearRampToValueAtTime(BUS_V, ini + 4); }
      else b.gain.setValueAtTime(BUS_V, ya);
    } catch (e) {}
    var tic = function () {
      if (!BAT.vivo) return;
      if (D.hidden) { callarBateria(true); return; }   /* solo suena la página que se ve (otra pestaña la seguirá) */
      var finAC = AC.currentTime + (BAT.fin - ahora()) / 1000, lim = AC.currentTime + 0.6;   /* 0,6 s por delante: aunque la página vaya cargada, no se descuadra */
      while (BAT.k >= 0) {
        var t = finAC - BAT.k * PASO; if (t > lim) break;
        if (t >= AC.currentTime - 0.008) golpe(Math.max(t, AC.currentTime), BAT.k);
        BAT.k--;
      }
      if (BAT.k < 0) { BAT.vivo = false; clearInterval(BAT.id); }
    };
    clearInterval(BAT.id); BAT.id = setInterval(tic, 40); tic();
  }
  function callarBateria(ya) {
    var estaba = BAT.vivo; BAT.vivo = false; clearInterval(BAT.id);
    if (BAT.src) { try { BAT.src.stop(AC.currentTime + (ya ? 0 : 0.3)); } catch (e) {} BAT.src = null; } BAT.pista = false;
    if (BAT.datos) { try { BAT.datos.stop(AC.currentTime + (ya ? 0 : 0.3)); } catch (e) {} BAT.datos = null; }
    pvCalla(ya);   /* (17-oct-2026) la previa */
    if (!estaba || ya || !AC || !MASTER) return;
    try { var t = AC.currentTime; MASTER.gain.cancelScheduledValues(t); MASTER.gain.setValueAtTime(MASTER.gain.value, t); MASTER.gain.linearRampToValueAtTime(0.0001, t + 0.25);
      setTimeout(function () { try { MASTER.gain.setValueAtTime(1, AC.currentTime); } catch (e) {} }, 400); } catch (e) {}
  }
  /* (16-oct-2026, tarde, Iago: «el sonido… de la actividad… que aparece ocupando toda la pantalla, tiene demasiado volumen…
     bajes el volumen considerablemente, porque es muy invasivo») el aviso del cambio (y su «ding» de reserva, que también
     suena con «Fin de la clase») a un 30 % (unos −10 dB). Antes: 0,5 el «task completed» y el ding entero. */
  var VOL_AVISO = 0.3;
  function cambioSuena() {   /* (Iago) «para cambio de actividad, estos dos intercalándose» */
    var b = SON.cambio[SON.n % 2] || SON.cambio[(SON.n + 1) % 2];
    if (!b || !audio() || AC.state !== 'running') { ding(); return; }
    SON.n++; suena(b, AC.currentTime + 0.02, 0.5 * VOL_AVISO);
  }
  function ding() {
    if (!audio() || AC.state !== 'running') return;
    var t = AC.currentTime + 0.02;
    [[1318.5, 0.16, 1.5], [2637, 0.035, 0.8], [1975.5, 0.03, 1.1]].forEach(function (p) {
      var o = AC.createOscillator(), g = AC.createGain(); o.type = 'sine'; o.frequency.value = p[0];
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(p[1] * VOL_AVISO, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + p[2]);
      o.connect(g); g.connect(MASTER); o.start(t); o.stop(t + p[2] + 0.05);
    });
  }
  /* la salida se abre con el primer toque de la página (sin un toque, el navegador no deja sonar) */
  ['pointerdown', 'keydown'].forEach(function (ev) { D.addEventListener(ev, function () { if (claseAhora(ahora())) { audio(); setTimeout(function () { despierto(true); }, 60); } }, { capture: true, passive: true }); });

  /* ---------- inmersivo: dictado animado, vídeo sonando o pantalla completa de una parte ---------- */
  function visible(el) { try { if (!el || !el.isConnected) return false; var cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden' && el.getClientRects().length > 0; } catch (e) { return false; } }
  function inmersivo() {
    /* (16-oct-2026, tarde, Iago: «durante la reproducción de un vídeo didáctico quiero que la escaleta no se vea… molesta») el
       vídeo abierto desde la tarjeta, didáctico o temático: la tarjeta no se ve; al cerrarlo (✕), vuelve. Antes, con el didáctico se quedaba. */
    var ovv = $('lme-video'); if (ovv) return (ovv.classList.contains('lme-did') && ovv.querySelector('.lme-vcaja')) ? 'vidteoria' : 'pantalla';   /* (20-oct-2026) el didáctico, como el de Teoría: la línea en su margen de arriba */
    /* (20-oct-2026, Iago: «sale el botón de la escaleta… delante de todo… no aparece en su lugar… aquí no tiene sentido») la pantalla
       de Resultados abierta dentro del portal (#lm-marco-app, sección 16 de portal.js): sin tarjeta ni ▶ por encima; con la clase
       en marcha, la línea en el centro de su barra (miniLibro). Para quitarlo: borrar esta línea. */
    var mar = $('lm-marco-app'); if (mar && mar.classList.contains('abierto') && mar.querySelector('.lm-ma-bar')) return 'marco';
    /* (20-oct-2026, Iago: «durante la intro de la carta no aparece la escaleta… no tengo referencia del tiempo que queda») la intro
       de la carta en RITMO at home / RITMO PRO (#introOv): la línea en su barra (miniLibro), sin tarjeta encima */
    var ino = $('introOv'); if (ino && ino.classList.contains('show') && ino.querySelector('.intro-bar')) return 'intro';
    /* (20-oct-2026, Iago: «¿durante los vídeos podía ocupar menos la escaleta? Ojalá cupiese en el margen negro de arriba sin invadir
       el vídeo») el vídeo de Teoría at home / PRO (.apxf-vid): la línea en su margen negro de arriba (miniLibro), sin tarjeta */
    var avo = D.querySelector('.apxf-vid'); if (avo && avo.querySelector('.apxf-vid-caja')) return 'vidteoria';
    /* (21-oct-2026, Iago: «en este vídeo se sigue viendo la escaleta invasiva. He abierto el vídeo manualmente yendo desde Teoría
       at home… también quiero que se comprima arriba para no invadir») el visor de vídeos de las TARJETAS de Teoría at home / PRO
       (▶ de la tarjeta → la lista → el vídeo: .ivg-caja): igual, la línea en el margen de arriba (miniLibro), sin tarjeta */
    if (D.querySelector('.ivg-caja')) return 'vidteoria';   /* (16-oct-2026) vídeo abierto desde la tarjeta: didáctico, la tarjeta se queda; temático, no */
    var fs = D.fullscreenElement || D.webkitFullscreenElement || null;
    var dc = $('dcOverlay'), dictado = !!(dc && visible(dc)), carrusel = /^carrusel-/.test(APP);
    if (fs && fs !== H && fs !== D.body) return 'pantalla';           /* una parte a pantalla completa: la tarjeta no se ve */
    if (fs && (dictado || carrusel)) return 'pantalla';
    if (dictado) return 'dictado';
    if (carrusel) return 'carrusel';
    var vs = D.getElementsByTagName('video');
    for (var i = 0; i < vs.length; i++) { var x = vs[i]; if (!x.paused && !x.ended && x.readyState > 2) return 'video'; }
    return '';
  }
  /* (16-oct-2026, tarde, Iago: «sí que quiero que cuando estamos en dictado animado, cuando cambia la siguiente actividad,
     sí que aparezca el sonido… También con los de grado profesional… ahí sí que quiero que aparezcan la pantalla completa y
     demás») el cartel, su aviso y «Fin de la clase» SÍ salen en el dictado animado (portal GE y GP) y en los carruseles de
     dictado, también a pantalla completa. Siguen sin salir con un vídeo (sonando o abierto desde la tarjeta) o con otra
     cosa a pantalla completa. Antes: nada de esto en lo inmersivo. */
  /* (16-oct-2026, 18:25, Iago: «que también me interrumpa con el sonido y con la pantalla… cuando estamos en libro… estábamos en
     FaActos y cuando acabó el tiempo no me saltó la ventana a pantalla completa… el único lugar en el que no quiero que me
     interrumpa es en los portales interactivos de grado profesional. En el resto, cuando llega el momento, sí que quiero que
     invada la pantalla con el sonidito») el cartel, su aviso y «Fin de la clase» salen en TODAS partes: libros (también a
     pantalla completa), pizarra, dictado animado, carruseles, vídeos… Solo no en los portales interactivos de GP (Acústica,
     Atonalidad, Fonógrafo…: *.gp.lmathome.es, salvo Teoría PRO y los carruseles). La tarjeta de arriba sigue como estaba
     (con un vídeo o algo a pantalla completa, no se ve). Antes (17:20): solo sin nada encima, en el dictado y en los carruseles. */
  var PORTAL_GP_TEMATICO = (function () { try { var h = location.hostname || ''; return /\.gp\.lmathome\.es$/i.test(h) && !/^teoria\.gp\./i.test(h) && !/^carrusel-/.test(APP); } catch (e) { return false; } })();
  function conCartel(inm) { return !PORTAL_GP_TEMATICO; }
  /* lo que ocupa toda la pantalla (cartel, «Fin de la clase»), DENTRO de lo que esté a pantalla completa (el dictado animado
     se pone él solo a pantalla completa y lo de fuera no se vería); si no hay nada, en el body, como siempre */
  function alFrente(el) {
    try {
      var fs = D.fullscreenElement || D.webkitFullscreenElement || null;
      var host = (fs && fs !== H && fs !== D.body && !/^(VIDEO|IFRAME|CANVAS|IMG)$/.test(fs.tagName)) ? fs : D.body;
      /* (16-oct-2026, 18:25) un vídeo (o un marco) a pantalla completa no deja ver nada encima: se sale de la pantalla completa */
      if (fs && host === D.body && fs !== H && fs !== D.body) { try { (D.exitFullscreen || D.webkitExitFullscreen).call(D); } catch (e2) {} }
      if (el && el.parentNode !== host) host.appendChild(el);
    } catch (e) {}
  }

  /* ---------- la pantalla ---------- */
  var F = '"Helvetica Neue",Helvetica,Arial,sans-serif';
  var CSS = '' +
    '#lme-isla{position:fixed;left:50%;top:8px;transform:translateX(-50%);width:300px;box-sizing:border-box;z-index:2147483600;background:rgba(11,19,32,.84);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);' +
      'border:1.5px solid #facc15;border-radius:12px;padding:7px 10px;display:flex;flex-direction:column;gap:3px;color:#fff;text-align:left;font:500 10px/1.2 ' + F + ';-webkit-font-smoothing:antialiased;pointer-events:auto;user-select:none;-webkit-user-select:none}' +
    '#lme-isla[hidden],#lme-play[hidden],.lme-full[hidden]{display:none!important}' +
    '#lme-indice .lme-ilist:empty{display:none}' +
    '#lme-isla.lme-alineada{transform:none;justify-content:space-between;padding:10px 12px}' +
    '#lme-isla *{box-sizing:border-box;margin:0;padding:0;letter-spacing:normal;text-transform:none;font-style:normal;text-shadow:none}' +
    '#lme-isla .lme-ant{font:500 9.5px/1.2 ' + F + ';color:#7d879b;text-decoration:line-through;letter-spacing:.02em;min-height:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:20px}' +
    '#lme-isla .lme-ahora{display:flex;align-items:baseline;gap:8px;min-width:0}' +
    '#lme-isla .lme-t{font:700 11.5px/1.15 ' + F + ';color:#facc15;white-space:nowrap}' +
    '#lme-isla .lme-s{font:500 10px/1.2 ' + F + ';color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}' +
    '#lme-isla .lme-m{margin-left:auto;font:700 11.5px/1 ' + F + ';color:#facc15;white-space:nowrap;font-variant-numeric:tabular-nums}' +
    '#lme-isla .lme-mg{font:600 9.5px/1 ' + F + ';color:#9aa6bb;margin-left:5px}' +
    '#lme-isla .lme-exl{font:700 9.5px/1 ' + F + ';letter-spacing:.08em;text-transform:uppercase;color:#c3cad8;margin-right:5px}' +
    '#lme-isla.lme-extra .lme-m,#lme-isla.lme-pausa .lme-m{color:#c3cad8}' +
    '#lme-isla .lme-barra{display:flex;height:2px;border-radius:1px;background:#3a4560;overflow:hidden;margin:2px 0 3px}' +
    '#lme-isla .lme-barra b{display:block;height:100%;width:0;background:#facc15;flex:none}' +
    '#lme-isla .lme-ex{display:block;height:100%;flex:none;background:#56607a;position:relative}' +
    '#lme-isla .lme-ex i{position:absolute;left:0;top:0;bottom:0;background:#c3cad8}' +
    '#lme-isla .lme-sig{display:flex;align-items:center;gap:8px;font:500 9.5px/1.2 ' + F + ';color:#9aa6bb;letter-spacing:.02em;min-width:0}' +
    '#lme-isla .lme-sigt{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}' +
    '#lme-isla .lme-bts{margin-left:auto;display:flex;gap:4px;flex:none}' +
    '#lme-isla .lme-b{position:relative;width:21px;height:17px;border-radius:5px;border:1px solid #6b5f1f;background:transparent;color:#facc15;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:none;min-width:0;min-height:0}' +
    '#lme-isla .lme-b::after{content:"";position:absolute;inset:-5px -2px}' +   /* más sitio para el dedo, sin que se vea */
    '#lme-isla .lme-b:hover{border-color:#facc15}' +
    '#lme-isla .lme-b svg{width:9px;height:9px;display:block;pointer-events:none}' +
    /* (16-oct-2026, 18:50, Iago: «la escaleta (ya sea la de 3 líneas o la de 1 línea) con un + en la esquina superior derecha y
       cuando le doy, se abre una ventana grande en el centro de la pantalla con toda la escaleta y la actividad presente
       destacada con la info y en la esquina superior derecha un − amarillo para volver a la versión compacta») */
    '#lme-isla .lme-mas{position:absolute;top:4px;right:6px;width:16px;height:16px;border-radius:5px;border:1px solid #8a7a22;background:transparent;color:#facc15;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:none;min-width:0;min-height:0;z-index:1}' +
    '#lme-isla .lme-mas::after{content:"";position:absolute;inset:-6px -6px -3px -8px}' +
    '#lme-isla .lme-mas:hover{border-color:#facc15}' +
    '#lme-isla .lme-mas svg{width:10px;height:10px;display:block;pointer-events:none}' +
    'html #lme-mini{padding-right:28px}' +
    '#lme-mini .lme-mmas{position:absolute;top:3px;right:4px;width:17px;height:17px;pointer-events:auto;border-radius:5px;border:1px solid #8a7a22;background:transparent;color:#facc15;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;margin:0;box-shadow:none;min-width:0;min-height:0;z-index:1}' +
    '#lme-mini .lme-mmas::after{content:"";position:absolute;inset:-3px -4px -10px -8px}' +
    '#lme-mini .lme-mmas:hover{border-color:#facc15}' +
    '#lme-mini .lme-mmas svg{width:10px;height:10px;display:block;pointer-events:none}' +
    '#lme-mini.lme-dic{margin-left:auto;max-width:42%}' +
    '#lm-marco-app .lm-ma-bar{position:relative}#lme-mini.lme-marco{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);height:34px;max-width:min(520px,46vw)}' +
    '#lme-mini.lme-intro{position:absolute;z-index:3;height:36px;margin:0;transform:translateX(-50%)}' +
    '#lme-mini.lme-vid{position:absolute;z-index:2;height:36px;margin:0;transform:translateX(-50%)}' +
    '#lme-mini.lme-ivg{position:fixed;z-index:10001;background:#15140d}' +   /* (21-oct-2026) el visor de las tarjetas de Teoría (.ivg-caja); fondo opaco: detrás, la página de Teoría se transparenta un poco por el velo del visor */   /* (16-oct-2026, 18:50) en la barra del dictado animado, en medio del hueco */
    '#lme-todo-fondo{position:fixed;inset:0;z-index:2147483611;background:rgba(6,9,17,.55)}' +
    '#lme-todo{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2147483612;width:min(820px,calc(100vw - 32px));max-height:min(90vh,calc(100vh - 24px));display:flex;flex-direction:column;overflow:hidden;box-sizing:border-box;' +
      'background:#0b1320;border:2px solid #facc15;border-radius:18px;padding:14px 18px 13px;color:#fff;text-align:left;font:500 15px/1.3 ' + F + ';-webkit-font-smoothing:antialiased;box-shadow:0 24px 70px rgba(0,0,0,.6);user-select:none;-webkit-user-select:none;pointer-events:auto}' +
    '#lme-todo[hidden],#lme-todo-fondo[hidden]{display:none!important}' +
    '#lme-todo *{box-sizing:border-box;margin:0;padding:0;letter-spacing:normal;text-transform:none;font-style:normal;text-shadow:none}' +
    '#lme-todo .lme-tcab{flex:none;display:flex;align-items:baseline;flex-wrap:wrap;gap:6px 14px;padding:2px 52px 9px 4px}' +
    '#lme-todo .lme-ttit{font:800 22px/1.1 ' + F + ';color:#fff}' +
    '#lme-todo .lme-tey{font:700 12px/1.2 ' + F + ';letter-spacing:.2em;text-transform:uppercase;color:#facc15}' +
    '#lme-todo .lme-menos{position:absolute;top:12px;right:12px;width:34px;height:34px;border-radius:9px;border:1.5px solid #facc15;background:transparent;color:#facc15;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:none;min-width:0;min-height:0}' +
    '#lme-todo .lme-menos::after{content:"";position:absolute;inset:-8px}' +
    '#lme-todo .lme-menos:hover{background:rgba(250,204,21,.14)}' +
    '#lme-todo .lme-menos svg{width:16px;height:16px;display:block;pointer-events:none}' +
    '#lme-todo .lme-tl{position:relative;flex:1 1 auto;min-height:0;overflow:auto;overscroll-behavior:contain;list-style:none;display:flex;flex-direction:column;gap:2px}' +
    '#lme-todo .lme-ti{position:relative;flex:none;display:flex;align-items:flex-start;gap:12px;padding:6px 12px 7px;border-radius:12px}' +
    '#lme-todo .lme-tn{flex:none;width:27px;height:27px;border-radius:7px;border:2px solid var(--c);color:var(--c);display:flex;align-items:center;justify-content:center;font:800 13px/1 ' + F + '}' +
    '#lme-todo .lme-tc{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:2px;padding-top:3px}' +
    '#lme-todo .lme-tt{font:700 16.5px/1.2 ' + F + ';color:#fff}' +
    '#lme-todo .lme-ts{font:500 13.5px/1.25 ' + F + ';color:#aab4c6;overflow-wrap:anywhere}' +
    '#lme-todo .lme-tm{flex:none;font:700 14px/1.2 ' + F + ';color:#c3cad8;white-space:nowrap;font-variant-numeric:tabular-nums;padding-top:4px}' +
    '#lme-todo .lme-ti.hecha{opacity:.45}' +
    '#lme-todo .lme-ti.hecha .lme-tt,#lme-todo .lme-ti.hecha .lme-ts,#lme-todo .lme-ti.hecha .lme-tm{text-decoration:line-through}' +
    '#lme-todo .lme-ti.hecha .lme-tn{border-color:#56607a;color:#7d879b}' +
    '#lme-todo .lme-ti.ahora{background:rgba(250,204,21,.1);box-shadow:inset 0 0 0 2px #facc15;padding:10px 14px 15px;margin:3px 0}' +
    '#lme-todo .lme-ti.ahora .lme-tt{font-size:21px;color:#facc15}' +
    '#lme-todo .lme-ti.ahora .lme-ts{font-size:15.5px;color:#e8edf6}' +
    '#lme-todo .lme-ti.ahora .lme-tm{font-size:18px;color:#facc15;padding-top:5px}' +
    '#lme-todo .lme-ti.ahora.extra .lme-tm{color:#c3cad8}' +
    '#lme-todo .lme-ti.ahora .lme-tn{width:31px;height:31px;font-size:15px;background:var(--c);color:#0b1320}' +
    '#lme-todo .lme-tb{position:absolute;left:57px;right:14px;bottom:6px;height:4px;border-radius:2px;background:#3a4560;overflow:hidden}' +
    '#lme-todo .lme-tb b{display:block;height:100%;width:0;background:#facc15}' +
    '#lme-todo .lme-ti.extra .lme-tb b{background:#c3cad8}' +
    '#lme-todo .lme-tvid{align-self:flex-start;margin-top:6px;height:28px;padding:0 13px;border-radius:7px;border:1px solid #facc15;background:rgba(250,204,21,.13);color:#facc15;font:700 14px/1 ' + F + ';cursor:pointer;box-shadow:none;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '#lme-todo .lme-tvid:hover{background:rgba(250,204,21,.25)}' +
    '#lme-todo .lme-tpie{flex:none;margin-top:8px;padding:9px 4px 0;border-top:1px solid rgba(255,255,255,.12);font:500 13.5px/1.4 ' + F + ';color:#9aa6bb}' +
    '#lme-todo .lme-tpie b{color:#fff;font-weight:700}' +
    '#lme-play{position:fixed;z-index:2147483600;width:35px;height:35px;border-radius:50%;border:0;background:#facc15;color:#111;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;margin:0;box-shadow:none}' +   /* (Iago, 18:05) sin resplandor */
    '#lme-play svg{width:14px;height:14px;margin-left:2px;display:block}' +
    /* (16-oct-2026, tarde, Iago: «en el aula se pulsó la campana de notificaciones… el icono de la escaleta, ese círculo con el
       play, aparece en primer plano… no aparece detrás de la ventana») lme-tras-ventana: con la campana (o Mis resultados, u otra
       ventana del portal) abierta, el ▶ y la tarjeta quedan detrás de ella (la ventana va a z-index 90) */
    'html:has(.alu-modal.open,#mr-overlay.open,#amj-modal.open) #lme-play,html:has(.alu-modal.open,#mr-overlay.open,#amj-modal.open) #lme-isla{z-index:80!important}' +
    /* (16-oct-2026, tarde) con un libro abierto (FaActos, Intervalia…), la escaleta va DENTRO del libro, en una línea (#lme-mini):
       en su barra, entre el título («FaActos · Acto 3») y el cambio de página; con «Ampliar», flotando arriba en el centro */
    'html:has(#lb-ov.open) #lme-play,html:has(#lb-ov.open) #lme-isla{display:none!important}' +
    'html.pz-abierto #lme-play,html.pz-abierto #lme-isla{display:none!important}' +   /* (16-oct-2026) la pizarra: la línea, en su barra */
    /* (16-oct-2026, 18:00, Iago: «lo veo todo un poco blanco. Lo pondría negro para que sea la misma estética») en la pizarra,
       la línea en negro con el amarillo de la tarjeta. Antes: fondo blanco y texto oscuro. */
    '#lme-mini.lme-piz{height:34px;max-width:100%;background:#0b1320;color:#fff;border-color:#facc15;border-radius:8px}' +
    '#lme-mini.lme-piz .lme-mt{color:#fff}#lme-mini.lme-piz .lme-mm{color:#facc15}#lme-mini.lme-piz .lme-mb{background:rgba(255,255,255,.14)}#lme-mini.lme-piz .lme-mb b{background:#facc15}' +
    '#lme-mini.lme-piz.lme-extra .lme-mm{color:#fb923c}#lme-mini.lme-piz.lme-extra .lme-mb b{background:#fb923c}' +
    '#lme-mini{position:relative;flex:0 1 auto;min-width:0;max-width:46%;height:40px;box-sizing:border-box;display:flex;align-items:center;gap:9px;padding:0 13px;' +
      'border:1.5px solid #facc15;border-radius:10px;background:rgba(250,204,21,.07);color:#fff;font:600 13px/1 ' + F + ';white-space:nowrap;overflow:hidden;' +
      '-webkit-font-smoothing:antialiased;user-select:none;-webkit-user-select:none;pointer-events:none}' +
    '#lme-mini[hidden]{display:none!important}' +
    '#lme-mini .lme-mt{font-weight:700;color:#fff;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:0 1 auto}' +
    '#lme-mini .lme-mm{font-weight:800;color:#facc15;font-variant-numeric:tabular-nums;flex:none}' +
    '#lme-mini .lme-ms{font-weight:500;font-size:11.5px;color:#9aa6bb;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:0 2 auto}' +
    '#lme-mini .lme-mb{position:absolute;left:0;right:0;bottom:0;height:2px;background:rgba(255,255,255,.12)}' +
    '#lme-mini .lme-mb b{display:block;height:100%;width:0;background:#facc15}' +
    '#lme-mini.lme-extra .lme-mm{color:#fb923c}#lme-mini.lme-extra .lme-mb b{background:#fb923c}' +
    '#lme-mini.lme-flota{position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:6;max-width:min(620px,56vw);' +
      'background:rgba(11,19,32,.86);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-shadow:0 6px 22px rgba(0,0,0,.35)}' +
    /* (16-oct-2026) vídeo: el botón de la tarjeta y el vídeo a pantalla completa (la ✕, arriba en el centro: los portales tienen botones en las esquinas) */
    '#lme-isla .lme-vrow{display:flex;min-width:0;margin:1px 0 0}' +
    '#lme-isla .lme-vrow[hidden]{display:none}' +
    '#lme-isla .lme-vid{max-width:100%;height:18px;padding:0 9px;border-radius:5px;border:1px solid #facc15;background:rgba(250,204,21,.13);color:#facc15;font:700 10px/1 ' + F + ';letter-spacing:.02em;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:none;min-width:0}' +
    '#lme-isla .lme-vid:hover{background:rgba(250,204,21,.25)}' +
    '#lme-video{position:fixed;inset:0;z-index:2147483646;background:#000;display:block;margin:0;padding:0}' +
    '#lme-video iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:#000}' +
    '#lme-video .lme-vx{position:absolute;top:8px;left:50%;transform:translateX(-50%);width:36px;height:36px;border-radius:10px;border:1px solid rgba(255,255,255,.4);background:rgba(11,19,32,.72);color:#fff;font:700 17px/1 ' + F + ';cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:.5;transition:opacity .2s;padding:0;margin:0;box-shadow:none}' +
    '#lme-video .lme-vx:hover{opacity:1}' +
    /* (16-oct-2026, tarde) didáctico: por debajo de la tarjeta (que sigue arriba) y la ✕ a la derecha */
    '#lme-video.lme-did{z-index:2147483590}' +
    '#lme-video.lme-did .lme-vx{left:auto;right:14px;top:14px;transform:none}' +
    /* (20-oct-2026) el didáctico, como el vídeo de Teoría: caja 16:9 centrada sobre negro, ✕ arriba a la derecha */
    '#lme-video.lme-did{background:#050403;display:flex;align-items:center;justify-content:center}' +
    '#lme-video .lme-vcaja{position:relative;width:min(92vw,calc(86vh*16/9));height:min(51.75vw,86vh);background:#000;border:1px solid rgba(255,255,255,.22);border-radius:14px;overflow:hidden}' +
    '#lme-video.lme-did .lme-vx{right:16px;width:40px;height:40px;opacity:.85}' +
    '.lme-full{position:fixed;inset:0;z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:16px;color:#fff;font-family:' + F + ';-webkit-font-smoothing:antialiased;' +
      'background:linear-gradient(rgba(6,9,17,.84),rgba(6,9,17,.84)),url("' + BASE + 'fondo-apaisado.jpg") center/cover #070b14;transition:opacity .45s ease,transform .45s ease;transform-origin:50% 6%;user-select:none;-webkit-user-select:none;cursor:default}' +
    '.lme-full *{box-sizing:border-box;margin:0;padding:0;letter-spacing:normal;text-transform:none;font-style:normal}' +
    '.lme-full.lme-recoge{opacity:0;transform:scale(.22)}' +
    '.lme-full .lme-ey{font:700 15px/1 ' + F + ';letter-spacing:.3em;text-transform:uppercase;color:#9aa6bb}' +
    '.lme-full .lme-barra5{position:absolute;left:0;right:0;bottom:0;height:6px;background:#1c2232}' +
    '#lme-indice .lme-carga{position:absolute;left:0;right:0;bottom:22px;display:flex;align-items:baseline;justify-content:center;gap:10px;font:700 15px/1 ' + F + ';letter-spacing:.24em;text-transform:uppercase;color:rgba(255,255,255,.72)}' +
    '#lme-indice .lme-carga-t{letter-spacing:.24em;text-transform:uppercase}' +
    '#lme-indice .lme-carga-d{display:inline-flex;gap:5px;margin-left:-4px}' +
    '#lme-indice .lme-carga-d i{width:5px;height:5px;border-radius:50%;background:#facc15;opacity:.25;animation:lmePunto 1.2s infinite}' +
    '#lme-indice .lme-carga-d i:nth-child(2){animation-delay:.2s}#lme-indice .lme-carga-d i:nth-child(3){animation-delay:.4s}' +
    '#lme-indice .lme-carga-p{min-width:4.2em;text-align:left;color:#facc15;font-variant-numeric:tabular-nums;letter-spacing:.06em}' +
    '#lme-indice .lme-barra5 b{position:relative;overflow:hidden;box-shadow:0 0 14px rgba(250,204,21,.55);transition:width .26s linear}' +
    '#lme-indice .lme-barra5 b::after{content:"";position:absolute;top:0;bottom:0;left:-110px;width:110px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.8),rgba(255,255,255,0));animation:lmeBrillo 1.1s linear infinite}' +
    '@keyframes lmeBrillo{to{left:100%}}' +
    '#lme-indice .lme-barra5,#lme-cartel .lme-barra5,#lme-cuenta .lme-barra5{display:none!important}' +   /* (Iago, 17:45 y 19:10) sin rayas amarillas abajo, tampoco en la preparación */
    '#lme-indice .lme-carga{align-items:center;gap:12px;color:#fff;bottom:26px}' +   /* (Iago, 18:05) «Cargando actividades» en blanco y el circulito amarillo */
    '#lme-indice .lme-spin{width:22px;height:22px;flex:none;animation:lmeGira 1.4s linear infinite}' +
    '#lme-indice .lme-spin circle{fill:none;stroke:#facc15;stroke-width:5;stroke-linecap:round;stroke-dasharray:1,150;stroke-dashoffset:0;animation:lmeCome 1.4s ease-in-out infinite}' +
    '@keyframes lmeGira{to{transform:rotate(360deg)}}' +
    '@keyframes lmeCome{0%{stroke-dasharray:1,150;stroke-dashoffset:0}50%{stroke-dasharray:90,150;stroke-dashoffset:-35}100%{stroke-dasharray:90,150;stroke-dashoffset:-124}}' +
    '@keyframes lmeSale{to{opacity:0;transform:translateY(6px)}}' +
    '@keyframes lmePunto{0%,100%{opacity:.25}40%{opacity:1}}' +
    '.lme-full .lme-barra5 b{display:block;height:100%;width:0;background:#facc15}' +
    /* (15-oct-2026, tarde, Iago) «que el tiempo aparezca en amarillo, que el texto de preparamos el libro de ritmo y el lápiz
       sea en blanco y las animaciones de las barras de abajo sean en amarillo» */
    '#lme-cuenta .lme-num{font:800 200px/.9 ' + F + ';font-variant-numeric:tabular-nums;letter-spacing:-.02em;color:#facc15}' +
    '#lme-cuenta .lme-num .lme-dp{color:#fff;margin:0 .03em;position:relative;top:-.09em}' +   /* (Iago) «los dos puntos, blancos» */
    '#lme-cuenta .lme-frase{font:800 54px/1.05 ' + F + ';color:#fff}' +
    '#lme-cuenta canvas{display:block;width:420px;height:44px;margin-top:12px}' +
    '#lme-cuenta .lme-rec{max-width:min(1000px,86vw);margin-bottom:16px;padding:10px 22px 10px 16px;border-radius:14px;background:none;border:1.5px solid rgba(167,139,250,.6);display:flex;align-items:center;gap:14px;text-align:left}' +   /* (Iago) «solo contorno y con icono de recordatorio minimalista» */
    '#lme-cuenta .lme-rec[hidden]{display:none!important}' +
    '#lme-cuenta .lme-rec-ic{flex:none;width:24px;height:24px;color:#a78bfa}' +
    '#lme-cuenta .lme-rec-ls{display:flex;flex-direction:column;gap:4px;min-width:0}' +
    '#lme-cuenta .lme-rec-i{font:500 19px/1.3 ' + F + ';color:rgba(255,255,255,.78);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}' +
    '#lme-cuenta .lme-rec-i b{font-weight:700;color:#fff}' +
    '#lme-indice{gap:0}' +
    '#lme-indice .lme-ey{animation:lmeSube .5s ease both}' +
    '#lme-indice .lme-itit{font:800 80px/1 ' + F + ';color:#fff;letter-spacing:-.01em;margin:14px 0 34px;animation:lmeSube .6s .1s cubic-bezier(.2,.8,.25,1) both}' +
    '#lme-indice .lme-ilist{list-style:none;display:flex;flex-direction:column;gap:12px;min-width:520px;max-width:86vw;text-align:left}' +
    '#lme-indice .lme-ii{display:flex;align-items:center;gap:18px;font:700 30px/1.2 ' + F + ';color:#fff;opacity:0;animation:lmeSube .5s cubic-bezier(.2,.8,.25,1) both}' +
    '#lme-indice .lme-ii b{flex:none;box-sizing:border-box;width:40px;height:40px;border-radius:11px;border:2.5px solid var(--c);color:var(--c);display:flex;align-items:center;justify-content:center;font:800 19px/1 ' + F + '}' +
    '#lme-indice .lme-ii span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '#lme-indice .lme-ii>b{animation:lmeCaja .5s cubic-bezier(.3,1.5,.5,1) both;animation-delay:inherit}' +
    '#lme-indice .lme-ii>span{animation:lmeCarga .55s cubic-bezier(.3,.75,.3,1) both;animation-delay:inherit}' +
    '#lme-indice .lme-imulti{align-items:flex-start}' +
    '#lme-indice .lme-imulti span{white-space:normal;overflow:visible}' +
    '#lme-indice .lme-il{display:block;font:600 25px/1.3 ' + F + ';font-style:normal;color:#dbe3ee;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:5px;opacity:0;animation:lmeSube .4s cubic-bezier(.2,.8,.25,1) both,lmeCarga .45s cubic-bezier(.3,.75,.3,1) both}' +
    '#lme-indice.lme-apretado .lme-itit{font-size:64px;margin:10px 0 22px}' +
    '#lme-indice.lme-apretado .lme-ilist{gap:8px}' +
    '#lme-indice.lme-apretado .lme-ii{font-size:26px}' +
    '#lme-indice.lme-apretado .lme-il{font-size:21px;margin-top:3px}' +
    '#lme-indice .lme-isep{position:relative;display:block;height:34px;margin-left:58px;opacity:0;animation:lmeSube .45s var(--d1) cubic-bezier(.2,.8,.25,1) both}' +
    '#lme-indice .lme-sw{position:absolute;left:0;top:50%;transform:translateY(-50%);display:flex;font:600 24px/1 ' + F + ';color:rgba(250,204,21,.9)}' +
    '#lme-indice .lme-sw i{display:block;font-style:normal;padding:0 1px;animation:lmeLetra .3s calc(var(--d2) + var(--k) * .04s) ease forwards}' +
    '#lme-indice .lme-sr{position:absolute;left:0;right:0;top:50%;height:2px;margin-top:-1px;background:repeating-linear-gradient(90deg,rgba(250,204,21,.8) 0 10px,transparent 10px 18px);transform:scaleX(0);transform-origin:0 50%;animation:lmeRaya .75s var(--d2) cubic-bezier(.3,.7,.3,1) forwards}' +
    '@keyframes lmeLetra{to{opacity:0;transform:translateY(-7px) scale(.7)}}' +
    '@keyframes lmeRaya{0%{transform:scaleX(0)}100%{transform:scaleX(1)}}' +
    '@keyframes lmeSube{0%{opacity:0;transform:translateY(18px)}100%{opacity:1;transform:none}}' +
    '@keyframes lmeCaja{0%{opacity:0;transform:scale(.3)}60%{opacity:1;transform:scale(1.14)}100%{opacity:1;transform:none}}' +
    '@keyframes lmeCarga{0%{clip-path:inset(0 100% 0 0)}100%{clip-path:inset(0 0 0 0)}}' +
    '@media (prefers-reduced-motion:reduce){#lme-indice *{animation:none!important;opacity:1!important}}' +
    '#lme-cartel .lme-tit{font:800 150px/.92 ' + F + ';color:#facc15;letter-spacing:-.01em;white-space:nowrap}' +
    '#lme-cartel .lme-sub{font:500 36px/1.2 ' + F + ';color:#fff;max-width:88vw}' +
    /* (19-oct-2026) la nota del apartado («Recordar los matices»), debajo, con la misma letra que el subtítulo (la de «empieza …» en
       Intervalia y FaActos; Iago: «aprovecharía ese diseño que ya tenemos») */
    '#lme-cartel .lme-nota{font:500 36px/1.2 ' + F + ';color:#fff;max-width:88vw;text-shadow:0 2px 16px rgba(0,0,0,.8),0 0 2px rgba(0,0,0,.6)}' +
    '#lme-cartel .lme-nota[hidden],#lme-cartel.lme-descanso .lme-nota{display:none}' +
    '#lme-cartel .lme-mi{font:700 24px/1 ' + F + ';color:#9aa6bb;margin-top:4px}' +
    '#lme-cartel .lme-mi b{color:#fff;font-weight:700}' +
    /* (16-oct-2026, Iago) «que no se oscurezca del todo… que se pueda intuir lo que hay detrás»: el cartel y el fin, velados (sin la foto) */
    '#lme-cartel.lme-full,#lme-fin.lme-full{background:rgba(6,9,17,.58);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px)}' +
    '#lme-cartel .lme-ey,#lme-cartel .lme-tit,#lme-cartel .lme-sub,#lme-cartel .lme-mi,#lme-fin .lme-ey,#lme-fin .lme-tit,#lme-fin .lme-tareas{text-shadow:0 2px 16px rgba(0,0,0,.8),0 0 2px rgba(0,0,0,.6)}' +
    '#lme-cartel .lme-ir{margin-top:14px;font:600 19px/1 ' + F + ';color:#e8edf6;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.4);border-radius:10px;padding:10px 20px;cursor:pointer;box-shadow:none;pointer-events:auto;letter-spacing:.02em}' +
    '#lme-cartel .lme-ir span{margin-left:6px;font-weight:700;color:#facc15}' +
    '#lme-cartel .lme-ir:hover{background:rgba(255,255,255,.16);border-color:#facc15}' +
    '#lme-cartel .lme-ir[hidden]{display:none}' +
    /* (16-oct-2026, 19:00) el descanso: la cuenta atrás y «Después: …»; sin desenfoque (está mucho rato y el PC del aula va justo) */
    '#lme-cartel .lme-reloj{display:none;font:800 210px/.9 ' + F + ';font-variant-numeric:tabular-nums;letter-spacing:-.02em;color:#facc15;margin:8px 0 6px}' +
    '#lme-cartel .lme-reloj .lme-dp{color:#fff;margin:0 .03em;position:relative;top:-.09em}' +
    '#lme-cartel.lme-descanso .lme-reloj{display:block}' +
    '#lme-cartel.lme-descanso.lme-full{background:rgba(6,9,17,.8);-webkit-backdrop-filter:none;backdrop-filter:none}' +
    '#lme-cartel.lme-descanso .lme-tit{color:#fff}' +
    '#lme-cartel.lme-descanso .lme-sub{font-size:26px;color:#c3cad8}' +
    '#lme-cartel.lme-descanso .lme-mi{font:600 40px/1.15 ' + F + ';color:#9aa6bb;max-width:88vw;margin-top:12px}' +
    '#lme-cartel.lme-descanso .lme-mi b{color:#fff;font-weight:800}' +
    '#lme-fin .lme-tit{font:800 116px/.95 ' + F + ';letter-spacing:-.01em}' +
    '#lme-fin .lme-tareas{margin-top:18px;min-width:560px;max-width:86vw;text-align:left;background:rgba(11,19,32,.72);border:1.5px solid #facc15;border-radius:16px;padding:18px 26px 14px}' +
    '#lme-fin .lme-tareas h3{font:800 13px/1 ' + F + ';letter-spacing:.28em;text-transform:uppercase;color:#facc15;margin-bottom:6px}' +
    '#lme-fin .lme-tarea{display:flex;align-items:center;gap:14px;font:700 26px/1.25 ' + F + ';color:#fff;padding:11px 0;border-top:1px solid rgba(255,255,255,.1)}' +
    '#lme-fin .lme-tarea:first-of-type{border-top:0}' +
    '#lme-fin .lme-tarea i{flex:none;width:12px;height:12px;border-radius:3px;background:#9aa6bb}' +
    '#lme-fin .lme-tarea.ritmo i{background:#22c55e}#lme-fin .lme-tarea.teoria i{background:#ec4899}#lme-fin .lme-tarea.entonacion i{background:#3b82f6}#lme-fin .lme-tarea.dictado i{background:#f97316}' +
    '#lme-fin .lme-cerrar{position:absolute;right:26px;bottom:24px;font:600 13px/1 ' + F + ';color:#6b7487}' +
    /* (16-oct-2026) «Poner faltas» */
    /* (16-oct-2026, 18:00, Iago: «el recordatorio de las faltas y el check pueden ocupar poquito, ser pequeños para mí, pero ellos
       tienen que ver ahí las tareas») pequeño, abajo a la izquierda; lo grande son las tareas. Antes: debajo de las tareas, a 26 px. */
    '#lme-fin .lme-faltas{position:absolute;left:24px;bottom:18px;display:flex;align-items:center;gap:8px;margin:0;padding:7px 12px 7px 8px;background:rgba(11,19,32,.6);border:1px solid rgba(255,255,255,.35);border-radius:10px;color:#cbd2de;font:600 13px/1 ' + F + ';cursor:pointer;pointer-events:auto;box-shadow:none;text-shadow:none}' +
    '#lme-fin .lme-faltas[hidden]{display:none}' +
    /* (16-oct-2026, 19:25, Iago: «lo de poner faltas… quiero que esté abajo centrado, un poco más grande… que sea siempre igual.
       Si hay tareas, que haya hueco para las tareas, pero abajo de todo, en el centro, lo de poner las faltas y… los alumnos»)
       el PIE de «Fin de la clase»: abajo en el centro, «Poner faltas» más grande y, a su lado, «No vinieron: …». Antes: abajo
       a la izquierda y pequeño. */
    '#lme-fin .lme-pie{position:absolute;left:50%;bottom:26px;transform:translateX(-50%);display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:10px 20px;width:max-content;max-width:92vw}' +
    '#lme-fin .lme-pie .lme-faltas{position:static;font-size:17px;gap:11px;padding:10px 18px 10px 12px;border-radius:12px}' +
    '#lme-fin .lme-pie .lme-faltas b{width:23px;height:23px;border-radius:6px;border-width:2px}' +
    '#lme-fin .lme-pie .lme-faltas.on b::after{left:6px;top:1.5px;width:6px;height:12px;border-width:0 3px 3px 0}' +
    '#lme-fin .lme-aus{max-width:min(760px,62vw);text-align:left;font:500 17px/1.35 ' + F + ';color:#cbd2de;text-shadow:0 2px 10px rgba(0,0,0,.7);pointer-events:none}' +
    '#lme-fin .lme-aus[hidden]{display:none}' +
    '#lme-fin .lme-aus b{color:#fff;font-weight:700}' +
    '#lme-fin .lme-faltas b{flex:none;position:relative;width:18px;height:18px;border-radius:5px;border:1.5px solid #facc15;box-sizing:border-box}' +
    '#lme-fin .lme-faltas:hover{border-color:#facc15}' +
    '#lme-fin .lme-faltas.on{border-color:#22c55e;color:#bbf7d0}' +
    '#lme-fin .lme-faltas.on b{border-color:#22c55e;background:#22c55e}' +
    '#lme-fin .lme-faltas.on b::after{content:"";position:absolute;left:4.5px;top:1px;width:4.5px;height:9px;border:solid #0b1320;border-width:0 2.5px 2.5px 0;transform:rotate(45deg)}' +
    '#lme-fin .lme-faltas.lme-pide{animation:lmeFaltas .5s ease}' +
    '@keyframes lmeFaltas{0%,100%{transform:none}20%{transform:translateX(-6px)}40%{transform:translateX(5px)}60%{transform:translateX(-4px)}80%{transform:translateX(2px)}}' +
    'html.lm-esc-on.lm-fam-portal #lm-fmt-centro{visibility:hidden!important}' +   /* (16-oct-2026) la píldora «Digital/papel» quedaba debajo de la tarjeta */
    /* (16-oct-2026, 18:50) sin transición: la fila se aparta de golpe (con pocos fotogramas, en el aula, iba a tirones) */
    'html.lm-esc-on.lm-fam-portal .hero{margin-top:64px!important}' +   /* en el portal, el logo baja lo justo mientras está la tarjeta */
    '.lme-ic{outline:2px solid #facc15!important;outline-offset:2px!important}' +
    /* (15-oct-2026, 19:10, Iago: «el contorno amarillo… quiero que esté visible aunque la notificación de ritmo esté ya gris,
       porque ya la he hecho») la tarjeta (y la fila) gris que lleva la lección de hoy recupera su color mientras toca */
    /* (20-oct-2026) antes aquí, con :has(): la tarjeta y la fila grises de la lección recuperaban TODO su color (y en algunos
       navegadores no hacía nada). Ahora el gris se aparta solo del contorno: grisDebajo(), en iconoActivo. */
    /* (15-oct-2026, 19:10, Iago: «pulso el botón de libro… la ventana en la que elijo el libro aparece detrás de la escaleta»)
       mientras está abierto un menú de los botones de arriba (o la lista de morosos), la tarjeta de la escaleta se aparta */
    'html:has(.lm-ic-menu) #lme-isla,html:has(.lm-mor-panel) #lme-isla{opacity:0!important;pointer-events:none!important;transition:opacity .15s}' +
    /* (17-oct-2026) la previa del aula, en su marco (a pantalla completa, por encima de todo); «Saltar», discreto, al mover el ratón */
    '#lme-previa{position:fixed;inset:0;z-index:2147483647;background:#000;visibility:hidden;pointer-events:none;margin:0;padding:0;border:0}' +
    '#lme-previa.lme-on{visibility:visible;pointer-events:auto;cursor:default}' +
    '#lme-previa iframe{position:absolute;left:0;top:0;width:100%;height:100%;max-width:none;border:0;margin:0;padding:0;display:block;pointer-events:none;background:#000}' +
    '#lme-previa .lme-pv-saltar{position:absolute;right:18px;bottom:16px;margin:0;padding:9px 16px;border-radius:999px;border:1.5px solid rgba(255,255,255,.3);background:rgba(6,9,17,.6);color:rgba(255,255,255,.85);font:700 15px/1 ' + F + ';letter-spacing:.02em;text-transform:none;cursor:pointer;opacity:0;transition:opacity .3s;box-shadow:none;min-width:0;min-height:0;width:auto;height:auto}' +
    '#lme-previa .lme-pv-saltar.lme-on{opacity:1}' +
    '@media (prefers-reduced-motion:reduce){.lme-full{transition:none}}' +
    /* (15-oct-2026, Iago) EDITORES EN EL AULA (lecciones de ritmo y libro de entonación; esto solo se carga con Tester /
       Protester, y solo en pantallas anchas): arriba a la izquierda solo la tonalidad, arriba en el centro el hueco de la
       escaleta, arriba a la derecha vistas · pantalla completa · ✕; las herramientas de escribir, en una columna pegada al
       borde izquierdo; en entonación, los 12 intervalos en esa columna (con su scroll) y punta fina, alerta, nota, goma,
       deshacer y borrar arriba a la derecha. A los alumnos, en su casa, les sale como siempre. */
    '@media (min-width:901px){' +
      'html.lm-fam-portal .lm-vl-bar.lm-vl-aula{padding:8px 12px}' +
      'html.lm-esc-on.lm-fam-portal .lm-vl-bar.lm-vl-aula{min-height:89px}' +
      'html.lm-fam-portal .lm-vl-bar.lm-vl-aula .lm-vl-sep.s1{display:none}' +
      'html.lm-fam-portal .lm-vl-bar.lm-vl-aula .lm-vl-her{position:absolute;left:8px;top:calc(100% + 8px);z-index:7;flex-direction:column;flex-wrap:nowrap;align-items:center;' +
        'overflow:visible;touch-action:manipulation;padding:6px;gap:var(--vl-gap);background:rgba(11,19,32,.92);border:1px solid rgba(255,255,255,.14);border-radius:12px;' +
        '-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}' +
      'html.lm-fam-portal .lm-vl-bar.lm-vl-aula .lm-vl-her .lm-vl-sep{width:calc(var(--vl-b) * .6);height:1px;margin:2px 0}' +
      'html.lm-fam-portal #lm-ento .lm-vl-bar.lm-vl-aula .lm-vl-her{max-height:calc(100vh - 120px);overflow-y:auto;overscroll-behavior:contain}' +
      'html.lm-fam-portal #lm-ento .lm-vl-bar.lm-vl-aula .lm-vl-her .lm-vl-sep{display:none}' +
      'html.lm-fam-portal #lm-ento .lm-vl-bar.lm-vl-aula .lm-en-her2{display:flex;align-items:center;gap:var(--vl-gap);flex:none;margin-right:4px}' +
    '}';
  var SVG = {
    ant: '<svg viewBox="0 0 24 24"><path d="M16 5L8 12l8 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    pausa: '<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>',
    seguir: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15L19.5 12z" fill="currentColor"/></svg>',
    parar: '<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>',
    sig: '<svg viewBox="0 0 24 24"><path d="M8 5l8 7-8 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15L19.5 12z" fill="currentColor"/></svg>',
    mas: '<svg viewBox="0 0 24 24"><path d="M12 4.5v15M4.5 12h15" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/></svg>',   /* (16-oct-2026) + */
    menos: '<svg viewBox="0 0 24 24"><path d="M4.5 12h15" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/></svg>' };
  /* (16-oct-2026) vídeo: se abre aquí mismo, a pantalla completa; ✕ (arriba en el centro) o Esc para volver */
  var VID_ACTUAL = null;
  /* (20-oct-2026, Iago: «el botón de play de la tarjeta de la escaleta lo que abra quiero que sea igual, vamos, a unificar») el vídeo
     didáctico, como los de Teoría: en una caja 16:9 sobre negro y la escaleta en una línea en el margen de arriba. Para quitarlo: false */
  var VID_CAJA = true;
  function abrirVideo(vd) {
    if (!vd || !vd.u) return;
    cerrarVideo(true);
    var ov = D.createElement('div'); ov.id = 'lme-video';
    /* (16-oct-2026, tarde, Iago) didáctico: la tarjeta sigue arriba, «en segundo plano»; temático (un portal): a pantalla
       completa y la tarjeta desaparece */
    ov.className = vd.tema ? 'lme-tema' : 'lme-did';
    var ifr = '<iframe allow="autoplay; fullscreen; microphone" allowfullscreen title="' + esc(vd.t) + '"></iframe>';
    ov.innerHTML = ((!vd.tema && VID_CAJA) ? '<div class="lme-vcaja">' + ifr + '</div>' : ifr) +   /* (20-oct-2026) la caja, como en Teoría */
      '<button type="button" class="lme-vx" title="Volver (Esc)" aria-label="Volver">✕</button>';
    ov.querySelector('iframe').src = vd.u;
    ov.querySelector('.lme-vx').addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); cerrarVideo(); });
    ['click', 'mousedown', 'pointerdown', 'touchstart', 'wheel'].forEach(function (ev) { ov.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true }); });
    D.body.appendChild(ov);
    if (vd.tema) try {
      var rq = ov.requestFullscreen || ov.webkitRequestFullscreen;
      if (rq) { var p = rq.call(ov); if (p && p.then) p.then(function () { ov.__fs = 1; }, function () {}); else ov.__fs = 1; }
    } catch (e) {}
    try { ov.querySelector('iframe').focus(); } catch (e) {}
    pintar(true);
  }
  function cerrarVideo(sinPintar) {
    var ov = $('lme-video'); if (!ov) return;
    ov.__cerrando = 1;
    try {
      var fs = D.fullscreenElement || D.webkitFullscreenElement;
      if (fs && (fs === ov || ov.contains(fs))) { var ex = D.exitFullscreen || D.webkitExitFullscreen; if (ex) { var p = ex.call(D); if (p && p.catch) p.catch(function () {}); } }
    } catch (e) {}
    if (ov.parentNode) ov.parentNode.removeChild(ov);
    if (!sinPintar) pintar(true);
  }
  var UI = null;
  /* ---------- (16-oct-2026, 18:50, Iago) LA ESCALETA ENTERA, EN UNA VENTANA ----------
     «un botón… que esté todo el rato presente, en el que se vea toda la escaleta… los ejercicios que ya hicimos, tachados,
     los que quedan, la información que hay» · «un + amarillo en una esquina» · «se abre una ventana grande en el centro de
     la pantalla con toda la escaleta y la actividad presente destacada con la info y en la esquina superior derecha un −
     amarillo para volver a la versión compacta». El + de la tarjeta (o el de la línea de los libros, la pizarra y el
     dictado animado) la abre; el −, tocar fuera o Esc la cierran. Lo hecho, tachado; lo de ahora, destacado: todo lo que
     trae del iPad, lo que le queda y su barra (y su vídeo, si tiene); lo que falta, con sus minutos. Abajo: lo que queda, a
     qué hora acabaría y a qué hora acaba la clase. Se pone al día sola; se cierra sola al acabar la clase.
     Para quitarla: borrar este bloque y lo marcado «(16-oct-2026) +». */
  var TODO = { abierto: false, el: null, fondo: null, firma: '', B: null };
  function hhmm(ms) { var g = galicia(ms); return Math.floor(g.seg / 3600) + ':' + ('0' + Math.floor((g.seg % 3600) / 60)).slice(-2); }
  function anfitrion() {   /* dentro de lo que esté a pantalla completa (libro, dictado…), si no es un vídeo; si no, en el body */
    var fs = D.fullscreenElement || D.webkitFullscreenElement || null;
    return (fs && fs !== H && fs !== D.body && !/^(VIDEO|IFRAME|CANVAS|IMG)$/.test(fs.tagName)) ? fs : D.body;
  }
  function montarTodo() {
    if (TODO.el) return TODO.el;
    var fo = D.createElement('div'); fo.id = 'lme-todo-fondo'; fo.hidden = true;
    var el = D.createElement('div'); el.id = 'lme-todo'; el.hidden = true; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'La escaleta de hoy');
    el.innerHTML = '<button type="button" class="lme-menos" title="Volver a la escaleta compacta" aria-label="Volver a la escaleta compacta">' + SVG.menos + '</button>' +
      '<div class="lme-tcab"><span class="lme-ttit">Escaleta</span><span class="lme-tey"></span></div><ol class="lme-tl"></ol><div class="lme-tpie"></div>';
    fo.addEventListener('pointerdown', function (e) { e.preventDefault(); e.stopPropagation(); cerrarTodo(); tragar(); }, true);
    el.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target : null; if (!t) return;
      if (t.closest('.lme-menos')) { e.preventDefault(); cerrarTodo(); return; }
      var vb = t.closest('.lme-tvid'); if (vb) { e.preventDefault(); var b = (TODO.B || [])[+vb.getAttribute('data-i')]; cerrarTodo(); if (b && b.vid) abrirVideo(b.vid); }
    });
    [el, fo].forEach(function (x) { ['click', 'mousedown', 'pointerdown', 'pointerup', 'mouseup', 'touchstart', 'touchend', 'wheel'].forEach(function (ev) { x.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true }); }); });
    TODO.el = el; TODO.fondo = fo; return el;
  }
  function abrirTodo() { montarTodo(); TODO.abierto = true; TODO.firma = ''; pintar(true); }
  function cerrarTodo() { TODO.abierto = false; if (TODO.el) { ver(TODO.el, false); ver(TODO.fondo, false); } }
  function pintarTodo(v) {
    var el = montarTodo(), B = v.B, a = v.a, c = v.c, t = ahora(); if (!a || !B || !B.length) { cerrarTodo(); return; }
    var host = anfitrion();
    if (TODO.fondo.parentNode !== host) host.appendChild(TODO.fondo);
    if (el.parentNode !== host) host.appendChild(el);
    var extra = a.resto < 0 && a.mg > 0;
    var mA = (a.pausa ? 'en pausa · ' : '') + (extra ? 'extra ' + minutos(Math.max(0, a.mg - Math.min(a.mg, -a.resto))) : 'quedan ' + minutos(Math.max(0, a.resto)));
    var queda = Math.max(0, a.resto + a.mg); for (var j = a.i + 1; j < B.length; j++) queda += B[j].m * 60;
    var pie = 'Quedan <b>' + esc(minutos(queda)) + '</b> · terminaría hacia las <b>' + hhmm(t + queda * 1000) + '</b> · la clase acaba a las <b>' + hhmm(c.t0 + DURA * 60000) + '</b>';
    var ey = grupoBonito(c.grupo) + ' · ' + String(c.clase || '').toUpperCase() + ' · ' + DIA_NOMBRE[c.dia];
    var firma = a.i + '|' + mA + '|' + pie + '|' + ey + '|' + (extra ? 1 : 0);
    if (firma !== TODO.firma || TODO.B !== B) {
      TODO.firma = firma; TODO.B = B;
      txt(el.querySelector('.lme-tey'), ey);
      el.querySelector('.lme-tl').innerHTML = B.map(function (b, i) {
        var est = i < a.i ? 'hecha' : (i === a.i ? 'ahora' + (extra ? ' extra' : '') : 'luego');
        var ls = [b.s].concat(b.det || []).filter(Boolean);
        return '<li class="lme-ti ' + est + '" style="--c:' + (COLOR_TEMA[b.tema] || COLOR_TEMA.otra) + '"><b class="lme-tn">' + (i + 1) + '</b>' +
          '<div class="lme-tc"><div class="lme-tt">' + esc(b.t) + '</div>' + ls.map(function (s) { return '<div class="lme-ts">' + esc(s) + '</div>'; }).join('') +
          (b.vid ? '<button type="button" class="lme-tvid" data-i="' + i + '">▶ ' + esc(b.vid.t) + '</button>' : '') + '</div>' +
          '<span class="lme-tm">' + esc(i === a.i ? mA : b.m + ' min') + '</span>' + (i === a.i ? '<i class="lme-tb"><b></b></i>' : '') + '</li>';
      }).join('');
      el.querySelector('.lme-tpie').innerHTML = pie;
      try {   /* lo de ahora, a la vista (si la lista no cabe entera) */
        var ol = el.querySelector('.lme-tl'), cur = ol.querySelector('.lme-ti.ahora');
        if (cur && (cur.offsetTop < ol.scrollTop || cur.offsetTop + cur.offsetHeight > ol.scrollTop + ol.clientHeight)) ol.scrollTop = Math.max(0, cur.offsetTop - 70);
      } catch (e2) {}
    }
    var pb = el.querySelector('.lme-tb b');
    if (pb) pb.style.width = (extra ? 100 : Math.max(0, Math.min(100, (1 - Math.max(0, a.resto) / a.dur) * 100))).toFixed(1) + '%';
    ver(TODO.fondo, true); ver(el, true);
  }
  function montar() {
    if (UI) { if (!UI.isla.isConnected) D.body.appendChild(UI.isla); [UI.play, UI.indice, UI.cuenta, UI.cartel, UI.fin].forEach(function (x) { if (!x.isConnected) D.body.appendChild(x); }); return UI; }
    if (!D.body) return null;
    var st = D.createElement('style'); st.id = 'lme-css'; st.textContent = CSS; (D.head || H).appendChild(st);
    var isla = D.createElement('div'); isla.id = 'lme-isla'; isla.hidden = true; isla.setAttribute('role', 'status');
    isla.innerHTML = '<button type="button" class="lme-mas" title="Ver toda la escaleta" aria-label="Ver toda la escaleta">' + SVG.mas + '</button>' +   /* (16-oct-2026) + */
      '<div class="lme-ant"></div><div class="lme-ahora"><span class="lme-t"></span><span class="lme-s"></span><span class="lme-m"></span></div>' +
      '<div class="lme-vrow" hidden><button type="button" class="lme-vid" title="Ver el vídeo"></button></div>' +   /* (16-oct-2026) vídeo */
      '<div class="lme-barra"><b></b><span class="lme-ex" hidden><i></i></span></div>' +
      '<div class="lme-sig"><span class="lme-sigt"></span><span class="lme-bts">' +
        '<button type="button" class="lme-b" data-a="ant" title="Anterior" aria-label="Anterior">' + SVG.ant + '</button>' +
        '<button type="button" class="lme-b" data-a="pausa" title="Pausa" aria-label="Pausa">' + SVG.pausa + '</button>' +
        '<button type="button" class="lme-b" data-a="parar" title="Parar la escaleta" aria-label="Parar la escaleta">' + SVG.parar + '</button>' +
        '<button type="button" class="lme-b" data-a="sig" title="Siguiente" aria-label="Siguiente">' + SVG.sig + '</button></span></div>';
    isla.addEventListener('click', function (e) {
      var mb = e.target && e.target.closest ? e.target.closest('.lme-mas') : null;   /* (16-oct-2026) + */
      if (mb) { e.preventDefault(); e.stopPropagation(); abrirTodo(); return; }
      var vb = e.target && e.target.closest ? e.target.closest('.lme-vid') : null;   /* (16-oct-2026) vídeo */
      if (vb) { e.preventDefault(); e.stopPropagation(); abrirVideo(VID_ACTUAL); return; }
      var b = e.target && e.target.closest ? e.target.closest('.lme-b') : null;
      e.preventDefault(); e.stopPropagation();
      if (b) { audio(); despierto(true); accion(b.getAttribute('data-a')); }
    });
    ['pointerdown', 'mousedown', 'touchstart'].forEach(function (ev) { isla.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true }); });
    var play = D.createElement('button'); play.type = 'button'; play.id = 'lme-play'; play.hidden = true; play.title = 'Empezar la escaleta'; play.setAttribute('aria-label', 'Empezar la escaleta'); play.innerHTML = SVG.play;
    play.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); audio(); despierto(true); accion('empezar'); });
    var indice = D.createElement('div'); indice.id = 'lme-indice'; indice.className = 'lme-full'; indice.hidden = true;
    /* (15-oct-2026, Iago) «pon un sonido como de cargando… con una animación abajo… que ponga abajo, cargando actividades»:
       la lista va saliendo de un «falso cargando» (la barra de abajo, el rótulo con sus puntos y el tanto por ciento) */
    indice.innerHTML = '<div class="lme-ey"></div><div class="lme-itit">Hoy en clase</div><ol class="lme-ilist"></ol>' +
      '<div class="lme-carga"><svg class="lme-spin" viewBox="0 0 50 50" aria-hidden="true"><circle cx="25" cy="25" r="20"/></svg><span class="lme-carga-t">Cargando actividades</span><span class="lme-carga-p" hidden></span></div><div class="lme-barra5"><b></b></div>';
    var cuenta = D.createElement('div'); cuenta.id = 'lme-cuenta'; cuenta.className = 'lme-full'; cuenta.hidden = true;
    cuenta.innerHTML = '<div class="lme-rec" hidden></div><div class="lme-ey"></div><div class="lme-num"></div><div class="lme-frase">Preparamos libro de ritmo y lápiz</div><canvas width="840" height="88"></canvas><div class="lme-barra5"><b></b></div>';
    var cartel = D.createElement('div'); cartel.id = 'lme-cartel'; cartel.className = 'lme-full'; cartel.hidden = true; cartel.setAttribute('role', 'alert');
    cartel.innerHTML = '<div class="lme-ey"></div><div class="lme-tit"></div><div class="lme-sub"></div><div class="lme-nota" hidden></div><div class="lme-reloj"></div><div class="lme-mi"></div>' +   /* (16-oct-2026, 19:00) lme-reloj: el descanso */
      '<button type="button" class="lme-ir" hidden>Abrir <span aria-hidden="true">›</span></button><div class="lme-barra5"><b></b></div>';   /* (16-oct-2026) el botón a la actividad: discreto y siempre el mismo */
    var fin = D.createElement('div'); fin.id = 'lme-fin'; fin.className = 'lme-full'; fin.hidden = true;
    fin.innerHTML = '<div class="lme-ey"></div><div class="lme-tit">Fin de la clase</div><div class="lme-tareas" hidden></div>' +   /* (16-oct-2026, 19:25) el pie: «Poner faltas» y «No vinieron: …», abajo en el centro */
      '<div class="lme-pie"><button type="button" class="lme-faltas" aria-pressed="false"><b aria-hidden="true"></b><span>Poner faltas</span></button><div class="lme-aus" hidden></div></div><div class="lme-cerrar"></div>';   /* (16-oct-2026) «poner faltas»: hay que marcarlo para salir */
    /* (15-oct-2026, Iago) «si pulso en la pantalla, ese cartel desaparezca instantáneamente»: el toque lo quita y no llega a lo de debajo */
    cartel.addEventListener('pointerdown', function (e) {
      if (e.target && e.target.closest && e.target.closest('.lme-ir')) { e.stopPropagation(); return; }   /* (16-oct-2026) el botón: lo hace su click */
      e.preventDefault(); e.stopPropagation(); fueraDescanso(); quitarCartel(true); tragar(); }, true);   /* (16-oct-2026, 19:00) el del descanso no vuelve */
    cartel.querySelector('.lme-ir').addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation(); var acc = CART.ir; quitarCartel(true); if (acc) { try { acc.fn(); } catch (x) {} } });
    fin.addEventListener('pointerdown', function (e) {
      if (e.target && e.target.closest && e.target.closest('.lme-faltas')) { e.stopPropagation(); return; }   /* (16-oct-2026) el check: lo hace su click */
      e.preventDefault(); e.stopPropagation();
      if (!FALTAS) { avisaFaltas(); return; }          /* (16-oct-2026) sin «Poner faltas» marcado, la pantalla no se va */
      finVisto(); ver(fin, false); tragar(); }, true);
    fin.querySelector('.lme-faltas').addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); FALTAS = !FALTAS; pintaFaltas(); });
    [indice, cuenta, cartel, fin].forEach(function (x) { ['click', 'mousedown', 'touchstart', 'wheel'].forEach(function (ev) { x.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true }); }); });
    D.body.appendChild(isla); D.body.appendChild(play); D.body.appendChild(indice); D.body.appendChild(cuenta); D.body.appendChild(cartel); D.body.appendChild(fin);
    UI = { isla: isla, play: play, indice: indice, cuenta: cuenta, cartel: cartel, fin: fin,
           iEy: indice.querySelector('.lme-ey'), iList: indice.querySelector('.lme-ilist'), iBar: indice.querySelector('.lme-barra5 b'), iCarga: indice.querySelector('.lme-carga-p'),
           vrow: isla.querySelector('.lme-vrow'), vid: isla.querySelector('.lme-vid'),
           ant: isla.querySelector('.lme-ant'), t: isla.querySelector('.lme-t'), s: isla.querySelector('.lme-s'), m: isla.querySelector('.lme-m'),
           bar: isla.querySelector('.lme-barra b'), ex: isla.querySelector('.lme-ex'), sig: isla.querySelector('.lme-sigt'), bPausa: isla.querySelector('[data-a="pausa"]'),
           cEy: cuenta.querySelector('.lme-ey'), cRec: cuenta.querySelector('.lme-rec'), cNum: cuenta.querySelector('.lme-num'), cBar: cuenta.querySelector('.lme-barra5 b'), cv: cuenta.querySelector('canvas'),
           kIr: cartel.querySelector('.lme-ir'), kR: cartel.querySelector('.lme-reloj'), kEy: cartel.querySelector('.lme-ey'), kT: cartel.querySelector('.lme-tit'), kS: cartel.querySelector('.lme-sub'), kN: cartel.querySelector('.lme-nota'), kM: cartel.querySelector('.lme-mi'), kBar: cartel.querySelector('.lme-barra5 b'),
           fEy: fin.querySelector('.lme-ey'), fT: fin.querySelector('.lme-tareas'), fF: fin.querySelector('.lme-faltas'), fA: fin.querySelector('.lme-aus'), fC: fin.querySelector('.lme-cerrar') };
    return UI;
  }
  /* el «clic» que sigue a ese toque no debe caer en lo que hay debajo */
  function tragar() {
    var hasta = Date.now() + 700;
    function h(e) { if (Date.now() > hasta) { quita(); return; } e.preventDefault(); e.stopPropagation(); if (e.type === 'click') quita(); }
    function quita() { ['click', 'pointerup', 'mouseup', 'touchend'].forEach(function (ev) { W.removeEventListener(ev, h, true); }); }
    ['click', 'pointerup', 'mouseup', 'touchend'].forEach(function (ev) { W.addEventListener(ev, h, true); });
    setTimeout(quita, 750);
  }

  /* ---------- el cartel de cada cambio (5 s) ---------- */
  var CART = { hasta: 0, i: -1, visto: '' };
  function claveCambio(v) { return v.c.clave + '#' + v.i + '#' + Math.round(+v.a.ini / 1000); }
  function cartelPara(i, ahoraMismo) { CART.forzar = { i: i, t: ahora() }; }
  function quitarCartel(ya) {
    if (!UI) return; var k = UI.cartel; CART.hasta = 0;
    if (ya) { k.classList.remove('lme-recoge'); ver(k, false); return; }
    if (k.hidden || k.classList.contains('lme-recoge')) return;
    k.classList.add('lme-recoge'); setTimeout(function () { if (k.classList.contains('lme-recoge')) { ver(k, false); k.classList.remove('lme-recoge'); } }, 460);
  }
  function encaja(el, max) {   /* el título del cartel, que quepa en una línea */
    el.style.fontSize = max + 'px';
    var w = el.scrollWidth, lim = W.innerWidth * 0.9;
    if (w > lim) el.style.fontSize = Math.max(48, Math.floor(max * lim / w)) + 'px';
  }
  function mostrarCartel(v, quedan) {
    var B = v.B, b = B[v.i], n = B[v.i + 1]; if (!b || !montar()) return;
    UI.cartel.classList.remove('lme-descanso'); DESC.k = '';   /* (16-oct-2026, 19:00) el normal (si es un descanso, descanso() lo convierte) */
    txt(UI.kEy, 'Ahora · ' + (v.i + 1) + ' de ' + B.length);
    txt(UI.kT, b.t); txt(UI.kS, b.s); ver(UI.kS, !!b.s);
    txt(UI.kN, b.nota || ''); ver(UI.kN, !!b.nota);   /* (19-oct-2026) la nota del apartado */
    UI.kM.innerHTML = '<b>' + esc(b.m + ' min') + '</b>' + esc(n ? ' · luego, ' + (/[A-Z]/.test(n.t.split(' ')[0].slice(1)) ? n.t : minus(n.t)) : ' · y fin de la clase')   /* «luego, FaActos» (no «faactos») */;
    var ir = null; try { ir = irA(b); } catch (e) {} CART.ir = ir; ver(UI.kIr, !!ir); if (ir) UI.kIr.title = ir.t;   /* (16-oct-2026) siempre el mismo botón, «Abrir ›» */
    alFrente(UI.cartel); UI.cartel.classList.remove('lme-recoge'); ver(UI.cartel, true); encaja(UI.kT, 150);   /* (16-oct-2026) alFrente */
    CART.hasta = Date.now() + quedan;
    if (!(BAT.cierre && Math.abs(ahora() - BAT.cierre) < 1500)) cambioSuena();   /* en el 5:00 ya suena el cierre de la batería */
  }

  /* ---------- (16-oct-2026, 19:00, Iago) EL DESCANSO ----------
     «Durante el descanso quiero que la pantalla… esté presente todo ese tiempo, indicando además la próxima actividad… los
     minutos corriendo hacia abajo… y que ponga que después es la evaluación de las lecciones y que diga los números… En la
     clase 1 no quiero que ponga la lección de entonación… que ponga lección de entonación o algo así… ocuparía toda la pantalla
     durante todo el tiempo de descanso. A no ser que yo pulse la pantalla». El cartel del descanso no se va a los 5 s: se
     queda todo el descanso con su cuenta atrás (la de verdad: con el margen que se haya guardado, hasta que salta la
     siguiente) y «Después: …» (como en «Hoy en clase»; la evaluación, «Evaluación de las lecciones 26 y 28»; la entonación,
     en la C1 sin decir cuál). Tocar la pantalla o Esc lo quitan y en ese descanso ya no vuelve; abrir la página a mitad
     del descanso lo pone. Donde no hay cartel (portales interactivos de GP), tampoco. Para quitarlo: que descanso() no haga nada. */
  var DESC = { k: '', fuera: '' };
  function esDescanso(b) { return !!b && (b.tema === 'descanso' || /^descanso\b/i.test(String(b.t || ''))); }
  function luegoTexto(v) {
    var j = v.a.i + 1, n = v.B[j]; if (!n) return 'fin de la clase';
    var t = '';
    try {
      var raw = ((v.pub && Array.isArray(v.pub.bloques)) ? v.pub.bloques : []).filter(function (b) { return b && +b.m > 0 && b.slot !== '__no_clase'; })[j];
      if (raw) {
        var f = formatea(raw, v.c.grupo), lec = /^Lecci/.test(f.s || '') ? f.s : '';
        if (f.t === 'Entonación' || f.t === 'Preparación entonación') t = (v.c.clase === 'c2' && /^Lecci/.test(f.s || '')) ? 'Entonación: ' + minus(f.s) : 'Lección de entonación';
        else if ((f.t === 'Evaluación de ritmo' || f.t === 'Evaluación') && lec) t = 'Evaluación de ' + (/^Lecciones/.test(lec) ? 'las ' : 'la ') + minus(lec);
        else { var it = agendaHoy({ bloques: [raw] }, v.c.grupo)[0]; if (it && it.t) t = it.lineas ? it.t + ': ' + it.lineas.join(' · ') : it.t; }
      }
    } catch (e) {}
    return t || (n.t + (n.s ? ' · ' + n.s : ''));
  }
  function fueraDescanso() { if (UI && UI.cartel.classList.contains('lme-descanso')) { DESC.fuera = DESC.k; UI.cartel.classList.remove('lme-descanso'); } }
  function descanso(v, inm) {
    var k = (v.fase === 'clase' && v.a && esDescanso(v.B[v.a.i])) ? claveCambio(v) : '';
    var cart = UI.cartel, quiere = !!k && DESC.fuera !== k && conCartel(inm);
    if (!quiere) { if (cart.classList.contains('lme-descanso')) { cart.classList.remove('lme-descanso'); quitarCartel(true); } DESC.k = ''; return; }
    var a = v.a, b = v.B[a.i];
    if (!cart.classList.contains('lme-descanso') || DESC.k !== k || cart.hidden) {
      txt(UI.kT, b.t); txt(UI.kS, b.s); ver(UI.kS, !!b.s); ver(UI.kN, false);
      UI.kM.innerHTML = 'Después: <b>' + esc(luegoTexto(v)) + '</b>';
      CART.ir = null; ver(UI.kIr, false);
      cart.classList.add('lme-descanso'); alFrente(cart); cart.classList.remove('lme-recoge'); ver(cart, true); encaja(UI.kT, 120);
      DESC.k = k;
    }
    txt(UI.kEy, 'Ahora · ' + (a.i + 1) + ' de ' + v.B.length + (a.pausa ? ' · en pausa' : ''));
    var q = Math.ceil(Math.max(0, a.resto + (a.desc ? 0 : a.mg))), r = Math.floor(q / 60) + '<span class="lme-dp">:</span>' + ('0' + (q % 60)).slice(-2);
    if (UI.kR.innerHTML !== r) UI.kR.innerHTML = r;
    CART.hasta = Date.now() + 60000;   /* no se va solo */
  }

  /* ---------- (17-oct-2026, Iago: «Todo, y la previa ya encendida») LA PREVIA EN LA CUENTA ATRÁS ----------
     En lugar de los 32 s de la preparación, la previa del aula (piel/previa/previa.html, en un marco con sandbox y sin sonido
     propio): el aviso con la cuenta atrás y los recordatorios, «¡Ojo! Cuidado con esto» (el del grupo, que manda el iPad en el
     bloque «__previa»; si no hay, uno de repaso), un respiro y, en GE, un consejo. Dura lo que mida (unos 45–55 s en GE y 29–39 s
     en GP): la cuenta empieza antes, para que «Hoy en clase» siga entrando en su sitio. El sonido lo pone la escaleta (la música
     de la previa, el tecleo y los efectos, por el MASTER, como la pista de siempre).
     · El marco se abre (escondido) desde 8 min antes de la clase. Si al empezar la cuenta no está todo listo (el marco montado y
       el sonido cargado), la cuenta de siempre (32 s). Lo que se decide al empezar ya no cambia en esa clase (ni recargando).
     · «Saltar» (abajo a la derecha, al mover el ratón) la quita (el mando, en la previa, no hace nada): la cuenta atrás de siempre hasta el índice,
       con su pista donde vaya. Si el marco deja de dar señales (3,5 s), lo mismo.
     Para quitarla: PREVIA_ON = false. */
  var PREVIA_ON = true, PREVIA_V = '2026-10-18a', PREVIA_ADELANTE = 600;   /* (20-oct-2026) antes 480: el ▶ sale 10 min antes */
  var PV = { caja: null, fr: null, bot: null, hola: false, cfg: null, cfgK: '', k: '', n: 0, enviada: '', listo: null, buf: {}, pide: {},
             modo: {}, uso: {}, src: [], g: null, vivo: 0, visto: 0, play: 0, raf: 0, botT: 0, err: 0 };
  function pvModoLee(k) { try { var x = JSON.parse(sessionStorage.getItem('lm_esc_pv:' + k) || 'null'); return x && x.m ? x : null; } catch (e) { return null; } }
  function pvModoPon(k, M) { try { sessionStorage.setItem('lm_esc_pv:' + k, JSON.stringify(M)); } catch (e) {} }
  function pvArchivo(n) { return n === 'lapiz' || n === 'teclas' ? n + '.mp3' : 'sfx-' + n + '.mp3'; }
  /* el marco montado con la config de esta clase y todo su sonido cargado */
  function pvLista(c) {
    var L = PV.listo; if (!L || !c || L.k !== c.clave || L.cfgK !== PV.cfgK || !PV.hola) return null;
    for (var i = 0; i < L.audio.archivos.length; i++) if (!PV.buf[L.audio.archivos[i]]) return null;
    return L;
  }
  /* (20-oct-2026) lo que durará la cuenta de esta clase si empieza ahora (sin decidirlo: eso lo hace cuentaDe) */
  function cuentaPrevista(c) {
    if (!PREVIA_ON || !c) return CUENTA;
    var M = PV.modo[c.clave] || pvModoLee(c.clave); if (M) return M.dur;
    var L = pvLista(c); return L ? L.dur : CUENTA;
  }
  /* cuántos segundos dura la cuenta de esta clase: la previa (si está lista al empezar) o la de siempre; se decide una vez */
  function cuentaDe(c, desde, IND) {
    if (!PREVIA_ON || !c) return CUENTA;
    var M = PV.modo[c.clave] || pvModoLee(c.clave); if (M) { PV.modo[c.clave] = M; return M.dur; }
    var L = pvLista(c), D = L ? L.dur : CUENTA, ini = 300 - IND - D;
    if (L && desde - ini > 8) { L = null; D = CUENTA; ini = 300 - IND - D; }   /* lista, pero tarde (pasado el aviso): la de siempre */
    if (desde >= ini && desde < 300) { M = { m: L ? 'previa' : 'vieja', dur: D }; PV.modo[c.clave] = M; pvModoPon(c.clave, M); }
    return D;
  }
  /* ---------- (18-oct-2026, Iago: «en clase ya ni toco el iPad… lo que sí abro es el portal tester o el protester… ahí es donde
     decida… lo más certero posible en base a las fichas de ese grupo») EL ¡OJO! LO CALCULA ESTA PANTALLA ----------
     Una vez por clase, con el portal abierto (desde 8 min antes como mucho; a la hora en punto sobra) y solo con la cuenta
     Tester / Protester: una llamada pequeña (escaleta_previa_fichas: las entregas de la última ficha cerrada del grupo, sin
     nombres) y la elección con previa/elige.js (el mismo motor que la previa y el Diario). Se guarda para esa clase en la
     pestaña (recargar no vuelve a pedirlo). Mientras tanto, o si falla, el bloque «__previa» del iPad (si lo hay) o uno de
     repaso. Para quitarlo: OJO_ON = false. */
  var OJO_ON = true, OJO = { k: '', r: undefined, t: 0, n: 0, pidiendo: false, nota: '' }, ELIGE = { p: null };
  function ojoLee(k) { try { var x = JSON.parse(sessionStorage.getItem('lm_esc_ojo:' + k) || 'null'); return x && x.v === 1 ? x : null; } catch (e) { return null; } }
  function ojoPon(k, x) { try { sessionStorage.setItem('lm_esc_ojo:' + k, JSON.stringify(x)); } catch (e) {} }
  function cargaElige() {   /* el motor de la elección (unos 30 KB, una vez) */
    if (W.PreviaElige && typeof W.PreviaElige.elige === 'function') return Promise.resolve(W.PreviaElige);
    if (!ELIGE.p) ELIGE.p = new Promise(function (ok, mal) {
      var sc = D.createElement('script'); sc.async = true; sc.src = BASE + 'previa/elige.js?v=' + PREVIA_V;
      sc.onload = function () { if (W.PreviaElige && typeof W.PreviaElige.elige === 'function') ok(W.PreviaElige); else { ELIGE.p = null; mal(new Error('sin motor')); } };
      sc.onerror = function () { ELIGE.p = null; mal(new Error('no carga')); };
      (D.head || H).appendChild(sc);
    });
    return ELIGE.p;
  }
  /* el ¡Ojo! de esta clase: undefined mientras no esté; null si no hay nada que destacar (la previa pone uno de repaso); si no, { m, p } */
  function ojoDe(c) {
    if (!OJO_ON || !c || !c.grupo) return undefined;
    var k = c.clave + '|' + c.clase;
    if (OJO.k !== k) { var g0 = ojoLee(k); OJO.k = k; OJO.t = 0; OJO.n = 0; OJO.r = g0 ? g0.o : undefined; OJO.nota = g0 ? String(g0.nota || '') : ''; }
    if (OJO.r !== undefined) return OJO.r;
    var id = cuenta();
    if (id && !OJO.pidiendo && OJO.n < 4 && Date.now() - OJO.t > 90000) {
      OJO.pidiendo = true; OJO.t = Date.now(); OJO.n++;
      Promise.all([rpc('escaleta_previa_fichas', { p_cuenta_id: id, p_grupo: c.grupo, p_anio: c.anio, p_semana: c.semana }), cargaElige()]).then(function (x) {
        if (OJO.k !== k) return;
        var d = x[0], o = null;
        if (!d || typeof d !== 'object') { OJO.nota = 'respuesta rara'; return; }
        if (d.ok === true) {
          o = x[1].elige(d, c.clase, c.semana, c.grupo);
          o = (o && typeof o.m === 'string' && o.p && typeof o.p === 'object') ? { m: o.m, p: o.p } : null;
          OJO.nota = (o ? 'el de la ficha ' : 'nada que destacar en la ficha ') + (+d.ficha || 0);
        } else OJO.nota = 'sin datos (' + String(d.error || '').slice(0, 20) + ')';
        OJO.r = o; ojoPon(k, { v: 1, o: o, t: Date.now(), nota: OJO.nota });
        pintar(true);
      }).catch(function (e) { if (OJO.k === k) OJO.nota = 'falló: ' + String(e && e.message || e).slice(0, 60); }).then(function () { OJO.pidiendo = false; });
    }
    return undefined;
  }
  /* lo que se le manda al marco: el grupo, el día, la clase, el ¡Ojo! (del bloque «__previa» del iPad), los recordatorios y las
     actividades de hoy (para elegir el consejo de sus áreas). Sin nombres de alumnos, salvo lo que ya diga algún recordatorio. */
  function pvConfig(v) {
    var c = v.c, pub = v.pub, g = codigoG(c.grupo), ojo = null, oj = ojoDe(c);
    if (oj !== undefined) ojo = oj;   /* (18-oct-2026) el que calcula esta pantalla (null: uno de repaso) */
    else try {
      var b = (pub && Array.isArray(pub.bloques)) ? pub.bloques.filter(function (x) { return x && x.slot === '__previa'; })[0] : null;
      var x = (b && b.g && typeof b.g === 'object') ? b.g[g] : null;
      if (x && x[c.clase] && typeof x[c.clase] === 'object') x = x[c.clase];
      if (x && typeof x.m === 'string' && x.p && typeof x.p === 'object') ojo = { m: x.m, p: x.p };
    } catch (e) {}
    var B = v.B || [];
    return { grado: /gp$/i.test(c.curso || '') ? 'gp' : 'ge', grupo: grupoBonito(c.grupo), codigo: g, dia: DIA_NOMBRE[c.dia] || '', clase: c.clase, anio: c.anio, semana: c.semana,
      ojo: ojo, recs: recordatorios(pub, c.grupo), temas: B.map(function (y) { return String(y.tema || ''); }), titulos: B.map(function (y) { return String(y.t || '').slice(0, 60); }) };
  }
  function pvCaja() {
    if (PV.caja) { if (!PV.caja.isConnected && D.body) { D.body.appendChild(PV.caja); PV.hola = false; } return PV.caja; }
    if (!D.body) return null;
    var k = D.createElement('div'); k.id = 'lme-previa'; k.setAttribute('aria-hidden', 'true');
    var f = D.createElement('iframe'); f.setAttribute('sandbox', 'allow-scripts'); f.setAttribute('tabindex', '-1'); f.setAttribute('title', 'Previa de la clase');
    f.setAttribute('allow', ''); f.src = BASE + 'previa/previa.html?v=' + PREVIA_V;
    var bt = D.createElement('button'); bt.type = 'button'; bt.className = 'lme-pv-saltar'; bt.textContent = 'Saltar ›'; bt.title = 'Saltar la previa (la cuenta atrás de siempre)';
    bt.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); pvSalta(); });
    k.addEventListener('pointermove', function () { PV.botT = Date.now(); bt.classList.add('lme-on'); });
    ['click', 'mousedown', 'pointerdown', 'touchstart', 'wheel'].forEach(function (ev) { k.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true }); });
    k.appendChild(f); k.appendChild(bt); D.body.appendChild(k);
    PV.caja = k; PV.fr = f; PV.bot = bt; PV.hola = false;
    return k;
  }
  function pvManda(m) { try { if (PV.fr && PV.fr.contentWindow) { m.lmPrevia = 1; PV.fr.contentWindow.postMessage(m, '*'); } } catch (e) {} }
  function pvEnvia() { if (!PV.hola || !PV.cfg) return; PV.enviada = String(++PV.n); pvManda({ tipo: 'monta', clave: PV.enviada, cfg: PV.cfg }); }
  /* lo que contesta el marco, comprobado (es otra página): la duración, los ficheros de sonido y cuándo suena cada cosa */
  function pvValida(m) {
    try {
      var A = m.audio, n = function (x) { return typeof x === 'number' && isFinite(x); };
      if (!n(m.dur) || m.dur < 20 || m.dur > 75 || !A || !Array.isArray(A.archivos)) return null;
      var arch = A.archivos.filter(function (f) { return typeof f === 'string' && /^[a-z0-9-]{1,40}\.mp3$/.test(f); });
      if (!arch.length || arch.length !== A.archivos.length || arch.indexOf('previa-ge48.mp3') < 0) return null;
      var mus = (A.musica || []).filter(function (x) { return Array.isArray(x) && x.length === 3 && x.every(n); });
      var env = (A.env || []).filter(function (x) { return Array.isArray(x) && x.length === 2 && x.every(n); });
      var sfx = (A.sfx || []).filter(function (x) { return x && typeof x.n === 'string' && /^[a-z]{1,20}$/.test(x.n) && n(x.t) && n(x.g) && x.t > -1 && x.t < 90; }).slice(0, 1500);
      return { dur: m.dur, audio: { archivos: arch, musica: mus, env: env, sfx: sfx }, info: (m.info && typeof m.info === 'object') ? m.info : null };
    } catch (e) { return null; }
  }
  W.addEventListener('message', function (ev) {
    if (!PV.fr || ev.source !== PV.fr.contentWindow) return;
    var m = ev.data; if (!m || m.lmPrevia !== 1 || typeof m.tipo !== 'string') return;
    if (m.tipo === 'hola') { PV.hola = true; PV.listo = null; pvEnvia(); }
    else if (m.tipo === 'listo') { if (m.clave !== PV.enviada) return; var L = pvValida(m); if (!L) { PV.err++; return; } L.k = PV.k; L.cfgK = PV.cfgK; PV.listo = L; pvCarga(L.audio.archivos); }
    else if (m.tipo === 'vivo') PV.vivo = Date.now();
    else if (m.tipo === 'error') { PV.err++; if (m.clave === PV.enviada) PV.listo = null; }
  });
  function pvCarga(ls) {
    if (!audio() || !W.fetch) return;
    ls.forEach(function (f) {
      if (PV.buf[f] || PV.pide[f]) return; PV.pide[f] = 1;
      var falla = function () { setTimeout(function () { PV.pide[f] = 0; }, 20000); };
      fetch(BASE + 'previa/' + f + '?v=' + PREVIA_V).then(function (r) { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
        .then(function (ab) { AC.decodeAudioData(ab, function (b) { PV.buf[f] = b; }, falla); }).catch(falla);
    });
  }
  /* desde 8 min antes: el marco, escondido, con la config de esta clase (si cambia la publicación, se vuelve a montar) */
  function pvPrepara(v) {
    if (!PREVIA_ON || !v.c || !cuenta()) return;
    if (PV.k !== v.c.clave) { PV.k = v.c.clave; PV.listo = null; PV.cfgK = ''; }
    var M = PV.modo[v.c.clave] || pvModoLee(v.c.clave); if (M) return;   /* ya decidido */
    if (!pvCaja()) return;
    var cfg = pvConfig(v), k = JSON.stringify(cfg);
    if (k !== PV.cfgK) { PV.cfg = cfg; PV.cfgK = k; PV.listo = null; pvEnvia(); }
    pvCarga(['previa-ge48.mp3', 'teclas.mp3']);   /* lo gordo, cuanto antes */
  }
  /* en esta cuenta, ¿la previa en su marco? Se decide al llegar la cuenta a esta página: si no está lista, la de siempre */
  function pvUsa(v) {
    var c = v.c, M = c ? PV.modo[c.clave] : null;
    if (!M || M.m !== 'previa') return false;
    if (PV.uso[c.clave] == null) PV.uso[c.clave] = !!(PV.caja && pvLista(c));
    return PV.uso[c.clave] === true;
  }
  function pvSonido(v) {   /* para la batería: la previa que suena y su segundo de ahora */
    if (!v.c || !PV.listo) return null;
    var M = PV.modo[v.c.clave]; if (!M || M.m !== 'previa' || PV.uso[v.c.clave] !== true) return null;
    var t = v.fase === 'cuenta' ? M.dur - v.queda : M.dur + (v.ind || 0) - (v.queda || 0);
    return { dur: M.dur, t: t };
  }
  function pvMuestra(v) {
    var M = PV.modo[v.c.clave], tE = M.dur - Math.max(0, v.queda), t0l = Date.now() - tE * 1000;   /* su segundo 0, en el reloj del marco */
    if (!PV.caja.classList.contains('lme-on')) { PV.caja.classList.add('lme-on'); PV.visto = Date.now(); PV.vivo = Date.now(); pararMusica(); }
    if (Math.abs(t0l - PV.play) > 25) { PV.play = t0l; pvManda({ tipo: 'play', t0: t0l }); }
    if (!PV.raf) PV.raf = requestAnimationFrame(pvBandas);
    if (Date.now() - PV.vivo > 3500 && Date.now() - PV.visto > 3000) { PV.err++; pvSalta(); return; }   /* el marco no da señales */
    if (PV.bot && PV.bot.classList.contains('lme-on') && Date.now() - PV.botT > 3000) PV.bot.classList.remove('lme-on');
  }
  function pvOculta() {
    if (PV.caja && PV.caja.classList.contains('lme-on')) { PV.caja.classList.remove('lme-on'); pvManda({ tipo: 'para' }); PV.play = 0; if (PV.bot) PV.bot.classList.remove('lme-on'); }
    if (PV.raf) { cancelAnimationFrame(PV.raf); PV.raf = 0; }
  }
  function pvSalta() {
    try { var v = vista(ahora()); if (v.c) PV.uso[v.c.clave] = false; } catch (e) {}
    pvOculta(); pvCalla(true); BAT.pista = false; pintar(true);
  }
  function pvQuita() {
    if (!PV.caja) return;
    pvOculta(); pvCalla(true);
    try { if (PV.caja.parentNode) PV.caja.parentNode.removeChild(PV.caja); } catch (e) {}
    PV.caja = PV.fr = PV.bot = null; PV.hola = false; PV.listo = null; PV.cfgK = ''; PV.k = '';
  }
  /* las barras amarillas de la previa: las bandas del sonido de aquí, al marco */
  function pvBandas() {
    PV.raf = 0; if (!PV.caja || !PV.caja.classList.contains('lme-on')) return;
    var v = [];
    try {
      if (ANA && AC) {
        var d = new Uint8Array(ANA.frequencyBinCount), n = 21, sr = AC.sampleRate / 2; ANA.getByteFrequencyData(d);
        for (var i = 0; i < n; i++) {
          var f0 = 50 * Math.pow(9000 / 50, i / n), f1 = 50 * Math.pow(9000 / 50, (i + 1) / n), b0 = Math.floor(f0 / sr * d.length), b1 = Math.max(b0 + 1, Math.floor(f1 / sr * d.length)), x = 0;
          for (var j = b0; j < b1; j++) x = Math.max(x, d[j] || 0);
          v.push(Math.round(Math.pow(x / 255, 1.5) * (1 + i / n) * 1000) / 1000);
        }
      }
    } catch (e) {}
    pvManda({ tipo: 'bandas', v: v });
    PV.raf = requestAnimationFrame(pvBandas);
  }
  /* el sonido de la previa, desde su segundo tE: la música (con su envolvente: el scratch la corta, vuelve, baja en el consejo),
     el tecleo, el lápiz y los efectos, como en el banco */
  function pvSuena(tE) {
    var L = PV.listo; if (!L || !AC || AC.state !== 'running' || !MASTER) return false;
    pvCalla(true);
    var ya = AC.currentTime, P0 = ya - tE, A = L.audio, K = A.env, mus = PV.buf['previa-ge48.mp3'];
    try {
      var g = AC.createGain(); g.connect(MASTER); PV.g = g;
      var nivel = function (t) { for (var k = 1; k < K.length; k++) if (t <= K[k][0]) { var p0 = K[k - 1], p1 = K[k]; return p0[1] + (p1[1] - p0[1]) * (t - p0[0]) / Math.max(1e-6, p1[0] - p0[0]); } return 1; };
      g.gain.setValueAtTime(K.length ? nivel(tE) : 1, ya);
      K.forEach(function (k) { if (k[0] > tE && k[0] < 900) g.gain.linearRampToValueAtTime(k[1], P0 + k[0]); });
      if (mus) A.musica.forEach(function (sg) {
        if (sg[0] + sg[2] <= tE + 0.02) return;
        var corte = Math.max(0, tE - sg[0]), s = AC.createBufferSource(); s.buffer = mus; s.connect(g);
        s.start(Math.max(ya, P0 + sg[0] + corte), sg[1] + corte, sg[2] - corte); PV.src.push(s);
      });
      A.sfx.forEach(function (x) {
        var b = PV.buf[pvArchivo(x.n)]; if (!b) return;
        var cuando = P0 + x.t, s, gn;
        if (x.lapiz) {   /* un trozo del lápiz con entrada y salida suaves */
          var du0 = +x.dur || 0.5; if (cuando + du0 < ya) return;
          s = AC.createBufferSource(); gn = AC.createGain(); s.buffer = b; s.connect(gn); gn.connect(MASTER);
          var c0 = Math.max(cuando, ya), resto = cuando + du0 - c0, desde = (Math.abs(Math.sin(x.t * 7.3)) * Math.max(0, b.duration - du0 - 0.3)) + (c0 - cuando);
          gn.gain.setValueAtTime(0, c0); gn.gain.linearRampToValueAtTime(x.g, c0 + 0.03); gn.gain.setValueAtTime(x.g, c0 + Math.max(0.04, resto - 0.1)); gn.gain.linearRampToValueAtTime(0, c0 + resto);
          s.start(c0, desde, resto + 0.05); PV.src.push(s); return;
        }
        var ofs = +x.off || 0, du = x.dur == null ? null : +x.dur;
        if (cuando < ya) { var tarde = ya - cuando; if (du != null) { if (tarde >= du) return; du -= tarde; } else if (tarde >= b.duration - ofs) return; ofs += tarde; cuando = ya; }
        s = AC.createBufferSource(); gn = AC.createGain(); s.buffer = b; if (x.r) s.playbackRate.value = x.r; gn.gain.value = x.g; s.connect(gn); gn.connect(MASTER);
        if (du != null) s.start(cuando, ofs, du); else s.start(cuando, ofs); PV.src.push(s);
      });
    } catch (e) { PV.err++; }
    BAT.pista = true; return true;
  }
  function pvCalla(ya) {
    var t = AC ? AC.currentTime + (ya ? 0 : 0.3) : 0;
    PV.src.forEach(function (s) { try { s.stop(t); } catch (e) {} }); PV.src = [];
    if (PV.g) { var g = PV.g; PV.g = null; setTimeout(function () { try { g.disconnect(); } catch (e) {} }, ya ? 0 : 400); }
  }

  /* ---------- la cuenta atrás: barras amarillas que se mueven con la batería (pocas, sin texto) ---------- */
  var BARR = { raf: 0, pico: [] };
  function barras() {
    BARR.raf = 0; if (!UI || UI.cuenta.hidden) return;
    var cv = UI.cv, x = cv.getContext('2d'), w = cv.width, h = cv.height, n = 21, datos = null;
    if (ANA && AC) { datos = new Uint8Array(ANA.frequencyBinCount); ANA.getByteFrequencyData(datos); }
    x.clearRect(0, 0, w, h); x.fillStyle = 'rgba(250,204,21,.35)'; x.fillRect(0, h - 3, w, 3);
    var paso = w / n, bw = Math.round(paso * 0.5);
    for (var i = 0; i < n; i++) {
      var v = 0;
      if (datos) {
        var f0 = 50 * Math.pow(9000 / 50, i / n), f1 = 50 * Math.pow(9000 / 50, (i + 1) / n), sr = AC.sampleRate / 2;
        var b0 = Math.floor(f0 / sr * datos.length), b1 = Math.max(b0 + 1, Math.floor(f1 / sr * datos.length));
        for (var j = b0; j < b1; j++) v = Math.max(v, datos[j] || 0);
        v = Math.pow(v / 255, 1.5) * (1 + i / n);
      }
      BARR.pico[i] = Math.max(v, (BARR.pico[i] || 0) * 0.85);
      var bh = Math.min(1, BARR.pico[i]) * (h - 6);
      x.fillStyle = '#facc15'; x.fillRect(Math.round(i * paso + (paso - bw) / 2), h - 3 - bh, bw, bh);
    }
    BARR.raf = requestAnimationFrame(barras);
  }

  /* ---------- pintar (cada cuarto de segundo, solo con la página a la vista) ---------- */
  var ANT = { fase: '', clave: '', cambio: '', icono: null, sonando: false };
  function avisar(v) {   /* para el portal (morosos, música): un evento cuando cambia la fase o la actividad */
    var k = v.fase + '|' + (v.c ? v.c.clave : '') + '|' + (v.i == null ? '' : v.i);
    if (k === ANT.aviso) return; ANT.aviso = k;
    try { D.dispatchEvent(new CustomEvent('lm-escaleta', { detail: { fase: v.fase, grupo: v.c ? v.c.grupo : '', clase: v.c ? v.c.clase : '', i: v.i, tema: (v.B && v.i != null && v.B[v.i]) ? v.B[v.i].tema : '' } })); } catch (e) {}
  }
  /* (15-oct-2026, 18:05) Iago: «no se me ha abierto lo de los morosos automáticamente a las 18». En el portal, al empezar la
     clase (la «entrada», hasta la preparación), si sale el ⚠ de morosos de ese grupo, la lista se abre sola: una vez por
     clase; si la cierra, no vuelve a abrirse. */
  var MOROS = { clave: '', hecho: false, fase: '' };
  function abrirMorosos(v) {
    /* (15-oct-2026, 19:05, Iago: «…solo que se vaya al empezar la cuenta atrás») al acabar la entrada, si está abierta, se cierra
       (mientras dura la entrada, pulsar fuera no la cierra: eso lo hace portal.js) */
    var antes = MOROS.fase; MOROS.fase = (v && v.fase) || '';
    if (PORTAL && antes === 'entrada' && MOROS.fase !== 'entrada') {
      var bc = D.querySelector('#lm-morosos .lm-ic');
      if (bc && bc.getAttribute('aria-expanded') === 'true') { try { bc.click(); } catch (e) {} }
    }
    if (!PORTAL || !v || v.fase !== 'entrada' || !v.c) return;
    if (MOROS.clave !== v.c.clave) { MOROS.clave = v.c.clave; MOROS.hecho = false; }
    if (MOROS.hecho) return;
    var b = D.querySelector('#lm-morosos .lm-ic'); if (!b || !visible(b)) return;
    MOROS.hecho = true;
    if (b.getAttribute('aria-expanded') !== 'true') { try { b.click(); } catch (e) {} }
  }
  /* (16-oct-2026, Iago) EL CARTEL LLEVA A LA ACTIVIDAD: «esos segundos… ¿podrías poner enlace directo a la actividad si
     implica pantalla?». Solo en el portal y solo si su botón de siempre está en la página (lo pulsa, como los cuadrados de
     arriba): FaActos / Intervalia / Intervalia PRO → su libro; dictado → el dictado activo; vídeo didáctico → el vídeo;
     portal temático → su portada (da igual el día); carta de ritmo → la intro activa; lección de ritmo → la lección en
     la campana; evaluación de ritmo → resultados; entonación → su cuadrado. El contorno amarillo del icono de arriba
     sigue igual (si no llega a tiempo al cartel, va luego por ahí). Para quitarlo: que irA devuelva null. */
  function pulsa(el) { if (el) { try { el.click(); } catch (e) {} } }
  function libroIr(tipo, t) {
    var bt = D.querySelector('#lb-mini .da-btn'), cu = D.querySelector('#lm-iconos .lm-ic-libros');
    if (!bt && !cu) return null;
    return { t: t, fn: function () {
      try { if (bt && W.LibrosAula && typeof W.LibrosAula.abrir === 'function' && W.LibrosAula.abrir.length >= 2) { W.LibrosAula.abrir(bt, tipo); return; } } catch (e) {}
      pulsa(cu || bt);
    } };
  }
  function leccionIr(lecs) {
    var parte = 'leccion_' + lecs[0], sel = 'button.ts-lec-chip.abre[data-parte="' + parte + '"]';
    var c0 = D.querySelector(sel); if (c0 && visible(c0)) { pulsa(c0); return; }
    pulsa($('alu-campana-btn'));
    var n = 0, tm = setInterval(function () { var c = D.querySelector(sel); if ((c && visible(c)) || ++n > 30) { clearInterval(tm); if (c) pulsa(c); } }, 100);
  }
  /* (21-oct-2026, Iago: «cuando aparece la portada, PreDict Carrusel, no me aparece el enlace para ir directamente a la
     aplicación») PreDict Carrusel, fuera del portal (Teoría, Ritmo…) o sin su botón en el portal: la app directamente. GE: el
     Carrusel Elemental en modo pantalla (la dirección de la espiral del portal); GP: PreDict PRO Carrusel. En la pestaña del
     carrusel (la de la espiral), recién pedida; si el navegador no deja abrirla, en esta. */
  var CARRUSEL = { ge: 'https://iagonaron.github.io/PredictCarrusel/?pantalla=1', gp: 'https://iagonaron.github.io/PreDictPROCarrusel/' };
  function carruselGP() { return /gp/i.test(MEMO.g || '') || (!MEMO.g && GRADO === 'gp'); }
  function abreCarrusel(gp) {
    var u = gp ? CARRUSEL.gp + '?t=' + Date.now() : CARRUSEL.ge + '&t=' + Date.now(), w = null;
    try { w = W.open(u, 'lm-carrusel-pantalla'); } catch (e) {}
    if (!w) { try { location.href = u; } catch (e) {} }
  }
  function irA(b) {
    if (!b) return null;
    if (/^PreDict/.test(String(b.t || ''))) {   /* (21-oct-2026) PreDict Carrusel: también fuera del portal */
      var eC = PORTAL ? (D.querySelector('#ge-espiral') || D.querySelector('.topbar-right .carrusel-btn')) : null, gpC = carruselGP();
      if (eC) return { t: 'Abrir PreDict Carrusel', fn: function () { pulsa(eC); } };   /* en el portal, su botón (como antes) */
      return { t: 'Abrir PreDict ' + (gpC ? 'PRO ' : '') + 'Carrusel', fn: function () { abreCarrusel(gpC); } };
    }
    if (!PORTAL) return null;
    var t = String(b.t || ''), s = String(b.s || ''), m, el;
    if (b.vid) return { t: b.vid.tema ? 'Abrir ' + String(b.vid.t).split(' · ')[0] : '▶ ' + b.vid.t, fn: function () { abrirVideo(b.vid); } };
    if (b.lecs && b.lecs.length && $('alu-campana-btn')) return { t: 'Abrir la lección ' + listaY(b.lecs), fn: function () { leccionIr(b.lecs); } };
    if (t === 'Ritmo' && (m = /^Carta\s+(\d+(?:\.\d+)?)/.exec(s))) {
      el = D.querySelector('#ri-mini .da-btn[data-carta="' + m[1] + '"]');
      if (el) return { t: 'Abrir la carta ' + m[1], fn: function () { pulsa(el); } };
    }
    if (t === 'Evaluación de ritmo' && (el = D.querySelector('#rs-mini .rs-btn.verde') || D.querySelector('#rs-mini .rs-btn.violeta'))) return { t: 'Resultados de ritmo', fn: function () { pulsa(el); } };
    if (/^FaActos/.test(t)) return libroIr('faactos', 'Abrir FaActos');
    if (t === 'Intervalia') return libroIr('intervalia', 'Abrir Intervalia');
    if (t === 'Intervalia PRO') return libroIr('intervalia_pro', 'Abrir Intervalia PRO');
    if ((t === 'Dictado' || t === 'Corrección del dictado') && (el = D.querySelector('#lm-iconos .lm-ic-dict'))) { m = /(\d+)/.exec(s); return { t: 'Abrir el dictado' + (m ? ' nº ' + m[1] : ''), fn: function () { pulsa(el); } }; }
    if (/^(Preparación entonación|Entonación)$/.test(t) && (el = D.querySelector('#lm-iconos .lm-ic-ento'))) return { t: 'Abrir entonación', fn: function () { pulsa(el); } };
    /* PreDict Carrusel: al principio de irA (21-oct-2026). GE: la espiral (PreDict Carrusel) · GP: PreDict PRO Carrusel */
    return null;
  }
  var ICONOS = { ritmo: '.lm-ic-ritmo', entonacion: '.lm-ic-ento', dictado: '.lm-ic-dict', intervalia: '.lm-ic-libros', teoria: '.lm-ic-penta' };
  function iconoActivo(b) {   /* en el portal, lo que toca con contorno amarillo: su icono; en la preparación de ritmo, la campana */
    if (!PORTAL) return;
    var lecs = (b && b.lecs) || null, sel = ICONOS[(b && b.tema) || ''] || '';
    var el = lecs ? $('alu-campana-btn') : (sel ? D.querySelector('#lm-iconos ' + sel) : null);
    if (!lecs && b && /^PreDict/.test(b.t || '')) el = D.querySelector('#ge-espiral') || D.querySelector('.topbar-right .carrusel-btn') || el;   /* (20-oct-2026, Iago) PreDict Carrusel: la caracola, no el dictado */
    if (ANT.icono && ANT.icono !== el) { ANT.icono.classList.remove('lme-ic'); ANT.icono = null; }
    if (el && !el.classList.contains('lme-ic')) { el.classList.add('lme-ic'); ANT.icono = el; }
    /* y dentro de la campana («Tareas de la semana»), el botón de la lección (o lecciones) de hoy */
    var quiero = lecs ? lecs.map(function (n) { return 'leccion_' + n; }) : [];
    Array.prototype.forEach.call(D.querySelectorAll('.ts-lec-chip'), function (c) {
      var si = quiero.indexOf(c.getAttribute('data-parte') || '') >= 0;
      if (si !== c.classList.contains('lme-ic')) c.classList.toggle('lme-ic', si);
    });
    try { grisDebajo(); } catch (e) {}   /* (20-oct-2026) el contorno, por encima del gris */
  }
  /* (20-oct-2026, Iago: «si yo esa notificación la tengo grisácea porque ya la hice, veo el contorno, pero no lo veo de color
     amarillo… que el gris no esté por encima de mi contorno amarillo… que se vea amarillo, aunque el resto de la notificación
     siga estando gris») EL GRIS, DEBAJO DEL CONTORNO. El gris de lo hecho (un filtro grayscale y una opacidad en la tarjeta o en
     la fila) apaga también el contorno de lo que llevan dentro. Mientras la lección está marcada, el gris se quita de los
     «padres» de su botón y se pone igual en todo lo demás (sus hermanos); el propio botón, con sus colores apagados como el resto
     y el contorno, amarillo de verdad. Sin :has() (antes, una regla con :has() devolvía el color a TODA la tarjeta, y en algunos
     navegadores no hacía nada). Solo dentro de la campana (#alu-body). Para quitarlo: GRIS_ON = false. */
  var GRIS_ON = true, GRIS = { chips: [], cambios: [] };
  function grisPon(el, p, v) { GRIS.cambios.push({ el: el, p: p, v: el.style.getPropertyValue(p), pr: el.style.getPropertyPriority(p) }); el.style.setProperty(p, v, 'important'); }
  function grisFuera() {
    for (var i = GRIS.cambios.length - 1; i >= 0; i--) {
      var c = GRIS.cambios[i];
      try { if (c.v) c.el.style.setProperty(c.p, c.v, c.pr); else c.el.style.removeProperty(c.p); } catch (e) {}
    }
    GRIS.cambios = []; GRIS.chips = [];
  }
  function grisApagado(col, op) {   /* un color como lo dejarían grayscale(1) y la opacidad de lo hecho */
    var m = /rgba?\(([^)]+)\)/.exec(col || ''); if (!m) return null;
    var p = m[1].split(',').map(function (x) { return parseFloat(x); }), a = p.length > 3 ? p[3] : 1;
    var l = Math.round(0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]);
    return 'rgba(' + l + ',' + l + ',' + l + ',' + (Math.round(a * op * 1000) / 1000) + ')';
  }
  function grisDebajo() {
    if (!GRIS_ON) return;
    var chips = Array.prototype.slice.call(D.querySelectorAll('#alu-body .lme-ic'));
    var igual = chips.length === GRIS.chips.length && chips.every(function (c, i) { return c === GRIS.chips[i] && c.isConnected; }) &&
      GRIS.cambios.every(function (c) { return c.el.isConnected; });
    if (igual) return;
    grisFuera();
    GRIS.chips = chips;
    chips.forEach(function (chip) {
      var ruta = [], a = chip.parentElement, k = 0;
      while (a && a.id !== 'alu-body' && a !== D.body && k++ < 14) { ruta.unshift(a); a = a.parentElement; }
      if (!a || a.id !== 'alu-body' || !ruta.length) return;
      var nat = ruta.map(function (el) { var cs = getComputedStyle(el); return { g: /grayscale/.test(cs.filter || ''), o: parseFloat(cs.opacity) }; });
      if (!nat.some(function (x) { return x.g || x.o < 0.999; })) return;   /* nada en gris: nada que hacer */
      var g = false, o = 1;
      ruta.forEach(function (el, i) {
        var n = nat[i], sig = ruta[i + 1] || chip;
        if (n.g || n.o < 0.999) { grisPon(el, 'filter', 'none'); grisPon(el, 'opacity', '1'); }
        g = g || n.g; o = o * (isNaN(n.o) ? 1 : n.o);
        if (!g && o >= 0.999) return;
        Array.prototype.forEach.call(el.children, function (h) {
          if (h === sig) return;
          var cs = getComputedStyle(h), f = (cs.filter && cs.filter !== 'none') ? cs.filter : '', oh = parseFloat(cs.opacity);
          if (g && !/grayscale/.test(f)) grisPon(h, 'filter', (f + ' grayscale(1)').replace(/^\s+/, ''));
          if (o < 0.999) grisPon(h, 'opacity', String(Math.round((isNaN(oh) ? 1 : oh) * o * 1000) / 1000));
        });
      });
      /* el propio botón: su texto, icono y borde, apagados como lo demás; el contorno, sin tocar (amarillo) */
      var cc = getComputedStyle(chip), c1 = g ? grisApagado(cc.color, o) : null, c2 = g ? grisApagado(cc.borderTopColor, o) : null;
      if (!g && o < 0.999) {
        c1 = (function (col) { var m = /rgba?\(([^)]+)\)/.exec(col || ''); if (!m) return null; var p = m[1].split(',').map(parseFloat); return 'rgba(' + p[0] + ',' + p[1] + ',' + p[2] + ',' + (Math.round((p.length > 3 ? p[3] : 1) * o * 1000) / 1000) + ')'; })(cc.color);
        c2 = (function (col) { var m = /rgba?\(([^)]+)\)/.exec(col || ''); if (!m) return null; var p = m[1].split(',').map(parseFloat); return 'rgba(' + p[0] + ',' + p[1] + ',' + p[2] + ',' + (Math.round((p.length > 3 ? p[3] : 1) * o * 1000) / 1000) + ')'; })(cc.borderTopColor);
      }
      if (c1) grisPon(chip, 'color', c1);
      if (c2) grisPon(chip, 'border-color', c2);
    });
  }
  /* (16-oct-2026, 18:00, Iago: «en el portal… la escaleta tapa algunos botones, como el de los morosos y alguno más… me gustaría
     que el lugar donde esté la escaleta siga siendo en el centro, arriba, para que… en las ventanas, aunque haya variantes, se
     sigan viendo en el mismo lugar») la tarjeta va SIEMPRE arriba en el centro, como en las apps, y lo que habría debajo se
     aparta: la fila de botones de la derecha (⚠ morosos, pizarra, libros, ritmo… campana) se corre a la derecha lo justo, sin
     salirse de la pantalla; si ni así cabe (pantalla estrecha), la tarjeta se estrecha. La píldora «Digital/papel», con la
     tarjeta, no se ve (CSS). Antes: la tarjeta se iba a la izquierda, entre «Salir» y los botones, y tapaba el ⚠ y la píldora. */
  /* (16-oct-2026, 18:50, Iago: «la pantalla del aula hace que ese encogimiento sea a tirones porque va con pocos frames…
     me gustaría que fuese igual siempre de ancho… o que el encogimiento sea automático, sin que se pretenda que sea un
     movimiento fluido») la tarjeta tiene SIEMPRE el mismo ancho (300 px; antes 333 y aquí se estrechaba) y la fila se aparta
     DE GOLPE, sin animación. Antes se medía la fila a medio deslizar y el cálculo se realimentaba: la fila (y a veces la
     tarjeta) no paraban de moverse. Ahora se mide en su sitio (sin desplazar; no se pinta nada entre medias), como mucho una
     vez por segundo, y solo se toca si cambia de verdad. Solo si ni así cabe (pantalla muy estrecha), la tarjeta se
     estrecha, también de golpe. */
  var APARTA = { dx: 0, w: '', on: false, t: 0 };
  /* (20-oct-2026, 17:45, Iago: «quiero pulsar… el que tiene la clave de sol de color azul y pulso resultados, no me abre… paré la
     escaleta… y ahí sí que me dejó abrir») LA FILA SE CORRE CON «left», NO CON transform. El transform hacía de la fila de botones
     una capa aparte y sus menús (Libros, Ritmo, Entonación) quedaban por debajo del título del portal (.hero, z-index 75): se
     veían, pero el toque caía en el título. Corrida con left (posición relativa) la fila no es capa aparte y sus menús quedan
     encima, como con la escaleta parada. Para volver: CORRE_LEFT = false. */
  var CORRE_LEFT = true;
  function correr(fila, dx) {
    if (!CORRE_LEFT) { fila.style.left = ''; fila.style.transform = dx ? 'translateX(' + dx + 'px)' : ''; return; }
    fila.style.transform = '';
    if (dx) { if (getComputedStyle(fila).position === 'static') fila.style.position = 'relative'; fila.style.left = dx + 'px'; }
    else { fila.style.left = ''; if (fila.style.position === 'relative') fila.style.position = ''; }
  }
  function apartar(forzar) {
    try {
      var fila = PORTAL ? D.querySelector('.topbar-right') : null; if (!fila || !UI) return;
      var on = H.classList.contains('lm-esc-on') && !UI.isla.hidden, dx = 0, w = '', ya = Date.now();
      if (!forzar && on === APARTA.on && ya - APARTA.t < 1000) return;
      APARTA.on = on; APARTA.t = ya;
      if (on) {
        var tr = fila.style.transform, lf = fila.style.left, an = UI.isla.style.width;
        fila.style.transform = ''; fila.style.left = ''; UI.isla.style.width = '';
        var ri = UI.isla.getBoundingClientRect(), rf = fila.getBoundingClientRect();
        fila.style.transform = tr; fila.style.left = lf; UI.isla.style.width = an;
        if (rf.left < ri.right + 12 && rf.right > ri.left - 12 && rf.top < ri.bottom) {
          dx = Math.round(Math.max(0, Math.min(ri.right + 12 - rf.left, W.innerWidth - 8 - rf.right)));
          var cabe = Math.floor(2 * (rf.left + dx - 12 - W.innerWidth / 2));   /* lo ancha que puede ser la tarjeta, centrada */
          if (cabe < ri.width - 1) w = Math.max(250, cabe) + 'px';
        }
      }
      if (Math.abs(dx - APARTA.dx) > 1 || !dx !== !APARTA.dx) { correr(fila, dx); APARTA.dx = dx; }
      if (w !== APARTA.w) { UI.isla.style.width = w; APARTA.w = w; }
    } catch (e) {}
  }
  function colocar(si) {   /* (16-oct-2026) en el portal también arriba en el centro (ver apartar) */
    var isla = UI.isla, al = false;
    if (PORTAL && si) apartar();
    if (!al) { isla.style.left = ''; isla.style.top = ''; isla.style.height = ''; }
    isla.classList.toggle('lme-alineada', al);
    /* el ▶ amarillo, a la derecha de «Salir» */
    if (PORTAL && !UI.play.hidden) {
      try {
        var w2 = $('portal-welcome'), s2 = w2 ? Array.prototype.filter.call(w2.querySelectorAll('button, a'), function (x) { return /salir/i.test(x.textContent || ''); })[0] : null;
        if (s2 && visible(s2)) { var r2 = s2.getBoundingClientRect(); UI.play.style.left = Math.round(r2.right + 10) + 'px'; UI.play.style.top = Math.round(r2.top + (r2.height - 35) / 2) + 'px'; }
        else ver(UI.play, false);
      } catch (e) {}
    }
  }
  function pintarRec(ls) {
    var el = UI.cRec, firma = JSON.stringify(ls); if (!el || el.__f === firma) return; el.__f = firma;
    if (!ls.length) { el.hidden = true; el.innerHTML = ''; return; }
    el.innerHTML = '<svg class="lme-rec-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-label="' +
      (ls.length > 1 ? 'Recordatorios' : 'Recordatorio') + '"><path d="M12 17v5"/><path d="M9 10.8a2 2 0 0 1-1.1 1.8l-1.8.9A2 2 0 0 0 5 15.2v.8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.8a2 2 0 0 0-1.1-1.8l-1.8-.9A2 2 0 0 1 15 10.8V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>' +
      '<div class="lme-rec-ls">' + ls.map(function (r) {
        return '<div class="lme-rec-i">' + (r.t ? '<b>' + esc(r.t) + '</b>' : '') + (r.t && r.d ? ' · ' : '') + esc(r.d) + '</div>';
      }).join('') + '</div>';
    el.hidden = false;
  }
  /* (16-oct-2026, tarde, Iago: «cuando abro el libro de FaActos me desaparece la escaleta… saber cuánto tiempo me queda… en
     versión simplificada arriba, en el margen entre donde pone Acto 3 y cambio de página… lo mismo para Intervalia») con un
     libro del aula abierto (#lb-ov, a pantalla completa), la escaleta en una línea DENTRO de su barra: qué toca, cuánto queda
     y qué viene, con su barrita; con «Ampliar» (sin barra), flotando arriba en el centro. No se pulsa ni tapa la partitura. */
  var PUNTOS = null;   /* (20-oct-2026, 20:45) los puntitos de la intro, apartados a la derecha de la línea */
  var ESCENA = null;   /* (20-oct-2026, 21:15) el cartel de la intro, un poco más abajo (solo en un móvil: la línea va bajo la barra) */
  function miniLibro(v) {
    /* (16-oct-2026, tarde, Iago: «cuando estamos con la pizarra… que no ocupe, no me invada ni tape botones… en el medio, solo con
       una línea») y con la pizarra «Pentagrama» abierta, la misma línea en el centro de su barra (#pz-esc, entre colores y grosores) */
    /* (16-oct-2026, 18:50, Iago: «durante el dictado animado pon la escaleta también en modo una línea, como en los casos que
       hablamos antes») y con el dictado animado abierto, en su barra de arriba, entre «DICTADO nº 5 · …» y Tonalidad · Compás
       (en medio del hueco); la tarjeta no sale (tapaba «SEGUNDA FRASE»). También a pantalla completa: va dentro del dictado. */
    var lb = $('lb-ov'), pz = $('pz-esc'), dc = $('dcOverlay'), el = $('lme-mini');
    var mar = $('lm-marco-app'), mBar = (mar && mar.classList.contains('abierto')) ? mar.querySelector('.lm-ma-bar') : null, enMarco = !!mBar;   /* (20-oct-2026) Resultados */
    var ino = $('introOv'), iBar = (!enMarco && ino && ino.classList.contains('show')) ? ino.querySelector('.intro-bar') : null, enIntro = !!iBar;   /* (20-oct-2026) la intro de la carta */
    if (PUNTOS && (!enIntro || !v)) { try { PUNTOS.style.transform = ''; PUNTOS.style.visibility = ''; } catch (e) {} PUNTOS = null; }   /* (20-oct-2026, 20:45) los puntitos, a su sitio */
    if (ESCENA && (!enIntro || !v)) { try { ESCENA.style.marginTop = ''; } catch (e) {} ESCENA = null; }   /* (20-oct-2026, 21:15) y el cartel */
    var lv = $('lme-video'), avo = (!enMarco && !enIntro) ? (D.querySelector('.apxf-vid') || ((lv && lv.classList.contains('lme-did')) ? lv : null)) : null;   /* (20-oct-2026) y el del ▶ de la tarjeta */
    var vCaja = avo ? avo.querySelector('.apxf-vid-caja, .lme-vcaja') : null, enVid = !!vCaja;
    /* (21-oct-2026) y el visor de vídeos de las tarjetas de Teoría (.ivg-caja, fija en la pantalla): la línea en la página */
    var ivg = (!enMarco && !enIntro && !enVid) ? D.querySelector('.ivg-caja') : null;
    if (ivg) { avo = D.body; vCaja = ivg; enVid = true; }   /* (20-oct-2026) un vídeo de Teoría */
    var enLibro = !enMarco && !enIntro && !enVid && !!(lb && lb.classList.contains('open')), enPiz = !enMarco && !enIntro && !enVid && !enLibro && !!(pz && H.classList.contains('pz-abierto'));
    var dTop = (!enMarco && !enIntro && !enVid && !enLibro && !enPiz && dc && visible(dc)) ? dc.querySelector('.dc-top') : null, enDic = !!dTop;
    if (!v || !(enMarco || enIntro || enVid || enLibro || enPiz || enDic)) { if (el) el.hidden = true; return false; }
    if (!el) {
      el = D.createElement('div'); el.id = 'lme-mini';
      el.innerHTML = '<span class="lme-mt"></span><span class="lme-mm"></span><i class="lme-mb"><b></b></i>' +   /* (Iago) solo la actividad actual */
        '<button type="button" class="lme-mmas" title="Ver toda la escaleta" aria-label="Ver toda la escaleta">' + SVG.mas + '</button>';   /* (16-oct-2026) + */
      var mb = el.querySelector('.lme-mmas');
      ['pointerdown', 'mousedown', 'touchstart', 'pointerup', 'mouseup', 'touchend', 'click'].forEach(function (ev) {
        mb.addEventListener(ev, function (e) { e.stopPropagation(); if (ev === 'click') { e.preventDefault(); abrirTodo(); } });
      });
    }
    if (enMarco) { var mx = mBar.querySelector('.lm-ma-x'); if (el.parentNode !== mBar || (mx && el.nextSibling !== mx)) mBar.insertBefore(el, mx || null); }
    else if (enIntro) { if (el.parentNode !== ino) ino.appendChild(el); }
    else if (enVid) { if (el.parentNode !== avo) avo.appendChild(el); }   /* (20-oct-2026) en el margen negro de arriba del vídeo de Teoría */   /* (20-oct-2026) en la intro, encima de su barra (no dentro: en el repaso la barra va en gris) */
    else if (enPiz) { if (el.parentNode !== pz) pz.appendChild(el); }
    else if (enDic) { var der = dTop.querySelector('.dc-top-derecha'); if (el.parentNode !== dTop || (der && el.nextSibling !== der)) dTop.insertBefore(el, der || null); }
    else {
      var amp = lb.classList.contains('lb-amp'), top = lb.querySelector('.lb-top'), prev = $('lb-prev');
      if (!amp && top && prev && prev.parentNode === top) { if (el.parentNode !== top || el.nextSibling !== prev) top.insertBefore(el, prev); }
      else if (el.parentNode !== lb) lb.appendChild(el);
    }
    el.classList.toggle('lme-flota', enLibro && el.parentNode === lb);
    el.classList.toggle('lme-piz', enPiz);
    el.classList.toggle('lme-marco', enMarco);
    el.classList.toggle('lme-intro', enIntro);
    el.classList.toggle('lme-vid', enVid);
    el.classList.toggle('lme-ivg', !!ivg);   /* (21-oct-2026) */
    el.classList.toggle('lme-dic', enDic);
    var B = v.B, a = v.a, b = B[a.i], extra = a.resto < 0 && a.mg > 0;
    var m = extra ? 'extra ' + minutos(Math.max(0, a.mg - Math.min(a.mg, -a.resto))) : 'quedan ' + minutos(Math.max(0, a.resto));
    if (a.pausa) m = 'en pausa · ' + m;
    txt(el.children[0], b.t);   /* solo qué toca (el acto y la lección ya se ven en el libro) */
    txt(el.children[1], m);
    el.classList.toggle('lme-extra', extra);
    el.children[2].firstChild.style.width = (extra ? 100 : Math.max(0, Math.min(100, (1 - Math.max(0, a.resto) / a.dur) * 100))).toFixed(1) + '%';
    if (enIntro) {   /* (20-oct-2026, 20:45, Iago: «me gusta que la escaleta esté siempre en el centro, arriba… que la referencia sea arriba
       en el medio») centrada en la pantalla, a la altura de la barra de la intro (antes, justo detrás de «INTRO · 1.6 …», a la
       izquierda); el sitio exacto, más abajo, ya visible (para poder medirla) */
      try {
        var rO = ino.getBoundingClientRect(), rB = iBar.getBoundingClientRect();
        el.style.left = Math.round(rO.width / 2) + 'px'; el.style.top = Math.round(rB.top - rO.top + (rB.height - 36) / 2) + 'px'; el.style.maxWidth = '440px';
      } catch (e) {}
    } else if (enVid) {   /* (20-oct-2026) centrada en el margen negro de arriba, sin tocar el vídeo */
      try {
        var rA = ivg ? { top: 0 } : avo.getBoundingClientRect(), rC = vCaja.getBoundingClientRect(), banda = rC.top - rA.top;   /* (21-oct-2026) ivg: desde arriba de la pantalla */
        el.style.left = '50%'; el.style.top = Math.max(2, Math.round((banda - 36) / 2)) + 'px'; el.style.maxWidth = 'min(560px, 60vw)';
      } catch (e) {}
    } else if (el.style.left) { el.style.left = ''; el.style.top = ''; el.style.maxWidth = ''; }
    el.hidden = false;
    if (enIntro) try {   /* (20-oct-2026, 21:15, Iago: «lo importante es que el botón de avanzar esté habilitado, que los títulos de los
       carteles estén habilitados y ya está… si la escaleta está justo encima de esos puntitos, lo vamos a considerar un mal menor»)
       1) centrada en la pantalla si cabe entre el título («INTRO · 1.6 …») y ← «Siguiente» ✕ (el aula, el iPad); 2) si no (ventana
       estrecha), lo más cerca del centro que quepa entre los dos; 3) si ni así (un móvil), justo debajo de la barra, centrada, y el
       cartel 44 px más abajo (si no, tapaba «EN LA ANTERIOR CARTA…»). Nunca encima de un título ni de los botones. Los puntitos que
       queden debajo de la línea: a su derecha si caben antes de los botones; si no, a su
       izquierda si caben tras el título; si no, escondidos mientras tanto (solo dicen en qué paso va; vuelven al cerrar la intro) */
      var rOi = ino.getBoundingClientRect(), rBi = iBar.getBoundingClientRect(), iTit = iBar.querySelector('.intro-brand'), iNav = iBar.querySelector('.intro-nav'), iPun = iBar.querySelector('.intro-dots');
      if (iPun) { iPun.style.transform = ''; iPun.style.visibility = ''; PUNTOS = null; }
      var rTi = (iTit && iTit.getClientRects().length) ? iTit.getBoundingClientRect() : null, rNi = (iNav && iNav.getClientRects().length) ? iNav.getBoundingClientRect() : null;
      if (rTi && !rTi.width) rTi = null; if (rNi && !rNi.width) rNi = null;
      var cxI = rOi.width / 2, izI = (rTi ? rTi.right : rBi.left - 2) - rOi.left + 12, deI = (rNi ? rNi.left : rBi.right + 2) - rOi.left - 12;
      var anI = Math.min(440, el.getBoundingClientRect().width), mxI = 440, ceI = cxI, abI = false;
      if (cxI - anI / 2 >= izI && cxI + anI / 2 <= deI) { /* 1) cabe en el centro tal cual */ }
      else if (2 * Math.min(cxI - izI, deI - cxI) >= 150) mxI = Math.floor(2 * Math.min(cxI - izI, deI - cxI));   /* 1) en el centro, más estrecha */
      else if (deI - izI >= 150) { mxI = Math.floor(Math.min(440, deI - izI)); var anI2 = Math.min(anI, mxI); ceI = Math.min(Math.max(cxI, izI + anI2 / 2), deI - anI2 / 2); }   /* 2) */
      else { abI = true; mxI = Math.floor(Math.min(440, rOi.width - 32)); }   /* 3) */
      el.style.maxWidth = mxI + 'px'; el.style.left = Math.round(ceI) + 'px';
      if (abI) el.style.top = Math.round(rBi.bottom - rOi.top + 4) + 'px';
      var iEsc = abI ? ino.querySelector('.intro-stage') : null;
      if (iEsc) { if (iEsc.style.marginTop !== '44px') iEsc.style.marginTop = '44px'; ESCENA = iEsc; } else if (ESCENA) { ESCENA.style.marginTop = ''; ESCENA = null; }
      if (iPun && !abI) {
        var rMi = el.getBoundingClientRect(), rDi = iPun.getBoundingClientRect();
        if (rDi.width && rDi.left < rMi.right + 12 && rDi.right > rMi.left - 12) {
          var limD = rNi ? rNi.left - 8 : rBi.right - 10, limI = rTi ? rTi.right + 8 : rBi.left + 10;
          if (rMi.right + 14 + rDi.width <= limD) iPun.style.transform = 'translateX(' + Math.round(rMi.right + 14 - rDi.left) + 'px)';
          else if (rMi.left - 14 - rDi.width >= limI) iPun.style.transform = 'translateX(' + Math.round(rMi.left - 14 - rDi.right) + 'px)';
          else iPun.style.visibility = 'hidden';
          PUNTOS = iPun;
        }
      }
    } catch (e) {}
    return true;
  }
  var ULT = 0, COLOCADA = 0;
  function pintar(forzar) {
    if (D.hidden && !forzar) return;
    var t = ahora(); if (!forzar && t - ULT < 200) return; ULT = t;
    if (!cuenta()) { cerrarTodo(); if (UI) { ver(UI.isla, false); ver(UI.play, false); ver(UI.indice, false); ver(UI.cuenta, false); ver(UI.cartel, false); ver(UI.fin, false); } H.classList.remove('lm-esc-on'); return; }
    if (!forzar && ANT.nada && t < ANT.nada) return;   /* sin clase: se mira cada 2 s */
    var v = vista(t);
    ANT.nada = (v.fase === 'nada' || v.fase === 'acabada') ? t + 2000 : 0;
    if (ANT.nada) { despierto(false); callarBateria(true); }
    if (PV.caja && !/^(antes|entrada|cuenta|indice)$/.test(v.fase) && !(v.fase === 'parada' && v.desde < 0) && !(EMPIEZA && EMPIEZA.hasta > Date.now()) && Date.now() - PV.visto > 5000) pvQuita();   /* (17-oct-2026) la previa, fuera */
    if (v.fase === 'nada' && !UI) return;
    if (!montar()) return;
    var inm = inmersivo();
    avisar(v); abrirMorosos(v);
    /* la salida de sonido despierta un poco antes de «Hoy en clase» (el mini-jack del aula tarda en espabilar) */
    if (v.fase === 'entrada' && v.desde >= 300 - (v.cu || CUENTA) - (v.ind || 0) - 12) despierto(true);
    try { if (v.c && (v.fase === 'antes' || v.fase === 'entrada' || (v.fase === 'parada' && v.desde < 0)) && v.desde >= -PREVIA_ADELANTE) pvPrepara(v); } catch (e) {}   /* (17-oct-2026) la previa, escondida y lista */
    if (v.c && v.fase !== 'nada' && v.fase !== 'acabada') cargarSonidos();
    /* la PREPARACIÓN (4:16–4:48, la cuenta atrás) y «HOY EN CLASE» (4:48–5:00, cargando las actividades) */
    var enPrevia = (v.fase === 'cuenta' || v.fase === 'indice') && inm !== 'pantalla';
    var agenda = enPrevia ? agendaHoy(v.pub, v.c.grupo) : null, hayIndice = !!(agenda && agenda.length);
    var plan = enPrevia ? planIndice(hayIndice ? agenda : []) : null;
    if (plan) BAT.plan = plan;
    var enIndice = v.fase === 'indice' && hayIndice;
    if (enIndice) {
      if (UI.indice.hidden) {
        txt(UI.iEy, grupoBonito(v.c.grupo) + ' · ' + DIA_NOMBRE[v.c.dia]);
        /* cada línea, cuando le toca su golpe (en segundos desde ahora: si la página se abre a medias, lo de antes ya está) */
        var fin = v.t5, ya = t, num = 0;
        var dk = function (k) { return ((fin - k * PASO * 1000 - ya) / 1000).toFixed(2) + 's'; };
        UI.indice.classList.toggle('lme-apretado', plan.n > 8);
        UI.iList.innerHTML = plan.filas.map(function (fi) {
          var x = fi.x;
          if (x.sep) return '<li class="lme-isep" style="--d1:' + dk(fi.k) + ';--d2:' + dk(fi.d2) + '" aria-hidden="true"><span class="lme-sw">' +
            'Descanso'.split('').map(function (ch, i) { return '<i style="--k:' + i + '">' + ch + '</i>'; }).join('') + '</span><span class="lme-sr"></span></li>';
          num++;
          var est = ' style="--c:' + (COLOR_TEMA[x.tema] || COLOR_TEMA.otra) + ';animation-delay:' + dk(fi.k) + '"';
          if (x.lineas) return '<li class="lme-ii lme-imulti ' + x.tema + '"' + est + '><b>' + num + '</b><span>' + esc(x.t) + ':' +
            x.lineas.map(function (l, j) { return '<i class="lme-il" style="animation-delay:' + dk(fi.subs[j]) + '">– ' + esc(l) + '</i>'; }).join('') + '</span></li>';
          return '<li class="lme-ii ' + x.tema + '"' + est + '><b>' + num + '</b><span>' + esc(x.t) + '</span></li>';
        }).join('');
        var carga = UI.indice.querySelector('.lme-carga');
        if (carga) carga.style.animation = 'lmeSale .5s ' + dk(plan.kFin) + ' ease forwards';   /* cargado: se va el circulito */
        ver(UI.indice, true); pararMusica();
      }
      var pc = Math.min(100, Math.max(0, (1 - v.queda / (v.ind || 1)) * 100));
      UI.iBar.style.width = pc.toFixed(2) + '%'; txt(UI.iCarga, Math.floor(pc) + ' %');
    } else if (!UI.indice.hidden) ver(UI.indice, false);
    /* la cuenta atrás (si no hay índice publicado, sigue hasta el 5:00) */
    var enCuenta = enPrevia && !enIndice;
    var conPv = false; try { conPv = enCuenta && pvUsa(v); } catch (e) {}   /* (17-oct-2026) la previa, en su marco */
    if (conPv) { pvMuestra(v); enCuenta = false; } else pvOculta();
    if (enCuenta) {
      var totalC = v.cu || CUENTA, q = Math.max(0, v.queda);
      if (UI.cuenta.hidden) { ver(UI.cuenta, true); if (!BARR.raf) BARR.raf = requestAnimationFrame(barras); pararMusica(); }
      txt(UI.cEy, grupoBonito(v.c.grupo) + ' · la clase empieza en');
      pintarRec(recordatorios(v.pub, v.c.grupo));
      UI.cNum.innerHTML = Math.floor(Math.ceil(q) / 60) + '<span class="lme-dp">:</span>' + ('0' + (Math.ceil(q) % 60)).slice(-2);
      UI.cBar.style.width = Math.min(100, (1 - q / totalC) * 100).toFixed(2) + '%';
    } else if (!UI.cuenta.hidden) {
      ver(UI.cuenta, false); if (BARR.raf) { cancelAnimationFrame(BARR.raf); BARR.raf = 0; }
    }
    /* la batería suena en las dos; en el 5:00 cierra sola (y el platillo se deja oír); si la clase se empieza antes con
       ▶, o se para, o se va a pantalla completa, se calla */
    var autoIni = v.fase === 'clase' && v.e && (v.e.auto || +v.e.arr === v.t5) && v.desde <= 303;
    if (enPrevia) { despierto(true); bateria(v.t5, pvSonido(v)); }
    else if (BAT.vivo && !autoIni) callarBateria();
    /* la tarjeta */
    /* (16-oct-2026, tarde) con un libro abierto, la línea dentro de él (y con la pizarra; y desde las 18:50, en el dictado animado) */
    var hayMini = false; try { hayMini = !!miniLibro(v.fase === 'clase' && !!v.a ? v : null); } catch (e) {}
    var conIsla = v.fase === 'clase' && !!v.a && inm !== 'pantalla' && inm !== 'marco' && inm !== 'intro' && inm !== 'vidteoria' && !(inm === 'dictado' && hayMini);   /* (16-oct-2026, 18:50) en el dictado, solo la línea */
    ver(UI.isla, conIsla);
    H.classList.toggle('lm-esc-on', conIsla);
    if (PORTAL) apartar();   /* (16-oct-2026) la fila de botones, apartada o en su sitio */
    if (TODO.abierto) { if (v.fase === 'clase' && v.a && (conIsla || hayMini)) { try { pintarTodo(v); } catch (e) { cerrarTodo(); } } else cerrarTodo(); }   /* (16-oct-2026) + */
    if (conIsla) {
      var B = v.B, a = v.a, b = B[a.i], p = B[a.i - 1], n = B[a.i + 1];
      txt(UI.ant, p ? p.t + ' · ' + p.m + ' min' : '');
      txt(UI.t, b.t); txt(UI.s, b.s);
      VID_ACTUAL = b.vid || null; ver(UI.vrow, !!VID_ACTUAL); if (VID_ACTUAL) txt(UI.vid, '▶ ' + VID_ACTUAL.t);   /* (16-oct-2026) vídeo */
      var extra = a.resto < 0 && a.mg > 0, isla = UI.isla;
      isla.classList.toggle('lme-extra', extra); isla.classList.toggle('lme-pausa', !!a.pausa);
      var mh;
      if (extra) {
        var total = a.dur + a.mg, usado = Math.min(a.mg, -a.resto);
        mh = (a.pausa ? 'en pausa · ' : '') + '<span class="lme-exl">extra</span>' + esc(minutos(a.mg - usado));
        UI.bar.style.width = (a.dur / total * 100).toFixed(2) + '%'; ver(UI.ex, true); UI.ex.style.width = (a.mg / total * 100).toFixed(2) + '%'; UI.ex.firstChild.style.width = (usado / a.mg * 100).toFixed(1) + '%';
      } else {
        mh = (a.pausa ? 'en pausa · ' : '') + esc(minutos(Math.max(0, a.resto))) + (a.mg >= 5 ? '<span class="lme-mg">+' + mmss(a.mg) + '</span>' : '');
        UI.bar.style.width = Math.max(0, Math.min(100, (1 - Math.max(0, a.resto) / a.dur) * 100)).toFixed(2) + '%'; ver(UI.ex, false);
      }
      if (UI.m.innerHTML !== mh) UI.m.innerHTML = mh;
      txt(UI.sig, n ? 'Siguiente: ' + n.t + ' · ' + n.m + ' min' : 'Siguiente: fin de la clase');
      var pk = a.pausa ? 'seguir' : 'pausa';
      if (UI.bPausa.getAttribute('data-k') !== pk) { UI.bPausa.innerHTML = SVG[pk]; UI.bPausa.setAttribute('data-k', pk); UI.bPausa.title = a.pausa ? 'Seguir' : 'Pausa'; UI.bPausa.setAttribute('aria-label', UI.bPausa.title); }
      if (forzar || t - COLOCADA > 1000) { COLOCADA = t; colocar(true); }
      iconoActivo(b);
      /* el cartel: al cambiar de actividad (los primeros 5 s), salvo en lo inmersivo */
      var k = claveCambio(v), desdeCambio = t - (+a.ini);
      if (CART.visto !== k) {
        CART.visto = k;
        var forz = CART.forzar && CART.forzar.i === a.i && t - CART.forzar.t < 3000; CART.forzar = null;
        if (conCartel(inm) && (forz || (desdeCambio >= 0 && desdeCambio < 4500 && !a.pausa))) mostrarCartel(v, forz ? 5000 : 5000 - desdeCambio);   /* (16-oct-2026) antes: !inm */
        else if (!UI.cartel.hidden) quitarCartel(true);
      }
    } else {
      iconoActivo(null); if (!UI.cartel.hidden && v.fase !== 'clase') quitarCartel(true);
      /* (16-oct-2026, tarde) con el dictado animado a pantalla completa la tarjeta no se ve, pero el cartel del cambio SÍ */
      if (v.fase === 'clase' && v.a && conCartel(inm)) {
        var k2 = claveCambio(v), desde2 = t - (+v.a.ini);
        if (CART.visto !== k2) {
          CART.visto = k2;
          var forz2 = CART.forzar && CART.forzar.i === v.a.i && t - CART.forzar.t < 3000; CART.forzar = null;
          if (forz2 || (desde2 >= 0 && desde2 < 4500 && !v.a.pausa)) mostrarCartel(v, forz2 ? 5000 : 5000 - desde2);
        }
      }
    }
    try { descanso(v, inm); } catch (e) {}   /* (16-oct-2026, 19:00) el descanso, a pantalla completa todo el rato */
    if (!UI.cartel.hidden) {
      if (!conCartel(inm)) quitarCartel(true);   /* (16-oct-2026) antes: if (inm) */
      else { var qd = CART.hasta - Date.now(); UI.kBar.style.width = Math.min(100, (1 - qd / 5000) * 100).toFixed(2) + '%'; if (qd <= 0) quitarCartel(false); }
    }
    /* el ▶ amarillo (portal): antes de empezar, en la entrada y tras ■ */
    var conPlay = PORTAL && !inm && (v.fase === 'antes' || v.fase === 'entrada' || v.fase === 'parada') && v.B && v.B.length > 0;
    if (conPlay && UI.play.hidden) { ver(UI.play, true); colocar(false); } else if (!conPlay) ver(UI.play, false);
    if (conPlay && (forzar || t - COLOCADA > 1000)) { COLOCADA = t; colocar(false); }
    /* fin de la clase */
    var conFin = v.fase === 'fin' && conCartel(inm);   /* (16-oct-2026) antes: && !inm */
    if (conFin && UI.fin.hidden) {
      txt(UI.fEy, grupoBonito(v.c.grupo) + ' · ' + v.c.clase.toUpperCase() + ' · ' + DIA_NOMBRE[v.c.dia]);
      var ls = v.c.clase === 'c2' ? tareas(v.pub, v.c.curso) : [];
      UI.fT.innerHTML = ls.length ? '<h3>Tareas para casa</h3>' + ls.map(function (x) { return '<div class="lme-tarea ' + x.tema + '"><i></i><span>' + esc(x.t) + '</span></div>'; }).join('') : '';
      FALTAS = false; pintaFaltas();   /* (16-oct-2026) «poner faltas», sin marcar */
      AUS.t = 0; pintaAusentes();   /* (16-oct-2026, 19:20) no vinieron: se pide ya (abajo) */
      ver(UI.fT, ls.length > 0); alFrente(UI.fin); ver(UI.fin, true); ding();   /* (16-oct-2026) alFrente */
    } else if (!conFin && !UI.fin.hidden) ver(UI.fin, false);
    if (conFin) { try { ausentes(v.c); } catch (e) {} }   /* (16-oct-2026, 19:20) y cada 20 s mientras está */
  }
  /* las tareas para casa (C2): sin iconos, sin lo de darse de alta en el portal y sin fechas de entrega */
  function tareas(pub, cu) {
    var ls = (pub && Array.isArray(pub.tareas)) ? pub.tareas : [], gp = cu ? /gp$/i.test(cu) : GRADO === 'gp';
    return ls.map(function (l) { return quitarEmojis(typeof l === 'string' ? l : (l && l.t) || ''); }).filter(function (l) {
      return l && !/(alta|entrar)\b.*\bportal|portal at home|lmathome\.es/i.test(l);
    }).map(function (l) {
      l = l.replace(/\s*[·-]\s*en el portal.*$/i, '').replace(/\s*,?\s*hasta el .*$/i, '');
      var m = /^lecciones?\s*:?\s*(.+)$/i.exec(l);
      if (m) { var ns = m[1].split(/\s*(?:,|·|\by\b)\s*/).filter(Boolean); var qu = gp ? ' de ritmo entonado ' : ' de ritmo '; return { t: (ns.length > 1 ? 'Lecciones' : 'Lección') + qu + listaY(ns), tema: 'ritmo' }; }
      m = /^ficha\s*(?:nº\s*)?(\d+)(.*)$/i.exec(l);
      if (m) return { t: 'Ficha ' + m[1] + ' de teoría' + (m[2] ? m[2].replace(/^\s*·\s*/, ' · ') : ''), tema: 'teoria' };
      if (/^ficha de teor/i.test(l)) return { t: 'Ficha de teoría', tema: 'teoria' };
      m = /^otras\s*:\s*(.+)$/i.exec(l); if (m) return { t: capital(m[1]), tema: 'otra' };
      return { t: capital(l), tema: /entona/i.test(l) ? 'entonacion' : (/ritmo/i.test(l) ? 'ritmo' : 'otra') };
    });
  }

  /* ---------- arrancar ---------- */
  /* la música del portal (sección 18 de portal.js): se para con su propio botón, si está sonando */
  function pararMusica() {
    try { var b = D.querySelector('#lm-musica .lm-mus-b'); if (b && b.getAttribute('aria-pressed') === 'true') b.click(); } catch (e) {}
  }
  /* los editores en el aula: la barra lleva .lm-vl-aula (el CSS de arriba hace el resto); en entonación, lo que no son
     intervalos pasa a un grupo arriba a la derecha (los mismos botones, que no pierden lo que hacen) */
  var AULA_T = 0;
  function aulaEditores() {
    var t = Date.now(); if (t - AULA_T < 600) return; AULA_T = t;
    Array.prototype.forEach.call(D.querySelectorAll('.lm-vl-bar:not(.lm-vl-aula)'), function (b) { b.classList.add('lm-vl-aula'); });
    var eb = D.querySelector('#lm-ento .lm-en-bar');
    if (eb && !eb.querySelector('.lm-en-her2')) {
      var her = eb.querySelector('.lm-en-her'), fin = eb.querySelector('.lm-vl-fin');
      if (her && fin && fin.parentNode === eb) {
        var g = D.createElement('div'); g.className = 'lm-en-her2';
        Array.prototype.slice.call(her.children).filter(function (c) { return !c.classList.contains('lm-en-int'); }).forEach(function (c) { g.appendChild(c); });
        var s2 = D.createElement('span'); s2.className = 'lm-vl-sep'; s2.setAttribute('aria-hidden', 'true'); g.appendChild(s2);
        eb.insertBefore(g, fin);
        try { W.dispatchEvent(new Event('resize')); } catch (e) {}
      }
    }
  }
  function tic() { try { pintar(false); } catch (e) {} try { if (!D.hidden) aulaEditores(); } catch (e) {} }
  setInterval(tic, 250);
  D.addEventListener('visibilitychange', function () { if (!D.hidden) { EST.t = 0; ESC.t = Math.min(ESC.t, Date.now() - 4 * 60000); pintar(true); } });
  W.addEventListener('focus', function () { EST.t = 0; });
  W.addEventListener('resize', function () { COLOCADA = 0; APARTA.t = 0; });
  D.addEventListener('fullscreenchange', function () {
    /* (16-oct-2026) vídeo: si se sale de su pantalla completa (Esc), se cierra; si es el propio vídeo el que la pide, no */
    var ov = $('lme-video'), fs = D.fullscreenElement || D.webkitFullscreenElement;
    if (ov && ov.__fs && !ov.__cerrando && !(fs && (fs === ov || ov.contains(fs)))) cerrarVideo(true);
    pintar(true);
  });
  D.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' && e.key !== 'Esc') return;
    if ($('lme-video')) { cerrarVideo(); return; }   /* (16-oct-2026) vídeo */
    if (TODO.abierto && !(UI && (!UI.cartel.hidden || !UI.fin.hidden))) { e.stopPropagation(); cerrarTodo(); return; }   /* (16-oct-2026) + */
    if (UI && !UI.cartel.hidden) { fueraDescanso(); quitarCartel(true); }   /* (16-oct-2026, 19:00) el del descanso no vuelve */
    else if (UI && !UI.fin.hidden) { if (!FALTAS) { avisaFaltas(); return; } finVisto(); ver(UI.fin, false); }   /* (16-oct-2026) sin «Poner faltas», no */
  }, true);
  /* ---------- (17-oct-2026, Iago) EL MANDO DE PRESENTACIONES ----------
     «Que la escaleta responda a las teclas de un mando (Re Pág / Av Pág, flechas, B o punto): avanzar, retroceder y pausa.» Un mando
     es un teclado de pocas teclas: Av Pág = siguiente actividad; Re Pág = la anterior; B o «.» (su botón de pantalla en negro) =
     pausa / seguir; F5 (su botón de empezar) = el ▶ amarillo, y en clase nunca recarga la página. Las flechas → y ←, como Av Pág y
     Re Pág, solo en el portal y sin nada con el foco. Antes de empezar, Av Pág también es el ▶. En la previa, Av Pág, → o Esc la
     saltan. Con un libro, la pizarra, el dictado animado, un editor, un vídeo, un menú, la escaleta entera abierta o escribiendo
     en un campo, las teclas son suyas: no se toca nada. Para quitarlo: MANDO = false.
     (18-oct-2026, Iago, con su Norwii N76: «el botón de arriba… es el que utilizaré para play y pause») su botón de arriba (Fn)
     manda Tab: Tab = pausa / seguir, y antes de empezar, el ▶ (como cualquier tecla de pausa). Sus flechas, de fábrica, mandan
     ↑ y ↓: como Re Pág y Av Pág. Las flechas valen también con el foco en un botón o un enlace. Mantener el de arriba es
     Alt-Tab (cambia de ventana): ese no se toca.
     (18-oct-2026, Iago: «al pulsar el botón este de arriba, play, pause… el de la derecha, siguiente actividad… el de la izquierda,
     anterior actividad. Ya está, sin funciones de mantener ni cosas extrañas») SOLO ESAS CUATRO: arriba (Tab) = play / pausa (antes
     de empezar, el ▶); → (o ↓, Av Pág) = siguiente; ← (o ↑, Re Pág) = anterior. Lo que manda el mando al mantener un botón (F5, B,
     Esc) ya no hace nada (F5, en clase, tampoco recarga) y en la previa el mando no hace nada. */
  var MANDO = true;
  /* (23-oct-2026, Iago: «en el mandito… cuando estamos en el dictado y a veces en otras cosas, como… FaActos… cuando está abierta
     otra pestaña, si le quiero dar para adelante no me hace caso… solo estando en el portal me avanza. Aunque yo esté viendo la
     escaleta… me gustaría poder darle a avanzar») EL MANDO, DONDE SE VEA LA ESCALETA: con la clase en marcha y la escaleta a la
     vista (su tarjeta o su línea), el mando manda también con el dictado animado abierto (no usa esas teclas), con un libro
     (FaActos, Intervalia…: ↑ ↓ y Tab, que el libro no usa; ← → Re Pág y Av Pág siguen pasando página), con los Resultados o la
     intro de la carta, y en las otras webs que la enseñan (Teoría, RITMO, los carruseles, Intervalia…), donde ↓ y ↑ (las del
     mando) valen como Av Pág y Re Pág. Siguen siendo de la página: escribiendo en un campo, la previa, el foco en un control,
     un vídeo, la escaleta entera o un menú abiertos, y las flechas en los editores de notas de los alumnos (Dictados y
     Entonación: mueven la nota). Antes: solo con la tarjeta a la vista y, fuera del portal, sin flechas. Para quitarlo:
     MANDO_SIEMPRE = false. */
  var MANDO_SIEMPRE = true;
  function algoAbierto(k) {
    var lb = $('lb-ov'), dc = $('dcOverlay'), libro = !!(lb && lb.classList.contains('open'));
    if (libro && MANDO_SIEMPRE && (k === 'Tab' || k === 'ArrowUp' || k === 'ArrowDown')) libro = false;   /* (23-oct-2026) las del mando: el libro no las usa */
    return !!(libro || H.classList.contains('pz-abierto') || (!MANDO_SIEMPRE && dc && visible(dc)) || $('lme-video') || TODO.abierto ||
      D.querySelector('.lm-vl-bar, .lm-ic-menu, [id$="-modal"].open, [id$="-ov"].open:not(#lb-ov), [id$="-overlay"].open'));   /* la lista de morosos no: no usa estas teclas */
  }
  function lineaALaVista() { var m = $('lme-mini'); return !!(m && !m.hidden && visible(m)); }   /* (23-oct-2026) la escaleta en una línea (dictado, libro, Resultados…) */
  /* (20-oct-2026, Iago, en clase: «si estoy en la parte de escribir partituras… si le doy para adelante me cambia el tipo de
     puntero… o me cambia la tonalidad de arriba… yo quiero que me permita ir a lo siguiente… hay que discriminarlo») CON LA
     PIZARRA, EL VISOR DE LAS LECCIONES DE RITMO (#ts-visor) O EL DE ENTONACIÓN (#lm-ento) ABIERTOS y la clase en marcha, las teclas
     del mando son de la escaleta, antes que de nadie: ↓ / Av Pág / → = siguiente, ↑ / Re Pág / ← = anterior, Tab = pausa /
     seguir. Antes caían en el control con el foco (la rueda de la tonalidad, las herramientas de anotar) y lo cambiaban.
     Escribiendo en un campo de texto, siguen siendo del campo; sin clase en marcha, como antes. Los libros, igual que antes.
     Para quitarlo: MANDO_PIZARRA = false. */
  var MANDO_PIZARRA = true;
  W.addEventListener('keydown', function (e) {
    if (!MANDO || !MANDO_PIZARRA || e.altKey || e.ctrlKey || e.metaKey) return;
    if (!(H.classList.contains('pz-abierto') || D.getElementById('ts-visor') || D.getElementById('lm-ento'))) return;   /* pizarra · ritmo · entonación */
    var k = e.key, q = '';
    if (k === 'Tab' && !e.shiftKey) q = 'pausa';
    else if (k === 'PageDown' || k === 'ArrowDown' || k === 'ArrowRight') q = 'sig';
    else if (k === 'PageUp' || k === 'ArrowUp' || k === 'ArrowLeft') q = 'ant';
    if (!q || !cuenta()) return;
    var tg = e.target, tipo = tg && tg.tagName === 'INPUT' ? String(tg.type || 'text').toLowerCase() : '';
    if (tg && (tg.isContentEditable || tg.tagName === 'TEXTAREA' || /^(text|search|number|email|url|tel|password)$/.test(tipo))) return;   /* escribiendo: del campo */
    var v = vista(ahora()); if (v.fase !== 'clase' || !v.a) return;
    e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    try { if (tg && tg !== D.body && tg !== H && tg.blur) tg.blur(); } catch (er) {}   /* que el desplegable no se quede con el foco */
    audio(); despierto(true); accion(q);
  }, true);
  D.addEventListener('keydown', function (e) {
    if (!MANDO || e.altKey || e.ctrlKey || e.metaKey) return;
    var k = e.key, q = '';
    if (k === 'Tab' && !e.shiftKey) q = 'pausa';   /* (18-oct-2026) el botón de arriba del N76: play / pausa */
    else if (k === 'PageDown' || k === 'ArrowRight' || k === 'ArrowDown') q = 'sig';
    else if (k === 'PageUp' || k === 'ArrowLeft' || k === 'ArrowUp') q = 'ant';
    else if (k === 'F5') q = 'f5';   /* mantener «<» en el mando: nada */
    if (!q || !cuenta()) return;
    var v = vista(ahora()); if (!v.c || v.fase === 'nada' || v.fase === 'acabada') return;
    if (q === 'f5') { e.preventDefault(); return; }   /* mientras hay clase, F5 no recarga la página (y no hace nada más) */
    if (PV.caja && PV.caja.classList.contains('lme-on')) return;   /* en la previa, el mando no hace nada */
    if (e.defaultPrevented) return;
    var tg = e.target; if (tg && (tg.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(tg.tagName || ''))) return;
    var flechaFuera = MANDO_SIEMPRE && (k === 'ArrowUp' || k === 'ArrowDown') && !/^(dictado|entonacion)-/.test(APP);   /* (23-oct-2026) fuera del portal, ↑ ↓ (las del mando) */
    if (/^Arrow/.test(k) && ((!PORTAL && !flechaFuera) || (tg && tg !== D.body && tg !== H && !/^(BUTTON|A)$/.test(tg.tagName || '')))) return;
    if (algoAbierto(k)) return;
    if (v.fase === 'clase' && v.a && UI && (!UI.isla.hidden || (MANDO_SIEMPRE && lineaALaVista()))) { e.preventDefault(); audio(); despierto(true); accion(q); return; }
    if ((v.fase === 'antes' || v.fase === 'entrada' || v.fase === 'parada') && UI && !UI.play.hidden && q === 'pausa') { e.preventDefault(); audio(); despierto(true); accion('empezar'); }   /* (18-oct-2026) antes de empezar, solo el de arriba: el ▶ */
  });
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', function () { pintar(true); }); else pintar(true);
  W.LMEscaleta = { version: '15-oct-2026', app: APP, grado: GRADO,
    vista: function () { var v = vista(ahora()); return { fase: v.fase, grupo: v.c && v.c.grupo, clase: v.c && v.c.clase, i: v.i, bloques: v.B, a: v.a || null }; },
    accion: accion, abrirTodo: abrirTodo, cerrarTodo: cerrarTodo, pintar: function () { pintar(true); }, formatea: formatea, videoDe: videoDe, abrirVideo: abrirVideo, cerrarVideo: cerrarVideo, irA: irA, tareas: tareas, nombreCorto: nombreCorto, inmersivo: inmersivo, recordatorios: recordatorios,
    previa: function () {   /* (17-oct-2026) el estado de la previa de la clase de ahora */
      var v = vista(ahora()), c = v.c;
      return { on: PREVIA_ON, fase: v.fase, cu: v.cu || null, modo: c ? (PV.modo[c.clave] || null) : null, uso: c ? (PV.uso[c.clave] == null ? null : PV.uso[c.clave]) : null,
        hola: PV.hola, listo: PV.listo ? { dur: PV.listo.dur, info: PV.listo.info, archivos: PV.listo.audio.archivos.length, sfx: PV.listo.audio.sfx.length } : null,
        buf: Object.keys(PV.buf).length, visible: !!(PV.caja && PV.caja.classList.contains('lme-on')), err: PV.err, src: PV.src.length, pista: BAT.pista, cfg: PV.cfg ? { ojo: PV.cfg.ojo, recs: PV.cfg.recs.length, clase: PV.cfg.clase, grupo: PV.cfg.grupo } : null };
    },
    saltarPrevia: function () { pvSalta(); },
    ojo: function () {   /* (18-oct-2026) el ¡Ojo! calculado aquí para la clase de ahora */
      return { on: OJO_ON, clave: OJO.k, listo: OJO.r !== undefined, ojo: OJO.r === undefined ? null : OJO.r, pedidos: OJO.n, pidiendo: OJO.pidiendo, nota: OJO.nota,
        motor: W.PreviaElige ? { version: W.PreviaElige.version, ultimo: W.PreviaElige.ultimo } : null };
    },
    sonido: function () { return { previa: !!SON.previa, item: !!SON.item, cambio: SON.cambio.filter(Boolean).length, n: SON.n, pista: BAT.pista, vivo: BAT.vivo, ac: AC ? AC.state : '' }; },
    indice: function () {   /* para mirar (y para el banco): el índice de la clase que toca y en qué golpe sale cada cosa */
      var v = vista(ahora()); if (!v.c) return null;
      var a = agendaHoy(v.pub, v.c.grupo), P = planIndice(a);
      return { agenda: a, kb: P.kb, kIni: P.kIni, k0: P.k0, kFin: P.kFin, ks: P.filas.map(function (f) { return f.k; }), subs: P.filas.map(function (f) { return f.subs; }), toques: Object.keys(P.toques).map(Number).sort(function (x, y) { return y - x; }) };
    } };
})();
