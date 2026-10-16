(function (LE) {
  'use strict';

  LE.register('hotspots', {
    init: function () {
      var spots = LE.qsa('[data-hotspot]');
      if (!spots.length) return;

      spots.forEach(function (spot) {
        spot.addEventListener('click', function () {
          var wasOpen = spot.classList.contains('is-open');
          spots.forEach(function (s) { s.classList.remove('is-open'); });
          if (!wasOpen) spot.classList.add('is-open');
        });
      });

      document.addEventListener('click', function (e) {
        if (!e.target.closest('[data-hotspot]')) {
          spots.forEach(function (s) { s.classList.remove('is-open'); });
        }
      });
    }
  });
})(window.LE);
