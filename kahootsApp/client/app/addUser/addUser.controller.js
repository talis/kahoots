'use strict';

angular.module('kahootsAppApp')
  .controller('AddUserCtrl', function ($scope, $rootScope, $location, groupservice) {
    $scope.newUser = '';
    $scope.group = groupservice.group;

    $scope.addUser= function(){
      if($scope.newUser === ''){return;}

      groupservice.shareGroup($rootScope.user._id, $rootScope.oauth.access_token, $scope.newUser,
        $scope.group._id,function(){});

      $scope.newUser = '';
      $scope.goBack();
    };
    $scope.goBack = function(){
      $location.path('/grouppage');
    };
  });
