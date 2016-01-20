/**
 * MealOptionFlavor model events
 */

'use strict';

import {EventEmitter} from 'events';
var MealOptionFlavor = require('./mealOptionFlavor.model');
var MealOptionFlavorEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
MealOptionFlavorEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  MealOptionFlavor.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    MealOptionFlavorEvents.emit(event + ':' + doc._id, doc);
    MealOptionFlavorEvents.emit(event, doc);
  }
}

export default MealOptionFlavorEvents;
