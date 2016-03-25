'use strict';

angular.module('themealzApp')
  .controller('MealOptionFlavorsGroupsCtrl', function ($scope, $http, socket) {
    $scope.mealOptionFlavorsGroups = [];
    $scope.mealOptionFlavors = [];
    $scope.newMealOptionFlavorsGroupActive = true;

    $http.get('/api/mealOptionFlavorsGroups').success(function(mealOptionFlavorsGroups) {
      $scope.mealOptionFlavorsGroups = mealOptionFlavorsGroups;
      socket.syncUpdates('mealOptionFlavorsGroup', $scope.mealOptionFlavorsGroups);
    });

    $http.get('/api/mealOptionFlavors').success(function(mealOptionFlavors) {
      $scope.mealOptionFlavors = mealOptionFlavors;
      socket.syncUpdates('mealOptionFlavors', $scope.mealOptionFlavors);
    });

    $scope.addOrEditMealOptionFlavorsGroup = function() {
      if($scope.newMealOptionFlavorsGroupTitle === '') {
        return;
      }
      $http[$scope.targetMealOptionFlavorsGroup ? 'put' : 'post']('/api/mealOptionFlavorsGroups' + ($scope.targetMealOptionFlavorsGroup ? '/' + $scope.targetMealOptionFlavorsGroup._id : ''), { name: $scope.newMealOptionFlavorsGroupTitle, children: $scope.newMealOptionChildrenIds ? $scope.pluck($scope.newMealOptionChildrenIds, '_id') : null, active: $scope.newMealOptionFlavorsGroupActive });
      $scope.targetMealOptionFlavorsGroup = '';
      $scope.newMealOptionFlavorsGroupTitle = '';
      $scope.newMealOptionChildrenIds = null;
      $scope.newMealOptionFlavorsGroupActive = true;
    };

    $scope.deleteMealOptionFlavorsGroup = function(mealOptionFlavorsGroup) {
      $http.delete('/api/mealOptionFlavorsGroups/' + mealOptionFlavorsGroup._id);
    };

    $scope.onTargetMealOptionFlavorsGroupChanged = function(mealOptionFlavorsGroup) {
      $scope.targetMealOptionFlavorsGroup = mealOptionFlavorsGroup;

      var i = $scope.mealOptionFlavorsGroups.length;
      while(i--) {
        if ($scope.mealOptionFlavorsGroups[i] === mealOptionFlavorsGroup) {
          continue;
        }

        delete $scope.mealOptionFlavorsGroups[i].selected;
      }

      if ($scope.targetMealOptionFlavorsGroup) {
        var item = $scope.getItemById($scope.mealOptionFlavorsGroups, $scope.targetMealOptionFlavorsGroup._id);
        $scope.newMealOptionFlavorsGroupTitle = item.name;
        $scope.newMealOptionChildrenIds = $scope.getItemsByProperty($scope.mealOptionFlavors, item.children, '_id');
        $scope.newMealOptionFlavorsGroupActive = item.active;

        mealOptionFlavorsGroup.selected = true;
      }
      else {
        $scope.newMealOptionFlavorsGroupTitle = '';
        $scope.newMealOptionChildrenIds = null;
        $scope.newMealOptionFlavorsGroupActive = true;
      }
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('mealOptionFlavorsGroup');
      socket.unsyncUpdates('mealOptionFlavors');
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