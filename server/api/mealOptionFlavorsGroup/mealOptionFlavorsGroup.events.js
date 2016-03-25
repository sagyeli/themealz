/**
 * MealOptionFlavorsGroup model events
 */

'use strict';

import {EventEmitter} from 'events';
import MealOptionFlavorsGroup from './mealOptionFlavorsGroup.model';
var MealOptionFlavorsGroupEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
MealOptionFlavorsGroupEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  MealOptionFlavorsGroup.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    MealOptionFlavorsGroupEvents.emit(event + ':' + doc._id, doc);
    MealOptionFlavorsGroupEvents.emit(event, doc);
  }
}

export default MealOptionFlavorsGroupEvents;
