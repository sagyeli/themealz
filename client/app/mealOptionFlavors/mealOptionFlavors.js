'use strict';

angular.module('themealzApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/mealOptionFlavors', {
        templateUrl: 'app/mealOptionFlavors/mealOptionFlavors.html',
        controller: 'MealOptionFlavorsCtrl'
      });
  });
