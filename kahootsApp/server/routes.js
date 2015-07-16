/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/users', require('./api/user'));
  app.use('/api/group_clips', require('./api/group_clip'));
  app.use('/api/group_users', require('./api/group_user'));
  app.use('/api/groups', require('./api/group'));
  //app.use('/api/envs', require('./api/env'));

  app.use('/api/clips', require('./api/clip'));
  app.use('/api/things', require('./api/thing'));


  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
