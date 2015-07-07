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
      })

    $locationProvider.html5Mode(true);
  })/*.run(function($rootScope, $location){

      // check if login is needed on page
      $rootScope.$on("$routeChangeStart", function(event, next, current) {
        var currentRoute = $location.path();

        var checkLoginRequired = function(){
          if(next.loginRequired) {
            if($rootScope.user === null ){
              $rootScope.nextPath = $location.path();
              $location.path('/home').replace();
            }
          }

        };

        checkLoginRequired();

    });
  });*/
