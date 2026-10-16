(function (LE) {
  'use strict';

  var openerMap = new WeakMap();

  function open(dialog, opener) {
    if (!dialog || dialog.open) return;
    openerMap.set(dialog, opener || document.activeElement);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    LE.lockScroll();
    dialog.dispatchEvent(new CustomEvent('modal:open'));
  }

  function close(dialog) {
    if (!dialog || !dialog.open) return;
    if (typeof dialog.close === 'function') dialog.close();
    else {
      dialog.removeAttribute('open');
      dialog.dispatchEvent(new Event('close'));
    }
  }

  LE.register('modal', {
    init: function () {
      LE.qsa('dialog.modal').forEach(function (dialog) {
        dialog.addEventListener('click', function (e) {
          if (e.target.closest('[data-modal-close]')) {
            close(dialog);
            return;
          }
          if (e.target === dialog) {
            var r = dialog.getBoundingClientRect();
            var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
            if (!inside) close(dialog);
          }
        });

        dialog.addEventListener('close', function () {
          LE.unlockScroll();
          dialog.dispatchEvent(new CustomEvent('modal:close'));
          var opener = openerMap.get(dialog);
          if (opener && opener.focus) opener.focus({ preventScroll: true });
        });
      });

      LE.modal = { open: open, close: close };
    }
  });
})(window.LE);
