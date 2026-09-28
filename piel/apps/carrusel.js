/* LM at home · piel · carrusel
   · GE (PreDict Carrusel, tablero de proyección, 26-sep-2026): se queda como está. Solo se marca <html> con
     lm-sin-piel para que el núcleo no cambie emojis por iconos; carrusel.css anula el fondo, el rótulo y los iconos.
   · GP (PreDict PRO Carrusel, 28-sep-2026, Iago): estética nueva (carrusel.css). Aquí solo se pasan a icono los dos
     emojis que el núcleo no conoce: 📷 de «Escanear QR» y ⚙ de «Configurar». Nada más: ni datos ni juego. */
(function () {
  'use strict';
  var H = document.documentElement;
  if (!H.classList.contains('lm-app-carrusel-gp')) { try { H.classList.add('lm-sin-piel'); } catch (e) {} return; }
  function svg(p) { return '<svg class="pl-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; }
  var CAMARA = '<path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.3l1.6-2.2h7.2L17.2 7h2.3A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z"/><circle cx="12" cy="13" r="3.6"/>';
  var RUEDA = '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 13.5l1.6 1.2-1.9 3.3-1.9-.8a7 7 0 0 1-1.7 1l-.3 2h-3.8l-.3-2a7 7 0 0 1-1.7-1l-1.9.8-1.9-3.3 1.6-1.2a7 7 0 0 1 0-2l-1.6-1.2 1.9-3.3 1.9.8a7 7 0 0 1 1.7-1l.3-2h3.8l.3 2a7 7 0 0 1 1.7 1l1.9-.8 1.9 3.3-1.6 1.2a7 7 0 0 1 0 2z"/>';
  /* el emoji se queda en el botón (oculto, como hace el núcleo): lo que el botón «dice» no cambia */
  function delante(el, emo, dibujo) {
    if (!el || el.getAttribute('data-lm-ico')) return;
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) {
      var i = n.nodeValue.indexOf(emo); if (i < 0) continue;
      var sp = document.createElement('span'); sp.className = 'pl-emo'; sp.textContent = emo;
      var t = document.createElement('span'); t.innerHTML = svg(dibujo);
      n.nodeValue = n.nodeValue.slice(0, i) + n.nodeValue.slice(i + emo.length).replace(/^\s+/, ' ');
      n.parentNode.insertBefore(t.firstChild, n); n.parentNode.insertBefore(sp, n);
      el.setAttribute('data-lm-ico', '1');
      return;
    }
  }
  function poner() {
    delante(document.getElementById('btnScan'), '📷', CAMARA);
    Array.prototype.forEach.call(document.querySelectorAll('.cfg-gear'), function (g) { delante(g, '⚙', RUEDA); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', poner); else poner();
})();
