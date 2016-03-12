'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Meal Option',
    'link': '/',
    'forAllusers' : false
  }, {
    'title': 'Meal Option Flavors',
    'link': '/mealOptionFlavors',
    'forAllusers' : false
  }, {
    'title': 'Restaurants',
    'link': '/restaurants',
    'forAllusers' : true
  }, {
    'title': 'Meal Options Groups',
    'link': '/mealOptionsGroups',
    'forAllusers' : false
  }, {
    'title': 'Meals',
    'link': '/meals',
    'forAllusers' : true
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
