'use strict';

angular.module('kahootsAppApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/home'
      });

    $locationProvider.html5Mode(true);

    // Need to add some login stuff here.
  });
