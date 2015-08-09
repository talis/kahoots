'use strict';

angular.module('kahootsAppApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/feed', {
        templateUrl: 'app/feed/feed.html',
        controller: 'FeedCtrl',
        loginRequired: true

      });
  });
