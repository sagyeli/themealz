'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RestaurantSchema = new Schema({
  name: String,
  info: String,
  address: String,
  latitude: Number,
  longitude: Number,
  admin: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  active: {type: Boolean, default: true }
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);