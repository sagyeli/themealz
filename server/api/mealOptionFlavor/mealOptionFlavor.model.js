'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var MealOptionFlavorSchema = new mongoose.Schema({
  name: String,
  active: { type: Boolean, default: true }
});

export default mongoose.model('MealOptionFlavor', MealOptionFlavorSchema);
