/**
 * Created by lauren on 09/07/15.
 */

// Create canvas and attach to current web page.
function createCanvas(style) {


  // TODO: check if canvas already exists
  var c = document.createElement('canvas');
  /*var i = document.createElement('button');
  i.type ='button';
  i.id = 'send_button';
  i.innerText = 'Send to Kahoots!'
  for(var name in button_style){
    i.style[name] = button_style[name];
  }*/
  c.id = 'canvas';
  for(var name in style){
    c.style[name] = style[name];
  }
  c.style.top = window.pageYOffset+"px";
  c.style.left = window.pageXOffset+"px";

  document.body.appendChild(c);
  //.body.appendChild(i);
  // Need to set height after drawn
  c.height = c.offsetHeight;
  c.width = c.offsetWidth;

  var boxText = document.createElement("div");
  boxText.id = "klipperMsg";
  boxText.style.cssText = "zIndex:1002 ;position:absolute;width: 200px ;border: 3px solid white; margin-top: 8px; background: #4A2B80; font-size: 20px; color: white; padding: 5px";
  boxText.style.top = (c.height/2)+window.pageYOffset-10+"px";
  boxText.style.left = (c.width/2)+  window.pageXOffset-100+"px";
  boxText.style.position = 'absolute';
  boxText.style.zIndex = '1001';
  boxText.innerHTML = "Press 'esc' to exit.";
  document.body.appendChild(boxText);
}

var button_style = {
  zIndex: '1002',
  position:'absolute',
  top:'10px',
  left:'10px'
};
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
