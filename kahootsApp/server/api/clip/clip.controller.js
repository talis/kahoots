'use strict';

var _ = require('lodash');
var Clip = require('./clip.model');
var Group = require('../group/group.model');
var im = require('imagemagick');
//var socketio = require('socketio');

/*socketio.on('connection', function(socket){
  socket.on('comment', function(msg){
    console.log("Clip id: " + msg.target);
    console.log("Comment: " + msg.chars);
  })
});*/

// GET api/clips/mine/:id
// Gets all clips for given user_id
exports.mine = function(req, res){
  //console.log("userguid:" + req.params.id);
  req.personaClient.validateToken(req, res, function () {
    Clip.find()
      .where('author')
      .in([req.params.id])
      .exec(function (err, clip) {
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
    var user_id = req.params.user_id;
    var clip_id = req.params.clip_id;
    console.log(req.params);
    req.personaClient.validateToken(req, res, function () {
      console.log("UPDATE "+ JSON.stringify(req.body));
      if (req.body._id) {
        delete req.body._id;
      }
      Clip.findById(clip_id, function (err, clip) {
        if (err) {
          console.log("error in find by id");
          return handleError(res, err);
        }
        if (!clip) {
          console.log("no clip found");
          return res.send(404);
        }
        //var updated = _.merge(clip, req.body.clip);
        clip.comments = req.body.comments;
        var updated = clip;
        // This is necessary to make Mongo save, because we are using
        // Schema.Types.Mixed for the 'clips' property and so Mongo won't be able
        // to detect modifications
        updated.markModified('comments');
        updated.save(function (err) {
          if (err) {
            return handleError(res, err);
          }
          //console.log(clip);
          return res.json(200, clip);
        });
      });
    }, user_id);
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
    var response = res;
    console.log("upload received msg");
    //console.log("outerTs: " + req.body.outerTs);
    //console.log("innerTs: " + req.body.innerTs);
    //console.log(req.body);
    //console.log(req.body.rect);
    //console.log(JSON.stringify(req.files) + "files"); // form files
    req.personaClient.validateToken(req, res, function () {
      var img = req.body.content;
      var rect = JSON.parse(req.body.rect);
      //var source = req.body.source;

      var data = img.replace(/^data:image\/\w+;base64,/, "");
      var buf = new Buffer(data, 'base64');
      var fs = require('fs');
      var fileguid = guid();
      //var filename = "./client/assets/uploads/"+fileguid+".png";
      var filename = fileguid+".png";
     console.log("About to write to temp file");
      fs.writeFile("temp.png", buf , function(err) {
        if(err) {
          console.log("error writing file " + err);
          return handleError(res, err);
        }
        console.log("The file was saved!");
        req.body.content = "assets/uploads/"+filename;
        exports.create(req,res, function(){
          if(err) {
            console.log("Error in create " + err);
            return handleError(res, err);}
          //console.dir(res);
        });
        //crop img
        var args = ["temp.png", "-crop", rect.width+"x"+rect.height+"+"+rect.x+"+"+rect.y, "./client/assets/uploads/"+filename];
        console.log("About to convert");
        im.convert(args, function(err){
          if(err){
            console.log("Error in convert im" + err);
            return handleError(res, err);
          }
          console.log("cropped!");

        });
        console.log("200 wrote to file");
      });

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
