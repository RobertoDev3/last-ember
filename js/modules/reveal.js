/**
 * Revela elementos .reveal ao entrarem na tela.
 * Elementos irmãos recebem um pequeno atraso em sequência.
 */
(function (LE) {
  'use strict';

  LE.register('reveal', {
    init: function () {
      var items = LE.qsa('.reveal');

      if (LE.reducedMotion || !('IntersectionObserver' in window)) {
        items.forEach(function (el) { el.classList.add('is-visible'); });
        return;
      }

      // Escalonamento entre irmãos (máx. 4 passos)
      items.forEach(function (el) {
        var siblings = LE.qsa(':scope > .reveal', el.parentNode);
        var index = siblings.indexOf(el);
        if (index > 0) el.style.setProperty('--reveal-delay', Math.min(index, 4) * 0.08 + 's');
      });

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

      items.forEach(function (el) { observer.observe(el); });
    }
  });
})(window.LE);
