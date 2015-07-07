'use strict';

angular.module('kahootsAppApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: 'app/home/home.html',
        controller: 'HomeCtrl',
        loginRequired: false
      });
  });
