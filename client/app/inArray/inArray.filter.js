'use strict';

angular.module('themealzApp')
  .filter('inArray', function ($filter) {
    return function (list, arrayFilter, element) {
      if(arrayFilter) {
        return $filter("filter")(list, function (listItem) {
          return arrayFilter.indexOf(listItem[element]) !== -1;
        });
      }
    };
  });
