'use strict';

angular.module('themealzApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Meal Option',
      'link': '/'
    }, {
      'title': 'Meal Option Flavors',
      'link': '/mealOptionFlavors'
    }, {
      'title': 'Restaurants',
      'link': '/restaurants'
    }, {
      'title': 'Meal Options Groups',
      'link': '/mealOptionsGroups'
    }, {
      'title': 'Meals',
      'link': '/meals'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });