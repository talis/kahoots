'use strict';

var _ = require('lodash');
var User = require('./user.model');

// GET api/users/me/:id
// Get own user object.
exports.search = function(req, res){
  console.log("SEARCH " + JSON.stringify(req.params));
  var response = res;
  var request = req;

    req.personaClient.validateToken(req, res, function () {
      if (res.statusCode >= 400) {
        console.log('Error retrieving client details from Persona');
        return response.json(res.statusCode, 'Error retrieving client details from Persona');
      }
      User.findById(request.params.id, function (err, user) {
          if(err) { return handleError(res, err); }
          if(!user) { return res.send(404); }
          console.log("User Found: " + user);
          return res.json(user);
        });
    }, request.param.id);

};

// GET api/users/
// Get list of users
exports.index = function(req, res) {
  User.find(function (err, users) {
    if(err) { return handleError(res, err); }
    return res.json(200, users);
  });
};

// GET api/users/:id
// Get a single user
exports.show = function(req, res) {
  User.findById(req.params.id, function (err, user) {
    if(err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    return res.json(user);
  });
};

// POST api/users/:id
// Creates a new user in the DB, for a given json.
// First checks user doesnt exist in db.
exports.create = function(req, res) {
  //console.log(JSON.stringify(req.body) + "******");
  // check if user exists
  var request = req;
  User.findById(req.params.id, function(err, user){
    if (err) { return handleError(res, err); }
    if(user){return res.json(302, user)}
    if(!user){
      // if user does not exist create new user
      var newUser = request.body.profile;
      newUser._id = request.params.id;
      User.create(newUser, function(err, user) {
        if(err) {
          console.log("Error creating new user"+err);
          return handleError(res, err); }
        return res.json(201, user);
      });
    };
  });
};

// PUT api/groups/:id
// Updates an existing user in the DB.
// Add new group.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  User.findById(req.params.id, function (err, user) {
    if (err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    var updated = _.merge(user, req.body);
    updated.markModified('groups');
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, user);
    });
  });
};

// DELETE api/users/:id
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
};

// Handle errors
function handleError(res, err) {
  return res.send(500, err);
}
