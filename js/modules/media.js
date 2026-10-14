/**
 * Espaços de mídia ([data-media]).
 * Quando a imagem/vídeo indicado existe, ele aparece com fade e o placeholder some.
 * Quando o arquivo ainda não existe, o placeholder com o nome esperado continua visível.
 * Suporta data-fallback na <img> para usar uma imagem alternativa.
 */
(function (LE) {
  'use strict';

  function markLoaded(box) { box.classList.add('is-loaded'); }

  function watchImage(box, img) {
    function onLoad() { if (img.naturalWidth > 0) markLoaded(box); }
    function onError() {
      var fallback = img.getAttribute('data-fallback');
      if (fallback && img.getAttribute('src') !== fallback) {
        img.setAttribute('src', fallback);
      }
    }

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);

    if (img.complete) {
      if (img.naturalWidth > 0) markLoaded(box);
      else onError();
    }
  }

  function watchVideo(box, video) {
    video.addEventListener('loadeddata', function () { markLoaded(box); });
    if (video.readyState >= 2) markLoaded(box);
  }

  LE.register('media', {
    init: function () {
      LE.qsa('[data-media]').forEach(function (box) {
        var video = box.querySelector('video');
        var img = box.querySelector('img');
        if (video) watchVideo(box, video);
        else if (img) watchImage(box, img);
      });

      // Vídeo do hero: substitui a imagem assim que assets/videos/hero-loop.mp4 carregar
      var heroVideo = LE.qs('[data-hero-video]');
      var heroMedia = LE.qs('[data-hero-media]');
      if (heroVideo && heroMedia) {
        if (LE.reducedMotion) {
          heroVideo.removeAttribute('autoplay');
          heroVideo.pause();
        }
        var show = function () { heroMedia.classList.add('has-video'); };
        heroVideo.addEventListener('loadeddata', show);
        if (heroVideo.readyState >= 2) show();
      }
    }
  });
})(window.LE);
