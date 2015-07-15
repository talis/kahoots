'use strict';

angular.module('kahootsAppApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/allClips', {
        templateUrl: 'app/allClips/allClips.html',
        controller: 'AllClipsCtrl'
      });
  });
