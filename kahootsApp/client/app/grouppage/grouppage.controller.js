'use strict';

angular.module('kahootsAppApp')
  .controller('GrouppageCtrl', function ($scope, groupservice, clipservice, $rootScope, $location, socket) {
    $scope.userGroups = [];
    $scope.groupClips = [];
    $scope.activeGroup = 0;
    $scope.activeClip = 0;
    $scope.newComment = '';
    $scope.groupComments = [];


    /**
     * Setter for active group
     * @param index Index of group in user's Groups
     */
    $scope.setActiveGroup = function(index){
      if($scope.userGroups.length===0){return;}
      if(index>=$scope.userGroups.length){return}
      if($scope.userGroups[index]===undefined){return}
      $scope.activeGroup = index;
      //get clips for group.
      groupservice.getClips($scope.userGroups[$scope.activeGroup]._id, function (clips) {
          $scope.setGroupClips(clips);
        });
      $scope.setActiveClip(0);
    };
    /**
     * Setter for active clip
     * @param index Index of clip in group's clips
     */
    $scope.setActiveClip = function(index){
      if($scope.groupClips.length===0){$scope.activeClip=0; return;}
      if(index>=$scope.groupClips.length){return;}
      $scope.activeClip = index;
      getComments();
    };
    /**
     * Set user groups
     * @param groups A list of user's groups
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
     * Setter for groupClips
     * @param clips
     */
    $scope.setGroupClips = function(clips){
       if(clips===undefined || clips.length===0){
         $scope.groupClips = [];
         clipservice.noClip($scope.groupClips);
       }else{
         $scope.groupClips = clips;
         clipservice.sortArray($scope.groupClips);
         if($scope.userGroups[$scope.activeGroup]!==undefined &&
           $scope.groupClips[$scope.activeClip]!==undefined) {
           getComments();
         }
       }
      $scope.setState();
    };
    /**
     * Sets view of page.
     */
    $scope.setState = function(){
      $('#addUser-btn').removeClass('disabled');
      if($scope.userGroups.length===0){
        $('#addUser-btn').addClass('disabled');
        $('.group-view').hide();
        $('.no-groups-msg').show();
        $('#myclips').hide();
      }else if($scope.groupClips.length===0) {
        $('.group-view').hide();
        $('.no-groups-msg').hide();
        $('#myclips').show();
      }else if($scope.groupClips[0].name==='no-clip'){
        $('.group-view').hide();
        $('.no-groups-msg').hide();
        $('#myclips').show();
      }else{
        $('.group-view').show();
        $('.no-groups-msg').hide();
        $('#myclips').show();
      }
    };
    /**
     * Remove active clip from active group.
     */
    $scope.removeClip = function(){
      if(!window.confirm("Are you sure you want to remove this clip from the group " + $scope.userGroups[$scope.activeGroup].name + "?" )){return}
      if($scope.groupClips[$scope.activeClip]===undefined){
        console.log('clip undefined');
        return;}
      if($scope.userGroups[$scope.activeGroup]===undefined){
        console.log("Group undefined");
        return;}
      // Not sure of order of everything, so saving these as constants.
      var list = $scope.groupClips;
      var clip = $scope.activeClip;

      if($scope.groupClips.length===1){
        //console.log("Removing last clip");
        //Last clip
        $scope.setActiveClip(0);
        $scope.setGroupClips([]);
      }else if($scope.groupClips.indexOf($scope.activeClip)===0){
        //console.log("Removing first clip");
        $scope.setActiveClip(1);
      }else{
        //console.log("Removing not first or last clip");
        $scope.setActiveClip(0);
      }
      groupservice.removeClip($scope.userGroups[$scope.activeGroup]._id,
        list[clip]._id, function(){
          groupservice.getClips($scope.userGroups[$scope.activeGroup]._id, function (clips) {
              $scope.setGroupClips(clips);
            });
        });
      $scope.setState();
    };
    /**
     * Shares active clip with specified group
     * @param group Group object
     */
    $scope.shareClip = function(){
      if($scope.groupClips[$scope.activeClip]===undefined){return;}

      groupservice.shareClipPage( $scope.groupClips[$scope.activeClip], '/grouppage');
    };
    /**
     * Add comment to active clip in active group.
     */
    $scope.addComment = function(){
      if($scope.newComment ===''){return;}
      if($scope.userGroups[$scope.activeGroup]===undefined){return;}

      groupservice.addComment($scope.userGroups[$scope.activeGroup]._id,
        $scope.groupClips[$scope.activeClip]._id, $scope.newComment, function () {
          getComments();
        });
      $scope.newComment='';
    };
    /**
     * Leave active group
     */
    $scope.leaveGroup = function(group){
      if(!window.confirm("Are you sure you want to leave the group " + group.name + "?" )){return}
      if($scope.userGroups.length===0){return;}
      var group_id = group._id;
      if($scope.userGroups.length===1) {
        $scope.setUserGroups([]);
        //removing the last group
        $scope.setActiveGroup(0);
        $scope.setGroupClips([]);
      }else if($scope.userGroups.indexOf(group)===0){
        // removing first group, replace with second.
        $scope.setActiveGroup(0);
        $scope.setActiveClip(0);

      } else {
        $scope.setActiveGroup(0);
        $scope.setActiveClip(0);
      }
      groupservice.leaveGroup(group_id, function () {
          $scope.setState();
        });
      $scope.setState();
    };
    /**
     * Redirect user to add User Page
     */
    $scope.addUserPage = function(){
      // Todo: Add checks here.
      groupservice.addUserPage($scope.userGroups[$scope.activeGroup]);
    };
    /**
     * Redirect user to 'add new group' page.
     */
    $scope.newGroupPage = function(){
      $location.path('/newGroup');
    };
    /**
     * Get all comments for active clip in active group.
     */
    var getComments = function(){
      groupservice.getComments($scope.userGroups[$scope.activeGroup]._id,
        $scope.groupClips[$scope.activeClip]._id, function (comments) {
          $scope.groupComments = comments;
        });
    };
    /**
     * Initialise group page
     * Todo: Change this to save users previous activity
     */
    var init = function(){
      $('.comment-container').animate({
          scrollTop: 500
        });
      $('#alert-share').hide();
      $scope.setState();
      groupservice.getMyGroups(function (groups) {
        $scope.userGroups=groups;
        if($scope.userGroups !== undefined && $scope.userGroups.length!==0) {
          groupservice.getClips($scope.userGroups[$scope.activeGroup]._id, function (clips) {
              $scope.setGroupClips(clips);
          });
        }
      });
    };
    init();

    /**
     * On update of clip, get user clips and comments.
     */
    socket.syncUpdates('clip', $scope.groupClips, false, function(){
      if($scope.userGroups !== undefined && $scope.userGroups.length!==0) {
        groupservice.getClips($scope.userGroups[$scope.activeGroup]._id, function (clips) {
            $scope.setGroupClips(clips);
            getComments();
          });
      }
    });

    /**
     * On group update get user groups and comments.
     */
    socket.syncUpdates('group', $scope.userGroups, false, function(){
      groupservice.getMyGroups(function (groups) {
        $scope.setUserGroups(groups);
        getComments();
        $scope.setState();
      });
    });

    // When page is destroyed unsync updates.
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('clip');
      socket.unsyncUpdates('group');
    });

  });
