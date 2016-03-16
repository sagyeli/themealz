'use strict';

angular.module('themealzApp')
  .controller('RestaurantsCtrl', function($scope, $http, socket, Auth) {
    $scope.restaurants = [];
    $scope.mealOptionsGroups = [];
    $scope.newRestaurantPhoneNumbers = [];
    $scope.mealOptions = [];
    $scope.users = [];
    $scope.newRestaurantActive = true;

    $scope.phoneNumberStartTimepickerIsOpened = [];
    $scope.phoneNumberStopTimepickerIsOpened = [];

    $scope.isAdmin = Auth.isAdmin;

    $http.get('/api/restaurants').success(function(restaurants) {
      function translateDateAttributes(restaurant) {
        restaurant.startTime = restaurant.startTime ? new Date(restaurant.startTime) : null;
        restaurant.endTime = restaurant.endTime ? new Date(restaurant.endTime) : null;

        var i = (restaurant.phoneNumbers || []).length;
        while(i--) {
          restaurant.phoneNumbers[i].startTime = restaurant.phoneNumbers[i].startTime ? new Date(restaurant.phoneNumbers[i].startTime) : null;
          restaurant.phoneNumbers[i].endTime = restaurant.phoneNumbers[i].endTime ? new Date(restaurant.phoneNumbers[i].endTime) : null;
        }

        return restaurant;
      }

      $scope.restaurants = $scope.map(restaurants, translateDateAttributes);
      socket.syncUpdates('restaurant', $scope.restaurants, function(event, item, array) {
        $scope.restaurants = $scope.map(array, translateDateAttributes);
      });
    });

    $http.get('/api/mealOptionsGroups').success(function(mealOptionsGroups) {
      $scope.mealOptionsGroups = mealOptionsGroups;
      socket.syncUpdates('mealOptionsGroup', $scope.mealOptionsGroups);
    });

    $http.get('/api/mealOptions').success(function(mealOptions) {
      $scope.mealOptions = mealOptions;
      socket.syncUpdates('mealOption', $scope.mealOptions);
    });

    $http.get('/api/users').success(function(users) {
      $scope.users = users;
      socket.syncUpdates('user', $scope.users);
    });

    $scope.addOrEditRestaurant = function() {
      if($scope.newRestaurantTitle === '') {
        return;
      }

      if ($scope.newRestaurantStartTime) {
        $scope.newRestaurantStartTime.setSeconds(0);
      }
      if ($scope.newRestaurantEndTime) {
        $scope.newRestaurantEndTime.setSeconds(0);
      }

      var i = ($scope.newRestaurantPhoneNumbers || []).length;
      while(i--) {
        if ($scope.newRestaurantPhoneNumbers[i].startTime) {
          $scope.newRestaurantPhoneNumbers[i].startTime.setSeconds(0);
        }
        if ($scope.newRestaurantPhoneNumbers[i].endTime) {
          $scope.newRestaurantPhoneNumbers[i].endTime.setSeconds(0);
        }
      }

      $http[$scope.targetRestaurant ? 'put' : 'post']('/api/restaurants' + ($scope.targetRestaurant ? '/' + $scope.targetRestaurant._id : ''), { name: $scope.newRestaurantTitle, info: $scope.newRestaurantInfo, address: $scope.newRestaurantAddress, startTime: $scope.newRestaurantStartTime, endTime: $scope.newRestaurantEndTime, deliveryTime: $scope.newRestaurantDeliveryTime, latitude: parseInt($scope.newRestaurantLatitude), longitude: parseInt($scope.newRestaurantLongitude), phoneNumbers: $scope.newRestaurantPhoneNumbers, mealOptions: $scope.newMealOptionChildrenIds ? $scope.pluck($scope.newMealOptionChildrenIds, '_id') : null, mealOptionsGroups: $scope.newMealOptionsGroups ? $scope.pluck($scope.newMealOptionsGroups, '_id') : null, admin: $scope.newUser, active: $scope.newRestaurantActive });
      $scope.targetRestaurant = '';
      $scope.newRestaurantTitle = '';
      $scope.newRestaurantInfo = '';
      $scope.newRestaurantAddress = '';
      $scope.newRestaurantStartTime = null;
      $scope.newRestaurantEndTime = null;
      $scope.newRestaurantDeliveryTime = null;
      $scope.newRestaurantLatitude = null;
      $scope.newRestaurantLongitude = null;
      $scope.newRestaurantPhoneNumbers = [];
      $scope.newMealOptionChildrenIds = null;
      $scope.newMealOptionsGroups = null;
      $scope.newUser = null;
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
        $scope.newRestaurantStartTime = item.startTime;
        $scope.newRestaurantEndTime = item.endTime;
        $scope.newRestaurantDeliveryTime = item.deliveryTime;
        $scope.newRestaurantLatitude = item.latitude;
        $scope.newRestaurantLongitude = item.longitude;
        $scope.newRestaurantPhoneNumbers = [].concat(item.phoneNumbers || []);
        $scope.newMealOptionChildrenIds = $scope.getItemsByProperty($scope.mealOptions, item.mealOptions, '_id');
        $scope.newMealOptionsGroups = $scope.getItemsByProperty($scope.mealOptionsGroups, item.mealOptionsGroups, '_id');
        $scope.newUser = $scope.getItemById($scope.users, item.admin);
        $scope.newRestaurantActive = item.active;

        restaurant.selected = true;
      }
      else {
        $scope.newRestaurantTitle = '';
        $scope.newRestaurantInfo = '';
        $scope.newRestaurantAddress = '';
        $scope.newRestaurantStartTime = null;
        $scope.newRestaurantEndTime = null;
        $scope.newRestaurantDeliveryTime = null;
        $scope.newRestaurantLatitude = null;
        $scope.newRestaurantLongitude = null;
        $scope.newRestaurantPhoneNumbers = [];
        $scope.newMealOptionChildrenIds = null;
        $scope.newMealOptionsGroups = null;
        $scope.newUser = null;
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

    $scope.addPhoneNumber = function() {
      $scope.newRestaurantPhoneNumbers.push({});
    };

    $scope.deletePhoneNumber = function(index) {
      $scope.newRestaurantPhoneNumbers.splice(index, 1);
    };

    $scope.$on('$destroy', function() {
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
