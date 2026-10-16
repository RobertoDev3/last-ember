// scripts clássicos (não ES modules) para o site abrir direto do disco, sem servidor
(function (window, document) {
  'use strict';

  var modules = [];
  var lockCount = 0;

  var LE = {
    register: function (name, mod) {
      modules.push({ name: name, mod: mod });
    },

    start: function () {
      modules.forEach(function (entry) {
        try {
          if (typeof entry.mod.init === 'function') entry.mod.init();
        } catch (err) {
          console.error('[Last Ember] Falha ao iniciar o módulo "' + entry.name + '":', err);
        }
      });
    },

    qs: function (sel, ctx) { return (ctx || document).querySelector(sel); },
    qsa: function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); },

    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,

    clamp: function (v, min, max) { return Math.min(max, Math.max(min, v)); },

    headerOffset: function () {
      var header = document.querySelector('[data-header]');
      return header ? header.offsetHeight : 0;
    },

    // contador: menu e modal podem travar a rolagem ao mesmo tempo
    lockScroll: function () {
      lockCount += 1;
      if (lockCount === 1) {
        document.documentElement.classList.add('is-locked');
        if (LE.smooth) LE.smooth.stop();
      }
    },
    unlockScroll: function () {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.documentElement.classList.remove('is-locked');
        if (LE.smooth) LE.smooth.start();
      }
    },

    onScroll: function (fn) {
      scrollHandlers.push(fn);
    }
  };

  var scrollHandlers = [];
  var ticking = false;
  function runScrollHandlers() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    for (var i = 0; i < scrollHandlers.length; i++) scrollHandlers[i](y);
  }
  function requestTick() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(runScrollHandlers);
    }
  }
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);
  LE.refreshScroll = requestTick;

  window.LE = LE;
})(window, document);
