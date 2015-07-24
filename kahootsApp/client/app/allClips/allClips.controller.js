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

    var printStatus= function(){
      console.log("\nSTATUS\n");
      console.log("ACTIVE VIEW:\n" + $rootScope.activeView+"\n---");
      console.log("USER CLIPS:\n" + $scope.userClips +"\n---");
      console.log("USER GROUPS:\n" + $scope.userGroups +"\n---");
      console.log("VISIBLE CLIPS:\n" + $scope.visibleClips +"\n---");
      console.log("ACTIVE CLIP:\n" + $scope.activeClip +"\n---");
      console.log("ACTIVE GROUP:\n" + $scope.activeGroup +"\n---");
    }
    /*
       Toggles view from my-view to group-view
     */
    $scope.toggleView = function(){
      console.log("***TOGGLE VIEW START***");
      $scope.activeClip = 0;
      $('.no-groups').hide();
      $('.group-view').toggle();
      $('.group-clips').toggle();
      $('.my-clips-view').toggle();
      $('.my-clips').toggle();
      if($rootScope.activeView===0){
        // Change to group view
        if($scope.userGroups.length===0){
          $('.no-groups').show();
        }else{
          $scope.setActiveGroup($scope.userGroups[$scope.activeGroup]);
        }
        $('#my-view-btn').removeClass('disabled');
        $('#group-view-btn').addClass('disabled');
        $rootScope.activeView=1;
      }else{
        // Change to my view
        $('#my-view-btn').addClass('disabled');
        $('#group-view-btn').removeClass('disabled');
        $rootScope.activeView=0;
      }
      console.log("***TOGGLE VIEW END***");
      //printStatus();

    };
    /*
       Add a new note to a clip you own.
     */
    $scope.addNote = function(){
      console.log("***ADD NOTE START***");
      if($scope.newNote ===''){return;}
      // Add new note to clip in db
      clipservice.addNewNote($rootScope.user._id, $rootScope.oauth.access_token,
        $scope.userClips[$scope.activeClip]._id,$scope.newNote, function(){
          $scope.newNote = '';
          // Synchronize with clips
          //socket.syncUpdates('clip', $scope.userClips);
          // clip updates
          console.log("***ADD NOTE END***");
        });
    };
    /*
       Add a comment to a shared clip.
     */
    // TODO: addComment
    $scope.addComment = function(){

      if($scope.newComment ===''){return;}

      groupservice.addComment($rootScope.user, $rootScope.oauth.access_token,
        $scope.userGroups[$scope.activeGroup]._id, $scope.visibleClips[$scope.activeClip]._id, $scope.newComment, function(){
          getComments(function(){});
      });
      $scope.newComment='';

    };
    /*
      share the active clip with the chosen group.
     */
    $scope.shareClip = function(group) {
      $('.good-share').toggle();
      console.log("***SHARE CLIP START***");
      // send to server to share
      if($rootScope.activeView===1) {
        groupservice.shareClip($rootScope.user._id, $rootScope.oauth.access_token,
          group._id, $scope.visibleClips[$scope.activeClip]._id, function () {
            // socket.syncUpdates('clip', $scope.userClips);
            // TODO :socket.syncUpdates('group', $scope.userGroups);
            getUserGroups();
            console.log("***SHARE CLIP END***");

          });
      }

      if($rootScope.activeView===0) {
        groupservice.shareClip($rootScope.user._id, $rootScope.oauth.access_token,
          group._id, $scope.userClips[$scope.activeClip]._id, function () {
            socket.syncUpdates('clip', $scope.userClips, true);
            // TODO :socket.syncUpdates('group', $scope.userGroups);
            getUserGroups();

          });
      }

    };
    /*
      Add a new group to the db.
      @param newGroup
     */
    $scope.addGroup = function(){
      console.log("***ADD GROUP START***");
      // Add group to kahoots db
      groupservice.addNewGroup($rootScope.user._id, $rootScope.oauth.access_token,
        {'name': $scope.newGroup.name, 'description': $scope.newGroup.description}, function () {
          // Reset new Group to blank.
          $scope.newGroup.name = '';
          $scope.newGroup.description = '';
        });
      // Hide form.
      $('.add-group').toggle();
      // TODO: socket.syncUpdates('user', $rootScope.user);
      // TODO: socket.syncUpdates('group', $scope.userGroups);
      groupservice.getMyGroups($rootScope.user._id, $rootScope.oauth.access_token,
        function (groups) {
          $scope.userGroups = groups;
          if(groups.length===1){
            getGroupClips($scope.userGroups[0], function(){});
          }
          console.log("***ADD GROUP END***");
        });
    };
    /*
      Add user to active group.
     */
    // TODO: addUser
    $scope.addUser = function(){
      $('.add-user').toggle();
      if($scope.newUser === ''){return;}
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
      console.log("***SET ACTIVE CLIP START***");
      if($rootScope.activeView===0){
        $scope.activeClip = $scope.userClips.indexOf(clip)
      }else{
        $scope.activeClip = $scope.visibleClips.indexOf(clip);
      }
      console.log("***SET ACTIVE CLIP END***");
    };
    /*
      Set the group to the active group.
      Get new group clips.
     */
    $scope.setActiveGroup = function(group){
      console.log("***SET ACTIVE GROUP START***");
      console.log("ACT GR:"+$scope.activeGroup);
      $scope.activeGroup = $scope.userGroups.indexOf(group);
      getGroupClips(group, function(){

        console.log("***SET ACTIVE GROUP END***");
        console.log("ACT GR:"+$scope.activeGroup);

      });
    };
    /*
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
      $('.good-share').toggle();
      $('#my-view-btn').addClass('disabled');
      $('.group-view').toggle();
      $('.add-group').toggle();
      $('.add-user').toggle();
      $('.group-clips').toggle();
      $('.no-groups').hide();

      getUserClips();
      getUserGroups();

      //console.log("USER CLIPS:\n" + $scope.userClips);
      //console.log("GROUP CLIPS:\n" + $scope.visibleClips);


      socket.syncUpdates('clip', $scope.userClips,false, function(){
        getUserClips();
      });
      socket.syncUpdates('clip', $scope.visibleClips, true);
      socket.syncUpdates('group', $scope.userGroups, false);

      //socket.syncUpdates('user', $rootScope.user);


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
      console.log("***GET USER CLIPS START***");
      // Get all my clips.
      clipservice.getMyClips($rootScope.user._id, $rootScope.oauth.access_token, function (clips) {
        $scope.userClips = clips;
        if ($scope.userClips.length === 0){ noClip($scope.userClips) }
        /*socket.syncUpdates('group', $scope.userClips, function(){
          getUserClips();
        });*/
        console.log("***GET USER CLIPS END***");
      });
    };
    /*
       Gets a list of group objects.
       Sets the list to userGroups.
       If list is not empty, sets activeGroup to the first in the list.
       If no groups, pushes 'space-filler' clip to visibleClips
     */
    var getUserGroups = function(){
      console.log("***GET USER GROUPS START***");
      // Get all my groups.
      groupservice.getMyGroups($rootScope.user._id, $rootScope.oauth.access_token, function (groups) {
        // Set user groups
        $scope.userGroups = groups;
        socket.syncUpdates('group', $scope.userGroups, false, function(){
          //getUserGroups();
        });
        //console.log("USER GROUPS\n"+JSON.stringify($scope.userGroups));

        // If groups exist, get group clips.
        if($scope.userGroups.length>0){
          getGroupClips($scope.userGroups[0], function(){
            //socket.syncUpdates('group', $scope.userGroups, function (){});
            // TODO: change this to a noGroups image
            // If no groups exist
            if($scope.userGroups.length===0){ noClip($scope.visibleClips)}

            //console.log("VISIBLE CLIPS \n" + JSON.stringify($scope.visibleClips));
            console.log("***GET USER GROUPS END***");
          });
        }


      });
    };
    /*
       For a given group, gets a list of clip objects.
       Sets visibleClips to that list.
       Sets activeClip to 0.
       If list is empty, pushes 'space-filler' clip to visibleClips.
     */
    var getGroupClips = function(group,cb){
      console.log("***START GET GROUP CLIPS***");
      groupservice.getClips($rootScope.user._id,
        $rootScope.oauth.access_token, group._id, function(clips){
          $scope.visibleClips = clips;
          //socket.syncUpdates('clip', $scope.visibleClips);

          $scope.activeClip = 0;

          if($scope.visibleClips.length===0) {
            noClip($scope.visibleClips) ;
          }
          //console.log("VISIBLE CLIPS\n" + JSON.stringify($scope.visibleClips[0]));
          cb();
          console.log("***END GET GROUP CLIPS***");
        });
    };
    /*
       For active group and clip, get all comments.
       Sets comments to a list of babel annotation json.
     */
    var getComments = function(cb){
      console.log("***START GET COMMENTS***");
      groupservice.getComments($rootScope.user._id, $rootScope.oauth.access_token,
        $scope.userGroups[$scope.activeGroup]._id,
        $scope.visibleClips[$scope.activeClip]._id, function(comments){
         $scope.comments = comments;
          console.log("GET COMMENTS\n");
          console.log(JSON.stringify(comments));
          console.log("***END GET COMMENTS***");
          cb();
        });
    };

    /*
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

    $(document).ready(init());
  });


/*// Delete clip.
 $scope.deleteClip = function(clip) {
 $http.delete('/api/clips/' + clip._id);
 };*/
