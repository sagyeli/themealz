'use strict';

var _ = require('lodash');
var Restaurant = require('./restaurant.model');

// Get list of restaurants
exports.index = function(req, res) {
  Restaurant.find(req.user.role === 'admin' ? {} : { admin: req.user._id }, function (err, restaurants) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(restaurants);
  });
};

// Get a single restaurant
exports.show = function(req, res) {
  Restaurant.findOne(Object.assign({ _id: req.params.id }, req.user.role === 'admin' ? {} : { admin: req.user._id }), function (err, restaurant) {
    if(err) { return handleError(res, err); }
    if(!restaurant) { return res.status(404).send('Not Found'); }
    return res.json(restaurant);
  });
};

// Creates a new restaurant in the DB.
exports.create = function(req, res) {
  req.body.admin = req.user._id;

  Restaurant.create(req.body, function(err, restaurant) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(restaurant);
  });
};

// Updates an existing restaurant in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Restaurant.findOne(Object.assign({ _id: req.params.id }, req.user.role === 'admin' ? {} : { admin: req.user._id }), function (err, restaurant) {
    if (err) { return handleError(res, err); }
    if(!restaurant) { return res.status(404).send('Not Found'); }
    if (req.user.role !== 'admin') {
      req.body.admin = req.user._id;
    }
    var updated = _.merge(restaurant, req.body, function(a, b) { return b; });
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(restaurant);
    });
  });
};

// Deletes a restaurant from the DB.
exports.destroy = function(req, res) {
  Restaurant.findOne(Object.assign({ _id: req.params.id }, req.user.role === 'admin' ? {} : { admin: req.user._id }), function (err, restaurant) {
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