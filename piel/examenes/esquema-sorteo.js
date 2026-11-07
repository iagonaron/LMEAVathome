/* LM at home · EXAMEN DE RITMO (GE) Y RITMO ENTONADO (GP) · esquema + sorteo A/B + cuenta atrás
   (7-nov-2026, Iago) «La pantalla con el esquema, con el sorteo, que haya una cuenta atrás de 5 minutos que yo active…
   en ritmo entonado también la previa de la escala y el arpegio… cuando queden 5 segundos: ya puedes dar la vuelta a la
   hoja, empieza el estudio.» El sorteo se guarda en suite_sorteo_examen y lo leen las apps de corrección.
   Lo abre piel/apps/portal.js (sección 21, icono del metrónomo, solo Tester/Protester) con el material ya descifrado:
     window.LMExamenRitmo.abrir({ datos, grupos:['4A','4B'], trim, sb, anon, cuenta })   (el primero, el de la clase de ahora)
   datos = { grado:'GE'|'GP', materia:'ritmo'|'ritmo_entonado', titulo, propuestas:[{id,nombre,svg}], previa:{svg,titulo,notas:[{id,midi}]}|null }
   (7-nov, 11:10) El sorteo, con movimiento fluido (barajeo de cartas) a petición de Iago, aunque el aula vaya justa de fotogramas. */
(function () {
  'use strict';
  var ESTUDIO = 300, VUELTA = 5;
  var S = null;   /* estado de la pantalla abierta */

  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function css() {
    if (document.getElementById('lm-exr-css')) return;
    var st = el('style'); st.id = 'lm-exr-css';
    st.textContent =
      '#lm-exr{--acc:#15803d;position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147482995;background:#fff;color:#0b1320;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;display:flex;flex-direction:column}' +
      '#lm-exr .cab{display:flex;align-items:center;justify-content:space-between;padding:12px 22px 8px;border-bottom:1.5px solid var(--acc)}' +
      '#lm-exr .lm{font-weight:900;font-size:22px;line-height:1;min-width:180px}#lm-exr .lm i{font-family:Georgia,serif;font-weight:400;color:#8a93b3;font-size:16px;margin-left:5px}' +
      '#lm-exr .lm small{display:block;font-size:8.5px;letter-spacing:.22em;color:#b8902a;font-weight:800;margin-top:4px}' +
      '#lm-exr .tit{text-align:center}#lm-exr .tit b{font-weight:900;font-size:30px}#lm-exr .tit b span{font-weight:300}' +
      '#lm-exr .tit div{font-size:11px;letter-spacing:.28em;color:var(--acc);font-weight:800;margin-top:4px}' +
      '#lm-exr .der{min-width:180px;display:flex;justify-content:flex-end;gap:6px}' +
      '#lm-exr button{font:700 13px "Helvetica Neue",Arial,sans-serif;border:1px solid #d1d5db;background:#fff;color:#0b1320;border-radius:9px;padding:8px 12px;cursor:pointer}' +
      '#lm-exr button.on{background:var(--acc);border-color:var(--acc);color:#fff}#lm-exr button:disabled{opacity:.45;cursor:default}' +
      '#lm-exr .x{width:40px;height:38px;padding:0;font-size:18px}' +
      '#lm-exr .cuerpo{flex:1;min-height:0;display:flex;gap:22px;padding:14px 22px 16px}' +
      '#lm-exr .esq{flex:1;min-width:0;display:flex;flex-direction:column;position:relative}' +
      '#lm-exr .esq .props{display:flex;gap:6px;margin-bottom:6px}' +
      '#lm-exr .lienzo{flex:1;min-height:0;display:flex;justify-content:center;align-items:flex-start}' +
      '#lm-exr .lienzo svg{max-width:100%;max-height:100%;width:auto;height:100%}' +
      '#lm-exr .pan{width:360px;display:flex;flex-direction:column;background:#f4f7f5;border-radius:16px;padding:14px}' +
      '#lm-exr .pan h3{margin:0 0 8px;font-size:11px;letter-spacing:.2em;color:#6b7280;font-weight:800}' +
      '#lm-exr ol{position:relative;list-style:none;margin:0;padding:0;flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column}' +
      '#lm-exr li{display:flex;align-items:center;justify-content:space-between;flex:1 1 0;min-height:22px;max-height:38px;margin-bottom:4px;padding:0 10px;background:#fff;border-radius:9px;border:1px solid #e5e7eb;font-size:16px;font-weight:500}' +
      '#lm-exr li .n{display:inline-block;width:24px;color:#6b7280;font-size:12px}' +
      '#lm-exr li .ab{width:34px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:15px;visibility:hidden}' +
      '#lm-exr li .ab.A{visibility:visible;background:var(--acc);color:#fff}#lm-exr li .ab.B{visibility:visible;background:#fff;color:var(--acc);box-shadow:inset 0 0 0 2px var(--acc)}' +
      '#lm-exr li{will-change:transform;box-shadow:0 1px 2px rgba(11,19,32,.08)}#lm-exr li.flash{background:#dcfce7}#lm-exr li.ya{border-color:var(--acc);box-shadow:0 0 0 2px var(--acc);font-weight:800}#lm-exr li.hecho{opacity:.45}' +
      '#lm-exr .bts{display:flex;gap:8px;margin-top:10px}#lm-exr .bts button{flex:1;padding:12px 8px;font-size:14px}' +
      '#lm-exr .go{background:var(--acc);border-color:var(--acc);color:#fff;font-weight:800;letter-spacing:.06em}' +
      '#lm-exr .res{font-size:12px;color:#6b7280;margin-top:8px;text-align:center;min-height:16px}' +
      '#lm-exr .reloj{display:none;flex:1;flex-direction:column;align-items:center;justify-content:center;gap:10px}' +
      '#lm-exr .reloj b{font-size:96px;font-weight:900;font-variant-numeric:tabular-nums;letter-spacing:.02em}' +
      '#lm-exr .reloj.ambar b{color:#d97706}#lm-exr .reloj.rojo b{color:#dc2626}#lm-exr .reloj span{font-size:13px;color:#6b7280;letter-spacing:.18em;font-weight:800}' +
      '#lm-exr .lista{display:flex;flex-direction:column;flex:1;min-height:0}#lm-exr.estudiando .lista{display:none}#lm-exr.estudiando .reloj{display:flex}' +
      '#lm-exr .velo{display:none;position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(11,19,32,.93);color:#fff;border-radius:14px;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:20px;text-align:center}' +
      '#lm-exr .velo.on{display:flex}#lm-exr .velo h2{margin:0;font-size:30px;font-weight:900}#lm-exr .velo p{margin:0;font-size:18px;opacity:.85}' +
      '#lm-exr .velo .pv{width:100%;background:#fff;border-radius:12px;padding:8px}#lm-exr .velo .pv svg{width:100%;height:auto;display:block}' +
      '#lm-exr .velo .grande{font-size:120px;font-weight:900;line-height:1}' +
      /* (7-nov, 14:57) previa interactiva: ▶ y «Siguiente» en cada etapa, ▶ por salto, 3-2-1 en azul */
      '#lm-exr .velo .pv{position:relative}#lm-exr .velo .gbts{position:relative;height:58px}#lm-exr .velo .gbts button{position:absolute;top:6px;transform:translateX(-50%);font:800 18px/1 "Helvetica Neue",Arial,sans-serif;padding:10px 16px;border-radius:10px;border:2px solid var(--acc);background:#fff;color:var(--acc);cursor:pointer}' +
      '#lm-exr .velo .gbts button.son,#lm-exr .velo .pbts .p-play.son{background:var(--acc);color:#fff}' +
      '#lm-exr .velo .pbts{display:flex;gap:16px;align-items:center}#lm-exr .velo .pbts button{font:800 22px/1 "Helvetica Neue",Arial,sans-serif;padding:14px 28px;border-radius:12px;border:0;cursor:pointer;background:#fff;color:#0b1320}' +
      '#lm-exr .velo .pbts .p-play{background:var(--acc);color:#fff}#lm-exr .velo .pbts .p-sig.fin{background:#16a34a;color:#fff}' +
      '#lm-exr .velo .pasos{display:flex;gap:8px}#lm-exr .velo .pasos i{width:11px;height:11px;border-radius:50%;background:rgba(255,255,255,.28)}#lm-exr .velo .pasos i.on{background:#fff}' +
      '#lm-exr .c321{position:absolute;top:0;left:0;right:0;bottom:0;z-index:6;border-radius:14px;background:var(--acc);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}' +
      '#lm-exr .c321 b{font:900 260px/1 "Helvetica Neue",Arial,sans-serif;animation:lmx321 .9s ease-out both}#lm-exr .c321 span{font:800 28px/1 "Helvetica Neue",Arial,sans-serif;opacity:.9}' +
      '@keyframes lmx321{from{transform:scale(1.35);opacity:0}25%{opacity:1}to{transform:scale(1);opacity:1}}' +
      '#lm-exr .grp{display:flex;gap:6px;margin-bottom:10px}#lm-exr .grp button{flex:1}' +
      '#lm-exr .pila{position:relative;width:100%;height:100%}#lm-exr .pila img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;transition:opacity 1.6s ease}' +
      '#lm-exr .rmini{display:none;position:absolute;top:6px;right:6px;padding:8px 14px;border-radius:12px;background:rgba(11,19,32,.88);color:#fff;font:800 28px/1 "Helvetica Neue",Arial,sans-serif;font-variant-numeric:tabular-nums;z-index:3}' +
      '#lm-exr .rmini.ambar{background:#d97706}#lm-exr .rmini.rojo{background:#dc2626}#lm-exr.conpartitura .pan{display:none}#lm-exr.conpartitura .rmini{display:block}#lm-exr.conpartitura .props{visibility:hidden}' +
      '#lm-exr .sig{display:none}#lm-exr.llamando .sig{display:flex}';
    document.head.appendChild(st);
  }

  /* ---------- sonido (la previa) ---------- */
  var AC = null;
  function tono(midi, dur, vol) {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.resume) AC.resume();
      var t = AC.currentTime, o = AC.createOscillator(), o2 = AC.createOscillator(), g = AC.createGain();
      o.type = 'triangle'; o2.type = 'sine'; o.frequency.value = o2.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.3, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.95);
      o.connect(g); o2.connect(g); g.connect(AC.destination); o.start(t); o2.start(t); o.stop(t + dur); o2.stop(t + dur);
    } catch (e) {}
  }
  /* (7-nov, 11:11, Iago) «incluso con soniditos»: ruido filtrado para las cartas (mezcla y reparto) */
  var RUIDO = null;
  function ruido(cuando, dur, frec, vol, q) {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.resume) AC.resume();
      if (!RUIDO) { RUIDO = AC.createBuffer(1, AC.sampleRate, AC.sampleRate); var d = RUIDO.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
      var t = AC.currentTime + (cuando || 0), src = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
      src.buffer = RUIDO; f.type = 'bandpass'; f.frequency.value = frec; f.Q.value = q || 1.2;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(f); f.connect(g); g.connect(AC.destination); src.start(t, Math.random() * 0.5); src.stop(t + dur + 0.02);
    } catch (e) {}
  }
  function sonMezcla() { for (var i = 0; i < 26; i++) ruido(i * 0.013 + Math.random() * 0.004, 0.025, 2500 + Math.random() * 2500, 0.22, 2); }   /* trrrr de las cartas */
  function sonCorte() { ruido(0, 0.12, 1200, 0.18, 0.8); }
  function sonReparto() { ruido(0, 0.09, 3500, 0.16, 0.7); }   /* fsst de una carta al caer */
  function espera(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  /* ---------- Supabase ---------- */
  function rpc(fn, args) {
    return fetch(S.sb + '/rest/v1/rpc/' + fn, { method: 'POST', cache: 'no-store',
      headers: { apikey: S.anon, Authorization: 'Bearer ' + S.anon, 'Content-Type': 'application/json' }, body: JSON.stringify(args) })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
  }
  function nombres(lista) {   /* nombre; con la inicial del apellido si dos se llaman igual */
    var c = {}; lista.forEach(function (a) { c[a.nombre] = (c[a.nombre] || 0) + 1; });
    lista.forEach(function (a) { a.ver = a.nombre + (c[a.nombre] > 1 && a.apellidos ? ' ' + String(a.apellidos).trim().charAt(0) + '.' : ''); });
    var c2 = {}; lista.forEach(function (a) { c2[a.ver] = (c2[a.ver] || 0) + 1; });
    lista.forEach(function (a) { if (c2[a.ver] > 1 && a.apellidos) a.ver = a.nombre + ' ' + String(a.apellidos).trim().split(/\s+/)[0]; });
  }

  /* ---------- pantalla ---------- */
  function abrir(o) {
    cerrar(); css();
    S = { ensayo: !!o.ensayo, d: o.datos, grupos: o.grupos || [o.grupo], grupo: (o.grupos || [o.grupo])[0], trim: o.trim || '1T', sb: o.sb, anon: o.anon, cuenta: o.cuenta, prop: 0, alumnos: [], orden: null, fase: 'sorteo', id: 0, llamando: -1 };
    var d = S.d, gp = d.grado === 'GP';
    var sinAB = d.materia === 'entonacion'; S.sinAB = sinAB;   /* la entonación de GE es una sola lección: solo orden */
    var raiz = el('div'); raiz.id = 'lm-exr'; if (sinAB) raiz.style.setProperty('--acc', '#1d4ed8'); raiz.setAttribute('role', 'dialog'); raiz.setAttribute('aria-modal', 'true');
    raiz.innerHTML =
      '<div class="cab"><div class="lm">LM<i>at home</i><small>' + (gp ? 'GRADO PROFESIONAL' : 'GRADO ELEMENTAL') + '</small></div>' +
      '<div class="tit"><b>' + (d.materia === 'entonacion' ? 'ENTON<span>ACIÓN</span>' : gp ? 'RITMO <span>ENTONADO</span>' : 'RITMO') + '</b><div>EXAMEN · ' + ({ '1T': '1.ER', '2T': '2.º', '3T': '3.ER' }[S.trim] || S.trim) + ' TRIMESTRE · <span class="g"></span></div></div>' +
      '<div class="der"><button class="x" title="Cerrar (Esc)">✕</button></div></div>' +
      '<div class="cuerpo"><div class="esq"><div class="props"></div><div class="lienzo"></div>' +
      '<div class="velo"></div><div class="rmini"></div></div>' +
      '<div class="pan"><div class="lista"><div class="grp"></div><h3>' + (sinAB ? 'ORDEN · SORTEO' : 'SORTEO A / B') + '</h3><ol></ol>' +
      '<div class="bts"><button class="go b-sor">SORTEAR</button><button class="b-est">Iniciar estudio</button></div>' +
      '<div class="bts sig"><button class="b-sig">Siguiente alumno →</button></div><div class="res"></div></div>' +
      '<div class="reloj"><span>ESTUDIO</span><b>5:00</b><button class="b-fin">Terminar ya</button></div></div></div>';
    document.body.appendChild(raiz); S.raiz = raiz;
    raiz.querySelector('.x').onclick = cerrar;
    raiz.querySelector('.b-sor').onclick = sortear;
    raiz.querySelector('.b-est').onclick = estudio;
    raiz.querySelector('.b-sig').onclick = siguiente;
    raiz.querySelector('.b-fin').onclick = function () { S.finYa = true; };
    document.addEventListener('keydown', teclas, true);
    pintaProps(); pintaEsquema(); cargar();
  }
  /* (7-nov-2026, Iago) solo la columna del grupo activo (el de la clase de ahora); selector para el otro */
  function pintaGrupos() {
    var c = S.raiz.querySelector('.grp'); c.innerHTML = '';
    S.raiz.querySelector('.tit .g').textContent = S.grupo;
    if (S.grupos.length < 2) return;
    S.grupos.forEach(function (g) { var b = el('button', g === S.grupo ? 'on' : '', esc(g)); b.onclick = function () { if (g === S.grupo) return; S.id++; S.grupo = g; S.llamando = -1; S.raiz.classList.remove('llamando', 'estudiando'); cargar(); }; c.appendChild(b); });
  }
  function cargar() {
    var raiz = S.raiz, d = S.d, id = S.id; pintaGrupos(); S.alumnos = []; S.orden = []; pintaLista();
    raiz.querySelector('.b-sor').textContent = 'SORTEAR'; raiz.querySelector('.b-sor').disabled = false; raiz.querySelector('.b-est').disabled = false;
    res('Cargando el grupo…');
    rpc('suite_sorteo_examen_lista', { p_cuenta_id: S.cuenta, p_grupo: S.grupo, p_materia: d.materia }).then(function (r) {
      if (!S || id !== S.id) return;
      if (!r || !r.ok) { res('No se ha podido cargar el grupo (' + ((r && r.error) || 'error') + ').'); return; }
      S.alumnos = r.alumnos || []; nombres(S.alumnos);
      if (r.sorteo && r.sorteo.filas && r.sorteo.filas.length) {
        var por = {}; S.alumnos.forEach(function (a) { por[a.id] = a; });
        S.orden = r.sorteo.filas.map(function (f) { var a = por[f.id] || { id: f.id, nombre: f.nombre, ver: f.nombre }; return { a: a, ab: f.modelo }; });
        S.alumnos.forEach(function (a) { if (!S.orden.some(function (x) { return x.a.id === a.id; })) S.orden.push({ a: a, ab: null }); });
        pintaLista(); res('Sorteo ya hecho · ' + new Date(r.sorteo.creado_en).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'numeric' }));
        raiz.querySelector('.b-sor').textContent = 'REPETIR SORTEO';
      } else { S.orden = S.alumnos.map(function (a) { return { a: a, ab: null }; }); pintaLista(); res(S.alumnos.length + ' alumnos · sin sortear'); }
    }).catch(function () { res('Sin conexión con la base de datos.'); });
  }
  function cerrar() {
    if (!S) return; S.id++; document.removeEventListener('keydown', teclas, true);
    if (S.raiz && S.raiz.parentNode) S.raiz.parentNode.removeChild(S.raiz); S = null;
  }
  function teclas(e) {
    if (e.key === 'Escape' && S) { e.preventDefault(); e.stopPropagation(); cerrar(); return; }
    if (S && S.pv) {   /* previa interactiva: espacio = ▶ · → / AvPág = siguiente · ← / RePág = anterior (el mando del aula) */
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); S.pv.play(); }
      else if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); e.stopPropagation(); S.pv.sig(); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); e.stopPropagation(); S.pv.ant(); }
    }
  }
  function res(t) { if (S) S.raiz.querySelector('.res').textContent = t; }
  function pintaProps() {
    var c = S.raiz.querySelector('.props'), ps = S.d.propuestas;
    if (ps.length < 2) { c.style.display = 'none'; return; }
    c.innerHTML = ''; ps.forEach(function (p, i) { var b = el('button', i === S.prop ? 'on' : '', esc(p.nombre)); b.onclick = function () { S.prop = i; pintaProps(); pintaEsquema(); }; c.appendChild(b); });
  }
  function pintaEsquema() {
    var p = S.d.propuestas[S.prop], c = S.raiz.querySelector('.lienzo');
    if (p.img) c.innerHTML = '<div class="pila"><img class="i-esq" alt="" draggable="false" src="' + p.img + '">' + (p.partitura ? '<img class="i-par" alt="" draggable="false" style="opacity:0" src="' + p.partitura + '">' : '') + '</div>';
    else c.innerHTML = p.svg;
  }
  function pintaLista(flash) {
    var ol = S.raiz.querySelector('ol'); ol.innerHTML = '';
    S.orden.forEach(function (x, i) {
      var li = el('li', (flash && flash[i] ? 'flash' : '') + (i === S.llamando ? ' ya' : '') + (S.llamando > i ? ' hecho' : ''),
        '<span><span class="n">' + (i + 1) + '</span>' + esc(x.a.ver || x.a.nombre) + '</span><span class="ab ' + (x.ab || '') + '">' + (x.ab || '') + '</span>');
      ol.appendChild(li);
    });
  }
  function baraja(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  var armado = 0;
  function sortear() {
    var b = S.raiz.querySelector('.b-sor');
    if (!S.alumnos.length) return;
    if (S.orden.some(function (x) { return x.ab; }) && Date.now() - armado > 3000) {
      armado = Date.now(); b.textContent = '¿SEGURO? PULSA OTRA VEZ';
      setTimeout(function () { if (S && Date.now() - armado >= 3000) b.textContent = 'REPETIR SORTEO'; }, 3100); return;
    }
    armado = 0; var id = ++S.id; b.disabled = true; S.raiz.querySelector('.b-est').disabled = true; S.llamando = -1; S.raiz.classList.remove('llamando');
    res('Barajando…');
    var lista = S.alumnos.map(function (a) { return { a: a, ab: null }; });
    (async function () {
      /* (7-nov-2026, 11:10, Iago) «Prefiero que sea movimiento fluido… como un barajeo de nombres, como cuando las cartas se
         juntan… que se barajen y entremezclen.» 1) los nombres se juntan en un mazo, 2) se cortan y se entremezclan varias
         veces, 3) se reparten uno a uno a su sitio en el orden nuevo y les cae su letra. */
      var ol = S.raiz.querySelector('ol'), lis = [].slice.call(ol.children);
      var mazo = Math.max(0, ol.clientHeight / 2 - (lis[0] ? lis[0].offsetHeight / 2 : 0));
      var pon = function (li, x, y, r, t) { li.style.transition = t ? 'transform ' + t + 's cubic-bezier(.45,.05,.25,1)' : 'none'; li.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + r + 'deg)'; };
      var rnd = function (a) { return (Math.random() * 2 - 1) * a; };
      lis.forEach(function (li, k) { li.style.position = 'relative'; li.style.zIndex = String(k + 1); pon(li, 0, mazo - li.offsetTop, rnd(3), 0.55 + k * 0.02); });
      for (var z = 0; z < lis.length; z++) ruido(0.25 + z * 0.03, 0.06, 1800, 0.08, 1);   /* se juntan */
      await espera(750); if (id !== S.id) return;
      res('Barajando…');
      for (var v = 0; v < 4; v++) {                       /* corte y mezcla, como unas cartas */
        lis.forEach(function (li, k) { var izq = Math.random() < 0.5; pon(li, (izq ? -1 : 1) * (70 + Math.random() * 40), mazo - li.offsetTop + rnd(10), (izq ? -1 : 1) * (4 + Math.random() * 5), 0.32); });
        sonCorte(); await espera(360); if (id !== S.id) return;
        baraja(lis).forEach(function (li, k) { li.style.zIndex = String(k + 1); pon(li, rnd(6), mazo - li.offsetTop + rnd(3), rnd(3), 0.3); });
        sonMezcla();
        await espera(380); if (id !== S.id) return;
      }
      lista = baraja(lista); S.orden = lista;
      pintaLista();                                        /* el orden nuevo, pero aún todos en el mazo */
      lis = [].slice.call(ol.children);
      lis.forEach(function (li, k) { li.style.position = 'relative'; li.style.zIndex = String(100 - k); pon(li, rnd(6), mazo - li.offsetTop, rnd(3), 0); });
      void ol.offsetHeight; await espera(120);
      res(S.sinAB ? 'Repartiendo el orden…' : 'Repartiendo A / B…');
      for (var i = 0; i < lista.length; i++) {           /* se reparten uno a uno a su sitio y les cae la letra */
        if (id !== S.id) return;
        pon(lis[i], 0, 0, 0, 0.42); sonReparto();
        (function (li, x, k) { setTimeout(function () {
          x.ab = S.sinAB ? null : (k % 2 ? 'B' : 'A'); tono(S.sinAB ? 72 + (k % 5) : (k % 2 ? 76 : 72), 0.16); var ab = li.querySelector('.ab'); if (ab) { ab.className = 'ab ' + x.ab; ab.textContent = x.ab; }
        }, 380); })(lis[i], lista[i], i);
        await espera(300);
      }
      await espera(500); if (id !== S.id) return;
      pintaLista();
      if (S.ensayo) { res('ENSAYO · este sorteo no se guarda (quita ?lmensayo de la dirección para el de verdad)'); b.disabled = false; b.textContent = 'REPETIR SORTEO'; S.raiz.querySelector('.b-est').disabled = false; return; }
      res('Guardando…');
      try {
        var r = await rpc('suite_sorteo_examen_guardar', { p_cuenta_id: S.cuenta, p_trimestre: S.trim, p_materia: S.d.materia, p_grupo: S.grupo, p_orden: lista.map(function (x) { return x.a.id; }) });
        if (!S || id !== S.id) return;
        if (!r || !r.ok) throw new Error((r && r.error) || 'error');
        var nA = Math.ceil(lista.length / 2);
        res(S.sinAB ? lista.length + ' alumnos · orden guardado: así saldrán en la app de corrección ✓' : 'A: ' + nA + ' · B: ' + (lista.length - nA) + ' · guardado: así saldrán en la app de corrección ✓');
      } catch (e) { if (S && id === S.id) res('⚠ No se ha guardado (' + e.message + '). Vuelve a sortear.'); }
      if (!S || id !== S.id) return;
      b.disabled = false; b.textContent = 'REPETIR SORTEO'; S.raiz.querySelector('.b-est').disabled = false;
    })();
  }

  /* ---------- previa / calentamiento → («da la vuelta a la hoja») → 5 minutos → vuelve el orden ----------
     (7-nov-2026, Iago) Entonación GE: «cuando le dé a iniciar estudio… se toquen los grados tonales… la escala, el arpegio,
     incluso por intervalos… la nota más aguda y la más grave… intervalos marcados (cuartas y quintas)… recuerda los matices,
     y después ya se revela la partitura y aparece la cuenta atrás… después de esos 5 minutos se desvanece la melodía, vuelve a
     quedar la estructura vacía y de nuevo aparece el orden del sorteo». */
  function etapas() { var d = S.d; return d.previas || (d.previa ? [{ titulo: d.previa.titulo, sub: 'Escala y arpegio · canta con el piano', svg: d.previa.svg, notas: d.previa.notas }] : []); }
  /* (7-nov-2026, 14:57, Iago) «Que esta secuencia no sea un vídeo, sino interactiva: yo en pantalla le voy a dar a play a cada una
     de las cosas… y un botón siguiente.» Al entrar suenan los acordes; antes de la escala, el arpegio y los intervalos, un 3-2-1
     en azul «para que los alumnos canten»; cada salto, en su compás con doble barra y con su ▶. La última etapa lleva
     «Iniciar estudio» (5:05: los 5 primeros segundos son para que se revele todo). */
  function previaInteractiva(vivo) {
    var velo = S.raiz.querySelector('.velo'), ET = etapas(), i = 0, tok = 0;
    return new Promise(function (fin) {
      function marca(n, on) {
        var g = velo.querySelector('#vf-' + n.id); if (!g) return;
        var c = on ? getComputedStyle(S.raiz).getPropertyValue('--acc') : '#0b1320';
        g.querySelectorAll('path,rect').forEach(function (x) { x.style.fill = on ? c : ''; x.style.stroke = on ? c : ''; });
      }
      async function suena(notas, t, boton) {
        if (boton) boton.classList.add('son');
        for (var r = 0; r < notas.length; r++) {
          if (t !== tok || !vivo()) break;
          var n = notas[r]; marca(n, true);
          if (n.midis) n.midis.forEach(function (m) { tono(m, Math.min(2.2, n.dur + 0.4), 0.12); }); else tono(n.midi, Math.min(1.4, n.dur), 0.3);
          await espera(n.dur * 1000); marca(n, false);
        }
        if (boton) boton.classList.remove('son');
      }
      async function cuenta(t) {
        var c = el('div', 'c321'); velo.appendChild(c);
        for (var k = 3; k > 0; k--) { if (t !== tok || !vivo()) { c.remove(); return false; } c.innerHTML = '<b>' + k + '</b><span>preparados para cantar</span>'; tono(k === 1 ? 84 : 79, 0.14, 0.25); await espera(1000); }
        c.remove(); return t === tok && vivo();
      }
      async function play(grupo) {
        var et = ET[i], t = ++tok, notas = et.notas || []; if (!notas.length) return;
        var btn = grupo == null ? velo.querySelector('.p-play') : velo.querySelector('.gbts [data-g="' + grupo + '"]');
        if (grupo != null) notas = notas.filter(function (n) { return n.g === grupo; }).map(function (n, k, a) { return { id: n.id, midi: n.midi, midis: n.midis, g: n.g, dur: k === a.length - 1 ? Math.max(n.dur, et.durG || 0.7) : (et.durG || n.dur) }; });
        if (et.cuenta && !(await cuenta(t))) return;
        await suena(notas, t, btn);
      }
      function pinta() {
        tok++; var et = ET[i], ult = i === ET.length - 1, gb = '';
        if (et.porGrupo && et.cajas) gb = '<div class="gbts">' + et.cajas.map(function (c, g) { return '<button data-g="' + g + '" style="left:' + ((c.x0 + c.x1) / 2 * 100).toFixed(2) + '%">▶</button>'; }).join('') + '</div>';
        velo.innerHTML = '<h2>' + esc(et.titulo) + '</h2>' + (et.sub ? '<p>' + et.sub + '</p>' : '') +
          (et.svg ? '<div class="pv">' + et.svg + gb + '</div>' : '') +
          '<div class="pbts">' + ((et.notas || []).length ? '<button class="p-play">▶ ' + (et.porGrupo ? 'Todos' : 'Escuchar') + '</button>' : '') +
          '<button class="p-sig' + (ult ? ' fin' : '') + '">' + (ult ? 'Iniciar estudio · ' + Math.floor((S.d.estudio || ESTUDIO) / 60) + ':' + ('0' + (S.d.estudio || ESTUDIO) % 60).slice(-2) : 'Siguiente →') + '</button></div>' +
          '<div class="pasos">' + ET.map(function (x, k) { return '<i class="' + (k <= i ? 'on' : '') + '"></i>'; }).join('') + '</div>';
        velo.classList.add('on');
        var bp = velo.querySelector('.p-play'); if (bp) bp.onclick = function () { play(null); };
        velo.querySelector('.p-sig').onclick = sig;
        velo.querySelectorAll('.gbts button').forEach(function (b) { b.onclick = function () { play(+b.getAttribute('data-g')); }; });
        if (et.auto) setTimeout(function () { if (S && S.pv && ET[i] === et) play(null); }, 600);
      }
      function sig() { if (!vivo()) return; if (i < ET.length - 1) { i++; pinta(); } else { tok++; S.pv = null; velo.classList.remove('on'); velo.innerHTML = ''; fin(true); } }
      function ant() { if (i > 0) { i--; pinta(); } }
      S.pv = { play: function () { play(null); }, sig: sig, ant: ant };
      pinta();
    });
  }
  function estudio() {
    var id = ++S.id, velo = S.raiz.querySelector('.velo'), d = S.d, ET = etapas();
    var vivo = function () { return S && id === S.id; };
    S.raiz.querySelector('.b-sor').disabled = true; S.raiz.querySelector('.b-est').disabled = true; S.raiz.classList.remove('llamando'); S.llamando = -1; pintaLista();
    (async function () {
      if (d.interactiva) { var okPv = await previaInteractiva(vivo); if (!okPv || !vivo()) return; ET = []; }
      for (var e = 0; e < ET.length; e++) {
        var et = ET[e];
        velo.innerHTML = '<h2>' + esc(et.titulo) + '</h2>' + (et.sub ? '<p>' + et.sub + '</p>' : '') + (et.svg ? '<div class="pv">' + et.svg + '</div>' : '');
        velo.classList.add('on'); await espera(e === 0 ? 1500 : 900); if (!vivo()) return;
        var notas = et.notas || [];
        for (var r = 0; r < notas.length; r++) {
          if (!vivo()) return;
          var g = velo.querySelector('#vf-' + notas[r].id); if (g) { g.setAttribute('fill', 'var(--acc)'); g.setAttribute('stroke', 'var(--acc)'); g.style.fill = getComputedStyle(S.raiz).getPropertyValue('--acc'); }
          tono(notas[r].midi, Math.min(1.2, notas[r].dur || 0.55)); await espera((notas[r].dur || 0.55) * 1000);
          if (g) { g.style.fill = ''; g.setAttribute('fill', '#0b1320'); g.setAttribute('stroke', '#0b1320'); }
        }
        await espera((et.espera || 0.5) * 1000); if (!vivo()) return;
      }
      if (d.vuelta !== false && !d.materia.match(/^entonacion$/)) {
        velo.classList.add('on');
        for (var s = VUELTA; s > 0; s--) {
          if (!vivo()) return;
          velo.innerHTML = '<h2>Ya puedes dar la vuelta a la hoja</h2><div class="grande">' + s + '</div><p>Empieza el estudio</p>';
          tono(s === 1 ? 84 : 79, 0.12); await espera(1000);
        }
      }
      velo.classList.remove('on'); velo.innerHTML = '';
      var par = S.raiz.querySelector('.i-par'), mini = S.raiz.querySelector('.rmini');
      if (par) { S.raiz.classList.add('conpartitura'); par.style.opacity = '1'; } else S.raiz.classList.add('estudiando');
      S.finYa = false;
      var reloj = S.raiz.querySelector('.reloj'), b = reloj.querySelector('b'), fin = Date.now() + (d.estudio || ESTUDIO) * 1000;
      while (vivo()) {
        var q = Math.max(0, Math.ceil((fin - Date.now()) / 1000)); if (S.finYa) q = 0;
        var txt = Math.floor(q / 60) + ':' + ('0' + (q % 60)).slice(-2), cl = q === 0 ? ' rojo' : q <= 60 ? ' ambar' : '';
        b.textContent = txt; reloj.className = 'reloj' + cl; mini.textContent = txt; mini.className = 'rmini' + cl;
        if (q === 0) break; await espera(250);
      }
      if (!vivo()) return;
      tono(72, 0.3); setTimeout(function () { tono(67, 0.5); }, 250);
      if (par) { par.style.opacity = '0'; await espera(1800); if (!vivo()) return; S.raiz.classList.remove('conpartitura'); }
      else await espera(1500);
      if (!vivo()) return;
      S.raiz.classList.remove('estudiando'); S.raiz.classList.add('llamando');
      S.llamando = 0; pintaLista(); res('Fin del estudio · llama a ' + (S.orden[0] ? (S.orden[0].a.ver || S.orden[0].a.nombre) : '—'));
      S.raiz.querySelector('.b-sor').disabled = false; S.raiz.querySelector('.b-est').disabled = false;
    })();
  }
  /* «Terminar ya» también con la partitura delante (pulsando el reloj pequeño) */
  document.addEventListener('click', function (e) { if (S && e.target && e.target.classList && e.target.classList.contains('rmini')) S.finYa = true; }, true);
  function siguiente() {
    if (!S || S.llamando < 0) return;
    S.llamando = Math.min(S.orden.length, S.llamando + 1); pintaLista();
    var x = S.orden[S.llamando]; res(x ? 'Ahora: ' + (x.a.ver || x.a.nombre) + (x.ab ? ' · modelo ' + x.ab : '') : 'Ya han pasado todos ✓');
  }

  window.LMExamenRitmo = { abrir: abrir, cerrar: cerrar, version: 4 };
})();
