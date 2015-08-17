'use strict';

angular.module('kahootsAppApp')
  .service('clipservice', function ($http, $rootScope) {
    //TODO: do not need to send access token as a query AND header - choose one.
    var instance = function(){};

    /**
     * send GET request to retrieve user's clips.
     * @param callback - called on success
     */
    instance.getMyClips = function(callback){
      $http.get('/api/clips/' + $rootScope.user._id + "?access_token=" + $rootScope.oauth.access_token,
        {headers:  {
          'Authorization': 'Bearer ' + $rootScope.oauth.access_token
          }
        }).success(function(clips) {
        callback(clips);
      });
    };
    /**
     * send POST request to add a new private comment to a clip.
     * @param clip_id String Id of clip to add comment to.
     * @param comment String
     * @param callback - called on success
     */
    instance.addNewNote = function(clip_id, comment, callback) {
      $http.defaults.headers.common.Authorization = 'Bearer ' + $rootScope.oauth.access_token;
      $http.post('api/clips/' + clip_id + "/users/" + $rootScope.user._id
        + "/comments" + "?access_token=" + $rootScope.oauth.access_token,
        {comment:comment}).success(function(){
        callback();
      });
    };
    /**
     * send GET request to retrieve private comments for a given clip.
     * @param clip_id String id of clip.
     * @param callback - called on success
     */
    instance.getNotes = function(clip_id, callback) {
      $http.get('/api/clips/' + clip_id + '/users/' + $rootScope.user._id +
        "/comments?access_token=" +$rootScope.oauth.access_token, {
        headers: {
          'Authorization': 'Bearer ' + $rootScope.oauth.access_token
        }
      }).success(function (comments) {
        callback(comments);
      });
    };

    /**
     * send DELETE request to soft delete (archive) clip.
     * Also removes clip from groups it has been shared with too.
     * @param clip_id String Id of clip.
     * @param callback - called on success
     */
    instance.deleteClip = function(clip_id, callback){
      $http.defaults.headers.common.Authorization = 'Bearer ' + $rootScope.oauth.access_token;
      $http.delete('api/clips/'+clip_id+"/users/"+$rootScope.user._id
        +"?access_token="+$rootScope.oauth.access_token).success(function(result){
        callback(result);
      });
    };

    /**
     * Add 'space-filler' clip to list.
     * @param list An array of clips.
     */
    instance.noClip = function(list) {
      var unClip = {
        content: "https://staging-files.talis.com/files/55c47c564d38257030000000/presign?version=2015/08/07/55c47c564d38257030000000/original/doc&access_token=",
        name: "no-clip",
        comments: ["No Notes"],
        source: "",
        author: "",
        groups: []
      };
      list.push(unClip);
    };
    /**
     * Sorts array of clip, newest first.
     * @param array An array of clip objects.
     */
    instance. sortArray = function(array){
      if(array===undefined || array.length <2){return}
      array.sort(function(a, b) {
        //console.log(JSON.stringify(a))
        //console.log(a.dateAdded);
        a = new Date(a.dateAdded);
        b = new Date(b.dateAdded);
        return a>b ? -1 : a<b ? 1 : 0;
      });
    };
    return instance;
  });
