'use strict';

angular.module('kahootsAppApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/shareclip', {
        templateUrl: 'app/shareclip/shareclip.html',
        controller: 'ShareclipCtrl',
        loginRequired: true
      });
  });
