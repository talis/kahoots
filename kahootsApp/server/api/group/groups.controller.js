'use strict';

var _ = require('lodash');
var Groups = require('./groups.model');

// Get list of groupss
exports.index = function(req, res) {
  Groups.find(function (err, groupss) {
    if(err) { return handleError(res, err); }
    return res.json(200, groupss);
  });
};

// Get a single group
exports.show = function(req, res) {
  Groups.findById(req.params.id, function (err, groups) {
    if(err) { return handleError(res, err); }
    if(!groups) { return res.send(404); }
    return res.json(groups);
  });
};

// Creates a new group in the DB.
exports.create = function(req, res) {
  Groups.create(req.body, function(err, groups) {
    if(err) { return handleError(res, err); }
    return res.json(201, groups);
  });
};

// Updates an existing group in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Groups.findById(req.params.id, function (err, groups) {
    if (err) { return handleError(res, err); }
    if(!groups) { return res.send(404); }
    var updated = _.merge(groups, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, groups);
    });
  });
};

// Deletes a group from the DB.
exports.destroy = function(req, res) {
  Groups.findById(req.params.id, function (err, groups) {
    if(err) { return handleError(res, err); }
    if(!groups) { return res.send(404); }
    groups.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
