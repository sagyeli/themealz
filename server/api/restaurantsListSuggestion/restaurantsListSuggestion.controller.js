'use strict';

var _ = require('lodash');
var RestaurantsListSuggestion = require('./restaurantsListSuggestion.model');
var MealOption = require('./../mealOption/mealOption.model');
var Restaurant = require('./../restaurant/restaurant.model');
var Meal = require('./../meal/meal.model');

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
      Meal.find(function (err, meals) {
        Restaurant.find(function (err, restaurants) {
          restaurants = _.filter(restaurants, function(restaurant) {
            var startTimeForCurrentDay = restaurant.startTime ? restaurant.startTime - (new Date(restaurant.startTime)).setHours(0,0,0,0) + (new Date()).setHours(0,0,0,0) : null,
              endTimeForCurrentDay = restaurant.endTime ? restaurant.endTime - (new Date(restaurant.endTime)).setHours(0,0,0,0) + (new Date()).setHours(0,0,0,0) : null,
              currentTime = new Date().getTime();

            if (startTimeForCurrentDay && currentTime < startTimeForCurrentDay) {
              return false;
            }
            if (endTimeForCurrentDay && currentTime > endTimeForCurrentDay) {
              return false;
            }

            return true;
          });

          var list = [],
            i = meals.length;
          while(i--) {
            var mealMealOptions = _.map(meals[i].mealOptions, function(item) { return item.mealOption.toString(); }),
              flavorsPriceAddition = 0;

            function checkForFlavorAndSumTheirPrices() {
              var j = meals[i].mealOptions.length;
              while(j--) {
                var flavorsIds = req.body.mealOptionFlavors[meals[i].mealOptions[j].mealOption.toString()]; 
                if (flavorsIds && flavorsIds.length > 0) {
                  var k = meals[i].mealOptions[j].mealOptionFlavors.length;
                  while(k--) {
                    if (flavorsIds.indexOf(meals[i].mealOptions[j].mealOptionFlavors[k].mealOptionFlavor.toString()) >= 0) {
                      flavorsPriceAddition += meals[i].mealOptions[j].mealOptionFlavors[k].price;
                    }
                    else {
                      return false;
                    }
                  }
                }
              }

              return true;
            }

            if (meals[i].active && mealMealOptions.length === req.body.mealOptions.length && _.difference(mealMealOptions, req.body.mealOptions).length === 0 && checkForFlavorAndSumTheirPrices()) {
              var suggestedRestaurant = _.findWhere(restaurants, { '_id': meals[i].restaurant });
              if (suggestedRestaurant) {
                list.unshift({ restaurant: { _id: suggestedRestaurant._id, name: suggestedRestaurant.name }, price: meals[i].price + flavorsPriceAddition, timeInMinutes: 0, grade: 5 });
              }
            }
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