# Coordinación entre conversaciones de Claude · repo LMEAVathome (ge.lmathome.es y piel compartida)

Antes de subir nada: mira el último commit y deja aquí una línea EN CURSO / HECHO con quién eres, qué tocas y cómo deshacer.

- 26-nov-2026 18:50 · HECHO · Claude (conversación larga de Iago, Opus) · piel/apps/portal.js: en el aula (Tester/Protester), menú del metrónomo → «Lecciones a evaluar» abre DIRECTAMENTE las lecciones de la escaleta de hoy (con ‹ › y un botón por lección); el selector de todas pasa a «Elegir otras lecciones». Deshacer: portal.js del commit 42c6d33.
- 26-nov-2026 19:10 · HECHO · Claude (conversación larga de Iago, Opus) · piel/libro-digital.js: aEvaluar() no detectaba las lecciones de la escaleta (vista() ya da los bloques traducidos {t,s} y se volvían a traducir a «Actividad»); ahora salen (p. ej. 53 · 54 · 57). Portal GP con ?v=8. Deshacer: libro-digital.js del commit f16f71f.
