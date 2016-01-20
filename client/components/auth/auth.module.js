'use strict';

angular.module('themealzApp.auth', [
  'themealzApp.constants',
  'themealzApp.util',
  'ngCookies',
  'ngRoute'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
