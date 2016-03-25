'use strict';

angular.module('themealzApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/mealOptionFlavorsGroups', {
        templateUrl: 'app/mealOptionFlavorsGroups/mealOptionFlavorsGroups.html',
        controller: 'MealOptionFlavorsGroupsCtrl'
      });
  });
