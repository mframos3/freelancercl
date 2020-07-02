$(document).ready(() => {
  const pdfFile = document.getElementById('CV').files[0];
  if (pdfFile) {
    const pdfFileUrl = URL.createObjectURL(pdfFile);
    $('#viewer').attr('src', pdfFileUrl);
    $('#viewerDefault').attr('height', '0');
  } else {
    $('#viewerDefault').attr('src', 'https://freelancercl.sfo2.digitaloceanspaces.com/noFile.png');
    $('#viewer').attr('height', '0');
  }
});
