/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var OrderMessage = require('./orderMessage.model');

exports.register = function(socket) {
  OrderMessage.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  OrderMessage.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('orderMessage:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('orderMessage:remove', doc);
}