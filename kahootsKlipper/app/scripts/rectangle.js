/**
 * Created by lauren on 28/06/15.
 */



var c = document.createElement('canvas');
c.id = 'canvas';
document.body.appendChild(c);


  var canvas = document.getElementById('canvas');

  var canvasPos = canvas.getBoundingClientRect();
  console.log(canvasPos.top);
  var dragging = false;
  canvas.style.position = 'absolute';
  canvas.style.left ="0px";
  canvas.style.top = "0px";
  canvas.style.zIndex = '1000';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.border = '1px solid yellow';
  var y = 0;
  var left = 0;
  var width = 0;
  var height = 0;

  canvas.height = canvas.offsetHeight;
  canvas.width = canvas.offsetWidth;
  var ctx = canvas.getContext('2d');

  ctx.fillRect(0, 0, 0, 0);


  function addMouseListeners() {

    canvas.onmousedown = function (e) {
      var startPos = getCursorPosition(e);
      left = startPos.x;
      y = startPos.y;
      dragging = true;

    };

    canvas.onmouseup = function (e) {
      dragging = false;


// Finished drawing bounding box, telling background to screenshot.
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      chrome.extension.sendMessage({
        directive: "capture",
        rect: {"x": left, "y": y, "width": width, "height": height}
      }, function (response) {

        console.log("" + response.msg);
      });
      document.body.removeChild(canvas);
    };

    canvas.onmousemove = function (e) {

      if (!dragging) {
        return;
      }
      var bottom = getCursorPosition(e);
      width = (bottom.x - left);
      height = (bottom.y - y);
      //console.log("(" + left + "," + y + ") - (" + bottom.x + "," + bottom.y + ")");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      //turn transparency on
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "#000000";
      ctx.fillRect(left, y, width, height);
    };

    function getCursorPosition(e) {
      return {
        x: e.pageX - canvasPos.left,
        y: e.pageY - canvasPos.top
      };
    }
  }

  addMouseListeners();

