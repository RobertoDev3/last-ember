/**
 * Menu móvel (hambúrguer): abre/fecha, trava a rolagem, fecha com Esc,
 * mantém o foco dentro do painel e fecha sozinho ao voltar para o desktop.
 */
(function (LE) {
  'use strict';

  var DESKTOP = window.matchMedia('(min-width: 961px)');

  LE.register('mobile-nav', {
    init: function () {
      var toggle = LE.qs('[data-menu-toggle]');
      var panel = LE.qs('[data-mobile-nav]');
      if (!toggle || !panel) return;

      var isOpen = false;

      function focusables() {
        return [toggle].concat(LE.qsa('a[href], button:not([disabled])', panel));
      }

      function open() {
        if (isOpen) return;
        isOpen = true;
        panel.removeAttribute('inert');
        panel.classList.add('is-open');
        document.documentElement.classList.add('menu-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Fechar menu');
        LE.lockScroll();
        var first = LE.qs('.mobile-nav__link', panel);
        if (first) window.setTimeout(function () { first.focus({ preventScroll: true }); }, 250);
      }

      function close(opts) {
        if (!isOpen) return;
        isOpen = false;
        panel.classList.remove('is-open');
        panel.setAttribute('inert', '');
        document.documentElement.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menu');
        LE.unlockScroll();
        if (!opts || opts.returnFocus !== false) toggle.focus({ preventScroll: true });
      }

      toggle.addEventListener('click', function () {
        if (isOpen) close();
        else open();
      });

      // Links do painel: fecha o menu e deixa o módulo de âncoras fazer a rolagem
      panel.addEventListener('click', function (e) {
        if (e.target.closest('a[href^="#"]')) close({ returnFocus: false });
      });

      document.addEventListener('keydown', function (e) {
        if (!isOpen) return;
        if (e.key === 'Escape') {
          close();
          return;
        }
        if (e.key === 'Tab') {
          var items = focusables();
          var first = items[0];
          var last = items[items.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });

      var onChange = function (mq) { if (mq.matches) close({ returnFocus: false }); };
      if (DESKTOP.addEventListener) DESKTOP.addEventListener('change', onChange);
      else DESKTOP.addListener(onChange);

      LE.mobileNav = { open: open, close: close };
    }
  });
})(window.LE);
