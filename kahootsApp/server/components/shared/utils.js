var config = require('../../config/environment');
var http = require(config.oauth.scheme);
//var querystring = require('querystring');

/*var _getOAuthToken = function getOAuthToken(callback) {
  var post_data = querystring.stringify({
    'grant_type' : 'client_credentials'
  });

  var options = {
    host: config.oauth.host,
    path: config.oauth.route,
    method: "POST",
    auth: config.oauth.client+":"+config.oauth.secret,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': post_data.length
    }
  };

  var req = http.request(options, function(response){
    var str = "";
    response.on('data', function(chunk){
      str += chunk;
    });
    response.on('end', function(){
      //console.log(str);
      var data = JSON.parse(str);
      if (data.error) {
        callback(data.error,null);
      } else if(data.access_token){
        callback(null,data.access_token);
      } else {
        callback("Could not get access token",null);
      }
    });
  });
  //console.log("Posting data "+post_data);
  req.write(post_data);
  //console.log("Sending");
  req.end();
};*/


var _createAnnotation = function(req, res, details, uri, hasTarget, motivatedBy){
  //console.log("_createAnnotation");
  var annotationData = {
    hasBody: {
      format: 'text/plain',
      type: 'Text',
      chars: req.body.comment,
      details: details
    },
    hasTarget: {uri:uri},
    annotatedBy: req.params.user_id,
    annotatedAt: Date.now()
  };
  req.babelClient.createAnnotation( req.query.access_token, annotationData, function (err, results) {
    //console.log("BABEL RESPONSE");
    //console.log(results);
    if (err) {
      console.log(err);
      return res.send(400, err);
    } else {
      //console.log("NEW ANNOTATION\n" + results);
      return res.send(200, results);
    }
  }); // end createAnnotation
};



//exports._getOAuthToken = _getOAuthToken;
exports._createAnnotation = _createAnnotation;
