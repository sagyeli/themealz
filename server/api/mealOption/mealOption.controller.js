'use strict';

var _ = require('lodash');
var q = require('q');
var MealOption = require('./mealOption.model');

// Get list of mealOptions
exports.index = function(req, res) {
  MealOption.find(function(err, mealOptions) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(mealOptions);
  });
};

// Get a single mealOption
exports.show = function(req, res) {
  MealOption.findOne({ _id: req.params.id, active: true }, function(err, mealOption) {
    if(err) { return handleError(res, err); }
    if(!mealOption) { return res.send(404); }
    return res.json(mealOption);
  });
};

// Get the children a single mealOption
exports.showChildren = function(req, res) {
  function getNonAbstractChildren(mealOptions, callback) {
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
      MealOption.find({ _id: { $in: abstractsChildrenIds }, active: true }, function(err, childrenMealOptions) {
        getNonAbstractChildren(mealOptions.concat(childrenMealOptions), callback);
      });
    }
    else {
      var promisesArray = [],
        i = mealOptions.length;
      while (i--) {
        var mealOption = mealOptions[i],
          deferred = q.defer();
        (function(deferred) {
          MealOption.find({ _id: { $in: mealOption.children }, active: true }, function(err, childrenMealOptions) {
            getNonAbstractChildren(childrenMealOptions, function(mealOptions) {
              mealOption.hasRealChildren = mealOptions && mealOptions.length > 0;
              deferred.resolve();
            });
          });
        })(deferred);
        promisesArray.push(deferred.promise);
      }

      q.when.apply(null, promisesArray).then(function() {
        callback(mealOptions);
      });
    }
  };

  var searchParams = { active: true };
  switch(req.params.id) {
    case 'sushi':
    case 'pizza':
    case 'falafel':
    case 'meat':
      searchParams.rootLabel = req.params.id;
      break;
    default:
      searchParams._id = req.params.id;
      break;
  }

  MealOption.findOne(searchParams, function(err, mealOption) {
    if(err) { return handleError(res, err); }
    if(!mealOption) { return res.send(404); }
    MealOption.find({ _id: { $in: mealOption.children }, active: true }, function(err, mealOptions) {
      getNonAbstractChildren(mealOptions, function(mealOptions) {
        if(err) { return handleError(res, err); }
        return res.status(200).json(mealOptions);
      });
    });
  });
};

function updateChildrenWithFlavors(children, flavors, callback) {
  var promisesArray = [];

  MealOption.find({ _id: { $in: children }, active: true }, function(err, childrenMealOptions) {
    var i = childrenMealOptions.length;
    while(i--) {
      var mealOption = childrenMealOptions[i],
        deferred = q.defer();
      mealOption.relevantFlavors = _.merge(mealOption.relevantFlavors || [], flavors, function(a, b) { return b; });
      mealOption.save(function(err) {
        if (err) { return handleError(null, err); }
        if (!mealOption.children || mealOption.children.legnth === 0) {
          deferred.resolve();
        }
        else {
          updateChildrenWithFlavors(mealOption.children, flavors, function() {
            deferred.resolve();
          });
        }
      });
      promisesArray.push(deferred.promise);
    }
  });

  q.when.apply(null, promisesArray).then(function() {
    callback();
  });
};

function updateParents(mealOption, callback) {
  var promisesArray = [];

  MealOption.find({ _id: { $in: mealOption.parents }, active: true }, function(err, parentsMealOptions) {
    var i = parentsMealOptions.length;
    while(i--) {
      if (!parentsMealOptions[i].children || parentsMealOptions[i].children && parentsMealOptions[i].children.indexOf(mealOption._id) < 0) {
        var deferred = q.defer();
        promisesArray.push(deferred.promise);

        if(!parentsMealOptions[i].children) {
          parentsMealOptions[i].children = [];
        }
        parentsMealOptions[i].children.push(mealOption._id);
        parentsMealOptions[i].save(function(err) {
          if (err) { return handleError(null, err); }
          deferred.resolve();
        });
      }
    }
  });

  MealOption.find({ _id: { $nin: mealOption.parents }, active: true }, function(err, parentsMealOptions) {
    var i = parentsMealOptions.length;
    while(i--) {
      if (parentsMealOptions[i].children && parentsMealOptions[i].children.indexOf(mealOption._id) >= 0) {
        var deferred = q.defer();
        promisesArray.push(deferred.promise);

        parentsMealOptions[i].children.splice(parentsMealOptions[i].children.indexOf(mealOption._id), 1);
        parentsMealOptions[i].save(function(err) {
          if (err) { return handleError(null, err); }
          deferred.resolve();
        });
      }
    }
  });

  q.when.apply(null, promisesArray).then(function() {
    callback();
  });
}

// Creates a new mealOption in the DB.
exports.create = function(req, res) {
  MealOption.create(req.body, function(err, mealOption) {
    if(err) { return handleError(res, err); }
      updateChildrenWithFlavors(mealOption.children, mealOption.relevantFlavors, function() {
        updateParents(mealOption, function() {
          return res.status(201).json(mealOption);
        });
      });
  });
};

// Updates an existing mealOption in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  MealOption.findById(req.params.id, function(err, mealOption) {
    if (err) { return handleError(res, err); }
    if(!mealOption) { return res.send(404); }
    var updated = _.merge(mealOption, req.body, function(a, b) { return b; });
    updated.save(function(err) {
      if (err) { return handleError(res, err); }
        updateChildrenWithFlavors(mealOption.children, mealOption.relevantFlavors, function() {
          updateParents(mealOption, function() {
            return res.status(200).json(mealOption);
          });
        });
    });
  });
};

// Deletes a mealOption from the DB.
exports.destroy = function(req, res) {
  MealOption.findById(req.params.id, function(err, mealOption) {
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