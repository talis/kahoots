'use strict';

var _ = require('lodash');
var Clip = require('./clip.model');
var Group = require('../group/group.model');
var GroupManager = require('../../components/shared/groupClip').GroupManager;
var User = require('../user/user.model');
var request = require('request');
var im = require('imagemagick');
var fs = require('fs');

// GET api/clips/:id
// Gets all clips for given user_id
exports.userClips = function(req, res){
  req.personaClient.validateToken(req, res, function () {
      Clip.find({'author': req.params.id}, function (err, clip) {
        if(err) { return handleError(res, err); }
        if(!clip) { return res.send(404); }
        return res.json(200, clip);
      });
  },req.params.id);
};

/*// GET api/clips/
// Gets all clips in db.
exports.index = function(req, res) {
  Clip.find(function ( err, clips) {
    if(err) { return handleError(res, err); }
    return res.json(200, clips);
  });
};*/

/*// GET api/clips/:id
// Get a single clip with clip_id
exports.show = function(req, res) {
  Clip.findById(req.params.id, function (err, clip) {
    if(err) { return handleError(res, err); }
    if(!clip) { return res.send(404); }
    return res.json(clip);
  });
};*/

// POST api/clips/
// For a given clip object, creates a new clip in the DB.
exports.create = function(req, res) {
  //console.log("create");
  Clip.create(req.body, function(err, clip) {
    if(err) { return handleError(res, err); }
    return res.json(201, clip);
  });
};

// POST api/clips/:clip_id/users/:user_id
// Updates an existing clip in the DB for a given json.
 /* exports.update = function (req, res) {
    req.personaClient.validateToken(req, res, function () {
      //console.dir(req);
      //if (req.body._id) {delete req.body._id;}

      Clip.findById(req.params.clip_id, function (err, clip) {
        if (err) {return handleError(res, err);}
        if (!clip) {return res.send(404);}
        clip.comments = req.body.comments;
        /!*
         * This is necessary to make Mongo save, because we are using
         * Schema.Types.Mixed for the 'clips' property and so Mongo won't be able
         * to detect modifications
         *!/
        clip.markModified('comments');
        clip.save(function (err) {
          if (err) {return handleError(res, err);}
          return res.json(200, clip);
        });
      });
    }, req.params.user_id);
  };*/

// POST api/clips/:clip_id/users/:user_id/:comment
// Add a new comment to the clip you are author of
exports.addComment = function (req, res) {
  console.log("add comment");
  req.personaClient.validateToken(req, res, function () {
    Clip.findById(req.params.clip_id, function(err, clip){
      if (err) {return handleError(res, err);}
      if (!clip) {return res.send(404);}

      User.findById(req.params.user_id, function(err, user) {
        if (err) {return handleError(res, err);}
        if (!user) {return res.send(404);}

        // If user is author can comment.
        if( clip.author !== user._id){return res.send(401,"not author of clip")}
        var annotationData = {
          hasBody: {
            format: 'text/plain',
            type: 'Text',
            chars: req.body.comment ? req.body.comment : '',
            details: {
              first_name: user.first_name,
              surname: user.surname,
              email: user.email
            }
          },
          hasTarget: {uri:[req.params.clip_id]},
          annotatedBy: req.params.user_id,
          annotatedAt: Date.now(),
          motivatedBy: 'comment'
        };
        req.babelClient.createAnnotation(req.query.access_token, annotationData, function (err, results) {
          //console.log("BABEL RESPONSE");
          //console.log(results);
          if (err) {
            console.log(err);
            return handleError(res, err);
          } else {
            return res.json(200, results);
          }
        }); // end createAnnotation
      }); // end find user by id
    }); // end find clip by id
  }, req.params.user_id);
};
// GET api/clips/:clip_id/users/:user_id/comments
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
// DELETE api/clips/:id
// Deletes a clip from the DB.
/*exports.destroy = function (req, res) {
    Clip.findById(req.params.id, function (err, clip) {
      if (err) {return handleError(res, err);}
      if (!clip) {return res.send(404);}
      clip.remove(function (err) {
        if (err) {return handleError(res, err);}
        return res.send(204);
      });
    });
  };*/

  // DELETE api/clips/clip_id/users/:user_id
  // If user is author, delete clip and remove from all groups.
exports.destroyClip = function(req, res){
    //console.log("DESTROY CLIP");
    req.personaClient.validateToken(req, res, function () {
      Clip.findById(req.params.clip_id, function (err, clip) {
        if (err) {return handleError(res, err);}
        if (!clip) {return res.send(404);}
        if(clip.author!==req.params.user_id){return res.send(401)}
        for(var i=0; i<clip.groups.length; i++){
          GroupManager.removeClipFromGroup(clip.groups[i], clip._id);
        }
        clip.remove(function (err) {
          if (err) {return handleError(res, err);}
          return res.send(204);
        });
      });// End find clip by id
    }, req.params.user_id);
  };
// POST api/clips/file-upload/:id
// Processes data from kahoots klipper, saves new clip to db.
exports.upload = function (req, res) {
   //console.log("Uploading new clip");
    // Authorize sender
    req.personaClient.validateToken(req, res, function () {
      if(req.body.rect === undefined){return res.send(400)}
      if(req.body.content === undefined){return res.send(400)}
      if(req.body.author === undefined){return res.send(400)}


      var rect = JSON.parse(req.body.rect);
      var data = (req.body.content).replace(/^data:image\/\w+;base64,/, "");
      var buf = new Buffer(data, 'base64');

      // write img to temp file
      fs.writeFile("temp.png", buf , function(err) {
        if(err) {return handleError(res, err);}
        //console.log("Temp png created");

        //crop img
        var args = ["temp.png", "-crop", rect.width+"x"+rect.height+"+"+rect.x+"+"+rect.y, "tempClipped.png"];
        im.convert(args, function(err){
          if(err) {return handleError(res, err);}
          //console.log("Clipped");

          // Post image to depot
          var formData = {
            filename: "hi",
            contentType: 'image/png',
            file: fs.createReadStream("tempClipped.png")
          };
          var options = {
            url:'https://staging-files.talis.com/files.json?access_token='+req.query.access_token,
            formData:formData,
            headers:{accept:'application/json'}
          }
          request.post(options, function(err, httpResponse, body) {
            if (err){return handleError(res, err);}
            //console.log('Upload successful! Server responded with', JSON.parse(body).versions.original.uri);
            req.body.content = JSON.parse(body).versions.original.uri + "&access_token=";

            // create new clip in db.
            exports.create(req, res, function () {
              if (err) {
                return handleError(res, err);
              }
              return res.send(201);
            }); // Finish creating clip in db.
          }); // Finish posting to depot
        }); // Finish cropping img.
      }); // Finish writing img to temp file.

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
// Testing get from depot

/*request.get({url:'https://staging-files.talis.com/files/55bb86514d3825da07000000.json?access_token='+req.query.access_token,
 headers:{accept:'application/json'}}, function(err, httpResponse, body){
 if(err){
 return console.error('Get depot file error',err);
 }
 console.log('Download: Server responded with:'+body);
 });*/

// Finished testing DEPOT
