/* .is-pinned: a rolagem desliza a faixa de generais; sem ela (movimento reduzido ou tela baixa) vira uma faixa com rolagem lateral */
(function (LE) {
  'use strict';

  var MIN_PIN_HEIGHT = '(min-height: 560px)';

  LE.register('generals', {
    init: function () {
      var scroller = LE.qs('[data-generals-scroll]');
      if (!scroller) return;

      var track = LE.qs('[data-generals-track]', scroller);
      var cards = LE.qsa('[data-general]', scroller);
      var countEl = LE.qs('[data-generals-count]', scroller);
      var kanjiEl = LE.qs('[data-generals-kanji]', scroller);
      var canPin = window.matchMedia(MIN_PIN_HEIGHT);

      var step = 0;
      var distance = 0;
      var active = -1;
      var lastX = null;

      function pad(n) { return (n < 10 ? '0' : '') + n; }

      function setActive(i) {
        if (i === active) return;
        active = i;
        cards.forEach(function (card, k) { card.classList.toggle('is-active', k === i); });
        if (countEl) countEl.textContent = pad(i + 1);
        if (kanjiEl) {
          kanjiEl.textContent = cards[i].getAttribute('data-kanji') || '';
          kanjiEl.classList.remove('is-changing');
          void kanjiEl.offsetWidth; // reinicia a animação
          kanjiEl.classList.add('is-changing');
        }
      }

      function range() { return scroller.offsetHeight - window.innerHeight; }

      function layout() {
        var pinned = !LE.reducedMotion && canPin.matches && cards.length > 1;
        scroller.classList.toggle('is-pinned', pinned);
        lastX = null;

        if (!pinned) {
          step = distance = 0;
          track.style.transform = '';
          scroller.style.removeProperty('--distance');
          scroller.style.removeProperty('--p');
          LE.refreshScroll();
          return;
        }

        // offsetLeft ignora transformações, então a medida não depende da posição atual
        step = cards[1].offsetLeft - cards[0].offsetLeft;
        distance = step * (cards.length - 1);
        scroller.style.setProperty('--distance', distance + 'px');
        LE.refreshScroll();
      }

      LE.onScroll(function () {
        if (!distance) return;
        var r = range();
        var p = r > 0 ? LE.clamp(-scroller.getBoundingClientRect().top / r, 0, 1) : 0;
        var x = p * distance;
        if (x !== lastX) {
          lastX = x;
          track.style.transform = 'translate3d(' + (-x).toFixed(1) + 'px,0,0)';
          scroller.style.setProperty('--p', p.toFixed(4));
        }
        setActive(Math.round(x / step));
      });

      cards.forEach(function (card, i) {
        card.addEventListener('click', function () {
          if (!distance || i === active || !LE.smooth) return;
          var top = scroller.getBoundingClientRect().top + window.scrollY;
          LE.smooth.scrollTo(top + range() * (i * step) / distance);
        });
      });

      var resizeTimer;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(layout, 150);
      });
      if (canPin.addEventListener) canPin.addEventListener('change', layout);

      setActive(0);
      layout();
    }
  });
})(window.LE);
