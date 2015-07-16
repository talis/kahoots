'use strict';

angular.module('kahootsAppApp')
  .controller('MainCtrl', function ($scope, $http, $rootScope) {
    $scope.newComment = '';
    $scope.awesomeThings = [];
    $scope.awesomeClips = [];
    $scope.awesomeGroups = [];
    $scope.activeClip;
    $scope.username = $rootScope.user.first_name;


    $http.get('/api/things').success(function (awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.addThing = function () {
      if ($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', {name: $scope.newThing});
      $scope.newThing = '';
    };

    $scope.deleteThing = function (thing) {
      $http.delete('/api/things/' + thing._id);
    };


    /*$http.get('/api/clips').success(function(awesomeClips) {
     $scope.awesomeClips = awesomeClips;
     $scope.activeClip = awesomeClips[0];
     });*/
    // Get all my clips

    $http.get('/api/clips/mine/' + $rootScope.user._id + "?access_token=" + $rootScope.oauth.access_token, {
      headers: {
        'Authorization': 'Bearer ' + $rootScope.oauth.access_token
      }
    }).success(function (awesomeClips) {
      $scope.awesomeClips = awesomeClips;
      $scope.activeClip = awesomeClips[0];
    });

    $scope.addClip = function () {
      if ($scope.newClip === '') {
        return;
      }
      $http.post('/api/clips', {name: $scope.newClip});
      $scope.newClip = '';
    };

    $scope.deleteClip = function (clip) {
      $http.delete('/api/clips/' + clip._id);
    };

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

    $scope.updateActiveClip = function (clip) {
      $scope.activeClip = clip;
    };

    //Tests - need to replace group_d with an existing one.
    /*$http.get('/api/group_users/mygroups/' + $rootScope.user.guid+"?access_token="+$rootScope.oauth.access_token, {headers:  {
     'Authorization': 'Bearer ' + $rootScope.oauth.access_token }}).success(function(awesomeGroups) {
     $scope.awesomeGroups = awesomeGroups;
     console.log("myGroups:" + JSON.stringify(awesomeGroups));
     }).then(
     $http.get('/api/group_clips/group/' + $rootScope.user.guid + "?group_id="+"55a62ece20e0208d21a3d84e" +"&access_token="+$rootScope.oauth.access_token, {headers:  {
     'Authorization': 'Bearer ' + $rootScope.oauth.access_token }}).success(function(awesomeClips) {
     console.log("g1 clips:" + JSON.stringify(awesomeClips));
     })
     );*/

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


