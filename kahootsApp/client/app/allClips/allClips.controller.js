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
    $scope.activeView = 0;

    /*
       Toggles view from my-view to group-view
     */
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
    /*
       Add a new note to a clip you own.
     */
    $scope.addNote = function(){
      if($scope.newNote ===''){return;}
      // Add new note to clip in db
      clipservice.addNewNote($rootScope.user._id, $rootScope.oauth.access_token,
        $scope.userClips[$scope.activeClip]._id,$scope.newNote);
      $scope.newNote = '';
      // Synchronize with clips
      //socket.syncUpdates('clip', $scope.userClips);
      // clip updates
    };
    /*
       Add a comment to a shared clip.
     */
    // TODO: addComment
    $scope.addComment = function(){};
    /*
      share the active clip with the chosen group.
     */
    $scope.shareClip = function(group) {
      console.log("Sharing:" + group);
      // send to server to share
      if($rootScope.activeView===1) {
        groupservice.shareClip($rootScope.user._id, $rootScope.oauth.access_token,
          group._id, $scope.visibleClips[$scope.activeClip]._id, function () {
            // socket.syncUpdates('clip', $scope.userClips);
            // TODO :socket.syncUpdates('group', $scope.userGroups);
            getUserGroups();
          });
      }

      if($scope.activeView===0) {
        groupservice.shareClip($rootScope.user._id, $rootScope.oauth.access_token,
          group._id, $scope.userClips[$scope.activeClip]._id, function () {
            socket.syncUpdates('clip', $scope.userClips);
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
    /*
      Add user to active group.
     */
    // TODO: addUser
    $scope.addUser = function(){};
    /*
      Set the clip to the active clip.
      @param clip
     */
    $scope.setActiveClip = function(clip){
      console.log("Active clip:"+$scope.activeClip);
      console.log("setActiveClip state:"+$scope.activeView);
      if($scope.activeView===0){
        $scope.activeClip = $scope.userClips.indexOf(clip)
      }else{
        $scope.activeClip = $scope.visibleClips.indexOf(clip);
      }
      console.log("Active clip:"+$scope.activeClip);
    };
    /*
      Set the group to the active group.
      Get new group clips.
     */
    $scope.setActiveGroup = function(group){
      console.log("SET ACTIVE GROUP\n"+JSON.stringify(group));
      $scope.activeGroup = $scope.userGroups.indexOf(group);
      getGroupClips(group);
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

      // Initialise view
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


      socket.syncUpdates('clip', $scope.userClips, function(){
        getUserClips();
      });
      socket.syncUpdates('clip', $scope.visibleClips);
      socket.syncUpdates('group', $scope.userGroups);

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
      // Get all my clips.
      clipservice.getMyClips($rootScope.user._id, $rootScope.oauth.access_token, function (clips) {
        $scope.userClips = clips;
        if ($scope.userClips.length === 0){ noClip($scope.userClips) }
        /*socket.syncUpdates('group', $scope.userClips, function(){
          getUserClips();
        });*/
      });
    };
    /*
       Gets a list of group objects.
       Sets the list to userGroups.
       If list is not empty, sets activeGroup to the first in the list.
       If no groups, pushes 'space-filler' clip to visibleClips
     */
    var getUserGroups = function(){
      // Get all my groups.
      groupservice.getMyGroups($rootScope.user._id, $rootScope.oauth.access_token, function (groups) {
        // Set user groups
        $scope.userGroups = groups;
        socket.syncUpdates('group', $scope.userGroups);
        console.log("USER GROUPS\n"+JSON.stringify($scope.userGroups));

        // If groups exist, get group clips.
        if($scope.userGroups.length>0){
          getGroupClips($scope.userGroups[0]);
        }

        //socket.syncUpdates('group', $scope.userGroups, function (){});
        // TODO: change this to a noGroups image
        // If no groups exist
        if($scope.userGroups.length===0){ noClip($scope.visibleClips)}

        console.log("VISIBLE CLIPS \n" + JSON.stringify($scope.visibleClips));
      });
    };
    /*
       For a given group, gets a list of clip objects.
       Sets visibleClips to that list.
       Sets activeClip to 0.
       If list is empty, pushes 'space-filler' clip to visibleClips.
     */
    var getGroupClips = function(group){
      console.log("GET GROUP CLIPS: "+ group.name);
      groupservice.getClips($rootScope.user._id,
        $rootScope.oauth.access_token, group._id, function(clips){

          $scope.visibleClips = clips;
          socket.syncUpdates('clip', $scope.visibleClips);

          $scope.activeClip = 0;
        if($scope.visibleClips.length===0) { noClip($scope.visibleClips) }
          console.log("VISIBLE CLIPS\n" + JSON.stringify($scope.visibleClips[0]));
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
