'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RestaurantsListSuggestionSchema = new Schema({
  mealOptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MealOption' }],
  list: [{ restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }, price: { type: Number, min: 0 }, timeInMinutes: { type: Number, min: 0 }, grade: { type: Number, min: 0, max: 10 } }],
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('RestaurantsListSuggestion', RestaurantsListSuggestionSchema);