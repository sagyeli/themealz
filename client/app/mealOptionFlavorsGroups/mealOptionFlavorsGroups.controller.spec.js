'use strict';

describe('Component: MealOptionFlavorsGroupsComponent', function () {

  // load the controller's module
  beforeEach(module('themealzApp'));

  var MealOptionFlavorsGroupsComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    MealOptionFlavorsGroupsComponent = $componentController('MealOptionFlavorsGroupsComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
