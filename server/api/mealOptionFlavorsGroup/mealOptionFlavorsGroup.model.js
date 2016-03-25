'use strict';

import mongoose from 'mongoose';

var MealOptionFlavorsGroupSchema = new mongoose.Schema({
  name: String,
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MealOptionFlavor' }],
  active: Boolean
});

export default mongoose.model('MealOptionFlavorsGroup', MealOptionFlavorsGroupSchema);
