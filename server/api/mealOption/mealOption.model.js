'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MealOptionSchema = new Schema({
  name: String,
  label: String,
  iconUrl: String,
  info: String,
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MealOption' }],
  hasRealChildren: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  abstract: { type: Boolean, default: false }
});

module.exports = mongoose.model('MealOption', MealOptionSchema);