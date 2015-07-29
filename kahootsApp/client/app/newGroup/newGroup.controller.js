'use strict';

angular.module('kahootsAppApp')
  .controller('NewGroupCtrl', function ($scope, $rootScope, groupservice, $location) {
    $scope.newGroup ={
      name:'',
      description:''
    };
    $scope.addGroup = function(){
      if($scope.newGroup.name===''){return;}

      groupservice.addNewGroup($rootScope.user._id, $rootScope.oauth.access_token,
        {'name': $scope.newGroup.name, 'description': $scope.newGroup.description}, function(){});

      $scope.newGroup.name = '';
      $scope.newGroup.description = '';
      $scope.goBack();

    };
    $scope.goBack = function(){
      $location.path('/grouppage');
    };

  });
