/* =====================================================================
   LM at home · PIEL COMÚN (26-sep-2026, Iago) · v2 27-sep-2026
   «Que LM at home se vea como una prolongación natural de Mis diarios»:
   fondo del conservatorio, cristal oscuro, texto blanco, color solo para
   destacar e iconos planos como los del Diario.
   SOLO aspecto: este fichero no toca ningún dato ni ninguna lógica de las apps.

   28-sep-2026 (noche) · PARA TODOS LOS ALUMNOS (Iago: «estoy preparado para que hagamos ya la aportación
   de la estética a todo el portal… a los alumnos o a los que accedan como invitados»).
   - El portal carga este fichero SIEMPRE y la piel se enciende para cualquier cuenta (y en la entrada).
   - El portal deja puesta la marca lm_piel=1 en *.lmathome.es: así las apps que se abren desde él
     también salen con la piel. Las funciones de Tester/Protester siguen siendo solo suyas: eso lo
     decide el propio portal, no la piel (la piel solo cambia el aspecto).
   - ?piel=0 en la dirección la apaga EN ESE NAVEGADOR (queda apuntado: lm_piel_no=1); ?piel=1 la vuelve a encender.
   - El Ojeador del Diario (#visor=<alumno>) sale CON piel, como lo ve ya el alumno, sin tocar marcas.
   - Lo que se abre desde el Diario (proyectar en clase, generar fichas…) sigue como siempre en esa pestaña.
   PARA VOLVER A «SOLO TESTER/PROTESTER»: subir otra vez la versión anterior de este fichero
   (lm-piel.js del commit 09642bf de LMEAVathome); en 10 minutos todo el mundo vuelve a lo de siempre.
   ---- lo que decía antes (27-sep-2026, solo para Iago Tester e Iago Protester): ----
   27-sep-2026 · DE MOMENTO SOLO PARA IAGO TESTER E IAGO PROTESTER
   - Cada app lleva en su <head> UNA línea («LM piel») que solo carga este
     fichero si el navegador tiene la marca lm_piel=1 (cookie de *.lmathome.es).
     Sin marca no se carga nada: los alumnos ven exactamente lo de siempre.
   - La marca la pone el portal (GE o GP) cuando la sesión es de Iago Tester o
     Iago Protester, y la quita (lm_piel=0) si entra cualquier otra cuenta.
   - ?piel=1 / ?piel=0 en la dirección la enciende / apaga a mano en ese navegador.
   - Lo que se abre desde el Diario (proyectar en clase, generar fichas…) se ve
     como siempre, aunque ese navegador tenga la marca.
   - El Ojeador del portal (#visor=<alumno>) se ve SIEMPRE sin piel, como lo ve el alumno.
   - Tarjetas: B (cristal negro con contorno de color) por defecto; ?tarjetas=a enseña la A.
   Para quitarla de una app: borrar su línea «LM piel». De todas a la vez:
   vaciar este fichero.
   ===================================================================== */
(function () {
  'use strict';
  if (window.LMPiel) return;
  var yo = document.currentScript || (function () { var s = document.getElementsByTagName('script'); for (var i = s.length - 1; i >= 0; i--) { if (/lm-piel\.js/.test(s[i].src)) return s[i]; } return null; })();
  var BASE = (yo && yo.src) ? yo.src.replace(/[?#].*$/, '').replace(/[^\/]*$/, '') : 'https://ge.lmathome.es/piel/';
  /* versión de las hojas de estilo: cambiarla cuando se actualicen los ficheros de apps/ */
  var V = (yo && yo.src && /[?&]v=([^&]+)/.exec(yo.src)) ? /[?&]v=([^&]+)/.exec(yo.src)[1] : '2026-09-28a';

  /* ---------- qué app es ---------- */
  var HOSTS = {
    'ge.lmathome.es': 'portal-ge', 'gp.lmathome.es': 'portal-gp',
    'teoria.ge.lmathome.es': 'teoria-ge', 'teoria.gp.lmathome.es': 'teoria-gp',
    'ritmo.ge.lmathome.es': 'ritmo-ge', 'ritmoentonado.gp.lmathome.es': 'ritmo-gp',
    'dictados.ge.lmathome.es': 'dictado-ge', 'dictados.gp.lmathome.es': 'dictado-gp',
    'predict.ge.lmathome.es': 'predict-ge', 'predict.gp.lmathome.es': 'predict-gp',
    'intervalia.ge.lmathome.es': 'intervalia-ge', 'intervalia.gp.lmathome.es': 'intervalia-gp',
    'entonacion.ge.lmathome.es': 'entonacion-ge',
    '6semicorcheas.ge.lmathome.es': 'desafio-ge', 'simuladoraccesoritmo.ge.lmathome.es': 'acceso-ge'
  };
  var REPOS = {
    LMEAVathome: 'portal-ge', lmpro: 'portal-gp', teoriaathome: 'teoria-ge', teoriapro: 'teoria-gp',
    ritmoathome: 'ritmo-ge', ritmopro: 'ritmo-gp', dictadoathome: 'dictado-ge', dictadospro: 'dictado-gp',
    predictathome: 'predict-ge', predictpro: 'predict-gp', intervalia: 'intervalia-ge', intervaliapro: 'intervalia-gp',
    entonacionathome: 'entonacion-ge', desafio6semicorcheas: 'desafio-ge', ritmosimulator: 'acceso-ge',
    PredictCarrusel: 'carrusel-ge', PreDictPROCarrusel: 'carrusel-gp'
  };
  var app = (yo && yo.getAttribute('data-app')) || window.LM_PIEL_APP || HOSTS[location.hostname] ||
            REPOS[(location.pathname.split('/')[1] || '')] || 'otra-ge';
  var q = {}; try { q = Object.fromEntries(new URLSearchParams(location.search)); } catch (e) {}
  var grado = (q.grado === 'gp' || q.grado === 'ge') ? q.grado : (/-gp$/.test(app) ? 'gp' : 'ge');
  var familia = app.replace(/-(ge|gp)$/, '');

  var H = document.documentElement;
  var ES_PORTAL = familia === 'portal';

  /* ---------- la marca: ¿se enciende la piel en este navegador? ---------- */
  var DOMINIO = /(^|\.)lmathome\.es$/.test(location.hostname) ? '; domain=.lmathome.es' : '';
  function leerMarca() { var m = /(?:^|;\s*)lm_piel=([01])/.exec(document.cookie || ''); return m ? m[1] : null; }
  function ponerMarca(v) {
    try { document.cookie = 'lm_piel=' + v + '; path=/; max-age=31536000; SameSite=Lax' + DOMINIO + (location.protocol === 'https:' ? '; Secure' : ''); } catch (e) {}
  }
  /* Iago Tester (4A) e Iago Protester (2GpC): por id y, por si acaso, por nombre */
  var TESTER_ID = { '4a3a8cf5-1ed6-4e86-99d1-5b090d5eacfb': 1, '23a2b7fb-3373-4877-b245-3a37d1f53de6': 1 };
  var TESTER_NOMBRE = { 'iago gonzalez tester': 1, 'iago gonzalez protester': 1, 'iago gonzalez pro tester': 1 };
  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toLowerCase(); }
  function sesion() { try { return JSON.parse(localStorage.getItem(grado === 'gp' ? 'lmpro_session' : 'lmeav_session') || 'null'); } catch (e) { return null; } }
  function idSesion(s) { return (s && s.id) ? String(s.id) : ''; }
  function esTester(s) { return !!(s && (TESTER_ID[idSesion(s)] || TESTER_NOMBRE[norm(s.nombre)])); }
  /* tarjetas de apartado (27-sep-2026, Iago): B = cristal negro con SOLO el contorno del color del apartado y,
     al pasar el ratón, relleno liso opaco de ese color (la que se queda) · A = rellenas de color liso (?tarjetas=a) */
  function tarjetas() {
    var t = 'b';
    try { t = (q.tarjetas === 'a' || q.tarjetas === 'b') ? q.tarjetas : (localStorage.getItem('lm_piel_tarjetas') || 'b'); } catch (e) {}
    return t === 'a' ? 'a' : 'b';
  }

  /* ---------- CSS y JS propios de cada familia de apps ---------- */
  var CON_CSS = { portal: 1, teoria: 1, ritmo: 1, dictado: 1, predict: 1, intervalia: 1, entonacion: 1, desafio: 1, acceso: 1, carrusel: 1 };
  var CON_JS = { portal: 1, teoria: 1, ritmo: 1, dictado: 1, predict: 1, intervalia: 1, entonacion: 1, desafio: 1, acceso: 1, carrusel: 1 };
  function css(href) { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; l.setAttribute('data-lm-piel', '1'); (document.head || H).appendChild(l); }
  function js(src) { var s = document.createElement('script'); s.src = src; s.async = false; (document.head || H).appendChild(s); }

  /* =====================================================================
     ICONOS PLANOS (los mismos trazos que el Diario, iconos-planos.js)
     Cada emoji conocido al PRINCIPIO de un texto se aparta a un <span>
     oculto y delante se pinta su icono. El emoji sigue en el texto (oculto),
     así que nada de lo que lee el texto de un botón cambia.
     ===================================================================== */
  var P = {
    bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    chart: '<path d="M5 20V11M12 20V5M19 20v-6M3 20h18"/>',
    trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    clipboard: '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="M9 10h6M9 14h6"/>',
    book: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    note: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    headphones: '<path d="M3 17v-4a9 9 0 0 1 18 0v4"/><rect x="3" y="15" width="4" height="6" rx="1.5"/><rect x="17" y="15" width="4" height="6" rx="1.5"/>',
    pen: '<path d="M16 3l5 5L8 21H3v-5z"/>',
    file: '<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 16h6"/>',
    pin: '<path d="M9 3h6l-1 6 4 4H6l4-4z"/><path d="M12 13v8"/>',
    star: '<path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.3L12 17.5 6.5 20.4l1-6.3L3 9.7l6.2-.9z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    dice: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 9h.01M15 15h.01M15 9h.01M9 15h.01M12 12h.01" stroke-width="3"/>',   /* (28-sep-2026, Iago) cinco puntos */
    /* (28-sep-2026, Iago) botones del profesor en el portal y herramientas de las lecciones */
    metronomo: '<path d="M9 3h6l4.5 18h-15z"/><path d="M7 16h10"/><path d="M12 16 17.5 5.5"/><path d="M15.2 9.2l2.2 1.2"/>',
    diapason: '<path d="M8.5 2.5v7.5a3.5 3.5 0 0 0 7 0V2.5"/><path d="M12 13.5v8"/><path d="M10 21.5h4"/>',
    clavesol: '<path d="M12.6 21.2c-.3 1.4-2.8 1.5-3.2.1-.3-1 .5-1.8 1.4-1.6"/><path d="M11.8 21.5 13 3.6c.1-1.4-1.4-1.6-2.1-.4-1.1 1.9-.6 4.3 1 5.9"/><path d="M11.9 9.1c-2.6 2-4.3 3.7-4.1 6.1.2 2.4 2.4 3.6 4.5 3.4 2-.2 3.3-1.8 3.1-3.6-.2-1.8-1.8-2.9-3.4-2.6-1.4.2-2.3 1.4-2 2.7"/>',
    pentagrama: '<path d="M3 5.5h18M3 9h18M3 12.5h18M3 16h18M3 19.5h18"/>',
    goma: '<path d="M4.5 14.5 13.8 5.2a1.8 1.8 0 0 1 2.5 0l3 3a1.8 1.8 0 0 1 0 2.5L12 18H8z"/><path d="M9.2 9.8l5.5 5.5"/><path d="M8 18h12"/>',
    deshacer: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
    expandir: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    contraer: '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>',
    clock: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 3h6"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    unlock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/>',
    box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
    laptop: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12h.01" stroke-width="3"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
    skip: '<path d="M5 5l10 7-10 7z"/><path d="M19 5v14"/>',
    exit: '<path d="M14 3H5v18h9"/><path d="M10 12h11M17 8l4 4-4 4"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
    link: '<path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1"/><path d="M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1"/>',
    message: '<path d="M4 5h16v11H9l-5 4z"/>',
    home: '<path d="M3 11l9-7 9 7v10H3z"/><path d="M9 21v-6h6v6"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.6L20 9"/><path d="M20 4v5h-5"/>',
    grad: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    drum: '<ellipse cx="12" cy="8" rx="8" ry="3"/><path d="M4 8v8c0 1.7 3.6 3 8 3s8-1.3 8-3V8"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    speaker: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9a4 4 0 0 1 0 6"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    cards: '<rect x="3" y="6" width="11" height="15" rx="2"/><path d="M9 3.5l9.5 2.2a2 2 0 0 1 1.5 2.4l-2.4 10.4"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.8 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="14.5" cy="7" r="1"/>',
    phone: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18h2"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-9 9"/>',
    ban: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    play: '<path d="M7 4l13 8-13 8z"/>',
    sprout: '<path d="M12 21v-9"/><path d="M12 12c0-4 3-7 8-7 0 4-3 7-8 7z"/><path d="M12 14c0-3-2.5-5-7-5 0 3.5 2.5 5 7 5z"/>',
    arrowleft: '<path d="M19 12H5"/><path d="M11 18l-6-6 6-6"/>',
    libro: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5z"/><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H20"/><path d="M8 7h8"/>'
  };
  var E = {
    '🔔': 'bell', '✉': 'mail', '📧': 'mail', '📨': 'mail', '📩': 'mail', '📊': 'chart', '📈': 'trend', '📉': 'trend',
    '🔍': 'search', '🔎': 'search', '📋': 'clipboard', '📚': 'book', '📖': 'book', '📘': 'book', '📕': 'book', '📗': 'book', '📙': 'book', '📓': 'book', '📒': 'book',
    '📅': 'calendar', '🗓': 'calendar', '📆': 'calendar', '👤': 'user', '👁': 'eye', '👀': 'eye', '🎵': 'note', '🎶': 'note', '🎼': 'note', '🎹': 'note', '🎸': 'note', '🎺': 'note', '🎷': 'note', '🎧': 'headphones',
    '🖊': 'pen', '✏': 'pen', '✍': 'pen', '🖋': 'pen', '📝': 'file', '🗒': 'file', '📄': 'file', '📃': 'file', '📑': 'file', '🧾': 'file', '📌': 'pin', '📍': 'pin',
    '✨': 'star', '⭐': 'star', '🌟': 'star', '➕': 'plus', '🎲': 'dice', '🌱': 'sprout', '⏱': 'clock', '⏳': 'clock', '⌛': 'clock', '⏰': 'clock',
    '🔒': 'lock', '🔐': 'lock', '🔓': 'unlock', '📦': 'box', '💻': 'laptop', '🖥': 'laptop', '🎯': 'target', '🗑': 'trash', '⚠': 'alert',
    '⏭': 'skip', '🚪': 'exit', '🏅': 'award', '🏆': 'award', '🥇': 'award', '📥': 'download', '⬇': 'download', '🔗': 'link',
    '💬': 'message', '🗨': 'message', '🏠': 'home', '🏫': 'home', '🔄': 'refresh', '🔁': 'refresh',
    '🎓': 'grad', '💡': 'bulb', '🧠': 'bulb', '🥁': 'drum', '🎤': 'mic', '🎙': 'mic', '🔊': 'speaker', '🔈': 'speaker', '🔉': 'speaker', '✅': 'check', '✔': 'check', '❌': 'x', '✖': 'x', '⏸': 'pause', '▶': 'play', '🚫': 'ban', '⛔': 'ban', '📣': 'bell', '📢': 'bell',
    '🃏': 'cards', '🎴': 'cards', '🎨': 'palette', '📱': 'phone', '🎉': 'star', '🎁': 'box', '⚡': 'bolt', '❓': 'help', '🖼': 'image', '🧭': 'target'
  };
  for (var cp = 0x1F550; cp <= 0x1F567; cp++) E[String.fromCodePoint(cp)] = 'clock';
  function ico(nombre, extra) {
    var p = P[nombre]; if (!p) return '';
    return '<svg class="pl-i' + (extra ? ' ' + extra : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }
  var RE_EMO = null;
  try { RE_EMO = new RegExp('^(\\s*)((?:\\p{Extended_Pictographic}|[\\u2600-\\u27BF])(?:\\uFE0F|\\uFE0E|\\u200D(?:\\p{Extended_Pictographic}|[\\u2600-\\u27BF])|\\p{Emoji_Modifier})*)(\\s*)', 'u'); } catch (e) {}
  var NO = { INPUT: 1, TEXTAREA: 1, SELECT: 1, OPTION: 1, SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, svg: 1, SVG: 1, CANVAS: 1 };
  function claveEmo(e) { return e.replace(/[️︎]/g, '').replace(/\p{Emoji_Modifier}/gu, ''); }
  function convertirTexto(n) {
    if (!RE_EMO) return;
    var t = n.nodeValue; if (!t || t.length > 400) return;
    var m = RE_EMO.exec(t); if (!m) return;
    var nombre = E[claveEmo(m[2])]; if (!nombre) return;
    var par = n.parentNode; if (!par || par.nodeType !== 1) return;
    if (NO[par.nodeName] || (par.closest && par.closest('[contenteditable="true"],.no-plano,.pl-emo,svg,.lm-sin-iconos'))) return;
    var sp = document.createElement('span'); sp.className = 'pl-emo'; sp.textContent = m[1] + m[2];
    var tmp = document.createElement('span'); tmp.innerHTML = ico(nombre);
    par.insertBefore(tmp.firstChild, n); par.insertBefore(sp, n);
    n.nodeValue = (m[3] ? ' ' : '') + t.slice(m[0].length);
  }
  function barrer(raiz) {
    if (!raiz || !RE_EMO || H.classList.contains('lm-sin-piel')) return;
    if (raiz.nodeType === 3) { convertirTexto(raiz); return; }
    if (raiz.nodeType !== 1 || NO[raiz.nodeName]) return;
    var w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, null), l = [], x;
    while ((x = w.nextNode())) { if (RE_EMO.test(x.nodeValue)) l.push(x); }
    l.forEach(convertirTexto);
  }

  /* ---------- rótulo de grado arriba al centro (fuera del portal, que ya lo lleva) ---------- */
  function rotulo() {
    if (familia === 'portal' || document.getElementById('lm-grado') || !document.body) return;
    var d = document.createElement('div'); d.id = 'lm-grado'; d.setAttribute('aria-hidden', 'true');
    d.textContent = grado === 'gp' ? 'GRADO PROFESIONAL' : 'GRADO ELEMENTAL';
    document.body.appendChild(d);
  }

  /* ---------- 27-sep-2026 (Iago): el rótulo de grado NO pegado al techo, sino en línea con la cabecera.
     Cada app dice con qué va en línea: LMPiel.alinearGrado(['.logo', 'header h1'…]) → el primero que se vea.
     El rótulo queda centrado en horizontal y a la altura del centro de ese elemento. ---------- */
  var conQuien = [];
  function colocarGrado() {
    var d = document.getElementById('lm-grado'); if (!d || !conQuien.length) return;
    var y = null;
    for (var i = 0; i < conQuien.length && y === null; i++) {
      var els; try { els = document.querySelectorAll(conQuien[i]); } catch (e) { continue; }
      for (var j = 0; j < els.length; j++) {
        var r = els[j].getBoundingClientRect();
        if (r.width > 0 && r.height > 0 && getComputedStyle(els[j]).visibility !== 'hidden') { y = r.top + r.height / 2; break; }
      }
    }
    if (y === null) { d.style.top = ''; return; }
    var op = d.offsetParent, base = -(window.pageYOffset || 0);
    if (op && op !== document.body && op !== document.documentElement) base = op.getBoundingClientRect().top;
    else if (op === document.body && getComputedStyle(document.body).position !== 'static') base = document.body.getBoundingClientRect().top;
    var top = Math.round(y - base) + 'px';
    if (d.style.top !== top) d.style.top = top;
  }
  /* 27-sep-2026 (tarde, Iago): «arriba de todo, ya siempre igual, sin nada a los lados» → el rótulo NO se alinea con
     nada: va siempre en la banda de arriba (lm-piel.css). Se deja la función para no romper a quien la llame. */
  function alinearGrado(sels) { conQuien = []; var d = document.getElementById('lm-grado'); if (d) d.style.top = ''; }

  /* ---------- 27-sep-2026 (Iago): «by Iago González Alonso» y «Optimizado para ordenador y tablet»
     abajo del todo, en el centro. Cada app dice qué elementos son: LMPiel.alPie(['.credito', '.optimizado']).
     Se mueven (tal cual, con su texto) a #lm-pie, al final de la página. ---------- */
  var alPieSels = [];
  function pie() {
    var p = document.getElementById('lm-pie');
    if (!p && document.body) { p = document.createElement('div'); p.id = 'lm-pie'; document.body.appendChild(p); }
    return p;
  }
  function moverAlPie() {
    if (!alPieSels.length || !document.body) return;
    var p = null;
    alPieSels.forEach(function (sel) {
      var els; try { els = document.querySelectorAll(sel); } catch (e) { return; }
      Array.prototype.forEach.call(els, function (el) {
        if (el.id === 'lm-pie' || el.closest('#lm-pie')) return;
        p = p || pie(); if (p) { el.classList.add('lm-en-pie'); p.appendChild(el); }
      });
    });
    var q2 = document.getElementById('lm-pie');
    if (q2 && q2.parentNode === document.body && q2 !== document.body.lastElementChild) {
      /* que siga siendo lo último de la página (salvo ventanas flotantes que la app añada después) */
      var ult = document.body.lastElementChild, cs = ult && getComputedStyle(ult);
      if (cs && cs.position !== 'fixed' && cs.position !== 'absolute' && cs.display !== 'none' && ult.tagName !== 'SCRIPT') document.body.appendChild(q2);
    }
  }
  function alPie(sels) { alPieSels = alPieSels.concat(sels || []); moverAlPie(); }

  var pendiente = false;
  function repasar() {
    if (pendiente) return; pendiente = true;
    (window.requestAnimationFrame || setTimeout)(function () { pendiente = false; try { moverAlPie(); } catch (e) {} try { colocarGrado(); } catch (e) {} });
  }

  function arrancar() {
    rotulo();
    try { barrer(document.body); } catch (e) {}
    try {
      new MutationObserver(function (ms) {
        ms.forEach(function (m) {
          if (m.type === 'characterData') { convertirTexto(m.target); return; }
          Array.prototype.forEach.call(m.addedNodes, function (nd) { try { barrer(nd); } catch (e) {} });
        });
        repasar();
      }).observe(document.body, { childList: true, subtree: true, characterData: true });
    } catch (e) {}
    window.addEventListener('resize', repasar);
    window.addEventListener('load', repasar);
    document.addEventListener('click', function () { setTimeout(repasar, 60); setTimeout(repasar, 400); }, true);
    if (CON_JS[familia]) js(BASE + 'apps/' + familia + '.js?v=' + V);
  }

  /* ---------- encender: clases en <html> + hojas de estilo (+ iconos, rótulo y JS de la familia) ---------- */
  function encender(mientrasCarga) {
    if (window.LMPiel && window.LMPiel.activo) return;
    H.classList.add('lm-piel', 'lm-' + grado, 'lm-app-' + app, 'lm-fam-' + familia, 'lm-tarjetas-' + tarjetas());
    var hojas = [BASE + 'lm-piel.css?v=' + V];
    if (CON_CSS[familia]) hojas.push(BASE + 'apps/' + familia + '.css?v=' + V);
    var escrito = false;
    /* mientras se lee la cabecera, las hojas se escriben en el propio HTML: así la página ya sale
       con la piel desde el primer momento (sin ver la versión antigua ni un parpadeo) */
    if (mientrasCarga && yo && !yo.async && !yo.defer) {
      try {
        document.write(hojas.map(function (h) { return '<link rel="stylesheet" href="' + h + '" data-lm-piel="1">'; }).join(''));
        escrito = true;
      } catch (e) {}
    }
    if (!escrito) hojas.forEach(css);
    window.LMPiel = { activo: true, app: app, grado: grado, familia: familia, base: BASE, ico: ico, barrer: barrer, P: P,
                      alinearGrado: alinearGrado, colocarGrado: colocarGrado, alPie: alPie };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar); else arrancar();
  }

  /* ---------- portal: si cambia la cuenta, se enciende o se apaga ---------- */
  function vigilarPortal() {
    var ultimo = idSesion(sesion());
    setInterval(function () {
      var s = sesion(), id = idSesion(s);
      if (id === ultimo) return;
      ultimo = id;
      if (!id) return;                                   /* ha cerrado sesión: se deja como está */
      var activa = !!(window.LMPiel && window.LMPiel.activo);
      if (esTester(s)) { if (leerMarca() !== '1') ponerMarca('1'); if (!activa) encender(false); }
      else if (leerMarca() === '1' || activa) { ponerMarca('0'); if (activa) location.reload(); }
    }, 1500);
  }

  /* ---------- 27-sep-2026 (noche) · Ojeador (#visor=<alumno>, lo abre el Diario): la piel NO se enciende
     y no se toca la marca. Así Iago ve el portal exactamente como lo ve ese alumno, y el portal (que en
     el Ojeador lee la sesión del alumno) no confunde la cuenta ni recarga la página. ---------- */
  /* (28-sep-2026, noche) ya con la piel para todos: el Ojeador la enseña, porque es lo que ve el alumno. No toca
     ninguna marca ni vigila la cuenta (en el Ojeador la sesión es la del alumno). */
  var NO_PIEL = /(?:^|;\s*)lm_piel_no=1/.test(document.cookie || '');
  function ponerNo(v) {
    try { document.cookie = 'lm_piel_no=' + v + '; path=/; max-age=' + (v === '1' ? 31536000 : 0) + '; SameSite=Lax' + DOMINIO + (location.protocol === 'https:' ? '; Secure' : ''); } catch (e) {}
  }
  if (ES_PORTAL && /visor=([0-9a-fA-F-]{36})/.test(location.hash || '')) {       /* el mismo criterio que el portal */
    if (!NO_PIEL && q.piel !== '0') encender(document.readyState === 'loading');
    else window.LMPiel = { activo: false, app: app, grado: grado, familia: familia, visor: true };
    if (window.LMPiel) window.LMPiel.visor = true;
    return;
  }

  /* ---------- decisión (28-sep-2026, noche: PARA TODOS) ----------
     Antes: el portal ponía la marca solo a Tester/Protester. Ahora el portal la pone a TODO el mundo (así la ven
     también las apps que se abren desde él), salvo en el navegador donde alguien la haya apagado con ?piel=0. */
  var marca = leerMarca();
  if (q.piel === '0') { ponerNo('1'); NO_PIEL = true; }            /* a mano: apagada en este navegador */
  else if (q.piel === '1') { ponerNo('0'); NO_PIEL = false; }      /* a mano: encendida otra vez */
  if (ES_PORTAL || q.piel === '1' || q.piel === '0') {
    var quiere = NO_PIEL ? '0' : '1';
    if (marca !== quiere) ponerMarca(quiere);
    marca = quiere;
  }
  var activo = marca === '1' && !NO_PIEL;
  /* lo abierto desde el Diario (clase, proyector, generar fichas…) se queda como siempre en esa pestaña */
  if (activo && !ES_PORTAL && q.piel !== '1') {
    var deDonde = ''; try { deDonde = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) {}
    var DIARIO = /^(diario|acceso)\.lmathome\.es$|^correccion[a-z0-9-]*\.lmathome\.es$|\.netlify\.app$/;
    try {
      if (DIARIO.test(deDonde)) sessionStorage.setItem('lm_piel_pestana', 'diario');
      else if (/^(ge|gp)\.lmathome\.es$/.test(deDonde)) sessionStorage.removeItem('lm_piel_pestana');
      if (sessionStorage.getItem('lm_piel_pestana') === 'diario') activo = false;
    } catch (e) { if (DIARIO.test(deDonde)) activo = false; }
  }
  if (activo) encender(document.readyState === 'loading');
  else window.LMPiel = { activo: false, app: app, grado: grado, familia: familia };
  /* (28-sep-2026, noche) ya no hace falta vigilar qué cuenta entra: la piel es para todas */
})();
