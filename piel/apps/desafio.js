/* =====================================================================
   LM at home · PIEL · DESAFÍO 6 SEMICORCHEAS (GE) — SOLO aspecto
   26-sep-2026 · 2.ª vuelta 27-sep-2026 · 3.ª vuelta 27-sep-2026 (tarde/noche, Iago)
   Copia de antes: desafio.js.bak-27sep-v2.
   No toca datos, eventos ni lógica: solo mueve textos al pie y viste botones.
   1) «by Iago González Alonso» y «Versión optimizada para ordenador y tablet»
      bajan al pie común, abajo del todo y en el centro (LMPiel.alPie). Los
      huecos que dejan arriba se cierran (clase .lm-vacio).
   2) (3.ª vuelta) El rótulo GRADO ELEMENTAL lo pone el núcleo en su banda fija
      de arriba; aquí ya no se alinea con nada (desafio.css baja la cabecera).
   3) Botones:
      · DADO (3.ª vuelta): SOLO el dado, sin la palabra «Nuevo». El dado que
        dibuja la app se queda dentro, oculto (.lm-ico-orig), y el botón lleva
        title y aria-label «Nuevo ejercicio» (el texto de la app). La etiqueta
        suelta «Nuevo ejercicio» de al lado también se queda, oculta por CSS.
        Ya es lo último de su fila (arriba a la derecha de la partitura).
      · Tocar/Parar: «[▶] Tocar» / «[❚❚] Parar» (icono plano + palabra; el SVG
        de la app se queda oculto; el texto nuevo lleva aria-hidden, así que el
        nombre accesible sigue siendo el title de la app).
      La app rehace esos botones a menudo (cada nivel, cada dado, cada
      tocar/parar, cada cambio de tamaño): un observador los vuelve a vestir.
   Para quitarlo: vaciar este fichero (desafio.css sigue funcionando solo).
   ===================================================================== */
(function () {
  'use strict';
  var H = document.documentElement;
  if (!H.classList.contains('lm-fam-desafio') || window.__lmPielDesafio) return;
  window.__lmPielDesafio = true;
  var LP = window.LMPiel || {};
  function icoNodo(n, extra) { if (!LP.ico) return null; var t = document.createElement('span'); t.innerHTML = LP.ico(n, extra || ''); return t.firstChild; }

  /* ---------- Tocar/Parar: icono plano + palabra (idempotente) ---------- */
  function vestir(btn, ico, palabra) {
    if (!btn || !LP.ico) return;
    var yaIco = btn.querySelector(':scope > svg.lm-ico-nuevo'), yaTxt = btn.querySelector(':scope > .lm-txt');
    if (yaIco && yaTxt && yaIco.getAttribute('data-ico') === ico && yaTxt.textContent === palabra &&
        !btn.querySelector(':scope > svg:not(.lm-ico-nuevo):not(.lm-ico-orig)')) return;
    if (yaIco) yaIco.remove();
    if (yaTxt) yaTxt.remove();
    Array.prototype.forEach.call(btn.querySelectorAll(':scope > svg:not(.lm-ico-nuevo)'), function (s) { s.classList.add('lm-ico-orig'); });
    var svg = icoNodo(ico); if (!svg) return;
    svg.classList.add('lm-ico-nuevo'); svg.setAttribute('data-ico', ico);
    var txt = document.createElement('span'); txt.className = 'lm-txt'; txt.setAttribute('aria-hidden', 'true'); txt.textContent = palabra;
    btn.insertBefore(txt, btn.firstChild);
    btn.insertBefore(svg, txt);
    btn.classList.add('lm-btn-vestido');
  }
  function vestirTocar() {
    var b = document.getElementById('playBtn'); if (!b) return;
    var orig = b.querySelector(':scope > svg:not(.lm-ico-nuevo)');
    var parar = !!(orig && orig.querySelector('rect'));  /* la app pone el icono de pausa mientras suena */
    vestir(b, parar ? 'pause' : 'play', parar ? 'Parar' : 'Tocar');
  }

  /* ---------- DADO: solo el dado (idempotente) ---------- */
  function vestirDado() {
    var z = document.getElementById('genzone'); if (!z) return;
    var b = z.querySelector('.dice-btn'); if (!b || !LP.ico) return;
    if (b.classList.contains('lm-dado') && b.querySelector(':scope > svg.lm-dado-ico')) return;
    var lab = z.querySelector('.dice-label');
    var nombre = String(b.getAttribute('title') || (lab && lab.textContent) || 'Nuevo ejercicio').replace(/\s+/g, ' ').trim();
    if (!b.getAttribute('aria-label')) b.setAttribute('aria-label', nombre);
    if (!b.getAttribute('title')) b.setAttribute('title', nombre);
    Array.prototype.forEach.call(b.querySelectorAll(':scope > svg:not(.lm-dado-ico)'), function (s) { s.classList.add('lm-ico-orig'); });
    var svg = icoNodo('dice', 'lm-dado-ico'); if (!svg) return;
    b.insertBefore(svg, b.firstChild);
    b.classList.add('lm-dado');
  }

  function vigilar(el, fn) {
    if (!el) return;
    try { new MutationObserver(function () { try { fn(); } catch (e) {} }).observe(el, { childList: true }); } catch (e) {}
  }

  /* ---------- pie: autoría y «optimizada…» abajo del todo ---------- */
  function pie() {
    if (!LP.alPie) return;
    LP.alPie(['.topinfo-by', '.opt-banner']);
    var ti = document.querySelector('.topinfo'); if (ti && !ti.querySelector('.topinfo-by')) ti.classList.add('lm-vacio');
    var ob = document.querySelector('.opt-banner-wrap'); if (ob && !ob.querySelector('.opt-banner')) ob.classList.add('lm-vacio');
  }

  try { pie(); } catch (e) {}
  try { vestirDado(); vestirTocar(); } catch (e) {}
  vigilar(document.getElementById('genzone'), vestirDado);
  vigilar(document.getElementById('playBtn'), vestirTocar);
})();
