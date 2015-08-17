'use strict';

angular.module('kahootsAppApp')
  .controller('AddUserCtrl', function ($scope, $location, groupservice) {
    $scope.newUser = '';
    $scope.group = groupservice.group;

    /**
     * $scope.newUser is bound to input element in the html. When a user inputs a user's
     * email address it also sets the variable $scope.newUser.
     */
    $scope.addUser= function(){
      if($scope.newUser === ''){return;}
      groupservice.shareGroup($scope.newUser, $scope.group._id, function(){});
      $scope.newUser = '';
      $scope.goBack();
    };
    /**
     * Redirect user to group page.
     */
    $scope.goBack = function(){
      $location.path('/grouppage');
    };
  });
