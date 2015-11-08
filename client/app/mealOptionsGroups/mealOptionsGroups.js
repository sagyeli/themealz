'use strict';

angular.module('themealzApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/mealOptionsGroups', {
        templateUrl: 'app/mealOptionsGroups/mealOptionsGroups.html',
        controller: 'MealOptionsGroupsCtrl'
      });
  });
