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
    instance.addNewNote = function(user_id, access_token, clip_id, comment, callback) {
      console.log("Add new note");
      $http.defaults.headers.common.Authorization = 'Bearer ' + access_token;
      $http.post('api/clips/' + clip_id + "/users/" + user_id  + "/" +
        comment + "?access_token=" + access_token, {comment:comment}).success(function(){
        callback();
      });

    };

    instance.getNotes = function(user_id, access_token, clip_id, callback) {
      console.log("GET Notes");
      //router.get('/:group_id/clips/:clip_id/users/:user_id/comments', controller.getComments);
      $http.get('/api/clips/' + clip_id + '/users/' + user_id + "/comments?access_token=" + access_token, {
        headers: {
          'Authorization': 'Bearer ' + access_token
        }
      }).success(function (comments) {
        console.log("GOT Notes");
        callback(comments);
      });
    };

    // Delete one of your own clips - and removes clips from groups too.
    instance.deleteClip = function(user_id, access_token, clip_id, callback){
      $http.defaults.headers.common.Authorization = 'Bearer ' + access_token;
      $http.delete('api/clips/'+clip_id+"/users/"+user_id +"?access_token="+access_token).success(function(result){
        console.log(result);
        callback(result);
      });
    };

    /**
     * Add 'space-filler' clip to list.
     * @param list An array of clips.
     */
    instance.noClip = function(list) {
      var unClip = {
        content: "../assets/images/noClipFound.jpeg",
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
