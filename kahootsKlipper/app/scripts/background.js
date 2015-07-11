// TODO: check if user is logged in.

// Wait for page to load before running background script.
var ready = false;
var PERSONA_ENDPOINT = "https://users.talis.com";
var LOGIN_COMPLETE_URL = PERSONA_ENDPOINT + "/auth/login?nc=";
var isLoggedIn = false;
var username = null;
var userguid = null;

document.addEventListener("DOMContentLoaded", function(event) {
   console.log("DOM fully loaded and parsed");
   ready = true;
   getLoginData(function(){}, false);
});

  // Listen for messages from popup and content scripts.
chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    // Login from talis-uploader-desktop-app


    switch (request.directive) {
      case "logout":
        alert("Logout clicked");
        logout();


        sendResponse({"msg": "Logged out"});

        break;
      case "login":
          alert("Login clicked");
          getLoginData(function(){

            //alert("user: " + user.profile.first_name);
            sendResponse({"status": 200, "name":username});
          }, true);
          break;

      case "klipper":
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
/*
   Takes a screenshot of current page. Send clip and info to Kahoots App.
 */
function screenshot(request) {
  chrome.tabs.captureVisibleTab(null, function (img) {
    var xhr = new XMLHttpRequest();
    var formData = new FormData();
    formData.append("content", img);
    formData.append("rect", JSON.stringify(request.rect));
    formData.append("source", request.source);
    formData.append("author", userguid);
    //formData.append("author", userEmail);
    xhr.open("POST", "http://localhost:9000/api/clips/file-upload/", true);
    xhr.send(formData);
  });
}
function logout(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', PERSONA_ENDPOINT + "/auth/logout");
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (typeof cb !== "undefined") {
          cb(this);
        }
        else {
          isLoggedIn = false;
          username = null;
          user.guid = null;
          alert('Status: '+this.status+'\nHeaders: '+JSON.stringify(this.getAllResponseHeaders())+'\nBody: '+this.responseText);
        }
      }
    };
    xhr.send(null);

}
function getLoginData(callback, continueToLogin){
  try{
    // create a new request object.
    var xhr = new XMLHttpRequest();
    xhr.open("GET", PERSONA_ENDPOINT+"/2/auth/login.json?cd=JSON_CALLBACK", true);
    xhr.onreadystatechange = function() {

      // 4: request finished and response is ready
      if (xhr.readyState === 4) {
        //var resp = this;
        if (this.status === 200) {
          // 200 good! - get data from response.
          alert('Status: '+this.status+'\nHeaders: '+JSON.stringify(this.getAllResponseHeaders())+'\nBody: '+this.responseText);
          var data = JSON.parse(this.responseText);
          // If data exist, get username and guid.
          if (data) {
            //alert(JSON.stringify(data.profile) + "\n" + data.guid);
            userguid = data.guid;
            username = data.profile.first_name;
            isLoggedIn = true;
            callback(username);
          } else {
            alert('No data received for user, despite 200 \n');
            callback(username);
          }
        }else if(this.status === 401){
          // 401 user is undefined.
          alert("User not logged in");
          //user = null;
          username = null;
          userguid = null;
          isLoggedIn = false;

          //try login
          if(continueToLogin) {
            login(PERSONA_ENDPOINT, username)
          }
        }else{
          // some other status. Error occured.
          alert('ERROR:\nStatus: '+this.status+'\nHeaders: '+JSON.stringify(this.getAllResponseHeaders())+'\nBody: '+this.responseText);
        }
      }
    };
    xhr.send();
    //alert("Sent Request");
  }catch(e){
    console.log("Error trying ot get user data");
  }
}


/*
   If the user is not logged in then this method should be called.
   This method redirect the user to login, opens a new tab.
   Once the user has logged in the tab will close.
 */
function login(PERSONA_ENDPOINT, username ){
  if(username !== undefined && username !== null){
    //alert("[login] user is not null:" + "\n" + user);
    // TODO: get user's GUID
  }else{
    //alert("[login] user is null, attempt to login");
    //user is not logged in.
    // set up the next location which will either use the nextPath or whatever was in rootScope.absUrl if it was specified
    var nextLocation = PERSONA_ENDPOINT+'/auth/providers/google/login?redirectUri=&nc=' + new Date().getTime();

    // create a new tab where the user can login.
    chrome.tabs.create( {
      "url": nextLocation
    },function(tab) {
      thistabId = tab.id;
      chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
        // when the url === LOGIN_COMPLETE_URL login is complete. close tab.
        if(thistabId===tabId && changeInfo.url.substring(0, LOGIN_COMPLETE_URL.length)===LOGIN_COMPLETE_URL){
          getLoginData(function(){}, false);
          chrome.tabs.remove(tabId);
        }
      });
    });

  }
}
