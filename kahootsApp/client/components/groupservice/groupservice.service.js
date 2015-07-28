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
        $http.get('/api/groups/' + group_id + '/users/' + user_id + "/clips?access_token=" + access_token, {
          headers: {
            'Authorization': 'Bearer ' + access_token
          }
        }).success(function (clips) {
          callback(clips);
          console.log("END GROUP SERVICE: GET CLIPS");
        }).error(function(err, clips){
          callback(clips);
      });


    };

    instance.shareClip = function(user_id, access_token, group_id, clip_id, callback){
      $http.defaults.headers.common.Authorization = 'Bearer ' + access_token;
      $http.post('api/groups/'+ group_id+ "/clips/"+ clip_id+ "/" + user_id +"?access_token="+access_token).success(function(){
        callback();
      });
    };

    instance.shareGroup = function(user_id, access_token, email, group_id, callback){
      // POST api/groups/:group_id/users/:user_id/:id
      $http.defaults.headers.common.Authorization = 'Bearer ' + access_token;
      $http.post('api/groups/'+ group_id+  "/users/"+ user_id +"/"+ email +"?access_token="+access_token).success(function(){
        callback();
      });
    };

    instance.addComment = function(user, access_token, group_id, clip_id, comment, callback){
      // POST api/groups/:group_id/clips/:clip_id/users/:user_id/comments
      console.log("addComment");
      $http.defaults.headers.common.Authorization = 'Bearer ' + access_token;
      $http.post('api/groups/'+ group_id+"/clips/" + clip_id +  "/users/"+ user._id +"/comments" +"?access_token="+access_token, {comment:comment}).success(function(){
        callback();
      });
    };

    instance.getComments = function(user_id, access_token, group_id, clip_id, callback){
      //router.get('/:group_id/clips/:clip_id/users/:user_id/comments', controller.getComments);
      $http.get('/api/groups/' + group_id + '/clips/' + clip_id + '/users/' + user_id + "/comments?access_token=" + access_token, {
        headers: {
          'Authorization': 'Bearer ' + access_token
        }
      }).success(function (comments) {
        callback(comments);
      });
    };

    instance.leaveGroup = function(user_id, access_token, group_id, callback){
      $http.defaults.headers.common.Authorization = 'Bearer ' + access_token;
      $http.delete('api/groups/'+group_id+"/users/"+user_id+"?access_token="+access_token).success(function(result){
        console.log(result);
        callback(result);
      });
    };

    instance.removeClip = function(user_id, access_token, group_id, clip_id, callback){
      $http.defaults.headers.common.Authorization = 'Bearer ' + access_token;
      $http.delete('api/groups/'+group_id+"/clips/"+ clip_id +"/users/"+user_id +"?access_token="+access_token).success(function(result){
        console.log(result);
        callback(result);
      });
    };

    return instance;
  });
