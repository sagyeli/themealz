'use strict';

describe('Directive: typeaheadAddress', function () {

  // load the directive's module
  beforeEach(module('themealzApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<typeahead-address></typeahead-address>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the typeaheadAddress directive');
  }));
});