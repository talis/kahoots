'use strict';

describe('Service: clipservice', function () {

  // load the service's module
  beforeEach(module('kahootsAppApp'));

  // instantiate service
  var clipservice;
  beforeEach(inject(function (_clipservice_) {
    clipservice = _clipservice_;
  }));

  it('should do something', function () {
    expect(!!clipservice).toBe(true);
  });

});
