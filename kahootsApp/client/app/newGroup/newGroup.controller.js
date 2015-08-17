'use strict';

angular.module('kahootsAppApp')
  .controller('NewGroupCtrl', function ($scope, $rootScope, groupservice, $location) {
    $scope.newGroup ={
      name:'',
      description:''
    };
    /**
     * $scope.newGroup name and description is bound to input element using angular two-way bound.
     * When a user inputs a group name or desciption it also updates the $scope variables.
     */
    $scope.addGroup = function(){
      if($scope.newGroup.name===''){return;}
      groupservice.addNewGroup(
        {'name': $scope.newGroup.name, 'description': $scope.newGroup.description},
        function(){});
      $scope.newGroup.name = '';
      $scope.newGroup.description = '';
      $scope.goBack();

    };
    /**
     * Redirect user back to group page.
     */
    $scope.goBack = function(){
      $location.path('/grouppage');
    };

  });
