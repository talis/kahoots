// TODO: check if user is logged in.

// Wait for page to load before running background script.
var ready = false;
var PERSONA_ENDPOINT = "https://users.talis.com";
var LOGIN_COMPLETE_URL = PERSONA_ENDPOINT + "/auth/login?nc=";
var isLoggedIn = false;
var username = null;

document.addEventListener("DOMContentLoaded", function(event) {
   console.log("DOM fully loaded and parsed");
   ready = true;
});

  // Listen for messages from popup and content scripts.
chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    // Login from talis-uploader-desktop-app


    switch (request.directive) {
        case "login":
          alert("Login clicked");
          getLoginData(function(user){

            alert("user: " + user.profile.first_name);
            sendResponse({"status": 200, "name":user.profile.first_name});
          });


          break;
        case "popup-click":
          if(confirm("popup-click!")){
            // TODO: check user if logged in before clipping.
            startKlipper();
            sendResponse({});
          }
          break;
        case "capture":
          //Take a screen shot and send to kahoots server
          screenshot(request);
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
function screenshot(request) {
  chrome.tabs.captureVisibleTab(null, function (img) {
    var xhr = new XMLHttpRequest();
    var formData = new FormData();
    formData.append("content", img);
    formData.append("rect", JSON.stringify(request.rect));
    formData.append("source", request.source);
    //formData.append("author", userEmail);
    xhr.open("POST", "http://localhost:9000/api/clips/file-upload/", true);
    xhr.send(formData);
  });
}

function getLoginData(callback){
  try{
    var xhr = new XMLHttpRequest();
    xhr.open("GET", PERSONA_ENDPOINT+"/2/auth/login.json?cd=JSON_CALLBACK", true);
    xhr.onreadystatechange = function() {
      // 4: request finished and response is ready
      if (xhr.readyState === 4) {
        var resp = this;
        if (resp.status === 200) {
          //alert('*Status: '+this.status+'\nHeaders: '+JSON.stringify(this.getAllResponseHeaders())+'\nBody: '+this.responseText);
          var data = JSON.parse(resp.responseText);
          if (data) {
            alert(JSON.stringify(data.profile) + "\n" + data.guid);
            user = data;
            username = data.profile.first_name;
            isLoggedIn = true;
            callback(user);
          } else {
            alert('No data received for user, despite 200 \n');
            rcallback(user);
          }
        }else if(resp.status === 401){
          alert("User not logged in");
          user = null;
          //try login
          login(PERSONA_ENDPOINT, user);
        }else{
          alert('*Status: '+this.status+'\nHeaders: '+JSON.stringify(this.getAllResponseHeaders())+'\nBody: '+this.responseText);
        }
      }
    };
    xhr.send();
    alert("Sent Request");
  }catch(e){
    alert("Error trying ot get user data");
  }

}

function login(PERSONA_ENDPOINT, user){
  if(user !== undefined && user !== null){
    alert("[login] user is not null:" + "\n" + user);
    //user is logged in.
    //get user's GUID
  }else{
    alert("[login] user is null, attempt to login");
    //user is not logged in.
    // set up the next location which will either use the nextPath or whatever was in rootScope.absUrl if it was specified
    var nextLocation = PERSONA_ENDPOINT+'/auth/providers/google/login?redirectUri=&nc=' + new Date().getTime();

    chrome.tabs.create( {
      "url": nextLocation
    },function(tab) {
      alert("here");
      thistabId = tab.id;
      chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
        if(thistabId===tabId && changeInfo.url.substring(0, LOGIN_COMPLETE_URL.length)===LOGIN_COMPLETE_URL){
          chrome.tabs.remove(tabId);
        }
      });
    });





  }
}