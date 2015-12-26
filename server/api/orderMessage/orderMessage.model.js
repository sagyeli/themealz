'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OrderMessageSchema = new Schema({
  numberTo: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OrderMessage', OrderMessageSchema);