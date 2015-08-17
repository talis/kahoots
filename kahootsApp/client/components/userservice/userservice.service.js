'use strict';

angular.module('kahootsAppApp')
  .service('userservice', function ($http,$location,$rootScope) {
    // TODO: extract constants to a global domain
    var PERSONA_ENDPOINT = "https://users.talis.com:443";

    var instance = function(){};

    /*instance.logout = function(){
      window.open('https://accounts.google.com/logout');
      $rootScope.user=null;
      $location.path('/').replace();
    };*/

    /**
     * Attempts to retrieve user information
     * @param tenantShortCode
     * @param callback
     */
    instance.getLoginData = function(tenantShortCode, callback){
      this._getUserData(PERSONA_ENDPOINT + '/2/auth/login.json?cb=JSON_CALLBACK', 'jsonp', tenantShortCode, callback);
    };

    // _ underscore represents a private method
    instance._getUserData = function(endpoint, op, tenantShortCode, callback) {

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
        // not an error, but no user either...
        callback(null, null);
      });
    };
    /**
     * sends POST request to get Kahoots user's info or create a new entry if user is not found.
     * @param user Persona user
     * @param access_token Provided by Persona
     * @param callback
     */
    instance.getUser = function(user, access_token, callback){
      $http.defaults.headers.common.Authorization = 'Bearer ' + access_token;
      $http.post('api/users/' + user.guid + "?access_token=" + access_token, user).success(function (user) {
           callback(user);
      }).error(function(user, err){
        callback(404, 'user not found');
      });
    };
    /**
     * send GET request to retrieve activity feed for a user.
     * @param callback - called on success
     */
    instance.getFeeds = function(callback){
      $http.defaults.headers.common.Authorization = 'Bearer ' + $rootScope.oauth.access_token;
      $http.get('api/users/' + $rootScope.user._id + "/feeds?access_token="
        + $rootScope.oauth.access_token).success(function (feed) {
        callback(feed);
      });
    };

    return instance;
  });
