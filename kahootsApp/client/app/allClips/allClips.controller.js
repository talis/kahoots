'use strict';

angular.module('kahootsAppApp')
  .controller('AllClipsCtrl', function ($scope, $rootScope, $http) {
    $scope.newComment='';
    $scope.awesomeClips=[];
    $scope.activeClip;
    $scope.user = $rootScope.user;
    $scope.awesomeGroups = [];

    $('.create-group').toggle();
    // Get all my clips.
    $http.get('/api/clips/mine/' + $rootScope.user._id+"?access_token="+$rootScope.oauth.access_token, {headers:  {
      'Authorization': 'Bearer ' + $rootScope.oauth.access_token }}).success(function(awesomeClips) {
      $scope.awesomeClips = awesomeClips;
      $scope.activeClip = awesomeClips[0];
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

    // Add new comment to clip.
    $scope.updateClip = function() {
      console.log("updating clip");
      if($scope.newComment ==''){return;}
      var id = $scope.activeClip._id;
      $scope.activeClip.comments.push($scope.newComment);
      console.log($scope.activeClip.comments);
      $http.put('/api/clips/' + id + "?user_id=" + $rootScope.user._id+"&access_token="+$rootScope.oauth.access_token, {headers:  {
        'Authorization': 'Bearer ' + $rootScope.oauth.access_token }, clip:$scope.activeClip});
      $scope.newComment = '';
    };

    // Set a new active clip.
    $scope.updateActiveClip = function(clip){
      $scope.activeClip = clip;
    };
    // Set a new active clip.
    $scope.createGroup = function(clip){
      $('.create-group').toggle();
    };
  });
