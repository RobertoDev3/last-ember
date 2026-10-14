/**
 * Cabeçalho: fundo e linha só aparecem depois que a rolagem começa;
 * recolhe ao descer e reaparece ao subir; destaca a seção atual no menu.
 */
(function (LE) {
  'use strict';

  var SCROLLED_AT = 24;
  var HIDE_AFTER = 640;

  LE.register('header', {
    init: function () {
      var header = LE.qs('[data-header]');
      if (!header) return;

      var lastY = window.scrollY;

      LE.onScroll(function (y) {
        header.classList.toggle('is-scrolled', y > SCROLLED_AT);

        var goingDown = y > lastY + 2;
        var goingUp = y < lastY - 2;
        // Durante a rolagem para uma âncora o cabeçalho permanece visível
        if (LE.holdHeader) header.classList.remove('is-hidden');
        else if (goingDown && y > HIDE_AFTER) header.classList.add('is-hidden');
        else if (goingUp || y < HIDE_AFTER) header.classList.remove('is-hidden');
        lastY = y;
      });

      // Link ativo conforme a seção visível
      var links = LE.qsa('.main-nav__link');
      var sections = links
        .map(function (link) { return document.getElementById(link.hash.slice(1)); })
        .filter(Boolean);

      if ('IntersectionObserver' in window && sections.length) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            links.forEach(function (link) {
              var active = link.hash === '#' + entry.target.id;
              link.classList.toggle('is-active', active);
              if (active) link.setAttribute('aria-current', 'true');
              else link.removeAttribute('aria-current');
            });
          });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(function (s) { observer.observe(s); });
      }

      LE.refreshScroll();
    }
  });
})(window.LE);
