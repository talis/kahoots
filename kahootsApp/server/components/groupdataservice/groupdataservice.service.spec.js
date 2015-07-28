'use strict';

describe('Service: groupdataservice', function () {

  // load the service's module
  beforeEach(module('kahootsAppApp'));

  // instantiate service
  var groupdataservice;
  beforeEach(inject(function (_groupdataservice_) {
    groupdataservice = _groupdataservice_;
  }));

  it('should do something', function () {
    expect(!!groupdataservice).toBe(true);
  });

});
