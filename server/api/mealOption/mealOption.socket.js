/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var MealOption = require('./mealOption.model');

exports.register = function(socket) {
  MealOption.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  MealOption.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('mealOption:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('mealOption:remove', doc);
}