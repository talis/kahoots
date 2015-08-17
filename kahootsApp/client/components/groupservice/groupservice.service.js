'use strict';

angular.module('kahootsAppApp')
  .service('groupservice', function ($http, $location, $rootScope) {
    //TODO: do not need to send access token as a query AND header - choose one.

    var instance = function(){};

    instance.userGroups = [];
    instance.group = null;
    instance.clip = null;
    instance.returnPath = '/homepage';

    /**
     * Redirect user to 'add user to group' page
     * @param group Group object - the group in which the user is to be added to.
     */
    instance.addUserPage = function(group){
      /*
         If this app had a more MVC structure, this group object would be global
         and would not need to be passed around like this.
       */
      this.group = group;
      $location.path('/addUser');
    };
    /**
     * Redirect user to 'share clip with group' page
     * @param clip Clip object containing information about clip to be shared.
     * @param returnPath Url to return path
     */
    instance.shareClipPage = function(clip, returnPath){
      /*
       If this app had a more MVC structure, these two variables would not need to be
       passed around like this.
       */
      this.clip = clip;
      this.returnPath = returnPath;
      $location.path('/shareclip');
    };
    /**
     * Send GET request to server to get a list of group objects.
     * @param callback - function called if GET successful.
     */
    instance.getMyGroups = function(callback){
      $http.get('/api/groups/' +$rootScope.user._id +"?access_token="
        +$rootScope.oauth.access_token,
        {
          headers:  {
            'Authorization': 'Bearer ' + $rootScope.oauth.access_token
          }
        }).success(function(groups) {
        callback(groups);
      });
    };
    /**
     * POST a new group to server which also adds user to new group.
     * @param new_group Group object containing information about the new group.
     * @param callback - function called if POST successful.
     */
    instance.addNewGroup = function(new_group, callback){
      $http.defaults.headers.common.Authorization = 'Bearer ' + $rootScope.oauth.access_token;
      $http.post('api/groups/'+ $rootScope.user._id +"?access_token="
        +$rootScope.oauth.access_token, new_group).success(function(group){
          callback(group);
      });
    };
    /**
     * Sends GET request to server to retrieve an array of group clip objects.
     * @param group_id Id of group to retrieve clips from
     * @param callback - function called if GET successful.
     */
    instance.getClips = function( group_id,  callback){
        $http.get('/api/groups/' + group_id + '/users/' + $rootScope.user._id + "/clips?access_token=" + $rootScope.oauth.access_token, {
          headers: {
            'Authorization': 'Bearer ' + $rootScope.oauth.access_token
          }
        }).success(function (clips) {
          callback(clips);
        }).error(function(err, clips){
          callback(clips);
      });
    };
    /**
     * Send POST request to server with group and clip information.
     * @param group_id Id for group clip is to be added to.
     * @param clip_id Id for clip to be shared with group.
     * @param callback - function called if POST successful.
     */
    instance.shareClip = function(group_id, clip_id, callback){
      $http.defaults.headers.common.Authorization = 'Bearer ' + $rootScope.oauth.access_token;
      $http.post('api/groups/'+ group_id+ "/clips/"+ clip_id+ "/" + $rootScope.user._id
        +"?access_token="+ $rootScope.oauth.access_token).success(function(){
        callback();
      }).error(function(err, res){
        if(err.statusCode==400){
          alert("This clip has already been shared with the group selected.");
        }
      });
    };
    /**
     * send POST request to server To add a user with given email address to group.
     * @param email Add user by email to group.
     * @param group_id Id of group that user is to be added to.
     * @param callback - function called if POST successful.
     */
    instance.shareGroup = function( email, group_id, callback){
      $http.defaults.headers.common.Authorization = 'Bearer ' + $rootScope.oauth.access_token;
      $http.post('api/groups/'+ group_id+  "/users/"+ $rootScope.user._id +"/"+ email
        +"?access_token="+a$rootScope.oauth.access_token).success(function(){
        callback();
      });
    };
    /**
     * Send POST request with group comment.
     * @param group_id Id of active group.
     * @param clip_id Id of active clip.
     * @param comment String
     * @param callback - function called if POST successful.
     */
    instance.addComment = function(group_id, clip_id, comment, callback){
      $http.defaults.headers.common.Authorization = 'Bearer ' + $rootScope.oauth.access_token;
      $http.post('api/groups/'+ group_id+"/clips/" + clip_id
        +  "/users/"+ $rootScope.user._id +"/comments" +"?access_token="
        + $rootScope.oauth.access_token, {comment:comment}).success(function(){
        callback();
      });
    };
    /**
     * Send Get request to retrieve group comments for a given clip
     * @param group_id Id of group.
     * @param clip_id  Id of clip.
     * @param callback - function called if GET successful.
     */
    instance.getComments = function(group_id, clip_id, callback){
      $http.get('/api/groups/' + group_id + '/clips/' + clip_id + '/users/' + $rootScope.user._id + "/comments?access_token=" + $rootScope.oauth.access_token, {
        headers: {
          'Authorization': 'Bearer ' + $rootScope.oauth.access_token
        }
      }).success(function (comments) {
        callback(comments);
      });
    };
    /**
     * send DELETE request to remove user from group.
     * @param group_id Id of group .
     * @param callback - function called if DELETE successful.
     */
    instance.leaveGroup = function( group_id, callback){
      $http.defaults.headers.common.Authorization = 'Bearer ' + $rootScope.oauth.access_token;
      $http.delete('api/groups/'+group_id+"/users/"+ $rootScope.user._id
        + "?access_token="+ $rootScope.oauth.access_token).success(function(result){
        callback(result);
      });
    };
    /**
     * send DELETE request to remove a clip from group
     * @param group_id String Id of group
     * @param clip_id String Id of clip.
     * @param callback - function called if DELETE successful.
     */
    instance.removeClip = function( group_id, clip_id, callback){
      $http.defaults.headers.common.Authorization = 'Bearer ' + $rootScope.oauth.access_token;
      $http.delete('api/groups/'+group_id+"/clips/"+ clip_id +"/users/"
        + $rootScope.user._id +"?access_token="+$rootScope.oauth.access_token)
        .success(function(result){
          callback(result);
      });
    };
    /**
     * send GET request to retrieve activity feed for a single group.
     * @param group_id String Id of group
     * @param callback - function called if GET successful.
     */
    instance.getFeeds = function(group_id, callback){
      $http.defaults.headers.common.Authorization = 'Bearer ' + $rootScope.oauth.access_token;
      $http.get('api/groups/' + group_id + "/feeds?access_token="
        + $rootScope.oauth.access_token).success(function (feed) {
        callback(feed);
      });
    };

    return instance;
  });
