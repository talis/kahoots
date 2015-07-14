'use strict';

var _ = require('lodash');
var GroupClip = require('./group_clip.model');

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