'use strict';

var _ = require('lodash');
var MealOption = require('./mealOption.model');

// Get list of mealOptions
exports.index = function(req, res) {
  MealOption.find(function (err, mealOptions) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(mealOptions);
  });
};

// Get a single mealOption
exports.show = function(req, res) {
  MealOption.findOne({ _id: req.params.id, active: true }, function (err, mealOption) {
    if(err) { return handleError(res, err); }
    if(!mealOption) { return res.send(404); }
    return res.json(mealOption);
  });
};

// Get the children a single mealOption
exports.showChildren = function(req, res) {
  var getNonAbstractChildren = function(mealOptions, callback) {
    if (!mealOptions) {
      callback(mealOptions);
      return;
    }

    var i = mealOptions.length,
      abstractsChildrenIds = [];
    while (i--) {
      if (mealOptions[i].abstract) {
        abstractsChildrenIds = abstractsChildrenIds.concat(mealOptions[i].children);
        mealOptions.splice(i, 1);
      }
    }

    if (abstractsChildrenIds.length > 0) {
      MealOption.find({ _id: { $in: abstractsChildrenIds }, active: true }, function (err, childrenMealOptions) {
        getNonAbstractChildren(mealOptions.concat(childrenMealOptions), callback);
      });
    }
    else {
      callback(mealOptions);
    }
  };

  MealOption.findOne({ _id: req.params.id, active: true }, function (err, mealOption) {
    if(err) { return handleError(res, err); }
    if(!mealOption) { return res.send(404); }
    MealOption.find({ _id: { $in: mealOption.children }, active: true }, function (err, mealOptions) {
      getNonAbstractChildren(mealOptions, function(mealOptions) {
        if(err) { return handleError(res, err); }
        return res.status(200).json(mealOptions);
      });
    });
  });
};

// Creates a new mealOption in the DB.
exports.create = function(req, res) {
  MealOption.create(req.body, function(err, mealOption) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(mealOption);
  });
};

// Updates an existing mealOption in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  MealOption.findById(req.params.id, function (err, mealOption) {
    if (err) { return handleError(res, err); }
    if(!mealOption) { return res.send(404); }
    var updated = _.merge(mealOption, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(mealOption);
    });
  });
};

// Deletes a mealOption from the DB.
exports.destroy = function(req, res) {
  MealOption.findById(req.params.id, function (err, mealOption) {
    if(err) { return handleError(res, err); }
    if(!mealOption) { return res.send(404); }
    mealOption.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}