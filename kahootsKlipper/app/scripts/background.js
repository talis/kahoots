// TODO: check if user is logged in.

// Wait for page to load before running background script.
var ready = false;
 document.addEventListener("DOMContentLoaded", function(event) {
   console.log("DOM fully loaded and parsed");
   ready = true;
 });


  // Listen for messages from popup and content scripts.
  chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
      var userEmail;

      switch (request.directive) {
        case "popup-click":
          if(confirm("popup-click!")){
            /*
            TODO: check the user is logged in before you start clipping.
            If logged in - carry on as normal.
            If not - redirect to google login.
             */
            console.log("here");
            // Get user email
            chrome.identity.getProfileUserInfo(function(userInfo){
              if (chrome.runtime.lastError) {
                alert(chrome.runtime.lastError);
              } else {
                userEmail = userInfo.email;
                // check email is not null or undefined.
                if(userEmail === undefined || userEmail === null){
                  if(confirm("You need to sign into google to use Klipper. Do you want to login?")){
                    var newURL = "chrome://chrome-signin/?source=0";
                    chrome.tabs.create({ url: newURL });
                  }
                }else if(ready) {
                  if(confirm("You are logged into chrome using " + userEmail + ". Clips will be sent to this user. Is this user you?")) {
                    // execute the content script that lets the user draw a rectangle
                   // createCanvas();
                    startKlipper();
                  }
                }
              }
              sendResponse({});
            });
          }

          break;

        case "capture":
          //Take a screen shot and send to kahoots server
          chrome.tabs.captureVisibleTab(null, function (img) {
            var xhr = new XMLHttpRequest();
            var formData = new FormData();
            formData.append("content", img);
            formData.append("rect", JSON.stringify(request.rect));
            formData.append("source", request.source);
            formData.append("author", userEmail);
            xhr.open("POST", "http://localhost:9000/api/clips/file-upload/", true);
            xhr.send(formData);
          });
          sendResponse({msg:"Sent clip to Kahoots App"});
          break;
        default:
          // helps debug when request directive doesn't match
          alert("Unmatched request of '" + request + "' from script to background.js from " + sender);
      }
    }
  );


/*
   Allows the user to select part of the screen to clip.
   When finished sends a message "capture" with rectangle dimensions and url.
 */
 function startKlipper(){
   chrome.tabs.executeScript(null, { // defaults to the current tab
     file: "scripts/canvas.js"
   }, function(){
     chrome.tabs.executeScript(null, { // defaults to the current tab
       file: "scripts/rectangle.js"
     });
   });
 }


