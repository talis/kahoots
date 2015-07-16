'use strict';

var _ = require('lodash');
var User = require('./user.model');

// Get your user object
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

// Get list of users
exports.index = function(req, res) {
  User.find(function (err, users) {
    if(err) { return handleError(res, err); }
    return res.json(200, users);
  });
};

// Get a single user
exports.show = function(req, res) {
  User.findById(req.params.id, function (err, user) {
    if(err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    return res.json(user);
  });
};

// Creates a new user in the DB.
exports.create = function(req, res) {
  //console.log(JSON.stringify(req.body) + "******");
  // check if user exists
  User.findById(req.params.id, function(err, user){
    if (err) { return handleError(res, err); }
    if(user){return res.json(302, user)}
    if(!user){
      // if user does not exist create new user
      var newUser = req.body.profile;
      newUser._id = req.params.id;
      User.create(newUser, function(err, user) {
        if(err) {
          console.log("Error creating new user"+err);
          return handleError(res, err); }
        return res.json(201, user);
      });
    };
  });
};

// Updates an existing user in the DB.
// Also used to add a new group to a user.
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

function handleError(res, err) {
  return res.send(500, err);
}
