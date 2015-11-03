'use strict';

var _ = require('lodash');
var Restaurant = require('./restaurant.model');

// Get list of restaurants
exports.index = function(req, res) {
  Restaurant.find(function (err, restaurants) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(restaurants);
  });
};

// Get a single restaurant
exports.show = function(req, res) {
  Restaurant.findById(req.params.id, function (err, restaurant) {
    if(err) { return handleError(res, err); }
    if(!restaurant) { return res.status(404).send('Not Found'); }
    return res.json(restaurant);
  });
};

// Creates a new restaurant in the DB.
exports.create = function(req, res) {
  Restaurant.create(req.body, function(err, restaurant) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(restaurant);
  });
};

// Updates an existing restaurant in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Restaurant.findById(req.params.id, function (err, restaurant) {
    if (err) { return handleError(res, err); }
    if(!restaurant) { return res.status(404).send('Not Found'); }
    var updated = _.merge(restaurant, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(restaurant);
    });
  });
};

// Deletes a restaurant from the DB.
exports.destroy = function(req, res) {
  Restaurant.findById(req.params.id, function (err, restaurant) {
    if(err) { return handleError(res, err); }
    if(!restaurant) { return res.status(404).send('Not Found'); }
    restaurant.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}