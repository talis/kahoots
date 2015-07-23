'use strict';

var _ = require('lodash');
var Group = require('./group.model');
var User = require('../user/user.model');
var Clip = require('../clip/clip.model');

// POST api/groups/:group_id/clips/clip_id/users/:user_id/:username/comment
exports.addComment = function(req,res){
  req.personaClient.validateToken(req, res, function () {
    var annotationData = {
      hasBody: {
        format: 'text/plain',
        type: 'Text',
        chars: req.body.comment ? req.body.comment : ''
      },
      hasTarget: {'group': req.params.group_id, 'clip':req.params.clip_id},
      annotatedBy: req.body.userId,
      motivatedBy: 'comment'
    };
    req.babelClient.createAnnotation(req.query.access_token, annotationData, function (err, results) {
      console.log("BABEL RESPONSE");
      console.log(JSON.stringify(results));
      if (err) {
        return handleError(res, err);
      } else {
        return res.json(200, results);
      }
    });
  }, req.params.user_id);
};
// GET api/groups/:group_id/clips/clip_id/users/user_id
exports.getComments = function(req, res){
  req.personaClient.validateToken(req, res, function () {
    var target = {
      hasTarget:{
        group: req.params.group_id,
        clip: req.params.clip_id
      }
    };
    req.babelClient.getAnnotation(req.query.access_token, target, function(err, comments){
      if (err) {
        return handleError(res, err);
      } else {
        return res.json(200, comments);
      }
    });
  }, req.params.user_id);
};


// POST api/groups/:group_id/users/:user_id/:id
// Add user to group and vice-versa.
exports.addUser = function(req, res){
  //var resp = res;
  var user_id = req.params.other_user_id;
  var group_id = req.params.group_id;
  var my_user_id = req.params.user_id;
  req.personaClient.validateToken(req, res, function () {
    // Check group exists.
    Group.findById(group_id, function (err, group) {
      if (err) {return handleError(res, err);}
      if (!group) {return res.send(404, "No group exists with id:" + group_id);}
      // Check requesting user is in group - authorized to add.
      if (group.users.indexOf(my_user_id) === -1) {return (401, "Unauthorized to add user to group.")}
      // Check user not already in group
      if (group.users.indexOf(user_id) !== -1) {return (404, "User already added to group.")}
      // Check user exists
      User.findById(user_id, function (err, user) {
        if (err) {return handleError(res, err);}
        if (!user) {return res.send(404, "No user exists with id:" + user_id);}
        // Check group not already in user.
        if (user.group.indexOf(group_id) !== -1) {return (404, "Group already added to user.")}
        // Add user id to group
        group.users.push(user_id);
        group.save(function (err) {
          if (err) {return handleError(res, err);}
        });
        // Add group to user
        user.group.push(group_id);
        user.save(function (err) {
          if (err) {return handleError(res, err);}
        });
        return res.json(200, group);
      });
    });
  },my_user_id);
};

// POST api/groups/:group_id/clips/:clip_id/:id
// Add clip to group and vice-versa.
exports.addClip = function(req, res){
  //var resp = res;
  var clip_id = req.params.clip_id;
  var group_id = req.params.group_id;
  var user_id = req.params.user_id;
  req.personaClient.validateToken(req, res, function () {
    // Check clip exists
    Clip.findById(clip_id, function(err, clip){
      if(err){return handleError(res, err)}
      if(!clip){return res.send(404, "Clip does not exist with id:" + clip_id)}
      // Check user is author.
      if(clip.author !== user_id){return res.send(404, "User not authorized to share clip with id:" + clip_id)}
      // Check group not in clip already
      if(clip.groups.indexOf(group_id)!==-1){return res.send(404, "Clip already in group, clip_id:" + clip_id)}
      // Check group exists
      Group.findById(group_id, function(err, group) {
        if (err) {return handleError(res, err)}
        if (!group) {return res.send(404, "Group does not exist with id:" + group_id)}
        // Check user is in group and authorised to share with group.
        if(group.users.indexOf(user_id)=== -1){return res.send(404, "User not in group, group_id:" + group_id)}
        // Check Clip not in group.
        if(group.clips.indexOf(clip_id)!== -1){return res.send(404, "Clip already in group, clip_id:" + clip_id)}
        // Everything ok, add clip to group
        group.clips.push(clip_id);
        group.save(function (err) {
          if (err) {return handleError(res, err);}
        });
        // Add group to clip
        clip.groups.push(group_id);
        clip.save(function (err) {
          if (err) {return handleError(res, err);}
        });
      });
    });
  }, user_id);
};

// GET api/groups/:group_id/users/:user_id/clips
// Get a list of all clips for a given group
exports.getGroupClips = function(req, res){
  req.personaClient.validateToken(req, res, function () {
    Group.findById(req.params.group_id, function (err, group) {
      if (err) {return handleError(res, err);}
      if (!group) {return res.send(404);}
      // check user is in group.
      if(group.users.indexOf(req.params.user_id) === -1){return res.send(404, "User not found in group")}
      Clip.find()
        .where('_id')
        .in(group.clips)
        .exec(function (err, clip) {
        if(err) { return handleError(res, err); }
        if(!clip) { return res.send(404); }
        return res.json(200, clip);
      }); // End get clips in group.clips.
    }); // End get group by id
  }, req.params.user_id);
};

// GET api/groups/
// Get list of all groups in db.
exports.index = function(req, res) {
  Group.find(function (err, groups) {
    if(err) { return handleError(res, err); }
    return res.json(200, groups);
  });
};

// GET api/groups/:user_id
// Get all user's groups.
exports.myGroups = function(req, res) {
  var user_id = req.params.user_id;
  req.personaClient.validateToken(req, res, function () {
    // Get user object by _id
    User.findById(user_id, function (err, user) {
      if (err) {return handleError(res, err);}
      if (!user) {return res.send(404, "No user exists with id:" + user_id);}
      // Find groups with _id in user.group array.
      Group.find()
        .where('_id')
        .in(user.group)
        .exec(function (err, group) {
          if (err) {return handleError(res, err);}
          if (!group) {return res.send(404);}
          return res.json(group);
        });
    });
  }, req.params.id);
};

// POST api/groups/
// Creates a new group in the DB, for a given json.
exports.create = function(req, res) {
  Group.create(req.body, function(err, group) {
    if(err) { return handleError(res, err); }
    return res.json(201, group);
  });
};


//POST api/groups/:user_id
// User can create a new Group.
exports.newGroup = function(req,res){
  var user_id = req.params.user_id;
  req.personaClient.validateToken(req, res, function () {
    // Create new group in db.
    Group.create(req.body, function(err, group) {
      if(err) { return handleError(res, err); }
      // Add user to group and vice versa.
      group.users.push(user_id);
      group.save(function (err) {
        if (err) {return handleError(res, err);}
      });
      User.findById(user_id, function (err, user) {
        if (err) {return handleError(res, err);}
        if (!user) {return res.send(404, "No user exists with id:" + user_id);}
        user.group.push(group._id);
        user.save(function (err) {
          if (err) {return handleError(res, err);}
        });
        return res.json(201, group);
      });
    });
  }, user_id);
};

// PUT api/groups/:id
// Updates an existing group in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Group.findById(req.params.id, function (err, group) {
    if (err) { return handleError(res, err); }
    if(!group) { return res.send(404); }
    var updated = _.merge(group, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, group);
    });
  });
};

// DELETE api/groups/:id
// Deletes a group from the DB.
exports.destroy = function(req, res) {
  Group.findById(req.params.id, function (err, group) {
    if(err) { return handleError(res, err); }
    if(!group) { return res.send(404); }
    group.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// Handle error.
function handleError(res, err) {
  return res.send(500, err);
}
