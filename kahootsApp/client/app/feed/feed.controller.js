'use strict';

angular.module('kahootsAppApp')
  .controller('FeedCtrl', function ($scope, userservice, groupservice, $rootScope) {
    $scope.feed = [];

    var populateFeed = function(){
      userservice.getFeeds($rootScope.user._id, $rootScope.oauth.access_token, function (feed) {
        console.log("USER FEED\n", feed.annotations);
        $scope.feed=$scope.feed.concat(feed.annotations);
        sortArray($scope.feed);
        console.log($scope.feed.length);

      });
      for(var i=0; i<$rootScope.user.group.length; i++){
        groupservice.getFeeds($rootScope.user.group[i], $rootScope.oauth.access_token, function (feed) {
          console.log("GROUP FEED\n", feed.annotations);
          $scope.feed=$scope.feed.concat(feed.annotations);
          sortArray($scope.feed);
        });
      }
    };
    /**
     * Sorts array of clip, newest first.
     * @param array An array of clip objects.
     */
    var sortArray = function(array){
      if(array===undefined || array.length <2){return}
      array.sort(function(a, b) {
        //console.log(JSON.stringify(a))
        //console.log(a.dateAdded);
        a = new Date(a.annotatedAt);
        b = new Date(b.annotatedAt);
        return a>b ? -1 : a<b ? 1 : 0;
      });
    };
    populateFeed();

  });
