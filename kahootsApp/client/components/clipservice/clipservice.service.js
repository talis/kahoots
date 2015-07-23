'use strict';

angular.module('kahootsAppApp')
  .service('clipservice', function ($http, socket) {
    var instance = function(){};

    instance.getMyClips = function(user_id, access_token, callback){
      $http.get('/api/clips/mine/' + user_id+"?access_token="+access_token, {headers:  {
        'Authorization': 'Bearer ' + access_token }}).success(function(clips) {
        callback(clips);
      });
    };

    // Only for own clip.
    instance.addNewNote = function(user_id, access_token, clip_id, comment) {
      $http.defaults.headers.common.Authorization = 'Bearer ' + access_token;
      $http.post('api/clips/' + clip_id + "/users/" + user_id + "/groups/none/" +
        comment + "?access_token=" + access_token);
    };
    return instance;
  });
