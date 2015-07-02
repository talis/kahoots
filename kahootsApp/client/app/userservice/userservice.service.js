'use strict';

//jscs:disable requireCamelCaseOrUpperCaseIdentifiers

angular.module('kahootsAppApp')
  .factory('UserService', function ($http, PERSONA_ENDPOINT) {
    var instance = function() {};

    instance.getLoginData = function(tenantShortCode, callback) {
      // requires session cookie on persona
      this._getUserData(PERSONA_ENDPOINT + '/2/auth/login.json?cb=JSON_CALLBACK', 'jsonp', tenantShortCode, callback);
    };

    /**
     * Check the user has the required scope, or is 'su'
     * @param user
     * @param scope
     * @return {Boolean}
     */
    instance.hasScope = function(user, scope) {
      if (!_.isEmpty(scope)) {
        if (user && user.oauth && user.oauth.scope) {
          var s = user.oauth.scope;
          for (var i = 0; i < s.length; i++) {
            if ((s[i] === 'su') || s[i] === scope) {
              return true;
            }
          }
        }
        console.log('Oops! User permissions not found. Access denied.');
        console.log('User: ' + JSON.stringify(user));
        return false;
      } else {
        // don't need to check user permissions as required scope was empty, so return true
        return true;
      }
    };


    instance._getUserData = function(endpoint, op, tenantShortCode, callback) {
      console.log($http[op](endpoint).error);
      $http[op](endpoint).then(function(response) {
        if (response.status === 200) {
          if (response.data) {
            var user = response.data;
            callback(null, user);
          } else {
            callback('No data received for user, despite 200', null);
          }
        }
      }, function(response) {
        console.log(response);
        // not an error, but no user either...
        callback(null, null);
      });
    };

    return instance;
  });

//jscs:enable requireCamelCaseOrUpperCaseIdentifiers
