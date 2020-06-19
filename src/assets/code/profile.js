$(document).ready(() => {
  $('ul.tabs li').click(function () {
    const tab_id = $(this).attr('data-tab');

    $('ul.tabs li').removeClass('current');
    $('.tab-content').removeClass('current');

    $(this).addClass('current');
    $(`#${tab_id}`).addClass('current');
  });
});
