/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */


'use strict';

var _ = require('lodash');
var Clip = require('./clip.model');
var im = require('imagemagick');

//Get a list of my clips
exports.mine = function(req, res){
  //console.log("userguid:" + req.params.id);
  //console.log(req.headers);
  req.personaClient.validateToken(req, res, function () {
    Clip.find()
      .where('author')
      .in([req.params.id])
      .exec(function (err, clip) {
        if(err) { return handleError(res, err); }
        if(!clip) { return res.send(404); }
        return res.json(clip);
      });
  },req.params.id);

};

// Get list of clips
exports.index = function(req, res) {
  Clip.find(function ( err, clips) {
    if(err) { return handleError(res, err); }
    return res.json(200, clips);
  });
};

// Get a single clip
exports.show = function(req, res) {
  Clip.findById(req.params.id, function (err, clip) {
    if(err) { return handleError(res, err); }
    if(!clip) { return res.send(404); }
    return res.json(clip);
  });
};


// Creates a new clip in the DB.
exports.create = function(req, res) {
  console.log("create");
  Clip.create(req.body, function(err, clip) {
    if(err) { return handleError(res, err); }
    return res.json(201, clip);
  });
};


// Updates an existing clip in the DB.
  exports.update = function (req, res) {

    //console.log("UPDATE "+ JSON.stringify(req.body));
    req.personaClient.validateToken(req, res, function () {
      if (req.body._id) {
        delete req.body._id;
      }

      Clip.findById(req.params.id, function (err, clip) {
        if (err) {
          console.log("error in find by id");
          return handleError(res, err);
        }
        if (!clip) {
          console.log("no clip found");
          return res.send(404);
        }

        //var updated = _.merge(clip, req.body.clip);
        clip.comments = req.body.clip.comments;
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
    }, req.query.user_id);
  };

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
