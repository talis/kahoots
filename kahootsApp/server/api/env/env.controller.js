'use strict';

var config = require('../../config/environment');

exports.sendConfig = function(req, res) {
  res.header('Content-Type', 'text/javascript');

  var personaEndpoint = config.oauth.scheme + '://' + config.oauth.host + ':' + config.oauth.port;
  var appEndpoint  = config.kahootsApp.endpoint;

  var loggingServiceConfig = {
    LOGGING_TYPE: 'remote',
    REMOTE_LOGGING_ENDPOINT: config.kahootsApp.endpoint + '/loggers/clientlogger',
    LOGGING_LEVEL: 'debug'
  };

  var contents = '' +
    '"use strict";\n\n' +
    'angular.module("talis.environment", [], function($provide) {})\n' +
    '  .constant("PERSONA_ENDPOINT", "' + personaEndpoint + '")\n' +
    '  .constant("LOGGING_CONFIG",'+JSON.stringify(loggingServiceConfig)+')\n' +
    '  .constant("CUSTOMER_HEALTH_DASHBOARD_ENDPOINT", "' + appEndpoint + '");\n';

  res.send(200, contents);
};
