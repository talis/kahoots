/**
 *  Broadcast updates to client when the model changes
 */

'user strict';

var Clip = require('./clip.model');

exports.register = function(socket){
  Clip.schema.post('save', function (doc){
    onSave(socket, doc);
  });

  Clip.schema.post('remove', function( doc){
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb){
  socket.emit('clip:save', doc);
}

function onRemove(socket, doc, cb){
  socket.emit('clip:remove', doc);
}
