'use strict';

angular.module('kahootsAppApp')
  .controller('MainCtrl', function ($scope, $http, $rootScope) {
    $scope.newComment='';
    $scope.awesomeThings = [];
    $scope.awesomeClips=[];
    $scope.activeClip;
    $scope.username = $rootScope.user.profile.first_name;



    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };



    /*$http.get('/api/clips').success(function(awesomeClips) {
      $scope.awesomeClips = awesomeClips;
      $scope.activeClip = awesomeClips[0];
    });*/
    // Get all my clips

    $http.get('/api/clips/mine/' + $rootScope.user.guid+"?access_token="+$rootScope.oauth.access_token, {headers:  {
      'Authorization': 'Bearer ' + $rootScope.oauth.access_token }}).success(function(awesomeClips) {
      $scope.awesomeClips = awesomeClips;
      $scope.activeClip = awesomeClips[0];
    });

    $scope.addClip = function() {
      if($scope.newClip === '') {
        return;
      }
      $http.post('/api/clips', { name: $scope.newClip });
      $scope.newClip = '';
    };

    $scope.deleteClip = function(clip) {
      $http.delete('/api/clips/' + clip._id);
    };

    $scope.updateClip = function() {
      console.log("updating clip");
      if($scope.newComment ==''){ return;}
      var id = $scope.activeClip._id;
      $scope.activeClip.comments.push($scope.newComment);
      $http.put('/api/clips/' + id, $scope.activeClip);
      $scope.newComment = '';
    };

   $scope.updateActiveClip = function(clip){
      $scope.activeClip = clip;
    };


    $http.get('/api/group_users/mygroups/' + $rootScope.user.guid+"?access_token="+$rootScope.oauth.access_token, {headers:  {
      'Authorization': 'Bearer ' + $rootScope.oauth.access_token }}).success(function(awesomeGroups) {
      console.log("myGroups:" + JSON.stringify(awesomeGroups));
    });

  });

