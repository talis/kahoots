'use strict';

angular.module('kahootsAppApp')
  .service('userservice', function ($http,$location,$rootScope) {


    // TODO: remove constants
    var PERSONA_ENDPOINT = "https://users.talis.com:443";
    // AngularJS will instantiate a singleton by calling "new" on this function
    var instance = function(){};

    instance.logout = function(){
      /*$http.defaults.headers.common.Authorization = 'Bearer ' + $rootScope.oauth.access_token;
      $http.get(PERSONA_ENDPOINT + "/auth/logout" + "?access_token=" + $rootScope.oauth.access_token).success(function(){
        console.log("Logging out...")
        $rootScope.user = null;
        $rootScope.oauth = null;
        var next = '/';
        $location.path(next).replace();
      });*/
      window.open('https://accounts.google.com/logout');
      $rootScope.user=null;
      $location.path('/').replace();
    };
    instance.getLoginData = function(tenantShortCode, callback){
      // requires session cookie on persona
      /*
         Once the user has a browser session with persona, this shorter route is the equivalent
         of /auth/providers/{provider}/login.json above. Use with a cb= param for JSONP.
       */
      this._getUserData(PERSONA_ENDPOINT + '/2/auth/login.json?cb=JSON_CALLBACK', 'jsonp', tenantShortCode, callback);
    };

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

    instance.getUser = function(user, access_token, callback){
      $http.defaults.headers.common.Authorization = 'Bearer ' + access_token;
      $http.post('api/users/' + user.guid + "?access_token=" + access_token, user).success(function (user) {
           callback(user);
      }).error(function(user, err){
        callback(404, 'user not found');
      });
    };

    instance.getFeeds = function(user_id, access_token, callback){
      console.log("userService - getFeeds");
      $http.defaults.headers.common.Authorization = 'Bearer ' + access_token;
      $http.get('api/users/' + user_id + "/feeds?access_token=" + access_token).success(function (feed) {
        callback(feed);
      });
    };

    return instance;
  });
