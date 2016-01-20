'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MealSchema = new Schema({
  mealOptions: [{ mealOption: { type: mongoose.Schema.Types.ObjectId, ref: 'MealOption' }, mealOptionFlavors: [{ mealOptionFlavor: { type: mongoose.Schema.Types.ObjectId, ref: 'MealOption' }, price: { type: Number } }] }],
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  price: { type: Number, min: 0 },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Meal', MealSchema);