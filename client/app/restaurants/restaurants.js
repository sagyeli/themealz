'use strict';

angular.module('themealzApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/restaurants', {
        templateUrl: 'app/restaurants/restaurants.html',
        controller: 'RestaurantsCtrl'
      });
  });
