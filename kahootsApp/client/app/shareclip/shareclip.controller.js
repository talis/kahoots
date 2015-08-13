'use strict';

angular.module('kahootsAppApp')
  .controller('ShareclipCtrl', function ($scope, groupservice, $location, $rootScope) {
    $scope.groups = [];
    $scope.clip = null;
    $scope.selectedGroup = 0;

    var init = function(){
      $scope.clip = groupservice.clip;
      groupservice.getMyGroups($rootScope.user._id, $rootScope.oauth.access_token, function(groups){

        for(var i=0; i<groups.length; i++){
          console.log(groups[i]._id);
          if($scope.clip.groups.indexOf(groups[i]._id)<0){
            $scope.groups.push(groups[i]);
          }
        }
        if($scope.groups.length===0){
          $('#no-groups').removeClass('collapse');
          $('#share-btn').addClass('disabled');
        }
      });

    };

    $scope.shareClip = function(){
      //    instance.shareClip = function(user_id, access_token, group_id, clip_id, callback){
      groupservice.shareClip($rootScope.user._id, $rootScope.oauth.access_token,
      $scope.groups[$scope.selectedGroup]._id, $scope.clip._id, function(){
          $location.path(groupservice.returnPath);
        })
    }

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
