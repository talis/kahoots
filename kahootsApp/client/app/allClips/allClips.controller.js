'use strict';

angular.module('kahootsAppApp')
  .controller('AllClipsCtrl', function ($scope, $rootScope, socket, clipservice, groupservice) {
    // Input variables
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
    $scope.activeClip = 0;
    $scope.activeGroup = 0;
    $rootScope.activeView = 0;

    $scope.toggleView = function(){
      $scope.activeClip = 0;
      $('.no-groups').hide();
      $('.group-view').toggle();
      $('.group-clips').toggle();
      $('.my-clips-view').toggle();
      $('.my-clips').toggle();
      if($scope.activeView===0){
        // Change to group view
        if($scope.userGroups.length===0){ $('.no-groups').show();}
        $('#my-view-btn').removeClass('disabled');
        $('#group-view-btn').addClass('disabled');
        $scope.activeView=1;
      }else{
        // Change to my view
        $('#my-view-btn').addClass('disabled');
        $('#group-view-btn').removeClass('disabled');
        $scope.activeView=0;
      }
    };

    $scope.addNote = function(){
      if($scope.newNote ===''){return;}
      // Add new note to clip in db
      clipservice.addNewNote($rootScope.user._id, $rootScope.oauth.access_token,
        $scope.userClips[$scope.activeClip]._id,$scope.newNote);
      $scope.newNote = '';
      // Synchronize with clips
      socket.syncUpdates('clip', $scope.userClips);
    };

    // TODO: addComment
    $scope.addComment = function(){};

    $scope.shareClip = function(group) {
      console.log("Sharing:" + group);
      // send to server to share
      if($rootScope.activeView===1) {
        groupservice.shareClip($rootScope.user._id, $rootScope.oauth.access_token,
          group._id, $scope.visibleClips[$scope.activeClip]._id, function () {
            socket.syncUpdates('clip', $scope.userClips);
            // TODO :socket.syncUpdates('group', $scope.userGroups);
            getUserGroups();
          });
      }

      if($rootScope.activeView===0) {
        groupservice.shareClip($rootScope.user._id, $rootScope.oauth.access_token,
          group._id, $scope.userClips[$scope.activeClip]._id, function () {
            socket.syncUpdates('clip', $scope.userClips);
            // TODO :socket.syncUpdates('group', $scope.userGroups);
            getUserGroups();
          });
      }

    };

    $scope.addGroup = function(){
      console.log("Create new group\nName: "+$scope.newGroup.name);
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
        });
    };

    // TODO: addUser
    $scope.addUser = function(){};

    $scope.setActiveClip = function(clip){
      if($rootScope.activeView===0){
        $scope.activeClip = $scope.userClips.indexOf(clip._id);
      }else{
        $scope.activeClip = $scope.visibleClips.indexOf(clip._id);

      }
    };

    $scope.setActiveGroup = function(group){
      console.log("SET ACTIVE GROUP\n"+JSON.stringify(group));
      $scope.activeGroup = $scope.userGroups.indexOf(group._id);
      getGroupClips(group);
    };

    $scope.toggleClass = function(class_name){
      $(class_name).toggle();
    };


    var init = function(){

      // Initialise view
      $('#my-view-btn').addClass('disabled');
      $('.group-view').toggle();
      $('.add-group').toggle();
      $('.add-user').toggle();
      $('.group-clips').toggle();
      $('.no-groups').hide();

      getUserClips();
      getUserGroups();

      console.log("USER CLIPS:\n" + $scope.userClips);
      console.log("GROUP CLIPS:\n" + $scope.visibleClips);
    };
    var getUserClips= function() {
      // Get all my clips.
      clipservice.getMyClips($rootScope.user._id, $rootScope.oauth.access_token, function (clips) {
        $scope.userClips = clips;
        socket.syncUpdates('clip', $scope.userClips, function (){});
        if ($scope.userClips.length === 0){ noClip($scope.userClips) };
      });
    };
    var getUserGroups = function(){
      // Get all my groups.
      groupservice.getMyGroups($rootScope.user._id, $rootScope.oauth.access_token, function (groups) {
        $scope.userGroups = groups;
        if($scope.userGroups.length>0){getGroupClips($scope.userGroups[0]);}
        socket.syncUpdates('group', $scope.userGroups, function (){});
        // TODO: change this to a noGroups image
        if($scope.userGroups.length===0){ noClip($scope.visibleClips)} ;
      });
    };
    var getGroupClips = function(group){
      groupservice.getClips($rootScope.user._id,
        $rootScope.oauth.access_token, group._id, function(clips){
        $scope.visibleClips = clips;
        $scope.activeClip = 0;
        if($scope.visibleClips.length===0) { noClip($scope.visibleClips) };
      });
    }
    /*var init = function(){
      $('.myClips-view').toggle();
      $('.my-clips').toggle();
      $scope.toggleView();
      $('.add-user').toggle();
      $('.create-group').toggle();
      $('.no-clip-container').toggle();

      // Get all my clips.
      clipservice.getMyClips($rootScope.user._id, $rootScope.oauth.access_token, function (clips) {
        $scope.usersClips = clips;
        socket.syncUpdates('clip', $scope.usersClips, function(){
          if($scope.usersClips.length===0){noClip()}
        });
      });
      // Get all my groups.
      groupservice.getMyGroups($rootScope.user._id, $rootScope.oauth.access_token, function (groups) {
        $scope.userGroups = groups;
        // Set active group to 0
        if(groups.length>0) { $scope.setActiveGroup(groups[0]) }
      });



      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('clip');
      });
   };

    // Add new group
    $scope.createNewGroup = function() {
      console.log("Create new group\nName: "+$scope.newGroup.name);
      // Add group to kahoots db
      groupservice.addNewGroup($rootScope.user._id, $rootScope.oauth.access_token,
        {'name': $scope.newGroup.name, 'description': $scope.newGroup.description}, function () {
          // Reset new Group to blank.
          $scope.newGroup.name = '';
          $scope.newGroup.description = '';
        });
      // Hide form.
      $('.create-group').toggle();
      // Syncronize user.
      socket.syncUpdates('user', $rootScope.user);
      // Update user groups.
      groupservice.getMyGroups($rootScope.user._id, $rootScope.oauth.access_token,
        function (groups) {
          $scope.userGroups = groups;
        });
    };

    // Add new note to clip you own.
    $scope.addNote = function() {
      console.log("Add new note: " + $scope.newNote);
      if($scope.newNote ===''){return;}
      // Add new note to clip in db
      clipservice.addNewNote($rootScope.user._id, $rootScope.oauth.access_token,
        $scope.usersClips[$scope.activeClip]._id,$scope.newNote);
      $scope.newNote = '';
      // Synchronize with clips
      socket.syncUpdates('clip', $scope.usersClips);
    };

    // Set a new active clip.
    $scope.updateActiveClip = function(clip){
      console.log("Updating active clip to: " + clip._id);
      // set Active clip to the one the user just clicked.
      if($rootScope.activeView===1){
        $scope.activeClip = $scope.usersClips.indexOf(clip);
      }else {
        $scope.activeClip = $scope.visibleClips.indexOf(clip);
      }
    };

    $scope.shareClip = function(group){
      console.log("Sharing:" +group);
      // send to server to share
      groupservice.shareClip($rootScope.user._id, $rootScope.oauth.access_token,
      group._id, $scope.visibleClips[$scope.activeClip]._id, function(){
        // update all clips;
        socket.syncUpdates('clip', $scope.usersClips);
        //socket.syncUpdates('group', $scope.userGroups);

      });
    };

    $scope.toggleCreateGroup=function(){
      $('.create-group').toggle();
    };

    $scope.toggleView = function(){

      if($rootScope.activeView === 0){
        $('.comment-form2').show();
        $('.share-btn').show();
        // state 1 = my group clips
        $rootScope.activeView = 1;
        $('#my-view-btn').addClass('disabled');
        $('#group-view-btn').removeClass('disabled');
      }else{
        // state 0 = my clips
        $rootScope.activeView = 0;
        // Need to update activeClip

        $('#my-view-btn').removeClass('disabled');
        $('#group-view-btn').addClass('disabled');
      }
      $('.myClips-view').toggle();
      $('.groups-view').toggle();
      $('.group-clips').toggle();
      $('.my-clips').toggle();
    };

    $scope.setActiveGroup = function(group){
      $scope.activeGroup = $scope.userGroups.indexOf[group._id];
      $scope.activeClip = 0;
      groupservice.getClips($rootScope.user._id,
        $rootScope.oauth.access_token, group._id, function(clips){
          $scope.visibleClips = clips;
          if($scope.visibleClips.length===0){
            noClip();
          }else{
            $('.commentForm2').show();
          }
          socket.syncUpdates('clip', $scope.visibleClips);
        });
    };

    // Add fake clip to visibleClips
    var noClip = function(){
      var unClip = {
        content: "../assets/images/noClipFound.jpeg",
          name: "",
        comments: ["No Notes"],
        source: "",
        author: "",
        groups:[]
      };
      //Add fake clip
      $scope.visibleClips.push(unClip);
      $('.comment-form2').hide();
      $('.share-btn').hide();
    }*/
// Add fake clip to visibleClips
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
    }
    $(document).ready(init());
  });


/*// Delete clip.
 $scope.deleteClip = function(clip) {
 $http.delete('/api/clips/' + clip._id);
 };*/
