/* (28-oct-2026, Iago) COMPAT94 · la pantalla del aula (Linux, Google Chrome 94, sin actualizaciones): SOLO en un Chrome antiguo al que le falte algo (:has, color-mix, dvh, @container, roundRect…) se carga piel/compat94.js, que lo añade sin tocar las apps. En un navegador al día (y en Safari o Firefox) esta línea no hace nada. ?compat94=forzar lo prueba en cualquiera; ?compat94=0 lo apaga en esa pestaña. Para quitarlo: borrar esta línea. */
(function(){try{if(window.__LM_COMPAT94__)return;var q=location.search||'',f=/[?&]compat94=forzar(&|$)/.test(q);if(/[?&]compat94=0(&|$)/.test(q))return;if(!f){if(!/Chrome\/\d/.test(navigator.userAgent||'')||!window.CSS||!CSS.supports)return;if(CSS.supports('selector(:has(a))')&&CSS.supports('color','color-mix(in srgb, red 50%, blue)')&&CSS.supports('height','1dvh')&&CSS.supports('container-type','inline-size')&&window.CanvasRenderingContext2D&&CanvasRenderingContext2D.prototype.roundRect)return;}window.__LM_COMPAT94__=1;var s='https://ge.lmathome.es/piel/compat94.js?v=2026-10-28',y=document.currentScript,pon=function(){if(window.LMCompat94)return;var e=document.createElement('script');e.src=s;e.async=false;e.setAttribute('data-lm-c94','1');(document.head||document.documentElement).appendChild(e);};if(document.readyState==='loading'&&y&&!y.async&&!y.defer){try{document.write('<script src="'+s+'" data-lm-c94="1"><\/script>');}catch(x){pon();}document.addEventListener('DOMContentLoaded',pon);}else pon();}catch(x){}})();
/* (15-oct-2026, Iago) TRABAJO POR LIBRE · el «latido» de los subportales (piel/latido.js).
   Iago: «si un alumno entra en el portal y se pone a hacer ejercicios de Teoría at home, como compases o intervalos, o si
   utiliza Intervalia Pro o Intervalia at home… (y los portales interactivos, tipo Fonógrafo) me gustaría que me llegue
   como notificación… qué alumno, qué ejercicio por libre, por su cuenta, y cuánto tiempo estuvo… y si estuvo haciendo
   varios ejercicios dentro de Teoría at home, que me llegue como una sola notificación». Mínimo 2 minutos y solo el
   tiempo practicando de verdad.
   · En los PORTALES (ge. / gp.lmathome.es): deja la cuenta del alumno que ha entrado en una cookie de .lmathome.es
     (lm_cta_ge / lm_cta_gp) para que la lean sus subportales, que son otros dominios. Las cuentas de profesor, no.
   · En los SUBPORTALES: cuenta los segundos que el alumno practica de verdad (pestaña delante y algo tocado en los
     últimos 2 minutos, o un vídeo/audio sonando) y cada minuto manda un latido a Supabase (suite_actividad_ping) con el
     subportal y el ejercicio. Los latidos seguidos (sin pausas de más de 10 min) son UN rato; la campana del Diario
     enseña los de 2 minutos o más (suite_actividad_listar).
   · Nada si viene de una tarea (ficha, quiz o intro de una carta), del Diario (clase, proyector) o del Ojeador, ni en
     las apps de los deberes de cada semana (ritmo, entonación, dictados) ni en el Carrusel de clase.
   Lo carga lm-piel.js en todas sus apps; los portales temáticos (Fonógrafo, Acústica…) lo traen con su propia línea.
   Para quitarlo: borrar la carga en lm-piel.js (y esa línea de los temáticos); sin latidos, no hay avisos. */
(function () {
  'use strict';
  if (window.LMLatido) return;
  var host = location.hostname;
  if (!/(^|\.)lmathome\.es$/.test(host)) return;
  var yo = document.currentScript;
  var SB = 'https://woiptkyrxkbpnvioypit.supabase.co', ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvaXB0a3lyeGticG52aW95cGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NzI2ODYsImV4cCI6MjA5MjA0ODY4Nn0.B2nKgj5rD0rkdLeMIrd9KgD8lUPWsBT4Y7aCtmnvbjA';
  var T = window.__LATIDO_T || { s: 1000, minuto: 60000, quieto: 120000 };   /* (el banco de pruebas acelera el reloj) */
  var q = {}; try { q = Object.fromEntries(new URLSearchParams(location.search)); } catch (e) {}
  var grado = (yo && yo.getAttribute('data-grado')) || (/(^|\.)gp\.lmathome\.es$/.test(host) ? 'gp' : 'ge');
  var ES_PORTAL = host === 'ge.lmathome.es' || host === 'gp.lmathome.es';
  var app = (yo && yo.getAttribute('data-app')) || '';
  if (!app || /^otra-/.test(app)) app = host.split('.')[0] + '-' + grado;   /* fonografo.gp.lmathome.es → fonografo-gp */
  var familia = app.replace(/-(ge|gp)$/, '');
  var COOKIE = 'lm_cta_' + grado;
  var DOMINIO = '; domain=.lmathome.es; path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
  var TESTER = { 'iago gonzalez tester': 1, 'iago gonzalez protester': 1, 'iago gonzalez pro tester': 1 };
  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toLowerCase(); }
  function leerCookie() { var m = new RegExp('(?:^|;\\s*)' + COOKIE + '=([0-9a-fA-F-]{36})').exec(document.cookie || ''); return m ? m[1] : null; }
  function visor() { return /visor=/.test(location.hash || '') || !!window.__VISOR; }
  window.LMLatido = { app: app, grado: grado, portal: ES_PORTAL };

  /* ---------- en el portal: la cuenta, a la cookie compartida ---------- */
  if (ES_PORTAL) {
    var ultimo = '#';
    var apuntar = function () {
      if (visor()) return;   /* en el Ojeador la sesión es la del alumno que se mira: no se apunta en este navegador */
      var s = null; try { s = JSON.parse(localStorage.getItem(grado === 'gp' ? 'lmpro_session' : 'lmeav_session') || 'null'); } catch (e) {}
      if (!s && window.__LM_SES) s = window.__LM_SES;
      var id = (s && s.id && s.estado === 'validado' && !TESTER[norm(s.nombre)]) ? String(s.id) : '';
      if (id === ultimo) return;
      ultimo = id;
      try {
        if (id) document.cookie = COOKIE + '=' + id + '; max-age=2592000' + DOMINIO;
        else if (leerCookie()) document.cookie = COOKIE + '=; max-age=0' + DOMINIO;
      } catch (e) {}
    };
    apuntar();
    var n = 0, t = setInterval(function () { apuntar(); if (++n > 120) { clearInterval(t); setInterval(apuntar, 30000); } }, 2000);
    return;
  }

  /* ---------- en los subportales: el latido ---------- */
  if (/^(ritmo|entonacion|dictado|carrusel|portal)$/.test(familia)) return;          /* deberes de la semana y clase */
  if (q.fichaId || q.ficha || q.quizCarta || q.introCarta || q.quiz || q.carta || q.envio || q.revision || q.panel) return;
  if (visor() || window.__SUITE_ALUMNO) return;
  try {
    var deDonde = document.referrer ? new URL(document.referrer).hostname : '';
    if (/^(diario|acceso)\.lmathome\.es$|^correccion[a-z0-9-]*\.lmathome\.es$|\.netlify\.app$/.test(deDonde)) sessionStorage.setItem('lm_latido_no', '1');
    if (sessionStorage.getItem('lm_latido_no') === '1' || sessionStorage.getItem('lm_piel_pestana') === 'diario') return;
  } catch (e) {}
  if (!leerCookie()) return;

  var ultimoToque = Date.now(), acc = 0;
  function toque() { ultimoToque = Date.now(); }
  var EV = ['pointerdown', 'keydown', 'touchstart', 'wheel', 'input', 'change'];
  function enganchar(doc) {
    if (!doc || doc.__lmLatido) return;
    doc.__lmLatido = 1;
    EV.forEach(function (ev) { try { doc.addEventListener(ev, toque, { capture: true, passive: true }); } catch (e) {} });
  }
  enganchar(document);
  function sonando() {
    var m = document.querySelectorAll('video, audio');
    for (var i = 0; i < m.length; i++) { if (!m[i].paused && !m[i].ended && m[i].currentTime > 0) return true; }
    /* (17-oct-2026, Iago: «qué tipo de ejercicios hizo, cuánto tiempo estuvo en cada uno») también el vídeo o el audio que suena
       dentro de un iframe de la misma web: los vídeos de Teoría (intros/…) van en uno y, vistos sin tocar nada, a los 2 minutos
       dejaban de contar. Los iframes de otra web no se pueden mirar (contentDocument es null): no cuentan, como antes. */
    try {
      var fr = document.querySelectorAll('iframe');
      for (var j = 0; j < fr.length; j++) {
        var dd = null; try { dd = fr[j].contentDocument; } catch (e) {}
        if (!dd) continue;
        var mm = dd.querySelectorAll('video, audio');
        for (var k = 0; k < mm.length; k++) { if (!mm[k].paused && !mm[k].ended && mm[k].currentTime > 0) return true; }
      }
    } catch (e) {}
    return false;
  }
  /* el ejercicio: en Teoría, la vista que se ve (view-intervalos → «intervalos»); en otras, si la app lo dice */
  function ejercicio() {
    try {
      var d = document.querySelector('[data-lm-ejercicio]');
      if (d) return d.getAttribute('data-lm-ejercicio') || null;
      if (familia === 'teoria') {
        var vs = document.querySelectorAll('[id^="view-"]');
        for (var i = 0; i < vs.length; i++) {
          var el = vs[i];
          if (el.offsetParent !== null && el.id !== 'view-home' && el.id !== 'view-profesor') return el.id.slice(5);
        }
      }
    } catch (e) {}
    return null;
  }
  function latido(seg, ultimoDeVerdad) {
    var cta = leerCookie(); if (!cta || window.__SUITE_ALUMNO) return;
    try {
      fetch(SB + '/rest/v1/rpc/suite_actividad_ping', {
        method: 'POST', keepalive: !!ultimoDeVerdad,
        headers: { 'Content-Type': 'application/json', apikey: ANON, Authorization: 'Bearer ' + ANON },
        body: JSON.stringify({ p_cuenta_id: cta, p_app: app, p_origen: ejercicio(), p_segundos: Math.min(90, Math.round(seg)) })
      }).catch(function () {});
    } catch (e) {}
    if (window.LMLatido) window.LMLatido.enviados = (window.LMLatido.enviados || 0) + 1;
  }
  setInterval(function () {
    try { var fr = document.querySelectorAll('iframe'); for (var i = 0; i < fr.length; i++) { try { enganchar(fr[i].contentDocument); } catch (e) {} } } catch (e) {}
    if (document.visibilityState !== 'visible') return;
    if (familia === 'teoria' && !ejercicio()) return;   /* en Teoría, el menú del inicio no es practicar (como el contador de siempre) */
    if (Date.now() - ultimoToque < T.quieto || sonando()) acc += 1;   /* un segundo más de práctica */
  }, T.s);
  setInterval(function () { if (acc >= 20) { latido(acc); acc = 0; } }, T.minuto);
  function soltar() { if (acc >= 20) { latido(acc, true); acc = 0; } }
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') soltar(); });
  window.addEventListener('pagehide', soltar);
})();
