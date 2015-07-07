/**
 * Created by lauren on 28/06/15.
 */
var url = window.location.href;
createCanvas();
var canvas = document.getElementById('canvas');
var canvasPos = canvas.getBoundingClientRect();
var dragging = false;
setCanvasStyle();
// Rectangle dimensions.
var y = 0;
var x = 0;
var width = 0;
var height = 0;
var ctx = canvas.getContext('2d');
ctx.globalAlpha = 0.2;
ctx.fillStyle = "#666699";
ctx.fillRect(0, 0, canvas.width, canvas.height);
addMouseListeners();


function setCanvasStyle() {
  canvas.style.position = 'absolute';
  canvas.style.left = "0px";
  canvas.style.top = "0px";
  canvas.style.zIndex = '1000';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.border = '1px solid yellow';
  canvas.height = canvas.offsetHeight;
  canvas.width = canvas.offsetWidth;
  canvas.style.cursor = "crosshair";
}

// Create canvas and attach to current web page.
function createCanvas() {
  var c = document.createElement('canvas');
  c.id = 'canvas';
  document.body.appendChild(c);

}

function addMouseListeners() {
  // Initialise the top left co-ords of the rectangle.
  canvas.onmousedown = function (e) {
    var startPos = getCursorPosition(e);
    x = startPos.x;
    y = startPos.y;
    dragging = true;
  };
  /* Finished drawing bounding box, telling background to screenshot.
   Clear the rectangle before the screen shot */
  canvas.onmouseup = function (e) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dragging = false;
    // Remove the canvas from body.
    document.body.removeChild(canvas);
    // Message to background.
    chrome.extension.sendMessage({
      directive: "capture",
      rect: {"x":x, "y": y, "width": width, "height": height},
      source: url
    }, function (response) {
      console.log("" + response.msg);
    });

  };

  // Drags out a image of a rectangle.
  canvas.onmousemove = function (e) {
    if (!dragging) {
      return;

    }
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "#666699";
    var bottom = getCursorPosition(e);
    width = (bottom.x - x);
    height = (bottom.y - y);
    //console.log("(" + left + "," + y + ") - (" + bottom.x + "," + bottom.y + ")");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //turn transparency on
    //ctx.globalAlpha = 0.2;
    //.fillStyle = "#000000";
    ctx.clearRect(x, y, width, height);
  };

  function getCursorPosition(e) {
    return {
      x: e.pageX - canvasPos.left,
      y: e.pageY - canvasPos.top
    };
  }
}



