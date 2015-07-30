
var PERSONA_ENDPOINT = "https://users.talis.com";
var LOGIN_COMPLETE_URL = PERSONA_ENDPOINT + "/auth/login?nc=";

var mybackground = {
  oauth:null,
  user:{
    isLoggedin:false,
    name:null,
    guid:null
  }
};

mybackground.init = function(){
  this.getLoginData(function(){}, false);
  this.addListeners();
};



mybackground.addListeners = function(){
  var self = this;
  // Listen for messages from popup and content scripts.
chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {

    switch (request.directive) {
      case "logout":
        //alert("Logout clicked");
        self.logout();
        sendResponse({"msg": "Logged out"});
        break;
      case "login":
          //alert("Login clicked");
          self.getLoginData(function(){
          //alert("user: " + user.profile.first_name);
          sendResponse({"status": 200, "name":self.user.name});
          }, true);
          break;

      case "klipper":
            self.startKlipper();
            sendResponse({});
          break;

        case "capture":
          //Take a screen shot and send to kahoots server
          //alert("got \'capture\' msg");
          self.screenshot(request);
          sendResponse({msg:"Sent clip to Kahoots App"});
          break;

        default:
          // helps debug when request directive doesn't match
          alert("Unmatched request of '" + request + "' from script to background.js from " + sender);
    }
  }
)
};


/*
   Allows the user to select part of the screen to clip.
   When finished sends a message "capture" with rectangle dimensions and url.
 */
mybackground.startKlipper = function(){
   chrome.tabs.executeScript(null, { // defaults to the current tab
     file: "scripts/canvas.js"
   }, function(){
     chrome.tabs.executeScript(null, {
       file: "scripts/rectangle.js"
     });
   });
}
/*
   Takes a screenshot of current page. Send clip and info to Kahoots App.
 */
mybackground.screenshot = function(request) {
  var self = this;
  //var outerTs = (new Date()).getTime();
  chrome.tabs.captureVisibleTab(null, function (img) {
    //var innerTs = (new Date()).getTime();

    //alert("Captured img");
    var xhr = new XMLHttpRequest();
    //xhr.setRequestHeader('Authorization', 'Bearer '+ self.oauth.access_token);
    var formData = new FormData();
    formData.append("content", img);
    formData.append("rect", JSON.stringify(request.rect));
    formData.append("source", request.source);
    formData.append("author", self.user.guid);
    console.log(Date());
    formData.append("dateAdded", Date());
    //formData.append("outerTs", innerTs);
    //formData.append("innerTs", outerTs);

    xhr.open("POST", "http://localhost:9000/api/clips/file-upload/"+self.user.guid+"?access_token="+self.oauth.access_token, true);
    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (typeof cb !== "undefined") {
          cb(this);
        }
        return;
      }
    };
    xhr.send(formData);
    //alert("sending img to server");
  });
}
/*
   Allows the user to logout of Persona
 */
mybackground.logout = function(){
  var self = this;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', PERSONA_ENDPOINT + "/auth/logout");
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (typeof cb !== "undefined") {
          cb(this);
        }
        else {
          self.user.isLoggedIn = false;
          self.user.name = null;
          self.user.guid = null;
          self.oauth = null;
          //alert('Status: '+this.status+'\nHeaders: '+JSON.stringify(this.getAllResponseHeaders())+'\nBody: '+this.responseText);
        }
      }
    };
    xhr.send(null);
}
/*
   Gets data from Persona, if the user exists then callback is called.
   Else the user is set to null. If the user is not logged in and the continueToLogin
   is true the user will be redirected to sign in Persona.
 */
mybackground.getLoginData = function(callback, continueToLogin){
  var self = this;
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
          //alert('Status: '+this.status+'\nHeaders: '+JSON.stringify(this.getAllResponseHeaders())+'\nBody: '+this.responseText);
          var data = JSON.parse(this.responseText);
          // If data exist, get username and guid.
          if (data) {
            //alert(JSON.stringify(data.oauth.access_token));
            self.oauth = data.oauth;
            self.user.guid = data.guid;
            self.user.name = data.profile.first_name;
            self.user.isLoggedIn = true;
            callback(self.user.name);
          } else {
            alert('No data received for user, despite 200 \n');
            //callback(username);
          }
        }else if(this.status === 401){
          // 401 user is undefined.
          //alert("User not logged in");
          //user = null;
          self.user.name = null;
          self.user.guid = null;
          self.user.isLoggedIn = false;
          self.oauth = null;
          //try login
          if(continueToLogin) {
            self.login()
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
};


/*
   If the user is not logged in then this method should be called.
   This method redirect the user to login, opens a new tab.
   Once the user has logged in the tab will close.
 */
mybackground.login = function(){
  //var self = this;
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
          alert("LOGIN COMPLETE");
          chrome.tabs.remove(thistabId, function(){
            alert("Removed tab " + thistabId);
          });
          self.getLoginData(function(){
          }, false);
        }
      });
    });


};

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");
  mybackground.init();
});