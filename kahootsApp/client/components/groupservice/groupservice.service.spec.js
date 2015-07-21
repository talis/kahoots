'use strict';

describe('Service: groupservice', function () {

  // load the service's module
  beforeEach(module('kahootsAppApp'));

  // instantiate service
  var groupservice;
  beforeEach(inject(function (_groupservice_) {
    groupservice = _groupservice_;
  }));

  it('should do something', function () {
    expect(!!groupservice).toBe(true);
  });

});
