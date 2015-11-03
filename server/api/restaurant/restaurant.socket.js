/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Restaurant = require('./restaurant.model');

exports.register = function(socket) {
  Restaurant.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Restaurant.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('restaurant:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('restaurant:remove', doc);
}