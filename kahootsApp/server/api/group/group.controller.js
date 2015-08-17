'use strict';

var _ = require('lodash');
var Group = require('./group.model');
var GroupManager = require('../../components/shared/groupClip').GroupManager;
var _createAnnotation = require('../../components/shared/utils')._createAnnotation;
var User = require('../user/user.model');
var Clip = require('../clip/clip.model');

// POST api/groups/:group_id/clips/clip_id/users/:user_id/comment
// Add a new comment to a clip in a group.
exports.addComment = function(req,res){
  //console.log("add comment");
  req.personaClient.validateToken(req, res, function () {
    if(req.body.comment === undefined){return res.send(400)}
    Group.findById(req.params.group_id, function (err, group) {
      if (err) {return handleError(res, err);}
      if (!group) {return res.send(404, 'Group does not exist');}
      Clip.findById(req.params.clip_id, function (err, clip) {
        if (err) {return handleError(res, err);}
        if (!clip) {return res.send(404, 'Clip does not exist');}
        // Find user info.
      User.findById(req.params.user_id, function (err, user) {
        if (err) {return handleError(res, err);}
        if (!user) {return res.send(404, 'User does not exist');}
        // check user is in group
        if(group.users.indexOf(user._id)===-1){return res.send(401)}
        // create annotation
        if(!req.body.comment){req.body.comment = '';}
        var details= {
          content_id: clip._id,
          content: clip.content,
          first_name: user.first_name,
          surname: user.surname,
          email: user.email
        };
        _createAnnotation(req, res, details,
          [req.params.group_id + "_" + req.params.clip_id, req.params.group_id], 'commenting');
        clip.save();
      }); // end User.findById
    }); // end Group.findById
  }); // end clip.findByID
  });
};

// GET api/groups/:group_id/clips/:clip_id/users/:user_id/comments
// Get annotations with target group_id + user_id.
exports.getComments = function(req, res){
  req.personaClient.validateToken(req, res, function () {
    //console.log("valid token");
    Group.findById(req.params.group_id, function (err, group) {
      if (err) {
        return handleError(res, err);
      }
      if (!group) {
        //console.log("no group exists");
        return res.send(404, "No group exists");
      }
      //console.log("Got group");
      //check user is in group
      if (group.users.indexOf(req.params.user_id) === -1) {
        res.send(401)
      }
      var target = {
        "hasTarget.uri": req.params.group_id + "_" + req.params.clip_id
      };
      req.babelClient.getAnnotations(req.query.access_token, target, function(err, comments){
        if (err) {return handleError(res, err);} else {
          return res.json(200, comments);
        }
      });
    });
  }, req.params.user_id);
};

// POST api/groups/:group_id/users/:user_id/:email
// Add user to group and vice-versa.
exports.addUser = function(req, res){
  req.personaClient.validateToken(req, res, function () {
    // Check group exists.
    Group.findById(req.params.group_id, function (err, group) {
      if (err) {return handleError(res, err);}
      if (!group) {return res.send(404, "No group exists");}

      // Check requesting user is in group - authorized to add.
      if (group.users.indexOf(req.params.user_id) === -1) {return res.send(401, "Unauthorized to add user to group.")}

      // Check user exists
      User.find({'email':req.params.email},function(err, user){
        var user = user[0];
        if (err) {return handleError(res, err);}
        if (!user){return res.send(404)}

        // Check user not already in group
        if (group.users.indexOf(user._id) >= 0) {
          return res.send(400, "User already added to group.");
        }
        // Check group not already in user.
        if (user.group.indexOf(req.params.group_id) !== -1) {return res.send(400, "Group already added to user.")}
        // Add user id to group
        group.users.push(user._id);
        group.save(function (err) {
          if (err) {return handleError(res, err);}
        });
        // Add group to user
        user.group.push(req.params.group_id);
        user.save(function (err) {
          if (err) {return handleError(res, err);}
        });
        return res.json(200, group);
      });
    });
  },req.params.user_id);

};

// POST api/groups/:group_id/clips/:clip_id/:id
// Add clip to group and vice-versa.
exports.addClip = function(req, res){
  req.personaClient.validateToken(req, res, function () {
    var Clip = require('../../api/clip/clip.model');
    User.findById(req.params.user_id, function(err, user) {
      if (err) {
        return handleError(res, err);
      }
      if (!user) {
        return res.send(404);
      }
      //console.log("User valid");
      // Check clip exists
      Clip.findById(req.params.clip_id, function (err, clip) {
        if (err) {
          return handleError(res, err)
        }
        if (!clip) {
          return res.send(404, "Clip does not exist")
        }
        // Check user is author.
        //if(clip.author !== req.params.user_id){return res.send(401, "User not authorized to share clip ")}
        // Check group not in clip already
        if (clip.groups.indexOf(req.params.group_id) !== -1) {
          return res.send(400, "Clip already in group")
        }
        // Check group exists
        Group.findById(req.params.group_id, function (err, group) {
          if (err) {
            return handleError(res, err)
          }
          if (!group) {
            return res.send(404, "Group does not exist")
          }
          // Check user is in group and authorised to share with group.
          //console.log("Is user in group?");
          if (group.users.indexOf(req.params.user_id) === -1) {
            return res.send(401, "User not in group")
          }
          //console.log("YES");
          // Check Clip not in group.
          if (group.clips.indexOf(req.params.clip_id) !== -1) {
            return res.send(404, "Clip already in group")
          }
          // Everything ok, add clip to group
          group.clips.push(req.params.clip_id);
          group.save(function (err) {
            if (err) {
              return handleError(res, err);
            }
          });
          // Add group to clip
          clip.groups.push(req.params.group_id);
          clip.save(function (err) {
            if (err) {
              return handleError(res, err);
            }
            // create an annotation describing the event.
            req.body.comment = "shared a clip with the group " + group.name;
            var details = {
              content_id: clip._id,
              content: clip.content,
              first_name: user.first_name,
              surname: user.surname,
              email: user.email,
              type: 'describing'
            };
            _createAnnotation(req, res, details,
              [group._id], 'describing');
          });
        });
      });
    });
  }, req.params.user_id);
};
// GET api/groups/:group_id/users/:user_id/clips
// Get a list of all clips for a given group
exports.getGroupClips = function(req, res){
  req.personaClient.validateToken(req, res, function () {

    Group.findById(req.params.group_id, function (err, group) {
      if (err) {return handleError(res, err);}
      if (!group) {return res.send(404);}
      // check user is in group.
      if(group.users.indexOf(req.params.user_id) === -1){return res.send(401, "User not found in group")}
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
/*exports.index = function(req, res) {
  Group.find(function (err, groups) {
    if(err) { return handleError(res, err); }
    return res.json(200, groups);
  });
};*/
// GET api/groups/:user_id
// Get all user's groups.
exports.myGroups = function(req, res) {
  req.personaClient.validateToken(req, res, function () {
    // Get user object by _id
    User.findById(req.params.user_id, function (err, user) {
      if (err) {return handleError(res, err);}
      if (!user) {return res.send(404, "No user exists");}
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

//POST api/groups/:user_id
// User can create a new Group.
exports.newGroup = function(req,res){
  req.personaClient.validateToken(req, res, function () {
    if(req.body.name===undefined){return res.send(400)}

    // Create new group in db.
    Group.create(req.body, function(err, group) {
      if(err) { return handleError(res, err); }
      // Add user to group and vice versa.
      group.users.push(req.params.user_id);
      group.save(function (err) {
        if (err) {return handleError(res, err);}
      });

      User.findById(req.params.user_id, function (err, user) {
        if (err) {return handleError(res, err);}
        if (!user) {return res.send(404, "No user exists");}
        user.group.push(group._id);
        user.save(function (err) {
          if (err) {return handleError(res, err);}
        });

        return res.json(201, group);
      });
    });
  }, req.params.user_id);
};

// DELETE api/groups/:group_id/users
// Removes a user from a group.
exports.removeUser = function(req, res){
  req.personaClient.validateToken(req, res, function () {

    Group.findById(req.params.group_id, function(err, group){
      if(err){return handleError(res, err)}
      if(!group){return res.send(404)}

      User.findById(req.params.user_id, function(err, user){
        if(err){return handleError(res, err)}
        if(!user){return res.send(404)}

        // check user is in group.
        var index1 = user.group.indexOf(group._id);
        var index2 = group.users.indexOf(user._id);
        if(index1 === -1){return res.send(400)}
        if(index2 === -1){return res.send(400)}
        console.log('user in group');

        // remove group from user's groups.
        user.group.splice(index1, 1);
        user.save(function (err) {
          if (err) {return handleError(res, err);}
          // remove user from group's users.
          group.users.splice(index2, 1);

          if(group.users.length===0){
            // If group is now empty then delete.
            group.remove(function(err) {
              if(err) { return handleError(res, err); }
              return res.send(204);
            }); // end remove group.
          }else {
            group.save(function (err) {
              if (err) {return handleError(res, err);}
              return res.json(200,group);
            }); // end save group.
          }
        }); // end save user.
      }); // end find user by id.
    }); // end find group by id.
  }, req.params.user_id);
};
// DELETE api/groups/:group_id/clips/:clip_id/users/:user_id
// Removes clip from group
exports.removeClip = function(req,res){
  console.log("Group: Remove clip");
  req.personaClient.validateToken(req, res, function () {
    User.findById(req.params.user_id, function(err, user){
      if(err){return handleError(res, err)}
      if(!user){
        console.log("no user");
        return res.send(404)}
      //check user in group
      console.log("user exists");
      if(user.group.indexOf(req.params.group_id)===-1){return res.send(401)}
      console.log('user in group OK');
      GroupManager.removeClipFromGroup(req,res, function(status){
        // create an annotation describing the event.

        return res.send(status);
      });
    }); // end find user by id.
  }, req.params.user_id);
};

// GET api/groups/:group_id/feeds
// Get the groups feed activity.
exports.feed = function(req, res){
  console.log('group feeds');
  req.personaClient.validateToken(req, res, function () {
    console.log('valid');
    Group.findById(req.params.group_id, function(err, group){
      if(err){return handleError(res, err)}
      if(!group){ return res.send(404, "Group not found")}
      var target = {"hasTarget.uri": req.params.group_id, "limit":999};
      req.babelClient.getAnnotations(req.query.access_token, target, function(err, feeds){
        if (err) {return handleError(res, err);} else {
          //console.log("FEEDS\n");
          //console.log(JSON.stringify(feeds));
          return res.json(200, feeds);
        }
      });

    });
  });
};
// Handle error.
function handleError(res, err) {
  return res.send(500, err);
}
