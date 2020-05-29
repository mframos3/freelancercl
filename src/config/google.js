function onSignIn(googleUser) {
  console.log("Estoy en google");
  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile();
  console.log('Full Name: ' + profile.getName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail());

  // The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token;
  module.exports(id_token);
  console.log("ID Token: " + id_token);
};
module.exports = onSignIn;
