(function (LE) {
  'use strict';

  LE.register('scroll-effects', {
    init: function () {
      var vh = window.innerHeight;
      window.addEventListener('resize', function () { vh = window.innerHeight; });

      var heroContent = LE.qs('[data-hero-content]');

      var journey = LE.qs('[data-journey]');
      var wick = LE.qs('[data-wick]');
      var chapters = LE.qsa('[data-chapter]');

      var parallaxImg = LE.qs('[data-parallax]');
      var parallaxSection = LE.qs('[data-parallax-section]');

      LE.onScroll(function (y) {
        if (heroContent && !LE.reducedMotion) {
          var p = LE.clamp(y / (vh * 0.9), 0, 1);
          heroContent.style.transform = 'translate3d(0,' + (p * 70).toFixed(1) + 'px,0)';
          heroContent.style.opacity = (1 - p * 1.1).toFixed(3);
        }

        if (journey && wick) {
          var rect = journey.getBoundingClientRect();
          var line = vh * 0.6; // ponto de queima: 60% da altura da tela
          var progress = LE.clamp((line - rect.top) / rect.height, 0, 1);
          journey.style.setProperty('--wick', progress.toFixed(4));
          journey.style.setProperty('--wick-spark', progress > 0 && progress < 1 ? 1 : 0);

          chapters.forEach(function (ch) {
            var node = ch.querySelector('.chapter__node');
            var top = (node || ch).getBoundingClientRect().top;
            ch.classList.toggle('is-lit', top < line);
          });
        }

        if (parallaxImg && parallaxSection && !LE.reducedMotion) {
          var r = parallaxSection.getBoundingClientRect();
          if (r.bottom > 0 && r.top < vh) {
            var center = (r.top + r.height / 2 - vh / 2) / vh; // -1..1
            parallaxImg.style.setProperty('--parallax', (center * -60).toFixed(1) + 'px');
          }
        }
      });

      LE.refreshScroll();
    }
  });
})(window.LE);
