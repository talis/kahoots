
// Handles click events for clip button
function clip_clickHandle(e){
  chrome.extension.sendMessage({directive: "klipper"}, function(response) {
    this.close(); // close the popup when the background finishes processing request
  });
}

//Handles click events for sign in button.
function signin_clickHandler(e) {
  chrome.extension.sendMessage({directive: "login"}, function(response) {
  });
  this.close();
}
//Handles click events for sign in button.
function logout_clickHandler(e) {
  chrome.extension.sendMessage({directive: "logout"}, function(response) {
  });
  this.close();
}

document.addEventListener('DOMContentLoaded', function () {
  // popup has loaded.
  // check logged in.
  chrome.runtime.getBackgroundPage(function (backgroundPage) {
    if(backgroundPage.username !== null) {
      // User is logged in.
      username = backgroundPage.username;
      $('.welcome-msg').text("Hello, " + username);
      $('#clip').click(clip_clickHandle);
      $('#logout').click(logout_clickHandler);
      $('#signin').hide();
    }else{
      // User is null.
      $('.welcome-msg').text("You need to login!");
      $('#signin').click(signin_clickHandler);
      $('#clip').hide();
      $('#logout').hide();

    }
  });

});








