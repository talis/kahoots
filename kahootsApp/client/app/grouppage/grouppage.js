'use strict';

angular.module('kahootsAppApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/grouppage', {
        templateUrl: 'app/grouppage/grouppage.html',
        controller: 'GrouppageCtrl',
        loginRequired: true
      });
  });
