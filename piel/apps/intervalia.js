/* =====================================================================
   LM at home · piel · INTERVALIA (GE) e INTERVALIA PRO (GP)
   26-sep-2026 · v2 y v3 27-sep-2026 (Iago). Comportamientos SOLO visuales:
   no toca datos, eventos ni lógica; solo pinta.
   1) Pie: «by Iago González Alonso» y «Optimizado para ordenador y tablet»
      se mueven, tal cual, al pie común (abajo del todo, en el centro).
   2) El rótulo de grado va en la banda fija de arriba del núcleo (ya no se
      alinea con nada desde aquí).
   3) Botones (3ª vuelta):
      · «Generar ejercicios» → SOLO el dado (cuadrado azul en intervalia.css),
        en su misma fila, que se ajusta al borde derecho del ejercicio. El texto
        original queda en title y aria-label.
      · Dado de «Intervalos al azar» (panel) → dado plano + «Al azar» dentro del
        botón (como en la ventana «Antes de empezar»); el rótulo de debajo, que
        salía partido en dos líneas, se oculta en el CSS.
      · Dado de la ventana «Antes de empezar» → el dado plano del Diario.
      · Cantar (▶) → triángulo plano de trazo, blanco.
      · «ACEPTAR» → ✓ + «Aceptar».
      El icono y el texto originales se quedan dentro del botón, ocultos
      (.lm-ico-orig / .lm-txt-orig): no se borra nada.
   Para quitarlo: vaciar este fichero (intervalia.css sigue funcionando solo).
   ===================================================================== */
(function () {
  'use strict';
  var H = document.documentElement;
  if (!H.classList.contains('lm-fam-intervalia') || window.__lmPielIntervalia) return;
  window.__lmPielIntervalia = true;
  var LP = window.LMPiel || {};

  /* ---------- 1. pie común ---------- */
  try { if (LP.alPie) LP.alPie(['.topinfo-by', '.topinfo-opt']); } catch (e) {}

  /* ---------- 3. botones ---------- */
  function icono(nombre) {
    if (!LP.ico) return null;
    var t = document.createElement('span'); t.innerHTML = LP.ico(nombre, 'lm-ico-nuevo');
    return t.firstChild;
  }
  /* el icono plano va delante del SVG que dibujó la app (que se oculta) */
  function ponerIcono(btn, nombre) {
    if (!btn || btn.querySelector('.lm-ico-nuevo')) return;
    var n = icono(nombre); if (!n) return;
    var orig = null;
    for (var i = 0; i < btn.children.length; i++) { if (btn.children[i].nodeName.toLowerCase() === 'svg' && !btn.children[i].classList.contains('pl-i')) { orig = btn.children[i]; break; } }
    if (orig) { orig.classList.add('lm-ico-orig'); btn.insertBefore(n, orig); }
    else btn.insertBefore(n, btn.firstChild);
    btn.classList.add('lm-con-icono');
  }
  /* el texto suelto del botón se envuelve (mismo texto) y se oculta; si se pide, se pone otro visible */
  function ponerTexto(btn, texto, conTitle) {
    if (!btn || btn.getAttribute('data-lm-txt')) return;
    btn.setAttribute('data-lm-txt', '1');
    var orig = (btn.textContent || '').replace(/\s+/g, ' ').trim();
    if (orig) {
      if (conTitle && !btn.getAttribute('title')) btn.setAttribute('title', orig);
      if (!btn.getAttribute('aria-label')) btn.setAttribute('aria-label', orig);
    }
    [].slice.call(btn.childNodes).forEach(function (nd) {
      if (nd.nodeType === 3 && /\S/.test(nd.nodeValue)) {
        var sp = document.createElement('span'); sp.className = 'lm-txt-orig'; sp.textContent = nd.nodeValue;
        btn.replaceChild(sp, nd);
      }
    });
    if (texto) { var nv = document.createElement('span'); nv.className = 'lm-txt'; nv.textContent = texto; btn.appendChild(nv); }
  }
  function botones() {
    /* el dado que genera los ejercicios: solo el dado */
    var gen = document.getElementById('genBtn');
    if (gen) { ponerIcono(gen, 'dice'); ponerTexto(gen, '', true); gen.classList.add('lm-iv-dado'); }
    /* «Intervalos al azar» (panel): dado + «Al azar», como en la ventana del principio */
    var dado = document.getElementById('diceBtn');
    if (dado) {
      ponerIcono(dado, 'dice');
      if (!dado.getAttribute('aria-label')) dado.setAttribute('aria-label', 'Intervalos al azar');
      ponerTexto(dado, 'Al azar', false);
    }
    ponerIcono(document.getElementById('wmDice'), 'dice');
    var ok = document.getElementById('wmAccept');
    if (ok) { ponerIcono(ok, 'check'); ponerTexto(ok, 'Aceptar', false); }
    var pl = document.querySelectorAll('.ex-play');
    for (var i = 0; i < pl.length; i++) ponerIcono(pl[i], 'play');
  }
  try { botones(); } catch (e) {}
  /* por si la página tarda en pintar algún botón (idempotente) */
  if (document.readyState !== 'complete') window.addEventListener('load', function () { try { botones(); } catch (e) {} });
})();
