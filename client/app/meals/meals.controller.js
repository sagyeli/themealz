'use strict';

angular.module('themealzApp')
  .controller('MealsCtrl', function ($scope, $http, socket) {
    $scope.meals = [];
    $scope.restaurants = [];
    $scope.mealOptions = [];
    $scope.mealOptionFlavors = [];

    $scope.newRestaurantId = null;
    $scope.newMealOptionsIds = [];
    $scope.newMealOptionFlavorsByMealOptionIds = {};
    $scope.newMealPrice = null;
    $scope.newMealActive = true;

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
      $http[$scope.targetMeal ? 'put' : 'post']('/api/meals' + ($scope.targetMeal ? '/' + $scope.targetMeal._id : ''), { mealOptions: $scope.newMealOptionsIds ? $scope.map($scope.newMealOptionsIds, function(item) { return { mealOption: item, mealOptionFlavors: $scope.newMealOptionFlavorsByMealOptionIds[item._id] }; }) : null, restaurant: $scope.newRestaurantId ? $scope.newRestaurantId._id : null, price: parseFloat($scope.newMealPrice), active: $scope.newMealActive });
      $scope.newRestaurantId = null;
      $scope.newMealOptionsIds = [];
      $scope.newMealOptionFlavorsByMealOptionIds = {};
      $scope.newMealPrice = null;
      $scope.newMealActive = true;
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
        $scope.newRestaurantId = $scope.getItemById($scope.restaurants, item.restaurant);
        $scope.newMealOptionsIds = $scope.getItemsByProperty($scope.mealOptions, item.mealOptions, '_id');
        $scope.newMealOptionFlavorsByMealOptionIds = {};
        $scope.newMealPrice = item.price;
        $scope.newMealActive = item.active;

        $scope.newMealOptionsGroupTitle = item.name;
        $scope.newMealOptionChildrenIds = $scope.getItemsByProperty($scope.mealOptions, item.children, '_id');
        $scope.newMealOptionsGroupActive = item.active;

        meal.selected = true;
      }
      else {
        $scope.newRestaurantId = null;
        $scope.newMealOptionsIds = [];
        $scope.newMealOptionFlavorsByMealOptionIds = {};
        $scope.newMealPrice = null;
        $scope.newMealActive = true;
      }
    };

    $scope.handleMealOptionFlavors = function(mealOptionId, mealOptionFlavorId, priceText) {
      var price = parseInt(priceText);

      if (!$scope.newMealOptionFlavorsByMealOptionIds[mealOptionId]) {
        $scope.newMealOptionFlavorsByMealOptionIds[mealOptionId] = [];
      }

      var foundInArray = false,
        i = $scope.newMealOptionFlavorsByMealOptionIds[mealOptionId].length;
      while(i--) {
        if ($scope.newMealOptionFlavorsByMealOptionIds[mealOptionId][i].mealOptionFlavor === mealOptionFlavorId) {
          if (price) {
            $scope.newMealOptionFlavorsByMealOptionIds[mealOptionId][i].price = price;
          }
          else {
            $scope.newMealOptionFlavorsByMealOptionIds[mealOptionId].splice(i, 1);
          }

          foundInArray = true;
        }
      }

      if (!foundInArray && price) {
        $scope.newMealOptionFlavorsByMealOptionIds[mealOptionId].push({ mealOptionFlavor: mealOptionFlavorId, price: price });
      }
    };

    $scope.getFlavorsSummary = function(meal) {
      var summary = [];

      for (var i in meal.mealOptions) {
        summary.push(($scope.getItemById($scope.mealOptions, meal.mealOptions[i].mealOption) || {}).name + ': ' + ($scope.map(meal.mealOptions[i].mealOptionFlavors, function(item) { return ($scope.getItemById($scope.mealOptionFlavors, item.mealOptionFlavor) || {}).name + ': ' + item.price }) || []).join(', '));
      }

      return summary.join('|');
    };

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
            results.push(arr[i]);
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
        results.push(arr[i] ? arr[i][key] : null)
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
        results.push(arr[i] ? func(arr[i]) : null)
      }

      return results;
    };
  });
