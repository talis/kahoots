'use strict';

angular.module('kahootsAppApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.newComment='';
    $scope.awesomeThings = [];
    $scope.awesomeClips=[];


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



    $http.get('/api/clips').success(function(awesomeClips) {
      $scope.awesomeClips = awesomeClips;
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
      var id = $scope.awesomeClips[0]._id;
      $scope.awesomeClips[0].comments.push($scope.newComment);
      $http.put('/api/clips/' + id, $scope.awesomeClips[0]);
      $scope.newComment = '';
    }




  });

