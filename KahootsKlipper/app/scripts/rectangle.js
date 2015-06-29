/**
 * Created by lauren on 28/06/15.
 */

console.log("Entered rectangle");
var canvas = window.document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var canvasPos = canvas.getBoundingClientRect();
var top;
var dragging = false;
canvas.style.position = 'absolute';
canvas.style.left = '0px';
canvas.style.top = '0px';
canvas.style.zIndex = '100';
canvas.style.width = '100%';
canvas.style.height = '100%';

canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;
document.onfocus = function() {
  with(m) {
    value = C;
    focus();
    select()
  }
};
document.onfocus();

window.document.body.appendChild(canvas);

console.log("finished rectangle");

canvas.onmovedown = function(e) {
  top = getCursorPosition(e);
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeRect(top.x, top.y, (bottom.x - top.x), (bottom.y - top.y));
};

function getCursorPosition(e) {
  return {
    x: e.pageX - canvasPos.left,
    y: e.pageY - canvasPos.top
  };
}
