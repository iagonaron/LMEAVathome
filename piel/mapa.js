/* (19-oct-2026) MI MAPA DE TEORÍA · piel/mapa.js (LMEAVathome). Lo cargan los portales GE y GP al tocar «Ver mi mapa de teoría».
   Iago (17-oct-2026): «un mapa mental… del centro salen las ramas… a simple vista, lo que ha salido mejor y lo que ha salido peor;
   lo que todavía no se ha preguntado, en gris, atenuado, con el título legible… que alguien que no ha visto la explicación lo entienda
   en unos segundos». El diseño que eligió: CIRCUITO, con «Teoría» en el centro (un rectángulo acostado, sin patillas); las pistas
   salen del centro hacia los lados, arriba y abajo, doblando a 90° y sin bolitas en las esquinas; la corriente sale del centro; luces
   lisas, sin destello; sin «×4» (eso le interesa a él, no al alumno); la luz apagada se llama «Sin ejercicios hechos».
   Cada luz es un concepto de las fichas: su color, con la media de las 3 últimas veces que salió (70 % o más, verde; del 50 al 69 %,
   amarillo; menos del 50 %, rojo). Los datos, de suite_mi_mapa_teoria (los pide el portal).
   (19-oct-2026, tarde · 2.ª versión) Iago: «la flecha de arriba a la izquierda no funciona… lo siento como demasiado grande… más
   pequeño, con más continuidad del portal», «el propio mapa teórico debería ser una ventana emergente… que ocupe el centro de la
   pantalla… con el fondo que estuviese antes» y «cuando pone practicar, que aparezca una mini ventanita ahí para escoger si ver
   apuntes… vídeo… o ejercicios libres».
   · VENTANA EMERGENTE en el centro, con el portal detrás, atenuado (como las demás ventanas del portal); cristal oscuro y la letra y
     los tamaños de la campana. Se cierra con la ✕ (cuadrada, arriba a la derecha), con Esc, tocando fuera o con «atrás» (deja su
     propia entrada en el historial, como el visor de las lecciones: «atrás» no saca del portal). La flecha de antes no cerraba
     porque el dibujo de las pistas le quedaba encima; ahora las pistas no reciben clics.
   · En el móvil (o en una ventana estrecha), las cajas en columna y sin pistas.
   · «PRACTICAR» (solo en lo que está en rojo) abre una ventanita con lo que haya para ese concepto, en una pestaña nueva:
     Ver apuntes (Teoría at home / Teoría PRO, ?apuntes=), Vídeo didáctico (intros/…) y Ejercicios libres (?practice=). Los enlaces
     llevan la cuenta en el «#» (#c=…), como los del portal, salvo en el modo profesor («viendo como el alumno»). En los tipo test de
     2.º GP sin apuntes web, dónde están en el Libro. Nunca los portales interactivos: esos se abren con su medalla.
     Las tablas AP, VI y PR son las de la ficha (bloque «APUNTES EN LAS FICHAS» de teoriaathome y teoriapro, y su ?practice=): si
     cambian allí, cambiarlas aquí.
   Uso: LMMapa.abrir({ cargar: function () { return Promise<{ ok, nivel, grupo, conceptos: [{ key, veces, media, media3, ultima }] }> } })
   Para volver a la 1.ª versión: subir piel/mapa.js de la copia «antes» (ver el LEEME del 19-oct-2026). */
(function () {
  'use strict';
  if (window.LMMapa) return;
  var D = document, W = window;
  var VERSION = '2026-10-19c';
  var BASE = { ge: 'https://teoria.ge.lmathome.es/', gp: 'https://teoria.gp.lmathome.es/' };
  /* las cajas de cada nivel: [título, [[concepto, clave, clave…], …]]. Las claves, las de los ejercicios de las fichas
     (GE: teoriaathome, PP_CAT; GP: teoriapro, el catálogo PRO, el repaso y los tipo test del libro) */
  var MAPA = {
    ge: [
      ['Tonalidades', [['Indica la tonalidad', 'ton_arm_tono'], ['Indica la armadura', 'ton_tono_arm'], ['Tonalidades vecinas', 'ton_vecinos']]],
      ['Intervalos', [['Clasificar', 'int_clasif'], ['Construir', 'int_constr'], ['Semitonos', 'semitonos'], ['Invertir (simples)', 'inv_simples'], ['Invertir (compuestos)', 'inv_compuestos']]],
      ['Claves y notas', [['Nombrar la nota', 'cla_a'], ['Colocar la clave', 'cla_b'], ['Enarmonías', 'ena_a'], ['Enarmonía avanzada', 'ena_avanzado']]],
      ['Escalas', [['Escalas mayores', 'esc_mayor'], ['Escalas menores', 'esc_menor'], ['Otras escalas', 'esc_otras'], ['Grados', 'gra_senalar']]],
      ['Acordes', [['Identificar y construir', 'acordes'], ['Inversión · identificar', 'aco_identificar'], ['Inversión · construir', 'aco_construir'], ['Cadencias', 'cadencias_quiz']]],
      ['Compás y signos', [['Analizar el compás', 'com_clasif'], ['Abreviaciones', 'abrev_quiz'], ['Notas de adorno', 'adorno_quiz'], ['Términos', 'terminos']]]
    ],
    gp: [
      ['Modos y escalas', [['Modos', 'modos'], ['Escalas mayores', 'escala_mayor'], ['Escalas menores', 'escala_menor'], ['Otras escalas', 'escala_otras']]],
      ['Tonalidades', [['Indica la tonalidad', 'ton_nombre'], ['Indica la armadura', 'ton_armadura'], ['Tonalidades vecinas', 'ton_vecinos'], ['Enarmonías', 'enarmoniapro']]],
      ['Intervalos y acordes', [['Identificar intervalos', 'intervalos_id'], ['Construir intervalos', 'intervalos_build'], ['Inversión de intervalos', 'inversion_int_simples', 'inversion_int_compuestos'], ['Acordes', 'acordes_id', 'acordes_build', 'acordespro_id', 'acordespro_build'], ['Inversión de acordes', 'inversion_aco_identifica', 'inversion_aco_construir']]],
      ['Armonía y transporte', [['Cadencias', 'cadencias'], ['Modulación', 'modulacion', 'test_8_1', 'test_8_2', 'test_8_3'], ['Transporte', 'transporte_escrito', 'transporte_mental', 'test_9_1', 'test_9_2'], ['Las diferencias', 'transporte_resumen']]],
      ['Compases y ritmo', [['Compases · elegir', 'comp_elegir'], ['Compases · rellenar', 'comp_rellenar'], ['Compases · replicar', 'comp_replicar'], ['Compases poco habituales', 'test_1_2'], ['GVE en varios pulsos', 'test_5_2']]],
      ['Acústica', [['Índice acústico', 'indice'], ['Serie armónica', 'seriearmonica', 'test_2_3'], ['Duración e intensidad', 'test_2_1'], ['Altura y timbre', 'test_2_2']]],
      ['Siglo XX', [['Atonalidad', 'test_3_1'], ['Dodecafonismo', 'test_3_2', 'dode_construir', 'dode_completa', 'dode_identifica'], ['Música estocástica', 'test_3_3'], ['Música concreta', 'test_4_2'], ['Nuevas grafías', 'test_4_3']]],
      ['Grabación y estilos', [['Fonógrafo', 'test_1_1'], ['Magnetófono', 'test_4_1'], ['El blues', 'test_5_1', 'blues'], ['Géneros afrolatinos', 'ex_afro']]]
    ]
  };

  /* ---- lo que hay para repasar cada tipo de ejercicio (lo mismo que ofrece la ficha) ----
     AP · apuntes: clave → 'Nombre|tema,tema…|pestaña' (el primer tema, la pestaña que se abre; «pestaña», cómo se llama en los
          apuntes, lo que se lee en la ventanita; si no lo hay, el nombre). Los de la ficha (MAPA de «APUNTES EN LAS FICHAS»).
     VI · vídeo didáctico: clave → 'carpeta|Título|duración' (el más cercano al ejercicio: PRIMERO, o el primero de su tema).
     PR · ejercicios libres: las claves con ?practice= (GE: PRACTICE_MAP; GP: FP_PRACTICE_VIEW).
     LIBRO · 2.º GP, tipo test sin apuntes web: unidad → páginas del Libro 2.º GP (UNIDAD_PAGS de teoriapro). */
  var TON = ',relativos,tonalidad,armadura,vecinas', ESC = ',esc-menores,esc-mayores,esc-otras', INVG = ',inv-simples,inv-comp,inv-acordes';
  function quita(lista, t) { return lista.split(',').filter(function (x) { return x && x !== t; }).join(','); }
  function prim(t, lista) { return t + ',' + quita(lista, t); }
  var AP = {
    ge: {
      int_clasif: 'Intervalos|intervalos,int-comp', int_constr: 'Intervalos|intervalos,int-comp',
      inv_simples: 'Inversión de intervalos|inv-simples,inv-comp|Inversión de intervalos simples', inv_compuestos: 'Inversión de intervalos|inv-comp,inv-simples|Inversión de intervalos compuestos',
      com_clasif: 'Compases|compases',
      ton_arm_tono: 'Tonalidades|' + prim('tonalidad', TON) + '|Indica la tonalidad', ton_tono_arm: 'Tonalidades|' + prim('armadura', TON) + '|Indica la armadura', ton_vecinos: 'Tonalidades|' + prim('vecinas', TON) + '|Tonalidades vecinas',
      esc_menor: 'Escalas|' + prim('esc-menores', ESC) + '|Escalas menores', esc_mayor: 'Escalas|' + prim('esc-mayores', ESC) + '|Escalas mayores', esc_otras: 'Escalas|' + prim('esc-otras', ESC) + '|Otras escalas',
      gra_senalar: 'Grados|grados', semitonos: 'Semitonos|semitonos|Semitono cromático y diatónico', acordes: 'Acordes|acordes',
      aco_identificar: 'Inversión de acordes|inv-acordes', aco_construir: 'Inversión de acordes|inv-acordes',
      ena_a: 'Enarmonías|enarmonias', ena_avanzado: 'Enarmonías|enarmonias', cla_a: 'Claves|claves', cla_b: 'Claves|claves',
      terminos: 'Términos|terminos', adorno_quiz: 'Notas de adorno|adorno', abrev_quiz: 'Abreviaciones|abrev', cadencias_quiz: 'Cadencias|cadencias'
    },
    gp: {
      modos: 'Modos|gp-modos', indice: 'Índice acústico|gp-indice',
      comp_elegir: 'Compases extraños|gp-compases', comp_rellenar: 'Compases extraños|gp-compases', comp_replicar: 'Compases extraños|gp-compases', test_1_2: 'Compases extraños|gp-compases',
      seriearmonica: 'Serie armónica|gp-serie', test_2_3: 'Serie armónica|gp-serie',
      dode_construir: 'Dodecafonismo|gp-serialismo', dode_completa: 'Dodecafonismo|gp-serialismo', dode_identifica: 'Dodecafonismo|gp-serialismo', test_3_2: 'Dodecafonismo|gp-serialismo',
      acordespro_id: 'Acordes avanzado|gp-cifrado|Acordes avanzados', acordespro_build: 'Acordes avanzado|gp-cifrado|Acordes avanzados', blues: 'Acordes avanzado|gp-cifrado|Acordes avanzados (cifrado americano)',
      modulacion: 'Modulación|gp-modulacion', test_8_1: 'Modulación|gp-modulacion', test_8_2: 'Modulación|gp-modulacion', test_8_3: 'Modulación|gp-modulacion',
      transporte_escrito: 'Transporte|gp-transporte', transporte_mental: 'Transporte|gp-transporte', transporte_resumen: 'Transporte|gp-transporte',
      test_9_1: 'Transporte|gp-transporte', test_9_2: 'Transporte|gp-transporte',
      cadencias: 'Cadencias|gp-cadencias',
      escala_mayor: 'Escalas · repaso|' + prim('esc-mayores', ESC) + '|Escalas mayores', escala_menor: 'Escalas · repaso|' + prim('esc-menores', ESC) + '|Escalas menores',
      escala_otras: 'Escalas · repaso|' + prim('esc-otras', ESC) + '|Otras escalas',
      intervalos_id: 'Intervalos · repaso|intervalos,int-comp|Intervalos', intervalos_build: 'Intervalos · repaso|intervalos,int-comp|Intervalos',
      acordes_id: 'Acordes · repaso|acordes|Acordes', acordes_build: 'Acordes · repaso|acordes|Acordes',
      ton_nombre: 'Tonalidades · repaso|' + prim('tonalidad', TON) + '|Indica la tonalidad', ton_armadura: 'Tonalidades · repaso|' + prim('armadura', TON) + '|Indica la armadura',
      ton_vecinos: 'Tonalidades · repaso|' + prim('vecinas', TON) + '|Tonalidades vecinas',
      inversion_int_simples: 'Inversión · repaso|' + prim('inv-simples', INVG) + '|Inversión de intervalos simples',
      inversion_int_compuestos: 'Inversión · repaso|' + prim('inv-comp', INVG) + '|Inversión de intervalos compuestos',
      inversion_aco_identifica: 'Inversión · repaso|' + prim('inv-acordes', INVG) + '|Inversión de acordes', inversion_aco_construir: 'Inversión · repaso|' + prim('inv-acordes', INVG) + '|Inversión de acordes',
      enarmoniapro: 'Enarmonías · repaso|enarmonias|Enarmonías'
    }
  };
  var V_INT = 'intervalos|Intervalos|5:21', V_TON1 = 'indica-la-tonalidad|Indica la tonalidad|4:24', V_TON2 = 'indica-la-armadura|Indica la armadura|2:42',
      V_TON3 = 'tonalidades-vecinas|Tonalidades vecinas|1:32', V_INV1 = 'inversion-intervalos|Inversión de intervalos|1:32',
      V_INV2 = 'inversion-compuestos|Inversión de compuestos|1:54', V_EME = 'escalas-menores|Escalas menores|3:22', V_EMA = 'escalas-mayores|Escalas mayores|3:00',
      V_EOT = 'otras-escalas|Otras escalas|3:31', V_ACO = 'acordes|Acordes|2:53', V_IAC = 'inversion-acordes|Inversión de acordes|3:02', V_ENA = 'enarmonias|Enarmonías|2:32';
  var VI = {
    ge: {
      int_clasif: V_INT, int_constr: V_INT, inv_simples: V_INV1, inv_compuestos: V_INV2, com_clasif: 'compases|Compases|2:23',
      ton_arm_tono: V_TON1, ton_tono_arm: V_TON2, ton_vecinos: V_TON3, esc_menor: V_EME, esc_mayor: V_EMA, esc_otras: V_EOT,
      gra_senalar: 'grados|Grados|2:56', semitonos: 'semitonos|Semitono cromático y diatónico|2:10', acordes: V_ACO,
      aco_identificar: V_IAC, aco_construir: V_IAC, ena_a: V_ENA, ena_avanzado: V_ENA, cla_a: 'claves|Claves|4:01', cla_b: 'claves|Claves|4:01',
      cadencias_quiz: 'cadencias|Cadencias|3:02', terminos: 'terminos|Términos|3:40'
    },
    gp: {
      comp_elegir: 'compases-extranos|Compases extraños|4:48', comp_rellenar: 'compases-extranos|Compases extraños|4:48',
      comp_replicar: 'compases-extranos|Compases extraños|4:48', test_1_2: 'compases-extranos|Compases extraños|4:48',
      intervalos_id: V_INT, intervalos_build: V_INT, inversion_int_simples: V_INV1, inversion_int_compuestos: V_INV2,
      escala_mayor: V_EMA, escala_menor: V_EME, escala_otras: V_EOT, ton_nombre: V_TON1, ton_armadura: V_TON2, ton_vecinos: V_TON3,
      acordes_id: V_ACO, acordes_build: V_ACO, inversion_aco_identifica: V_IAC, inversion_aco_construir: V_IAC, enarmoniapro: V_ENA,
      indice: 'indice-acustico|Índice acústico|2:12', modos: 'modos|Modos|3:51',
      seriearmonica: 'serie-armonica|Serie armónica|2:48', test_2_3: 'serie-armonica|Serie armónica|2:48',
      dode_construir: 'dodecafonismo|Dodecafonismo|4:17', dode_completa: 'dodecafonismo|Dodecafonismo|4:17',
      dode_identifica: 'dodecafonismo|Dodecafonismo|4:17', test_3_2: 'dodecafonismo|Dodecafonismo|4:17',
      acordespro_id: 'acordes-avanzados|Acordes avanzados|4:36', acordespro_build: 'acordes-avanzados|Acordes avanzados|4:36',
      cadencias: 'cadencias-pro|Cadencias|4:07',
      modulacion: 'modulacion|Modulación diatónica|5:28', test_8_1: 'modulacion|Modulación diatónica|5:28',
      test_8_2: 'modulacion|Modulación diatónica|5:28', test_8_3: 'modulacion|Modulación diatónica|5:28',
      transporte_escrito: 'transporte|Transporte|7:28', transporte_mental: 'transporte|Transporte|7:28', transporte_resumen: 'transporte|Transporte|7:28',
      test_9_1: 'transporte|Transporte|7:28', test_9_2: 'transporte|Transporte|7:28'
    }
  };
  function conjunto(txt) { var o = {}; txt.split(/\s+/).forEach(function (k) { if (k) o[k] = 1; }); return o; }
  var PR = {
    ge: conjunto('int_clasif int_constr ton_arm_tono ton_tono_arm ton_vecinos cla_a cla_b esc_menor esc_mayor esc_otras gra_senalar acordes com_clasif ' +
                 'ena_a semitonos inv_simples inv_compuestos aco_identificar aco_construir ena_avanzado adorno_quiz abrev_quiz cadencias_quiz terminos'),
    gp: conjunto('modos escala_mayor escala_menor escala_otras intervalos_id intervalos_build acordes_id acordes_build acordespro_id acordespro_build ' +
                 'cadencias indice ton_nombre ton_armadura ton_vecinos comp_elegir comp_rellenar comp_replicar seriearmonica dode_construir dode_completa ' +
                 'dode_identifica enarmoniapro modulacion inversion_int_simples inversion_int_compuestos inversion_aco_identifica inversion_aco_construir ' +
                 'transporte_escrito transporte_mental transporte_resumen')
  };
  var LIBRO = { 1: [7, 9], 2: [10, 13], 3: [14, 17], 4: [18, 21], 5: [22, 30], 8: [37, 40], 9: [41, 45] };
  function libroDe(k) { var m = /^test_(\d+)_\d+$/.exec(String(k || '')); return (m && LIBRO[+m[1]]) ? { u: +m[1], p: LIBRO[+m[1]] } : null; }

  var VERDE = '#4ade80', AMARILLO = '#facc15', ROJO = '#ff7a8a', ROSA = '#ec4899';
  var COL = { v: VERDE, a: AMARILLO, r: ROJO };
  var F = 'var(--lm-fuente,"Helvetica Neue",Helvetica,Arial,sans-serif)';
  var ICO = {
    mapa: '<rect x="8.5" y="8.5" width="7" height="7" rx="1.6"/><path d="M12 8.5V4.5M15.5 12h3V6.5M12 15.5v4M8.5 12h-3v5.5"/><circle cx="12" cy="3.3" r="1.3"/><circle cx="18.5" cy="5.2" r="1.3"/><circle cx="12" cy="20.7" r="1.3"/><circle cx="5.5" cy="18.8" r="1.3"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    abajo: '<path d="M7 10l5 5 5-5"/>',
    libro: '<path d="M3 5.5C5.5 4.3 8.5 4.3 12 6c3.5-1.7 6.5-1.7 9-.5v13c-2.5-1.2-5.5-1.2-9 .5-3.5-1.7-6.5-1.7-9-.5z"/><path d="M12 6v13.5"/>',
    play: '<path d="M8 5.2v13.6L19 12z" fill="currentColor"/>',
    lapiz: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    fuera: '<path d="M8 16L16 8M10 8h6v6"/>'
  };
  function svgI(cls, d) { return '<svg class="' + cls + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + d + '</svg>'; }

  function el(tag, cls, padre, txt) { var e = D.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; if (padre) padre.appendChild(e); return e; }
  function sv(tag, at, padre) { var e = D.createElementNS('http://www.w3.org/2000/svg', tag); for (var k in at) e.setAttribute(k, at[k]); if (padre) padre.appendChild(e); return e; }
  function grupoTxt(g, nivel) {
    var m = /^\s*(\d+)\s*(gp)?\s*([a-z])\s*$/i.exec(String(g || ''));
    if (!m) return nivel === 'gp' ? 'Grado profesional' : 'Grado elemental';
    return m[1] + '.º ' + (m[2] ? 'GP ' : '') + m[3].toUpperCase();
  }

  var C = '#lmm ';
  var CSS = '' +
    '#lmm{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;box-sizing:border-box;' +
      'padding:max(16px,env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) max(16px,env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px));' +
      'background:rgba(5,8,20,.42);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);font-family:' + F + ';color:#fff;' +
      '-webkit-font-smoothing:antialiased;text-align:left;opacity:0;transition:opacity .16s ease}' +
    '#lmm.on{opacity:1}' +
    '#lmm.lmm-visor{padding-top:46px}' +
    C + '*{box-sizing:border-box;margin:0;padding:0}' +
    C + '.lmm-v{position:relative;display:flex;flex-direction:column;width:min(1040px,100%);max-height:100%;overflow:hidden;' +
      'background:rgba(11,19,32,.95);border:1px solid rgba(255,255,255,.12);' +
      'border-radius:16px;box-shadow:0 24px 80px rgba(0,0,0,.5);transform:translateY(8px) scale(.985);transition:transform .18s ease}' +
    '#lmm.on .lmm-v{transform:none}' +
    C + '.lmm-cab{flex:none;display:flex;align-items:flex-start;gap:12px;padding:16px 16px 10px 20px}' +
    C + '.lmm-ico{flex:none;width:30px;height:30px;margin-top:1px;border-radius:8px;background:' + ROSA + ';display:flex;align-items:center;justify-content:center}' +
    C + '.lmm-ico svg{width:20px;height:20px;fill:none;stroke:#fff;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}' +
    C + '.lmm-tt{flex:1;min-width:0}' +
    C + '.lmm-tt h2{font-family:inherit;font-size:18px;line-height:1.2;font-weight:800;letter-spacing:0;color:#fff}' +
    C + '.lmm-tt p{font-size:12.5px;line-height:1.4;font-weight:400;color:rgba(255,255,255,.58);margin-top:3px}' +
    C + '.lmm-x{flex:none;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:10px;' +
      'border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.04);color:#fff;cursor:pointer;-webkit-tap-highlight-color:transparent;' +
      'font:inherit;box-shadow:none;transition:border-color .15s ease,background .15s ease}' +
    C + '.lmm-x:hover{border-color:' + ROSA + ';background:rgba(236,72,153,.12)}' +
    C + '.lmm-x:focus-visible{outline:2px solid ' + ROSA + ';outline-offset:2px}' +
    C + '.lmm-x svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;pointer-events:none}' +
    C + '.lmm-ley{flex:none;display:flex;flex-wrap:wrap;gap:6px 16px;padding:0 20px 12px 62px;font-size:12px;line-height:1.2;color:rgba(255,255,255,.72)}' +
    C + '.lmm-ley span{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}' +
    C + '.lmm-ley .lmm-nota{margin-left:auto;color:rgba(255,255,255,.46)}' +
    C + '.lmm-luz{flex:none;display:inline-block;width:9px;height:9px;border-radius:50%}' +
    C + '.lmm-luz.off{background:transparent;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.32)}' +
    C + '.lmm-cuerpo{flex:1 1 auto;min-height:0;overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:4px 20px 16px}' +
    /* el circuito: cajas a los dos lados y «Teoría» en el centro (las filas de cada lado, a la misma altura) */
    C + '.lmm-mapa{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 124px minmax(0,1fr);column-gap:30px;row-gap:10px}' +
    C + '.lmm-mapa.estrecho{grid-template-columns:minmax(0,1fr) 100px minmax(0,1fr);column-gap:22px}' +
    C + '.lmm-mapa.estrecho .lmm-centro{font-size:15px}' +
    C + 'svg.lmm-pistas{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:0}' +
    C + '.lmm-pista{fill:none;stroke:' + ROSA + ';stroke-opacity:.5;stroke-width:1.5}' +
    C + '.lmm-pista.off{stroke:#fff;stroke-opacity:.16;stroke-dasharray:3 4}' +
    C + '.lmm-chispa{fill:none;stroke:#ffd6ea;stroke-width:2.2;stroke-linecap:round}' +
    C + '.lmm-centro{grid-column:2;align-self:center;position:relative;z-index:1;height:46px;display:flex;align-items:center;justify-content:center;' +
      'border:1.5px solid ' + ROSA + ';border-radius:12px;background:#24122f;box-shadow:0 0 20px rgba(236,72,153,.2);' +
      'font-size:16px;font-weight:800;letter-spacing:.01em;color:#fff}' +
    C + '.lmm-caja{position:relative;z-index:1;min-width:0;display:flex;flex-direction:column;gap:2px;padding:9px 10px 8px 14px;' +
      'border:1px solid rgba(255,255,255,.13);border-radius:14px;background:#121a2b}' +
    C + '.lmm-caja.vacia{border-style:dashed;background:#0f1626}' +
    C + '.lmm-caja.fuerte{border-color:rgba(74,222,128,.7)}' +
    C + '.lmm-caja.repasar{border-color:rgba(255,122,138,.75)}' +
    C + '.lmm-cc{display:flex;align-items:center;gap:8px;min-height:22px;margin-bottom:1px}' +
    C + '.lmm-ct{flex:1;min-width:0;font-size:11px;line-height:1.2;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#f472b6;' +
      'white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    C + '.lmm-caja.vacia .lmm-ct{color:rgba(255,255,255,.42)}' +
    C + '.lmm-placa{flex:none;font-size:10px;line-height:1;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:4px 6px;border-radius:6px;border:1px solid currentColor}' +
    C + '.lmm-placa.f{color:' + VERDE + '}' + C + '.lmm-placa.r{color:' + ROJO + '}' +
    C + '.lmm-fila{display:flex;align-items:center;gap:9px;min-height:22px;font-size:13.5px;line-height:1.25;color:#fff}' +
    C + '.lmm-fila.lmm-roja{margin:0 -6px;padding:0 6px;border-radius:7px;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    C + '.lmm-fila.lmm-roja:hover{background:rgba(255,122,138,.07)}' +
    C + '.lmm-fila.off{color:rgba(255,255,255,.4)}' +
    C + '.lmm-fila>span{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    C + '.lmm-prac{flex:none;display:inline-flex;align-items:center;gap:3px;height:22px;padding:0 5px 0 9px;margin:0;border-radius:7px;' +
      'border:1px solid rgba(255,122,138,.8);background:rgba(255,122,138,.08);color:#ffa3ae;font-family:inherit;font-size:12px;font-weight:700;' +
      'line-height:1;letter-spacing:0;cursor:pointer;box-shadow:none;-webkit-tap-highlight-color:transparent;transition:background .15s ease}' +
    C + '.lmm-prac:hover,' + C + '.lmm-prac[aria-expanded="true"]{background:rgba(255,122,138,.2);color:#fff}' +
    C + '.lmm-prac:focus-visible{outline:2px solid ' + ROJO + ';outline-offset:2px}' +
    C + '.lmm-prac svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;pointer-events:none;transition:transform .15s ease}' +
    C + '.lmm-prac[aria-expanded="true"] svg{transform:rotate(180deg)}' +
    C + '.lmm-msj{padding:56px 12px 64px;text-align:center;font-size:14px;line-height:1.5;color:rgba(255,255,255,.7)}' +
    C + '.lmm-msj button{display:inline-flex;align-items:center;height:36px;margin-top:14px;padding:0 16px;border-radius:10px;border:1px solid ' + ROSA + ';' +
      'background:rgba(236,72,153,.12);color:#fff;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer}' +
    /* en columna (móvil o ventana estrecha): sin «Teoría» ni pistas */
    C + '.lmm-mapa.lista{grid-template-columns:minmax(0,1fr);row-gap:10px}' +
    C + '.lmm-mapa.lista.dos{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:10px}' +
    C + '.lmm-mapa.lista .lmm-centro,' + C + '.lmm-mapa.lista svg.lmm-pistas{display:none}' +
    C + '.lmm-mapa.lista .lmm-caja{grid-column:auto!important;grid-row:auto!important}' +
    C + '.lmm-mapa.lista .lmm-fila{min-height:30px}' +
    '@media (max-height:720px) and (min-width:561px){' + C + '.lmm-fila{min-height:20px;font-size:13px}' + C + '.lmm-cc{min-height:20px}' +
      C + '.lmm-mapa{row-gap:8px}' + C + '.lmm-cab{padding-top:12px;padding-bottom:6px}' + C + '.lmm-ley{padding-bottom:9px}' + C + '.lmm-prac{height:20px}}' +
    '@media (max-width:560px){' + C + '.lmm-ley .lmm-nota{margin-left:0;flex-basis:100%}' + C + '.lmm-cab{padding:14px 12px 8px 16px}' + C + '.lmm-ley{padding:0 16px 10px;gap:6px 12px}' + C + '.lmm-cuerpo{padding:2px 12px 14px}' +
      '#lmm{padding:max(10px,env(safe-area-inset-top,0px)) max(10px,env(safe-area-inset-right,0px)) max(10px,env(safe-area-inset-bottom,0px)) max(10px,env(safe-area-inset-left,0px))}' +
      '#lmm.lmm-visor{padding-top:42px}}' +
    /* la ventanita de «Practicar» */
    C + '.lmm-menu{position:fixed;z-index:5;width:292px;max-width:calc(100vw - 24px);padding:6px;border-radius:12px;border:1px solid rgba(255,255,255,.18);' +
      'background:#111a2c;box-shadow:0 16px 44px rgba(0,0,0,.6);opacity:0;transform:translateY(-4px);transition:opacity .12s ease,transform .12s ease}' +
    C + '.lmm-menu.on{opacity:1;transform:none}' +
    C + '.lmm-mt{padding:7px 10px 8px;font-size:12px;line-height:1.35;color:rgba(255,255,255,.58)}' +
    C + '.lmm-mt b{display:block;font-size:13.5px;line-height:1.3;font-weight:800;color:#fff;margin-bottom:1px}' +
    C + '.lmm-op{display:flex;align-items:center;gap:10px;width:100%;min-height:46px;padding:6px 8px;border-radius:8px;text-decoration:none!important;' +
      'color:#fff!important;background:transparent;border:0;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    C + '.lmm-op:hover,' + C + '.lmm-op:focus-visible{background:rgba(255,255,255,.08);outline:none}' +
    C + '.lmm-oi{flex:none;width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:rgba(236,72,153,.16);color:#f472b6}' +
    C + '.lmm-oi svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}' +
    C + '.lmm-ot{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}' +
    C + '.lmm-ot b{font-size:13.5px;line-height:1.2;font-weight:700;color:#fff}' +
    C + '.lmm-ot small{font-size:11.5px;line-height:1.25;color:rgba(255,255,255,.56);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    C + '.lmm-oa{flex:none;width:15px;height:15px;fill:none;stroke:rgba(255,255,255,.45);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
    C + '.lmm-libro{display:flex;align-items:center;gap:10px;min-height:46px;padding:6px 8px}' +
    C + '.lmm-libro .lmm-oi{background:rgba(255,255,255,.07);color:rgba(255,255,255,.75)}' +
    
    '@media (prefers-reduced-motion:reduce){#lmm,' + C + '.lmm-v,' + C + '.lmm-menu{transition:none}' + C + '.lmm-chispa{display:none}}';
  var QUIETO = false; try { QUIETO = W.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  /* la luz de un concepto: la media de las 3 últimas veces de sus claves (si tiene varias, juntas, cada una con sus veces, hasta 3) */
  function luzDe(claves, por) {
    var s = 0, n = 0;
    claves.forEach(function (k) { var c = por[k]; if (!c || c.media3 == null) return; var v = Math.min(3, +c.veces || 1); s += (+c.media3) * v; n += v; });
    if (!n) return null;
    var m = s / n;
    return { m: m, col: m >= 0.7 ? 'v' : (m >= 0.5 ? 'a' : 'r') };
  }

  /* la cuenta, para los enlaces (#c=…), como hace el portal con Teoría at home. En el modo profesor («viendo como el
     alumno») no se pasa: lo que se abra no debe quedar a nombre del alumno */
  function cuentaDe(nivel) {
    if (W.__VISOR) return null;
    var s = null;
    try { s = JSON.parse(localStorage.getItem(nivel === 'gp' ? 'lmpro_session' : 'lmeav_session') || 'null'); } catch (e) {}
    s = s || W.__LM_SES || null;
    return (s && s.id && s.estado === 'validado' && /^[0-9a-f-]{36}$/i.test(String(s.id))) ? String(s.id) : null;
  }
  /* lo que se puede abrir para un concepto: de sus claves, primero la que peor ha salido */
  function recursos(f, nivel, por) {
    var ks = f.claves.slice().sort(function (a, b) {
      var A = por[a], B = por[b], ma = (A && A.media3 != null) ? +A.media3 : 9, mb = (B && B.media3 != null) ? +B.media3 : 9;
      return ma - mb;
    });
    var base = BASE[nivel], c = cuentaDe(nivel), h = c ? '#c=' + c : '', out = { ops: [], libro: null };
    var kA = ks.filter(function (k) { return AP[nivel][k] || (nivel === 'gp' && libroDe(k)); })[0];
    if (kA && AP[nivel][kA]) {
      var a = AP[nivel][kA].split('|');
      out.ops.push({ ico: ICO.libro, t: 'Ver apuntes', s: a[2] || a[0], u: base + '?apuntes=' + encodeURIComponent(a[1]) + '&nombre=' + encodeURIComponent(a[0]) + h });
    } else if (kA) out.libro = libroDe(kA);
    var kV = ks.filter(function (k) { return VI[nivel][k]; })[0];
    if (kV) { var v = VI[nivel][kV].split('|'); out.ops.push({ ico: ICO.play, t: 'Vídeo didáctico', s: v[1] + ' · ' + v[2], u: base + 'intros/' + v[0] + '/index.html' }); }
    var kP = ks.filter(function (k) { return PR[nivel][k]; })[0];
    if (kP) out.ops.push({ ico: ICO.lapiz, t: 'Ejercicios libres', s: 'De este tipo, todos los que quieras', u: base + '?practice=' + encodeURIComponent(kP) + h });
    return out;
  }

  /* ---------------- la ventana ---------------- */
  var ABIERTO = null, ABIERTO_OV = '', TOK = '', MENU = null, RO = null, POR = {}, NIVEL = 'ge';

  function pinta(r, datos) {
    var nivel = datos.nivel === 'gp' ? 'gp' : 'ge', por = {};
    (datos.conceptos || []).forEach(function (c) { if (c && c.key) por[c.key] = c; });
    POR = por; NIVEL = nivel;
    var sub = r.querySelector('.lmm-tt p');
    if (sub) sub.textContent = grupoTxt(datos.grupo, nivel) + ' · cada luz es un concepto de tus fichas';
    var cuerpo = r.querySelector('.lmm-cuerpo'); cuerpo.innerHTML = '';
    var mapa = el('div', 'lmm-mapa', cuerpo);
    sv('svg', { 'class': 'lmm-pistas', 'aria-hidden': 'true', focusable: 'false' }, mapa);
    var defs = MAPA[nivel], n = defs.length, izq = Math.ceil(n / 2);
    var ce = el('div', 'lmm-centro', mapa, 'Teoría'); ce.style.gridRow = '1 / span ' + izq;
    var cajas = defs.map(function (d) {
      var filas = d[1].map(function (f) { return { t: f[0], claves: f.slice(1), luz: luzDe(f.slice(1), por) }; });
      var hechas = filas.filter(function (f) { return f.luz; });
      var media = hechas.length ? hechas.reduce(function (s, f) { return s + f.luz.m; }, 0) / hechas.length : null;
      return { t: d[0], filas: filas, hechos: hechas.length, media: media, rojas: hechas.filter(function (f) { return f.luz.col === 'r'; }).length };
    });
    /* «★ Tu fuerte»: la caja con mejor media (al menos dos conceptos hechos, sin rojos, 85 % o más). «A repasar»: la de peor media
       entre las que tienen algo en rojo */
    var fuerte = null, repasar = null;
    cajas.forEach(function (c) {
      if (c.hechos >= 2 && !c.rojas && c.media >= 0.85 && (!fuerte || c.media > fuerte.media)) fuerte = c;
      if (c.rojas && (!repasar || c.media < repasar.media)) repasar = c;
    });
    cajas.forEach(function (c, i) {
      var b = el('div', 'lmm-caja' + (c.hechos ? '' : ' vacia') + (c === fuerte ? ' fuerte' : '') + (c === repasar ? ' repasar' : ''), mapa);
      var lado = i < izq ? 'i' : 'd';
      b.setAttribute('data-lado', lado); b.setAttribute('data-on', c.hechos ? '1' : '0');
      b.style.gridColumn = lado === 'i' ? '1' : '3'; b.style.gridRow = String(lado === 'i' ? i + 1 : i - izq + 1);
      var cc = el('div', 'lmm-cc', b);
      el('div', 'lmm-ct', cc, c.t);
      if (c === fuerte) el('span', 'lmm-placa f', cc, '★ Tu fuerte');
      else if (c === repasar) el('span', 'lmm-placa r', cc, 'A repasar');
      c.filas.forEach(function (f) {
        var fl = el('div', 'lmm-fila' + (f.luz ? '' : ' off'), b), lz = el('i', 'lmm-luz' + (f.luz ? '' : ' off'), fl);
        if (f.luz) { lz.style.background = COL[f.luz.col]; }
        lz.setAttribute('aria-hidden', 'true');
        var tx = el('span', '', fl, f.t);
        tx.title = f.t + (f.luz ? (f.luz.col === 'v' ? ' · lo dominas' : f.luz.col === 'a' ? ' · en camino' : ' · a repasar') : ' · sin ejercicios hechos');
        if (f.luz && f.luz.col === 'r') {
          var rc = recursos(f, nivel, por);
          if (rc.ops.length || rc.libro) {
            var p = el('button', 'lmm-prac', fl); p.type = 'button';
            p.innerHTML = '<span>Practicar</span>' + svgI('', ICO.abajo);
            p.setAttribute('aria-haspopup', 'menu'); p.setAttribute('aria-expanded', 'false');
            p.setAttribute('aria-label', 'Practicar ' + f.t);
            p.addEventListener('click', function (ev) { ev.preventDefault(); ev.stopPropagation(); abreMenu(p, f, nivel); });
            fl.classList.add('lmm-roja');   /* toda la fila abre la ventanita (más fácil con el dedo) */
            fl.addEventListener('click', function (ev) { if (ev.target.closest && ev.target.closest('.lmm-prac')) return; ev.stopPropagation(); abreMenu(p, f, nivel); });
          }
        }
      });
    });
    modo(); dibujaLuego();
  }

  /* circuito o columna, según el ancho que hay */
  function modo() {
    if (!ABIERTO) return;
    var m = ABIERTO.querySelector('.lmm-mapa'); if (!m) return;
    var w = m.clientWidth || (ABIERTO.querySelector('.lmm-cuerpo') || ABIERTO).clientWidth;
    var lista = w < 640;
    m.classList.toggle('lista', lista);
    m.classList.toggle('dos', lista && w >= 520);
    m.classList.toggle('estrecho', !lista && w < 860);
  }
  var RAF = 0;
  function dibujaLuego() {
    if (RAF) return;
    var f = W.requestAnimationFrame || function (cb) { return setTimeout(cb, 16); };
    RAF = f(function () { RAF = 0; modo(); dibuja(); });
  }
  /* las pistas: del centro a cada caja; las de arriba y abajo salen del borde de arriba o de abajo de «Teoría» y doblan a 90°
     hasta la altura del título de la caja (la más cercana sale más hacia fuera, así no se cruzan); la que queda a su altura, recta */
  function dibuja() {
    if (!ABIERTO) return;
    var m = ABIERTO.querySelector('.lmm-mapa'), svg = m && m.querySelector('svg.lmm-pistas');
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    if (m.classList.contains('lista')) return;
    var R = m.getBoundingClientRect(), q = m.querySelector('.lmm-centro').getBoundingClientRect();
    if (!R.width || !q.width) return;
    svg.setAttribute('viewBox', '0 0 ' + Math.round(R.width) + ' ' + Math.round(R.height));
    var c = { x: q.left - R.left, y: q.top - R.top, w: q.width, h: q.height }, cx = c.x + c.w / 2, ym = c.y + c.h / 2;
    var cajas = [].slice.call(m.querySelectorAll('.lmm-caja'));
    ['i', 'd'].forEach(function (lado) {
      var L = cajas.filter(function (b) { return b.getAttribute('data-lado') === lado; }).map(function (b) {
        var r = b.getBoundingClientRect(); return { b: b, x: r.left - R.left, y: r.top - R.top, w: r.width, h: r.height };
      });
      var medio = L.filter(function (o) { return o.y + 12 <= ym && o.y + o.h - 12 >= ym; });
      var arriba = L.filter(function (o) { return medio.indexOf(o) < 0 && o.y + o.h / 2 < ym; }).sort(function (a, b) { return b.y - a.y; });
      var abajo = L.filter(function (o) { return medio.indexOf(o) < 0 && o.y + o.h / 2 >= ym; }).sort(function (a, b) { return a.y - b.y; });
      var sg = lado === 'i' ? -1 : 1, borde = lado === 'i' ? c.x : c.x + c.w;
      function puerto(k) { return cx + sg * Math.max(10, c.w / 2 - 14 - k * 18); }
      function entra(o) { return lado === 'i' ? o.x + o.w : o.x; }
      function alto(o) { return o.y + o.h / 2; }   /* a media altura de la caja (las filas de los dos lados miden lo mismo) */
      arriba.forEach(function (o, k) { traza(svg, 'M' + r1(puerto(k)) + ' ' + r1(c.y) + ' V' + r1(alto(o)) + ' H' + r1(entra(o)), o.b); });
      abajo.forEach(function (o, k) { traza(svg, 'M' + r1(puerto(k)) + ' ' + r1(c.y + c.h) + ' V' + r1(alto(o)) + ' H' + r1(entra(o)), o.b); });
      medio.forEach(function (o) { traza(svg, 'M' + r1(borde) + ' ' + r1(ym) + ' H' + r1(entra(o)), o.b); });
    });
  }
  function r1(x) { return Math.round(x * 10) / 10; }
  function traza(svg, d, caja) {
    var on = caja.getAttribute('data-on') === '1', p = sv('path', { d: d, 'class': 'lmm-pista' + (on ? '' : ' off') }, svg);
    if (!on || QUIETO) return;
    var l = 0; try { l = p.getTotalLength(); } catch (e) {}
    if (!l) return;
    /* la corriente: un trazo corto que sale del centro y recorre la pista hasta la caja, una y otra vez */
    var ch = sv('path', { d: d, 'class': 'lmm-chispa' }, svg);
    ch.style.strokeDasharray = '10 ' + Math.round(l + 40);
    try {
      ch.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -Math.round(l + 24) }],
                 { duration: Math.round(1100 + l * 4), iterations: Infinity, delay: -Math.round(Math.random() * 2000), easing: 'linear' });
    } catch (e) { ch.parentNode.removeChild(ch); }
  }

  /* ---------------- la ventanita de «Practicar» ---------------- */
  function cierraMenu(foco) {
    if (!MENU) return;
    var m = MENU; MENU = null;
    try { m.el.parentNode.removeChild(m.el); } catch (e) {}
    try { m.btn.setAttribute('aria-expanded', 'false'); if (foco) m.btn.focus(); } catch (e) {}
  }
  function abreMenu(btn, f, nivel) {
    if (MENU && MENU.btn === btn) { cierraMenu(true); return; }
    cierraMenu(false);
    if (!ABIERTO) return;
    var rc = recursos(f, nivel, POR);
    var m = el('div', 'lmm-menu', ABIERTO); m.setAttribute('role', 'menu'); m.setAttribute('aria-label', 'Repasar: ' + f.t);
    var mt = el('div', 'lmm-mt', m); el('b', '', mt, f.t); mt.appendChild(D.createTextNode(rc.ops.length ? '¿Cómo quieres repasarlo?' : 'Dónde repasarlo:'));
    rc.ops.forEach(function (o) {
      var a = el('a', 'lmm-op', m); a.href = o.u; a.target = '_blank'; a.rel = 'noopener'; a.setAttribute('role', 'menuitem');
      a.innerHTML = '<span class="lmm-oi">' + svgI('', o.ico) + '</span><span class="lmm-ot"><b></b><small></small></span>' + svgI('lmm-oa', ICO.fuera);
      a.querySelector('b').textContent = o.t; a.querySelector('small').textContent = o.s;
      a.setAttribute('aria-label', o.t + ': ' + o.s + ' (se abre en una pestaña nueva)');
      a.addEventListener('click', function () { setTimeout(function () { cierraMenu(false); }, 0); });
    });
    if (rc.libro) {   /* no es un enlace: dice dónde está */
      var lb = el('div', 'lmm-libro', m);
      lb.innerHTML = '<span class="lmm-oi">' + svgI('', ICO.libro) + '</span><span class="lmm-ot"><b></b><small></small></span>';
      lb.querySelector('b').textContent = 'Apuntes en el Libro de 2.º GP';
      lb.querySelector('small').textContent = 'Unidad ' + rc.libro.u + ' · págs. ' + rc.libro.p[0] + '–' + rc.libro.p[1];
    }
    MENU = { el: m, btn: btn };
    btn.setAttribute('aria-expanded', 'true');
    colocaMenu();
    var go = W.requestAnimationFrame || function (cb) { return setTimeout(cb, 16); };
    go(function () { if (MENU && MENU.el === m) m.classList.add('on'); });
    var pri = m.querySelector('.lmm-op'); if (pri) { try { pri.focus({ preventScroll: true }); } catch (e) { try { pri.focus(); } catch (e2) {} } }
  }
  function colocaMenu() {
    if (!MENU) return;
    var m = MENU.el, b = MENU.btn.getBoundingClientRect(), vw = W.innerWidth, vh = W.innerHeight;
    var mw = m.offsetWidth, mh = m.offsetHeight;
    var left = Math.min(Math.max(12, b.right - mw), vw - mw - 12);
    var top = b.bottom + 6;
    if (top + mh > vh - 12) top = Math.max(12, b.top - 6 - mh);
    m.style.left = Math.round(Math.max(12, left)) + 'px'; m.style.top = Math.round(top) + 'px';
  }
  function teclaMenu(ev) {
    if (!MENU) return false;
    var ops = [].slice.call(MENU.el.querySelectorAll('.lmm-op'));
    if (ev.key === 'Escape' || ev.key === 'Esc') { cierraMenu(true); return true; }
    if ((ev.key === 'ArrowDown' || ev.key === 'ArrowUp') && ops.length) {
      var i = ops.indexOf(D.activeElement), j = ev.key === 'ArrowDown' ? (i + 1) % ops.length : (i <= 0 ? ops.length - 1 : i - 1);
      try { ops[j].focus(); } catch (e) {}
      return true;
    }
    if (ev.key === 'Tab' && MENU.el.contains(D.activeElement)) {
      var a = ops.indexOf(D.activeElement);
      if ((!ev.shiftKey && a === ops.length - 1) || (ev.shiftKey && a === 0)) { cierraMenu(true); return true; }
    }
    return false;
  }

  /* ---------------- abrir y cerrar ---------------- */
  function alAtras(ev) { if (ev && ev.state && ev.state.lmMapa === TOK) return; cerrar(true); }
  function alResize() { cierraMenu(false); dibujaLuego(); }
  function cerrar(porAtras) {
    if (!ABIERTO) return;
    cierraMenu(false);
    var r = ABIERTO; ABIERTO = null;
    try { r.parentNode.removeChild(r); } catch (e) {}
    D.documentElement.style.overflow = ABIERTO_OV || '';
    W.removeEventListener('resize', alResize); D.removeEventListener('keydown', tecla, true); W.removeEventListener('popstate', alAtras);
    if (RO) { try { RO.disconnect(); } catch (e) {} RO = null; }
    if (porAtras !== true) { try { if (history.state && history.state.lmMapa === TOK) history.back(); } catch (e) {} }
    var vuelve = r.__desde; if (vuelve && vuelve.focus && D.body.contains(vuelve)) { try { vuelve.focus({ preventScroll: true }); } catch (e) {} }
  }
  function tecla(ev) {
    if (!ABIERTO) return;
    if (teclaMenu(ev)) { ev.preventDefault(); ev.stopPropagation(); return; }
    if (ev.key === 'Escape' || ev.key === 'Esc') { ev.preventDefault(); ev.stopPropagation(); cerrar(); return; }
    if (ev.key === 'Tab') {   /* el foco no se sale de la ventana */
      var fs = [].slice.call(ABIERTO.querySelectorAll('button,a[href]')).filter(function (x) { return x.offsetParent !== null; });
      if (!fs.length) return;
      var i = fs.indexOf(D.activeElement);
      if (ev.shiftKey && (i <= 0)) { ev.preventDefault(); fs[fs.length - 1].focus(); }
      else if (!ev.shiftKey && (i === fs.length - 1 || i < 0)) { ev.preventDefault(); fs[0].focus(); }
    }
  }
  function abrir(op) {
    op = op || {};
    if (!D.getElementById('lmm-css')) { var st = el('style', '', D.head || D.documentElement); st.id = 'lmm-css'; st.textContent = CSS; }
    cerrar();
    var desde = D.activeElement;
    var r = el('div', '', D.body); r.id = 'lmm'; r.__desde = desde;
    if (D.getElementById('visor-banner')) r.classList.add('lmm-visor');
    var v = el('div', 'lmm-v', r); v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true'); v.setAttribute('aria-labelledby', 'lmm-titulo');
    var cab = el('div', 'lmm-cab', v);
    var ic = el('span', 'lmm-ico', cab); ic.innerHTML = svgI('', ICO.mapa);
    var tt = el('div', 'lmm-tt', cab), h = el('h2', '', tt, 'Mi mapa de teoría'); h.id = 'lmm-titulo';
    el('p', '', tt, 'Cada luz es un concepto de tus fichas');
    var x = el('button', 'lmm-x', cab); x.type = 'button'; x.setAttribute('aria-label', 'Cerrar'); x.title = 'Cerrar'; x.innerHTML = svgI('', ICO.x);
    x.addEventListener('click', function (ev) { ev.preventDefault(); ev.stopPropagation(); cerrar(); });
    var ley = el('div', 'lmm-ley', v);
    [['Lo dominas', VERDE], ['En camino', AMARILLO], ['A repasar', ROJO], ['Sin ejercicios hechos', null]].forEach(function (z) {
      var s = el('span', '', ley), i = el('i', 'lmm-luz' + (z[1] ? '' : ' off'), s); if (z[1]) i.style.background = z[1]; s.appendChild(D.createTextNode(z[0]));
    });
    el('span', 'lmm-nota', ley, 'Cambian con cada ficha que entregas');
    var cuerpo = el('div', 'lmm-cuerpo', v);
    var m = el('div', 'lmm-msj', cuerpo, 'Cargando tu mapa…');
    /* tocar fuera de la ventana la cierra; con la ventanita abierta, el primer toque solo cierra la ventanita */
    r.addEventListener('click', function (ev) {
      if (MENU && !MENU.el.contains(ev.target)) { var enBoton = MENU.btn.contains(ev.target); cierraMenu(false); if (enBoton) return; if (ev.target === r) return; }
      if (ev.target === r) cerrar();
    });
    cuerpo.addEventListener('scroll', function () { cierraMenu(false); }, { passive: true });
    ABIERTO = r; ABIERTO_OV = D.documentElement.style.overflow; D.documentElement.style.overflow = 'hidden';
    TOK = 'lmm' + Date.now() + Math.random().toString(36).slice(2, 7);
    try { history.pushState({ lmMapa: TOK }, ''); } catch (e) {}
    W.addEventListener('popstate', alAtras); W.addEventListener('resize', alResize); D.addEventListener('keydown', tecla, true);
    if (W.ResizeObserver) { try { RO = new W.ResizeObserver(function () { dibujaLuego(); }); RO.observe(cuerpo); } catch (e) { RO = null; } }
    var go = W.requestAnimationFrame || function (cb) { return setTimeout(cb, 16); };
    go(function () { if (ABIERTO === r) r.classList.add('on'); });
    try { x.focus({ preventScroll: true }); } catch (e) {}
    var carga = function () {
      Promise.resolve().then(function () { return typeof op.cargar === 'function' ? op.cargar() : op.datos; }).then(function (d) {
        if (ABIERTO !== r) return;
        if (!d || d.ok === false || !Array.isArray(d.conceptos)) throw new Error((d && d.error) || 'sin datos');
        pinta(r, d);
        try { if (D.fonts && D.fonts.ready) D.fonts.ready.then(function () { if (ABIERTO === r) dibujaLuego(); }); } catch (e) {}
      }).catch(function () {
        if (ABIERTO !== r) return;
        cuerpo.innerHTML = ''; m = el('div', 'lmm-msj', cuerpo, 'No se ha podido cargar tu mapa. Vuelve a intentarlo en un momento.');
        var b = el('button', '', el('div', '', m), 'Reintentar'); b.type = 'button';
        b.addEventListener('click', function () { cuerpo.innerHTML = ''; m = el('div', 'lmm-msj', cuerpo, 'Cargando tu mapa…'); carga(); });
      });
    };
    carga();
    return { cerrar: cerrar };
  }
  W.LMMapa = { abrir: abrir, cerrar: function () { cerrar(); }, version: VERSION, _mapa: MAPA, _recursos: function (claves, nivel, por) { return recursos({ t: '', claves: claves }, nivel === 'gp' ? 'gp' : 'ge', por || {}); } };
})();
