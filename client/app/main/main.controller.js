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
      $http.post('/api/mealOptions', { name: $scope.newMealOptionTitle, info: $scope.newMealOptionInfo, active: $scope.newMealOptionActive });
      $scope.newMealOptionTitle = '';
      $scope.newMealOptionInfo = '';
      $scope.newMealOptionActive = true;
    };

    $scope.deleteMealOption = function(mealOption) {
      $http.delete('/api/mealOptions/' + mealOption._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('mealOption');
    });
  });
