/**
 * Ponto de entrada: cria a rolagem suave e inicializa os módulos registrados.
 */
(function (LE) {
  'use strict';

  // lerp menor = mais suave (0.075 ≈ desaceleração longa sem ficar lenta)
  LE.smooth = new LE.SmoothScroll({ lerp: 0.075, wheelMultiplier: 1 });
  LE.start();
})(window.LE);
