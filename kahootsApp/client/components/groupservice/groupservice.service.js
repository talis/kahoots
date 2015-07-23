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
      console.log("START GROUP SERVICE: GET CLIPS");
      try {
        $http.get('/api/groups/' + group_id + '/users/' + user_id + "/clips?access_token=" + access_token, {
          headers: {
            'Authorization': 'Bearer ' + access_token
          }
        }).success(function (clips) {
          console.log("here 1");
          callback(clips);
          console.log("here 2");
          console.log("END GROUP SERVICE: GET CLIPS");
        });
      }catch(err){
        console.log("END GROUP SERVICE: GET CLIPS ***ERROR***")
      };

    };

    instance.shareClip = function(user_id, access_token, group_id, clip_id, callback){
      $http.defaults.headers.common.Authorization = 'Bearer ' + access_token;
      $http.post('api/groups/'+ group_id+ "/clips/"+ clip_id+ "/" + user_id +"?access_token="+access_token).success(function(){
        callback();
      });
    };

    instance.shareGroup = function(user_id, access_token, other_user_id, group_id, callback){
      // POST api/groups/:group_id/users/:user_id/:id
      $http.defaults.headers.common.Authorization = 'Bearer ' + access_token;
      $http.post('api/groups/'+ group_id+  "/users/"+ other_user_id +"/"+ user_id +"?access_token="+access_token).success(function(){
        callback();
      });
    };


    return instance;
  });
