// Handles click events for clip button
var username;

function clip_clickHandler(e) {

  chrome.extension.sendMessage({directive: "popup-click"}, function(response) {
    this.close(); // close the popup when the background finishes processing request
  });
}

//Handles click events for sign in button.
function signin_clickHandler(e) {
  chrome.extension.sendMessage({directive: "login"}, function(response) {
  });
  this.close();
}

var main = function() {
    document.getElementById('signin').addEventListener('click', signin_clickHandler);
    document.getElementById('clip').addEventListener('click', clip_clickHandler);
}

document.addEventListener('DOMContentLoaded', function () {
  //check logged in.
  chrome.runtime.getBackgroundPage(function (backgroundPage) {
    if(backgroundPage.username !== null) {
      username = backgroundPage.username;
      document.getElementById('welcome-msg').innerText = "Hello, " + username;
    }else{
      document.getElementById('welcome-msg').innerText = "You need to login!";
    }
  });

  main();
});








