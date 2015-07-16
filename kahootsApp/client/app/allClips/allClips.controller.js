'use strict';

angular.module('kahootsAppApp')
  .controller('AllClipsCtrl', function ($scope, $rootScope, $http) {
    $scope.newComment='';
    $scope.awesomeClips=[];
    $scope.activeClip;
    $scope.username = $rootScope.user.first_name;

    $http.get('/api/clips/mine/' + $rootScope.user._id+"?access_token="+$rootScope.oauth.access_token, {headers:  {
      'Authorization': 'Bearer ' + $rootScope.oauth.access_token }}).success(function(awesomeClips) {
      $scope.awesomeClips = awesomeClips;
      $scope.activeClip = awesomeClips[0];
    });

    /*$scope.addClip = function() {
      if($scope.newClip === '') {
        return;
      }
      $http.post('/api/clips', { name: $scope.newClip });
      $scope.newClip = '';
    };*/

    $scope.deleteClip = function(clip) {
      $http.delete('/api/clips/' + clip._id);
    };

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

    $scope.updateActiveClip = function(clip){
      $scope.activeClip = clip;
    };
  });
