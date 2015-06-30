chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch (request.directive) {
      case "popup-click":
        // execute the content script
        chrome.tabs.executeScript(null, { // defaults to the current tab
          file: "scripts/rectangle.js", // script to inject into page and run in sandbox
          allFrames: false // This injects script into iframes in the page and doesn't work before 4.0.266.0.
        });
        sendResponse({}); // sending back empty response to sender
        break;
      case "capture":
            //Take a screen shot and send to kahoots server
            chrome.tabs.captureVisibleTab(null, function(img){
              var xhr = new XMLHttpRequest();
              var formData = new FormData();
              formData.append("content", img);
              xhr.open("POST", "http://localhost:9000/api/clips/file-upload/", true);
              xhr.send(formData);
            });
            sendResponse({msg:"Roger!"});
            break;
      default:
        // helps debug when request directive doesn't match
        alert("Unmatched request of '" + request + "' from script to background.js from " + sender);
    }
  }
);

