'use strict';

import mongoose from 'mongoose';

var MealOptionFlavorsGroupSchema = new mongoose.Schema({
  name: String,
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MealOptionFlavor' }],
  minSelection: { type: Number, require: true, min: 1, default: 1, set: function(value) { return value || 1; } },
  maxSelection: { type: Number, require: true, min: 1, default: 1, set: function(value) { return value || 1; } },
  active: Boolean
});

export default mongoose.model('MealOptionFlavorsGroup', MealOptionFlavorsGroupSchema);
