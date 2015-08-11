'use strict';

angular.module('kahootsAppApp')
  .controller('AllClipsCtrl', function ($scope, $rootScope, socket, clipservice, groupservice) {
    // Input variables
    $scope.newUser = '';
    $scope.newComment = '';
    $scope.newNote = '';
    $scope.newGroup = {
      name: '',
      description: ''};
    // Synchronized with db
    $scope.userClips = [];
    $scope.userGroups = [];
    // State dependent
    $scope.visibleClips = [];
    $scope.comments = [];
    $scope.activeClip = 0;
    $scope.activeGroup = 0;
    $rootScope.activeView = 0;
    $scope.oauth.access_token = $rootScope.oauth.access_token;


    /**
     * Prints current state of all scope variable.
     */
    var printStatus= function(){
      console.log("\nSTATUS\n");
      console.log("ACTIVE VIEW:\n" + $rootScope.activeView+"\n---");
      console.log("USER CLIPS:\n" + $scope.userClips +"\n---");
      console.log("USER GROUPS:\n" + $scope.userGroups +"\n---");
      console.log("VISIBLE CLIPS:\n" + $scope.visibleClips +"\n---");
      console.log("ACTIVE CLIP:\n" + $scope.activeClip +"\n---");
      console.log("ACTIVE GROUP:\n" + $scope.activeGroup +"\n---");
    };
    /**
       Toggles view from my-view to group-view
     */
    $scope.toggleView = function(){
      console.log("***TOGGLE VIEW START***");
      $scope.activeClip = 0;
      $('.no-groups').hide();


      // Change to group view
      if($rootScope.activeView===0){
        $('.group-view').show();
        $('.group-clips').show();
        $('.my-clips-view').hide();
        $('.my-clips').hide();
        // If no groups exist
        if($scope.userGroups.length===0) {
          $('.no-groups').show();
          $('.group-view').hide();
        }else if($scope.visibleClips.length===0){
          $('.group-view').hide();
        }else{
          $('.group-view').show();
          //$scope.setActiveGroup($scope.userGroups[$scope.activeGroup]);
        }
        $('#my-view-btn').removeClass('disabled');
        $('#group-view-btn').addClass('disabled');
        $rootScope.activeView=1;
      }else{
        $('.group-view').hide();
        $('.group-clips').hide();
        $('.my-clips-view').show();
        $('.my-clips').show();
        // Change to my view
        $('#my-view-btn').addClass('disabled');
        $('#group-view-btn').removeClass('disabled');
        $rootScope.activeView=0;
      }
      console.log("***TOGGLE VIEW END***");
      //printStatus();
    };
    /**
       Add a new note to a clip you own.
     */
    $scope.addNote = function(){
      //console.log("***ADD NOTE START***");
      if($scope.newNote ===''){return;}
      if($scope.userClips[$scope.activeClip]=== undefined){return;}
      // Add new note to clip in db
      clipservice.addNewNote($rootScope.user._id, $rootScope.oauth.access_token,
        $scope.userClips[$scope.activeClip]._id,$scope.newNote, function(){});
      $scope.newNote = '';
    };
    /**
       Add a comment to a shared clip.
     */
    $scope.addComment = function(){
      if($scope.newComment ===''){return;}
      if($scope.userGroups[$scope.activeGroup]===undefined){return;}
      if($scope.visibleClips[$scope.activeClip]===undefined){return;}

      groupservice.addComment($rootScope.user, $rootScope.oauth.access_token,
        $scope.userGroups[$scope.activeGroup]._id, $scope.visibleClips[$scope.activeClip]._id,
        $scope.newComment, function () {
          // TODO: Synchronise comments.
          getComments(function () {
          });
        });

      $scope.newComment='';
    };
    /**
      share the active clip with the chosen group.
     */
    $scope.shareClip = function(group) {
      if(group === undefined){return}
      //console.log("***SHARE CLIP START***");
      // send to server to share
      // If a group clip use visible clips, else use userClips
      if($rootScope.activeView===1) {
        var  shareFrom = $scope.visibleClips;
      } else {
        var shareFrom = $scope.userClips;
      }
      if(shareFrom[$scope.activeClip]===undefined){return;}
      groupservice.shareClipPage(group._id, shareFrom[$scope.activeClip]._id, function(){});


    };
    /*
      Remove clip from group.
      Active clip from active group
      Todo: Only if admin or person that shared clip in the first place.
     */
    $scope.removeClip = function(){
      //printStatus();
      if($scope.visibleClips[$scope.activeClip]===undefined){return;}
      if($scope.userGroups[$scope.activeGroup]===undefined){return;}
      var index = $scope.activeClip;
      var list = $scope.visibleClips;
      if($scope.visibleClips.length===1){
        $scope.activeClip = 0;
        $scope.visibleClips = [];
        noClip($scope.visibleClips);
      }else if($scope.visibleClips.indexOf($scope.activeClip)===0){
        $scope.setActiveClip($scope.visibleClips[1]);
      }else{
        $scope.setActiveClip($scope.visibleClips[0]);
      }
      groupservice.removeClip($rootScope.user._id, $rootScope.oauth.access_token,
        $scope.userGroups[$scope.activeGroup]._id, list[index]._id, function(){});
      //printStatus();

    };
    /*
       Delete clip for good!
     */
    $scope.deleteClip = function(){
      if($scope.userClips[$scope.activeClip]===undefined){return}
      var deletedClip = $scope.userClips[$scope.activeClip];
      if($scope.userClips.length===1){
        $scope.activeClip = 0;
        $scope.userClips = [];
        noClip($scope.userClips);
      }else if($scope.userClips.indexOf($scope.activeClip)===0){
        $scope.setActiveClip($scope.userClips[1]);
      }else{
        $scope.setActiveClip($scope.userClips[0]);
      }
      //instance.deleteClip = function(user_id, access_token, clip_id, callback){
      clipservice.deleteClip($rootScope.user._id, $rootScope.oauth.access_token,
      deletedClip._id, function(){
          getUserClips();
        });
    }
    /*
      Add a new group to the db.
      @param newGroup
     */
    $scope.addGroup = function(){
    if($scope.newGroup.name===''){return;}
      //console.log("***ADD GROUP START***");
      // Add group to kahoots db
      groupservice.addNewGroup($rootScope.user._id, $rootScope.oauth.access_token,
        {'name': $scope.newGroup.name, 'description': $scope.newGroup.description}, function(){});
      // Reset new Group to blank.
      $scope.newGroup.name = '';
      $scope.newGroup.description = '';
      // Hide form.
      $('.add-group').hide();
      // TODO: This should be syncronized
      groupservice.getMyGroups($rootScope.user._id, $rootScope.oauth.access_token,
        function (groups) {
          $scope.userGroups = groups;
          if(groups.length===1){
            getGroupClips($scope.userGroups[0], function(){});
          }
          //console.log("***ADD GROUP END***");
        });
    };
    /**
       Remove yourself from a group
       @param group
     */
    $scope.leaveGroup = function(group){
      $scope.activeClip = 0;
      if($scope.userGroups.length===1) {
        $('.group-view').hide();
        //removing the last group
        $scope.activeGroup = 0;
        $scope.visibleClips = [];
      }else if($scope.userGroups.indexOf(group)===0){
        // removing first group, replace with second.
        $scope.setActiveGroup($scope.userGroups[1]);
      }
      else {
        $scope.setActiveGroup($scope.userGroups[0]);
      }
      groupservice.leaveGroup($rootScope.user._id, $rootScope.oauth.access_token,
        group._id, function () {});
    };
    /**
      Add user to active group.
     */
    $scope.addUser = function(){
      if($scope.userGroups[$scope.activeGroup]===undefined){return;}
      if($scope.newUser === ''){return;}
      $('.add-user').hide();
      //instance.shareGroup = function(user_id, access_token, other_user_id, group_id, callback)
      groupservice.shareGroup($rootScope.user._id, $rootScope.oauth.access_token, $scope.newUser,
        $scope.userGroups[$scope.activeGroup]._id,function(){});
      $scope.newUser = '';
    };
    /*
      Set the clip to the active clip.
      @param clip
     */
    $scope.setActiveClip = function(clip){
      //console.log("***SET ACTIVE CLIP START***");
      if($rootScope.activeView===0){
        if($scope.userClips.indexOf(clip)>=0){ $scope.activeClip = $scope.userClips.indexOf(clip) }
        else { $scope.activeClip = 0 }
      }else{
        if($scope.visibleClips.indexOf(clip)>=0){
          $scope.activeClip = $scope.visibleClips.indexOf(clip);
          getComments(function(){});
        }else{ $scope.activeClip = 0}
      }
      //console.log("***SET ACTIVE CLIP END***");
    };
    /**
      Set the group to the active group.
      Get new group clips.
     */
    $scope.setActiveGroup = function(group){
      if($scope.userGroups.indexOf(group)<0) {return;}
      $scope.activeGroup = $scope.userGroups.indexOf(group);
      getGroupClips();
    };
    /**
       Toggles a given classname.
       @param class_name (eg. '.myclass')
     */
    $scope.toggleClass = function(class_name){
      $(class_name).toggle();
    };

    /*
      Initializes the state of the page.
     */
    var init = function(){
      console.log("***INIT***");
      // Initialise view
      $('#alert-share').hide();
      $('#my-view-btn').addClass('disabled');
      $('.group-view').hide();
      $('.add-group').hide();
      $('.add-user').hide();
      $('.group-clips').hide();
      $('.no-groups').hide();


      getUserClips();
      getUserGroups();

      //console.log("USER CLIPS:\n" + $scope.userClips);
      //console.log("GROUP CLIPS:\n" + $scope.visibleClips);


      socket.syncUpdates('clip', $scope.userClips, false, function(){
        getUserClips();
      });
      socket.syncUpdates('clip', $scope.visibleClips, true);
      socket.syncUpdates('group', $scope.userGroups, false, function(){
        if($scope.userGroups.length===0){
          $('.group-view').hide();
        }else{
          if($scope.activeView===1){
          $('.group-view').show();}
          getUserGroups();
          getGroupClips($scope.userGroups[$scope.activeGroup]);
        }
      });

      /*socket.syncUpdates('user', $rootScope.user, true, function(){
        getUserGroups();
      });*/


      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('clip');
        socket.unsyncUpdates('user');
        socket.unsyncUpdates('group');

      });
    };
    /*
       Gets a list of clip objects.
       Sets list to userClips.
       If list is empty fills with space-filler clip.
     */
    var getUserClips= function() {
      if($scope.userClips.length===0){
        noClip($scope.userClips);
      }
      // Get all my clips.
      clipservice.getMyClips($rootScope.user._id, $rootScope.oauth.access_token, function (clips) {
        $scope.userClips = clips;
        sortArray($scope.userClips);
      });
    };
    /*
       Gets a list of group objects.
       Sets the list to userGroups.
       If list is not empty, sets activeGroup to the first in the list.
       If no groups, pushes 'space-filler' clip to visibleClips
     */
    var getUserGroups = function(){
      if($scope.userGroups.length===0) {
        $('#leave-group-btn').addClass('disabled');
      }
      // Get all my groups.
      groupservice.getMyGroups($rootScope.user._id, $rootScope.oauth.access_token, function (groups) {
        // Set user groups
        $scope.userGroups = groups;
        $('#leave-group-btn').removeClass('disabled');
        getGroupClips();
      });
    };
    /**
       For the current active group, gets a list of clip objects.
       Sets visibleClips to that list.
     */
    var getGroupClips = function() {
      $('#leave-group-btn').removeClass('disabled');
      if ($scope.userGroups[$scope.activeGroup] === undefined) {return;}
      if($scope.visibleClips.length === 0){
        noClip($scope.visibleClips);
      }

      groupservice.getClips($rootScope.user._id, $rootScope.oauth.access_token,
        $scope.userGroups[$scope.activeGroup]._id, function (clips) {
         $scope.visibleClips = clips;
         getComments();
         if($scope.activeView===1){
           $('.group-view').show();
         }
      });
    };
    /**
       For active group and clip, get all comments.
       Sets comments to a list of babel annotation json.
     */
    var getComments = function(){
      if($scope.userGroups[$scope.activeGroup] === undefined){return;}
      if($scope.visibleClips[$scope.activeClip] === undefined) {return;}

      groupservice.getComments($rootScope.user._id, $rootScope.oauth.access_token,
        $scope.userGroups[$scope.activeGroup]._id,
        $scope.visibleClips[$scope.activeClip]._id, function (comments) {
          $scope.comments = comments;

        });

    };

    /**
       Add 'space-filler' clip to list.
       @param list An array of clips.
     */
    var noClip = function(list) {
      var unClip = {
        content: "../assets/images/noClipFound.jpeg",
        name: "",
        comments: ["No Notes"],
        source: "",
        author: "",
        groups: []
      };
      list.push(unClip);
    };
    /**
     *
     * @param array An array of clip objects.
     */
    var sortArray = function(array){
      console.log("Sort array");
      //console.log(array);
      array.sort(function(a, b) {
        //console.log(JSON.stringify(a))
        //console.log(a.dateAdded);
        a = new Date(a.dateAdded);
        b = new Date(b.dateAdded);
        return a>b ? -1 : a<b ? 1 : 0;
      });
    };

    $(document).ready(init());
  });


/*// Delete clip.
 $scope.deleteClip = function(clip) {
 $http.delete('/api/clips/' + clip._id);
 };*/
