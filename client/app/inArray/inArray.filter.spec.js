'use strict';

describe('Filter: inArray', function () {

  // load the filter's module
  beforeEach(module('themealzApp'));

  // initialize a new instance of the filter before each test
  var inArray;
  beforeEach(inject(function ($filter) {
    inArray = $filter('inArray');
  }));

  it('should return the input prefixed with "inArray filter:"', function () {
    var text = 'angularjs';
    expect(inArray(text)).toBe('inArray filter: ' + text);
  });

});
