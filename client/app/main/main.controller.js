'use strict'; 

angular.module('themealzApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.mealOptions = [];
    $scope.newMealOptionActive = true;

    $http.get('/api/mealOptions').success(function(mealOptions) {
      $scope.mealOptions = mealOptions;
      socket.syncUpdates('mealOption', $scope.mealOptions);
    });

    $scope.addMealOption = function() {
      if($scope.newMealOptionTitle === '') {
        return;
      }
      $http.post('/api/mealOptions', { name: $scope.newMealOptionTitle, info: $scope.newMealOptionInfo, children: $scope.newMealOptionChildrenIds ? $scope.pluck($scope.newMealOptionChildrenIds, '_id') : null, active: $scope.newMealOptionActive });
      $scope.newMealOptionTitle = '';
      $scope.newMealOptionInfo = '';
      $scope.newMealOptionChildrenIds = null;
      $scope.newMealOptionActive = true;
    };

    $scope.deleteMealOption = function(mealOption) {
      $http.delete('/api/mealOptions/' + mealOption._id);
    };

    $scope.$on('$destroy', function () {
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
