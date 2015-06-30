/**
 * Created by lauren on 28/06/15.
 */



var c = document.createElement('canvas');
c.id = 'canvas';
document.body.appendChild(c);

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var canvasPos = canvas.getBoundingClientRect();

var dragging = false;
canvas.style.position = 'absolute';
canvas.style.left = '0px';
canvas.style.top = '0px';
canvas.style.zIndex = '1000';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.border = '1px solid yellow';
canvas.top = canvasPos;

canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;




canvas.onmousedown = function(e) {
  canvas.top = getCursorPosition(e);
  dragging = true;
  //ctx.fillRect(canvas.top.x,canvas.top.y,20,10);
};

canvas.onmouseup = function(e) {
  dragging = false;
  chrome.extension.sendMessage({directive: "capture"}, function(response) {

    console.log(response.msg);
  });
};

canvas.onmousemove = function(e) {

  if (!dragging) {
    return;
  }
  var bottom = getCursorPosition(e);
  console.log("("+canvas.top.x + "," + canvas.top.y + ") - (" + bottom.x + "," + bottom.y + ")");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //ctx.fillStyle = "black";
  ctx.fillRect(canvas.top.x, canvas.top.y, (bottom.x - canvas.top.x), (bottom.y - canvas.top.y));
};

function getCursorPosition(e) {
  return {
    x: e.pageX - canvasPos.left,
    y: e.pageY - canvasPos.top
  };
}
