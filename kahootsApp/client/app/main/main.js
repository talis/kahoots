'use strict';

angular.module('kahootsAppApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/main', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        loginRequired: true
      });
  });
