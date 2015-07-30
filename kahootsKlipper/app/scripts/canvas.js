/**
 * Created by lauren on 09/07/15.
 */

// Create canvas and attach to current web page.
function createCanvas(style) {


  // TODO: check if canvas already exists
  var c = document.createElement('canvas');
  c.id = 'canvas';
  for(var name in style){
    c.style[name] = style[name];
  }
  c.style.top = window.pageYOffset+"px";
  c.style.left = window.pageXOffset+"px";

  document.body.appendChild(c);
  // Need to set height after drawn
  c.height = c.offsetHeight;
  c.width = c.offsetWidth;
}

var style = {
  position: 'absolute',
  //left: "0px",
  //top: "0px",
  zIndex: '1000',
  width: '100%',
  height: '100%',
  border: '1px solid black',
  cursor:'crosshair'
};

createCanvas(style);
