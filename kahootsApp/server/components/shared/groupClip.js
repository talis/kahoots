'use strict';
var Group = require('../../api/group/group.model');
var Clip = require('../../api/clip/clip.model');

var groupManager = {};

// Removes clip from group
groupManager.removeClipFromGroup = function(group_id, clip_id){
  Group.findById(group_id, function(err, group){
    if(err){return 500}
    if(!group){return 404}
    Clip.findById(clip_id, function(err, clip){
      if(err){return 500}
      if(!clip){return 404}
      //check clip in group
      if(group.clips.indexOf(clip._id)===-1){return 404}
      //check group in clip
      if(clip.groups.indexOf(group._id)===-1){return 404}
      group.clips.splice(group.clips.indexOf(clip._id),1);
      group.save(function (err) {
        if (err) {return 500}
        // remove user from group's users.
        clip.groups.splice(clip.groups.indexOf(group._id),1);
        clip.save(function (err) {
          if (err) {return 500}
          return 202;
        }); // end save clip.
      }); // end save group.
    }); // end find clip by id.
  }); // end find group by id.
};
module.exports.GroupManager = groupManager;