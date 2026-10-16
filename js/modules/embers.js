/* posições pseudoaleatórias e estáveis: as brasas ficam iguais a cada visita */
(function (LE) {
  'use strict';

  function seeded(i, k) {
    var x = Math.sin((i + 1) * k) * 10000;
    return x - Math.floor(x);
  }

  LE.register('embers', {
    init: function () {
      if (LE.reducedMotion) return;

      var isSmall = window.matchMedia('(max-width: 560px)').matches;

      LE.qsa('[data-embers]').forEach(function (box, b) {
        var count = parseInt(box.getAttribute('data-embers'), 10) || 20;
        if (isSmall) count = Math.round(count * 0.55);

        var frag = document.createDocumentFragment();
        for (var i = 0; i < count; i++) {
          var n = i + b * 50;
          var size = (1.5 + seeded(n, 78.233) * 3).toFixed(1);
          var span = document.createElement('span');
          span.className = 'ember';
          span.style.left = (seeded(n, 12.9898) * 100).toFixed(2) + '%';
          span.style.width = size + 'px';
          span.style.height = size + 'px';
          span.style.animationDuration = (9 + seeded(n, 39.425) * 10).toFixed(1) + 's';
          span.style.animationDelay = (-seeded(n, 4.17) * 18).toFixed(1) + 's';
          span.style.setProperty('--drift', ((seeded(n, 93.1) - 0.5) * 140).toFixed(0) + 'px');
          span.style.color = seeded(n, 7.7) < 0.3 ? 'var(--c-violet)' : 'var(--c-gold)';
          frag.appendChild(span);
        }
        box.appendChild(frag);
      });
    }
  });
})(window.LE);
