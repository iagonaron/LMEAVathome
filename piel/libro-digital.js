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
    GE: { base:'https://ge.lmathome.es/lecciones-libro/?grado=4ge&libro=', n:[13,16,17,19,23,24,26,28,31,32,33,34,36,37,38,39,40,41,42,43,46,47,50,52,54,57,63,65,67,73,74,78,79,81,86,87,96,99,104,106,107,108,109,111,112,113,119,124,133,143,148,159,161,162] },
    GP: { base:'https://gp.lmathome.es/lecciones-libro/?grado=2gp&libro=', n:[10,11,12,14,16,17,18,21,22,38,39,46,47,49,51,53,54,57,58,62,67,75,81,82,85,90,93,96,101,102,106,107,108,109,117,118,120,122,123,127,128,130,133,135,140,141,149,152,153,206,211,213,217] }
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
  /* (20-nov 16:30, Iago) LECCIONES A EVALUAR: en la clase de evaluación, las lecciones de ritmo (GE) o ritmo entonado (GP) a
     pantalla completa, solo para mirar, con los apuntes que Iago hizo en clase con ESE grupo; un botón por lección abajo. */
  function digitales(nums){ var d=DIGITAL[portal()]; return (nums||[]).map(function(x){ return parseInt(x,10); }).filter(function(n,i,a){ return n>0 && a.indexOf(n)===i && d && d.n.indexOf(n)>=0; }); }
  function abreEvaluar(nums){ nums=digitales(nums); if(!nums.length) return false;
    var s=ses(), d=DIGITAL[portal()];
    var u=d.base+nums[0]+'&evaluar='+nums.join(',')+(s&&s.id?'&cuenta='+encodeURIComponent(s.id):'');
    var real=url; url=function(){ return u; }; try{ return abre(null,'leccion_'+nums[0],'Lecciones a evaluar'); } finally { url=real; } }
  function aEvaluar(){ var out=[];
    try{ var E=window.LMEscaleta; if(E && E.vista && E.formatea){ var v=E.vista(); (v.bloques||[]).forEach(function(b){ var f=E.formatea(b, v.grupo)||{};
        if(/^Evaluaci/.test(f.t||'')){ var L=(b.lecs&&b.lecs.length)?b.lecs:(String(f.s||'').match(/\d+/g)||[]); L.forEach(function(n){ out.push(parseInt(n,10)); }); } }); } }catch(e){}
    if(!out.length){ try{ document.querySelectorAll('[data-parte^="leccion_"]').forEach(function(el){ var n=numDe(el.getAttribute('data-parte')); if(n) out.push(n); }); }catch(e){} }
    return digitales(out); }
  /* (20-nov 17:24, Iago) «que se pueda ver en la ventana… y yo seleccionar las que están»: selector con todas las lecciones en
     digital (las de la evaluación de hoy ya marcadas); eliges las que quieras y «Abrir». */
  function elegir(){
    var d=DIGITAL[portal()]; if(!d) return;
    var pre=aEvaluar(), sel=pre.slice();
    var old=document.getElementById('lm-lib-elige'); if(old) old.remove();
    var ov=document.createElement('div'); ov.id='lm-lib-elige';
    ov.style.cssText='position:fixed;inset:0;z-index:100004;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.35);font-family:"Helvetica Neue",Arial,sans-serif';
    var bx=document.createElement('div');
    bx.style.cssText='width:min(560px,92vw);max-height:86vh;overflow:auto;padding:18px;border-radius:14px;background:rgba(12,18,30,.86);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.2);color:#e9edf5';
    bx.innerHTML='<div style="font-family:inherit;font-weight:800;font-size:17px;line-height:1.2;margin-bottom:4px">Lecciones a evaluar</div><div style="font-family:inherit;font-weight:500;font-size:13px;line-height:1.35;color:#9fb0c8;margin-bottom:12px">Marca las que vas a evaluar. Se ven con tus apuntes de clase de este grupo.</div>';
    var g=document.createElement('div'); g.style.cssText='display:grid;grid-template-columns:repeat(auto-fill,minmax(52px,1fr));gap:6px';
    function pinta(b,n){ var on=sel.indexOf(n)>=0; b.style.background=on?'#16a34a':'transparent'; b.style.borderColor=on?'#4ade80':'rgba(255,255,255,.25)'; }
    d.n.slice().sort(function(a,b){return a-b;}).forEach(function(n){ var b=document.createElement('button'); b.type='button'; b.textContent=n;
      b.style.cssText='height:40px;border-radius:8px;border:1px solid;color:#fff;font-family:inherit;font-weight:800;font-size:15px;line-height:1;cursor:pointer'; pinta(b,n);
      b.onclick=function(){ var i=sel.indexOf(n); if(i>=0) sel.splice(i,1); else sel.push(n); pinta(b,n); ok.disabled=!sel.length; ok.style.opacity=sel.length?1:.45; };
      g.appendChild(b); });
    bx.appendChild(g);
    var pie=document.createElement('div'); pie.style.cssText='display:flex;justify-content:flex-end;gap:8px;margin-top:14px';
    var no=document.createElement('button'); no.type='button'; no.textContent='Cancelar';
    no.style.cssText='height:40px;padding:0 16px;border-radius:9px;border:1px solid rgba(255,255,255,.28);background:transparent;color:#e9edf5;font-family:inherit;font-weight:700;font-size:14px;line-height:1;cursor:pointer';
    var ok=document.createElement('button'); ok.type='button'; ok.textContent='Abrir';
    ok.style.cssText='height:40px;padding:0 22px;border-radius:9px;border:1px solid #4ade80;background:#16a34a;color:#fff;font-family:inherit;font-weight:800;font-size:14px;line-height:1;cursor:pointer';
    ok.disabled=!sel.length; ok.style.opacity=sel.length?1:.45;
    no.onclick=function(){ ov.remove(); }; ov.onclick=function(e){ if(e.target===ov) ov.remove(); };
    ok.onclick=function(){ if(!sel.length) return; ov.remove(); abreEvaluar(sel.slice().sort(function(a,b){return a-b;})); };
    pie.appendChild(no); pie.appendChild(ok); bx.appendChild(pie); ov.appendChild(bx); document.body.appendChild(ov);
  }
  window.LMLibroDigital = { abre:abre, url:url, DIGITAL:DIGITAL, abreEvaluar:abreEvaluar, aEvaluar:aEvaluar, digitales:digitales, elegir:elegir };
})();
