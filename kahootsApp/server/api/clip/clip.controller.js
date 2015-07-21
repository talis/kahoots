'use strict';

var _ = require('lodash');
var Clip = require('./clip.model');
var Group = require('../group/group.model');
var User = require('../user/user.model');

var im = require('imagemagick');
var fs = require('fs');

// GET api/clips/mine/:id
// Gets all clips for given user_id
exports.mine = function(req, res){
  req.personaClient.validateToken(req, res, function () {
    Clip.find({'author': req.params.id}, function (err, clip) {
        if(err) { return handleError(res, err); }
        if(!clip) { return res.send(404); }
        return res.json(200, clip);
      });
  },req.params.id);

};


// GET api/clips/groups/:group_id/users/:user_id
// Get all clips in group
/*exports.group = function(req, res){
  //req.personaClient.validateToken(req, res, function () {
    // Get group
    Group.findById(req.params.group_id, function (err, group) {
      if(err) { return handleError(res, err); }
      if(!clip) { return res.send(404); }
      // Check user in group
      if(group.users.indexOf(req.params.user_id)===-1){return res.send(404);}
      // Get all clips in group
      Clips.find()
        .where('_id')
        .in(group.clips)
        .exec(function (err, clip) {
          if(err) { return handleError(res, err); }
          if(!clip) { return res.send(404); }
          return res.json(200, clip);
        });
    });
  //}, req.params.user_id);
};*/

// GET api/clips/
// Gets all clips in db.
exports.index = function(req, res) {
  Clip.find(function ( err, clips) {
    if(err) { return handleError(res, err); }
    return res.json(200, clips);
  });
};

// GET api/clips/:id
// Get a single clip with clip_id
exports.show = function(req, res) {
  Clip.findById(req.params.id, function (err, clip) {
    if(err) { return handleError(res, err); }
    if(!clip) { return res.send(404); }
    return res.json(clip);
  });
};

// POST api/clips/
// For a given clip object, creates a new clip in the DB.
exports.create = function(req, res) {
  console.log("create");
  Clip.create(req.body, function(err, clip) {
    if(err) { return handleError(res, err); }
    return res.json(201, clip);
  });
};

// PUT api/clips/:clip_id/users/:user_id
// Updates an existing clip in the DB for a given json.
  exports.update = function (req, res) {
    req.personaClient.validateToken(req, res, function () {
      console.dir(req);
      //if (req.body._id) {delete req.body._id;}

      Clip.findById(req.params.clip_id, function (err, clip) {
        if (err) {return handleError(res, err);}
        if (!clip) {return res.send(404);}
        clip.comments = req.body.comments;
        /*
         * This is necessary to make Mongo save, because we are using
         * Schema.Types.Mixed for the 'clips' property and so Mongo won't be able
         * to detect modifications
         */
        clip.markModified('comments');
        clip.save(function (err) {
          if (err) {return handleError(res, err);}
          return res.json(200, clip);
        });
      });
    }, req.params.user_id);
  };



// POST api/clips/:clip_id/users/:user_id/groups/:group_id/comment
// Add a new comment to the clip
exports.addComment = function (req, res) {
  req.personaClient.validateToken(req, res, function () {
    Clip.findById(req.params.clip_id, function(err, clip){
      if (err) {return handleError(res, err);}
      if (!clip) {return res.send(404);}

      User.findById(req.params.user_id, function(err, user) {
        if (err) {return handleError(res, err);}
        if (!user) {return res.send(404);}

        //TODO: This is for testing purposes only.
        // If user is author can comment.
        if(req.params.group_id === "none" && clip.author === user._id){
          clip.comments.push(user.first_name+ " : " + req.params.comment);
          clip.markModified('comments');
          clip.save(function (err) {
            if (err) {return handleError(res, err);}
            return res.json(200);
          });
        }
        // If user & clip in same group can comment
        if(clip.groups.indexOf(req.params.group_id) !== -1 &&
          user.group.indexOf(req.params.group_id) !== -1){
          clip.comments.push(req.params.comment);
          clip.markModified('comments');
          clip.save(function (err) {
            if (err) {return handleError(res, err);}
            return res.json(200);
          });
        }
      });
    });
  }, req.params.user_id);
};

// DELETE api/clips/:id
// Deletes a clip from the DB.
  exports.destroy = function (req, res) {
    Clip.findById(req.params.id, function (err, clip) {
      if (err) {
        return handleError(res, err);
      }
      if (!clip) {
        return res.send(404);
      }
      clip.remove(function (err) {
        if (err) {
          return handleError(res, err);
        }
        return res.send(204);
      });
    });
  };

// POST api/clips/file-upload/:id
// Processes data from kahoots klipper, saves new clip to db.
  exports.upload = function (req, res) {
    console.log("Uploading new clip");
    // Authorize sender
    req.personaClient.validateToken(req, res, function () {
      console.log("Authorized user");

      var rect = JSON.parse(req.body.rect);
      var data = (req.body.content).replace(/^data:image\/\w+;base64,/, "");
      var buf = new Buffer(data, 'base64');

      var filename = guid() +".png";

      // write img to temp file
      fs.writeFile("temp.png", buf , function(err) {
        if(err) {return handleError(res, err);}
        console.log("Temp png created");

        //crop img
        var args = ["temp.png", "-crop", rect.width+"x"+rect.height+"+"+rect.x+"+"+rect.y, "./client/assets/uploads/"+filename];
        im.convert(args, function(err){
          console.log("Clipped");

          if(err){
            console.log("error here");
            return handleError(res, err);}
          // set content to a file that the img will be saved to.
          req.body.content = "assets/uploads/"+filename;
          console.log("here");
          // create new clip in db.
          exports.create(req,res, function(){
            console.log("Created new clip");
            if(err) {return handleError(res, err);}
          }); // Finish creating clip in db.
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
