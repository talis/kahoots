'use strict';

angular.module('kahootsAppApp')
  .controller('MainCtrl', function ($scope, $http, $rootScope) {
    $scope.newComment = '';
    $scope.awesomeClips = [];
    $scope.awesomeGroups = [];
    $scope.activeClip;
    $scope.username = $rootScope.user.first_name;

    // Get all my clips
    $http.get('/api/clips/mine/' + $rootScope.user._id + "?access_token=" + $rootScope.oauth.access_token, {
      headers: {
        'Authorization': 'Bearer ' + $rootScope.oauth.access_token
      }
    }).success(function (awesomeClips) {
      $scope.awesomeClips = awesomeClips;
      $scope.activeClip = awesomeClips[0];
    });

    // Delete clip.
    $scope.deleteClip = function (clip) {
      $http.delete('/api/clips/' + clip._id);
    };

    // Add new comment and update clip.
    $scope.updateClip = function () {
      console.log("updating clip");
      if ($scope.newComment == '') {
        return;
      }
      var id = $scope.activeClip._id;
      $scope.activeClip.comments.push($scope.newComment);
      $http.put('/api/clips/' + id, $scope.activeClip);
      $scope.newComment = '';
    };

    // Set a new active clip.
    $scope.updateActiveClip = function (clip) {
      $scope.activeClip = clip;
    };

    // get all clips
    /*$http.get('/api/clips').success(function(awesomeClips) {
     $scope.awesomeClips = awesomeClips;
     $scope.activeClip = awesomeClips[0];
     });*/

    // Add clip.
    /*$scope.addClip = function () {
     if ($scope.newClip === '') {
     return;
     }
     $http.post('/api/clips', {name: $scope.newClip});
     $scope.newClip = '';
     };*/

    //Testing create and get user.
    $http.defaults.headers.common.Authorization = 'Bearer ' + $rootScope.user._id;
    $http.post('api/users/' + $rootScope.user._id + "?access_token=" + $rootScope.oauth.access_token,
      $rootScope.user).success(function (user) {
        console.log(user);
      });

    $http.get('api/users/me/' + $rootScope.user._id + "?access_token=" + $rootScope.oauth.access_token, {
      headers: {
        'Authorization': 'Bearer ' + $rootScope.oauth.access_token
      }
    }).success(function (user) {
      console.log(user);

    });


  });


