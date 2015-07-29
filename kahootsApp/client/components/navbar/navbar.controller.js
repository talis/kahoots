'use strict';

angular.module('kahootsAppApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    },{
      'title': 'test',
      'link': '/allClips'
    },
      {
        'title': 'Home Page',
        'link': '/homepage'
      }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
