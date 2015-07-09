/**
 * Created by lauren on 28/06/15.
 */

var url = window.location.href;

function getCursorPosition(e, canvas) {
  return {
    x: e.pageX - canvas.canvasPos.left,
    y: e.pageY - canvas.canvasPos.top
  };
}
var myCanvas = {
  dragging:false,
  rect :{
    y:0,
    x:0,
    width:0,
    height:0
 },
  canvas:null
};

myCanvas.initCanvas = function() {

  var canvas = document.getElementById('canvas');
  canvas.canvasPos = canvas.getBoundingClientRect();
  canvas.ctx = canvas.getContext('2d');
  canvas.ctx.globalAlpha = 0.2;
  canvas.ctx.fillStyle = "#666699";
  canvas.ctx.fillRect(0, 0, canvas.width, canvas.height);
  this.canvas = canvas;
  this.setMouseListeners();
};

myCanvas.setMouseListeners = function(){
    // Initialise the top left co-ords of the rectangle.
  var self = this;
  this.canvas.onmousedown = function (e) {
      var startPos = getCursorPosition(e, this);
      self.rect.x = startPos.x;
      self.rect.y = startPos.y;
      self.dragging = true;
  };

    /* Finished drawing bounding box, telling background to screenshot.
     Clear the rectangle before the screen shot */
  this.canvas.onmouseup = function (e) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      self.dragging = false;
      // Remove the canvas from body.
      document.body.removeChild(this);
      // Message to background.
      chrome.extension.sendMessage({
        directive: "capture",
        rect: self.rect,
        source: url
      }, function (response) {
        console.log("" + response.msg);
      });

  };

    // Drags out a image of a rectangle.
  this.canvas.onmousemove = function (e) {
      if (!self.dragging) {return;}
      var bottom = getCursorPosition(e, this);
      self.rect.width = (bottom.x - self.rect.x);
      self.rect.height = (bottom.y - self.rect.y);
      // re-fill canvas
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.fillRect(0, 0, this.width, this.height);
      // draw new rectangle
      this.ctx.clearRect(self.rect.x, self.rect.y, self.rect.width, self.rect.height);
  };
};

myCanvas.initCanvas();

