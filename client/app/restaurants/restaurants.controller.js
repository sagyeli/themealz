'use strict';

angular.module('themealzApp')
  .controller('RestaurantsCtrl', function ($scope, $http, socket) {
    $scope.restaurants = [];
    $scope.newRestaurantActive = true;

    $http.get('/api/restaurants').success(function(restaurants) {
      $scope.restaurants = restaurants;
      socket.syncUpdates('restaurant', $scope.restaurants);
    });

    $scope.addOrEditRestaurant = function() {
      if($scope.newRestaurantTitle === '') {
        return;
      }
      $http[$scope.targetRestaurant ? 'put' : 'post']('/api/restaurants' + ($scope.targetRestaurant ? '/' + $scope.targetRestaurant._id : ''), { name: $scope.newRestaurantTitle, info: $scope.newRestaurantInfo, address: $scope.newRestaurantAddress, latitude: parseInt($scope.newRestaurantLatitude), longitude: parseInt($scope.newRestaurantLongitude), active: $scope.newRestaurantActive });
      $scope.targetRestaurant = '';
      $scope.newRestaurantTitle = '';
      $scope.newRestaurantInfo = '';
      $scope.newRestaurantAddress = '';
      $scope.newRestaurantLatitude = null;
      $scope.newRestaurantLongitude = null;
      $scope.newRestaurantActive = true;
    };

    $scope.deleteRestaurant = function(restaurant) {
      $http.delete('/api/restaurants/' + restaurant._id);
    };

    $scope.onItemClicked = function(restaurant) {
      $scope.targetRestaurant = restaurant;
      $scope.onTargetRestaurantChanged();
    };

    $scope.onTargetRestaurantChanged = function() {
      if ($scope.targetRestaurant) {
        var item = $scope.getItemById($scope.restaurants, $scope.targetRestaurant._id);
        $scope.newRestaurantTitle = item.name;
        $scope.newRestaurantInfo = item.info;
        $scope.newRestaurantAddress = item.address;
        $scope.newRestaurantLatitude = item.latitude;
        $scope.newRestaurantLongitude = item.longitude;
        $scope.newRestaurantActive = item.active;
      }
      else {
        $scope.newRestaurantTitle = '';
        $scope.newRestaurantInfo = '';
        $scope.newRestaurantAddress = '';
        $scope.newRestaurantLatitude = null;
        $scope.newRestaurantLongitude = null;
        $scope.newRestaurantActive = true;
      }
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('restaurant');
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
