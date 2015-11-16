/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var RestaurantsListSuggestion = require('./restaurantsListSuggestion.model');

exports.register = function(socket) {
  RestaurantsListSuggestion.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  RestaurantsListSuggestion.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('restaurantsListSuggestion:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('restaurantsListSuggestion:remove', doc);
}