'use strict';

var _ = require('lodash');
var MealOptionsGroup = require('./mealOptionsGroup.model');

// Get list of mealOptionsGroups
exports.index = function(req, res) {
  MealOptionsGroup.find(function (err, mealOptionsGroups) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(mealOptionsGroups);
  });
};

// Get a single mealOptionsGroup
exports.show = function(req, res) {
  MealOptionsGroup.findById(req.params.id, function (err, mealOptionsGroup) {
    if(err) { return handleError(res, err); }
    if(!mealOptionsGroup) { return res.status(404).send('Not Found'); }
    return res.json(mealOptionsGroup);
  });
};

// Creates a new mealOptionsGroup in the DB.
exports.create = function(req, res) {
  MealOptionsGroup.create(req.body, function(err, mealOptionsGroup) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(mealOptionsGroup);
  });
};

// Updates an existing mealOptionsGroup in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  MealOptionsGroup.findById(req.params.id, function (err, mealOptionsGroup) {
    if (err) { return handleError(res, err); }
    if(!mealOptionsGroup) { return res.status(404).send('Not Found'); }
    var updated = _.merge(mealOptionsGroup, req.body, function(a, b) { return b; });
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(mealOptionsGroup);
    });
  });
};

// Deletes a mealOptionsGroup from the DB.
exports.destroy = function(req, res) {
  MealOptionsGroup.findById(req.params.id, function (err, mealOptionsGroup) {
    if(err) { return handleError(res, err); }
    if(!mealOptionsGroup) { return res.status(404).send('Not Found'); }
    mealOptionsGroup.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}