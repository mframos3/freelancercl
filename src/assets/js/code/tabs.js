$(document).ready(() => {
  $('ul.tabs li').click(function click() {
    const tabId = $(this).attr('data-tab');

    $('ul.tabs li').removeClass('current');
    $('.tab-content').removeClass('current');

    $(this).addClass('current');
    $(`#${tabId}`).addClass('current');
  });
});
