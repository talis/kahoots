'use strict';

angular.module('kahootsAppApp')
  .controller('NavbarCtrl', function ($scope, $location, userservice) {
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
    $scope.logout = function(){
      console.log("Calling userservice.logout")
      userservice.logout();
    };
    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
