'use strict';

angular.module('kahootsAppApp')
  .controller('FeedCtrl', function ($scope, userservice, groupservice, $rootScope) {
    $scope.feed = [];

    var populateFeed = function(){
      userservice.getFeeds($rootScope.user._id, $rootScope.oauth.access_token, function (feed) {
        //console.log("USER FEED\n", feed.annotations);
        addToFeed(feed.annotations);

      });
      for(var i=0; i<$rootScope.user.group.length; i++){
        groupservice.getFeeds($rootScope.user.group[i], $rootScope.oauth.access_token, function (feed) {
          //console.log("GROUP FEED\n", feed.annotations);
          addToFeed(feed.annotations);
        });
      }
    };

    var addToFeed = function(list){
      for(var i=0; i<list.length; i++){
        //console.log(list[i])
        if(list[i].hasBody.details.type!=='describing'){
          list[i].hasBody.chars = "Added a new comment: \"" + list[i].hasBody.chars + "\"";
        }
        //list[i].hasBody.details.timeSince = getTimeSince(list[i]);
        $scope.feed.push(list[i]);
      }
      sortArray($scope.feed);
    };

    /**
     * Calculates the time since posting.
     * @param annotation
     */
    var getTimeSince = function(annotation){

      var a = Math.floor((new Date()));
      var b = Math.floor((new Date(annotation.annotatedAt)).getTime());
      var diff = a-b;
      console.log(diff);
      var t = '';
      var numyears = Math.floor(diff / 31536000);
      var numdays = Math.floor((diff % 31536000) / 86400);
      var numhours = Math.floor(((diff % 31536000) % 86400) / 3600);
      var numminutes = Math.floor((((diff % 31536000) % 86400) % 3600) / 60);
      var numseconds = (((diff % 31536000) % 86400) % 3600) % 60;
      if(numyears>0){ t = numyears + " years" }
      else if(numdays>0){ t = numdays + " days" }
      else if(numhours>0){ t = numdays +  "hours" }
      else if(numminutes>0){ t = numminutes + " minutes" }
      else if(numseconds>0){ t = numseconds + " seconds" }
      else{ t = "a moment" }
      return t;
    }
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
