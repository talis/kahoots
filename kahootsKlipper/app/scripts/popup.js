var signin_button, clip_button;



document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('clip').addEventListener('click', clip_clickHandler);
})




function clip_clickHandler(e) {
  chrome.extension.sendMessage({directive: "popup-click"}, function(response) {
    this.close(); // close the popup when the background finishes processing request
  });
}





