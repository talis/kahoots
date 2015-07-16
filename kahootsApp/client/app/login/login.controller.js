'use strict';

angular.module('kahootsAppApp')
  .controller('LoginCtrl', function ($scope, userservice, $rootScope, $location, $http) {
    //Todo: Need to add these to a constants file
    var PERSONA_ENDPOINT = "https://users.talis.com:443";
    var KAHOOTS_ENDPOINT = "http://localhost:9000";
    var authProvider = "google";
    var shortCode = "talis";

    // Get user info from Persona.
    userservice.getLoginData(shortCode, function(err, user){
      if(err){
        console.log('Failed to get user details');
        console.log(err);
        return;
      }
      // If user info exists, save in rootScope.
      if(user!== null){
        $rootScope.oauth = user.oauth;


        //check if user exists in kahoots
        $http.get('api/users/me/' + user.guid + "?access_token=" + $rootScope.oauth.access_token, {
          headers: {
            'Authorization': 'Bearer ' + $rootScope.oauth.access_token
          }
        }).success(function (user) {
          console.log(user);
          $rootScope.user = user;
          var next = '/main';
          $location.path(next).replace();
        });
        if($rootScope.user===null){
          $http.defaults.headers.common.Authorization = 'Bearer ' + user.guid;
          $http.post('api/users/' + user.guid + "?access_token=" + $rootScope.oauth.access_token,
            $rootScope.user).success(function (user) {
              console.log(user);
              $rootScope.user = user;
              var next = '/main';
              $location.path(next).replace();
            });
        }

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


