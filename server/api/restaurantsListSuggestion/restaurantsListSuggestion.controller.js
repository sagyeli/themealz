'use strict';

var _ = require('lodash');
var RestaurantsListSuggestion = require('./restaurantsListSuggestion.model');
var MealOption = require('./../mealOption/mealOption.model');
var Restaurant = require('./../restaurant/restaurant.model');

// Get list of restaurantsListSuggestions
exports.index = function(req, res) {
  RestaurantsListSuggestion.find(function (err, restaurantsListSuggestions) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(restaurantsListSuggestions);
  });
};

// Get a single restaurantsListSuggestion
exports.show = function(req, res) {
  RestaurantsListSuggestion.findById(req.params.id, function (err, restaurantsListSuggestion) {
    if(err) { return handleError(res, err); }
    if(!restaurantsListSuggestion) { return res.status(404).send('Not Found'); }
    return res.json(restaurantsListSuggestion);
  });
};

// Creates a new restaurantsListSuggestion in the DB.
exports.create = function(req, res) {
  if (req.body.mealOptions) {
    MealOption.find({ _id: { $in: req.body.mealOptions } }, function (err, mealOptions) {
      Restaurant.find(function (err, restaurants) {
        var list = [],
          i = restaurants.length;
        while(i--) {
          list.unshift({ restaurant: { name: restaurants[i].name }, price: Math.random() * 100, timeInMinutes: Math.random() * 60, grade: Math.random() * 5 });
        }

        RestaurantsListSuggestion.create({
          mealOptions: mealOptions,
          list: list
        },
        function(err, restaurantsListSuggestion) {
          if(err) { return handleError(res, err); }
          return res.status(201).json(restaurantsListSuggestion.list);
        });
      });
    });
  }
  else {
    RestaurantsListSuggestion.create(req.body, function(err, restaurantsListSuggestion) {
      if(err) { return handleError(res, err); }
      return res.status(201).json(restaurantsListSuggestion);
    });
  }
};

// Updates an existing restaurantsListSuggestion in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  RestaurantsListSuggestion.findById(req.params.id, function (err, restaurantsListSuggestion) {
    if (err) { return handleError(res, err); }
    if(!restaurantsListSuggestion) { return res.status(404).send('Not Found'); }
    var updated = _.merge(restaurantsListSuggestion, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(restaurantsListSuggestion);
    });
  });
};

// Deletes a restaurantsListSuggestion from the DB.
exports.destroy = function(req, res) {
  RestaurantsListSuggestion.findById(req.params.id, function (err, restaurantsListSuggestion) {
    if(err) { return handleError(res, err); }
    if(!restaurantsListSuggestion) { return res.status(404).send('Not Found'); }
    restaurantsListSuggestion.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}