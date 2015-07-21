'use strict';

angular.module('kahootsAppApp')
  .service('userservice', function ($http) {

    // FROM Customer Health Dashboard

    // TODO: remove constants
    var PERSONA_ENDPOINT = "https://users.talis.com:443";
    // AngularJS will instantiate a singleton by calling "new" on this function
    var instance = function(){};

    instance.getLoginData = function(tenantShortCode, callback){
      // requires session cookie on persona
      /*
         Once the user has a browser session with persona, this shorter route is the equivalent
         of /auth/providers/{provider}/login.json above. Use with a cb= param for JSONP.
       */
      this._getUserData(PERSONA_ENDPOINT + '/2/auth/login.json?cb=JSON_CALLBACK', 'jsonp', tenantShortCode, callback);
    }

    instance._getUserData = function(endpoint, op, tenantShortCode, callback) {
      console.log("/userservice - getUserData");
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

    instance.getUser = function(user_id, access_token, callback){
      $http.defaults.headers.common.Authorization = 'Bearer ' + access_token;
      $http.post('api/users/' + user_id + "?access_token=" + access_token).success(function (user) {
           callback(user);
      }).error(function(user, err){
        callback(404, 'user not found');
      });
    };


    return instance;
  });
