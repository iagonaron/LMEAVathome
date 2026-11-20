/* =====================================================================================
   LM at home · LECCIONES DEL LIBRO EN DIGITAL (20-nov-2026, Iago)
   -------------------------------------------------------------------------------------
   En las tareas de la semana (campana), al pulsar «Lección N»: si esa lección ya tiene su
   versión interactiva (transcrita del libro, con el estudio por fases SIN tiempo), se abre
   esa en lugar de la captura. Dentro, el botón del libro enseña la captura original.
   DE MOMENTO SOLO para las cuentas de Iago (Tester / Protester), para probarlo antes que
   los alumnos («hoy lo utilizaré como prueba»). Para abrirlo a todos: SOLO_PROFE = false.
   Lo cargan los index.html de los portales GE y GP con una línea; para quitarlo, borrar
   esa línea (el visor de capturas de siempre sigue intacto).
   ===================================================================================== */
(function(){
  'use strict';
  var SOLO_PROFE = false;   /* (20-nov-2026 11:20, Iago: «Abre las lecciones digitales a los alumnos») */
  var PROFES = ['iago gonzalez tester','iago gonzalez protester','iago gonzalez pro tester'];
  /* lecciones ya pasadas a digital, por curso del portal */
  var DIGITAL = {
    GE: { base:'https://ge.lmathome.es/lecciones-libro/?grado=4ge&libro=', n:[13,16,17,19,23,24,26,28,31,32,33,34,36,37,38,39,40,41,42,43,46,47,50,52] },
    GP: { base:'https://gp.lmathome.es/lecciones-libro/?grado=2gp&libro=', n:[10,11,12,14,16,17,18,21,22,38,39,49,51,53,54,57,62,75] }
  };
  function norm(s){ return String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').trim().toLowerCase(); }
  function portal(){ return /^ge\./i.test(location.hostname) ? 'GE' : 'GP'; }
  function ses(){ var k = portal()==='GE' ? 'lmeav_session' : 'lmpro_session';
    try{ return JSON.parse(localStorage.getItem(k)||'null') || window.__LM_SES || null; }catch(e){ return window.__LM_SES || null; } }
  function esProfe(){ var s=ses(); return !!(s && s.estado==='validado' && PROFES.indexOf(norm(s.nombre))>=0); }
  function numDe(parte){ var m=/^leccion_(\d+)$/.exec(String(parte||'')); return m ? parseInt(m[1],10) : null; }

  function url(parte){
    var n=numDe(parte); if(n==null) return null;
    var d=DIGITAL[portal()]; if(!d || d.n.indexOf(n)<0) return null;
    if(SOLO_PROFE && !esProfe()) return null;
    var s=ses(); return d.base+n+(s&&s.id?'&cuenta='+encodeURIComponent(s.id):'');
  }

  /* abre la lección digital a pantalla completa; devuelve true si la abrió */
  function abre(envio, parte, titulo, alAbrir){
    var u=url(parte); if(!u) return false;
    var old=document.getElementById('lm-libro-dig'); if(old) old.remove();
    var ov=document.createElement('div'); ov.id='lm-libro-dig';
    ov.style.cssText='position:fixed;left:0;top:0;right:0;bottom:0;z-index:100003;background:#0b1320';
    var fr=document.createElement('iframe'); fr.src=u; fr.title=titulo||'Lección';
    fr.setAttribute('allow','microphone; autoplay; fullscreen');
    fr.style.cssText='position:absolute;left:0;top:0;width:100%;height:100%;border:0;background:#0b1320';
    var x=document.createElement('button'); x.type='button'; x.title='Cerrar la lección'; x.setAttribute('aria-label','Cerrar la lección');
    x.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    x.style.cssText='position:absolute;left:14px;bottom:14px;z-index:2;width:40px;height:40px;border-radius:10px;border:1px solid rgba(255,255,255,.28);background:rgba(11,19,32,.9);color:#e9edf5;cursor:pointer;display:flex;align-items:center;justify-content:center';
    ov.appendChild(fr); ov.appendChild(x); document.body.appendChild(ov);
    /* «atrás» cierra la lección y te deja en el portal (como el visor de capturas) */
    var tok='d'+Date.now(); try{ history.pushState({lmLibro:tok},''); }catch(e){}
    function cierra(porAtras){ window.removeEventListener('popstate',onPop); if(ov.parentNode) ov.parentNode.removeChild(ov);
      if(!porAtras){ try{ if(history.state && history.state.lmLibro===tok) history.back(); }catch(e){} } }
    function onPop(ev){ if(ev && ev.state && ev.state.lmLibro===tok) return; cierra(true); }
    window.addEventListener('popstate',onPop);
    x.onclick=function(){ cierra(false); };
    try{ if(typeof alAbrir==='function') alAbrir(); }catch(e){}
    return true;
  }
  window.LMLibroDigital = { abre:abre, url:url, DIGITAL:DIGITAL };
})();
