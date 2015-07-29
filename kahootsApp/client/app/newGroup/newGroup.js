'use strict';

angular.module('kahootsAppApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/newGroup', {
        templateUrl: 'app/newGroup/newGroup.html',
        controller: 'NewGroupCtrl',
        loginRequired: true
      });
  });
