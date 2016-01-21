'use strict';

describe('Controller: MealOptionFlavorsCtrl', function () {

  // load the controller's module
  beforeEach(module('themealzApp'));

  var MealOptionFlavorsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MealOptionFlavorsCtrl = $controller('MealOptionFlavorsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
