'use strict';

angular.module('themealzApp')
  .controller('MealOptionsGroupsCtrl', function ($scope, $http, socket) {
    $scope.mealOptionsGroups = [];
    $scope.newMealOptionsGroupActive = true;

    $http.get('/api/mealOptionsGroups').success(function(mealOptionsGroups) {
      $scope.mealOptionsGroups = mealOptionsGroups;
      socket.syncUpdates('mealOptionsGroup', $scope.mealOptionsGroups);
    });

    $http.get('/api/mealOptions').success(function(mealOptions) {
      $scope.mealOptions = mealOptions;
      socket.syncUpdates('mealOptions', $scope.mealOptions);
    });

    $scope.addOrEditMealOptionsGroup = function() {
      if($scope.newMealOptionsGroupTitle === '') {
        return;
      }
      $http[$scope.targetMealOptionsGroup ? 'put' : 'post']('/api/mealOptionsGroups' + ($scope.targetMealOptionsGroup ? '/' + $scope.targetMealOptionsGroup._id : ''), { name: $scope.newMealOptionsGroupTitle, children: $scope.newMealOptionChildrenIds ? $scope.pluck($scope.newMealOptionChildrenIds, '_id') : null, active: $scope.newMealOptionsGroupActive });
      $scope.targetMealOptionsGroup = '';
      $scope.newMealOptionsGroupTitle = '';
      $scope.newMealOptionChildrenIds = null;
      $scope.newMealOptionsGroupActive = true;
    };

    $scope.deleteMealOptionsGroup = function(mealOptionsGroup) {
      $http.delete('/api/mealOptionsGroups/' + mealOptionsGroup._id);
    };

    $scope.onItemClicked = function(mealOptionsGroup) {
      $scope.targetMealOptionsGroup = mealOptionsGroup;
      $scope.onTargetMealOptionsGroupChanged();
    };

    $scope.onTargetMealOptionsGroupChanged = function() {
      if ($scope.targetMealOptionsGroup) {
        var item = $scope.getItemById($scope.mealOptionsGroups, $scope.targetMealOptionsGroup._id);
        $scope.newMealOptionsGroupTitle = item.name;
        $scope.newMealOptionChildrenIds = $scope.getItemsByProperty($scope.mealOptions, item.children, '_id');
        $scope.newMealOptionsGroupActive = item.active;
      }
      else {
        $scope.newMealOptionsGroupTitle = '';
        $scope.newMealOptionChildrenIds = null;
        $scope.newMealOptionsGroupActive = true;
      }
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('mealOptionsGroup');
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
