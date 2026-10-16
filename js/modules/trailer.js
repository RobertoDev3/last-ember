/* carrega assets/videos/trailer.mp4 só quando o modal abre; sem o arquivo mostra "Estreia em breve" */
(function (LE) {
  'use strict';

  LE.register('trailer', {
    init: function () {
      var dialog = LE.qs('[data-trailer-modal]');
      if (!dialog) return;

      var box = LE.qs('[data-trailer]', dialog);
      var video = LE.qs('video', dialog);
      var requested = false;

      video.addEventListener('loadedmetadata', function () {
        box.classList.add('is-loaded');
        if (dialog.open) {
          var p = video.play();
          if (p && p.catch) p.catch(function () { /* autoplay bloqueado: o usuário aperta play */ });
        }
      });

      document.addEventListener('click', function (e) {
        var trigger = e.target.closest('[data-trailer-open]');
        if (!trigger) return;
        e.preventDefault();
        LE.modal.open(dialog, trigger);
        if (!requested) {
          requested = true;
          video.preload = 'auto';
          video.load();
        } else if (box.classList.contains('is-loaded')) {
          video.play().catch(function () {});
        }
      });

      dialog.addEventListener('modal:close', function () { video.pause(); });
    }
  });
})(window.LE);
