'use strict';

describe('Controller: GrouppageCtrl', function () {

  // load the controller's module
  beforeEach(module('kahootsAppApp'));

  var GrouppageCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GrouppageCtrl = $controller('GrouppageCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
