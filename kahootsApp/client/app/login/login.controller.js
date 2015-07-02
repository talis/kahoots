'use strict';


// FROM CUSTOMER HEALTH DASHBOARD
angular.module('kahootsAppApp')
  .controller('LoginCtrl', function ($scope, $rootScope, $location, UserService, PERSONA_ENDPOINT, CUSTOMER_HEALTH_DASHBOARD_ENDPOINT) {

    $scope.loadingMessage = 'Loading user...';

    if (!$scope.inst) {
      window.location = '/';
      return;
    }

    UserService.getLoginData($rootScope.inst.shortCode, function (err, user) {
      if (err) {
        console.log('Failed to get user details');
        console.log(err);
        return;
      }

      $scope.loadingMessage = 'Checking permissions...';

      if (user !== null) {
        // Check user permissions:
        // to view the app user must have the 'su' scope
        if (UserService.hasScope(user, 'su')) {
          $rootScope.nextPathScopeRequired = null;
          $rootScope.user = user;
          $rootScope.oauth = user.oauth;
          console.log('Logging in user:');
          console.log($rootScope.user);

          var next = $rootScope.nextPath ? $rootScope.nextPath : '/overview';
          $location.path(next).replace();
        } else {
          // User has insufficient permission
          $rootScope.error = {
            message:'User ('+user.profile.email+') does not have permission to access the dashboard'
          };
          $location.path('/');
        }
      } else {
        // User is null
        $rootScope.oauth = null;

        if ($rootScope.nextPath === null) {
          $rootScope.nextPath = '/overview';
        }

        // Set up the next path
        var nextPath = CUSTOMER_HEALTH_DASHBOARD_ENDPOINT + '/login';
        var redirectUri = ($rootScope.absUrl ? $rootScope.absUrl : nextPath);

        if (redirectUri.indexOf('sc=') === -1) {
          // no short code, we have to add it
          var qsChar = (redirectUri.indexOf('?') === -1) ? '?' : '&';
          redirectUri = redirectUri.replace('#', qsChar + 'sc=' + encodeURIComponent($rootScope.inst.shortCode) + '#');
        }

        // set up the next location which will either use the nextPath or whatever was in rootScope.absUrl if it was specified
        var nextLocation = PERSONA_ENDPOINT + '/auth/providers/' + $rootScope.inst.authProvider  + '/login?redirectUri=' + encodeURIComponent(redirectUri) + '&nc=' + new Date().getTime();
        // set the window location
        window.location = nextLocation; // write nc param otherwise Safari and others will cache redirect

      }
    });
  });
