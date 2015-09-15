'use strict';

var _ = require('lodash');
var MealOption = require('./mealOption.model');

// Get list of mealOptions
exports.index = function(req, res) {
  MealOption.find(function (err, mealOptions) {
    if(err) { return handleError(res, err); }
    return res.json(200, mealOptions);
  });
};

// Get a single mealOption
exports.show = function(req, res) {
  MealOption.findById(req.params.id, function (err, mealOption) {
    if(err) { return handleError(res, err); }
    if(!mealOption) { return res.send(404); }
    return res.json(mealOption);
  });
};

// Creates a new mealOption in the DB.
exports.create = function(req, res) {
  MealOption.create(req.body, function(err, mealOption) {
    if(err) { return handleError(res, err); }
    return res.json(201, mealOption);
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
      return res.json(200, mealOption);
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