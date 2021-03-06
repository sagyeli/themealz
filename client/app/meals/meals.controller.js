'use strict';

angular.module('themealzApp')
  .controller('MealsCtrl', function ($scope, $http, socket) {
    $scope.meals = [];
    $scope.restaurants = [];
    $scope.mealOptions = [];
    $scope.mealOptionFlavors = [];

    $scope.newMealLabel = null;
    $scope.newRestaurantId = null;
    $scope.newMealOptionsIds = [];
    $scope.newMealPrice = null;
    $scope.newMealActive = true;

    $scope.flavorsActives = {};
    $scope.flavorsPrices = {};

    $scope.restaurantsTabs = [];

    $http.get('/api/meals').success(function(meals) {
      $scope.meals = meals;
      socket.syncUpdates('meal', $scope.meals);
    });

    $http.get('/api/restaurants').success(function(restaurants) {
      $scope.restaurants = restaurants;
      socket.syncUpdates('restaurant', $scope.restaurants);
    });

    $http.get('/api/mealOptions').success(function(mealOptions) {
      $scope.mealOptions = mealOptions;
      socket.syncUpdates('mealOption', $scope.mealOptions);
    });

    $http.get('/api/mealOptionFlavors').success(function(mealOptionFlavors) {
      $scope.mealOptionFlavors = mealOptionFlavors;
      socket.syncUpdates('mealOptionFlavor', $scope.mealOptionFlavors);
    });

    $scope.addOrEditMeal = function() {
      $http[$scope.targetMeal ? 'put' : 'post']('/api/meals' + ($scope.targetMeal ? '/' + $scope.targetMeal._id : ''), { label: $scope.newMealLabel, mealOptions: $scope.newMealOptionsIds ? $scope.map($scope.newMealOptionsIds, function(item) { return { mealOption: { _id: item._id }, mealOptionFlavors: $scope.map(item.relevantFlavors, function(flavorId) { return { mealOptionFlavor: flavorId, price: parseFloat($scope.flavorsPrices[item._id + '_' + flavorId]), active: !!$scope.flavorsActives[item._id + '_' + flavorId] } }) }; }) : null, restaurant: $scope.newRestaurantId ? $scope.newRestaurantId._id : null, price: parseFloat($scope.newMealPrice), active: $scope.newMealActive });
      $scope.newMealLabel = null;
      $scope.newRestaurantId = null;
      $scope.newMealOptionsIds = [];
      $scope.newMealPrice = null;
      $scope.newMealActive = true;

      $scope.flavorsActives = {};
      $scope.flavorsPrices = {};
    };

    $scope.deleteMeal = function(meal) {
      $http.delete('/api/meals/' + meal._id);
    };

    $scope.onTargetMealChanged = function(meal) {
      $scope.targetMeal = meal;

      var i = $scope.meals.length;
      while(i--) {
        if ($scope.meals[i] === meal) {
          continue;
        }

        delete $scope.meals[i].selected;
      }

      if ($scope.targetMeal) {
        var item = $scope.getItemById($scope.meals, $scope.targetMeal._id);
        $scope.newMealLabel = item.label;
        $scope.newRestaurantId = $scope.getItemById($scope.restaurants, item.restaurant);
        $scope.newMealOptionsIds = $scope.getItemsByProperty($scope.mealOptions, $scope.pluck(item.mealOptions, 'mealOption'), '_id');
        $scope.newMealPrice = item.price;
        $scope.newMealActive = item.active;

        $scope.newMealOptionsGroupTitle = item.name;
        $scope.newMealOptionChildrenIds = $scope.getItemsByProperty($scope.mealOptions, item.children, '_id');
        $scope.newMealOptionsGroupActive = item.active;

        $scope.flavorsActives = {};
        $scope.flavorsPrices = {};
        var i = $scope.targetMeal.mealOptions.length;
        while (i--) {
          var mealOption = $scope.targetMeal.mealOptions[i],
            j = mealOption.mealOptionFlavors.length;
            while(j--) {
              $scope.flavorsActives[mealOption.mealOption + '_' + mealOption.mealOptionFlavors[j].mealOptionFlavor] = mealOption.mealOptionFlavors[j].active;
              $scope.flavorsPrices[mealOption.mealOption + '_' + mealOption.mealOptionFlavors[j].mealOptionFlavor] = mealOption.mealOptionFlavors[j].price;
            }
        }

        meal.selected = true;
      }
      else {
        $scope.newMealLabel = null;
        $scope.newRestaurantId = null;
        $scope.newMealOptionsIds = [];
        $scope.newMealPrice = null;
        $scope.newMealActive = true;

        $scope.flavorsActives = {};
        $scope.flavorsPrices = {};
      }
    };

    $scope.getFlavorsSummary = function(meal) {
      var summary = [];

      for (var i in meal.mealOptions) {
        summary.push(($scope.getItemById($scope.mealOptions, meal.mealOptions[i].mealOption) || {}).name + ': ' + ($scope.map(meal.mealOptions[i].mealOptionFlavors, function(item) { return ($scope.getItemById($scope.mealOptionFlavors, item.mealOptionFlavor) || {}).name + ': ' + item.price }) || []).join(', '));
      }

      return summary.join('|');
    };

    $scope.flavorPriceChanged = function(maelFlavorId) {
      $scope.flavorsActives[maelFlavorId] = !!parseInt($scope.flavorsPrices[maelFlavorId]);
    };

    $scope.selectRestaurantsTab = function(restaurantsTab) {
      var i = $scope.restaurantsTabs.length;
      while(i--) {
          $scope.restaurantsTabs[i].active = $scope.restaurantsTabs[i] === restaurantsTab;
      }
    };

    $scope.$watch('restaurants', function(restaurants) {
      $scope.restaurantsTabs = $scope.map(restaurants, function(restaurant) {
        return {
          id: restaurant._id,
          name: restaurant.name
        }
      });

      var i = $scope.restaurantsTabs.length;
      while(i--) {
          $scope.restaurantsTabs[i].active = i === 0;
      }
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('meal');
      socket.unsyncUpdates('restaurant');
      socket.unsyncUpdates('mealOption');
    });

    $scope.getItemById = function(arr, id) {
      if (!Array.isArray(arr)) {
        return null;
      }

      var i = arr.length;
      while (i--) {
        if (arr[i]._id === id) {
          return arr[i];
        }
      }

      return null;
    };

    $scope.getItemsByProperty = function(arr, val, key) {
      if (!Array.isArray(arr)) {
        return null;
      }

      var results = [],
        i = arr.length;
      while (i--) {
        if (arr[i]) {
          if (Array.isArray(val) && val.indexOf(arr[i][key]) >= 0) {
            results.unshift(arr[i]);
          }
          else if (arr[i][key] === val) {
            return arr[i];
          }
        }
      }

      return Array.isArray(val) ? results : null;
    };

    $scope.pluck = function(arr, key) {
      if (!Array.isArray(arr)) {
        return null;
      }

      var results = [],
        i = arr.length;
      while (i--) {
        results.unshift(arr[i] ? arr[i][key] : null)
      }

      return results;
    };

    $scope.map = function(arr, func) {
      if (!Array.isArray(arr)) {
        return null;
      }

      var results = [],
        i = arr.length;
      while (i--) {
        results.unshift(arr[i] ? func(arr[i]) : null)
      }

      return results;
    };
  });
