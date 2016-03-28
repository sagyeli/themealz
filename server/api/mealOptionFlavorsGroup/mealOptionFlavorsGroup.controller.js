/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/mealOptionFlavorsGroups              ->  index
 * POST    /api/mealOptionFlavorsGroups              ->  create
 * GET     /api/mealOptionFlavorsGroups/:id          ->  show
 * PUT     /api/mealOptionFlavorsGroups/:id          ->  update
 * DELETE  /api/mealOptionFlavorsGroups/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import MealOptionFlavorsGroup from './mealOptionFlavorsGroup.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates, function(a, b) { return b; });
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
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

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of MealOptionFlavorsGroups
export function index(req, res) {
  return MealOptionFlavorsGroup.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single MealOptionFlavorsGroup from the DB
export function show(req, res) {
  return MealOptionFlavorsGroup.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new MealOptionFlavorsGroup in the DB
export function create(req, res) {
  if (req.body.minSelection && req.body.maxSelection) {
    var minSelection = req.body.minSelection;
    var maxSelection = req.body.maxSelection;
    req.body.minSelection = Math.min(minSelection, maxSelection);
    req.body.maxSelection = Math.max(minSelection, maxSelection);
  }
  return MealOptionFlavorsGroup.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing MealOptionFlavorsGroup in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  if (req.body.minSelection && req.body.maxSelection) {
    var minSelection = req.body.minSelection;
    var maxSelection = req.body.maxSelection;
    req.body.minSelection = Math.min(minSelection, maxSelection);
    req.body.maxSelection = Math.max(minSelection, maxSelection);
  }
  return MealOptionFlavorsGroup.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a MealOptionFlavorsGroup from the DB
export function destroy(req, res) {
  return MealOptionFlavorsGroup.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
