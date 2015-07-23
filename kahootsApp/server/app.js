/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
var redis = require('redis');
var babel = require('babel-node-client');


// Create a new babel client
var babelClient = babel.createClient({
  babel_host: config.babel.host,
  babel_port: config.babel.port,
  enable_debug: true
});

// Create new redis client
var client = redis.createClient();
client.on('connect', function() {
  //AppLogger.info('App: redis connected');
  console.log('App: redis connected');
});

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();

// Configure the Persona client

  var persona = require('persona_client');
  var personaClient = persona.createClient({
    persona_host: config.oauth.host,
    persona_port: config.oauth.port,
    persona_scheme: config.oauth.scheme,
    persona_oauth_route: config.oauth.route,
    redis_host:"localhost",
    redis_port:6379,
    redis_db:0,
    enable_debug: false
    //logger: AppLogger
  });



// Add PersonaClient to the req before passing it to controllers
// If using express, use this middleware (https://github.com/talis/persona-node-client/)
app.use(function (req, res, next) {
  req.redisClient = client;
  req.personaClient = personaClient;
  req.babelClient = babelClient;
  next();
});


var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: (config.env === 'production') ? false : true,
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);


// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});




// Expose app
exports = module.exports = app;
