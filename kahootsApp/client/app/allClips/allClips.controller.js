'use strict';

angular.module('kahootsAppApp')
  .controller('AllClipsCtrl', function ($scope, $rootScope, $http, socket) {
    $scope.newComment='';
    $scope.newGroup = {
      name:'',
      description:''
    };
    $scope.awesomeClips=[];
    $scope.index = 0;
    $scope.activeGroup = null;
    $scope.user = $rootScope.user;
    $scope.awesomeGroups = [];

    // Get all my clips.
    $http.get('/api/clips/mine/' + $rootScope.user._id+"?access_token="+$rootScope.oauth.access_token, {headers:  {
      'Authorization': 'Bearer ' + $rootScope.oauth.access_token }}).success(function(awesomeClips) {
      $scope.awesomeClips = awesomeClips;
      //$scope.activeClip = awesomeClips[$scope.index];
      //console.log($scope.activeClip);
      socket.syncUpdates('clip', $scope.awesomeClips);

    });


    // Get all my groups.
    $http.get('/api/groups/' + $rootScope.user._id+"?access_token="+$rootScope.oauth.access_token, {headers:  {
      'Authorization': 'Bearer ' + $rootScope.oauth.access_token }}).success(function(awesomeGroups) {
      $scope.awesomeGroups = awesomeGroups;
    });


    // Delete clip.
    $scope.deleteClip = function(clip) {
      $http.delete('/api/clips/' + clip._id);
    };

    // Add new group
    //POST api/groups/:group_id/users/:user_id/:id
    $scope.createNewGroup = function() {
      $http.defaults.headers.common.Authorization = 'Bearer ' + $rootScope.oauth.access_token;
      $http.post('api/groups/'+ $rootScope.user._id+"?access_token="+$rootScope.oauth.access_token,
        {'name': $scope.newGroup.name, 'description': $scope.newGroup.description}).success(function(group){
          $scope.newGroup.name = '';
          $scope.newGroup.description = '';
          //todo: update group and user
        });
      $scope.toggleCreateGroup();
    };

    // Add new comment to clip.
    $scope.updateClip = function() {
      console.log("updating clip");
      console.log($scope.awesomeClips[$scope.index].comments);
      if($scope.newComment ===''){return;}
      var id = $scope.awesomeClips[$scope.index]._id;
      //$scope.awesomeClips[$scope.index].comments.push($scope.newComment);
      //console.log($scope.awesomeClips[$scope.index].comments);

      //router.post('/:clip_id/users/:user_id/groups/:group_id/:comment', controller.addComment);

      $http.defaults.headers.common.Authorization = 'Bearer ' + $rootScope.oauth.access_token;
      $http.post('api/clips/' + id + "/users/" + $scope.user._id +"/groups/none/"+ $scope.newComment +"?access_token="+$rootScope.oauth.access_token);
      //socket.syncUpdates('clip', $scope.awesomeClips);
      $scope.newComment = '';

    };

    // Set a new active clip.
    $scope.updateActiveClip = function(clip){
      $scope.index = $scope.awesomeClips.indexOf(clip);
      //$scope.activeClip = $scope.awesomeClips[$scope.index];
    };
    // Set a new active group.
    $scope.updateActiveGroup = function(group){
      $scope.activeGroup = group;
    };
    // Toggle create new group div.
    $scope.toggleCreateGroup = function(){
      $('.create-group').toggle();
    };
    $(document).ready($scope.toggleCreateGroup());

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('clip');
    });


  });
