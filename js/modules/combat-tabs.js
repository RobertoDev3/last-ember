/**
 * Abas de técnicas de combate — padrão WAI-ARIA Tabs (clique + setas, Home/End).
 */
(function (LE) {
  'use strict';

  LE.register('combat-tabs', {
    init: function () {
      LE.qsa('[data-tabs]').forEach(function (root) {
        var tabs = LE.qsa('[role="tab"]', root);

        function select(tab, focus) {
          tabs.forEach(function (t) {
            var active = t === tab;
            var panel = document.getElementById(t.getAttribute('aria-controls'));
            t.setAttribute('aria-selected', active ? 'true' : 'false');
            t.tabIndex = active ? 0 : -1;
            if (!panel) return;
            panel.hidden = !active;
            if (active) {
              panel.classList.remove('is-entering');
              void panel.offsetWidth; // reinicia a animação
              panel.classList.add('is-entering');
            }
          });
          if (focus) tab.focus();
        }

        tabs.forEach(function (tab, i) {
          tab.addEventListener('click', function () { select(tab, false); });
          tab.addEventListener('keydown', function (e) {
            var next = null;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
            else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
            else if (e.key === 'Home') next = tabs[0];
            else if (e.key === 'End') next = tabs[tabs.length - 1];
            if (next) {
              e.preventDefault();
              select(next, true);
            }
          });
        });
      });
    }
  });
})(window.LE);
