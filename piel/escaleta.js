/* =====================================================================
   LM at home · PIEL · ESCALETA EN LA PANTALLA DEL AULA (15-oct-2026, Iago)
   SOLO con la cuenta Iago González Tester / Protester (la carga lm-piel.js; la base vuelve a comprobarlo).
   La escaleta que se prepara en el Diario (la de la vista iPad), en la pantalla del aula:
   · Tarjeta de tres líneas ARRIBA EN EL CENTRO, siempre en el mismo sitio y flotando por encima de todo (portal, apps,
     editores): la actividad de antes tachada en gris, la de ahora en amarillo con su subtítulo en blanco, los minutos que
     le quedan y la barra; debajo, la siguiente en gris y los botones ◀ ⏸ ■ ▶. En el portal, arriba a la altura de los
     botones de la derecha y abajo a la de la tira de la música, con el mismo hueco a los lados (Iago, 15-oct).
   · Del minuto 0:00 al 4:15 de cada clase (hora de Galicia, reloj del servidor), la «entrada» (el portal abre la lista
     de morosos). A las 4:15, cuenta atrás de 45 s a pantalla completa, «Preparamos libro de ritmo y lápiz», con su
     batería (bombo en el 1 de cada compás, 22 compases que acaban justo en el 5:00) y unas barras amarillas que se mueven
     con ella; la música de los 30 temas se para. A las 5:00 empieza la primera actividad. El ▶ amarillo junto a «Salir»
     la empieza antes (y la vuelve a poner tras ■).
   · Antes, 8 s de «HOY EN CLASE» a pantalla completa (lo ven los alumnos): el índice de la clase, que va apareciendo
     línea a línea como la portada de una ficha (Iago, 15-oct: «Carta 1.3 de ritmo · Preparación de ritmo · Lección 13 ·
     … · Lección de entonación», sin decir qué lección; del bloque de teoría, su texto tal cual; con el descanso).
   · En esa cuenta atrás, arriba y en violeta, los recordatorios de esa clase que manda el iPad (los 📌 de la preparación
     y las fichas en papel), solo los de ese grupo y cuatro como mucho (Iago, 15-oct).
   · Cada cambio de actividad: cartel a pantalla completa 5 s y un «ding» suave; tocar la pantalla lo quita AL MOMENTO
     (ese toque no llega a lo de debajo) y el tiempo de la nueva ya corre. Sin carteles ni ding en el dictado animado, con
     un vídeo sonando o en pantalla completa de algo que no sea la página entera; con algo así en pantalla completa, la
     tarjeta tampoco se ve. El tiempo sigue corriendo siempre.
   · Margen, como en el iPad: si paso antes de tiempo, lo que sobra se guarda («+1:24» en gris). Si una actividad llega a
     cero con margen, no salta: la barra se recoloca con un tramo gris «extra» que se va gastando; al acabarse, salta.
   · Al acabar, «Fin de la clase» (en C2, con las tareas para casa). Se quita tocando.
   · Todo se calcula con la hora: el estado (saltos, pausas, margen) se guarda por grupo y día en la base, así que el
     portal y las apps de esa pantalla van a la vez y sigue en su sitio aunque se cierre Chrome. Ligero: un repaso cada
     cuarto de segundo con la página a la vista (nada si está escondida); la animación solo durante la cuenta atrás.
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
      return (s && s.id && s.estado === 'validado' && TESTER[norm(s.nombre)]) ? String(s.id) : null;
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
    if (/pregunta/.test(slot) || /^pregunta/i.test(tit)) return { t: 'Pregunta de la semana pasada', s: lecciones(lec.length ? lec : nsub) || primeraLinea(sub) };
    if (/^fa-intervalia|intervalia|faactos/.test(slot)) {
      var modo = /b\/n|blanco/i.test(b.ses || '') ? 'blanco y negro' : (/color/i.test(b.ses || '') ? 'color' : '');
      var e0 = (b.emp && typeof b.emp === 'object') ? (b.emp[grupo] || '') : (b.emp || ''), emp = e0 ? 'empieza ' + (/\.$/.test(e0) ? e0 : nombreCorto(e0)) : '';
      var partes = [ast, modo, emp].filter(Boolean);
      return { t: /^fa-intervalia/.test(slot) ? 'FaActos + Intervalia' : (/pro/.test(slot) ? 'Intervalia PRO' : (/faactos/.test(slot) ? 'FaActos' : 'Intervalia')), s: partes.join(' · ') };
    }
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

  /* ---------- el modelo: qué toca ahora (todo sale de la hora y del estado) ---------- */
  var CUENTA = 45;   /* s de cuenta atrás, de 4:15 a 5:00 */
  var INDICE = 8;    /* s de «Hoy en clase» justo antes (Iago: «que dure lo que consideres… 45 s antes, la cuenta atrás») */
  var MEMO = { pub: null, g: '', B: [] };
  function bloquesDe(pub, grupo) {
    if (MEMO.pub === pub && MEMO.g === grupo) return MEMO.B;
    var l = (pub && Array.isArray(pub.bloques)) ? pub.bloques.filter(function (b) { return b && +b.m > 0 && b.slot !== '__no_clase'; }) : [];
    MEMO.pub = pub; MEMO.g = grupo; MEMO.B = l.map(function (b) { var f = formatea(b, grupo); return { t: f.t, s: f.s, m: +b.m, tema: temaDe(b) }; });
    return MEMO.B;
  }
  /* (15-oct-2026, Iago) «HOY EN CLASE»: el índice que ven los alumnos. Lo que eligió: «Carta 1.3 de ritmo», «Preparación de
     ritmo · Lección 32» (lo que trabajamos), «Evaluación de ritmo · Lecciones 26 y 28» (lo que pregunta; en GP, «de ritmo
     entonado» y la pregunta de la semana pasada), «Dictado 5», «Lección de entonación» (sin decir cuál, y con la
     preparación en la misma línea), del bloque de teoría SU TEXTO tal cual, y el descanso en su sitio. */
  function agendaHoy(pub, grupo) {
    var l = (pub && Array.isArray(pub.bloques)) ? pub.bloques : [], out = [], vistos = {};
    l.forEach(function (b) {
      if (!b || !(+b.m > 0) || /^__/.test(String(b.slot || ''))) return;
      var f = formatea(b, grupo), tm = temaDe(b), t = '';
      if (f.t === 'Ritmo') t = /^Carta /.test(f.s) ? f.s + ' de ritmo' : 'Preparación de ritmo' + (f.s && /^Lecci/.test(f.s) ? ' · ' + f.s : '');
      else if (f.t === 'Ritmo entonado') t = 'Preparación de ritmo entonado' + (/^Lecci/.test(f.s) ? ' · ' + f.s : '');
      else if (f.t === 'Evaluación de ritmo') t = 'Evaluación de ritmo' + (/^Lecci/.test(f.s) ? ' · ' + f.s : '');
      else if (f.t === 'Pregunta de la semana pasada') t = 'Evaluación de ritmo entonado' + (/^Lecci/.test(f.s) ? ' · ' + f.s : '');
      else if (f.t === 'Entonación' || f.t === 'Preparación entonación') { t = 'Lección de entonación'; tm = 'entonacion'; }
      else if (f.t === 'Dictado') t = b.num ? 'Dictado ' + b.num : 'Dictado';
      else if (f.t === 'Teoría') { t = String(b.sub || '').split(/\n+/).map(function (x) { return quitarEmojis(x); }).filter(Boolean).join(' · ') || 'Teoría'; tm = 'teoria'; }
      else if (f.t === 'Corrección de la ficha') t = f.s ? 'Corrección de la ' + f.s.charAt(0).toLowerCase() + f.s.slice(1) : 'Corrección de la ficha';
      else if (f.t === 'Descanso') { t = 'Descanso'; tm = 'descanso'; }
      else if (/^(FaActos|Intervalia)/.test(f.t)) {   /* (Iago) «FaActos 3 · Intervalia 3»: el acto y la lección, sin más */
        var x = String(b.ast || '') + ' ' + String(b.sub || ''), ac = /Acto\s+(\d+)/i.exec(x), lc = /Lecci[oó]n\s+(\d+)/i.exec(x);
        /* el color, el de su app (código de Iago): FaActos verde, Intervalia azul, las dos juntas violeta */
        if (f.t === 'FaActos + Intervalia') t = 'FaActos' + (ac ? ' ' + ac[1] : '') + ' · Intervalia' + (lc ? ' ' + lc[1] : '');
        else if (f.t === 'FaActos') { t = 'FaActos' + (ac ? ' ' + ac[1] : ''); tm = 'ritmo'; }
        else { t = f.t + (lc ? ' ' + lc[1] : ''); tm = 'entonacion'; }
      }
      else t = f.t;
      if (t.length > 84) t = t.slice(0, 82) + '…';
      if (!t || (vistos[t] && t !== 'Descanso')) return; vistos[t] = 1;
      out.push({ t: t, tema: tm });
    });
    return out.slice(0, 9);
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
  /* con el estado y la hora: la actividad de ahora (encadenando las que se acabaron, como el iPad) */
  function avanza(e, B, t) {
    if (!e || !B.length) return null;
    var i = Math.min(Math.max(0, e.i | 0), B.length - 1), ini = +e.ini, pac = +e.pac || 0, mg = Math.max(0, +e.mg || 0);
    var quieto = e.parada ? +e.parada : (e.pausa ? +e.pausa : 0);   /* parada o pausa: el reloj de la actividad no corre */
    for (var vueltas = 0; vueltas < 60; vueltas++) {
      var dur = B[i].m * 60, hasta = quieto || t, usado = (hasta - ini - pac) / 1000, resto = dur - usado;
      if (resto > -mg || quieto) return { i: i, resto: resto, dur: dur, mg: mg, ini: ini, pausa: !!e.pausa && !e.parada, parada: !!e.parada };
      var finEf = ini + pac + (dur + mg) * 1000;   /* se acabó (con su margen): la siguiente empezó justo ahí */
      if (i >= B.length - 1) return { fin: true, finEn: finEf, i: i };
      i++; ini = finEf; pac = 0; mg = 0;
    }
    return null;
  }
  function vista(t) {
    var c = claseAhora(t); if (!c) return { fase: 'nada' };
    var pub = escaleta(c), e = estado(c), B = bloquesDe(pub, c.grupo), desde = (t - c.t0) / 1000;
    var v = { c: c, B: B, pub: pub, e: e, desde: desde, fase: 'nada' };
    if (noHayClase(pub)) return v;
    if (desde < 0) { v.fase = (e && e.arr) ? 'clase' : 'antes'; }
    else if (!e || !e.arr) {
      if (e && e.parada && !e.arr) { v.fase = 'parada'; return v; }
      if (desde < 300 - CUENTA - INDICE) v.fase = 'entrada';
      else if (desde < 300 - CUENTA) { v.fase = 'indice'; v.queda = 300 - CUENTA - desde; }
      else if (desde < 300) { v.fase = 'cuenta'; v.queda = 300 - desde; }
      else if (B.length) { v.fase = 'clase'; v.e = e = { arr: c.t0 + 300000, i: 0, ini: c.t0 + 300000, pac: 0, mg: 0, auto: true }; }
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
    }
    return v;
  }

  /* ---------- las acciones (◀ ⏸ ■ ▶ y el ▶ amarillo) ---------- */
  function accion(q) {
    var t = ahora(), v = vista(t), c = v.c; if (!c) return;
    var B = v.B, e = v.e ? JSON.parse(JSON.stringify(v.e)) : null, a = v.a;
    if (q === 'empezar') {
      if (e && e.arr && e.parada) {   /* después de ■: sigue donde estaba */
        var a2 = avanza(e, B, t);
        e.pac = (+e.pac || 0) + (t - (+e.parada)); e.parada = 0; e.pausa = 0;
        if (a2 && !a2.fin) { e.i = a2.i; }
        guardarEstado(c, e); pintar(true); return;
      }
      if (!B.length) return;
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
  function env(g, t, v, dur) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); }
  function bombo(t, v) { var o = AC.createOscillator(), g = AC.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(46, t + 0.12); env(g, t, v, 0.36); o.connect(g); g.connect(COMP); o.start(t); o.stop(t + 0.4); }
  function ruidoA(t, v, dur, hp) { var s = AC.createBufferSource(); s.buffer = RUIDO; var f = AC.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp; var g = AC.createGain(); env(g, t, v, dur); s.connect(f); f.connect(g); g.connect(COMP); s.start(t, Math.random() * 0.4); s.stop(t + dur + 0.03); }
  function caja(t, v) { ruidoA(t, v, 0.16, 1400); var o = AC.createOscillator(), g = AC.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(230, t); o.frequency.exponentialRampToValueAtTime(165, t + 0.07); env(g, t, v * 0.55, 0.1); o.connect(g); g.connect(COMP); o.start(t); o.stop(t + 0.13); }
  function charles(t, v, abierto) { ruidoA(t, v, abierto ? 0.26 : 0.045, 7600); }
  function tom(t, v, f0) { var o = AC.createOscillator(), g = AC.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * 0.62, t + 0.24); env(g, t, v, 0.3); o.connect(g); g.connect(COMP); o.start(t); o.stop(t + 0.33); }
  function platillo(t, v) { ruidoA(t, v, 2.2, 4800); }
  /* 22 compases de 4/4 en 45 s (117,3 por minuto): el primer golpe es el bombo del 1 y el último cae justo en el 5:00 */
  var PASOS = 22 * 16, PASO = CUENTA / PASOS;
  function golpe(t, k) {   /* k: semicorcheas que faltan para el final */
    var pos = (16 - (k % 16)) % 16, cf = Math.floor(k / 16), fill = (k <= 8 && k > 0), denso = k <= 64;
    if (k === 0) { bombo(t, 0.95); platillo(t, 0.42); caja(t, 0.45); return; }
    if (fill) { var tt = { 8: 260, 7: 230, 6: 200, 5: 175, 4: 150, 3: 130, 2: 115, 1: 100 }; if (tt[k]) tom(t, 0.62, tt[k]); if (k % 2 === 0) bombo(t, 0.6); return; }
    if (pos === 0 || pos === 8) bombo(t, 0.9);
    if (pos === 10 && cf % 2 === 1) bombo(t, 0.62);
    if (pos === 7 && cf % 4 === 0) bombo(t, 0.5);
    if (pos === 4 || pos === 12) caja(t, 0.55);
    if (pos === 15 && cf % 2 === 0) caja(t, 0.12);
    if (denso ? true : pos % 2 === 0) charles(t, (pos % 4 === 0) ? 0.2 : 0.11, false);
    if (pos === 14 && cf % 2 === 1 && !denso) charles(t, 0.13, true);
  }
  var BAT = { vivo: false, id: 0, fin: 0, k: -1 };
  function bateria(finMs) {   /* finMs: la hora (reloj de la escaleta) del último golpe */
    if (BAT.vivo && BAT.fin === finMs) return;
    if (!audio() || AC.state !== 'running') return;
    callarBateria(true);
    BAT.vivo = true; BAT.fin = finMs; BAT.k = PASOS;
    MASTER.gain.cancelScheduledValues(AC.currentTime); MASTER.gain.setValueAtTime(1, AC.currentTime);
    var tic = function () {
      if (!BAT.vivo) return;
      if (D.hidden) { callarBateria(true); return; }   /* solo suena la página que se ve (otra pestaña la seguirá) */
      var finAC = AC.currentTime + (BAT.fin - ahora()) / 1000, lim = AC.currentTime + 0.15;
      while (BAT.k >= 0) {
        var t = finAC - BAT.k * PASO; if (t > lim) break;
        if (t >= AC.currentTime - 0.02) golpe(Math.max(t, AC.currentTime), BAT.k);
        BAT.k--;
      }
      if (BAT.k < 0) { BAT.vivo = false; clearInterval(BAT.id); }
    };
    clearInterval(BAT.id); BAT.id = setInterval(tic, 30); tic();
  }
  function callarBateria(ya) {
    var estaba = BAT.vivo; BAT.vivo = false; clearInterval(BAT.id);
    if (!estaba || ya || !AC || !MASTER) return;
    try { var t = AC.currentTime; MASTER.gain.cancelScheduledValues(t); MASTER.gain.setValueAtTime(MASTER.gain.value, t); MASTER.gain.linearRampToValueAtTime(0.0001, t + 0.25);
      setTimeout(function () { try { MASTER.gain.setValueAtTime(1, AC.currentTime); } catch (e) {} }, 400); } catch (e) {}
  }
  /* (15-oct-2026, Iago) «ese índice puede tener soniditos en base a que va revelando los contenidos… como en el comienzo
     de las fichas de teoría»: un toque suave por línea (dos senos, como SFX de las fichas), cada uno un poco más agudo */
  function toquesIndice(n) {
    if (!audio() || AC.state !== 'running') return;
    var esc = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51, 1567.98], t0 = AC.currentTime + 0.05;
    for (var k = 0; k < n; k++) {
      var f = esc[Math.min(k, esc.length - 1)], t = t0 + 0.55 + k * 0.3;
      [[f, 0, 0.12, 0.1], [f * 1.5, 0.022, 0.14, 0.06]].forEach(function (p) {
        var o = AC.createOscillator(), g = AC.createGain(); o.type = 'sine'; o.frequency.value = p[0];
        g.gain.setValueAtTime(0.0001, t + p[1]); g.gain.exponentialRampToValueAtTime(p[3], t + p[1] + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + p[1] + p[2]);
        o.connect(g); g.connect(COMP); o.start(t + p[1]); o.stop(t + p[1] + p[2] + 0.03);
      });
    }
  }
  function ding() {
    if (!audio() || AC.state !== 'running') return;
    var t = AC.currentTime + 0.02;
    [[1318.5, 0.16, 1.5], [2637, 0.035, 0.8], [1975.5, 0.03, 1.1]].forEach(function (p) {
      var o = AC.createOscillator(), g = AC.createGain(); o.type = 'sine'; o.frequency.value = p[0];
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(p[1], t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + p[2]);
      o.connect(g); g.connect(MASTER); o.start(t); o.stop(t + p[2] + 0.05);
    });
  }
  /* la salida se abre con el primer toque de la página (sin un toque, el navegador no deja sonar) */
  ['pointerdown', 'keydown'].forEach(function (ev) { D.addEventListener(ev, function () { if (claseAhora(ahora())) { audio(); setTimeout(function () { despierto(true); }, 60); } }, { capture: true, passive: true }); });

  /* ---------- inmersivo: dictado animado, vídeo sonando o pantalla completa de una parte ---------- */
  function visible(el) { try { if (!el || !el.isConnected) return false; var cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden' && el.getClientRects().length > 0; } catch (e) { return false; } }
  function inmersivo() {
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

  /* ---------- la pantalla ---------- */
  var F = '"Helvetica Neue",Helvetica,Arial,sans-serif';
  var CSS = '' +
    '#lme-isla{position:fixed;left:50%;top:8px;transform:translateX(-50%);width:333px;box-sizing:border-box;z-index:2147483600;background:rgba(11,19,32,.84);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);' +
      'border:1.5px solid #facc15;border-radius:12px;padding:7px 10px;display:flex;flex-direction:column;gap:3px;color:#fff;text-align:left;font:500 10px/1.2 ' + F + ';-webkit-font-smoothing:antialiased;pointer-events:auto;user-select:none;-webkit-user-select:none}' +
    '#lme-isla[hidden],#lme-play[hidden],.lme-full[hidden]{display:none!important}' +
    '#lme-indice .lme-ilist:empty{display:none}' +
    '#lme-isla.lme-alineada{transform:none;justify-content:space-between;padding:10px 12px}' +
    '#lme-isla *{box-sizing:border-box;margin:0;padding:0;letter-spacing:normal;text-transform:none;font-style:normal;text-shadow:none}' +
    '#lme-isla .lme-ant{font:500 9.5px/1.2 ' + F + ';color:#7d879b;text-decoration:line-through;letter-spacing:.02em;min-height:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
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
    '#lme-play{position:fixed;z-index:2147483600;width:35px;height:35px;border-radius:50%;border:0;background:#facc15;color:#111;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;margin:0;box-shadow:0 4px 14px rgba(250,204,21,.25)}' +
    '#lme-play svg{width:14px;height:14px;margin-left:2px;display:block}' +
    '.lme-full{position:fixed;inset:0;z-index:2147483640;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:16px;color:#fff;font-family:' + F + ';-webkit-font-smoothing:antialiased;' +
      'background:linear-gradient(rgba(6,9,17,.84),rgba(6,9,17,.84)),url("' + BASE + 'fondo-apaisado.jpg") center/cover #070b14;transition:opacity .45s ease,transform .45s ease;transform-origin:50% 6%;user-select:none;-webkit-user-select:none;cursor:default}' +
    '.lme-full *{box-sizing:border-box;margin:0;padding:0;letter-spacing:normal;text-transform:none;font-style:normal}' +
    '.lme-full.lme-recoge{opacity:0;transform:scale(.22)}' +
    '.lme-full .lme-ey{font:700 15px/1 ' + F + ';letter-spacing:.3em;text-transform:uppercase;color:#9aa6bb}' +
    '.lme-full .lme-barra5{position:absolute;left:0;right:0;bottom:0;height:6px;background:#1c2232}' +
    '.lme-full .lme-barra5 b{display:block;height:100%;width:0;background:#facc15}' +
    /* (15-oct-2026, tarde, Iago) «que el tiempo aparezca en amarillo, que el texto de preparamos el libro de ritmo y el lápiz
       sea en blanco y las animaciones de las barras de abajo sean en amarillo» */
    '#lme-cuenta .lme-num{font:800 200px/.9 ' + F + ';font-variant-numeric:tabular-nums;letter-spacing:-.02em;color:#facc15}' +
    '#lme-cuenta .lme-num .lme-dp{color:#a8891a;margin:0 .03em}' +
    '#lme-cuenta .lme-frase{font:800 54px/1.05 ' + F + ';color:#fff}' +
    '#lme-cuenta canvas{display:block;width:420px;height:44px;margin-top:12px}' +
    '#lme-cuenta .lme-rec{max-width:min(1000px,86vw);margin-bottom:14px;padding:11px 24px 13px;border-radius:14px;background:rgba(124,58,237,.16);border:1px solid rgba(167,139,250,.42);display:flex;flex-direction:column;align-items:center;gap:6px}' +
    '#lme-cuenta .lme-rec[hidden]{display:none!important}' +
    '#lme-cuenta .lme-rec-k{font:800 11px/1 ' + F + ';letter-spacing:.28em;text-transform:uppercase;color:#a78bfa;margin-bottom:1px}' +
    '#lme-cuenta .lme-rec-i{font:500 19px/1.3 ' + F + ';color:#b9a8f7;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}' +
    '#lme-cuenta .lme-rec-i b{font-weight:700;color:#d4c7ff}' +
    '#lme-indice{gap:0}' +
    '#lme-indice .lme-ey{animation:lmeSube .5s ease both}' +
    '#lme-indice .lme-itit{font:800 80px/1 ' + F + ';color:#fff;letter-spacing:-.01em;margin:14px 0 34px;animation:lmeSube .6s .1s cubic-bezier(.2,.8,.25,1) both}' +
    '#lme-indice .lme-ilist{list-style:none;display:flex;flex-direction:column;gap:12px;min-width:520px;max-width:86vw;text-align:left}' +
    '#lme-indice .lme-ii{display:flex;align-items:center;gap:18px;font:700 30px/1.2 ' + F + ';color:#fff;opacity:0;animation:lmeSube .5s cubic-bezier(.2,.8,.25,1) both}' +
    '#lme-indice .lme-ii b{flex:none;box-sizing:border-box;width:40px;height:40px;border-radius:11px;border:2.5px solid var(--c);color:var(--c);display:flex;align-items:center;justify-content:center;font:800 19px/1 ' + F + '}' +
    '#lme-indice .lme-ii span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '#lme-indice .lme-ii.descanso{color:#e6cba4;font-weight:600}' +   /* (Iago) «el descanso, en otro tono»: café con leche */
    '@keyframes lmeSube{0%{opacity:0;transform:translateY(18px)}100%{opacity:1;transform:none}}' +
    '@media (prefers-reduced-motion:reduce){#lme-indice *{animation:none!important;opacity:1!important}}' +
    '#lme-cartel .lme-tit{font:800 150px/.92 ' + F + ';color:#facc15;letter-spacing:-.01em;white-space:nowrap}' +
    '#lme-cartel .lme-sub{font:500 36px/1.2 ' + F + ';color:#fff;max-width:88vw}' +
    '#lme-cartel .lme-mi{font:700 24px/1 ' + F + ';color:#9aa6bb;margin-top:4px}' +
    '#lme-cartel .lme-mi b{color:#fff;font-weight:700}' +
    '#lme-fin .lme-tit{font:800 116px/.95 ' + F + ';letter-spacing:-.01em}' +
    '#lme-fin .lme-tareas{margin-top:18px;min-width:560px;max-width:86vw;text-align:left;background:rgba(11,19,32,.72);border:1.5px solid #facc15;border-radius:16px;padding:18px 26px 14px}' +
    '#lme-fin .lme-tareas h3{font:800 13px/1 ' + F + ';letter-spacing:.28em;text-transform:uppercase;color:#facc15;margin-bottom:6px}' +
    '#lme-fin .lme-tarea{display:flex;align-items:center;gap:14px;font:700 26px/1.25 ' + F + ';color:#fff;padding:11px 0;border-top:1px solid rgba(255,255,255,.1)}' +
    '#lme-fin .lme-tarea:first-of-type{border-top:0}' +
    '#lme-fin .lme-tarea i{flex:none;width:12px;height:12px;border-radius:3px;background:#9aa6bb}' +
    '#lme-fin .lme-tarea.ritmo i{background:#22c55e}#lme-fin .lme-tarea.teoria i{background:#ec4899}#lme-fin .lme-tarea.entonacion i{background:#3b82f6}#lme-fin .lme-tarea.dictado i{background:#f97316}' +
    '#lme-fin .lme-cerrar{position:absolute;right:26px;bottom:24px;font:600 13px/1 ' + F + ';color:#6b7487}' +
    'html.lm-esc-on.lm-fam-portal .hero{margin-top:64px!important}' +   /* en el portal, el logo baja lo justo mientras está la tarjeta */
    '.lme-ic{outline:2px solid #facc15!important;outline-offset:2px!important}' +
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
    play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15L19.5 12z" fill="currentColor"/></svg>' };
  var UI = null;
  function montar() {
    if (UI) { if (!UI.isla.isConnected) D.body.appendChild(UI.isla); [UI.play, UI.indice, UI.cuenta, UI.cartel, UI.fin].forEach(function (x) { if (!x.isConnected) D.body.appendChild(x); }); return UI; }
    if (!D.body) return null;
    var st = D.createElement('style'); st.id = 'lme-css'; st.textContent = CSS; (D.head || H).appendChild(st);
    var isla = D.createElement('div'); isla.id = 'lme-isla'; isla.hidden = true; isla.setAttribute('role', 'status');
    isla.innerHTML = '<div class="lme-ant"></div><div class="lme-ahora"><span class="lme-t"></span><span class="lme-s"></span><span class="lme-m"></span></div>' +
      '<div class="lme-barra"><b></b><span class="lme-ex" hidden><i></i></span></div>' +
      '<div class="lme-sig"><span class="lme-sigt"></span><span class="lme-bts">' +
        '<button type="button" class="lme-b" data-a="ant" title="Anterior" aria-label="Anterior">' + SVG.ant + '</button>' +
        '<button type="button" class="lme-b" data-a="pausa" title="Pausa" aria-label="Pausa">' + SVG.pausa + '</button>' +
        '<button type="button" class="lme-b" data-a="parar" title="Parar la escaleta" aria-label="Parar la escaleta">' + SVG.parar + '</button>' +
        '<button type="button" class="lme-b" data-a="sig" title="Siguiente" aria-label="Siguiente">' + SVG.sig + '</button></span></div>';
    isla.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('.lme-b') : null;
      e.preventDefault(); e.stopPropagation();
      if (b) { audio(); despierto(true); accion(b.getAttribute('data-a')); }
    });
    ['pointerdown', 'mousedown', 'touchstart'].forEach(function (ev) { isla.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true }); });
    var play = D.createElement('button'); play.type = 'button'; play.id = 'lme-play'; play.hidden = true; play.title = 'Empezar la escaleta'; play.setAttribute('aria-label', 'Empezar la escaleta'); play.innerHTML = SVG.play;
    play.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); audio(); despierto(true); accion('empezar'); });
    var indice = D.createElement('div'); indice.id = 'lme-indice'; indice.className = 'lme-full'; indice.hidden = true;
    indice.innerHTML = '<div class="lme-ey"></div><div class="lme-itit">Hoy en clase</div><ol class="lme-ilist"></ol><div class="lme-barra5"><b></b></div>';
    var cuenta = D.createElement('div'); cuenta.id = 'lme-cuenta'; cuenta.className = 'lme-full'; cuenta.hidden = true;
    cuenta.innerHTML = '<div class="lme-rec" hidden></div><div class="lme-ey"></div><div class="lme-num"></div><div class="lme-frase">Preparamos libro de ritmo y lápiz</div><canvas width="840" height="88"></canvas><div class="lme-barra5"><b></b></div>';
    var cartel = D.createElement('div'); cartel.id = 'lme-cartel'; cartel.className = 'lme-full'; cartel.hidden = true; cartel.setAttribute('role', 'alert');
    cartel.innerHTML = '<div class="lme-ey"></div><div class="lme-tit"></div><div class="lme-sub"></div><div class="lme-mi"></div><div class="lme-barra5"><b></b></div>';
    var fin = D.createElement('div'); fin.id = 'lme-fin'; fin.className = 'lme-full'; fin.hidden = true;
    fin.innerHTML = '<div class="lme-ey"></div><div class="lme-tit">Fin de la clase</div><div class="lme-tareas" hidden></div><div class="lme-cerrar">toca para cerrar</div>';
    /* (15-oct-2026, Iago) «si pulso en la pantalla, ese cartel desaparezca instantáneamente»: el toque lo quita y no llega a lo de debajo */
    cartel.addEventListener('pointerdown', function (e) { e.preventDefault(); e.stopPropagation(); quitarCartel(true); tragar(); }, true);
    fin.addEventListener('pointerdown', function (e) { e.preventDefault(); e.stopPropagation(); finVisto(); ver(fin, false); tragar(); }, true);
    [indice, cuenta, cartel, fin].forEach(function (x) { ['click', 'mousedown', 'touchstart', 'wheel'].forEach(function (ev) { x.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true }); }); });
    D.body.appendChild(isla); D.body.appendChild(play); D.body.appendChild(indice); D.body.appendChild(cuenta); D.body.appendChild(cartel); D.body.appendChild(fin);
    UI = { isla: isla, play: play, indice: indice, cuenta: cuenta, cartel: cartel, fin: fin,
           iEy: indice.querySelector('.lme-ey'), iList: indice.querySelector('.lme-ilist'), iBar: indice.querySelector('.lme-barra5 b'),
           ant: isla.querySelector('.lme-ant'), t: isla.querySelector('.lme-t'), s: isla.querySelector('.lme-s'), m: isla.querySelector('.lme-m'),
           bar: isla.querySelector('.lme-barra b'), ex: isla.querySelector('.lme-ex'), sig: isla.querySelector('.lme-sigt'), bPausa: isla.querySelector('[data-a="pausa"]'),
           cEy: cuenta.querySelector('.lme-ey'), cRec: cuenta.querySelector('.lme-rec'), cNum: cuenta.querySelector('.lme-num'), cBar: cuenta.querySelector('.lme-barra5 b'), cv: cuenta.querySelector('canvas'),
           kEy: cartel.querySelector('.lme-ey'), kT: cartel.querySelector('.lme-tit'), kS: cartel.querySelector('.lme-sub'), kM: cartel.querySelector('.lme-mi'), kBar: cartel.querySelector('.lme-barra5 b'),
           fEy: fin.querySelector('.lme-ey'), fT: fin.querySelector('.lme-tareas') };
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
    txt(UI.kEy, 'Ahora · ' + (v.i + 1) + ' de ' + B.length);
    txt(UI.kT, b.t); txt(UI.kS, b.s); ver(UI.kS, !!b.s);
    UI.kM.innerHTML = '<b>' + esc(b.m + ' min') + '</b>' + esc(n ? ' · luego, ' + n.t.toLowerCase() : ' · y fin de la clase');
    UI.cartel.classList.remove('lme-recoge'); ver(UI.cartel, true); encaja(UI.kT, 150);
    CART.hasta = Date.now() + quedan;
    ding();
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
  var ICONOS = { ritmo: '.lm-ic-ritmo', entonacion: '.lm-ic-ento', dictado: '.lm-ic-dict', intervalia: '.lm-ic-libros', teoria: '.lm-ic-penta' };
  function iconoActivo(tema) {   /* en el portal, el icono de lo que toca con contorno amarillo */
    if (!PORTAL) return;
    var sel = ICONOS[tema] || '', el = sel ? D.querySelector('#lm-iconos ' + sel) : null;
    if (ANT.icono && ANT.icono !== el) { ANT.icono.classList.remove('lme-ic'); ANT.icono = null; }
    if (el && !el.classList.contains('lme-ic')) { el.classList.add('lme-ic'); ANT.icono = el; }
  }
  function colocar(si) {   /* en el portal: a la altura de los botones y de la tira de la música; si algo los tapa, como en las apps */
    var isla = UI.isla, al = false;
    if (PORTAL && si) {
      try {
        var ic = $('lm-iconos'), mu = $('lm-musica'), w = $('portal-welcome');
        var sa = w ? Array.prototype.filter.call(w.querySelectorAll('button, a'), function (x) { return /salir/i.test(x.textContent || ''); })[0] : null;
        if (ic && visible(ic) && sa) {
          var ri = ic.getBoundingClientRect(), rs = sa.getBoundingClientRect();
          var tapado = D.elementFromPoint(Math.round(ri.left + 6), Math.round(ri.top + ri.height / 2));
          if (tapado && (ic.contains(tapado) || tapado === ic)) {
            var abajo = (mu && visible(mu)) ? mu.getBoundingClientRect().bottom : ri.bottom + 40;
            var ancho = 333, x = Math.round((rs.right + ri.left) / 2 - ancho / 2);
            isla.style.left = x + 'px'; isla.style.top = Math.round(ri.top) + 'px'; isla.style.height = Math.max(70, Math.round(abajo - ri.top)) + 'px';
            al = true;
          }
        }
      } catch (e) {}
    }
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
    el.innerHTML = '<div class="lme-rec-k">' + (ls.length > 1 ? 'Recordatorios' : 'Recordatorio') + '</div>' + ls.map(function (r) {
      return '<div class="lme-rec-i">' + (r.t ? '<b>' + esc(r.t) + '</b>' : '') + (r.t && r.d ? ' · ' : '') + esc(r.d) + '</div>';
    }).join('');
    el.hidden = false;
  }
  var ULT = 0, COLOCADA = 0;
  function pintar(forzar) {
    if (D.hidden && !forzar) return;
    var t = ahora(); if (!forzar && t - ULT < 200) return; ULT = t;
    if (!cuenta()) { if (UI) { ver(UI.isla, false); ver(UI.play, false); ver(UI.indice, false); ver(UI.cuenta, false); ver(UI.cartel, false); ver(UI.fin, false); } H.classList.remove('lm-esc-on'); return; }
    if (!forzar && ANT.nada && t < ANT.nada) return;   /* sin clase: se mira cada 2 s */
    var v = vista(t);
    ANT.nada = (v.fase === 'nada' || v.fase === 'acabada') ? t + 2000 : 0;
    if (ANT.nada) { despierto(false); callarBateria(true); }
    if (v.fase === 'nada' && !UI) return;
    if (!montar()) return;
    var inm = inmersivo();
    avisar(v);
    /* la salida de sonido despierta un poco antes de «Hoy en clase» (el mini-jack del aula tarda en espabilar) */
    if (v.fase === 'entrada' && v.desde >= 300 - CUENTA - INDICE - 12) despierto(true);
    /* «Hoy en clase» (8 s antes de la cuenta atrás): la música de los 30 temas se para, un ding, y el índice */
    var agenda = (v.fase === 'indice' && inm !== 'pantalla') ? agendaHoy(v.pub, v.c.grupo) : null;
    var enIndice = !!(agenda && agenda.length);
    if (enIndice) {
      if (UI.indice.hidden) {
        txt(UI.iEy, grupoBonito(v.c.grupo) + ' · ' + DIA_NOMBRE[v.c.dia]);
        UI.iList.innerHTML = agenda.map(function (x, k) {
          return '<li class="lme-ii ' + x.tema + '" style="--c:' + (COLOR_TEMA[x.tema] || COLOR_TEMA.otra) + ';animation-delay:' + (0.55 + k * 0.3).toFixed(2) + 's"><b>' + (k + 1) + '</b><span>' + esc(x.t) + '</span></li>';
        }).join('');
        ver(UI.indice, true); pararMusica(); despierto(true); toquesIndice(agenda.length);
      }
      UI.iBar.style.width = Math.min(100, Math.max(0, (1 - v.queda / INDICE) * 100)).toFixed(2) + '%';
      despierto(true);
    } else if (!UI.indice.hidden) ver(UI.indice, false);
    /* la cuenta atrás */
    var enCuenta = v.fase === 'cuenta' && inm !== 'pantalla';
    if (enCuenta) {
      if (UI.cuenta.hidden) { ver(UI.cuenta, true); if (!BARR.raf) BARR.raf = requestAnimationFrame(barras); pararMusica(); }
      txt(UI.cEy, grupoBonito(v.c.grupo) + ' · la clase empieza en');
      pintarRec(recordatorios(v.pub, v.c.grupo));
      var q = Math.max(0, v.queda);
      UI.cNum.innerHTML = Math.floor(Math.ceil(q) / 60) + '<span class="lme-dp">:</span>' + ('0' + (Math.ceil(q) % 60)).slice(-2);
      UI.cBar.style.width = Math.min(100, (1 - q / CUENTA) * 100).toFixed(2) + '%';
      despierto(true); bateria(v.c.t0 + 300000);
    } else if (!UI.cuenta.hidden) {
      ver(UI.cuenta, false); if (BARR.raf) { cancelAnimationFrame(BARR.raf); BARR.raf = 0; }
      if (v.fase !== 'clase') callarBateria();
    }
    if (v.fase !== 'cuenta' && BAT.vivo && (v.fase !== 'clase' || v.desde > 302)) callarBateria();
    /* la tarjeta */
    var conIsla = v.fase === 'clase' && !!v.a && inm !== 'pantalla';
    ver(UI.isla, conIsla);
    H.classList.toggle('lm-esc-on', conIsla);
    if (conIsla) {
      var B = v.B, a = v.a, b = B[a.i], p = B[a.i - 1], n = B[a.i + 1];
      txt(UI.ant, p ? p.t + ' · ' + p.m + ' min' : '');
      txt(UI.t, b.t); txt(UI.s, b.s);
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
      iconoActivo(b.tema);
      /* el cartel: al cambiar de actividad (los primeros 5 s), salvo en lo inmersivo */
      var k = claveCambio(v), desdeCambio = t - (+a.ini);
      if (CART.visto !== k) {
        CART.visto = k;
        var forz = CART.forzar && CART.forzar.i === a.i && t - CART.forzar.t < 3000; CART.forzar = null;
        if (!inm && (forz || (desdeCambio >= 0 && desdeCambio < 4500 && !a.pausa))) mostrarCartel(v, forz ? 5000 : 5000 - desdeCambio);
        else if (!UI.cartel.hidden) quitarCartel(true);
      }
    } else { iconoActivo(''); if (!UI.cartel.hidden && v.fase !== 'clase') quitarCartel(true); }
    if (!UI.cartel.hidden) {
      if (inm) quitarCartel(true);
      else { var qd = CART.hasta - Date.now(); UI.kBar.style.width = Math.min(100, (1 - qd / 5000) * 100).toFixed(2) + '%'; if (qd <= 0) quitarCartel(false); }
    }
    /* el ▶ amarillo (portal): antes de empezar, en la entrada y tras ■ */
    var conPlay = PORTAL && !inm && (v.fase === 'antes' || v.fase === 'entrada' || v.fase === 'parada') && v.B && v.B.length > 0;
    if (conPlay && UI.play.hidden) { ver(UI.play, true); colocar(false); } else if (!conPlay) ver(UI.play, false);
    if (conPlay && (forzar || t - COLOCADA > 1000)) { COLOCADA = t; colocar(false); }
    /* fin de la clase */
    var conFin = v.fase === 'fin' && !inm;
    if (conFin && UI.fin.hidden) {
      txt(UI.fEy, grupoBonito(v.c.grupo) + ' · ' + v.c.clase.toUpperCase() + ' · ' + DIA_NOMBRE[v.c.dia]);
      var ls = v.c.clase === 'c2' ? tareas(v.pub, v.c.curso) : [];
      UI.fT.innerHTML = ls.length ? '<h3>Tareas para casa</h3>' + ls.map(function (x) { return '<div class="lme-tarea ' + x.tema + '"><i></i><span>' + esc(x.t) + '</span></div>'; }).join('') : '';
      ver(UI.fT, ls.length > 0); ver(UI.fin, true); ding();
    } else if (!conFin && !UI.fin.hidden) ver(UI.fin, false);
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
  W.addEventListener('resize', function () { COLOCADA = 0; });
  D.addEventListener('fullscreenchange', function () { pintar(true); });
  D.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' && e.key !== 'Esc') return;
    if (UI && !UI.cartel.hidden) { quitarCartel(true); }
    else if (UI && !UI.fin.hidden) { finVisto(); ver(UI.fin, false); }
  }, true);
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', function () { pintar(true); }); else pintar(true);
  W.LMEscaleta = { version: '15-oct-2026', app: APP, grado: GRADO,
    vista: function () { var v = vista(ahora()); return { fase: v.fase, grupo: v.c && v.c.grupo, clase: v.c && v.c.clase, i: v.i, bloques: v.B, a: v.a || null }; },
    accion: accion, pintar: function () { pintar(true); }, formatea: formatea, tareas: tareas, nombreCorto: nombreCorto, inmersivo: inmersivo, recordatorios: recordatorios };
})();
