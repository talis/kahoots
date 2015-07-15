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
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  }).run(function($rootScope, $location){

    $rootScope.$on('$stateChangeSuccess', function(event, data) {
      // todo: move to stateChangeStart
      if (data.$$route && data.$$route.controller) {
        $rootScope.controller = data.$$route.controller;
      }
    });

      // check if login is needed on page
      $rootScope.$on("$routeChangeStart", function(event, next, current) {
        var currentRoute = $location.path();

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
