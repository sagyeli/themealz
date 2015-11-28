'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MealSchema = new Schema({
  mealOptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MealOption' }],
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  price: { type: Number, min: 0 },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Meal', MealSchema);