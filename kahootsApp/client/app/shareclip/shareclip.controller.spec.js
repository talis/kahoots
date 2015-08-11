'use strict';

describe('Controller: ShareclipCtrl', function () {

  // load the controller's module
  beforeEach(module('kahootsAppApp'));

  var ShareclipCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ShareclipCtrl = $controller('ShareclipCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
