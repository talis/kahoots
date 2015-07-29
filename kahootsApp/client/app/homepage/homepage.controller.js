'use strict';

angular.module('kahootsAppApp')
  .controller('HomepageCtrl', function ($scope, $rootScope, clipservice, groupservice) {
    $scope.userGroups = [];
    $scope.userClips = [];
    $scope.activeClip = 0;
    $scope.newNote = '';

    var init = function(){
      $('#alert-share').hide();
      $scope.setState();
      clipservice.getMyClips($rootScope.user._id, $rootScope.oauth.access_token, function (clips) {
        $scope.setUserClips(clips);
      });
      groupservice.getMyGroups($rootScope.user._id, $rootScope.oauth.access_token, function (groups) {
        $scope.userGroups=groups;
      });
    };

    /**
     * Setter for userClips.
     * Also sets state of page.
     * @param clipArray An array of the user's clips.
     */
    $scope.setUserClips = function(clipArray){
      if(clipArray===undefined){return}
      if(clipArray.length === 0){
        //if empty display 'no-clips'
        $scope.userClips =[];
        clipservice.noClip($scope.userClips);
      }else{
        //else display 'yes-clips'
        $scope.userClips = clipArray;
        clipservice.sortArray($scope.userClips);
      }
      $scope.setState();
    };
    /**
     * Setter for active clip
     * @param index Index of clip in userClips
     */
    $scope.setActiveClip=function(index){
      if($scope.userClips.length===0){$scope.activeClip=0; return;}
      if(index>=$scope.userClips.length){return;}
      $scope.activeClip = index;
    };
    /**
     * Setter for state
     * @param state false if no clips, else true.
     */
    $scope.setState = function(){
      if($scope.userClips.length===0) {
        // Display active clip
        $('.my-clips-view').hide();
      }else if($scope.userClips.length===1 && $scope.userClips[0].name==='no-clip'){
        $('.my-clips-view').hide();
      }else{
        $('.my-clips-view').show();
      }
    };
    /**
     * Share the active clip with given group.
     * @param group object.
     */
    $scope.shareClip = function(group){
      if(group === undefined){return;}
      if($scope.userClips[$scope.activeClip]===undefined){return;}

      groupservice.shareClip($rootScope.user._id, $rootScope.oauth.access_token,
        group._id, $scope.userClips[$scope.activeClip]._id, function(){});

      $('#alert-share').show();
    };
    /**
     * Deletes active clip, and removes from all groups.
     */
    $scope.deleteClip = function(){
      if($scope.userClips[$scope.activeClip]===undefined){return}
      var deletedClip = $scope.userClips[$scope.activeClip];

      if($scope.userClips.length===1){
        $scope.setActiveClip(0);
        $scope.setUserClips([]);
      }else if($scope.userClips.indexOf($scope.activeClip)===0){
        $scope.setActiveClip(1);
      }else{
        $scope.setActiveClip(0);
      }
      clipservice.deleteClip($rootScope.user._id, $rootScope.oauth.access_token,
        deletedClip._id, function(){});
      $scope.setState();
    };
    /**
     * Adds a private note the active clip
     */
    $scope.addNote= function(){
      if($scope.newNote ===''){return;}
      if($scope.userClips[$scope.activeClip]=== undefined){return;}

      // Add new note to clip in db
      clipservice.addNewNote($rootScope.user._id, $rootScope.oauth.access_token,
        $scope.userClips[$scope.activeClip]._id,$scope.newNote, function(){});
      $scope.newNote = '';
    };


    init();
  });
