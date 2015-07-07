/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');




// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();

//configure the persona client (https://github.com/talis/persona-node-client/)
var persona = require('persona_client');
try {
  var personaClient = persona.createClient({
    persona_host: "localhost",
    persona_port: 443,
    persona_scheme: "https",
    persona_oauth_route: "/oauth/tokens",
    redis_host: "localhost",
    redis_port: 6379,
    redis_db: 0,
    enable_debug: true,
    //logger: AppLogger
  });
} catch (err){
  console.log(err, "Error creating persona in server/app.js ");
}

// Add PersonaClient to the req before passing it to controllers
// If using express, use this middleware (https://github.com/talis/persona-node-client/)
app.use(function (req, res, next) {
  req.personaClient = personaClient;
  next();
});


var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
