'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OrderMessageSchema = new Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  text: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OrderMessage', OrderMessageSchema);