'use strict';

(function () {
  $('#closeModalButton').on('click', function () {
    closeModal();
  });

  $('#rulesButton').on('click', function () {
    openModal();
  });

  $(document).ready(function () {
    $('html, body').css({
      overflow: 'hidden',
      height: '100%',
    });
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal();
    }
    console.log('escape');
  });

  $(document).mousedown(function (e) {
    let container = $('#modal');
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      closeModal();
    }
  });

  function closeModal() {
    $('#modal').css('display', 'none');
    $('#modalBackround').fadeOut('100');
    $('html, body').css({
      overflow: 'auto',
      height: 'auto',
    });
  }

  function openModal() {
    $('#modal').css('display', 'block');
    $('#modalBackround').css('display', 'block');
    $('html, body').css({
      overflow: 'hidden',
      height: '100%',
    });
  }
})();
