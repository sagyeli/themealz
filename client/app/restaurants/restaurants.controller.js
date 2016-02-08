'use strict';

angular.module('themealzApp')
  .controller('RestaurantsCtrl', function ($scope, $http, socket) {
    $scope.restaurants = [];
    $scope.newRestaurantActive = true;

    $http.get('/api/restaurants').success(function(restaurants) {
      $scope.restaurants = restaurants;
      socket.syncUpdates('restaurant', $scope.restaurants);
    });

    $http.get('/api/mealOptionsGroups').success(function(mealOptionsGroups) {
      $scope.mealOptionsGroups = mealOptionsGroups;
      socket.syncUpdates('mealOptionsGroup', $scope.mealOptionsGroups);
    });

    $http.get('/api/mealOptions').success(function(mealOptions) {
      $scope.mealOptions = mealOptions;
      socket.syncUpdates('mealOption', $scope.mealOptions);
    });

    $scope.addOrEditRestaurant = function() {
      if($scope.newRestaurantTitle === '') {
        return;
      }
      $http[$scope.targetRestaurant ? 'put' : 'post']('/api/restaurants' + ($scope.targetRestaurant ? '/' + $scope.targetRestaurant._id : ''), { name: $scope.newRestaurantTitle, info: $scope.newRestaurantInfo, address: $scope.newRestaurantAddress, latitude: parseInt($scope.newRestaurantLatitude), longitude: parseInt($scope.newRestaurantLongitude), mealOptions: $scope.newMealOptionChildrenIds ? $scope.pluck($scope.newMealOptionChildrenIds, '_id') : null, mealOptionsGroups: $scope.newMealOptionsGroups ? $scope.pluck($scope.newMealOptionsGroups, '_id') : null, active: $scope.newRestaurantActive });
      $scope.targetRestaurant = '';
      $scope.newRestaurantTitle = '';
      $scope.newRestaurantInfo = '';
      $scope.newRestaurantAddress = '';
      $scope.newRestaurantLatitude = null;
      $scope.newRestaurantLongitude = null;
      $scope.newMealOptionChildrenIds = null;
      $scope.newMealOptionsGroups = null;
      $scope.newRestaurantActive = true;
    };

    $scope.deleteRestaurant = function(restaurant) {
      $http.delete('/api/restaurants/' + restaurant._id);
    };

    $scope.onTargetRestaurantChanged = function(restaurant) {
      $scope.targetRestaurant = restaurant;

      var i = $scope.restaurants.length;
      while(i--) {
        if ($scope.restaurants[i] === restaurant) {
          continue;
        }

        delete $scope.restaurants[i].selected;
      }

      if ($scope.targetRestaurant) {
        var item = $scope.getItemById($scope.restaurants, $scope.targetRestaurant._id);
        $scope.newRestaurantTitle = item.name;
        $scope.newRestaurantInfo = item.info;
        $scope.newRestaurantAddress = item.address;
        $scope.newRestaurantLatitude = item.latitude;
        $scope.newRestaurantLongitude = item.longitude;
        $scope.newMealOptionChildrenIds = $scope.getItemsByProperty($scope.mealOptions, item.mealOptions, '_id');
        $scope.newMealOptionsGroups = $scope.getItemsByProperty($scope.mealOptionsGroups, item.mealOptionsGroups, '_id');
        $scope.newRestaurantActive = item.active;

        restaurant.selected = true;
      }
      else {
        $scope.newRestaurantTitle = '';
        $scope.newRestaurantInfo = '';
        $scope.newRestaurantAddress = '';
        $scope.newRestaurantLatitude = null;
        $scope.newRestaurantLongitude = null;
        $scope.newMealOptionChildrenIds = null;
        $scope.newMealOptionsGroups = null;
        $scope.newRestaurantActive = true;
      }
    };

    $scope.onMealOptionsGroupsChanged = function() {
      if (!$scope.newMealOptionsGroups) {
        return;
      }

      var i = $scope.newMealOptionsGroups.length,
        newMealOptionChildrenIds = [];
      while (i--) {
        newMealOptionChildrenIds = newMealOptionChildrenIds.concat($scope.getItemsByProperty($scope.mealOptions, $scope.newMealOptionsGroups[i].children, '_id'));
      }
      $scope.newMealOptionChildrenIds = newMealOptionChildrenIds;
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('restaurant');
      socket.unsyncUpdates('mealOptionsGroup');
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
  });
