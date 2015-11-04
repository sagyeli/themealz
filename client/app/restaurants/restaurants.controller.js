'use strict';

angular.module('themealzApp')
  .controller('RestaurantsCtrl', function ($scope, $http, socket) {
    $scope.restaurants = [];
    $scope.newRestaurantActive = true;
    $scope.newRestaurantAbstract = false;

    $http.get('/api/restaurants').success(function(restaurants) {
      $scope.restaurants = restaurants;
      socket.syncUpdates('restaurant', $scope.restaurants);
    });

    $scope.addOrEditRestaurant = function() {
      if($scope.newRestaurantTitle === '' && $scope.newRestaurantLabel === '') {
        return;
      }
      $http[$scope.targetRestaurant ? 'put' : 'post']('/api/restaurants' + ($scope.targetRestaurant ? '/' + $scope.targetRestaurant._id : ''), { name: $scope.newRestaurantTitle, label: $scope.newRestaurantLabel, info: $scope.newRestaurantInfo, children: $scope.newRestaurantChildrenIds ? $scope.pluck($scope.newRestaurantChildrenIds, '_id') : null, active: $scope.newRestaurantActive, abstract: $scope.newRestaurantAbstract });
      $scope.targetRestaurant = '';
      $scope.newRestaurantTitle = '';
      $scope.newRestaurantLabel = '';
      $scope.newRestaurantInfo = '';
      $scope.newRestaurantChildrenIds = null;
      $scope.newRestaurantActive = true;
      $scope.newRestaurantAbstract = false;
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
        $scope.newRestaurantLabel = item.label;
        $scope.newRestaurantInfo = item.info;
        $scope.newRestaurantChildrenIds = $scope.getItemsByProperty($scope.restaurants, item.children, '_id');
        $scope.newRestaurantActive = item.active;
        $scope.newRestaurantAbstract = item.abstract;
      }
      else {
        $scope.newRestaurantTitle = '';
        $scope.newRestaurantLabel = '';
        $scope.newRestaurantInfo = '';
        $scope.newRestaurantChildrenIds = null;
        $scope.newRestaurantActive = true;
        $scope.newRestaurantAbstract = false;
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
