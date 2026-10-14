/**
 * Combate — abas de técnicas (padrão WAI-ARIA Tabs: clique, setas, Home/End)
 * ligadas à rolagem.
 *
 * Quando a seção fica presa na tela (.is-pinned), a posição da rolagem escolhe a técnica:
 * cada uma ocupa um trecho da seção e, depois da última, a página volta a descer.
 * Clicar numa aba rola até o trecho dela. Com movimento reduzido ou tela muito baixa,
 * a seção não fica presa e as abas funcionam só no clique.
 */
(function (LE) {
  'use strict';

  var MIN_PIN_HEIGHT = '(min-height: 560px)';

  LE.register('combat-tabs', {
    init: function () {
      LE.qsa('[data-tabs]').forEach(function (root) {
        var tabs = LE.qsa('[role="tab"]', root);
        var scroller = root.closest('[data-combat-scroll]');
        var canPin = window.matchMedia(MIN_PIN_HEIGHT);
        var current = tabs.findIndex(function (t) { return t.getAttribute('aria-selected') === 'true'; });
        var navigating = false; // durante a rolagem após um clique, a aba escolhida não muda

        if (current < 0) current = 0;

        function select(index, focus) {
          var tab = tabs[index];
          if (index !== current) {
            current = index;
            tabs.forEach(function (t, i) {
              var active = i === index;
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
          }
          if (focus) tab.focus({ preventScroll: true });
        }

        function isPinned() { return !!scroller && scroller.classList.contains('is-pinned'); }

        function range() { return scroller.offsetHeight - window.innerHeight; }

        function layout() {
          if (!scroller) return;
          var pinned = !LE.reducedMotion && canPin.matches;
          scroller.classList.toggle('is-pinned', pinned);
          scroller.style.setProperty('--steps', tabs.length);
          if (!pinned) tabs.forEach(function (t) { t.style.removeProperty('--step'); });
          LE.refreshScroll();
        }

        /** Rola até o trecho da técnica (seção presa) ou só troca a aba (abas comuns) */
        function goTo(index, focus) {
          select(index, focus);
          if (!isPinned() || !LE.smooth) return;
          var top = scroller.getBoundingClientRect().top + window.scrollY;
          var y = top + range() * (index + 0.04) / tabs.length;
          navigating = true;
          LE.smooth.scrollTo(y, { onComplete: function () { navigating = false; } });
        }

        LE.onScroll(function () {
          if (!isPinned()) return;
          var r = range();
          if (r <= 0) return;
          var p = LE.clamp(-scroller.getBoundingClientRect().top / r, 0, 1) * tabs.length;
          var index = Math.min(tabs.length - 1, Math.floor(p));
          if (!navigating) select(index, false);
          tabs[current].style.setProperty('--step', LE.clamp(p - current, 0, 1).toFixed(3));
        });

        tabs.forEach(function (tab, i) {
          tab.addEventListener('click', function () { goTo(i, false); });
          tab.addEventListener('keydown', function (e) {
            var next = -1;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % tabs.length;
            else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + tabs.length) % tabs.length;
            else if (e.key === 'Home') next = 0;
            else if (e.key === 'End') next = tabs.length - 1;
            if (next < 0) return;
            e.preventDefault();
            goTo(next, true);
          });
        });

        var resizeTimer;
        window.addEventListener('resize', function () {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(layout, 150);
        });
        if (canPin.addEventListener) canPin.addEventListener('change', layout);

        layout();
      });
    }
  });
})(window.LE);
