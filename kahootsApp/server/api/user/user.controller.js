'use strict';

var _ = require('lodash');
var User = require('./user.model');

// GET api/users/:id/feeds
// TODO: Get feed for user and user's groups.

// GET api/users/:id
// Get own user object.
exports.search = function(req, res) {
  console.log("Create user");
  req.personaClient.validateToken(req, res, function () {
    User.findById(req.params.id, function (err, user) {
      if(err) { return handleError(res, err); }
      if(!user) { return res.send(404); }
      return res.json(200,user);
    });
  });
};

// GET api/users/
// Get list of users
exports.index = function(req, res) {
  User.find(function (err, users) {
    if(err) { return handleError(res, err); }
    return res.json(200, users);
  });
};


/*// GET api/users/:id
// Get a single user
exports.show = function(req, res) {
  User.findById(req.params.id, function (err, user) {
    if(err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    return res.json(user);
  });
};*/

// POST api/users/:id
// Creates a new user in the DB, for a given json.
// First checks user doesnt exist in db.
exports.create = function(req, res) {
  console.log("Create user");
  req.personaClient.validateToken(req, res, function () {
    console.log("Valid");
  // check if user exists
    User.findById(req.params.id, function(err, user){
      if (err) { return handleError(res, err); }
      if(user){return res.json(200, user)}

      if(!user){
        // if user does not exist create new user
        var newUser = req.body.profile;
        newUser._id = req.params.id;
        User.create(newUser, function(err, user) {
          if(err) {return handleError(res, err); }
          return res.json(201, user);
        });
      };
    });
  });
};

// PUT api/users/:id
// Updates an existing user in the DB.
// Add new group.
exports.update = function(req, res) {
  console.log('update');
  req.personaClient.validateToken(req, res, function () {
    console.log('valid');
    if(req.body._id) { delete req.body._id; }

    User.findById(req.params.id, function (err, user) {
      if (err) { return handleError(res, err); }
      if(!user) { return res.send(404); }

      var updated = _.merge(user, req.body);
      updated.markModified('group');
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.json(200, user);
      });
    });
  });
};

/*// DELETE api/users/:id
// Deletes a user from the DB.
exports.destroy = function(req, res) {
  User.findById(req.params.id, function (err, user) {
    if(err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    user.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};*/

// GET api/users/:user_id/feeds
// Get the users activity and users groups feed activity.
exports.feed = function(req, res){
  console.log('update');
  req.personaClient.validateToken(req, res, function () {
    console.log('valid');
    User.findById(req.params.user_id, function(err, user){
      if(err){return handleError(res, err)}
      if(!user){ return res.send(404, "User not found")}
        var target = {"hasTarget.uri": user._id, "limit":999};
        req.babelClient.getAnnotations(req.query.access_token, target, function(err, feeds){
          if (err) {
            console.log("Feed error! ",err)
            return handleError(res, err);} else {
            console.log("FEEDS\n");
            console.log(JSON.stringify(feeds));
            return res.json(200, feeds);
          }
        });

    });
  });
};

//GET api/users/

// Handle errors
function handleError(res, err) {
  return res.send(500, err);
}
