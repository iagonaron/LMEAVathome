/* LM at home · EXAMEN DE RITMO (GE) Y RITMO ENTONADO (GP) · esquema + sorteo A/B + cuenta atrás
   (7-nov-2026, Iago) «La pantalla con el esquema, con el sorteo, que haya una cuenta atrás de 5 minutos que yo active…
   en ritmo entonado también la previa de la escala y el arpegio… cuando queden 5 segundos: ya puedes dar la vuelta a la
   hoja, empieza el estudio.» El sorteo se guarda en suite_sorteo_examen y lo leen las apps de corrección.
   Lo abre piel/apps/portal.js (sección 21, icono del metrónomo, solo Tester/Protester) con el material ya descifrado:
     window.LMExamenRitmo.abrir({ datos, grupos:['4A','4B'], trim, sb, anon, cuenta })   (el primero, el de la clase de ahora)
   datos = { grado:'GE'|'GP', materia:'ritmo'|'ritmo_entonado', titulo, propuestas:[{id,nombre,svg}], previa:{svg,titulo,notas:[{id,midi}]}|null }
   Pantalla del aula (Chrome 94, pocos fotogramas): nada de movimientos suaves; los cambios, de golpe. */
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
      '#lm-exr{position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147482995;background:#fff;color:#0b1320;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;display:flex;flex-direction:column}' +
      '#lm-exr .cab{display:flex;align-items:center;justify-content:space-between;padding:12px 22px 8px;border-bottom:1.5px solid rgba(21,128,61,.45)}' +
      '#lm-exr .lm{font-weight:900;font-size:22px;line-height:1;min-width:180px}#lm-exr .lm i{font-family:Georgia,serif;font-weight:400;color:#8a93b3;font-size:16px;margin-left:5px}' +
      '#lm-exr .lm small{display:block;font-size:8.5px;letter-spacing:.22em;color:#b8902a;font-weight:800;margin-top:4px}' +
      '#lm-exr .tit{text-align:center}#lm-exr .tit b{font-weight:900;font-size:30px}#lm-exr .tit b span{font-weight:300}' +
      '#lm-exr .tit div{font-size:11px;letter-spacing:.28em;color:#15803d;font-weight:800;margin-top:4px}' +
      '#lm-exr .der{min-width:180px;display:flex;justify-content:flex-end;gap:6px}' +
      '#lm-exr button{font:700 13px "Helvetica Neue",Arial,sans-serif;border:1px solid #d1d5db;background:#fff;color:#0b1320;border-radius:9px;padding:8px 12px;cursor:pointer}' +
      '#lm-exr button.on{background:#15803d;border-color:#15803d;color:#fff}#lm-exr button:disabled{opacity:.45;cursor:default}' +
      '#lm-exr .x{width:40px;height:38px;padding:0;font-size:18px}' +
      '#lm-exr .cuerpo{flex:1;min-height:0;display:flex;gap:22px;padding:14px 22px 16px}' +
      '#lm-exr .esq{flex:1;min-width:0;display:flex;flex-direction:column;position:relative}' +
      '#lm-exr .esq .props{display:flex;gap:6px;margin-bottom:6px}' +
      '#lm-exr .lienzo{flex:1;min-height:0;display:flex;justify-content:center;align-items:flex-start}' +
      '#lm-exr .lienzo svg{max-width:100%;max-height:100%;width:auto;height:100%}' +
      '#lm-exr .pan{width:360px;display:flex;flex-direction:column;background:#f4f7f5;border-radius:16px;padding:14px}' +
      '#lm-exr .pan h3{margin:0 0 8px;font-size:11px;letter-spacing:.2em;color:#6b7280;font-weight:800}' +
      '#lm-exr ol{list-style:none;margin:0;padding:0;flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column}' +
      '#lm-exr li{display:flex;align-items:center;justify-content:space-between;flex:1 1 0;min-height:22px;max-height:38px;margin-bottom:4px;padding:0 10px;background:#fff;border-radius:9px;border:1px solid #e5e7eb;font-size:16px;font-weight:500}' +
      '#lm-exr li .n{display:inline-block;width:24px;color:#6b7280;font-size:12px}' +
      '#lm-exr li .ab{width:34px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:15px;visibility:hidden}' +
      '#lm-exr li .ab.A{visibility:visible;background:#15803d;color:#fff}#lm-exr li .ab.B{visibility:visible;background:#fff;color:#15803d;box-shadow:inset 0 0 0 2px #15803d}' +
      '#lm-exr li.flash{background:#dcfce7}#lm-exr li.ya{border-color:#15803d;box-shadow:0 0 0 2px #15803d;font-weight:800}#lm-exr li.hecho{opacity:.45}' +
      '#lm-exr .bts{display:flex;gap:8px;margin-top:10px}#lm-exr .bts button{flex:1;padding:12px 8px;font-size:14px}' +
      '#lm-exr .go{background:#15803d;border-color:#15803d;color:#fff;font-weight:800;letter-spacing:.06em}' +
      '#lm-exr .res{font-size:12px;color:#6b7280;margin-top:8px;text-align:center;min-height:16px}' +
      '#lm-exr .reloj{display:none;flex:1;flex-direction:column;align-items:center;justify-content:center;gap:10px}' +
      '#lm-exr .reloj b{font-size:96px;font-weight:900;font-variant-numeric:tabular-nums;letter-spacing:.02em}' +
      '#lm-exr .reloj.ambar b{color:#d97706}#lm-exr .reloj.rojo b{color:#dc2626}#lm-exr .reloj span{font-size:13px;color:#6b7280;letter-spacing:.18em;font-weight:800}' +
      '#lm-exr .lista{display:flex;flex-direction:column;flex:1;min-height:0}#lm-exr.estudiando .lista{display:none}#lm-exr.estudiando .reloj{display:flex}' +
      '#lm-exr .velo{display:none;position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(11,19,32,.93);color:#fff;border-radius:14px;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:20px;text-align:center}' +
      '#lm-exr .velo.on{display:flex}#lm-exr .velo h2{margin:0;font-size:30px;font-weight:900}#lm-exr .velo p{margin:0;font-size:18px;opacity:.85}' +
      '#lm-exr .velo .pv{width:100%;background:#fff;border-radius:12px;padding:8px}#lm-exr .velo .pv svg{width:100%;height:auto;display:block}' +
      '#lm-exr .velo .grande{font-size:120px;font-weight:900;line-height:1}' +
      '#lm-exr .grp{display:flex;gap:6px;margin-bottom:10px}#lm-exr .grp button{flex:1}' +
      '#lm-exr .sig{display:none}#lm-exr.llamando .sig{display:flex}';
    document.head.appendChild(st);
  }

  /* ---------- sonido (la previa) ---------- */
  var AC = null;
  function tono(midi, dur) {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.resume) AC.resume();
      var t = AC.currentTime, o = AC.createOscillator(), o2 = AC.createOscillator(), g = AC.createGain();
      o.type = 'triangle'; o2.type = 'sine'; o.frequency.value = o2.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.3, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.95);
      o.connect(g); o2.connect(g); g.connect(AC.destination); o.start(t); o2.start(t); o.stop(t + dur); o2.stop(t + dur);
    } catch (e) {}
  }
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
    S = { d: o.datos, grupos: o.grupos || [o.grupo], grupo: (o.grupos || [o.grupo])[0], trim: o.trim || '1T', sb: o.sb, anon: o.anon, cuenta: o.cuenta, prop: 0, alumnos: [], orden: null, fase: 'sorteo', id: 0, llamando: -1 };
    var d = S.d, gp = d.grado === 'GP';
    var raiz = el('div'); raiz.id = 'lm-exr'; raiz.setAttribute('role', 'dialog'); raiz.setAttribute('aria-modal', 'true');
    raiz.innerHTML =
      '<div class="cab"><div class="lm">LM<i>at home</i><small>' + (gp ? 'GRADO PROFESIONAL' : 'GRADO ELEMENTAL') + '</small></div>' +
      '<div class="tit"><b>' + (gp ? 'RITMO <span>ENTONADO</span>' : 'RITMO') + '</b><div>EXAMEN · ' + ({ '1T': '1.ER', '2T': '2.º', '3T': '3.ER' }[S.trim] || S.trim) + ' TRIMESTRE · <span class="g"></span></div></div>' +
      '<div class="der"><button class="x" title="Cerrar (Esc)">✕</button></div></div>' +
      '<div class="cuerpo"><div class="esq"><div class="props"></div><div class="lienzo"></div>' +
      '<div class="velo"></div></div>' +
      '<div class="pan"><div class="lista"><div class="grp"></div><h3>SORTEO A / B</h3><ol></ol>' +
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
  function teclas(e) { if (e.key === 'Escape' && S) { e.preventDefault(); e.stopPropagation(); cerrar(); } }
  function res(t) { if (S) S.raiz.querySelector('.res').textContent = t; }
  function pintaProps() {
    var c = S.raiz.querySelector('.props'), ps = S.d.propuestas;
    if (ps.length < 2) { c.style.display = 'none'; return; }
    c.innerHTML = ''; ps.forEach(function (p, i) { var b = el('button', i === S.prop ? 'on' : '', esc(p.nombre)); b.onclick = function () { S.prop = i; pintaProps(); pintaEsquema(); }; c.appendChild(b); });
  }
  function pintaEsquema() { S.raiz.querySelector('.lienzo').innerHTML = S.d.propuestas[S.prop].svg; }
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
      for (var k = 0; k < 12; k++) {                     /* barajado a saltos (sin deslizar: pantalla del aula) */
        if (id !== S.id) return;
        lista = baraja(lista); S.orden = lista;
        var fl = lista.map(function () { return Math.random() < 0.35; }); pintaLista(fl);
        await espera(170 + k * 22);
      }
      pintaLista(); res('Repartiendo A / B…'); await espera(400);
      for (var i = 0; i < lista.length; i++) {           /* A, B, A, B… uno a uno */
        if (id !== S.id) return;
        lista[i].ab = i % 2 ? 'B' : 'A'; pintaLista(lista.map(function (_, j) { return j === i; })); tono(i % 2 ? 76 : 72, 0.18);
        await espera(260);
      }
      pintaLista(); res('Guardando…');
      try {
        var r = await rpc('suite_sorteo_examen_guardar', { p_cuenta_id: S.cuenta, p_trimestre: S.trim, p_materia: S.d.materia, p_grupo: S.grupo, p_orden: lista.map(function (x) { return x.a.id; }) });
        if (!S || id !== S.id) return;
        if (!r || !r.ok) throw new Error((r && r.error) || 'error');
        var nA = Math.ceil(lista.length / 2);
        res('A: ' + nA + ' · B: ' + (lista.length - nA) + ' · guardado: así saldrán en la app de corrección ✓');
      } catch (e) { if (S && id === S.id) res('⚠ No se ha guardado (' + e.message + '). Vuelve a sortear.'); }
      if (!S || id !== S.id) return;
      b.disabled = false; b.textContent = 'REPETIR SORTEO'; S.raiz.querySelector('.b-est').disabled = false;
    })();
  }

  /* ---------- previa (GP) → «da la vuelta a la hoja» → 5 minutos ---------- */
  function estudio() {
    var id = ++S.id, velo = S.raiz.querySelector('.velo'), pv = S.d.previa;
    S.raiz.querySelector('.b-sor').disabled = true; S.raiz.querySelector('.b-est').disabled = true;
    (async function () {
      if (pv) {
        velo.innerHTML = '<h2>' + esc(pv.titulo) + '</h2><p>Escala y arpegio · canta con el piano</p><div class="pv">' + pv.svg + '</div>';
        velo.classList.add('on'); await espera(1500);
        var notas = pv.notas;
        for (var r = 0; r < notas.length; r++) {
          if (!S || id !== S.id) return;
          var g = velo.querySelector('#vf-' + notas[r].id); if (g) { g.setAttribute('fill', '#15803d'); g.setAttribute('stroke', '#15803d'); }
          tono(notas[r].midi, notas[r].dur || 0.55); await espera((notas[r].dur || 0.55) * 1000);
          if (g) { g.setAttribute('fill', '#0b1320'); g.setAttribute('stroke', '#0b1320'); }
        }
        await espera(600);
      }
      if (!S || id !== S.id) return;
      velo.classList.add('on');
      for (var s = VUELTA; s > 0; s--) {
        if (!S || id !== S.id) return;
        velo.innerHTML = '<h2>Ya puedes dar la vuelta a la hoja</h2><div class="grande">' + s + '</div><p>Empieza el estudio</p>';
        tono(s === 1 ? 84 : 79, 0.12); await espera(1000);
      }
      velo.classList.remove('on'); velo.innerHTML = '';
      S.raiz.classList.add('estudiando'); S.finYa = false;
      var reloj = S.raiz.querySelector('.reloj'), b = reloj.querySelector('b'), fin = Date.now() + ESTUDIO * 1000;
      while (S && id === S.id) {
        var q = Math.max(0, Math.ceil((fin - Date.now()) / 1000)); if (S.finYa) q = 0;
        b.textContent = Math.floor(q / 60) + ':' + ('0' + (q % 60)).slice(-2);
        reloj.className = 'reloj' + (q === 0 ? ' rojo' : q <= 60 ? ' ambar' : '');
        if (q === 0) break; await espera(250);
      }
      if (!S || id !== S.id) return;
      tono(72, 0.3); setTimeout(function () { tono(67, 0.5); }, 250);
      await espera(1500);
      if (!S || id !== S.id) return;
      S.raiz.classList.remove('estudiando'); S.raiz.classList.add('llamando');
      S.llamando = 0; pintaLista(); res('Fin del estudio · llama a ' + (S.orden[0] ? (S.orden[0].a.ver || S.orden[0].a.nombre) : '—'));
      S.raiz.querySelector('.b-sor').disabled = false; S.raiz.querySelector('.b-est').disabled = false;
    })();
  }
  function siguiente() {
    if (!S || S.llamando < 0) return;
    S.llamando = Math.min(S.orden.length, S.llamando + 1); pintaLista();
    var x = S.orden[S.llamando]; res(x ? 'Ahora: ' + (x.a.ver || x.a.nombre) + (x.ab ? ' · modelo ' + x.ab : '') : 'Ya han pasado todos ✓');
  }

  window.LMExamenRitmo = { abrir: abrir, cerrar: cerrar, version: 1 };
})();
