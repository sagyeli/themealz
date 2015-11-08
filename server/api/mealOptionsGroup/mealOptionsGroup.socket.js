/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var MealOptionsGroup = require('./mealOptionsGroup.model');

exports.register = function(socket) {
  MealOptionsGroup.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  MealOptionsGroup.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('mealOptionsGroup:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('mealOptionsGroup:remove', doc);
}