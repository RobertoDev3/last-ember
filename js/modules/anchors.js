/**
 * Âncoras internas (#secao): rolagem suave compensando a altura do cabeçalho.
 * Atualiza o endereço sem "pular" a página.
 */
(function (LE) {
  'use strict';

  LE.register('anchors', {
    init: function () {
      document.addEventListener('click', function (e) {
        var link = e.target.closest('a[href^="#"]');
        if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;

        var hash = link.getAttribute('href');
        if (hash === '#') return;

        var target = hash === '#topo' ? 0 : document.getElementById(hash.slice(1));
        if (target === null) return;

        e.preventDefault();

        // Espera um quadro para o menu móvel liberar a rolagem antes de animar
        LE.holdHeader = true;
        window.requestAnimationFrame(function () {
          LE.smooth.scrollTo(target, {
            offset: target === 0 ? 0 : -LE.headerOffset() + 1,
            onComplete: function () {
              window.setTimeout(function () { LE.holdHeader = false; }, 150);
              if (target && target.focus) {
                if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
              }
            }
          });
        });

        if (window.history && window.history.pushState) {
          window.history.pushState(null, '', hash);
        }
      });
    }
  });
})(window.LE);
