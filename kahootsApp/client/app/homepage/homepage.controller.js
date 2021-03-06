'use strict';

angular.module('kahootsAppApp')
  .controller('HomepageCtrl', function ($location, $scope, $rootScope, clipservice, groupservice, userservice, socket) {
    $scope.userGroups = [];
    $scope.userClips = [];
    $scope.userComments = [];
    $scope.activeClip = 0;
    $scope.newNote = '';

    // Set up page and get user clip and user groups from server.
    var init = function(){
      $('#alert-share').hide();
      $scope.setState();
      clipservice.getMyClips(function (clips) {
        $scope.setUserClips(clips);
      });
      groupservice.getMyGroups(function (groups) {
        $scope.setUserGroups(groups);
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
        clipservice.getNotes($scope.userClips[$scope.activeClip]._id, function (comments) {
          $scope.userComments = comments.annotations;
        });
      }
      $scope.setState();
    };
    /**
     * Setter for userGroups
     * @param groups
     */
    $scope.setUserGroups = function(groups){
      if(groups===undefined || groups.length===0){
        $scope.userGroups=[];
      }else{
        $scope.userGroups=groups;
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
      // Get clip comments
      clipservice.getNotes($scope.userClips[$scope.activeClip]._id, function (comments) {
        $scope.userComments = comments.annotations;
      });
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
    $scope.shareClip = function(){
      if($scope.userClips[$scope.activeClip]===undefined){return;}
      groupservice.shareClipPage($scope.userClips[$scope.activeClip],'/homepage');
    };
    /**
     * Deletes active clip, and removes from all groups.
     */
    $scope.deleteClip = function(){
      if(!window.confirm("Are you sure you want to delete clip?\nIt may have been shared with groups.")){return}
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
      clipservice.deleteClip(deletedClip._id, function(){});
      $scope.setState();
    };
    /**
     * Adds a private note the active clip
     */
    $scope.addNote= function(){
      if($scope.newNote ===''){return;}
      if($scope.userClips[$scope.activeClip]=== undefined){return;}
      // Add new note to clip in db
      clipservice.addNewNote($scope.userClips[$scope.activeClip]._id,$scope.newNote, function(){
          clipservice.getNotes($scope.userClips[$scope.activeClip]._id, function (comments) {
            $scope.userComments = comments.annotations;
          });
        });
      $scope.newNote = '';
    };


    init();

    //On clip update get user clips and reset state.
    socket.syncUpdates('clip', $scope.userClips, false, function(){
      clipservice.getMyClips(function (clips) {
        $scope.setUserClips(clips);
        $scope.setState();
      });
    });

    // On group updates get user groups and reset state

    socket.syncUpdates('group', $scope.userGroups, false, function(){
      groupservice.getMyGroups(function (groups) {
        $scope.setUserGroups(groups);
        $scope.setState();
      });
    });

    // When page is destroyed remove sync updates.
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('clip');
      socket.unsyncUpdates('group');
    });
  });
