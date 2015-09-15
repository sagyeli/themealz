'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MealOptionSchema = new Schema({
  name: String,
  iconUrl: String,
  info: String,
  parent: {type: mongoose.Schema.Types.ObjectId, ref: 'MealOption'},
  active: {type: Boolean, default: true }
});

module.exports = mongoose.model('MealOption', MealOptionSchema);