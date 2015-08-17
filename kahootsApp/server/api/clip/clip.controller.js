'use strict';

var _ = require('lodash');
var Clip = require('./clip.model');
var Group = require('../group/group.model');
var GroupManager = require('../../components/shared/groupClip').GroupManager;
var _createAnnotation = require('../../components/shared/utils')._createAnnotation;
var User = require('../user/user.model');
var request = require('request');
var im = require('imagemagick');
var fs = require('fs');

// GET api/clips/:id
// Gets all clips for given user_id
exports.userClips = function(req, res){
  //console.log('Gets all clips for user');
  req.personaClient.validateToken(req, res, function (err) {
    if(err){return handleError(res, err)}

    Clip.find({'author': req.params.id, 'archived':false}, function (err, clip) {
        if(err) { return handleError(res, err); }
        if(!clip) { return res.send(404); }
        return res.json(200, clip);
      });
  },req.params.id);
};


// POST api/clips/
// For a given clip object, creates a new clip in the DB.
exports.create = function(req, res) {
  //console.log("create");
  Clip.create(req.body, function(err, clip) {
    if(err) { return handleError(res, err); }
    return res.json(201, clip);
  });
};

// POST api/clips/:clip_id/users/:user_id/:comment
// Add a new comment to the clip you are author of
exports.addComment = function (req, res) {
  //console.log("add comment");
  req.personaClient.validateToken(req, res, function () {
    Clip.findById(req.params.clip_id, function(err, clip){
      if (err) {return handleError(res, err);}
      if (!clip) {return res.send(404);}

      User.findById(req.params.user_id, function(err, user) {
        if (err) {return handleError(res, err);}
        if (!user) {return res.send(404);}

        // If user is author can comment.
        if( clip.author !== user._id){return res.send(401,"not author of clip")}
        // Create annotation
        if(!req.body.comment){req.body.comment = '';}
        var details= {
          content_id: clip._id,
          content: clip.content,
          first_name: user.first_name,
            surname: user.surname,
            email: user.email
        };
        _createAnnotation(req, res, details,
          [req.params.clip_id, req.params.user_id], 'comment');
        clip.save();
      }); // end find user by id
    }); // end find clip by id
  }, req.params.user_id);
};

// GET api/clips/:clip_id/users/:user_id/comments
// Search for annotations with target: user_id
exports.getComments = function(req, res){
  req.personaClient.validateToken(req, res, function () {
    var target = {"hasTarget.uri": req.params.clip_id};
    req.babelClient.getAnnotations(req.query.access_token, target, function(err, comments){
      if (err) {return handleError(res, err);} else {
        return res.json(200, comments);
      }
    });
  }, req.params.user_id);
};


  // DELETE api/clips/clip_id/users/:user_id
  // If user is author, delete clip and remove from all groups.
exports.destroyClip = function(req, res){
    //console.log("DESTROY CLIP");
    req.personaClient.validateToken(req, res, function () {
      User.findById(req.params.user_id, function(err, user){
        if (err) {return handleError(res, err);}
        if (!user) {return res.send(404);}

      Clip.findById(req.params.clip_id, function (err, clip) {
        if (err) {
          return handleError(res, err);
        }
        if (!clip) {
          return res.send(404);
        }
        if (clip.author !== req.params.user_id) {
          return res.send(401)
        }
        for (var i = 0; i < clip.groups.length; i++) {
          console.log("Deleting from group:" + JSON.stringify(clip.groups[i]));
          req.params.group_id = clip.groups[i];
          GroupManager.removeClipFromGroup(req, res, function (status) {
            if (status >= 400) {
              console.log("Error removing clip form group. Status: " + status)
            }
          });
        }
        //Set clip.archived to true
        clip.archived = true;
        clip.save(function (err) {
          if (err) {
            return handleError(res, err);
          }
          req.body.comment = "Deleted clip.";
          var details = {
            content_id: clip._id,
            content: clip.content,
            first_name: user.first_name,
            surname: user.surname,
            email: user.email,
            type: 'describing'
          };
          _createAnnotation(req, res, details,
            [req.params.user_id], 'describing');
        });
        });// End find clip by id
      });// End find user by id
    }, req.params.user_id);
  };

// POST api/clips/file-upload/:id
// Processes data from kahoots klipper, saves new clip to db.
exports.upload = function (req, res) {
   //console.log("Uploading new clip");
    // Authorize sender
    req.personaClient.validateToken(req, res, function () {
      User.findById(req.body.author, function(err, user) {
        if (err) {
          return handleError(res, err);
        }
        if (!user) {
          return res.send(404);
        }
        if (req.body.rect === undefined) {
          return res.send(400)
        }
        if (req.body.content === undefined) {
          return res.send(400)
        }
        if (req.body.author === undefined) {
          return res.send(400)
        }
        var rect = JSON.parse(req.body.rect);
        var data = (req.body.content).replace(/^data:image\/\w+;base64,/, "");
        var buf = new Buffer(data, 'base64');

        // write img to temp file
        fs.writeFile("temp.png", buf, function (err) {
          if (err) {
            return handleError(res, err);
          }
          //console.log("Temp png created");

          //crop img
          var args = ["temp.png", "-crop", rect.width + "x" + rect.height + "+" + rect.x + "+" + rect.y, "tempClipped.png"];
          im.convert(args, function (err) {
            if (err) {
              return handleError(res, err);
            }
            //console.log("Clipped");

            // Post image to depot
            var formData = {
              filename: "hi",
              contentType: 'image/png',
              file: fs.createReadStream("tempClipped.png")
            };
            var options = {
              url: 'https://staging-files.talis.com/files.json?access_token=' + req.query.access_token,
              formData: formData,
              headers: {accept: 'application/json'}
            }
            request.post(options, function (err, httpResponse, body) {
              if (err) {
                return handleError(res, err);
              }
              //console.log('Upload successful! Server responded with', JSON.parse(body).versions.original.uri);
              req.body.content = JSON.parse(body).versions.original.uri + "&access_token=";
              // Set archived to false
              req.body.archived = false;
              Clip.create(req.body, function (err, clip) {
                if (err) {
                  return handleError(res, err);
                }

                // create new clip in db.

                // Create a new annotation describing clip created.
                req.body.comment = "Created a new clip.";
                // TODO change this in index.js
                req.params.user_id = req.params.id;
                var details = {
                  content_id: clip._id,
                  content: clip.content,
                  first_name: user.first_name,
                  surname: user.surname,
                  email: user.email,
                  type: 'describing'
                };
                _createAnnotation(req, res, details,
                  [req.params.user_id], 'describing');
              }); // Finish creating clip in db.
            }); // Finish posting to depot
          }); // Finish cropping img.
        }); // Finish writing img to temp file.
      }); // Finish get user by id
    },req.params.id);

  };

// Error handler.
  function handleError(res, err) {
    return res.send(500, err);
  }

/**
 * Generates a GUID string.
 * @returns {String} The generated GUID.
 * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
 * @author Slavik Meltser (slavik@meltser.info).
 * @link http://slavik.meltser.info/?p=142
 */
function guid() {
  function _p8(s) {
    var p = (Math.random().toString(16)+"000000000").substr(2,8);
    return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
  }
  return _p8() + _p8(true) + _p8(true) + _p8();
}

