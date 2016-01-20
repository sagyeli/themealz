/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/mealOptionFlavors              ->  index
 * POST    /api/mealOptionFlavors              ->  create
 * GET     /api/mealOptionFlavors/:id          ->  show
 * PUT     /api/mealOptionFlavors/:id          ->  update
 * DELETE  /api/mealOptionFlavors/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var MealOptionFlavor = require('./mealOptionFlavor.model');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

// Gets a list of MealOptionFlavors
export function index(req, res) {
  MealOptionFlavor.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a single MealOptionFlavor from the DB
export function show(req, res) {
  MealOptionFlavor.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new MealOptionFlavor in the DB
export function create(req, res) {
  MealOptionFlavor.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing MealOptionFlavor in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  MealOptionFlavor.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a MealOptionFlavor from the DB
export function destroy(req, res) {
  MealOptionFlavor.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
