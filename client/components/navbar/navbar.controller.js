'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
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

  isCollapsed = true;
  //end-non-standard

  constructor($location, Auth) {
    this.$location = $location;
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
  }

  isActive(route) {
    return route === this.$location.path();
  }
}

angular.module('themealzApp')
  .controller('NavbarController', NavbarController);
