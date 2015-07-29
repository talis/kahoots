'use strict';

angular.module('kahootsAppApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/homepage', {
        templateUrl: 'app/homepage/homepage.html',
        controller: 'HomepageCtrl',
        loginRequired: true
      });
  });
