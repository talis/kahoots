'use strict';
var Group = require('../../api/group/group.model');
var Clip = require('../../api/clip/clip.model');
var _createAnnotation = require('../shared/utils')._createAnnotation;


var groupManager = {};

// Removes clip from group
groupManager.removeClipFromGroup = function(req, res, cb){
  Group.findById(req.params.group_id, function(err, group){
    if(err){return cb(500)}
    if(!group){return cb(404)}
    console.log("group found");
    Clip.findById(req.params.clip_id, function(err, clip){
      if(err){return cb(500)}
      if(!clip){return cb(404)}
      console.log("clip found");

      //check clip in group
      if(group.clips.indexOf(clip._id)===-1){return cb(404)}
      console.log("clip in group");
      //check group in clip
      if(clip.groups.indexOf(group._id)===-1){return cb(404)}
      console.log("group in clip");


      group.clips.splice(group.clips.indexOf(clip._id),1);
      group.save(function (err) {
        if (err) {
          console.log("Cannot save group");
          return cb(500)
        }
        // remove user from group's users.
          clip.groups.splice(clip.groups.indexOf(group._id), 1);
          try {
            clip.save(function (err) {
              console.log("OK");
              req.body.comment = "Removed clip from group";
              var details= {
                content_id: clip._id,
                content:  clip.content
              };
              _createAnnotation(req, res, details,
                [req.params.user_id], 'describing');
            }); // end save clip.
          }catch(err){
            req.body.comment = "Removed clip from group";
            var details= {
              content_id: clip._id,
              content:  clip.content
            };
            _createAnnotation(req, res, details,
              [group._id], 'describing');

            console.log("Clip didnt save correctly.");
          }
        }
      ); // end save group.
    }); // end find clip by id.
  }); // end find group by id.
};
module.exports.GroupManager = groupManager;
