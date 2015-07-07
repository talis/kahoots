'use strict';

var _ = require('lodash');


var config = require('../../config/environment');

exports.sendConfig = function(req, res) {
  res.header('Content-Type', 'text/javascript');

  var personaEndpoint = config.oauth.scheme + '://' + config.oauth.host + ':' + config.oauth.port;
  var appEndpoint  = config.kahootsApp.endpoint;


  var contents = '' +
    '"use strict";\n\n' +
    'angular.module("talis.environment", [], function($provide) {})\n' +
    '  .constant("PERSONA_ENDPOINT", "' + personaEndpoint + '")\n' +
    '  .constant("KAHOOTS_APP_ENDPOINT", "' + appEndpoint + '");\n';

  res.send(200, contents);
};
