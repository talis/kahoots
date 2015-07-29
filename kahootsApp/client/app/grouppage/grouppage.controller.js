'use strict';

angular.module('kahootsAppApp')
  .controller('GrouppageCtrl', function ($scope, groupservice, clipservice, $rootScope, $location) {
    $scope.userGroups = [];
    $scope.groupClips = [];
    $scope.activeGroup = 0;
    $scope.activeClip = 0;
    $scope.newComment = '';


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
      groupservice.getClips($rootScope.user._id, $rootScope.oauth.access_token,
        $scope.userGroups[$scope.activeGroup]._id, function (clips) {
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
           groupservice.getComments($rootScope.user._id, $rootScope.oauth.access_token,
             $scope.userGroups[$scope.activeGroup]._id,
             $scope.groupClips[$scope.activeClip]._id, function (comments) {
               $scope.comments = comments;
             });
         }
       }
      $scope.setState();
    };
    /**
     * Sets view of page.
     */
    $scope.setState = function(){
      if($scope.userGroups.length===0){
        $('.group-view').hide();
        $('.no-groups-msg').show();
      }else if($scope.groupClips.length===0 || $scope.groupClips[0].name==='no-clip') {
        $('.group-view').hide();
        $('.no-groups-msg').hide();
      }else{
          $('.group-view').show();
          $('.no-groups-msg').hide();
      }
    };
    /**
     * Remove active clip from active group.
     */
    $scope.removeClip = function(){
      if($scope.groupClips[$scope.activeClip]===undefined){return;}
      if($scope.userGroups[$scope.activeGroup]===undefined){return;}
      // Not sure of order of everything, so saving these as constants.
      var groups = $scope.userGroups;
      var clip = $scope.activeClip;

      if($scope.groupClips.length===1){
        //Last clip
        $scope.setActiveClip(0);
        $scope.setGroupClips([]);
      }else if($scope.groupClips.indexOf($scope.activeClip)===0){
        $scope.setActiveClip(1);
      }else{
        $scope.setActiveClip(0);
      }
      groupservice.removeClip($rootScope.user._id, $rootScope.oauth.access_token,
        $scope.userGroups[$scope.activeGroup]._id, groups[clip]._id, function(){});
      $scope.setState();
    };
    /**
     * Shares active clip with specified group
     * @param group Group object
     */
    $scope.shareClip = function(group){
      if(group === undefined){return;}
      if($scope.groupClips[$scope.activeClip]===undefined){return;}

      groupservice.shareClip($rootScope.user._id, $rootScope.oauth.access_token,
        group._id, $scope.groupClips[$scope.activeClip]._id, function(){});

      $('#alert-share').show();
    };
    /**
     * Add comment to active clip in active group.
     */
    $scope.addComment = function(){
      if($scope.newComment ===''){return;}
      if($scope.groupGroups[$scope.activeGroup]===undefined){return;}

      groupservice.addComment($rootScope.user, $rootScope.oauth.access_token,
        $scope.userGroups[$scope.activeGroup]._id, $scope.groupClips[$scope.activeClip]._id,
        $scope.newComment, function () {
          groupservice.getComments($rootScope.user._id, $rootScope.oauth.access_token,
            $scope.userGroups[$scope.activeGroup]._id,
            $scope.groupClips[$scope.activeClip]._id, function (comments) {
              $scope.comments = comments;
            });
        });
      $scope.newComment='';
    };
    /**
     * Leave active group
     */
    $scope.leaveGroup = function(group){
      if($scope.userGroups.length===1) {
        $scope.setUserGroups([]);
        //removing the last group
        $scope.setActiveGroup(0);
        $scope.setGroupClips([]);
      }else if($scope.userGroups.indexOf(group)===0){
        // removing first group, replace with second.
        $scope.setActiveGroup(1);
      } else {
        $scope.setActiveGroup(0);
      }
      groupservice.leaveGroup($rootScope.user._id, $rootScope.oauth.access_token,
        group._id, function () {
          $scope.setState();
        });
      $scope.setActiveClip(0);
      $scope.setState();
    };
    /**
     * Redirect user to add User Page
     */
    $scope.addUserPage = function(){
      console.log("HERE");
      // Todo: Add checks here.
      groupservice.addUserPage($scope.userGroups[$scope.activeClip]);
    };
    $scope.newGroupPage = function(){
      $location.path('/newGroup');
    }
    /**
     * Initialise group page
     * Todo: Change this to save users previous activity
     */
    var init = function(){
      $('#alert-share').hide();
      $scope.setState();
      groupservice.getMyGroups($rootScope.user._id, $rootScope.oauth.access_token, function (groups) {
        $scope.userGroups=groups;
        if($scope.userGroups !== undefined && $scope.userGroups.length!==0) {
          groupservice.getClips($rootScope.user._id, $rootScope.oauth.access_token,
            $scope.userGroups[$scope.activeGroup]._id, function (clips) {
              $scope.setGroupClips(clips);
            });
        }
      });

    }
    init();

  });
