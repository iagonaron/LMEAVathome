/* (13-nov-2026, C0 · Iago) EL 👍 DE IAGO, LA PRIMERA VEZ QUE SE VE EN LA CAMPANA
   Al abrir las notificaciones con un «A Iago le ha gustado» sin leer: el pulgar late con la campanita y, un segundo
   después, cae el sello «verificado» con su golpe (un poco de polvo y la tarjeta vibra un instante). Sutil, breve y
   una sola vez por aviso (se apunta en este navegador). Volumen bajo. Sin animación si el sistema pide menos movimiento.
   Lo cargan los portales GE y GP (<script … mg-anim.js> en su index.html).
   Quitar: borrar ese <script> de los dos index.html (y, si se quiere, este fichero y sfx/mg-*.mp3). */
(function () {
  if (window.__lmMgAnim) return; window.__lmMgAnim = 1;
  var BASE = 'https://ge.lmathome.es/piel/avisos/actitud/sfx/';
  var KEY = 'lm_mg_anim_vistos';
  var VOL_DING = 0.22, VOL_SELLO = 0.32;
  var menos = false; try { menos = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  function vistos() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function apunta(id) { try { var v = vistos(); if (v.indexOf(id) < 0) v.push(id); localStorage.setItem(KEY, JSON.stringify(v.slice(-80))); } catch (e) {} }

  var aud = {};
  function prepara(n) { try { if (!aud[n]) { aud[n] = new Audio(BASE + n); aud[n].preload = 'auto'; } } catch (e) {} }
  function suena(n, vol) { try { prepara(n); var a = aud[n]; a.volume = vol; a.currentTime = 0; var p = a.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {} }
  prepara('mg-ding.mp3'); prepara('mg-sello.mp3');

  /* el sello no se ve hasta que «cae» (regla por aviso, para que sobreviva si la lista se repinta) */
  var hoja = document.createElement('style'); (document.head || document.documentElement).appendChild(hoja);
  var ocultos = {};
  function pintaReglas() {
    hoja.textContent = Object.keys(ocultos).map(function (id) { return '.alu-item[data-id="' + id + '"] .mgv-sello{opacity:0!important}'; }).join('\n')
      + '\n.lm-mg-polvo{position:absolute;width:6px;height:6px;border-radius:50%;background:rgba(226,232,240,.55);pointer-events:none;z-index:6}'
      + '\n.lm-mg-onda{position:absolute;width:96px;height:96px;margin:-48px 0 0 -48px;border-radius:50%;border:2px solid rgba(255,255,255,.28);pointer-events:none;z-index:6}';
  }
  pintaReglas();

  function nodo(id) { return document.querySelector('.alu-item.mgv[data-id="' + id + '"]'); }
  var enMarcha = {};

  function anima(id) {
    if (enMarcha[id]) return; enMarcha[id] = 1; apunta(id);
    if (menos) { delete ocultos[id]; pintaReglas(); return; }
    /* 1) el pulgar late con la campanita */
    setTimeout(function () {
      var c = nodo(id), t = c && c.querySelector('.cv2-tile');
      suena('mg-ding.mp3', VOL_DING);
      if (t && t.animate) {
        t.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.35) rotate(-10deg)', offset: .3 }, { transform: 'scale(.95)', offset: .6 }, { transform: 'scale(1)' }],
          { duration: 900, easing: 'ease-out' });
        t.animate([{ boxShadow: '0 0 0 0 rgba(96,165,250,.55)' }, { boxShadow: '0 0 0 14px rgba(96,165,250,0)' }], { duration: 900, easing: 'ease-out' });
      }
    }, 250);
    /* 2) un segundo largo después de que acabe el pulgar, el sello cae: golpe, polvo y la tarjeta vibra un instante */
    setTimeout(function () {
      var c = nodo(id), s = c && c.querySelector('.mgv-sello');
      delete ocultos[id]; pintaReglas();
      if (!s || !s.animate) return;
      var base = 'translate(-50%,-50%) ';
      s.animate([{ transform: base + 'scale(2.4) rotate(-26deg)', opacity: 0 },
                 { transform: base + 'scale(.9) rotate(-11deg)', opacity: .7, offset: .72 },
                 { transform: base + 'scale(1.03) rotate(-12deg)', opacity: .5, offset: .86 },
                 { transform: base + 'scale(1) rotate(-12deg)', opacity: .45 }],
        { duration: 340, easing: 'cubic-bezier(.3,.0,.7,1)' });
      setTimeout(function () {
        suena('mg-sello.mp3', VOL_SELLO);
        var c2 = nodo(id) || c;
        if (c2 && c2.animate) c2.animate([{ transform: 'translate(0,0)' }, { transform: 'translate(1.6px,1px)' }, { transform: 'translate(-1.4px,-.6px)' },
          { transform: 'translate(.8px,.3px)' }, { transform: 'translate(0,0)' }], { duration: 200, easing: 'ease-out' });
        polvo(c2, s);
      }, 245);
    }, 2200);   /* (Iago) al menos un segundo entre que acaba el pulgar (250 + 900 ms) y el sello */
  }

  function polvo(card, s) {
    try {
      var cs = getComputedStyle(card); if (cs.position === 'static') card.style.position = 'relative';
      var rc = card.getBoundingClientRect(), rs = s.getBoundingClientRect();
      var x = rs.left + rs.width / 2 - rc.left, y = rs.top + rs.height / 2 - rc.top;
      var o = document.createElement('span'); o.className = 'lm-mg-onda'; o.style.left = x + 'px'; o.style.top = y + 'px'; card.appendChild(o);
      o.animate([{ transform: 'scale(.5)', opacity: .9 }, { transform: 'scale(1.5)', opacity: 0 }], { duration: 460, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = function () { o.remove(); };
      for (var i = 0; i < 9; i++) {
        var p = document.createElement('span'); p.className = 'lm-mg-polvo';
        var a = (i / 9) * Math.PI * 2 + Math.random() * .5, r0 = 40, d = 16 + Math.random() * 16, z = .6 + Math.random() * .8;
        var x0 = x + Math.cos(a) * r0, y0 = y + Math.sin(a) * r0;
        p.style.left = (x0 - 3) + 'px'; p.style.top = (y0 - 3) + 'px'; card.appendChild(p);
        p.animate([{ transform: 'translate(0,0) scale(' + z + ')', opacity: .75 },
                   { transform: 'translate(' + (Math.cos(a) * d).toFixed(1) + 'px,' + (Math.sin(a) * d - 4).toFixed(1) + 'px) scale(' + (z * 1.6).toFixed(2) + ')', opacity: 0 }],
          { duration: 520 + Math.random() * 180, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = (function (q) { return function () { q.remove(); }; })(p);
      }
    } catch (e) {}
  }

  /* vigila la campana: un «Me gusta» sin leer que aún no se haya animado en este navegador */
  var pendientes = {};
  function mira() {
    var lista = document.querySelectorAll('.alu-item.mgv[data-id]');
    if (!lista.length) return;
    var v = vistos();
    Array.prototype.forEach.call(lista, function (c) {
      var id = c.getAttribute('data-id'); if (!id || enMarcha[id] || v.indexOf(id) >= 0) return;
      if (!c.classList.contains('no-leido') && !pendientes[id]) return;
      if (c.classList.contains('mgv-no')) return;   /* sin verificar: no hay sello */
      if (!pendientes[id]) { pendientes[id] = 1; ocultos[id] = 1; pintaReglas(); }
      var r = c.getBoundingClientRect(), h = innerHeight || 800;
      if (r.height && r.top < h - 40 && r.bottom > 40 && c.offsetParent !== null) anima(id);   /* cuando se ve en pantalla */
    });
  }
  var cola = null;
  function pronto() { if (cola) return; cola = setTimeout(function () { cola = null; mira(); }, 60); }
  function arranca() {
    try { new MutationObserver(pronto).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
    document.addEventListener('scroll', pronto, true);
    mira();
  }
  if (document.body) arranca(); else document.addEventListener('DOMContentLoaded', arranca);
})();
