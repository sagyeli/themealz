'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MealOptionSchema = new Schema({
  name: String,
  label: String,
  rootLabel: String,
  iconUrl: String,
  info: String,
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MealOption' }],
  relevantFlavors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MealOptionFlavor' }],
  relevantFlavorsGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MealOptionFlavorsGroup' }],
  hasRealChildren: { type: Boolean, default: false },
  hasFlavors: { type: Boolean, default: false },
  imageURL: String,
  active: { type: Boolean, default: true },
  abstract: { type: Boolean, default: false }
});

module.exports = mongoose.model('MealOption', MealOptionSchema);