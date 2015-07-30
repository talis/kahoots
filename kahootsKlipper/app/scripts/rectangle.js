/**
 * Created by lauren on 28/06/15.
 */

var url = window.location.href;

function getCursorPosition(e, canvas) {
  return {
    /*x: e.pageX - canvas.canvasPos.left,
    y: e.pageY - canvas.canvasPos.top*/
    x: e.pageX - parseInt(canvas.style.left.substring(0, canvas.style.left.length)),
    y: e.pageY - parseInt(canvas.style.top.substring(0, canvas.style.top.length))

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
  this.setListeners();
};

myCanvas.removeCanvas = function(){

  if(this.canvas!==null){
    document.body.removeChild(this.canvas);
    window.removeEventListener('scroll', function(){
      console.log("Removed scroll listener");
    });
    this.canvas=null;
    console.log( " Removed canvas");
  }
}

myCanvas.setListeners = function(){
    // Initialise the top left co-ords of the rectangle.
  var self = this;

  window.addEventListener('resize', function(){
    console.log("Resize");
    self.canvas.height = self.canvas.offsetHeight;
    self.canvas.width = self.canvas.offsetWidth;

    /* self.removeCanvas();
     chrome.extension.sendMessage({directive: "klipper"}, function (response) {});*/
  });
  window.addEventListener('scroll', function(e){
    if(self.canvas !==null) {
      self.canvas.style.left = window.pageXOffset+"px";
      self.canvas.style.top = window.pageYOffset+"px";
    }
  });

  document.addEventListener('keydown', function(e){
    if(e.keyCode===88){
      myCanvas.removeCanvas();
    }
  });
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
      if(!confirm("Do you want to send this clip to Kahoots App?")){return;}
      // Remove the canvas from body.
      myCanvas.removeCanvas();
      // Message to background.
      console.log("About to send \'capture\' msg");
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
    var pointer = getCursorPosition(e, this);
    // re-fill canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillRect(0, 0, this.width, this.height);
      if (!self.dragging) {
        this.ctx.fillStyle = "#000000";
        this.ctx.globalAlpha = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(pointer.x, 0);
        this.ctx.lineTo(pointer.x, this.height);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(0, pointer.y);
        this.ctx.lineTo(this.width ,pointer.y);
        this.ctx.stroke();
        this.ctx.fillStyle = "#666699";
        this.ctx.globalAlpha = 0.2;
      }else {
        self.rect.width = (pointer.x - self.rect.x);
        self.rect.height = (pointer.y - self.rect.y);

        // draw new rectangle
        this.ctx.clearRect(self.rect.x, self.rect.y, self.rect.width, self.rect.height);
      }
  };
};

myCanvas.initCanvas();
