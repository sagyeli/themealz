'use strict';

angular.module('themealzApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.mealOptions = [];
    $scope.mealOptionFlavors = [];
    $scope.mealOptionFlavorsGroups = [];
    $scope.newMealOptionActive = true;
    $scope.newMealOptionAbstract = false;

    $http.get('/api/mealOptions').success(function(mealOptions) {
      $scope.mealOptions = mealOptions;
      socket.syncUpdates('mealOption', $scope.mealOptions);
    });

    $http.get('/api/mealOptionFlavors').success(function(mealOptionFlavors) {
      $scope.mealOptionFlavors = mealOptionFlavors;
      socket.syncUpdates('mealOptionFlavor', $scope.mealOptionFlavors);
    });

    $http.get('/api/mealOptionFlavorsGroups').success(function(mealOptionFlavorsGroups) {
      $scope.mealOptionFlavorsGroups = mealOptionFlavorsGroups;
      socket.syncUpdates('mealOptionFlavorsGroup', $scope.mealOptionFlavorsGroups);
    });

    $scope.addOrEditMealOption = function() {
      if($scope.newMealOptionTitle === '' && $scope.newMealOptionLabel === '') {
        return;
      }
      $http[$scope.targetMealOption ? 'put' : 'post']('/api/mealOptions' + ($scope.targetMealOption ? '/' + $scope.targetMealOption._id : ''), { name: $scope.newMealOptionTitle, label: $scope.newMealOptionLabel, rootLabel: $scope.newMealOptionRootLabel, imageURL: $scope.newMealOptionImageURL, info: $scope.newMealOptionInfo, children: $scope.newMealOptionChildrenIds ? $scope.pluck($scope.newMealOptionChildrenIds, '_id') : null, parents: $scope.newMealOptionParentsIds ? $scope.pluck($scope.newMealOptionParentsIds, '_id') : null, relevantFlavors: $scope.newMealOptionFlavorsIds ? $scope.pluck($scope.newMealOptionFlavorsIds, '_id') : null, relevantFlavorsGroups: $scope.newMealOptionFlavorsGroups ? $scope.pluck($scope.newMealOptionFlavorsGroups, '_id') : null, active: $scope.newMealOptionActive, abstract: $scope.newMealOptionAbstract });
      $scope.targetMealOption = '';
      $scope.newMealOptionTitle = '';
      $scope.newMealOptionLabel = '';
      $scope.newMealOptionRootLabel = '';
      $scope.newMealOptionImageURL = '';
      $scope.newMealOptionInfo = '';
      $scope.newMealOptionChildrenIds = null;
      $scope.newMealOptionParentsIds = null;
      $scope.newMealOptionFlavorsIds = null;
      $scope.newMealOptionFlavorsGroups = null;
      $scope.newMealOptionActive = true;
      $scope.newMealOptionAbstract = false;
    };

    $scope.deleteMealOption = function(mealOption) {
      $http.delete('/api/mealOptions/' + mealOption._id);
    };

    $scope.onTargetMealOptionChanged = function(mealOption) {
      $scope.targetMealOption = mealOption;

      var i = $scope.mealOptions.length;
      while(i--) {
        if ($scope.mealOptions[i] === mealOption) {
          continue;
        }

        delete $scope.mealOptions[i].selected;
      }

      if ($scope.targetMealOption) {
        var item = $scope.getItemById($scope.mealOptions, $scope.targetMealOption._id);
        $scope.newMealOptionTitle = item.name;
        $scope.newMealOptionLabel = item.label;
        $scope.newMealOptionRootLabel = item.rootLabel;
        $scope.newMealOptionImageURL = item.imageURL;
        $scope.newMealOptionInfo = item.info;
        $scope.newMealOptionChildrenIds = $scope.getItemsByProperty($scope.mealOptions, item.children, '_id');
        $scope.newMealOptionParentsIds = (function() { var i = $scope.mealOptions.length, mealOptions = []; while(i--) { if ($scope.mealOptions[i].children && $scope.mealOptions[i].children.indexOf(item._id) >= 0) { mealOptions.unshift($scope.mealOptions[i]); } } return mealOptions; })();
        $scope.newMealOptionFlavorsIds = $scope.getItemsByProperty($scope.mealOptionFlavors, item.relevantFlavors, '_id');
        $scope.newMealOptionFlavorsGroups = $scope.getItemsByProperty($scope.mealOptionFlavorsGroups, item.relevantFlavorsGroups, '_id');
        $scope.newMealOptionActive = item.active;
        $scope.newMealOptionAbstract = item.abstract;

        mealOption.selected = true;
      }
      else {
        $scope.newMealOptionTitle = '';
        $scope.newMealOptionLabel = '';
        $scope.newMealOptionRootLabel = '';
        $scope.newMealOptionImageURL = '';
        $scope.newMealOptionInfo = '';
        $scope.newMealOptionChildrenIds = null;
        $scope.newMealOptionParentsIds = null;
        $scope.newMealOptionFlavorsIds = null;
        $scope.newMealOptionFlavorsGroups = null;
        $scope.newMealOptionActive = true;
        $scope.newMealOptionAbstract = false;
      }
    };

    $scope.onMealOptionFlavorsGroupsChanged = function() {
      if (!$scope.newMealOptionFlavorsGroups) {
        return;
      }

      var i = $scope.newMealOptionFlavorsGroups.length,
        newMealOptionFlavorsIds = [];
      while (i--) {
        newMealOptionFlavorsIds = newMealOptionFlavorsIds.concat($scope.getItemsByProperty($scope.mealOptions, $scope.newMealOptionFlavorsGroups[i].children, '_id'));
      }
      i = newMealOptionFlavorsIds.length;
      while(i--) {
        if ($scope.newMealOptionFlavorsIds.indexOf(newMealOptionFlavorsIds[i]) < 0) {
          $scope.newMealOptionFlavorsIds.push(newMealOptionFlavorsIds[i]);
        }
      }
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('mealOption');
      socket.unsyncUpdates('mealOptionFlavor');
      socket.unsyncUpdates('mealOptionFlavorsGroup');
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
