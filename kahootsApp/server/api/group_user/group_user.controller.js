'use strict';

var _ = require('lodash');
var GroupUser = require('./group_user.model');
var Group = require('../group/group.model');

// Get a list of group_users WHERE user_id
exports.mygroups = function(req, res){
  console.log("mygroups called");
  req.personaClient.validateToken(req, res, function () {
    GroupUser.find()
      .where('user_id')
      .in([req.params.id])
      .exec(function (err, group_user) {
        if (err) {
          return handleError(res, err);
        }
        if (!group_user) {
          return res.send(404);
        }
        console.log("Group_user "+ group_user);
        // group_user = [{group_id, user_id}]
        var groupList = [];
        console.log(group_user[0].group_id);
        for(var i=0; i<group_user.length; i++){
          console.log("in loop");
          Group.findById('g1', function (err, group) {
            if(err) { return handleError(res, err); }
            if(!group) { return res.send(404); }
            console.log("Group " + group);
            groupList.push(group);
            console.log(groupList.length);
          });
        }
        console.log("\n\nGroupList: " + groupList);
        return res.json(groupList);
        // TODO: Get a list of just group objects.
      });
  }, req.params.id);
};

// Get list of group_users
exports.index = function(req, res) {
  GroupUser.find(function (err, group_users) {
    if(err) { return handleError(res, err); }
    return res.json(200, group_users);
  });
};

// Get a single group_user
exports.show = function(req, res) {
  GroupUser.findById(req.params.id, function (err, group_user) {
    if(err) { return handleError(res, err); }
    if(!group_user) { return res.send(404); }
    return res.json(group_user);
  });
};

// Creates a new group_user in the DB.
exports.create = function(req, res) {
  GroupUser.create(req.body, function(err, group_user) {
    if(err) { return handleError(res, err); }
    return res.json(201, group_user);
  });
};

// Updates an existing group_user in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  GroupUser.findById(req.params.id, function (err, group_user) {
    if (err) { return handleError(res, err); }
    if(!group_user) { return res.send(404); }
    var updated = _.merge(group_user, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, group_user);
    });
  });
};

// Deletes a group_user from the DB.
exports.destroy = function(req, res) {
  GroupUser.findById(req.params.id, function (err, group_user) {
    if(err) { return handleError(res, err); }
    if(!group_user) { return res.send(404); }
    group_user.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
