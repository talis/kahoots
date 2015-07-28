'use strict';


angular.module('kahootsAppApp')
  .service('groupdataservice', function () {
    var Group = require('../api/group/group.model');
    var Clip = require('../api/clip/clip.model');
    // AngularJS will instantiate a singleton by calling "new" on this function
    var instance = {};
    // Removes clip from group
    instance.removeClipFromGroup = function(group_id, clip_id, cb){
      Group.findById(group_id, function(err, group){
        if(err){return cb(500)}
        if(!group){return cb(404)}
        Clip.findById(clip_id, function(err, clip){
          if(err){return cb(500)}
          if(!clip){return cb(404)}
          //check clip in group
          if(group.clips.indexOf(clip._id)===-1){return cb(404)}
          //check group in clip
          if(clip.groups.indexOf(group._id)===-1){return cb(404)}
          group.clips.splice(group.clips.indexOf(clip._id),1);
          group.save(function (err) {
            if (err) {return cb(500)}
            // remove user from group's users.
            clip.groups.splice(clip.groups.indexOf(group._id),1);
            clip.save(function (err) {
              if (err) {return cb(500)}
              return cb(202);
            }); // end save clip.
          }); // end save group.
        }); // end find clip by id.
      }); // end find group by id.
    };
    return instance;
  });
