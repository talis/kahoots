'use strict';

var _ = require('lodash');
var Clip = require('./clip.model');

// Get list of clips
exports.index = function(req, res) {
  Clip.find(function (err, clips) {
    if(err) { return handleError(res, err); }
    return res.json(200, clips);
  });
};

// Get a single clip
exports.show = function(req, res) {
  Clip.findById(req.params.id, function (err, clip) {
    if(err) { return handleError(res, err); }
    if(!clip) { return res.send(404); }
    return res.json(clip);
  });
};

// Creates a new clip in the DB.
exports.create = function(req, res) {
  Clip.create(req.body, function(err, clip) {
    if(err) { return handleError(res, err); }
    return res.json(201, clip);
  });
};

// Updates an existing clip in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Clip.findById(req.params.id, function (err, clip) {
    if (err) { return handleError(res, err); }
    if(!clip) { return res.send(404); }
    var updated = _.merge(clip, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, clip);
    });
  });
};

// Deletes a clip from the DB.
exports.destroy = function(req, res) {
  Clip.findById(req.params.id, function (err, clip) {
    if(err) { return handleError(res, err); }
    if(!clip) { return res.send(404); }
    clip.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}