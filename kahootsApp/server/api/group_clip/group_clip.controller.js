'use strict';

var _ = require('lodash');
var GroupClip = require('./group_clip.model');
var Clip = require('../clip/clip.model');

// Get a list of clips given a group_id
exports.groupClips = function(req, res){
  req.personaClient.validateToken(req, res, function () {
    // Find all group_clip obj for a given group_id
    GroupClip.find()
      .where('group_id')
      .in([req.query.group_id])
      .exec(function (err, group_clip) {
        if (err) { return handleError(res, err); }
        if (!group_clip) { return res.send(404); }
        // group_clip is a list of {group_id, clip_id} objs
        // Need an array of clip_ids only.
        var clipList = [];
        for(var i=0; i<group_clip.length; i++){
          clipList.push(group_clip[i].clip_id);
        }
        Clip.find()
          .where('_id')
          .in(clipList)
          .exec(function (err, clip) {
            if (err) { return handleError(res, err); }
            if (!clip) { return res.send(404); }
            console.log("group_id: " + req.query.group_id);
            console.log("clips: "+ clip);
            return res.json(clip);
          });
      });
  }, req.params.id);
};

// Get list of group_clips
exports.index = function(req, res) {
  GroupClip.find(function (err, group_clips) {
    if(err) { return handleError(res, err); }
    return res.json(200, group_clips);
  });
};

// Get a single group_clip
exports.show = function(req, res) {
  GroupClip.findById(req.params.id, function (err, group_clip) {
    if(err) { return handleError(res, err); }
    if(!group_clip) { return res.send(404); }
    return res.json(group_clip);
  });
};

// Creates a new group_clip in the DB.
exports.create = function(req, res) {
  GroupClip.create(req.body, function(err, group_clip) {
    if(err) { return handleError(res, err); }
    return res.json(201, group_clip);
  });
};

// Updates an existing group_clip in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  GroupClip.findById(req.params.id, function (err, group_clip) {
    if (err) { return handleError(res, err); }
    if(!group_clip) { return res.send(404); }
    var updated = _.merge(group_clip, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, group_clip);
    });
  });
};

// Deletes a group_clip from the DB.
exports.destroy = function(req, res) {
  GroupClip.findById(req.params.id, function (err, group_clip) {
    if(err) { return handleError(res, err); }
    if(!group_clip) { return res.send(404); }
    group_clip.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
