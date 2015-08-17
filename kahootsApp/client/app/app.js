'use strict';

angular.module('kahootsAppApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'btford.socket-io',
  'luegg.directives',
  "ngScrollTo",
  'angularMoment'
])
  .config(function ($routeProvider, $locationProvider) {
    // If no route is provided redirect to /
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }).run(function($rootScope, $location){

    $rootScope.$on('$stateChangeSuccess', function(event, data) {
      if (data.$$route && data.$$route.controller) {
        $rootScope.controller = data.$$route.controller;
      }
    });

      // check if login is needed on page
      $rootScope.$on("$routeChangeStart", function(event, next, currentRoute) {
        var currentRoute = $location.path();
        // For each page check login is required.
        var checkLoginRequired = function(){
          if(next.loginRequired) {
            if(!$rootScope.user){
              $rootScope.nextPath = $location.path();
              $location.path('/login').replace();
            }
          }
        };

        checkLoginRequired();

    });
  });
