'use strict';

angular.module('kahootsAppApp')
  .controller('ShareclipCtrl', function ($scope, groupservice, $location, $rootScope) {
    $scope.groups = [];
    $scope.clip = null;
    $scope.selectedGroup = 0;

    // Initialise page
    var init = function(){
      // Set initial values for scope.
      $scope.clip = groupservice.clip;

      groupservice.getMyGroups(function(groups){
        for(var i=0; i<groups.length; i++){
          // Only display groups that the clip has not already been shared with.
          if($scope.clip.groups.indexOf(groups[i]._id)<0){
            $scope.groups.push(groups[i]);
          }
        }
        // If no groups display no-groups alert.
        if($scope.groups.length===0){
          $('#no-groups').removeClass('collapse');
          $('#share-btn').addClass('disabled');
        }
      });
    };

    /**
     * Add a clip to selected group.
     */
    $scope.shareClip = function(){
      // Once the message is send to the server, return to previous page.
      groupservice.shareClip($scope.groups[$scope.selectedGroup]._id, $scope.clip._id, function(){
          $location.path(groupservice.returnPath);
        })
    };

    /**
     *
     * @param index
     */
    $scope.selectGroup = function(index){
      for(var i=0; i<$scope.groups.length; i++){
        $('#'+i).removeClass('active');
      }
      $('#'+index).addClass('active');
      $scope.selectedGroup = index;
    }
    $scope.goBack = function(){
      $location.path(groupservice.returnPath);
    };

    init();
  });
