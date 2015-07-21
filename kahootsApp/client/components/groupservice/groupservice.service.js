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
      $http.defaults.headers.common.Authorization = 'Bearer ' + access_token;
      $http.post('api/groups/'+ user_id+"?access_token="+access_token, new_group).success(function(group){
          callback(group);
      });
    };


    return instance;
  });
