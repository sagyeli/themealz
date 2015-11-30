'use strict';

angular.module('themealzApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/meals', {
        templateUrl: 'app/meals/meals.html',
        controller: 'MealsCtrl'
      });
  });
