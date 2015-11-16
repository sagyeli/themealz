'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MealOptionsGroupSchema = new Schema({
  name: String,
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MealOption' }],
  active: Boolean
});

module.exports = mongoose.model('MealOptionsGroup', MealOptionsGroupSchema);