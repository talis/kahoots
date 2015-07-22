'use strict';

angular.module('kahootsAppApp')
  .service('groupservice', function ($http) {
    var instance = function(){
      console.log("new groupservice");
    };

    instance.getMyGroups = function(user_id, access_token, callback){
      $http.get('/api/groups/' + user_id+"?access_token="+access_token, {headers:  {
        'Authorization': 'Bearer ' + access_token }}).success(function(groups) {
        callback(groups);
      });
    };

    instance.addNewGroup = function(user_id, access_token, new_group, callback){
      console.log("groupservice: adding new group");
      $http.defaults.headers.common.Authorization = 'Bearer ' + access_token;
      $http.post('api/groups/'+ user_id+"?access_token="+access_token, new_group).success(function(group){
          callback(group);
      });
    };

    instance.getClips = function(user_id,access_token, group_id,  callback){
      $http.get('/api/groups/' + group_id + '/users/' + user_id+"/clips?access_token="+access_token, {headers:  {
        'Authorization': 'Bearer ' + access_token }}).success(function(clips) {
        callback(clips);
      });
    };

    instance.shareClip = function(user_id, access_token, group_id, clip_id, callback){
      $http.defaults.headers.common.Authorization = 'Bearer ' + access_token;
      $http.post('api/groups/'+ group_id+ "/clips/"+ clip_id+ "/" + user_id +"?access_token="+access_token).success(function(){
        callback();
      });
    };

    return instance;
  });
