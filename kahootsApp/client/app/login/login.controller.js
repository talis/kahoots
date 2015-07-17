'use strict';

angular.module('kahootsAppApp')
  .controller('LoginCtrl', function ($scope, userservice, $rootScope, $location, $http) {
    //Todo: Need to add these to a constants file
    var PERSONA_ENDPOINT = "https://users.talis.com:443";
    var KAHOOTS_ENDPOINT = "http://localhost:9000";
    var authProvider = "google";
    var shortCode = "talis";
    $scope.guid = null;

    // Login. Get user info from Persona and set $rootScope.user.
    userservice.getLoginData(shortCode, function(err, user){
      if(err){
        console.log('Failed to get user details');
        console.log(err);
        return;
      }
      // If user info exists, save in rootScope.
      if(user!== null){
        $rootScope.oauth = user.oauth;
        console.log(JSON.stringify(user));
        //check if user exists in kahoots
        $http.defaults.headers.common.Authorization = 'Bearer ' + user.guid;
        $http.post('api/users/' + user.guid + "?access_token=" + $rootScope.oauth.access_token, user).success(function (user) {
          // set $rootScope.user
          $rootScope.user = user;
          // redirect to main
          var next = '/main';
          $location.path(next).replace();
        }).error(function(user, status){
          if(status=== 302){
            $rootScope.user = user;
            // redirect to main
            var next = '/main';
            $location.path(next).replace();
          }else{
            // todo: Handle this error
            console.log("Error Logging in");
          }
        });

      }else {
        //User is null, needs to login.
        $rootScope.oauth = null;

        // Set up the next path
        console.log("The user needs to login.");
        var nextPath = KAHOOTS_ENDPOINT + '/login'; // NEED TO SEND THIS BACK ROUND TO LOGIN
        var redirectUri = nextPath; // TODO: Add a default.

        if (redirectUri.indexOf('sc=') === -1) {
          // no short code, we have to add it
          var qsChar = (redirectUri.indexOf('?') === -1) ? '?' : '&';
          redirectUri = redirectUri.replace('#', qsChar + 'sc=' + encodeURIComponent(shortCode) + '#');
        }
        var nextLocation = PERSONA_ENDPOINT + '/auth/providers/' + authProvider + '/login?redirectUri=' + encodeURIComponent(redirectUri) + '&nc=' + new Date().getTime();
        // set the window location
        window.location = nextLocation; // write nc param otherwise Safari and others will cache redirect
      }
    });
  });


