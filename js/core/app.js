/**
 * Last Ember — núcleo da aplicação.
 * Cria o namespace global `LE`, utilitários compartilhados e o registro de módulos.
 * Os scripts são clássicos (não ES modules) para que o site também funcione
 * abrindo o index.html direto do disco, sem servidor.
 */
(function (window, document) {
  'use strict';

  var modules = [];
  var lockCount = 0;

  var LE = {
    /** Registra um módulo: { name, init() } */
    register: function (name, mod) {
      modules.push({ name: name, mod: mod });
    },

    /** Inicializa todos os módulos na ordem em que foram registrados */
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

    /** Altura atual do cabeçalho fixo (para compensar rolagens até âncoras) */
    headerOffset: function () {
      var header = document.querySelector('[data-header]');
      return header ? header.offsetHeight : 0;
    },

    /** Trava/destrava a rolagem da página (menu e modais). Usa contador para aninhamento. */
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

    /** Agenda um callback por quadro de animação durante a rolagem */
    onScroll: function (fn) {
      scrollHandlers.push(fn);
    }
  };

  // Um único listener de scroll, sincronizado com requestAnimationFrame
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
