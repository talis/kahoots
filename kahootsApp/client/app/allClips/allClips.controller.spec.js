'use strict';

describe('Controller: AllClipsCtrl', function () {

  // load the controller's module
  beforeEach(module('kahootsAppApp'));

  var AllClipsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AllClipsCtrl = $controller('AllClipsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
