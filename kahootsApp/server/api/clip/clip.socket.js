
 /**
 * Broadcast updates to client when the model changes
 */

'use strict';

var clip = require('./clip.model');

exports.register = function(socket) {
  clip.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  clip.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('clip:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('clip:remove', doc);
}
