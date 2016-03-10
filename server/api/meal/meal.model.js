'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MealSchema = new Schema({
  label: String,
  mealOptions: [{ mealOption: { type: mongoose.Schema.Types.ObjectId, ref: 'MealOption' }, mealOptionFlavors: [{ mealOptionFlavor: { type: mongoose.Schema.Types.ObjectId, ref: 'MealOption' }, price: { type: Number, require: true, default: 0, set: function(value) { return value || 0; } }, active: { type: Boolean, default: false } }] }],
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  price: { type: Number, require: true, min: 0, default: 0, set: function(value) { return value || 0; } },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Meal', MealSchema);