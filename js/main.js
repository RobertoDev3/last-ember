(function (LE) {
  'use strict';

  // lerp menor = mais suave
  LE.smooth = new LE.SmoothScroll({ lerp: 0.075, wheelMultiplier: 1 });
  LE.start();
})(window.LE);
