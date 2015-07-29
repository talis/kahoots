'use strict';

angular.module('kahootsAppApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/addUser', {
        templateUrl: 'app/addUser/addUser.html',
        controller: 'AddUserCtrl',
        loginRequired: true
      });
  });
