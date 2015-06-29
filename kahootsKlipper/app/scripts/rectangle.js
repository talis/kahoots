/**
 * Created by lauren on 28/06/15.
 */



var c = document.createElement('canvas');
c.id = 'canvas';
document.body.appendChild(c);

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var canvasPos = canvas.getBoundingClientRect();
var top = {x:0, y:0};
var dragging = false;
canvas.style.position = 'absolute';
canvas.style.left = '0px';
canvas.style.top = '0px';
canvas.style.zIndex = '100';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.border = '1px solid red';
canvas.top = top;

canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;




canvas.onmousedown = function(e) {
  canvas.top = getCursorPosition(e);
  dragging = true;

};

canvas.onmouseup = function(e) {
  dragging = false;
};

canvas.onmousemove = function(e) {

  if (!dragging) {
    return;
  }
  var bottom = getCursorPosition(e);
  console.log(canvas.top.x + "+++" + bottom.x);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(canvas.top.x, canvas.top.y, (bottom.x - canvas.top.x), (bottom.y - canvas.top.y));
};

function getCursorPosition(e) {
  return {
    x: e.pageX - canvasPos.left,
    y: e.pageY - canvasPos.top
  };
}
