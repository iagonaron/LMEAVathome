/* LM at home · piel · carrusel (26-sep-2026): los dos Carrusel se quedan como están
   (tablero de proyección en clase / juego en directo con QR). Solo se marca <html>
   con lm-sin-piel para que el núcleo no siga cambiando emojis por iconos en lo que
   la app vaya pintando; carrusel.css ya anula el fondo, el rótulo y los iconos. */
(function () {
  'use strict';
  try { document.documentElement.classList.add('lm-sin-piel'); } catch (e) {}
})();
