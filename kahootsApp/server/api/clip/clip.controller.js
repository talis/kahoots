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


// Get list of clips
exports.index = function(req, res) {
  Clip.find(function (err, clips) {
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
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Clip.findById(req.params.id, function (err, clip) {
    if (err) {
      return handleError(res, err);
    }
    if (!clip) {
      return res.send(404);
    }
    var updated = _.merge(clip, req.body);

    // This is necessary to make Mongo save, because we are using
    // Schema.Types.Mixed for the 'clips' property and so Mongo won't be able
    // to detect modifications
    updated.markModified('comments');


    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, clip);
    });
  });
}
// Get list of clips
  exports.index = function (req, res) {
    Clip.find(function (err, clips) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, clips);
    });
  };

// Get a single clip
  exports.show = function (req, res) {
    Clip.findById(req.params.id, function (err, clip) {
      if (err) {
        return handleError(res, err);
      }
      if (!clip) {
        return res.send(404);
      }
      return res.json(clip);
    });
  };

// Creates a new clip in the DB.
  exports.create = function (req, res, callback) {
    console.log("create");
    Clip.create(req.body, function (err, clip) {
      console.log("creating this ->" + clip);
      if (err) {
        //return handleError(res, err);
        callback(err, null);
      }
      //return res.json(201, clip);
      console.log("Hello");
      callback(null, clip);
    });
  };

// Updates an existing clip in the DB.
  exports.update = function (req, res) {
    if (req.body._id) {
      delete req.body._id;
    }
    Clip.findById(req.params.id, function (err, clip) {
      if (err) {
        return handleError(res, err);
      }
      if (!clip) {
        return res.send(404);
      }
      var updated = _.merge(clip, req.body);

      // This is necessary to make Mongo save, because we are using
      // Schema.Types.Mixed for the 'clips' property and so Mongo won't be able
      // to detect modifications
      updated.markModified('comments');


      updated.save(function (err) {
        if (err) {
          return handleError(res, err);
        }
        return res.json(200, clip);
      });
    });
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
    //console.log(req.body.rect);
    //console.log(JSON.stringify(req.files) + "files"); // form files
    var img = req.body.content;
    var rect = JSON.parse(req.body.rect);
    //crop img
    var args = [img, "-crop", rect.width+"x"+rect.height+"+"+rect.x+"+"+Math.abs(rect.y), ""]


    var data = img.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');
    var fs = require('fs');
    var fileguid = guid();
    //var filename = "./client/assets/uploads/"+fileguid+".png";
    var filename = fileguid+".png";
    fs.writeFile("temp.png",buf , function(err) {
      if(err) {
        return console.log(err);
      }
      console.log("The file was saved!");
      req.body.content = "assets/uploads/"+filename;
      exports.create(req,res, function(){});
      var args = ["temp.png", "-crop", rect.width+"x"+rect.height+"+"+rect.x+"+"+rect.y, "./client/assets/uploads/"+filename];
      console.log(args[2]);
      im.convert(args, function(err){
        if(err){console.log("error cropping")}
        console.log("cropped!");
      });
    });

  }

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
