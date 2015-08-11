'use strict';

angular.module('kahootsAppApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'Home Page',
      'link': '/homepage'
    },{
      'title': 'Groups',
      'link': '/grouppage'
    },{
      'title': 'Feed',
      'link': '/feed'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
