'use strict';

angular.module('kahootsAppApp')
  .controller('LoginCtrl', function ($scope) {
    //Need to add these to a constants file
    var PERSONA_ENDPOINT = "https://users.talis.com:443";
    var KAHOOTS_ENDPOINT = "http://localhost:9000";
    var authProvider = "google";
    var shortCode = "talis";

    // TODO: Try to get user data, if null, need to login.
    // TODO: If user data not null redirect to main page.
    // TODO: Add permissions to pages.
    // TODO: If need to login, redirect to PERSONA then back to /login to get user data
    // Set up the next path
    console.log("The user needs to login.");
    var nextPath = KAHOOTS_ENDPOINT+'/main'; // NEED TO SEND THIS BACK ROUND TO LOGIN
    var redirectUri = nextPath; // TODO: Add a default.

    if (redirectUri.indexOf('sc=') === -1) {
      // no short code, we have to add it
      var qsChar = (redirectUri.indexOf('?') === -1) ? '?' : '&';
      redirectUri = redirectUri.replace('#', qsChar + 'sc=' + encodeURIComponent(shortCode) + '#');
    }
    var nextLocation = PERSONA_ENDPOINT + '/auth/providers/' + authProvider + '/login?redirectUri=' + encodeURIComponent(redirectUri) + '&nc=' + new Date().getTime();
    // set the window location
    window.location = nextLocation; // write nc param otherwise Safari and others will cache redirect


  });
