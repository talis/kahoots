'use strict';

angular.module('kahootsAppApp')
  .controller('AllClipsCtrl', function ($scope, $rootScope, socket, clipservice, groupservice) {
    $scope.newComment = '';
    $scope.newGroup = {
      name: '',
      description: ''
    };
    $scope.usersClips = [];
    // List of clip obj
    $scope.visibleClips = [];
    $scope.activeClip = 0;
    // List of group obj
    $scope.userGroups = [];
    $scope.activeGroup = 0;

    var init = function(){
      // Get all my clips.
      clipservice.getMyClips($rootScope.user._id, $rootScope.oauth.access_token, function (clips) {
        $scope.visibleClips = clips;
        $scope.usersClips = clips;
        socket.syncUpdates('clip', $scope.usersClips);
        socket.syncUpdates('clip', $scope.visibleClips);
      });
      // Get all my groups.
      groupservice.getMyGroups($rootScope.user._id, $rootScope.oauth.access_token, function (groups) {
        $scope.userGroups = groups;
      });

      $(document).ready($scope.toggleCreateGroup());

      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('clip');
      });
   };

    // Add new group
    $scope.createNewGroup = function() {
      groupservice.addNewGroup($rootScope.user._id, $rootScope.oauth.access_token,
        {'name': $scope.newGroup.name, 'description': $scope.newGroup.description}, function () {
          $scope.newGroup.name = '';
          $scope.newGroup.description = '';
        });
      $scope.toggleCreateGroup();
      socket.syncUpdates('user', $rootScope.user);
      groupservice.getMyGroups($rootScope.user._id, $rootScope.oauth.access_token,
        function (groups) {
          $scope.userGroups = groups;
        });
    };

    // Add new comment to clip.
    $scope.updateClip = function() {
      //console.log("updating clip");
      if($scope.newComment ===''){return;}
      clipservice.addNewNote($rootScope.user._id, $rootScope.oauth.access_token,
        $scope.visibleClips[$scope.activeClip]._id,$scope.newComment);
      $scope.newComment = '';
      socket.syncUpdates('clip', $scope.visibleClips);
    };

    // Set a new active clip.
    $scope.updateActiveClip = function(clip){
      $scope.activeClip = $scope.visibleClips.indexOf(clip);

    };

    // Set a new active group.
    $scope.updateActiveGroup = function(group){
      $scope.activeGroup = group;
      groupservice.getClips($rootScope.user._id, $rootScope.oauth.access_token,
      group._id, function(clips){
          $scope.visibleClips = clips;
        });
      // TODO: make tab active.
    };

    // Toggle create new group div.
    $scope.toggleCreateGroup = function(){
      $('.create-group').toggle();
    };


    init();
  });


/*// Delete clip.
 $scope.deleteClip = function(clip) {
 $http.delete('/api/clips/' + clip._id);
 };*/
