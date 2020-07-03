$(document).ready(() => {
  $('#vista').hide();

  function readURL() {
    const pdfFile = document.getElementById('CV').files[0];
    const pdfFileUrl = URL.createObjectURL(pdfFile);
    $('#viewer').attr('src', pdfFileUrl);
  }

  $('#vista').click(() => {
    readURL();
  });

  $('#CV').change(() => {
    $('#vista').show();
  });
});
