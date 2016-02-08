'use strict'; 

angular.module('themealzApp')
  .controller('MealOptionFlavorsCtrl', function ($scope, $http, socket) {
    $scope.mealOptionFlavors = [];
    $scope.newMealOptionFlavorActive = true;

    $http.get('/api/mealOptionFlavors').success(function(mealOptionFlavors) {
      $scope.mealOptionFlavors = mealOptionFlavors;
      socket.syncUpdates('mealOptionFlavor', $scope.mealOptionFlavors);
    });

    $scope.addOrEditMealOptionFlavor = function() {
      if($scope.newMealOptionFlavorTitle === '') {
        return;
      }
      $http[$scope.targetMealOptionFlavor ? 'put' : 'post']('/api/mealOptionFlavors' + ($scope.targetMealOptionFlavor ? '/' + $scope.targetMealOptionFlavor._id : ''), { name: $scope.newMealOptionFlavorTitle, active: $scope.newMealOptionFlavorActive });
      $scope.targetMealOptionFlavor = '';
      $scope.newMealOptionFlavorTitle = '';
      $scope.newMealOptionFlavorActive = true;
    };

    $scope.deleteMealOptionFlavor = function(mealOptionFlavor) {
      $http.delete('/api/mealOptionFlavors/' + mealOptionFlavor._id);
    };

    $scope.onTargetMealOptionFlavorChanged = function(mealOptionFlavor) {
      $scope.targetMealOptionFlavor = mealOptionFlavor;

      var i = $scope.mealOptionFlavors.length;
      while(i--) {
        if ($scope.mealOptionFlavors[i] === mealOptionFlavor) {
          continue;
        }

        delete $scope.mealOptionFlavors[i].selected;
      }

      if ($scope.targetMealOptionFlavor) {
        var item = $scope.getItemById($scope.mealOptionFlavors, $scope.targetMealOptionFlavor._id);
        $scope.newMealOptionFlavorTitle = item.name;
        $scope.newMealOptionFlavorActive = item.active;

        mealOptionFlavor.selected = true;
      }
      else {
        $scope.newMealOptionFlavorTitle = '';
        $scope.newMealOptionFlavorActive = true;
      }
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('mealOptionFlavor');
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
