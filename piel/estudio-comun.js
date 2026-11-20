/* ============================================================================
   ESTUDIO POR FASES · AJUSTES COMUNES (Iago, 20-nov-2026)
   Lo cargan Ritmo at home (GE, ritmo.ge.lmathome.es) y Ritmo entonado at home (GP,
   ritmoentonado.gp.lmathome.es) al final de su index.html. Es lo mismo que lleva el visor de
   lecciones del libro (lecciones-libro/libro/libro.js), sacado aquí para no repetirlo:
   · piano más alto y acompañamiento más presente, con un acorde en cada compás;
   · puntuación de la realización final más generosa (latencia, 1 frame, verde ≤70 c, ámbar 0,6);
   · el piano ayuda un escalón más en la realización final; arpegio sin pararse arriba;
   · claqueta de 9/8, 6/8… solo con los pulsos;
   · anotar: intervalos rectos, octava alta/baja con «loco», y cualquier otro botón suelta la herramienta;
   · ventana del resultado en el centro, más clara, y cristal líquido al salir el ratón o tocar fuera;
   · GE: «✋ Marca el pulso con la mano» en la cuenta atrás (menos en la percusión);
   · «Iniciar estudio» en verde; sin scroll durante el estudio.
   Detalle de cada decisión: lmpro/_ESTUDIO-POR-FASES-UNIFICADO.md §11–§15.
   Deshacer: quitar la línea <script src=".../piel/estudio-comun.js"> del index.html del módulo.
   ============================================================================ */
(function(){
  'use strict';
  if(window.__ESTUDIO_COMUN) return; window.__ESTUDIO_COMUN=1;
  var GE=/\.ge\.lmathome\.es$/i.test(location.hostname) || /[?&]ge=1/.test(location.search);

  /* ---- dónde está la partitura y lo anotado (Ritmo / Ritmo entonado: #score + RP_ANOT; Entonación at home: #epScore) ---- */
  var ENT=false; try{ ENT=(typeof window.resolveNoteResults==='function' && !!document.getElementById('epScore')); }catch(e){}
  function scoreEl(){ return document.getElementById(ENT?'epScore':'score'); }
  var _anotSt=null;
  function anotStore(){ try{ if(!ENT && typeof RP_ANOT!=='undefined' && typeof currentLesson!=='undefined') return RP_ANOT.get(currentLesson); }catch(e){} return _anotSt; }
  function anotCtl(){ try{ if(typeof RP_ANOT_CTL!=='undefined' && RP_ANOT_CTL) return RP_ANOT_CTL; }catch(e){} try{ if(typeof EP!=='undefined' && EP && EP.anot) return EP.anot; }catch(e){} return null; }
  function ajustes(){
    /* claqueta en 9/8, 6/8…: solo los pulsos (sin el golpe de más que corresponde al compás fraccionario) */
    if(typeof window.subClicks==='function'){ var _sc=window.subClicks; window.subClicks=function(sched){ var out=_sc.apply(this,arguments);
        try{ if(subStepQ()!=null || !sched || !sched.measInfo) return out;
          var quitar=[]; sched.measInfo.forEach(function(mm){ if(mm.noMeter) return; var frac=Math.abs(mm.cap*2-Math.round(mm.cap*2))>1e-6; if(frac) return;
            out.forEach(function(o){ if(o.sub && o.q>=mm.q-1e-6 && o.q<mm.q+mm.cap-1e-6) quitar.push(o); }); });
          if(quitar.length) out=out.filter(function(o){ return quitar.indexOf(o)<0; }); }catch(e){}
        return out; }; }
    /* (13:32, Iago) el arpegio, con el mismo pulso que la escala: sin quedarse parado en la nota aguda */
    if(typeof window.rpOido==='function'){ var _ro=window.rpOido; window.rpOido=function(o){ if(o!=='a') return _ro.apply(this,arguments);
        try{ if(!currentLesson) return; stopPlayer(); ensurePiano(); var c=ac(); if(!c) return; var L=currentLesson, base=rpTonicaBase(), isMin=L.modo!=='mayor', st=0.4, t=c.currentTime+0.12;
          (isMin?[0,3,7,12,7,3,0]:[0,4,7,12,7,4,0]).forEach(function(x,i,arr){ pianoHit(base+x,t,(i===arr.length-1?st*1.6:st*0.9),0.12); t+=st; }); }catch(e){ return _ro.apply(this,arguments); } }; }
    /* (13:35, Iago) piano más alto; puntuación más amable; en la realización final el piano ayuda más */
    if(typeof window.pianoHit==='function'){ var _ph=window.pianoHit; window.pianoHit=function(m,t,d,g){ return _ph.call(this,m,t,d,(g||0.1)*2.0); }; }
    try{ if(typeof RPCFG!=='undefined'){ RPCFG.centsPerfect=RPCFG.centsPerfectLow=70; RPCFG.centsNear=RPCFG.centsNearLow=160; RPCFG.verdeSostenido=0; } }catch(e){}
    /* (20-nov 14:07, Iago: «la hice al 95-100 % y me marca 84; los niños se desmotivan») puntuación más generosa:
       · la voz llega al micro un poco tarde: el análisis se corre 0,1 s (cada frame se atribuye a la nota que de verdad estaba cantando);
       · una nota cuenta como cantada con un solo frame de voz (las semicorcheas apenas tienen 3 o 4);
       · verde si algún frame cae a ≤70 cents; ámbar (≤160) cuenta 0,6 en el porcentaje. */
    if(typeof window.rpEmpezar==='function'){ var _re=window.rpEmpezar; window.rpEmpezar=async function(){ var r=await _re.apply(this,arguments); try{ if(PR && PR.running && !PR._lat){ PR.body+=0.10; PR._lat=1; } }catch(e){} return r; }; }
    if(typeof window.rpResuelve==='function'){ window.rpResuelve=function(){ PR.notes.forEach(function(n){ var a=PR.acc[n.i];
        if(!a || !a.total){ n.res='red'; n.voiced=false; return; }
        n.voiced=a.voiced>=1 && a.voiced>=a.total*0.10;
        if(!n.voiced || a.bestCents==null){ n.res='red'; return; }
        n.res = a.bestCents<=RPCFG.centsPerfect ? 'green' : (a.bestCents<=RPCFG.centsNear ? 'amber' : 'red'); }); }; }
    window.lbPct=function(){ try{ var N=PR.notes.length||1, g=0; PR.notes.forEach(function(n){ g+= n.res==='green'?1:(n.res==='amber'?0.6:0); }); return Math.round(100*g/N); }catch(e){ return null; } };
    /* el acompañamiento, más presente (la tónica y la escala ya se oyen bien) */
    if(typeof window.padChord==='function'){ var _pc=window.padChord; window.padChord=function(m,t,d,g){ return _pc.call(this,m,t,d,(g||0.055)*1.8); }; }
    if(typeof window.rpAnaliza==='function'){ var _ra=window.rpAnaliza; var MAS={none:'sysStart',sysStart:'every2',every2:'every1',every1:'every1'};
      window.rpAnaliza=function(){ var r=_ra.apply(this,arguments);
        try{ if(!PR._lbVisto) PR._lbVisto={0:1}; Object.keys(PR.nivel||{}).forEach(function(k){ if(PR._lbVisto[k]) return; PR._lbVisto[k]=1; PR.nivel[k]=MAS[PR.nivel[k]]||PR.nivel[k]; }); }catch(e){}
        return r; }; }
    if(typeof window.rpEntrarPrueba==='function'){ var _ep=window.rpEntrarPrueba; window.rpEntrarPrueba=function(){ var r=_ep.apply(this,arguments); try{ PR._lbVisto={0:1}; }catch(e){} return r; }; }
    /* intervalos: trazo recto (del punto de partida al de llegada) */
    document.addEventListener('pointermove',function(){ try{ var stt=anotStore(); if(!stt) return;
        Object.keys(stt.pages||{}).forEach(function(k){ var L=stt.pages[k].strokes||[], sk=L[L.length-1]; if(sk && sk.i && sk.p && sk.p.length>2) sk.p.splice(1, sk.p.length-2); }); }catch(e){} }, true);
    document.addEventListener('pointerup',function(){ setTimeout(function(){ try{ var stt=anotStore(); if(!stt) return; var cambio=false;
        Object.keys(stt.pages||{}).forEach(function(k){ (stt.pages[k].strokes||[]).forEach(function(sk){ if(sk.i && sk.p && sk.p.length>2){ sk.p.splice(1, sk.p.length-2); cambio=true; } }); });
        var cc=anotCtl(); if(cambio && cc && cc.refit) cc.refit(); }catch(e){} },0); }, true);
  }

  /* ================= (20-nov 13:11, Iago) OCTAVA ALTA / BAJA para anotar (para todos) =================
     Dos botones bajo las alertas. Toque = «8va↑» (o «8va↓»); pulsar y arrastrar = «8va↑» + línea discontinua horizontal
     hasta donde sueltes + «loco» en diagonal (vuelta a la normalidad). Se guarda con lo anotado (store.oct). */
  var OCT={on:null, ultimo:null};
  var OCT_CSS='.lb-oct-capa{position:absolute;inset:0;pointer-events:none;z-index:6}.lb-oct-capa span{position:absolute;white-space:nowrap;font-family:"Times New Roman",Times,serif;font-style:italic;font-weight:700;color:#0b3a8f;line-height:1}'
    +'.lb-oct-capa i{position:absolute;border-top:2px dashed #0b3a8f;height:0}.lb-oct-capa .loco{transform:translateY(-50%);margin-left:5px}'
    +'#rpAnotBar .lb-oct{font:800 12px/1 "Helvetica Neue",Arial,sans-serif;color:#e2e8f0}#rpAnotBar .lb-oct.on{background:#16a34a!important;color:#fff}';
  function octStore(){ try{ var st=anotStore(); if(!st) return null; if(!st.oct) st.oct=[]; return st.oct; }catch(e){ return null; } }
  function octCapa(){ var sc=scoreEl(); if(!sc) return null; if(getComputedStyle(sc).position==='static') sc.style.position='relative';
    var c=sc.querySelector(':scope > .lb-oct-capa'); if(!c){ c=document.createElement('div'); c.className='lb-oct-capa'; sc.appendChild(c); } return c; }
  function octPinta(prev){ var c=octCapa(), L=octStore(); if(!c||!L) return; var sc=scoreEl(); var W=sc.clientWidth||1000, fs=Math.max(11,Math.min(22,W*0.016));
    var h=''; L.concat(prev?[prev]:[]).forEach(function(m){ var txt=m.t==='a'?'8va↑':'8va↓';
      h+='<span style="left:'+(m.x0*100)+'%;top:'+(m.y*100)+'%;font-size:'+fs+'px;transform:translateY(-50%)">'+txt+'</span>';
      if(m.x1!=null && m.x1>m.x0+0.005){ var xs=m.x0+(fs*2.6)/W; h+='<i style="left:'+(xs*100)+'%;width:'+Math.max(0,(m.x1-xs)*100)+'%;top:'+(m.y*100)+'%"></i>';
        if(!m.vivo) h+='<span class="loco" style="left:'+(m.x1*100)+'%;top:'+(m.y*100)+'%;font-size:'+(fs*0.95)+'px">loco</span>'; } });
    c.innerHTML=h; }
  function octBotones(){ var bar=document.getElementById('rpAnotBar'); if(!bar || bar.querySelector('.lb-oct')) return;
    var ar=bar.querySelector('[data-t="ar"]'); if(!ar) return;
    [['b','8va↓','Octava baja · toca: «8va↓» · arrastra: línea hasta donde vuelve a «loco»'],['a','8va↑','Octava alta · toca: «8va↑» · arrastra: línea hasta donde vuelve a «loco»']].forEach(function(o){
      var b=document.createElement('button'); b.type='button'; b.className='rpv-b lb-oct'; b.dataset.oct=o[0]; b.title=o[2]; b.setAttribute('aria-label',o[2]); b.innerHTML=o[1];
      b.onclick=function(e){ e.stopPropagation(); var ya=(OCT.on===o[0]); OCT.on=ya?null:o[0];
        bar.querySelectorAll('.lb-oct').forEach(function(x){ x.classList.toggle('on', x.dataset.oct===OCT.on); });
        if(OCT.on) bar.querySelectorAll('.anot-b.on').forEach(function(x){ x.classList.remove('on'); }); };
      ar.parentNode.insertBefore(b, ar.nextSibling); });
    bar.addEventListener('click',function(e){ var b=e.target.closest('.anot-b'); if(!b) return; OCT.on=null; bar.querySelectorAll('.lb-oct').forEach(function(x){ x.classList.remove('on'); });
      var t=b.getAttribute('data-t');
      if(t==='undo' && OCT.ultimo==='oct'){ var L=octStore(); if(L&&L.length){ L.pop(); octPinta(); } OCT.ultimo=null; e.stopImmediatePropagation(); e.preventDefault(); }
      if(t==='clear'){ setTimeout(function(){ try{ var st=anotStore(), vacio=Object.keys(st.pages||{}).every(function(k){ return !(st.pages[k].strokes||[]).length; }); if(vacio && st.oct && st.oct.length){ st.oct.length=0; octPinta(); } }catch(x){} },80); }
    }, true);
  }
  function octArranca(){
    var st=document.createElement('style'); st.textContent=OCT_CSS; document.head.appendChild(st);
    if(typeof window.rpAnotarMontar==='function'){ var _ram=window.rpAnotarMontar; window.rpAnotarMontar=function(ov,store){ _anotSt=store; return _ram.apply(this,arguments); }; }
    if(typeof window.epAnotarMontar==='function'){ var _eam=window.epAnotarMontar; window.epAnotarMontar=function(){ var r=_eam.apply(this,arguments); try{ OCT.on=null; octBotones(); octPinta(); }catch(e){} return r; }; }
    if(typeof window.rpAnotarMontar_==='function'){ var _m=window.rpAnotarMontar_; window.rpAnotarMontar_=function(){ var r=_m.apply(this,arguments); try{ OCT.on=null; octBotones(); octPinta(); }catch(e){} return r; }; }
    var _rl=window.renderLesson; if(typeof _rl==='function') window.renderLesson=function(){ var r=_rl.apply(this,arguments); setTimeout(function(){ try{ octPinta(); }catch(e){} },30); return r; };
    window.addEventListener('resize',function(){ setTimeout(function(){ try{ octPinta(); }catch(e){} },250); });
    /* (20-nov 14:03, Iago) pulsar cualquier otro control (Pistas, ayuda del piano, Tónica…, fases) suelta la herramienta de anotar que estuviera puesta (octava o lápiz) */
    document.addEventListener('pointerdown',function(e){ try{ var t=e.target; if(!t || !t.closest) return;
      var ctl=t.closest('button,select,[role="button"],.rp-paso,.rp-ayudasel,label'); if(!ctl) return;
      if(ctl.closest('#rpAnotBar')) return;
      if(OCT.on){ OCT.on=null; document.querySelectorAll('#rpAnotBar .lb-oct.on').forEach(function(x){ x.classList.remove('on'); }); }
      var cc=anotCtl(); if(cc && cc.suelta) cc.suelta();
    }catch(x){} },true);
    var vivo=null;
    document.addEventListener('pointerdown',function(e){ var sc=scoreEl(); if(!sc || !sc.contains(e.target)) return;
      var r=sc.getBoundingClientRect(), nx=(e.clientX-r.left)/r.width, ny=(e.clientY-r.top)/r.height;
      var goma=document.querySelector('#rpAnotBar .anot-b.on[data-t="goma"]');
      if(goma && !OCT.on){ var L=octStore(); if(L){ var antes=L.length; for(var i=L.length-1;i>=0;i--){ var m=L[i], x1=(m.x1!=null?m.x1:m.x0+0.05);
            if(Math.abs(ny-m.y)<0.03 && nx>=m.x0-0.01 && nx<=x1+0.04) L.splice(i,1); } if(L.length!==antes) octPinta(); } return; }
      if(!OCT.on) { OCT.ultimo='eng'; return; }
      e.stopPropagation(); e.preventDefault();
      vivo={t:OCT.on, x0:Math.max(0,Math.min(1,nx)), y:Math.max(0,Math.min(1,ny)), sx:e.clientX, vivo:true}; octPinta(vivo);
      var mover=function(ev){ if(!vivo) return; ev.preventDefault(); if(Math.abs(ev.clientX-vivo.sx)>8){ vivo.x1=Math.max(vivo.x0,Math.min(1,(ev.clientX-r.left)/r.width)); } octPinta(vivo); };
      var soltar=function(ev){ document.removeEventListener('pointermove',mover,true); document.removeEventListener('pointerup',soltar,true); document.removeEventListener('pointercancel',soltar,true);
        if(!vivo) return; var m={t:vivo.t, x0:+vivo.x0.toFixed(4), y:+vivo.y.toFixed(4)}; if(vivo.x1!=null && vivo.x1>vivo.x0+0.01) m.x1=+vivo.x1.toFixed(4); vivo=null;
        if(ev.type!=='pointercancel'){ var L=octStore(); if(L){ L.push(m); OCT.ultimo='oct'; } } octPinta(); };
      document.addEventListener('pointermove',mover,true); document.addEventListener('pointerup',soltar,true); document.addEventListener('pointercancel',soltar,true);
    }, true);
  }
  /* (20-nov 13:11, Iago) acompañamiento: como mínimo un acorde que SUENE en cada compás (el que se mantiene se vuelve a atacar en la parte fuerte) */
  function acompArranca(){ if(typeof window.buildAccompaniment!=='function') return; var _ba=window.buildAccompaniment;
    window.buildAccompaniment=function(L){ var r=_ba.apply(this,arguments);
      try{ var ini=[], q=0; L.phrases.forEach(function(ph){ ph.measures.forEach(function(m){ ini.push(q); q+=meterCapQ(m.time); }); });
        var out=[]; (r.chords||[]).forEach(function(c){ var cortes=ini.filter(function(x){ return x>c.startQ+1e-6 && x<c.endQ-1e-6; }); var a=c.startQ;
          cortes.concat([c.endQ]).forEach(function(b){ out.push(Object.assign({},c,{startQ:a,endQ:b,midis:c.midis.slice()})); a=b; }); });
        r.chords=out; }catch(e){ console.warn('[libro] acompañamiento',e); }
      return r; }; }

  /* ---- ventana del resultado: centro, más clara, cristal líquido ---- */
  var RES_CSS='#phaseBannerHost .tap-fb.rp-res{position:fixed!important;left:50%!important;top:50%!important;transform:translate(-50%,-50%)!important;margin:0!important;z-index:2147480001;width:min(560px,92vw);max-width:92vw;box-sizing:border-box;background:rgba(10,16,28,.66)!important;-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px);transition:background .35s,backdrop-filter .35s,box-shadow .35s}'
    +'#phaseBannerHost .tap-fb.rp-res,#phaseBannerHost .tap-fb.rp-res p,#phaseBannerHost .tap-fb.rp-res .fb-step{color:#eef2f7!important}#phaseBannerHost .tap-fb.rp-res .rp-estim{color:#cbd5e1!important}#phaseBannerHost .tap-fb.rp-res .fb-step{color:#93c5fd!important}'
    +'#phaseBannerHost .tap-fb.rp-res.liquido{background:rgba(255,255,255,.06)!important;-webkit-backdrop-filter:blur(1.5px) saturate(1.3);backdrop-filter:blur(1.5px) saturate(1.3);box-shadow:inset 0 0 0 1px rgba(255,255,255,.35),0 8px 30px rgba(0,0,0,.18)!important}'
    +'#phaseBannerHost .tap-fb.rp-res.liquido *{text-shadow:0 1px 3px rgba(0,0,0,.85),0 0 8px rgba(0,0,0,.6)}'
    /* sin scroll mientras se estudia: todo cabe en la pantalla */
    +'html:has(body.rp-estudio),body.rp-estudio{overflow:hidden!important;overscroll-behavior:none}'
    /* «Iniciar estudio» en verde, que se vea claro */
    +'#studyBtn{background:rgba(22,163,74,.95)!important;border:1px solid #4ade80!important;color:#fff!important;font-weight:800!important;box-shadow:0 4px 16px rgba(22,163,74,.35)!important}#studyBtn:hover{background:#22c55e!important}#studyBtn svg{stroke:#fff}';
  function resultado(){
    var st=document.createElement('style'); st.textContent=RES_CSS; document.head.appendChild(st);
    if(typeof window.rpResultado==='function'){ var _rr=window.rpResultado; window.rpResultado=function(pct,micProb,cortada,ayuda){
        try{ var pp=window.lbPct&&window.lbPct(); if(pp!=null && !cortada) pct=pp; }catch(e){}
        var r=_rr.call(this,pct,micProb,cortada,ayuda);
        try{ var card=document.querySelector('#phaseBannerHost .tap-fb.rp-res'); if(card && !card._liq){ card._liq=1;
            card.addEventListener('mouseleave',function(){ card.classList.add('liquido'); }); card.addEventListener('mouseenter',function(){ card.classList.remove('liquido'); });
            var f=function(ev){ if(!document.body.contains(card)){ document.removeEventListener('pointerdown',f,true); return; } if(card.contains(ev.target)) card.classList.remove('liquido'); else card.classList.add('liquido'); };
            document.addEventListener('pointerdown',f,true); } }catch(e){}
        return r; }; }
  }
  /* ---- GE: «Marca el pulso con la mano» en la cuenta atrás (menos en la percusión) ---- */
  function mano(){
    if(!GE || typeof window.showCountdown!=='function') return;
    var _scd=window.showCountdown, _hcd=window.hideCountdown;
    var aviso=function(){ var a=document.getElementById('lbMano'); if(!a){ a=document.createElement('div'); a.id='lbMano';
        a.style.cssText='position:fixed;left:50%;top:calc(50dvh + 92px);transform:translateX(-50%);z-index:91;padding:9px 18px;border-radius:10px;background:rgba(22,163,74,.95);border:1px solid #4ade80;color:#fff;font:800 17px/1.2 var(--lm-fuente,"Helvetica Neue",Helvetica,Arial,sans-serif);white-space:nowrap;box-shadow:0 6px 24px rgba(0,0,0,.4);pointer-events:none;display:none';
        a.textContent='✋ Marca el pulso con la mano'; document.body.appendChild(a); } return a; };
    window.showCountdown=function(cd,n){ var r=_scd.apply(this,arguments); try{ var ph=(typeof phaseList!=='undefined' && phaseList[phaseIdx])||{}; aviso().style.display=(typeof studyMode!=='undefined' && studyMode && ph.id!=='ritmo')?'block':'none'; }catch(e){} return r; };
    if(typeof _hcd==='function') window.hideCountdown=function(){ var r=_hcd.apply(this,arguments); try{ var a=document.getElementById('lbMano'); if(a) a.style.display='none'; }catch(e){} return r; };
  }

  /* ---- Entonación at home (motor propio: ATT / PCFG / showAttemptResult / showClack) ---- */
  function entonacion(){
    if(!ENT) return;
    var st=document.createElement('style'); st.textContent=
      'html:has(body.ep-estudio),body.ep-estudio{overflow:hidden!important;overscroll-behavior:none}'
      +'.ep-res{background:rgba(255,255,255,.74)!important;-webkit-backdrop-filter:blur(6px)!important;backdrop-filter:blur(6px)!important;transition:background .35s,backdrop-filter .35s,box-shadow .35s}'
      +'.ep-res.liquido{background:rgba(255,255,255,.08)!important;-webkit-backdrop-filter:blur(1.5px) saturate(1.3)!important;backdrop-filter:blur(1.5px) saturate(1.3)!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.6),0 8px 30px rgba(20,30,60,.15)!important}'
      +'.ep-res.liquido *{text-shadow:0 0 6px #fff,0 0 3px #fff}';
    document.head.appendChild(st);
    try{ PCFG.centsPerfect=PCFG.centsPerfectLow=70; PCFG.centsNear=PCFG.centsNearLow=160; PCFG.verdeSostenido=0; }catch(e){}
    window.resolveNoteResults=function(){ ATT.notes.forEach(function(n){ var a=ATT._sampleAcc[n.headIdx];
        if(!a || !a.total){ n.result='red'; n.voiced=false; return; }
        n.voiced=a.voiced>=1 && a.voiced>=a.total*0.10;
        if(!n.voiced || a.bestCents==null){ n.result='red'; return; }
        n.result = a.bestCents<=PCFG.centsPerfect ? 'green' : (a.bestCents<=PCFG.centsNear ? 'amber' : 'red'); }); };
    if(typeof window.analyzeAttemptFrame==='function'){ var _af=window.analyzeAttemptFrame; window.analyzeAttemptFrame=function(){
        try{ if(ATT.running && ATT._t0Perf && ATT._latDe!==ATT._t0Perf){ ATT._t0Perf+=100; ATT._latDe=ATT._t0Perf; } }catch(e){} return _af.apply(this,arguments); }; }
    if(typeof window.showAttemptResult==='function'){ var _sr=window.showAttemptResult; window.showAttemptResult=function(pct,mic,cut,help){
        try{ if(!cut){ var N=ATT.notes.length||1, g=0; ATT.notes.forEach(function(n){ g+= n.result==='green'?1:(n.result==='amber'?0.6:0); }); pct=Math.round(100*g/N); } }catch(e){}
        var r=_sr.call(this,pct,mic,cut,help);
        try{ var card=document.querySelector('#resultOverlay .ep-res'); if(card){
            card.addEventListener('mouseleave',function(){ card.classList.add('liquido'); }); card.addEventListener('mouseenter',function(){ card.classList.remove('liquido'); });
            var f=function(ev){ if(!document.body.contains(card)){ document.removeEventListener('pointerdown',f,true); return; } if(card.contains(ev.target)) card.classList.remove('liquido'); else card.classList.add('liquido'); };
            document.addEventListener('pointerdown',f,true); } }catch(e){}
        return r; }; }
    if(typeof window.padPlayChord==='function'){ var _pp=window.padPlayChord; window.padPlayChord=function(ctx,dest,voices,t,d,g){ return _pp.call(this,ctx,dest,voices,t,d,(g||0.03)*1.8); }; }

    /* (15:25, Iago) el arpegio de Entonación at home se quedaba enganchado en la nota aguda: mismo pulso que la escala */
    if(typeof window.epOido==='function'){ var _eo=window.epOido; window.epOido=function(o){ if(o!=='a') return _eo.apply(this,arguments);
        try{ ensureAudioEngine(); ensureSoundfont().then(function(sf){ if(!sf) return; try{ sf.stop(); }catch(e){}
            var ctx=EDIT.ac; if(ctx && ctx.state==='suspended'){ try{ ctx.resume(); }catch(e){} }
            var L=STU.lesson, base=L.key.tonicMidi, isMin=L.key.mode==='minor', st=0.4, t=ctx.currentTime+0.12;
            (isMin?[0,3,7,12,7,3,0]:[0,4,7,12,7,4,0]).forEach(function(x,i,arr){ try{ sf.play(base+x,t,{duration:(i===arr.length-1?st*1.6:st*0.9)}); }catch(e){} t+=st; }); });
        }catch(e){ return _eo.apply(this,arguments); } }; }
    /* «Marca el pulso con la mano» en la cuenta atrás */
    if(typeof window.showClack==='function'){ var _sc=window.showClack; window.showClack=function(n){ var r=_sc.apply(this,arguments);
        try{ var ov=document.getElementById('clackOverlay'); if(ov && !ov.querySelector('.lb-mano')){ var a=document.createElement('div'); a.className='lb-mano';
            a.style.cssText='position:absolute;left:50%;top:calc(50% + 100px);transform:translateX(-50%);padding:9px 18px;border-radius:10px;background:rgba(37,99,235,.95);border:1px solid #93c5fd;color:#fff;font:800 17px/1.2 var(--lm-fuente,"Helvetica Neue",Helvetica,Arial,sans-serif);white-space:nowrap;box-shadow:0 6px 24px rgba(0,0,0,.4)';
            a.textContent='✋ Marca el pulso con la mano'; if(getComputedStyle(ov).position==='static') ov.style.position='fixed'; ov.appendChild(a); } }catch(e){}
        return r; }; }
  }

  /* (16:21, Iago) al empezar el estudio, la página vuelve arriba: si estaba bajada, con el «sin scroll» se quedaban ocultos el reloj y las fases */
  function arriba(){
    var sube=function(){ try{ window.scrollTo(0,0); document.documentElement.scrollTop=0; document.body.scrollTop=0; }catch(e){} };
    ['openStudy','openAccompaniment','showPhase','rpEncaja'].forEach(function(fn){ if(typeof window[fn]==='function'){ var o=window[fn]; window[fn]=function(){ sube(); var r=o.apply(this,arguments); sube(); setTimeout(sube,60); return r; }; } });
    /* (16:21, Iago) a los alumnos solo «Iniciar estudio»: «Prueba directa» y el dado, solo en las cuentas de Iago */
    if(!ENT && document.getElementById('studyBtn')){
      var st=document.createElement('style'); st.textContent='body:not(.lb-profe) #accompBtn,body:not(.lb-profe) #genBtn{display:none!important}'; document.head.appendChild(st);
      var mira=function(){ try{ if(typeof rpEsTesterCuenta==='function' && rpEsTesterCuenta()) document.body.classList.add('lb-profe'); }catch(e){} };
      mira(); setTimeout(mira,1500); setTimeout(mira,4000);
    }
  }
  /* (20-nov 17:24, Iago) los pads verdes de la tablet (cuando no hay barra espaciadora) tapaban la partitura: van a los LADOS de
     la pantalla, centrados en alto, en el sitio de las columnas de anotar (que se esconden mientras tocas). */
  function pads(){
    var st=document.createElement('style'); st.id='lbPadsCss';
    st.textContent='.rhythm-pads{position:fixed!important;left:0!important;top:0!important;right:0!important;bottom:0!important;z-index:60!important;pointer-events:none}'
      +'.rhythm-pads .rpad{position:fixed!important;bottom:auto!important;top:calc(50% - 46px)!important}.rhythm-pads .rpad.l{left:10px!important}.rhythm-pads .rpad.r{right:10px!important}'
      +'body.lb-pads #rpAnotBar,body.lb-pads #rpTonRow{visibility:hidden!important}'   /* mientras tocas, los pads ocupan el sitio de las columnas de anotar */
      +'body.lb-pads #scoreWrap{padding-left:112px!important;padding-right:112px!important;box-sizing:border-box}';
    document.head.appendChild(st);
    var hay=false, mira=function(){ var h=!!document.querySelector('.rhythm-pads'); if(h===hay) return; hay=h; document.body.classList.toggle('lb-pads',h);
      setTimeout(function(){ try{ window.dispatchEvent(new Event('resize')); }catch(e){} },30); };
    try{ new MutationObserver(mira).observe(document.body,{childList:true,subtree:true}); }catch(e){}
  }
  /* (20-nov, tareas P2 · 5 y 8) Carteles y ventanas en CRISTAL: se intuye el fondo del conservatorio (desenfocado, la lección no
     se lee) en vez del negro opaco. «Iniciar estudio» centrado arriba (verde en ritmo; azul en entonación). */
  function cristal(){
    var st=document.createElement('style'); st.id='lbCristalCss';
    st.textContent='.rp-cartel,#phaseBannerHost .phase-cardscrim.rp-cartel{background:rgba(6,10,18,.46)!important;-webkit-backdrop-filter:blur(22px) saturate(1.1)!important;backdrop-filter:blur(22px) saturate(1.1)!important}'
      +'.rp-cartel .phase-banner{background:rgba(12,18,30,.66)!important;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);border-color:rgba(255,255,255,.18)!important;box-shadow:0 18px 50px rgba(0,0,0,.35)!important}'
      +'.modal-bg,.cell-modal-bg{background:rgba(6,10,24,.4)!important;-webkit-backdrop-filter:blur(18px)!important;backdrop-filter:blur(18px)!important}'
      +'.modal,.cell-modal{background:rgba(12,18,30,.7)!important;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}'
      +'body:not(.rp-estudio) .topbar:has(> #barActions){justify-content:center!important}body:not(.rp-estudio) .topbar > #barActions{margin-left:auto!important;margin-right:auto!important}'
      +'body.rp-ent #studyBtn{background:#2563eb!important;border-color:#60a5fa!important;color:#fff!important}';
    document.head.appendChild(st);
  }
  /* (20-nov, tareas P2 · 9 y P3 · 14) Cada cartel recuerda que puedes bajar la velocidad y elegir la subdivisión; y en los
     carteles con tiempo el botón dice «Entendido e iniciar tiempo». */
  function carteles(){
    if(typeof window.rpVelAviso==='function'){ var _va=window.rpVelAviso;
      window.rpVelAviso=function(extra){ var d=_va.apply(this,arguments);
        try{ var t=d.querySelector('.rp-va-t'); if(t && !/subdivisi/i.test(t.textContent)) t.insertAdjacentHTML('beforeend',' Si te ayuda, elige también la <b>subdivisión</b> (corcheas o semicorcheas) en la claqueta.'); }catch(e){}
        return d; }; }
    var pon=function(){ document.querySelectorAll('.rp-cartel').forEach(function(c){
      if(c.__lbHecho) return; c.__lbHecho=1;
      if(!/minutos?\b/i.test(c.textContent||'')) return;
      var b=c.querySelector('.pb-go'); if(!b || /iniciar tiempo/i.test(b.textContent)) return;
      if(/^\s*Entendido\s*$/i.test(b.textContent)){ var svg=b.querySelector('svg'); b.textContent=''; if(svg) b.appendChild(svg); b.appendChild(document.createTextNode('Entendido e iniciar tiempo')); }
    }); };
    try{ new MutationObserver(pon).observe(document.body,{childList:true,subtree:true}); }catch(e){}
  }
  function arranca(){
    try{ ajustes(); }catch(e){ console.warn('[estudio-comun] ajustes',e); }
    try{ octArranca(); }catch(e){ console.warn('[estudio-comun] octava',e); }
    try{ acompArranca(); }catch(e){ console.warn('[estudio-comun] acompañamiento',e); }
    try{ resultado(); }catch(e){ console.warn('[estudio-comun] resultado',e); }
    try{ mano(); }catch(e){ console.warn('[estudio-comun] mano',e); }
    try{ entonacion(); }catch(e){ console.warn('[estudio-comun] entonación',e); }
    try{ arriba(); }catch(e){ console.warn('[estudio-comun] arriba',e); }
    try{ pads(); }catch(e){ console.warn('[estudio-comun] pads',e); }
    try{ cristal(); }catch(e){ console.warn('[estudio-comun] cristal',e); }
    try{ carteles(); }catch(e){ console.warn('[estudio-comun] carteles',e); }
    try{ var sb=document.getElementById('studyBtn'); if(sb){ var svg=sb.querySelector('svg'); sb.innerHTML=''; if(svg) sb.appendChild(svg); sb.appendChild(document.createTextNode(' Iniciar estudio')); } }catch(e){}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',arranca); else arranca();
})();
