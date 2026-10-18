/* =====================================================================
   (18-oct-2026, Iago: «en clase ya ni toco el iPad… lo que sí abro es el portal tester o el protester… ahí es donde decida…
   que sea lo más certero posible en base a las fichas de ese grupo») EL ¡OJO! DE LA PREVIA, CALCULADO EN EL AULA
   La escaleta del aula (solo con la cuenta Tester / Protester) pide UNA VEZ POR CLASE, desde 8 min antes, las entregas de la
   ÚLTIMA FICHA CERRADA del grupo (escaleta_previa_fichas: sin nombres; por ejercicio, su % y lo contestado) y aquí se elige el
   ¡Ojo!, con el mismo motor que la previa y el Diario: en la clase 1, el error más repetido (2 alumnos o más); en la clase 2, el
   segundo (de otro tipo); si no hay, lo más flojo; si nada, null (la previa pone uno de repaso). Dentro del ejercicio, el
   APARTADO que más se falló (de las fichas en papel solo se sabe el % de cada ejercicio: entonces, el apartado más difícil).
   Uso: PreviaElige.elige(res, 'c1' | 'c2', semana, grupo) → { m, p, motivo, ficha } o null · PreviaElige.ultimo (para mirar).
   Generado con /home/claude/previa/diario/gen-diario.py desde elige.src.js, lo compartido de diario-previa.src.js (paramsDe,
   fallados…) y el motor de ojos.js (eligeOjos…): no editar a mano el elige.js publicado.
   ===================================================================== */
(function () {
  'use strict';
  if (window.PreviaElige) return;
  var VERSION = '2026-10-18c';
  /* ---------- el motor de la elección, copiado de la previa (generado) ---------- */
  var MOLDES = {"escala": {"claves": ["esc_menor", "esc_mayor", "escala_menor", "escala_mayor"], "nivel": "ambos", "ejemplos": [{"t": "Sol4", "tipo": "armonica", "ficha": "Ficha 4"}, {"t": "Lab4", "tipo": "tipo2", "ficha": "Ficha 4"}, {"t": "Re4", "tipo": "melodica", "ficha": "Ficha 5"}, {"t": "Do4", "tipo": "tipo3", "ficha": "Ficha 3"}]}, "modo": {"claves": ["modos"], "nivel": "GP", "ejemplos": [{"t": "Si3", "modo": "frigio", "ficha": "Ficha 4"}, {"t": "Fa4", "modo": "dorico", "ficha": "Ficha 4"}, {"t": "Re4", "modo": "locrio", "ficha": "Ficha 5"}, {"t": "Mib4", "modo": "lidio", "ficha": "Ficha 5"}, {"t": "La3", "modo": "mixolidio", "ficha": "Ficha 6"}]}, "armaduraTono": {"claves": ["ton_arm_tono", "ton_nombre"], "nivel": "ambos", "ejemplos": [{"q": 3, "ficha": "Ficha 4"}, {"q": -4, "ficha": "Ficha 4"}, {"q": 6, "ficha": "Ficha 5"}, {"q": -1, "ficha": "Ficha 5"}]}, "tonoArmadura": {"claves": ["ton_tono_arm", "ton_armadura"], "nivel": "ambos", "ejemplos": [{"t": "Fa#", "menor": true, "ficha": "Ficha 4"}, {"t": "Mib", "menor": false, "ficha": "Ficha 4"}, {"t": "Mi", "menor": false, "ficha": "Ficha 5"}, {"t": "Re", "menor": true, "ficha": "Ficha 5"}]}, "indice": {"claves": ["indice"], "nivel": "GP", "ejemplos": [{"n": "Si3", "clave": "sol", "ficha": "Ficha 4"}, {"n": "La2", "clave": "fa", "ficha": "Ficha 4"}, {"n": "Re5", "clave": "sol", "ficha": "Ficha 5"}, {"n": "Mi3", "clave": "fa", "ficha": "Ficha 5"}]}, "intClasif": {"claves": ["int_clasif", "intervalos_id"], "nivel": "ambos", "ejemplos": [{"a": "Mi4", "b": "Sol#4", "ficha": "Ficha 3"}, {"a": "Fa4", "b": "Si4", "ficha": "Ficha 3"}, {"a": "Re4", "b": "Si4", "ficha": "Ficha 4"}, {"a": "Re4", "b": "Lab4", "ficha": "Ficha 4"}, {"a": "Do4", "b": "Sol#4", "ficha": "Ficha 4"}, {"a": "Mi4", "b": "Re5", "ficha": "Ficha 5"}]}, "intConstr": {"claves": ["int_constr", "intervalos_build"], "nivel": "ambos", "ejemplos": [{"a": "Re4", "num": 3, "cal": "M", "ficha": "Ficha 3"}, {"a": "Mi4", "num": 6, "cal": "m", "ficha": "Ficha 3"}, {"a": "Sol4", "num": 7, "cal": "m", "ficha": "Ficha 4"}, {"a": "Re4", "num": 5, "cal": "A", "ficha": "Ficha 4"}]}, "invSimple": {"claves": ["inv_simples", "inversion_int_simples"], "nivel": "ambos", "ejemplos": [{"a": "Re4", "b": "Fa4", "ficha": "Ficha 3"}, {"a": "Re4", "b": "Si4", "ficha": "Ficha 3"}, {"a": "Fa4", "b": "Si4", "ficha": "Ficha 4"}, {"a": "Mi4", "b": "Do5", "ficha": "Ficha 4"}]}, "compas": {"claves": ["com_clasif"], "nivel": "GE", "ejemplos": [{"num": 2, "den": 4, "ficha": "Ficha 4"}, {"num": 6, "den": 8, "ficha": "Ficha 4"}, {"num": 2, "den": 2, "ficha": "Ficha 5"}, {"num": 9, "den": 8, "ficha": "Ficha 5"}]}, "acorde": {"claves": ["acordes", "acordes_id", "acordes_build"], "nivel": "ambos", "ejemplos": [{"r": "Re4", "tipo": "Pm", "ficha": "Ficha 5"}, {"r": "Si4", "tipo": "Dis", "ficha": "Ficha 5"}, {"r": "Mib4", "tipo": "Aum", "ficha": "Ficha 6"}, {"r": "Re4", "tipo": "Dis", "modo": "construir", "ficha": "Ficha 6"}, {"r": "Mib4", "tipo": "PM", "modo": "construir", "ficha": "Ficha 6"}]}, "invAcorde": {"claves": ["aco_identificar", "aco_construir", "inversion_aco_identifica", "inversion_aco_construir"], "nivel": "ambos", "ejemplos": [{"r": "Re4", "tipo": "PM", "estado": 1, "ficha": "Ficha 5"}, {"r": "Sol4", "tipo": "Pm", "estado": 2, "ficha": "Ficha 5"}, {"r": "Sol4", "tipo": "7", "estado": 3, "ficha": "Ficha 6"}, {"r": "Sol4", "tipo": "Pm", "estado": 2, "modo": "construir", "ficha": "Ficha 5"}, {"r": "Fa4", "tipo": "PM", "estado": 1, "modo": "construir", "ficha": "Ficha 6"}]}, "acordePro": {"claves": ["acordespro_id", "acordespro_build"], "nivel": "GP", "ejemplos": [{"r": "Re4", "tipo": "m7b5", "ficha": "Ficha 6"}, {"r": "Fa4", "tipo": "maj7", "ficha": "Ficha 6"}, {"r": "Sol4", "tipo": "sus4", "ficha": "Ficha 7"}, {"r": "Re4", "tipo": "m7", "modo": "construir", "ficha": "Ficha 7"}, {"r": "Sol4", "tipo": "d7", "modo": "construir", "ficha": "Ficha 7"}, {"r": "Mi4", "tipo": "m7b5", "modo": "construir", "ficha": "Ficha 7"}]}, "cadencia": {"claves": ["cadencias_quiz", "cadencias"], "nivel": "ambos", "ejemplos": [{"t": "Sol", "menor": false, "grados": ["I", "IV", "V", "I"], "tipo": "autentica", "ficha": "Ficha 5"}, {"t": "La", "menor": true, "grados": ["i", "iv", "V", "VI"], "tipo": "rota", "ficha": "Ficha 5"}, {"t": "Re", "menor": false, "grados": ["I", "vi", "IV", "V"], "tipo": "semi", "ficha": "Ficha 6"}, {"t": "Fa", "menor": false, "grados": ["I", "I⁶", "IV", "ii⁶", "V", "V⁷", "I⁶"], "tipo": "autentica", "perfecta": false, "ficha": "Ficha 5"}, {"t": "Mi", "menor": true, "grados": ["i", "V⁶", "i", "V⁷", "i", "iv", "i"], "tipo": "plagal", "perfecta": true, "ficha": "Ficha 4"}]}, "claves": {"claves": ["cla_a", "cla_b"], "nivel": "GE", "ejemplos": [{"clave": "do3", "n": "Mi4", "ficha": "Ficha 3"}, {"clave": "do4", "n": "La3", "ficha": "Ficha 3"}, {"clave": "fa", "n": "Do3", "ficha": "Ficha 4"}]}, "semitono": {"claves": ["semitonos"], "nivel": "GE", "ejemplos": [{"a": "Fa4", "b": "Fa#4", "ficha": "Ficha 3"}, {"a": "Mi4", "b": "Fa4", "ficha": "Ficha 3"}, {"a": "Do4", "b": "Reb4", "ficha": "Ficha 4"}]}, "enarmonia": {"claves": ["ena_a", "ena_avanzado", "enarmoniapro"], "nivel": "ambos", "ejemplos": [{"n": "Fa#4", "ficha": "Ficha 3"}, {"n": "Re#4", "ficha": "Ficha 3"}, {"n": "Reb4", "ficha": "Ficha 3"}, {"n": "Sol#4", "ficha": "Ficha 3"}, {"iv": ["Mi4", "Sol#4"], "tipo": "parcial", "ficha": "Ficha 5"}, {"iv": ["Mi4", "Si4"], "tipo": "total", "ficha": "Ficha 5"}, {"t": "Fa#", "menor": false, "ficha": "Ficha 5"}, {"t": "Lab", "menor": true, "ficha": "Ficha 5"}]}, "grados": {"claves": ["gra_senalar"], "nivel": "GE", "ejemplos": [{"t": "Fa", "menor": false, "g": 4, "ficha": "Ficha 3"}, {"t": "Re", "menor": false, "g": 7, "ficha": "Ficha 3"}, {"t": "Mi", "menor": true, "g": 2, "ficha": "Ficha 4"}, {"t": "La", "menor": true, "g": 7, "ficha": "Ficha 4"}]}, "vecinos": {"claves": ["ton_vecinos"], "nivel": "ambos", "ejemplos": [{"t": "Mib", "menor": false, "ficha": "Ficha 5"}, {"t": "Si", "menor": true, "ficha": "Ficha 6"}, {"t": "Do", "menor": false, "ficha": "Ficha 6"}]}, "escalaOtras": {"claves": ["esc_otras", "escala_otras"], "nivel": "ambos", "ejemplos": [{"t": "Re4", "tipo": "pentaM", "ficha": "Ficha 6"}, {"t": "Re4", "tipo": "pentam", "ficha": "Ficha 6"}, {"t": "Re4", "tipo": "hexatona", "ficha": "Ficha 7"}, {"t": "Re4", "tipo": "cromatica", "ct": 1, "ficha": "Ficha 7"}, {"t": "Re4", "tipo": "cromatica", "ct": 3, "ficha": "Ficha 7"}]}, "compasPro": {"claves": ["comp_elegir", "comp_rellenar", "comp_replicar"], "nivel": "GP", "ejemplos": [{"den": 4, "ent": 2, "fr": [1, 2], "ficha": "Ficha 4"}, {"den": 8, "ent": 3, "fr": [1, 2], "ficha": "Ficha 4"}, {"den": 4, "ent": 2, "fr": [1, 4], "ficha": "Ficha 5"}]}, "test": {"claves": ["test_1_1", "test_1_2", "test_2_1", "test_2_2", "test_2_3", "test_3_1", "test_3_2", "test_3_3", "test_4_1", "test_4_2", "test_4_3", "test_5_1", "test_5_2", "test_8_1", "test_8_2", "test_8_3", "test_9_1", "test_9_2"], "nivel": "GP", "ejemplos": [{"tramo": "1.2", "titulo": "Compases poco habituales", "q": "En un compás fraccionario, la fracción hace referencia a…", "opts": ["El número de compases", "La figura del pulso", "La clave"], "correcta": 1, "ficha": "Ficha 4"}, {"tramo": "2.1", "titulo": "Cualidades del sonido", "q": "Una reflexión del sonido inferior a 50 ms se percibe como…", "opts": ["Eco", "Difracción", "Reverb"], "correcta": 2, "ficha": "Ficha 5"}, {"tramo": "1.1", "titulo": "Fonógrafo", "q": "En el fonógrafo, ¿qué función cumple el cono?", "opts": ["Hacer girar el cilindro", "Solo amplificar el sonido", "Micrófono al grabar y resonador al reproducir"], "correcta": 2, "ficha": "Ficha 4"}]}, "invCompuesto": {"claves": ["inv_compuestos", "inversion_int_compuestos"], "nivel": "ambos", "ejemplos": [{"a": "Do4", "b": "Mi5", "ficha": "Ficha 5"}, {"a": "Re4", "b": "La5", "ficha": "Ficha 6"}, {"a": "Fa4", "b": "Sol5", "ficha": "Ficha 6"}]}, "serieArmonica": {"claves": ["seriearmonica"], "nivel": "GP", "rotacion": false, "ejemplos": [{"f": "Mi2", "h": 5, "ficha": "Ficha 6"}, {"f": "Sib2", "h": 7, "ficha": "Ficha 6"}, {"f": "Re2", "h": 3, "ficha": "Ficha 7"}, {"f": "Do#2", "h": 6, "ficha": "Ficha 7"}]}, "dodeConstruir": {"claves": ["dode_construir"], "nivel": "GP", "rotacion": false, "ejemplos": [{"aviso": 1, "ficha": "Ficha 6"}, {"aviso": 2, "ficha": "Ficha 6"}, {"aviso": 3, "ficha": "Ficha 7"}]}, "dodeVariante": {"claves": ["dode_completa", "dode_identifica"], "nivel": "GP", "rotacion": false, "ejemplos": [{"modo": "completa", "kind": "R", "n": 3, "p0": [2, 10, 7, 3, 0, 8, 11, 9, 6, 4, 1, 5], "miss": [1, 4, 8, 10], "i": 4, "ficha": "Ficha 6"}, {"modo": "completa", "kind": "I", "n": 2, "p0": [2, 10, 7, 3, 0, 8, 11, 9, 6, 4, 1, 5], "miss": [3, 7], "i": 3, "ficha": "Ficha 6"}, {"modo": "identifica", "kind": "I", "n": 5, "p0": [7, 1, 10, 0, 9, 4, 3, 11, 2, 8, 6, 5], "ficha": "Ficha 7"}, {"modo": "identifica", "kind": "R", "n": 4, "p0": [2, 10, 7, 3, 0, 8, 11, 9, 6, 4, 1, 5], "ficha": "Ficha 7"}, {"modo": "identifica", "kind": "P", "n": 7, "p0": [0, 4, 11, 9, 2, 10, 5, 3, 7, 1, 6, 8], "ficha": "Ficha 7"}]}, "terminos": {"claves": ["terminos"], "nivel": "GE", "rotacion": false, "ejemplos": [{"parte": "A", "term": "smorzando", "cat": "intensidad", "ficha": "Ficha 6"}, {"parte": "B", "t": "subito", "ok": "de repente", "mal": "poco a poco", "ficha": "Ficha 6"}, {"parte": "C", "c": ["adagio", "andantino", "presto"], "ficha": "Ficha 7"}, {"parte": "A", "term": "tenuto", "cat": "articulacion", "ficha": "Ficha 7"}]}, "modulacion": {"claves": ["modulacion"], "nivel": "GP", "rotacion": false, "ejemplos": [{"a": "Do", "am": "M", "b": "Sol", "bm": "M", "ocho": false, "i": 4, "ficha": "Ficha 8"}, {"a": "Do", "am": "M", "b": "Mi", "bm": "m", "ocho": false, "i": 5, "ficha": "Ficha 8"}, {"a": "Re", "am": "m", "b": "Sol", "bm": "m", "ocho": true, "i": 1, "ficha": "Ficha 9"}]}, "transporte": {"claves": ["transporte_escrito", "transporte_mental", "transporte_resumen"], "nivel": "GP", "rotacion": false, "ejemplos": [{"t": "Re", "menor": false, "int": "3m", "dir": "asc", "foco": 3, "ficha": "Ficha 9"}, {"t": "Sol", "menor": false, "int": "2M", "dir": "desc", "foco": 1, "ficha": "Ficha 9"}, {"t": "Mi", "menor": true, "int": "3M", "dir": "asc", "foco": 4, "ficha": "Ficha 10"}]}, "blues": {"claves": ["blues"], "nivel": "GP", "rotacion": false, "ejemplos": [{"l": "C", "a": 0, "i": 9, "ficha": "Ficha 6"}, {"l": "B", "a": -1, "s7": true, "ficha": "Ficha 6"}, {"l": "E", "a": 0, "i": 8, "ficha": "Ficha 7"}]}, "quizGE": {"claves": ["adorno_quiz", "abrev_quiz"], "nivel": "GE", "rotacion": false, "ejemplos": [{"tema": "adorno", "q": "¿Qué adorno es este signo?", "ops": ["Mordente", "Grupeto", "Trino"], "ok": 1, "il": "grupeto", "ficha": "Ficha 7"}, {"tema": "adorno", "vf": "apoyValor", "ficha": "Ficha 7"}, {"tema": "abrev", "vf": "barras", "ficha": "Ficha 8"}, {"tema": "abrev", "q": "Con este signo, la música suena…", "ops": ["una octava más grave", "una octava más aguda", "igual, más fuerte"], "ok": 1, "il": "octava", "ficha": "Ficha 8"}]}};
  /* <<< copia de ojos.js (generada) */
  var NOMN = { C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si' }, ALTN = { '-2': 'bb', '-1': 'b', '0': '', '1': '#', '2': 'x' };
  var TIPON = { natural: 'natural', 'armónica': 'armonica', 'melódica': 'melodica', 'dórica': 'dorica', 'tipo 1': 'tipo1', 'tipo 2': 'tipo2', 'tipo 3': 'tipo3', 'tipo 4': 'tipo4' };
  function sinTilde(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  /* (18-oct-2026, Iago: «que sea lo más certero posible» y «todos los tipos de ojo de elemental se podrían utilizar en grado
     profesional») las notas de la ficha ({ step, alter, octave }) → 'Mi4', y los intervalos sin TEO (paramsDe va también en elige.js
     y en el Diario, que no lo llevan) */
  var LETN = 'CDEFGAB', SEMI7 = [0, 2, 4, 5, 7, 9, 11];
  function nomNota(n) { var a = String(+(n && n.alter) || 0); return n && NOMN[n.step] && ALTN[a] != null && isFinite(+n.octave) && n.octave !== null && n.octave !== '' ? NOMN[n.step] + ALTN[a] + (+n.octave) : null; }
  function construyeN(n1, num, code) {   /* la nota a «num» de n1, hacia arriba, con esa especie (J, M, m, A, d) */
    var li = LETN.indexOf(n1 && n1.step), d = (+num || 0) - 1; if (li < 0 || d < 0) return null;
    var s = d % 7, oc = Math.floor(d / 7), l2 = li + d, st2 = LETN[l2 % 7], o2 = +n1.octave + Math.floor(l2 / 7);
    var just = s === 0 || s === 3 || s === 4, dif = (just ? { d: -1, J: 0, A: 1 } : { d: -2, m: -1, M: 0, A: 1 })[code];
    if (dif == null) return null;
    var alt = SEMI7[s] + 12 * oc + dif - ((o2 * 12 + SEMI7[l2 % 7]) - (+n1.octave * 12 + SEMI7[li] + (+n1.alter || 0)));
    return Math.abs(alt) <= 2 ? { step: st2, alter: alt, octave: o2 } : null;
  }
  function espN(e) { e = String(e == null ? '' : e).replace(/\.$/, ''); return { Aum: 'A', Dis: 'd', aum: 'A', dis: 'd' }[e] || e; }
  function baseInt(num, code) {   /* «Clasifica» de GE no guarda las notas: una pareja con ese intervalo (mejor, con una alteración arriba) */
    var mejor = null, cs = ['D', 'E', 'A', 'G', 'C', 'F', 'B'];
    for (var i = 0; i < cs.length; i++) {
      var A = { step: cs[i], alter: 0, octave: 4 }, B = construyeN(A, num, code); if (!B || B.octave > 5) continue;
      if (Math.abs(B.alter) === 1) return [A, B];
      if (!mejor && B.alter === 0) mejor = [A, B];
    }
    return mejor;
  }
  function apartadosDe(M, S) {   /* los apartados de un ejercicio, estén donde estén (GE: _solData, _aco, _inv; GP: subs, items, pares) */
    var x = [S.subs, S.items, S.pares, S._aco && S._aco.items, S._inv && S._inv.pares, M._aco && M._aco.items, M._inv && M._inv.pares, M._solData];
    for (var i = 0; i < x.length; i++) if (Array.isArray(x[i]) && x[i].length) return x[i];
    return [];
  }
  /* (18-oct) las notas de una serie dodecafónica de la ficha ({ step, octave, acc }, en un solo compás: la alteración dura) → sus 12 sonidos (0–11) */
  var SEMIN = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }, ACCN = { '': 0, n: 0, b: -1, '#': 1 };
  function dodePcs(ns) {
    if (!Array.isArray(ns) || ns.length !== 12) return null;
    var est = {}, r = [];
    for (var i = 0; i < 12; i++) {
      var x = ns[i]; if (!x || SEMIN[x.step] == null) return null;
      var kk = x.step + x.octave, al = x.acc ? (ACCN[x.acc] || 0) : (est[kk] || 0); if (x.acc) est[kk] = al;
      r.push(((SEMIN[x.step] + al) % 12 + 12) % 12);
    }
    return r;
  }
  function moldeDe(key) { for (var m in MOLDES) if (MOLDES[m].claves.indexOf(key) >= 0) return m; return null; }
  function compasDe(tot, den) {   /* una duración (en redondas) y su denominador → { den, ent, fr } (½, ¼ o ¾ de pulso) */
    for (var k = 0; k < 3; k++, den *= 2) {
      var x = tot * den, ent = Math.floor(x + 1e-9), r = Math.round((x - ent) * 4) / 4;
      if (Math.abs(x - ent - r) < 1e-6 && r > 0 && r < 1) return { den: den, ent: ent, fr: r === .5 ? [1, 2] : r === .25 ? [1, 4] : [3, 4] };
    }
    return null;
  }
  function durForma(form, s) {
    if (!s) return null;
    if (form === 'mixto' && s.terms) return { tot: s.terms.reduce(function (a, t) { return a + t.num / t.den; }, 0), den: s.terms[0].den };
    if (form === 'decimal') return { tot: (s.int + s.frac.n / s.frac.d) / s.den, den: s.den };
    if (form === 'fracPlus' || form === 'fracMinus') return { tot: (s.base + (form === 'fracMinus' ? -1 : 1) * s.frac.n / s.frac.d) / s.den, den: s.den };
    return null;
  }
  function apartadoDificil(M) {   /* sin saber qué apartado falló (papel), el más difícil: las menores y las de más alteraciones */
    if (M._spec && M._spec._serie) return 3;   /* (18-oct) la serie armónica: el 5.º armónico, la 3M (la que suele llevar alteración) */
    var best = 0, sc = -1;
    (M._solData || []).forEach(function (x, i) { var v = Math.abs(x.fifths || 0) + (/m$/.test(x.nom || '') ? 10 : 0); if (v > sc) { sc = v; best = i; } });
    return best;
  }
  function paramsDe(key, ej, item) {
    var M = ej.motor || {}, S = M._spec || {}, k = item == null ? 0 : item, m, sub, d, c;
    if (/^(esc|escala)_(menor|mayor)$/.test(key)) {
      if (S.tonica && S.tipo) return { t: NOMN[S.tonica.s] + ALTN[S.tonica.alt || 0] + (S.tonica.o || 4), tipo: TIPON[S.tipo] || sinTilde(S.tipo).replace(' ', '') };
      m = /(Do|Re|Mi|Fa|Sol|La|Si)(♯|♭)? (M|m) (natural|armónica|melódica|dórica|tipo \d)/.exec(ej.enun || ''); if (!m) return null;
      var oc = S.notes && S.notes[0] && /\/(\d)/.exec(S.notes[0].key || '');
      return { t: m[1] + (m[2] === '♯' ? '#' : m[2] === '♭' ? 'b' : '') + (oc ? oc[1] : 4), tipo: TIPON[m[4]] };
    }
    switch (key) {
      case 'modos': return S.tonica ? { t: NOMN[S.tonica.s] + ALTN[S.tonica.alt || 0] + (S.tonica.o || 4), modo: sinTilde(S._mode || S.tipo) } : null;
      case 'com_clasif': m = /^(\d+)\/(\d+)$/.exec(M.sig || (M._comSpec || {}).sig || ''); return m ? { num: +m[1], den: +m[2] } : null;
      case 'ton_arm_tono': case 'ton_nombre': d = (M._solData || S.subs || [])[k]; return d && isFinite(d.fifths != null ? d.fifths : d.f) ? { q: +(d.fifths != null ? d.fifths : d.f) } : null;
      case 'ton_tono_arm': case 'ton_armadura': d = (M._solData || S.subs || [])[k]; m = d && /^(Do|Re|Mi|Fa|Sol|La|Si)(b|#)?(M|m)$/.exec(d.nom || ''); return m ? { t: m[1] + (m[2] || ''), menor: m[3] === 'm' } : null;
      case 'indice': d = (S.notas || [])[k]; return d ? { n: NOMN[d.step] + ALTN[d.alter || 0] + d.oct, clave: d.clef === 'bass' ? 'fa' : 'sol' } : null;
      case 'comp_elegir': sub = (S.subs || [])[k]; c = sub && (sub.options || []).filter(function (o) { return o.ok; })[0]; d = c && durForma(c.form, c.spec); return d ? compasDe(d.tot, d.den) : null;
      case 'comp_rellenar': sub = (S.subs || [])[k]; d = sub && durForma(sub.form, sub.spec); return d ? compasDe(d.tot, d.den) : null;
      case 'comp_replicar': d = S.dispar; return d ? compasDe(d.n / d.d, d.d / 2) : null;
      case 'dode_construir': return { aviso: Math.min(3, k + 1) };
      case 'dode_completa': case 'dode_identifica':
        var p0 = dodePcs(S.p0notes); if (!p0 || ['P', 'R', 'I'].indexOf(S.kind) < 0 || !(+S.n >= 0 && +S.n < 12)) return null;
        if (key === 'dode_identifica') return { modo: 'identifica', kind: S.kind, n: +S.n, p0: p0 };
        var ms = (S.missing || []).map(Number).filter(function (x) { return x >= 0 && x < 12; });
        return ms.length ? { modo: 'completa', kind: S.kind, n: +S.n, p0: p0, miss: ms, i: ms[Math.min(k, ms.length - 1)] } : null;
      case 'modulacion':
        var EX = S.EX, kn = function (K) { var m2 = /^([A-G])(#|b)?$/.exec((K && K.name) || ''); return m2 ? NOMN[m2[1]] + (m2[2] || '') : null; };
        if (!EX || !kn(EX.keyA) || !kn(EX.keyB)) return null;
        return { a: kn(EX.keyA), am: EX.keyA.mode === 'minor' ? 'm' : 'M', b: kn(EX.keyB), bm: EX.keyB.mode === 'minor' ? 'm' : 'M', ocho: !!EX.conOcho, i: Math.min((EX.N || 7) - 2, k + 1) };
      case 'transporte_resumen':
        return NOMN[S.letterA] && /^[23][mM]$/.test(S.interval || '') ? { t: NOMN[S.letterA] + ALTN[S.altA || 0], menor: S.mode === 'm', int: S.interval, dir: S.dir === 'desc' ? 'desc' : 'asc', foco: Math.min(4, k) } : null;
      case 'transporte_escrito': case 'transporte_mental':
        var kt = /^([A-G])(#|b)?$/.exec((S.key && S.key.name) || ''), tr = S.transp || {}, ints = { '1,1': '2m', '1,2': '2M', '2,3': '3m', '2,4': '3M' }[tr.dgrado + ',' + tr.semis];
        return kt && ints ? { t: NOMN[kt[1]] + (kt[2] || ''), menor: false, int: ints, dir: tr.dir < 0 ? 'desc' : 'asc', foco: [1, 2, 3][Math.min(2, k)] } : null;
      case 'blues':
        var kb = S.key && S.key.t; return kb && NOMN[kb[0]] ? (k >= 12 ? { l: kb[0], a: +kb[1] || 0, s7: true } : { l: kb[0], a: +kb[1] || 0, i: k }) : null;
      case 'seriearmonica': d = S.fund; return d && NOMN[d.step] ? { f: NOMN[d.step] + ALTN[d.alter || 0] + (d.octave == null ? 2 : d.octave), h: Math.min(8, k + 2) } : null;
      /* (18-oct-2026) los que faltaban: intervalos, inversiones, acordes y cadencias, en GE y en GP (GP: el ejercicio entero; GE: su motor) */
      case 'int_clasif': case 'intervalos_id':
        d = apartadosDe(M, S)[k]; if (!d) return null;
        if (d.n1 && d.n2 && +d.num <= 8) { var a1 = nomNota(d.n1), b1 = nomNota(d.n2); return a1 && b1 ? { a: a1, b: b1 } : null; }
        var par = +d.num >= 2 && +d.num <= 8 ? baseInt(+d.num, espN(d.code)) : null; return par ? { a: nomNota(par[0]), b: nomNota(par[1]) } : null;
      case 'int_constr': case 'intervalos_build':
        d = apartadosDe(M, S)[k]; if (!d || !(+d.num >= 2 && +d.num <= 8) || !/^(J|M|m|A|d)$/.test(espN(d.code))) return null;
        var n2 = d.n2 || d._n2cat, baj = d.direccion === 'desc' ? n2 : d.n1, ab = nomNota(baj);   /* hacia abajo: desde la de abajo, hacia arriba */
        return ab ? { a: ab, num: +d.num, cal: espN(d.code) } : null;
      case 'inv_simples': case 'inversion_int_simples': case 'inv_compuestos': case 'inversion_int_compuestos':
        d = apartadosDe(M, S)[k]; if (!d || !Array.isArray(d.dada) || d.dada.length !== 2) return null;
        var p1 = nomNota(d.dada[0]), p2 = nomNota(d.dada[1]); return p1 && p2 ? { a: p1, b: p2 } : null;
      case 'acordes': case 'acordes_id': case 'acordes_build':
        d = apartadosDe(M, S)[k]; if (!d) return null; var fu = nomNota(d.fund || d.root), cons = d.modo === 'build' || key === 'acordes_build';
        if (!fu || ['PM', 'Pm', 'Aum', 'Dis'].indexOf(d.tipo) < 0) return null;
        return cons ? { r: fu, tipo: d.tipo, modo: 'construir' } : { r: fu, tipo: d.tipo };
      case 'aco_identificar': case 'aco_construir': case 'inversion_aco_identifica': case 'inversion_aco_construir':
        d = apartadosDe(M, S)[k]; if (!d) return null; var ro = nomNota(d.root || d.fund);
        if (!ro || ['PM', 'Pm', 'Aum', 'Dis', '7'].indexOf(d.tipo) < 0 || !(+d.inv >= 0 && +d.inv <= 3)) return null;
        return /construir$/.test(key) ? { r: ro, tipo: d.tipo, estado: +d.inv, modo: 'construir' } : { r: ro, tipo: d.tipo, estado: +d.inv };
      case 'cadencias': case 'cadencias_quiz':
        var Gc = S.gen || M.gen || (M._cad && M._cad.gen); if (!Gc || !Gc.key || !Array.isArray(Gc.harm)) return null;
        var kc = /^([A-G])(#|b)?$/.exec(Gc.key.name || ''), tc = /^(autentica|plagal|semicadencia|rota)(?:_(perfecta|imperfecta))?$/.exec(Gc.type || '');
        if (!kc || !tc || Gc.harm.length < 2 || Gc.harm.length > 8) return null;
        var Pc = { t: NOMN[kc[1]] + (kc[2] || ''), menor: Gc.mode === 'minor' || Gc.key.mode === 'minor', grados: Gc.harm.map(function (h) { return String(h.rn || '').slice(0, 6); }), tipo: tc[1] === 'semicadencia' ? 'semi' : tc[1] };
        if (tc[2]) Pc.perfecta = tc[2] === 'perfecta';
        return Pc;
    }
    if (/^test_/.test(key)) { var tr = key.slice(5).replace('_', '.'); return MOLDES.test.ejemplos.filter(function (x) { return x.tramo === tr; })[0] || null; }
    return null;
  }
  /* (18-oct-2026, Iago: «si sabes que el ejercicio de claves ha salido mal, pues pones un ojo sobre explicación de cómo se resuelve…
     y que tengas varias variantes según el día… eso puedes aplicarlo a cualquier ejercicio del que no puedes tener un rastreo tan
     preciso. Lo importante es identificar que el problema está en ese ejercicio») si del ejercicio fallado no se puede sacar el
     apartado exacto (las claves: la ficha no guarda en qué clave estaba; o un tipo que aún no se lee), una de las variantes de
     ejemplo de ese mismo tipo, cambiando según la semana: la explicación de cómo se resuelve */
  function variante(m, key, curso, semilla) {
    var L = ((MOLDES[m] && MOLDES[m].ejemplos) || []).filter(function (p) {
      var cons = p.modo === 'construir';
      switch (m) {
        case 'escala': return /mayor/.test(key) ? /^tipo/.test(p.tipo) : (/menor/.test(key) ? !/^tipo/.test(p.tipo) : true);
        case 'acorde': case 'invAcorde': case 'acordePro': return /(build|construir)$/.test(key) ? cons : (/(_id|identificar|identifica)$/.test(key) ? !cons : true);
        case 'dodeVariante': return key === 'dode_identifica' ? p.modo === 'identifica' : p.modo !== 'identifica';
        case 'cadencia': return curso === 'GP' || p.perfecta == null;
        case 'quizGE': return key === 'abrev_quiz' ? p.tema === 'abrev' : p.tema !== 'abrev';
        case 'enarmonia': return key === 'ena_a' ? !p.tipo : (key === 'ena_avanzado' ? !!p.tipo : true);
        case 'test': return false;   /* el test de otro tramo sería otra cosa */
      }
      return true;
    });
    return L.length ? L[((semilla || 0) % L.length + L.length) % L.length] : null;
  }
  /* G = { grupo, curso: 'GE'|'GP', stats: [[n, digitales, fallos dig., déficit dig., en papel, fallos papel, déficit papel, (fallos por apartado)]] };
     F = la ficha ({ titulo, ejercicios: [{ n, key, enun, motor }] }); hist = moldes de las últimas semanas; semana = n.º de semana (rotación) */
  function eligeOjos(G, F, hist, semana) {
    hist = hist || [];
    var E = G.stats.map(function (s) {
      var ej = F.ejercicios.filter(function (e) { return e.n === s[0]; })[0] || {};
      return { n: s[0], key: ej.key, ej: ej, alumnos: s[1] + s[4], fallos: s[2] + s[5], deficit: s[3] + s[6], digF: s[2], papF: s[5], items: s[7], molde: moldeDe(ej.key) };
    }).filter(function (e) { return e.n <= 7 && e.molde; })
      .sort(function (u, v) { return v.fallos - u.fallos || v.deficit - u.deficit || u.n - v.n; });
    var picks = [], usado = function (m) { return picks.some(function (p) { return p.molde === m; }); };
    var toma = function (e, motivo) {
      var item = e.items ? e.items.indexOf(Math.max.apply(null, e.items)) : (e.papF && !e.digF ? apartadoDificil(e.ej.motor || {}) : 0);
      var P = null, gen = false; try { P = paramsDe(e.key, e.ej, item); } catch (er) { P = null; }
      if (!P) { P = variante(e.molde, e.key, G.curso, (+semana || 0) + e.n); gen = !!P; }   /* (18-oct) sin el apartado exacto: una variante del tipo */
      if (!P) return false;
      picks.push({ molde: e.molde, P: Object.assign({}, P, { ficha: F.titulo }), e: e, motivo: motivo, generico: gen }); return true;
    };
    E.forEach(function (e) { if (picks.length < 2 && e.fallos >= 2 && !usado(e.molde)) toma(e, 'error'); });
    E.forEach(function (e) { if (picks.length < 2 && e.fallos >= 1 && !usado(e.molde) && hist.indexOf(e.molde) < 0) toma(e, 'flojo'); });
    /* (18-oct) los moldes de temas que llegan más tarde en el curso (rotacion: false) solo salen por un error de verdad, nunca de repaso */
    /* (18-oct-2026, Iago: «todos los tipos de ojo de elemental se podrían utilizar en grado profesional… son contenidos que se suman»)
       en GP entran también los de GE; en GE, los de GP no */
    var rot = Object.keys(MOLDES).filter(function (m) { return MOLDES[m].rotacion !== false && (MOLDES[m].nivel !== 'GP' || G.curso === 'GP'); }), i0 = (semana || 0) % rot.length;
    rot = rot.slice(i0).concat(rot.slice(0, i0));
    rot.forEach(function (m) { if (picks.length < 2 && !usado(m) && hist.indexOf(m) < 0) picks.push({ molde: m, P: Object.assign({}, MOLDES[m].ejemplos[0], { ficha: F.titulo }), e: null, motivo: 'rotacion' }); });
    return picks;
  }
  /* copia de ojos.js >>> */
  /* <<< copia de diario-previa.src.js (generada) */
  /* los test: la pregunta que más se falló, con sus tres opciones, sale de la propia ficha (en la previa solo había ejemplos) */
  var paramsDe0 = paramsDe;
  function limpia(s, n) { return String(s == null ? '' : s).replace(/["`<>&\\]/g, '').replace(/'/g, '’').trim().slice(0, n || 150); }
  paramsDe = function (key, ej, item) {
    if (/^test_/.test(key)) {
      var S = (ej.motor || {})._spec || {}, q = (S.qs || [])[item == null ? 0 : item];
      if (q && Array.isArray(q.opts) && q.opts.length === 3 && +q.correcta >= 0 && +q.correcta < 3 && q.q)
        return { tramo: limpia(S.tramo || key.slice(5).replace('_', '.'), 8), titulo: limpia(S.titulo, 60), q: limpia(q.q, 150), opts: q.opts.map(function (o) { return limpia(o, 90); }), correcta: +q.correcta };
      return null;
    }
    /* (18-oct) términos, notas de adorno y abreviaciones: los textos salen de la propia ficha (limpios) */
    if (key === 'terminos') {
      var Dt = (ej.motor || {})._terminos, k = item == null ? 0 : item; if (!Dt) return null;
      if (k < 5) { var f = (Dt.A || [])[k]; return f ? { parte: 'A', term: limpia(f.term, 40), cat: limpia(f.cat, 20) } : null; }
      if (k < 7) { var qb = (Dt.B || [])[k - 5]; return qb && qb.ops && qb.ops.length === 2 ? { parte: 'B', t: limpia(qb.t, 40), ok: limpia(qb.ok, 80), mal: limpia(qb.ops[1 - qb.corr], 80) } : null; }
      return Dt.C && Array.isArray(Dt.C.correcto) ? { parte: 'C', c: Dt.C.correcto.slice(0, 5).map(function (x) { return limpia(x, 30); }) } : null;
    }
    if (key === 'adorno_quiz' || key === 'abrev_quiz') {
      var Qz = (ej.motor || {})._quiz, tema = key === 'abrev_quiz' ? 'abrev' : 'adorno'; if (!Qz) return null;
      if (!item && Qz.p1 && Array.isArray(Qz.p1.ops) && Qz.p1.ops.length === 3 && +Qz.p1.ok >= 0 && +Qz.p1.ok < 3)
        return { tema: tema, q: limpia(Qz.p1.q, 150), ops: Qz.p1.ops.map(function (o) { return limpia(o, 90); }), ok: +Qz.p1.ok, il: limpia(Qz.p1.il, 20) };
      var p2 = Qz.p2 || {}, vf = tema === 'abrev' ? p2.famCode : (p2.modo === 'apoyValor' ? 'apoyValor' : (p2.signo && p2.signo.code));
      return vf ? { tema: tema, vf: limpia(vf, 20) } : null;
    }
    return paramsDe0(key, ej, item);
  };

  /* ---------- utilidades ---------- */
  function codigoG(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, ''); }
  function lunesISO(anio, sem) { var j = new Date(Date.UTC(anio, 0, 4)), dn = (j.getUTCDay() + 6) % 7; return Date.UTC(anio, 0, 4 - dn) + (sem - 1) * 7 * 86400000; }
  function dia(ms) { return new Date(ms).toISOString().slice(0, 10); }
  function numDe(r) { var n = r.numero != null ? +r.numero : NaN; if (!isFinite(n)) { var m = /(\d+)/.exec(String(r.leccion || '')); n = m ? +m[1] : NaN; } return n; }
  var MAY = ['Dob', 'Solb', 'Reb', 'Lab', 'Mib', 'Sib', 'Fa', 'Do', 'Sol', 'Re', 'La', 'Mi', 'Si', 'Fa#', 'Do#'];
  var MEN = ['Lab', 'Mib', 'Sib', 'Fa', 'Do', 'Sol', 'Re', 'La', 'Mi', 'Si', 'Fa#', 'Do#', 'Sol#', 'Re#', 'La#'];
  function altS(a) { a = String(a == null ? '' : a); return a === '♯' ? '#' : a === '♭' ? 'b' : a === '𝄪' || a === '##' ? 'x' : a === '𝄫' ? 'bb' : a; }
  var ALTI = { '-2': 'bb', '-1': 'b', '0': '', '1': '#', '2': 'x' };

  /* ---------- (18-oct) la serie armónica y el dodecafonismo, como en la ficha ---------- */
  var SEMI_D = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }, LET_D = 'CDEFGAB', ACC_D = { '': 0, n: 0, b: -1, '#': 1 };
  function serieSA(f) {   /* serieFromFund */
    var li = LET_D.indexOf(f.step), base = (+f.octave) * 12 + SEMI_D[f.step] + (+f.alter || 0), SU = [0, 12, 19, 24, 28, 31, 34, 36], LE = [0, 0, 4, 0, 2, 4, 6, 0], r = [];
    for (var h = 0; h < 8; h++) {
      var obj = base + SU[h], ri = li + LE[h], s = LET_D[ri % 7], o = +f.octave + Math.floor(ri / 7), nat = o * 12 + SEMI_D[s];
      while (obj - nat > 6) { o++; nat += 12; }
      while (nat - obj > 6) { o--; nat -= 12; }
      r.push({ step: s, octave: o, alter: obj - nat });
    }
    return r;
  }
  function altEf(ns, i) { var x = ns[i]; if (!x) return 0; if (x.acc) return ACC_D[x.acc] || 0; for (var j = i - 1; j >= 0; j--) { var m = ns[j]; if (m && m.step === x.step && m.octave === x.octave && m.acc) return ACC_D[m.acc] || 0; } return 0; }
  function pcEf(ns, i) { var x = ns[i]; return ((SEMI_D[x.step] + altEf(ns, i)) % 12 + 12) % 12; }

  /* ---------- qué apartados falló cada uno (true = mal), en los ejercicios que tienen varios ---------- */
  function fallados(key, motor, resp, est, pc) {
    try {
      if (key === 'modulacion') {
        var EXm = est && est.EX, us = (est && est.userSlots) || []; if (!EXm || !EXm.sol) return null;
        var igual = function (x, y) { return x && y && x.root && y.root && x.root.letter === y.root.letter && (+x.root.alter || 0) === (+y.root.alter || 0) && x.modo === y.modo && !!x.seventh === !!y.seventh; };
        return EXm.sol.slice(1, -1).map(function (s, j) { return !(s.acc || []).some(function (c) { return igual(us[j + 1], c); }); });
      }
      if (key === 'transporte_resumen') {
        var g = est, s = g && g.sel; if (!s) return null;
        var E2L = { Do: 'C', Re: 'D', Mi: 'E', Fa: 'F', Sol: 'G', La: 'A', Si: 'B' }, mar = Object.keys(s.notas || {}).filter(function (n) { return s.notas[n]; });
        return [s.armA !== g.fA, !(E2L[s.notaB] === g.letterB && s.altB === g.altB && s.modoB === g.mode), s.armB !== g.fB, !(s.dif === g.diff && s.dir === (g.asc ? 'asc' : 'desc')),
          !(mar.length === (g.notas || []).length && (g.notas || []).every(function (n) { return s.notas[n]; }))];
      }
      if (key === 'transporte_escrito' || key === 'transporte_mental') {
        var de = est && est.destino; if (!de) return null;
        var okT = est.aluTon === de.name, okA = est.aluArm != null ? est.aluArm === de.fifths : de.fifths === 0;
        return [!okT, !okA, pc < 99.5 && okT && okA];   /* lo tercero: bien la tonalidad y la armadura, y aun así fallos (las notas: las diferencias) */
      }
      if (key === 'blues') {
        var ce = (est && est.cells) || [], se = (est && est.sel) || []; if (ce.length !== 12) return null;
        var rb = ce.map(function (c, i) { var u = se[i] || {}; return i !== est.given && !(u.letter === c.letter && (+u.alter || 0) === (+c.alter || 0)); });
        rb.push(ce.some(function (c, i) { var u = se[i] || {}; return i !== est.given && !!u.letter && !u.seventh; }));
        return rb;
      }
      if (key === 'terminos') {
        var Dt = (est && est.x) || motor._terminos, Rt = resp; if (!Dt || !Rt) return null;
        var col = (Rt.A && Rt.A.col) || {}, sl = (Rt.B && Rt.B.sel) || [], ord = (Rt.C && Rt.C.orden && Rt.C.orden.length) ? Rt.C.orden : ((Dt.C && Dt.C.barajado) || []), rt = [];
        for (var z = 0; z < 5; z++) { var fa = (Dt.A || [])[z]; rt.push(!!fa && col[fa.term] !== fa.cat); }
        for (var z2 = 0; z2 < 2; z2++) { var qb = (Dt.B || [])[z2]; rt.push(!!qb && sl[z2] !== qb.corr); }
        rt.push(((Dt.C && Dt.C.correcto) || []).some(function (tp, p) { return ord[p] !== tp; }));
        return rt;
      }
      if (key === 'adorno_quiz' || key === 'abrev_quiz') {
        var Qz = est && est.x; if (!Qz || !Qz.resp || !Qz.p1 || !Qz.p2) return null;
        return [Qz.resp.p1 !== Qz.p1.ok, Qz.resp.p2 !== Qz.p2.esVerdadero];
      }
      if (key === 'seriearmonica') {
        var fu = est && est.fund, bs = (est && est.bSeq) || []; if (!fu || SEMI_D[fu.step] == null) return null;
        return serieSA(fu).slice(1).map(function (x, k) { var u = bs[k]; return !(u && u.step === x.step && +u.octave === x.octave && +(u.alter || 0) === x.alter); });
      }
      if (key === 'dode_construir') {   /* [repite un sonido (o un enarmónico, o le faltan), le faltó un becuadro, una escalita] */
        var ns = ((est && est.notes) || []).filter(function (x) { return x && SEMI_D[x.step] != null; });
        if (!ns.length) return null;
        var visto = {}, rep = ns.length < 12, bec = false;
        ns.forEach(function (x, i) {
          var pc = pcEf(ns, i), nat = SEMI_D[x.step] % 12;
          if (visto[pc]) { if (!x.acc && altEf(ns, i) !== 0 && !ns.some(function (y, j) { return j !== i && pcEf(ns, j) === nat; })) bec = true; else rep = true; }
          visto[pc] = 1;
        });
        var mid = ns.map(function (x, i) { return (+x.octave + 1) * 12 + SEMI_D[x.step] + altEf(ns, i); }), run = 0, best = 0, dir = 0;
        for (var q = 1; q < mid.length; q++) { var d = mid[q] - mid[q - 1], cj = Math.abs(d) === 1 || Math.abs(d) === 2, sg = d > 0 ? 1 : -1; if (cj) { run = run > 0 && sg === dir ? run + 1 : 1; dir = sg; best = Math.max(best, run); } else run = 0; }
        return [rep, bec, best >= 3];
      }
      if (key === 'dode_completa') {
        var mi = (est && est.missing) || [], sh = (est && est.shown) || [], vn = (est && est.varNotes) || [];
        return mi.map(function (i) { return !(sh[i] && vn[i] && pcEf(sh, i) === pcEf(vn, i)); });
      }
      if (key === 'dode_identifica') return est ? [est.selKind !== est.kind, +est.selN !== +est.n || est.selN == null] : null;
      /* (18-oct-2026) los que faltaban: intervalos, inversiones y acordes; y las tonalidades de GP (el ejercicio entero: subs) */
      var mismaNota = function (x, y) { return !!(x && y && x.step === y.step && (+x.alter || 0) === (+y.alter || 0) && +x.octave === +y.octave); };
      if (key === 'int_clasif') {
        var sd = motor._solData || [], ss = (resp && resp.sel) || [];
        return sd.map(function (d, k) { var u = ss[k] || {}; return !(+u.num === +d.num && espN(u.esp) === espN(d.code)); });
      }
      if (key === 'intervalos_id') return ((est && est.subs) || []).map(function (x) { var u = x.sel || {}; return !(+u.num === +x.num && espN(u.esp) === espN(x.code)); });
      if (key === 'int_constr') { var sc = motor._solData || [], rr = (resp && resp.resp) || []; return sc.map(function (d, k) { return !mismaNota(rr[k], d.n2); }); }
      if (key === 'intervalos_build') return ((est && est.subs) || []).map(function (x) { return !mismaNota(x.resp, x._n2cat); });
      if (/^(inv_simples|inv_compuestos|inversion_int_simples|inversion_int_compuestos)$/.test(key)) {
        var ip = (motor._inv && motor._inv.pares) || (est && (est.pares || est.subs || (est._inv && est._inv.pares))) || null;
        return ip && ip.some(function (x) { return x && '_ok' in x; }) ? ip.map(function (x) { return !(x && x._ok); }) : null;
      }
      if (/^(aco_identificar|aco_construir|inversion_aco_identifica|inversion_aco_construir)$/.test(key)) {
        var ai = (motor._aco && motor._aco.items) || (est && (est.items || (est._aco && est._aco.items))) || null;
        return ai && ai.some(function (x) { return x && '_ok' in x; }) ? ai.map(function (x) { return !(x && x._ok); }) : null;
      }
      if (key === 'acordes') {   /* solo los de construir (en los de identificar no se guarda qué contestó) */
        var sa = motor._solData || [], ra = (resp && resp.resp) || [], nn = function (x) { return x ? x.step + (+x.alter || 0) : ''; };
        return sa.map(function (d, k) { if (d.modo !== 'build' || !Array.isArray(d.objetivo)) return false; return (ra[k] || []).map(nn).sort().join(',') !== d.objetivo.map(nn).sort().join(','); });
      }
      if (key === 'ton_armadura' && est && Array.isArray(est.subs)) return est.subs.map(function (x) { return !(x.sel != null && +x.sel === +x.f); });
      if (key === 'ton_nombre' && est && Array.isArray(est.subs)) return est.subs.map(function (x) { var q = +x.f; return !(x.selM && (String(x.selM.nota || '') + altS(x.selM.alt)) === MAY[q + 7] && x.selm && (String(x.selm.nota || '') + altS(x.selm.alt)) === MEN[q + 7]); });
      if (key === 'ton_tono_arm' || key === 'ton_armadura') {
        var sol = motor._solData || [], sel = (resp && resp.sel) || [];
        return sol.map(function (d, k) { return !(sel[k] != null && +sel[k] === +d.fifths); });
      }
      if (key === 'ton_arm_tono' || key === 'ton_nombre') {
        var s2 = motor._solData || [], sl = (resp && resp.sel) || [];
        return s2.map(function (d, k) {
          var q = +d.fifths, par = sl[k] || [], M = par[0] || {}, m = par[1] || {};
          return (String(M.nota || '') + altS(M.alt)) !== MAY[q + 7] || (String(m.nota || '') + altS(m.alt)) !== MEN[q + 7];
        });
      }
      if (key === 'indice') {
        var N = (est && est.notas) || [], S = (est && est.sel) || [];
        return N.map(function (n, k) { var u = S[k] || {}; return !(u.step === n.step && +u.oct === +n.oct && altS(u.alter) === ALTI[String(n.alter || 0)]); });
      }
      if (key === 'comp_elegir') {
        return ((est && est.subs) || []).map(function (sb) { var ok = -1; (sb.options || []).forEach(function (o, j) { if (o && o.ok && ok < 0) ok = j; }); return +sb.sel !== ok; });
      }
      if (/^test_/.test(key)) {
        var qs = (est && est.qs) || [], rs = (est && est.resp) || [];
        return qs.map(function (q, k) { return !(rs[k] != null && +rs[k] === +q.correcta); });
      }
    } catch (e) {}
    return null;
  }

  /* copia de diario-previa.src.js >>> */

  /* ---------- la elección, con lo que devuelve escaleta_previa_fichas ----------
     res = { ok, gp, ficha, filas: [ { t: 'p', pct: [% por ejercicio] } | { t: 'd', ejs: [{ n, key, enun, pct }], resp: [...], est: [...] } ] }
     (en GP, est es el estado entero de cada ejercicio; en GE, lo justo: _spec, _solData, sig, _comSpec, _terminos, _quiz) */
  var ULT = null;
  function elige(res, clase, semana, grupo) {
    ULT = { en: new Date().toISOString(), grupo: String(grupo || ''), clase: clase, ficha: 0, nota: '' };
    if (!res || res.ok !== true || !Array.isArray(res.filas)) { ULT.nota = 'sin datos'; return null; }
    var gp = !!res.gp, N = +res.ficha || 0; ULT.ficha = N;
    if (!N) { ULT.nota = 'sin ficha cerrada'; return null; }
    var D = res.filas.filter(function (x) { return x && x.t === 'd' && Array.isArray(x.ejs) && x.ejs.length; });
    var P = res.filas.filter(function (x) { return x && x.t === 'p' && Array.isArray(x.pct); });
    if (!D.length) { ULT.nota = 'sin entregas digitales'; return null; }
    /* la ficha: sus ejercicios (los de una entrega) y los datos de cada uno (en GP, el propio ejercicio; en GE, su motor) */
    var ref = D[0], est0 = Array.isArray(ref.est) ? ref.est : [];
    var motorDe = function (s) {   /* (18-oct) en GE, todo lo del ejercicio (sin su dibujo): _spec, _solData, _aco, _inv… */
      s = s && typeof s === 'object' ? s : {}; return gp ? { _spec: s } : Object.assign({}, s);
    };
    var EJ = ref.ejs.map(function (e, i) { e = e || {}; return { i: i, n: +e.n || (i + 1), key: String(e.key || ''), enun: String(e.enun || '') }; })
      .filter(function (e) { return e.n <= 7; });
    EJ.forEach(function (e) { e.motor = motorDe(est0[e.i]); });
    var F = { titulo: 'Ficha ' + N, ejercicios: EJ.map(function (e) { return { n: e.n, key: e.key, enun: e.enun, motor: e.motor }; }) };
    /* por ejercicio: [n, digitales, fallos dig., déficit dig., en papel, fallos papel, déficit papel, (fallos por apartado)] */
    var stats = EJ.map(function (e) {
      var s = [e.n, 0, 0, 0, 0, 0, 0], items = null;
      D.forEach(function (x) {
        var ej = x.ejs[e.i] || {}; if (ej.pct == null) return;
        var pc = +ej.pct; if (!isFinite(pc)) return; if (gp && pc <= 1.0001) pc *= 100;   /* GP: de 0 a 1 · GE: de 0 a 100 */
        s[1]++; if (pc < 99.5) { s[2]++; s[3] += (100 - pc) / 100; }
        var ex = Array.isArray(x.est) ? (x.est[e.i] || null) : null;
        /* lo de cada uno: en GP, su ejercicio; en GE, su motor (los datos de su ficha) y, en términos, adornos y abreviaciones, lo que contestó */
        var f = gp ? fallados(e.key, e.motor, (Array.isArray(x.resp) ? x.resp : [])[e.i], ex, pc)
          : fallados(e.key, ex ? motorDe(ex) : e.motor, (Array.isArray(x.resp) ? x.resp : [])[e.i], ex ? { x: e.key === 'terminos' ? ex._terminos : ex._quiz } : null, pc);
        if (f && f.length) { items = items || f.map(function () { return 0; }); f.forEach(function (v, k) { if (v && k < items.length) items[k]++; }); }
      });
      P.forEach(function (x) { var pc = +x.pct[e.n - 1]; if (!isFinite(pc)) return; s[4]++; if (pc < 99.5) { s[5]++; s[6] += (100 - pc) / 100; } });
      s[3] = Math.round(s[3] * 100) / 100; s[6] = Math.round(s[6] * 100) / 100;
      if (items && items.some(function (v) { return v > 0; })) s.push(items);
      return s;
    });
    var G = { grupo: String(grupo || ''), curso: gp ? 'GP' : 'GE', stats: stats }, picks = [];
    try { picks = eligeOjos(G, F, [], +semana || 0); } catch (e) { picks = []; ULT.nota = 'error: ' + String(e && e.message || e).slice(0, 120); }
    ULT.stats = stats; ULT.alumnos = D.length + P.length;
    /* para mirar: de cada ejercicio, el apartado que más se falló y lo que sacaría de él (null: ese tipo aún no da ¡Ojo!) */
    ULT.ejercicios = EJ.map(function (e, j) {
      var s = stats[j], it = s[7] ? s[7].indexOf(Math.max.apply(null, s[7])) : 0, Pj = null;
      try { Pj = paramsDe(e.key, F.ejercicios[j], it); } catch (er) { Pj = 'error: ' + String(er && er.message || er).slice(0, 80); }
      return { n: e.n, key: e.key, molde: moldeDe(e.key), fallos: s[2] + s[5], apartado: it, p: Pj };
    });
    ULT.picks = picks.map(function (p) { return { m: p.molde, motivo: p.motivo, n: p.e ? p.e.n : null, generico: !!p.generico }; });   /* generico: sin el apartado exacto, una variante de ejemplo de ese tipo */
    var x = picks[clase === 'c2' ? 1 : 0];
    if (!x || x.motivo === 'rotacion') { ULT.nota = ULT.nota || 'nada que destacar'; return null; }
    ULT.nota = ULT.nota || 'ok';
    return { m: x.molde, p: x.P, motivo: x.motivo, ficha: N, generico: !!x.generico };
  }
  window.PreviaElige = { version: VERSION, elige: elige, get ultimo() { return ULT; } };
})();
