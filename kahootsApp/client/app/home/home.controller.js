'use strict';

angular.module('kahootsAppApp')
  .controller('HomeCtrl', function ($scope, $location) {

    // Redirect to login page.
    $scope.loginWithTalis = function() {
      $location.path('/login').replace();
    }
  });
