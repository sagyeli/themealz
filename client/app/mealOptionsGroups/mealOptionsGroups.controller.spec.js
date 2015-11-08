'use strict';

describe('Controller: MealOptionsGroupsCtrl', function () {

  // load the controller's module
  beforeEach(module('themealzApp'));

  var MealOptionsGroupsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MealOptionsGroupsCtrl = $controller('MealOptionsGroupsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
