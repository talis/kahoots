function clip(){
  var h='',sel;
  if(window.getSelection){
    sel=window.getSelection();
    if(sel.rangeCount){
      var d=document.createElement('div');
      for(var i=0;i<sel.rangeCount;++i){
        d.appendChild(sel.getRangeAt(i).cloneContents());
      }
      h=d.innerHTML
    }
  }
  alert(h);
}

clip();