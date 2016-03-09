'use strict';

angular.module('themealzApp', [
  'themealzApp.auth',
  'themealzApp.admin',
  'themealzApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'btford.socket-io',
  'ui.bootstrap',
  'validation.match',
  'ui.multiselect',
  'ui.bootstrap.datetimepicker'
])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });
