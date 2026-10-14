/**
 * Pré-venda (demonstração).
 * Os botões [data-purchase="edicao"] abrem o modal já com a edição escolhida,
 * sem rolar a página. O formulário calcula o total e mostra uma confirmação fictícia.
 */
(function (LE) {
  'use strict';

  var RELEASE = '12.03.2027';
  var currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  function orderCode() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var out = '';
    for (var i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return 'LE-' + out;
  }

  LE.register('purchase', {
    init: function () {
      var dialog = LE.qs('[data-purchase-modal]');
      var form = LE.qs('[data-purchase-form]');
      if (!dialog || !form) return;

      var stepForm = LE.qs('[data-step="form"]', form);
      var stepDone = LE.qs('[data-step="done"]', form);
      var totalEl = LE.qs('[data-total]', form);
      var noteEl = LE.qs('[data-delivery-note]', form);

      function selectedEdition() { return form.querySelector('input[name="edition"]:checked'); }
      function selectedPlatform() { return form.querySelector('input[name="platform"]:checked'); }

      function update() {
        var ed = selectedEdition();
        if (!ed) return;
        totalEl.textContent = currency.format(parseFloat(ed.getAttribute('data-price')));
        noteEl.textContent = ed.getAttribute('data-delivery') === 'physical'
          ? 'Jogo digital no lançamento (' + RELEASE + '). Itens físicos enviados a partir de março de 2027.'
          : 'Entrega digital no dia do lançamento, ' + RELEASE + '.';
      }

      function reset(editionKey) {
        stepDone.hidden = true;
        stepForm.hidden = false;
        if (editionKey) {
          var input = form.querySelector('input[name="edition"][value="' + editionKey + '"]');
          if (input) input.checked = true;
        }
        update();
      }

      form.addEventListener('change', update);

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var ed = selectedEdition();
        var pf = selectedPlatform();
        LE.qs('[data-done-text]', form).textContent =
          'Pré-venda da ' + ed.getAttribute('data-name') + ' para ' + pf.value +
          ' registrada. O kimono de luto Cinza Primeira será liberado no lançamento.';
        LE.qs('[data-done-code]', form).textContent = orderCode();
        stepForm.hidden = true;
        stepDone.hidden = false;
        LE.qs('[data-done-title]', form).focus();
      });

      // Todos os botões de compra abrem o modal no lugar — nada de pular pela página
      document.addEventListener('click', function (e) {
        var trigger = e.target.closest('[data-purchase]');
        if (!trigger) return;
        e.preventDefault();
        reset(trigger.getAttribute('data-purchase'));
        LE.modal.open(dialog, trigger);
      });

      dialog.addEventListener('modal:close', function () { reset(); });
    }
  });
})(window.LE);
